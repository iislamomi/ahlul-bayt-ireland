function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const {
  Component
} = React;

/* ── NEUMORPHIC SOFT UI ──
   Raised surfaces sit at the same tone as the page; depth comes from a paired
   shadow — light off the top-left, shade to the bottom-right — rather than a
   lighter fill and a hairline border. The light source is fixed for the whole
   app, which is what separates soft UI from a generic drop shadow. `d` scales
   the extrusion: .6 for chips, 1 for cards, 1.6 for a hero surface. */
const NEU = {
  bg: '#ece5d8',
  surf: '#ece5d8',
  sunk: '#e6dfd1',
  hi: '#fffbf0',
  lo: '#cbc3b2',
  edge: '1px solid rgba(255,255,255,.55)',
  rule: '1px solid rgba(203,195,178,.5)',
  ink: '#2c2823',
  muted: '#6b6252', // 4.8:1 on the page tone — secondary text still has to pass AA
  accent: '#1f5145'
};
const NEU_D = {
  bg: '#1a1d1f',
  surf: '#1a1d1f',
  sunk: '#171a1b',
  hi: '#252a2d',
  lo: '#0e1011',
  edge: '1px solid rgba(255,255,255,.055)',
  rule: '1px solid rgba(255,255,255,.06)'
};
const neuTone = dark => dark ? NEU_D : NEU;
const neuUp = (d = 1, dark) => {
  const t = neuTone(dark);
  return `${(6 * d).toFixed(1)}px ${(6 * d).toFixed(1)}px ${(13 * d).toFixed(1)}px ${t.lo}, -${(5 * d).toFixed(1)}px -${(5 * d).toFixed(1)}px ${(11 * d).toFixed(1)}px ${t.hi}`;
};
const neuIn = (d = 1, dark) => {
  const t = neuTone(dark);
  return `inset ${(4 * d).toFixed(1)}px ${(4 * d).toFixed(1)}px ${(9 * d).toFixed(1)}px ${t.lo}, inset -${(3.5 * d).toFixed(1)}px -${(3.5 * d).toFixed(1)}px ${(8 * d).toFixed(1)}px ${t.hi}`;
};
/* A raised surface that carries an accent colour: the shade takes the accent's
   hue so lit and shaded edges still read as one light source. */
const neuUpOn = (rgb, d = 1) => `${(6 * d).toFixed(1)}px ${(6 * d).toFixed(1)}px ${(15 * d).toFixed(1)}px rgba(${rgb},.32), -${(4 * d).toFixed(1)}px -${(4 * d).toFixed(1)}px ${(10 * d).toFixed(1)}px ${NEU.hi}`;
/* Raised card, ready to spread into a style object. */
const neuCard = (r = 18, d = 1, dark) => ({
  background: neuTone(dark).surf,
  borderRadius: r,
  border: neuTone(dark).edge,
  boxShadow: neuUp(d, dark)
});
/* Pressed well — inputs, tracks, and the selected state of a segmented control. */
const neuWell = (r = 14, d = 1, dark) => ({
  background: neuTone(dark).sunk,
  borderRadius: r,
  border: neuTone(dark).edge,
  boxShadow: neuIn(d, dark)
});

/* ── HIJRI DATE ── */
const HIJRI_MONTHS = ['Muḥarram', 'Ṣafar', 'Rabīʿ al-Awwal', 'Rabīʿ al-Thānī', 'Jumādā al-Ūlā', 'Jumādā al-Ākhira', 'Rajab', 'Shaʿbān', 'Ramaḍān', 'Shawwāl', 'Dhū al-Qaʿda', 'Dhū al-Ḥijja'];
let _hijriFmt = null;
function toHijri(date) {
  // Accurate Umm al-Qura conversion via the browser's built-in Islamic calendar.
  try {
    _hijriFmt = _hijriFmt || new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const g = {};
    _hijriFmt.formatToParts(date).forEach(p => g[p.type] = p.value);
    const hd = parseInt(g.day, 10),
      hm = parseInt(g.month, 10),
      hy = parseInt(g.year, 10);
    if (hd && hm && hy) return `${hd} ${HIJRI_MONTHS[hm - 1]} ${hy}`;
  } catch (e) {}
  // Fallback: tabular arithmetic calendar (approximate)
  const y = date.getFullYear(),
    m = date.getMonth() + 1,
    d = date.getDate();
  let yy = y,
    mm = m;
  if (mm <= 2) {
    yy--;
    mm += 12;
  }
  const A = Math.floor(yy / 100);
  const B = 2 - A + Math.floor(A / 4);
  const jd = Math.floor(Math.floor(365.25 * (yy + 4716)) + Math.floor(30.6001 * (mm + 1)) + d + B - 1524.5 + 0.5);
  let l = jd - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  l = l - 10631 * n + 354;
  const j = Math.floor((10985 - l) / 5316) * Math.floor(50 * l / 17719) + Math.floor(l / 5670) * Math.floor(43 * l / 15238);
  l = l - Math.floor((30 - j) / 15) * Math.floor(17719 * j / 50) - Math.floor(j / 16) * Math.floor(15238 * j / 43) + 29;
  const hm = Math.floor(24 * l / 709);
  const hd = l - Math.floor(709 * hm / 24);
  const hy = 30 * n + j - 30;
  return `${hd} ${HIJRI_MONTHS[hm - 1]} ${hy}`;
}

/* Numeric Hijri parts for a date, via the browser's Umm al-Qura calendar. */
function toHijriParts(date) {
  try {
    _hijriFmt = _hijriFmt || new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    });
    const g = {};
    _hijriFmt.formatToParts(date).forEach(p => g[p.type] = p.value);
    const hd = parseInt(g.day, 10),
      hm = parseInt(g.month, 10),
      hy = parseInt(g.year, 10);
    if (hd && hm && hy) return { hd, hm, hy };
  } catch (e) {}
  return null;
}

/* Alphabetising key for transliterated titles: drops diacritics and the ayn / hamza
   marks, so a title opening with those still files under its plain letter. */
function sortKey(t) {
  return String(t || '').normalize('NFD').replace(/[\u0300-\u036f\u02b0-\u02ff\u2018\u2019']/g, '').trim();
}

/* Parse an admin 'YYYY-MM-DD' string to a local Date (midnight), matching the calendar grid convention. */
function gregToDate(s) {
  const [y, m, d] = String(s || '').split('-').map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

/* Does an event fall on `date`? Events are anchored to the Hijri calendar: a one-off
   matches the exact Hijri day/month/year; a yearly event matches Hijri day+month in any year.
   Falls back to exact Gregorian match if the Islamic calendar is unavailable. */
function eventOnDate(ev, date) {
  if (!ev) return false;
  // Entries authored on the Islamic calendar carry their Hijri day/month/year outright,
  // so they never drift through a Gregorian round-trip.
  if (ev.hd && ev.hm) {
    const h = toHijriParts(date);
    if (!h) return false;
    if (h.hd !== ev.hd || h.hm !== ev.hm) return false;
    return ev.recurring || !ev.hy || h.hy === ev.hy;
  }
  const src = gregToDate(ev.date);
  if (!src) return false;
  const a = toHijriParts(date),
    b = toHijriParts(src);
  if (!a || !b) {
    return ev.date === `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
  if (ev.recurring) return a.hm === b.hm && a.hd === b.hd;
  return a.hy === b.hy && a.hm === b.hm && a.hd === b.hd;
}

/* Format a Date as the 'YYYY-MM-DD' string the admin fields and calendar grid use. */
function dateToGregStr(d) {
  return d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` : '';
}

/* Gregorian date for an exact Hijri day/month/year, or null when that day does not exist
   in that Hijri year (a 30th of a 29-day month). Seeds from the mean Hijri year length,
   then walks onto the exact day using the browser's Umm al-Qura calendar. */
function hijriToGreg(hy, hm, hd) {
  if (!hy || !hm || !hd) return null;
  let cur = new Date(Math.floor(hy * 0.970224 + 621.5774), 0, 15);
  for (let i = 0; i < 10; i++) {
    const p = toHijriParts(cur);
    if (!p) return null;
    if (p.hy === hy && p.hm === hm && p.hd === hd) return cur;
    const step = Math.round(((hy - p.hy) * 354.367 + (hm - p.hm) * 29.53 + (hd - p.hd)));
    if (!step) break;
    cur = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + step);
  }
  for (let off = -25; off <= 25; off++) {
    const t = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + off);
    const p = toHijriParts(t);
    if (p && p.hy === hy && p.hm === hm && p.hd === hd) return t;
  }
  return null;
}

/* The next Gregorian date on or after `from` that falls on Hijri day `hd` of month `hm`. */
function nextHijriOccurrence(hm, hd, from) {
  if (!hm || !hd) return null;
  const s = from || new Date();
  for (let i = 0; i < 400; i++) {
    const t = new Date(s.getFullYear(), s.getMonth(), s.getDate() + i);
    const p = toHijriParts(t);
    if (p && p.hm === hm && p.hd === hd) return t;
  }
  return null;
}

/* Human label for an event's own anchor date, on the calendar it was authored in. */
function eventDateLabel(ev) {
  if (!ev) return '';
  if (ev.hd && ev.hm) return `${ev.hd} ${HIJRI_MONTHS[ev.hm - 1]}${ev.recurring || !ev.hy ? '' : ' ' + ev.hy} AH`;
  return ev.date || 'No date';
}

/* ── PRAYER PRESETS ── */
const PRAYER_PRESETS = [{
  id: 'ahlulbayt',
  name: 'Ahlul-Bait Ireland',
  sub: 'Official ABI timings · Jaʿfarī',
  prayers: [{
    name: 'Fajr',
    en: 'Dawn',
    ar: 'الفجر',
    glyph: 'ﭐ',
    time: '03:28'
  }, {
    name: 'Sunrise',
    en: 'Shurūq',
    ar: 'الشروق',
    glyph: '✷',
    time: '04:57'
  }, {
    name: 'Dhuhr',
    en: 'Noon',
    ar: 'الظهر',
    glyph: 'ﭖ',
    time: '13:26'
  }, {
    name: 'Sunset',
    en: 'Ghurūb',
    ar: 'الغروب',
    glyph: '✸',
    time: '21:56'
  }, {
    name: 'Maghrib',
    en: 'Dusk',
    ar: 'المغرب',
    glyph: 'ﮊ',
    time: '22:16'
  }, {
    name: 'Midnight',
    en: 'Muntaṣaf',
    ar: 'منتصف الليل',
    glyph: '☾',
    time: '01:12'
  }]
}];
const abiPresets = ps => {
  const list = Array.isArray(ps) && ps.length ? ps : PRAYER_PRESETS;
  const only = list.filter(p => p && p.id === 'ahlulbayt');
  return only.length ? only : PRAYER_PRESETS;
};
const STORIES = [{
  kind: 'verse',
  title: 'Daily Verse',
  short: 'Verse',
  initial: 'ق',
  tag: 'Verse of the day',
  color: '#1f5145',
  img: 'linear-gradient(150deg,#2a6a58,#143b2f)',
  ar: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
  sub: 'Sūrat al-Sharḥ · 94:6',
  body: 'Indeed, with hardship comes ease.',
  link: 'Open in Qurʾān'
}, {
  kind: 'sermon',
  title: 'Daily Sermon',
  short: 'Sermon',
  initial: 'ن',
  tag: 'Nahj al-Balāgha',
  color: '#2c5d52',
  img: 'linear-gradient(150deg,#347063,#1d4d42)',
  ar: '',
  sub: 'Saying 147 · On Knowledge',
  body: 'Knowledge is better than wealth. Knowledge guards you, while you must guard wealth. Wealth decreases by spending, while knowledge multiplies by it.',
  link: 'Read in Library'
}, {
  kind: 'kids',
  title: 'Kids Post',
  short: 'Kids',
  initial: 'ك',
  tag: 'For children',
  color: '#b8923f',
  img: 'linear-gradient(150deg,#d2a651,#a87a2c)',
  ar: '',
  sub: 'Good manners',
  body: 'The Prophet ﷺ said: "The best of you are those who are best to their families." Can you do one kind thing for your family today?',
  link: 'Open Kids Corner'
}, {
  kind: 'quiz',
  title: 'Daily Quiz',
  short: 'Quiz',
  initial: '؟',
  tag: '1 question',
  color: '#6e2230',
  img: 'linear-gradient(150deg,#8a3243,#5e1d29)',
  sub: 'Tap your answer',
  question: 'How many obligatory daily prayers are there in Islam?',
  options: ['Three', 'Five', 'Seven'],
  answer: 1
}, {
  kind: 'classified',
  title: 'New Listing',
  short: 'Business',
  initial: 'ت',
  tag: 'Classifieds',
  color: '#3a4a78',
  img: 'linear-gradient(150deg,#4a5d92,#2d3a64)',
  sub: 'Karbala Travel',
  body: 'New Arbaʿīn ziyārat packages are now open for registration. Flights, visas and accommodation included.',
  link: 'View listing'
}, {
  kind: 'announce',
  title: 'Muḥarram',
  short: 'Muḥarram',
  initial: 'م',
  tag: 'Community',
  color: '#6e2230',
  img: 'linear-gradient(150deg,#7a2433,#52171f)',
  sub: 'Nightly majālis',
  body: 'The annual Muḥarram programme begins Friday. Nightly gatherings after Maghrib throughout the first ten nights.',
  link: 'Full schedule'
}];
const EVENT_DEFS = [{
  offset: 0,
  title: 'Community Iftar',
  type: 'Community',
  color: '#1f5145',
  tint: '#e6efe9',
  desc: 'Shared community meal after Maghrib in the main hall. All families warmly welcome.'
}, {
  offset: 2,
  title: 'Wafāt Commemoration',
  type: 'Majlis',
  color: '#6e2230',
  tint: '#f3e6e8',
  desc: 'Evening majlis with recitation and lecture, beginning after ʿIshāʾ.'
}, {
  offset: 5,
  title: 'Youth Qurʾān Class',
  type: 'Class',
  color: '#7d6220',
  tint: '#f3ecd9',
  desc: 'Weekly tajwīd session for youth, 11:00 AM in the learning room.'
}, {
  offset: 9,
  title: 'Muḥarram Begins',
  type: 'Programme',
  color: '#2c5d52',
  tint: '#e6efe9',
  desc: 'First night of the annual Muḥarram programme. Nightly majālis after Maghrib.'
}];
const CAL_EVENTS_DEFAULT = [{
  date: '2026-06-26',
  title: 'Community Iftar',
  type: 'Community',
  color: '#1f5145',
  tint: '#e6efe9',
  desc: 'Shared community meal after Maghrib in the main hall. All families warmly welcome.'
}, {
  date: '2026-06-28',
  title: 'Wafāt Commemoration',
  type: 'Majlis',
  color: '#6e2230',
  tint: '#f3e6e8',
  desc: 'Evening majlis with recitation and lecture, beginning after ʿIshāʾ.'
}, {
  date: '2026-07-01',
  title: 'Youth Qurʾān Class',
  type: 'Class',
  color: '#7d6220',
  tint: '#f3ecd9',
  desc: 'Weekly tajwīd session for youth, 11:00 AM in the learning room.'
}, {
  date: '2026-07-05',
  title: 'Muḥarram Begins',
  type: 'Programme',
  color: '#2c5d52',
  tint: '#e6efe9',
  desc: 'First night of the annual Muḥarram programme. Nightly majālis after Maghrib.'
}];
const HEALTH_TIPS = [{
  title: 'Drink More Water',
  body: 'Aim for 8 glasses daily. Hydration improves focus, digestion, and energy levels.',
  tag: 'Hydration',
  color: '#2c5d52',
  tint: '#e6efe9'
}, {
  title: 'Walk After Meals',
  body: 'A 10-minute walk after meals aids digestion and helps regulate blood sugar.',
  tag: 'Exercise',
  color: '#1f5145',
  tint: '#e6efe9'
}, {
  title: 'Sleep 7–8 Hours',
  body: 'Quality sleep strengthens immunity, improves mood, and sharpens mental clarity.',
  tag: 'Sleep',
  color: '#6e2230',
  tint: '#f3e6e8'
}, {
  title: 'Reduce Sugar Intake',
  body: 'Choose dates, fruit, or honey as natural sweeteners over processed sugar.',
  tag: 'Nutrition',
  color: '#7d6220',
  tint: '#f3ecd9'
}];
const HEALTH_VIDEOS = [{
  title: 'Benefits of Morning Exercise',
  meta: 'Wellness · 3 min',
  color: '#1f5145'
}, {
  title: 'Healthy Halal Meal Planning',
  meta: 'Nutrition · 5 min',
  color: '#6e2230'
}, {
  title: 'Managing Stress with Faith',
  meta: 'Mental Health · 4 min',
  color: '#2c5d52'
}];
const KIDS_LEARN = [{
  title: 'Who are the Ahlul Bayt?',
  meta: 'Animated · 4 min',
  color: '#1f5145'
}, {
  title: 'The Story of Ghadīr',
  meta: 'Animated · 6 min',
  color: '#6e2230'
}, {
  title: 'Learning Wuḍūʾ step by step',
  meta: 'How-to · 3 min',
  color: '#7d6220'
}];
const KIDS_BOOKS = [{
  title: "My First Duʿāʾ Book",
  meta: 'Picture book · Ages 3–6',
  color: '#e6efe9',
  ink: '#1f5145'
}, {
  title: 'Stories of the Imams',
  meta: 'Illustrated · Ages 6–9',
  color: '#f3e6e8',
  ink: '#6e2230'
}, {
  title: 'The 14 Infallibles',
  meta: 'Activity book · Ages 7–10',
  color: '#f3ecd9',
  ink: '#7d6220'
}, {
  title: 'Good Manners (Akhlāq)',
  meta: 'Picture book · Ages 4–7',
  color: '#e8ebf4',
  ink: '#3a4a78'
}];
/* ═══════════════════════════════════════════════════════════════════════
   ANCHOR: MADRASA_CONTENT
   Mirrors https://www.ahlulbait.ie/madrasa ("City of Knowledge").
   Single source of truth for the Madrasa tab — edit the fields below to
   update the in-app page (rendered in renderKids → kt === 'books').
   ═══════════════════════════════════════════════════════════════════════ */
const MADRASA_INFO = {
  name: 'City of Knowledge',
  tagline: 'Saturday Evening Madrasa',
  year: '2026 / 27',
  status: 'Registration open',
  ages: 'Ages 5 – 12',
  day: 'Saturday evenings',
  place: 'Ahlul-Bait Islamic Centre, Dublin',
  intro: 'A warm, structured programme helping children build a meaningful connection with their faith, the Arabic language and the teachings of the Ahlul-Bait (AS).',
  subjects: [{
    icon: '🔤',
    title: 'Arabic Language',
    desc: 'The Arabic alphabet and vocabulary, taught in a fun and engaging way — reading simple words, understanding common phrases, and beginning the journey with the language of the Qurʾān.'
  }, {
    icon: '🕌',
    title: 'Islamic Studies',
    desc: 'Core Islamic beliefs, daily duʿās and practical akhlāq that children can carry into everyday life.'
  }, {
    icon: '🌙',
    title: 'Munāsabāt',
    desc: 'The significance of key Islamic occasions and the lives and teachings of the Ahlul-Bait (AS).'
  }],
  note: 'Places are limited — parents are encouraged to register early.',
  registerUrl: 'https://www.ahlulbait.ie/madrasa'
};
const KIDS_QUOTES = [{
  ar: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ',
  tr: 'Seeking knowledge is an obligation.',
  who: 'Prophet Muḥammad ﷺ'
}, {
  ar: 'أَحْسِنْ إِلَى وَالِدَيْكَ',
  tr: 'Be kind to your parents.',
  who: "Imam ʿAlī ؏"
}];
const KIDS_QUIZZES = [{
  question: 'How many times a day do Muslims pray?',
  options: ['Three', 'Five', 'Seven'],
  answer: 1
}, {
  question: 'Who was the first Imam of the Ahlul Bayt?',
  options: ['Imam ʿAlī ؏', 'Imam Ḥasan ؏', 'Imam Ḥusayn ؏'],
  answer: 0
}];
const DUAS = [{
  title: 'Duʿāʾ Kumayl',
  cat: 'Weekly',
  ar: 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيمِ\nاللَّهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ\nوَبِقُوَّتِكَ الَّتِي قَهَرْتَ بِهَا كُلَّ شَيْءٍ وَخَضَعَ لَهَا كُلُّ شَيْءٍ وَذَلَّ لَهَا كُلُّ شَيْءٍ\nوَبِجَبَرُوتِكَ الَّتِي غَلَبْتَ بِهَا كُلَّ شَيْءٍ\nوَبِعِزَّتِكَ الَّتِي لَا يَقُومُ لَهَا شَيْءٌ\nوَبِعَظَمَتِكَ الَّتِي مَلَأَتْ كُلَّ شَيْءٍ\nوَبِسُلْطَانِكَ الَّذِي عَلَا كُلَّ شَيْءٍ\nوَبِوَجْهِكَ الْبَاقِي بَعْدَ فَنَاءِ كُلِّ شَيْءٍ\nوَبِأَسْمَائِكَ الَّتِي مَلَأَتْ أَرْكَانَ كُلِّ شَيْءٍ\nوَبِعِلْمِكَ الَّذِي أَحَاطَ بِكُلِّ شَيْءٍ\nوَبِنُورِ وَجْهِكَ الَّذِي أَضَاءَ لَهُ كُلُّ شَيْءٍ\nيَا نُورُ يَا قُدُّوسُ يَا أَوَّلَ الْأَوَّلِينَ وَيَا آخِرَ الْآخِرِينَ\nاللَّهُمَّ اغْفِرْ لِيَ الذُّنُوبَ الَّتِي تَهْتِكُ الْعِصَمَ\nاللَّهُمَّ اغْفِرْ لِيَ الذُّنُوبَ الَّتِي تُنْزِلُ النِّقَمَ\nاللَّهُمَّ اغْفِرْ لِيَ الذُّنُوبَ الَّتِي تُغَيِّرُ النِّعَمَ\nاللَّهُمَّ اغْفِرْ لِيَ الذُّنُوبَ الَّتِي تَحْبِسُ الدُّعَاءَ\nاللَّهُمَّ اغْفِرْ لِيَ الذُّنُوبَ الَّتِي تُنْزِلُ الْبَلَاءَ\nاللَّهُمَّ اغْفِرْ لِي كُلَّ ذَنْبٍ أَذْنَبْتُهُ وَكُلَّ خَطِيئَةٍ أَخْطَأْتُهَا\nاللَّهُمَّ إِنِّي أَتَقَرَّبُ إِلَيْكَ بِذِكْرِكَ وَأَسْتَشْفِعُ بِكَ إِلَى نَفْسِكَ وَأَسْأَلُكَ بِجُودِكَ أَنْ تُدْنِيَنِي مِنْ قُرْبِكَ وَأَنْ تُوزِعَنِي شُكْرَكَ وَأَنْ تُلْهِمَنِي ذِكْرَكَ\nاللَّهُمَّ إِنِّي أَسْأَلُكَ سُؤَالَ خَاضِعٍ مُتَذَلِّلٍ خَاشِعٍ أَنْ تُسَامِحَنِي وَتَرْحَمَنِي وَتَجْعَلَنِي بِقِسْمِكَ رَاضِيًا قَانِعًا وَفِي جَمِيعِ الْأَحْوَالِ مُتَوَاضِعًا\nاللَّهُمَّ وَأَسْأَلُكَ سُؤَالَ مَنِ اشْتَدَّتْ فَاقَتُهُ وَأَنْزَلَ بِكَ عِنْدَ الشَّدَائِدِ حَاجَتَهُ وَعَظُمَ فِيمَا عِنْدَكَ رَغْبَتُهُ\nاللَّهُمَّ عَظُمَ سُلْطَانُكَ وَعَلَا مَكَانُكَ وَخَفِيَ مَكْرُكَ وَظَهَرَ أَمْرُكَ وَغَلَبَ قَهْرُكَ وَجَرَتْ قُدْرَتُكَ وَلَا يُمْكِنُ الْفِرَارُ مِنْ حُكُومَتِكَ\nاللَّهُمَّ لَا أَجِدُ لِذُنُوبِي غَافِرًا وَلَا لِقَبَائِحِي سَاتِرًا وَلَا لِشَيْءٍ مِنْ عَمَلِيَ الْقَبِيحِ بِالْحَسَنِ مُبَدِّلًا غَيْرَكَ\nلَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ وَبِحَمْدِكَ ظَلَمْتُ نَفْسِي وَتَجَرَّأْتُ بِجَهْلِي وَسَكَنْتُ إِلَى قَدِيمِ ذِكْرِكَ لِي وَمَنِّكَ عَلَيَّ\nاللَّهُمَّ مَوْلَايَ كَمْ مِنْ قَبِيحٍ سَتَرْتَهُ وَكَمْ مِنْ فَادِحٍ مِنَ الْبَلَاءِ أَقَلْتَهُ وَكَمْ مِنْ عِثَارٍ وَقَيْتَهُ وَكَمْ مِنْ مَكْرُوهٍ دَفَعْتَهُ وَكَمْ مِنْ ثَنَاءٍ جَمِيلٍ لَسْتُ أَهْلًا لَهُ نَشَرْتَهُ\nاللَّهُمَّ عَظُمَ بَلَائِي وَأَفْرَطَ بِي سُوءُ حَالِي وَقَصُرَتْ بِي أَعْمَالِي وَقَعَدَتْ بِي أَغْلَالِي وَحَبَسَنِي عَنْ نَفْعِي بُعْدُ أَمَلِي وَخَدَعَتْنِي الدُّنْيَا بِغُرُورِهَا وَنَفْسِي بِجِنَايَتِهَا وَمِطَالِي\nيَا سَيِّدِي فَأَسْأَلُكَ بِعِزَّتِكَ أَنْ لَا يَحْجُبَ عَنْكَ دُعَائِي سُوءُ عَمَلِي وَفِعَالِي وَلَا تَفْضَحْنِي بِخَفِيِّ مَا اطَّلَعْتَ عَلَيْهِ مِنْ سِرِّي وَلَا تُعَاجِلْنِي بِالْعُقُوبَةِ عَلَى مَا عَمِلْتُهُ فِي خَلَوَاتِي مِنْ سُوءِ فِعْلِي وَإِسَاءَتِي وَدَوَامِ تَفْرِيطِي وَجَهَالَتِي وَكَثْرَةِ شَهَوَاتِي وَغَفْلَتِي\nوَكُنِ اللَّهُمَّ بِعِزَّتِكَ لِي فِي كُلِّ الْأَحْوَالِ رَؤُوفًا وَعَلَيَّ فِي جَمِيعِ الْأُمُورِ عَطُوفًا\nإِلَهِي وَرَبِّي مَنْ لِي غَيْرُكَ أَسْأَلُهُ كَشْفَ ضُرِّي وَالنَّظَرَ فِي أَمْرِي\nإِلَهِي وَمَوْلَايَ أَجْرَيْتَ عَلَيَّ حُكْمًا اتَّبَعْتُ فِيهِ هَوَى نَفْسِي وَلَمْ أَحْتَرِسْ فِيهِ مِنْ تَزْيِينِ عَدُوِّي فَغَرَّنِي بِمَا أَهْوَى وَأَسْعَدَهُ عَلَى ذَلِكَ الْقَضَاءُ فَتَجَاوَزْتُ بِمَا جَرَى عَلَيَّ مِنْ ذَلِكَ بَعْضَ حُدُودِكَ وَخَالَفْتُ بَعْضَ أَوَامِرِكَ\nفَلَكَ الْحُجَّةُ عَلَيَّ فِي جَمِيعِ ذَلِكَ وَلَا حُجَّةَ لِي فِيمَا جَرَى عَلَيَّ فِيهِ قَضَاؤُكَ وَأَلْزَمَنِي حُكْمُكَ وَبَلَاؤُكَ\nوَقَدْ أَتَيْتُكَ يَا إِلَهِي بَعْدَ تَقْصِيرِي وَإِسْرَافِي عَلَى نَفْسِي مُعْتَذِرًا نَادِمًا مُنْكَسِرًا مُسْتَقِيلًا مُسْتَغْفِرًا مُنِيبًا مُقِرًّا مُذْعِنًا مُعْتَرِفًا لَا أَجِدُ مَفَرًّا مِمَّا كَانَ مِنِّي وَلَا مَفْزَعًا أَتَوَجَّهُ إِلَيْهِ فِي أَمْرِي غَيْرَ قَبُولِكَ عُذْرِي وَإِدْخَالِكَ إِيَّايَ فِي سَعَةٍ مِنْ رَحْمَتِكَ\nاللَّهُمَّ فَاقْبَلْ عُذْرِي وَارْحَمْ شِدَّةَ ضُرِّي وَفُكَّنِي مِنْ شَدِّ وَثَاقِي\nيَا رَبِّ ارْحَمْ ضَعْفَ بَدَنِي وَرِقَّةَ جِلْدِي وَدِقَّةَ عَظْمِي\nيَا مَنْ بَدَأَ خَلْقِي وَذِكْرِي وَتَرْبِيَتِي وَبِرِّي وَتَغْذِيَتِي هَبْنِي لِابْتِدَاءِ كَرَمِكَ وَسَالِفِ بِرِّكَ بِي\nيَا إِلَهِي وَسَيِّدِي وَرَبِّي أَتُرَاكَ مُعَذِّبِي بِنَارِكَ بَعْدَ تَوْحِيدِكَ وَبَعْدَ مَا انْطَوَى عَلَيْهِ قَلْبِي مِنْ مَعْرِفَتِكَ وَلَهِجَ بِهِ لِسَانِي مِنْ ذِكْرِكَ وَاعْتَقَدَهُ ضَمِيرِي مِنْ حُبِّكَ وَبَعْدَ صِدْقِ اعْتِرَافِي وَدُعَائِي خَاضِعًا لِرُبُوبِيَّتِكَ\nهَيْهَاتَ أَنْتَ أَكْرَمُ مِنْ أَنْ تُضَيِّعَ مَنْ رَبَّيْتَهُ أَوْ تُبْعِدَ مَنْ أَدْنَيْتَهُ أَوْ تُشَرِّدَ مَنْ آوَيْتَهُ أَوْ تُسَلِّمَ إِلَى الْبَلَاءِ مَنْ كَفَيْتَهُ وَرَحِمْتَهُ\nوَلَيْتَ شِعْرِي يَا سَيِّدِي وَإِلَهِي وَمَوْلَايَ أَتُسَلِّطُ النَّارَ عَلَى وُجُوهٍ خَرَّتْ لِعَظَمَتِكَ سَاجِدَةً وَعَلَى أَلْسُنٍ نَطَقَتْ بِتَوْحِيدِكَ صَادِقَةً وَبِشُكْرِكَ مَادِحَةً وَعَلَى قُلُوبٍ اعْتَرَفَتْ بِإِلَهِيَّتِكَ مُحَقِّقَةً وَعَلَى ضَمَائِرَ حَوَتْ مِنَ الْعِلْمِ بِكَ حَتَّى صَارَتْ خَاشِعَةً وَعَلَى جَوَارِحَ سَعَتْ إِلَى أَوْطَانِ تَعَبُّدِكَ طَائِعَةً وَأَشَارَتْ بِاسْتِغْفَارِكَ مُذْعِنَةً\nمَا هَكَذَا الظَّنُّ بِكَ وَلَا أُخْبِرْنَا بِفَضْلِكَ عَنْكَ يَا كَرِيمُ يَا رَبِّ\nوَأَنْتَ تَعْلَمُ ضَعْفِي عَنْ قَلِيلٍ مِنْ بَلَاءِ الدُّنْيَا وَعُقُوبَاتِهَا وَمَا يَجْرِي فِيهَا مِنَ الْمَكَارِهِ عَلَى أَهْلِهَا عَلَى أَنَّ ذَلِكَ بَلَاءٌ وَمَكْرُوهٌ قَلِيلٌ مَكْثُهُ يَسِيرٌ بَقَاؤُهُ قَصِيرٌ مُدَّتُهُ\nفَكَيْفَ احْتِمَالِي لِبَلَاءِ الْآخِرَةِ وَجَلِيلِ وُقُوعِ الْمَكَارِهِ فِيهَا وَهُوَ بَلَاءٌ تَطُولُ مُدَّتُهُ وَيَدُومُ مَقَامُهُ وَلَا يُخَفَّفُ عَنْ أَهْلِهِ لِأَنَّهُ لَا يَكُونُ إِلَّا عَنْ غَضَبِكَ وَانْتِقَامِكَ وَسَخَطِكَ وَهَذَا مَا لَا تَقُومُ لَهُ السَّمَاوَاتُ وَالْأَرْضُ\nيَا سَيِّدِي فَكَيْفَ لِي وَأَنَا عَبْدُكَ الضَّعِيفُ الذَّلِيلُ الْحَقِيرُ الْمِسْكِينُ الْمُسْتَكِينُ\nيَا إِلَهِي وَرَبِّي وَسَيِّدِي وَمَوْلَايَ لِأَيِّ الْأُمُورِ إِلَيْكَ أَشْكُو وَلِمَا مِنْهَا أَضِجُّ وَأَبْكِي لِأَلِيمِ الْعَذَابِ وَشِدَّتِهِ أَمْ لِطُولِ الْبَلَاءِ وَمُدَّتِهِ\nفَلَئِنْ صَيَّرْتَنِي لِلْعُقُوبَاتِ مَعَ أَعْدَائِكَ وَجَمَعْتَ بَيْنِي وَبَيْنَ أَهْلِ بَلَائِكَ وَفَرَّقْتَ بَيْنِي وَبَيْنَ أَحِبَّائِكَ وَأَوْلِيَائِكَ فَهَبْنِي يَا إِلَهِي وَسَيِّدِي وَمَوْلَايَ وَرَبِّي صَبَرْتُ عَلَى عَذَابِكَ فَكَيْفَ أَصْبِرُ عَلَى فِرَاقِكَ وَهَبْنِي صَبَرْتُ عَلَى حَرِّ نَارِكَ فَكَيْفَ أَصْبِرُ عَنِ النَّظَرِ إِلَى كَرَامَتِكَ أَمْ كَيْفَ أَسْكُنُ فِي النَّارِ وَرَجَائِي عَفْوُكَ\nفَبِعِزَّتِكَ يَا سَيِّدِي وَمَوْلَايَ أُقْسِمُ صَادِقًا لَئِنْ تَرَكْتَنِي نَاطِقًا لَأَضِجَّنَّ إِلَيْكَ بَيْنَ أَهْلِهَا ضَجِيجَ الْآمِلِينَ وَلَأَصْرُخَنَّ إِلَيْكَ صُرَاخَ الْمُسْتَصْرِخِينَ وَلَأَبْكِيَنَّ عَلَيْكَ بُكَاءَ الْفَاقِدِينَ وَلَأُنَادِيَنَّكَ أَيْنَ كُنْتَ يَا وَلِيَّ الْمُؤْمِنِينَ يَا غَايَةَ آمَالِ الْعَارِفِينَ يَا غِيَاثَ الْمُسْتَغِيثِينَ يَا حَبِيبَ قُلُوبِ الصَّادِقِينَ وَيَا إِلَهَ الْعَالَمِينَ\nأَفَتُرَاكَ سُبْحَانَكَ يَا إِلَهِي وَبِحَمْدِكَ تَسْمَعُ فِيهَا صَوْتَ عَبْدٍ مُسْلِمٍ سُجِنَ فِيهَا بِمُخَالَفَتِهِ وَذَاقَ طَعْمَ عَذَابِهَا بِمَعْصِيَتِهِ وَحُبِسَ بَيْنَ أَطْبَاقِهَا بِجُرْمِهِ وَجَرِيرَتِهِ وَهُوَ يَضِجُّ إِلَيْكَ ضَجِيجَ مُؤَمِّلٍ لِرَحْمَتِكَ وَيُنَادِيكَ بِلِسَانِ أَهْلِ تَوْحِيدِكَ وَيَتَوَسَّلُ إِلَيْكَ بِرُبُوبِيَّتِكَ\nيَا مَوْلَايَ فَكَيْفَ يَبْقَى فِي الْعَذَابِ وَهُوَ يَرْجُو مَا سَلَفَ مِنْ حِلْمِكَ أَمْ كَيْفَ تُؤْلِمُهُ النَّارُ وَهُوَ يَأْمُلُ فَضْلَكَ وَرَحْمَتَكَ أَمْ كَيْفَ يُحْرِقُهُ لَهِيبُهَا وَأَنْتَ تَسْمَعُ صَوْتَهُ وَتَرَى مَكَانَهُ أَمْ كَيْفَ يَشْتَمِلُ عَلَيْهِ زَفِيرُهَا وَأَنْتَ تَعْلَمُ ضَعْفَهُ أَمْ كَيْفَ يَتَقَلْقَلُ بَيْنَ أَطْبَاقِهَا وَأَنْتَ تَعْلَمُ صِدْقَهُ أَمْ كَيْفَ تَزْجُرُهُ زَبَانِيَتُهَا وَهُوَ يُنَادِيكَ يَا رَبَّهُ أَمْ كَيْفَ يَرْجُو فَضْلَكَ فِي عِتْقِهِ مِنْهَا فَتَتْرُكُهُ فِيهَا\nهَيْهَاتَ مَا ذَلِكَ الظَّنُّ بِكَ وَلَا الْمَعْرُوفُ مِنْ فَضْلِكَ وَلَا مُشْبِهٌ لِمَا عَامَلْتَ بِهِ الْمُوَحِّدِينَ مِنْ بِرِّكَ وَإِحْسَانِكَ\nفَبِالْيَقِينِ أَقْطَعُ لَوْلَا مَا حَكَمْتَ بِهِ مِنْ تَعْذِيبِ جَاحِدِيكَ وَقَضَيْتَ بِهِ مِنْ إِخْلَادِ مُعَانِدِيكَ لَجَعَلْتَ النَّارَ كُلَّهَا بَرْدًا وَسَلَامًا وَمَا كَانَ لِأَحَدٍ فِيهَا مَقَرًّا وَلَا مُقَامًا لَكِنَّكَ تَقَدَّسَتْ أَسْمَاؤُكَ أَقْسَمْتَ أَنْ تَمْلَأَهَا مِنَ الْكَافِرِينَ مِنَ الْجِنَّةِ وَالنَّاسِ أَجْمَعِينَ وَأَنْ تُخَلِّدَ فِيهَا الْمُعَانِدِينَ\nوَأَنْتَ جَلَّ ثَنَاؤُكَ قُلْتَ مُبْتَدِئًا وَتَطَوَّلْتَ بِالْإِنْعَامِ مُتَكَرِّمًا أَفَمَنْ كَانَ مُؤْمِنًا كَمَنْ كَانَ فَاسِقًا لَا يَسْتَوُونَ\nإِلَهِي وَسَيِّدِي فَأَسْأَلُكَ بِالْقُدْرَةِ الَّتِي قَدَّرْتَهَا وَبِالْقَضِيَّةِ الَّتِي حَتَمْتَهَا وَحَكَمْتَهَا وَغَلَبْتَ مَنْ عَلَيْهِ أَجْرَيْتَهَا أَنْ تَهَبَ لِي فِي هَذِهِ اللَّيْلَةِ وَفِي هَذِهِ السَّاعَةِ كُلَّ جُرْمٍ أَجْرَمْتُهُ وَكُلَّ ذَنْبٍ أَذْنَبْتُهُ وَكُلَّ قَبِيحٍ أَسْرَرْتُهُ وَكُلَّ جَهْلٍ عَمِلْتُهُ كَتَمْتُهُ أَوْ أَعْلَنْتُهُ أَخْفَيْتُهُ أَوْ أَظْهَرْتُهُ وَكُلَّ سَيِّئَةٍ أَمَرْتَ بِإِثْبَاتِهَا الْكِرَامَ الْكَاتِبِينَ الَّذِينَ وَكَّلْتَهُمْ بِحِفْظِ مَا يَكُونُ مِنِّي وَجَعَلْتَهُمْ شُهُودًا عَلَيَّ مَعَ جَوَارِحِي وَكُنْتَ أَنْتَ الرَّقِيبَ عَلَيَّ مِنْ وَرَائِهِمْ وَالشَّاهِدَ لِمَا خَفِيَ عَنْهُمْ وَبِرَحْمَتِكَ أَخْفَيْتَهُ وَبِفَضْلِكَ سَتَرْتَهُ\nوَأَنْ تُوَفِّرَ حَظِّي مِنْ كُلِّ خَيْرٍ أَنْزَلْتَهُ أَوْ إِحْسَانٍ فَضَّلْتَهُ أَوْ بِرٍّ نَشَرْتَهُ أَوْ رِزْقٍ بَسَطْتَهُ أَوْ ذَنْبٍ تَغْفِرُهُ أَوْ خَطَإٍ تَسْتُرُهُ\nيَا رَبِّ يَا رَبِّ يَا رَبِّ يَا إِلَهِي وَسَيِّدِي وَمَوْلَايَ وَمَالِكَ رِقِّي يَا مَنْ بِيَدِهِ نَاصِيَتِي يَا عَلِيمًا بِضُرِّي وَمَسْكَنَتِي يَا خَبِيرًا بِفَقْرِي وَفَاقَتِي\nيَا رَبِّ يَا رَبِّ يَا رَبِّ أَسْأَلُكَ بِحَقِّكَ وَقُدْسِكَ وَأَعْظَمِ صِفَاتِكَ وَأَسْمَائِكَ أَنْ تَجْعَلَ أَوْقَاتِي مِنَ اللَّيْلِ وَالنَّهَارِ بِذِكْرِكَ مَعْمُورَةً وَبِخِدْمَتِكَ مَوْصُولَةً وَأَعْمَالِي عِنْدَكَ مَقْبُولَةً حَتَّى تَكُونَ أَعْمَالِي وَأَوْرَادِي كُلُّهَا وِرْدًا وَاحِدًا وَحَالِي فِي خِدْمَتِكَ سَرْمَدًا\nيَا سَيِّدِي يَا مَنْ عَلَيْهِ مُعَوَّلِي يَا مَنْ إِلَيْهِ شَكَوْتُ أَحْوَالِي يَا رَبِّ يَا رَبِّ يَا رَبِّ قَوِّ عَلَى خِدْمَتِكَ جَوَارِحِي وَاشْدُدْ عَلَى الْعَزِيمَةِ جَوَانِحِي وَهَبْ لِيَ الْجِدَّ فِي خَشْيَتِكَ وَالدَّوَامَ فِي الِاتِّصَالِ بِخِدْمَتِكَ حَتَّى أَسْرَحَ إِلَيْكَ فِي مَيَادِينِ السَّابِقِينَ وَأُسْرِعَ إِلَيْكَ فِي الْبَارِزِينَ وَأَشْتَاقَ إِلَى قُرْبِكَ فِي الْمُشْتَاقِينَ وَأَدْنُوَ مِنْكَ دُنُوَّ الْمُخْلِصِينَ وَأَخَافَكَ مَخَافَةَ الْمُوقِنِينَ وَأَجْتَمِعَ فِي جِوَارِكَ مَعَ الْمُؤْمِنِينَ\nاللَّهُمَّ وَمَنْ أَرَادَنِي بِسُوءٍ فَأَرِدْهُ وَمَنْ كَادَنِي فَكِدْهُ وَاجْعَلْنِي مِنْ أَحْسَنِ عَبِيدِكَ نَصِيبًا عِنْدَكَ وَأَقْرَبِهِمْ مَنْزِلَةً مِنْكَ وَأَخَصِّهِمْ زُلْفَةً لَدَيْكَ فَإِنَّهُ لَا يُنَالُ ذَلِكَ إِلَّا بِفَضْلِكَ\nوَجُدْ لِي بِجُودِكَ وَاعْطِفْ عَلَيَّ بِمَجْدِكَ وَاحْفَظْنِي بِرَحْمَتِكَ وَاجْعَلْ لِسَانِي بِذِكْرِكَ لَهِجًا وَقَلْبِي بِحُبِّكَ مُتَيَّمًا وَمُنَّ عَلَيَّ بِحُسْنِ إِجَابَتِكَ وَأَقِلْنِي عَثْرَتِي وَاغْفِرْ زَلَّتِي\nفَإِنَّكَ قَضَيْتَ عَلَى عِبَادِكَ بِعِبَادَتِكَ وَأَمَرْتَهُمْ بِدُعَائِكَ وَضَمِنْتَ لَهُمُ الْإِجَابَةَ فَإِلَيْكَ يَا رَبِّ نَصَبْتُ وَجْهِي وَإِلَيْكَ يَا رَبِّ مَدَدْتُ يَدِي فَبِعِزَّتِكَ اسْتَجِبْ لِي دُعَائِي وَبَلِّغْنِي مُنَايَ وَلَا تَقْطَعْ مِنْ فَضْلِكَ رَجَائِي وَاكْفِنِي شَرَّ الْجِنِّ وَالْإِنْسِ مِنْ أَعْدَائِي\nيَا سَرِيعَ الرِّضَا اغْفِرْ لِمَنْ لَا يَمْلِكُ إِلَّا الدُّعَاءَ فَإِنَّكَ فَعَّالٌ لِمَا تَشَاءُ\nيَا مَنِ اسْمُهُ دَوَاءٌ وَذِكْرُهُ شِفَاءٌ وَطَاعَتُهُ غِنًى ارْحَمْ مَنْ رَأْسُ مَالِهِ الرَّجَاءُ وَسِلَاحُهُ الْبُكَاءُ\nيَا سَابِغَ النِّعَمِ يَا دَافِعَ النِّقَمِ يَا نُورَ الْمُسْتَوْحِشِينَ فِي الظُّلَمِ يَا عَالِمًا لَا يُعَلَّمُ صَلِّ عَلَى مُحَمَّدٍ وَآلِ مُحَمَّدٍ وَافْعَلْ بِي مَا أَنْتَ أَهْلُهُ\nوَصَلَّى اللَّهُ عَلَى رَسُولِهِ وَالْأَئِمَّةِ الْمَيَامِينَ مِنْ آلِهِ وَسَلَّمَ تَسْلِيمًا كَثِيرًا',
  tr: 'O Allah, I ask You by Your mercy, which embraces all things.',
  note: 'Taught by Imam ʿAlī (a) to Kumayl ibn Ziyād. Traditionally recited on Thursday nights. Text: duas.org',
  body: 'In the Name of Allah, the All-beneficent, the All-merciful.\n\nO Allah, I ask You by Your mercy, which embraces all things; and by Your strength, through which You dominate all things, and toward which all things are humble and before which all things are lowly; and by Your invincibility, through which You overwhelm all things; and by Your might, which nothing can resist; and by Your tremendousness, which has filled all things; and by Your force, which towers over all things; and by Your face, which subsists after the annihilation of all things; and by Your Names, which have filled the foundations of all things; and by Your knowledge, which encompasses all things; and by the light of Your face, through which all things are illumined!\n\nO Light! O All-holy! O First of those who are first and O Last of those who are last!\n\nO Allah, forgive me those sins which tear apart safeguards! O Allah, forgive me those sins which draw down adversities! O Allah, forgive me those sins which alter blessings! O Allah, forgive me those sins which hold back supplication! O Allah, forgive me those sins which draw down tribulation! O Allah, forgive me every sin I have committed and every mistake I have made!\n\nO Allah, verily I seek nearness to You through remembrance of You, and I seek intercession from You with Yourself, and I ask You through Your munificence to bring me near to Your proximity, and to provide me with gratitude toward You, and to inspire me with Your remembrance.\n\nO Allah, verily I ask You with the asking of a submissive, abased and lowly man to show me forbearance, to have mercy on me and to make me satisfied and content with Your appointment and humble in every state.\n\nO Allah, and I ask You with the asking of one whose indigence is extreme, and who has stated to You in difficulties his need, and whose desire for what is with You has become great.\n\nO Allah, Your force is tremendous, Your place is lofty, Your deception is hidden, Your command is manifest, Your domination is overwhelming, Your power is unhindered, and escape from Your governance is impossible.\n\nO Allah, I find no forgiver of my sins, nor concealer of my ugly acts, nor transformer of any of my ugly acts into good acts but You. There is no god but You! Glory be to You, and Yours is the praise! I have wronged myself, and I have been audacious in my ignorance, and I have depended upon Your ancient remembrance of me and Your favour toward me.\n\nO Allah! O my Protector! How many ugly things You have concealed! How many burdensome tribulations You have abolished! How many stumbles You have prevented! How many ordeals You have repelled! And how much beautiful praise, for which I was unworthy, You have spread abroad!\n\nO Allah, my tribulation is tremendous, my bad state is excessive, my acts are inadequate, my fetters have tied me down, my far-fetched hopes have held me back from my gain, and this world with its delusions, my own soul with its offences, and my delay have deceived me.\n\nO my Master, so I ask You by Your might not to let my evil works and acts veil my supplication from You, not to disgrace me through the hidden things You know of my secrets, and not to hasten me to punishment for what I have done in private — my evil acts in secrecy, my misdeeds, my continuous negligence, my ignorance, my manifold passions and my forgetfulness.\n\nAnd by Your might, O Allah, be kind to me in all states, and be gracious to me in all affairs!\n\nMy God and my Lord! Have I any but You from whom to ask removal of my affliction and regard for my affairs?\n\nMy God and my Protector! You put into effect through me a decree in which I followed the caprice of my own soul and did not remain wary of adorning my enemy. So he deluded me through my soul’s caprice, and therein destiny favoured him. So, in what was put into effect through me in that situation, I transgressed some of Your statutes and disobeyed some of Your commands.\n\nSo Yours is the argument against me in all of that. I have no argument in what Your destiny put into effect through me therein, nor in what Your decree and Your tribulation imposed upon me.\n\nNow I have come to You, my God, after my shortcoming and my immoderation toward myself, proffering my excuse, regretful, broken, apologising, asking forgiveness, repenting, acknowledging, submissive, confessing. I find no place to flee from what occurred through me, nor any place of escape to which I may turn in my affairs, other than Your acceptance of my excuse and Your entering me into the compass of Your mercy.\n\nO Allah, so accept my excuse, have mercy upon the severity of my affliction, and release me from the tightness of my fetters. My Lord, have mercy upon the weakness of my body, the thinness of my skin and the frailty of my bones.\n\nO You who gave rise to my creation, to the remembrance of me, to the nurture of me, to goodness toward me and to nourishment on me — bestow upon me for the sake of Your having given rise to me with generosity and Your previous goodness to me!\n\nO my God, my Master and my Lord! Can You see Yourself tormenting me with Your fire after I have professed Your Unity, and after the knowledge of You my heart has embraced, and the remembrance of You my tongue has constantly mentioned, and the love of You to which my mind has clung, and after the sincerity of my confession and my supplication, humble before Your lordship?\n\nFar be it from You! You are more generous than that You should squander him whom You have nurtured, or banish him whom You have brought nigh, or drive away him whom You have given an abode, or submit to tribulation him whom You have spared and shown mercy.\n\nWould that I knew, my Master, my God and my Protector, whether You will give the Fire dominion over faces fallen down prostrate before Your tremendousness, over tongues voicing sincerely the profession of Your Unity and giving thanks to You in praise, over hearts acknowledging Your divinity through verification, over minds encompassing knowledge of You until they have become humble, and over bodily members speeding to the places of Your worship in obedience and beckoning for Your forgiveness in submission.\n\nNo such opinion is held of You! Nor has such been reported — thanks to Your bounty — concerning You, O All-generous! My Lord! And You know my weakness before a little of this world’s tribulations and punishments, and before those ordeals which befall its inhabitants, even though it is a tribulation and ordeal whose stay is short, whose subsistence is but little and whose period is but fleeting.\n\nSo how can I endure the tribulations of the next world and the great ordeals that occur within it? For it is a tribulation whose period is long, whose station endures and whose sufferers are given no respite, since it only occurs as a result of Your wrath, Your vengeance and Your anger — and these cannot be withstood by the heavens and the earth.\n\nO Master, so how can I — a weak, insignificant, humble, poor and destitute slave of Yours — endure it?\n\nO my God, my Lord, my Master and my Protector! For which things would I complain to You? And for which of them would I lament and weep? For the pain and severity of chastisement? Or for the length and period of tribulation?\n\nSo if You take me to the punishments with Your enemies, and gather me with the people of Your tribulation, and separate me from Your friends and saints — then suppose, my God, my Master, my Protector and my Lord, that I am able to endure Your chastisement: how can I endure separation from You? And suppose that I am able to endure the heat of Your fire: how can I endure not gazing upon Your generosity? Or how can I dwell in the Fire while my hope is Your pardon?\n\nSo by Your might, my Master and my Protector, I swear sincerely: if You leave me with speech, I will lament to You from the midst of the Fire’s inhabitants with the lamentation of the hopeful; I will cry to You with the cry of those crying for help; I will weep to You with the weeping of the bereft; and I will call upon You: Where are You, O Sponsor of the believers, O Goal of the hopes of Your knowers, O Aid of those who seek assistance, O Friend of the hearts of the sincere, and O God of all the world’s inhabitants!\n\nCan You see Yourself — glory be to You, my God, and Yours is the praise — hearing within the Fire the voice of a servant surrendered to You, imprisoned there because of his violations, tasting the flavour of its torment because of his disobedience, and confined within its levels because of his sin and crime, while he laments to You with the lament of one hopeful for Your mercy, and calls to You with the tongue of those who profess Your Unity, and entreats You by Your lordship?\n\nO my Protector, so how should he remain in the chastisement while he has hope for Your previous clemency? Or how should the Fire cause him pain while he expects Your bounty and mercy? Or how should its roaring flames burn him while You hear his voice and see his place? Or how should its groaning encompass him while You know his weakness? Or how should he be convulsed among its levels while You know his sincerity? Or how should its keepers torture him while he calls out to You, O Lord? Or how should he have hope of Your bounty in freeing him from it, while You abandon him within it?\n\nFar be it from You! That is not what is expected of You, nor what is well known of Your bounty, nor is it similar to the goodness and kindness You have shown to those who profess Your Unity.\n\nSo I declare with certainty that, were it not for what You have decreed concerning the chastisement of Your deniers, and what You have foreordained concerning the everlasting home of those who stubbornly resist, You would make the Fire, all of it, coolness and safety, and no one would have a place of rest or abode within it. But You — holy are Your Names — have sworn that You will fill it with the unbelievers, both jinn and men together, and that You will place those who stubbornly resist therein forever.\n\nAnd You — majestic is Your eulogy — said at the beginning, and were gracious through kindness as a favour: “What, is he who has been a believer like unto him who has been ungodly? They are not equal.”\n\nMy God and my Master! So I ask You by the power You have apportioned, and by the decision which You have determined and imposed and through which You have overcome him toward whom it has been put into effect, that You forgive me in this night and at this hour every offence I have committed, and every sin I have performed, and every ugly thing I have concealed, and every folly I have enacted — whether I have hidden or announced it, or I have concealed it or manifested it — and every evil act which You have commanded the Noble Writers to record, those whom You have appointed to watch over what appears from me, and whom You have made, along with my bodily members, witnesses against me. And You were Yourself the Watcher over me from behind them, and the Witness of what is hidden from them. Through Your mercy You concealed it, and through Your bounty You veiled it.\n\nAnd I ask You that You bestow upon me an abundant share of every good You send down, or kindness You confer, or goodness You unfold, or provision You spread out, or sin You forgive, or error You cover.\n\nO Lord! O Lord! O Lord! My God, my Master, my Protector and Owner of my bondage! O He in whose hand is my forelock! O He who knows my affliction and my misery! O He who is aware of my poverty and indigence!\n\nO Lord! O Lord! O Lord! I ask You by Your Truth and Your Holiness, and the greatest of Your attributes and Names, that You make my times in the night and the day inhabited by Your remembrance, joined to Your service, and my works acceptable to You — so that my works and my litanies may all be a single litany, and my occupation with Your service everlasting.\n\nMy Master! O He upon whom I depend! O He to whom I complain about my states! O Lord! O Lord! O Lord! Strengthen my bodily members in Your service, and fortify my ribs in determination, and bestow upon me earnestness in my fear of You, and continuity in my being joined to Your service — so that I may move easily toward You in the battlefields of the foremost, and hurry to You among the prominent, and desire fervently Your proximity among the fervently desirous, and move nearer to You with the nearness of the sincere, and fear You with the fear of those who have certitude, and gather with the believers in Your vicinity.\n\nO Allah, whoever desires evil for me, desire it for him! And whoever deceives me — deceive him! And make me one of the most excellent of Your servants in portion from You, and the nearest of them in station to You, and the most elect of them in proximity to You — for that cannot be attained except by Your bounty.\n\nAnd grant generously to me through Your munificence, and incline toward me with Your splendour, and protect me with Your mercy! And make my tongue remember You without ceasing, and my heart enthralled by Your love! And be gracious to me by answering me favourably, and nullify my slips, and forgive my lapses!\n\nFor You have decreed Your worship for Your servants, and commanded them to supplicate You, and assured them that they would be answered. So toward You, my Lord, I have turned my face, and toward You, my Lord, I have extended my hand. So by Your might, comply with my supplication, and make me attain my desires, and do not sever my hoping for Your favours, and spare me the evil of my enemies from among the jinn and men!\n\nO He whose pleasure is quickly achieved! Forgive him who owns nothing but supplication, for You do what You will.\n\nO He whose Name is a remedy, and whose remembrance is a cure, and whose obedience is wealth! Have mercy upon him whose capital is hope and whose weapon is tears!\n\nO Ample in blessings! O Repeller of adversities! O Light of those who are lonely in the darkness! O Knower who was never taught! Bless Muḥammad and Muḥammad’s household, and do with me what is worthy of You!\n\nAnd may Allah bless His Messenger and the holy Imams of his household, and give them abundant peace!'
}, {
  title: 'Duʿāʾ al-Faraj',
  cat: 'Daily',
  ar: 'إِلٰهِي عَظُمَ الْبَلَاءُ وَبَرِحَ الْخَفَاءُ',
  tr: 'My God, the affliction has grown great and the hidden has become exposed.',
  note: 'A supplication for relief.',
  body: 'My God, the affliction has grown great and the hidden has become exposed, and hopes have folded away, and the earth has narrowed, and the sky has withheld its bounty — and You are the One we seek for help.'
}, {
  title: 'Duʿāʾ al-Ṣabāḥ',
  cat: 'Morning',
  ar: 'اللّٰهُمَّ يَا مَنْ دَلَعَ لِسَانَ الصَّبَاحِ بِنُطْقِ تَبَلُّجِهِ',
  tr: 'O Allah, O You who unfurled the tongue of the morning with the utterance of its dawning.',
  note: 'For the morning hours.',
  body: 'O Allah, O You who unfurled the tongue of the morning with the utterance of its dawning, and sent forth the gusts of night into the gloom of its darkening.'
}, {
  title: 'Munājāt al-Shaʿbāniyya',
  cat: 'Monthly',
  ar: 'إِلٰهِي هَبْ لِي كَمَالَ الِانْقِطَاعِ إِلَيْكَ',
  tr: 'My God, grant me complete devotion to You.',
  note: 'The whispered prayer of Shaʿbān.',
  body: 'My God, grant me complete devotion to You, and illumine the eyes of our hearts with the light of their looking towards You, until they tear through the veils of light and reach the source of grandeur.'
}, {
  title: 'Tasbīḥ al-Zahrāʾ',
  cat: 'Daily',
  ar: 'اللّٰهُ أَكْبَر • سُبْحَانَ اللّٰهِ • الْحَمْدُ لِلّٰهِ',
  tr: 'Allah is the Greatest · Glory be to Allah · All praise is for Allah.',
  note: 'Recited after each obligatory prayer.',
  body: 'Allah is the Greatest (34 times) · Glory be to Allah (33 times) · All praise is for Allah (33 times).'
}];
const ZIYARAT = [{
  title: 'Ziyārat ʿĀshūrāʾ',
  cat: 'Imam Ḥusayn',
  ar: 'السَّلَامُ عَلَيْكَ يَا أَبَا عَبْدِ اللّٰهِ',
  tr: 'Peace be upon you, O Abā ʿAbdillāh.',
  note: 'The renowned salutation of mourning.',
  body: 'Peace be upon you, O Abā ʿAbdillāh, and upon those souls who gathered at your courtyard. Upon you, from me, be the peace of Allah for as long as I remain and as long as there are night and day.'
}, {
  title: 'Ziyārat Wārith',
  cat: 'Imam Ḥusayn',
  ar: 'السَّلَامُ عَلَيْكَ يَا وَارِثَ آدَمَ صَفْوَةِ اللّٰهِ',
  tr: 'Peace be upon you, O inheritor of Ādam, the chosen of Allah.',
  note: '',
  body: 'Peace be upon you, O inheritor of Ādam, the chosen of Allah. Peace be upon you, O inheritor of Nūḥ, the prophet of Allah.'
}, {
  title: 'Ziyārat Amīnullāh',
  cat: 'General',
  ar: 'السَّلَامُ عَلَيْكَ يَا أَمِينَ اللّٰهِ فِي أَرْضِهِ',
  tr: 'Peace be upon you, O trustee of Allah on His earth.',
  note: '',
  body: 'Peace be upon you, O trustee of Allah on His earth, and His proof over His servants. O Allah, make my soul tranquil through Your decree, content with Your apportionment.'
}, {
  title: 'Ziyārat al-Jāmiʿa',
  cat: "The Aʾimmah",
  ar: 'السَّلَامُ عَلَيْكُمْ يَا أَهْلَ بَيْتِ النُّبُوَّةِ',
  tr: 'Peace be upon you, O People of the House of Prophethood.',
  note: 'A comprehensive salutation to the Imams.',
  body: 'Peace be upon you, O People of the House of Prophethood, the place of the message, the descending-place of the angels, and the source of revelation.'
}];
const NAHJ = {
  sermons: [{
    ref: 'Sermon 1',
    title: 'On the Creation',
    sum: 'On the origin of creation and the praise of God.',
    ar: 'الْحَمْدُ لِلّٰهِ الَّذِي لَا يَبْلُغُ مِدْحَتَهُ الْقَائِلُونَ',
    tr: 'Praise is due to Allah whose worth cannot be described by speakers, whose bounties cannot be counted by those who reckon, and whose claim to obedience cannot be satisfied by those who attempt to do so.'
  }, {
    ref: 'Sermon 3',
    title: 'Al-Shiqshiqiyya',
    sum: 'On the matter of succession and leadership.',
    ar: '',
    tr: 'Beware! By Allah, so-and-so dressed himself with the caliphate, and he knew well that my position in relation to it was the same as the position of the axis in relation to the hand-mill.'
  }, {
    ref: 'Sermon 193',
    title: 'On the God-fearing',
    sum: 'A vivid description of the qualities of the righteous.',
    ar: '',
    tr: 'So the God-fearing in it are people of distinction. Their speech is to the point, their dress is moderate, and their gait is humble.'
  }],
  letters: [{
    ref: 'Letter 31',
    title: 'To Imam al-Ḥasan',
    sum: 'Fatherly counsel on life, character and the passage of time.',
    ar: '',
    tr: 'From a father who is fast approaching his end, who has admitted the hardships of the times, who is on his way out of this world — to his son who craves for what cannot be achieved.'
  }, {
    ref: 'Letter 53',
    title: 'To Mālik al-Ashtar',
    sum: 'A charter of just and merciful governance.',
    ar: '',
    tr: 'Let the dearest of your treasuries be the treasury of righteous action. Habituate your heart to mercy for the subjects and to affection and kindness for them.'
  }],
  sayings: [{
    ref: 'Saying 1',
    title: 'On Civil Strife',
    sum: '',
    ar: '',
    tr: 'During civil disturbance be like an adolescent camel who has neither a back strong enough for riding nor udders for milking.'
  }, {
    ref: 'Saying 147',
    title: 'On Knowledge',
    sum: '',
    ar: '',
    tr: 'Knowledge is better than wealth. Knowledge guards you, while you have to guard wealth. Wealth decreases by spending, while knowledge multiplies by it.'
  }]
};
const PINNED_CLASSIFIED = {
  name: 'SoftEire Technology Limited',
  cat: 'Services',
  desc: 'SoftEire helps Irish SMEs use AI to reduce labour cost, automate customer support, and save money. Call us today for a free business audit.',
  loc: 'Dublin',
  web: 'https://www.softeire.com',
  phone: '+353892703646',
  wa: '353892281688',
  ink: '#3a4a78',
  tint: '#e8ebf4'
};

const CLASSIFIEDS = [{
  name: 'Al-Noor Halal Grocery',
  cat: 'Food',
  desc: 'Fresh produce, halal essentials & imported goods.',
  loc: 'Blanchardstown, Dublin 15',
  web: 'https://example.com',
  phone: '+353 1 234 5678',
  wa: '35312345678',
  ink: '#1f5145',
  tint: '#e6efe9'
}, {
  name: 'Dublin Halal Meats',
  cat: 'Butcher',
  desc: 'Zabīḥa halal meat, fresh daily. Bulk orders welcome.',
  loc: 'Clondalkin, Dublin 22',
  phone: '+353 1 567 8901',
  wa: '35315678901',
  ink: '#6e2230',
  tint: '#f3e6e8'
}, {
  name: 'Karbala Travel',
  cat: 'Travel',
  desc: 'Ziyārat & Ḥajj packages, flights and visas.',
  loc: 'City Centre, Dublin 1',
  web: 'https://example.com',
  phone: '+353 1 890 1234',
  wa: '35318901234',
  ink: '#7d6220',
  tint: '#f3ecd9'
}, {
  name: 'Zahrā Tutoring',
  cat: 'Education',
  desc: 'Maths & English tuition, primary to Leaving Cert.',
  loc: 'Cork',
  phone: '+353 21 234 5678',
  wa: '353212345678',
  ink: '#2c5d52',
  tint: '#e6efe9'
}, {
  name: 'Crescent Accounting',
  cat: 'Services',
  desc: 'Bookkeeping, tax returns & small-business advice.',
  loc: 'Limerick',
  web: 'https://example.com',
  phone: '+353 61 234 5678',
  wa: '353612345678',
  ink: '#3a4a78',
  tint: '#e8ebf4'
}];

/* ── ICONS ── */
/* ── ICONS ──
   Path data copied verbatim from github.com/lucide-icons/lucide (ISC licence),
   kept as raw markup so swapping an icon later is a straight copy-paste from the
   upstream file. icon() supplies Lucide's own drawing defaults: 24-unit box,
   no fill, 2-unit round-capped stroke.
   WhatsApp is not here — Lucide ships no brand marks, so that button keeps its
   own glyph, which users need to recognise anyway. */
const LUCIDE = {
  'house': '<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8" /><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />',
  'graduation-cap': '<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" /><path d="M22 10v6" /><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" />',
  'book-open': '<path d="M12 5v16" /><path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z" />',
  'circle-dot-dashed': '<path d="M10.1 2.18a9.93 9.93 0 0 1 3.8 0" /><path d="M17.6 3.71a9.95 9.95 0 0 1 2.69 2.7" /><path d="M21.82 10.1a9.93 9.93 0 0 1 0 3.8" /><path d="M20.29 17.6a9.95 9.95 0 0 1-2.7 2.69" /><path d="M13.9 21.82a9.94 9.94 0 0 1-3.8 0" /><path d="M6.4 20.29a9.95 9.95 0 0 1-2.69-2.7" /><path d="M2.18 13.9a9.93 9.93 0 0 1 0-3.8" /><path d="M3.71 6.4a9.95 9.95 0 0 1 2.7-2.69" /><circle cx="12" cy="12" r="1" />',
  'ellipsis': '<circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" />',
  'moon': '<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />',
  'bell': '<path d="M10.268 21a2 2 0 0 0 3.464 0" /><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />',
  'search': '<path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" />',
  'share-2': '<circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" x2="15.42" y1="13.51" y2="17.49" /><line x1="15.41" x2="8.59" y1="6.51" y2="10.49" />',
  'bookmark': '<path d="M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z" />',
  'map-pin': '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" /><circle cx="12" cy="10" r="3" />',
  'phone': '<path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />',
  'globe': '<circle cx="12" cy="12" r="10" /><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" /><path d="M2 12h20" />',
  'check': '<path d="M20 6 9 17l-5-5" />',
  'wifi-off': '<path d="M12 20h.01" /><path d="M8.5 16.429a5 5 0 0 1 7 0" /><path d="M5 12.859a10 10 0 0 1 5.17-2.69" /><path d="M19 12.859a10 10 0 0 0-2.007-1.523" /><path d="M2 8.82a15 15 0 0 1 4.177-2.643" /><path d="M22 8.82a15 15 0 0 0-11.288-3.764" /><path d="m2 2 20 20" />',
  'log-out': '<path d="m16 17 5-5-5-5" /><path d="M21 12H9" /><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />',
  'calendar': '<path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" />',
  'clock': '<circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" />',
  'sunrise': '<path d="M12 2v8" /><path d="m4.93 10.93 1.41 1.41" /><path d="M2 18h2" /><path d="M20 18h2" /><path d="m19.07 10.93-1.41 1.41" /><path d="M22 22H2" /><path d="m8 6 4-4 4 4" /><path d="M16 18a4 4 0 0 0-8 0" />',
  'sun': '<circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" />',
  'sunset': '<path d="M12 10V2" /><path d="m4.93 10.93 1.41 1.41" /><path d="M2 18h2" /><path d="M20 18h2" /><path d="m19.07 10.93-1.41 1.41" /><path d="M22 22H2" /><path d="m16 6-4 4-4-4" /><path d="M16 18a4 4 0 0 0-8 0" />',
  'moon-star': '<path d="M18 5h4" /><path d="M20 3v4" /><path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />',
  'star': '<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />',
  'book-heart': '<path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /><path d="M8.62 9.8A2.25 2.25 0 1 1 12 6.836a2.25 2.25 0 1 1 3.38 2.966l-2.626 2.856a.998.998 0 0 1-1.507 0z" />',
  'target': '<circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" />',
  'heart': '<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />',
  'trash-2': '<path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />'
};
const icon = (name, o = {}) => React.createElement('svg', {
  width: o.size || 20,
  height: o.size || 20,
  viewBox: '0 0 24 24',
  fill: o.fill || 'none',
  stroke: o.stroke || 'currentColor',
  strokeWidth: o.sw || 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  style: o.style,
  dangerouslySetInnerHTML: { __html: LUCIDE[name] || '' }
});

const NAV_ICONS = {
  home: LUCIDE.house,
  prayer: LUCIDE.moon,
  madrasa: LUCIDE['graduation-cap'],
  library: LUCIDE['book-open'],
  stories: LUCIDE['circle-dot-dashed'],
  more: LUCIDE.ellipsis
};

/* ── CUSTOM SELECT ── */
class CustomSelect extends Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      open: false
    });
    _defineProperty(this, "close", () => this.setState({
      open: false
    }));
  }
  componentDidMount() {
    document.addEventListener('click', this.close);
  }
  componentWillUnmount() {
    document.removeEventListener('click', this.close);
  }
  render() {
    const {
      value,
      options,
      onChange,
      muted
    } = this.props;
    const {
      open
    } = this.state;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      },
      onClick: e => e.stopPropagation()
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState(s => ({
        open: !s.open
      })),
      style: {
        border: `1px solid ${open ? '#1f5145' : 'rgba(203,195,178,.75)'}`,
        background: NEU.surf, boxShadow: neuUp(),
        borderRadius: 13,
        padding: '13px 15px',
        fontSize: 15,
        color: muted ? '#6b6252' : '#2c2823',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none'
      }
    }, /*#__PURE__*/React.createElement("span", null, value), /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#6b6252',
        fontSize: 11,
        marginLeft: 8,
        transform: open ? 'rotate(180deg)' : 'none',
        transition: 'transform .15s'
      }
    }, "▾")), open && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 'calc(100% + 4px)',
        left: 0,
        right: 0,
        background: NEU.surf,
        border: NEU.edge,
        borderRadius: 13,
        zIndex: 30,
        overflow: 'hidden',
        boxShadow: neuUp(1.1)
      }
    }, options.map(opt => /*#__PURE__*/React.createElement("div", {
      key: opt,
      onClick: () => {
        onChange(opt);
        this.setState({
          open: false
        });
      },
      style: {
        padding: '12px 15px',
        fontSize: 14.5,
        color: opt === value ? '#1f5145' : '#2c2823',
        fontWeight: opt === value ? 600 : 400,
        background: opt === value ? '#f3f7f4' : 'transparent',
        cursor: 'pointer'
      }
    }, opt))));
  }
}

/* ── TRANSLATIONS ── */
const STRINGS = {
  'nav.home': {
    English: 'Home',
    'العربية': 'الرئيسية',
    'हिन्दी': 'होम',
    'فارسی': 'خانه',
    Urdu: 'ہوم'
  },
  'nav.prayer': {
    English: 'Prayer',
    'العربية': 'الصلاة',
    'हिन्दी': 'नमाज़',
    'فارسی': 'نماز',
    Urdu: 'نماز'
  },
  'nav.madrasa': {
    English: 'Madrasa',
    'العربية': 'المدرسة',
    'हिन्दी': 'मदरसा',
    'فارسی': 'مدرسه',
    Urdu: 'مدرسہ'
  },
  'nav.library': {
    English: 'Library',
    'العربية': 'المكتبة',
    'हिन्दी': 'पुस्तकालय',
    'فارسی': 'کتابخانه',
    Urdu: 'کتب خانہ'
  },
  'nav.updates': {
    English: 'Updates',
    'العربية': 'الأخبار',
    'हिन्दी': 'अपडेट',
    'فارسی': 'اخبار',
    Urdu: 'خبریں'
  },
  'nav.more': {
    English: 'More',
    'العربية': 'المزيد',
    'हिन्दी': 'अधिक',
    'فارسی': 'بیشتر',
    Urdu: 'مزید'
  },
  'home.nextPrayer': {
    English: 'Next Prayer',
    'العربية': 'الصلاة القادمة',
    'हिन्दी': 'अगली नमाज़',
    'فارسی': 'نماز بعدی',
    Urdu: 'اگلی نماز'
  },
  'home.in': {
    English: 'in',
    'العربية': 'بعد',
    'हिन्दी': 'में',
    'فارسی': 'در',
    Urdu: 'میں'
  },
  'home.explore': {
    English: 'Explore',
    'العربية': 'استكشف',
    'हिन्दी': 'अन्वेषण',
    'فارسی': 'کاوش',
    Urdu: 'دریافت'
  },
  'home.classTitle': {
    English: 'Classifieds',
    'العربية': 'الإعلانات',
    'हिन्दी': 'विज्ञापन',
    'فارسی': 'آگهی‌ها',
    Urdu: 'اشتہارات'
  },
  'home.classSub': {
    English: 'Community businesses & listings',
    'العربية': 'أعمال ومشاريع المجتمع',
    'हिन्दी': 'सामुदायिक व्यवसाय',
    'فارسی': 'کسب‌وکارهای جامعه',
    'Urdu': 'کمیونٹی کاروبار'
  },
  'home.sponsored': {
    English: 'Sponsored',
    'العربية': 'إعلان',
    'हिन्दी': 'प्रायोजित',
    'فارسی': 'حامی',
    'Urdu': 'اشتہار'
  },
  'home.installTitle': {
    English: 'Install the app',
    'العربية': 'تثبيت التطبيق',
    'हिन्दी': 'ऐप इंस्टॉल करें',
    'فارسی': 'نصب برنامه',
    'Urdu': 'ایپ انسٹال کریں'
  },
  'home.installSub': {
    English: 'Add to your home screen for offline access.',
    'العربية': 'أضفه للشاشة الرئيسية للوصول دون إنترنت',
    'हिन्दी': 'ऑफलाइन एक्सेस के लिए होम स्क्रीन पर जोड़ें',
    'فارسی': 'برای دسترسی آفلاین به صفحه اصلی اضافه کنید',
    'Urdu': 'آف لائن رسائی کے لیے ہوم اسکرین پر شامل کریں'
  },
  'home.add': {
    English: 'Add',
    'العربية': 'أضف',
    'हिन्दी': 'जोड़ें',
    'فارسی': 'اضافه کنید',
    Urdu: 'شامل کریں'
  },
  'prayer.title': {
    English: 'Prayer Times',
    'العربية': 'أوقات الصلاة',
    'हिन्दी': 'नमाज़ का समय',
    'فارسی': 'اوقات نماز',
    Urdu: 'اوقات نماز'
  },
  'prayer.today': {
    English: 'Today',
    'العربية': 'اليوم',
    'हिन्दी': 'आज',
    'فارسی': 'امروز',
    Urdu: 'آج'
  },
  'prayer.monthly': {
    English: 'Monthly',
    'العربية': 'الشهري',
    'हिन्दी': 'मासिक',
    'فارسی': 'ماهانه',
    Urdu: 'ماہانہ'
  },
  'prayer.settings': {
    English: 'Settings',
    'العربية': 'الإعدادات',
    'हिन्दी': 'सेटिंग',
    'فارسی': 'تنظیمات',
    Urdu: 'ترتیبات'
  },
  'prayer.beginsIn': {
    English: 'begins in',
    'العربية': 'يبدأ خلال',
    'हिन्दी': 'में शुरू होता है',
    'فارسی': 'شروع می‌شود در',
    Urdu: 'شروع ہونے میں'
  },
  'prayer.source': {
    English: 'Prayer Time Source',
    'العربية': 'مصدر أوقات الصلاة',
    'हिन्दी': 'नमाज़ स्रोत',
    'فارسی': 'منبع اوقات نماز',
    'Urdu': 'نماز کا ذریعہ'
  },
  'prayer.alerts': {
    English: 'Prayer Alerts',
    'العربية': 'تنبيهات الصلاة',
    'हिन्दी': 'नमाज़ अलर्ट',
    'فارسی': 'هشدارهای نماز',
    Urdu: 'نماز کے اطلاعات'
  },
  'prayer.adhan': {
    English: 'Adhan (Prayer Call)',
    'العربية': 'الأذان',
    'हिन्दी': 'अज़ान',
    'فارسی': 'اذان',
    'Urdu': 'اذان'
  },
  'prayer.adhanSub': {
    English: 'Plays audio at prayer time',
    'العربية': 'يشغّل الصوت وقت الصلاة',
    'हिन्दी': 'नमाज़ के समय ऑडियो',
    'فارسی': 'صدا در وقت نماز',
    'Urdu': 'نماز کے وقت آواز'
  },
  'prayer.adhanSound': {
    English: 'Adhan Sound',
    'العربية': 'صوت الأذان',
    'हिन्दी': 'अज़ान की आवाज़',
    'فارسی': 'صدای اذان',
    'Urdu': 'اذان کی آواز'
  },
  'prayer.notif': {
    English: 'Prayer Notifications',
    'العربية': 'إشعارات الصلاة',
    'हिन्दी': 'नमाज़ सूचनाएं',
    'فارسی': 'اعلان‌های نماز',
    Urdu: 'نماز کی اطلاعات'
  },
  'prayer.notifSub': {
    English: 'On-screen alert at each salāh',
    'العربية': 'تنبيه على الشاشة لكل صلاة',
    'हिन्दी': 'हर नमाज़ पर स्क्रीन अलर्ट',
    'فارسی': 'هشدار روی صفحه برای هر نماز',
    'Urdu': 'ہر نماز پر اسکرین الرٹ'
  },
  'prayer.allowNotif': {
    English: 'Allow Notifications',
    'العربية': 'اسمح بالإشعارات',
    'हिन्दी': 'सूचनाओं की अनुमति दें',
    'فارسی': 'مجوز اعلان‌ها',
    'Urdu': 'اطلاعات کی اجازت دیں'
  },
  'prayer.testAdhan': {
    English: '▶ Test Adhan',
    'العربية': '◀ اختبار الأذان',
    'हिन्दी': '▶ अज़ान परीक्षण',
    'فارسی': '▶ آزمایش اذان',
    Urdu: '▶ اذان ٹیسٹ'
  },
  'prayer.stop': {
    English: '■ Stop',
    'العربية': '■ إيقاف',
    'हिन्दी': '■ रोकें',
    'فارسی': '■ توقف',
    Urdu: '■ بند کریں'
  },
  'prayer.pdf': {
    English: 'Yearly prayer calendar',
    'العربية': 'التقويم السنوي للصلاة',
    'हिन्दी': 'वार्षिक नमाज़ कैलेंडर',
    'فارسی': 'تقویم سالانه نماز',
    'Urdu': 'سالانہ نماز کیلنڈر'
  },
  'prayer.pdfSub': {
    English: 'Download the full 1447 timetable',
    'العربية': 'تنزيل جدول 1447 كاملاً',
    'हिन्दी': 'पूरी 1447 समय-सारणी डाउनलोड करें',
    'فارسی': 'دانلود جدول کامل ۱۴۴۷',
    'Urdu': 'مکمل 1447 جدول ڈاؤنلوڈ کریں'
  },
  'prayer.date': {
    English: 'Date',
    'العربية': 'التاريخ',
    'हिन्दी': 'तारीख',
    'فارسی': 'تاریخ',
    Urdu: 'تاریخ'
  },
  'prayer.noNotif': {
    English: 'Notifications not supported on this browser.',
    'العربية': 'الإشعارات غير مدعومة',
    'हिन्दी': 'इस ब्राउज़र पर सूचनाएं समर्थित नहीं',
    'فارسی': 'اعلان‌ها در این مرورگر پشتیبانی نمی‌شوند',
    'Urdu': 'اس براؤزر پر اطلاعات کا تعاون نہیں'
  },
  'prayer.note': {
    English: 'Following Ahlul-Bait Ireland prayer timing. Times calculated for Dublin, Ireland.',
    'العربية': 'وفق أوقات أهل البيت إيرلندا. الأوقات محسوبة لدبلن، إيرلندا.',
    'हिन्दी': 'अहलुल-बैत आयरलैंड के नमाज़ समय के अनुसार। डबलिन के लिए गणना।',
    'فارسی': 'بر اساس اوقات نماز اهل‌بیت ایرلند. محاسبه شده برای دوبلین.',
    'Urdu': 'اہل البیت آئرلینڈ کے اوقات کے مطابق۔ ڈبلن، آئرلینڈ کے لیے محاسبہ۔'
  },
  'lib.header': {
    English: 'Library',
    'العربية': 'المكتبة',
    'हिन्दी': 'पुस्तकालय',
    'فارسی': 'کتابخانه',
    Urdu: 'کتب خانہ'
  },
  'lib.search': {
    English: 'Search titles & translations',
    'العربية': 'بحث عن العناوين والترجمات',
    'हिन्दी': 'शीर्षक और अनुवाद खोजें',
    'فارسی': 'جستجوی عناوین و ترجمه‌ها',
    'Urdu': 'عنوانات و تراجم تلاش کریں'
  },
  'lib.translation': {
    English: 'Translation',
    'العربية': 'الترجمة',
    'हिन्दी': 'अनुवाद',
    'فارسی': 'ترجمه',
    Urdu: 'ترجمہ'
  },
  'lib.summary': {
    English: 'Summary',
    'العربية': 'الملخص',
    'हिन्दी': 'सारांश',
    'فارسی': 'خلاصه',
    Urdu: 'خلاصہ'
  },
  'lib.share': {
    English: 'Share',
    'العربية': 'شارك',
    'हिन्दी': 'शेयर करें',
    'فارسی': 'اشتراک‌گذاری',
    Urdu: 'شیئر کریں'
  },
  'lib.back': {
    English: 'Library',
    'العربية': 'المكتبة',
    'हिन्दी': 'पुस्तकालय',
    'فارسی': 'کتابخانه',
    Urdu: 'کتب خانہ'
  },
  'lib.all': {
    English: 'All',
    'العربية': 'الكل',
    'हिन्दी': 'सब',
    'فارسی': 'همه',
    Urdu: 'سب'
  },
  'class.community': {
    English: 'Community',
    'العربية': 'المجتمع',
    'हिन्दी': 'समुदाय',
    'فارسی': 'جامعه',
    Urdu: 'کمیونٹی'
  },
  'class.title': {
    English: 'Classifieds',
    'العربية': 'الإعلانات',
    'हिन्दी': 'विज्ञापन',
    'فارسی': 'آگهی‌ها',
    Urdu: 'اشتہارات'
  },
  'class.search': {
    English: 'Search businesses',
    'العربية': 'البحث عن الأعمال',
    'हिन्दी': 'व्यवसाय खोजें',
    'فارسی': 'جستجوی کسب‌وکارها',
    'Urdu': 'کاروبار تلاش کریں'
  },
  'class.whatsapp': {
    English: 'WhatsApp',
    'العربية': 'واتساب',
    'हिन्दी': 'WhatsApp',
    'فارسی': 'واتساپ',
    Urdu: 'واٹس ایپ'
  },
  'class.call': {
    English: 'Call',
    'العربية': 'اتصل',
    'हिन्दी': 'कॉल करें',
    'فارسی': 'تماس',
    Urdu: 'کال کریں'
  },
  'class.all': {
    English: 'All',
    'العربية': 'الكل',
    'हिन्दी': 'सब',
    'فارسی': 'همه',
    Urdu: 'سب'
  },
  'class.disclaimer': {
    English: 'Listings are shared for community information only. Ahlul Bayt Ireland does not endorse individual businesses.',
    'العربية': 'القوائم لأغراض إعلامية فقط. لا تؤيد أهل البيت إيرلندا الأعمال الفردية.',
    'हिन्दी': 'यह सूचियाँ केवल सामुदायिक जानकारी के लिए हैं।',
    'فارسی': 'این آگهی‌ها صرفاً برای اطلاع‌رسانی جامعه است.',
    'Urdu': 'یہ اشتہارات صرف معلوماتی مقاصد کے لیے ہیں۔ اہل البیت آئرلینڈ کسی کاروبار کی حمایت نہیں کرتا۔'
  },
  'cal.community': {
    English: 'Community',
    'العربية': 'المجتمع',
    'हिन्दी': 'समुदाय',
    'فارسی': 'جامعه',
    Urdu: 'کمیونٹی'
  },
  'cal.title': {
    English: 'Calendar',
    'العربية': 'التقويم',
    'हिन्दी': 'कैलेंडर',
    'فارسی': 'تقویم',
    Urdu: 'کیلنڈر'
  },
  'cal.hasEvent': {
    English: 'Has event',
    'العربية': 'له حدث',
    'हिन्दी': 'कार्यक्रम है',
    'فارسی': 'رویداد دارد',
    Urdu: 'تقریب ہے'
  },
  'cal.noEvent': {
    English: 'No events today',
    'العربية': 'لا توجد فعاليات اليوم',
    'हिन्दी': 'आज कोई कार्यक्रम नहीं',
    'فارسی': 'رویدادی امروز نیست',
    'Urdu': 'آج کوئی تقریب نہیں'
  },
  'cal.upcoming': {
    English: 'Upcoming Reminders',
    'العربية': 'التذكيرات القادمة',
    'हिन्दी': 'आगामी रिमाइंडर',
    'فارسی': 'یادآوری‌های آینده',
    'Urdu': 'آنے والی یاد دہانیاں'
  },
  'kids.title': {
    English: 'Kids Corner',
    'العربية': 'ركن الأطفال',
    'हिन्दी': 'बच्चों का कोना',
    'فارسی': 'گوشه کودکان',
    Urdu: 'بچوں کا کونا'
  },
  'kids.videos': {
    English: 'Videos',
    'العربية': 'مقاطع',
    'हिन्दी': 'वीडियो',
    'فارسی': 'ویدیوها',
    Urdu: 'ویڈیوز'
  },
  'kids.books': {
    English: 'Madrasa',
    'العربية': 'المدرسة',
    'हिन्दी': 'मदरसा',
    'فارسی': 'مدرسه',
    Urdu: 'مدرسہ'
  },
  'kids.wisdom': {
    English: 'Wisdom',
    'العربية': 'حكمة',
    'हिन्दी': 'ज्ञान',
    'فارسی': 'حکمت',
    Urdu: 'حکمت'
  },
  'kids.play': {
    English: 'Play',
    'العربية': 'تشغيل',
    'हिन्दी': 'चलाएं',
    'فارسی': 'پخش',
    Urdu: 'چلائیں'
  },
  'qibla.title': {
    English: 'Qibla Finder',
    'العربية': 'حاسب القبلة',
    'हिन्दी': 'क़िबला खोजक',
    'فارسی': 'یاب‌قبله',
    Urdu: 'قبلہ تلاش کنندہ'
  },
  'qibla.detecting': {
    English: 'Detecting location…',
    'العربية': 'جارٍ تحديد الموقع…',
    'हिन्दी': 'स्थान पहचाना जा रहा है…',
    'فارسی': 'در حال تشخیص موقعیت…',
    'Urdu': 'مقام معلوم ہو رہا ہے…'
  },
  'qibla.distance': {
    English: 'Distance to Kaaba',
    'العربية': 'المسافة إلى الكعبة',
    'हिन्दी': 'काबा से दूरी',
    'فارسی': 'فاصله تا کعبه',
    Urdu: 'کعبہ کا فاصلہ'
  },
  'qibla.allow': {
    English: 'Allow location access',
    'العربية': 'السماح بالوصول إلى الموقع',
    'हिन्दी': 'स्थान की अनुमति दें',
    'فارسی': 'دسترسی به موقعیت را مجاز کنید',
    'Urdu': 'مقام تک رسائی دیں'
  },
  'qibla.unsupported': {
    English: 'Geolocation not supported on this device',
    'العربية': 'تحديد الموقع غير مدعوم',
    'हिन्दी': 'इस डिवाइस पर जियोलोकेशन समर्थित नहीं',
    'فارسی': 'موقعیت‌یابی در این دستگاه پشتیبانی نمی‌شود',
    'Urdu': 'یہ آلہ جغرافیائی تعین کی حمایت نہیں کرتا'
  },
  'qibla.error': {
    English: 'Could not detect location. Allow access in browser settings.',
    'العربية': 'تعذّر تحديد موقعك. السماح بالوصول في إعدادات المتصفح',
    'हिन्दी': 'स्थान पहचाना नहीं जा सका। ब्राउज़र सेटिंग में अनुमति दें।',
    'فارسی': 'موقعیت شناسایی نشد. در تنظیمات مرورگر مجوز دهید.',
    'Urdu': 'مقام معلوم نہ ہو سکا۔ براؤزر ترتیبات میں رسائی کی اجازت دیں'
  },
  'more.title': {
    English: 'More',
    'العربية': 'المزيد',
    'हिन्दी': 'अधिक',
    'فارسی': 'بیشتر',
    Urdu: 'مزید'
  },
  'more.calendar': {
    English: 'Calendar & Events',
    'العربية': 'التقويم والفعاليات',
    'हिन्दी': 'कैलेंडर और कार्यक्रम',
    'فارسی': 'تقویم و رویدادها',
    'Urdu': 'کیلنڈر اور تقاریب'
  },
  'more.calSub': {
    English: 'Hijri dates and community events',
    'العربية': 'التواريخ الهجرية والفعاليات',
    'हिन्दी': 'हिजरी तारीखें और सामुदायिक कार्यक्रम',
    'فارسی': 'تاریخ‌های هجری و رویدادهای جامعه',
    'Urdu': 'ہجری تاریخیں اور تقاریب'
  },
  'more.kids': {
    English: 'Kids Corner',
    'العربية': 'ركن الأطفال',
    'हिन्दी': 'बच्चों का कोना',
    'فارسی': 'گوشه کودکان',
    Urdu: 'بچوں کا کونا'
  },
  'more.kidsSub': {
    English: 'Books, videos & quizzes for children',
    'العربية': 'كتب وفيديوهات واختبارات للأطفال',
    'हिन्दी': 'बच्चों के लिए किताबें, वीडियो और क्विज़',
    'فارسی': 'کتاب، ویدیو و آزمون برای کودکان',
    'Urdu': 'بچوں کے لیے کتابیں، ویڈیوز اور کوئز'
  },
  'more.qibla': {
    English: 'Qibla Finder',
    'العربية': 'حاسب القبلة',
    'हिन्दी': 'क़िबला खोजक',
    'فارسی': 'یاب‌قبله',
    Urdu: 'قبلہ تلاش کنندہ'
  },
  'more.qiblaSub': {
    English: 'Find the direction to Makkah',
    'العربية': 'اعثر على اتجاه مكة المكرمة',
    'हिन्दी': 'मक्का की दिशा जानें',
    'فارسی': 'جهت مکه را بیابید',
    'Urdu': 'مکہ کی سمت معلوم کریں'
  },
  'more.classifieds': {
    English: 'Classifieds',
    'العربية': 'الإعلانات',
    'हिन्दी': 'विज्ञापन',
    'فارسی': 'آگهی‌ها',
    Urdu: 'اشتہارات'
  },
  'more.classSub': {
    English: 'Community business listings',
    'العربية': 'قوائم أعمال المجتمع',
    'हिन्दी': 'सामुदायिक व्यवसाय सूचियाँ',
    'فارسی': 'فهرست کسب‌وکارهای جامعه',
    'Urdu': 'کمیونٹی کاروباری فہرست'
  },
  'more.admin': {
    English: 'Admin Dashboard',
    'العربية': 'لوحة الإدارة',
    'हिन्दी': 'एडमिन डैशबोर्ड',
    'فارسی': 'داشبورد مدیریت',
    Urdu: 'ایڈمن ڈیش بورڈ'
  },
  'more.adminSub': {
    English: 'Manage content (staff)',
    'العربية': 'إدارة المحتوى (للعاملين)',
    'हिन्दी': 'सामग्री प्रबंधन (स्टाफ)',
    'فارسی': 'مدیریت محتوا (کارمندان)',
    'Urdu': 'مواد کا انتظام (عملہ)'
  },
  'more.about': {
    English: 'About & Install',
    'العربية': 'حول وتثبيت',
    'हिन्दी': 'के बारे में और इंस्टॉल',
    'فارسی': 'درباره و نصب',
    Urdu: 'بارے میں اور انسٹال'
  },
  'more.aboutSub': {
    English: 'Add Ahlul Bayt Ireland to home screen',
    'العربية': 'أضف أهل البيت إيرلندا للشاشة الرئيسية',
    'हिन्दी': 'होम स्क्रीन पर जोड़ें',
    'فارسی': 'به صفحه اصلی اضافه کنید',
    Urdu: 'ہوم اسکرین پر شامل کریں'
  },
  'more.offline': {
    English: 'Offline Mode',
    'العربية': 'وضع عدم الاتصال',
    'हिन्दी': 'ऑफलाइन मोड',
    'فارسی': 'حالت آفلاین',
    Urdu: 'آف لائن موڈ'
  },
  'more.offlineSub': {
    English: 'Preview the offline fallback',
    'العربية': 'معاينة وضع عدم الاتصال',
    'हिन्दी': 'ऑफलाइन मोड का पूर्वावलोकन',
    'فارسی': 'پیش‌نمایش حالت آفلاین',
    'Urdu': 'آف لائن موڈ کا جائزہ'
  },
  'more.language': {
    English: 'App Language',
    'العربية': 'لغة التطبيق',
    'हिन्दी': 'ऐप भाषा',
    'فارسی': 'زبان برنامه',
    'Urdu': 'ایپ کی زبان'
  },
  'more.health': {
    English: 'Health & Wellness',
    'العربية': 'الصحة والعافية',
    'हिन्दी': 'स्वास्थ्य और कल्याण',
    'فارسی': 'سلامت و بهزیستی',
    Urdu: 'صحت اور تندرستی'
  },
  'more.healthSub': {
    English: 'Tips, videos & community wellness',
    'العربية': 'نصائح وفيديوهات وصحة المجتمع',
    'हिन्दी': 'सुझाव, वीडियो और सामुदायिक कल्याण',
    'فارسی': 'نکات، ویدیوها و سلامت جامعه',
    Urdu: 'صحت کے مشورے اور ویڈیوز'
  },
  'more.reading': {
    English: 'Reading Settings',
    'العربية': 'إعدادات القراءة',
    'हिन्दी': 'पठन सेटिंग',
    'فارسی': 'تنظیمات خواندن',
    'Urdu': 'پڑھنے کی ترتیبات'
  },
  'more.dark': {
    English: 'Dark Mode',
    'العربية': 'الوضع الداكن',
    'हिन्दी': 'डार्क मोड',
    'فارسی': 'حالت تاریک',
    Urdu: 'ڈارک موڈ'
  },
  'more.largeText': {
    English: 'Large Text',
    'العربية': 'نص كبير',
    'हिन्दी': 'बड़ा टेक्स्ट',
    'فارسی': 'متن بزرگ',
    Urdu: 'بڑا متن'
  }
};

/* ── CONTENT STORAGE ── */
function lsGet(key, def) {
  try {
    const v = localStorage.getItem('abi_' + key);
    return v ? JSON.parse(v) : def;
  } catch (e) {
    return def;
  }
}
function lsSet(key, val) {
  try {
    localStorage.setItem('abi_' + key, JSON.stringify(val));
  } catch (e) {}
}

/* ── SAVED PASSAGES ──
   Bookmarks and favourites go to IndexedDB rather than localStorage: they are a
   growing structured collection, not a preference, and a heavy reader would eat
   into the quota the rest of the app shares. localStorage keeps a mirror so the
   first paint has rows to draw before IDB opens, and so the feature still works
   where IDB is refused — private windows on older iOS. Records are flat and
   self-describing, so a backup file is a JSON.stringify away. */
const SAVED_DB = 'abi-saved';
const SAVED_STORE = 'marks';
let savedDbPromise = null;
function savedDb() {
  if (savedDbPromise) return savedDbPromise;
  savedDbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('no indexeddb'));
    const req = indexedDB.open(SAVED_DB, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(SAVED_STORE)) {
        const os = db.createObjectStore(SAVED_STORE, { keyPath: 'id' });
        os.createIndex('kind', 'kind');
        os.createIndex('contentId', 'contentId');
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  savedDbPromise.catch(() => { savedDbPromise = null; });
  return savedDbPromise;
}
function savedStore(mode) {
  return savedDb().then(db => db.transaction(SAVED_STORE, mode).objectStore(SAVED_STORE));
}
function savedReadAll() {
  return savedStore('readonly').then(os => new Promise((res, rej) => {
    const r = os.getAll();
    r.onsuccess = () => res(r.result || []);
    r.onerror = () => rej(r.error);
  }));
}
function savedPut(rec) {
  return savedStore('readwrite').then(os => { os.put(rec); }).catch(() => {});
}
function savedDelete(ids) {
  return savedStore('readwrite').then(os => { ids.forEach(id => os.delete(id)); }).catch(() => {});
}
/* A short stable hash of the text itself. Passage identity has to survive the
   library being re-ordered or renumbered upstream, which an array index cannot:
   a saved line must still be the same line after the admin edits the item. */
function abiHash(v) {
  const t = String(v == null ? '' : v).replace(/\s+/g, ' ').trim();
  let h = 5381;
  for (let i = 0; i < t.length; i++) h = (h * 33 ^ t.charCodeAt(i)) >>> 0;
  return h.toString(36);
}
function contentKey(type, item) {
  if (!item) return '';
  const base = type || 'x';
  return item.id != null && item.id !== '' ? base + ':i' + item.id : base + ':h' + abiHash(item.title);
}
const passageKey = abiHash;
function markId(kind, contentId, lineId) {
  return kind + '|' + contentId + '|' + (lineId || 'all');
}
const CONTENT_KIND = {
  dua: 'Du\u02bf\u0101\u02be',
  ziyarah: 'Ziy\u0101rah',
  aamal: 'Daily Amaal',
  nahj: 'Books'
};

/* ── QUIZ DIFFICULTY ── */
const QUIZ_LEVELS = [
  { key: 'beginner', label: 'Beginner', color: '#2c5d52' },
  { key: 'intermediate', label: 'Intermediate', color: '#7d6220' },
  { key: 'advanced', label: 'Advanced', color: '#6e2230' }
];
const quizLevel = q => {
  const k = String((q && q.level) || 'beginner').toLowerCase();
  return QUIZ_LEVELS.some(l => l.key === k) ? k : 'beginner';
};

/* ── TASBEEH ── */
/* Tasbīḥ of Fāṭima al-Zahrāʾ (a.s.), in its traditional order: the counter walks
   the three stages itself and only calls a round complete after the third. */
const ZEHRA = [
  { ar: 'ٱللَّٰهُ أَكْبَر', tr: 'Allāhu akbar', en: 'Allah is the Greatest', target: 34 },
  { ar: 'ٱلْحَمْدُ لِلَّٰه', tr: 'Al-ḥamdu lillāh', en: 'All praise is for Allah', target: 33 },
  { ar: 'سُبْحَانَ ٱللَّٰه', tr: 'Subḥān Allāh', en: 'Glory be to Allah', target: 33 }
];
/* Free counting keeps the same card, so it needs the same three fields. */
const FREE_DHIKR = { ar: 'ذِكْر', tr: 'Dhikr', en: 'Count freely — no target' };

/* ── ISLAMIC WALLPAPERS ──
   Photos hosted by Unsplash and fetched live from unsplash.com on every view; nothing
   is bundled with the app. Ten are shown each day, picked by a date-seeded shuffle of
   the pool, so the selection changes at midnight and is the same for everyone.
   Attribution is required by the Unsplash licence, so each photo keeps its author. */
const WALLPAPERS = [
  { id: 'I-1L8cYkle0', f: 'photo-1736536475480-8f4e8bafeddd', by: 'Hossein Nasr' },
  { id: '2lMK4dgqwFM', f: 'photo-1584551246679-0daf3d275d0f', by: 'Daniel Olah' },
  { id: '6Aa4EeZTdqw', f: 'photo-1627728734379-a5f8c099763e', by: 'Untung Bekti Nugroho' },
  { id: 'DyE0L2C4GiI', f: 'photo-1732831627964-f6fc7157aebd', by: "Marco D'Abramo" },
  { id: 'c1QVYdg5_io', f: 'photo-1724191078796-8a997b989f43', by: 'Vincent Marcini' },
  { id: 'ZcBY_mxVBCE', f: 'photo-1590075865003-e48277faa558', by: 'Nick Fewings' },
  { id: '_k0r8ebPzp8', f: 'photo-1728046421058-1e1e28e57193', by: 'Alim' },
  { id: 'onh-FdFUyeM', f: 'photo-1537181534458-45dcee76ae90', by: 'Izuddin Helmi Adnan' },
  { id: '7blIFp0kFP4', f: 'photo-1542816417-0983c9c9ad53', by: 'Ashkan Forouzani' },
  { id: 'kNSREmtaGOE', f: 'photo-1527838832700-5059252407fa', by: 'Fatih Yürür' },
  { id: 'kZ1zThg6G40', f: 'photo-1512632578888-169bbbc64f33', by: 'David Rodrigo' },
  { id: 'ztA6v1IRtq0', f: 'photo-1713463975229-f45c82ac5b5c', by: 'AmirHadi Manavi Moghadam' },
  { id: 'U2eUlPEKIgU', f: 'photo-1548438294-1ad5d5f4f063', by: 'Randy Tarampi' },
  { id: 'wuc-KEIBrdE', f: 'photo-1516617442634-75371039cb3a', by: 'Annie Spratt' },
  { id: 'ITQKDvNdkl4', f: 'photo-1725007995235-6979cb34ff8e', by: 'M u h t e l i f' },
  { id: '6Ppkk8rIhvk', f: 'photo-1531804308561-b6438d25a810', by: 'Nouman Younas' },
  { id: 'r-cy77rA0J0', f: 'photo-1590273089302-ebbc53986b6e', by: 'Alessa Ciraulo' },
  { id: 'EwcvNe53bdM', f: 'photo-1567712595315-545da0d341b2', by: 'David Billings' },
  { id: 'MDzJF3o8Ajk', f: 'photo-1554110838-816383ce7956', by: 'Mike Yukhtenko' },
  { id: 'FFhJCVaFuO0', f: 'photo-1623241087673-632acaa0e995', by: 'Ahmet Kağan Hançer' },
  { id: 'YtVsAUt5ubs', f: 'photo-1528862973381-9bc5ad6d4227', by: 'Rachelle Magpayo' },
  { id: 'R6rh5ttDO-4', f: 'photo-1551041777-ed277b8dd348', by: 'Yasmine Arfaoui' },
  { id: 'k8oak9BhX7M', f: 'photo-1589002213012-6ec134d3f8ae', by: 'Mayur' },
  { id: 'eeI0al-Qx8k', f: 'photo-1535117423468-de0ff056882e', by: 'HAMEED ULLAH' },
  { id: 'uouvblwaQs4', f: 'photo-1627790497727-41fb43f961be', by: 'Mosquegrapher' },
  { id: 'QEcvxkXWp0c', f: 'photo-1635016288720-c52507b9a717', by: 'Muhammad Irfan Baloch' },
  { id: '8M7xXeeyFZQ', f: 'photo-1720609813911-5d431512424e', by: 'Tahmeed Ahmad' },
  { id: 'rEH8hG7wUgw', f: 'photo-1711202675843-ccdb194d2b7d', by: 'Aldin Nasrun' }
];
const wallUrl = (w, px) => `https://images.unsplash.com/${w.f}?auto=format&fit=crop&q=80&w=${px}`;
const wallPage = w => `https://unsplash.com/photos/${w.id}`;

/* The ten wallpapers for a given day: a shuffle seeded by the date, so it is stable
   for the whole day and different tomorrow. */
/* One amaal a day, picked by a date-seeded shuffle so the whole community lands
   on the same one and it changes at midnight rather than on every render. */
function amaalForDay(list, date) {
  if (!list || !list.length) return null;
  const seedStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return list[seed % list.length];
}

function wallpapersFor(date) {
  const seedStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  let seed = 0;
  for (let i = 0; i < seedStr.length; i++) seed = (seed * 31 + seedStr.charCodeAt(i)) >>> 0;
  const rnd = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  const pool = [...WALLPAPERS];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, 10);
}

/* ── ADHAN SOUNDS ── */
const ADHAN_SOUNDS = [
  { key: 'default', label: 'Classic Adhan', sub: 'The original call', file: './adhan.mp3' }
];

/* ── SUPABASE SYNC ── */
const SB_URL = 'https://zwpimotdtuhbpwjcooiz.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3cGltb3RkdHVoYnB3amNvb2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1ODIxMTUsImV4cCI6MjA5ODE1ODExNX0.BEdbAK9_lquFL8WyWwOU_DQ1bGbwzSpO9A54kKQxZFU';
const SB_HEADS = { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' };

/* ── WEB PUSH ── */
const VAPID_PUBLIC_KEY = 'BGaIKdSnFYd_cHBqlukrEy1rI2wATyDLx7d08nvL90u2SxV240WaVz706fiqo5lPybZmf9Q0oEZuHpsOLHlPrs4';
const EDGE_PUSH = SB_URL + '/functions/v1/send-push';

const PUSH_MSG = {
  announcement: 'Majlis Live — new announcement from Ahlul Bayt Ireland',
  askImam: 'Ask Your Maulana — contact list updated',
  kidsQuizzes: 'New kids quiz published — can you get it right?',
  events: 'New event added to the community calendar',
  stories: 'New story or article has been published',
  pinned: 'Featured message has been updated',
  classifieds: 'New listing in community classifieds',
  ads: null, // billboard changes are not worth a notification
  calEvents: 'Islamic calendar updated',
  reminders: 'A new reminder has been added',
  prayerPresets: 'Prayer times updated',
  duas: 'Library updated — new duʿāʾ content',
  ziyarat: 'Library updated — new ziyārah content',
  nahj: 'Library updated — Books',
  aamals: 'Daily Amaals updated'
};

function urlBase64ToUint8Array(b64) {
  const pad = '='.repeat((4 - b64.length % 4) % 4);
  const raw = atob((b64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)));
}

async function subscribeToPush() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return;
  try {
    const reg = await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
      });
    }
    const j = sub.toJSON();
    await fetch(SB_URL + '/rest/v1/push_subscriptions', {
      method: 'POST',
      headers: { ...SB_HEADS, Prefer: 'resolution=ignore-duplicates' },
      body: JSON.stringify({ endpoint: j.endpoint, p256dh: j.keys.p256dh, auth: j.keys.auth })
    });
  } catch (e) { console.error('[ABI] subscribeToPush:', e.message); }
}

async function sendPush(title, body, url) {
  try {
    await fetch(EDGE_PUSH, {
      method: 'POST',
      headers: SB_HEADS,
      body: JSON.stringify({ title, body, url: url || '/' })
    });
  } catch (e) { console.error('[ABI] sendPush:', e.message); }
}

async function sendAdhanPush(prayerName, timeStr) {
  // Use the content table as a distributed lock so only one open device sends the push
  const dedupKey = 'adhan_' + prayerName.toLowerCase() + '_' + new Date().toISOString().slice(0, 13);
  try {
    const r = await fetch(SB_URL + '/rest/v1/content', {
      method: 'POST',
      headers: { ...SB_HEADS, Prefer: 'return=minimal' },
      body: JSON.stringify({ key: dedupKey, value: { sent: true }, updated_at: new Date().toISOString() })
    });
    if (r.status === 201) {
      await sendPush(prayerName + ' \xB7 Prayer Time', prayerName + ' — ' + timeStr + ' \xB7 Dublin, Ireland', '/');
    }
  } catch (e) { /* ignore */ }
}

const SB_KEY_MAP = {
  stories: 'liveStories', classifieds: 'liveClassifieds', events: 'liveEvents',
  announcement: 'liveAnnouncement', pinned: 'livePinned',
  kidsVideos: 'liveKidsVideos', kidsBooks: 'liveKidsBooks', kidsQuotes: 'liveKidsQuotes',
  kidsQuizzes: 'liveKidsQuizzes', askImam: 'liveAskImam',
  prayerPresets: 'livePrayerPresets', calEvents: 'liveCalEvents',
  healthTips: 'liveHealthTips', healthVideos: 'liveHealthVideos',
  duas: 'liveDuas', ziyarat: 'liveZiyarat', nahj: 'liveNahj', aamals: 'liveAamals',
  reminders: 'liveReminders', ads: 'liveAds'
};

/* Category ink for classifieds badges. Listings store the colour they were saved
   with, so older rows still carry values that fail contrast as text; this maps
   them at render time instead of rewriting anyone's data. */
const CAT_INK = {
  'Food': '#1f5145', 'Butcher': '#6e2230', 'Travel': '#7d6220',
  'Education': '#2c5d52', 'Services': '#3a4a78'
};

/* Billboard slides that are switched on and actually carry an image. */
function activeAds(ads) {
  return (ads || []).filter(a => a && a.img && a.on !== false);
}

function announcementActive(a) {
  if (!a || !a.title) return false;
  if (a.date) {
    const end = new Date(a.date + 'T23:59:59');
    if (!isNaN(end.getTime()) && Date.now() > end.getTime()) return false;
  }
  return true;
}

/* ── KEYBOARD & SCREEN READER LAYER ──
   Every control in this app is a tappable div, which works by touch and by
   nothing else. Rather than thread role/tabindex/onKeyDown through twelve
   thousand createElement calls, the DOM is enhanced after each render: anything
   carrying an inline `cursor: pointer` becomes a real button to the browser.
   A container that holds its own controls is skipped, so focus lands on the
   thing you actually press. */
const SYMBOL_LABELS = {
  '×': 'Close', '✕': 'Remove', '‹': 'Previous', '›': 'Next',
  '▾': 'Open list', '▴': 'Close list', '▶': 'Play', '−': 'Subtract one',
  '−1': 'Subtract one', '− 1': 'Subtract one', '+': 'Add'
};
function unwireTap(el) {
  delete el.dataset.tap;
  el.removeAttribute('tabindex');
  if (el.getAttribute('role') === 'button') el.removeAttribute('role');
  if (el.dataset.taplabel) {
    delete el.dataset.taplabel;
    el.removeAttribute('aria-label');
  }
}
function enhanceTappables(root) {
  if (!root) return;
  /* React reuses DOM nodes between renders, so a node that was a button on the
     last pass can come back as a plain container. Clear anything that no longer
     qualifies before wiring up what does, or stale roles accumulate and the
     keyboard lands on things that do nothing. */
  root.querySelectorAll('[data-tap]').forEach(el => {
    const style = el.getAttribute('style') || '';
    if (!style.includes('cursor: pointer') ||
        el.querySelector('[style*="cursor: pointer"],a,button,input,select,textarea')) unwireTap(el);
  });
  root.querySelectorAll('[style*="cursor: pointer"]').forEach(el => {
    // a container whose children are the real controls should not be focusable
    if (el.querySelector('[style*="cursor: pointer"],a,button,input,select,textarea')) return;
    if (el.closest('a,button')) return; // already reachable through its own element
    if (!el.dataset.tap) {
      el.dataset.tap = '1';
      el.setAttribute('tabindex', '0');
      if (!el.getAttribute('role')) el.setAttribute('role', 'button');
    }
    // a control labelled only by a glyph announces as "times" or as nothing at all
    if (!el.getAttribute('aria-label')) {
      const label = SYMBOL_LABELS[(el.textContent || '').trim()];
      if (label) {
        el.setAttribute('aria-label', label);
        el.dataset.taplabel = '1';
      }
    }
  });
}
/* Enter and Space are what a keyboard user presses on a button. */
function bindTapKeys() {
  if (window.__abiTapKeys) return;
  window.__abiTapKeys = true;
  document.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    const el = document.activeElement;
    if (!el || el.dataset.tap !== '1') return;
    e.preventDefault();
    el.click();
  });
}

/* ── NEXT PRAYER SCENE ──
   The next prayer decides the weather: Sunrise and Ẓuhr carry the daylight
   horizon; Fajr, Sunset, Maghrib and Midnight fall in the dark and carry the
   night sky. In practice the countdown only ever names Fajr, Ẓuhr, Maghrib or
   Midnight, so the daylight scene shows while the app is counting to Ẓuhr. Drawn inline rather than loaded as an image —
   no request, no licence, and it recolours with the palette. */
const NIGHT_PRAYERS = ['Fajr', 'Sunset', 'Maghrib', 'Midnight'];
function prayerScene(name) {
  return NIGHT_PRAYERS.includes(name) ? {
    night: true, ink: '#f3ead4', sub: '#bcb098', accent: '#e2c67c',
    scrim: 'linear-gradient(90deg,rgba(9,19,25,.82) 0%,rgba(9,19,25,.35) 55%,rgba(9,19,25,.1) 100%)',
    shadowRgb: '12,24,30'
  } : {
    night: false, ink: '#3a3129', sub: '#6b5b46', accent: '#a96d24',
    scrim: 'linear-gradient(90deg,rgba(253,246,236,.9) 0%,rgba(253,246,236,.45) 58%,rgba(253,246,236,.05) 100%)',
    shadowRgb: '190,158,120'
  };
}
/* One celestial mark per prayer, walking the sky from the dark before Fajr
   round to the deepest point of the night. */
const PRAYER_ICONS = {
  Fajr: 'moon',
  Sunrise: 'sunrise',
  Dhuhr: 'sun',
  Sunset: 'sunset',
  Maghrib: 'moon-star',
  Midnight: 'star'
};
/* The ring is the share of the current window already gone, so the card says
   how far through you are and not only what is left to wait. */
function prayerDial(name, sc, prog, size = 92) {
  const R = 42,
    C = 2 * Math.PI * R;
  return React.createElement('div', {
    style: {
      position: 'relative',
      width: size,
      height: size,
      flexShrink: 0
    },
    'aria-hidden': 'true'
  }, React.createElement('svg', {
    viewBox: '0 0 100 100',
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%'
    }
  }, React.createElement('circle', {
    cx: 50,
    cy: 50,
    r: R - 3.5,
    fill: sc.night ? 'rgba(9,20,26,.5)' : 'rgba(253,246,236,.5)'
  }), React.createElement('circle', {
    cx: 50,
    cy: 50,
    r: R,
    fill: 'none',
    stroke: sc.accent,
    strokeOpacity: .22,
    strokeWidth: 5
  }), React.createElement('circle', {
    cx: 50,
    cy: 50,
    r: R,
    fill: 'none',
    stroke: sc.accent,
    strokeWidth: 5,
    strokeLinecap: 'round',
    strokeDasharray: C,
    strokeDashoffset: C * (1 - prog),
    transform: 'rotate(-90 50 50)'
  })), React.createElement('div', {
    style: {
      position: 'absolute',
      inset: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: sc.accent
    }
  }, icon(PRAYER_ICONS[name] || 'moon', {
    size: Math.round(size * .37),
    sw: 1.6
  })));
}
function sceneArt(night) {
  const svg = night ? `
    <defs><linearGradient id="ps-n" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#0b161d"/><stop offset=".42" stop-color="#1b3a44"/>
      <stop offset=".72" stop-color="#4a6a5d"/><stop offset="1" stop-color="#c9a068"/>
    </linearGradient></defs>
    <rect width="400" height="120" fill="url(#ps-n)"/>
    <g fill="#f3ead4" opacity=".8"><circle cx="42" cy="20" r="1"/><circle cx="96" cy="34" r=".8"/>
      <circle cx="150" cy="16" r="1.1"/><circle cx="206" cy="30" r=".8"/><circle cx="262" cy="18" r="1"/>
      <circle cx="330" cy="12" r=".9"/><circle cx="372" cy="32" r="1"/><circle cx="18" cy="44" r=".8"/></g>
    <g transform="translate(292,20) scale(1.9) rotate(18)" fill="#f2e6c6">
      <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/></g>
    <path d="M0 92 Q70 68 140 84 T268 78 T400 66 L400 120 L0 120z" fill="#12262a" opacity=".9"/>
    <path d="M0 106 Q96 88 190 102 T400 94 L400 120 L0 120z" fill="#091419"/>` : `
    <defs><linearGradient id="ps-d" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#fdf6ec"/><stop offset=".5" stop-color="#f9e2ca"/>
        <stop offset="1" stop-color="#f0c8a1"/></linearGradient>
      <radialGradient id="ps-g"><stop offset="0" stop-color="#fff7e0"/>
        <stop offset="1" stop-color="#fff7e0" stop-opacity="0"/></radialGradient></defs>
    <rect width="400" height="120" fill="url(#ps-d)"/>
    <circle cx="298" cy="64" r="52" fill="url(#ps-g)"/>
    <circle cx="298" cy="64" r="13" fill="#fff4d6"/>
    <path d="M0 78 Q76 52 156 74 T286 66 T400 56 L400 120 L0 120z" fill="#b9ab9c" opacity=".5"/>
    <rect y="84" width="400" height="36" fill="#dde6e3" opacity=".65"/>
    <rect x="292" y="84" width="12" height="36" fill="#fff4d6" opacity=".5"/>
    <g fill="none" stroke="#6f6555" stroke-width="1.4" stroke-linecap="round" opacity=".65">
      <path d="M44 26q5-5 10 0"/><path d="M64 34q5-5 10 0"/><path d="M84 22q5-5 10 0"/></g>`;
  return React.createElement('svg', {
    viewBox: '0 0 400 120',
    preserveAspectRatio: 'xMidYMid slice',
    style: { position: 'absolute', inset: 0, width: '100%', height: '100%' },
    'aria-hidden': 'true',
    dangerouslySetInnerHTML: { __html: svg }
  });
}

/* Where a majlis sits relative to right now, so the card can speak in the
   present tense. A majlis counts as live from its start time until LIVE_MINS
   later; without a start time a dated majlis is simply "today". */
const LIVE_MINS = 150;
function majlisStatus(a, now) {
  const t = now || new Date();
  if (!a || !a.date) return { kind: a && a.yt ? 'watch' : 'notice' };
  const start = new Date(a.date + 'T' + (a.time && /^\d{2}:\d{2}$/.test(a.time) ? a.time : '00:00'));
  if (isNaN(start.getTime())) return { kind: 'notice' };
  const mins = Math.round((start.getTime() - t.getTime()) / 60000);
  const sameDay = start.toDateString() === t.toDateString();
  if (a.time) {
    if (mins <= 0 && mins > -LIVE_MINS) return { kind: 'live', start };
    if (mins <= -LIVE_MINS) return { kind: sameDay ? 'ended' : 'notice', start };
    if (mins < 60) return { kind: 'soon', start, label: `Starts in ${mins} min` };
    if (sameDay) return { kind: 'today', start, label: `Today at ${a.time}` };
  } else if (sameDay) {
    return { kind: 'today', start, label: 'Today' };
  }
  // compare whole days, not elapsed hours, or an evening majlis tomorrow reads as two days out
  const startDay = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const today0 = new Date(t.getFullYear(), t.getMonth(), t.getDate());
  const days = Math.round((startDay - today0) / 86400000);
  return { kind: 'upcoming', start, label: days === 1 ? 'Tomorrow' : `In ${days} days` };
}
function pruneExpiredStories(list) {
  // Storage cleanup: drop blanks and expired stories, but KEEP future-scheduled ones.
  const now = Date.now();
  return (list || []).filter(s => {
    if (!s || typeof s !== 'object') return false;
    const hasContent = (s.title && String(s.title).trim()) || (s.body && String(s.body).trim()) || (s.question && String(s.question).trim()) || s.photo || (s.ar && String(s.ar).trim()) || (s.sub && String(s.sub).trim());
    if (!hasContent) return false;
    if (s.until) {
      if (now > new Date(s.until + 'T23:59:59').getTime()) return false;
    } else if (!s.from && s.created && s.created <= now - 24 * 60 * 60 * 1000) return false;
    return true;
  });
}

// A story is visible to users only inside its scheduled from–until window.
function storyIsLive(s) {
  const now = Date.now();
  if (s.from && now < new Date(s.from + 'T00:00:00').getTime()) return false;
  if (s.until && now > new Date(s.until + 'T23:59:59').getTime()) return false;
  return true;
}
const activeStories = list => (list || []).filter(storyIsLive);

function ytId(url) {
  if (!url) return null;
  const m = String(url).match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

function resizeImageFile(file, maxDim, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let w = img.width, h = img.height;
        const scale = Math.min(1, maxDim / Math.max(w, h));
        w = Math.round(w * scale);
        h = Math.round(h * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        canvas.getContext('2d').drawImage(img, 0, 0, w, h);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function sbLoadAll() {
  try {
    const res = await fetch(SB_URL + '/rest/v1/content?select=key,value&order=updated_at.desc', { headers: SB_HEADS });
    if (!res.ok) { console.error('[ABI] sbLoadAll failed:', res.status, await res.text()); return null; }
    const rows = await res.json();
    const map = {};
    // Iterate in desc order so first occurrence (latest) wins per key
    rows.forEach(r => { if (!(r.key in map)) map[r.key] = r.value; });
    return map;
  } catch (e) { console.error('[ABI] sbLoadAll error:', e.message); return null; }
}

async function sbSave(contentKey, value) {
  try {
    // PATCH the existing row first; if 0 rows matched, INSERT a new one
    const patch = await fetch(SB_URL + '/rest/v1/content?key=eq.' + encodeURIComponent(contentKey), {
      method: 'PATCH',
      headers: { ...SB_HEADS, Prefer: 'return=representation' },
      body: JSON.stringify({ value, updated_at: new Date().toISOString() })
    });
    if (!patch.ok) { console.error('[ABI] sbSave patch failed:', contentKey, patch.status, await patch.text()); return; }
    const patched = await patch.json();
    if (patched.length === 0) {
      const ins = await fetch(SB_URL + '/rest/v1/content', {
        method: 'POST',
        headers: { ...SB_HEADS, Prefer: 'return=minimal' },
        body: JSON.stringify({ key: contentKey, value, updated_at: new Date().toISOString() })
      });
      if (!ins.ok) console.error('[ABI] sbSave insert failed:', contentKey, ins.status, await ins.text());
    }
  } catch (e) { console.error('[ABI] sbSave error:', contentKey, e.message); }
}

/* ── AUTH (SHA-256 hashed — never compare plaintext credentials) ── */
// Hashes of 'abiadmin' and 'Admin123@' — change both to rotate credentials
const ADMIN_ID_HASH = 'f68a4e6a5d763ef960620f6c92bf18eff81080a5bc1b378b88b35caedc8d94e9';
const ADMIN_PW_HASH = '201bce2458f00a54130c695ca8d1658319b32206d495adf175847b57bd4a4151';
async function sha256hex(str) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
/* ── URL SAFETY ── */
function safeUrl(u) {
  return /^https?:\/\/./.test(u) ? u : '';
}
function safeWa(n) {
  return n.replace(/\D/g, '');
}

/* ── APP ── */
class App extends Component {
  constructor(...args) {
    super(...args);
    _defineProperty(this, "state", {
      screen: 'home',
      libTab: 'dua',
      nahjTab: 'sermons',
      prayerTab: 'today',
      kidsTab: 'videos',
      healthTab: 'videos',
      dark: lsGet('dark', false),
      textSize: lsGet('textSize', 1),
      story: null,
      storyProg: 0,
      storyPreview: null,
      quizPick: null,
      classCat: 'All',
      libCat: 'All',
      now: new Date(),
      install: true,
      libQuery: '',
      classQuery: '',
      readingType: null,
      readingItem: null,
      toast: null,
      /* Mirror first, then IndexedDB replaces it once open — see loadSaved. */
      saved: lsGet('saved', []),
      savedTab: 'bookmark',
      savedQuery: '',
      savedConfirm: null,
      activeLine: null,
      jumpLine: null,
      calDay: null,
      calViewY: new Date().getFullYear(),
      calViewM: new Date().getMonth(),
      lang: 'English',
      notifDismissed: false,
      prayerPreset: 'ahlulbayt',
      adhanEnabled: true,
      adhanMuted: lsGet('adhanMuted', {}),
      adhanSound: lsGet('adhanSound', 'default'),
      notifEnabled: lsGet('notifEnabled', false),
      adhanPlaying: false,
      adhanPending: false,
      notifPermission: typeof Notification !== 'undefined' ? Notification.permission : 'default',
      qiblaStatus: 'idle',
      qiblaBearing: null,
      qiblaLat: null,
      qiblaLng: null,
      /* ── KHUMS & ZAKAT ── */
      khumsTab: 'khums',
      tasbeehMode: lsGet('tasbeehMode', 'zehra'),
      tasbeehCount: lsGet('tasbeehCount', 0),
      tasbeehStage: lsGet('tasbeehStage', 0),
      tasbeehFree: lsGet('tasbeehFree', 0),
      tasbeehRounds: lsGet('tasbeehRounds', 0),
      tasbeehPulse: 0,
      wallOpen: null,
      wallSaving: false,
      khumsCalc: { cash: '', goods: '', receivables: '', other: '', debts: '', paid: '' },
      zakatCalc: { cash: '', gold: '', silver: '', business: '', receivables: '', investments: '', debts: '', nisab: '600' },
      /* ── ADMIN ── */
      adminLoggedIn: false,
      adminInputId: '',
      adminInputPw: '',
      adminLoginErr: false,
      adminSection: 'stories',
      adminEvType: 'All',
      adminEditIdx: null,
      adminEditDraft: {},
      adminAttempts: 0,
      adminLockUntil: null,
      adminLockMsg: '',
      /* ── LIVE CONTENT ── */
      liveStories: pruneExpiredStories(lsGet('stories', STORIES)),
      ytPlayer: null,
      liveClassifieds: lsGet('classifieds', CLASSIFIEDS),
      liveEvents: lsGet('events', EVENT_DEFS),
      liveAnnouncement: lsGet('announcement', {
        title: 'Muḥarram programme begins Friday',
        body: 'Nightly majālis after Maghrib. Full schedule in Updates.'
      }),
      livePinned: lsGet('pinned', {
        on: false,
        text: '',
        color: '#6e2230'
      }),
      liveKidsVideos: lsGet('kidsVideos', KIDS_LEARN),
      liveKidsBooks: lsGet('kidsBooks', KIDS_BOOKS),
      liveKidsQuotes: lsGet('kidsQuotes', KIDS_QUOTES),
      livePrayerPresets: lsGet('prayerPresets', PRAYER_PRESETS),
      liveCalEvents: lsGet('calEvents', CAL_EVENTS_DEFAULT),
      liveReminders: lsGet('reminders', []),
      liveHealthTips: lsGet('healthTips', HEALTH_TIPS),
      liveHealthVideos: lsGet('healthVideos', HEALTH_VIDEOS),
      liveDuas: lsGet('duas', DUAS),
      liveAamals: lsGet('aamals', []),
      lastRead: lsGet('lastRead', null),
      liveZiyarat: lsGet('ziyarat', ZIYARAT),
      liveNahj: lsGet('nahj', NAHJ),
      liveKidsQuizzes: lsGet('kidsQuizzes', KIDS_QUIZZES),
      quizRun: null,
      liveAskImam: lsGet('askImam', []),
      liveAds: lsGet('ads', []),
      adIdx: 0,
      liveAutoTimes: lsGet('autoTimes', null),
      kidsQuizPicks: {},
      kidsVidCat: 'All',
      healthVidCat: 'All',
      adminLibTab: 'dua'
    });
    _defineProperty(this, "go", s => {
      // Refresh every page on navigation: reset transient view state so each
      // screen opens fresh, and scroll the content area back to the top.
      if (this.state.screen === 'reading') this.saveReadPos();
      this.clearQuizTimers();
      this.setState({
        screen: s,
        story: null,
        libTab: 'dua',
        libCat: 'All',
        libQuery: '',
        prayerTab: 'today',
        kidsTab: 'videos',
        kidsVidCat: 'All',
        kidsQuizPicks: {},
        quizRun: null,
        healthTab: 'videos',
        healthVidCat: 'All',
        calViewY: null,
        calViewM: undefined,
        calDay: null,
        wallOpen: null
      });
      const sc = document.querySelector('.app > .s');
      if (sc) sc.scrollTop = 0;
    });
    /* ── QUIZ GAME ──
       A run is 10 random questions from the chosen level, 10 seconds each.
       The countdown pauses while the player is off the quiz tab, a timeout
       counts as a wrong answer, and each question auto-advances after reveal. */
    _defineProperty(this, "clearQuizTimers", () => {
      clearInterval(this.quizTick);
      clearTimeout(this.quizNext);
    });
    _defineProperty(this, "startQuizRun", lvl => {
      this.clearQuizTimers();
      const pool = (this.state.liveKidsQuizzes || []).filter(q => quizLevel(q) === lvl);
      const arr = [...pool];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      this.setState({
        quizRun: { lvl, qs: arr.slice(0, 10), pos: 0, score: 0, pick: null, timeLeft: 10, done: false }
      });
      this.quizTick = setInterval(this.quizTickFn, 1000);
    });
    _defineProperty(this, "quizTickFn", () => {
      this.setState(s => {
        const r = s.quizRun;
        if (!r || r.done || r.pick !== null) return null;
        if (s.screen !== 'kids' || s.kidsTab !== 'quiz') return null; // pause while away
        if (r.timeLeft <= 1) {
          clearInterval(this.quizTick);
          this.quizNext = setTimeout(this.quizAdvance, 2000);
          return { quizRun: { ...r, timeLeft: 0, pick: -1 } };
        }
        return { quizRun: { ...r, timeLeft: r.timeLeft - 1 } };
      });
    });
    _defineProperty(this, "answerQuizRun", oi => {
      const r = this.state.quizRun;
      if (!r || r.done || r.pick !== null) return;
      clearInterval(this.quizTick);
      this.setState({
        quizRun: { ...r, pick: oi, score: r.score + (oi === r.qs[r.pos].answer ? 1 : 0) }
      });
      this.quizNext = setTimeout(this.quizAdvance, 1600);
    });
    _defineProperty(this, "quizAdvance", () => {
      this.setState(s => {
        const r = s.quizRun;
        if (!r || r.done) return null;
        if (r.pos >= r.qs.length - 1) return { quizRun: { ...r, done: true } };
        return { quizRun: { ...r, pos: r.pos + 1, pick: null, timeLeft: 10 } };
      }, () => {
        const r = this.state.quizRun;
        if (r && !r.done) {
          clearInterval(this.quizTick);
          this.quizTick = setInterval(this.quizTickFn, 1000);
        }
      });
    });
    _defineProperty(this, "quitQuiz", () => {
      this.clearQuizTimers();
      this.setState({ quizRun: null });
    });
    /* ── TASBEEH ──
       Two independent counters, both persisted: the Zahrāʾ tasbīḥ walks its three
       stages and buzzes longer at each stage end and longer again at a completed
       round; the free counter just climbs. Minus 1 unwinds the same path it came
       up, back across a stage and even across a round boundary, so an accidental
       double tap can be taken back rather than leaving the count stranded. */
    _defineProperty(this, "tasbeehTap", () => {
      this.setState(s => {
        if (s.tasbeehMode === 'free') {
          const free = s.tasbeehFree + 1;
          lsSet('tasbeehFree', free);
          if (navigator.vibrate) navigator.vibrate(free % 100 === 0 ? [30, 60, 30] : 14);
          return { tasbeehFree: free, tasbeehPulse: s.tasbeehPulse + 1 };
        }
        const stage = s.tasbeehStage % ZEHRA.length;
        const next = s.tasbeehCount + 1;
        const stageDone = next >= ZEHRA[stage].target;
        const roundDone = stageDone && stage === ZEHRA.length - 1;
        const count = stageDone ? 0 : next;
        const nextStage = stageDone ? (stage + 1) % ZEHRA.length : stage;
        const rounds = roundDone ? s.tasbeehRounds + 1 : s.tasbeehRounds;
        lsSet('tasbeehCount', count);
        lsSet('tasbeehStage', nextStage);
        lsSet('tasbeehRounds', rounds);
        if (navigator.vibrate) navigator.vibrate(roundDone ? [30, 60, 30, 60, 30] : stageDone ? [30, 60, 30] : 14);
        return { tasbeehCount: count, tasbeehStage: nextStage, tasbeehRounds: rounds, tasbeehPulse: s.tasbeehPulse + 1 };
      });
    });
    _defineProperty(this, "tasbeehMinus", () => {
      this.setState(s => {
        if (s.tasbeehMode === 'free') {
          const free = Math.max(0, s.tasbeehFree - 1);
          lsSet('tasbeehFree', free);
          return { tasbeehFree: free, tasbeehPulse: s.tasbeehPulse + 1 };
        }
        let stage = s.tasbeehStage % ZEHRA.length,
          count = s.tasbeehCount,
          rounds = s.tasbeehRounds;
        if (count > 0) count--;
        else if (stage > 0) {
          stage--;
          count = ZEHRA[stage].target - 1;
        } else if (rounds > 0) {
          rounds--;
          stage = ZEHRA.length - 1;
          count = ZEHRA[stage].target - 1;
        } else return null;
        lsSet('tasbeehCount', count);
        lsSet('tasbeehStage', stage);
        lsSet('tasbeehRounds', rounds);
        if (navigator.vibrate) navigator.vibrate(10);
        return { tasbeehCount: count, tasbeehStage: stage, tasbeehRounds: rounds, tasbeehPulse: s.tasbeehPulse + 1 };
      });
    });
    /* Reset clears the counter you are looking at, not the other one. */
    _defineProperty(this, "tasbeehReset", () => {
      this.setState(s => {
        if (s.tasbeehMode === 'free') {
          lsSet('tasbeehFree', 0);
          return { tasbeehFree: 0 };
        }
        lsSet('tasbeehCount', 0);
        lsSet('tasbeehStage', 0);
        lsSet('tasbeehRounds', 0);
        return { tasbeehCount: 0, tasbeehStage: 0, tasbeehRounds: 0 };
      });
    });
    _defineProperty(this, "setTasbeehMode", m => {
      lsSet('tasbeehMode', m);
      this.setState({ tasbeehMode: m });
    });
    /* Save a wallpaper: Unsplash serves these with an open CORS header, so the
       bytes can be pulled into a blob and handed to a real download. */
    _defineProperty(this, "saveWallpaper", async w => {
      this.setState({ wallSaving: true });
      try {
        const res = await fetch(wallUrl(w, 1400));
        if (!res.ok) throw new Error('http ' + res.status);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `abi-wallpaper-${w.id}.jpg`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        this.showToast('Wallpaper saved');
      } catch (e) {
        window.open(wallUrl(w, 1400), '_blank', 'noopener');
        this.showToast('Opened in a new tab - press and hold to save');
      }
      this.setState({ wallSaving: false });
    });
    _defineProperty(this, "toggleAdhanMute", name => {
      const m = {
        ...this.state.adhanMuted,
        [name]: !this.state.adhanMuted[name]
      };
      lsSet('adhanMuted', m);
      this.setState({
        adhanMuted: m
      });
      this.showToast(m[name] ? `${name} azan silenced` : `${name} azan on`);
    });
    _defineProperty(this, "setDark", v => {
      lsSet('dark', v);
      this.setState({
        dark: v
      });
    });
    _defineProperty(this, "setTextSize", v => {
      const tv = Math.round(Math.min(1.5, Math.max(.6, v)) * 100) / 100;
      lsSet('textSize', tv);
      this.setState({
        textSize: tv
      });
    });
    _defineProperty(this, "playYt", url => {
      const id = ytId(url);
      if (id) this.setState({
        ytPlayer: id
      });else this.showToast('No video linked yet');
    });
    /* Where you were last reading, per device. Stored on open and topped up with
       the scroll offset whenever you leave the reader, so Continue reading picks
       up on the line you stopped at rather than the top of the page. */
    _defineProperty(this, "saveReadPos", () => {
      const lr = this.state.lastRead;
      if (!lr) return;
      const inner = document.querySelector('.app > .s .s');
      const pos = inner ? inner.scrollTop : 0;
      const next = { ...lr, pos };
      lsSet('lastRead', next);
      this.setState({ lastRead: next });
    });
    _defineProperty(this, "openReading", (type, item, opts) => {
      const o = opts || {};
      const prev = this.state.lastRead;
      const same = prev && prev.title === (item && item.title) && prev.type === type;
      // a jump to a saved passage wins over the remembered position
      const mark = { type, title: (item && item.title) || '', pos: same && !o.jumpLine ? prev.pos || 0 : 0, at: Date.now() };
      lsSet('lastRead', mark);
      this.setState({
        screen: 'reading',
        readingType: type,
        readingItem: item,
        readingLang: o.lang || null,
        lastRead: mark,
        activeLine: null,
        jumpLine: o.jumpLine || null
      }, () => {
        // React may reuse the scroll node from a previous reading, so the offset
        // is always set explicitly — to where you left off, or to the top
        const inner = document.querySelector('.app > .s .s');
        if (inner) inner.scrollTop = mark.pos || 0;
        if (o.jumpLine) this.jumpToLine(o.jumpLine);
      });
    });
    /* Reopen whatever Continue reading points at, from whichever list holds it. */
    _defineProperty(this, "resumeReading", () => {
      const lr = this.state.lastRead;
      if (!lr) return;
      const hit = this.findContent(lr.type, null, lr.title);
      if (hit) this.openReading(hit[0], hit[1]);
      else this.showToast('That reading is no longer in the library');
    });
    _defineProperty(this, "t", key => {
      const lang = this.state.lang;
      const s = STRINGS[key];
      if (!s) return key;
      return s[lang] !== undefined ? s[lang] : s['English'] ?? key;
    });
    _defineProperty(this, "getActivePrayers", () => {
      const presets = abiPresets(this.state.livePrayerPresets);
      const preset = presets.find(p => p.id === this.state.prayerPreset) || presets[0];
      const auto = this.state.liveAutoTimes;
      const n = new Date();
      const today = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
      if (auto && auto.date === today && auto.times) {
        return preset.prayers.map(p => auto.times[p.name] ? {
          ...p,
          time: auto.times[p.name]
        } : p);
      }
      return preset.prayers;
    });
    _defineProperty(this, "fetchAutoTimes", () => {
      const n = new Date();
      const today = `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
      const cached = this.state.liveAutoTimes;
      if (cached && cached.date === today && cached.times) return;
      if (this._autoTimesLastTry && Date.now() - this._autoTimesLastTry < 5 * 60 * 1000) return;
      this._autoTimesLastTry = Date.now();
      const dd = String(n.getDate()).padStart(2, '0'),
        mm = String(n.getMonth() + 1).padStart(2, '0');
      // Shia Ithna-Ashari (Leva Institute, Qum) calculation for Dublin —
      // the Jaʿfarī method used by Ahlul-Bait Islamic Centre (ahlulbait.ie)
      fetch(`https://api.aladhan.com/v1/timings/${dd}-${mm}-${n.getFullYear()}?latitude=53.3498&longitude=-6.2603&method=0&midnightMode=1`).then(r => r.json()).then(j => {
        const tm = j && j.data && j.data.timings;
        if (!tm || !tm.Fajr) return;
        const clean = v => {
          const m = String(v).match(/\d{1,2}:\d{2}/);
          return m ? m[0].padStart(5, '0') : null;
        };
        const times = {};
        ['Fajr', 'Sunrise', 'Dhuhr', 'Sunset', 'Maghrib', 'Midnight'].forEach(k => {
          const v = clean(tm[k]);
          if (v) times[k] = v;
        });
        if (!times.Fajr || !times.Maghrib) return;
        const data = {
          date: today,
          times
        };
        lsSet('autoTimes', data);
        this.setState({
          liveAutoTimes: data
        });
      }).catch(() => {});
    });
    _defineProperty(this, "saveContent", (key, stateKey, data) => {
      lsSet(key, data);
      sbSave(key, data);
      this.setState({ [stateKey]: data });
      if (PUSH_MSG[key] !== null) sendPush('Ahlul Bayt Ireland', PUSH_MSG[key] || 'Community content updated', '/');
    });
    _defineProperty(this, "revertAll", async () => {
      const data = await sbLoadAll();
      if (!data) { this.showToast('Could not reach database.'); return; }
      const update = { adminUnsaved: false };
      Object.entries(SB_KEY_MAP).forEach(([key, stateKey]) => {
        if (data[key] !== undefined) { update[stateKey] = data[key]; lsSet(key, data[key]); }
      });
      this.setState(update);
      this.showToast('Reverted to last deployed version.');
    });
    _defineProperty(this, "handleAdminLogin", async () => {
      const {
        adminInputId,
        adminInputPw,
        adminLockUntil,
        adminAttempts
      } = this.state;
      const now = Date.now();
      if (adminLockUntil && now < adminLockUntil) {
        const secs = Math.ceil((adminLockUntil - now) / 1000);
        this.setState({
          adminLoginErr: true,
          adminLockMsg: `Too many attempts. Try again in ${secs}s.`
        });
        return;
      }
      const [idHash, pwHash] = await Promise.all([sha256hex(adminInputId), sha256hex(adminInputPw)]);
      if (idHash === ADMIN_ID_HASH && pwHash === ADMIN_PW_HASH) {
        this.setState({
          adminLoggedIn: true,
          adminLoginErr: false,
          adminInputPw: '',
          adminAttempts: 0,
          adminLockUntil: null,
          adminLockMsg: ''
        });
      } else {
        const attempts = (adminAttempts || 0) + 1;
        const lockUntil = attempts >= 5 ? now + 30000 : null;
        this.setState({
          adminLoginErr: true,
          adminAttempts: attempts,
          adminLockUntil: lockUntil,
          adminLockMsg: lockUntil ? 'Too many attempts. Locked for 30s.' : ''
        });
      }
    });
    _defineProperty(this, "startEdit", (idx, draft) => this.setState({
      adminEditIdx: idx,
      adminEditDraft: {
        ...draft
      }
    }));
    _defineProperty(this, "cancelEdit", () => this.setState(s => ({
      adminEditIdx: null,
      // keep the sub-tab (_sub) so Kids/Health admin stays on the same tab after Save/Cancel
      adminEditDraft: s.adminEditDraft && s.adminEditDraft._sub ? {
        _sub: s.adminEditDraft._sub
      } : {}
    })));
    _defineProperty(this, "setDraft", patch => this.setState(s => ({
      adminEditDraft: {
        ...s.adminEditDraft,
        ...patch
      }
    })));
    _defineProperty(this, "setAdhanSound", key => {
      const pick = ADHAN_SOUNDS.find(s => s.key === key);
      if (!pick) return;
      this.stopAdhan();
      lsSet('adhanSound', key);
      this.setState({
        adhanSound: key
      });
      // Warm the service-worker cache so the chosen adhan still plays offline
      fetch(pick.file).catch(() => {});
    });
    _defineProperty(this, "playAdhan", () => {
      this.stopAdhan();
      const pick = ADHAN_SOUNDS.find(s => s.key === this.state.adhanSound) || ADHAN_SOUNDS[0];
      this.adhanAudio = new Audio(pick.file);
      this.adhanAudio.onended = () => this.setState({
        adhanPlaying: false,
        adhanPending: false
      });
      this.adhanAudio.play().then(() => this.setState({
        adhanPlaying: true,
        adhanPending: false
      })).catch(() => {
        // Browser blocked autoplay — show tap-to-play banner
        this.setState({
          adhanPending: true
        });
      });
    });
    _defineProperty(this, "stopAdhan", () => {
      if (this.adhanAudio) {
        this.adhanAudio.pause();
        this.adhanAudio.currentTime = 0;
      }
      this.setState({
        adhanPlaying: false,
        adhanPending: false
      });
    });
    _defineProperty(this, "checkPrayerAlert", now => {
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      if (this._lastAlertTime === timeStr) return;
      const prayers = this.getActivePrayers();
      const match = prayers.find(p => p.time === timeStr && ['Fajr', 'Dhuhr', 'Maghrib', 'Midnight'].includes(p.name));
      if (!match) return;
      this._lastAlertTime = timeStr;
      const {
        adhanEnabled,
        notifEnabled,
        notifPermission
      } = this.state;
      if (adhanEnabled && !this.state.adhanMuted[match.name]) this.playAdhan();
      if (notifEnabled && Notification.permission === 'granted') {
        const title = `${match.name} \xB7 Prayer Time`;
        const opts = {
          body: `${match.en} prayer — ${match.time} \xB7 Dublin, Ireland`,
          tag: 'prayer-alert',
          renotify: true,
          data: { url: '/' }
        };
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(reg => reg.showNotification(title, opts)).catch(() => {
            try { new Notification(title, opts); } catch (e) {}
          });
        } else {
          try { new Notification(title, opts); } catch (e) {}
        }
        // Send push to all other subscribers (closed devices)
        sendAdhanPush(match.name, match.time);
      }
      this.showToast(`${match.name} — ${match.time}`);
    });
    _defineProperty(this, "notifyTodayEvents", () => {
      try {
        if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
        const now = new Date();
        const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        if (lsGet('evNotifDate', '') === todayStr) return;
        const evs = (this.state.liveCalEvents || []).filter(e => eventOnDate(e, now));
        if (!evs.length) return;
        lsSet('evNotifDate', todayStr);
        const title = evs.length === 1 ? 'Today: ' + evs[0].title : evs.length + ' events today';
        const body = evs.length === 1 ? evs[0].type + (evs[0].desc ? ' — ' + evs[0].desc : '') : evs.map(e => e.title).join(' · ');
        const opts = {
          body,
          icon: '/icon-192.png',
          badge: '/icon-192.png',
          tag: 'today-event',
          data: { url: '/' }
        };
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(reg => reg.showNotification(title, opts)).catch(() => {
            try { new Notification(title, opts); } catch (e) {}
          });
        } else {
          try { new Notification(title, opts); } catch (e) {}
        }
      } catch (e) {}
    });
    _defineProperty(this, "requestNotifPermission", async () => {
      if (!('Notification' in window)) {
        this.showToast('Notifications not supported on this browser');
        return;
      }
      const perm = await Notification.requestPermission();
      const enabled = perm === 'granted';
      lsSet('notifEnabled', enabled);
      this.setState({
        notifPermission: perm,
        notifEnabled: enabled
      });
      if (perm === 'granted') { subscribeToPush(); this.showToast('Notifications enabled'); } else if (perm === 'denied') this.showToast('Notifications blocked — check browser settings');
    });
    _defineProperty(this, "bearingToKaaba", (userLat, userLng) => {
      const kaabaLat = 21.4225;
      const kaabaLng = 39.8262;
      const toRad = d => d * Math.PI / 180;
      const phi1 = toRad(userLat);
      const phi2 = toRad(kaabaLat);
      const deltaLambda = toRad(kaabaLng - userLng);
      const y = Math.sin(deltaLambda) * Math.cos(phi2);
      const x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda);
      return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    });
    _defineProperty(this, "locateQibla", () => {
      if (!navigator.geolocation) {
        this.setState({
          qiblaStatus: 'unsupported'
        });
        return;
      }
      this.setState({
        qiblaStatus: 'loading'
      });
      navigator.geolocation.getCurrentPosition(pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const bearing = this.bearingToKaaba(lat, lng);
        this.setState({
          qiblaStatus: 'granted',
          qiblaLat: lat,
          qiblaLng: lng,
          qiblaBearing: bearing
        });
      }, () => this.setState({
        qiblaStatus: 'denied'
      }), {
        enableHighAccuracy: true,
        timeout: 10000
      });
    });
    _defineProperty(this, "showToast", msg => {
      this.setState({
        toast: msg
      });
      clearTimeout(this.toastTimer);
      this.toastTimer = setTimeout(() => this.setState({
        toast: null
      }), 2600);
    });
    _defineProperty(this, "handleInstall", () => {
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt();
        this.deferredPrompt.userChoice.then(() => {
          this.deferredPrompt = null;
          this.setState({
            install: false
          });
        });
      } else {
        this.go('about');
      }
    });
    _defineProperty(this, "handleShare", () => {
      const r = this.state.readingItem || {};
      const text = r.body || r.tr || '';
      if (navigator.share) {
        navigator.share({
          title: r.title,
          text,
          url: window.location.href
        }).catch(() => {});
      } else if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => this.showToast('Copied to clipboard'));
      } else {
        this.showToast('Share not available on this device');
      }
    });
    /* IndexedDB is the record; state and the localStorage mirror follow it.
       _saved is the synchronous copy every writer reads and replaces. setState is
       batched, so two saves in one tick would both start from the same stale
       array and the second would drop the first — which is exactly what happens
       when someone taps bookmark and favourite together. */
    _defineProperty(this, "writeSaved", list => {
      this._saved = list;
      lsSet('saved', list);
      this.setState({ saved: list });
    });
    _defineProperty(this, "loadSaved", () => {
      savedReadAll().then(rows => {
        if (!Array.isArray(rows)) return;
        const list = rows.slice().sort((a, b) => (b.at || 0) - (a.at || 0));
        this.writeSaved(list);
      }).catch(() => {
        // no IndexedDB here: the mirror already loaded, and writes keep updating it
      });
    });
    _defineProperty(this, "isSaved", (kind, contentId, lineId) => {
      const id = markId(kind, contentId, lineId);
      return this.state.saved.some(m => m.id === id);
    });
    /* The id is derived from what is being saved, so saving twice is a no-op
       rather than a duplicate row. */
    _defineProperty(this, "toggleSaved", (kind, rec) => {
      const id = markId(kind, rec.contentId, rec.lineId);
      const cur = this._saved || this.state.saved;
      const had = cur.some(m => m.id === id);
      const row = { ...rec, id, kind, at: Date.now() };
      this.writeSaved(had ? cur.filter(m => m.id !== id) : [row, ...cur]);
      if (had) savedDelete([id]);else savedPut(row);
      this.showToast(had ? kind === 'bookmark' ? 'Bookmark removed' : 'Removed from favourites' : kind === 'bookmark' ? 'Bookmarked' : 'Added to favourites');
      return !had;
    });
    _defineProperty(this, "removeSaved", id => {
      const cur = this._saved || this.state.saved;
      const row = cur.find(m => m.id === id);
      this.writeSaved(cur.filter(m => m.id !== id));
      this.setState({ savedConfirm: null });
      savedDelete([id]);
      this.showToast(row && row.kind === 'favourite' ? 'Removed from favourites' : 'Bookmark removed');
    });
    _defineProperty(this, "clearSaved", kind => {
      const cur = this._saved || this.state.saved;
      const gone = cur.filter(m => m.kind === kind);
      this.writeSaved(cur.filter(m => m.kind !== kind));
      this.setState({ savedConfirm: null });
      savedDelete(gone.map(m => m.id));
      this.showToast(`Cleared ${gone.length} ${kind === 'bookmark' ? 'bookmark' : 'favourite'}${gone.length === 1 ? '' : 's'}`);
    });
    /* The shape a backup would write and read: a version, and rows that carry
       everything needed to restore them without the rest of the app's state. */
    _defineProperty(this, "serialiseSaved", () => ({
      app: 'ahlul-bayt-ireland',
      v: 1,
      exportedAt: Date.now(),
      saved: this.state.saved
    }));
    /* Find a library item from a saved mark. Identity first, title second, so a
       bookmark survives an item being edited but not renamed, and vice versa. */
    _defineProperty(this, "findContent", (type, contentId, title) => {
      const st = this.state;
      const pools = {
        dua: st.liveDuas || DUAS,
        ziyarah: st.liveZiyarat || ZIYARAT,
        aamal: st.liveAamals || []
      };
      const nahj = st.liveNahj || NAHJ;
      const all = [];
      Object.keys(pools).forEach(k => (pools[k] || []).forEach(x => all.push([k, x])));
      ['sermons', 'letters', 'sayings'].forEach(k => (nahj[k] || []).forEach(x => all.push(['nahj', x])));
      return all.find(([k, x]) => contentKey(k, x) === contentId) || (title ? all.find(([k, x]) => x.title === title && k === type) || all.find(([, x]) => x.title === title) : null) || null;
    });
    _defineProperty(this, "openSaved", mark => {
      const hit = this.findContent(mark.contentType, mark.contentId, mark.contentTitle);
      if (!hit) return this.showToast('That passage is no longer in the library');
      this.openReading(hit[0], hit[1], { lang: mark.lang, jumpLine: mark.lineId });
    });
    /* The reader may still be laying out when the jump is asked for, so this
       retries briefly rather than failing on the first miss. */
    _defineProperty(this, "jumpToLine", (lineId, tries) => {
      const n = tries || 0;
      const el = document.querySelector(`[data-line="${lineId}"]`);
      if (!el) {
        if (n < 10) return setTimeout(() => this.jumpToLine(lineId, n + 1), 70);
        return this.showToast('Saved passage not found — the text may have changed');
      }
      /* An explicit offset on the app's own scroller rather than scrollIntoView,
         and instantly rather than smoothly. A smooth scroll is an animation, and
         an animation that is refused (reduced motion) or starved (a backgrounded
         tab) leaves the reader sitting at the top with no idea why. The flash is
         what says "here", so the travel adds nothing. */
      const sc = document.querySelector('.app > .s .s');
      const centre = () => {
        const r = el.getBoundingClientRect();
        if (sc && sc.contains(el)) {
          const box = sc.getBoundingClientRect();
          const off = r.top + r.height / 2 - (box.top + box.height / 2);
          if (n === 0 || Math.abs(off) > 24) sc.scrollTo({ top: Math.max(0, sc.scrollTop + off), behavior: 'auto' });
        } else if (n === 0) {
          el.scrollIntoView({ block: 'center', behavior: 'auto' });
        }
      };
      centre();
      /* Arabic at reading size reflows once its web font lands, which slides the
         target out from under the scroll, so the position is re-asserted a few
         times before the highlight is left alone to fade. */
      if (n < 4) return setTimeout(() => this.jumpToLine(lineId, n + 1), 130);
      clearTimeout(this._jumpTimer);
      this._jumpTimer = setTimeout(() => this.setState({ jumpLine: null }), 2600);
    });
    _defineProperty(this, "handlePDF", () => {
      this.showToast('Opening prayer calendar…');
      setTimeout(() => window.open('https://ahlulbaytireland.com/prayer-calendar.pdf', '_blank', 'noopener,noreferrer'), 300);
    });
    _defineProperty(this, "openStory", (i, manual) => {
      clearInterval(this.storyTimer);
      this.setState({
        story: i,
        storyProg: manual ? 100 : 0,
        storyManual: !!manual,
        quizPick: null
      });
      if (manual) return; // opened from Updates tab — no timer, browse freely
      this.storyTimer = setInterval(() => {
        this.setState(st => {
          if (st.story === null) return {};
          const live = activeStories(st.liveStories);
          if (live[st.story] && live[st.story].kind === 'quiz') return {};
          const np = st.storyProg + 0.6;
          if (np >= 100) {
            if (st.story < live.length - 1) return {
              story: st.story + 1,
              storyProg: 0,
              quizPick: null
            };
            clearInterval(this.storyTimer);
            return {
              story: null,
              storyProg: 0
            };
          }
          return {
            storyProg: np
          };
        });
      }, 60);
    });
    _defineProperty(this, "answerQuiz", idx => this.setState({
      quizPick: idx
    }));
    _defineProperty(this, "closeStory", () => {
      clearInterval(this.storyTimer);
      this.setState({
        story: null,
        storyProg: 0
      });
    });
    _defineProperty(this, "prevStory", () => {
      if (this.state.story > 0) this.openStory(this.state.story - 1, this.state.storyManual);
    });
    _defineProperty(this, "nextStory", () => {
      const live = activeStories(this.state.liveStories);
      if (this.state.story < live.length - 1) this.openStory(this.state.story + 1, this.state.storyManual);else this.closeStory();
    });
  }
  componentDidMount() {
    this._lastAlertTime = '';
    this.loadSaved();
    /* Re-enhance on structural change only — the clock ticks every second and
       only rewrites text, which childList mutations ignore. */
    bindTapKeys();
    const app = document.querySelector('.app');
    if (app && 'MutationObserver' in window) {
      // setTimeout, not requestAnimationFrame: rAF is suspended in a background
      // tab, which would leave the app unreachable by keyboard until it is looked
      // at. Trailing debounce that always reschedules, so a slow timer can never
      // swallow the mutations that arrive while it is pending.
      this._a11yRun = () => {
        clearTimeout(this._a11yFrame);
        this._a11yFrame = setTimeout(() => {
          this._a11yFrame = null;
          enhanceTappables(app);
        }, 16);
      };
      this._a11yObserver = new MutationObserver(this._a11yRun);
      this._a11yObserver.observe(app, { childList: true, subtree: true });
      this._a11yRun();
    }
    document.documentElement.dataset.theme = this.state.dark ? 'dark' : 'light';
    this.clockTimer = setInterval(() => {
      const now = new Date();
      this.setState({
        now
      });
      this.checkPrayerAlert(now);
      if (now.getDate() !== this._autoDay) {
        this._autoDay = now.getDate();
        this.fetchAutoTimes();
      }
    }, 1000);
    this._autoDay = new Date().getDate();
    this.fetchAutoTimes();
    this.autoTimesTimer = setInterval(() => this.fetchAutoTimes(), 60 * 60 * 1000);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
      // Re-subscribe to push if permission already granted (handles app restarts)
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        subscribeToPush();
      }
    }
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      this.deferredPrompt = e;
    });
    window.addEventListener('appinstalled', () => {
      this.setState({
        install: false
      });
      this.deferredPrompt = null;
    });
    const applyRemoteData = data => {
      if (!data) return;
      const update = {};
      Object.entries(SB_KEY_MAP).forEach(([key, stateKey]) => {
        if (data[key] !== undefined) {
          lsSet(key, data[key]);
          update[stateKey] = key === 'stories' ? pruneExpiredStories(data[key]) : data[key];
        }
      });
      if (Object.keys(update).length > 0) this.setState(update);
    };
    sbLoadAll().then(data => {
      applyRemoteData(data);
      this.notifyTodayEvents();
    });
    setTimeout(() => this.notifyTodayEvents(), 4000);
    this.refreshTimer = setInterval(() => sbLoadAll().then(applyRemoteData), 30 * 60 * 1000);
    // Expire 24h-old uploaded stories even while the app stays open
    this.pruneTimer = setInterval(() => {
      const pruned = pruneExpiredStories(this.state.liveStories);
      if (pruned.length !== this.state.liveStories.length) this.setState({ liveStories: pruned });
    }, 10 * 60 * 1000);
    // Billboard rotation
    this.adTimer = setInterval(() => {
      const n = activeAds(this.state.liveAds).length;
      if (n > 1) this.setState(s => ({ adIdx: (s.adIdx + 1) % n }));
    }, 5000);
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.dark !== this.state.dark) {
      document.documentElement.dataset.theme = this.state.dark ? 'dark' : 'light';
    }
    // belt and braces: a render that somehow produces no childList mutation
    // still gets its controls wired up. The call itself is debounced.
    if (prevState.screen !== this.state.screen && this._a11yRun) this._a11yRun();
  }
  componentWillUnmount() {
    if (this._a11yObserver) this._a11yObserver.disconnect();
    if (this._a11yFrame) clearTimeout(this._a11yFrame);
    clearInterval(this.clockTimer);
    clearInterval(this.storyTimer);
    clearInterval(this.refreshTimer);
    clearInterval(this.pruneTimer);
    clearInterval(this.adTimer);
    this.clearQuizTimers();
    this.stopAdhan();
  }
  toMin(t) {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  }
  computeNext() {
    const now = this.state.now;
    const mins = now.getHours() * 60 + now.getMinutes() + now.getSeconds() / 60;
    const prayers = this.getActivePrayers();
    const order = prayers.filter(p => ['Fajr', 'Dhuhr', 'Maghrib', 'Midnight'].includes(p.name));
    let next = order.find(p => this.toMin(p.time) > mins);
    let addDay = false;
    if (!next) {
      next = order[0];
      addDay = true;
    }
    const diff = this.toMin(next.time) - mins + (addDay ? 1440 : 0);
    const h = Math.floor(diff / 60),
      m = Math.floor(diff % 60),
      s = Math.floor(diff * 60 % 60);
    const cd = h > 0 ? `${h}h ${String(m).padStart(2, '0')}m` : `${m}m ${String(s).padStart(2, '0')}s`;
    return {
      next,
      cd
    };
  }

  /* ── HOME ── */
  renderHome(st, next, cd, greg, hijri, salaam) {
    // the home tile is narrow, so it takes the short form: Sat 25 Jul 2026
    const gregShort = st.now.toLocaleDateString('en-IE', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
    const activePrayers = this.getActivePrayers();
    const prayers = activePrayers.map((p, i) => ({
      ...p,
      isNext: p.name === next.name,
      last: i === activePrayers.length - 1
    }));
    const quickCards = [{
      title: 'Duʿāʾ',
      icon: '🤲',
      tone: ['#7d6220', '#f5eeda'],
      go: () => this.setState({
        screen: 'library',
        libTab: 'dua',
        libCat: 'All'
      })
    }, {
      title: 'Ziyārah',
      icon: '🕌',
      tone: ['#6e2230', '#f5e7e9'],
      go: () => this.setState({
        screen: 'library',
        libTab: 'ziyarah',
        libCat: 'All'
      })
    }, {
      title: 'Books',
      icon: '📖',
      tone: ['#2c5d52', '#e6f0eb'],
      go: () => this.setState({
        screen: 'library',
        libTab: 'nahj',
        libCat: 'All'
      })
    }, {
      title: this.t('kids.title'),
      icon: '🧸',
      tone: ['#c06014', '#fbe9dc'],
      go: () => this.go('kids')
    }, {
      title: this.t('more.health'),
      icon: '🌿',
      tone: ['#3f7a45', '#e9f2e7'],
      go: () => this.go('health')
    }, {
      title: this.t('home.classTitle'),
      icon: '🏪',
      tone: ['#7a5c9e', '#efe9f5'],
      go: () => this.go('classifieds')
    }];
    const toolCards = [{
      title: 'Tasbeeh',
      icon: '📿',
      tone: ['#3a4a78', '#e9ecf5'],
      go: () => this.go('tasbeeh')
    }, {
      title: 'Wallpapers',
      icon: '🖼️',
      tone: ['#2f6f7a', '#e5f0f2'],
      go: () => this.go('wallpaper')
    }, {
      title: 'Khums & Zakat',
      icon: '🧮',
      tone: ['#7a6a2c', '#f2eede'],
      go: () => this.go('khums')
    }, {
      title: this.t('qibla.title'),
      icon: '🧭',
      tone: ['#1f5145', '#e4efe9'],
      go: () => this.go('qibla')
    }, {
      title: this.t('cal.title'),
      icon: '📅',
      tone: ['#b8923f', '#f7efdd'],
      go: () => this.go('calendar')
    }];
    const dayAmaal = amaalForDay(st.liveAamals, st.now);
    const lastRead = st.lastRead;
    const READ_KIND = { dua: 'Duʿāʾ', ziyarah: 'Ziyārah', aamal: 'Daily Amaal', nahj: 'Books' };
    /* One grid renderer for both Explore and Tools, so the two sections cannot
       drift apart. */
    const iconGrid = cards => /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10,
        marginBottom: 14
      }
    }, cards.map((q, i) => {
      const [ink, tint] = q.tone || ['#6e6252', '#efe8db'];
      return /*#__PURE__*/React.createElement("div", {
        key: q.title,
        onClick: q.go,
        className: "neu-press",
        style: {
          ...neuCard(16, .85),
          padding: '13px 6px 11px',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          minHeight: 92,
          textAlign: 'center',
          animation: 'fu .38s cubic-bezier(.2,.8,.2,1) both',
          animationDelay: i * 26 + 'ms'
        }
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          width: 50,
          height: 50,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 30,
          lineHeight: 1,
          background: `linear-gradient(145deg, ${tint}, ${ink}22)`,
          boxShadow: `inset 3px 3px 7px ${ink}33, inset -2px -2px 5px ${NEU.hi}, 0 3px 8px -5px ${ink}`
        }
      }, q.icon), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          fontWeight: 700,
          color: NEU.ink,
          lineHeight: 1.25
        }
      }, q.title));
    }));
    const sectionHead = label => /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 18,
        fontWeight: 600,
        color: '#2c2823',
        marginBottom: 12
      }
    }, label);
    const maulanas = Array.isArray(st.liveAskImam) ? st.liveAskImam.filter(m => m && m.number) : st.liveAskImam && st.liveAskImam.number ? [{
      name: '',
      number: st.liveAskImam.number
    }] : [];
    const now = st.now;
    const todayD = now.getDate();
    const calY = now.getFullYear(),
      calM = now.getMonth();
    const todayStr = `${calY}-${String(calM + 1).padStart(2, '0')}-${String(todayD).padStart(2, '0')}`;
    // events marked "Reminder" pop up as the banner; events marked "On this day" get the inline green banner
    const todayRems = (st.liveCalEvents || []).filter(e => e.notice === 'reminder' && e.date && eventOnDate(e, now));
    const todayRem = todayRems[0];
    const showNotif = !!todayRem && !st.notifDismissed;
    const onThisDay = (st.liveCalEvents || []).filter(e => (e.notice || 'day') === 'day' && e.date && eventOnDate(e, now));
    const sc = prayerScene(next.name);
    /* Only the four obligatory times drive the countdown, so the dial measures
       against the previous one of those, wrapping over midnight. */
    const cycle = activePrayers.filter(p => ['Fajr', 'Dhuhr', 'Maghrib', 'Midnight'].includes(p.name));
    const ni = Math.max(0, cycle.findIndex(p => p.name === next.name));
    const prevP = cycle[(ni - 1 + cycle.length) % cycle.length];
    const wrapMin = v => v <= 0 ? v + 1440 : v;
    const nowMin = st.now.getHours() * 60 + st.now.getMinutes() + st.now.getSeconds() / 60;
    const left = wrapMin(this.toMin(next.time) - nowMin);
    const span = cycle.length > 1 ? wrapMin(this.toMin(next.time) - this.toMin(prevP.time)) : 1440;
    const prog = Math.min(1, Math.max(0, 1 - left / span));
    // frosted-pane treatment shared by the slim home ribbons
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 20px 100px'
      },
      className: "afu"
    }, showNotif && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 14,
        left: 14,
        right: 14,
        zIndex: 14,
        background: 'rgba(28,26,23,.97)',
        backdropFilter: 'blur(10px)',
        borderRadius: 18,
        padding: '13px 14px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        boxShadow: '0 16px 32px -12px rgba(0,0,0,.5)',
        animation: 'notif-in .45s cubic-bezier(.2,.9,.2,1) both'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0,
        width: 40,
        height: 40,
        borderRadius: 12,
        background: todayRem.color || '#1f5145',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, icon('bell', { size: 20, stroke: '#f3ead4' })), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({
        screen: 'calendar',
        calViewY: null,
        calViewM: undefined,
        calDay: null,
        notifDismissed: true
      }),
      style: {
        flex: 1,
        cursor: 'pointer',
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        letterSpacing: 1,
        textTransform: 'uppercase',
        color: '#d8b863',
        fontWeight: 700
      }
    }, "Today · ", todayRems.length > 1 ? todayRems.length + ' reminders' : todayRem.type || 'Reminder'), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: '#f3ead4',
        marginTop: 2
      }
    }, todayRems.length > 1 ? todayRems.map(r => r.title).join(' · ') : todayRem.title)), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({
        notifDismissed: true
      }),
      style: {
        flexShrink: 0,
        width: 44,
        height: 44,
        margin: '-8px -8px -8px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#cfc6b4',
        fontSize: 22,
        cursor: 'pointer'
      }
    }, "×")), st.livePinned.on && st.livePinned.text && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'sticky',
        top: 6,
        zIndex: 12,
        display: 'flex',
        gap: 13,
        alignItems: 'flex-start',
        background: st.livePinned.color,
        borderRadius: 18,
        padding: '14px 16px',
        margin: '4px 0 12px',
        boxShadow: `0 6px 18px -8px ${st.livePinned.color}cc`
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0,
        fontSize: 20
      }
    }, "📌"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        fontSize: 13.5,
        fontWeight: 600,
        color: '#fff',
        lineHeight: 1.4
      }
    }, st.livePinned.text)), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 0 18px',
        display: 'flex',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: "./app-title-logo.png",
      alt: "Ahlul Bayt Ireland",
      style: {
        height: 82,
        width: 'auto',
        maxWidth: '86%',
        objectFit: 'contain',
        display: 'block'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginBottom: 10
      }
    }, [['Gregorian', '#6b6252', gregShort], ['Hijri', '#75601f', hijri]].map(([label, tone, value]) => /*#__PURE__*/React.createElement("div", {
      key: label,
      onClick: () => this.go('calendar'),
      style: {
        ...neuCard(13, .62),
        flex: 1,
        minWidth: 0,
        display: 'flex',
        alignItems: 'baseline',
        gap: 7,
        padding: '7px 11px',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        letterSpacing: .8,
        textTransform: 'uppercase',
        color: tone,
        fontWeight: 700,
        flexShrink: 0
      }
    }, label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: '#2f2b25',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, value)))), onThisDay.length > 0 && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.go('calendar'),
      style: {
        background: 'linear-gradient(145deg,#24604f,#193f34)',
        border: '1px solid rgba(255,255,255,.08)',
        borderRadius: 13,
        padding: '8px 12px',
        marginBottom: 10,
        cursor: 'pointer',
        boxShadow: neuUpOn('25,63,52', .8)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        letterSpacing: .9,
        textTransform: 'uppercase',
        fontWeight: 800,
        color: '#d8b863',
        marginBottom: 2
      }
    }, "On this day"), onThisDay.map((ev, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        marginTop: i > 0 ? 5 : 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        fontWeight: 700,
        color: '#f3ead4',
        lineHeight: 1.3
      }
    }, ev.title), ev.desc && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        color: 'rgba(243,234,212,.75)',
        marginTop: 1,
        lineHeight: 1.35
      }
    }, ev.desc)))), this.renderHappeningNow(st, todayRems), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: 11
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 17,
        fontWeight: 600,
        color: '#2c2823'
      }
    }, "Today's Updates"), /*#__PURE__*/React.createElement("div", {
      onClick: () => { if (activeStories(this.state.liveStories).length) this.openStory(0); },
      style: {
        fontSize: 12.5,
        color: '#1f5145',
        fontWeight: 600,
        cursor: 'pointer',
        padding: '12px 10px',
        margin: '-12px -10px',
        minHeight: 44,
        display: 'flex',
        alignItems: 'center'
      }
    }, "View all")), /*#__PURE__*/React.createElement("div", {
      className: "s",
      style: {
        display: 'flex',
        gap: 13,
        overflowX: 'auto',
        margin: '0 -20px 14px',
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 6
      }
    }, activeStories(st.liveStories).map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => this.openStory(i),
      style: {
        flexShrink: 0,
        width: 66,
        textAlign: 'center',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 66,
        height: 92,
        borderRadius: 18,
        padding: 2.5,
        background: 'conic-gradient(from 210deg,#d8b863,#1f5145,#6e2230,#d8b863)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: '100%',
        borderRadius: 15.5,
        background: s.photo ? `url(${s.photo}) center/cover` : s.img || s.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: `2.5px solid ${NEU.bg}`,
        position: 'relative',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(120% 80% at 30% 22%, rgba(255,255,255,.22), transparent 62%)'
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        color: '#6b6252',
        marginTop: 6,
        lineHeight: 1.2,
        fontWeight: 600
      }
    }, s.short)))), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.go('prayer'),
      className: "neu-press",
      style: {
        position: 'relative',
        overflow: 'hidden',
        border: sc.night ? '1px solid rgba(255,255,255,.08)' : '1px solid rgba(255,255,255,.6)',
        borderRadius: 20,
        padding: '15px 17px',
        color: sc.ink,
        boxShadow: neuUpOn(sc.shadowRgb, 1.15),
        cursor: 'pointer',
        marginBottom: 12
      }
    }, sceneArt(sc.night), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: sc.scrim
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        color: sc.accent,
        fontWeight: 800
      }
    }, this.t('home.nextPrayer')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        marginTop: 7
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 32,
        fontWeight: 600,
        lineHeight: 1
      }
    }, next.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Amiri,serif',
        fontSize: 15,
        color: sc.sub
      },
      dir: "rtl"
    }, next.ar)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 27,
        fontWeight: 700,
        color: sc.accent,
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1.1,
        marginTop: 5
      }
    }, next.time), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: sc.sub,
        marginTop: 3,
        fontVariantNumeric: 'tabular-nums'
      }
    }, this.t('home.in'), " ", cd)), prayerDial(next.name, sc, prog))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: NEU.surf,
        boxShadow: neuUp(),
        border: NEU.edge,
        borderRadius: 18,
        padding: 5,
        marginBottom: 18,
        display: 'grid',
        gridTemplateColumns: `repeat(${prayers.length}, 1fr)`,
        gap: 2
      }
    }, prayers.map(p => /*#__PURE__*/React.createElement("div", {
      key: p.name,
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 5,
        padding: '9px 1px 8px',
        borderRadius: 13,
        background: p.isNext ? NEU.accent : 'transparent',
        boxShadow: p.isNext ? neuUpOn('31,81,69', .7) : 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        display: 'flex',
        color: p.isNext ? '#e2c67c' : '#75601f'
      }
    }, icon(PRAYER_ICONS[p.name] || 'moon', {
      size: 19,
      sw: 1.7
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: p.isNext ? '#fffbf0' : '#3f3a32',
        fontWeight: p.isNext ? 700 : 600,
        lineHeight: 1
      }
    }, p.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11.5,
        color: p.isNext ? '#e2c67c' : NEU.muted,
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1
      }
    }, p.time)))),
    dayAmaal && this.renderHomeTile({
      icon: 'book-heart',
      kicker: "Today's recommended amaal",
      title: dayAmaal.title,
      sub: dayAmaal.cat || dayAmaal.tr || 'Tap to read',
      tone: ['#8a4b2c', '#f7ebe2'],
      onClick: () => this.openReading('aamal', dayAmaal)
    }),
    lastRead && lastRead.title && this.renderHomeTile({
      icon: 'book-open',
      kicker: 'Continue reading',
      title: lastRead.title,
      sub: READ_KIND[lastRead.type] || 'Library',
      tone: ['#2c5d52', '#e6f0eb'],
      onClick: this.resumeReading
    }),
    this.renderHomeTile({
      icon: 'target',
      kicker: 'Take a quiz',
      title: 'Test what you know',
      sub: 'Ten questions, ten seconds each',
      tone: ['#8a2f52', '#f7e6ed'],
      onClick: () => this.setState({ screen: 'kids', kidsTab: 'quiz', quizRun: null })
    }),
    /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 18,
        fontWeight: 600,
        color: '#2c2823',
        margin: '18px 0 12px'
      }
    }, this.t('home.explore')), iconGrid(quickCards),
    sectionHead('Tools'), iconGrid(toolCards),
    maulanas.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'linear-gradient(120deg,#1f5145,#163b30)',
        borderRadius: 16,
        padding: '12px 14px',
        marginTop: 14,
        boxShadow: '0 8px 22px -10px rgba(22,59,48,.55)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0,
        width: 30,
        height: 30,
        borderRadius: 9,
        background: 'rgba(216,184,99,.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Amiri,serif',
        fontSize: 16,
        color: '#d8b863'
      }
    }, "؟"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 14,
        fontWeight: 600,
        color: '#f3ead4'
      }
    }, "Ask Your Maulana"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        color: '#bcd3ca',
        marginTop: 1,
        lineHeight: 1.3
      }
    }, "Questions answered on WhatsApp"))), maulanas.map((m, mi) => /*#__PURE__*/React.createElement("div", {
      key: mi,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10,
        marginTop: 8,
        paddingTop: 8,
        borderTop: '1px solid rgba(243,234,212,.16)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        color: '#f3ead4',
        minWidth: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, m.name || 'Maulana'), /*#__PURE__*/React.createElement("div", {
      onClick: () => window.open('https://wa.me/' + String(m.number).replace(/[^\d]/g, ''), '_blank'),
      style: {
        flexShrink: 0,
        padding: '13px 16px',
        minHeight: 44,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        borderRadius: 11,
        background: '#d8b863',
        color: '#163b30',
        fontSize: 12.5,
        fontWeight: 700,
        cursor: 'pointer'
      }
    }, "Ask")))), this.renderAdBoard(st));
  }

  /* ── BILLBOARD ──
     Sponsor slides under Ask Your Maulana. One image at a time, cross-faded every
     5 seconds by the adTimer; tapping opens the advertiser's link. */
  renderAdBoard(st) {
    const ads = activeAds(st.liveAds);
    if (!ads.length) return null;
    const idx = st.adIdx % ads.length;
    const openAd = a => {
      const url = String(a.link || '').trim();
      if (!url) return;
      window.open(/^https?:\/\//i.test(url) ? url : 'https://' + url, '_blank', 'noopener');
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#6b6252',
        marginBottom: 5,
        paddingLeft: 2
      }
    }, this.t('home.sponsored')), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 7',
        borderRadius: 16,
        overflow: 'hidden',
        background: NEU.sunk,
        border: NEU.edge,
        boxShadow: '0 8px 22px -14px rgba(60,50,30,.6)'
      }
    }, ads.map((a, i) => /*#__PURE__*/React.createElement("img", {
      key: i,
      src: a.img,
      alt: a.name || 'Advertisement',
      onClick: () => openAd(a),
      style: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block',
        opacity: i === idx ? 1 : 0,
        transition: 'opacity .6s ease',
        pointerEvents: i === idx ? 'auto' : 'none',
        cursor: a.link ? 'pointer' : 'default'
      }
    })), ads.length > 1 && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 8,
        display: 'flex',
        justifyContent: 'center',
        gap: 5
      }
    }, ads.map((a, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => this.setState({
        adIdx: i
      }),
      "aria-label": `Show advertisement ${i + 1} of ${ads.length}`,
      "aria-current": i === idx ? 'true' : undefined,
      style: {
        width: 44,
        height: 44,
        margin: '-14px -10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: i === idx ? 16 : 6,
        height: 6,
        borderRadius: 3,
        display: 'block',
        background: i === idx ? NEU.hi : 'rgba(203,195,178,.6)',
        boxShadow: '0 1px 3px rgba(0,0,0,.35)',
        // width, not scaleX: this pill grows 6px to 16px and scaling would
        // stretch its rounded ends. The paint area is 16x6, so it costs nothing.
        transition: 'width .3s ease'
      }
    }))))));
  }

  /* ── PRAYER ── */
  renderPrayer(st, next, cd, greg) {
    const tab = st.prayerTab;
    const activePrayers = this.getActivePrayers();
    const prayers = activePrayers.map((p, i) => ({
      ...p,
      isNext: p.name === next.name,
      last: i === activePrayers.length - 1
    }));
    const livePresets = abiPresets(st.livePrayerPresets);
    const activePreset = livePresets.find(p => p.id === st.prayerPreset) || livePresets[0];
    // Monthly table: full current month, anchored to the active preset's
    // official times for today, shifted day-by-day by real solar drift (Dublin).
    const solarLocalMin = (y, mo, d) => {
      const lat = 53.3498,
        lng = -6.2603,
        rad = Math.PI / 180;
      const doy = Math.round((Date.UTC(y, mo, d) - Date.UTC(y, 0, 0)) / 864e5);
      const g = 2 * Math.PI / 365 * (doy - 1 + 0.5);
      const eq = 229.18 * (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
      const de = 0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) + 0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
      let cosHa = Math.cos(90.833 * rad) / (Math.cos(lat * rad) * Math.cos(de)) - Math.tan(lat * rad) * Math.tan(de);
      cosHa = Math.max(-1, Math.min(1, cosHa));
      const ha = Math.acos(cosHa) / rad;
      const noon = 720 - 4 * lng - eq;
      const local = utcMin => {
        const dt = new Date(Date.UTC(y, mo, d) + utcMin * 60000);
        return dt.getHours() * 60 + dt.getMinutes();
      };
      return {
        sunrise: local(noon - 4 * ha),
        noon: local(noon),
        sunset: local(noon + 4 * ha)
      };
    };
    const hmToMin = s => {
      const [h, m] = String(s || '0:0').split(':').map(Number);
      return (h || 0) * 60 + (m || 0);
    };
    const minToHM = v => {
      v = ((Math.round(v) % 1440) + 1440) % 1440;
      return String(Math.floor(v / 60)).padStart(2, '0') + ':' + String(v % 60).padStart(2, '0');
    };
    const mNow = st.now;
    const mY = mNow.getFullYear(),
      mM = mNow.getMonth(),
      mToday = mNow.getDate();
    const daysInM = new Date(mY, mM + 1, 0).getDate();
    const anchor = solarLocalMin(mY, mM, mToday);
    const presetMin = n => {
      const p = activePrayers.find(x => x.name === n) || activePreset.prayers.find(x => x.name === n);
      return p ? hmToMin(p.time) : 0;
    };
    const autoLive = st.liveAutoTimes && st.liveAutoTimes.date === `${mY}-${String(mM + 1).padStart(2, '0')}-${String(mToday).padStart(2, '0')}`;
    const aFajr = presetMin('Fajr'),
      aDhuhr = presetMin('Dhuhr'),
      aMaghrib = presetMin('Maghrib');
    const monthRows = Array.from({
      length: daysInM
    }, (_, i) => {
      const s = solarLocalMin(mY, mM, i + 1);
      return {
        day: new Date(mY, mM, i + 1).toLocaleDateString('en-IE', {
          day: 'numeric',
          month: 'short'
        }),
        fajr: minToHM(aFajr + (s.sunrise - anchor.sunrise)),
        dhuhr: minToHM(aDhuhr + (s.noon - anchor.noon)),
        maghrib: minToHM(aMaghrib + (s.sunset - anchor.sunset)),
        today: i + 1 === mToday
      };
    });
    const tabStyle = active => ({
      flex: 1,
      textAlign: 'center',
      padding: 13,
      borderRadius: 11,
      fontSize: 13.5,
      fontWeight: 600,
      cursor: 'pointer',
      background: active ? NEU.surf : 'transparent',
      color: active ? NEU.accent : NEU.muted,
      boxShadow: active ? neuUp(.5) : 'none'
    });
    const notifPerm = st.notifPermission;
    const notifSupported = typeof Notification !== 'undefined';
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 20px 100px'
      },
      className: "afu"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 56px 16px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: st.dark ? '#8e9490' : NEU.muted,
        fontWeight: 500
      }
    }, greg), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 26,
        fontWeight: 600,
        color: st.dark ? '#ece6d8' : '#27241f',
        marginTop: 2
      }
    }, this.t('prayer.title'))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        background: '#efe7d7',
        borderRadius: 14,
        padding: 4,
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({
        prayerTab: 'today'
      }),
      style: tabStyle(tab === 'today')
    }, this.t('prayer.today')), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({
        prayerTab: 'month'
      }),
      style: tabStyle(tab === 'month')
    }, this.t('prayer.monthly')), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({
        prayerTab: 'settings'
      }),
      style: tabStyle(tab === 'settings')
    }, this.t('prayer.settings'))), tab === 'today' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'linear-gradient(155deg,#1f5145,#163b30)',
        borderRadius: 22,
        padding: 22,
        color: '#f3ead4',
        textAlign: 'center',
        boxShadow: '0 18px 34px -18px rgba(22,59,48,.7)',
        marginBottom: 18,
        position: 'relative',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: '50%',
        top: -40,
        transform: 'translateX(-50%)',
        width: 200,
        height: 200,
        borderRadius: '50%',
        border: '1px solid rgba(216,184,99,.16)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: '#d8b863',
        fontWeight: 600
      }
    }, next.name, " ", this.t('prayer.beginsIn')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 46,
        fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
        margin: '8px 0 4px',
        letterSpacing: 1
      }
    }, cd), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Amiri,serif',
        fontSize: 20,
        color: '#cdbf9e'
      },
      dir: "rtl"
    }, next.ar, " · ", next.time))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: NEU.surf, boxShadow: neuUp(),
        border: NEU.edge,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16
      }
    }, prayers.map(p => /*#__PURE__*/React.createElement("div", {
      key: p.name,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 18px',
        borderBottom: p.last ? 'none' : NEU.rule,
        background: p.isNext ? 'linear-gradient(90deg,#e3ece7,rgba(236,229,216,0))' : 'transparent'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'Amiri,serif',
        fontSize: 21,
        color: p.isNext ? '#1f5145' : '#75601f',
        width: 30,
        textAlign: 'center'
      },
      dir: "rtl"
    }, p.glyph), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 16.5,
        color: p.isNext ? '#1f5145' : '#3f3a32',
        fontWeight: p.isNext ? 700 : 500
      }
    }, p.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: '#6b6252',
        marginTop: 1
      }
    }, p.en))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18,
        color: p.isNext ? '#1f5145' : '#3f3a32',
        fontWeight: p.isNext ? 700 : 500,
        fontVariantNumeric: 'tabular-nums'
      }
    }, p.time), ['Fajr', 'Dhuhr', 'Maghrib', 'Midnight'].includes(p.name) && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.toggleAdhanMute(p.name),
      title: st.adhanMuted[p.name] ? 'Azan silenced — tap to unmute' : 'Azan on — tap to silence',
      role: "switch",
      "aria-checked": st.adhanMuted[p.name] ? 'false' : 'true',
      "aria-label": `Azan for ${p.name}`,
      style: {
        width: 44,
        height: 44,
        borderRadius: 13,
        border: `1px solid ${st.adhanMuted[p.name] ? '#e0c9ce' : '#dce8e3'}`,
        background: st.adhanMuted[p.name] ? '#fdf0f2' : '#eef7f4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 14,
        cursor: 'pointer',
        flexShrink: 0
      }
    }, st.adhanMuted[p.name] ? '🔕' : '🔔')))))), tab === 'month' && /*#__PURE__*/React.createElement("div", {
      style: {
        background: NEU.surf, boxShadow: neuUp(),
        border: NEU.edge,
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        padding: '13px 16px',
        background: '#f4eee0',
        fontSize: 10.5,
        letterSpacing: .6,
        textTransform: 'uppercase',
        color: '#a2967f',
        fontWeight: 700
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 56,
        flexShrink: 0
      }
    }, this.t('prayer.date')), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        textAlign: 'center'
      }
    }, "Fajr"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        textAlign: 'center'
      }
    }, "Dhuhr"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        textAlign: 'center'
      }
    }, "Maghrib")), monthRows.map((m, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        padding: '13px 16px',
        borderBottom: i === monthRows.length - 1 ? 'none' : '1px solid #f1ebdd',
        fontSize: 13.5,
        color: '#4a443a',
        fontVariantNumeric: 'tabular-nums',
        background: m.today ? '#f3f7f4' : 'transparent'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 56,
        flexShrink: 0,
        fontWeight: 600,
        color: m.today ? '#1f5145' : '#4a443a'
      }
    }, m.day), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        textAlign: 'center'
      }
    }, m.fajr), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        textAlign: 'center'
      }
    }, m.dhuhr), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        textAlign: 'center'
      }
    }, m.maghrib))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '13px 16px',
        background: '#faf6ec',
        fontSize: 11,
        color: '#a2967f',
        lineHeight: 1.45
      }
    }, mNow.toLocaleDateString('en-IE', {
      month: 'long',
      year: 'numeric'
    }), " · Dublin · ", autoLive ? 'live Jaʿfarī times, updated daily' : `anchored to saved ${activePreset.name} times`, " · adjusted by sun position")), tab === 'settings' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: .7,
        textTransform: 'uppercase',
        color: '#a2967f',
        marginBottom: 10
      }
    }, this.t('prayer.source')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        fontWeight: 600,
        color: autoLive ? '#1f5145' : '#7d6220',
        marginBottom: 10
      }
    }, autoLive ? '● Live — synced today with the Jaʿfarī (Leva, Qum) calculation for Dublin' : '○ Live sync unavailable — showing saved times'), (abiPresets(st.livePrayerPresets)).map(preset => {
      const active = st.prayerPreset === preset.id;
      return /*#__PURE__*/React.createElement("div", {
        key: preset.id,
        onClick: () => this.setState({
          prayerPreset: preset.id
        }),
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          background: NEU.surf, boxShadow: neuUp(),
          border: `2px solid ${active ? '#1f5145' : 'rgba(203,195,178,.55)'}`,
          borderRadius: 16,
          padding: '14px 16px',
          cursor: 'pointer',
          marginBottom: 10,
          transition: 'border-color .2s'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 22,
          height: 22,
          borderRadius: '50%',
          border: `2px solid ${active ? NEU.accent : 'rgba(203,195,178,.9)'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }
      }, active && /*#__PURE__*/React.createElement("div", {
        style: {
          width: 11,
          height: 11,
          borderRadius: '50%',
          background: '#1f5145'
        }
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 14,
          fontWeight: 700,
          color: '#2c2823'
        }
      }, preset.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11.5,
          color: NEU.muted,
          marginTop: 2
        }
      }, preset.sub)), active && /*#__PURE__*/React.createElement("span", {
        style: {
          color: '#1f5145',
          fontSize: 18
        }
      }, "✓"));
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: .7,
        textTransform: 'uppercase',
        color: '#a2967f',
        margin: '18px 0 10px'
      }
    }, this.t('prayer.alerts')), /*#__PURE__*/React.createElement("div", {
      style: {
        background: NEU.surf, boxShadow: neuUp(),
        border: NEU.edge,
        borderRadius: 18,
        overflow: 'hidden',
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px',
        borderBottom: '1px solid #f0e8d8'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 38,
        height: 38,
        borderRadius: 12,
        background: '#f0e7d3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        flexShrink: 0
      }
    }, "🔔"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 700,
        color: '#2c2823'
      }
    }, this.t('prayer.adhan')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: NEU.muted,
        marginTop: 1
      }
    }, this.t('prayer.adhanSub'))), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState(s => ({
        adhanEnabled: !s.adhanEnabled
      })),
      role: "switch",
      "aria-checked": st.adhanEnabled ? 'true' : 'false',
      "aria-label": 'Adhan sound',
      style: {
        width: 48,
        height: 26,
        borderRadius: 13,
        boxSizing: 'content-box',
        padding: '9px 0',
        margin: '-9px 0',
        backgroundClip: 'content-box',
        background: st.adhanEnabled ? NEU.accent : NEU.sunk,
        boxShadow: st.adhanEnabled ? 'none' : neuIn(.3),
        position: 'relative',
        cursor: 'pointer',
        transition: 'background .2s',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 3,
        left: 3,
        transform: st.adhanEnabled ? 'translateX(21px)' : 'none',
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: NEU.hi,
        transition: 'transform .2s ease',
        boxShadow: neuUp(.35)
      }
    }))), st.adhanEnabled && ADHAN_SOUNDS.length > 1 && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: NEU.muted,
        marginBottom: 7
      }
    }, this.t('prayer.adhanSound')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, ADHAN_SOUNDS.map(snd => {
      const on = st.adhanSound === snd.key;
      return /*#__PURE__*/React.createElement("div", {
        key: snd.key,
        onClick: () => this.setAdhanSound(snd.key),
        style: {
          flex: 1,
          padding: '9px 11px',
          borderRadius: 12,
          cursor: 'pointer',
          background: NEU.surf,
          border: NEU.edge,
          boxShadow: on ? neuIn(.6) : neuUp(.6)
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12.5,
          fontWeight: 700,
          color: on ? NEU.accent : NEU.ink
        }
      }, snd.label), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10.5,
          marginTop: 1,
          color: on ? 'rgba(255,253,249,.7)' : NEU.muted
        }
      }, snd.sub));
    }))), st.adhanEnabled && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginTop: 10
      }
    }, !st.adhanPlaying ? /*#__PURE__*/React.createElement("div", {
      onClick: this.playAdhan,
      style: {
        flex: 1,
        textAlign: 'center',
        padding: '9px',
        borderRadius: 10,
        background: '#eef7f4',
        border: '1px solid #c4ddd7',
        fontSize: 13,
        fontWeight: 600,
        color: '#1f5145',
        cursor: 'pointer'
      }
    }, this.t('prayer.testAdhan')) : /*#__PURE__*/React.createElement("div", {
      onClick: this.stopAdhan,
      style: {
        flex: 1,
        textAlign: 'center',
        padding: '9px',
        borderRadius: 10,
        background: '#fdf0f2',
        border: '1px solid #dfc4ca',
        fontSize: 13,
        fontWeight: 600,
        color: '#6e2230',
        cursor: 'pointer'
      }
    }, this.t('prayer.stop')))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '16px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 38,
        height: 38,
        borderRadius: 12,
        background: '#f0e7d3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 18,
        flexShrink: 0
      }
    }, "📲"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 700,
        color: '#2c2823'
      }
    }, this.t('prayer.notif')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: NEU.muted,
        marginTop: 1
      }
    }, this.t('prayer.notifSub'))), notifSupported && notifPerm === 'granted' ? /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState(s => {
        const n = !s.notifEnabled;
        lsSet('notifEnabled', n);
        return {
          notifEnabled: n
        };
      }),
      role: "switch",
      "aria-checked": st.notifEnabled ? 'true' : 'false',
      "aria-label": 'Prayer notifications',
      style: {
        width: 48,
        height: 26,
        borderRadius: 13,
        boxSizing: 'content-box',
        padding: '9px 0',
        margin: '-9px 0',
        backgroundClip: 'content-box',
        background: st.notifEnabled ? NEU.accent : NEU.sunk,
        boxShadow: st.notifEnabled ? 'none' : neuIn(.3),
        position: 'relative',
        cursor: 'pointer',
        transition: 'background .2s',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 3,
        left: 3,
        transform: st.notifEnabled ? 'translateX(21px)' : 'none',
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: NEU.hi,
        transition: 'transform .2s ease',
        boxShadow: neuUp(.35)
      }
    })) : /*#__PURE__*/React.createElement("div", {
      style: {
        width: 48,
        height: 26,
        borderRadius: 13,
        background: '#e4ddd1',
        position: 'relative',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 3,
        left: 3,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: NEU.hi,
        boxShadow: neuUp(.35)
      }
    }))), notifSupported && notifPerm !== 'granted' && /*#__PURE__*/React.createElement("div", {
      onClick: this.requestNotifPermission,
      style: {
        marginTop: 12,
        textAlign: 'center',
        padding: '9px',
        borderRadius: 10,
        background: '#eef7f4',
        border: '1px solid #c4ddd7',
        fontSize: 13,
        fontWeight: 600,
        color: '#1f5145',
        cursor: 'pointer'
      }
    }, this.t('prayer.allowNotif')), !notifSupported && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        fontSize: 11.5,
        color: '#6b6252'
      }
    }, this.t('prayer.noNotif'))))), tab !== 'settings' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
      href: "https://ahlulbaytireland.com/prayer-calendar.pdf",
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: NEU.surf, boxShadow: neuUp(),
        border: NEU.edge,
        borderRadius: 16,
        padding: '15px 16px',
        cursor: 'pointer',
        marginBottom: 14,
        textDecoration: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 10,
        background: '#f0e7d3',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#7d6220',
        fontWeight: 700,
        fontSize: 11
      }
    }, "PDF"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: '#2c2823'
      }
    }, this.t('prayer.pdf')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: NEU.muted,
        marginTop: 1
      }
    }, this.t('prayer.pdfSub'))), /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#75601f',
        fontSize: 20
      }
    }, "↓")), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        fontSize: 11.5,
        color: '#6b6252',
        lineHeight: 1.5,
        padding: '6px 20px'
      }
    }, this.t('prayer.note'))));
  }

  /* ── LIBRARY ── */
  /* \u2500\u2500 SAVED \u2500\u2500
     Bookmarks and favourites live under one tab because they are the same act
     with different intent; splitting them across two screens would hide half of
     what a reader has kept. Removal is a two-step press rather than a dialog \u2014
     the app has no modal, and an accidental tap on a phone is easy. */
  renderSaved(st) {
    const kind = st.savedTab;
    const accent = kind === 'bookmark' ? '#3a4a78' : '#8a2f52';
    const tint = kind === 'bookmark' ? '#e9ecf5' : '#f7e6ed';
    const count = k => st.saved.filter(m => m.kind === k).length;
    const all = st.saved.filter(m => m.kind === kind);
    const q = st.savedQuery.trim().toLowerCase();
    const rows = q ? all.filter(m => `${m.contentTitle || ''} ${m.preview || ''}`.toLowerCase().includes(q)) : all;
    const clearKey = 'clear:' + kind;
    const subTab = ([k, label]) => {
      const on = kind === k;
      const n = count(k);
      return /*#__PURE__*/React.createElement("div", {
        key: k,
        onClick: () => this.setState({ savedTab: k, savedQuery: '', savedConfirm: null }),
        style: {
          flex: 1, textAlign: 'center', padding: '11px 0', fontSize: 13, cursor: 'pointer',
          borderRadius: 12, fontWeight: on ? 700 : 500,
          color: on ? k === 'bookmark' ? '#3a4a78' : '#8a2f52' : NEU.muted,
          background: NEU.surf, border: NEU.edge,
          boxShadow: on ? neuIn(.6) : neuUp(.6),
          transition: 'box-shadow .18s ease, color .18s ease'
        }
      }, label, n > 0 ? ` \u00b7 ${n}` : '');
    };
    const removeBtn = m => st.savedConfirm === m.id ? /*#__PURE__*/React.createElement("div", {
      onClick: e => { e.stopPropagation(); this.removeSaved(m.id); },
      "aria-label": `Confirm removing ${m.contentTitle}`,
      style: {
        flexShrink: 0, padding: '9px 12px', borderRadius: 11, cursor: 'pointer',
        background: '#6e2230', color: '#f7e8e6', fontSize: 12, fontWeight: 700, minHeight: 44,
        display: 'flex', alignItems: 'center'
      }
    }, "Remove?") : /*#__PURE__*/React.createElement("div", {
      onClick: e => { e.stopPropagation(); this.setState({ savedConfirm: m.id }); },
      "aria-label": `Remove ${m.contentTitle}`,
      style: {
        flexShrink: 0, width: 44, height: 44, borderRadius: 12, cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }
    }, icon('trash-2', { size: 15, stroke: NEU.muted }));
    return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', gap: 8, marginBottom: 14 }
    }, [['bookmark', 'Bookmarks'], ['favourite', 'Favourites']].map(subTab)),
    all.length > 6 && /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'center', gap: 10, ...neuWell(14, .8), padding: '11px 14px', marginBottom: 14 }
    }, icon('search', { size: 17, stroke: '#6b6252' }), /*#__PURE__*/React.createElement("input", {
      value: st.savedQuery,
      onChange: e => this.setState({ savedQuery: e.target.value }),
      "aria-label": `Search ${kind === 'bookmark' ? 'bookmarks' : 'favourites'}`,
      placeholder: 'Search titles and passages',
      style: { border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: '#3f3a32', width: '100%' }
    })),
    rows.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: { ...neuCard(18, .85), padding: '30px 22px', textAlign: 'center' }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 54, height: 54, borderRadius: '50%', margin: '0 auto 14px', display: 'flex',
        alignItems: 'center', justifyContent: 'center', color: accent,
        background: `linear-gradient(145deg, ${tint}, ${accent}22)`
      }
    }, icon(kind === 'bookmark' ? 'bookmark' : 'heart', { size: 24 })), /*#__PURE__*/React.createElement("div", {
      style: { fontFamily: 'Spectral,serif', fontSize: 16, fontWeight: 600, color: NEU.ink }
    }, q ? 'Nothing matches that search' : kind === 'bookmark' ? 'No bookmarks yet' : 'No favourites yet'), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 12.5, color: NEU.muted, marginTop: 6, lineHeight: 1.5 }
    }, q ? 'Try a word from the title or the passage.' : `Open any du\u02bf\u0101\u02be, ziy\u0101rah, amaal or book, tap the line you want to keep, and choose the ${kind === 'bookmark' ? 'bookmark' : 'heart'}.`)),
    rows.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', flexDirection: 'column', gap: 10 }
    }, rows.map(m => /*#__PURE__*/React.createElement("div", {
      key: m.id,
      style: { ...neuCard(16, .85), padding: '13px 8px 11px 15px' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'flex-start', gap: 8 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { flex: 1, minWidth: 0 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 10, letterSpacing: .9, textTransform: 'uppercase', fontWeight: 800, color: accent }
    }, `${CONTENT_KIND[m.contentType] || 'Library'} \u00b7 ${m.lineId ? 'Passage ' + m.lineNo : 'Whole text'}`), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif', fontSize: 15.5, fontWeight: 600, color: NEU.ink,
        marginTop: 2, lineHeight: 1.25
      }
    }, m.contentTitle)), removeBtn(m)), m.preview && /*#__PURE__*/React.createElement("div", {
      dir: /[\u0600-\u06FF]/.test(m.preview) ? 'rtl' : undefined,
      style: {
        fontSize: 12.5, color: NEU.muted, marginTop: 7, lineHeight: 1.5,
        paddingLeft: 10, borderLeft: `2px solid ${accent}44`, marginRight: 7
      }
    }, m.preview), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 8, marginTop: 9, marginRight: 7
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 11, color: NEU.muted }
    }, 'Saved ' + new Date(m.at).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' })), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.openSaved(m),
      style: {
        display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', color: accent,
        fontSize: 12.5, fontWeight: 700, minHeight: 44, padding: '0 4px'
      }
    }, 'Open in reader', /*#__PURE__*/React.createElement("span", { "aria-hidden": "true" }, "\u203a")))))),
    all.length > 0 && /*#__PURE__*/React.createElement("div", {
      onClick: () => st.savedConfirm === clearKey ? this.clearSaved(kind) : this.setState({ savedConfirm: clearKey }),
      style: {
        marginTop: 14, textAlign: 'center', padding: '13px 12px', borderRadius: 13, cursor: 'pointer',
        border: `1.5px solid ${st.savedConfirm === clearKey ? '#6e2230' : 'rgba(110,34,48,.3)'}`,
        color: '#6e2230', fontSize: 13, fontWeight: 700, minHeight: 44
      }
    }, st.savedConfirm === clearKey ? `Tap again to clear all ${all.length}` : `Clear all ${kind === 'bookmark' ? 'bookmarks' : 'favourites'}`),
    /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 11.5, color: NEU.muted, marginTop: 18, lineHeight: 1.6, textAlign: 'center' }
    }, 'Saved on this device. Clearing your browser or app data may remove your bookmarks and progress.'));
  }

  renderLibrary(st) {
    const q = st.libQuery.trim().toLowerCase();
    const duaList = st.liveDuas || DUAS;
    const ziyList = st.liveZiyarat || ZIYARAT;
    const nahjData = st.liveNahj || NAHJ;
    const aamalList = st.liveAamals || [];
    const libMeta = {
      dua: {
        title: "Duʿāʾ",
        accent: '#7d6220',
        tint: '#f3ecd9',
        list: duaList,
        cats: ['All', ...new Set(duaList.map(it => it.cat).filter(Boolean))]
      },
      ziyarah: {
        title: 'Ziyārah',
        accent: '#6e2230',
        tint: '#f3e6e8',
        list: ziyList,
        cats: ['All', ...new Set(ziyList.map(it => it.cat).filter(Boolean))]
      },
      aamal: {
        title: 'Daily Amaals',
        accent: '#8a4b2c',
        tint: '#f6ebe4',
        list: aamalList,
        cats: ['All', ...new Set(aamalList.map(it => it.cat).filter(Boolean))]
      },
      nahj: {
        title: 'Books',
        accent: '#2c5d52',
        tint: '#e6efe9',
        list: [],
        cats: []
      },
      saved: {
        title: 'Saved',
        accent: '#3a4a78',
        tint: '#e9ecf5',
        list: [],
        cats: []
      }
    };
    const lm = libMeta[st.libTab];
    /* Icon tabs, matching Kids Corner: the chosen section presses into the page
       and its icon lifts out of it, so the selected state reads by depth rather
       than by a block of accent colour. */
    const libTab = ([k, label, icon]) => {
      const on = st.libTab === k;
      const meta = libMeta[k];
      return /*#__PURE__*/React.createElement("div", {
        key: k,
        onClick: () => this.setState({
          libTab: k,
          libQuery: '',
          libCat: 'All'
        }),
        style: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 5,
          padding: '10px 3px 8px',
          borderRadius: 16,
          cursor: 'pointer',
          background: on ? meta.tint : NEU.surf,
          border: NEU.edge,
          boxShadow: on ? neuIn(.72) : neuUp(.72),
          transition: 'box-shadow .2s ease, background .2s ease'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 32,
          height: 32,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 17,
          background: on ? NEU.surf : meta.tint,
          boxShadow: on ? neuUp(.42) : neuIn(.38)
        }
      }, icon), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10.5,
          fontWeight: 700,
          color: on ? meta.accent : NEU.muted,
          lineHeight: 1.1,
          textAlign: 'center'
        }
      }, label));
    };
    const chipStyle = c => {
      const active = st.libCat === c;
      return {
        flexShrink: 0,
        padding: '13px 16px',
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'box-shadow .18s ease, color .18s ease',
        background: NEU.surf,
        color: active ? lm.accent : NEU.muted,
        border: NEU.edge,
        boxShadow: active ? neuIn(.55) : neuUp(.55)
      };
    };
    let libCards = [];
    if (st.libTab === 'dua' || st.libTab === 'ziyarah' || st.libTab === 'aamal') {
      libCards = lm.list.filter(it => {
        const catOk = st.libCat === 'All' || it.cat === st.libCat;
        const qOk = !q || (it.title || '').toLowerCase().includes(q) || (it.tr || '').toLowerCase().includes(q);
        return catOk && qOk;
      }).sort((a, b) => {
        // nearly every ziyārah title starts with a variant spelling of the word
        // itself, so ordering only reads properly by what comes after it
        const key = t => {
          let k = sortKey(t);
          if (st.libTab === 'ziyarah') k = k.replace(/^(ziyarat|ziyarah|ziarat|ziarah)\s+(of\s+)?/i, '');
          return k;
        };
        return key(a.title).localeCompare(key(b.title), 'en', { sensitivity: 'base', numeric: true });
      });
    }
    let nahjCards = [];
    if (st.libTab === 'nahj') {
      nahjCards = (nahjData[st.nahjTab] || []).filter(it => !q || (it.title || '').toLowerCase().includes(q) || (it.tr || '').toLowerCase().includes(q));
    }
    const nahjTabStyle = k => ({
      flex: 1,
      textAlign: 'center',
      padding: '8px 0',
      fontSize: 13,
      cursor: 'pointer',
      borderRadius: 11,
      transition: 'box-shadow .18s ease, color .18s ease',
      fontWeight: st.nahjTab === k ? 700 : 500,
      color: st.nahjTab === k ? '#2c5d52' : NEU.muted,
      background: NEU.surf,
      boxShadow: st.nahjTab === k ? neuIn(.55) : neuUp(.55)
    });
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 20px 100px'
      },
      className: "afu"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'sticky',
        top: 0,
        zIndex: 6,
        margin: '0 -20px',
        padding: '0 20px 4px',
        background: st.dark ? NEU_D.bg : NEU.bg
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 56px 14px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: st.dark ? '#8e9490' : NEU.muted,
        fontWeight: 500
      }
    }, this.t('lib.header')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 26,
        fontWeight: 600,
        color: st.dark ? '#ece6d8' : '#27241f',
        marginTop: 2
      }
    }, lm.title)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8
      }
    }, [['dua', "Duʿāʾ", '🤲'], ['ziyarah', 'Ziyārah', '🕌'], ['aamal', 'Amaals', '✨'], ['nahj', 'Books', '📖'], ['saved', 'Saved', '🔖']].map(libTab))), st.libTab === 'saved' && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16
      }
    }, this.renderSaved(st)), st.libTab !== 'saved' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginTop: 16,
        ...neuWell(14, .8),
        padding: '11px 14px',
        marginBottom: 14
      }
    }, icon('search', { size: 17, stroke: '#6b6252' }), /*#__PURE__*/React.createElement("input", {
      value: st.libQuery,
      onChange: e => this.setState({
        libQuery: e.target.value
      }),
      placeholder: this.t('lib.search'),
      style: {
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontSize: 14,
        color: '#3f3a32',
        width: '100%'
      }
    }), st.libQuery && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({
        libQuery: ''
      }),
      style: {
        color: '#6b6252',
        cursor: 'pointer',
        fontSize: 20,
        lineHeight: 1,
        width: 44,
        height: 44,
        margin: -12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, "×")), lm.cats.length > 0 && /*#__PURE__*/React.createElement("div", {
      className: "s",
      style: {
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        margin: '0 -20px 16px',
        padding: '0 20px 2px'
      }
    }, lm.cats.map(c => /*#__PURE__*/React.createElement("div", {
      key: c,
      onClick: () => this.setState({
        libCat: c
      }),
      style: chipStyle(c)
    }, c))), st.libTab === 'nahj' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginBottom: 16
      }
    }, [['sermons', 'Sermons'], ['letters', 'Letters'], ['sayings', 'Sayings']].map(([k, label]) => /*#__PURE__*/React.createElement("div", {
      key: k,
      onClick: () => this.setState({
        nahjTab: k
      }),
      style: nahjTabStyle(k)
    }, label))), libCards.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, libCards.map((it2, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => this.openReading(st.libTab, it2),
      style: {
        background: NEU.surf, boxShadow: neuUp(),
        border: NEU.edge,
        borderRadius: 16,
        padding: '14px 15px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 13
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0,
        width: 36,
        height: 36,
        clipPath: 'polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)',
        background: lm.tint,
        color: lm.accent,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        fontWeight: 700
      }
    }, i + 1), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        fontFamily: 'Spectral,serif',
        fontSize: 16,
        fontWeight: 600,
        color: '#2c2823',
        lineHeight: 1.3
      }
    }, it2.title), /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        color: '#6b6252',
        fontSize: 18,
        lineHeight: 1
      }
    }, "›")))), nahjCards.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10
      }
    }, nahjCards.map((n, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => this.openReading('nahj', n),
      style: {
        background: NEU.surf, boxShadow: neuUp(),
        border: NEU.edge,
        borderRadius: 16,
        padding: '12px 13px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 7
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        letterSpacing: .7,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#2c5d52',
        background: '#e6efe9',
        padding: '3px 7px',
        borderRadius: 6,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, n.ref), /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#6b6252',
        fontSize: 14,
        flexShrink: 0
      }
    }, "⤢")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 14.5,
        fontWeight: 600,
        color: '#2c2823',
        lineHeight: 1.3,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }
    }, n.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: NEU.muted,
        lineHeight: 1.45,
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }
    }, n.sum || n.tr), n.pdf && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 700,
        color: '#2c5d52',
        letterSpacing: .5
      }
    }, "PDF · tap to read")))), st.libTab !== 'saved' && libCards.length === 0 && nahjCards.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        padding: '40px 20px',
        color: NEU.muted,
        fontSize: 14
      }
    }, q ? `No results for "${st.libQuery}"`
       : st.libCat !== 'All' ? `No items in "${st.libCat}"`
       : `Nothing here yet — ${lm.title} is filled in from the admin dashboard.`));
  }

  /* ── READING ── */
  /* One addressable passage. The two actions sit in a strip that stays collapsed
     until the line is hovered, focused, tapped, or already saved, so a page of
     scripture reads as scripture rather than as a list of controls.
     The line takes its own tabindex and keeps its cursor in CSS: given an inline
     one, enhanceTappables would label every verse "button", which is exactly what
     a screen reader must not hear on a reading page. */
  renderLine(st, o) {
    const bm = this.isSaved('bookmark', o.contentId, o.lineId);
    const fav = this.isSaved('favourite', o.contentId, o.lineId);
    const lit = bm || fav || st.activeLine === o.lineId;
    const rec = {
      contentId: o.contentId,
      contentType: o.contentType,
      contentTitle: o.contentTitle,
      lineId: o.lineId,
      lineNo: o.lineNo,
      lang: o.lang,
      preview: o.text.length > 120 ? o.text.slice(0, 117) + '\u2026' : o.text
    };
    const act = (kind, name, on, label) => /*#__PURE__*/React.createElement("div", {
      className: "abi-line-act",
      role: "button",
      tabIndex: 0,
      "aria-label": label,
      "aria-pressed": on ? 'true' : 'false',
      onClick: e => {
        e.stopPropagation();
        this.toggleSaved(kind, rec);
      },
      onKeyDown: e => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        e.preventDefault();
        e.stopPropagation();
        this.toggleSaved(kind, rec);
      },
      style: {
        background: on ? st.dark ? 'rgba(216,184,99,.16)' : o.accent + '1f' : 'transparent'
      }
    }, icon(name, {
      size: 16,
      stroke: on ? o.accent : o.rd.muted,
      fill: on ? o.accent : 'none'
    }));
    return /*#__PURE__*/React.createElement("div", {
      key: o.lineNo + '-' + o.lineId,
      className: 'abi-line' + (lit ? ' on' : '') + (st.jumpLine === o.lineId ? ' abi-flash' : ''),
      "data-line": o.lineId,
      tabIndex: 0,
      onClick: () => this.setState({
        activeLine: st.activeLine === o.lineId ? null : o.lineId
      }),
      // focus reveals the same actions a tap does, so the keyboard route matches
      onFocus: () => {
        if (st.activeLine !== o.lineId) this.setState({ activeLine: o.lineId });
      },
      style: {
        padding: '2px 6px',
        margin: '0 -6px'
      }
    }, o.body, lit && /*#__PURE__*/React.createElement("div", {
      className: "abi-line-acts"
    }, act('bookmark', 'bookmark', bm, (bm ? 'Remove bookmark from passage ' : 'Bookmark passage ') + o.lineNo), act('favourite', 'heart', fav, fav ? 'Remove passage ' + o.lineNo + ' from favourites' : 'Add passage ' + o.lineNo + ' to favourites')));
  }

  renderReading(st) {
    const dark = st.dark;
    const r = st.readingItem || {};
    const rtype = st.readingType;
    const rd = dark ? {
      bg: NEU_D.bg,
      surf: NEU_D.surf,
      text: '#ece6d8',
      muted: '#8e9490',
      border: 'rgba(255,255,255,.07)',
      barBg: NEU_D.bg,
      accent: '#d8b863',
      arInk: '#e9e1cd'
    } : {
      bg: NEU.bg,
      surf: NEU.surf,
      text: '#2c2823',
      muted: NEU.muted,
      border: 'rgba(203,195,178,.55)',
      barBg: NEU.bg,
      accent: '#1f5145',
      arInk: '#2c2823'
    };
    const arSize = Math.round(30 * st.textSize) + 'px';
    const trSize = Math.round(17 * st.textSize) + 'px';
    const readAccent = rtype === 'ziyarah' ? '#6e2230' : rtype === 'nahj' ? '#2c5d52' : rtype === 'aamal' ? '#8a4b2c' : '#7d6220';
    // per-language content: items may carry body_ur / body_fa / body_hi alongside the English body
    const TR_CODES = { 'हिन्दी': 'hi', 'فارسی': 'fa', 'Urdu': 'ur' };
    const trCode = TR_CODES[st.lang];
    const KICKERS = {
      dua: { English: 'Supplication', 'العربية': 'دعاء', 'हिन्दी': 'दुआ', 'فارسی': 'دعا', Urdu: 'دعا' },
      ziyarah: { English: 'Salutation', 'العربية': 'زيارة', 'हिन्दी': 'ज़ियारत', 'فارسی': 'زیارت', Urdu: 'زیارت' },
      aamal: { English: 'Daily Amaal', 'العربية': 'عمل', 'हिन्दी': 'आमाल', 'فارسی': 'اعمال', Urdu: 'اعمال' }
    };
    const kicker = KICKERS[rtype] ? KICKERS[rtype][st.lang] || KICKERS[rtype].English : r.ref || 'Books';
    const cId = contentKey(rtype, r);
    /* Repeated refrains would otherwise share one id, so a second occurrence is
       suffixed. Numbering still comes from position; identity does not. */
    const mkLines = txt => {
      const seen = {};
      return String(txt).replace(/\n\s*\n+/g, '\n').split('\n').map(t => t.trim()).filter(Boolean).map((text, i) => {
        const h = passageKey(text);
        const n = seen[h] = (seen[h] || 0) + 1;
        return { text, id: n > 1 ? h + '~' + n : h, no: i + 1 };
      });
    };
    const localBody = trCode ? r['body_' + trCode] || '' : '';
    const trRtl = !!localBody && (trCode === 'fa' || trCode === 'ur');
    const enBody = localBody || r.body || r.tr || '';
    const hasEn = !!(enBody || r.sum);
    const hasAr = !!r.ar;
    const hasPdf = !!r.pdf;
    const tabs = [];
    if (hasAr) tabs.push(['ar', '\u0627\u0644\u0639\u0631\u0628\u064a\u0629']);
    if (hasEn) tabs.push(['en', localBody ? st.lang : 'English']);
    if (hasPdf) tabs.push(['pdf', 'PDF']);
    const lang = tabs.some(t => t[0] === st.readingLang) ? st.readingLang : hasAr ? 'ar' : tabs.length ? tabs[0][0] : 'en';
    const pill = ([k, label]) => React.createElement("div", {
      key: k,
      onClick: () => {
        this.setState({ readingLang: k });
        const inner = document.querySelector('.app > .s .s');
        if (inner) inner.scrollTop = 0;
      },
      style: {
        flex: 1,
        textAlign: 'center',
        padding: '13px 0',
        borderRadius: 12,
        fontSize: 13.5,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: k === 'ar' ? "'Noto Naskh Arabic','Amiri',serif" : 'inherit',
        background: rd.surf,
        color: lang === k ? readAccent : rd.muted,
        border: dark ? NEU_D.edge : NEU.edge,
        boxShadow: lang === k ? neuIn(.6, dark) : neuUp(.6, dark),
        transition: 'box-shadow .18s ease, color .18s ease'
      }
    }, label);
    const miniBtn = {
      width: 44, height: 44, borderRadius: 13, display: 'flex', alignItems: 'center',
      justifyContent: 'center', border: dark ? NEU_D.edge : NEU.edge, background: rd.surf,
      boxShadow: neuUp(.5, dark), cursor: 'pointer', flexShrink: 0
    };
    const shareBtn = React.createElement("div", {
      onClick: this.handleShare,
      title: this.t('lib.share'),
      "aria-label": this.t('lib.share'),
      style: miniBtn
    }, icon('share-2', { size: 14, stroke: readAccent }));
    /* The header pair marks the whole item; the strips down the page mark a line.
       Both land in the same store, so Saved shows them together. */
    const wholeRec = {
      contentId: cId, contentType: rtype, contentTitle: r.title || '',
      lineId: null, lineNo: 0, lang,
      preview: String(r.tr || r.sum || r.note || r.title || '').slice(0, 120)
    };
    const itemBookmarked = this.isSaved('bookmark', cId, null);
    const itemFavourite = this.isSaved('favourite', cId, null);
    const bookmarkBtn = React.createElement("div", {
      onClick: () => this.toggleSaved('bookmark', wholeRec),
      "aria-label": itemBookmarked ? 'Remove bookmark from this text' : 'Bookmark this text',
      "aria-pressed": itemBookmarked ? 'true' : 'false',
      style: miniBtn
    }, icon('bookmark', { size: 15, stroke: readAccent, fill: itemBookmarked ? readAccent : 'none' }));
    const favouriteBtn = React.createElement("div", {
      onClick: () => this.toggleSaved('favourite', wholeRec),
      "aria-label": itemFavourite ? 'Remove this text from favourites' : 'Add this text to favourites',
      "aria-pressed": itemFavourite ? 'true' : 'false',
      style: miniBtn
    }, icon('heart', { size: 15, stroke: readAccent, fill: itemFavourite ? readAccent : 'none' }));
    return React.createElement("div", {
      style: { height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: rd.bg }
    }, React.createElement("div", {
      style: {
        flexShrink: 0, background: rd.barBg, zIndex: 2,
        boxShadow: `0 6px 14px ${dark ? NEU_D.lo : NEU.lo}`, padding: '12px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }
    }, React.createElement("div", {
      onClick: () => {
        this.saveReadPos();
        this.setState({ screen: 'library', readingItem: null, readingType: null, readingLang: null });
        const sc = document.querySelector('.app > .s');
        if (sc) sc.scrollTop = 0;
      },
      style: { display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', color: rd.accent, fontSize: 14, fontWeight: 600, minHeight: 44, padding: '0 8px', margin: '0 -8px' }
    }, React.createElement("span", { style: { fontSize: 18 } }, "\u2039"), " ", this.t('lib.back')),
    React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 8 } },
      React.createElement("div", {
        onClick: () => this.setTextSize(st.textSize - .12),
        "aria-label": "Smaller text",
        style: { width: 44, height: 44, borderRadius: 13, border: `1px solid ${rd.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: rd.text, fontSize: 14, cursor: 'pointer', background: rd.surf }
      }, "A\u2212"),
      React.createElement("div", {
        onClick: () => this.setTextSize(st.textSize + .12),
        "aria-label": "Larger text",
        style: { width: 44, height: 44, borderRadius: 13, border: `1px solid ${rd.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: rd.text, fontSize: 18, cursor: 'pointer', background: rd.surf }
      }, "A+"),
      React.createElement("div", {
        onClick: () => this.setDark(!st.dark),
        "aria-label": st.dark ? 'Switch to light reading' : 'Switch to dark reading',
        "aria-pressed": st.dark ? 'true' : 'false',
        style: { width: 44, height: 44, borderRadius: 13, border: `1px solid ${rd.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: rd.surf }
      }, icon('moon', { size: 19, stroke: rd.accent })),
      React.createElement("img", {
        src: "./icon-192.png",
        alt: "Ahlul Bayt Ireland",
        style: { width: 34, height: 34, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }
      }))),
    React.createElement("div", {
      className: "s",
      style: { flex: '1 1 auto', overflowY: 'auto', padding: '10px 22px 24px' }
    }, React.createElement("div", { style: { padding: '0 0 12px' } },
      React.createElement("div", { style: { display: 'flex', alignItems: 'flex-start', gap: 8 } },
        React.createElement("div", { style: { flex: 1, minWidth: 0 } },
          React.createElement("div", { style: { fontSize: 10, letterSpacing: .9, textTransform: 'uppercase', fontWeight: 700, color: readAccent } }, kicker),
          React.createElement("div", { style: { fontFamily: 'Spectral,serif', fontSize: 15, fontWeight: 600, color: rd.text, marginTop: 1, lineHeight: 1.2 } }, r.title),
          r.note && React.createElement("div", { style: { fontSize: 10.5, color: rd.muted, marginTop: 2, fontStyle: 'italic' } }, r.note)),
        shareBtn, bookmarkBtn, favouriteBtn),
      tabs.length > 1 && React.createElement("div", { style: { display: 'flex', gap: 8, marginTop: 8 } }, tabs.map(pill))),
    lang === 'ar' && hasAr && React.createElement("div", {
      style: { background: rd.surf, border: `1px solid ${rd.border}`, borderRadius: 20, padding: '18px 16px' }
    }, mkLines(r.ar).map(L => {
      // Latin lines inside an Arabic text (sub-headings, recitation instructions) must not
      // inherit the much larger Arabic size — they get the Latin face at translation size.
      const latin = /[A-Za-z]/.test(L.text) && !/[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/.test(L.text);
      return this.renderLine(st, {
        rd, accent: readAccent, contentId: cId, contentType: rtype,
        contentTitle: r.title || '', lineId: L.id, lineNo: L.no, text: L.text, lang: 'ar',
        body: React.createElement("div", {
          dir: latin ? 'ltr' : 'rtl',
          style: latin ? {
            fontFamily: 'Spectral,serif', fontSize: arSize, lineHeight: 1.4,
            color: rd.muted, textAlign: 'center', fontStyle: 'italic', margin: '14px 0'
          } : {
            fontFamily: "'Noto Naskh Arabic','Amiri',serif", fontSize: arSize,
            lineHeight: 1.9, color: rd.arInk, textAlign: 'center'
          }
        }, L.text)
      });
    })),
    lang === 'en' && hasEn && React.createElement(React.Fragment, null,
      enBody && React.createElement("div", null, mkLines(enBody).map(L => this.renderLine(st, {
        rd, accent: readAccent, contentId: cId, contentType: rtype,
        contentTitle: r.title || '', lineId: L.id, lineNo: L.no, text: L.text, lang: 'en',
        body: React.createElement("div", {
          dir: trRtl ? 'rtl' : undefined,
          style: {
            fontFamily: trRtl ? "'Noto Naskh Arabic','Amiri',serif" : 'Spectral,serif',
            fontSize: trSize,
            lineHeight: trRtl ? 1.9 : 1.6,
            color: rd.text
          }
        }, L.text)
      }))),
      r.sum && React.createElement("div", {
        style: { background: rd.surf, border: `1px solid ${rd.border}`, borderRadius: 16, padding: '15px 17px', marginTop: enBody ? 20 : 0 }
      }, React.createElement("div", {
        style: { fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700, color: rd.muted, marginBottom: 6 }
      }, this.t('lib.summary')), React.createElement("div", {
        style: { fontSize: 14, lineHeight: 1.6, color: rd.text }
      }, r.sum))),
    lang === 'pdf' && hasPdf && React.createElement(React.Fragment, null,
      React.createElement("iframe", {
        src: 'https://docs.google.com/gview?embedded=1&url=' + encodeURIComponent(r.pdf),
        title: "PDF",
        style: { width: '100%', height: '62vh', border: `1px solid ${rd.border}`, borderRadius: 16, background: rd.surf }
      }),
      React.createElement("div", {
        onClick: () => window.open(r.pdf, '_blank'),
        style: {
          marginTop: 12, textAlign: 'center', padding: 13, borderRadius: 14,
          border: `1.5px solid ${readAccent}`, color: readAccent, background: rd.surf,
          fontSize: 13.5, fontWeight: 600, cursor: 'pointer'
        }
      }, "Open PDF in browser \u2197"))));
  }

  /* ── CLASSIFIEDS ── */
  renderClassifieds(st) {
    const allLabel = this.t('class.all');
    const cats = [allLabel, 'Food', 'Butcher', 'Travel', 'Education', 'Services'];
    const q = st.classQuery.trim().toLowerCase();
    const cards = [PINNED_CLASSIFIED, ...st.liveClassifieds.filter(c => c.name !== 'SoftEire Technology Limited').filter(c => st.classCat === allLabel || st.classCat === 'All' || c.cat === st.classCat).filter(c => !q || c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q))];
    const chipStyle = c => {
      const active = st.classCat === c;
      return {
        flexShrink: 0,
        padding: '13px 16px',
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        background: NEU.surf,
        color: active ? NEU.accent : NEU.muted,
        border: NEU.edge,
        boxShadow: active ? neuIn(.55) : neuUp(.55)
      };
    };
    const btnBase = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      padding: 11,
      borderRadius: 12,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      textDecoration: 'none'
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 20px 100px'
      },
      className: "afu"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 56px 14px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: NEU.muted,
        fontWeight: 500
      }
    }, this.t('class.community')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 26,
        fontWeight: 600,
        color: '#27241f',
        marginTop: 2
      }
    }, this.t('class.title'))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: NEU.surf, boxShadow: neuUp(),
        border: NEU.edge,
        borderRadius: 14,
        padding: '11px 14px',
        marginBottom: 14
      }
    }, icon('search', { size: 17, stroke: '#6b6252' }), /*#__PURE__*/React.createElement("input", {
      value: st.classQuery,
      onChange: e => this.setState({
        classQuery: e.target.value
      }),
      placeholder: this.t('class.search'),
      style: {
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontSize: 14,
        color: '#3f3a32',
        width: '100%'
      }
    }), st.classQuery && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({
        classQuery: ''
      }),
      style: {
        color: '#6b6252',
        cursor: 'pointer',
        fontSize: 20,
        lineHeight: 1,
        width: 44,
        height: 44,
        margin: -12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, "×")), /*#__PURE__*/React.createElement("div", {
      className: "s",
      style: {
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        margin: '0 -20px 16px',
        padding: '0 20px 2px'
      }
    }, cats.map(c => /*#__PURE__*/React.createElement("div", {
      key: c,
      onClick: () => this.setState({
        classCat: c
      }),
      style: chipStyle(c)
    }, c))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, cards.map((b, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        background: NEU.surf, boxShadow: neuUp(),
        border: NEU.edge,
        borderRadius: 18,
        padding: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 13
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0,
        width: 50,
        height: 50,
        borderRadius: 14,
        background: b.tint,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Spectral,serif',
        fontSize: 22,
        fontWeight: 600,
        color: b.ink
      }
    }, b.name[0]), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 16,
        fontWeight: 600,
        color: '#2c2823'
      }
    }, b.name), /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        fontSize: 10,
        letterSpacing: .6,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: CAT_INK[b.cat] || b.ink,
        background: b.tint,
        padding: '3px 8px',
        borderRadius: 6
      }
    }, b.cat)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: '#6b6252',
        marginTop: 4,
        lineHeight: 1.45
      }
    }, b.desc), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 12,
        color: NEU.muted,
        marginTop: 7
      }
    }, icon('map-pin', { size: 13 }), b.loc))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 9,
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: `https://wa.me/${b.wa}`,
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...btnBase,
        background: '#1f5145',
        color: '#fffdf9'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "15",
      height: "15",
      viewBox: "0 0 24 24",
      fill: "currentColor"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 2a10 10 0 0 0-8.6 15l-1.4 5 5.1-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.2 14.8l-.4-.2-2.6.7.7-2.5-.2-.4A8 8 0 0 1 12 4z"
    })), this.t('class.whatsapp'))), /*#__PURE__*/React.createElement("a", {
      href: `tel:${b.phone}`,
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...btnBase,
        border: NEU.edge,
        background: NEU.surf,
        boxShadow: neuUp(.7),
        color: '#3f3a32'
      }
    }, icon('phone', { size: 15 }), this.t('class.call'))), b.web && /*#__PURE__*/React.createElement("a", {
      href: b.web,
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        width: 46
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        ...btnBase,
        height: '100%',
        borderRadius: 12,
        border: NEU.edge,
        background: NEU.surf,
        boxShadow: neuUp(.7)
      }
    }, icon('globe', { size: 16, stroke: '#7d6220' })))))), cards.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        padding: '40px 20px',
        color: NEU.muted,
        fontSize: 14
      }
    }, q ? `No results for "${st.classQuery}"` : `No listings in "${st.classCat}"`)), cards.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        fontSize: 11.5,
        color: '#6b6252',
        lineHeight: 1.5,
        padding: '18px 24px 0'
      }
    }, this.t('class.disclaimer')));
  }

  /* ── MORE ── */
  renderMore(st) {
    const links = [{
      label: this.t('more.calendar'),
      sub: this.t('more.calSub'),
      glyph: 'ﮬ',
      go: () => this.go('calendar')
    }, {
      label: this.t('more.admin'),
      sub: this.t('more.adminSub'),
      glyph: '⚙',
      go: () => this.go('admin')
    }, {
      label: this.t('more.about'),
      sub: this.t('more.aboutSub'),
      glyph: '↧',
      go: () => this.go('about')
    }, {
      label: this.t('more.offline'),
      sub: this.t('more.offlineSub'),
      glyph: '⊘',
      go: () => this.go('offline')
    }];
    const langs = ['English', 'العربية', 'हिन्दी', 'فارسی', 'Urdu'];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 20px 100px'
      },
      className: "afu"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 56px 16px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 26,
        fontWeight: 600,
        color: st.dark ? '#ece6d8' : '#27241f'
      }
    }, this.t('more.title'))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 11,
        marginBottom: 24
      }
    }, links.map((m, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: m.go,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: NEU.surf, boxShadow: neuUp(),
        border: NEU.edge,
        borderRadius: 16,
        padding: '15px 16px',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 40,
        height: 40,
        borderRadius: 12,
        background: NEU.sunk,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Amiri,serif',
        fontSize: 19,
        color: '#1f5145'
      }
    }, m.glyph), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: '#2c2823'
      }
    }, m.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: NEU.muted,
        marginTop: 1
      }
    }, m.sub)), /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#6b6252',
        fontSize: 20
      }
    }, "›")))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#6b6252',
        marginBottom: 12,
        paddingLeft: 2
      }
    }, this.t('more.language')), /*#__PURE__*/React.createElement("div", {
      style: {
        background: NEU.surf, boxShadow: neuUp(),
        border: NEU.edge,
        borderRadius: 16,
        padding: '6px 16px',
        marginBottom: 24
      }
    }, langs.map((l, i) => /*#__PURE__*/React.createElement("div", {
      key: l,
      onClick: () => this.setState({
        lang: l
      }),
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '13px 0',
        borderBottom: i < langs.length - 1 ? NEU.rule : 'none',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14.5,
        color: st.lang === l ? '#1f5145' : '#3f3a32',
        fontWeight: st.lang === l ? 700 : 400
      }
    }, l), st.lang === l && icon('check', { size: 18, stroke: NEU.accent, sw: 2.4 })))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#6b6252',
        marginBottom: 12,
        paddingLeft: 2
      }
    }, this.t('more.reading')), /*#__PURE__*/React.createElement("div", {
      style: {
        background: NEU.surf, boxShadow: neuUp(),
        border: NEU.edge,
        borderRadius: 16,
        padding: '6px 16px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '13px 0',
        borderBottom: NEU.rule
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14.5,
        color: '#3f3a32'
      }
    }, this.t('more.dark')), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setDark(!st.dark),
      role: "switch",
      "aria-checked": st.dark ? 'true' : 'false',
      "aria-label": this.t('more.dark'),
      style: {
        boxSizing: 'content-box',
        padding: '8px 0',
        margin: '-8px 0',
        backgroundClip: 'content-box',
        width: 48,
        height: 28,
        borderRadius: 16,
        background: st.dark ? '#1f5145' : '#d8d0bf',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background .2s'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 3,
        left: 3,
        transform: st.dark ? 'translateX(20px)' : 'none',
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,.2)',
        transition: 'transform .2s ease'
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '13px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14.5,
        color: '#3f3a32'
      }
    }, this.t('more.largeText')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setTextSize(st.textSize - .12),
      style: {
        width: 30,
        height: 30,
        borderRadius: 9,
        border: NEU.edge,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#3f3a32',
        fontSize: 14,
        cursor: 'pointer',
        minWidth: 44,
        minHeight: 44
      }
    }, "A−"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: NEU.muted,
        fontVariantNumeric: 'tabular-nums',
        width: 38,
        textAlign: 'center'
      }
    }, Math.round(st.textSize * 100), "%"), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setTextSize(st.textSize + .12),
      style: {
        width: 30,
        height: 30,
        borderRadius: 9,
        border: NEU.edge,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#3f3a32',
        fontSize: 17,
        cursor: 'pointer',
        minWidth: 44,
        minHeight: 44
      }
    }, "A+")))), st.saved.length > 0 && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({
        screen: 'library',
        libTab: 'saved',
        libQuery: '',
        libCat: 'All'
      }),
      className: "neu-press",
      style: {
        ...neuCard(14, .85),
        marginTop: 22,
        padding: '14px 15px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        flexShrink: 0,
        width: 38,
        height: 38,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#e9ecf5',
        background: 'linear-gradient(145deg, #3a4a78e6, #3a4a78)'
      }
    }, icon('bookmark', { size: 17 })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: '#2c2823'
      }
    }, "Saved passages"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: NEU.muted,
        marginTop: 2
      }
    }, (() => {
      const b = st.saved.filter(m => m.kind === 'bookmark').length;
      const f = st.saved.length - b;
      return `${b} bookmark${b === 1 ? '' : 's'} \u00b7 ${f} favourite${f === 1 ? '' : 's'}`;
    })())), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        color: '#6b6252',
        fontSize: 18
      }
    }, "\u203a")), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        fontSize: 11.5,
        color: '#6b6252',
        marginTop: 26,
        lineHeight: 1.6
      }
    }, "Ahlul Bayt Ireland · V1.5", /*#__PURE__*/React.createElement("br", null), "Built for the community, by ", /*#__PURE__*/React.createElement("a", {
      href: "https://www.softeire.com",
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        color: '#1f5145',
        fontWeight: 600,
        textDecoration: 'underline',
        textDecorationColor: 'rgba(31,81,69,.3)'
      }
    }, "SoftEire Technology Limited")));
  }

  /* ── ABOUT ── */
  renderAbout() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 20px 100px'
      },
      className: "afu"
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => this.go('more'),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        color: '#1f5145',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        padding: '12px 10px',
        margin: '0 -10px',
        minHeight: 44,
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18
      }
    }, "‹"), " More"), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 104,
        height: 104,
        borderRadius: 28,
        background: 'linear-gradient(150deg,#23564a,#143b2f)',
        margin: '24px auto 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 22px 40px -16px rgba(20,59,47,.6)',
        position: 'relative',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        boxShadow: 'inset 0 0 0 1px rgba(216,184,99,.25)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 46,
        height: 46,
        borderRadius: '50%',
        boxShadow: 'inset -13px 0 0 0 #d8b863'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 24,
        fontWeight: 600,
        color: '#27241f',
        marginTop: 18
      }
    }, "Ahlul Bayt Ireland"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        color: NEU.muted,
        marginTop: 5,
        lineHeight: 1.5,
        padding: '0 24px'
      }
    }, "A calm companion for prayer, supplication and community life."), /*#__PURE__*/React.createElement("div", {
      style: {
        background: NEU.surf, boxShadow: neuUp(),
        border: NEU.edge,
        borderRadius: 18,
        padding: 20,
        marginTop: 24,
        textAlign: 'left'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#6b6252',
        marginBottom: 12
      }
    }, "Install as an app"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 13
      }
    }, [['1', 'Tap the <b>Share</b> icon in your browser.'], ['2', 'Choose <b>Add to Home Screen</b>.'], ['3', 'Open it anytime — works offline.']].map(([n, txt]) => /*#__PURE__*/React.createElement("div", {
      key: n,
      style: {
        display: 'flex',
        gap: 11,
        alignItems: 'flex-start'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: '#e6efe9',
        color: '#1f5145',
        fontSize: 12,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, n), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        color: '#4a443a',
        lineHeight: 1.5
      },
      dangerouslySetInnerHTML: {
        __html: txt
      }
    }))))), /*#__PURE__*/React.createElement("div", {
      onClick: this.handleInstall,
      style: {
        marginTop: 18,
        padding: 15,
        borderRadius: 14,
        background: '#1c1a17',
        color: '#d8b863',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer'
      }
    }, "Add to Home Screen")));
  }

  /* ── OFFLINE ── */
  renderOffline() {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 30px',
        position: 'relative'
      },
      className: "afu"
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => this.go('more'),
      style: {
        position: 'absolute',
        top: 8,
        left: 12,
        color: '#1f5145',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        padding: '12px 10px',
        minHeight: 44,
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18
      }
    }, "‹"), " Back"), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 72,
        height: 72,
        borderRadius: 22,
        background: '#efe7d7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 22
      }
    }, icon('wifi-off', { size: 34, stroke: '#6b6252', sw: 1.7 })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 21,
        fontWeight: 600,
        color: '#2c2823'
      }
    }, "You're offline"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        color: NEU.muted,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 1.6,
        maxWidth: 240
      }
    }, "Saved prayer times and your recent readings are still available. Other content will sync when you're back online."), /*#__PURE__*/React.createElement("div", {
      onClick: () => window.location.reload(),
      style: {
        marginTop: 22,
        padding: '12px 22px',
        borderRadius: 13,
        border: NEU.edge,
        background: NEU.surf, boxShadow: neuUp(),
        color: '#1f5145',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer'
      }
    }, "Retry connection"));
  }

  /* ── ADMIN LOGIN ── */
  renderAdminLogin(st) {
    const inp = {
      width: '100%',
      border: NEU.edge,
      background: NEU.sunk, boxShadow: neuIn(.7),
      borderRadius: 13,
      padding: '13px 15px',
      fontSize: 15,
      color: '#2c2823',
      outline: 'none',
      marginBottom: 14,
      boxSizing: 'border-box'
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '0 20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh'
      },
      className: "afu"
    }, /*#__PURE__*/React.createElement("img", {
      src: "./icon-192.png",
      alt: "Ahlul Bayt Ireland",
      style: {
        width: 60,
        height: 60,
        borderRadius: 18,
        objectFit: 'cover',
        marginBottom: 18
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 22,
        fontWeight: 600,
        color: '#27241f',
        marginBottom: 4
      }
    }, "Admin Login"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: NEU.muted,
        marginBottom: 28
      }
    }, "Ahlul Bayt Ireland"), /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        maxWidth: 340
      }
    }, /*#__PURE__*/React.createElement("input", {
      value: st.adminInputId,
      onChange: e => this.setState({
        adminInputId: e.target.value,
        adminLoginErr: false
      }),
      placeholder: "Admin ID",
      maxLength: 32,
      style: inp
    }), /*#__PURE__*/React.createElement("input", {
      value: st.adminInputPw,
      onChange: e => this.setState({
        adminInputPw: e.target.value,
        adminLoginErr: false
      }),
      placeholder: "Password",
      type: "password",
      maxLength: 64,
      style: inp,
      onKeyDown: e => e.key === 'Enter' && this.handleAdminLogin()
    }), st.adminLoginErr && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: '#6e2230',
        marginBottom: 12,
        textAlign: 'center'
      }
    }, st.adminLockMsg || 'Incorrect ID or password.'), /*#__PURE__*/React.createElement("div", {
      onClick: this.handleAdminLogin,
      style: {
        width: '100%',
        textAlign: 'center',
        padding: 14,
        borderRadius: 14,
        background: '#1f5145',
        color: '#f3ead4',
        fontSize: 15,
        fontWeight: 700,
        cursor: 'pointer'
      }
    }, "Sign In"), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 14,
        textAlign: 'center',
        fontSize: 11.5,
        color: '#6b6252'
      }
    }, "Contact community admin for access.")));
  }

  /* ── ADMIN ── */
  renderAdmin(st) {
    if (!st.adminLoggedIn) return this.renderAdminLogin(st);
    const sec = st.adminSection;
    const editing = st.adminEditIdx !== null;
    const COLORS = ['#1f5145', '#2c5d52', '#6e2230', '#7d6220', '#3a4a78', '#b8923f'];
    const COLOR_NAMES = {
      '#1f5145': 'Green',
      '#2c5d52': 'Teal',
      '#6e2230': 'Maroon',
      '#7d6220': 'Gold',
      '#3a4a78': 'Navy',
      '#b8923f': 'Amber'
    };
    const STORY_KINDS = ['verse', 'sermon', 'kids', 'quiz', 'classified', 'announce'];
    const EVENT_TYPES = ['Community', 'Majlis', 'Class', 'Programme', 'Dua e Kumail', 'Friday Prayer', 'Historical Event'];
    const EVENT_COLORS = {
      'Community': '#1f5145',
      'Majlis': '#6e2230',
      'Class': '#7d6220',
      'Programme': '#2c5d52',
      'Dua e Kumail': '#3a4a78',
      'Friday Prayer': '#8a4b2c',
      'Historical Event': '#7a5c9e'
    };
    const EVENT_TINTS = {
      'Community': '#e6efe9',
      'Majlis': '#f3e6e8',
      'Class': '#f3ecd9',
      'Programme': '#e6efe9',
      'Dua e Kumail': '#e8ebf4',
      'Friday Prayer': '#f6ebe4',
      'Historical Event': '#eee8f5'
    };
    const CAT_COLORS = {
      'Food': '#1f5145',
      'Butcher': '#6e2230',
      'Travel': '#7d6220',
      'Education': '#2c5d52',
      'Services': '#3a4a78'
    };
    const CAT_TINTS = {
      'Food': '#e6efe9',
      'Butcher': '#f3e6e8',
      'Travel': '#f3ecd9',
      'Education': '#e6efe9',
      'Services': '#e8ebf4'
    };
    const tabs = [{
      id: 'stories',
      label: 'Stories'
    }, {
      id: 'library',
      label: 'Library'
    }, {
      id: 'classifieds',
      label: 'Classifieds'
    }, {
      id: 'events',
      label: 'Events'
    }, {
      id: 'prayers',
      label: 'Prayer Times'
    }, {
      id: 'announcement',
      label: 'Majlis Live'
    }, {
      id: 'pinned',
      label: 'Pinned Msg'
    }, {
      id: 'askImam',
      label: 'Ask Maulana'
    }, {
      id: 'ads',
      label: 'Billboard'
    }, {
      id: 'kids',
      label: 'Kids'
    }, {
      id: 'health',
      label: 'Health'
    }];
    const inp = {
      width: '100%',
      border: NEU.edge,
      background: NEU.sunk, boxShadow: neuIn(.7),
      borderRadius: 11,
      padding: '11px 13px',
      fontSize: 14,
      color: '#2c2823',
      outline: 'none',
      marginBottom: 11,
      boxSizing: 'border-box'
    };
    const btn = (label, onClick, style = {}) => /*#__PURE__*/React.createElement("div", {
      onClick: onClick,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '13px 18px',
        borderRadius: 12,
        fontSize: 13.5,
        fontWeight: 600,
        cursor: 'pointer',
        minHeight: 44,
        background: NEU.surf,
        color: NEU.ink,
        boxShadow: neuUp(.65),
        ...style
      }
    }, label);
    const save = (key, stateKey, data, msg = 'Saved!') => {
      this.saveContent(key, stateKey, data);
      this.cancelEdit();
      this.showToast(msg);
    };

    /* ─ STORIES ─ */
    const renderStoriesSection = () => {
      if (editing) {
        const d = st.adminEditDraft;
        const isQuiz = d.kind === 'quiz';
        const isNew = st.adminEditIdx === -1;
        const buildStoryItem = () => ({
          kind: d.kind || 'announce',
          title: d.title || '',
          short: d.short || '',
          initial: d.initial || 'م',
          tag: d.tag || '',
          color: d.color || '#6e2230',
          img: `linear-gradient(150deg,${d.color || '#6e2230'}cc,${d.color || '#1c1a17'})`,
          photo: d.photo || '',
          created: isNew ? Date.now() : d.created,
          from: d.from || '',
          until: d.until || '',
          ar: d.ar || '',
          sub: d.sub || '',
          body: d.body || '',
          link: d.link || '',
          ...(isQuiz ? {
            question: d.question || '',
            options: [d.opt0 || '', d.opt1 || '', d.opt2 || ''],
            answer: parseInt(d.answer || 0)
          } : {})
        });
        const previewStory = () => this.setState({
          storyPreview: buildStoryItem(),
          quizPick: null
        });
        const saveStory = () => {
          const stories = [...st.liveStories];
          const item = buildStoryItem();
          if (isNew) stories.unshift(item);else stories[st.adminEditIdx] = item;
          save('stories', 'liveStories', stories, isNew ? 'Story added!' : 'Story updated!');
        };
        return /*#__PURE__*/React.createElement("div", {
          style: {
            padding: '0 0 20px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 13,
            fontWeight: 700,
            color: '#27241f',
            marginBottom: 14
          }
        }, isNew ? 'Add Story' : 'Edit Story'), /*#__PURE__*/React.createElement("select", {
          value: d.kind || 'announce',
          onChange: e => this.setDraft({
            kind: e.target.value
          }),
          style: {
            ...inp,
            cursor: 'pointer'
          }
        }, STORY_KINDS.map(k => /*#__PURE__*/React.createElement("option", {
          key: k,
          value: k
        }, k.charAt(0).toUpperCase() + k.slice(1)))), /*#__PURE__*/React.createElement("input", {
          value: d.title || '',
          onChange: e => this.setDraft({
            title: e.target.value
          }),
          placeholder: "Title",
          maxLength: 100,
          style: inp
        }), /*#__PURE__*/React.createElement("input", {
          value: d.short || '',
          onChange: e => this.setDraft({
            short: e.target.value
          }),
          placeholder: "Short label (under circle)",
          maxLength: 20,
          style: inp
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 10
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            flex: 1
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11.5,
            fontWeight: 600,
            color: '#5d564a',
            marginBottom: 4
          }
        }, "Show from (optional)"), /*#__PURE__*/React.createElement("input", {
          type: "date",
          value: d.from || '',
          onChange: e => this.setDraft({
            from: e.target.value
          }),
          style: inp
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            flex: 1
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11.5,
            fontWeight: 600,
            color: '#5d564a',
            marginBottom: 4
          }
        }, "Until (optional)"), /*#__PURE__*/React.createElement("input", {
          type: "date",
          value: d.until || '',
          onChange: e => this.setDraft({
            until: e.target.value
          }),
          style: inp
        }))), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11,
            color: NEU.muted,
            margin: '-4px 0 10px'
          }
        }, "Schedule in advance: the story appears on the “from” date and disappears after the “until” date. Leave empty for a normal 24-hour story."), /*#__PURE__*/React.createElement("input", {
          value: d.tag || '',
          onChange: e => this.setDraft({
            tag: e.target.value
          }),
          placeholder: "Tag line",
          maxLength: 40,
          style: inp
        }), /*#__PURE__*/React.createElement("input", {
          value: d.sub || '',
          onChange: e => this.setDraft({
            sub: e.target.value
          }),
          placeholder: "Subtitle",
          maxLength: 80,
          style: inp
        }), /*#__PURE__*/React.createElement("input", {
          value: d.ar || '',
          onChange: e => this.setDraft({
            ar: e.target.value
          }),
          placeholder: "Arabic text (optional)",
          maxLength: 200,
          style: inp,
          dir: "rtl"
        }), /*#__PURE__*/React.createElement("textarea", {
          value: d.body || '',
          onChange: e => this.setDraft({
            body: e.target.value
          }),
          placeholder: "Body text",
          maxLength: 600,
          style: {
            ...inp,
            minHeight: 90,
            resize: 'none'
          }
        }), /*#__PURE__*/React.createElement("input", {
          value: d.link || '',
          onChange: e => this.setDraft({
            link: e.target.value
          }),
          placeholder: "CTA button label (optional)",
          maxLength: 40,
          style: inp
        }), /*#__PURE__*/React.createElement("select", {
          value: d.color || '#6e2230',
          onChange: e => this.setDraft({
            color: e.target.value
          }),
          style: {
            ...inp,
            cursor: 'pointer'
          }
        }, COLORS.map(c => /*#__PURE__*/React.createElement("option", {
          key: c,
          value: c
        }, COLOR_NAMES[c]))), /*#__PURE__*/React.createElement("div", {
          style: {
            marginBottom: 11
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 12.5,
            fontWeight: 600,
            color: '#5d564a',
            marginBottom: 6
          }
        }, "Background image (optional)"), d.photo && /*#__PURE__*/React.createElement("div", {
          style: {
            marginBottom: 8
          }
        }, /*#__PURE__*/React.createElement("img", {
          src: d.photo,
          alt: "",
          style: {
            width: '100%',
            maxHeight: 150,
            objectFit: 'cover',
            borderRadius: 12,
            display: 'block',
            marginBottom: 8
          }
        }), btn('Remove image', () => this.setDraft({
          photo: ''
        }), {
          background: '#f3e6e8',
          color: '#6e2230',
          fontSize: 12,
          padding: '6px 12px'
        })), /*#__PURE__*/React.createElement("input", {
          type: "file",
          accept: "image/*",
          onChange: async e => {
            const f = e.target.files && e.target.files[0];
            e.target.value = '';
            if (!f) return;
            try {
              const url = await resizeImageFile(f, 1000, 0.8);
              this.setDraft({
                photo: url
              });
            } catch (_) {
              this.showToast('Could not read that image');
            }
          },
          style: {
            width: '100%',
            fontSize: 12.5,
            color: '#6b6252'
          }
        })), isQuiz && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
          value: d.question || '',
          onChange: e => this.setDraft({
            question: e.target.value
          }),
          placeholder: "Quiz question",
          maxLength: 160,
          style: inp
        }), /*#__PURE__*/React.createElement("input", {
          value: d.opt0 || '',
          onChange: e => this.setDraft({
            opt0: e.target.value
          }),
          placeholder: "Option 1",
          maxLength: 80,
          style: inp
        }), /*#__PURE__*/React.createElement("input", {
          value: d.opt1 || '',
          onChange: e => this.setDraft({
            opt1: e.target.value
          }),
          placeholder: "Option 2",
          maxLength: 80,
          style: inp
        }), /*#__PURE__*/React.createElement("input", {
          value: d.opt2 || '',
          onChange: e => this.setDraft({
            opt2: e.target.value
          }),
          placeholder: "Option 3",
          maxLength: 80,
          style: inp
        }), /*#__PURE__*/React.createElement("select", {
          value: d.answer || 0,
          onChange: e => this.setDraft({
            answer: parseInt(e.target.value)
          }),
          style: {
            ...inp,
            cursor: 'pointer'
          }
        }, /*#__PURE__*/React.createElement("option", {
          value: 0
        }, "Correct: Option 1"), /*#__PURE__*/React.createElement("option", {
          value: 1
        }, "Correct: Option 2"), /*#__PURE__*/React.createElement("option", {
          value: 2
        }, "Correct: Option 3"))), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 10
          }
        }, btn('Save', saveStory, {
          flex: 1,
          background: '#1f5145',
          color: '#f3ead4'
        }), btn('Preview', previewStory, {
          flex: 1,
          border: '1.5px solid #9a7a2c',
          background: NEU.surf, boxShadow: neuUp(),
          color: '#7d6220'
        }), btn('Cancel', this.cancelEdit, {
          flex: 1,
          border: NEU.edge,
          background: NEU.surf, boxShadow: neuUp(),
          color: '#3f3a32'
        })));
      }
      return /*#__PURE__*/React.createElement("div", null, btn('+ Add Story', () => this.startEdit(-1, {
        kind: 'announce',
        color: '#6e2230'
      }), {
        background: '#1f5145',
        color: '#f3ead4',
        marginBottom: 14,
        width: '100%'
      }), st.liveStories.map((s, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: NEU.surf, boxShadow: neuUp(),
          border: NEU.edge,
          borderRadius: 14,
          padding: '12px 14px',
          marginBottom: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 36,
          height: 36,
          borderRadius: '50%',
          background: s.color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13.5,
          fontWeight: 600,
          color: '#2c2823',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, s.title), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: NEU.muted
        }
      }, s.kind, " · ", s.short, !storyIsLive(s) ? s.from && Date.now() < new Date(s.from + 'T00:00:00').getTime() ? ' · ⏳ scheduled ' + s.from : ' · expired' : s.from || s.until ? ' · ● live' + (s.until ? ' until ' + s.until : '') : '')), btn('Edit', () => this.startEdit(i, {
        ...s,
        opt0: s.options?.[0],
        opt1: s.options?.[1],
        opt2: s.options?.[2]
      }), {
        background: '#e6efe9',
        color: '#1f5145',
        fontSize: 12,
        padding: '6px 12px'
      }), btn('✕', () => {
        const a = [...st.liveStories];
        a.splice(i, 1);
        save('stories', 'liveStories', a, 'Deleted');
      }, {
        background: '#fdf0f2',
        color: '#6e2230',
        fontSize: 12,
        padding: '6px 10px'
      }))));
    };

    /* ─ CLASSIFIEDS ─ */
    const renderClassifiedsSection = () => {
      if (editing) {
        const d = st.adminEditDraft;
        const isNew = st.adminEditIdx === -1;
        const cat = d.cat || 'Services';
        const saveItem = () => {
          const list = st.liveClassifieds.filter(c => c.name !== 'SoftEire Technology Limited');
          const item = {
            name: d.name || '',
            cat,
            desc: d.desc || '',
            loc: d.loc || '',
            web: safeUrl(d.web || ''),
            phone: d.phone || '',
            wa: safeWa(d.wa || ''),
            ink: CAT_COLORS[cat],
            tint: CAT_TINTS[cat]
          };
          if (isNew) list.unshift(item);else list[st.adminEditIdx] = item;
          save('classifieds', 'liveClassifieds', list, isNew ? 'Listing added!' : 'Listing updated!');
        };
        return /*#__PURE__*/React.createElement("div", {
          style: {
            padding: '0 0 20px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 13,
            fontWeight: 700,
            color: '#27241f',
            marginBottom: 14
          }
        }, isNew ? 'Add Listing' : 'Edit Listing'), /*#__PURE__*/React.createElement("input", {
          value: d.name || '',
          onChange: e => this.setDraft({
            name: e.target.value
          }),
          placeholder: "Business name",
          maxLength: 80,
          style: inp
        }), /*#__PURE__*/React.createElement("select", {
          value: d.cat || 'Services',
          onChange: e => this.setDraft({
            cat: e.target.value
          }),
          style: {
            ...inp,
            cursor: 'pointer'
          }
        }, ['Food', 'Butcher', 'Travel', 'Education', 'Services'].map(c => /*#__PURE__*/React.createElement("option", {
          key: c,
          value: c
        }, c))), /*#__PURE__*/React.createElement("input", {
          value: d.desc || '',
          onChange: e => this.setDraft({
            desc: e.target.value
          }),
          placeholder: "Description",
          maxLength: 200,
          style: inp
        }), /*#__PURE__*/React.createElement("input", {
          value: d.loc || '',
          onChange: e => this.setDraft({
            loc: e.target.value
          }),
          placeholder: "Location",
          maxLength: 80,
          style: inp
        }), /*#__PURE__*/React.createElement("input", {
          value: d.web || '',
          onChange: e => this.setDraft({
            web: e.target.value
          }),
          placeholder: "Website URL (optional)",
          maxLength: 200,
          style: inp
        }), /*#__PURE__*/React.createElement("input", {
          value: d.phone || '',
          onChange: e => this.setDraft({
            phone: e.target.value
          }),
          placeholder: "Phone (e.g. +353 1 234 5678)",
          maxLength: 20,
          style: inp
        }), /*#__PURE__*/React.createElement("input", {
          value: d.wa || '',
          onChange: e => this.setDraft({
            wa: e.target.value
          }),
          placeholder: "WhatsApp number (digits only)",
          maxLength: 15,
          style: inp
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 10
          }
        }, btn('Save', saveItem, {
          flex: 1,
          background: '#1f5145',
          color: '#f3ead4'
        }), btn('Cancel', this.cancelEdit, {
          flex: 1,
          border: NEU.edge,
          background: NEU.surf, boxShadow: neuUp(),
          color: '#3f3a32'
        })));
      }
      return /*#__PURE__*/React.createElement("div", null, btn('+ Add Listing', () => this.startEdit(-1, {
        cat: 'Services'
      }), {
        background: '#1f5145',
        color: '#f3ead4',
        marginBottom: 14,
        width: '100%'
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: '#edf2ee',
          border: '1px solid #c5d9cb',
          borderRadius: 14,
          padding: '12px 14px',
          marginBottom: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: PINNED_CLASSIFIED.ink,
          flexShrink: 0
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13.5,
          fontWeight: 600,
          color: '#2c2823',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, PINNED_CLASSIFIED.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: NEU.muted
        }
      }, PINNED_CLASSIFIED.cat, " \xB7 ", PINNED_CLASSIFIED.loc)), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 11,
          fontWeight: 700,
          color: '#1f5145',
          background: '#c5d9cb',
          padding: '4px 9px',
          borderRadius: 7,
          flexShrink: 0
        }
      }, "Pinned")), st.liveClassifieds.filter(c => c.name !== 'SoftEire Technology Limited').map((c, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: NEU.surf, boxShadow: neuUp(),
          border: NEU.edge,
          borderRadius: 14,
          padding: '12px 14px',
          marginBottom: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: c.ink,
          flexShrink: 0
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13.5,
          fontWeight: 600,
          color: '#2c2823',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, c.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: NEU.muted
        }
      }, c.cat, " · ", c.loc)), btn('Edit', () => this.startEdit(i, {
        ...c
      }), {
        background: '#e6efe9',
        color: '#1f5145',
        fontSize: 12,
        padding: '6px 12px'
      }), btn('✕', () => {
        const a = st.liveClassifieds.filter(c => c.name !== 'SoftEire Technology Limited');
        a.splice(i, 1);
        save('classifieds', 'liveClassifieds', a, 'Deleted');
      }, {
        background: '#fdf0f2',
        color: '#6e2230',
        fontSize: 12,
        padding: '6px 10px'
      }))));
    };

    /* ─ EVENTS ─ */
    const renderEventEditor = () => {
      {
        const d = st.adminEditDraft;
        const isNew = st.adminEditIdx === -1;
        const type = d.type || 'Community';
        const hijriMode = d.dateMode ? d.dateMode === 'hijri' : !!d.hd;
        const hd = +d.hd || 0,
          hm = +d.hm || 0,
          hy = +d.hy || 0;
        // Gregorian day this Hijri date lands on: the exact year for a one-off, the next
        // occurrence for a yearly event (which is only ever matched on day + month).
        const hijriGreg = hijriMode ? d.recurring || !hy ? nextHijriOccurrence(hm, hd) : hijriToGreg(hy, hm, hd) : null;
        const switchMode = mode => {
          if (mode === 'hijri' && !d.hd) {
            const p = toHijriParts(gregToDate(d.date) || new Date());
            this.setDraft(p ? { dateMode: mode, hd: p.hd, hm: p.hm, hy: p.hy } : { dateMode: mode });
          } else this.setDraft({ dateMode: mode });
        };
        const saveItem = () => {
          if (d.notice !== 'day' && d.notice !== 'reminder') {
            this.showToast('Please choose: On this day or Reminder');
            return;
          }
          if (hijriMode && (!hd || !hm)) {
            this.showToast('Pick an Islamic day and month');
            return;
          }
          if (hijriMode && !hijriGreg) {
            this.showToast('That Islamic date does not occur in that year');
            return;
          }
          const list = [...(st.liveCalEvents || [])];
          const item = {
            title: d.title || '',
            type,
            color: EVENT_COLORS[type],
            tint: EVENT_TINTS[type],
            desc: d.desc || '',
            date: hijriMode ? dateToGregStr(hijriGreg) : d.date || '',
            notice: d.notice,
            recurring: !!d.recurring
          };
          if (hijriMode) {
            item.hd = hd;
            item.hm = hm;
            if (!d.recurring && hy) item.hy = hy;
          }
          if (isNew) list.push(item);else list[st.adminEditIdx] = item;
          save('calEvents', 'liveCalEvents', list, isNew ? 'Event added!' : 'Event updated!');
        };
        return /*#__PURE__*/React.createElement("div", {
          style: {
            padding: '0 0 20px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 13,
            fontWeight: 700,
            color: '#27241f',
            marginBottom: 14
          }
        }, isNew ? 'Add Calendar Event' : 'Edit Calendar Event'), /*#__PURE__*/React.createElement("input", {
          value: d.title || '',
          onChange: e => this.setDraft({
            title: e.target.value
          }),
          placeholder: "Event title",
          maxLength: 100,
          style: inp
        }), /*#__PURE__*/React.createElement("select", {
          value: d.type || 'Community',
          onChange: e => this.setDraft({
            type: e.target.value
          }),
          style: {
            ...inp,
            cursor: 'pointer'
          }
        }, EVENT_TYPES.map(t => /*#__PURE__*/React.createElement("option", {
          key: t,
          value: t
        }, t))), /*#__PURE__*/React.createElement("select", {
          value: d.notice || '',
          onChange: e => this.setDraft({
            notice: e.target.value
          }),
          style: {
            ...inp,
            cursor: 'pointer',
            color: d.notice ? '#2c2823' : NEU.muted,
            border: d.notice ? inp.border : '1.5px solid #75601f'
          }
        }, /*#__PURE__*/React.createElement("option", {
          value: "",
          disabled: true
        }, "Show as… (required)"), /*#__PURE__*/React.createElement("option", {
          value: "day"
        }, "On this day"), /*#__PURE__*/React.createElement("option", {
          value: "reminder"
        }, "Reminder")), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11,
            color: NEU.muted,
            margin: '-4px 2px 10px',
            lineHeight: 1.45
          }
        }, d.notice === 'reminder' ? 'Reminder: pops up as a banner on the home page and appears in the Reminder card on the calendar, on the day.' : d.notice === 'day' ? 'On this day: a green banner on the home page for 24 hours on the day.' : 'Choose how this entry is announced on the day.'), /*#__PURE__*/React.createElement("input", {
          value: d.desc || '',
          onChange: e => this.setDraft({
            desc: e.target.value
          }),
          placeholder: "Description",
          maxLength: 300,
          style: inp
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11.5,
            color: '#8d8574',
            margin: '2px 2px 7px'
          }
        }, "Date entered on"), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 8,
            marginBottom: 8
          }
        }, [['Gregorian', 'greg'], ['Islamic (Hijri)', 'hijri']].map(([lbl, mode]) => {
          const on = hijriMode === (mode === 'hijri');
          return /*#__PURE__*/React.createElement("div", {
            key: mode,
            onClick: () => switchMode(mode),
            style: {
              flex: 1,
              textAlign: 'center',
              padding: '10px 4px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              background: NEU.surf,
              color: on ? NEU.accent : NEU.muted,
              border: NEU.edge,
              boxShadow: on ? neuIn(.55) : neuUp(.55)
            }
          }, lbl);
        })), hijriMode ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 8
          }
        }, /*#__PURE__*/React.createElement("select", {
          value: hd || '',
          onChange: e => this.setDraft({
            hd: +e.target.value
          }),
          style: {
            ...inp,
            width: 92,
            cursor: 'pointer'
          }
        }, /*#__PURE__*/React.createElement("option", {
          value: "",
          disabled: true
        }, "Day"), Array.from({
          length: 30
        }, (_, i) => /*#__PURE__*/React.createElement("option", {
          key: i + 1,
          value: i + 1
        }, i + 1))), /*#__PURE__*/React.createElement("select", {
          value: hm || '',
          onChange: e => this.setDraft({
            hm: +e.target.value
          }),
          style: {
            ...inp,
            flex: 1,
            cursor: 'pointer'
          }
        }, /*#__PURE__*/React.createElement("option", {
          value: "",
          disabled: true
        }, "Islamic month"), HIJRI_MONTHS.map((mn, i) => /*#__PURE__*/React.createElement("option", {
          key: mn,
          value: i + 1
        }, mn))), !d.recurring && /*#__PURE__*/React.createElement("input", {
          value: d.hy || '',
          onChange: e => this.setDraft({
            hy: e.target.value.replace(/\D/g, '').slice(0, 4)
          }),
          placeholder: "Year AH",
          inputMode: "numeric",
          style: {
            ...inp,
            width: 96
          }
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11,
            color: hijriGreg ? NEU.muted : '#a03a3a',
            margin: '-4px 2px 10px',
            lineHeight: 1.45
          }
        }, hd && hm ? hijriGreg ? (d.recurring ? 'Next falls on ' : 'Falls on ') + hijriGreg.toLocaleDateString('en-IE', {
          weekday: 'short',
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        }) : 'That Islamic date does not occur in that year.' : 'Pick the Islamic day and month this event belongs to.')) : /*#__PURE__*/React.createElement("input", {
          value: d.date || '',
          onChange: e => this.setDraft({
            date: e.target.value
          }),
          type: "date",
          min: "2024-01-01",
          max: "2036-12-31",
          style: inp
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11.5,
            color: '#8d8574',
            margin: '2px 2px 7px'
          }
        }, "Repeats"), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 8,
            marginBottom: 8
          }
        }, [['One-off', false], ['Every year', true]].map(([lbl, val]) => {
          const on = !!d.recurring === val;
          return /*#__PURE__*/React.createElement("div", {
            key: lbl,
            onClick: () => {
              this.setDraft({
                recurring: val
              });
              // a yearly event returns on its Islamic date, so author it on that calendar
              if (val && !d.dateMode && !d.hd) switchMode('hijri');
            },
            style: {
              flex: 1,
              textAlign: 'center',
              padding: '10px 4px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              background: NEU.surf,
              color: on ? NEU.accent : NEU.muted,
              border: NEU.edge,
              boxShadow: on ? neuIn(.55) : neuUp(.55)
            }
          }, lbl);
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11,
            color: NEU.muted,
            margin: '0 2px 14px',
            lineHeight: 1.45
          }
        }, d.recurring ? hijriMode ? hd && hm ? `Returns every year on ${hd} ${HIJRI_MONTHS[hm - 1]} (Islamic calendar).` : 'Returns on the same Islamic date every year.' : gregToDate(d.date) ? `Returns every year on ${toHijri(gregToDate(d.date)).split(' ').slice(0, 2).join(' ')} (Islamic calendar).` : 'Returns on the same Islamic-calendar date every year.' : 'Shows on this date only.'), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 10
          }
        }, btn('Save', saveItem, {
          flex: 1,
          background: '#1f5145',
          color: '#f3ead4'
        }), btn('Cancel', this.cancelEdit, {
          flex: 1,
          border: NEU.edge,
          background: NEU.surf, boxShadow: neuUp(),
          color: '#3f3a32'
        })));
      }
    };
    /* Only offer a tab for a type that actually has entries, so the row stays
       short, and carry the original index through the filter — Edit and Delete
       both address liveCalEvents by position. */
    const evAll = st.liveCalEvents || [];
    const evCounts = {};
    evAll.forEach(e => {
      const t = e.type || 'Other';
      evCounts[t] = (evCounts[t] || 0) + 1;
    });
    const evTabs = ['All', ...EVENT_TYPES.filter(t => evCounts[t]), ...Object.keys(evCounts).filter(t => !EVENT_TYPES.includes(t)).sort()];
    const evType = evTabs.includes(st.adminEvType) ? st.adminEvType : 'All';
    const evRows = evAll.map((e, i) => [e, i]).filter(([e]) => evType === 'All' || (e.type || 'Other') === evType);
    const eventListEls = (extraDraft = {}) => [btn('+ Add Event', () => this.startEdit(-1, {
      type: 'Community',
      date: '',
      ...extraDraft
    }), {
      background: '#1f5145',
      color: '#f3ead4',
      marginBottom: 14,
      width: '100%'
    }), evTabs.length > 1 && /*#__PURE__*/React.createElement("div", {
      key: "evtabs",
      className: "s",
      style: {
        display: 'flex',
        gap: 7,
        overflowX: 'auto',
        margin: '0 -20px 13px',
        padding: '0 20px 3px'
      }
    }, evTabs.map(t => {
      const on = evType === t;
      const c = t === 'All' ? NEU.accent : EVENT_COLORS[t] || NEU.accent;
      return /*#__PURE__*/React.createElement("div", {
        key: t,
        onClick: () => this.setState({
          adminEvType: t
        }),
        style: {
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          padding: '11px 14px',
          borderRadius: 20,
          fontSize: 12.5,
          fontWeight: 600,
          cursor: 'pointer',
          background: NEU.surf,
          border: NEU.edge,
          color: on ? c : NEU.muted,
          boxShadow: on ? neuIn(.5) : neuUp(.5),
          transition: 'box-shadow .18s ease, color .18s ease'
        }
      }, t !== 'All' && /*#__PURE__*/React.createElement("span", {
        style: {
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: c,
          flexShrink: 0
        }
      }), t, /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10.5,
          fontWeight: 700,
          opacity: .6
        }
      }, t === 'All' ? evAll.length : evCounts[t]));
    })), evRows.length === 0 && /*#__PURE__*/React.createElement("div", {
      key: "evempty",
      style: {
        textAlign: 'center',
        padding: '28px 20px',
        color: NEU.muted,
        fontSize: 13
      }
    }, evType === 'All' ? 'No events yet.' : `No ${evType} events yet.`), ...evRows.map(([e, i]) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: NEU.surf, boxShadow: neuUp(),
          border: NEU.edge,
          borderRadius: 14,
          padding: '12px 14px',
          marginBottom: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: e.color,
          flexShrink: 0
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13.5,
          fontWeight: 600,
          color: '#2c2823',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, e.title), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: NEU.muted
        }
      }, e.type, " · ", eventDateLabel(e), e.notice === 'reminder' ? ' · 🔔 Reminder' : ' · On this day', e.recurring ? ' · ↻ yearly' : '')), btn('Edit', () => this.startEdit(i, {
        ...e,
        ...extraDraft
      }), {
        background: '#e6efe9',
        color: '#1f5145',
        fontSize: 12,
        padding: '6px 12px'
      }), btn('✕', () => {
        const a = [...(st.liveCalEvents || [])];
        a.splice(i, 1);
        save('calEvents', 'liveCalEvents', a, 'Deleted');
      }, {
        background: '#fdf0f2',
        color: '#6e2230',
        fontSize: 12,
        padding: '6px 10px'
      })))];
    const renderEventsSection = () => editing ? renderEventEditor() : /*#__PURE__*/React.createElement("div", null, ...eventListEls());

    /* ─ REMINDERS ─ */
    /* ─ PRAYER TIMES ─ */
    const renderPrayersSection = () => {
      const presets = abiPresets(st.livePrayerPresets);
      const d = st.adminEditDraft;
      if (editing) {
        const presetIdx = st.adminEditIdx;
        const preset = presets[presetIdx];
        const savePrayer = () => {
          const updated = presets.map((p, i) => i !== presetIdx ? p : {
            ...p,
            prayers: p.prayers.map((pr, j) => ({
              ...pr,
              time: d[`t${j}`] || pr.time
            }))
          });
          save('prayerPresets', 'livePrayerPresets', updated, 'Prayer times saved!');
        };
        return /*#__PURE__*/React.createElement("div", {
          style: {
            padding: '0 0 20px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 13,
            fontWeight: 700,
            color: '#27241f',
            marginBottom: 4
          }
        }, preset.name), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11.5,
            color: NEU.muted,
            marginBottom: 14
          }
        }, preset.sub), preset.prayers.map((p, j) => /*#__PURE__*/React.createElement("div", {
          key: j,
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 10
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            width: 80,
            fontSize: 14,
            fontWeight: 600,
            color: '#3f3a32'
          }
        }, p.name), /*#__PURE__*/React.createElement("input", {
          value: d[`t${j}`] !== undefined ? d[`t${j}`] : p.time,
          onChange: e => this.setDraft({
            [`t${j}`]: e.target.value
          }),
          placeholder: "HH:MM",
          maxLength: 5,
          style: {
            flex: 1,
            border: NEU.edge,
            background: NEU.sunk, boxShadow: neuIn(.7),
            borderRadius: 10,
            padding: '10px 12px',
            fontSize: 14,
            color: '#2c2823',
            outline: 'none'
          }
        }))), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 10,
            marginTop: 4
          }
        }, btn('Save Times', savePrayer, {
          flex: 1,
          background: '#1f5145',
          color: '#f3ead4'
        }), btn('Cancel', this.cancelEdit, {
          flex: 1,
          border: NEU.edge,
          background: NEU.surf, boxShadow: neuUp(),
          color: '#3f3a32'
        })));
      }
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: NEU.muted,
          marginBottom: 12
        }
      }, "Times auto-sync daily with the Jaʿfarī (Leva, Qum) calculation for Dublin. The times saved here are the fallback used when the live service is unreachable. Tap a source to edit."), presets.map((p, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        onClick: () => this.startEdit(i, {}),
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          background: NEU.surf, boxShadow: neuUp(),
          border: NEU.edge,
          borderRadius: 14,
          padding: '14px',
          marginBottom: 10,
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 14,
          fontWeight: 700,
          color: '#2c2823'
        }
      }, p.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11.5,
          color: NEU.muted,
          marginTop: 2
        }
      }, p.sub)), /*#__PURE__*/React.createElement("span", {
        style: {
          color: '#75601f',
          fontSize: 18
        }
      }, "›"))));
    };

    /* ─ ANNOUNCEMENT ─ */
    const renderAnnouncementSection = () => {
      const d = st.adminEditDraft;
      if (editing) {
        return /*#__PURE__*/React.createElement("div", {
          style: {
            padding: '0 0 20px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 13,
            fontWeight: 700,
            color: '#27241f',
            marginBottom: 14
          }
        }, "Edit Majlis Live"), /*#__PURE__*/React.createElement("input", {
          value: d.title || '',
          onChange: e => this.setDraft({
            title: e.target.value
          }),
          placeholder: "Headline",
          maxLength: 100,
          style: inp
        }), /*#__PURE__*/React.createElement("textarea", {
          value: d.body || '',
          onChange: e => this.setDraft({
            body: e.target.value
          }),
          placeholder: "Body text",
          maxLength: 500,
          style: {
            ...inp,
            minHeight: 80,
            resize: 'none'
          }
        }), /*#__PURE__*/React.createElement("input", {
          value: d.yt || '',
          onChange: e => this.setDraft({
            yt: e.target.value
          }),
          placeholder: "YouTube URL (plays inside the app)",
          style: inp
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11.5,
            color: '#8d8574',
            margin: '2px 2px 7px'
          }
        }, "Majlis date — the card disappears at 11:59 pm on this date"), /*#__PURE__*/React.createElement("input", {
          type: "date",
          value: d.date || '',
          onChange: e => this.setDraft({
            date: e.target.value
          }),
          style: inp
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11.5,
            color: '#8d8574',
            margin: '2px 2px 7px'
          }
        }, "Start time (optional) — with a time set, the card counts down and then shows Live now for 2½ hours"), /*#__PURE__*/React.createElement("input", {
          type: "time",
          value: d.time || '',
          onChange: e => this.setDraft({
            time: e.target.value
          }),
          style: inp
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 10
          }
        }, btn('Save', () => {
          if (d.yt && !ytId(d.yt)) {
            this.showToast('That YouTube link is not valid');
            return;
          }
          save('announcement', 'liveAnnouncement', {
            title: d.title || '',
            body: d.body || '',
            yt: d.yt || '',
            date: d.date || '',
            time: d.time || ''
          }, 'Majlis Live saved!');
        }, {
          flex: 1,
          background: '#1f5145',
          color: '#f3ead4'
        }), btn('Cancel', this.cancelEdit, {
          flex: 1,
          border: NEU.edge,
          background: NEU.surf, boxShadow: neuUp(),
          color: '#3f3a32'
        })));
      }
      const a = st.liveAnnouncement;
      const live = announcementActive(a);
      return /*#__PURE__*/React.createElement("div", null, a.title ? /*#__PURE__*/React.createElement("div", {
        style: {
          background: 'linear-gradient(120deg,#faf4e6,#f6efe0)',
          border: '1px solid #ecdfc2',
          borderRadius: 14,
          padding: '14px',
          marginBottom: 10
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 14,
          fontWeight: 700,
          color: '#5e4d22'
        }
      }, a.title), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12.5,
          color: '#8a7846',
          marginTop: 4,
          lineHeight: 1.5
        }
      }, a.body), (a.yt || a.date) && /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11.5,
          color: '#a08c55',
          marginTop: 6,
          fontWeight: 600
        }
      }, [a.date ? 'Majlis date: ' + a.date : null, a.yt ? 'YouTube linked ▶' : null].filter(Boolean).join(' · '))) : /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13,
          color: '#8d8574',
          marginBottom: 10,
          fontStyle: 'italic'
        }
      }, "No Majlis Live announcement at the moment."), a.title && /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          fontWeight: 700,
          color: live ? '#1f5145' : '#8a3030',
          marginBottom: 12
        }
      }, live ? a.date ? '● Live — expires 11:59 pm on ' + a.date : '● Live — no expiry date set' : '○ Expired — no longer shown to users'), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 10
        }
      }, btn('Edit Majlis Live', () => this.startEdit(0, {
        title: a.title || '',
        body: a.body || '',
        yt: a.yt || '',
        date: a.date || ''
      }), {
        flex: 1,
        background: '#1f5145',
        color: '#f3ead4'
      }), a.title && btn('Remove', () => save('announcement', 'liveAnnouncement', {
        title: '',
        body: '',
        yt: '',
        date: ''
      }, 'Majlis Live removed'), {
        flex: 1,
        background: '#faeeee',
        border: '1px solid #e6c9c9',
        color: '#8a3030'
      })));
    };

    /* ─ ASK YOUR IMAM ─ */
    const renderAskImamSection = () => {
      const d = st.adminEditDraft;
      const list = Array.isArray(st.liveAskImam) ? st.liveAskImam : st.liveAskImam && st.liveAskImam.number ? [{
        name: '',
        number: st.liveAskImam.number
      }] : [];
      if (editing) {
        const isNew = st.adminEditIdx === -1;
        return /*#__PURE__*/React.createElement("div", {
          style: {
            padding: '0 0 20px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 13,
            fontWeight: 700,
            color: '#27241f',
            marginBottom: 14
          }
        }, isNew ? 'Add Maulana' : 'Edit Maulana'), /*#__PURE__*/React.createElement("input", {
          value: d.name || '',
          onChange: e => this.setDraft({
            name: e.target.value
          }),
          placeholder: "Maulana name (e.g. Maulana Syed Ali)",
          maxLength: 60,
          style: inp
        }), /*#__PURE__*/React.createElement("input", {
          value: d.number || '',
          onChange: e => this.setDraft({
            number: e.target.value
          }),
          placeholder: "WhatsApp number with country code (e.g. +353 87 123 4567)",
          maxLength: 25,
          inputMode: "tel",
          style: inp
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11.5,
            color: '#8d8574',
            margin: '2px 2px 12px'
          }
        }, "Users tap Ask next to this maulana on the home screen and a WhatsApp chat opens."), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 10
          }
        }, btn('Save', () => {
          const digits = String(d.number || '').replace(/[^\d]/g, '');
          if (digits.length < 7) {
            this.showToast('Enter a valid WhatsApp number with country code');
            return;
          }
          const item = {
            name: (d.name || '').trim(),
            number: (d.number || '').trim()
          };
          const a = [...list];
          if (isNew) a.push(item);else a[st.adminEditIdx] = item;
          save('askImam', 'liveAskImam', a, isNew ? 'Maulana added!' : 'Maulana updated!');
        }, {
          flex: 1,
          background: '#1f5145',
          color: '#f3ead4'
        }), btn('Cancel', this.cancelEdit, {
          flex: 1,
          border: NEU.edge,
          background: NEU.surf, boxShadow: neuUp(),
          color: '#3f3a32'
        })));
      }
      return /*#__PURE__*/React.createElement("div", null, btn('+ Add Maulana', () => this.startEdit(-1, {
        name: '',
        number: ''
      }), {
        background: '#1f5145',
        color: '#f3ead4',
        marginBottom: 14,
        width: '100%'
      }), list.length > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, list.map((m, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: NEU.surf, boxShadow: neuUp(),
          border: NEU.edge,
          borderRadius: 14,
          padding: '12px 14px',
          marginBottom: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13.5,
          fontWeight: 600,
          color: '#2c2823',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, m.name || 'Maulana'), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: NEU.muted,
          fontVariantNumeric: 'tabular-nums'
        }
      }, m.number)), btn('Edit', () => this.startEdit(i, {
        ...m
      }), {
        background: '#e6efe9',
        color: '#1f5145',
        fontSize: 12,
        padding: '6px 12px'
      }), btn('✕', () => {
        const a = [...list];
        a.splice(i, 1);
        save('askImam', 'liveAskImam', a, 'Maulana removed');
      }, {
        background: '#fdf0f2',
        color: '#6e2230',
        fontSize: 12,
        padding: '6px 10px'
      }))), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          fontWeight: 700,
          color: '#1f5145',
          marginTop: 4
        }
      }, "● Live — the Ask Your Maulana card is showing at the top of Explore")) : /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13,
          color: '#8d8574',
          fontStyle: 'italic'
        }
      }, "No maulana added — the Ask Your Maulana card is hidden."));
    };

    /* ─ BILLBOARD ADS ─ */
    const renderAdsSection = () => {
      const d = st.adminEditDraft;
      const list = st.liveAds || [];
      const businesses = [PINNED_CLASSIFIED, ...(st.liveClassifieds || []).filter(c => c.name !== PINNED_CLASSIFIED.name)];
      if (editing) {
        const isNew = st.adminEditIdx === -1;
        const saveAd = () => {
          if (!d.img) {
            this.showToast('Upload an ad image first');
            return;
          }
          const item = {
            name: (d.name || '').trim(),
            link: (d.link || '').trim(),
            img: d.img,
            on: d.on !== false
          };
          const a = [...list];
          if (isNew) a.push(item);else a[st.adminEditIdx] = item;
          save('ads', 'liveAds', a, isNew ? 'Ad added!' : 'Ad updated!');
        };
        return /*#__PURE__*/React.createElement("div", {
          style: {
            padding: '0 0 20px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 13,
            fontWeight: 700,
            color: '#27241f',
            marginBottom: 14
          }
        }, isNew ? 'Add Billboard Ad' : 'Edit Billboard Ad'), /*#__PURE__*/React.createElement("select", {
          value: "",
          onChange: e => {
            const b = businesses[+e.target.value];
            if (b) this.setDraft({
              name: b.name,
              link: b.web || d.link || ''
            });
          },
          style: {
            ...inp,
            cursor: 'pointer',
            color: '#6b6252'
          }
        }, /*#__PURE__*/React.createElement("option", {
          value: ""
        }, "Fill from a classifieds business…"), businesses.map((b, i) => /*#__PURE__*/React.createElement("option", {
          key: i,
          value: i
        }, b.name))), /*#__PURE__*/React.createElement("input", {
          value: d.name || '',
          onChange: e => this.setDraft({
            name: e.target.value
          }),
          placeholder: "Advertiser name (for your reference)",
          maxLength: 60,
          style: inp
        }), /*#__PURE__*/React.createElement("input", {
          value: d.link || '',
          onChange: e => this.setDraft({
            link: e.target.value
          }),
          placeholder: "Link opened when tapped (e.g. https://business.ie)",
          maxLength: 300,
          inputMode: "url",
          style: inp
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11.5,
            color: '#8d8574',
            margin: '-4px 2px 12px',
            lineHeight: 1.45
          }
        }, "Leave the link empty for a non-clickable ad. A wide banner works best — the slide is shown at roughly 16:7."), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 12.5,
            fontWeight: 600,
            color: '#5d564a',
            marginBottom: 6
          }
        }, "Ad image"), d.img && /*#__PURE__*/React.createElement("div", {
          style: {
            marginBottom: 8
          }
        }, /*#__PURE__*/React.createElement("img", {
          src: d.img,
          alt: "",
          style: {
            width: '100%',
            aspectRatio: '16 / 7',
            objectFit: 'cover',
            borderRadius: 12,
            display: 'block',
            marginBottom: 8
          }
        }), btn('Remove image', () => this.setDraft({
          img: ''
        }), {
          background: '#f3e6e8',
          color: '#6e2230',
          fontSize: 12,
          padding: '6px 12px'
        })), /*#__PURE__*/React.createElement("input", {
          type: "file",
          accept: "image/*",
          onChange: async e => {
            const f = e.target.files && e.target.files[0];
            e.target.value = '';
            if (!f) return;
            try {
              const url = await resizeImageFile(f, 1200, 0.8);
              this.setDraft({
                img: url
              });
            } catch (_) {
              this.showToast('Could not read that image');
            }
          },
          style: {
            width: '100%',
            fontSize: 12.5,
            color: '#6b6252',
            marginBottom: 14
          }
        }), /*#__PURE__*/React.createElement("div", {
          onClick: () => this.setDraft({
            on: d.on === false
          }),
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 14,
            cursor: 'pointer'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            width: 42,
            height: 24,
            borderRadius: 12,
            padding: 3,
            background: d.on === false ? '#ddd3bf' : '#1f5145',
            display: 'flex',
            justifyContent: d.on === false ? 'flex-start' : 'flex-end'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            width: 18,
            height: 18,
            borderRadius: '50%',
            background: NEU.surf, boxShadow: neuUp()
          }
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 13,
            color: '#3f3a32',
            fontWeight: 600
          }
        }, d.on === false ? 'Paused — not shown on the home page' : 'Live — shown in the billboard')), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 10
          }
        }, btn('Save', saveAd, {
          flex: 1,
          background: '#1f5145',
          color: '#f3ead4'
        }), btn('Cancel', this.cancelEdit, {
          flex: 1,
          border: NEU.edge,
          background: NEU.surf, boxShadow: neuUp(),
          color: '#3f3a32'
        })));
      }
      const liveCount = activeAds(list).length;
      return /*#__PURE__*/React.createElement("div", null, btn('+ Add Ad', () => this.startEdit(-1, {
        name: '',
        link: '',
        img: '',
        on: true
      }), {
        background: '#1f5145',
        color: '#f3ead4',
        marginBottom: 14,
        width: '100%'
      }), list.map((a, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: NEU.surf, boxShadow: neuUp(),
          border: NEU.edge,
          borderRadius: 14,
          padding: '10px 12px',
          marginBottom: 8
        }
      }, /*#__PURE__*/React.createElement("img", {
        src: a.img,
        alt: "",
        style: {
          width: 58,
          height: 34,
          objectFit: 'cover',
          borderRadius: 8,
          flexShrink: 0,
          opacity: a.on === false ? .4 : 1
        }
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13,
          fontWeight: 600,
          color: '#2c2823',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, a.name || 'Untitled ad'), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10.5,
          color: a.on === false ? '#a03a3a' : NEU.muted,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, (a.on === false ? 'Paused' : 'Live') + ' · ' + (a.link || 'No link'))), btn(a.on === false ? 'Show' : 'Pause', () => {
        const arr = [...list];
        arr[i] = {
          ...a,
          on: a.on === false
        };
        save('ads', 'liveAds', arr, a.on === false ? 'Ad is live' : 'Ad paused');
      }, {
        background: '#f3ecd9',
        color: '#7d6220',
        fontSize: 12,
        padding: '6px 10px'
      }), btn('Edit', () => this.startEdit(i, {
        ...a
      }), {
        background: '#e6efe9',
        color: '#1f5145',
        fontSize: 12,
        padding: '6px 12px'
      }), btn('✕', () => {
        const arr = [...list];
        arr.splice(i, 1);
        save('ads', 'liveAds', arr, 'Ad removed');
      }, {
        background: '#fdf0f2',
        color: '#6e2230',
        fontSize: 12,
        padding: '6px 10px'
      }))), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: liveCount ? '#1f5145' : '#8d8574',
          fontWeight: liveCount ? 700 : 400,
          fontStyle: liveCount ? 'normal' : 'italic',
          marginTop: 4
        }
      }, liveCount ? `● Live — ${liveCount} ad${liveCount > 1 ? 's' : ''} rotating every 5 seconds under Ask Your Maulana` : 'No live ads — the billboard is hidden on the home page.'));
    };

    /* ─ PINNED MESSAGE ─ */
    const renderPinnedSection = () => {
      const d = st.adminEditDraft;
      if (editing) {
        return /*#__PURE__*/React.createElement("div", {
          style: {
            padding: '0 0 20px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 13,
            fontWeight: 700,
            color: '#27241f',
            marginBottom: 14
          }
        }, "Pinned Message"), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 14
          }
        }, /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 14,
            color: '#3f3a32',
            fontWeight: 600
          }
        }, "Show on home screen"), /*#__PURE__*/React.createElement("div", {
          onClick: () => this.setDraft({
            on: !d.on
          }),
          style: {
            width: 48,
            height: 26,
            borderRadius: 13,
            background: d.on ? NEU.accent : NEU.sunk,
            boxShadow: d.on ? 'none' : neuIn(.3),
            position: 'relative',
            cursor: 'pointer',
            transition: 'background .2s',
            flexShrink: 0
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            position: 'absolute',
            top: 3,
            left: 3,
            transform: d.on ? 'translateX(21px)' : 'none',
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
            transition: 'transform .2s ease',
            boxShadow: '0 1px 4px rgba(0,0,0,.25)'
          }
        }))), /*#__PURE__*/React.createElement("textarea", {
          value: d.text || '',
          onChange: e => this.setDraft({
            text: e.target.value
          }),
          placeholder: "Pinned message text",
          maxLength: 300,
          style: {
            ...inp,
            minHeight: 80,
            resize: 'none'
          }
        }), /*#__PURE__*/React.createElement("select", {
          value: d.color || '#6e2230',
          onChange: e => this.setDraft({
            color: e.target.value
          }),
          style: {
            ...inp,
            cursor: 'pointer'
          }
        }, COLORS.map(c => /*#__PURE__*/React.createElement("option", {
          key: c,
          value: c
        }, COLOR_NAMES[c]))), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 10
          }
        }, btn('Save', () => save('pinned', 'livePinned', {
          on: !!d.on,
          text: d.text || '',
          color: d.color || '#6e2230'
        }, 'Pinned message saved!'), {
          flex: 1,
          background: '#1f5145',
          color: '#f3ead4'
        }), btn('Cancel', this.cancelEdit, {
          flex: 1,
          border: NEU.edge,
          background: NEU.surf, boxShadow: neuUp(),
          color: '#3f3a32'
        })));
      }
      const p = st.livePinned;
      return /*#__PURE__*/React.createElement("div", null, p.on && p.text && /*#__PURE__*/React.createElement("div", {
        style: {
          background: p.color,
          borderRadius: 14,
          padding: '14px',
          marginBottom: 14,
          color: '#fff',
          fontSize: 14,
          lineHeight: 1.5
        }
      }, "📌 ", p.text), !p.on && /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13,
          color: NEU.muted,
          marginBottom: 14
        }
      }, "No pinned message active."), btn('Edit Pinned Message', () => this.startEdit(0, {
        ...p
      }), {
        background: '#1f5145',
        color: '#f3ead4',
        width: '100%'
      }));
    };

    /* ─ KIDS ─ */
    const renderKidsSection = () => {
      const d = st.adminEditDraft;
      const subSec = d._sub || 'videos';
      if (editing) {
        const isNew = st.adminEditIdx === -1;
        if (subSec === 'videos') {
          const VIDEO_CATS = ['Muharram Videos', 'Surah Explained', 'Imam Stories', 'Prophet Stories'];
          const catSel = d._catSel !== undefined ? d._catSel : !d.cat ? '' : VIDEO_CATS.includes(d.cat) ? d.cat : '__other';
          const catCustom = d._catCustom !== undefined ? d._catCustom : catSel === '__other' ? d.cat || '' : '';
          const save2 = () => {
            if (d.yt && !ytId(d.yt)) {
              this.showToast('That YouTube link is not valid');
              return;
            }
            let a = [...st.liveKidsVideos];
            const it = {
              title: d.title || '',
              meta: d.meta || '',
              color: d.color || '#1f5145',
              yt: d.yt || '',
              cat: catSel === '__other' ? (catCustom || '').trim() : catSel,
              hero: !!d.hero
            };
            if (isNew) a.push(it);else a[st.adminEditIdx] = it;
            if (it.hero) {
              const heroIdx = isNew ? a.length - 1 : st.adminEditIdx;
              a = a.map((x, xi) => xi === heroIdx ? x : x.hero ? {
                ...x,
                hero: false
              } : x);
            }
            save('kidsVideos', 'liveKidsVideos', a, isNew ? 'Video added!' : 'Updated!');
          };
          return /*#__PURE__*/React.createElement("div", {
            style: {
              padding: '0 0 20px'
            }
          }, /*#__PURE__*/React.createElement("div", {
            style: {
              fontSize: 13,
              fontWeight: 700,
              color: '#27241f',
              marginBottom: 14
            }
          }, isNew ? 'Add Video' : 'Edit Video'), /*#__PURE__*/React.createElement("input", {
            value: d.title || '',
            onChange: e => this.setDraft({
              title: e.target.value
            }),
            placeholder: "Title",
            maxLength: 100,
            style: inp
          }), /*#__PURE__*/React.createElement("input", {
            value: d.meta || '',
            onChange: e => this.setDraft({
              meta: e.target.value
            }),
            placeholder: "Meta (e.g. Animated · 4 min)",
            maxLength: 60,
            style: inp
          }), /*#__PURE__*/React.createElement("input", {
            value: d.yt || '',
            onChange: e => this.setDraft({
              yt: e.target.value
            }),
            placeholder: "YouTube URL (plays inside the app)",
            maxLength: 200,
            style: inp
          }), /*#__PURE__*/React.createElement("select", {
            value: catSel,
            onChange: e => this.setDraft({
              _catSel: e.target.value
            }),
            style: {
              ...inp,
              cursor: 'pointer'
            }
          }, [['', 'No category'], ...VIDEO_CATS.map(c => [c, c]), ['__other', 'Other (type your own)']].map(([v, l]) => /*#__PURE__*/React.createElement("option", {
            key: v,
            value: v
          }, l))), catSel === '__other' && /*#__PURE__*/React.createElement("input", {
            value: catCustom,
            onChange: e => this.setDraft({
              _catCustom: e.target.value
            }),
            placeholder: "Custom category (e.g. Ramadan Specials)",
            maxLength: 40,
            style: inp
          }), /*#__PURE__*/React.createElement("div", {
            onClick: () => this.setDraft({
              hero: !d.hero
            }),
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '11px 13px',
              borderRadius: 12,
              border: `1.5px solid ${d.hero ? '#1f5145' : 'rgba(203,195,178,.75)'}`,
              background: d.hero ? '#e6efe9' : NEU.sunk,
              cursor: 'pointer',
              marginBottom: 10
            }
          }, /*#__PURE__*/React.createElement("span", {
            style: {
              width: 18,
              height: 18,
              borderRadius: 6,
              border: `2px solid ${d.hero ? '#1f5145' : '#c9bfa9'}`,
              background: d.hero ? '#1f5145' : 'transparent',
              color: '#f3ead4',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800
            }
          }, d.hero ? '✓' : ''), /*#__PURE__*/React.createElement("span", {
            style: {
              fontSize: 13,
              fontWeight: 600,
              color: '#3f3a32'
            }
          }, "Hero video — show at the top of Kids Corner")), /*#__PURE__*/React.createElement("select", {
            value: d.color || '#1f5145',
            onChange: e => this.setDraft({
              color: e.target.value
            }),
            style: {
              ...inp,
              cursor: 'pointer'
            }
          }, COLORS.map(c => /*#__PURE__*/React.createElement("option", {
            key: c,
            value: c
          }, COLOR_NAMES[c]))), /*#__PURE__*/React.createElement("div", {
            style: {
              display: 'flex',
              gap: 10
            }
          }, btn('Save', save2, {
            flex: 1,
            background: '#1f5145',
            color: '#f3ead4'
          }), btn('Cancel', this.cancelEdit, {
            flex: 1,
            border: NEU.edge,
            background: NEU.surf, boxShadow: neuUp(),
            color: '#3f3a32'
          })));
        }
        if (subSec === 'books') {
          const save2 = () => {
            const a = [...st.liveKidsBooks];
            const it = {
              title: d.title || '',
              meta: d.meta || '',
              color: d.color || '#e6efe9',
              ink: d.ink || '#1f5145'
            };
            if (isNew) a.push(it);else a[st.adminEditIdx] = it;
            save('kidsBooks', 'liveKidsBooks', a, isNew ? 'Book added!' : 'Updated!');
          };
          return /*#__PURE__*/React.createElement("div", {
            style: {
              padding: '0 0 20px'
            }
          }, /*#__PURE__*/React.createElement("div", {
            style: {
              fontSize: 13,
              fontWeight: 700,
              color: '#27241f',
              marginBottom: 14
            }
          }, isNew ? 'Add Book' : 'Edit Book'), /*#__PURE__*/React.createElement("input", {
            value: d.title || '',
            onChange: e => this.setDraft({
              title: e.target.value
            }),
            placeholder: "Title",
            maxLength: 100,
            style: inp
          }), /*#__PURE__*/React.createElement("input", {
            value: d.meta || '',
            onChange: e => this.setDraft({
              meta: e.target.value
            }),
            placeholder: "Meta (e.g. Ages 3–6)",
            maxLength: 60,
            style: inp
          }), /*#__PURE__*/React.createElement("div", {
            style: {
              display: 'flex',
              gap: 10
            }
          }, btn('Save', save2, {
            flex: 1,
            background: '#1f5145',
            color: '#f3ead4'
          }), btn('Cancel', this.cancelEdit, {
            flex: 1,
            border: NEU.edge,
            background: NEU.surf, boxShadow: neuUp(),
            color: '#3f3a32'
          })));
        }
        if (subSec === 'quotes') {
          const save2 = () => {
            const a = [...st.liveKidsQuotes];
            const it = {
              ar: d.ar || '',
              tr: d.tr || '',
              who: d.who || ''
            };
            if (isNew) a.push(it);else a[st.adminEditIdx] = it;
            save('kidsQuotes', 'liveKidsQuotes', a, isNew ? 'Quote added!' : 'Updated!');
          };
          return /*#__PURE__*/React.createElement("div", {
            style: {
              padding: '0 0 20px'
            }
          }, /*#__PURE__*/React.createElement("div", {
            style: {
              fontSize: 13,
              fontWeight: 700,
              color: '#27241f',
              marginBottom: 14
            }
          }, isNew ? 'Add Quote' : 'Edit Quote'), /*#__PURE__*/React.createElement("input", {
            value: d.ar || '',
            onChange: e => this.setDraft({
              ar: e.target.value
            }),
            placeholder: "Arabic text",
            maxLength: 200,
            dir: "rtl",
            style: inp
          }), /*#__PURE__*/React.createElement("input", {
            value: d.tr || '',
            onChange: e => this.setDraft({
              tr: e.target.value
            }),
            placeholder: "Transliteration",
            maxLength: 200,
            style: inp
          }), /*#__PURE__*/React.createElement("input", {
            value: d.who || '',
            onChange: e => this.setDraft({
              who: e.target.value
            }),
            placeholder: "Attribution",
            maxLength: 80,
            style: inp
          }), /*#__PURE__*/React.createElement("div", {
            style: {
              display: 'flex',
              gap: 10
            }
          }, btn('Save', save2, {
            flex: 1,
            background: '#1f5145',
            color: '#f3ead4'
          }), btn('Cancel', this.cancelEdit, {
            flex: 1,
            border: NEU.edge,
            background: NEU.surf, boxShadow: neuUp(),
            color: '#3f3a32'
          })));
        }
      }
      if (editing && subSec === 'quizzes') {
        const isNew = st.adminEditIdx === -1;
        const opts = d._opts !== undefined ? d._opts : d.options || ['', '', ''];
        const ans = d._ans !== undefined ? d._ans : String(d.answer !== undefined ? d.answer : 0);
        const lvl = d._lvl !== undefined ? d._lvl : quizLevel(d);
        const setOpt = (i, v) => {
          const o = [...opts];
          o[i] = v;
          this.setDraft({
            _opts: o
          });
        };
        const saveQuiz = () => {
          if (!(d.question || '').trim()) {
            this.showToast('Question is required');
            return;
          }
          if (opts.some(o => !(o || '').trim())) {
            this.showToast('All three options are required');
            return;
          }
          const a = [...(st.liveKidsQuizzes || [])];
          const it = {
            question: (d.question || '').trim(),
            options: opts.map(o => o.trim()),
            answer: parseInt(ans, 10) || 0,
            level: lvl
          };
          if (isNew) a.push(it);else a[st.adminEditIdx] = it;
          save('kidsQuizzes', 'liveKidsQuizzes', a, isNew ? 'Quiz added!' : 'Updated!');
        };
        return /*#__PURE__*/React.createElement("div", {
          style: {
            padding: '0 0 20px'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 13,
            fontWeight: 700,
            color: '#27241f',
            marginBottom: 14
          }
        }, isNew ? 'Add Quiz' : 'Edit Quiz'), /*#__PURE__*/React.createElement("textarea", {
          value: d.question || '',
          onChange: e => this.setDraft({
            question: e.target.value
          }),
          placeholder: "Question",
          maxLength: 200,
          style: {
            ...inp,
            minHeight: 64,
            resize: 'none'
          }
        }), ['A', 'B', 'C'].map((L, i) => /*#__PURE__*/React.createElement("input", {
          key: L,
          value: opts[i] || '',
          onChange: e => setOpt(i, e.target.value),
          placeholder: `Option ${L}`,
          maxLength: 90,
          style: inp
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11.5,
            color: '#8d8574',
            margin: '2px 2px 7px'
          }
        }, "Correct answer"), /*#__PURE__*/React.createElement("select", {
          value: ans,
          onChange: e => this.setDraft({
            _ans: e.target.value
          }),
          style: {
            ...inp,
            cursor: 'pointer'
          }
        }, ['A', 'B', 'C'].map((L, i) => /*#__PURE__*/React.createElement("option", {
          key: L,
          value: String(i)
        }, `Option ${L}${(opts[i] || '').trim() ? ' — ' + opts[i] : ''}`))), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11.5,
            color: '#8d8574',
            margin: '10px 2px 7px'
          }
        }, "Difficulty"), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 8,
            marginBottom: 14
          }
        }, QUIZ_LEVELS.map(L => {
          const on = lvl === L.key;
          return /*#__PURE__*/React.createElement("div", {
            key: L.key,
            onClick: () => this.setDraft({
              _lvl: L.key
            }),
            style: {
              flex: 1,
              textAlign: 'center',
              padding: '9px 4px',
              borderRadius: 10,
              fontSize: 12.5,
              fontWeight: 700,
              cursor: 'pointer',
              background: NEU.surf,
              color: on ? L.color : NEU.muted,
              border: NEU.edge,
              boxShadow: on ? neuIn(.55) : neuUp(.55)
            }
          }, L.label);
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 10
          }
        }, btn('Save', saveQuiz, {
          flex: 1,
          background: '#1f5145',
          color: '#f3ead4'
        }), btn('Cancel', this.cancelEdit, {
          flex: 1,
          border: NEU.edge,
          background: NEU.surf, boxShadow: neuUp(),
          color: '#3f3a32'
        })));
      }
      const kTabs = [{
        id: 'videos',
        label: 'Videos'
      }, {
        id: 'books',
        label: 'Madrasa'
      }, {
        id: 'quotes',
        label: 'Quotes'
      }, {
        id: 'quizzes',
        label: 'Quiz'
      }];
      const ks = d._sub || 'videos';
      const list = ks === 'videos' ? st.liveKidsVideos : ks === 'books' ? st.liveKidsBooks : ks === 'quizzes' ? st.liveKidsQuizzes || [] : st.liveKidsQuotes;
      const getLabel = (it, i) => ks === 'videos' ? it.title : ks === 'books' ? it.title : ks === 'quizzes' ? it.question : it.tr;
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 6,
          background: '#efe7d7',
          borderRadius: 12,
          padding: 4,
          marginBottom: 14
        }
      }, kTabs.map(t => /*#__PURE__*/React.createElement("div", {
        key: t.id,
        onClick: () => this.setState({
          adminEditDraft: {
            _sub: t.id
          }
        }),
        style: {
          flex: 1,
          textAlign: 'center',
          padding: '13px 6px',
          borderRadius: 9,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          background: ks === t.id ? NEU.surf : 'transparent',
          color: ks === t.id ? NEU.accent : NEU.muted,
          boxShadow: ks === t.id ? neuUp(.5) : 'none'
        }
      }, t.label))), btn(`+ Add ${ks === 'quizzes' ? 'Quiz' : ks.slice(0, -1).charAt(0).toUpperCase() + ks.slice(0, -1).slice(1)}`, () => this.startEdit(-1, {
        _sub: ks
      }), {
        background: '#1f5145',
        color: '#f3ead4',
        marginBottom: 12,
        width: '100%'
      }), list.map((it, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: NEU.surf, boxShadow: neuUp(),
          border: NEU.edge,
          borderRadius: 14,
          padding: '12px 14px',
          marginBottom: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          fontSize: 13.5,
          fontWeight: 600,
          color: '#2c2823',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, getLabel(it, i)), btn('Edit', () => this.startEdit(i, {
        ...it,
        _sub: ks
      }), {
        background: '#e6efe9',
        color: '#1f5145',
        fontSize: 12,
        padding: '6px 12px'
      }), btn('✕', () => {
        const a = [...list];
        a.splice(i, 1);
        const kk = ks === 'videos' ? 'kidsVideos' : ks === 'books' ? 'kidsBooks' : ks === 'quizzes' ? 'kidsQuizzes' : 'kidsQuotes';
        const sk = ks === 'videos' ? 'liveKidsVideos' : ks === 'books' ? 'liveKidsBooks' : ks === 'quizzes' ? 'liveKidsQuizzes' : 'liveKidsQuotes';
        save(kk, sk, a, 'Deleted');
      }, {
        background: '#fdf0f2',
        color: '#6e2230',
        fontSize: 12,
        padding: '6px 10px'
      }))));
    };

    /* ─ HEALTH ─ */
    const renderHealthSection = () => {
      const d = st.adminEditDraft;
      const subSec = d._sub || 'tips';
      const HEALTH_TAGS = ['Hydration', 'Exercise', 'Sleep', 'Nutrition', 'Mental Health', 'General'];
      const TAG_COLORS = {
        'Hydration': '#2c5d52',
        'Exercise': '#1f5145',
        'Sleep': '#6e2230',
        'Nutrition': '#7d6220',
        'Mental Health': '#3a4a78',
        'General': '#b8923f'
      };
      const TAG_TINTS = {
        'Hydration': '#e6efe9',
        'Exercise': '#e6efe9',
        'Sleep': '#f3e6e8',
        'Nutrition': '#f3ecd9',
        'Mental Health': '#e8ebf4',
        'General': '#f3ecd9'
      };
      if (editing) {
        const isNew = st.adminEditIdx === -1;
        if (subSec === 'videos') {
          const H_VIDEO_CATS = ['Muharram Videos', 'Surah Explained', 'Imam Stories', 'Prophet Stories'];
          const hCatSel = d._catSel !== undefined ? d._catSel : !d.cat ? '' : H_VIDEO_CATS.includes(d.cat) ? d.cat : '__other';
          const hCatCustom = d._catCustom !== undefined ? d._catCustom : hCatSel === '__other' ? d.cat || '' : '';
          const save2 = () => {
            if (d.yt && !ytId(d.yt)) {
              this.showToast('That YouTube link is not valid');
              return;
            }
            let a = [...(st.liveHealthVideos || [])];
            const it = {
              title: d.title || '',
              meta: d.meta || '',
              color: d.color || '#1f5145',
              yt: d.yt || '',
              cat: hCatSel === '__other' ? (hCatCustom || '').trim() : hCatSel,
              hero: !!d.hero
            };
            if (isNew) a.push(it);else a[st.adminEditIdx] = it;
            if (it.hero) {
              const heroIdx = isNew ? a.length - 1 : st.adminEditIdx;
              a = a.map((x, xi) => xi === heroIdx ? x : x.hero ? {
                ...x,
                hero: false
              } : x);
            }
            save('healthVideos', 'liveHealthVideos', a, isNew ? 'Video added!' : 'Updated!');
          };
          return /*#__PURE__*/React.createElement("div", {
            style: {
              padding: '0 0 20px'
            }
          }, /*#__PURE__*/React.createElement("div", {
            style: {
              fontSize: 13,
              fontWeight: 700,
              color: '#27241f',
              marginBottom: 14
            }
          }, isNew ? 'Add Video' : 'Edit Video'), /*#__PURE__*/React.createElement("input", {
            value: d.title || '',
            onChange: e => this.setDraft({
              title: e.target.value
            }),
            placeholder: "Title",
            maxLength: 100,
            style: inp
          }), /*#__PURE__*/React.createElement("input", {
            value: d.meta || '',
            onChange: e => this.setDraft({
              meta: e.target.value
            }),
            placeholder: "Meta (e.g. Wellness · 3 min)",
            maxLength: 60,
            style: inp
          }), /*#__PURE__*/React.createElement("input", {
            value: d.yt || '',
            onChange: e => this.setDraft({
              yt: e.target.value
            }),
            placeholder: "YouTube URL (plays inside the app)",
            maxLength: 200,
            style: inp
          }), /*#__PURE__*/React.createElement("select", {
            value: hCatSel,
            onChange: e => this.setDraft({
              _catSel: e.target.value
            }),
            style: {
              ...inp,
              cursor: 'pointer'
            }
          }, [['', 'No category'], ...H_VIDEO_CATS.map(c => [c, c]), ['__other', 'Other (type your own)']].map(([v, l]) => /*#__PURE__*/React.createElement("option", {
            key: v,
            value: v
          }, l))), hCatSel === '__other' && /*#__PURE__*/React.createElement("input", {
            value: hCatCustom,
            onChange: e => this.setDraft({
              _catCustom: e.target.value
            }),
            placeholder: "Custom category",
            maxLength: 40,
            style: inp
          }), /*#__PURE__*/React.createElement("div", {
            onClick: () => this.setDraft({
              hero: !d.hero
            }),
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '11px 13px',
              borderRadius: 12,
              border: `1.5px solid ${d.hero ? '#1f5145' : 'rgba(203,195,178,.75)'}`,
              background: d.hero ? '#e6efe9' : NEU.sunk,
              cursor: 'pointer',
              marginBottom: 10
            }
          }, /*#__PURE__*/React.createElement("span", {
            style: {
              width: 18,
              height: 18,
              borderRadius: 6,
              border: `2px solid ${d.hero ? '#1f5145' : '#c9bfa9'}`,
              background: d.hero ? '#1f5145' : 'transparent',
              color: '#f3ead4',
              fontSize: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800
            }
          }, d.hero ? '✓' : ''), /*#__PURE__*/React.createElement("span", {
            style: {
              fontSize: 13,
              fontWeight: 600,
              color: '#3f3a32'
            }
          }, "Hero video — show at the top of Health & Wellness")), /*#__PURE__*/React.createElement("select", {
            value: d.color || '#1f5145',
            onChange: e => this.setDraft({
              color: e.target.value
            }),
            style: {
              ...inp,
              cursor: 'pointer'
            }
          }, COLORS.map(c => /*#__PURE__*/React.createElement("option", {
            key: c,
            value: c
          }, COLOR_NAMES[c]))), /*#__PURE__*/React.createElement("div", {
            style: {
              display: 'flex',
              gap: 10
            }
          }, btn('Save', save2, {
            flex: 1,
            background: '#1f5145',
            color: '#f3ead4'
          }), btn('Cancel', this.cancelEdit, {
            flex: 1,
            border: NEU.edge,
            background: NEU.surf, boxShadow: neuUp(),
            color: '#3f3a32'
          })));
        }
        if (subSec === 'tips') {
          const save2 = () => {
            const tag = d.tag || 'General';
            const a = [...(st.liveHealthTips || [])];
            const it = {
              title: d.title || '',
              body: d.body || '',
              tag,
              color: TAG_COLORS[tag] || '#2c5d52',
              tint: TAG_TINTS[tag] || '#e6efe9'
            };
            if (isNew) a.push(it);else a[st.adminEditIdx] = it;
            save('healthTips', 'liveHealthTips', a, isNew ? 'Tip added!' : 'Updated!');
          };
          return /*#__PURE__*/React.createElement("div", {
            style: {
              padding: '0 0 20px'
            }
          }, /*#__PURE__*/React.createElement("div", {
            style: {
              fontSize: 13,
              fontWeight: 700,
              color: '#27241f',
              marginBottom: 14
            }
          }, isNew ? 'Add Health Tip' : 'Edit Health Tip'), /*#__PURE__*/React.createElement("input", {
            value: d.title || '',
            onChange: e => this.setDraft({
              title: e.target.value
            }),
            placeholder: "Title",
            maxLength: 100,
            style: inp
          }), /*#__PURE__*/React.createElement("textarea", {
            value: d.body || '',
            onChange: e => this.setDraft({
              body: e.target.value
            }),
            placeholder: "Body text",
            maxLength: 500,
            rows: 3,
            style: {
              ...inp,
              resize: 'none'
            }
          }), /*#__PURE__*/React.createElement("select", {
            value: d.tag || 'General',
            onChange: e => {
              const t = e.target.value;
              this.setDraft({
                tag: t,
                color: TAG_COLORS[t] || '#2c5d52',
                tint: TAG_TINTS[t] || '#e6efe9'
              });
            },
            style: {
              ...inp,
              cursor: 'pointer'
            }
          }, HEALTH_TAGS.map(t => /*#__PURE__*/React.createElement("option", {
            key: t,
            value: t
          }, t))), /*#__PURE__*/React.createElement("div", {
            style: {
              display: 'flex',
              gap: 10
            }
          }, btn('Save', save2, {
            flex: 1,
            background: '#1f5145',
            color: '#f3ead4'
          }), btn('Cancel', this.cancelEdit, {
            flex: 1,
            border: NEU.edge,
            background: NEU.surf, boxShadow: neuUp(),
            color: '#3f3a32'
          })));
        }
      }
      const hTabs = [{
        id: 'tips',
        label: 'Tips'
      }, {
        id: 'videos',
        label: 'Videos'
      }];
      const hs = d._sub || 'tips';
      const hList = hs === 'tips' ? st.liveHealthTips || [] : st.liveHealthVideos || [];
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 6,
          background: '#efe7d7',
          borderRadius: 12,
          padding: 4,
          marginBottom: 14
        }
      }, hTabs.map(t => /*#__PURE__*/React.createElement("div", {
        key: t.id,
        onClick: () => this.setState({
          adminEditDraft: {
            _sub: t.id
          }
        }),
        style: {
          flex: 1,
          textAlign: 'center',
          padding: '13px 6px',
          borderRadius: 9,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          background: hs === t.id ? NEU.surf : 'transparent',
          color: hs === t.id ? NEU.accent : NEU.muted,
          boxShadow: hs === t.id ? neuUp(.5) : 'none'
        }
      }, t.label))), btn(`+ Add ${hs === 'tips' ? 'Tip' : 'Video'}`, () => this.startEdit(-1, {
        _sub: hs
      }), {
        background: '#1f5145',
        color: '#f3ead4',
        marginBottom: 12,
        width: '100%'
      }), hList.map((it, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: NEU.surf, boxShadow: neuUp(),
          border: NEU.edge,
          borderRadius: 14,
          padding: '12px 14px',
          marginBottom: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          fontSize: 13.5,
          fontWeight: 600,
          color: '#2c2823',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, it.title), btn('Edit', () => this.startEdit(i, {
        ...it,
        _sub: hs
      }), {
        background: '#e6efe9',
        color: '#1f5145',
        fontSize: 12,
        padding: '6px 12px'
      }), btn('✕', () => {
        const a = [...hList];
        a.splice(i, 1);
        const kk = hs === 'tips' ? 'healthTips' : 'healthVideos';
        const sk = hs === 'tips' ? 'liveHealthTips' : 'liveHealthVideos';
        save(kk, sk, a, 'Deleted');
      }, {
        background: '#fdf0f2',
        color: '#6e2230',
        fontSize: 12,
        padding: '6px 10px'
      }))));
    };
    /* ─ LIBRARY ─ */
    const renderLibrarySection = () => {
      const lt = st.adminLibTab || 'dua';
      const pillBar = /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 6,
          background: '#efe7d7',
          borderRadius: 12,
          padding: 4,
          marginBottom: 14
        }
      }, [['dua', 'Duʿāʾ'], ['ziyarah', 'Ziyārah'], ['aamal', 'Amaals'], ['nahj', 'Books']].map(([k, label]) => /*#__PURE__*/React.createElement("div", {
        key: k,
        onClick: () => this.setState({
          adminLibTab: k,
          adminEditIdx: null,
          adminEditDraft: {}
        }),
        style: {
          flex: 1,
          textAlign: 'center',
          padding: '13px 4px',
          minHeight: 44,
          boxSizing: 'border-box',
          borderRadius: 9,
          fontSize: 12.5,
          fontWeight: 600,
          cursor: 'pointer',
          background: lt === k ? NEU.surf : 'transparent',
          color: lt === k ? NEU.accent : NEU.muted,
          boxShadow: lt === k ? neuUp(.5) : 'none'
        }
      }, label)));
      const rowStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: NEU.surf, boxShadow: neuUp(),
        border: NEU.edge,
        borderRadius: 13,
        padding: '11px 13px',
        marginBottom: 9
      };
      const rowBtns = (onEdit, onDelete) => /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          gap: 6,
          flexShrink: 0
        }
      }, btn('Edit', onEdit, {
        background: '#e6efe9',
        color: '#1f5145',
        padding: '6px 12px',
        fontSize: 12
      }), btn('Delete', onDelete, {
        background: '#f3e6e8',
        color: '#6e2230',
        padding: '6px 12px',
        fontSize: 12
      }));
      if (lt === 'dua' || lt === 'ziyarah' || lt === 'aamal') {
        const key = lt === 'dua' ? 'duas' : lt === 'ziyarah' ? 'ziyarat' : 'aamals';
        const stateKey = lt === 'dua' ? 'liveDuas' : lt === 'ziyarah' ? 'liveZiyarat' : 'liveAamals';
        const label = lt === 'dua' ? 'Duʿāʾ' : lt === 'ziyarah' ? 'Ziyārah' : 'Amaal';
        const list = st[stateKey] || [];
        if (editing) {
          const d = st.adminEditDraft;
          const isNew = st.adminEditIdx === -1;
          const saveItem = () => {
            if (!(d.title || '').trim()) {
              this.showToast('Title is required');
              return;
            }
            const a = [...list];
            if (d.pdf && !/^https?:\/\//.test(d.pdf.trim())) {
              this.showToast('PDF link must start with http(s)://');
              return;
            }
            const item = {
              title: d.title || '',
              cat: (d.cat || '').trim() || 'General',
              ar: d.ar || '',
              tr: d.tr || '',
              note: d.note || '',
              body: d.body || '',
              body_ur: d.body_ur || '',
              body_fa: d.body_fa || '',
              body_hi: d.body_hi || '',
              pdf: (d.pdf || '').trim()
            };
            if (isNew) a.unshift(item);else a[st.adminEditIdx] = item;
            save(key, stateKey, a, isNew ? label + ' added!' : label + ' updated!');
          };
          return /*#__PURE__*/React.createElement("div", {
            style: {
              padding: '0 0 20px'
            }
          }, pillBar, /*#__PURE__*/React.createElement("div", {
            style: {
              fontSize: 13,
              fontWeight: 700,
              color: '#27241f',
              marginBottom: 14
            }
          }, (isNew ? 'Add ' : 'Edit ') + label), /*#__PURE__*/React.createElement("input", {
            value: d.title || '',
            onChange: e => this.setDraft({
              title: e.target.value
            }),
            placeholder: "Title",
            style: inp
          }), /*#__PURE__*/React.createElement("input", {
            value: d.cat || '',
            onChange: e => this.setDraft({
              cat: e.target.value
            }),
            placeholder: lt === 'dua' ? 'Category (e.g. Daily, Weekly, Morning)' : lt === 'aamal' ? 'Category (e.g. Daily, Ramaḍān, Muḥarram)' : 'Category (e.g. Imam Ḥusayn, General)',
            style: inp
          }), /*#__PURE__*/React.createElement("textarea", {
            value: d.ar || '',
            onChange: e => this.setDraft({
              ar: e.target.value
            }),
            placeholder: "Arabic text",
            style: {
              ...inp,
              height: 220,
              minHeight: 140,
              overflowY: 'auto',
              resize: 'vertical'
            },
            dir: "rtl"
          }), /*#__PURE__*/React.createElement("input", {
            value: d.tr || '',
            onChange: e => this.setDraft({
              tr: e.target.value
            }),
            placeholder: "Translation (opening line)",
            style: inp
          }), /*#__PURE__*/React.createElement("input", {
            value: d.note || '',
            onChange: e => this.setDraft({
              note: e.target.value
            }),
            placeholder: "Note (optional, e.g. when recited)",
            style: inp
          }), /*#__PURE__*/React.createElement("textarea", {
            value: d.body || '',
            onChange: e => this.setDraft({
              body: e.target.value
            }),
            placeholder: "Full text (English)",
            style: {
              ...inp,
              height: 240,
              minHeight: 140,
              overflowY: 'auto',
              resize: 'vertical'
            }
          }), /*#__PURE__*/React.createElement("div", {
            style: {
              fontSize: 11.5,
              color: '#8d8574',
              margin: '2px 2px 7px'
            }
          }, "Translations (optional — shown when the app language is switched; English is used as fallback)"), /*#__PURE__*/React.createElement("textarea", {
            value: d.body_ur || '',
            onChange: e => this.setDraft({
              body_ur: e.target.value
            }),
            placeholder: "Full text — Urdu / اردو",
            dir: "rtl",
            style: {
              ...inp,
              height: 120,
              minHeight: 80,
              overflowY: 'auto',
              resize: 'vertical'
            }
          }), /*#__PURE__*/React.createElement("textarea", {
            value: d.body_fa || '',
            onChange: e => this.setDraft({
              body_fa: e.target.value
            }),
            placeholder: "Full text — Farsi / فارسی",
            dir: "rtl",
            style: {
              ...inp,
              height: 120,
              minHeight: 80,
              overflowY: 'auto',
              resize: 'vertical'
            }
          }), /*#__PURE__*/React.createElement("textarea", {
            value: d.body_hi || '',
            onChange: e => this.setDraft({
              body_hi: e.target.value
            }),
            placeholder: "Full text — Hindi / हिन्दी",
            style: {
              ...inp,
              height: 120,
              minHeight: 80,
              overflowY: 'auto',
              resize: 'vertical'
            }
          }), /*#__PURE__*/React.createElement("input", {
            value: d.pdf || '',
            onChange: e => this.setDraft({
              pdf: e.target.value
            }),
            placeholder: "PDF link (optional — adds a Read PDF button)",
            style: inp
          }), /*#__PURE__*/React.createElement("div", {
            style: {
              display: 'flex',
              gap: 10
            }
          }, btn('Save', saveItem, {
            flex: 1,
            background: '#1f5145',
            color: '#f3ead4'
          }), btn('Cancel', this.cancelEdit, {
            flex: 1,
            border: NEU.edge,
            background: NEU.surf, boxShadow: neuUp(),
            color: '#3f3a32'
          })));
        }
        return /*#__PURE__*/React.createElement("div", null, pillBar, btn('+ Add ' + label, () => this.startEdit(-1, {}), {
          background: '#1f5145',
          color: '#f3ead4',
          marginBottom: 14,
          width: '100%'
        }), list.map((it, i) => /*#__PURE__*/React.createElement("div", {
          key: i,
          style: rowStyle
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            flex: 1,
            minWidth: 0
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 13.5,
            fontWeight: 600,
            color: '#2c2823',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }
        }, it.title), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11,
            color: NEU.muted,
            marginTop: 2
          }
        }, it.cat)), rowBtns(() => this.startEdit(i, {
          ...it
        }), () => {
          const a = list.filter((_, x) => x !== i);
          save(key, stateKey, a, 'Deleted');
        }))));
      }
      /* nahj */
      const nahj = st.liveNahj || NAHJ;
      const groups = [['sermons', 'Sermons'], ['letters', 'Letters'], ['sayings', 'Sayings']];
      if (editing) {
        const d = st.adminEditDraft;
        const isNew = st.adminEditIdx === -1;
        const g = d._group || 'sermons';
        const saveItem = () => {
          if (!(d.title || '').trim()) {
            this.showToast('Title is required');
            return;
          }
          const next = {
            sermons: [...(nahj.sermons || [])],
            letters: [...(nahj.letters || [])],
            sayings: [...(nahj.sayings || [])]
          };
          if (d.pdf && !/^https?:\/\//.test(d.pdf.trim())) {
            this.showToast('PDF link must start with http(s)://');
            return;
          }
          const item = {
            ref: d.ref || '',
            title: d.title || '',
            sum: d.sum || '',
            ar: d.ar || '',
            tr: d.tr || '',
            pdf: (d.pdf || '').trim()
          };
          if (isNew) next[g].unshift(item);else next[g][st.adminEditIdx] = item;
          save('nahj', 'liveNahj', next, isNew ? 'Entry added!' : 'Entry updated!');
        };
        return /*#__PURE__*/React.createElement("div", {
          style: {
            padding: '0 0 20px'
          }
        }, pillBar, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 13,
            fontWeight: 700,
            color: '#27241f',
            marginBottom: 14
          }
        }, isNew ? 'Add Nahj Entry' : 'Edit Nahj Entry'), /*#__PURE__*/React.createElement("select", {
          value: g,
          disabled: !isNew,
          onChange: e => this.setDraft({
            _group: e.target.value
          }),
          style: {
            ...inp,
            cursor: isNew ? 'pointer' : 'not-allowed',
            opacity: isNew ? 1 : .6
          }
        }, groups.map(([k, gl]) => /*#__PURE__*/React.createElement("option", {
          key: k,
          value: k
        }, gl))), /*#__PURE__*/React.createElement("input", {
          value: d.ref || '',
          onChange: e => this.setDraft({
            ref: e.target.value
          }),
          placeholder: "Reference (e.g. Sermon 1, Letter 31)",
          style: inp
        }), /*#__PURE__*/React.createElement("input", {
          value: d.title || '',
          onChange: e => this.setDraft({
            title: e.target.value
          }),
          placeholder: "Title",
          style: inp
        }), /*#__PURE__*/React.createElement("input", {
          value: d.sum || '',
          onChange: e => this.setDraft({
            sum: e.target.value
          }),
          placeholder: "Summary (optional)",
          style: inp
        }), /*#__PURE__*/React.createElement("textarea", {
          value: d.ar || '',
          onChange: e => this.setDraft({
            ar: e.target.value
          }),
          placeholder: "Arabic text (optional)",
          style: {
            ...inp,
            height: 220,
            minHeight: 140,
            overflowY: 'auto',
            resize: 'vertical'
          },
          dir: "rtl"
        }), /*#__PURE__*/React.createElement("textarea", {
          value: d.tr || '',
          onChange: e => this.setDraft({
            tr: e.target.value
          }),
          placeholder: "Translation / text (English)",
          style: {
            ...inp,
            height: 240,
            minHeight: 140,
            overflowY: 'auto',
            resize: 'vertical'
          }
        }), /*#__PURE__*/React.createElement("input", {
          value: d.pdf || '',
          onChange: e => this.setDraft({
            pdf: e.target.value
          }),
          placeholder: "PDF link (optional — adds a Read PDF button)",
          style: inp
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 10
          }
        }, btn('Save', saveItem, {
          flex: 1,
          background: '#1f5145',
          color: '#f3ead4'
        }), btn('Cancel', this.cancelEdit, {
          flex: 1,
          border: NEU.edge,
          background: NEU.surf, boxShadow: neuUp(),
          color: '#3f3a32'
        })));
      }
      return /*#__PURE__*/React.createElement("div", null, pillBar, btn('+ Add Entry', () => this.startEdit(-1, {
        _group: 'sermons'
      }), {
        background: '#1f5145',
        color: '#f3ead4',
        marginBottom: 14,
        width: '100%'
      }), groups.map(([g, gl]) => /*#__PURE__*/React.createElement(React.Fragment, {
        key: g
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          letterSpacing: 1.2,
          textTransform: 'uppercase',
          fontWeight: 700,
          color: '#6b6252',
          margin: '14px 0 8px'
        }
      }, gl), (nahj[g] || []).map((it, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: rowStyle
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          flex: 1,
          minWidth: 0
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13.5,
          fontWeight: 600,
          color: '#2c2823',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, it.title), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: NEU.muted,
          marginTop: 2
        }
      }, it.ref)), rowBtns(() => this.startEdit(i, {
        ...it,
        _group: g
      }), () => {
        save('nahj', 'liveNahj', {
          ...nahj,
          [g]: (nahj[g] || []).filter((_, x) => x !== i)
        }, 'Deleted');
      }))))));
    };
    const sectionContent = {
      stories: renderStoriesSection,
      library: renderLibrarySection,
      classifieds: renderClassifiedsSection,
      events: renderEventsSection,
      prayers: renderPrayersSection,
      announcement: renderAnnouncementSection,
      pinned: renderPinnedSection,
      askImam: renderAskImamSection,
      ads: renderAdsSection,
      kids: renderKidsSection,
      health: renderHealthSection
    };
    const stats = [{
      label: 'Stories',
      val: st.liveStories.length,
      ink: '#1f5145',
      tint: '#e6efe9'
    }, {
      label: 'Classifieds',
      val: st.liveClassifieds.length,
      ink: '#7d6220',
      tint: '#f3ecd9'
    }, {
      label: 'Cal Events',
      val: (st.liveCalEvents || []).length,
      ink: '#6e2230',
      tint: '#f3e6e8'
    }, {
      label: 'Health',
      val: (st.liveHealthTips || []).length + (st.liveHealthVideos || []).length,
      ink: '#2c5d52',
      tint: '#e6efe9'
    }];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      },
      className: "afu"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0,
        padding: '12px 20px 0',
        background: NEU.surf, boxShadow: neuUp(),
        borderBottom: NEU.rule
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 44,
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => this.go('more'),
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        color: '#1f5145',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        padding: '12px 10px',
        margin: '-12px -10px',
        minHeight: 44,
        boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18
      }
    }, "‹"), " More"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 18,
        fontWeight: 600,
        color: '#27241f'
      }
    }, "Admin Dashboard"), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 52,
        flexShrink: 0
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4,1fr)',
        gap: 8,
        marginBottom: 12
      }
    }, stats.map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        background: s.tint,
        borderRadius: 12,
        padding: '13px 6px',
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 22,
        fontWeight: 700,
        color: s.ink,
        lineHeight: 1
      }
    }, s.val), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: s.ink,
        fontWeight: 600,
        marginTop: 2,
        opacity: .9
      }
    }, s.label)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        margin: '8px 0 4px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '9px 0',
        borderRadius: 11,
        fontSize: 13,
        fontWeight: 700,
        background: '#e8f0ec',
        color: '#1f5145'
      }
    }, '✓ Changes publish instantly on Save'), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.revertAll(),
      style: {
        padding: '13px 18px',
        minHeight: 44,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        borderRadius: 12,
        fontSize: 13,
        fontWeight: 700,
        cursor: 'pointer',
        background: '#f3e6e8',
        color: '#6e2230'
      }
    }, 'Cancel')), /*#__PURE__*/React.createElement("div", {
      className: "s",
      style: {
        display: 'flex',
        gap: 6,
        overflowX: 'auto',
        paddingBottom: 10
      }
    }, tabs.map(t => /*#__PURE__*/React.createElement("div", {
      key: t.id,
      onClick: () => this.setState({
        adminSection: t.id,
        adminEditIdx: null,
        adminEditDraft: {}
      }),
      style: {
        flexShrink: 0,
        padding: '13px 15px',
        minHeight: 44,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        background: sec === t.id ? '#1f5145' : '#efe7d7',
        color: sec === t.id ? '#f3ead4' : '#6b6252',
        transition: 'background .15s'
      }
    }, t.label)))), /*#__PURE__*/React.createElement("div", {
      className: "s",
      style: {
        flex: 1,
        overflowY: 'auto',
        padding: '16px 20px 24px'
      }
    }, sectionContent[sec]()), /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0,
        padding: '10px 20px calc(10px + env(safe-area-inset-bottom, 0px))',
        background: NEU.surf, boxShadow: neuUp(),
        borderTop: NEU.rule
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({
        adminLoggedIn: false
      }),
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        padding: '13px 0',
        minHeight: 44,
        boxSizing: 'border-box',
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
        background: '#f3e6e8',
        color: '#6e2230',
        border: '1px solid #e6cdd2'
      }
    }, icon('log-out', { size: 15 }), "Log out")));
  }

  /* ── CALENDAR ── */
  renderCalendar(st) {
    const now = st.now;
    const todayY = now.getFullYear(),
      todayM = now.getMonth(),
      todayD = now.getDate();
    const calY = st.calViewY || todayY;
    const calM = st.calViewM !== undefined ? st.calViewM : todayM;
    const isCurrentMonth = calY === todayY && calM === todayM;
    const daysInMonth = new Date(calY, calM + 1, 0).getDate();
    const firstWeekday = new Date(calY, calM, 1).getDay();
    const monthName = new Date(calY, calM, 1).toLocaleDateString('en-IE', {
      month: 'long',
      year: 'numeric'
    });
    // Match events to each day by Hijri anchor (one-off = exact Hijri date; yearly = Hijri day+month).
    const eventsByDay = {};
    const evList = (st.liveCalEvents || []).filter(e => e.notice !== 'reminder');
    for (let d = 1; d <= daysInMonth; d++) {
      const dayDate = new Date(calY, calM, d);
      const hits = evList.filter(e => eventOnDate(e, dayDate));
      if (hits.length) eventsByDay[d] = hits;
    }
    const selDay = st.calDay || (isCurrentMonth ? todayD : 1);
    const selEvents = eventsByDay[selDay] || [];
    const selDayDate = new Date(calY, calM, selDay);
    const selDayGreg = selDayDate.toLocaleDateString('en-IE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    const selHijri = toHijri(selDayDate);
    const selDayStr = `${calY}-${String(calM + 1).padStart(2, '0')}-${String(selDay).padStart(2, '0')}`;
    const selIsToday = isCurrentMonth && selDay === todayD;
    const dayReminders = (st.liveCalEvents || []).filter(e => e.notice === 'reminder' && e.date && eventOnDate(e, selDayDate));
    const dayLabelShort = selIsToday ? 'Today' : selDayDate.toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short' });
    const todayStart = new Date(todayY, todayM, todayD).getTime();
    // The list below the calendar is reminders only ("On this day" entries live in their
    // own card), and it looks 60 days ahead so it does not stop at the month boundary.
    const remList = (st.liveCalEvents || []).filter(e => e.notice === 'reminder' && e.date);
    const calEventList = [];
    for (let i = 0; i < 60 && calEventList.length < 12; i++) {
      const dd = new Date(todayY, todayM, todayD + i);
      remList.filter(e => eventOnDate(e, dd)).forEach(ev => calEventList.push({
        y: dd.getFullYear(),
        m: dd.getMonth(),
        day: dd.getDate(),
        ...ev,
        dateLabel: dd.toLocaleDateString('en-IE', {
          day: 'numeric',
          month: 'short'
        })
      }));
    }
    const weekHead = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const hijriMonthYear = toHijri(new Date(calY, calM, 15)).split(' ').slice(1).join(' ');
    const cells = [];
    for (let i = 0; i < firstWeekday; i++) cells.push({
      blank: true,
      key: 'b' + i
    });
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = isCurrentMonth && d === todayD;
      const sel = selDay === d;
      const hijriDay = toHijri(new Date(calY, calM, d)).split(' ')[0];
      cells.push({
        blank: false,
        key: 'd' + d,
        day: d,
        hijriDay,
        sel,
        isToday,
        hasEvent: !!eventsByDay[d]
      });
    }
    const canPrev = !(calY <= 2024 && calM === 0);
    const canNext = !(calY >= 2036 && calM === 11);
    const goMonth = (dy, dm) => {
      let y = calY + dy,
        m = calM + dm;
      if (m < 0) {
        m = 11;
        y--;
      }
      if (m > 11) {
        m = 0;
        y++;
      }
      y = Math.max(2024, Math.min(2036, y));
      this.setState({
        calViewY: y,
        calViewM: m,
        calDay: null
      });
    };
    const monthOnly = new Date(calY, calM, 1).toLocaleDateString('en-IE', { month: 'long' });
    const arrowBtn = (glyph, enabled, onClick) => /*#__PURE__*/React.createElement("div", {
      onClick,
      style: { width: 44, height: 44, flexShrink: 0, borderRadius: 13, background: enabled ? '#f4faf7' : '#f5f0e8', border: NEU.edge, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: enabled ? 'pointer' : 'default', color: enabled ? '#1f5145' : '#c9bfae', fontSize: 18, fontWeight: 700 }
    }, glyph);
    const calIcon = icon('calendar', { size: 16, stroke: NEU.accent });
    const clockIcon = icon('clock', { size: 13, stroke: NEU.muted });
    const bellIcon = icon('bell', { size: 16, stroke: NEU.accent });
    return /*#__PURE__*/React.createElement("div", {
      style: { padding: '8px 20px 100px' },
      className: "afu"
    },
    /*#__PURE__*/React.createElement("div", {
      style: { padding: '8px 56px 16px 0' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 13, color: NEU.muted, fontWeight: 500 }
    }, this.t('cal.community')), /*#__PURE__*/React.createElement("div", {
      style: { fontFamily: 'Spectral,serif', fontSize: 26, fontWeight: 600, color: '#27241f', marginTop: 2 }
    }, this.t('cal.title'))),
    /*#__PURE__*/React.createElement("div", {
      style: { ...neuCard(22, 1.15), padding: '16px 14px' }
    },
      /*#__PURE__*/React.createElement("div", {
        style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }
      }, arrowBtn("‹", canPrev, () => canPrev && goMonth(0, -1)), /*#__PURE__*/React.createElement("div", {
        style: { flex: 1, textAlign: 'right', fontFamily: 'Spectral,serif', fontSize: 17, fontWeight: 600, color: '#2c2823' }
      }, monthOnly), /*#__PURE__*/React.createElement("div", {
        style: { position: 'relative', width: 66, height: 66, flexShrink: 0, borderRadius: '50%', background: 'radial-gradient(circle,#ffffff 55%,#eef5f1 56%)', border: '2px solid #1f5145', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px -6px rgba(31,81,69,.55)' }
      }, /*#__PURE__*/React.createElement("div", {
        style: { position: 'absolute', inset: 5, borderRadius: '50%', border: '1.5px dashed #75601f' }
      }), /*#__PURE__*/React.createElement("div", {
        style: { fontFamily: 'Spectral,serif', fontSize: 24, fontWeight: 700, color: '#1f5145' }
      }, selDay)), /*#__PURE__*/React.createElement("div", {
        style: { flex: 1, textAlign: 'left', fontFamily: 'Spectral,serif', fontSize: 17, fontWeight: 600, color: '#2c2823' }
      }, String(calY)), arrowBtn("›", canNext, () => canNext && goMonth(0, 1))),
      /*#__PURE__*/React.createElement("div", {
        style: { textAlign: 'center', fontSize: 12.5, color: '#7d6220', fontWeight: 600, marginTop: 7 }
      }, selHijri, " AH"),
      /*#__PURE__*/React.createElement("div", {
        style: { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginTop: 12, marginBottom: 2 }
      }, weekHead.map((w, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: { textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#6b6252' }
      }, w))),
      /*#__PURE__*/React.createElement("div", {
        style: { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 2 }
      }, cells.map(c => c.blank ? /*#__PURE__*/React.createElement("div", { key: c.key }) : /*#__PURE__*/React.createElement("div", {
        key: c.key,
        onClick: () => this.setState({ calDay: c.day }),
        style: { aspectRatio: '0.82', borderRadius: 13, background: c.sel ? '#1f5145' : c.isToday ? '#e6efe9' : 'transparent', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative', gap: 2 }
      }, c.hasEvent && /*#__PURE__*/React.createElement("span", {
        style: { position: 'absolute', top: 6, right: 7, width: 6, height: 6, borderRadius: '50%', background: c.sel ? '#f0c07a' : '#e08a3c' }
      }), /*#__PURE__*/React.createElement("span", {
        style: { fontSize: 13.5, fontWeight: 600, color: c.sel ? '#fffdf9' : c.isToday ? '#1f5145' : '#3f3a32', lineHeight: 1 }
      }, c.day), /*#__PURE__*/React.createElement("span", {
        style: { fontSize: 10, fontWeight: 600, color: c.sel ? 'rgba(255,255,255,.75)' : '#7d6220', lineHeight: 1 }
      }, c.hijriDay))))),
    /*#__PURE__*/React.createElement("div", {
      style: { background: NEU.surf, boxShadow: neuUp(), border: NEU.edge, borderRadius: 18, marginTop: 16, overflow: 'hidden' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', background: '#e8f0ec' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'center', gap: 9 }
    }, calIcon, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 15, fontWeight: 700, color: '#1f5145' }
    }, "On this day")), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 12.5, fontWeight: 600, color: '#1f5145' }
    }, dayLabelShort)), /*#__PURE__*/React.createElement("div", {
      style: { padding: '2px 16px 12px' }
    }, selEvents.length > 0 ? selEvents.map((ev, si) => /*#__PURE__*/React.createElement("div", {
      key: si,
      style: { padding: '12px 0', borderTop: si > 0 ? '1px solid #f1ebdd' : 'none' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 10.5, letterSpacing: .7, textTransform: 'uppercase', fontWeight: 700, color: ev.color }
    }, ev.type), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 15, fontWeight: 600, color: '#2c2823', marginTop: 2 }
    }, ev.title), ev.desc && /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 12.5, color: '#6b6252', marginTop: 4, lineHeight: 1.5 }
    }, ev.desc), st.adminLoggedIn && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({ screen: 'admin', adminSection: 'events', adminEditIdx: (st.liveCalEvents || []).indexOf(ev), adminEditDraft: { ...ev } }),
      style: { marginTop: 8, display: 'inline-block', fontSize: 11, color: '#1f5145', fontWeight: 600, cursor: 'pointer', padding: '4px 10px', border: '1px solid #c4ddd7', borderRadius: 8, background: '#eef7f4' }
    }, "Edit"))) : /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 13, color: '#6b6252', padding: '12px 0 4px' }
    }, this.t('cal.noEvent')), /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, paddingTop: 10, borderTop: '1px solid #f1ebdd' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: NEU.muted, fontWeight: 600 }
    }, clockIcon, dayLabelShort), st.adminLoggedIn && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({ screen: 'admin', adminSection: 'events', adminEditIdx: -1, adminEditDraft: { date: selDayStr, type: 'Community', notice: 'day' } }),
      style: { fontSize: 11, color: '#1f5145', fontWeight: 600, cursor: 'pointer', padding: '5px 10px', border: '1px solid #c4ddd7', borderRadius: 8, background: '#eef7f4' }
    }, "+ Add event")))),
    /*#__PURE__*/React.createElement("div", {
      style: { background: NEU.surf, boxShadow: neuUp(), border: NEU.edge, borderRadius: 18, marginTop: 14, overflow: 'hidden' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', background: '#e8f0ec' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'center', gap: 9 }
    }, bellIcon, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 15, fontWeight: 700, color: '#1f5145' }
    }, "Reminder (" + dayReminders.length + ")")), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 12.5, fontWeight: 600, color: '#1f5145' }
    }, dayLabelShort)), /*#__PURE__*/React.createElement("div", {
      style: { padding: '12px 16px 14px' }
    }, dayReminders.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 12 }
    }, dayReminders.map((rm, ri) => /*#__PURE__*/React.createElement("div", {
      key: ri,
      style: { display: 'flex', gap: 10, alignItems: 'flex-start' }
    }, /*#__PURE__*/React.createElement("span", {
      style: { flexShrink: 0, marginTop: 5, width: 7, height: 7, borderRadius: '50%', background: '#1f5145' }
    }), /*#__PURE__*/React.createElement("div", {
      style: { flex: 1, fontSize: 13.5, color: '#2c2823', lineHeight: 1.45 }
    }, /*#__PURE__*/React.createElement("span", {
      style: { fontWeight: 600 }
    }, rm.title), rm.desc && /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 12, color: '#8c8270', marginTop: 1 }
    }, rm.desc)), st.adminLoggedIn && /*#__PURE__*/React.createElement("span", {
      onClick: () => this.setState({ screen: 'admin', adminSection: 'events', adminEditIdx: (st.liveCalEvents || []).indexOf(rm), adminEditDraft: { ...rm } }),
      style: { flexShrink: 0, fontSize: 11, color: '#1f5145', fontWeight: 600, cursor: 'pointer' }
    }, "Edit")))), st.adminLoggedIn ? /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({ screen: 'admin', adminSection: 'events', adminEditIdx: -1, adminEditDraft: { date: selDayStr, type: 'Community', notice: 'reminder' } }),
      style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px', borderRadius: 12, border: '1px dashed #c4ddd7', background: '#f4fbf8', color: '#1f5145', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }
    }, "+ Add A Reminder") : dayReminders.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 13, color: '#6b6252', textAlign: 'center', padding: '4px 0' }
    }, "No reminders for this day."))),
    st.adminLoggedIn && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({ screen: 'admin', adminSection: 'events', adminEditIdx: null, adminEditDraft: {} }),
      style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, padding: '12px', borderRadius: 14, border: '1px dashed #c4ddd7', background: '#f4fbf8', cursor: 'pointer' }
    }, /*#__PURE__*/React.createElement("span", {
      style: { color: '#1f5145', fontSize: 14, fontWeight: 600 }
    }, "⚙ Manage Events & Reminders")),
    calEventList.length > 0 && /*#__PURE__*/React.createElement("div", {
      id: 'cal-upcoming',
      style: { marginTop: 26 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700, color: '#6b6252', marginBottom: 12 }
    }, this.t('cal.upcoming')), /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', flexDirection: 'column', gap: 10 }
    }, calEventList.map((e, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => this.setState({ calViewY: e.y, calViewM: e.m, calDay: e.day }),
      style: { display: 'flex', gap: 13, alignItems: 'center', background: NEU.surf, boxShadow: neuUp(), border: NEU.edge, borderRadius: 15, padding: '13px 15px', cursor: 'pointer' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { flexShrink: 0, width: 46, textAlign: 'center', borderRight: '1px solid #f1ebdd', paddingRight: 11 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 18, fontWeight: 700, color: e.color, lineHeight: 1 }
    }, e.day), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 10, color: '#6b6252', marginTop: 2 }
    }, e.dateLabel)), /*#__PURE__*/React.createElement("div", {
      style: { flex: 1 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 10, letterSpacing: .6, textTransform: 'uppercase', fontWeight: 700, color: e.color }
    }, "🔔 ", e.type), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 14.5, fontWeight: 600, color: '#2c2823', marginTop: 1 }
    }, e.title)))))),
    /*#__PURE__*/React.createElement("div", {
      style: { textAlign: 'center', fontSize: 11.5, color: '#6b6252', lineHeight: 1.5, padding: '22px 24px 0' }
    }, "Events and reminders are managed by Ahlul Bayt Ireland."));
  }

  /* ── KIDS CORNER ── */
  renderKids(st) {
    const kt = st.kidsTab || 'videos';
    const heroV = (st.liveKidsVideos || []).find(v => v.hero && ytId(v.yt));
    const kvCats = ['All', ...new Set((st.liveKidsVideos || []).map(v => v.cat).filter(Boolean))];
    const kvCat = kvCats.includes(st.kidsVidCat) ? st.kidsVidCat : 'All';
    const kidsVids = [...(st.liveKidsVideos || [])].reverse().filter(v => kvCat === 'All' || v.cat === kvCat);
    const tabStyle = k => ({
      flex: 1,
      textAlign: 'center',
      padding: '13px 6px',
      minHeight: 44,
      borderRadius: 11,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      background: kt === k ? NEU.surf : 'transparent',
      color: kt === k ? NEU.accent : NEU.muted,
      boxShadow: kt === k ? neuUp(.5) : 'none',
      transition: 'background .15s'
    });
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 20px 100px'
      },
      className: "afu"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 56px 16px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: st.dark ? '#8e9490' : NEU.muted,
        fontWeight: 500
      }
    }, "For children"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 26,
        fontWeight: 600,
        color: st.dark ? '#ece6d8' : '#27241f',
        marginTop: 2
      }
    }, this.t('kids.title'))), heroV && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.playYt(heroV.yt),
      style: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 20,
        aspectRatio: '16/10',
        background: `linear-gradient(rgba(0,0,0,.22),rgba(0,0,0,.5)),url(https://img.youtube.com/vi/${ytId(heroV.yt)}/hqdefault.jpg) center/cover`,
        marginBottom: 18,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'flex-end',
        padding: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 58,
        height: 58,
        borderRadius: '50%',
        background: 'rgba(255,253,249,.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 20px -6px rgba(0,0,0,.4)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 0,
        height: 0,
        borderLeft: '18px solid #1f5145',
        borderTop: '11px solid transparent',
        borderBottom: '11px solid transparent',
        marginLeft: 4
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        color: '#fff'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#d8b863'
      }
    }, heroV.cat || ''), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 19,
        fontWeight: 600,
        marginTop: 3
      }
    }, heroV.title))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 9,
        marginBottom: 18
      }
    }, [['videos', this.t('kids.videos'), '🎬', '#3a4a78', '#e8ebf4'], ['books', this.t('kids.books'), '📚', '#8a4b2c', '#f6ebe4'], ['wisdom', this.t('kids.wisdom'), '💡', '#7d6220', '#f7f0dc'], ['quiz', 'Quiz', '🎯', '#6e2230', '#f7e7ea']].map(([k, label, icon, ink, tint]) => {
      const on = kt === k;
      return /*#__PURE__*/React.createElement("div", {
        key: k,
        onClick: () => this.setState({
          kidsTab: k
        }),
        style: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 5,
          padding: '11px 3px 9px',
          borderRadius: 16,
          cursor: 'pointer',
          background: on ? tint : NEU.surf,
          border: NEU.edge,
          boxShadow: on ? neuIn(.72) : neuUp(.72),
          transition: 'box-shadow .2s ease, background .2s ease'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 34,
          height: 34,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 18,
          background: on ? NEU.surf : tint,
          boxShadow: on ? neuUp(.45) : neuIn(.4)
        }
      }, icon), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10.5,
          fontWeight: 700,
          color: on ? ink : NEU.muted,
          lineHeight: 1.1,
          textAlign: 'center'
        }
      }, label));
    })), kt === 'videos' && /*#__PURE__*/React.createElement(React.Fragment, null, !heroV && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 20,
        aspectRatio: '16/10',
        background: 'linear-gradient(150deg,#2a6a58,#143b2f)',
        marginBottom: 10,
        display: 'flex',
        alignItems: 'flex-end',
        padding: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(135deg,rgba(255,255,255,.05) 0 12px,transparent 12px 24px)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 58,
        height: 58,
        borderRadius: '50%',
        background: 'rgba(255,253,249,.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 20px -6px rgba(0,0,0,.4)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 0,
        height: 0,
        borderLeft: '18px solid #1f5145',
        borderTop: '11px solid transparent',
        borderBottom: '11px solid transparent',
        marginLeft: 4
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        color: '#fff'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#d8b863'
      }
    }, "Featured · Animated"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 19,
        fontWeight: 600,
        marginTop: 3
      }
    }, "The Story of the Two Brothers"))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 17,
        fontWeight: 600,
        color: '#2c2823',
        marginBottom: 12
      }
    }, this.t('kids.videos')), kvCats.length > 1 && /*#__PURE__*/React.createElement("div", {
      className: "s",
      style: {
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        margin: '0 -20px 12px',
        padding: '0 20px 2px'
      }
    }, kvCats.map(c => /*#__PURE__*/React.createElement("div", {
      key: c,
      onClick: () => this.setState({
        kidsVidCat: c
      }),
      style: {
        flexShrink: 0,
        padding: '12px 15px',
        minHeight: 44,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        borderRadius: 20,
        fontSize: 12.5,
        fontWeight: 600,
        cursor: 'pointer',
        background: NEU.surf,
        color: kvCat === c ? NEU.accent : NEU.muted,
        border: NEU.edge,
        boxShadow: kvCat === c ? neuIn(.55) : neuUp(.55)
      }
    }, c))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginBottom: 24
      }
    }, kidsVids.map((v, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => this.playYt(v.yt),
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        background: NEU.surf, boxShadow: neuUp(),
        border: NEU.edge,
        borderRadius: 14,
        padding: 10,
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        flexShrink: 0,
        width: 132,
        aspectRatio: '16/10',
        borderRadius: 10,
        overflow: 'hidden',
        background: ytId(v.yt) ? `url(https://img.youtube.com/vi/${ytId(v.yt)}/hqdefault.jpg) center/cover` : v.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: ytId(v.yt) ? 'rgba(0,0,0,.18)' : 'repeating-linear-gradient(135deg,rgba(255,255,255,.05) 0 10px,transparent 10px 20px)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 34,
        height: 34,
        borderRadius: '50%',
        background: 'rgba(255,253,249,.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 0,
        height: 0,
        borderLeft: '11px solid #1f5145',
        borderTop: '7px solid transparent',
        borderBottom: '7px solid transparent',
        marginLeft: 3
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        fontWeight: 600,
        color: '#2c2823',
        lineHeight: 1.3
      }
    }, v.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: NEU.muted,
        marginTop: 3
      }
    }, v.meta)))))), kt === 'wisdom' && /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'linear-gradient(150deg,#1f5145,#163b30)',
        borderRadius: 20,
        padding: 22,
        color: '#f3ead4',
        marginBottom: 24,
        position: 'relative',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: -26,
        top: -26,
        width: 110,
        height: 110,
        borderRadius: '50%',
        border: '1px solid rgba(216,184,99,.2)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#d8b863'
      }
    }, this.t('kids.wisdom')), st.liveKidsQuotes.map((q, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        marginTop: i > 0 ? 18 : 12,
        paddingTop: i > 0 ? 18 : 0,
        borderTop: i > 0 ? '1px solid rgba(216,184,99,.28)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Amiri,serif',
        fontSize: 24,
        lineHeight: 1.7,
        textAlign: 'right'
      },
      dir: "rtl"
    }, q.ar), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 16,
        marginTop: 8,
        color: '#fff'
      }
    }, "\"", q.tr, "\""), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: '#bcae8d',
        marginTop: 6
      }
    }, "— ", q.who)))), kt === 'books' && /*#__PURE__*/React.createElement(React.Fragment, null,
    /* ANCHOR: MADRASA_CONTENT render — mirrors ahlulbait.ie/madrasa (data in MADRASA_INFO) */
    /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'linear-gradient(150deg,#1f5145,#163b30)',
        borderRadius: 20,
        padding: '22px 20px',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: -30,
        top: -30,
        width: 120,
        height: 120,
        borderRadius: '50%',
        border: '1px solid rgba(216,184,99,.2)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-block',
        fontSize: 10,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#163b30',
        background: '#d8b863',
        borderRadius: 20,
        padding: '4px 11px'
      }
    }, MADRASA_INFO.status + ' · ' + MADRASA_INFO.year), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 28,
        fontWeight: 600,
        marginTop: 12,
        color: '#fffdf9'
      }
    }, MADRASA_INFO.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 15,
        fontStyle: 'italic',
        color: '#d8b863',
        marginTop: 2
      }
    }, MADRASA_INFO.tagline), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: '#bcae8d',
        marginTop: 8
      }
    }, MADRASA_INFO.place)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginBottom: 16,
        flexWrap: 'wrap'
      }
    }, [['👧', MADRASA_INFO.ages], ['🗓️', MADRASA_INFO.day]].map(([ic, tx]) => /*#__PURE__*/React.createElement("div", {
      key: tx,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: st.dark ? NEU_D.surf : NEU.surf,
        border: st.dark ? NEU_D.edge : NEU.edge,
        boxShadow: neuUp(.6, st.dark),
        borderRadius: 20,
        padding: '8px 13px',
        fontSize: 12.5,
        fontWeight: 600,
        color: st.dark ? '#ece6d8' : '#2c2823'
      }
    }, /*#__PURE__*/React.createElement("span", null, ic), tx))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        lineHeight: 1.6,
        color: st.dark ? '#c8c2b4' : '#4a4438',
        marginBottom: 20
      }
    }, MADRASA_INFO.intro), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 17,
        fontWeight: 600,
        color: st.dark ? '#ece6d8' : '#2c2823',
        marginBottom: 12
      }
    }, "What we teach"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginBottom: 22
      }
    }, MADRASA_INFO.subjects.map((s2, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        display: 'flex',
        gap: 13,
        background: st.dark ? NEU_D.surf : NEU.surf,
        border: st.dark ? NEU_D.edge : NEU.edge,
        boxShadow: neuUp(.85, st.dark),
        borderRadius: 14,
        padding: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 24,
        lineHeight: 1,
        flexShrink: 0
      }
    }, s2.icon), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 15.5,
        fontWeight: 600,
        color: st.dark ? '#d8b863' : '#1f5145',
        marginBottom: 3
      }
    }, s2.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        lineHeight: 1.5,
        color: st.dark ? '#a7a091' : '#6b6252'
      }
    }, s2.desc))))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: '#7d6220',
        background: st.dark ? '#2a2818' : '#f7f0dd',
        border: `1px solid ${st.dark ? '#4a4224' : '#ecdfb8'}`,
        borderRadius: 12,
        padding: '11px 14px',
        marginBottom: 16
      }
    }, "★ " + MADRASA_INFO.note), /*#__PURE__*/React.createElement("div", {
      onClick: () => window.open(MADRASA_INFO.registerUrl, '_blank'),
      style: {
        textAlign: 'center',
        background: '#1f5145',
        color: '#fffdf9',
        borderRadius: 14,
        padding: '15px',
        fontSize: 15,
        fontWeight: 700,
        cursor: 'pointer',
        marginBottom: 24
      }
    }, "Register your child ↗")), kt === 'quiz' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 17,
        fontWeight: 600,
        color: '#2c2823',
        marginBottom: 12
      }
    }, "Quiz Time"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginBottom: 14
      }
    }, QUIZ_LEVELS.map(L => {
      const on = (st.kidsQuizLevel || 'beginner') === L.key;
      const n = (st.liveKidsQuizzes || []).filter(q => quizLevel(q) === L.key).length;
      return /*#__PURE__*/React.createElement("div", {
        key: L.key,
        onClick: () => {
          this.clearQuizTimers();
          this.setState({
            kidsQuizLevel: L.key,
            quizRun: null
          });
        },
        style: {
          flex: 1,
          textAlign: 'center',
          padding: '9px 4px',
          borderRadius: 12,
          fontSize: 12.5,
          fontWeight: 700,
          cursor: 'pointer',
          background: NEU.surf,
          color: on ? L.color : NEU.muted,
          border: NEU.edge,
          boxShadow: on ? neuIn(.55) : neuUp(.55)
        }
      }, L.label, n ? /*#__PURE__*/React.createElement("span", {
        style: {
          opacity: .7,
          fontWeight: 600
        }
      }, " · ", n) : null);
    })), (() => {
      const lvl = st.kidsQuizLevel || 'beginner';
      const lvlMeta = QUIZ_LEVELS.find(l => l.key === lvl) || QUIZ_LEVELS[0];
      const pool = (st.liveKidsQuizzes || []).filter(q => quizLevel(q) === lvl);
      if (!pool.length) return /*#__PURE__*/React.createElement("div", {
        style: {
          background: NEU.surf, boxShadow: neuUp(),
          border: '1px dashed rgba(203,195,178,.85)',
          borderRadius: 18,
          padding: '22px 18px',
          textAlign: 'center',
          fontSize: 13.5,
          color: '#8c8270',
          marginBottom: 14
        }
      }, "No ", lvlMeta.label.toLowerCase(), " quizzes yet — check back soon.");
      const r = st.quizRun && st.quizRun.lvl === lvl ? st.quizRun : null;

      /* start card */
      if (!r) return /*#__PURE__*/React.createElement("div", {
        style: {
          background: NEU.surf, boxShadow: neuUp(),
          border: NEU.edge,
          borderRadius: 18,
          padding: '24px 20px',
          textAlign: 'center',
          marginBottom: 14
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 40,
          marginBottom: 8
        }
      }, "🎯"), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: 'Spectral,serif',
          fontSize: 19,
          fontWeight: 600,
          color: '#2c2823'
        }
      }, "Ready to play?"), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13,
          color: '#8c8270',
          marginTop: 6,
          lineHeight: 1.5
        }
      }, Math.min(10, pool.length), " random question", Math.min(10, pool.length) > 1 ? 's' : '', " · 10 seconds each", /*#__PURE__*/React.createElement("br", null), "Answer before the clock runs out!"), /*#__PURE__*/React.createElement("div", {
        onClick: () => this.startQuizRun(lvl),
        style: {
          marginTop: 16,
          padding: '13px 0',
          borderRadius: 13,
          background: lvlMeta.color,
          color: '#fffdf9',
          fontSize: 15,
          fontWeight: 800,
          cursor: 'pointer'
        }
      }, "Start Quiz ▶"));

      /* results card */
      if (r.done) {
        const total = r.qs.length;
        const pct = r.score / total;
        const stars = Math.max(1, Math.round(pct * 5));
        const cheer = pct === 1 ? ['🏆', 'Mashallah — a perfect score!', 'You answered every single question right. Outstanding!'] : pct >= .7 ? ['🌟', 'Amazing job!', 'You really know your stuff — keep it up!'] : pct >= .4 ? ['👍', 'Well done!', 'Great effort — a little more practice and you will ace it!'] : ['💪', 'Good try!', 'Every champion starts somewhere — play again and watch your score grow!'];
        return /*#__PURE__*/React.createElement("div", {
          className: "apo",
          style: {
            background: 'linear-gradient(150deg,#1f5145,#163b30)',
            borderRadius: 18,
            padding: '26px 20px',
            textAlign: 'center',
            marginBottom: 14,
            color: '#f3ead4'
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 44
          }
        }, cheer[0]), /*#__PURE__*/React.createElement("div", {
          style: {
            fontFamily: 'Spectral,serif',
            fontSize: 21,
            fontWeight: 600,
            marginTop: 6
          }
        }, cheer[1]), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 15,
            marginTop: 10,
            fontWeight: 700,
            color: '#d8b863'
          }
        }, "You scored ", r.score, " out of ", total), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 20,
            letterSpacing: 3,
            marginTop: 6
          }
        }, '★'.repeat(stars) + '☆'.repeat(5 - stars)), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 12.5,
            color: 'rgba(243,234,212,.8)',
            marginTop: 8,
            lineHeight: 1.5
          }
        }, cheer[2]), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 10,
            marginTop: 18
          }
        }, /*#__PURE__*/React.createElement("div", {
          onClick: () => this.startQuizRun(lvl),
          style: {
            flex: 1,
            padding: '12px 0',
            borderRadius: 12,
            background: '#d8b863',
            color: '#163b30',
            fontSize: 14,
            fontWeight: 800,
            cursor: 'pointer'
          }
        }, "Play Again"), /*#__PURE__*/React.createElement("div", {
          onClick: this.quitQuiz,
          style: {
            flex: 1,
            padding: '12px 0',
            borderRadius: 12,
            border: '1.5px solid rgba(243,234,212,.4)',
            color: '#f3ead4',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer'
          }
        }, "Done")));
      }

      /* live question */
      const qz = r.qs[r.pos];
      const answered = r.pick !== null;
      const urgent = !answered && r.timeLeft <= 3;
      return /*#__PURE__*/React.createElement("div", {
        key: r.pos,
        className: "apo",
        style: {
          background: NEU.surf, boxShadow: neuUp(),
          border: NEU.edge,
          borderRadius: 18,
          padding: '16px 17px',
          marginBottom: 14
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10.5,
          letterSpacing: .8,
          textTransform: 'uppercase',
          fontWeight: 700,
          color: '#6e2230'
        }
      }, "Question ", r.pos + 1, " of ", r.qs.length), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10.5,
          fontWeight: 700,
          color: '#7d6220'
        }
      }, "Score ", r.score), /*#__PURE__*/React.createElement("div", {
        style: {
          width: 34,
          height: 34,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 14,
          fontWeight: 800,
          fontVariantNumeric: 'tabular-nums',
          color: urgent ? '#fffdf9' : '#1f5145',
          background: urgent ? '#c0392b' : '#e6efe9',
          transition: 'background .3s'
        }
      }, answered ? '·' : r.timeLeft)), /*#__PURE__*/React.createElement("div", {
        style: {
          height: 5,
          borderRadius: 3,
          background: NEU.sunk,
          overflow: 'hidden',
          marginBottom: 12
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          height: '100%',
          width: '100%',
          transform: `scaleX(${answered ? 0 : r.timeLeft / 10})`,
          transformOrigin: 'left',
          borderRadius: 3,
          background: urgent ? '#c0392b' : lvlMeta.color,
          transition: 'transform 1s linear, background .3s'
        }
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: 'Spectral,serif',
          fontSize: 16.5,
          fontWeight: 600,
          color: '#2c2823',
          lineHeight: 1.4,
          marginBottom: 12
        }
      }, qz.question), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex',
          flexDirection: 'column',
          gap: 9
        }
      }, (qz.options || []).map((opt, oi) => {
        const picked = r.pick === oi;
        const correct = oi === qz.answer;
        const bg = answered ? correct ? '#e4f3e7' : picked ? '#fbe9e9' : '#faf7f0' : '#faf7f0';
        const bd = answered && correct ? '#7cc38f' : answered && picked ? '#e0a0a0' : 'rgba(203,195,178,.75)';
        const mark = answered ? correct ? '✓' : picked ? '✕' : '' : String.fromCharCode(65 + oi);
        return /*#__PURE__*/React.createElement("div", {
          key: oi,
          onClick: () => this.answerQuizRun(oi),
          style: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 14px',
            borderRadius: 12,
            background: bg,
            border: `1.5px solid ${bd}`,
            fontSize: 14,
            fontWeight: 600,
            color: '#2c2823',
            cursor: answered ? 'default' : 'pointer'
          }
        }, /*#__PURE__*/React.createElement("span", null, opt), /*#__PURE__*/React.createElement("span", {
          style: {
            fontSize: 13,
            fontWeight: 800,
            color: answered ? correct ? '#2e7d43' : '#a33636' : '#6b6252'
          }
        }, mark));
      })), answered && /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 11,
          fontSize: 13,
          fontWeight: 600,
          color: r.pick === qz.answer ? '#1f5145' : '#6e2230'
        }
      }, r.pick === qz.answer ? 'Correct — well done! 🎉' : r.pick === -1 ? "Time's up! The answer is highlighted." : 'Not quite — the correct answer is highlighted.'));
    })()), kt === 'quiz' && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.openStory(STORIES.findIndex(s => s.kind === 'quiz')),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: 'linear-gradient(120deg,#faf4e6,#f6efe0)',
        border: '1px solid #ecdfc2',
        borderRadius: 18,
        padding: 16,
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0,
        width: 46,
        height: 46,
        borderRadius: 13,
        background: '#6e2230',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Amiri,serif',
        fontSize: 24,
        color: '#f3ead4'
      }
    }, "؟"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: '#5e4d22'
      }
    }, "Today's Kids Quiz"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: '#8a7846',
        marginTop: 2
      }
    }, "One quick question — can you get it right?")), /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#75601f',
        fontSize: 20
      }
    }, "→")));
  }

  /* ── HEALTH & WELLNESS ── */
  renderHealth(st) {
    const ht = st.healthTab || 'videos';
    const hHeroV = (st.liveHealthVideos || []).find(v => v.hero && ytId(v.yt));
    const hvCats = ['All', ...new Set((st.liveHealthVideos || []).map(v => v.cat).filter(Boolean))];
    const hvCat = hvCats.includes(st.healthVidCat) ? st.healthVidCat : 'All';
    const healthVids = [...(st.liveHealthVideos || [])].reverse().filter(v => hvCat === 'All' || v.cat === hvCat);
    const tabStyle = k => ({
      flex: 1,
      textAlign: 'center',
      padding: '13px 6px',
      minHeight: 44,
      borderRadius: 11,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      background: ht === k ? NEU.surf : 'transparent',
      color: ht === k ? NEU.accent : NEU.muted,
      boxShadow: ht === k ? neuUp(.5) : 'none',
      transition: 'background .15s'
    });
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 20px 100px'
      },
      className: "afu"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 56px 16px 0'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: st.dark ? '#8e9490' : NEU.muted,
        fontWeight: 500
      }
    }, "Community"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 26,
        fontWeight: 600,
        color: st.dark ? '#ece6d8' : '#27241f',
        marginTop: 2
      }
    }, this.t('more.health'))), st.adminLoggedIn && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({
        screen: 'admin',
        adminSection: 'health'
      }),
      style: {
        fontSize: 12,
        fontWeight: 700,
        color: '#1f5145',
        cursor: 'pointer',
        background: '#e6efe9',
        borderRadius: 10,
        padding: '6px 12px'
      }
    }, "Edit")), hHeroV && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.playYt(hHeroV.yt),
      style: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 20,
        aspectRatio: '16/10',
        background: `linear-gradient(rgba(0,0,0,.22),rgba(0,0,0,.5)),url(https://img.youtube.com/vi/${ytId(hHeroV.yt)}/hqdefault.jpg) center/cover`,
        marginBottom: 18,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'flex-end',
        padding: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 58,
        height: 58,
        borderRadius: '50%',
        background: 'rgba(255,253,249,.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 20px -6px rgba(0,0,0,.4)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 0,
        height: 0,
        borderLeft: '18px solid #1f5145',
        borderTop: '11px solid transparent',
        borderBottom: '11px solid transparent',
        marginLeft: 4
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        color: '#fff'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#d8b863'
      }
    }, hHeroV.cat || ''), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 19,
        fontWeight: 600,
        marginTop: 3
      }
    }, hHeroV.title))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        background: '#efe7d7',
        borderRadius: 14,
        padding: 4,
        marginBottom: 18
      }
    }, [['videos', 'Videos'], ['tips', 'Tips']].map(([k, label]) => /*#__PURE__*/React.createElement("div", {
      key: k,
      onClick: () => this.setState({
        healthTab: k
      }),
      style: tabStyle(k)
    }, label))), ht === 'videos' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 17,
        fontWeight: 600,
        color: st.dark ? '#ece6d8' : '#2c2823',
        marginBottom: 12
      }
    }, "Videos"), hvCats.length > 1 && /*#__PURE__*/React.createElement("div", {
      className: "s",
      style: {
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        margin: '0 -20px 12px',
        padding: '0 20px 2px'
      }
    }, hvCats.map(c => /*#__PURE__*/React.createElement("div", {
      key: c,
      onClick: () => this.setState({
        healthVidCat: c
      }),
      style: {
        flexShrink: 0,
        padding: '12px 15px',
        minHeight: 44,
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        borderRadius: 20,
        fontSize: 12.5,
        fontWeight: 600,
        cursor: 'pointer',
        background: NEU.surf,
        color: hvCat === c ? NEU.accent : NEU.muted,
        border: NEU.edge,
        boxShadow: hvCat === c ? neuIn(.55) : neuUp(.55)
      }
    }, c))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        marginBottom: 24
      }
    }, healthVids.map((v, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => this.playYt(v.yt),
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        background: NEU.surf, boxShadow: neuUp(),
        border: NEU.edge,
        borderRadius: 14,
        padding: 10,
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        flexShrink: 0,
        width: 132,
        aspectRatio: '16/10',
        borderRadius: 10,
        overflow: 'hidden',
        background: ytId(v.yt) ? `url(https://img.youtube.com/vi/${ytId(v.yt)}/hqdefault.jpg) center/cover` : v.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: ytId(v.yt) ? 'rgba(0,0,0,.18)' : 'repeating-linear-gradient(135deg,rgba(255,255,255,.05) 0 10px,transparent 10px 20px)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 34,
        height: 34,
        borderRadius: '50%',
        background: 'rgba(255,253,249,.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 0,
        height: 0,
        borderLeft: '11px solid #1f5145',
        borderTop: '7px solid transparent',
        borderBottom: '7px solid transparent',
        marginLeft: 3
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        fontWeight: 600,
        color: st.dark ? '#ece6d8' : '#2c2823',
        lineHeight: 1.3
      }
    }, v.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: NEU.muted,
        marginTop: 3
      }
    }, v.meta)))))), ht === 'tips' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        marginBottom: 24
      }
    }, (st.liveHealthTips || []).map((tip, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        background: tip.tint || '#e6efe9',
        borderRadius: 18,
        padding: '18px 20px',
        position: 'relative',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: -14,
        top: -14,
        width: 70,
        height: 70,
        borderRadius: '50%',
        background: tip.color,
        opacity: .12
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-block',
        background: tip.color,
        color: '#fff',
        borderRadius: 20,
        padding: '3px 11px',
        fontSize: 11,
        fontWeight: 700,
        marginBottom: 10,
        letterSpacing: .5
      }
    }, tip.tag), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 17,
        fontWeight: 600,
        color: '#27241f',
        marginBottom: 6
      }
    }, tip.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        color: '#5a5041',
        lineHeight: 1.6
      }
    }, tip.body)))));
  }

  /* ── QIBLA FINDER ── */
  renderKhums(st) {
    const kt = st.khumsTab || 'khums';
    const num = v => Math.max(0, parseFloat(v) || 0);
    const fmt = v => '€' + v.toLocaleString('en-IE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    const tabStyle = k => ({
      flex: 1,
      textAlign: 'center',
      padding: '13px 6px',
      minHeight: 44,
      borderRadius: 11,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      background: kt === k ? NEU.surf : 'transparent',
      color: kt === k ? NEU.accent : NEU.muted,
      boxShadow: kt === k ? neuUp(.5) : 'none',
      transition: 'background .15s'
    });
    const field = (calcKey, key, label, hint) => /*#__PURE__*/React.createElement("div", {
      key: key,
      style: {
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        color: '#5d564a',
        marginBottom: 3
      }
    }, label), hint && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: NEU.muted,
        marginBottom: 4,
        lineHeight: 1.35
      }
    }, hint), /*#__PURE__*/React.createElement("input", {
      type: "number",
      inputMode: "decimal",
      min: "0",
      placeholder: "0.00",
      value: st[calcKey][key],
      onChange: e => this.setState({
        [calcKey]: {
          ...st[calcKey],
          [key]: e.target.value
        }
      }),
      style: {
        width: '100%',
        padding: '10px 12px',
        borderRadius: 10,
        border: NEU.edge,
        background: NEU.sunk, boxShadow: neuIn(.7),
        fontSize: 14,
        outline: 'none',
        fontVariantNumeric: 'tabular-nums'
      }
    }));
    const resultRow = (label, value, strong) => /*#__PURE__*/React.createElement("div", {
      key: label,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '7px 0',
        borderBottom: strong ? 'none' : '1px solid rgba(255,255,255,.12)'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: strong ? 14.5 : 12.5,
        fontWeight: strong ? 700 : 500,
        color: strong ? '#f3ead4' : '#cdbf9e'
      }
    }, label), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: strong ? 18 : 13.5,
        fontWeight: strong ? 700 : 600,
        color: strong ? '#e8d39a' : '#f3ead4',
        fontVariantNumeric: 'tabular-nums'
      }
    }, value));
    const sectionLabel = txt => /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#6b6252',
        margin: '18px 0 10px'
      }
    }, txt);
    /* ── Khums: 20% of surplus at year end; half Sahm al-Imam, half Sahm al-Sadat ── */
    const kc = st.khumsCalc;
    const kAssets = num(kc.cash) + num(kc.goods) + num(kc.receivables) + num(kc.other);
    const kDebts = num(kc.debts);
    const kSurplus = Math.max(0, kAssets - kDebts);
    const kDue = Math.max(0, kSurplus * 0.2 - num(kc.paid));
    /* ── Zakat: 2.5% of net zakatable wealth if at or above nisab ── */
    const zc = st.zakatCalc;
    const zAssets = num(zc.cash) + num(zc.gold) + num(zc.silver) + num(zc.business) + num(zc.receivables) + num(zc.investments);
    const zNet = Math.max(0, zAssets - num(zc.debts));
    const zNisab = num(zc.nisab);
    const zAbove = zNet >= zNisab && zNet > 0;
    const zDue = zAbove ? zNet * 0.025 : 0;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 20px 100px'
      },
      className: "afu"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 56px 16px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: NEU.muted,
        fontWeight: 500
      }
    }, "Obligations"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 26,
        fontWeight: 600,
        color: '#27241f',
        marginTop: 2
      }
    }, "Khums & Zakat")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        background: '#efe7d7',
        borderRadius: 14,
        padding: 4,
        marginBottom: 16
      }
    }, [['khums', 'Khums'], ['zakat', 'Zakat']].map(([k, label]) => /*#__PURE__*/React.createElement("div", {
      key: k,
      onClick: () => this.setState({
        khumsTab: k
      }),
      style: tabStyle(k)
    }, label))), kt === 'khums' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        background: NEU.surf, boxShadow: neuUp(),
        border: NEU.edge,
        borderRadius: 16,
        padding: '13px 15px',
        fontSize: 12.5,
        color: '#6b6252',
        lineHeight: 1.55,
        marginBottom: 4
      }
    }, "Khums is an annual obligation of one-fifth (20%) of the surplus income remaining after your yearly living expenses, calculated on your khums due date. Half is Sahm al-Imām (paid to your marjaʿ or his representative) and half is Sahm al-Sādāt (given to needy Sayyids)."), sectionLabel('What you own on your khums date'), field('khumsCalc', 'cash', 'Cash in hand & bank accounts'), field('khumsCalc', 'goods', 'Unused items & provisions', 'Value of goods bought this year but not used — food stock, unworn clothes, unused household items.'), field('khumsCalc', 'receivables', 'Money owed to you', 'Loans you gave and payments due that you expect to receive.'), field('khumsCalc', 'other', 'Other surplus assets', 'Investments, savings certificates or business profits acquired from surplus income.'), sectionLabel('Deductions'), field('khumsCalc', 'debts', 'Outstanding debts & unpaid bills', 'Debts taken for this year’s living expenses and bills currently due.'), field('khumsCalc', 'paid', 'Khums already paid in advance this year'), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'linear-gradient(155deg,#1f5145 0%,#163b30 100%)',
        borderRadius: 18,
        padding: '16px 18px',
        marginTop: 16,
        boxShadow: '0 14px 28px -16px rgba(22,59,48,.7)'
      }
    }, resultRow('Total assets', fmt(kAssets)), resultRow('Deductions', '− ' + fmt(kDebts)), resultRow('Net surplus', fmt(kSurplus)), resultRow('Khums due (20%)', fmt(kDue), true), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        marginTop: 10
      }
    }, [['Sahm al-Imām (½)', kDue / 2], ['Sahm al-Sādāt (½)', kDue / 2]].map(([l, v]) => /*#__PURE__*/React.createElement("div", {
      key: l,
      style: {
        flex: 1,
        background: 'rgba(255,255,255,.08)',
        borderRadius: 12,
        padding: '9px 11px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        color: '#6b6252',
        marginBottom: 3
      }
    }, l), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 700,
        color: '#f3ead4',
        fontVariantNumeric: 'tabular-nums'
      }
    }, fmt(v))))))), kt === 'zakat' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        background: NEU.surf, boxShadow: neuUp(),
        border: NEU.edge,
        borderRadius: 16,
        padding: '13px 15px',
        fontSize: 12.5,
        color: '#6b6252',
        lineHeight: 1.55,
        marginBottom: 4
      }
    }, "Zakat is 2.5% of your net zakatable wealth, due when it has remained at or above the nisab threshold for one lunar year. The nisab is the value of 87.48g of gold or 612.36g of silver — check current market prices."), sectionLabel('Zakatable assets'), field('zakatCalc', 'cash', 'Cash in hand & bank accounts'), field('zakatCalc', 'gold', 'Value of gold'), field('zakatCalc', 'silver', 'Value of silver'), field('zakatCalc', 'business', 'Business inventory & merchandise'), field('zakatCalc', 'receivables', 'Money owed to you'), field('zakatCalc', 'investments', 'Shares & investments'), sectionLabel('Deductions & threshold'), field('zakatCalc', 'debts', 'Debts & liabilities due'), field('zakatCalc', 'nisab', 'Nisab threshold', 'Default €600 ≈ value of 612.36g silver. Update with today’s silver or gold price.'), /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'linear-gradient(155deg,#1f5145 0%,#163b30 100%)',
        borderRadius: 18,
        padding: '16px 18px',
        marginTop: 16,
        boxShadow: '0 14px 28px -16px rgba(22,59,48,.7)'
      }
    }, resultRow('Zakatable wealth', fmt(zAssets)), resultRow('Liabilities', '− ' + fmt(num(zc.debts))), resultRow('Net wealth', fmt(zNet)), resultRow('Zakat due (2.5%)', fmt(zDue), true), !zAbove && zNet > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        fontSize: 11.5,
        color: '#6b6252',
        lineHeight: 1.4
      }
    }, "Your net wealth is below the nisab threshold — no Zakat is due."))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16,
        fontSize: 11,
        color: NEU.muted,
        lineHeight: 1.5,
        textAlign: 'center'
      }
    }, "These figures are a guide only. Rulings differ between marājiʿ — please confirm your calculation with your marjaʿ or a local scholar."));
  }
  renderQibla(st) {
    const {
      qiblaStatus,
      qiblaBearing,
      qiblaLat,
      qiblaLng
    } = st;
    const bearing = qiblaBearing !== null ? Math.round(qiblaBearing) : null;
    const cardinals = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const cardinal = bearing !== null ? cardinals[Math.round(bearing / 22.5) % 16] : null;
    const distKm = qiblaLat !== null && qiblaLng !== null ? (() => {
      const R = 6371;
      const toRad = d => d * Math.PI / 180;
      const dLat = toRad(21.4225 - qiblaLat);
      const dLng = toRad(39.8262 - qiblaLng);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(qiblaLat)) * Math.cos(toRad(21.4225)) * Math.sin(dLng / 2) ** 2;
      return Math.round(2 * R * Math.asin(Math.sqrt(a)));
    })() : null;
    const Compass = ({
      deg
    }) => /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 268,
        height: 268,
        borderRadius: '50%',
        background: NEU.surf,
        border: NEU.edge,
        boxShadow: neuUp(1.5)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 14,
        borderRadius: '50%',
        border: '1px dashed rgba(203,195,178,.85)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 13,
        fontWeight: 700,
        color: '#6e2230'
      }
    }, "N"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 10,
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: 13,
        fontWeight: 700,
        color: NEU.muted
      }
    }, "S"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 12,
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: 13,
        fontWeight: 700,
        color: NEU.muted
      }
    }, "E"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 12,
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: 13,
        fontWeight: 700,
        color: NEU.muted
      }
    }, "W"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        transform: `rotate(${deg}deg)`,
        transition: 'transform .6s cubic-bezier(.2,.8,.2,1)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 22,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 0,
        height: 0,
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        borderBottom: '24px solid #1f5145'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 3,
        height: 80,
        background: 'linear-gradient(#1f5145,#cdbf9e)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 26,
        left: '50%',
        transform: 'translateX(-50%) translateY(-28px)',
        width: 28,
        height: 28,
        borderRadius: 7,
        background: '#1c1a17',
        border: '2px solid #d8b863',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 13,
        height: 8,
        border: '1.4px solid #d8b863',
        borderRadius: 1
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: '#1f5145',
        boxShadow: `0 0 0 4px ${NEU.surf},0 0 0 5px rgba(203,195,178,.7)`
      }
    }));
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 20px 100px'
      },
      className: "afu"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 56px 14px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: NEU.muted,
        fontWeight: 500
      }
    }, this.t('more.qiblaSub')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 26,
        fontWeight: 600,
        color: '#27241f',
        marginTop: 2
      }
    }, this.t('qibla.title'))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'center',
        margin: '8px 0 6px'
      }
    }, /*#__PURE__*/React.createElement(Compass, {
      deg: bearing !== null ? bearing : 0
    })), bearing !== null ? /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        marginTop: 14,
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 38,
        fontWeight: 600,
        color: '#1f5145',
        lineHeight: 1
      }
    }, bearing, "° ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 20,
        color: '#7d6220'
      }
    }, cardinal)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: NEU.muted,
        marginTop: 5
      }
    }, "Bearing from true North")) : /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        marginTop: 14,
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 22,
        color: NEU.muted
      }
    }, "—°"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: '#6b6252',
        marginTop: 4
      }
    }, "Location needed to calculate bearing")), qiblaStatus === 'idle' && /*#__PURE__*/React.createElement("div", {
      onClick: this.locateQibla,
      style: {
        textAlign: 'center',
        padding: '14px',
        borderRadius: 16,
        background: '#1f5145',
        color: '#f3ead4',
        fontSize: 15,
        fontWeight: 700,
        cursor: 'pointer',
        marginBottom: 16,
        boxShadow: '0 8px 18px -8px rgba(22,59,48,.5)'
      }
    }, this.t('qibla.allow')), qiblaStatus === 'loading' && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        padding: '14px',
        borderRadius: 16,
        background: '#f0e8d6',
        color: '#7d6220',
        fontSize: 14,
        fontWeight: 600,
        marginBottom: 16
      }
    }, this.t('qibla.detecting')), qiblaStatus === 'denied' && /*#__PURE__*/React.createElement("div", {
      style: {
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        padding: '12px',
        borderRadius: 14,
        background: '#fdf0f2',
        border: '1px solid #dfc4ca',
        color: '#6e2230',
        fontSize: 13,
        fontWeight: 600,
        marginBottom: 8
      }
    }, this.t('qibla.error')), /*#__PURE__*/React.createElement("div", {
      onClick: this.locateQibla,
      style: {
        textAlign: 'center',
        padding: '11px',
        borderRadius: 14,
        background: '#eef7f4',
        border: '1px solid #c4ddd7',
        color: '#1f5145',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer'
      }
    }, this.t('qibla.allow'))), qiblaStatus === 'unsupported' && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        padding: '12px',
        borderRadius: 14,
        background: '#f4ede0',
        color: '#7d6220',
        fontSize: 13,
        marginBottom: 16
      }
    }, this.t('qibla.unsupported')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 11,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        background: NEU.surf, boxShadow: neuUp(),
        border: NEU.edge,
        borderRadius: 16,
        padding: 15,
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: .6,
        textTransform: 'uppercase',
        color: '#6b6252',
        fontWeight: 700
      }
    }, this.t('qibla.distance')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 18,
        fontWeight: 700,
        color: '#2c2823',
        marginTop: 5
      }
    }, distKm !== null ? `≈ ${distKm.toLocaleString()} km` : '—')), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        background: NEU.surf, boxShadow: neuUp(),
        border: NEU.edge,
        borderRadius: 16,
        padding: 15,
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: .6,
        textTransform: 'uppercase',
        color: '#6b6252',
        fontWeight: 700
      }
    }, "Holy site"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 18,
        fontWeight: 700,
        color: '#2c2823',
        marginTop: 5
      }
    }, "Kaʿba"))), bearing !== null && /*#__PURE__*/React.createElement("div", {
      onClick: this.locateQibla,
      style: {
        textAlign: 'center',
        padding: '10px',
        borderRadius: 13,
        background: '#eef7f4',
        border: '1px solid #c4ddd7',
        color: '#1f5145',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        marginBottom: 14
      }
    }, this.t('qibla.allow')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 11,
        alignItems: 'flex-start',
        background: 'linear-gradient(120deg,#faf4e6,#f6efe0)',
        border: '1px solid #ecdfc2',
        borderRadius: 16,
        padding: '14px 15px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0,
        width: 30,
        height: 30,
        borderRadius: 9,
        background: '#e8d39a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#7a5d18',
        fontWeight: 700
      }
    }, "i"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: '#8a7846',
        lineHeight: 1.5
      }
    }, "The bearing is calculated from your GPS coordinates to the Kaʿba in Makkah using the great-circle formula.")));
  }

  /* ── STORY VIEWER ── */
  renderStoryViewer(st) {
    // preview: admin draft shown standalone, no timer/navigation, closes back to the editor
    const preview = st.storyPreview || null;
    const stories = preview ? [preview] : activeStories(st.liveStories);
    const idx = preview ? 0 : st.story;
    if (!stories[idx]) {
      // index out of range (list shrank / empty) — close instead of a blank page
      setTimeout(this.closeStory, 0);
      return null;
    }
    const cur = stories[idx] || {};
    const closePreview = () => this.setState({
      storyPreview: null,
      quizPick: null
    });
    const bars = stories.map((_, i) => ({
      fill: preview ? 100 : i < st.story ? 100 : i === st.story ? st.storyProg : 0
    }));
    const isQuiz = cur.kind === 'quiz';
    const quizAnswered = st.quizPick !== null;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: cur.color || '#1f5145',
        display: 'flex',
        flexDirection: 'column'
      },
      className: "apo"
    }, cur.photo && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        backgroundImage: `url(${cur.photo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: cur.photo ? 'linear-gradient(180deg,rgba(0,0,0,.5) 0%,rgba(0,0,0,.22) 42%,rgba(0,0,0,.68) 100%)' : 'radial-gradient(120% 90% at 50% 0%,rgba(255,255,255,.1),rgba(0,0,0,.35))'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: -50,
        bottom: -30,
        width: 220,
        height: 220,
        borderRadius: '50%',
        border: '1px solid rgba(255,255,255,.1)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        gap: 5,
        padding: '54px 16px 0'
      }
    }, bars.map((b, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flex: 1,
        height: 3,
        borderRadius: 3,
        background: 'rgba(255,255,255,.3)',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: '100%',
        width: '100%',
        transform: `scaleX(${b.fill / 100})`,
        transformOrigin: 'left',
        background: '#fff',
        borderRadius: 3,
        transition: b.fill > 0 && b.fill < 100 ? 'transform .06s linear' : 'none'
      }
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        zIndex: 5,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 18px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 34,
        height: 34,
        borderRadius: '50%',
        background: 'rgba(255,255,255,.18) url(/icon-192.png) center/cover',
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        fontWeight: 600,
        color: '#fff'
      }
    }, "Ahlul Bayt Ireland"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: 'rgba(255,255,255,.7)'
      }
    }, cur.tag))), preview && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 1.2,
        color: '#fff',
        background: 'rgba(0,0,0,.35)',
        border: '1px solid rgba(255,255,255,.4)',
        borderRadius: 20,
        padding: '4px 10px'
      }
    }, "PREVIEW"), /*#__PURE__*/React.createElement("div", {
      onClick: preview ? closePreview : this.closeStory,
      style: {
        width: 34,
        height: 34,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        color: '#fff',
        fontSize: 24,
        lineHeight: 1
      }
    }, "×")), /*#__PURE__*/React.createElement("div", {
      onClick: preview ? closePreview : this.prevStory,
      style: {
        position: 'absolute',
        left: 0,
        top: 90,
        bottom: 0,
        width: '35%',
        zIndex: 3
      }
    }), /*#__PURE__*/React.createElement("div", {
      onClick: preview ? closePreview : this.nextStory,
      style: {
        position: 'absolute',
        right: 0,
        top: 90,
        bottom: 0,
        width: '65%',
        zIndex: isQuiz ? 0 : 3
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        zIndex: 4,
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '0 26px 40px',
        pointerEvents: 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,.7)',
        fontWeight: 700,
        marginBottom: 8
      }
    }, cur.tag), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 29,
        fontWeight: 600,
        color: '#fff',
        lineHeight: 1.2
      }
    }, cur.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        color: 'rgba(255,255,255,.82)',
        marginTop: 4,
        fontWeight: 500
      }
    }, cur.sub), cur.ar && /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Amiri,serif',
        fontSize: 30,
        color: '#fff',
        marginTop: 18,
        lineHeight: 1.9,
        textAlign: 'right'
      },
      dir: "rtl"
    }, cur.ar), cur.body && !isQuiz && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15.5,
        color: 'rgba(255,255,255,.94)',
        marginTop: 14,
        lineHeight: 1.6
      }
    }, cur.body), isQuiz && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 18,
        pointerEvents: 'auto'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 18,
        fontWeight: 600,
        color: '#fff',
        lineHeight: 1.4,
        marginBottom: 16
      }
    }, cur.question), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, (cur.options || []).map((opt, i) => {
      const picked = st.quizPick === i;
      const correct = i === cur.answer;
      const answered = quizAnswered;
      const bg = answered ? correct ? 'rgba(120,220,150,.22)' : picked ? 'rgba(255,120,120,.22)' : 'rgba(255,255,255,.1)' : 'rgba(255,255,255,.12)';
      const bd = answered && correct ? '#9ee7b0' : answered && picked ? '#ff9a9a' : 'rgba(255,255,255,.3)';
      const mark = answered ? correct ? '✓' : picked ? '✕' : '' : '';
      return /*#__PURE__*/React.createElement("div", {
        key: i,
        onClick: () => this.answerQuiz(i),
        style: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 16px',
          borderRadius: 14,
          background: bg,
          border: `1.5px solid ${bd}`,
          color: '#fff',
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement("span", null, opt), /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 16
        }
      }, mark));
    })), quizAnswered && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 14,
        fontSize: 13.5,
        color: 'rgba(255,255,255,.9)',
        fontWeight: 500
      }
    }, st.quizPick === cur.answer ? 'Correct — well done!' : 'Not quite. The answer is highlighted.')), cur.link && /*#__PURE__*/React.createElement("div", {
      onClick: e => {
        e.stopPropagation();
        if (preview) {
          // don't navigate away from the admin editor
          closePreview();
          return;
        }
        this.closeStory();
        if (cur.kind === 'kids') this.go('kids');else if (cur.kind === 'classified') this.go('classifieds');else if (cur.kind === 'announce') this.go('calendar');else if (cur.kind === 'sermon') this.setState({
          screen: 'library',
          libTab: 'nahj',
          story: null
        });else this.go('library');
      },
      style: {
        pointerEvents: 'auto',
        display: 'inline-flex',
        alignSelf: 'flex-start',
        alignItems: 'center',
        gap: 8,
        marginTop: 22,
        padding: '12px 20px',
        borderRadius: 13,
        background: '#fff',
        color: '#27241f',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer'
      }
    }, cur.link, " ", /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16
      }
    }, "→"))));
  }

  /* ── STORIES SCREEN ── */
  renderStories(st) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 20px 100px'
      },
      className: "afu"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 56px 16px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: st.dark ? '#8e9490' : NEU.muted,
        fontWeight: 500
      }
    }, "Community"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 26,
        fontWeight: 600,
        color: st.dark ? '#ece6d8' : '#27241f',
        marginTop: 2
      }
    }, this.t('nav.updates'))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, activeStories(st.liveStories).map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => this.openStory(i, true),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: s.photo ? `linear-gradient(rgba(0,0,0,.42),rgba(0,0,0,.42)),url(${s.photo}) center/cover` : s.img,
        borderRadius: 18,
        padding: '14px 16px',
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        letterSpacing: .9,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: 'rgba(255,255,255,.7)'
      }
    }, s.tag), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: '#fff',
        marginTop: 2
      }
    }, s.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: 'rgba(255,255,255,.75)',
        marginTop: 2,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, s.sub || (s.body ? s.body.slice(0, 55) + '…' : ''))), /*#__PURE__*/React.createElement("span", {
      style: {
        color: 'rgba(255,255,255,.5)',
        fontSize: 22,
        flexShrink: 0
      }
    }, "›")))));
  }

  /* ── HOME TILES ──
     A full-width row that names one thing to do next, in that section's own
     colour: recessed pebble on the left, label and detail in the middle, a
     chevron on the right. The home page leads with these so a first visit has
     somewhere obvious to start instead of a wall of equal choices. */
  renderHomeTile(o) {
    const [ink, tint] = o.tone;
    return /*#__PURE__*/React.createElement("div", {
      onClick: o.onClick,
      className: "neu-press",
      style: {
        ...neuCard(16, .85),
        display: 'flex',
        alignItems: 'center',
        gap: 13,
        padding: '13px 15px',
        marginBottom: 10,
        cursor: 'pointer',
        minHeight: 44
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        width: 46,
        height: 46,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: tint,
        background: `linear-gradient(145deg, ${ink}e6, ${ink})`,
        boxShadow: `inset 0 1px 0 rgba(255,255,255,.3), 0 5px 12px -6px ${ink}, 0 1px 2px rgba(0,0,0,.14)`
      },
      "aria-hidden": "true"
    }, LUCIDE[o.icon] ? icon(o.icon, {
      size: 23,
      sw: 1.8
    }) : o.icon), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        letterSpacing: .9,
        textTransform: 'uppercase',
        fontWeight: 800,
        color: ink
      }
    }, o.kicker), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 15.5,
        fontWeight: 600,
        color: NEU.ink,
        marginTop: 2,
        lineHeight: 1.25,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, o.title), o.sub && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: NEU.muted,
        marginTop: 2,
        lineHeight: 1.35,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, o.sub)), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        flexShrink: 0,
        fontSize: 20,
        color: ink,
        opacity: .7
      }
    }, "›"));
  }

  /* ── HAPPENING NOW ──
     Beside a live majlis sits whatever else is on today. With no majlis running
     the pair collapses to one Reminders tile carrying today's reminders, so the
     slot always says something rather than disappearing. */
  renderHappeningNow(st, todayRems) {
    const majlis = announcementActive(st.liveAnnouncement);
    const openCal = () => this.setState({
      screen: 'calendar',
      calViewY: null,
      calViewM: undefined,
      calDay: null
    });
    if (!majlis) {
      const first = todayRems[0];
      return this.renderHomeTile({
        icon: 'bell',
        kicker: todayRems.length > 1 ? `Reminders · ${todayRems.length}` : 'Reminders',
        title: first ? first.title : 'No reminders today',
        sub: first ? todayRems.length > 1
          ? todayRems.slice(1).map(r => r.title).join(' · ')
          : first.desc || first.type || 'Tap for the calendar'
          : 'Anything scheduled will appear here',
        tone: ['#a03a3a', '#f7e8e6'],
        onClick: openCal
      });
    }
    const rem = todayRems[0];
    return /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 10,
        marginBottom: 12
      }
    }, this.renderMajlisCard(st, true), /*#__PURE__*/React.createElement("div", {
      onClick: openCal,
      className: "neu-press",
      style: {
        ...neuCard(16, .85),
        padding: '12px 13px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        gap: 4,
        minHeight: 44
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        letterSpacing: .9,
        textTransform: 'uppercase',
        fontWeight: 800,
        color: '#7d6220'
      }
    }, rem ? todayRems.length > 1 ? `Reminders · ${todayRems.length}` : 'Reminder' : 'Reminders'), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 14.5,
        fontWeight: 600,
        color: NEU.ink,
        lineHeight: 1.3
      }
    }, rem ? rem.title : 'No reminders today'), rem && rem.type && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: NEU.muted,
        marginTop: 1
      }
    }, rem.type)));
  }

  /* ── MAJLIS LIVE ──
     One card, four voices. It reads the clock rather than a stored flag, so the
     same saved majlis counts down, goes live, and settles into a recording on
     its own; st.now ticks every second, which is what moves it along. */
  renderMajlisCard(st, compact) {
    const a = st.liveAnnouncement || {};
    const s = majlisStatus(a, st.now);
    const live = s.kind === 'live';
    const ahead = s.kind === 'soon' || s.kind === 'today' || s.kind === 'upcoming';
    const tone = live ? {
      bg: 'linear-gradient(135deg,#7d2432 0%,#48111b 100%)',
      shadow: neuUpOn('92,24,34', .95),
      ink: '#f9ece7',
      sub: 'rgba(249,236,231,.74)',
      chip: '#ff7566',
      kicker: 'Live now'
    } : ahead ? {
      bg: 'linear-gradient(135deg,#24604f 0%,#193f34 100%)',
      shadow: neuUpOn('25,63,52', .9),
      ink: '#f3ead4',
      sub: 'rgba(243,234,212,.72)',
      chip: '#d8b863',
      kicker: s.label || 'Upcoming'
    } : {
      ...neuCard(16, .85),
      ink: NEU.ink,
      sub: NEU.muted,
      chip: '#8a4b2c',
      kicker: s.kind === 'ended' ? 'Recording' : 'Majlis Live'
    };
    const playable = !!a.yt;
    const dateLine = [
      a.date ? new Date(a.date + 'T12:00').toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'long' }) : null,
      a.time || null
    ].filter(Boolean).join(' · ');
    return /*#__PURE__*/React.createElement("div", {
      onClick: playable ? () => this.playYt(a.yt) : undefined,
      style: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 16,
        padding: compact ? '12px 13px' : '12px 14px',
        marginBottom: compact ? 0 : 12,
        cursor: playable ? 'pointer' : 'default',
        ...(live || ahead ? {
          background: tone.bg,
          border: '1px solid rgba(255,255,255,.08)',
          boxShadow: tone.shadow
        } : tone)
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 7,
        fontSize: 10,
        letterSpacing: 1.1,
        textTransform: 'uppercase',
        fontWeight: 800,
        color: tone.chip
      }
    }, /*#__PURE__*/React.createElement("span", {
      className: live ? "live-dot" : undefined,
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: tone.chip,
        flexShrink: 0
      }
    }), tone.kicker), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        marginTop: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: compact ? 14.5 : 15.5,
        fontWeight: 600,
        color: tone.ink,
        lineHeight: 1.3
      }
    }, a.title), !compact && a.body && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: tone.sub,
        marginTop: 3,
        lineHeight: 1.4
      }
    }, a.body), dateLine && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        color: tone.sub,
        marginTop: 4,
        fontWeight: 600
      }
    }, dateLine)), playable && /*#__PURE__*/React.createElement("div", {
      className: live ? "live-ring" : undefined,
      "aria-label": "Watch",
      style: {
        flexShrink: 0,
        width: compact ? 34 : 42,
        height: compact ? 34 : 42,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: live || ahead ? 'rgba(255,255,255,.14)' : NEU.surf,
        boxShadow: live || ahead ? 'inset 0 0 0 1px rgba(255,255,255,.22)' : neuUp(.55),
        color: live || ahead ? tone.ink : tone.chip
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 0,
        height: 0,
        borderLeft: `${compact ? 10 : 13}px solid ${live || ahead ? tone.ink : tone.chip}`,
        borderTop: `${compact ? 6 : 8}px solid transparent`,
        borderBottom: `${compact ? 6 : 8}px solid transparent`,
        marginLeft: 4
      }
    }))));
  }

  /* ── TASBEEH COUNTER ── */
  renderTasbeeh(st) {
    const free = st.tasbeehMode === 'free';
    const stage = (st.tasbeehStage || 0) % ZEHRA.length;
    const d = free ? FREE_DHIKR : ZEHRA[stage];
    const count = free ? st.tasbeehFree || 0 : st.tasbeehCount || 0;
    const rounds = st.tasbeehRounds || 0;
    const target = free ? 100 : d.target;
    // free counting has no end, so the ring simply fills once per hundred
    const pct = free ? count % 100 / 100 : Math.min(1, count / target);
    const canMinus = free ? count > 0 : count > 0 || stage > 0 || rounds > 0;
    const R = 86,
      C = 2 * Math.PI * R;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '8px 20px 100px'
      },
      className: "afu"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 56px 14px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: NEU.muted,
        fontWeight: 500
      }
    }, "Dhikr"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 26,
        fontWeight: 600,
        color: '#27241f',
        marginTop: 2
      }
    }, "Tasbeeh Counter")),
    /*#__PURE__*/React.createElement("div", {
      className: "s",
      style: {
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        margin: '0 -20px 16px',
        padding: '0 20px 2px'
      }
    }, [['zehra', 'Tasbeeh Zehra(s)'], ['free', 'Unlimited Count']].map(([m, label]) => {
      const on = (st.tasbeehMode === 'free' ? 'free' : 'zehra') === m;
      return /*#__PURE__*/React.createElement("div", {
        key: m,
        onClick: () => this.setTasbeehMode(m),
        style: {
          flex: 1,
          textAlign: 'center',
          padding: '13px 14px',
          borderRadius: 20,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          background: NEU.surf,
          color: on ? NEU.accent : NEU.muted,
          border: NEU.edge,
          boxShadow: on ? neuIn(.55) : neuUp(.55),
          transition: 'box-shadow .18s ease, color .18s ease'
        }
      }, label);
    })),
    /*#__PURE__*/React.createElement("div", {
      onClick: this.tasbeehTap,
      className: "neu-tap",
      role: "button",
      "aria-label": free ? `Count freely. Currently ${count}` : `Count ${d.tr}. Currently ${count} of ${target}`,
      style: {
        flex: 1,
        minHeight: 340,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        ...neuCard(26, 1.7),
        padding: '26px 18px',
        cursor: 'pointer',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: "'Noto Naskh Arabic','Amiri',serif",
        fontSize: 26,
        color: '#1f5145',
        textAlign: 'center',
        lineHeight: 1.7
      },
      dir: "rtl"
    }, d.ar), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: 200,
        height: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "200",
      height: "200",
      viewBox: "0 0 200 200",
      style: {
        position: 'absolute',
        inset: 0,
        transform: 'rotate(-90deg)'
      }
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "100",
      cy: "100",
      r: R,
      fill: "none",
      stroke: "#ece4d4",
      strokeWidth: "10"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "100",
      cy: "100",
      r: R,
      fill: "none",
      stroke: "#1f5145",
      strokeWidth: "10",
      strokeLinecap: "round",
      strokeDasharray: C,
      strokeDashoffset: C * (1 - pct),
      style: {
        transition: 'stroke-dashoffset .25s cubic-bezier(.2,.9,.2,1)'
      }
    })), /*#__PURE__*/React.createElement("div", {
      key: count,
      className: "apo",
      style: {
        fontSize: 62,
        fontWeight: 700,
        color: '#27241f',
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1
      }
    }, count), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        bottom: 34,
        fontSize: 12,
        color: NEU.muted,
        fontWeight: 600
      }
    }, free ? 'no limit' : `of ${target}`)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: '#8c8270',
        textAlign: 'center',
        lineHeight: 1.5
      }
    }, d.tr, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: '#6b6252',
        marginTop: 2
      }
    }, d.en)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: '#6b6252',
        fontWeight: 600
      }
    }, "Tap anywhere in this card to count")),
    /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
        marginTop: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        fontSize: 12.5,
        color: '#6b6252',
        fontWeight: 600
      }
    }, free ? 'Hundreds completed: ' : 'Rounds completed: ', /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#1f5145',
        fontWeight: 700
      }
    }, free ? Math.floor(count / 100) : rounds)), /*#__PURE__*/React.createElement("div", {
      onClick: () => canMinus && this.tasbeehMinus(),
      style: {
        flexShrink: 0,
        padding: '13px 16px',
        borderRadius: 12,
        border: NEU.edge,
        background: NEU.surf,
        boxShadow: neuUp(),
        color: NEU.ink,
        fontSize: 13,
        fontWeight: 600,
        cursor: canMinus ? 'pointer' : 'default',
        opacity: canMinus ? 1 : .45
      }
    }, "− 1"), /*#__PURE__*/React.createElement("div", {
      onClick: this.tasbeehReset,
      style: {
        flexShrink: 0,
        padding: '13px 16px',
        borderRadius: 12,
        border: NEU.edge,
        background: NEU.surf, boxShadow: neuUp(),
        color: '#6e2230',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer'
      }
    }, "Reset")));
  }

  /* ── ISLAMIC WALLPAPERS ── */
  renderWallpaper(st) {
    const list = wallpapersFor(st.now);
    const open = st.wallOpen != null ? list[st.wallOpen] : null;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 20px 100px'
      },
      className: "afu"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 56px 14px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: NEU.muted,
        fontWeight: 500
      }
    }, "Gallery"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 26,
        fontWeight: 600,
        color: '#27241f',
        marginTop: 2
      }
    }, "Islamic Wallpapers")),
    /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 12
      }
    }, list.map((w, i) => /*#__PURE__*/React.createElement("div", {
      key: w.id,
      onClick: () => this.setState({
        wallOpen: i
      }),
      style: {
        position: 'relative',
        aspectRatio: '3 / 4',
        borderRadius: 16,
        overflow: 'hidden',
        background: NEU.sunk,
        border: NEU.edge,
        boxShadow: neuUp(.85),
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: wallUrl(w, 600),
      alt: `Islamic wallpaper by ${w.by}`,
      loading: i < 4 ? 'eager' : 'lazy',
      style: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        display: 'block'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: '18px 10px 8px',
        background: 'linear-gradient(transparent,rgba(20,18,14,.72))',
        color: 'rgba(255,253,249,.92)',
        fontSize: 10.5,
        fontWeight: 600,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, w.by)))),
    open && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({
        wallOpen: null
      }),
      style: {
        position: 'fixed',
        inset: 0,
        zIndex: 90,
        background: 'rgba(18,16,13,.94)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 18,
        animation: 'po .25s ease both'
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: wallUrl(open, 1200),
      alt: `Islamic wallpaper by ${open.by}`,
      onClick: e => e.stopPropagation(),
      style: {
        maxWidth: '100%',
        maxHeight: '70vh',
        borderRadius: 18,
        objectFit: 'contain',
        boxShadow: '0 24px 60px -20px rgba(0,0,0,.8)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      onClick: e => e.stopPropagation(),
      style: {
        marginTop: 16,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        width: '100%',
        maxWidth: 360
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => this.saveWallpaper(open),
      style: {
        flex: 1,
        textAlign: 'center',
        padding: '13px 0',
        borderRadius: 13,
        background: '#d8b863',
        color: '#163b30',
        fontSize: 14.5,
        fontWeight: 700,
        cursor: 'pointer'
      }
    }, st.wallSaving ? 'Saving…' : 'Download'), /*#__PURE__*/React.createElement("a", {
      href: wallPage(open),
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        padding: '13px 16px',
        borderRadius: 13,
        border: '1px solid rgba(243,234,212,.35)',
        color: '#f3ead4',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        textDecoration: 'none'
      }
    }, "Unsplash ↗")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 12,
        fontSize: 12,
        color: 'rgba(243,234,212,.6)'
      }
    }, "Photo by ", open.by), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({
        wallOpen: null
      }),
      style: {
        position: 'absolute',
        top: 16,
        right: 18,
        width: 36,
        height: 36,
        borderRadius: '50%',
        background: 'rgba(255,253,249,.14)',
        color: '#f3ead4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 20,
        cursor: 'pointer'
      }
    }, "×")));
  }

  /* ── BOTTOM NAV ── */
  renderNav(st) {
    const items = [{
      key: 'home',
      label: this.t('nav.home'),
      d: NAV_ICONS.home
    }, {
      key: 'kids',
      label: this.t('nav.madrasa'),
      d: NAV_ICONS.madrasa
    }, {
      key: 'library',
      label: this.t('nav.library'),
      d: NAV_ICONS.library
    }, {
      key: 'stories',
      label: this.t('nav.updates'),
      d: NAV_ICONS.stories
    }, {
      key: 'more',
      label: this.t('nav.more'),
      d: NAV_ICONS.more
    }];
    return /*#__PURE__*/React.createElement("nav", {
      className: "abi-nav",
      "aria-label": "Primary",
      style: {
        flexShrink: 0,
        background: st.dark ? NEU_D.bg : NEU.bg,
        boxShadow: `0 -7px 16px ${st.dark ? NEU_D.lo : NEU.lo}, 0 -1px 0 ${st.dark ? NEU_D.hi : NEU.hi}`,
        padding: '6px 14px 6px',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 10
      }
    }, items.map(n => {
      const active = n.key === st.screen || n.key === 'library' && st.screen === 'reading' || n.key === 'stories' && st.story !== null;
      const color = active ? st.dark ? '#d8b863' : '#1f5145' : st.dark ? '#526060' : '#6b6252';
      return /*#__PURE__*/React.createElement("div", {
        key: n.key,
        onClick: () => {
          this.go(n.key);
          if (n.key === 'kids') this.setState({
            kidsTab: 'books'
          });
        },
        "aria-current": active ? 'page' : undefined,
        style: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 3,
          cursor: 'pointer',
          padding: '2px 0',
          minHeight: 48
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 38,
          height: 30,
          padding: '3px 7px',
          borderRadius: 11,
          color,
          boxShadow: active ? neuIn(.45, st.dark) : 'none',
          transition: 'box-shadow .2s ease'
        }
      }, /*#__PURE__*/React.createElement("svg", {
        style: {
          width: '100%',
          height: '100%'
        },
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "2",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        dangerouslySetInnerHTML: {
          __html: n.d
        }
      })), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10.5,
          fontWeight: active ? 700 : 500,
          color,
          letterSpacing: .2
        }
      }, n.label));
    }));
  }

  /* ── YOUTUBE PLAYER ── */
  renderYtPlayer(st) {
    return /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({
        ytPlayer: null
      }),
      style: {
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        background: 'rgba(10,10,8,.94)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      },
      className: "apo"
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({
        ytPlayer: null
      }),
      style: {
        position: 'absolute',
        top: 'calc(14px + env(safe-area-inset-top, 0px))',
        right: 16,
        width: 38,
        height: 38,
        borderRadius: '50%',
        background: 'rgba(255,255,255,.14)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: 22,
        cursor: 'pointer'
      }
    }, "\xD7"), /*#__PURE__*/React.createElement("div", {
      onClick: e => e.stopPropagation(),
      style: {
        width: '100%',
        maxWidth: 430,
        aspectRatio: '16/9',
        borderRadius: 14,
        overflow: 'hidden',
        background: '#000',
        boxShadow: '0 24px 60px -20px rgba(0,0,0,.8)'
      }
    }, /*#__PURE__*/React.createElement("iframe", {
      src: `https://www.youtube-nocookie.com/embed/${st.ytPlayer}?autoplay=1&playsinline=1&rel=0`,
      title: "Video player",
      allow: "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
      allowFullScreen: true,
      style: {
        width: '100%',
        height: '100%',
        border: 'none',
        display: 'block'
      }
    })));
  }

  /* ── TOAST ── */
  renderToast(msg) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 50,
        pointerEvents: 'none',
        animation: 'toast-in .25s ease both'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#1c1a17',
        color: '#f3ead4',
        fontSize: 13.5,
        fontWeight: 600,
        padding: '11px 20px',
        borderRadius: 30,
        boxShadow: '0 8px 24px rgba(0,0,0,.3)',
        whiteSpace: 'nowrap'
      }
    }, msg));
  }

  /* ── BRAND MARK (top-right on every screen) ── */
  renderBrandMark(size) {
    const s = size || 44;
    return /*#__PURE__*/React.createElement("img", {
      src: "./icon-192.png",
      alt: "Ahlul Bayt Ireland",
      style: {
        position: 'absolute',
        top: 20,
        right: 16,
        width: s,
        height: s,
        borderRadius: 14,
        zIndex: 40,
        pointerEvents: 'none',
        objectFit: 'cover'
      }
    });
  }

  /* ── MAIN RENDER ── */
  render() {
    const st = this.state;
    const {
      next,
      cd
    } = this.computeNext();
    const now = st.now;
    const hour = now.getHours();
    const lang = st.lang;
    const isRtl = lang === 'العربية' || lang === 'Urdu' || lang === 'فارسی';
    const greg = now.toLocaleDateString('en-IE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
    const hijri = toHijri(now);
    const greetWord = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    const salaam = greetWord + ' · السلام عليكم';
    const showNav = st.story === null;
    // Reader draws its own logo in the toolbar; admin login draws it centred.
    const showBrand = st.screen !== 'reading' && st.screen !== 'home' && !(st.screen === 'admin' && !st.adminLoggedIn);
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      dir: isRtl ? 'rtl' : 'ltr',
      style: {
        background: st.dark ? NEU_D.bg : NEU.bg
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: "#abi-main",
      className: "abi-skip"
    }, "Skip to content"), /*#__PURE__*/React.createElement("main", {
      id: "abi-main",
      className: "s",
      style: {
        flex: '1 1 auto',
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
        background: st.dark ? NEU_D.bg : NEU.bg
      }
    }, showBrand && this.renderBrandMark(), st.screen === 'home' && this.renderHome(st, next, cd, greg, hijri, salaam), st.screen === 'prayer' && this.renderPrayer(st, next, cd, greg), st.screen === 'library' && this.renderLibrary(st), st.screen === 'reading' && this.renderReading(st), st.screen === 'classifieds' && this.renderClassifieds(st), st.screen === 'more' && this.renderMore(st), st.screen === 'about' && this.renderAbout(), st.screen === 'offline' && this.renderOffline(), st.screen === 'admin' && this.renderAdmin(st), st.screen === 'calendar' && this.renderCalendar(st), st.screen === 'kids' && this.renderKids(st), st.screen === 'health' && this.renderHealth(st), st.screen === 'qibla' && this.renderQibla(st), st.screen === 'khums' && this.renderKhums(st), st.screen === 'tasbeeh' && this.renderTasbeeh(st), st.screen === 'wallpaper' && this.renderWallpaper(st), st.screen === 'stories' && this.renderStories(st)), showNav && /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0,
        textAlign: 'center',
        padding: '5px 16px',
        fontSize: 10.5,
        color: st.dark ? '#5a6060' : '#6b6252',
        background: st.dark ? NEU_D.bg : NEU.bg,
        borderTop: `1px solid ${st.dark ? '#2c3234' : 'rgba(234,223,202,.7)'}`
      }
    }, "For support please email us at ", /*#__PURE__*/React.createElement("a", {
      href: "mailto:info@softeire.com",
      style: {
        color: st.dark ? '#d8b863' : '#1f5145',
        fontWeight: 600,
        textDecoration: 'none'
      }
    }, "info@softeire.com")), st.adhanPending && /*#__PURE__*/React.createElement("div", {
      onClick: this.playAdhan,
      style: {
        position: 'absolute',
        bottom: showNav ? 120 : 20,
        left: 16,
        right: 16,
        zIndex: 30,
        background: 'linear-gradient(135deg,#1f5145,#163b30)',
        borderRadius: 18,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        cursor: 'pointer',
        boxShadow: '0 8px 28px -8px rgba(22,70,58,.55)',
        animation: 'notif-in .35s cubic-bezier(.2,.9,.2,1) both'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 44,
        height: 44,
        borderRadius: 13,
        background: 'rgba(255,255,255,.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: 22
      }
    }, "🕌"), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        letterSpacing: 1.1,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#d8b863'
      }
    }, "Prayer Time"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: '#fff',
        marginTop: 2
      }
    }, "Tap to play Adhan"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: 'rgba(255,255,255,.65)',
        marginTop: 1
      }
    }, "Browser requires a tap to allow audio")), /*#__PURE__*/React.createElement("div", {
      onClick: e => {
        e.stopPropagation();
        this.stopAdhan();
      },
      style: {
        width: 30,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'rgba(255,255,255,.5)',
        fontSize: 20,
        cursor: 'pointer'
      }
    }, "×")), showNav && this.renderNav(st), (st.story !== null || st.storyPreview) && this.renderStoryViewer(st), st.ytPlayer && this.renderYtPlayer(st), st.toast && this.renderToast(st.toast));
  }
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
