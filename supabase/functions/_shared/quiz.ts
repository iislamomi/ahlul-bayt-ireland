// @ts-nocheck
/* Rules shared between the browser and the server.
 *
 * The browser copy lives in app.js (SCORING, validateDisplayName, sanitiseName).
 * They must agree, or a participant sees one score and the board shows another.
 * When you change one, change the other — there is no build step to share them.
 */

/* ── SCORING ──
 * score = BASE_PER_CORRECT × correct
 *       + COMPLETION_BONUS   (only when every question was reached)
 *       + timeBonus          (0 … MAX_TIME_BONUS, over the whole attempt)
 *
 * The time bonus is capped below the value of a single correct answer on
 * purpose. Someone who thinks carefully and gets one more question right can
 * never be overtaken by someone who guessed faster — 10 correct scores at least
 * 1000, 9 correct scores at most 975. Speed only ever separates equals.
 */
export const SCORING = {
  BASE_PER_CORRECT: 100,
  COMPLETION_BONUS: 25,
  MAX_TIME_BONUS: 50,
  SECONDS_PER_QUESTION: 10, // the on-screen timer; also the "par" time
};

export function computeScore(correct: number, total: number, durationMs: number, completed: boolean) {
  const parMs = total * SCORING.SECONDS_PER_QUESTION * 1000;
  const used = Math.max(0, Math.min(durationMs, parMs));
  const timeBonus = parMs > 0 ? Math.round(SCORING.MAX_TIME_BONUS * (parMs - used) / parMs) : 0;
  return SCORING.BASE_PER_CORRECT * correct + (completed ? SCORING.COMPLETION_BONUS : 0) + timeBonus;
}

/* ── PLAUSIBILITY ──
 * A human reads the question before answering. Below this, the attempt was
 * scripted, and above it the client sat on the result for longer than the timer
 * could possibly allow.
 */
export const MIN_MS_PER_QUESTION = 900;
export const MAX_MS_PER_QUESTION = SCORING.SECONDS_PER_QUESTION * 1000 + 5000;

/* ── DISPLAY NAMES ──
 * Letters, marks and digits in any script, plus spaces and a few joiners. Arabic,
 * Urdu, Hindi and Persian names must pass untouched; what must not pass is
 * anything that reaches out of the app — an address, a number, a link — or
 * anything that could be read as markup at an output boundary.
 */
export const NAME_MIN = 2;
export const NAME_MAX = 20;

// C0/C1 controls, bidi overrides, zero-width joiners and the BOM: all invisible,
// and all usable to make one name look like another on a public board.
const CONTROL_AND_INVISIBLE = /[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g;
const ALLOWED = /[^\p{L}\p{M}\p{N} '\-._]/gu;

export function sanitiseName(raw: unknown): string {
  return String(raw ?? '')
    .normalize('NFC')
    .replace(CONTROL_AND_INVISIBLE, '')
    .replace(ALLOWED, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, NAME_MAX);
}

/* Configurable: extend rather than rewrite, and keep entries lowercase. Matched
 * against the name with separators removed, so "f-u-c-k" is caught too. */
export const BLOCKED_NAME_WORDS = [
  'fuck', 'shit', 'cunt', 'bitch', 'bastard', 'wanker', 'slut', 'whore',
  'nigger', 'nigga', 'faggot', 'retard', 'rape', 'nazi', 'hitler',
  'admin', 'administrator', 'moderator', 'ahlulbayt', 'official',
];

const EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const URLISH = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|ie|co|uk|io|me|xyz|info|app)\b)/i;
const PHONE = /(?:\+?\d[\s\-().]*){7,}/;

export type NameCheck = { ok: true; name: string } | { ok: false; reason: string };

export function validateDisplayName(raw: unknown): NameCheck {
  const original = String(raw ?? '');
  if (!original.trim()) return { ok: false, reason: 'Please enter a display name.' };
  if (EMAIL.test(original)) return { ok: false, reason: 'Please do not use an email address.' };
  if (URLISH.test(original)) return { ok: false, reason: 'Please do not use a web address.' };
  if (PHONE.test(original)) return { ok: false, reason: 'Please do not use a phone number.' };

  const name = sanitiseName(original);
  if (name.length < NAME_MIN) return { ok: false, reason: `Use at least ${NAME_MIN} characters.` };
  if (name.length > NAME_MAX) return { ok: false, reason: `Use at most ${NAME_MAX} characters.` };
  if (!/[\p{L}\p{N}]/u.test(name)) return { ok: false, reason: 'Use letters or numbers.' };

  const flat = name.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  if (BLOCKED_NAME_WORDS.some(w => flat.includes(w))) {
    return { ok: false, reason: 'Please choose a different name.' };
  }
  return { ok: true, name };
}

export const DIFFICULTIES = ['easy', 'medium', 'hard'] as const;

/* Quizzes saved before difficulty was a first-class field carried the older
 * labels. They keep working and mean what they always meant. */
export const LEGACY_DIFFICULTY: Record<string, string> = {
  beginner: 'easy',
  intermediate: 'medium',
  advanced: 'hard',
};

export function normaliseDifficulty(v: unknown): string {
  const k = String(v ?? '').toLowerCase().trim();
  if (DIFFICULTIES.includes(k as any)) return k;
  return LEGACY_DIFFICULTY[k] ?? 'easy';
}
