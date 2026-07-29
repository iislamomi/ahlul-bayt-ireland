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
/* The rules live here rather than in a shared module on purpose: a relative
 * import reaching outside the function's own directory is the usual reason an
 * Edge Function boots to a 502, and a leaderboard that cannot accept a score is
 * worse than a little duplication.
 *
 * The browser holds the matching copy in app.js (SCORING, computeScore,
 * validateDisplayName, sanitiseName, quizLevel). Change one, change the other,
 * or a participant sees one score and the board shows another. test/unit.js
 * covers the browser copy; the two are compared by eye.
 */

/* score = 100 per correct + 25 for finishing + up to 50 shared time bonus.
 * The time bonus is capped below the value of one correct answer, so ten
 * correct scores at least 1000 and nine correct at most 975 \u2014 answering
 * carefully can never lose to answering quickly. */
const SCORING = {
  BASE_PER_CORRECT: 100,
  COMPLETION_BONUS: 25,
  MAX_TIME_BONUS: 50,
  SECONDS_PER_QUESTION: 10,
};

function computeScore(correct: number, total: number, durationMs: number, completed: boolean) {
  const parMs = total * SCORING.SECONDS_PER_QUESTION * 1000;
  const used = Math.max(0, Math.min(durationMs, parMs));
  const timeBonus = parMs > 0 ? Math.round(SCORING.MAX_TIME_BONUS * (parMs - used) / parMs) : 0;
  return SCORING.BASE_PER_CORRECT * correct + (completed ? SCORING.COMPLETION_BONUS : 0) + timeBonus;
}

/* A human reads the question before answering. Below this the attempt was
 * scripted; above it the client sat on the result longer than the timer allows. */
const MIN_MS_PER_QUESTION = 900;
const MAX_MS_PER_QUESTION = SCORING.SECONDS_PER_QUESTION * 1000 + 5000;

const NAME_MIN = 2;
const NAME_MAX = 20;
// C0/C1 controls, bidi overrides, zero-width joiners and the BOM: invisible, and
// on a public board only ever used to make one name look like another.
const CONTROL_AND_INVISIBLE = /[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g;
const ALLOWED = /[^\p{L}\p{M}\p{N} '\-._]/gu;
const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const URLISH = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|ie|co|uk|io|me|xyz|info|app)\b)/i;
const PHONE = /(?:\+?\d[\s\-().]*){7,}/;

/* Configurable: extend rather than rewrite, lowercase entries. Matched with
 * separators stripped, so spaced-out spellings are caught too. */
const BLOCKED_NAME_WORDS = [
  'fuck', 'shit', 'cunt', 'bitch', 'bastard', 'wanker', 'slut', 'whore',
  'nigger', 'nigga', 'faggot', 'retard', 'rape', 'nazi', 'hitler',
  'admin', 'administrator', 'moderator', 'ahlulbayt', 'official',
];

function sanitiseName(raw: unknown): string {
  return String(raw ?? '')
    .normalize('NFC')
    .replace(CONTROL_AND_INVISIBLE, '')
    .replace(ALLOWED, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, NAME_MAX);
}

function validateDisplayName(raw: unknown) {
  const original = String(raw ?? '');
  if (!original.trim()) return { ok: false, reason: 'Please enter a display name.' };
  if (EMAIL.test(original)) return { ok: false, reason: 'Please do not use an email address.' };
  if (URLISH.test(original)) return { ok: false, reason: 'Please do not use a web address.' };
  if (PHONE.test(original)) return { ok: false, reason: 'Please do not use a phone number.' };
  const name = sanitiseName(original);
  if (name.length < NAME_MIN) return { ok: false, reason: `Use at least ${NAME_MIN} characters.` };
  if (!/[\p{L}\p{N}]/u.test(name)) return { ok: false, reason: 'Use letters or numbers.' };
  const flat = name.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  if (BLOCKED_NAME_WORDS.some(w => flat.includes(w))) {
    return { ok: false, reason: 'Please choose a different name.' };
  }
  return { ok: true, name };
}

const DIFFICULTIES = ['easy', 'medium', 'hard'];
/* Quizzes saved before difficulty was a first-class field carried the older
 * labels. They keep working and mean what they always meant. */
const LEGACY_DIFFICULTY: Record<string, string> = {
  beginner: 'easy',
  intermediate: 'medium',
  advanced: 'hard',
};
function normaliseDifficulty(v: unknown): string {
  const k = String(v ?? '').toLowerCase().trim();
  if (DIFFICULTIES.includes(k)) return k;
  return LEGACY_DIFFICULTY[k] ?? 'easy';
}

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
