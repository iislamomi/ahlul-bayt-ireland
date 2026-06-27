function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == typeof i ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != typeof t || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != typeof i) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
const {
  Component
} = React;

/* ── HIJRI DATE ── */
function toHijri(date) {
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
  const M = ['Muḥarram', 'Ṣafar', 'Rabīʿ al-Awwal', 'Rabīʿ al-Thānī', 'Jumādā al-Ūlā', 'Jumādā al-Ākhira', 'Rajab', 'Shaʿbān', 'Ramaḍān', 'Shawwāl', 'Dhū al-Qaʿda', 'Dhū al-Ḥijja'];
  return `${hd} ${M[hm - 1]} ${hy}`;
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
}, {
  id: 'icci',
  name: 'Islamic Centre Ireland',
  sub: 'ICCI Dublin · Ḥanafī',
  prayers: [{
    name: 'Fajr',
    en: 'Dawn',
    ar: 'الفجر',
    glyph: 'ﭐ',
    time: '03:15'
  }, {
    name: 'Sunrise',
    en: 'Shurūq',
    ar: 'الشروق',
    glyph: '✷',
    time: '04:52'
  }, {
    name: 'Dhuhr',
    en: 'Noon',
    ar: 'الظهر',
    glyph: 'ﭖ',
    time: '13:27'
  }, {
    name: 'Sunset',
    en: 'Ghurūb',
    ar: 'الغروب',
    glyph: '✸',
    time: '21:53'
  }, {
    name: 'Maghrib',
    en: 'Dusk',
    ar: 'المغرب',
    glyph: 'ﮊ',
    time: '22:08'
  }, {
    name: 'Midnight',
    en: 'Muntaṣaf',
    ar: 'منتصف الليل',
    glyph: '☾',
    time: '01:02'
  }]
}, {
  id: 'mwl',
  name: 'Muslim World League',
  sub: 'MWL method · Shāfiʿī',
  prayers: [{
    name: 'Fajr',
    en: 'Dawn',
    ar: 'الفجر',
    glyph: 'ﭐ',
    time: '03:10'
  }, {
    name: 'Sunrise',
    en: 'Shurūq',
    ar: 'الشروق',
    glyph: '✷',
    time: '04:54'
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
    time: '21:57'
  }, {
    name: 'Maghrib',
    en: 'Dusk',
    ar: 'المغرب',
    glyph: 'ﮊ',
    time: '22:12'
  }, {
    name: 'Midnight',
    en: 'Muntaṣaf',
    ar: 'منتصف الليل',
    glyph: '☾',
    time: '01:03'
  }]
}];
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
const KIDS_QUOTES = [{
  ar: 'طَلَبُ الْعِلْمِ فَرِيضَةٌ',
  tr: 'Seeking knowledge is an obligation.',
  who: 'Prophet Muḥammad ﷺ'
}, {
  ar: 'أَحْسِنْ إِلَى وَالِدَيْكَ',
  tr: 'Be kind to your parents.',
  who: "Imam ʿAlī ؏"
}];
const DUAS = [{
  title: 'Duʿāʾ Kumayl',
  cat: 'Weekly',
  ar: 'اللّٰهُمَّ إِنِّي أَسْأَلُكَ بِرَحْمَتِكَ الَّتِي وَسِعَتْ كُلَّ شَيْءٍ',
  tr: 'O Allah, I ask You by Your mercy, which embraces all things.',
  note: 'Traditionally recited on Thursday nights.',
  body: 'O Allah, I ask You by Your mercy, which embraces all things; and by Your strength, through which You dominate all things, and towards which all things are humble and before which all things are lowly.'
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
const CLASSIFIEDS = [{
  name: 'SoftEire Technology Limited',
  cat: 'Services',
  desc: 'SoftEire helps Irish SMEs use AI to reduce labour cost, automate customer support, and save money. Call us today for a free business audit.',
  loc: 'Dublin',
  web: 'https://www.softeire.com',
  phone: '+353892703646',
  wa: '353892281688',
  ink: '#3a4a78',
  tint: '#e8ebf4'
}, {
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
    English: 'Books',
    'العربية': 'كتب',
    'हिन्दी': 'किताबें',
    'فارسی': 'کتاب‌ها',
    Urdu: 'کتابیں'
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

/* ── SUPABASE SYNC ── */
const SB_URL = 'https://zwpimotdtuhbpwjcooiz.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3cGltb3RkdHVoYnB3amNvb2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1ODIxMTUsImV4cCI6MjA5ODE1ODExNX0.BEdbAK9_lquFL8WyWwOU_DQ1bGbwzSpO9A54kKQxZFU';
const SB_HEADS = { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' };

const SB_KEY_MAP = {
  stories: 'liveStories', classifieds: 'liveClassifieds', events: 'liveEvents',
  announcement: 'liveAnnouncement', pinned: 'livePinned',
  kidsVideos: 'liveKidsVideos', kidsBooks: 'liveKidsBooks', kidsQuotes: 'liveKidsQuotes',
  prayerPresets: 'livePrayerPresets', calEvents: 'liveCalEvents',
  healthTips: 'liveHealthTips', healthVideos: 'liveHealthVideos'
};

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
      dark: false,
      textSize: 1,
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
      notifEnabled: lsGet('notifEnabled', false),
      adhanPlaying: false,
      adhanPending: false,
      notifPermission: typeof Notification !== 'undefined' ? Notification.permission : 'default',
      qiblaStatus: 'idle',
      qiblaBearing: null,
      qiblaLat: null,
      qiblaLng: null,
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
      liveStories: lsGet('stories', STORIES),
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
      liveHealthTips: lsGet('healthTips', HEALTH_TIPS),
      liveHealthVideos: lsGet('healthVideos', HEALTH_VIDEOS)
    });
    _defineProperty(this, "go", s => this.setState({
      screen: s,
      story: null
    }));
    _defineProperty(this, "openReading", (type, item) => this.setState({
      screen: 'reading',
      readingType: type,
      readingItem: item
    }));
    _defineProperty(this, "t", key => {
      const lang = this.state.lang;
      const s = STRINGS[key];
      if (!s) return key;
      return s[lang] !== undefined ? s[lang] : s['English'] ?? key;
    });
    _defineProperty(this, "getActivePrayers", () => {
      const presets = this.state.livePrayerPresets || PRAYER_PRESETS;
      const preset = presets.find(p => p.id === this.state.prayerPreset) || presets[0];
      return preset.prayers;
    });
    _defineProperty(this, "saveContent", (key, stateKey, data) => {
      lsSet(key, data);
      sbSave(key, data);
      this.setState({ [stateKey]: data });
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
    _defineProperty(this, "playAdhan", () => {
      this.stopAdhan();
      this.adhanAudio = new Audio('./adhan.mp3');
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
      if (adhanEnabled) this.playAdhan();
      if (notifEnabled && Notification.permission === 'granted') {
        const title = `${match.name} · Prayer Time`;
        const opts = {
          body: `${match.en} prayer — ${match.time} · Dublin, Ireland`,
          tag: 'prayer-alert',
          renotify: true
        };
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.ready.then(reg => reg.showNotification(title, opts)).catch(() => {
            try {
              new Notification(title, opts);
            } catch (e) {}
          });
        } else {
          try {
            new Notification(title, opts);
          } catch (e) {}
        }
      }
      this.showToast(`${match.name} — ${match.time}`);
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
      if (perm === 'granted') this.showToast('Notifications enabled');else if (perm === 'denied') this.showToast('Notifications blocked — check browser settings');
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
    _defineProperty(this, "openStory", i => {
      clearInterval(this.storyTimer);
      this.setState({
        story: i,
        storyProg: 0,
        quizPick: null
      });
      this.storyTimer = setInterval(() => {
        this.setState(st => {
          if (st.story === null) return {};
          if (STORIES[st.story] && STORIES[st.story].kind === 'quiz') return {};
          const np = st.storyProg + 0.6;
          if (np >= 100) {
            if (st.story < STORIES.length - 1) return {
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
      if (this.state.story > 0) this.openStory(this.state.story - 1);
    });
    _defineProperty(this, "nextStory", () => {
      if (this.state.story < STORIES.length - 1) this.openStory(this.state.story + 1);else this.closeStory();
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
    }, 1000);
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
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
        if (data[key] !== undefined) { update[stateKey] = data[key]; lsSet(key, data[key]); }
      });
      if (Object.keys(update).length > 0) this.setState(update);
    };
    sbLoadAll().then(applyRemoteData);
    this.refreshTimer = setInterval(() => sbLoadAll().then(applyRemoteData), 30 * 60 * 1000);
  }
  componentWillUnmount() {
    clearInterval(this.clockTimer);
    clearInterval(this.storyTimer);
    clearInterval(this.refreshTimer);
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
      title: 'Nahj al-Balāgha',
      sub: 'Sermons · Letters · Sayings',
      glyph: 'ﻥ',
      tint: '#e6efe9',
      ink: '#2c5d52',
      span: '2',
      go: () => this.setState({
        screen: 'library',
        libTab: 'nahj',
        libCat: 'All'
      })
    }, {
      title: 'Duʿāʾ',
      sub: 'Supplications',
      glyph: 'ﺀ',
      tint: '#f3ecd9',
      ink: '#9a7a2c',
      span: '1',
      go: () => this.setState({
        screen: 'library',
        libTab: 'dua',
        libCat: 'All'
      })
    }, {
      title: 'Ziyārah',
      sub: 'Salutations',
      glyph: 'ﺯ',
      tint: '#f3e6e8',
      ink: '#6e2230',
      span: '1',
      go: () => this.setState({
        screen: 'library',
        libTab: 'ziyarah',
        libCat: 'All'
      })
    }, {
      title: this.t('kids.title'),
      sub: 'Books · videos · quizzes',
      glyph: 'ﻙ',
      tint: '#f3ecd9',
      ink: '#b8923f',
      span: '1',
      go: () => this.go('kids')
    }, {
      title: this.t('more.health'),
      sub: 'Tips & wellness videos',
      glyph: '♡',
      tint: '#e6efe9',
      ink: '#2c5d52',
      span: '1',
      go: () => this.go('health')
    }, {
      title: this.t('qibla.title'),
      sub: this.t('more.qiblaSub'),
      glyph: 'ﻕ',
      tint: '#e6efe9',
      ink: '#1f5145',
      span: '1',
      go: () => this.go('qibla')
    }, {
      title: this.t('cal.title'),
      sub: 'Events & Hijri dates',
      glyph: 'ﮬ',
      tint: '#e8ebf4',
      ink: '#3a4a78',
      span: '1',
      go: () => this.go('calendar')
    }];
    const now = st.now;
    const todayD = now.getDate();
    const calY = now.getFullYear(),
      calM = now.getMonth();
    const todayStr = `${calY}-${String(calM + 1).padStart(2, '0')}-${String(todayD).padStart(2, '0')}`;
    const todayEvent = (st.liveCalEvents || []).find(e => e.date === todayStr);
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
    }, "×")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        padding: '10px 0 18px'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: st.dark ? '#8e9490' : '#9a8f7c',
        fontWeight: 500,
        letterSpacing: .2
      }
    }, salaam), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 25,
        fontWeight: 600,
        color: st.dark ? '#ece6d8' : '#27241f',
        lineHeight: 1.15,
        marginTop: 3
      }
    }, "Ahlul Bayt Ireland")), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 44,
        height: 44,
        borderRadius: 14,
        background: 'linear-gradient(150deg,#23564a,#16463a)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 14px -4px rgba(22,70,58,.5)',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 20,
        height: 20,
        borderRadius: '50%',
        boxShadow: 'inset -6px 0 0 0 #d8b863'
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 10,
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 16,
        padding: '13px 15px'
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
      style: {
        flex: 1,
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 16,
        padding: '13px 15px'
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
    }, hijri))), /*#__PURE__*/React.createElement("div", {
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
      onClick: () => this.openStory(0),
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
    }, st.liveStories.map((s, i) => /*#__PURE__*/React.createElement("div", {
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
        background: s.img || s.color,
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
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'Amiri,serif',
        fontSize: 27,
        color: 'rgba(255,255,255,.95)',
        position: 'relative'
      },
      dir: "rtl"
    }, s.initial))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        color: '#6f675a',
        marginTop: 6,
        lineHeight: 1.2,
        fontWeight: 600
      }
    }, s.short)))), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.go('classifieds'),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 13,
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 16,
        padding: '13px 16px',
        cursor: 'pointer',
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 40,
        height: 40,
        borderRadius: 12,
        background: '#f3ecd9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'Amiri,serif',
        fontSize: 20,
        color: '#9a7a2c'
      },
      dir: "rtl"
    }, "ﺱ")), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14.5,
        fontWeight: 700,
        color: '#2c2823'
      }
    }, this.t('home.classTitle')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: '#9a8f7c',
        marginTop: 1
      }
    }, this.t('home.classSub'))), /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#bba35f',
        fontSize: 18
      }
    }, "›")), /*#__PURE__*/React.createElement("div", {
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
        borderRadius: 18,
        padding: '6px 4px',
        marginBottom: 22
      }
    }, prayers.map(p => /*#__PURE__*/React.createElement("div", {
      key: p.name,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '11px 16px',
        borderBottom: p.last ? 'none' : '1px solid #f3ecdd'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'Amiri,serif',
        fontSize: 17,
        color: '#bba35f',
        width: 22,
        textAlign: 'center'
      },
      dir: "rtl"
    }, p.glyph), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15,
        color: p.isNext ? '#1f5145' : '#3f3a32',
        fontWeight: p.isNext ? 700 : 500
      }
    }, p.name)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 15,
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
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        marginBottom: 14
      }
    }, quickCards.map((q, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: q.go,
      style: {
        gridColumn: `span ${q.span}`,
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 18,
        padding: 16,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        minHeight: 96,
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 38,
        height: 38,
        borderRadius: 11,
        background: q.tint,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: 'Amiri,serif',
        fontSize: 18,
        color: q.ink
      },
      dir: "rtl"
    }, q.glyph)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: '#2c2823'
      }
    }, q.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: '#9a8f7c',
        marginTop: 2
      }
    }, q.sub))))), st.livePinned.on && st.livePinned.text && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 13,
        alignItems: 'flex-start',
        background: st.livePinned.color,
        borderRadius: 18,
        padding: '14px 16px',
        marginBottom: 14,
        boxShadow: `0 6px 18px -8px ${st.livePinned.color}99`
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
        display: 'flex',
        gap: 13,
        alignItems: 'flex-start',
        background: 'linear-gradient(120deg,#faf4e6,#f6efe0)',
        border: '1px solid #ecdfc2',
        borderRadius: 18,
        padding: '15px 16px',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0,
        width: 34,
        height: 34,
        borderRadius: 10,
        background: '#e8d39a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#7a5d18',
        fontWeight: 700,
        fontFamily: 'Spectral,serif'
      }
    }, "!"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
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
    }, st.liveAnnouncement.body))), st.install && /*#__PURE__*/React.createElement("div", {
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
    }, this.t('home.add'))));
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
    const livePresets = st.livePrayerPresets || PRAYER_PRESETS;
    const activePreset = livePresets.find(p => p.id === st.prayerPreset) || livePresets[0];
    const monthFajr = ['03:28', '03:29', '03:29', '03:30', '03:31', '03:32', '03:33', '03:34'];
    const monthMaghrib = ['22:16', '22:16', '22:17', '22:17', '22:17', '22:18', '22:18', '22:18'];
    const monthRows = Array.from({
      length: 8
    }, (_, i) => ({
      day: `${i + 18} Jun`,
      fajr: monthFajr[i],
      dhuhr: '13:26',
      maghrib: monthMaghrib[i],
      today: i === 0
    }));
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
        padding: '8px 0 16px'
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
    }, p.en))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18,
        color: p.isNext ? '#1f5145' : '#3f3a32',
        fontWeight: p.isNext ? 700 : 500,
        fontVariantNumeric: 'tabular-nums'
      }
    }, p.time))))), tab === 'month' && /*#__PURE__*/React.createElement("div", {
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
    }, m.maghrib)))), tab === 'settings' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: .7,
        textTransform: 'uppercase',
        color: '#a2967f',
        marginBottom: 10
      }
    }, this.t('prayer.source')), (st.livePrayerPresets || PRAYER_PRESETS).map(preset => {
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
    }))), st.adhanEnabled && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginTop: 12
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
    const libMeta = {
      dua: {
        title: "Duʿāʾ",
        accent: '#9a7a2c',
        tint: '#f3ecd9',
        list: DUAS,
        cats: ['All', 'Daily', 'Weekly', 'Morning', 'Monthly']
      },
      ziyarah: {
        title: 'Ziyārah',
        accent: '#6e2230',
        tint: '#f3e6e8',
        list: ZIYARAT,
        cats: ['All', 'Imam Ḥusayn', "The Aʾimmah", 'General']
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
        const qOk = !q || it.title.toLowerCase().includes(q) || it.tr.toLowerCase().includes(q);
        return catOk && qOk;
      });
    }
    let nahjCards = [];
    if (st.libTab === 'nahj') {
      nahjCards = NAHJ[st.nahjTab].filter(it => !q || it.title.toLowerCase().includes(q) || it.tr.toLowerCase().includes(q));
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
        padding: '8px 0 14px'
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
        gap: 8,
        marginBottom: 16
      }
    }, [['dua', "Duʿāʾ"], ['ziyarah', 'Ziyārah'], ['nahj', 'Nahj']].map(([k, label]) => /*#__PURE__*/React.createElement("div", {
      key: k,
      onClick: () => this.setState({
        libTab: k,
        libQuery: '',
        libCat: 'All'
      }),
      style: tabStyle(k)
    }, label))), /*#__PURE__*/React.createElement("div", {
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
    }, "×")), libCards.length > 0 && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.openReading(st.libTab, libCards[0]),
      style: {
        background: lm.tint,
        border: `1px solid ${lm.accent}44`,
        borderRadius: 18,
        padding: '16px 17px',
        cursor: 'pointer',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: lm.accent,
        marginBottom: 8
      }
    }, "Open · ", libCards[0].cat), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 18,
        fontWeight: 600,
        color: '#2c2823'
      }
    }, libCards[0].title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Amiri,serif',
        fontSize: 17,
        color: '#6f675a',
        marginTop: 6,
        lineHeight: 1.7
      },
      dir: "rtl"
    }, libCards[0].ar), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: '#9a8f7c',
        marginTop: 5,
        lineHeight: 1.4
      }
    }, libCards[0].tr)), lm.cats.length > 0 && /*#__PURE__*/React.createElement("div", {
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
    }, label))), libCards.length > 1 && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, libCards.slice(1).map((d, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => this.openReading(st.libTab, d),
      style: {
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 18,
        padding: '16px 17px',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 9
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10.5,
        letterSpacing: .8,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: lm.accent,
        background: lm.tint,
        padding: '4px 9px',
        borderRadius: 7
      }
    }, d.cat), /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#cdbf9e',
        fontSize: 18
      }
    }, "→")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 18,
        fontWeight: 600,
        color: '#2c2823'
      }
    }, d.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Amiri,serif',
        fontSize: 19,
        color: '#6f675a',
        marginTop: 7,
        lineHeight: 1.7
      },
      dir: "rtl"
    }, d.ar), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: '#9a8f7c',
        marginTop: 6,
        lineHeight: 1.45
      }
    }, d.tr)))), nahjCards.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 12
      }
    }, nahjCards.map((n, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => this.openReading('nahj', n),
      style: {
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 18,
        padding: '16px 17px',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        letterSpacing: .6,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#2c5d52'
      }
    }, n.ref), /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#cdbf9e',
        fontSize: 18
      }
    }, "→")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 18,
        fontWeight: 600,
        color: '#2c2823',
        marginTop: 5
      }
    }, n.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        color: '#7a7264',
        marginTop: 7,
        lineHeight: 1.5
      }
    }, n.tr), n.sum && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: '#9a8f7c',
        marginTop: 9,
        paddingTop: 9,
        borderTop: '1px solid #f1ebdd',
        fontStyle: 'italic'
      }
    }, n.sum)))), libCards.length === 0 && nahjCards.length === 0 && (q || st.libCat !== 'All') && /*#__PURE__*/React.createElement("div", {
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
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: '100%',
        background: rd.bg
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'sticky',
        top: 0,
        zIndex: 4,
        background: rd.barBg,
        backdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${rd.border}`,
        padding: '12px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({
        screen: 'library'
      }),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        cursor: 'pointer',
        color: rd.accent,
        fontSize: 14,
        fontWeight: 600
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 18
      }
    }, "‹"), " ", this.t('lib.back')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState(s => ({
        textSize: Math.max(.85, s.textSize - .12)
      })),
      style: {
        width: 34,
        height: 34,
        borderRadius: 10,
        border: `1px solid ${rd.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: rd.text,
        fontSize: 13,
        cursor: 'pointer',
        background: rd.surf
      }
    }, "A−"), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState(s => ({
        textSize: Math.min(1.5, s.textSize + .12)
      })),
      style: {
        width: 34,
        height: 34,
        borderRadius: 10,
        border: `1px solid ${rd.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: rd.text,
        fontSize: 17,
        cursor: 'pointer',
        background: rd.surf
      }
    }, "A+"), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState(s => ({
        dark: !s.dark
      })),
      style: {
        width: 34,
        height: 34,
        borderRadius: 10,
        border: `1px solid ${rd.border}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        background: rd.surf
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "17",
      height: "17",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: rd.accent,
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M20 14a8 8 0 1 1-9.8-9.6A6.5 6.5 0 0 0 20 14z"
    }))))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '22px 22px 100px'
      },
      className: "afu"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: readAccent
      }
    }, kicker), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 27,
        fontWeight: 600,
        color: rd.text,
        marginTop: 6,
        lineHeight: 1.2
      }
    }, r.title), r.note && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: rd.muted,
        marginTop: 7,
        fontStyle: 'italic'
      }
    }, r.note), r.ar && /*#__PURE__*/React.createElement("div", {
      style: {
        background: rd.surf,
        border: `1px solid ${rd.border}`,
        borderRadius: 20,
        padding: '26px 22px',
        marginTop: 22
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Amiri,serif',
        fontSize: arSize,
        lineHeight: 2.1,
        color: rd.arInk,
        textAlign: 'center'
      },
      dir: "rtl"
    }, r.ar)), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 22
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: rd.muted
      }
    }, this.t('lib.translation')), /*#__PURE__*/React.createElement("span", {
      style: {
        flex: 1,
        height: 1,
        background: rd.border
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: trSize,
        lineHeight: 1.85,
        color: rd.text
      }
    }, r.body), r.sum && /*#__PURE__*/React.createElement("div", {
      style: {
        background: rd.surf,
        border: `1px solid ${rd.border}`,
        borderRadius: 16,
        padding: '15px 17px',
        marginTop: 20
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: rd.muted,
        marginBottom: 6
      }
    }, this.t('lib.summary')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14,
        lineHeight: 1.6,
        color: rd.text
      }
    }, r.sum))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        marginTop: 26
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: this.handleShare,
      style: {
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        padding: 14,
        borderRadius: 14,
        background: readAccent,
        color: '#fffdf9',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.9",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "18",
      cy: "5",
      r: "2.6"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "6",
      cy: "12",
      r: "2.6"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "18",
      cy: "19",
      r: "2.6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8.3 10.7l7.4-4.4M8.3 13.3l7.4 4.4"
    })), this.t('lib.share')), /*#__PURE__*/React.createElement("div", {
      onClick: this.handleBookmark,
      style: {
        width: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 14,
        border: `1px solid ${rd.border}`,
        background: isBookmarked ? rd.surf : rd.surf,
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "18",
      height: "18",
      viewBox: "0 0 24 24",
      fill: isBookmarked ? readAccent : 'none',
      stroke: readAccent,
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M6 4h12v16l-6-4-6 4z"
    }))))));
  }

  /* ── CLASSIFIEDS ── */
  renderClassifieds(st) {
    const allLabel = this.t('class.all');
    const cats = [allLabel, 'Food', 'Butcher', 'Travel', 'Education', 'Services'];
    const q = st.classQuery.trim().toLowerCase();
    const cards = st.liveClassifieds.filter(c => st.classCat === allLabel || st.classCat === 'All' || c.cat === st.classCat).filter(c => !q || c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
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
        padding: '8px 0 14px'
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
        padding: '8px 0 16px'
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
      onClick: () => this.setState(s => ({
        dark: !s.dark
      })),
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
      onClick: () => this.setState(s => ({
        textSize: Math.max(.85, s.textSize - .12)
      })),
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
      onClick: () => this.setState(s => ({
        textSize: Math.min(1.5, s.textSize + .12)
      })),
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
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 60,
        height: 60,
        borderRadius: 18,
        background: 'linear-gradient(150deg,#23564a,#16463a)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 26,
        height: 26,
        borderRadius: '50%',
        boxShadow: 'inset -7px 0 0 0 #d8b863'
      }
    })), /*#__PURE__*/React.createElement("div", {
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
    const EVENT_TYPES = ['Community', 'Majlis', 'Class', 'Programme'];
    const EVENT_COLORS = {
      'Community': '#1f5145',
      'Majlis': '#6e2230',
      'Class': '#9a7a2c',
      'Programme': '#2c5d52'
    };
    const EVENT_TINTS = {
      'Community': '#e6efe9',
      'Majlis': '#f3e6e8',
      'Class': '#f3ecd9',
      'Programme': '#e6efe9'
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
      label: 'Announcement'
    }, {
      id: 'pinned',
      label: 'Pinned Msg'
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
        }), /*#__PURE__*/React.createElement("input", {
          value: d.initial || '',
          onChange: e => this.setDraft({
            initial: e.target.value
          }),
          placeholder: "Circle letter (Arabic)",
          maxLength: 4,
          style: inp
        }), /*#__PURE__*/React.createElement("input", {
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
        }, COLOR_NAMES[c]))), isQuiz && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("input", {
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
      }, /*#__PURE__*/React.createElement("span", {
        style: {
          fontFamily: 'Amiri,serif',
          fontSize: 18,
          color: 'rgba(255,255,255,.9)'
        }
      }, s.initial)), /*#__PURE__*/React.createElement("div", {
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
      }, s.kind, " · ", s.short)), btn('Edit', () => this.startEdit(i, {
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
          const list = [...st.liveClassifieds];
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
      }), st.liveClassifieds.map((c, i) => /*#__PURE__*/React.createElement("div", {
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
        const a = [...st.liveClassifieds];
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
            date: d.date || ''
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

    /* ─ PRAYER TIMES ─ */
    const renderPrayersSection = () => {
      const presets = st.livePrayerPresets || PRAYER_PRESETS;
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
      }, "Tap a source to edit its prayer times."), presets.map((p, i) => /*#__PURE__*/React.createElement("div", {
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
        }, "Edit Announcement"), /*#__PURE__*/React.createElement("input", {
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
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 10
          }
        }, btn('Save', () => save('announcement', 'liveAnnouncement', {
          title: d.title || '',
          body: d.body || ''
        }, 'Announcement saved!'), {
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
      return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          background: 'linear-gradient(120deg,#faf4e6,#f6efe0)',
          border: '1px solid #ecdfc2',
          borderRadius: 14,
          padding: '14px',
          marginBottom: 14
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
      }, a.body)), btn('Edit Announcement', () => this.startEdit(0, {
        title: a.title,
        body: a.body
      }), {
        background: '#1f5145',
        color: '#f3ead4',
        width: '100%'
      }));
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
          const save2 = () => {
            const a = [...st.liveKidsVideos];
            const it = {
              title: d.title || '',
              meta: d.meta || '',
              color: d.color || '#1f5145'
            };
            if (isNew) a.push(it);else a[st.adminEditIdx] = it;
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
          }), /*#__PURE__*/React.createElement("select", {
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
      const kTabs = [{
        id: 'videos',
        label: 'Videos'
      }, {
        id: 'books',
        label: 'Books'
      }, {
        id: 'quotes',
        label: 'Quotes'
      }];
      const ks = d._sub || 'videos';
      const list = ks === 'videos' ? st.liveKidsVideos : ks === 'books' ? st.liveKidsBooks : st.liveKidsQuotes;
      const getLabel = (it, i) => ks === 'videos' ? it.title : ks === 'books' ? it.title : it.tr;
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
      }, t.label))), btn(`+ Add ${ks.slice(0, -1).charAt(0).toUpperCase() + ks.slice(0, -1).slice(1)}`, () => this.startEdit(-1, {
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
        const kk = ks === 'videos' ? 'kidsVideos' : ks === 'books' ? 'kidsBooks' : 'kidsQuotes';
        const sk = ks === 'videos' ? 'liveKidsVideos' : ks === 'books' ? 'liveKidsBooks' : 'liveKidsQuotes';
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
          const save2 = () => {
            const a = [...(st.liveHealthVideos || [])];
            const it = {
              title: d.title || '',
              meta: d.meta || '',
              color: d.color || '#1f5145'
            };
            if (isNew) a.push(it);else a[st.adminEditIdx] = it;
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
          }), /*#__PURE__*/React.createElement("select", {
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
    const sectionContent = {
      stories: renderStoriesSection,
      classifieds: renderClassifiedsSection,
      events: renderEventsSection,
      prayers: renderPrayersSection,
      announcement: renderAnnouncementSection,
      pinned: renderPinnedSection,
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
        marginBottom: 10
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
      onClick: () => this.setState({
        adminLoggedIn: false
      }),
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: '#6e2230',
        cursor: 'pointer'
      }
    }, "Log out")), /*#__PURE__*/React.createElement("div", {
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
        padding: '16px 20px 110px'
      }
    }, sectionContent[sec]()));
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
    const eventsByDay = {};
    (st.liveCalEvents || []).forEach(e => {
      const [ey, em, ed] = (e.date || '').split('-').map(Number);
      if (ey === calY && em === calM + 1) eventsByDay[ed] = e;
    });
    const selDay = st.calDay || (isCurrentMonth ? todayD : 1);
    const selEvent = eventsByDay[selDay];
    const selDayDate = new Date(calY, calM, selDay);
    const selDayGreg = selDayDate.toLocaleDateString('en-IE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
    const selHijri = toHijri(selDayDate);
    const calEventList = Object.keys(eventsByDay).map(d => ({
      day: +d,
      ...eventsByDay[d],
      dateLabel: new Date(calY, calM, +d).toLocaleDateString('en-IE', {
        day: 'numeric',
        month: 'short'
      })
    })).sort((a, b) => a.day - b.day);
    const weekHead = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const hijriMonthYear = toHijri(new Date(calY, calM, 15)).split(' ').slice(1).join(' ');
    const cells = [];
    for (let i = 0; i < firstWeekday; i++) cells.push({
      blank: true,
      key: 'b' + i
    });
    for (let d = 1; d <= daysInMonth; d++) {
      const ev = eventsByDay[d];
      const isToday = isCurrentMonth && d === todayD;
      const sel = selDay === d;
      const hijriDay = toHijri(new Date(calY, calM, d)).split(' ')[0];
      cells.push({
        blank: false,
        key: 'd' + d,
        day: d,
        hijriDay,
        bg: sel ? '#1f5145' : isToday ? '#e6efe9' : 'transparent',
        ink: sel ? '#fffdf9' : isToday ? '#1f5145' : '#3f3a32',
        hijriInk: sel ? 'rgba(255,255,255,.55)' : '#c2a35a',
        dot: ev ? ev.color : 'transparent'
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
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 20px 100px'
      },
      className: "afu"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '8px 0 16px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: '#9a8f7c',
        fontWeight: 500
      }
    }, this.t('cal.community')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 26,
        fontWeight: 600,
        color: '#27241f',
        marginTop: 2
      }
    }, this.t('cal.title'))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => canPrev && goMonth(0, -1),
      style: {
        width: 36,
        height: 36,
        borderRadius: 10,
        background: canPrev ? '#fffdf9' : '#f5f0e8',
        border: '1px solid #ece4d4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: canPrev ? 'pointer' : 'default',
        color: canPrev ? '#2c2823' : '#c9bfae',
        fontSize: 18,
        fontWeight: 700
      }
    }, "‹"), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 19,
        fontWeight: 700,
        color: '#2c2823'
      }
    }, monthName), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: '#9a7a2c',
        fontWeight: 500,
        marginTop: 1
      }
    }, hijriMonthYear)), /*#__PURE__*/React.createElement("div", {
      onClick: () => canNext && goMonth(0, 1),
      style: {
        width: 36,
        height: 36,
        borderRadius: 10,
        background: canNext ? '#fffdf9' : '#f5f0e8',
        border: '1px solid #ece4d4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: canNext ? 'pointer' : 'default',
        color: canNext ? '#2c2823' : '#c9bfae',
        fontSize: 18,
        fontWeight: 700
      }
    }, "›")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7,1fr)',
        marginBottom: 4
      }
    }, weekHead.map((w, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        textAlign: 'center',
        fontSize: 11,
        fontWeight: 700,
        color: '#b1a690'
      }
    }, w))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: 'repeat(7,1fr)',
        gap: 3,
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 18,
        padding: 8
      }
    }, cells.map(c => c.blank ? /*#__PURE__*/React.createElement("div", {
      key: c.key
    }) : /*#__PURE__*/React.createElement("div", {
      key: c.key,
      onClick: () => this.setState({
        calDay: c.day
      }),
      style: {
        aspectRatio: '1',
        borderRadius: 11,
        background: c.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        position: 'relative',
        gap: 1
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: c.ink,
        lineHeight: 1
      }
    }, c.day), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 8.5,
        fontWeight: 500,
        color: c.hijriInk,
        lineHeight: 1
      }
    }, c.hijriDay), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        bottom: 3,
        width: 4,
        height: 4,
        borderRadius: '50%',
        background: c.dot
      }
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 18,
        padding: 17,
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: '#2c2823'
      }
    }, selDayGreg), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: '#9a7a2c',
        fontWeight: 500,
        marginTop: 3
      }
    }, selHijri, " AH"), selEvent ? /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
        marginTop: 14,
        paddingTop: 14,
        borderTop: '1px solid #f1ebdd'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0,
        width: 38,
        height: 38,
        borderRadius: 11,
        background: selEvent.tint,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 11,
        height: 11,
        borderRadius: '50%',
        background: selEvent.color
      }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        letterSpacing: .7,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: selEvent.color
      }
    }, selEvent.type), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: '#2c2823',
        marginTop: 2
      }
    }, selEvent.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12.5,
        color: '#7a7264',
        marginTop: 4,
        lineHeight: 1.5
      }
    }, selEvent.desc)), st.adminLoggedIn && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({
        screen: 'admin',
        adminSection: 'events',
        adminEditIdx: null,
        adminEditDraft: {
          date: `${calY}-${String(calM + 1).padStart(2, '0')}-${String(selDay).padStart(2, '0')}`,
          type: selEvent.type,
          title: selEvent.title,
          desc: selEvent.desc
        }
      }),
      style: {
        flexShrink: 0,
        fontSize: 11,
        color: '#1f5145',
        fontWeight: 600,
        cursor: 'pointer',
        padding: '4px 8px',
        border: '1px solid #c4ddd7',
        borderRadius: 8,
        background: '#eef7f4'
      }
    }, "Edit")) : /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: '#b1a690'
      }
    }, this.t('cal.noEvent')), st.adminLoggedIn && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({
        screen: 'admin',
        adminSection: 'events',
        adminEditIdx: -1,
        adminEditDraft: {
          date: `${calY}-${String(calM + 1).padStart(2, '0')}-${String(selDay).padStart(2, '0')}`,
          type: 'Community'
        }
      }),
      style: {
        fontSize: 11,
        color: '#1f5145',
        fontWeight: 600,
        cursor: 'pointer',
        padding: '5px 10px',
        border: '1px solid #c4ddd7',
        borderRadius: 8,
        background: '#eef7f4'
      }
    }, "+ Add event"))), calEventList.length > 0 && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: '#b1a690',
        margin: '22px 0 12px'
      }
    }, this.t('cal.upcoming')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 10
      }
    }, calEventList.map((e, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => this.setState({
        calDay: e.day
      }),
      style: {
        display: 'flex',
        gap: 13,
        alignItems: 'center',
        background: '#fffdf9',
        border: '1px solid #ece4d4',
        borderRadius: 15,
        padding: '13px 15px',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0,
        width: 46,
        textAlign: 'center',
        borderRight: '1px solid #f1ebdd',
        paddingRight: 11
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 18,
        fontWeight: 700,
        color: e.color,
        lineHeight: 1
      }
    }, e.day), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        color: '#a89d88',
        marginTop: 2
      }
    }, e.dateLabel)), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        letterSpacing: .6,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: e.color
      }
    }, e.type), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14.5,
        fontWeight: 600,
        color: '#2c2823',
        marginTop: 1
      }
    }, e.title)))))), st.adminLoggedIn && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({
        screen: 'admin',
        adminSection: 'events',
        adminEditIdx: null,
        adminEditDraft: {}
      }),
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        marginTop: 22,
        padding: '12px',
        borderRadius: 14,
        border: '1px dashed #c4ddd7',
        background: '#f4fbf8',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#1f5145',
        fontSize: 14,
        fontWeight: 600
      }
    }, "⚙ Manage Calendar Events")), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        fontSize: 11.5,
        color: '#a89d88',
        lineHeight: 1.5,
        padding: '18px 24px 0'
      }
    }, "Events are managed by Ahlul Bayt Ireland."));
  }

  /* ── KIDS CORNER ── */
  renderKids(st) {
    const kt = st.kidsTab || 'videos';
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
        padding: '8px 0 16px'
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
    }, this.t('kids.title'))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        background: '#efe7d7',
        borderRadius: 14,
        padding: 4,
        marginBottom: 18
      }
    }, [['videos', this.t('kids.videos')], ['books', this.t('kids.books')], ['wisdom', this.t('kids.wisdom')]].map(([k, label]) => /*#__PURE__*/React.createElement("div", {
      key: k,
      onClick: () => this.setState({
        kidsTab: k
      }),
      style: tabStyle(k)
    }, label))), kt === 'videos' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 20,
        aspectRatio: '16/10',
        background: 'linear-gradient(150deg,#2a6a58,#143b2f)',
        marginBottom: 10,
        cursor: 'pointer',
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
    }, this.t('kids.videos')), /*#__PURE__*/React.createElement("div", {
      className: "s",
      style: {
        display: 'flex',
        gap: 13,
        overflowX: 'auto',
        margin: '0 -20px 24px',
        padding: '0 20px 4px'
      }
    }, st.liveKidsVideos.map((v, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flexShrink: 0,
        width: 170,
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        aspectRatio: '16/10',
        borderRadius: 15,
        overflow: 'hidden',
        background: v.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(135deg,rgba(255,255,255,.05) 0 10px,transparent 10px 20px)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 40,
        height: 40,
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
        borderLeft: '13px solid #1f5145',
        borderTop: '8px solid transparent',
        borderBottom: '8px solid transparent',
        marginLeft: 3
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        fontWeight: 600,
        color: '#2c2823',
        marginTop: 8,
        lineHeight: 1.3
      }
    }, v.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: '#9a8f7c',
        marginTop: 2
      }
    }, v.meta))))), kt === 'wisdom' && /*#__PURE__*/React.createElement("div", {
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
        marginTop: 12
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
    }, "— ", q.who)))), kt === 'books' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 17,
        fontWeight: 600,
        color: '#2c2823',
        marginBottom: 12
      }
    }, this.t('kids.books')), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 12,
        marginBottom: 24
      }
    }, st.liveKidsBooks.map((b, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        aspectRatio: '3/4',
        borderRadius: 14,
        background: b.color,
        display: 'flex',
        alignItems: 'flex-end',
        padding: 14,
        position: 'relative',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 7,
        background: b.ink,
        opacity: .55
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 15,
        fontWeight: 600,
        color: b.ink,
        lineHeight: 1.25
      }
    }, b.title)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: '#9a8f7c',
        marginTop: 7
      }
    }, b.meta)))), /*#__PURE__*/React.createElement("div", {
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
    }, "→"))));
  }

  /* ── HEALTH & WELLNESS ── */
  renderHealth(st) {
    const ht = st.healthTab || 'videos';
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
        padding: '8px 0 16px'
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
    }, "Edit")), /*#__PURE__*/React.createElement("div", {
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
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 20,
        aspectRatio: '16/10',
        background: 'linear-gradient(150deg,#2a6a58,#143b2f)',
        marginBottom: 10,
        cursor: 'pointer',
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
    }, "Featured · Wellness"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 19,
        fontWeight: 600,
        marginTop: 3
      }
    }, "Islam & Healthy Living"))), /*#__PURE__*/React.createElement("div", {
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
    }, "Videos"), /*#__PURE__*/React.createElement("div", {
      className: "s",
      style: {
        display: 'flex',
        gap: 13,
        overflowX: 'auto',
        margin: '0 -20px 24px',
        padding: '0 20px 4px'
      }
    }, (st.liveHealthVideos || []).map((v, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      style: {
        flexShrink: 0,
        width: 170,
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        aspectRatio: '16/10',
        borderRadius: 15,
        overflow: 'hidden',
        background: v.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(135deg,rgba(255,255,255,.05) 0 10px,transparent 10px 20px)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 40,
        height: 40,
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
        borderLeft: '13px solid #1f5145',
        borderTop: '8px solid transparent',
        borderBottom: '8px solid transparent',
        marginLeft: 3
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13.5,
        fontWeight: 600,
        color: st.dark ? '#ece6d8' : '#2c2823',
        marginTop: 8,
        lineHeight: 1.3
      }
    }, v.title), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: '#9a8f7c',
        marginTop: 2
      }
    }, v.meta))))), ht === 'tips' && /*#__PURE__*/React.createElement("div", {
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
        padding: '8px 0 14px'
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
    const stories = st.liveStories;
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
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(120% 90% at 50% 0%,rgba(255,255,255,.1),rgba(0,0,0,.35))'
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
        zIndex: 2,
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
        background: 'rgba(255,255,255,.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Spectral,serif',
        color: '#fff',
        fontWeight: 600
      }
    }, "ا"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
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
        padding: '8px 0 16px'
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
    }, st.liveStories.map((s, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => this.openStory(i),
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        background: s.img,
        borderRadius: 18,
        padding: '14px 16px',
        cursor: 'pointer',
        overflow: 'hidden',
        position: 'relative'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0,
        width: 46,
        height: 46,
        borderRadius: 13,
        background: 'rgba(255,255,255,.18)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Amiri,serif',
        fontSize: 24,
        color: '#fff'
      }
    }, s.initial), /*#__PURE__*/React.createElement("div", {
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
      key: 'prayer',
      label: this.t('nav.prayer'),
      d: NAV_ICONS.prayer
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
        onClick: () => this.go(n.key),
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
    const showNav = st.screen !== 'reading' && st.story === null;
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
    }, st.screen === 'home' && this.renderHome(st, next, cd, greg, hijri, salaam), st.screen === 'prayer' && this.renderPrayer(st, next, cd, greg), st.screen === 'library' && this.renderLibrary(st), st.screen === 'reading' && this.renderReading(st), st.screen === 'classifieds' && this.renderClassifieds(st), st.screen === 'more' && this.renderMore(st), st.screen === 'about' && this.renderAbout(), st.screen === 'offline' && this.renderOffline(), st.screen === 'admin' && this.renderAdmin(st), st.screen === 'calendar' && this.renderCalendar(st), st.screen === 'kids' && this.renderKids(st), st.screen === 'health' && this.renderHealth(st), st.screen === 'qibla' && this.renderQibla(st), st.screen === 'stories' && this.renderStories(st)), showNav && /*#__PURE__*/React.createElement("div", {
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
    }, "×")), showNav && this.renderNav(st), st.story !== null && this.renderStoryViewer(st), st.toast && this.renderToast(st.toast));
  }
}
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
