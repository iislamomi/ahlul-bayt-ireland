function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const {
  Component
} = React;

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
  color: '#9a7a2c',
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
  color: '#9a7a2c',
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
  color: '#9a7a2c',
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
  color: '#9a7a2c'
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
  ink: '#9a7a2c'
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
  ink: '#9a7a2c',
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
const NAV_ICONS = {
  home: '<path d="M4 11l8-6 8 6"/><path d="M6 10v9h12v-9"/>',
  prayer: '<path d="M17 5a7 7 0 1 0 2 9 5.6 5.6 0 0 1-2-9z"/>',
  madrasa: '<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>',
  library: '<path d="M12 6c-1.6-1-4-1.4-6-1v12c2-.4 4.4 0 6 1 1.6-1 4-1.4 6-1V5c-2-.4-4.4 0-6 1z"/><path d="M12 6v13"/>',
  stories: '<circle cx="12" cy="12" r="8" strokeDasharray="3 2.4"/><circle cx="12" cy="12" r="3.2"/>',
  more: '<circle cx="5" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="19" cy="12" r="1.2" fill="currentColor"/>'
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
        border: `1px solid ${open ? '#1f5145' : '#e6dcc8'}`,
        background: '#fffdf9',
        borderRadius: 13,
        padding: '13px 15px',
        fontSize: 15,
        color: muted ? '#a89d88' : '#2c2823',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none'
      }
    }, /*#__PURE__*/React.createElement("span", null, value), /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#b3a890',
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
        background: '#fffdf9',
        border: '1px solid #e6dcc8',
        borderRadius: 13,
        zIndex: 30,
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0,0,0,.1)'
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
    English: 'Upcoming Events',
    'العربية': 'الفعاليات القادمة',
    'हिन्दी': 'आगामी कार्यक्रम',
    'فارسی': 'رویدادهای آینده',
    'Urdu': 'آنے والی تقاریب'
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

/* ── QUIZ DIFFICULTY ── */
const QUIZ_LEVELS = [
  { key: 'beginner', label: 'Beginner', color: '#2c5d52' },
  { key: 'intermediate', label: 'Intermediate', color: '#9a7a2c' },
  { key: 'advanced', label: 'Advanced', color: '#6e2230' }
];
const quizLevel = q => {
  const k = String((q && q.level) || 'beginner').toLowerCase();
  return QUIZ_LEVELS.some(l => l.key === k) ? k : 'beginner';
};

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
  calEvents: 'Islamic calendar updated',
  reminders: 'A new reminder has been added',
  prayerPresets: 'Prayer times updated',
  duas: 'Library updated — new duʿāʾ content',
  ziyarat: 'Library updated — new ziyārah content',
  nahj: 'Library updated — Nahj al-Balāgha'
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
  duas: 'liveDuas', ziyarat: 'liveZiyarat', nahj: 'liveNahj',
  reminders: 'liveReminders'
};

function announcementActive(a) {
  if (!a || !a.title) return false;
  if (a.date) {
    const end = new Date(a.date + 'T23:59:59');
    if (!isNaN(end.getTime()) && Date.now() > end.getTime()) return false;
  }
  return true;
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
      bookmarks: [],
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
      khumsCalc: { cash: '', goods: '', receivables: '', other: '', debts: '', paid: '' },
      zakatCalc: { cash: '', gold: '', silver: '', business: '', receivables: '', investments: '', debts: '', nisab: '600' },
      /* ── ADMIN ── */
      adminLoggedIn: false,
      adminInputId: '',
      adminInputPw: '',
      adminLoginErr: false,
      adminSection: 'stories',
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
      liveZiyarat: lsGet('ziyarat', ZIYARAT),
      liveNahj: lsGet('nahj', NAHJ),
      liveKidsQuizzes: lsGet('kidsQuizzes', KIDS_QUIZZES),
      liveAskImam: lsGet('askImam', []),
      liveAutoTimes: lsGet('autoTimes', null),
      kidsQuizPicks: {},
      kidsVidCat: 'All',
      healthVidCat: 'All',
      adminLibTab: 'dua'
    });
    _defineProperty(this, "go", s => {
      // Refresh every page on navigation: reset transient view state so each
      // screen opens fresh, and scroll the content area back to the top.
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
        healthTab: 'videos',
        healthVidCat: 'All',
        calViewY: null,
        calViewM: undefined,
        calDay: null
      });
      const sc = document.querySelector('.app > .s');
      if (sc) sc.scrollTop = 0;
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
      const tv = Math.round(Math.min(1.5, Math.max(.85, v)) * 100) / 100;
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
    _defineProperty(this, "openReading", (type, item) => this.setState({
      screen: 'reading',
      readingType: type,
      readingItem: item,
      readingLang: null
    }, () => {
      // React may reuse the scroll node from a previous reading — always start at top
      const inner = document.querySelector('.app > .s .s');
      if (inner) inner.scrollTop = 0;
    }));
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
      sendPush('Ahlul Bayt Ireland', PUSH_MSG[key] || 'Community content updated', '/');
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
    _defineProperty(this, "cancelEdit", () => this.setState({
      adminEditIdx: null,
      adminEditDraft: {}
    }));
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
    _defineProperty(this, "handleBookmark", () => {
      const r = this.state.readingItem;
      if (!r) return;
      const bm = this.state.bookmarks;
      const exists = bm.some(b => b.title === r.title);
      if (exists) {
        this.setState({
          bookmarks: bm.filter(b => b.title !== r.title)
        });
        this.showToast('Bookmark removed');
      } else {
        this.setState({
          bookmarks: [...bm, r]
        });
        this.showToast('Bookmarked');
      }
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
  }
  componentWillUnmount() {
    clearInterval(this.clockTimer);
    clearInterval(this.storyTimer);
    clearInterval(this.refreshTimer);
    clearInterval(this.pruneTimer);
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
    const activePrayers = this.getActivePrayers();
    const prayers = activePrayers.map((p, i) => ({
      ...p,
      isNext: p.name === next.name,
      last: i === activePrayers.length - 1
    }));
    const quickCards = [{
      title: 'Duʿāʾ',
      icon: '🤲',
      go: () => this.setState({
        screen: 'library',
        libTab: 'dua',
        libCat: 'All'
      })
    }, {
      title: 'Ziyārah',
      icon: '🕌',
      go: () => this.setState({
        screen: 'library',
        libTab: 'ziyarah',
        libCat: 'All'
      })
    }, {
      title: 'Nahj al-Balāgha',
      icon: '📖',
      go: () => this.setState({
        screen: 'library',
        libTab: 'nahj',
        libCat: 'All'
      })
    }, {
      title: this.t('kids.title'),
      icon: '🧸',
      go: () => this.go('kids')
    }, {
      title: this.t('more.health'),
      icon: '🌿',
      go: () => this.go('health')
    }, {
      title: this.t('home.classTitle'),
      icon: '🏪',
      go: () => this.go('classifieds')
    }, {
      title: 'Khums & Zakat',
      icon: '🧮',
      go: () => this.go('khums')
    }, {
      title: this.t('qibla.title'),
      icon: '🧭',
      go: () => this.go('qibla')
    }, {
      title: this.t('cal.title'),
      icon: '📅',
      go: () => this.go('calendar')
    }];
    const maulanas = Array.isArray(st.liveAskImam) ? st.liveAskImam.filter(m => m && m.number) : st.liveAskImam && st.liveAskImam.number ? [{
      name: '',
      number: st.liveAskImam.number
    }] : [];
    const now = st.now;
    const todayD = now.getDate();
    const calY = now.getFullYear(),
      calM = now.getMonth();
    const todayStr = `${calY}-${String(calM + 1).padStart(2, '0')}-${String(todayD).padStart(2, '0')}`;
    const todayEvent = (st.liveCalEvents || []).find(e => eventOnDate(e, now));
    const showNotif = !!todayEvent && !st.notifDismissed;
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
        background: todayEvent.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#f3ead4",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M13.7 21a2 2 0 0 1-3.4 0"
    }))), /*#__PURE__*/React.createElement("div", {
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
    }, "Today · ", todayEvent.type), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: '#f3ead4',
        marginTop: 2
      }
    }, todayEvent.title)), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({
        notifDismissed: true
      }),
      style: {
        flexShrink: 0,
        width: 28,
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#a59c8a',
        fontSize: 20,
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
        gap: 10,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => this.go('calendar'),
      style: {
        flex: 1,
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 16,
        padding: '13px 15px',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        color: '#b1a690',
        fontWeight: 600
      }
    }, "Gregorian"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14.5,
        color: '#2f2b25',
        fontWeight: 600,
        marginTop: 4
      }
    }, greg)), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.go('calendar'),
      style: {
        flex: 1,
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 16,
        padding: '13px 15px',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        color: '#c2a35a',
        fontWeight: 600
      }
    }, "Hijri"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14.5,
        color: '#2f2b25',
        fontWeight: 600,
        marginTop: 4
      }
    }, hijri))), announcementActive(st.liveAnnouncement) && /*#__PURE__*/React.createElement("div", {
      onClick: st.liveAnnouncement.yt ? () => this.playYt(st.liveAnnouncement.yt) : undefined,
      style: {
        display: 'flex',
        gap: 13,
        alignItems: 'flex-start',
        background: 'linear-gradient(120deg,#faf4e6,#f6efe0)',
        border: '1px solid #ecdfc2',
        borderRadius: 18,
        padding: '15px 16px',
        marginBottom: 16,
        cursor: st.liveAnnouncement.yt ? 'pointer' : 'default'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0,
        width: 34,
        height: 34,
        borderRadius: 10,
        background: st.liveAnnouncement.yt ? '#6e2230' : '#e8d39a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: st.liveAnnouncement.yt ? '#f6e7d7' : '#7a5d18',
        fontWeight: 700,
        fontFamily: 'Spectral,serif',
        fontSize: st.liveAnnouncement.yt ? 12 : 15
      }
    }, st.liveAnnouncement.yt ? '▶' : '!'), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        letterSpacing: 1.1,
        textTransform: 'uppercase',
        fontWeight: 800,
        color: '#a03a3a',
        marginBottom: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: '#c0392b',
        display: 'inline-block'
      }
    }), "Majlis Live"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        fontWeight: 600,
        color: '#5e4d22'
      }
    }, st.liveAnnouncement.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: '#8a7846',
        marginTop: 3,
        lineHeight: 1.4
      }
    }, st.liveAnnouncement.body), (st.liveAnnouncement.date || st.liveAnnouncement.yt) && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: '#a08c55',
        marginTop: 5,
        fontWeight: 600
      }
    }, [st.liveAnnouncement.date ? new Date(st.liveAnnouncement.date + 'T12:00').toLocaleDateString('en-IE', {
      weekday: 'short',
      day: 'numeric',
      month: 'long'
    }) : null, st.liveAnnouncement.yt ? 'Tap to watch ▶' : null].filter(Boolean).join(' · ')))), /*#__PURE__*/React.createElement("div", {
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
        fontSize: 12,
        color: '#1f5145',
        fontWeight: 600,
        cursor: 'pointer'
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
        width: 70,
        textAlign: 'center',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 70,
        height: 70,
        borderRadius: '50%',
        padding: 2.5,
        background: 'conic-gradient(from 210deg,#d8b863,#1f5145,#6e2230,#d8b863)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: '100%',
        borderRadius: '50%',
        background: s.photo ? `url(${s.photo}) center/cover` : s.img || s.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '3px solid #f6f1e7',
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
        color: '#6f675a',
        marginTop: 6,
        lineHeight: 1.2,
        fontWeight: 600
      }
    }, s.short)))), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.go('prayer'),
      style: {
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(155deg,#1f5145 0%,#163b30 100%)',
        borderRadius: 22,
        padding: '20px 22px',
        color: '#f3ead4',
        boxShadow: '0 18px 34px -18px rgba(22,59,48,.7)',
        cursor: 'pointer',
        marginBottom: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: -30,
        top: -30,
        width: 140,
        height: 140,
        borderRadius: '50%',
        border: '1px solid rgba(216,184,99,.22)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 6,
        bottom: -46,
        width: 96,
        height: 96,
        borderRadius: '50%',
        boxShadow: 'inset -22px 0 0 0 rgba(216,184,99,.16)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        fontSize: 11,
        letterSpacing: 1.5,
        textTransform: 'uppercase',
        color: '#d8b863',
        fontWeight: 600
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: '#d8b863',
        boxShadow: '0 0 0 4px rgba(216,184,99,.2)'
      }
    }), " ", this.t('home.nextPrayer')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        marginTop: 10
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 30,
        fontWeight: 600,
        lineHeight: 1
      }
    }, next.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Amiri,serif',
        fontSize: 19,
        color: '#cdbf9e',
        marginTop: 4
      },
      dir: "rtl"
    }, next.ar)), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 30,
        fontWeight: 700,
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1
      }
    }, next.time), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: '#bcae8d',
        marginTop: 5
      }
    }, this.t('home.in'), " ", cd))))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 16,
        padding: '3px 4px',
        marginBottom: 18,
        display: 'grid',
        gridAutoFlow: 'column',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: `repeat(${Math.ceil(prayers.length / 2)}, auto)`
      }
    }, prayers.map((p, i) => /*#__PURE__*/React.createElement("div", {
      key: p.name,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '5.5px 12px',
        borderBottom: i % Math.ceil(prayers.length / 2) === Math.ceil(prayers.length / 2) - 1 || i === prayers.length - 1 ? 'none' : '1px solid #f3ecdd',
        borderLeft: i >= Math.ceil(prayers.length / 2) ? '1px solid #f3ecdd' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'Amiri,serif',
        fontSize: 14.5,
        color: '#bba35f',
        width: 19,
        textAlign: 'center'
      },
      dir: "rtl"
    }, p.glyph), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        color: p.isNext ? '#1f5145' : '#3f3a32',
        fontWeight: p.isNext ? 700 : 500
      }
    }, p.name)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13.5,
        color: p.isNext ? '#1f5145' : '#3f3a32',
        fontWeight: p.isNext ? 700 : 500,
        fontVariantNumeric: 'tabular-nums'
      }
    }, p.time)))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 18,
        fontWeight: 600,
        color: '#2c2823',
        marginBottom: 12
      }
    }, this.t('home.explore')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 10,
        marginBottom: 14
      }
    }, quickCards.map((q, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: q.go,
      style: {
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 18,
        padding: '16px 6px 13px',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        minHeight: 100,
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 28,
        lineHeight: 1
      }
    }, q.icon), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        color: '#2c2823',
        lineHeight: 1.25
      }
    }, q.title)))), st.install && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 13,
        background: '#1c1a17',
        borderRadius: 18,
        padding: '14px 16px',
        animation: 'po .4s ease both'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0,
        width: 40,
        height: 40,
        borderRadius: 12,
        background: 'linear-gradient(150deg,#23564a,#16463a)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 18,
        height: 18,
        borderRadius: '50%',
        boxShadow: 'inset -5px 0 0 0 #d8b863'
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        fontWeight: 600,
        color: '#f3ead4'
      }
    }, this.t('home.installTitle')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: '#a59c8a',
        marginTop: 1
      }
    }, this.t('home.installSub'))), /*#__PURE__*/React.createElement("div", {
      onClick: this.handleInstall,
      style: {
        fontSize: 12.5,
        color: '#1f5145',
        fontWeight: 600,
        background: '#d8b863',
        padding: '8px 13px',
        borderRadius: 11,
        cursor: 'pointer'
      }
    }, this.t('home.add'))), maulanas.length > 0 && /*#__PURE__*/React.createElement("div", {
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
        padding: '6px 13px',
        borderRadius: 9,
        background: '#d8b863',
        color: '#163b30',
        fontSize: 11.5,
        fontWeight: 700,
        cursor: 'pointer'
      }
    }, "Ask")))));
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
      padding: 9,
      borderRadius: 10,
      fontSize: 13.5,
      fontWeight: 600,
      cursor: 'pointer',
      background: active ? '#fffdf9' : 'transparent',
      color: active ? '#1f5145' : '#8c8270',
      boxShadow: active ? '0 2px 6px rgba(40,30,10,.08)' : 'none'
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
        color: st.dark ? '#8e9490' : '#9a8f7c',
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
        background: '#fffdf9',
        border: '1px solid #ece4d4',
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
        borderBottom: p.last ? 'none' : '1px solid #f1ebdd',
        background: p.isNext ? 'linear-gradient(90deg,#f3f7f4,#fffdf9)' : 'transparent'
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
        color: p.isNext ? '#1f5145' : '#c2a86a',
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
        color: '#a89d88',
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
      style: {
        width: 30,
        height: 30,
        borderRadius: 9,
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
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 20,
        overflow: 'hidden',
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        padding: '11px 16px',
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
        padding: '11px 16px',
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
        color: autoLive ? '#1f5145' : '#9a7a2c',
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
          background: '#fffdf9',
          border: `2px solid ${active ? '#1f5145' : '#ece4d4'}`,
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
          border: `2px solid ${active ? '#1f5145' : '#c8bfa8'}`,
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
          color: '#9a8f7c',
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
        background: '#fffdf9',
        border: '1px solid #ece4d4',
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
        color: '#9a8f7c',
        marginTop: 1
      }
    }, this.t('prayer.adhanSub'))), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState(s => ({
        adhanEnabled: !s.adhanEnabled
      })),
      style: {
        width: 48,
        height: 26,
        borderRadius: 13,
        background: st.adhanEnabled ? '#1f5145' : '#c8bfa8',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background .2s',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 3,
        left: st.adhanEnabled ? 24 : 3,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: '#fff',
        transition: 'left .2s',
        boxShadow: '0 1px 4px rgba(0,0,0,.25)'
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
        color: '#9a8f7c',
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
          background: on ? '#1f5145' : '#fffdf9',
          border: `1.5px solid ${on ? '#1f5145' : '#e4dac2'}`
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12.5,
          fontWeight: 700,
          color: on ? '#fffdf9' : '#2c2823'
        }
      }, snd.label), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10.5,
          marginTop: 1,
          color: on ? 'rgba(255,253,249,.7)' : '#9a8f7c'
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
        color: '#9a8f7c',
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
      style: {
        width: 48,
        height: 26,
        borderRadius: 13,
        background: st.notifEnabled ? '#1f5145' : '#c8bfa8',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background .2s',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 3,
        left: st.notifEnabled ? 24 : 3,
        width: 20,
        height: 20,
        borderRadius: '50%',
        background: '#fff',
        transition: 'left .2s',
        boxShadow: '0 1px 4px rgba(0,0,0,.25)'
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
        background: '#fff',
        boxShadow: '0 1px 4px rgba(0,0,0,.18)'
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
        color: '#b0a492'
      }
    }, this.t('prayer.noNotif'))))), tab !== 'settings' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
      href: "https://ahlulbaytireland.com/prayer-calendar.pdf",
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: '#fffdf9',
        border: '1px solid #ece4d4',
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
        color: '#9a7a2c',
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
        color: '#9a8f7c',
        marginTop: 1
      }
    }, this.t('prayer.pdfSub'))), /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#bba35f',
        fontSize: 20
      }
    }, "↓")), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        fontSize: 11.5,
        color: '#a89d88',
        lineHeight: 1.5,
        padding: '6px 20px'
      }
    }, this.t('prayer.note'))));
  }

  /* ── LIBRARY ── */
  renderLibrary(st) {
    const q = st.libQuery.trim().toLowerCase();
    const duaList = st.liveDuas || DUAS;
    const ziyList = st.liveZiyarat || ZIYARAT;
    const nahjData = st.liveNahj || NAHJ;
    const libMeta = {
      dua: {
        title: "Duʿāʾ",
        accent: '#9a7a2c',
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
      nahj: {
        title: 'Nahj al-Balāgha',
        accent: '#2c5d52',
        tint: '#e6efe9',
        list: [],
        cats: []
      }
    };
    const lm = libMeta[st.libTab];
    const tabStyle = k => ({
      flex: 1,
      textAlign: 'center',
      padding: 10,
      borderRadius: 12,
      fontSize: 13.5,
      fontWeight: 600,
      cursor: 'pointer',
      border: '1px solid #ece4d4',
      background: st.libTab === k ? lm.accent : 'transparent',
      color: st.libTab === k ? '#fffdf9' : '#6f675a'
    });
    const chipStyle = c => {
      const active = st.libCat === c;
      return {
        flexShrink: 0,
        padding: '8px 15px',
        borderRadius: 20,
        fontSize: 12.5,
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all .15s',
        background: active ? lm.accent : '#fffdf9',
        color: active ? '#fffdf9' : '#6f675a',
        border: `1px solid ${active ? lm.accent : '#e6dcc8'}`
      };
    };
    let libCards = [];
    if (st.libTab === 'dua' || st.libTab === 'ziyarah') {
      libCards = lm.list.filter(it => {
        const catOk = st.libCat === 'All' || it.cat === st.libCat;
        const qOk = !q || (it.title || '').toLowerCase().includes(q) || (it.tr || '').toLowerCase().includes(q);
        return catOk && qOk;
      });
    }
    let nahjCards = [];
    if (st.libTab === 'nahj') {
      nahjCards = (nahjData[st.nahjTab] || []).filter(it => !q || (it.title || '').toLowerCase().includes(q) || (it.tr || '').toLowerCase().includes(q));
    }
    const nahjTabStyle = k => ({
      padding: '0 0 11px',
      fontSize: 14,
      cursor: 'pointer',
      marginBottom: -1,
      fontWeight: st.nahjTab === k ? 700 : 500,
      color: st.nahjTab === k ? '#2c5d52' : '#8c8270',
      borderBottom: st.nahjTab === k ? '2px solid #2c5d52' : '2px solid transparent'
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
        background: st.dark ? '#16191a' : '#f6f1e7'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 56px 14px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: st.dark ? '#8e9490' : '#9a8f7c',
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
    }, [['dua', "Duʿāʾ"], ['ziyarah', 'Ziyārah'], ['nahj', 'Nahj']].map(([k, label]) => /*#__PURE__*/React.createElement("div", {
      key: k,
      onClick: () => this.setState({
        libTab: k,
        libQuery: '',
        libCat: 'All'
      }),
      style: tabStyle(k)
    }, label)))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginTop: 16,
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 14,
        padding: '11px 14px',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "17",
      height: "17",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#b3a890",
      strokeWidth: "2",
      strokeLinecap: "round"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "11",
      cy: "11",
      r: "7"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M21 21l-4-4"
    })), /*#__PURE__*/React.createElement("input", {
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
        color: '#b3a890',
        cursor: 'pointer',
        fontSize: 18,
        lineHeight: 1
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
        gap: 22,
        borderBottom: '1px solid #ece4d4',
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
        background: '#fffdf9',
        border: '1px solid #ece4d4',
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
        color: '#cdbf9e',
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
        background: '#fffdf9',
        border: '1px solid #ece4d4',
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
        fontSize: 9.5,
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
        color: '#cdbf9e',
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
        color: '#9a8f7c',
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
    }, "PDF · tap to read")))), libCards.length === 0 && nahjCards.length === 0 && (q || st.libCat !== 'All') && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        padding: '40px 20px',
        color: '#9a8f7c',
        fontSize: 14
      }
    }, q ? `No results for "${st.libQuery}"` : `No items in "${st.libCat}"`));
  }

  /* ── READING ── */
  renderReading(st) {
    const dark = st.dark;
    const r = st.readingItem || {};
    const rtype = st.readingType;
    const rd = dark ? {
      bg: '#16191a',
      surf: '#1e2324',
      text: '#ece6d8',
      muted: '#8e9490',
      border: '#2c3234',
      barBg: 'rgba(22,25,26,.9)',
      accent: '#d8b863',
      arInk: '#e9e1cd'
    } : {
      bg: '#f6f1e7',
      surf: '#fffdf9',
      text: '#2c2823',
      muted: '#9a8f7c',
      border: '#ece4d4',
      barBg: 'rgba(246,241,231,.92)',
      accent: '#1f5145',
      arInk: '#2c2823'
    };
    const arSize = Math.round(30 * st.textSize) + 'px';
    const trSize = Math.round(17 * st.textSize) + 'px';
    const readAccent = rtype === 'ziyarah' ? '#6e2230' : rtype === 'nahj' ? '#2c5d52' : '#9a7a2c';
    const kicker = rtype === 'dua' ? 'Supplication' : rtype === 'ziyarah' ? 'Salutation' : r.ref || 'Nahj al-Balāgha';
    const isBookmarked = st.bookmarks.some(b => b.title === r.title);
    const enBody = r.body || r.tr || '';
    const hasEn = !!(enBody || r.sum);
    const hasAr = !!r.ar;
    const hasPdf = !!r.pdf;
    const tabs = [];
    if (hasAr) tabs.push(['ar', '\u0627\u0644\u0639\u0631\u0628\u064a\u0629']);
    if (hasEn) tabs.push(['en', 'English']);
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
        padding: '9px 0',
        borderRadius: 12,
        fontSize: 13.5,
        fontWeight: 700,
        cursor: 'pointer',
        fontFamily: k === 'ar' ? 'Amiri,serif' : 'inherit',
        background: lang === k ? readAccent : rd.surf,
        color: lang === k ? '#fffdf9' : rd.muted,
        border: `1px solid ${lang === k ? readAccent : rd.border}`
      }
    }, label);
    const actionRow = React.createElement("div", {
      style: { display: 'flex', gap: 10 }
    }, React.createElement("div", {
      onClick: this.handleShare,
      style: {
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        padding: '9px 14px', borderRadius: 12, background: readAccent, color: '#fffdf9',
        fontSize: 13, fontWeight: 600, cursor: 'pointer'
      }
    }, React.createElement("svg", {
      width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
      strokeWidth: "1.9", strokeLinecap: "round", strokeLinejoin: "round"
    }, React.createElement("circle", { cx: "18", cy: "5", r: "2.6" }),
      React.createElement("circle", { cx: "6", cy: "12", r: "2.6" }),
      React.createElement("circle", { cx: "18", cy: "19", r: "2.6" }),
      React.createElement("path", { d: "M8.3 10.7l7.4-4.4M8.3 13.3l7.4 4.4" })), this.t('lib.share')),
    React.createElement("div", {
      onClick: this.handleBookmark,
      style: {
        width: 46, display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 12, border: `1px solid ${rd.border}`, background: rd.surf, cursor: 'pointer'
      }
    }, React.createElement("svg", {
      width: "18", height: "18", viewBox: "0 0 24 24",
      fill: isBookmarked ? readAccent : 'none', stroke: readAccent,
      strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round"
    }, React.createElement("path", { d: "M6 4h12v16l-6-4-6 4z" }))));
    return React.createElement("div", {
      style: { height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: rd.bg }
    }, React.createElement("div", {
      style: {
        flexShrink: 0, background: rd.barBg, backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${rd.border}`, padding: '12px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }
    }, React.createElement("div", {
      onClick: () => {
        this.setState({ screen: 'library', readingItem: null, readingType: null, readingLang: null });
        const sc = document.querySelector('.app > .s');
        if (sc) sc.scrollTop = 0;
      },
      style: { display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', color: rd.accent, fontSize: 14, fontWeight: 600 }
    }, React.createElement("span", { style: { fontSize: 18 } }, "\u2039"), " ", this.t('lib.back')),
    React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: 8 } },
      React.createElement("div", {
        onClick: () => this.setTextSize(st.textSize - .12),
        style: { width: 34, height: 34, borderRadius: 10, border: `1px solid ${rd.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: rd.text, fontSize: 13, cursor: 'pointer', background: rd.surf }
      }, "A\u2212"),
      React.createElement("div", {
        onClick: () => this.setTextSize(st.textSize + .12),
        style: { width: 34, height: 34, borderRadius: 10, border: `1px solid ${rd.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: rd.text, fontSize: 17, cursor: 'pointer', background: rd.surf }
      }, "A+"),
      React.createElement("div", {
        onClick: () => this.setDark(!st.dark),
        style: { width: 34, height: 34, borderRadius: 10, border: `1px solid ${rd.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: rd.surf }
      }, React.createElement("svg", {
        width: "17", height: "17", viewBox: "0 0 24 24", fill: "none", stroke: rd.accent,
        strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round"
      }, React.createElement("path", { d: "M20 14a8 8 0 1 1-9.8-9.6A6.5 6.5 0 0 0 20 14z" }))),
      React.createElement("img", {
        src: "./icon-192.png",
        alt: "Ahlul Bayt Ireland",
        style: { width: 34, height: 34, borderRadius: 10, objectFit: 'cover', flexShrink: 0 }
      }))),
    React.createElement("div", { style: { flexShrink: 0, padding: '6px 22px 7px', background: rd.bg, borderBottom: `1px solid ${rd.border}` } },
      React.createElement("div", { style: { fontSize: 8.5, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700, color: readAccent } }, kicker),
      React.createElement("div", { style: { fontFamily: 'Spectral,serif', fontSize: 15, fontWeight: 600, color: rd.text, marginTop: 1, lineHeight: 1.2 } }, r.title),
      r.note && React.createElement("div", { style: { fontSize: 10.5, color: rd.muted, marginTop: 2, fontStyle: 'italic' } }, r.note),
      tabs.length > 1 && React.createElement("div", { style: { display: 'flex', gap: 8, marginTop: 7 } }, tabs.map(pill))),
    React.createElement("div", {
      className: "s",
      style: { flex: '1 1 auto', overflowY: 'auto', padding: '12px 22px 18px' }
    }, lang === 'ar' && hasAr && React.createElement("div", {
      style: { background: rd.surf, border: `1px solid ${rd.border}`, borderRadius: 20, padding: '18px 16px' }
    }, React.createElement("div", {
      style: { fontFamily: 'Amiri,serif', fontSize: arSize, lineHeight: 1.75, color: rd.arInk, textAlign: 'center', whiteSpace: 'pre-line' },
      dir: "rtl"
    }, String(r.ar).replace(/\n\s*\n+/g, '\n').trim())),
    lang === 'en' && hasEn && React.createElement(React.Fragment, null,
      enBody && React.createElement("div", {
        style: { fontFamily: 'Spectral,serif', fontSize: trSize, lineHeight: 1.6, color: rd.text, whiteSpace: 'pre-line' }
      }, String(enBody).replace(/\n\s*\n+/g, '\n').trim()),
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
      }, "Open PDF in browser \u2197"))),
    lang !== 'pdf' && React.createElement("div", {
      style: { flexShrink: 0, padding: '7px 22px 9px', background: rd.bg, borderTop: `1px solid ${rd.border}` }
    }, actionRow));
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
        padding: '8px 15px',
        borderRadius: 20,
        fontSize: 12.5,
        fontWeight: 600,
        cursor: 'pointer',
        background: active ? '#1f5145' : '#fffdf9',
        color: active ? '#fffdf9' : '#6f675a',
        border: `1px solid ${active ? '#1f5145' : '#e6dcc8'}`
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
        color: '#9a8f7c',
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
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 14,
        padding: '11px 14px',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "17",
      height: "17",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#b3a890",
      strokeWidth: "2",
      strokeLinecap: "round"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "11",
      cy: "11",
      r: "7"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M21 21l-4-4"
    })), /*#__PURE__*/React.createElement("input", {
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
        color: '#b3a890',
        cursor: 'pointer',
        fontSize: 18,
        lineHeight: 1
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
        background: '#fffdf9',
        border: '1px solid #ece4d4',
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
        color: b.ink,
        background: b.tint,
        padding: '3px 8px',
        borderRadius: 6
      }
    }, b.cat)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: '#7a7264',
        marginTop: 4,
        lineHeight: 1.45
      }
    }, b.desc), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 12,
        color: '#9a8f7c',
        marginTop: 7
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "13",
      height: "13",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 21s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "9",
      r: "2.4"
    })), b.loc))), /*#__PURE__*/React.createElement("div", {
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
        border: '1px solid #e6dcc8',
        background: '#fff',
        color: '#3f3a32'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "15",
      height: "15",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.9",
      strokeLinecap: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 4h3l2 5-2.5 1.5a11 11 0 0 0 5 5L19 13l2 5v3a16 16 0 0 1-16-16z"
    })), this.t('class.call'))), b.web && /*#__PURE__*/React.createElement("a", {
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
        border: '1px solid #e6dcc8',
        background: '#fff'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#9a7a2c",
      strokeWidth: "1.8"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"
    }))))))), cards.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        padding: '40px 20px',
        color: '#9a8f7c',
        fontSize: 14
      }
    }, q ? `No results for "${st.classQuery}"` : `No listings in "${st.classCat}"`)), cards.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        fontSize: 11.5,
        color: '#a89d88',
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
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 16,
        padding: '15px 16px',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 40,
        height: 40,
        borderRadius: 12,
        background: '#f0e9d9',
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
        color: '#9a8f7c',
        marginTop: 1
      }
    }, m.sub)), /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#cdbf9e',
        fontSize: 20
      }
    }, "›")))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#b1a690',
        marginBottom: 12,
        paddingLeft: 2
      }
    }, this.t('more.language')), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fffdf9',
        border: '1px solid #ece4d4',
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
        borderBottom: i < langs.length - 1 ? '1px solid #f3ecdd' : 'none',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14.5,
        color: st.lang === l ? '#1f5145' : '#3f3a32',
        fontWeight: st.lang === l ? 700 : 400
      }
    }, l), st.lang === l && /*#__PURE__*/React.createElement("svg", {
      width: "18",
      height: "18",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#1f5145",
      strokeWidth: "2.2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 12l5 5 9-11"
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#b1a690',
        marginBottom: 12,
        paddingLeft: 2
      }
    }, this.t('more.reading')), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 16,
        padding: '6px 16px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '13px 0',
        borderBottom: '1px solid #f3ecdd'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14.5,
        color: '#3f3a32'
      }
    }, this.t('more.dark')), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setDark(!st.dark),
      style: {
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
        left: st.dark ? 23 : 3,
        width: 22,
        height: 22,
        borderRadius: '50%',
        background: '#fff',
        boxShadow: '0 1px 3px rgba(0,0,0,.2)',
        transition: 'left .2s'
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
        border: '1px solid #e6dcc8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#3f3a32',
        fontSize: 13,
        cursor: 'pointer'
      }
    }, "A−"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        color: '#9a8f7c',
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
        border: '1px solid #e6dcc8',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#3f3a32',
        fontSize: 16,
        cursor: 'pointer'
      }
    }, "A+")))), st.bookmarks.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 22
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#b1a690',
        marginBottom: 12
      }
    }, "Bookmarks"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, st.bookmarks.map((b, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => this.openReading(null, b),
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 13,
        padding: '13px 15px',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        fontWeight: 600,
        color: '#2c2823'
      }
    }, b.title), /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#cdbf9e',
        fontSize: 18
      }
    }, "›"))))), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        fontSize: 11.5,
        color: '#b1a690',
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
        padding: '8px 0 4px'
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
        color: '#9a8f7c',
        marginTop: 5,
        lineHeight: 1.5,
        padding: '0 24px'
      }
    }, "A calm companion for prayer, supplication and community life."), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fffdf9',
        border: '1px solid #ece4d4',
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
        color: '#b1a690',
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
        top: 14,
        left: 20,
        color: '#1f5145',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer'
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
    }, /*#__PURE__*/React.createElement("svg", {
      width: "34",
      height: "34",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "#b3a890",
      strokeWidth: "1.6",
      strokeLinecap: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 13a7 7 0 0 1 11-4M3 8c3-3 8-4 12-2M19 13a4 4 0 0 1 1 5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M2 2l20 20"
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 21,
        fontWeight: 600,
        color: '#2c2823'
      }
    }, "You're offline"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        color: '#9a8f7c',
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
        border: '1px solid #e6dcc8',
        background: '#fffdf9',
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
      border: '1px solid #e6dcc8',
      background: '#fffdf9',
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
        color: '#9a8f7c',
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
        color: '#b1a690'
      }
    }, "Contact community admin for access.")));
  }

  /* ── ADMIN ── */
  renderAdmin(st) {
    if (!st.adminLoggedIn) return this.renderAdminLogin(st);
    const sec = st.adminSection;
    const editing = st.adminEditIdx !== null;
    const COLORS = ['#1f5145', '#2c5d52', '#6e2230', '#9a7a2c', '#3a4a78', '#b8923f'];
    const COLOR_NAMES = {
      '#1f5145': 'Green',
      '#2c5d52': 'Teal',
      '#6e2230': 'Maroon',
      '#9a7a2c': 'Gold',
      '#3a4a78': 'Navy',
      '#b8923f': 'Amber'
    };
    const STORY_KINDS = ['verse', 'sermon', 'kids', 'quiz', 'classified', 'announce'];
    const EVENT_TYPES = ['Community', 'Majlis', 'Class', 'Programme', 'Dua e Kumail', 'Friday Prayer'];
    const EVENT_COLORS = {
      'Community': '#1f5145',
      'Majlis': '#6e2230',
      'Class': '#9a7a2c',
      'Programme': '#2c5d52',
      'Dua e Kumail': '#3a4a78',
      'Friday Prayer': '#8a4b2c'
    };
    const EVENT_TINTS = {
      'Community': '#e6efe9',
      'Majlis': '#f3e6e8',
      'Class': '#f3ecd9',
      'Programme': '#e6efe9',
      'Dua e Kumail': '#e8ebf4',
      'Friday Prayer': '#f6ebe4'
    };
    const CAT_COLORS = {
      'Food': '#1f5145',
      'Butcher': '#6e2230',
      'Travel': '#9a7a2c',
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
      id: 'reminders',
      label: 'Reminders'
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
      id: 'kids',
      label: 'Kids'
    }, {
      id: 'health',
      label: 'Health'
    }];
    const inp = {
      width: '100%',
      border: '1px solid #e6dcc8',
      background: '#fffdf9',
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
        padding: '9px 16px',
        borderRadius: 11,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
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
        const saveStory = () => {
          const stories = [...st.liveStories];
          const item = {
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
          };
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
            color: '#9a8f7c',
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
            color: '#6f675a'
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
        }), btn('Cancel', this.cancelEdit, {
          flex: 1,
          border: '1px solid #e6dcc8',
          background: '#fffdf9',
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
          background: '#fffdf9',
          border: '1px solid #ece4d4',
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
          color: '#9a8f7c'
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
          border: '1px solid #e6dcc8',
          background: '#fffdf9',
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
          color: '#9a8f7c'
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
          background: '#fffdf9',
          border: '1px solid #ece4d4',
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
          color: '#9a8f7c'
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
    const renderEventsSection = () => {
      if (editing) {
        const d = st.adminEditDraft;
        const isNew = st.adminEditIdx === -1;
        const type = d.type || 'Community';
        const saveItem = () => {
          const list = [...(st.liveCalEvents || [])];
          const item = {
            title: d.title || '',
            type,
            color: EVENT_COLORS[type],
            tint: EVENT_TINTS[type],
            desc: d.desc || '',
            date: d.date || '',
            recurring: !!d.recurring
          };
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
        }, t))), /*#__PURE__*/React.createElement("input", {
          value: d.desc || '',
          onChange: e => this.setDraft({
            desc: e.target.value
          }),
          placeholder: "Description",
          maxLength: 300,
          style: inp
        }), /*#__PURE__*/React.createElement("input", {
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
            onClick: () => this.setDraft({
              recurring: val
            }),
            style: {
              flex: 1,
              textAlign: 'center',
              padding: '10px 4px',
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              cursor: 'pointer',
              background: on ? '#1f5145' : '#fffdf9',
              color: on ? '#f3ead4' : '#6f675a',
              border: `1.5px solid ${on ? '#1f5145' : '#e6dcc8'}`
            }
          }, lbl);
        })), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11,
            color: '#9a8f7c',
            margin: '0 2px 14px',
            lineHeight: 1.45
          }
        }, d.recurring ? (gregToDate(d.date) ? `Returns every year on ${toHijri(gregToDate(d.date)).split(' ').slice(0, 2).join(' ')} (Islamic calendar).` : 'Returns on the same Islamic-calendar date every year.') : 'Shows on this date only.'), /*#__PURE__*/React.createElement("div", {
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
          border: '1px solid #e6dcc8',
          background: '#fffdf9',
          color: '#3f3a32'
        })));
      }
      return /*#__PURE__*/React.createElement("div", null, btn('+ Add Event', () => this.startEdit(-1, {
        type: 'Community',
        date: ''
      }), {
        background: '#1f5145',
        color: '#f3ead4',
        marginBottom: 14,
        width: '100%'
      }), (st.liveCalEvents || []).map((e, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: '#fffdf9',
          border: '1px solid #ece4d4',
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
          color: '#9a8f7c'
        }
      }, e.type, " · ", e.date || 'No date')), btn('Edit', () => this.startEdit(i, {
        ...e
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
      }))));
    };

    /* ─ REMINDERS ─ */
    const renderRemindersSection = () => {
      if (editing) {
        const d = st.adminEditDraft;
        const isNew = st.adminEditIdx === -1;
        const saveItem = () => {
          if (!(d.text || '').trim()) {
            this.showToast('Reminder text is required');
            return;
          }
          if (!(d.date || '').trim()) {
            this.showToast('Please pick a date');
            return;
          }
          const list = [...(st.liveReminders || [])];
          const item = {
            text: (d.text || '').trim(),
            date: d.date || ''
          };
          if (isNew) list.push(item);else list[st.adminEditIdx] = item;
          save('reminders', 'liveReminders', list, isNew ? 'Reminder added!' : 'Reminder updated!');
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
        }, isNew ? 'Add Reminder' : 'Edit Reminder'), /*#__PURE__*/React.createElement("textarea", {
          value: d.text || '',
          onChange: e => this.setDraft({
            text: e.target.value
          }),
          placeholder: "Reminder (e.g. Dua Kumayl tonight after Isha)",
          maxLength: 160,
          style: {
            ...inp,
            minHeight: 60,
            resize: 'none'
          }
        }), /*#__PURE__*/React.createElement("input", {
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
            display: 'flex',
            gap: 10
          }
        }, btn('Save', saveItem, {
          flex: 1,
          background: '#1f5145',
          color: '#f3ead4'
        }), btn('Cancel', this.cancelEdit, {
          flex: 1,
          border: '1px solid #e6dcc8',
          background: '#fffdf9',
          color: '#3f3a32'
        })));
      }
      const rem = [...(st.liveReminders || [])].map((r, i) => ({ r, i })).sort((a, b) => (a.r.date || '').localeCompare(b.r.date || ''));
      return /*#__PURE__*/React.createElement("div", null, btn('+ Add Reminder', () => this.startEdit(-1, {
        date: ''
      }), {
        background: '#1f5145',
        color: '#f3ead4',
        marginBottom: 14,
        width: '100%'
      }), rem.length === 0 ? /*#__PURE__*/React.createElement("div", {
        style: {
          textAlign: 'center',
          fontSize: 13,
          color: '#9a8f7c',
          padding: '18px 0'
        }
      }, "No reminders yet.") : rem.map(({ r, i }) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: '#fffdf9',
          border: '1px solid #ece4d4',
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
          color: '#2c2823'
        }
      }, r.text), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11,
          color: '#9a8f7c',
          marginTop: 2
        }
      }, r.date ? new Date(r.date + 'T00:00:00').toLocaleDateString('en-IE', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      }) : 'No date')), btn('Edit', () => this.startEdit(i, {
        ...r
      }), {
        background: '#e6efe9',
        color: '#1f5145',
        fontSize: 12,
        padding: '6px 12px'
      }), btn('✕', () => {
        const a = [...(st.liveReminders || [])];
        a.splice(i, 1);
        save('reminders', 'liveReminders', a, 'Deleted');
      }, {
        background: '#fdf0f2',
        color: '#6e2230',
        fontSize: 12,
        padding: '6px 10px'
      }))));
    };

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
            color: '#9a8f7c',
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
            border: '1px solid #e6dcc8',
            background: '#fffdf9',
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
          border: '1px solid #e6dcc8',
          background: '#fffdf9',
          color: '#3f3a32'
        })));
      }
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          color: '#9a8f7c',
          marginBottom: 12
        }
      }, "Times auto-sync daily with the Jaʿfarī (Leva, Qum) calculation for Dublin. The times saved here are the fallback used when the live service is unreachable. Tap a source to edit."), presets.map((p, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        onClick: () => this.startEdit(i, {}),
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          background: '#fffdf9',
          border: '1px solid #ece4d4',
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
          color: '#9a8f7c',
          marginTop: 2
        }
      }, p.sub)), /*#__PURE__*/React.createElement("span", {
        style: {
          color: '#bba35f',
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
        }, "Majlis date — the banner disappears at 11:59 pm on this date"), /*#__PURE__*/React.createElement("input", {
          type: "date",
          value: d.date || '',
          onChange: e => this.setDraft({
            date: e.target.value
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
            date: d.date || ''
          }, 'Majlis Live saved!');
        }, {
          flex: 1,
          background: '#1f5145',
          color: '#f3ead4'
        }), btn('Cancel', this.cancelEdit, {
          flex: 1,
          border: '1px solid #e6dcc8',
          background: '#fffdf9',
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
          border: '1px solid #e6dcc8',
          background: '#fffdf9',
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
          background: '#fffdf9',
          border: '1px solid #ece4d4',
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
          color: '#9a8f7c',
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
            background: d.on ? '#1f5145' : '#c8bfa8',
            position: 'relative',
            cursor: 'pointer',
            transition: 'background .2s',
            flexShrink: 0
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            position: 'absolute',
            top: 3,
            left: d.on ? 24 : 3,
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
            transition: 'left .2s',
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
          border: '1px solid #e6dcc8',
          background: '#fffdf9',
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
          color: '#9a8f7c',
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
              border: `1.5px solid ${d.hero ? '#1f5145' : '#e6dcc8'}`,
              background: d.hero ? '#e6efe9' : '#fffdf9',
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
            border: '1px solid #e6dcc8',
            background: '#fffdf9',
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
            border: '1px solid #e6dcc8',
            background: '#fffdf9',
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
            border: '1px solid #e6dcc8',
            background: '#fffdf9',
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
              background: on ? L.color : '#fffdf9',
              color: on ? '#fffdf9' : '#6f675a',
              border: `1.5px solid ${on ? L.color : '#e6dcc8'}`
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
          border: '1px solid #e6dcc8',
          background: '#fffdf9',
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
          padding: '7px 6px',
          borderRadius: 9,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          background: ks === t.id ? '#fffdf9' : 'transparent',
          color: ks === t.id ? '#1f5145' : '#8c8270'
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
          background: '#fffdf9',
          border: '1px solid #ece4d4',
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
        'Nutrition': '#9a7a2c',
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
              border: `1.5px solid ${d.hero ? '#1f5145' : '#e6dcc8'}`,
              background: d.hero ? '#e6efe9' : '#fffdf9',
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
            border: '1px solid #e6dcc8',
            background: '#fffdf9',
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
            border: '1px solid #e6dcc8',
            background: '#fffdf9',
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
          padding: '7px 6px',
          borderRadius: 9,
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          background: hs === t.id ? '#fffdf9' : 'transparent',
          color: hs === t.id ? '#1f5145' : '#8c8270'
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
          background: '#fffdf9',
          border: '1px solid #ece4d4',
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
      }, [['dua', 'Duʿāʾ'], ['ziyarah', 'Ziyārah'], ['nahj', 'Nahj']].map(([k, label]) => /*#__PURE__*/React.createElement("div", {
        key: k,
        onClick: () => this.setState({
          adminLibTab: k,
          adminEditIdx: null,
          adminEditDraft: {}
        }),
        style: {
          flex: 1,
          textAlign: 'center',
          padding: '7px 4px',
          borderRadius: 9,
          fontSize: 12.5,
          fontWeight: 600,
          cursor: 'pointer',
          background: lt === k ? '#fffdf9' : 'transparent',
          color: lt === k ? '#1f5145' : '#8c8270'
        }
      }, label)));
      const rowStyle = {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: '#fffdf9',
        border: '1px solid #ece4d4',
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
      if (lt === 'dua' || lt === 'ziyarah') {
        const key = lt === 'dua' ? 'duas' : 'ziyarat';
        const stateKey = lt === 'dua' ? 'liveDuas' : 'liveZiyarat';
        const label = lt === 'dua' ? 'Duʿāʾ' : 'Ziyārah';
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
            placeholder: lt === 'dua' ? 'Category (e.g. Daily, Weekly, Morning)' : 'Category (e.g. Imam Ḥusayn, General)',
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
            border: '1px solid #e6dcc8',
            background: '#fffdf9',
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
            color: '#9a8f7c',
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
          border: '1px solid #e6dcc8',
          background: '#fffdf9',
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
          color: '#b1a690',
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
          color: '#9a8f7c',
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
      reminders: renderRemindersSection,
      prayers: renderPrayersSection,
      announcement: renderAnnouncementSection,
      pinned: renderPinnedSection,
      askImam: renderAskImamSection,
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
      ink: '#9a7a2c',
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
        background: '#fffdf9',
        borderBottom: '1px solid #ece4d4'
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
        cursor: 'pointer'
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
        padding: '8px 6px',
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
        fontSize: 9.5,
        color: s.ink,
        fontWeight: 600,
        marginTop: 2,
        opacity: .75
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
        padding: '9px 18px',
        borderRadius: 11,
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
        padding: '7px 14px',
        borderRadius: 20,
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        background: sec === t.id ? '#1f5145' : '#efe7d7',
        color: sec === t.id ? '#f3ead4' : '#6f675a',
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
        background: '#fffdf9',
        borderTop: '1px solid #ece4d4'
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
        padding: '11px 0',
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 700,
        cursor: 'pointer',
        background: '#f3e6e8',
        color: '#6e2230',
        border: '1px solid #e6cdd2'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "15",
      height: "15",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M16 17l5-5-5-5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M21 12H9"
    })), "Log out")));
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
    const evList = st.liveCalEvents || [];
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
    const dayReminders = (st.liveReminders || []).filter(r => r.date === selDayStr);
    const dayLabelShort = selIsToday ? 'Today' : selDayDate.toLocaleDateString('en-IE', { weekday: 'short', day: 'numeric', month: 'short' });
    const todayStart = new Date(todayY, todayM, todayD).getTime();
    const calEventList = Object.keys(eventsByDay).map(d => +d).filter(d => new Date(calY, calM, d).getTime() >= todayStart).sort((a, b) => a - b).flatMap(d => eventsByDay[d].map(ev => ({
      day: d,
      ...ev,
      dateLabel: new Date(calY, calM, d).toLocaleDateString('en-IE', {
        day: 'numeric',
        month: 'short'
      })
    })));
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
      style: { width: 34, height: 34, flexShrink: 0, borderRadius: 10, background: enabled ? '#f4faf7' : '#f5f0e8', border: '1px solid #e0ded4', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: enabled ? 'pointer' : 'default', color: enabled ? '#1f5145' : '#c9bfae', fontSize: 18, fontWeight: 700 }
    }, glyph);
    const calIcon = /*#__PURE__*/React.createElement("svg", { width: 16, height: 16, viewBox: "0 0 24 24", fill: 'none', stroke: '#1f5145', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' }, /*#__PURE__*/React.createElement("rect", { x: 3, y: 4, width: 18, height: 18, rx: 3 }), /*#__PURE__*/React.createElement("path", { d: "M3 10h18M8 2v4M16 2v4" }));
    const clockIcon = /*#__PURE__*/React.createElement("svg", { width: 13, height: 13, viewBox: "0 0 24 24", fill: 'none', stroke: '#9a8f7c', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' }, /*#__PURE__*/React.createElement("circle", { cx: 12, cy: 12, r: 9 }), /*#__PURE__*/React.createElement("path", { d: "M12 7v5l3 2" }));
    const bellIcon = /*#__PURE__*/React.createElement("svg", { width: 16, height: 16, viewBox: "0 0 24 24", fill: 'none', stroke: '#1f5145', strokeWidth: 1.9, strokeLinecap: 'round', strokeLinejoin: 'round' }, /*#__PURE__*/React.createElement("path", { d: "M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" }), /*#__PURE__*/React.createElement("path", { d: "M13.7 21a2 2 0 0 1-3.4 0" }));
    return /*#__PURE__*/React.createElement("div", {
      style: { padding: '8px 20px 100px' },
      className: "afu"
    },
    /*#__PURE__*/React.createElement("div", {
      style: { padding: '8px 56px 16px 0' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 13, color: '#9a8f7c', fontWeight: 500 }
    }, this.t('cal.community')), /*#__PURE__*/React.createElement("div", {
      style: { fontFamily: 'Spectral,serif', fontSize: 26, fontWeight: 600, color: '#27241f', marginTop: 2 }
    }, this.t('cal.title'))),
    /*#__PURE__*/React.createElement("div", {
      style: { background: '#fffdf9', border: '1px solid #ece4d4', borderRadius: 22, padding: '16px 14px', boxShadow: '0 10px 26px -20px rgba(31,81,69,.55)' }
    },
      /*#__PURE__*/React.createElement("div", {
        style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }
      }, arrowBtn("‹", canPrev, () => canPrev && goMonth(0, -1)), /*#__PURE__*/React.createElement("div", {
        style: { flex: 1, textAlign: 'right', fontFamily: 'Spectral,serif', fontSize: 17, fontWeight: 600, color: '#2c2823' }
      }, monthOnly), /*#__PURE__*/React.createElement("div", {
        style: { position: 'relative', width: 66, height: 66, flexShrink: 0, borderRadius: '50%', background: 'radial-gradient(circle,#ffffff 55%,#eef5f1 56%)', border: '2px solid #1f5145', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px -6px rgba(31,81,69,.55)' }
      }, /*#__PURE__*/React.createElement("div", {
        style: { position: 'absolute', inset: 5, borderRadius: '50%', border: '1.5px dashed #c2a35a' }
      }), /*#__PURE__*/React.createElement("div", {
        style: { fontFamily: 'Spectral,serif', fontSize: 24, fontWeight: 700, color: '#1f5145' }
      }, selDay)), /*#__PURE__*/React.createElement("div", {
        style: { flex: 1, textAlign: 'left', fontFamily: 'Spectral,serif', fontSize: 17, fontWeight: 600, color: '#2c2823' }
      }, String(calY)), arrowBtn("›", canNext, () => canNext && goMonth(0, 1))),
      /*#__PURE__*/React.createElement("div", {
        style: { textAlign: 'center', fontSize: 12.5, color: '#9a7a2c', fontWeight: 600, marginTop: 7 }
      }, selHijri, " AH"),
      /*#__PURE__*/React.createElement("div", {
        style: { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginTop: 12, marginBottom: 2 }
      }, weekHead.map((w, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: { textAlign: 'center', fontSize: 11, fontWeight: 700, color: '#b1a690' }
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
        style: { fontSize: 9, fontWeight: 500, color: c.sel ? 'rgba(255,255,255,.6)' : '#c2a35a', lineHeight: 1 }
      }, c.hijriDay))))),
    /*#__PURE__*/React.createElement("div", {
      style: { background: '#fffdf9', border: '1px solid #ece4d4', borderRadius: 18, marginTop: 16, overflow: 'hidden' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', background: '#e8f0ec' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'center', gap: 9 }
    }, calIcon, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 15, fontWeight: 700, color: '#1f5145' }
    }, selIsToday ? "Today's Events" : "Events")), calEventList.length > 0 && /*#__PURE__*/React.createElement("div", {
      onClick: () => { const el = document.getElementById('cal-upcoming'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); },
      style: { fontSize: 12.5, fontWeight: 600, color: '#1f5145', cursor: 'pointer' }
    }, "See all ›")), /*#__PURE__*/React.createElement("div", {
      style: { padding: '2px 16px 12px' }
    }, selEvents.length > 0 ? selEvents.map((ev, si) => /*#__PURE__*/React.createElement("div", {
      key: si,
      style: { padding: '12px 0', borderTop: si > 0 ? '1px solid #f1ebdd' : 'none' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 10.5, letterSpacing: .7, textTransform: 'uppercase', fontWeight: 700, color: ev.color }
    }, ev.type), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 15, fontWeight: 600, color: '#2c2823', marginTop: 2 }
    }, ev.title), ev.desc && /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 12.5, color: '#7a7264', marginTop: 4, lineHeight: 1.5 }
    }, ev.desc), st.adminLoggedIn && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({ screen: 'admin', adminSection: 'events', adminEditIdx: (st.liveCalEvents || []).indexOf(ev), adminEditDraft: { ...ev } }),
      style: { marginTop: 8, display: 'inline-block', fontSize: 11, color: '#1f5145', fontWeight: 600, cursor: 'pointer', padding: '4px 10px', border: '1px solid #c4ddd7', borderRadius: 8, background: '#eef7f4' }
    }, "Edit"))) : /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 13, color: '#b1a690', padding: '12px 0 4px' }
    }, this.t('cal.noEvent')), /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, paddingTop: 10, borderTop: '1px solid #f1ebdd' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#9a8f7c', fontWeight: 600 }
    }, clockIcon, dayLabelShort), st.adminLoggedIn && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({ screen: 'admin', adminSection: 'events', adminEditIdx: -1, adminEditDraft: { date: selDayStr, type: 'Community' } }),
      style: { fontSize: 11, color: '#1f5145', fontWeight: 600, cursor: 'pointer', padding: '5px 10px', border: '1px solid #c4ddd7', borderRadius: 8, background: '#eef7f4' }
    }, "+ Add event")))),
    /*#__PURE__*/React.createElement("div", {
      style: { background: '#fffdf9', border: '1px solid #ece4d4', borderRadius: 18, marginTop: 14, overflow: 'hidden' }
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
    }, rm.text), st.adminLoggedIn && /*#__PURE__*/React.createElement("span", {
      onClick: () => this.setState({ screen: 'admin', adminSection: 'reminders', adminEditIdx: (st.liveReminders || []).indexOf(rm), adminEditDraft: { ...rm } }),
      style: { flexShrink: 0, fontSize: 11, color: '#1f5145', fontWeight: 600, cursor: 'pointer' }
    }, "Edit")))), st.adminLoggedIn ? /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({ screen: 'admin', adminSection: 'reminders', adminEditIdx: -1, adminEditDraft: { date: selDayStr } }),
      style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px', borderRadius: 12, border: '1px dashed #c4ddd7', background: '#f4fbf8', color: '#1f5145', fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }
    }, "+ Add A Reminder") : dayReminders.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 13, color: '#b1a690', textAlign: 'center', padding: '4px 0' }
    }, "No reminders for this day.")),
    st.adminLoggedIn && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({ screen: 'admin', adminSection: 'events', adminEditIdx: null, adminEditDraft: {} }),
      style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, padding: '12px', borderRadius: 14, border: '1px dashed #c4ddd7', background: '#f4fbf8', cursor: 'pointer' }
    }, /*#__PURE__*/React.createElement("span", {
      style: { color: '#1f5145', fontSize: 14, fontWeight: 600 }
    }, "⚙ Manage Events & Reminders")),
    calEventList.length > 0 && /*#__PURE__*/React.createElement("div", {
      id: 'cal-upcoming'
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700, color: '#b1a690', margin: '22px 0 12px' }
    }, this.t('cal.upcoming')), /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', flexDirection: 'column', gap: 10 }
    }, calEventList.map((e, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => this.setState({ calDay: e.day }),
      style: { display: 'flex', gap: 13, alignItems: 'center', background: '#fffdf9', border: '1px solid #ece4d4', borderRadius: 15, padding: '13px 15px', cursor: 'pointer' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { flexShrink: 0, width: 46, textAlign: 'center', borderRight: '1px solid #f1ebdd', paddingRight: 11 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 18, fontWeight: 700, color: e.color, lineHeight: 1 }
    }, e.day), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 10, color: '#a89d88', marginTop: 2 }
    }, e.dateLabel)), /*#__PURE__*/React.createElement("div", {
      style: { flex: 1 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 10, letterSpacing: .6, textTransform: 'uppercase', fontWeight: 700, color: e.color }
    }, e.type), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 14.5, fontWeight: 600, color: '#2c2823', marginTop: 1 }
    }, e.title))))))),
    /*#__PURE__*/React.createElement("div", {
      style: { textAlign: 'center', fontSize: 11.5, color: '#a89d88', lineHeight: 1.5, padding: '18px 24px 0' }
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
      padding: '8px 6px',
      borderRadius: 10,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      background: kt === k ? '#fffdf9' : 'transparent',
      color: kt === k ? '#1f5145' : '#8c8270',
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
        color: st.dark ? '#8e9490' : '#9a8f7c',
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
        gap: 6,
        background: '#efe7d7',
        borderRadius: 14,
        padding: 4,
        marginBottom: 18
      }
    }, [['videos', this.t('kids.videos')], ['books', this.t('kids.books')], ['wisdom', this.t('kids.wisdom')], ['quiz', 'Quiz']].map(([k, label]) => /*#__PURE__*/React.createElement("div", {
      key: k,
      onClick: () => this.setState({
        kidsTab: k
      }),
      style: tabStyle(k)
    }, label))), kt === 'videos' && /*#__PURE__*/React.createElement(React.Fragment, null, !heroV && /*#__PURE__*/React.createElement("div", {
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
        fontSize: 11.5,
        color: '#a89d88',
        marginBottom: 22
      }
    }, "Safe, ad-free Islamic videos chosen for the community."), /*#__PURE__*/React.createElement("div", {
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
        padding: '7px 14px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        background: kvCat === c ? '#1f5145' : '#fffdf9',
        color: kvCat === c ? '#fffdf9' : '#6f675a',
        border: `1px solid ${kvCat === c ? '#1f5145' : '#e6dcc8'}`
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
        background: '#fffdf9',
        border: '1px solid #ece4d4',
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
        color: '#9a8f7c',
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
        background: st.dark ? '#20262a' : '#fffdf9',
        border: `1px solid ${st.dark ? '#2c3234' : '#ece4d4'}`,
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
        background: st.dark ? '#20262a' : '#fffdf9',
        border: `1px solid ${st.dark ? '#2c3234' : '#ece4d4'}`,
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
        color: st.dark ? '#a7a091' : '#6f675a'
      }
    }, s2.desc))))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: '#9a7a2c',
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
        onClick: () => this.setState({
          kidsQuizLevel: L.key
        }),
        style: {
          flex: 1,
          textAlign: 'center',
          padding: '9px 4px',
          borderRadius: 12,
          fontSize: 12.5,
          fontWeight: 700,
          cursor: 'pointer',
          background: on ? L.color : '#fffdf9',
          color: on ? '#fffdf9' : '#6f675a',
          border: `1.5px solid ${on ? L.color : '#e6dcc8'}`
        }
      }, L.label, n ? /*#__PURE__*/React.createElement("span", {
        style: {
          opacity: .7,
          fontWeight: 600
        }
      }, " · ", n) : null);
    })), (() => {
      const lvl = st.kidsQuizLevel || 'beginner';
      const picked = (st.liveKidsQuizzes || []).map((qz, qi) => ({ qz, qi })).filter(x => quizLevel(x.qz) === lvl);
      if (!picked.length) return /*#__PURE__*/React.createElement("div", {
        style: {
          background: '#fffdf9',
          border: '1px dashed #e6dcc8',
          borderRadius: 18,
          padding: '22px 18px',
          textAlign: 'center',
          fontSize: 13.5,
          color: '#8c8270',
          marginBottom: 14
        }
      }, "No ", (QUIZ_LEVELS.find(l => l.key === lvl) || {}).label.toLowerCase(), " quizzes yet — check back soon.");
      return picked.map(({ qz, qi }, pos) => {
      const pick = (st.kidsQuizPicks || {})[qi];
      const answered = pick !== undefined;
      return /*#__PURE__*/React.createElement("div", {
        key: qi,
        style: {
          background: '#fffdf9',
          border: '1px solid #ece4d4',
          borderRadius: 18,
          padding: '16px 17px',
          marginBottom: 14
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10.5,
          letterSpacing: .8,
          textTransform: 'uppercase',
          fontWeight: 700,
          color: '#6e2230',
          marginBottom: 8
        }
      }, "Question ", pos + 1), /*#__PURE__*/React.createElement("div", {
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
        const picked = pick === oi;
        const correct = oi === qz.answer;
        const bg = answered ? correct ? '#e4f3e7' : picked ? '#fbe9e9' : '#faf7f0' : '#faf7f0';
        const bd = answered && correct ? '#7cc38f' : answered && picked ? '#e0a0a0' : '#e6dcc8';
        const mark = answered ? correct ? '✓' : picked ? '✕' : '' : String.fromCharCode(65 + oi);
        return /*#__PURE__*/React.createElement("div", {
          key: oi,
          onClick: () => {
            if (!answered) this.setState({
              kidsQuizPicks: {
                ...(st.kidsQuizPicks || {}),
                [qi]: oi
              }
            });
          },
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
            color: answered ? correct ? '#2e7d43' : '#a33636' : '#b3a890'
          }
        }, mark));
      })), answered && /*#__PURE__*/React.createElement("div", {
        style: {
          marginTop: 11,
          fontSize: 13,
          fontWeight: 600,
          color: pick === qz.answer ? '#1f5145' : '#6e2230'
        }
      }, pick === qz.answer ? 'Correct — well done!' : 'Not quite — the correct answer is highlighted.'), answered && /*#__PURE__*/React.createElement("div", {
        onClick: () => {
          const p = {
            ...(st.kidsQuizPicks || {})
          };
          delete p[qi];
          this.setState({
            kidsQuizPicks: p
          });
        },
        style: {
          marginTop: 8,
          fontSize: 12,
          fontWeight: 600,
          color: '#8c8270',
          cursor: 'pointer',
          textDecoration: 'underline'
        }
      }, "Try again"));
    });
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
        color: '#bba35f',
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
      padding: '8px 6px',
      borderRadius: 10,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      background: ht === k ? '#fffdf9' : 'transparent',
      color: ht === k ? '#1f5145' : '#8c8270',
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
        color: st.dark ? '#8e9490' : '#9a8f7c',
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
        fontSize: 11.5,
        color: '#a89d88',
        marginBottom: 22
      }
    }, "Community health and wellness videos, handpicked for you."), /*#__PURE__*/React.createElement("div", {
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
        padding: '7px 14px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 600,
        cursor: 'pointer',
        background: hvCat === c ? '#1f5145' : '#fffdf9',
        color: hvCat === c ? '#fffdf9' : '#6f675a',
        border: `1px solid ${hvCat === c ? '#1f5145' : '#e6dcc8'}`
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
        background: '#fffdf9',
        border: '1px solid #ece4d4',
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
        color: '#9a8f7c',
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
      padding: '8px 6px',
      borderRadius: 10,
      fontSize: 13,
      fontWeight: 600,
      cursor: 'pointer',
      background: kt === k ? '#fffdf9' : 'transparent',
      color: kt === k ? '#1f5145' : '#8c8270',
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
        color: '#9a8f7c',
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
        border: '1px solid #e2d8c4',
        background: '#fffdf9',
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
        color: '#b1a690',
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
        color: '#9a8f7c',
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
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 16,
        padding: '13px 15px',
        fontSize: 12.5,
        color: '#6f675a',
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
        color: '#cdbf9e',
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
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 16,
        padding: '13px 15px',
        fontSize: 12.5,
        color: '#6f675a',
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
        color: '#cdbf9e',
        lineHeight: 1.4
      }
    }, "Your net wealth is below the nisab threshold — no Zakat is due."))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 16,
        fontSize: 11,
        color: '#9a8f7c',
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
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        boxShadow: 'inset 0 2px 14px rgba(40,30,10,.06),0 14px 30px -16px rgba(40,30,10,.25)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 14,
        borderRadius: '50%',
        border: '1px dashed #e2d8c4'
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
        color: '#9a8f7c'
      }
    }, "S"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        right: 12,
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: 13,
        fontWeight: 700,
        color: '#9a8f7c'
      }
    }, "E"), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 12,
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: 13,
        fontWeight: 700,
        color: '#9a8f7c'
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
        boxShadow: '0 0 0 4px #fffdf9,0 0 0 5px #ece4d4'
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
        color: '#9a8f7c',
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
        color: '#9a7a2c'
      }
    }, cardinal)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: '#9a8f7c',
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
        color: '#9a8f7c'
      }
    }, "—°"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: '#b0a492',
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
        color: '#9a7a2c',
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
        color: '#9a7a2c',
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
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 16,
        padding: 15,
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: .6,
        textTransform: 'uppercase',
        color: '#b1a690',
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
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 16,
        padding: 15,
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: .6,
        textTransform: 'uppercase',
        color: '#b1a690',
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
    const stories = activeStories(st.liveStories);
    if (!stories[st.story]) {
      // index out of range (list shrank / empty) — close instead of a blank page
      setTimeout(this.closeStory, 0);
      return null;
    }
    const cur = stories[st.story] || {};
    const bars = stories.map((_, i) => ({
      fill: i < st.story ? 100 : i === st.story ? st.storyProg : 0
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
        width: `${b.fill}%`,
        background: '#fff',
        borderRadius: 3,
        transition: b.fill > 0 && b.fill < 100 ? 'width .06s linear' : 'none'
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
    }, cur.tag))), /*#__PURE__*/React.createElement("div", {
      onClick: this.closeStory,
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
      onClick: this.prevStory,
      style: {
        position: 'absolute',
        left: 0,
        top: 90,
        bottom: 0,
        width: '35%',
        zIndex: 3
      }
    }), /*#__PURE__*/React.createElement("div", {
      onClick: this.nextStory,
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
        color: st.dark ? '#8e9490' : '#9a8f7c',
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
    return /*#__PURE__*/React.createElement("div", {
      className: "abi-nav",
      style: {
        flexShrink: 0,
        background: st.dark ? 'rgba(22,25,26,.95)' : 'rgba(255,253,249,.92)',
        backdropFilter: 'blur(14px)',
        borderTop: `1px solid ${st.dark ? '#2c3234' : '#eadfca'}`,
        padding: '6px 14px 6px',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 10
      }
    }, items.map(n => {
      const active = n.key === st.screen || n.key === 'library' && st.screen === 'reading' || n.key === 'stories' && st.story !== null;
      const color = active ? st.dark ? '#d8b863' : '#1f5145' : st.dark ? '#526060' : '#b3a890';
      return /*#__PURE__*/React.createElement("div", {
        key: n.key,
        onClick: () => {
          this.go(n.key);
          if (n.key === 'kids') this.setState({
            kidsTab: 'books'
          });
        },
        style: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          cursor: 'pointer',
          padding: '2px 0'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          width: 24,
          height: 24,
          color
        }
      }, /*#__PURE__*/React.createElement("svg", {
        style: {
          width: '100%',
          height: '100%'
        },
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.7",
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
        background: st.dark ? '#16191a' : '#f6f1e7'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "s",
      style: {
        flex: '1 1 auto',
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
        background: st.dark ? '#16191a' : '#f6f1e7'
      }
    }, showBrand && this.renderBrandMark(), st.screen === 'home' && this.renderHome(st, next, cd, greg, hijri, salaam), st.screen === 'prayer' && this.renderPrayer(st, next, cd, greg), st.screen === 'library' && this.renderLibrary(st), st.screen === 'reading' && this.renderReading(st), st.screen === 'classifieds' && this.renderClassifieds(st), st.screen === 'more' && this.renderMore(st), st.screen === 'about' && this.renderAbout(), st.screen === 'offline' && this.renderOffline(), st.screen === 'admin' && this.renderAdmin(st), st.screen === 'calendar' && this.renderCalendar(st), st.screen === 'kids' && this.renderKids(st), st.screen === 'health' && this.renderHealth(st), st.screen === 'qibla' && this.renderQibla(st), st.screen === 'khums' && this.renderKhums(st), st.screen === 'stories' && this.renderStories(st)), showNav && /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0,
        textAlign: 'center',
        padding: '5px 16px',
        fontSize: 10.5,
        color: st.dark ? '#5a6060' : '#b1a690',
        background: st.dark ? '#16191a' : '#f6f1e7',
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
    }, "×")), showNav && this.renderNav(st), st.story !== null && this.renderStoryViewer(st), st.ytPlayer && this.renderYtPlayer(st), st.toast && this.renderToast(st.toast));
  }
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
