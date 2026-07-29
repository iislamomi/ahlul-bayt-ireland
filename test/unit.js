/* Unit tests for the rules that decide what gets published.
 *
 * app.js is a single pre-transpiled script with no module boundary, so the pure
 * helpers are lifted out of it by marker and evaluated in a sandbox. That keeps
 * the tests honest — they run the shipped source, not a copy of it.
 *
 *   node test/unit.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');

function slice(startMarker, endMarker) {
  const i = src.indexOf(startMarker);
  const j = src.indexOf(endMarker, i);
  if (i < 0 || j < 0) throw new Error(`markers not found: ${startMarker} .. ${endMarker}`);
  return src.slice(i, j);
}

/* A tiny localStorage so lsGet/lsSet behave as they do in a browser. */
const store = new Map();
const sandbox = {
  console,
  crypto: { randomUUID: () => 'test-uuid-' + store.size },
  localStorage: {
    getItem: k => (store.has(k) ? store.get(k) : null),
    setItem: (k, v) => store.set(k, v),
    removeItem: k => store.delete(k),
  },
  indexedDB: undefined,
  Date,
  Math,
  JSON,
  String,
  Number,
  Array,
  Object,
  RegExp,
  Error,
  Promise,
  isFinite,
  parseInt,
  parseFloat,
};
sandbox.globalThis = sandbox;
vm.createContext(sandbox);

/* `const` at the top of a VM script lands in the script's lexical scope, not on
   globalThis, so the two slices are evaluated together with an explicit export
   line appended. */
const EXPORTS = [
  'QUIZ_LEVELS', 'quizLevel', 'migrateQuizzes', 'levelLabel', 'DEFAULT_LEVEL',
  'SCORING', 'computeScore', 'scoreParts',
  'validateDisplayName', 'sanitiseName', 'NAME_MIN', 'NAME_MAX', 'BLOCKED_NAME_WORDS',
  'installId', 'randomId', 'ABI_STORE_VERSION', 'runStorageMigrations', 'lsGet', 'lsSet',
];
vm.runInContext(
  slice('function lsGet(key, def)', '/* ── PRAYER LOCATION') +
    '\n' +
    slice('const QUIZ_LEVELS = [', 'const QUEUE_DB =') +
    '\n' +
    EXPORTS.map(n => `globalThis.${n} = ${n};`).join('\n'),
  sandbox,
);

let pass = 0;
const failures = [];
function check(name, got, want) {
  const ok = JSON.stringify(got) === JSON.stringify(want);
  if (ok) pass++;
  else failures.push(`${name}\n      expected ${JSON.stringify(want)}\n      got      ${JSON.stringify(got)}`);
}
function truthy(name, got) {
  check(name, !!got, true);
}

// ── difficulty ──────────────────────────────────────────────────────────────
const { quizLevel, migrateQuizzes, QUIZ_LEVELS } = sandbox;
check('difficulties are easy/medium/hard', QUIZ_LEVELS.map(l => l.key), ['easy', 'medium', 'hard']);
check('easy passes through', quizLevel({ level: 'easy' }), 'easy');
check('legacy beginner maps to easy', quizLevel({ level: 'beginner' }), 'easy');
check('legacy intermediate maps to medium', quizLevel({ level: 'intermediate' }), 'medium');
check('legacy advanced maps to hard', quizLevel({ level: 'advanced' }), 'hard');
check('missing difficulty defaults to easy', quizLevel({}), 'easy');
check('unknown difficulty defaults to easy', quizLevel({ level: 'brutal' }), 'easy');
check('case and padding tolerated', quizLevel({ level: '  MEDIUM ' }), 'medium');

const legacyQuizzes = [{ question: 'a', level: 'beginner' }, { question: 'b' }, { question: 'c', level: 'hard' }];
check('migration assigns explicit difficulty',
  migrateQuizzes(legacyQuizzes).map(q => q.level), ['easy', 'easy', 'hard']);
check('migration keeps every question', migrateQuizzes(legacyQuizzes).length, 3);
const alreadyFine = [{ question: 'a', level: 'easy' }];
check('migration is a no-op when nothing changes', migrateQuizzes(alreadyFine) === alreadyFine, true);
check('migration tolerates a non-array', migrateQuizzes(null), null);

// ── scoring ─────────────────────────────────────────────────────────────────
const { computeScore, scoreParts, SCORING } = sandbox;
const PAR = 10 * SCORING.SECONDS_PER_QUESTION * 1000;
check('perfect and instant', computeScore(10, 10, 0, true), 1000 + 25 + 50);
check('perfect at par time', computeScore(10, 10, PAR, true), 1000 + 25);
check('half correct at par', computeScore(5, 10, PAR, true), 500 + 25);
check('zero correct still scores completion', computeScore(0, 10, PAR, true), 25);
check('incomplete drops the completion bonus', computeScore(10, 10, PAR, false), 1000);
check('over-par time does not go negative', computeScore(3, 10, PAR * 3, true), 300 + 25);
check('parts add up to the total', (() => {
  const p = scoreParts(7, 10, PAR / 2, true);
  return p.answers + p.completion + p.time;
})(), computeScore(7, 10, PAR / 2, true));

// the property the formula exists to guarantee
const fastestNine = computeScore(9, 10, 0, true);
const slowestTen = computeScore(10, 10, PAR, true);
truthy('one more correct always beats any amount of speed', slowestTen > fastestNine);
let holds = true;
for (let n = 1; n <= 10; n++) {
  if (computeScore(n, 10, PAR, true) <= computeScore(n - 1, 10, 0, true)) holds = false;
}
truthy('holds at every correct-answer count', holds);

// ── display names ───────────────────────────────────────────────────────────
const { validateDisplayName, sanitiseName, NAME_MAX } = sandbox;
const ok = v => validateDisplayName(v).ok;
const why = v => validateDisplayName(v).reason;

check('a plain name passes', validateDisplayName('Zainab'), { ok: true, name: 'Zainab' });
check('surrounding space is trimmed', validateDisplayName('  Ahmed  ').name, 'Ahmed');
truthy('empty is rejected', !ok(''));
truthy('whitespace only is rejected', !ok('     '));
truthy('one character is rejected', !ok('A'));
truthy('two characters pass', ok('Ai'));
check('over-long names are cut to the maximum', validateDisplayName('A'.repeat(40)).name.length, NAME_MAX);

// multilingual names must survive intact
check('Arabic', validateDisplayName('علي').name, 'علي');
check('Urdu', validateDisplayName('زینب').name, 'زینب');
check('Hindi', validateDisplayName('आयशा').name, 'आयशा');
check('Persian', validateDisplayName('فاطمه').name, 'فاطمه');
check('accented Latin', validateDisplayName('Séamus Ó Bríain').name, 'Séamus Ó Bríain');
check('apostrophes and hyphens survive', validateDisplayName("Fatima al-Zahra'").name, "Fatima al-Zahra'");

truthy('email rejected', !ok('me@example.com'));
truthy('email with display text rejected', !ok('Ali me@x.ie'));
truthy('url rejected', !ok('https://example.com'));
truthy('bare domain rejected', !ok('example.ie'));
truthy('www rejected', !ok('www.abi.ie'));
truthy('phone rejected', !ok('0851234567'));
truthy('spaced phone rejected', !ok('+353 85 123 4567'));
truthy('a year is not a phone number', ok('Ali 2024'));
truthy('blocked word rejected', !ok('admin'));
truthy('blocked word inside a name rejected', !ok('xXadminXx'));
truthy('spaced-out blocked word rejected', !ok('a d m i n'));
truthy('markup is stripped, not stored', !/[<>]/.test(sanitiseName('<script>alert(1)</script>')));
check('markup strips to its letters', sanitiseName('<b>Ali</b>'), 'bAlib');
truthy('zero-width characters removed', sanitiseName('Al​i').length === 3);
truthy('bidi override removed', sanitiseName('Ali‮').length === 3);
truthy('a name of only punctuation is rejected', !ok('...'));
truthy('reasons are human-readable', typeof why('me@x.com') === 'string' && why('me@x.com').length > 5);

// ── report ─────────────────────────────────────────────────────────────────
const HHMM = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
truthy('05:12 is a valid time', HHMM.test('05:12'));
truthy('23:59 is a valid time', HHMM.test('23:59'));
truthy('24:00 is not', !HHMM.test('24:00'));
truthy('5:12 is not', !HHMM.test('5:12'));
truthy('05:99 is not', !HHMM.test('05:99'));

// ── report ─────────────────────────────────────────────────────────────────
console.log(`\n  ${pass} passed, ${failures.length} failed\n`);
if (failures.length) {
  failures.forEach(f => console.log('  FAIL  ' + f + '\n'));
  process.exit(1);
}
