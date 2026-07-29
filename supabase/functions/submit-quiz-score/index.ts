// @ts-nocheck
/* submit-quiz-score
 *
 * The browser is not trusted with a score. It sends which quiz, which questions
 * it was asked and what it answered; this recomputes the result against the
 * question bank in the `content` table and stores what it worked out itself.
 * The client's own figure is kept alongside only so a mismatch can be noticed.
 *
 * Deploy:  supabase functions deploy submit-quiz-score --no-verify-jwt
 * Env:     SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ABI_INSTALL_PEPPER
 */
import {
  SCORING, computeScore, MIN_MS_PER_QUESTION, MAX_MS_PER_QUESTION,
  validateDisplayName, DIFFICULTIES, normaliseDifficulty,
} from '../_shared/quiz.ts';

const SB_URL = Deno.env.get('SUPABASE_URL')!;
const SB_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
/* Without a pepper the install hash is a plain digest of a UUID, which is fine,
 * but the pepper means a leaked table cannot be matched against a device even by
 * someone who already knows the raw id. */
const PEPPER = Deno.env.get('ABI_INSTALL_PEPPER') ?? '';

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};
const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

const RATE = { WINDOW_MS: 60_000, MAX_IN_WINDOW: 5, DAY_MAX: 60 };

async function sha256Hex(s: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

const rest = (path: string, init: RequestInit = {}) =>
  fetch(`${SB_URL}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: SB_KEY,
      Authorization: `Bearer ${SB_KEY}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

/* The question bank the app itself reads, so the server marks the same paper the
 * participant sat. */
async function loadQuestions(quizId: string) {
  const key = quizId === 'kids' ? 'kidsQuizzes' : quizId;
  const r = await rest(`content?select=value&key=eq.${encodeURIComponent(key)}&limit=1`);
  if (!r.ok) return null;
  const rows = await r.json().catch(() => []);
  const v = Array.isArray(rows) && rows[0] ? rows[0].value : null;
  return Array.isArray(v) ? v : null;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405);

  const body = await req.json().catch(() => null);
  if (!body || typeof body !== 'object') return json({ error: 'bad_request' }, 400);

  const attemptId = String(body.attemptId ?? '').slice(0, 64);
  const quizId = String(body.quizId ?? '').slice(0, 64);
  const installId = String(body.installId ?? '').slice(0, 100);
  const difficulty = normaliseDifficulty(body.difficulty);
  const durationMs = Number(body.durationMs);
  const answers = Array.isArray(body.answers) ? body.answers.slice(0, 100) : null;

  if (!/^[A-Za-z0-9_-]{8,64}$/.test(attemptId)) return json({ error: 'bad_attempt_id' }, 400);
  if (!quizId) return json({ error: 'bad_quiz' }, 400);
  if (!installId) return json({ error: 'bad_install' }, 400);
  if (!DIFFICULTIES.includes(difficulty as any)) return json({ error: 'bad_difficulty' }, 400);
  if (!answers || !answers.length) return json({ error: 'no_answers' }, 400);
  if (!Number.isFinite(durationMs) || durationMs < 0) return json({ error: 'bad_duration' }, 400);

  const nameCheck = validateDisplayName(body.displayName);
  if (!nameCheck.ok) return json({ error: 'bad_name', message: nameCheck.reason }, 400);
  const displayName = nameCheck.name;

  const installHash = await sha256Hex(installId + '|' + PEPPER);

  // ── idempotency: the same attempt arriving twice is not an error ──────────
  const existing = await rest(
    `quiz_scores?select=id,score,correct,total,duration_ms,best&attempt_id=eq.${encodeURIComponent(attemptId)}&limit=1`,
  );
  if (existing.ok) {
    const rows = await existing.json().catch(() => []);
    if (Array.isArray(rows) && rows[0]) {
      return json({ ok: true, duplicate: true, ...rows[0] });
    }
  }

  // ── rate limiting, per installation ──────────────────────────────────────
  const since = new Date(Date.now() - RATE.WINDOW_MS).toISOString();
  const dayAgo = new Date(Date.now() - 86_400_000).toISOString();
  const recent = await rest(
    `quiz_scores?select=id&install_hash=eq.${installHash}&submitted_at=gte.${since}`,
  );
  if (recent.ok) {
    const rows = await recent.json().catch(() => []);
    if (Array.isArray(rows) && rows.length >= RATE.MAX_IN_WINDOW) {
      return json({ error: 'rate_limited', retryAfterMs: RATE.WINDOW_MS }, 429);
    }
  }
  const daily = await rest(
    `quiz_scores?select=id&install_hash=eq.${installHash}&submitted_at=gte.${dayAgo}`,
  );
  if (daily.ok) {
    const rows = await daily.json().catch(() => []);
    if (Array.isArray(rows) && rows.length >= RATE.DAY_MAX) {
      return json({ error: 'rate_limited', retryAfterMs: 3_600_000 }, 429);
    }
  }

  // ── mark the paper ───────────────────────────────────────────────────────
  const bank = await loadQuestions(quizId);
  if (!bank) return json({ error: 'quiz_unavailable' }, 503);

  const pool = bank.filter(q => normaliseDifficulty(q?.level) === difficulty);
  if (!pool.length) return json({ error: 'bad_difficulty' }, 400);

  let correct = 0;
  for (const a of answers) {
    const qText = String(a?.q ?? '');
    const picked = Number(a?.p);
    const q = pool.find(x => String(x?.question ?? '') === qText);
    // a question that is no longer in the bank cannot be marked, so it cannot
    // score — an attempt built from questions the server does not have is void
    if (!q) return json({ error: 'unknown_question' }, 400);
    if (Number.isInteger(picked) && picked === Number(q.answer)) correct++;
  }

  const total = answers.length;
  if (correct > total) return json({ error: 'impossible_result' }, 400);

  // ── plausibility ─────────────────────────────────────────────────────────
  if (durationMs < total * MIN_MS_PER_QUESTION) return json({ error: 'too_fast' }, 400);
  if (durationMs > total * MAX_MS_PER_QUESTION) return json({ error: 'too_slow' }, 400);

  const completed = body.completed !== false;
  const score = computeScore(correct, total, durationMs, completed);

  // ── keep only this installation's best row flagged ───────────────────────
  const prevBest = await rest(
    `quiz_scores?select=id,score,correct,duration_ms,submitted_at` +
      `&install_hash=eq.${installHash}&quiz_id=eq.${encodeURIComponent(quizId)}` +
      `&difficulty=eq.${difficulty}&best=is.true&limit=1`,
  );
  let previous: any = null;
  if (prevBest.ok) {
    const rows = await prevBest.json().catch(() => []);
    previous = Array.isArray(rows) ? rows[0] ?? null : null;
  }
  // same order the board uses, so "best" and "rank 1" never disagree
  const beats = !previous ||
    score > previous.score ||
    (score === previous.score && correct > previous.correct) ||
    (score === previous.score && correct === previous.correct && durationMs < previous.duration_ms);

  if (beats && previous) {
    await rest(`quiz_scores?id=eq.${previous.id}`, {
      method: 'PATCH',
      headers: { Prefer: 'return=minimal' },
      body: JSON.stringify({ best: false }),
    });
  }

  const insert = await rest('quiz_scores', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify({
      attempt_id: attemptId,
      quiz_id: quizId,
      difficulty,
      display_name: displayName,
      score,
      correct,
      total,
      duration_ms: Math.round(durationMs),
      install_hash: installHash,
      completed,
      best: beats,
      client_score: Number.isFinite(Number(body.clientScore)) ? Number(body.clientScore) : null,
    }),
  });

  if (!insert.ok) {
    const text = await insert.text().catch(() => '');
    // a racing duplicate lost the unique index, which is the correct outcome
    if (text.includes('quiz_scores_attempt_id_key')) return json({ ok: true, duplicate: true });
    return json({ error: 'store_failed' }, 500);
  }
  const [row] = await insert.json().catch(() => [null]);

  return json({
    ok: true,
    id: row?.id ?? null,
    score,
    correct,
    total,
    durationMs: Math.round(durationMs),
    best: beats,
    scoring: SCORING,
  });
});
