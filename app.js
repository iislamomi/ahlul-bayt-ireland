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
/* Two palettes, and NEU reads from whichever theme is current.
 *
 * It used to be the light palette and nothing else, with a `dark` flag threaded
 * through the shadow helpers \u2014 which is precisely how this drifted: of 171 calls
 * to those helpers, 8 passed the flag. The other 163 painted a #fffbf0 highlight
 * and a #cbc3b2 shade onto a #1a1d1f page. Both are lighter than that page, so
 * every raised surface wore two halos instead of one highlight and one shadow,
 * and NEU.ink text landed at 1.2:1 against it.
 *
 * Reading the theme at the token rather than at 250 call sites means the next
 * screen someone writes is themed by default, which is the only way this stays
 * fixed. The dark values are the ones the reader has been using all along, so
 * the app now agrees with the one screen that already got this right. */
let THEME_DARK = false;
const NEU_L = {
  bg: '#ece5d8',
  surf: '#ece5d8',
  sunk: '#e6dfd1',
  /* The same two surfaces as panes over the wallpaper. The alpha is the setting
     that matters and it was measured, not picked: the picture has to come
     through, and the quietest text the app prints — muted, its own 4.8:1 on the
     opaque page — still has to clear AA over the darkest thing the wallpaper
     can put behind a card. */
  glass: 'rgba(238,232,220,.90)',
  glassSunk: 'rgba(231,225,212,.86)',
  hi: '#fffbf0',
  lo: '#cbc3b2',
  edge: '1px solid rgba(255,255,255,.55)',
  rule: '1px solid rgba(203,195,178,.5)',
  /* One rung per level of emphasis. These six values were written as raw hex at
     211 call sites; naming them is what lets the dark theme keep the same
     hierarchy instead of flattening all six to a single grey. */
  head: '#27241f',
  ink: '#2c2823',
  ink2: '#3f3a32',
  muted: '#6b6252', // 4.8:1 on the page tone \u2014 secondary text still has to pass AA
  label: '#5d564a',
  faint: '#8d8574',
  accent: '#1f5145'
};
const NEU_D = {
  bg: '#1a1d1f',
  surf: '#1a1d1f',
  sunk: '#171a1b',
  glass: 'rgba(26,29,31,.82)',
  glassSunk: 'rgba(23,26,27,.78)',
  /* Barely lighter and barely darker than the surface. A dark room does not
     contain a cream-coloured light source, and the moment the highlight is much
     brighter than the material it stops reading as light on a surface and starts
     reading as the surface itself glowing. */
  hi: '#252a2d',
  lo: '#0e1011',
  edge: '1px solid rgba(255,255,255,.055)',
  rule: '1px solid rgba(255,255,255,.06)',
  /* The same ladder inverted. Measured against #1a1d1f: 14.6, 13.5, 10.8, 5.4,
     6.5 and 5.9 to one — every rung clears AA for body text, so emphasis is
     carried by tone rather than by the quiet end being too dim to read. */
  head: '#f2ece0',
  ink: '#ece6d8',
  ink2: '#d5cfc4',
  muted: '#8e9490',
  label: '#a8a196',
  faint: '#949a97',
  accent: '#d8b863'
};
/* The two quietest rungs, moved up one over the wallpaper. Muted is 4.8:1 on the
   opaque page — it was written to pass AA with almost nothing to spare, and a
   frosted pane over a mosque at dusk is darker than the page by exactly the
   margin that spare was. Nothing else on the ladder needs this: ink and head
   have headroom to give away. */
const GLASS_INK = {
  false: { muted: '#5d564a', faint: '#635b4d' },
  true: { muted: '#a8a196', faint: '#9aa19d' }
};
const NEU = {};
['bg', 'surf', 'sunk', 'glass', 'glassSunk', 'hi', 'lo', 'edge', 'rule',
 'head', 'ink', 'ink2', 'muted', 'label', 'faint', 'accent'].forEach(k => {
  Object.defineProperty(NEU, k, {
    get: () => (GLASS && GLASS_INK[THEME_DARK][k]) || (THEME_DARK ? NEU_D : NEU_L)[k],
    enumerable: true
  });
});
/* A section's accent was picked as ink for a pale page. On a dark one the same
   hue has to come up to meet it, or the label it colours is the one thing on the
   card nobody can read.

   Only accents printed straight onto a themed surface need this. The many that
   sit on their own fixed pale tint \u2014 the green pills, the gold notes \u2014 are
   already correct in both themes and are deliberately left alone. */
const ACCENT_ON_DARK = {
  '#1f5145': '#7fc7ad',
  '#2c5d52': '#7fc9b4',
  '#7d6220': '#d8b863',
  '#75601f': '#d8b863',
  '#6d5a1c': '#d8b863',
  '#6e2230': '#e39aa6',
  '#8a4b2c': '#e0a780',
  '#3a4a78': '#a3b3e8',
  // the two home-tile tones that had no dark counterpart, so their kickers were
  // printed in light-theme crimson on a dark card
  '#a03a3a': '#e59a9a',
  '#8a2f52': '#e59ab4'
};
const onSurf = c => (THEME_DARK && ACCENT_ON_DARK[c]) || c;
/* Ink for a filled accent. White is right on the deep greens and crimsons the
   light theme uses, and wrong on every one of their dark-theme counterparts —
   those are pale by construction, and the gold reader accent put white text at
   1.9:1 on its own selected control. Whichever of the two contrasts better with
   the fill wins, so a filled button is legible whatever the accent turns into. */
function inkOn(bg) {
  const m = String(bg).match(/^#?([0-9a-f]{6})$/i);
  if (!m) return '#fff';
  const n = parseInt(m[1], 16);
  const ch = v => { v /= 255; return v <= .03928 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); };
  const L = .2126 * ch(n >> 16 & 255) + .7152 * ch(n >> 8 & 255) + .0722 * ch(n & 255);
  return (1.05 / (L + .05)) >= ((L + .05) / .05) ? '#fff' : '#14120d';
}

/* An explicit flag still wins \u2014 the reader passes one \u2014 but leaving it out now
   means "whatever the theme is", not "light". */
const neuTone = dark => (dark === undefined ? THEME_DARK : dark) ? NEU_D : NEU_L;
/* True only while the home screen is being built. That screen draws over the
   wallpaper, so its raised surfaces stop being opaque board and become frosted
   panes — the picture carries on underneath them, which is the whole difference
   between a background and a picture with cards stacked on top of it. Set once
   per render pass in render(), where exactly one screen is built, and read by
   the two helpers every card on the screen already goes through. */
let GLASS = false;
const FROST = { backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' };
/* A few things on the home screen are printed straight onto the page rather than
   onto a card — the section headings between the blocks, and the captions under
   the story rail. Over a wallpaper they have nothing to sit on, and the picture
   scrolls under them: dark ink on the mosque silhouette is 1.4 to 1.

   These carried a frosted chip each, which worked and which read as a row of
   little boxes floating over the photograph. This is the same job done without
   drawing anything: four one-pixel copies of the page tone laid around every
   glyph, so the colour immediately touching each stroke is the page tone rather
   than whatever the wallpaper is doing there, then two soft falloffs to keep the
   edge from looking cut out. No box, no padding, nothing that moves the words. */
const wallHalo = () => {
  if (!GLASS) return null;
  const c = THEME_DARK ? '26,29,31' : '236,229,216';
  return {
    textShadow: `0 1px 0 rgba(${c},.96),0 -1px 0 rgba(${c},.96),1px 0 0 rgba(${c},.96),` +
      `-1px 0 0 rgba(${c},.96),0 0 7px rgba(${c},.88),0 0 16px rgba(${c},.62)`
  };
};
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
  background: GLASS ? neuTone(dark).glass : neuTone(dark).surf,
  borderRadius: r,
  border: neuTone(dark).edge,
  boxShadow: neuUp(d, dark),
  ...(GLASS ? FROST : null)
});
/* Pressed well — inputs, tracks, and the selected state of a segmented control. */
const neuWell = (r = 14, d = 1, dark) => ({
  background: GLASS ? neuTone(dark).glassSunk : neuTone(dark).sunk,
  borderRadius: r,
  border: neuTone(dark).edge,
  boxShadow: neuIn(d, dark),
  ...(GLASS ? FROST : null)
});
/* One rung per level of nesting, because the home screen had grown nine
   different corner radii — 9, 10, 11, 12, 13, 15.5, 16, 18 and 20 — and at that
   spread the rounding stops being a decision and starts being noise. A card and
   the card beside it have to agree; a chip and the chip beside it have to agree;
   anything sitting inside a card is one rung tighter than the card holding it,
   which is what makes the nesting read. */
const R = { card: 18, tile: 16, inner: 13, pill: 12, chip: 10 };
/* The same pane with no lift under it. When every block on a screen is raised,
   nothing is: twenty soft shadows over a photograph read as haze rather than as
   depth. Three surfaces keep theirs — the next prayer, today's reminder and the
   times ribbon — and the rest lie flat against the wallpaper, which is what
   makes those three look like they are sitting forward. */
const neuFlat = (r, dark) => ({ ...neuCard(r, 1, dark), boxShadow: 'none' });
/* A filled disc that reads as a sphere: lit from the top-left inside its own
   edge, shaded at the bottom-right, and casting a soft shadow in the fill's own
   hue. The pale embossed badges on the Explore and Tools grids were already
   built this way; these were a flat disc with a modern drop shadow under it, so
   one screen was speaking two languages a few hundred pixels apart. */
const neuDisc = ink => ({
  background: `linear-gradient(145deg, ${ink}e0, ${ink})`,
  boxShadow: `inset 2px 2px 5px rgba(255,255,255,.26), inset -2px -2px 6px rgba(0,0,0,.22), 0 4px 11px -6px ${ink}, 0 1px 2px rgba(0,0,0,.12)`
});

/* ── HOME WALLPAPER ──
   Two photographs, one per theme: sunset over the mosque by day, the same
   subject at first light by night. Each is 9:16 and each is cropped to the app
   frame, which is narrower than that, so the anchor below decides what survives
   the crop rather than leaving it to chance.

   The veil is the only thing between the picture and the interface, and it is
   as light as the measurements allow. Legibility is the frosted panes' job —
   they sit at .90 and .82 and carry the text almost on their own, which is why
   the wash can stay gentle enough to leave the sunset a sunset. */
const WALL = {
  light: {
    src: '/day.jpg',
    /* The mosque, the minarets and the camels are all in the left third; the
       right third is sky and an empty ridge. On a tall phone cover crops about
       a fifth off the width, so the picture is pinned to its left edge and the
       fifth that goes is the fifth with nothing in it. */
    pos: 'left bottom',
    veil: 'linear-gradient(180deg,rgba(236,229,216,.08) 0%,rgba(236,229,216,.14) 45%,rgba(236,229,216,.20) 70%,rgba(236,229,216,.26) 100%)'
  },
  dark: {
    src: '/night.jpg',
    // this skyline is centred and runs the full width, so centre is where it goes
    pos: 'center bottom',
    /* Heavier than its daylight counterpart, and for a reason that is about the
       photograph rather than about taste: it is a dawn picture with a pale sky,
       and pale ink over a pale sky is the one combination the dark theme cannot
       have. At this strength the ridges and the crescent are still there and the
       brightest thing on screen has dropped far enough to sit under text. */
    veil: 'linear-gradient(180deg,rgba(26,29,31,.34) 0%,rgba(26,29,31,.41) 45%,rgba(26,29,31,.47) 70%,rgba(26,29,31,.54) 100%)'
  }
};

/* The wallpaper and the wash over it, behind everything the home screen draws.
   Fixed to the frame rather than scrolled with the content: it is the wall the
   screen hangs on, and a wall that slides upward as you read is a parallax
   trick, not a background. */
function homeBackdrop(dark) {
  const p = dark ? WALL.dark : WALL.light;
  return React.createElement('div', {
    'aria-hidden': 'true',
    style: { position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }
  }, React.createElement('div', {
    style: {
      position: 'absolute', inset: 0,
      backgroundImage: `url("${p.src}")`,
      backgroundSize: 'cover',
      backgroundPosition: p.pos,
      backgroundRepeat: 'no-repeat'
    }
  }), React.createElement('div', {
    style: { position: 'absolute', inset: 0, background: p.veil }
  }));
}

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

/* Library ordering. Alphabet is the wrong axis for a taqeeb or a weekday
   devotion: what a reader wants is the order they are actually performed in.
   The day or prayer is read out of the title because that is where the admin
   dashboard puts it — there is no separate field, and inventing one would
   orphan every entry already saved. Matching is on whole words so that "Nasr"
   is never mistaken for ʿAsr. */
const LIB_DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const LIB_PRAYERS = [
  ['fajr', 'fajar', 'subh'],
  ['zuhr', 'dhuhr', 'duhr', 'zohr', 'zohar'],
  ['asr'],
  ['maghrib', 'magrib'],
  ['isha', 'ishaa', 'esha']
];
function hasWord(text, word) {
  return new RegExp('(^|[^a-z])' + word + '([^a-z]|$)', 'i').test(String(text || ''));
}
function dayRank(title) {
  for (let i = 0; i < LIB_DAYS.length; i++) if (hasWord(title, LIB_DAYS[i])) return i;
  return -1;
}
function prayerRank(title) {
  for (let i = 0; i < LIB_PRAYERS.length; i++) {
    if (LIB_PRAYERS[i].some(w => hasWord(title, w))) return i;
  }
  return -1;
}
const isZiyarahTitle = t => /ziyara|ziyarat|ziarat|ziarah/i.test(String(t || ''));
/* Title and category together: the admin dashboard files "Duʿāʾ e Nudba" under
   the category Friday rather than saying Friday in the title, and a reader
   looking for Friday means both. */
const libText = it => it && typeof it === 'object'
  ? (it.title || '') + ' · ' + (it.cat || '')
  : String(it || '');
/* Sort orders offered per section. 'order' walks the taqeebat the way the day
   does: from Fajr to Isha, then the weekly ziyārah Monday to Sunday, then the
   weekly duʿāʾ Monday to Sunday, then whatever is left. The amaal proper are
   keyed to occasions rather than to the week, so they only sort A–Z. */
const LIB_SORTS = {
  dua: [['az', 'A–Z'], ['day', 'Monday to Sunday']],
  ziyarah: [['az', 'A–Z'], ['day', 'Monday to Sunday']],
  aamal: [['order', 'In order · Fajr to Isha, then Mon to Sun'], ['day', 'Monday to Sunday'], ['az', 'A–Z']],
  amaal: [['az', 'A–Z']],
  // the catalogue order is the order it was given in, so it is offered as one
  salat: [['given', 'As listed'], ['az', 'A–Z']]
};
const LIB_SORT_DEFAULT = { dua: 'az', ziyarah: 'az', aamal: 'order', amaal: 'az', salat: 'given' };
function libBand(mode, it) {
  const t = libText(it);
  if (mode === 'day') return dayRank(t) >= 0 ? 0 : 1;
  if (mode !== 'order') return 0;
  if (prayerRank(t) >= 0) return 0;
  if (dayRank(t) >= 0) return isZiyarahTitle(t) ? 1 : 2;
  return 3;
}
function libWithin(mode, band, it) {
  const t = libText(it);
  if (mode === 'day') return band === 0 ? dayRank(t) : 0;
  if (mode === 'order') {
    if (band === 0) return prayerRank(t);
    if (band === 1 || band === 2) return dayRank(t);
  }
  return 0;
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
  }],
  /* Al-Ṣaḥīfa al-Sajjādiyya sits in the same record as Nahj al-Balāgha rather
     than a new one: the Books tab already reads this key, and a second key
     would need its own sync, its own migration and its own admin plumbing for
     nothing the reader would notice. */
  sahifa: [],
  munajat: []
};
const BOOKS = [['nahj', 'Nahjul Balagha'], ['sahifa', 'Sahifa e Sajjadia']];
const NAHJ_PARTS = [['sermons', 'Sermons'], ['letters', 'Letters'], ['sayings', 'Sayings']];
/* The fifty-four supplications and the fifteen whispered prayers are read as two
   different things, so they are kept as two. */
const SAHIFA_PARTS = [['sahifa', 'Supplications'], ['munajat', 'Munājāt']];
const BOOK_PARTS = { nahj: NAHJ_PARTS, sahifa: SAHIFA_PARTS };

/* ── SALAT ──
   The catalogue from the screenshots, transcribed: every title and every
   subtitle, in the order they appeared. What is NOT here is the method of each
   prayer — how many rakʿah, what is recited in each, in what order — because
   that was not in what was sent, and it is not something to fill in by guess.
   Each entry opens as an empty reading with its own editor, so the method can
   be pasted in, uploaded as a PDF, or given a recitation, exactly like a duʿāʾ.

   Two things to check against the source: the seventh Days of the Week - Other
   is Friday by the pattern, its row being cut off mid-screen, and anything
   between that group and the monthly prayers was never on screen. */
const SALAT = [
  { title: 'Namaz-e-Shaab', cat: 'Occasions', sub: 'Tahajjud · Layl' },
  { title: 'Namaz-e-Ayaat', cat: 'Occasions', sub: '' },
  { title: 'Namaz-e-Jafer-e-Tayyar', cat: 'Occasions', sub: '' },
  { title: 'Namaz-e-Wahshat-e-Qabr', cat: 'Occasions', sub: '' },
  { title: 'Namaz-e-Mayyit', cat: 'Occasions', sub: 'Janaza' },
  { title: 'Namaz-e-Eid', cat: 'Occasions', sub: 'Eid ul Adha · Eid ul Fitr' },
  { title: 'Namaz-e-Gufaila', cat: 'Occasions', sub: '' },
  { title: 'Namaz-e-Isteghfar - 1', cat: 'Isteghfar', sub: '' },
  { title: 'Namaz-e-Isteghfar - 2', cat: 'Isteghfar', sub: 'Recommended for Saturday' },
  { title: 'Namaz-e-Isteghfar - 3', cat: 'Isteghfar', sub: '' },
  { title: 'Namaz-e-Isteghfar - 4', cat: 'Isteghfar', sub: 'Recommended for Tuesday eve' },
  { title: 'Namaz-e-Isteghfar - 5', cat: 'Isteghfar', sub: 'Recommended for Tuesday' },
  { title: 'Namaz-e-Isteghfar - 6', cat: 'Isteghfar', sub: '' },
  { title: 'Namaz-e-Tawbah', cat: 'Isteghfar', sub: '' },
  { title: 'Namaz-e-Isteghasa', cat: 'Isteghfar', sub: 'Hazrat Fatimah (s.a.)' },
  { title: 'Days of the Week', cat: 'Days of the week', sub: 'Saturday eve' },
  { title: 'Days of the Week', cat: 'Days of the week', sub: 'Saturday' },
  { title: 'Days of the Week', cat: 'Days of the week', sub: 'Sunday eve' },
  { title: 'Days of the Week', cat: 'Days of the week', sub: 'Sunday' },
  { title: 'Days of the Week', cat: 'Days of the week', sub: 'Monday eve' },
  { title: 'Days of the Week', cat: 'Days of the week', sub: 'Monday' },
  { title: 'Days of the Week', cat: 'Days of the week', sub: 'Tuesday eve' },
  { title: 'Days of the Week', cat: 'Days of the week', sub: 'Tuesday' },
  { title: 'Days of the Week', cat: 'Days of the week', sub: 'Wednesday eve' },
  { title: 'Days of the Week', cat: 'Days of the week', sub: 'Wednesday' },
  { title: 'Days of the Week', cat: 'Days of the week', sub: 'Thursday eve' },
  { title: 'Days of the Week', cat: 'Days of the week', sub: 'Thursday' },
  { title: 'Days of the Week', cat: 'Days of the week', sub: 'Friday eve' },
  { title: 'Days of the Week', cat: 'Days of the week', sub: 'Friday' },
  { title: 'Days of the Week - Other', cat: 'Days of the week — other', sub: 'Saturday' },
  { title: 'Days of the Week - Other', cat: 'Days of the week — other', sub: 'Sunday' },
  { title: 'Days of the Week - Other', cat: 'Days of the week — other', sub: 'Monday' },
  { title: 'Days of the Week - Other', cat: 'Days of the week — other', sub: 'Tuesday' },
  { title: 'Days of the Week - Other', cat: 'Days of the week — other', sub: 'Wednesday' },
  { title: 'Days of the Week - Other', cat: 'Days of the week — other', sub: 'Thursday' },
  { title: 'Days of the Week - Other', cat: 'Days of the week — other', sub: 'Friday' },
  { title: 'Namaz for first eve of every month', cat: 'Monthly', sub: '' },
  { title: 'Namaz for first day of every month', cat: 'Monthly', sub: '' },
  { title: 'Prayer for Dead Ones', cat: 'Occasions', sub: '' },
  { title: 'Lailatul Raghaib', cat: 'Occasions', sub: 'First Thursday of Rajab' },
  { title: 'Salaat of Masoomeen (as)', cat: 'Masoomeen', sub: 'Holy Prophet (s.a.w.s.)' },
  { title: 'Salaat of Masoomeen (as)', cat: 'Masoomeen', sub: 'Hazrat Ali (a.s.)' },
  { title: 'Salaat of Masoomeen (as)', cat: 'Masoomeen', sub: 'Hazrat Fatimah Zahra (s.a.)' },
  { title: 'Salaat of Masoomeen (as)', cat: 'Masoomeen', sub: 'Hazrat Imam Hasan (as)' },
  { title: 'Salaat of Masoomeen (as)', cat: 'Masoomeen', sub: 'Imam Hussain (as)' },
  { title: 'Salaat of Masoomeen (as)', cat: 'Masoomeen', sub: 'Imam Zainul Aabideen (a.s.)' },
  { title: 'Salaat of Masoomeen (as)', cat: 'Masoomeen', sub: 'Imam Muhammad al-Baqir (a.s.)' },
  { title: 'Salaat of Masoomeen (as)', cat: 'Masoomeen', sub: 'Imam Jafar as-Sadiq (a.s.)' },
  { title: 'Salaat of Masoomeen (as)', cat: 'Masoomeen', sub: 'Imam Moosa al-Kazim (a.s.)' },
  { title: 'Salaat of Masoomeen (as)', cat: 'Masoomeen', sub: 'Imam Ali ar-Reza (a.s.)' },
  { title: 'Salaat of Masoomeen (as)', cat: 'Masoomeen', sub: 'Imam Mohammad Taqi (a.s.)' },
  { title: 'Salaat of Masoomeen (as)', cat: 'Masoomeen', sub: 'Imam Ali an-Naqee (a.s.)' },
  { title: 'Salaat of Masoomeen (as)', cat: 'Masoomeen', sub: 'Imam Hasan al Askaree (a.s.)' },
  { title: 'Salaat of Masoomeen (as)', cat: 'Masoomeen', sub: 'Imam Mehdi (a.t.f.s)' },
  { title: 'Duas during Wudhu', cat: 'Other', sub: 'Wuzu · Ablution' },
  { title: 'Namaz-e-Hadiya Walidain', cat: 'Other', sub: 'For One\'s Parents' }
];

/* ── THE READING SECTIONS ──
   Two of these are spelled almost the same and mean different things, which is
   a live hazard in a file this size, so nothing below types either key by hand:
   the tab bar, the pools, the reader accent and the admin editor are all driven
   off this table.

     aamal — the post-prayer taqeebat and the daily and weekly ziyarat. Its key
             and its Supabase row are older than its name; the row holds those
             22 entries and is left exactly where it is, so only the label moved.
     amaal — the amaal proper: what is done on a given night or occasion. New,
             and deliberately given a Supabase key that cannot be mistyped for
             the other one. */
const LIB_KINDS = [
  { key: 'dua', tab: 'Duʿāʾ', title: 'Duʿāʾ', icon: '🤲',
    accent: '#7d6220', tint: '#f3ecd9', sb: 'duas', state: 'liveDuas', seed: DUAS,
    catHint: 'Category (e.g. Daily, Weekly, Morning)' },
  { key: 'ziyarah', tab: 'Ziyārah', title: 'Ziyārah', icon: '🕌',
    accent: '#6e2230', tint: '#f3e6e8', sb: 'ziyarat', state: 'liveZiyarat', seed: ZIYARAT,
    catHint: 'Category (e.g. Imam Ḥusayn, General)' },
  { key: 'aamal', tab: 'Taqeebat', title: 'Taqeebat & Ziyarat', icon: '✨',
    accent: '#8a4b2c', tint: '#f6ebe4', sb: 'aamals', state: 'liveAamals', seed: [],
    catHint: 'Category (e.g. Daily, Weekly)' },
  { key: 'amaal', tab: 'Amaal', title: 'Amaal', icon: '🌙',
    accent: '#7a5c9e', tint: '#efe9f5', sb: 'amaalActs', state: 'liveAmaalActs', seed: [],
    catHint: 'Category (e.g. Ramaḍān, Muḥarram, Laylatul Qadr)' },
  { key: 'salat', tab: 'Salat', title: 'Salat', icon: '🕋',
    accent: '#1f5145', tint: '#e4efe9', sb: 'salat', state: 'liveSalat', seed: SALAT,
    catHint: 'Category (e.g. Occasions, Isteghfar, Masoomeen)' }
];
const LIB_KIND = {};
LIB_KINDS.forEach(k => { LIB_KIND[k.key] = k; });

/* What the Library holds, and so what Continue reading is allowed to name. The
   reader is also used for Learning chapters, which are not in the Library and
   which findContent cannot look up — offering one on the home screen produced a
   tile that said "no longer in the library" when it was tapped. */
const LIB_TYPES = [...LIB_KINDS.map(k => k.key), 'nahj'];

/* Every part of both books is numbered — Duʿāʾ 1 to 54, Sermon 1, Letter 31 — so
   they read in that order rather than in the order they happened to be typed in,
   which is newest-first and therefore backwards for a book. The number is taken
   from the reference and falls back to the title; anything carrying no number at
   all sorts to the end alphabetically rather than to an arbitrary place. */
function bookNo(it) {
  const m = String((it && it.ref) || '').match(/\d+/) || String((it && it.title) || '').match(/\d+/);
  return m ? parseInt(m[0], 10) : Infinity;
}
function orderBook(list) {
  return [...(list || [])].sort((a, b) =>
    bookNo(a) - bookNo(b) ||
    sortKey(a && a.title).localeCompare(sortKey(b && b.title), 'en', { sensitivity: 'base', numeric: true }));
}
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

/* ── THE FOURTEEN INFALLIBLES ──
   The Prophet, his daughter and the twelve Imams. Seeded here so the section is
   worth opening the day it ships rather than an empty shell, and held as
   content so an administrator can correct, lengthen or translate any of it
   without a release. Dates are the commonly cited ones; sources differ by a
   year here and there, and by more than that for Sayyida Fāṭima, which is part
   of why every field is editable. */
const INFALLIBLES = [
  { name: 'Prophet Muḥammad', hon: 'ṣ', role: 'The Messenger of Allah',
    born: '570 CE, Mecca', died: '11 AH / 632 CE, Medina', rest: 'Al-Masjid an-Nabawī, Medina',
    bio: 'The last of the prophets, to whom the Qurʾān was revealed over twenty-three years. He was known as al-Amīn, the trustworthy, before the revelation began, and the community he left in Medina was built on a covenant rather than on conquest. At Ghadīr Khumm, returning from his farewell pilgrimage, he took ʿAlī by the hand before the assembled pilgrims.' },
  { name: 'Imam ʿAlī ibn Abī Ṭālib', hon: 'a', role: 'Amīr al-Muʾminīn · The first Imam',
    born: '600 CE, Mecca', died: '40 AH / 661 CE, Kufa', rest: 'Ḥaram of Imam ʿAlī, Najaf',
    bio: 'Raised by the Prophet, the first male to accept Islam, and the one who slept in the Prophet\'s bed on the night of the migration. His judgements and letters — many gathered in Nahj al-Balāgha — are read as much for their justice as for their Arabic. He was struck in the mosque of Kufa while praying and died two days later.' },
  { name: 'Sayyida Fāṭima al-Zahrāʾ', hon: 's', role: 'Sayyidat Nisāʾ al-ʿĀlamīn',
    born: '615 CE, Mecca', died: '11 AH / 632 CE, Medina', rest: 'Medina — the grave is unmarked at her own request',
    bio: 'The daughter of the Prophet and of Khadīja, wife of ʿAlī, and mother of Ḥasan, Ḥusayn, Zaynab and Umm Kulthūm. Her sermon in the mosque of Medina after her father\'s death is one of the earliest recorded pieces of Arabic oratory by a woman. She died within months of him, and asked to be buried at night.' },
  { name: 'Imam Ḥasan al-Mujtabā', hon: 'a', role: 'The second Imam',
    born: '3 AH / 625 CE, Medina', died: '50 AH / 670 CE, Medina', rest: 'Jannat al-Baqīʿ, Medina',
    bio: 'The elder grandson of the Prophet. After six months as caliph he made a treaty with Muʿāwiya rather than let the community tear itself apart, on terms meant to protect his followers — terms that were not kept. He was known in Medina for giving away his wealth outright, more than once, and for walking to Mecca on pilgrimage.' },
  { name: 'Imam Ḥusayn ibn ʿAlī', hon: 'a', role: 'Sayyid al-Shuhadāʾ · The third Imam',
    born: '4 AH / 626 CE, Medina', died: '10 Muḥarram 61 AH / 680 CE, Karbala', rest: 'Ḥaram of Imam Ḥusayn, Karbala',
    bio: 'The younger grandson of the Prophet, who refused allegiance to Yazīd and left Medina rather than give it. He was killed with his family and companions at Karbala, thirsty, after his camp was cut off from the Euphrates. What was said and done there — and by his sister Zaynab afterwards in Kufa and Damascus — is why the month of Muḥarram is kept.' },
  { name: 'Imam ʿAlī Zayn al-ʿĀbidīn', hon: 'a', role: 'Al-Sajjād · The fourth Imam',
    born: '38 AH / 659 CE, Medina', died: '95 AH / 713 CE, Medina', rest: 'Jannat al-Baqīʿ, Medina',
    bio: 'He survived Karbala as a young man too ill to fight, and was taken with the captives to Kufa and Damascus, where he spoke publicly about what had happened. He withdrew from politics afterwards and taught through prayer: al-Ṣaḥīfa al-Sajjādiyya, a book of supplications, and the Treatise on Rights are both his.' },
  { name: 'Imam Muḥammad al-Bāqir', hon: 'a', role: 'The fifth Imam',
    born: '57 AH / 677 CE, Medina', died: '114 AH / 733 CE, Medina', rest: 'Jannat al-Baqīʿ, Medina',
    bio: 'Named al-Bāqir, the one who splits open knowledge, for the depth of his teaching. He was a child at Karbala. In a calmer period he began the systematic teaching of jurisprudence and ḥadīth in Medina that his son would carry much further.' },
  { name: 'Imam Jaʿfar al-Ṣādiq', hon: 'a', role: 'The sixth Imam',
    born: '83 AH / 702 CE, Medina', died: '148 AH / 765 CE, Medina', rest: 'Jannat al-Baqīʿ, Medina',
    bio: 'His circle in Medina is said to have numbered thousands of students, among them scholars who founded other schools of law. The Jaʿfarī school of jurisprudence takes his name. He taught through two dynasties changing hands and kept the work of teaching separate from the fight over rule.' },
  { name: 'Imam Mūsā al-Kāẓim', hon: 'a', role: 'The seventh Imam',
    born: '128 AH / 745 CE, Abwāʾ', died: '183 AH / 799 CE, Baghdad', rest: 'Al-Kāẓimiyya, Baghdad',
    bio: 'Called al-Kāẓim, the one who restrains his anger, for his bearing under long imprisonment. He spent much of his later life in the prisons of Baghdad and died in one. He kept his community together through written correspondence and appointed representatives.' },
  { name: 'Imam ʿAlī al-Riḍā', hon: 'a', role: 'The eighth Imam',
    born: '148 AH / 765 CE, Medina', died: '203 AH / 818 CE, Ṭūs', rest: 'Ḥaram of Imam Riḍā, Mashhad',
    bio: 'Summoned from Medina to Khurasan by the caliph al-Maʾmūn and named his heir, an offer he accepted only on the condition that he take no part in the running of the state. He is remembered for his public debates with Christian, Jewish and Zoroastrian scholars. He died at Ṭūs; his shrine is now the city of Mashhad.' },
  { name: 'Imam Muḥammad al-Jawād', hon: 'a', role: 'Al-Taqī · The ninth Imam',
    born: '195 AH / 811 CE, Medina', died: '220 AH / 835 CE, Baghdad', rest: 'Al-Kāẓimiyya, Baghdad',
    bio: 'He became Imam as a child, and the questioning he faced from the scholars of Baghdad because of his age is itself among the better-recorded episodes of his life. He died at about twenty-five.' },
  { name: 'Imam ʿAlī al-Hādī', hon: 'a', role: 'Al-Naqī · The tenth Imam',
    born: '212 AH / 828 CE, Medina', died: '254 AH / 868 CE, Sāmarrāʾ', rest: 'Al-ʿAskariyya, Sāmarrāʾ',
    bio: 'Moved from Medina to the garrison city of Sāmarrāʾ and kept there under watch for the rest of his life. Ziyārat al-Jāmiʿa al-Kabīra, recited at the shrines to this day, is transmitted from him.' },
  { name: 'Imam Ḥasan al-ʿAskarī', hon: 'a', role: 'The eleventh Imam',
    born: '232 AH / 846 CE, Medina', died: '260 AH / 874 CE, Sāmarrāʾ', rest: 'Al-ʿAskariyya, Sāmarrāʾ',
    bio: 'Named for the garrison quarter of Sāmarrāʾ where he, like his father, was held. He reached his community almost entirely through letters and trusted deputies, which is how the network that carried it through the occultation was already in place when he died at twenty-eight.' },
  { name: 'Imam Muḥammad al-Mahdī', hon: 'aj', role: 'Ṣāḥib al-Zamān · The twelfth Imam',
    born: '255 AH / 869 CE, Sāmarrāʾ', died: 'In occultation', rest: '—',
    bio: 'The awaited Imam. Contact with his community ran through four appointed deputies for some seventy years, and after the last of them the greater occultation began. Duʿāʾ al-Faraj and Ziyārat Āl Yāsīn are read in his name, and the Friday ziyārah is addressed to him.' }
];
const MOSQUES = [];
/* Fixed, because this field decides who reads the report. A free-text box gives
   an administrator a column nothing can be sorted or counted by. */
const ISSUE_CATS = ['Prayer times', 'Library or reading', 'Calendar or events',
  'Notifications', 'Mosque or address details', 'Something is broken',
  'A suggestion', 'Something else'];

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
  'locate-fixed': '<line x1="2" x2="5" y1="12" y2="12" /><line x1="19" x2="22" y1="12" y2="12" /><line x1="12" x2="12" y1="2" y2="5" /><line x1="12" x2="12" y1="19" y2="22" /><circle cx="12" cy="12" r="7" /><circle cx="12" cy="12" r="3" />',
  'rotate-ccw': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" />',
  'info': '<circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />',
  'triangle-alert': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" /><path d="M12 9v4" /><path d="M12 17h.01" />',
  'heart': '<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />',
  'trash-2': '<path d="M10 11v6" /><path d="M14 11v6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />',
  'compass': '<path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z" /><circle cx="12" cy="12" r="10" />',
  'navigation': '<path d="M3 11l19-9-9 19-2-8-8-2z" />',
  'shield-check': '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /><path d="m9 12 2 2 4-4" />'
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

/* The one drawn glyph among the home tiles, because there is no cube in the
   emoji set to reach for. Painted as the front face rather than in perspective:
   at 30px an isometric cube is three grey diamonds, and a flat three-by-three
   of colours is read as a Rubik's cube instantly. */
const RUBIKS_CUBE = React.createElement('svg', {
  width: 30, height: 30, viewBox: '0 0 32 32', 'aria-hidden': 'true',
  dangerouslySetInnerHTML: {
    __html: '<rect x="3" y="3" width="26" height="26" rx="5.5" fill="#1c1a17"/>' +
      [['#c0392b', '#f4f1e8', '#2b6cb0'],
       ['#e3b52a', '#2e8b57', '#c0392b'],
       ['#2b6cb0', '#d97a1a', '#f4f1e8']]
        .map((cells, r) => cells.map((fill, c) =>
          `<rect x="${5.2 + c * 7.6}" y="${5.2 + r * 7.6}" width="6.4" height="6.4" rx="1.5" fill="${fill}"/>`
        ).join('')).join('')
  }
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
        color: NEU.muted,
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

/* ── PRAYER LOCATION ──
   Dublin is the community's own timetable and stays the default; everywhere else
   is calculated for that town's own coordinates. The list is the island's main
   population centres rather than a gazetteer — a searchable list of forty is
   something an older member can actually work through, a list of two thousand is
   not. Coordinates are the town centre. */
const ABI_HOME = { id: 'dublin', name: 'Dublin', region: 'Co. Dublin', lat: 53.3498, lng: -6.2603 };
const IE_LOCATIONS = [ABI_HOME,
  { id: 'cork', name: 'Cork', region: 'Co. Cork', lat: 51.8985, lng: -8.4756 },
  { id: 'galway', name: 'Galway', region: 'Co. Galway', lat: 53.2707, lng: -9.0568 },
  { id: 'limerick', name: 'Limerick', region: 'Co. Limerick', lat: 52.6638, lng: -8.6267 },
  { id: 'waterford', name: 'Waterford', region: 'Co. Waterford', lat: 52.2593, lng: -7.1101 },
  { id: 'drogheda', name: 'Drogheda', region: 'Co. Louth', lat: 53.7189, lng: -6.3478 },
  { id: 'dundalk', name: 'Dundalk', region: 'Co. Louth', lat: 54.0019, lng: -6.4058 },
  { id: 'swords', name: 'Swords', region: 'Co. Dublin', lat: 53.4597, lng: -6.2181 },
  { id: 'balbriggan', name: 'Balbriggan', region: 'Co. Dublin', lat: 53.6089, lng: -6.1811 },
  { id: 'bray', name: 'Bray', region: 'Co. Wicklow', lat: 53.2028, lng: -6.0983 },
  { id: 'greystones', name: 'Greystones', region: 'Co. Wicklow', lat: 53.145, lng: -6.0703 },
  { id: 'wicklow', name: 'Wicklow', region: 'Co. Wicklow', lat: 52.9808, lng: -6.0446 },
  { id: 'arklow', name: 'Arklow', region: 'Co. Wicklow', lat: 52.7936, lng: -6.1417 },
  { id: 'navan', name: 'Navan', region: 'Co. Meath', lat: 53.6528, lng: -6.6814 },
  { id: 'ashbourne', name: 'Ashbourne', region: 'Co. Meath', lat: 53.5133, lng: -6.3994 },
  { id: 'naas', name: 'Naas', region: 'Co. Kildare', lat: 53.2158, lng: -6.6669 },
  { id: 'newbridge', name: 'Newbridge', region: 'Co. Kildare', lat: 53.181, lng: -6.7996 },
  { id: 'maynooth', name: 'Maynooth', region: 'Co. Kildare', lat: 53.3814, lng: -6.5914 },
  { id: 'portlaoise', name: 'Portlaoise', region: 'Co. Laois', lat: 53.0344, lng: -7.3011 },
  { id: 'carlow', name: 'Carlow', region: 'Co. Carlow', lat: 52.8365, lng: -6.9341 },
  { id: 'kilkenny', name: 'Kilkenny', region: 'Co. Kilkenny', lat: 52.6541, lng: -7.2448 },
  { id: 'wexford', name: 'Wexford', region: 'Co. Wexford', lat: 52.3369, lng: -6.4633 },
  { id: 'clonmel', name: 'Clonmel', region: 'Co. Tipperary', lat: 52.3553, lng: -7.7034 },
  { id: 'ennis', name: 'Ennis', region: 'Co. Clare', lat: 52.8438, lng: -8.9864 },
  { id: 'tralee', name: 'Tralee', region: 'Co. Kerry', lat: 52.2713, lng: -9.7016 },
  { id: 'killarney', name: 'Killarney', region: 'Co. Kerry', lat: 52.0599, lng: -9.5044 },
  { id: 'cobh', name: 'Cobh', region: 'Co. Cork', lat: 51.8508, lng: -8.2947 },
  { id: 'athlone', name: 'Athlone', region: 'Co. Westmeath', lat: 53.4239, lng: -7.9407 },
  { id: 'mullingar', name: 'Mullingar', region: 'Co. Westmeath', lat: 53.5236, lng: -7.3378 },
  { id: 'tullamore', name: 'Tullamore', region: 'Co. Offaly', lat: 53.2736, lng: -7.4894 },
  { id: 'longford', name: 'Longford', region: 'Co. Longford', lat: 53.7276, lng: -7.7932 },
  { id: 'roscommon', name: 'Roscommon', region: 'Co. Roscommon', lat: 53.6279, lng: -8.1951 },
  { id: 'cavan', name: 'Cavan', region: 'Co. Cavan', lat: 53.9908, lng: -7.3606 },
  { id: 'monaghan', name: 'Monaghan', region: 'Co. Monaghan', lat: 54.2492, lng: -6.9683 },
  { id: 'sligo', name: 'Sligo', region: 'Co. Sligo', lat: 54.2766, lng: -8.4761 },
  { id: 'castlebar', name: 'Castlebar', region: 'Co. Mayo', lat: 53.856, lng: -9.2985 },
  { id: 'ballina', name: 'Ballina', region: 'Co. Mayo', lat: 54.1157, lng: -9.1553 },
  { id: 'tuam', name: 'Tuam', region: 'Co. Galway', lat: 53.5147, lng: -8.8546 },
  { id: 'letterkenny', name: 'Letterkenny', region: 'Co. Donegal', lat: 54.9503, lng: -7.7343 },
  { id: 'belfast', name: 'Belfast', region: 'Co. Antrim', lat: 54.5973, lng: -5.9301 },
  { id: 'lisburn', name: 'Lisburn', region: 'Co. Antrim', lat: 54.5162, lng: -6.058 },
  { id: 'newry', name: 'Newry', region: 'Co. Down', lat: 54.1753, lng: -6.3402 },
  { id: 'derry', name: 'Derry', region: 'Co. Londonderry', lat: 54.9966, lng: -7.3086 }];
/* Rough great-circle in km — only ever used to name the nearest town to a set of
   device coordinates, so a spherical earth is plenty. */
function kmBetween(a, b) {
  const R = 6371, rad = d => d * Math.PI / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}
function nearestTown(pt) {
  let best = null, bestKm = Infinity;
  IE_LOCATIONS.forEach(l => {
    const km = kmBetween(pt, l);
    if (km < bestKm) { bestKm = km; best = l; }
  });
  return { town: best, km: bestKm };
}
/* Shia Ithna-Ashari (Leva Institute, Qum) with the Jaʿfarī midnight — the method
   Ahlul-Bait Islamic Centre uses. Sunset and Maghrib are fetched and shown as two
   separate times; collapsing them would be wrong for this community. */
const PRAYER_METHOD = {
  id: 0,
  midnightMode: 1,
  name: 'Shia Ithna-Ashari',
  detail: 'Leva Institute, Qum · Jaʿfarī midnight',
  source: 'AlAdhan API (aladhan.com)'
};
const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

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
const CONTENT_KIND = { nahj: 'Books' };
LIB_KINDS.forEach(k => { CONTENT_KIND[k.key] = k.title; });

/* ── QUIZ DIFFICULTY ──
   Easy / Medium / Hard are the difficulties. Quizzes saved under the older
   Beginner / Intermediate / Advanced labels still read correctly — quizLevel()
   maps them, and migrateQuizzes() writes the new key back the first time the app
   loads, so nothing depends on the mapping surviving forever. */
const QUIZ_LEVELS = [
  { key: 'easy', label: 'Easy', color: '#2c5d52' },
  { key: 'medium', label: 'Medium', color: '#7d6220' },
  { key: 'hard', label: 'Hard', color: '#6e2230' }
];
const LEGACY_LEVEL = { beginner: 'easy', intermediate: 'medium', advanced: 'hard' };
const DEFAULT_LEVEL = 'easy';
const quizLevel = q => {
  const k = String((q && q.level) || '').toLowerCase().trim();
  if (QUIZ_LEVELS.some(l => l.key === k)) return k;
  return LEGACY_LEVEL[k] || DEFAULT_LEVEL;
};
const levelLabel = k => (QUIZ_LEVELS.find(l => l.key === quizLevel({ level: k })) || QUIZ_LEVELS[0]).label;
/* Give every quiz an explicit difficulty. Returns the same array when nothing
   needed changing, so callers can tell whether a write is worth doing. */
function migrateQuizzes(list) {
  if (!Array.isArray(list)) return list;
  let touched = false;
  const out = list.map(q => {
    const lvl = quizLevel(q);
    if (q && q.level === lvl) return q;
    touched = true;
    return { ...q, level: lvl };
  });
  return touched ? out : list;
}

/* ── THIS INSTALLATION ──
   A random identifier made once and kept locally. It is not a fingerprint: it
   says nothing about the device and is never sent anywhere in the raw — the
   server stores a peppered digest of it, and the public leaderboard never
   returns it at all. It exists so one installation keeps one best result and so
   submissions can be rate-limited. */
function installId() {
  let v = lsGet('installId', null);
  if (typeof v !== 'string' || v.length < 8) {
    v = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'i' + Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
    lsSet('installId', v);
  }
  return v;
}
const randomId = () => typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID().replace(/-/g, '') : 'a' + Date.now().toString(36) + Math.random().toString(36).slice(2, 14);

/* ── LOCAL STORE VERSION ──
   Migrations run once, in order, before the app reads anything. They only ever
   add or normalise: an installed PWA carrying months of preferences must come
   through an update with all of them intact, so nothing here deletes a key it
   does not itself own. */
const ABI_STORE_VERSION = 1;
function runStorageMigrations() {
  let from = lsGet('storeVersion', 0);
  if (typeof from !== 'number' || from < 0) from = 0;
  if (from >= ABI_STORE_VERSION) return from;
  try {
    if (from < 1) {
      // v1: quiz difficulty gains explicit easy/medium/hard keys
      const qs = lsGet('kidsQuizzes', null);
      if (Array.isArray(qs)) {
        const next = migrateQuizzes(qs);
        if (next !== qs) lsSet('kidsQuizzes', next);
      }
      installId();
    }
  } catch (e) {
    // a failed migration must not stop the app booting; the read-time mapping
    // in quizLevel() still covers anything left unconverted
    console.error('[ABI] storage migration failed:', e && e.message);
  }
  lsSet('storeVersion', ABI_STORE_VERSION);
  return ABI_STORE_VERSION;
}

/* ── QUIZ SCORING ──
   Mirrors supabase/functions/_shared/quiz.ts. The server recomputes this from
   the submitted answers and its own question bank, and its figure is what the
   public board shows; this copy exists so the participant sees the same number
   immediately and offline.

     score = 100 per correct answer
           + 25 for reaching the end
           + up to 50 shared across the whole attempt for finishing under time

   The time bonus is deliberately worth less than a single correct answer, so
   answering carefully can never lose to answering quickly: ten correct is at
   least 1000, nine correct is at most 975. */
const SCORING = {
  BASE_PER_CORRECT: 100,
  COMPLETION_BONUS: 25,
  MAX_TIME_BONUS: 50,
  SECONDS_PER_QUESTION: 15
};
function computeScore(correct, total, durationMs, completed) {
  const parMs = total * SCORING.SECONDS_PER_QUESTION * 1000;
  const used = Math.max(0, Math.min(durationMs, parMs));
  const timeBonus = parMs > 0 ? Math.round(SCORING.MAX_TIME_BONUS * (parMs - used) / parMs) : 0;
  return SCORING.BASE_PER_CORRECT * correct + (completed ? SCORING.COMPLETION_BONUS : 0) + timeBonus;
}
function scoreParts(correct, total, durationMs, completed) {
  const parMs = total * SCORING.SECONDS_PER_QUESTION * 1000;
  const used = Math.max(0, Math.min(durationMs, parMs));
  return {
    answers: SCORING.BASE_PER_CORRECT * correct,
    completion: completed ? SCORING.COMPLETION_BONUS : 0,
    time: parMs > 0 ? Math.round(SCORING.MAX_TIME_BONUS * (parMs - used) / parMs) : 0
  };
}

/* ── DISPLAY NAMES ──
   Mirrors the server rules. Letters, marks and digits of any script pass, so an
   Arabic, Urdu or Hindi name is as welcome as a Latin one; what does not pass is
   anything that reaches out of the app — an address, a number, a link — and
   anything invisible, which on a public board is only ever used to impersonate. */
const NAME_MIN = 2;
const NAME_MAX = 20;
const NAME_INVISIBLE = /[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/g;
const NAME_ALLOWED = /[^\p{L}\p{M}\p{N} '\-._]/gu;
const NAME_EMAIL = /[^\s@]+@[^\s@]+\.[^\s@]+/;
const NAME_URLISH = /(https?:\/\/|www\.|\b[a-z0-9-]+\.(com|net|org|ie|co|uk|io|me|xyz|info|app)\b)/i;
const NAME_PHONE = /(?:\+?\d[\s\-().]*){7,}/;
/* Configurable. Lowercase entries, matched against the name with separators
   stripped so spaced-out spellings are caught too. */
const BLOCKED_NAME_WORDS = ['fuck', 'shit', 'cunt', 'bitch', 'bastard', 'wanker', 'slut', 'whore', 'nigger', 'nigga', 'faggot', 'retard', 'rape', 'nazi', 'hitler', 'admin', 'administrator', 'moderator', 'ahlulbayt', 'official'];
function sanitiseName(raw) {
  return String(raw == null ? '' : raw).normalize('NFC').replace(NAME_INVISIBLE, '').replace(NAME_ALLOWED, '').replace(/\s+/g, ' ').trim().slice(0, NAME_MAX);
}
function validateDisplayName(raw) {
  const original = String(raw == null ? '' : raw);
  if (!original.trim()) return { ok: false, reason: 'Please enter a display name.' };
  if (NAME_EMAIL.test(original)) return { ok: false, reason: 'Please do not use an email address.' };
  if (NAME_URLISH.test(original)) return { ok: false, reason: 'Please do not use a web address.' };
  if (NAME_PHONE.test(original)) return { ok: false, reason: 'Please do not use a phone number.' };
  const name = sanitiseName(original);
  if (name.length < NAME_MIN) return { ok: false, reason: `Use at least ${NAME_MIN} characters.` };
  if (!/[\p{L}\p{N}]/u.test(name)) return { ok: false, reason: 'Use letters or numbers.' };
  const flat = name.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
  if (BLOCKED_NAME_WORDS.some(w => flat.includes(w))) return { ok: false, reason: 'Please choose a different name.' };
  return { ok: true, name };
}

/* ── PENDING ATTEMPTS ──
   A quiz finished with no connection is not lost. The attempt is written to its
   own IndexedDB store, keyed by an id the client generated before playing, and
   replayed when the network returns. The server treats that id as an
   idempotency key, so replaying twice publishes once. */
const QUEUE_DB = 'abi-queue';
const QUEUE_STORE = 'attempts';
let queueDbPromise = null;
function queueDb() {
  if (queueDbPromise) return queueDbPromise;
  queueDbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('no indexeddb'));
    const req = indexedDB.open(QUEUE_DB, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(QUEUE_STORE)) db.createObjectStore(QUEUE_STORE, { keyPath: 'attemptId' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  queueDbPromise.catch(() => { queueDbPromise = null; });
  return queueDbPromise;
}
function queueStore(mode) {
  return queueDb().then(db => db.transaction(QUEUE_STORE, mode).objectStore(QUEUE_STORE));
}
function queueAll() {
  return queueStore('readonly').then(os => new Promise((res, rej) => {
    const r = os.getAll();
    r.onsuccess = () => res(r.result || []);
    r.onerror = () => rej(r.error);
  })).catch(() => lsGet('pendingAttempts', []));
}
function queuePut(rec) {
  const mirror = lsGet('pendingAttempts', []).filter(a => a.attemptId !== rec.attemptId);
  lsSet('pendingAttempts', [...mirror, rec]);
  return queueStore('readwrite').then(os => { os.put(rec); }).catch(() => {});
}
function queueDrop(attemptId) {
  lsSet('pendingAttempts', lsGet('pendingAttempts', []).filter(a => a.attemptId !== attemptId));
  return queueStore('readwrite').then(os => { os.delete(attemptId); }).catch(() => {});
}


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

/* Playback speeds for the recitation player. Below normal for someone learning
   to say the words, above it for someone who already knows them and is listening
   through. Four is as many as fit a row without the labels crowding. */
const AUDIO_RATES = [0.75, 1, 1.5, 2];

/* \u2500\u2500 ADHAN SOUNDS \u2500\u2500
   One shipped with the app and whatever the administrators have uploaded since.
   The shipped one is always first and cannot be removed: it is the only adhan
   that is in the service-worker cache from the start, so it is the one that still
   plays when the phone is offline at Fajr. */

const ADHAN_DEFAULT = { key: 'default', label: 'Classic Adhan', sub: 'Shipped with the app', file: './adhan.mp3' };

/* The Shia adhan recordings published by praytimes.org, served from this app
   rather than linked: three megabytes for all twelve, which buys playback with
   no third-party host in the path, nothing to add to the media-src policy, and
   an adhan that still sounds when the phone is offline. They are named for the
   muadhdhin, because that is the only thing that distinguishes one from another
   until you have heard it — which is what the preview button beside each is for.
   Built in rather than uploaded: they need no administrator, and they survive an
   empty database. */
const BUILTIN_ADHANS = [
  'Aghati', 'Ghalwash', 'Kazem-Zadeh', 'Moazzen-Zadeh', 'Mohammad-Zadeh',
  'Rezaeian', 'Rowhani-Nejad', 'Salimi', 'Sharif', 'Sobhdel', 'Tasvieh-Chi', 'Tookhi'
].map(f => ({
  key: 'builtin:' + f,
  label: f.replace(/-/g, ' '),
  sub: 'Shia adhan',
  file: './adhan/' + f + '.mp3'
}));

/* Administrators can rename a built-in adhan or take it off the list, but not
   delete it: the file ships inside the app. Both are stored as an override
   keyed by the built-in, so a rename is undoable and a hidden one comes back
   the moment it is shown again. Hiding is enough — the point of removing one is
   that nobody sees it, and that is exactly what this does. */
function adhanSounds(list, overrides) {
  const ov = overrides || {};
  const builtin = BUILTIN_ADHANS
    .filter(a => !(ov[a.key] || {}).hidden)
    .map(a => {
      const o = ov[a.key] || {};
      return o.name ? { ...a, label: o.name } : a;
    });
  const extra = (list || [])
    .filter(a => a && a.url && a.name)
    .map(a => ({
      /* Keyed on an id rather than the URL: two azans may legitimately point at the
         same file, and an index would quietly hand everyone a different adhan the
         day one above it is removed. */
      key: 'up:' + (a.id || a.url),
      label: String(a.name).slice(0, 40),
      sub: String(a.reciter || 'Uploaded').slice(0, 40),
      file: a.url
    }));
  return [ADHAN_DEFAULT, ...builtin, ...extra];
}

/* ── SUPABASE SYNC ── */
const SB_URL = 'https://zwpimotdtuhbpwjcooiz.supabase.co';
const SB_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp3cGltb3RkdHVoYnB3amNvb2l6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1ODIxMTUsImV4cCI6MjA5ODE1ODExNX0.BEdbAK9_lquFL8WyWwOU_DQ1bGbwzSpO9A54kKQxZFU';
const SB_HEADS = { apikey: SB_KEY, Authorization: 'Bearer ' + SB_KEY, 'Content-Type': 'application/json' };

/* ── WEB PUSH ── */
const VAPID_PUBLIC_KEY = 'BGaIKdSnFYd_cHBqlukrEy1rI2wATyDLx7d08nvL90u2SxV240WaVz706fiqo5lPybZmf9Q0oEZuHpsOLHlPrs4';
const EDGE_PUSH = SB_URL + '/functions/v1/send-push';
/* Server-authoritative endpoints. The anon key below is a public identifier, not
   a secret — it only gets past the gateway; both functions hold the service-role
   key server-side and neither table is readable with the anon key. */
const EDGE_QUIZ_SUBMIT = SB_URL + '/functions/v1/submit-quiz-score';
const EDGE_REPORT_TIME = SB_URL + '/functions/v1/report-prayer-time';
// insert-only: the table has no read policy, so nothing written here can be
// pulled back out with the key that ships in this bundle
const EDGE_ISSUE = SB_URL + '/rest/v1/issue_reports';
const EDGE_UPLOAD_MEDIA = SB_URL + '/functions/v1/upload-media';
/* Kept in step with upload-media's own table by hand. The server's limit is the
   one that binds; this one only saves the caller a doomed upload. */
const MEDIA_KINDS = {
  pdf: { max: 25 * 1024 * 1024, label: 'PDF', upload: 'a PDF', accept: 'application/pdf,.pdf' },
  audio: { max: 60 * 1024 * 1024, label: 'audio', upload: 'audio', accept: 'audio/*,.mp3,.m4a,.ogg,.wav' },
  /* Shrunk to 320px before it is sent, so the ceiling is for a mistake rather
     than the target: a logo is drawn at 50 CSS pixels. */
  image: { max: 5 * 1024 * 1024, label: 'logo', upload: 'a Logo', accept: 'image/*', resizeTo: 320 }
};

/* The two published courses, chapter by chapter. Held here rather than typed
   into the dashboard: 149 chapters is not something anyone should enter by hand,
   and the set only changes when a new edition of the book does. A 'learning'
   content row overrides it if one is ever added, like every other section.
   File names are slugs built from the titles, so an apostrophe or a space in a
   chapter name never has to survive a URL. */
const LEARNING_BASE = SB_URL + '/storage/v1/object/public/library-pdfs/learning/';
const LEARNING = [{
  id: 'jurisprudence',
  title: 'Teaching Jurisprudence',
  sub: 'Fiqh one topic at a time, for older children and adults',
  chapters: [
    { title: 'Adhan & Iqama', file: 'adhan-iqama.pdf' },
    { title: 'Cover and Contents', file: 'cover-and-contents.pdf' },
    { title: 'Dietary Laws', file: 'dietary-laws.pdf' },
    { title: 'Fiqh', file: 'fiqh.pdf' },
    { title: 'Ghusl', file: 'ghusl.pdf' },
    { title: 'Hajj', file: 'hajj.pdf' },
    { title: 'Ijtihaad', file: 'ijtihaad.pdf' },
    { title: 'Jabira Wudhoo', file: 'jabira-wudhoo.pdf' },
    { title: 'Khums', file: 'khums.pdf' },
    { title: 'Mujtahid', file: 'mujtahid.pdf' },
    { title: 'Muqaddamatus Salaa', file: 'muqaddamatus-salaa.pdf' },
    { title: 'Muqallid', file: 'muqallid.pdf' },
    { title: 'Najasa & Tahara', file: 'najasa-tahara.pdf' },
    { title: 'Nawaaqiz of Wudhoo', file: 'nawaaqiz-of-wudhoo.pdf' },
    { title: 'Niyya', file: 'niyya.pdf' },
    { title: 'Qiyaam', file: 'qiyaam.pdf' },
    { title: 'Qunoot', file: 'qunoot.pdf' },
    { title: 'Rukoo', file: 'rukoo.pdf' },
    { title: 'Salaa (Pl. Salawat)', file: 'salaa-pl-salawat.pdf' },
    { title: 'Salaatul Jumua\u2019', file: 'salaatul-jumua.pdf' },
    { title: 'Salatul Ayaat', file: 'salatul-ayaat.pdf' },
    { title: 'Salatul Jama\u2019a', file: 'salatul-jamaa.pdf' },
    { title: 'Salatul Qasr', file: 'salatul-qasr.pdf' },
    { title: 'Sawm', file: 'sawm.pdf' },
    { title: 'Sujood', file: 'sujood.pdf' },
    { title: 'Takbeeratul Ihram', file: 'takbeeratul-ihram.pdf' },
    { title: 'Taqleed', file: 'taqleed.pdf' },
    { title: 'Tarteeb & Muwalat', file: 'tarteeb-muwalat.pdf' },
    { title: 'Tashahhud & Tasleem (Salaam)', file: 'tashahhud-tasleem-salaam.pdf' },
    { title: 'Tayammum', file: 'tayammum.pdf' },
    { title: 'Terminology & Practices', file: 'terminology-practices.pdf' },
    { title: 'The Munafiyaat of Salaa', file: 'the-munafiyaat-of-salaa.pdf' },
    { title: 'Third and Fourth Raka\u2019a', file: 'third-and-fourth-rakaa.pdf' },
    { title: 'Wajibaat of Salaa', file: 'wajibaat-of-salaa.pdf' },
    { title: 'Wudhoo', file: 'wudhoo.pdf' },
    { title: 'Zakaa', file: 'zakaa.pdf' }
  ]
}, {
  id: 'infants',
  title: 'Learning Islam for Infants',
  sub: 'A first course: the Qur\'an, belief, salaa and the Ahlul Bayt',
  chapters: [
    { no: 0, title: 'Cover and Contents', file: 'cover-and-contents.pdf' },
    { no: 1, title: 'Preface', file: 'preface.pdf' },
    { no: 2, title: 'Learning Objectives', file: 'learning-objectives.pdf' },
    { no: 3, title: 'Syllabus at a Glance', file: 'syllabus-at-a-glance.pdf' },
    { no: 4, title: 'Q Calendar - Up to 7 Years', file: 'q-calendar-up-to-7-years.pdf' },
    { no: 5, title: 'Qur\'an City Map', file: 'quran-city-map.pdf' },
    { no: 6, title: 'Blank Qur\'an City Map', file: 'blank-quran-city-map.pdf' },
    { no: 7, title: 'The Qur\'an', file: 'the-quran.pdf' },
    { no: 8, title: 'Let Us Use Correct Words', file: 'let-us-use-correct-words.pdf' },
    { no: 9, title: 'Manners for Reciting the Qur\'an', file: 'manners-for-reciting-the-quran.pdf' },
    { no: 10, title: 'Learning the Names of Suwer', file: 'learning-the-names-of-suwer.pdf' },
    { no: 11, title: 'Sura Al Faatiha', file: 'sura-al-faatiha.pdf' },
    { no: 12, title: 'Sura Al Ikhlaas', file: 'sura-al-ikhlaas.pdf' },
    { no: 13, title: 'Sura Al Qadr', file: 'sura-al-qadr.pdf' },
    { no: 14, title: 'Sura Al Kaafirun', file: 'sura-al-kaafirun.pdf' },
    { no: 15, title: 'Sura Al Falaq', file: 'sura-al-falaq.pdf' },
    { no: 16, title: 'Sura Al Naas', file: 'sura-al-naas.pdf' },
    { no: 17, title: 'Sura Al Kawthar', file: 'sura-al-kawthar.pdf' },
    { no: 18, title: 'Sura Al \'Asr', file: 'sura-al-asr.pdf' },
    { no: 19, title: 'Sura Al Feel', file: 'sura-al-feel.pdf' },
    { no: 20, title: 'Ayatul Kursi - 2-255', file: 'ayatul-kursi-2-255.pdf' },
    { no: 21, title: 'Ayatul Birr - 2-177', file: 'ayatul-birr-2-177.pdf' },
    { no: 22, title: 'I Am a Muslim', file: 'i-am-a-muslim.pdf' },
    { no: 23, title: 'Remembering Allah All the Time', file: 'remembering-allah-all-the-time.pdf' },
    { no: 24, title: 'Angels', file: 'angels.pdf' },
    { no: 25, title: 'Who Is Shaytan', file: 'who-is-shaytan.pdf' },
    { no: 26, title: 'Tawheed', file: 'tawheed.pdf' },
    { no: 27, title: 'Adala (Justice)', file: 'adala-justice.pdf' },
    { no: 28, title: 'Nabuwwa (Prophethood)', file: 'nabuwwa-prophethood.pdf' },
    { no: 29, title: 'Imama', file: 'imama.pdf' },
    { no: 30, title: 'Qiyama', file: 'qiyama.pdf' },
    { no: 31, title: 'Taqleed', file: 'taqleed.pdf' },
    { no: 32, title: 'Najasaat and Mutahhiraat', file: 'najasaat-and-mutahhiraat.pdf' },
    { no: 33, title: 'Manner and Tahara in the Toilet', file: 'manner-and-tahara-in-the-toilet.pdf' },
    { no: 34, title: 'Wudhoo', file: 'wudhoo.pdf' },
    { no: 35, title: 'Qibla', file: 'qibla.pdf' },
    { no: 36, title: 'Place for Salaa', file: 'place-for-salaa.pdf' },
    { no: 37, title: 'Clothes for Salaa', file: 'clothes-for-salaa.pdf' },
    { no: 38, title: 'Times for Salaa', file: 'times-for-salaa.pdf' },
    { no: 39, title: 'Salaa', file: 'salaa.pdf' },
    { no: 40, title: 'Adhaan', file: 'adhaan.pdf' },
    { no: 41, title: 'Iqama', file: 'iqama.pdf' },
    { no: 42, title: 'Number of Rakaats and Times of Salaa', file: 'number-of-rakaats-and-times-of-salaa.pdf' },
    { no: 43, title: 'This Is How I Pray Salaa (Namaz)', file: 'this-is-how-i-pray-salaa-namaz.pdf' },
    { no: 44, title: 'Qunoot', file: 'qunoot.pdf' },
    { no: 45, title: 'Ta\'qibaat', file: 'taqibaat.pdf' },
    { no: 46, title: 'Words Used in Fiqh and Their Meaning', file: 'words-used-in-fiqh-and-their-meaning.pdf' },
    { no: 47, title: 'Activities of a Day', file: 'activities-of-a-day.pdf' },
    { no: 48, title: 'Waking Up', file: 'waking-up.pdf' },
    { no: 49, title: 'Toilet Manners', file: 'toilet-manners.pdf' },
    { no: 50, title: 'Bathroom Manners', file: 'bathroom-manners.pdf' },
    { no: 51, title: 'Eating Manners', file: 'eating-manners.pdf' },
    { no: 52, title: 'Manners in the Imambara', file: 'manners-in-the-imambara.pdf' },
    { no: 53, title: 'Classroom Manners', file: 'classroom-manners.pdf' },
    { no: 54, title: 'Sharing', file: 'sharing.pdf' },
    { no: 55, title: 'Friendship', file: 'friendship.pdf' },
    { no: 56, title: 'Manners of Sleeping', file: 'manners-of-sleeping.pdf' },
    { no: 57, title: 'Lying', file: 'lying.pdf' },
    { no: 58, title: 'Manners of Talking', file: 'manners-of-talking.pdf' },
    { no: 59, title: 'Sadaqa', file: 'sadaqa.pdf' },
    { no: 60, title: 'Do Not Abuse', file: 'do-not-abuse.pdf' },
    { no: 61, title: 'Do Not Belittle Others', file: 'do-not-belittle-others.pdf' },
    { no: 62, title: 'Duties Towards Parents', file: 'duties-towards-parents.pdf' },
    { no: 63, title: 'Behaving Like Little Muslims', file: 'behaving-like-little-muslims.pdf' },
    { no: 64, title: 'Process of Life', file: 'process-of-life.pdf' },
    { no: 65, title: 'Prophet Adam (PBUH)', file: 'prophet-adam-pbuh.pdf' },
    { no: 66, title: 'The Sons of Prophet Adam (PBUH)', file: 'the-sons-of-prophet-adam-pbuh.pdf' },
    { no: 67, title: 'Prophet Nuh (PBUH)', file: 'prophet-nuh-pbuh.pdf' },
    { no: 68, title: 'Prophet Ibraheem (PBUH)', file: 'prophet-ibraheem-pbuh.pdf' },
    { no: 69, title: 'Prophet Ismail (PBUH)', file: 'prophet-ismail-pbuh.pdf' },
    { no: 70, title: 'Prophet Yunus (PBUH)', file: 'prophet-yunus-pbuh.pdf' },
    { no: 71, title: 'Prophet Musa (PBUH) - Part 1', file: 'prophet-musa-pbuh-part-1.pdf' },
    { no: 72, title: 'Prophet Musa (PBUH) - Part 2', file: 'prophet-musa-pbuh-part-2.pdf' },
    { no: 73, title: 'Prophet Sulayman (PBUH)', file: 'prophet-sulayman-pbuh.pdf' },
    { no: 74, title: 'Prophet Isa (PBUH)', file: 'prophet-isa-pbuh.pdf' },
    { no: 75, title: 'Aamul Feel', file: 'aamul-feel.pdf' },
    { no: 76, title: 'The Year of the Elephant', file: 'the-year-of-the-elephant.pdf' },
    { no: 77, title: 'Abdul Muttalib (PBUH)', file: 'abdul-muttalib-pbuh.pdf' },
    { no: 78, title: 'Hazrat Abdullah and Amina (PBUH)', file: 'hazrat-abdullah-and-amina-pbuh.pdf' },
    { no: 79, title: 'Birth of Prophet Muhammad (PBUH)', file: 'birth-of-prophet-muhammad-pbuh.pdf' },
    { no: 80, title: 'Prophet Muhammad (PBUH) - Part 1', file: 'prophet-muhammad-pbuh-part-1.pdf' },
    { no: 81, title: 'Al Amin (The Trustworthy One)', file: 'al-amin-the-trustworthy-one.pdf' },
    { no: 82, title: 'Announcement of Prophethood', file: 'announcement-of-prophethood.pdf' },
    { no: 83, title: 'Prophet Muhammad (PBUH) - Part 2', file: 'prophet-muhammad-pbuh-part-2.pdf' },
    { no: 84, title: 'Mi\'raaj', file: 'miraaj.pdf' },
    { no: 85, title: 'Hijra to Madina', file: 'hijra-to-madina.pdf' },
    { no: 86, title: 'Farewell Hajj', file: 'farewell-hajj.pdf' },
    { no: 87, title: 'A Very Special Announcement', file: 'a-very-special-announcement.pdf' },
    { no: 88, title: 'Wafat of Prophet Muhammad (PBUH)', file: 'wafat-of-prophet-muhammad-pbuh.pdf' },
    { no: 89, title: 'The Prophet and His Ahlulbayt (PBUH)', file: 'the-prophet-and-his-ahlulbayt-pbuh.pdf' },
    { no: 90, title: 'Salawaat', file: 'salawaat.pdf' },
    { no: 91, title: 'Sayyida Fatima Az Zahra (PBUH)', file: 'sayyida-fatima-az-zahra-pbuh.pdf' },
    { no: 92, title: 'Imam Ali (PBUH)', file: 'imam-ali-pbuh.pdf' },
    { no: 93, title: 'Imam Hasan (PBUH)', file: 'imam-hasan-pbuh.pdf' },
    { no: 94, title: 'Imam Husayn (PBUH)', file: 'imam-husayn-pbuh.pdf' },
    { no: 95, title: 'Imam Ali Zaynul Aabideen (PBUH)', file: 'imam-ali-zaynul-aabideen-pbuh.pdf' },
    { no: 96, title: 'Imam Muhammad Al Baqir (PBUH)', file: 'imam-muhammad-al-baqir-pbuh.pdf' },
    { no: 97, title: 'Imam Ja\'fer As Sadiq (PBUH)', file: 'imam-jafer-as-sadiq-pbuh.pdf' },
    { no: 98, title: 'Imam Musa Al Kadhim (PBUH)', file: 'imam-musa-al-kadhim-pbuh.pdf' },
    { no: 99, title: 'Imam Ali Ar Ridha (PBUH)', file: 'imam-ali-ar-ridha-pbuh.pdf' },
    { no: 100, title: 'Imam Muhammad At Taqi (PBUH)', file: 'imam-muhammad-at-taqi-pbuh.pdf' },
    { no: 101, title: 'Imam Ali An Naqi (PBUH)', file: 'imam-ali-an-naqi-pbuh.pdf' },
    { no: 102, title: 'Imam Hasan Al Askery (PBUH)', file: 'imam-hasan-al-askery-pbuh.pdf' },
    { no: 103, title: 'Imam Muhammad Al Mahdi (PBUH)', file: 'imam-muhammad-al-mahdi-pbuh.pdf' },
    { no: 104, title: 'The Islamic Year', file: 'the-islamic-year.pdf' },
    { no: 105, title: 'Friday', file: 'friday.pdf' },
    { no: 106, title: 'Eid Ul Fitr', file: 'eid-ul-fitr.pdf' },
    { no: 107, title: 'Eid Ul Hajj and Eid Ul Adha (Sacrifice)', file: 'eid-ul-hajj-and-eid-ul-adha-sacrifice.pdf' },
    { no: 108, title: 'Eid Ul Ghadeer', file: 'eid-ul-ghadeer.pdf' },
    { no: 109, title: 'Eid Ul Mubahila', file: 'eid-ul-mubahila.pdf' },
    { no: 110, title: 'Ziyara', file: 'ziyara.pdf' },
    { no: 111, title: 'Other Important Places of Ziyara', file: 'other-important-places-of-ziyara.pdf' },
    { no: 112, title: 'Daily Ziyara', file: 'daily-ziyara.pdf' }
  ]
}];

/* pdf.js and its worker are 1.4 MB \u2014 more than everything else this app ships
   put together. Fetched the first time someone opens a PDF and never at boot, so
   a reader who never touches one never pays for it. The service worker caches
   them like any other same-origin GET, so the second time is free and offline. */
let pdfjsLoad = null;
function loadPdfjs() {
  if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
  if (pdfjsLoad) return pdfjsLoad;
  pdfjsLoad = new Promise((resolve, reject) => {
    const el = document.createElement('script');
    el.src = '/vendor/pdf.min.js';
    el.onload = () => {
      if (!window.pdfjsLib) { pdfjsLoad = null; reject(new Error('viewer_missing')); return; }
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/vendor/pdf.worker.min.js';
      resolve(window.pdfjsLib);
    };
    el.onerror = () => { pdfjsLoad = null; reject(new Error('viewer_unreachable')); };
    document.head.appendChild(el);
  });
  return pdfjsLoad;
}

/* Both formats announce themselves in their first few bytes, which is worth
   checking before a 60 MB upload and worth not trusting afterwards \u2014 the bucket's
   own MIME allow-list is what actually decides. */
function looksLikePdf(head) {
  return head.length >= 5 && head[0] === 0x25 && head[1] === 0x50 &&
         head[2] === 0x44 && head[3] === 0x46 && head[4] === 0x2d;
}
function looksLikeAudio(head) {
  if (head.length < 12) return false;
  const at = (i, str) => [...str].every((c, n) => head[i + n] === c.charCodeAt(0));
  if (at(0, 'ID3')) return true;                                   // tagged MP3
  if (head[0] === 0xff && (head[1] & 0xe0) === 0xe0) return true;   // bare MPEG frame
  if (at(4, 'ftyp')) return true;                                   // M4A / MP4 audio
  if (at(0, 'OggS')) return true;
  if (at(0, 'RIFF') && at(8, 'WAVE')) return true;
  if (head[0] === 0x1a && head[1] === 0x45 && head[2] === 0xdf && head[3] === 0xa3) return true; // WebM
  return false;
}
function looksLikeImage(head) {
  if (head.length < 12) return false;
  const at = (i, str) => [...str].every((c, n) => head[i + n] === c.charCodeAt(0));
  if (head[0] === 0x89 && at(1, 'PNG')) return true;
  if (head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff) return true;   // JPEG
  if (at(0, 'GIF8')) return true;
  if (at(0, 'RIFF') && at(8, 'WEBP')) return true;
  if (at(0, '<svg') || at(0, '<?xm')) return true;                              // SVG, with or without a prolog
  return false;
}
const sniffMedia = (kind, head) =>
  kind === 'audio' ? looksLikeAudio(head)
  : kind === 'image' ? looksLikeImage(head)
  : looksLikePdf(head);
const LEADERBOARD_URL = SB_URL + '/rest/v1/quiz_leaderboard_public';

const PUSH_MSG = {
  announcement: 'Majlis Live — new announcement from Ahlul Bayt Ireland',
  askImam: 'Ask Your Maulana — contact list updated',
  kidsQuizzes: 'New kids quiz published — can you get it right?',
  events: 'New event added to the community calendar',
  stories: 'New story or article has been published',
  pinned: 'Featured message has been updated',
  classifieds: 'New listing in community classifieds',
  ads: null, // billboard changes are not worth a notification
  azanOverrides: null, // renaming or hiding an adhan is housekeeping, not news
  calEvents: 'Islamic calendar updated',
  reminders: 'A new reminder has been added',
  prayerPresets: 'Prayer times updated',
  duas: 'Library updated — new duʿāʾ content',
  ziyarat: 'Library updated — new ziyārah content',
  nahj: 'Library updated — Books',
  aamals: 'Taqeebat and Ziyarat updated',
  amaalActs: 'Library updated — new amaal',
  infallibles: null, // biographies are reference material, not news
  mosques: 'The mosque list has been updated',
  salat: 'Library updated — new salat content'
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
  reminders: 'liveReminders', ads: 'liveAds', learning: 'liveLearning',
  azans: 'liveAzans', azanOverrides: 'liveAzanOverrides',
  amaalActs: 'liveAmaalActs', infallibles: 'liveInfallibles', mosques: 'liveMosques',
  salat: 'liveSalat'
};

/* Category ink for classifieds badges. Listings store the colour they were saved
   with, so older rows still carry values that fail contrast as text; this maps
   them at render time instead of rewriting anyone's data. */
const CAT_INK = {
  'Food': '#1f5145', 'Butcher': '#6e2230', 'Travel': '#7d6220',
  'Education': '#2c5d52', 'Services': '#3a4a78'
};

/* Billboard slides that are switched on, carry an image, and are inside their
   booked run of dates. */
function activeAds(ads) {
  return (ads || []).filter(a => a && a.img && a.on !== false && withinWindow(a));
}

/* Why an ad is or is not on the billboard, in the order that decides it: a
   paused ad is paused whatever its dates say. Written once so the editor and the
   list cannot describe the same ad differently. */
function adStatus(a) {
  if (!a) return 'ended';
  if (a.on === false) return 'paused';
  if (a.from && Date.now() < new Date(a.from + 'T00:00:00').getTime()) return 'scheduled';
  if (a.until && Date.now() > new Date(a.until + 'T23:59:59').getTime()) return 'ended';
  return 'live';
}
const shortDate = s => {
  const d = new Date(String(s || '') + 'T00:00:00');
  return isNaN(d.getTime()) ? String(s || '') : d.toLocaleDateString('en-IE', { day: 'numeric', month: 'short' });
};

/* A classified is sponsored while a billboard ad is running under its name.
   The name is the join: the ad editor's "Fill from a classifieds business"
   writes it, and there is no id on either side to match on instead.

   Which makes the comparison worth being generous about. A name typed by hand
   rather than picked from that list differs by a capital, a double space, or the
   apostrophe a phone keyboard substitutes — and the cost of a near miss is an
   advertiser quietly not getting the badge they paid for. */
const sponsorKey = s => String(s || '')
  .replace(/[‘’ʼ´`]/g, "'")
  .replace(/\s+/g, ' ')
  .trim()
  .toLowerCase();

function sponsoredNames(ads) {
  const names = new Set();
  activeAds(ads).forEach(a => {
    const n = sponsorKey(a.name);
    if (n) names.add(n);
  });
  return names;
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
/* A run of dates, both ends optional and both inclusive of their whole day: an
   ad booked until the 8th is still up on the evening of the 8th. Stories and
   billboard ads are scheduled by the same function on purpose — two copies of a
   date comparison are two chances to disagree about whether the last day counts. */
function withinWindow(item) {
  if (!item) return false;
  const now = Date.now();
  if (item.from && now < new Date(item.from + 'T00:00:00').getTime()) return false;
  if (item.until && now > new Date(item.until + 'T23:59:59').getTime()) return false;
  return true;
}
function storyIsLive(s) {
  return withinWindow(s);
}
const activeStories = list => (list || []).filter(storyIsLive);

/* A short fade for the chrome at the top of a photo story. It reaches nothing by
   a quarter of the way down: whatever the picture is of, that part of it is shown
   as it was posted. */
const TOP_FADE = 'linear-gradient(180deg,rgba(0,0,0,.42) 0%,rgba(0,0,0,.14) 12%,rgba(0,0,0,0) 24%)';
/* The caption's own backing. It is painted on the caption block rather than on
   the frame, so it is exactly as tall as there is writing to protect — a two-line
   announcement darkens the bottom fifth of the photograph and nothing else. A
   fixed band cannot do that: sized for a title it buried a quiz, and sized for a
   quiz it dimmed two thirds of every picture. A quiz gets the deeper of the two
   because its answer chips are translucent, and a chip is only as readable as
   what shows through it. */
const captionScrim = quiz => quiz
  ? 'linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,.55) 22%,rgba(0,0,0,.78) 52%,rgba(0,0,0,.84) 100%)'
  : 'linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,.45) 28%,rgba(0,0,0,.7) 62%,rgba(0,0,0,.8) 100%)';
/* Backing for the name and the close ×, which have no band tall enough to sit
   in. Set by measurement rather than by eye: at .34 the close button fell to
   3.5:1 over the brightest photograph currently posted, and this is the control
   that gets a reader out of the story. */
const CHROME_PAD = 'rgba(0,0,0,.5)';

function ytId(url) {
  if (!url) return null;
  const m = String(url).match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/);
  return m ? m[1] : null;
}

/* Same shrink, but handing back a Blob. The data-URL version cannot feed an
   upload: turning one back into bytes means fetch()ing it, and the content
   security policy does not list data: under connect-src — correctly, since
   nothing else here should be fetching one. */
function resizeImageBlob(file, maxDim, type, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(b => b ? resolve(b) : reject(new Error('encode_failed')), type, quality);
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function resizeImageFile(file, maxDim, quality, type) {
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
        // PNG when asked: a JPEG puts a white rectangle behind every transparent mark
        resolve(canvas.toDataURL(type || 'image/jpeg', quality));
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
      nahjBook: 'nahj',
      // per tab, because each section's natural order is its own: carrying one
      // tab's choice across would quietly override the next tab's default
      libSort: {},
      prayerTab: 'today',
      kidsTab: 'videos',
      learnBook: null,
      learnQuery: '',
      healthTab: 'videos',
      dark: (THEME_DARK = lsGet('dark', false)),
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
      // was hardcoded true, so turning the adhan off lasted until the next reload
      adhanEnabled: lsGet('adhanEnabled', true),
      adhanMuted: lsGet('adhanMuted', {}),
      adhanSound: lsGet('adhanSound', 'default'),
      notifEnabled: lsGet('notifEnabled', false),
      adhanPlaying: false,
      adhanPending: false,
      adhanPreview: null,
      notifPermission: typeof Notification !== 'undefined' ? Notification.permission : 'default',
      qiblaStatus: 'idle',
      qiblaBearing: null,
      qiblaLat: null,
      qiblaLng: null,
      qiblaAcc: null,
      pdfStatus: 'idle',
      pdfError: null,
      pdfPage: 1,
      pdfPages: 0,
      pdfZoom: 1,
      pdfSaving: false,
      audioPlaying: false,
      audioAt: 0,
      audioDur: 0,
      /* A rate saved before this list changed would match no pill, leaving the
         group with nothing selected and the audio at a speed nobody chose. */
      audioRate: AUDIO_RATES.includes(lsGet('audioRate', 1)) ? lsGet('audioRate', 1) : 1,
      adminUpload: null,
      // the live compass reading, and the accumulated dial angle that follows it
      qiblaHeading: null,
      qiblaSpin: null,
      qiblaMotion: null,
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
        color: onSurf('#6e2230')
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
      liveAmaalActs: lsGet('amaalActs', []),
      liveSalat: lsGet('salat', SALAT),
      liveInfallibles: lsGet('infallibles', INFALLIBLES),
      liveMosques: lsGet('mosques', MOSQUES),
      infOpen: null,
      issueCat: '',
      issueMsg: '',
      issueContact: '',
      issueState: null,
      lastRead: lsGet('lastRead', null),
      liveZiyarat: lsGet('ziyarat', ZIYARAT),
      liveNahj: lsGet('nahj', NAHJ),
      liveLearning: lsGet('learning', LEARNING),
      liveAzans: lsGet('azans', []),
      liveAzanOverrides: lsGet('azanOverrides', {}),
      azanRenaming: null,
      azanRenameText: '',
      liveKidsQuizzes: migrateQuizzes(lsGet('kidsQuizzes', KIDS_QUIZZES)),
      quizRun: null,
      /* The name is remembered so the next quiz does not ask again, and stays
         editable on the way in. Nothing else about a participant is kept. */
      quizName: lsGet('quizName', ''),
      quizBest: lsGet('quizBest', {}),
      quizNameDraft: null,
      quizNameErr: null,
      quizSubmit: null,
      lbTab: 'easy',
      lbState: 'idle',
      lbRows: [],
      lbError: null,
      pendingCount: 0,
      liveAskImam: lsGet('askImam', []),
      liveAds: lsGet('ads', []),
      adIdx: 0,
      liveAutoTimes: lsGet('autoTimes', null),
      /* null means the community default; anything else is the town the reader
         picked, or the device's own coordinates. */
      prayerLoc: lsGet('prayerLoc', null),
      autoTimesErr: null,
      autoTimesBusy: false,
      locBusy: false,
      reportOpen: false,
      reportPrayer: 'Fajr',
      reportExpected: '',
      reportNote: '',
      reportState: null,
      kidsQuizPicks: {},
      kidsVidCat: 'All',
      healthVidCat: 'All',
      adminLibTab: 'dua'
    });
    /* Insert-only from here: the table has no read policy, so what someone
       writes — and any contact detail in it — cannot be pulled back out with
       the key that ships inside this bundle. Administrators read them in the
       Supabase dashboard. */
    _defineProperty(this, "submitIssue", async () => {
      const st = this.state;
      const cat = (st.issueCat || '').trim();
      const msg = (st.issueMsg || '').trim();
      if (!cat) return this.setState({ issueState: { kind: 'error', message: 'Choose what the report is about.' } });
      if (msg.length < 5) return this.setState({ issueState: { kind: 'error', message: 'Please describe the issue in a little more detail.' } });
      if (!navigator.onLine) return this.setState({ issueState: { kind: 'error', message: 'You are offline. Please send this when you are back online.' } });
      this.setState({ issueState: { kind: 'sending' } });
      try {
        const res = await fetch(EDGE_ISSUE, {
          method: 'POST',
          headers: { ...SB_HEADS, Prefer: 'return=minimal' },
          body: JSON.stringify({
            category: cat.slice(0, 40),
            message: msg.slice(0, 2000),
            contact: (st.issueContact || '').trim().slice(0, 120) || null
          })
        });
        if (res.ok) this.setState({ issueState: { kind: 'sent' } });
        else this.setState({ issueState: { kind: 'error', message: res.status === 429
          ? 'You have sent a few reports just now — please try again shortly.'
          : 'That report could not be sent. Please try again.' } });
      } catch {
        this.setState({ issueState: { kind: 'error', message: 'That report could not be sent. Please try again.' } });
      }
    });
    _defineProperty(this, "go", s => {
      // Refresh every page on navigation: reset transient view state so each
      // screen opens fresh, and scroll the content area back to the top.
      if (this.state.screen === 'reading') this.saveReadPos();
      // a PDF left open keeps a worker and a decoded page in memory
      if (this.state.screen === 'reading' && s !== 'reading') { this.destroyPdf(); this.audioStop(); }
      // GPS and the magnetometer cost battery for as long as they are attached
      if (this.state.screen === 'qibla' && s !== 'qibla') this.stopQibla();
      this.clearQuizTimers();
      this.setState({
        screen: s,
        story: null,
        libTab: 'dua',
        libCat: 'All',
        libQuery: '',
        libSort: {},
        nahjBook: 'nahj',
        nahjTab: 'sermons',
        prayerTab: 'today',
        kidsTab: 'videos',
        learnBook: null,
        learnQuery: '',
        kidsVidCat: 'All',
        kidsQuizPicks: {},
        quizRun: null,
        healthTab: 'videos',
        healthVidCat: 'All',
        calViewY: null,
        calViewM: undefined,
        calDay: null,
        wallOpen: null,
        // the biography being read, and the thank-you card, are both view state:
        // coming back to either screen should start it fresh
        infOpen: null,
        issueState: null,
        mosqueQuery: ''
      });
      const sc = document.querySelector('.app > .s');
      if (sc) sc.scrollTop = 0;
    });
    /* ── QUIZ GAME ──
       A run is 10 random questions from the chosen level, 15 seconds each.
       The countdown pauses while the player is off the quiz tab, a timeout
       counts as a wrong answer, and each question auto-advances after reveal. */
    _defineProperty(this, "clearQuizTimers", () => {
      clearInterval(this.quizTick);
      clearTimeout(this.quizNext);
    });
    _defineProperty(this, "startQuizRun", (lvl, displayName) => {
      this.clearQuizTimers();
      const pool = (this.state.liveKidsQuizzes || []).filter(q => quizLevel(q) === lvl);
      const arr = [...pool];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      const now = Date.now();
      this.setState({
        /* attemptId is minted before the first question, so a result finished
           offline and replayed later is the same attempt to the server however
           many times it is sent. */
        quizRun: {
          lvl, qs: arr.slice(0, 10), pos: 0, score: 0, pick: null,
          timeLeft: SCORING.SECONDS_PER_QUESTION, done: false,
          attemptId: randomId(), name: displayName, startedAt: now, qStart: now,
          answers: [], durationMs: 0
        },
        quizSubmit: null
      });
      this.quizTick = setInterval(this.quizTickFn, 1000);
    });
    /* One place that appends to answers, so the timed-out path and the answered
       path can never record different shapes. */
    _defineProperty(this, "recordAnswer", (r, picked) => {
      const q = r.qs[r.pos];
      const ms = Math.max(0, Date.now() - r.qStart);
      return {
        ...r,
        pick: picked,
        score: r.score + (picked === q.answer ? 1 : 0),
        answers: [...r.answers, { q: q.question, p: picked, ms }]
      };
    });
    _defineProperty(this, "quizTickFn", () => {
      this.setState(s => {
        const r = s.quizRun;
        if (!r || r.done || r.pick !== null) return null;
        if (s.screen !== 'kids' || s.kidsTab !== 'quiz') return null; // pause while away
        if (r.timeLeft <= 1) {
          clearInterval(this.quizTick);
          this.quizNext = setTimeout(this.quizAdvance, 2000);
          return { quizRun: { ...this.recordAnswer(r, -1), timeLeft: 0 } };
        }
        return { quizRun: { ...r, timeLeft: r.timeLeft - 1 } };
      });
    });
    _defineProperty(this, "answerQuizRun", oi => {
      const r = this.state.quizRun;
      if (!r || r.done || r.pick !== null) return;
      clearInterval(this.quizTick);
      this.setState({ quizRun: this.recordAnswer(r, oi) });
      this.quizNext = setTimeout(this.quizAdvance, 1600);
    });
    _defineProperty(this, "quizAdvance", () => {
      this.setState(s => {
        const r = s.quizRun;
        if (!r || r.done) return null;
        if (r.pos >= r.qs.length - 1) {
          return { quizRun: { ...r, done: true, durationMs: Math.max(0, Date.now() - r.startedAt) } };
        }
        return {
          quizRun: {
            ...r, pos: r.pos + 1, pick: null,
            timeLeft: SCORING.SECONDS_PER_QUESTION, qStart: Date.now()
          }
        };
      }, () => {
        const r = this.state.quizRun;
        if (r && !r.done) {
          clearInterval(this.quizTick);
          this.quizTick = setInterval(this.quizTickFn, 1000);
        } else if (r && r.done) {
          this.submitQuizAttempt(r);
        }
      });
    });
    /* ── SUBMISSION ──
       What goes up is the attempt, not the result: which questions were asked and
       what was picked. The server marks them against its own copy of the bank and
       stores the score it worked out. The figure shown here is the same formula
       run locally, so the participant sees their result at once and offline. */
    _defineProperty(this, "submitQuizAttempt", run => {
      if (!run || !run.name) return;
      const total = run.qs.length;
      const payload = {
        attemptId: run.attemptId,
        quizId: 'kids',
        difficulty: run.lvl,
        displayName: run.name,
        durationMs: run.durationMs,
        completed: true,
        clientScore: computeScore(run.score, total, run.durationMs, true),
        correct: run.score,
        total,
        answers: run.answers.map(a => ({ q: a.q, p: a.p })),
        installId: installId(),
        queuedAt: Date.now()
      };
      this.setState({ quizSubmit: { state: 'sending' } });
      this.sendQuizAttempt(payload, true);
    });
    /* Resolves to a state string. Anything that is not a refusal by the server
       goes to the queue rather than being lost — a bad connection is the normal
       case here, not the exceptional one. */
    _defineProperty(this, "sendQuizAttempt", (payload, interactive) => {
      const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
      if (offline) {
        queuePut(payload);
        this.refreshPendingCount();
        if (interactive) this.setState({ quizSubmit: { state: 'queued' } });
        return Promise.resolve('queued');
      }
      return fetch(EDGE_QUIZ_SUBMIT, {
        method: 'POST',
        headers: SB_HEADS,
        cache: 'no-store',
        body: JSON.stringify(payload)
      }).then(r => r.json().then(j => ({ status: r.status, j })).catch(() => ({ status: r.status, j: {} }))).then(({ status, j }) => {
        if (status === 200 && j && j.ok) {
          queueDrop(payload.attemptId);
          this.refreshPendingCount();
          this.recordPersonalBest(payload, j);
          if (interactive) {
            this.setState({ quizSubmit: { state: 'ok', server: j } });
            this.loadLeaderboard(payload.difficulty);
          }
          return 'ok';
        }
        if (status === 429) {
          // the server is telling us to stop, not that the attempt is bad
          queuePut(payload);
          this.refreshPendingCount();
          if (interactive) this.setState({ quizSubmit: { state: 'queued', message: 'Too many submissions just now — this will be sent shortly.' } });
          return 'queued';
        }
        if (status >= 400 && status < 500) {
          // a refusal: replaying it will not help, so it does not go in the queue
          queueDrop(payload.attemptId);
          this.refreshPendingCount();
          const msg = j && j.message ? j.message : status === 503 ? 'The quiz service is unavailable.' : 'This result could not be accepted.';
          if (interactive) this.setState({ quizSubmit: { state: 'rejected', message: msg, code: j && j.error } });
          return 'rejected';
        }
        queuePut(payload);
        this.refreshPendingCount();
        if (interactive) this.setState({ quizSubmit: { state: 'queued' } });
        return 'queued';
      }).catch(() => {
        queuePut(payload);
        this.refreshPendingCount();
        if (interactive) this.setState({ quizSubmit: { state: 'queued' } });
        return 'queued';
      });
    });
    /* The server's figure, not the browser's, and only when it improves on what
       is already stored — same comparison the board sorts by. */
    _defineProperty(this, "recordPersonalBest", (payload, server) => {
      const diff = payload.difficulty;
      const row = {
        name: payload.displayName,
        score: server && typeof server.score === 'number' ? server.score : payload.clientScore,
        correct: server && typeof server.correct === 'number' ? server.correct : payload.correct,
        total: payload.total,
        durationMs: payload.durationMs,
        at: Date.now()
      };
      const cur = this.state.quizBest || {};
      const prev = cur[diff];
      const better = !prev || row.score > prev.score || row.score === prev.score && row.correct > prev.correct || row.score === prev.score && row.correct === prev.correct && row.durationMs < prev.durationMs;
      if (!better) return;
      const next = { ...cur, [diff]: row };
      lsSet('quizBest', next);
      this.setState({ quizBest: next });
    });
    _defineProperty(this, "refreshPendingCount", () => {
      queueAll().then(rows => this.setState({ pendingCount: Array.isArray(rows) ? rows.length : 0 })).catch(() => {});
    });
    /* Replayed one at a time and dropped only on a definite answer, so a flaky
       connection cannot quietly discard somebody's result. */
    _defineProperty(this, "syncPendingAttempts", () => {
      if (this._syncing) return Promise.resolve();
      if (typeof navigator !== 'undefined' && navigator.onLine === false) return Promise.resolve();
      this._syncing = true;
      return queueAll().then(rows => {
        const list = Array.isArray(rows) ? rows : [];
        return list.reduce((chain, p) => chain.then(() => this.sendQuizAttempt(p, false)), Promise.resolve());
      }).then(() => {
        this._syncing = false;
        this.refreshPendingCount();
      }).catch(() => {
        this._syncing = false;
      });
    });
    _defineProperty(this, "retrySync", () => {
      this.setState({ quizSubmit: { state: 'sending' } });
      this.syncPendingAttempts().then(() => queueAll()).then(rows => {
        const left = Array.isArray(rows) ? rows.length : 0;
        this.setState({ quizSubmit: left ? { state: 'queued', message: 'Still waiting for a connection.' } : { state: 'ok' } });
        if (!left) this.loadLeaderboard(this.state.lbTab);
      });
    });
    /* ── LEADERBOARD ──
       Read straight from the public view, which carries no install identifiers,
       no hidden rows and no answers. Ordering is the tie-break order applied in
       the database so the board and the server's own idea of "best" agree. */
    _defineProperty(this, "loadLeaderboard", difficulty => {
      const diff = difficulty || this.state.lbTab;
      this.setState({ lbTab: diff, lbState: 'loading', lbError: null });
      const url = LEADERBOARD_URL + '?select=id,display_name,score,correct,total,duration_ms,submitted_at' + '&quiz_id=eq.kids&difficulty=eq.' + encodeURIComponent(diff) + '&order=score.desc,correct.desc,duration_ms.asc,submitted_at.asc&limit=20';
      return fetch(url, { headers: SB_HEADS, cache: 'no-store' }).then(r => {
        if (!r.ok) throw new Error(r.status === 404 ? 'not_deployed' : 'http_' + r.status);
        return r.json();
      }).then(rows => {
        this.setState({ lbState: 'ready', lbRows: Array.isArray(rows) ? rows : [] });
      }).catch(e => {
        const offline = typeof navigator !== 'undefined' && navigator.onLine === false;
        this.setState({
          lbState: 'error',
          lbError: offline ? 'offline' : e && e.message === 'not_deployed' ? 'not_deployed' : 'network'
        });
      });
    });
    _defineProperty(this, "setQuizName", value => {
      const check = validateDisplayName(value);
      if (!check.ok) {
        this.setState({ quizNameErr: check.reason });
        return null;
      }
      lsSet('quizName', check.name);
      this.setState({ quizName: check.name, quizNameDraft: null, quizNameErr: null });
      return check.name;
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
      THEME_DARK = v;
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
      // leaving a Learning chapter must not write its scroll offset onto the
      // library entry the mark is actually pointing at
      if (this.state.readingType !== lr.type) return;
      const inner = document.querySelector('.app > .s .s');
      const pos = inner ? inner.scrollTop : 0;
      const next = { ...lr, pos };
      lsSet('lastRead', next);
      this.setState({ lastRead: next });
    });
    _defineProperty(this, "openReading", (type, item, opts) => {
      /* Every open is a fresh attempt. Without this, a PDF that failed once is
         remembered as failed for the rest of the session, and reopening the same
         entry after the connection comes back shows the same error. */
      this.destroyPdf();
      // the previous recitation must not keep playing under the next text
      this.audioStop();
      this._audioEl = null;
      const o = opts || {};
      const prev = this.state.lastRead;
      /* Only the Library is remembered. A Learning chapter is opened in the same
         reader but is not a library entry, so it neither becomes the Continue
         reading tile nor displaces the duʿāʾ already sitting there. */
      const keep = LIB_TYPES.indexOf(type) >= 0;
      const same = keep && prev && prev.title === (item && item.title) && prev.type === type;
      // a jump to a saved passage wins over the remembered position
      const mark = { type, title: (item && item.title) || '', pos: same && !o.jumpLine ? prev.pos || 0 : 0, at: Date.now() };
      if (keep) lsSet('lastRead', mark);
      this.setState({
        screen: 'reading',
        readingType: type,
        readingItem: item,
        readingLang: o.lang || null,
        lastRead: keep ? mark : prev,
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
    _defineProperty(this, "prayerLocation", () => this.state.prayerLoc || ABI_HOME);
    /* What the times on screen actually are. The reader has to be able to tell a
       live timetable from yesterday's cached one, and above all from Dublin's
       timetable being shown while they have Cork selected — which is the one
       thing that must never happen quietly. */
    _defineProperty(this, "prayerSource", () => {
      const loc = this.prayerLocation();
      const auto = this.state.liveAutoTimes;
      const today = ymd(new Date());
      if (auto && auto.times && auto.loc === loc.id) {
        return { kind: auto.date === today ? 'live' : 'cached', loc, date: auto.date };
      }
      return { kind: loc.id === ABI_HOME.id ? 'preset' : 'fallback', loc, date: null };
    });
    _defineProperty(this, "getActivePrayers", () => {
      const presets = abiPresets(this.state.livePrayerPresets);
      const preset = presets.find(p => p.id === this.state.prayerPreset) || presets[0];
      const auto = this.state.liveAutoTimes;
      const loc = this.prayerLocation();
      // an out-of-date timetable for the right town still beats no timetable,
      // and prayerSource() is what tells the reader which one they are looking at
      if (auto && auto.times && auto.loc === loc.id) {
        return preset.prayers.map(p => auto.times[p.name] ? { ...p, time: auto.times[p.name] } : p);
      }
      return preset.prayers;
    });
    /* Resolves to true when today's timetable for the selected town is in hand.
       Every failure sets a named reason rather than disappearing, because the
       screen has to say which one happened. */
    _defineProperty(this, "fetchAutoTimes", force => {
      const n = new Date();
      const today = ymd(n);
      const loc = this.prayerLocation();
      const cached = this.state.liveAutoTimes;
      if (cached && cached.date === today && cached.loc === loc.id && cached.times) return Promise.resolve(true);
      if (!force && this._autoTimesLastTry && Date.now() - this._autoTimesLastTry < 5 * 60 * 1000) return Promise.resolve(false);
      this._autoTimesLastTry = Date.now();
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        this.setState({ autoTimesErr: 'offline' });
        return Promise.resolve(false);
      }
      const dd = String(n.getDate()).padStart(2, '0'),
        mm = String(n.getMonth() + 1).padStart(2, '0');
      this.setState({ autoTimesBusy: true });
      const url = `https://api.aladhan.com/v1/timings/${dd}-${mm}-${n.getFullYear()}` + `?latitude=${loc.lat}&longitude=${loc.lng}` + `&method=${PRAYER_METHOD.id}&midnightMode=${PRAYER_METHOD.midnightMode}`;
      return fetch(url).then(r => {
        if (!r.ok) throw new Error('api');
        return r.json();
      }).then(j => {
        const tm = j && j.data && j.data.timings;
        if (!tm || !tm.Fajr) throw new Error('bad');
        const clean = v => {
          const m = String(v).match(/\d{1,2}:\d{2}/);
          return m ? m[0].padStart(5, '0') : null;
        };
        const times = {};
        ['Fajr', 'Sunrise', 'Dhuhr', 'Sunset', 'Maghrib', 'Midnight'].forEach(k => {
          const v = clean(tm[k]);
          if (v) times[k] = v;
        });
        // Sunset and Maghrib are separate times for this community; a response
        // missing either is incomplete, not something to paper over
        if (!times.Fajr || !times.Maghrib || !times.Sunset || !times.Dhuhr) throw new Error('bad');
        const data = { date: today, loc: loc.id, locName: loc.name, times, at: Date.now() };
        lsSet('autoTimes', data);
        this.setState({ liveAutoTimes: data, autoTimesErr: null, autoTimesBusy: false });
        return true;
      }).catch(e => {
        const why = e && e.message === 'bad' ? 'bad' : typeof navigator !== 'undefined' && navigator.onLine === false ? 'offline' : 'api';
        this.setState({ autoTimesErr: why, autoTimesBusy: false });
        return false;
      });
    });
    /* Choosing a town refetches immediately rather than waiting for the hourly
       poll, so the countdown and the card are right by the time the toast fades. */
    _defineProperty(this, "setPrayerLocation", loc => {
      const next = loc && loc.id !== ABI_HOME.id ? loc : null;
      lsSet('prayerLoc', next);
      this._autoTimesLastTry = 0;
      this._lastAlertTime = '';
      this.setState({ prayerLoc: next, autoTimesErr: null }, () => {
        this.fetchAutoTimes(true).then(ok => {
          const name = this.prayerLocation().name;
          this.showToast(ok ? `Prayer times now for ${name}` : `Set to ${name} — times could not be loaded yet`);
        });
      });
    });
    /* Permission is only ever asked for from here — nothing on launch. */
    /* ── REPORT AN INCORRECT TIME ──
       No account, and no field that could identify anyone: the prayer, what the
       app showed, what it should have shown, and an optional note. The same
       checks run again on the server, which is the copy that counts — these are
       here so the reader is told immediately rather than after a round trip. */
    _defineProperty(this, "submitTimeReport", () => {
      const st = this.state;
      const expected = st.reportExpected.trim();
      const note = st.reportNote.trim().slice(0, 500);
      if (!['Fajr', 'Sunrise', 'Dhuhr', 'Sunset', 'Maghrib', 'Midnight'].includes(st.reportPrayer)) {
        this.setState({ reportState: { kind: 'error', message: 'Choose which prayer looks wrong.' } });
        return;
      }
      if (expected && !/^([01][0-9]|2[0-3]):[0-5][0-9]$/.test(expected)) {
        this.setState({ reportState: { kind: 'error', message: 'Give the correct time as HH:MM, for example 05:12.' } });
        return;
      }
      if (!expected && !note) {
        this.setState({ reportState: { kind: 'error', message: 'Give the correct time, or a short note about what is wrong.' } });
        return;
      }
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        this.setState({ reportState: { kind: 'error', message: 'You are offline. Please send this when you are back online.' } });
        return;
      }
      const loc = this.prayerLocation();
      const src = this.prayerSource();
      const shown = (this.getActivePrayers().find(p => p.name === st.reportPrayer) || {}).time || '';
      this.setState({ reportState: { kind: 'sending' } });
      fetch(EDGE_REPORT_TIME, {
        method: 'POST',
        headers: SB_HEADS,
        cache: 'no-store',
        body: JSON.stringify({
          reportId: randomId(),
          locationId: loc.id,
          locationName: loc.name,
          prayer: st.reportPrayer,
          shownTime: shown,
          expectedTime: expected,
          note,
          timeSource: src.kind,
          appDate: ymd(new Date()),
          installId: installId()
        })
      }).then(r => r.json().then(j => ({ status: r.status, j })).catch(() => ({ status: r.status, j: {} }))).then(({ status, j }) => {
        if (status === 200 && j && j.ok) {
          this.setState({
            reportState: { kind: 'sent' },
            reportExpected: '', reportNote: ''
          });
          return;
        }
        const message = status === 429 ? 'You have sent a few reports just now — please try again shortly.' : status === 404 ? 'The reporting service is not available yet.' : j && j.message ? j.message : 'That report could not be sent.';
        this.setState({ reportState: { kind: 'error', message } });
      }).catch(() => {
        this.setState({ reportState: { kind: 'error', message: 'That report could not be sent. Please try again.' } });
      });
    });
    _defineProperty(this, "useDeviceLocation", () => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        this.showToast('This device cannot provide a location');
        return;
      }
      this.setState({ locBusy: true });
      navigator.geolocation.getCurrentPosition(pos => {
        const pt = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        if (!isFinite(pt.lat) || !isFinite(pt.lng)) {
          this.setState({ locBusy: false });
          this.showToast('That location reading was incomplete');
          return;
        }
        const { town, km } = nearestTown(pt);
        // near a listed town, use the listed town: the reader recognises the name,
        // and a few km makes no difference to a prayer time
        this.setState({ locBusy: false });
        if (km < 12) return this.setPrayerLocation(town);
        this.setPrayerLocation({
          id: 'device',
          name: km < 60 ? `Near ${town.name}` : 'My location',
          region: km < 60 ? town.region : `${pt.lat.toFixed(2)}, ${pt.lng.toFixed(2)}`,
          lat: pt.lat, lng: pt.lng, device: true,
          outside: km > 250
        });
      }, err => {
        this.setState({ locBusy: false });
        const msg = err && err.code === 1 ? 'Location permission refused — pick a town from the menu instead' : err && err.code === 2 ? 'Location services are unavailable right now' : err && err.code === 3 ? 'Finding your location took too long' : 'Could not read your location';
        this.showToast(msg);
      }, { enableHighAccuracy: false, timeout: 12000, maximumAge: 600000 });
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
      // an upload result belongs to the entry it was made for, not the next one
      adminUpload: null,
      adminEditDraft: {
        ...draft
      }
    }));
    _defineProperty(this, "cancelEdit", () => this.setState(s => ({
      adminEditIdx: null,
      adminUpload: null,
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
      const pick = adhanSounds(this.state.liveAzans, this.state.liveAzanOverrides).find(s => s.key === key);
      if (!pick) return;
      this.stopAdhan();
      lsSet('adhanSound', key);
      this.setState({
        adhanSound: key
      });
      // Warm the service-worker cache so the chosen adhan still plays offline
      fetch(pick.file).catch(() => {});
    });
    /* Hearing one before living with it. Tapping the playing one stops it, and
       starting another stops the first, so only ever one is sounding. This runs
       through the same handle as the real adhan so that a preview left playing
       cannot end up layered under a call to prayer. */
    _defineProperty(this, "previewAdhan", snd => {
      if (this.state.adhanPreview === snd.key) {
        this.stopAdhan();
        this.setState({ adhanPreview: null });
        return;
      }
      this.stopAdhan();
      this.adhanAudio = new Audio(snd.file);
      this.adhanAudio.onended = () => this.setState({ adhanPreview: null });
      this.adhanAudio.play().then(() => this.setState({ adhanPreview: snd.key })).catch(() => {
        this.setState({ adhanPreview: null });
        this.showToast('That adhan could not be played');
      });
    });
    _defineProperty(this, "setAdhanEnabled", on => {
      lsSet('adhanEnabled', on);
      if (!on) this.stopAdhan();
      this.setState({
        adhanEnabled: on
      });
    });
    _defineProperty(this, "playAdhan", () => {
      this.stopAdhan();
      /* A remembered choice can outlive the file it named \u2014 an azan removed by an
         administrator, or a device that has never seen it. Falling back to the
         shipped one means the adhan still sounds at the right minute. */
      const all = adhanSounds(this.state.liveAzans, this.state.liveAzanOverrides);
      const pick = all.find(s => s.key === this.state.adhanSound) || all[0];
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
          body: `${match.en} prayer — ${match.time} \xB7 ${this.prayerLocation().name}`,
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
    /* The dial angle is accumulated rather than recomputed, so a heading crossing
       359\u00b0 to 0\u00b0 nudges the needle one degree instead of spinning it the long way
       round. The result is unbounded on purpose; CSS is happy to rotate past 360. */
    _defineProperty(this, "qiblaSpinFor", (bearing, heading) => {
      if (bearing === null || bearing === undefined) return null;
      const rel = ((bearing - (heading === null || heading === undefined ? 0 : heading)) % 360 + 360) % 360;
      const prev = this.state.qiblaSpin;
      if (prev === null || prev === undefined) return rel;
      return prev + ((((rel - prev) % 360) + 540) % 360) - 180;
    });
    /* A magnetometer fires far faster than this app can usefully repaint, and every
       reading here re-renders the whole tree. Throttled by both time and angle: a
       phone lying still on a table must not keep the app busy. */
    _defineProperty(this, "onQiblaHeading", e => {
      let h = null;
      if (typeof e.webkitCompassHeading === 'number' && !isNaN(e.webkitCompassHeading)) {
        h = e.webkitCompassHeading;
      } else if (e.absolute && typeof e.alpha === 'number') {
        // a non-absolute alpha is measured from wherever the device happened to be
        // when the page loaded, which would point the arrow confidently at nothing
        h = (360 - e.alpha) % 360;
      }
      if (h === null) return;
      const now = Date.now();
      const prev = this.state.qiblaHeading;
      const moved = prev === null ? 999 : Math.abs(((h - prev + 540) % 360) - 180);
      if (prev !== null && (now - (this._qiblaTick || 0) < 120 || moved < 0.8)) return;
      this._qiblaTick = now;
      this.setState({
        qiblaHeading: h,
        qiblaMotion: 'live',
        qiblaSpin: this.qiblaSpinFor(this.state.qiblaBearing, h)
      });
    });
    /* Loaded once per document, keyed by URL so re-rendering the reader does not
       re-download it. The document object itself is kept off state: it is a live
       handle with a worker behind it, not a value to diff. */
    _defineProperty(this, "ensurePdf", url => {
      if (!url || this._pdfUrl === url) return;
      this._pdfUrl = url;
      this.destroyPdf(false);
      this.setState({ pdfStatus: 'loading', pdfError: null, pdfPage: 1, pdfPages: 0, pdfZoom: 1 });
      loadPdfjs().then(lib => {
        if (this._pdfUrl !== url) return;
        const task = lib.getDocument({ url, withCredentials: false });
        this._pdfTaskLoad = task;
        return task.promise.then(doc => {
          if (this._pdfUrl !== url) { doc.destroy(); return; }
          this._pdfDoc = doc;
          window.addEventListener('resize', this.onPdfResize);
          this.setState({ pdfStatus: 'ready', pdfPages: doc.numPages, pdfPage: 1 },
            () => this.drawPdfPage());
        });
      }).catch(err => {
        if (this._pdfUrl !== url) return;
        const name = err && (err.name || '');
        /* The usual failure is not a broken file. It is a PDF on a host that does
           not allow another site to read it, which arrives as an unhelpful
           network error \u2014 so say the useful thing rather than the literal one. */
        const kind = name === 'MissingPDFException' ? 'missing'
          : name === 'PasswordException' ? 'password'
          : err && err.message === 'viewer_unreachable' ? 'offline'
          : 'blocked';
        this.setState({ pdfStatus: 'error', pdfError: kind });
      });
    });
    _defineProperty(this, "drawPdfPage", () => {
      const doc = this._pdfDoc, canvas = this._pdfCanvas;
      if (!doc || !canvas) return;
      const page = Math.min(Math.max(1, this.state.pdfPage), doc.numPages);
      this._pdfDrawn = canvas;
      doc.getPage(page).then(pg => {
        if (this._pdfCanvas !== canvas || !canvas.parentNode) return;
        const wrap = canvas.parentNode.clientWidth || 320;
        const base = pg.getViewport({ scale: 1 });
        /* Capped at 2: a full-bleed page at 3x device pixels is a canvas big
           enough to have the tab killed on a mid-range phone. */
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const vp = pg.getViewport({ scale: (wrap / base.width) * this.state.pdfZoom * dpr });
        canvas.width = Math.floor(vp.width);
        canvas.height = Math.floor(vp.height);
        canvas.style.width = Math.floor(vp.width / dpr) + 'px';
        canvas.style.height = Math.floor(vp.height / dpr) + 'px';
        // turning two pages quickly must not leave half of each on the canvas
        if (this._pdfRender) { try { this._pdfRender.cancel(); } catch (e) {} }
        this._pdfRender = pg.render({ canvasContext: canvas.getContext('2d'), viewport: vp });
        return this._pdfRender.promise.catch(() => {});
      }).catch(() => {});
    });
    /* Rotating the phone changes the width the page was fitted to. Debounced,
       because a rotation animation emits a stream of resize events. */
    _defineProperty(this, "onPdfResize", () => {
      clearTimeout(this._pdfResizeTimer);
      this._pdfResizeTimer = setTimeout(() => this.drawPdfPage(), 220);
    });
    _defineProperty(this, "goPdfPage", n => {
      const total = this.state.pdfPages || 1;
      const page = Math.min(Math.max(1, n), total);
      if (page === this.state.pdfPage) return;
      this.setState({ pdfPage: page }, () => this.drawPdfPage());
    });
    _defineProperty(this, "zoomPdf", mult => {
      const zoom = Math.min(3, Math.max(0.75, Math.round(this.state.pdfZoom * mult * 100) / 100));
      if (zoom === this.state.pdfZoom) return;
      this.setState({ pdfZoom: zoom }, () => this.drawPdfPage());
    });
    _defineProperty(this, "destroyPdf", (clearUrl = true) => {
      if (this._pdfRender) { try { this._pdfRender.cancel(); } catch (e) {} this._pdfRender = null; }
      if (this._pdfTaskLoad) { try { this._pdfTaskLoad.destroy(); } catch (e) {} this._pdfTaskLoad = null; }
      if (this._pdfDoc) { try { this._pdfDoc.destroy(); } catch (e) {} this._pdfDoc = null; }
      window.removeEventListener('resize', this.onPdfResize);
      clearTimeout(this._pdfResizeTimer);
      this._pdfDrawn = null;
      if (clearUrl) this._pdfUrl = null;
    });
    /* The bytes are already here once the document is open, so saving a copy is a
       local operation \u2014 no second download, and it works on a host that would
       refuse a direct fetch. */
    _defineProperty(this, "downloadPdf", (url, title) => {
      if (this.state.pdfSaving) return;
      const name = String(title || 'document').replace(/[^\w\u00c0-\u024f -]+/g, '').trim().slice(0, 60) || 'document';
      const save = bytes => {
        const blob = new Blob([bytes], { type: 'application/pdf' });
        const href = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = href;
        a.download = name + '.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(href), 4000);
        this.setState({ pdfSaving: false });
        this.showToast('Saved to your downloads');
      };
      this.setState({ pdfSaving: true });
      const fromDoc = this._pdfDoc && this._pdfUrl === url
        ? this._pdfDoc.getData()
        : Promise.reject(new Error('no_doc'));
      fromDoc.then(save).catch(() => fetch(url).then(res => {
        if (!res.ok) throw new Error('http_' + res.status);
        return res.arrayBuffer();
      }).then(save).catch(() => {
        this.setState({ pdfSaving: false });
        this.showToast('Could not save it here \u2014 opening it instead');
        window.open(url, '_blank', 'noopener,noreferrer');
      }));
    });
    /* Two steps, on purpose. The function decides whether this caller may upload
       and hands back a signed URL good for one path; the bytes then go straight
       from the browser to storage. An Edge Function has a request body limit and
       an hour of recitation is on the wrong side of it, so routing the file
       through the function would fail on exactly the files this is for. */
    _defineProperty(this, "uploadMedia", (kind, file, onDone) => {
      const spec = MEDIA_KINDS[kind];
      if (!file || !spec) return;
      const say = (state, msg, pct) => this.setState({ adminUpload: { kind, state, msg, pct } });
      if (file.size > spec.max) {
        say('error', `That file is ${(file.size / 1048576).toFixed(1)} MB. The limit is ${Math.round(spec.max / 1048576)} MB.`);
        return;
      }
      say('reading', 'Checking the file\u2026');
      /* An arrow bound here rather than a hoisted declaration: this leg keeps the
         request on this._upload so it can be cancelled, and a plain function
         would have no `this` to keep it on. */
      // takes the file as an argument, because the resize hands back a different one
      const sign = f => this.signAndPut(kind, f, onDone, say);
      file.slice(0, 12).arrayBuffer().then(head => {
        if (!sniffMedia(kind, new Uint8Array(head))) {
          say('error', `That does not look like ${kind === 'audio' ? 'an audio file' : kind === 'image' ? 'an image' : 'a PDF'}.`);
          return;
        }
        /* A logo photographed at 4000px is still drawn as a 50px tile. Shrinking
           it here rather than at render time means every reader downloads what is
           drawn instead of forty times it. SVG is left alone: it is already the
           right size at every size, and a canvas would throw that away. */
        if (spec.resizeTo && !/svg/i.test(file.type || '')) {
          return resizeImageBlob(file, spec.resizeTo, 'image/png', 0.92).then(
            blob => sign(new File([blob], String(file.name || 'logo').replace(/[.][^.]*$/, '') + '.png', { type: 'image/png' })),
            () => say('error', 'That image could not be read.'));
        }
        return sign(file);
      }).catch(() => say('error', 'Upload failed — check the connection, or paste a link instead.'));
    });
    _defineProperty(this, "cancelUpload", () => {
      if (this._upload) { try { this._upload.abort(); } catch (e) {} this._upload = null; }
      this.setState({ adminUpload: null });
    });
    /* The audio element is the source of truth; state only mirrors it for the
       controls to read. Nothing here seeks by rewriting state and hoping the
       element follows. */
    _defineProperty(this, "bindAudio", el => {
      if (this._audioEl === el) return;
      this._audioEl = el;
      if (!el) return;
      el.onplay = () => this.setState({ audioPlaying: true });
      el.onpause = () => this.setState({ audioPlaying: false });
      el.onended = () => this.setState({ audioPlaying: false, audioAt: 0 });
      /* A chosen pace outlives the file it was chosen on. Applied twice on
         purpose: setting src resets the rate to 1, and applying it only from
         loadedmetadata leaves a window where a reader who pressed play early
         hears the first seconds at full speed. */
      const rate = () => { el.playbackRate = this.state.audioRate || 1; };
      rate();
      el.onloadedmetadata = () => {
        rate();
        this.setState({ audioDur: el.duration || 0 });
      };
      /* timeupdate fires about four times a second and this component re-renders
         its whole tree, so the seek bar is stepped rather than followed exactly. */
      el.ontimeupdate = () => {
        const at = el.currentTime || 0;
        if (Math.abs(at - (this.state.audioAt || 0)) < 0.4) return;
        this.setState({ audioAt: at });
      };
    });
    _defineProperty(this, "audioToggle", () => {
      const el = this._audioEl;
      if (!el) return;
      if (el.paused) el.play().catch(() => this.showToast('This recitation could not be played'));
      else el.pause();
    });
    _defineProperty(this, "audioStop", () => {
      const el = this._audioEl;
      if (!el) return;
      el.pause();
      el.currentTime = 0;
      this.setState({ audioPlaying: false, audioAt: 0 });
    });
    _defineProperty(this, "audioSkip", secs => {
      const el = this._audioEl;
      if (!el) return;
      const dur = el.duration || 0;
      const to = Math.min(dur || Infinity, Math.max(0, (el.currentTime || 0) + secs));
      el.currentTime = to;
      this.setState({ audioAt: to });
    });
    _defineProperty(this, "setAudioRate", rate => {
      lsSet('audioRate', rate);
      if (this._audioEl) this._audioEl.playbackRate = rate;
      this.setState({ audioRate: rate });
    });
    _defineProperty(this, "audioSeek", frac => {
      const el = this._audioEl;
      if (!el || !el.duration) return;
      const to = Math.min(el.duration, Math.max(0, frac * el.duration));
      el.currentTime = to;
      this.setState({ audioAt: to });
    });
    _defineProperty(this, "cancelUpload", () => {
      if (this._upload) { try { this._upload.abort(); } catch (e) {} this._upload = null; }
      this.setState({ adminUpload: null });
    });
    _defineProperty(this, "stopQibla", () => {
      if (this._qiblaWatch !== null && this._qiblaWatch !== undefined) {
        navigator.geolocation.clearWatch(this._qiblaWatch);
        this._qiblaWatch = null;
      }
      window.removeEventListener('deviceorientationabsolute', this.onQiblaHeading, true);
      window.removeEventListener('deviceorientation', this.onQiblaHeading, true);
    });
    _defineProperty(this, "locateQibla", async () => {
      if (!navigator.geolocation) {
        this.setState({
          qiblaStatus: 'unsupported'
        });
        return;
      }
      this.setState({
        qiblaStatus: 'loading'
      });
      /* iOS will not deliver orientation at all without an explicit grant, and only
         from inside a real tap \u2014 which is why this lives on the button and nowhere
         near startup. A refusal costs the live arrow, not the bearing. */
      try {
        const DOE = typeof DeviceOrientationEvent !== 'undefined' ? DeviceOrientationEvent : null;
        if (DOE && typeof DOE.requestPermission === 'function') {
          const grant = await DOE.requestPermission();
          this.setState({ qiblaMotion: grant === 'granted' ? 'waiting' : 'denied' });
        } else if (typeof window.DeviceOrientationEvent === 'undefined') {
          this.setState({ qiblaMotion: 'unsupported' });
        } else {
          this.setState({ qiblaMotion: 'waiting' });
        }
      } catch (err) {
        this.setState({ qiblaMotion: 'denied' });
      }
      window.removeEventListener('deviceorientationabsolute', this.onQiblaHeading, true);
      window.removeEventListener('deviceorientation', this.onQiblaHeading, true);
      window.addEventListener('deviceorientationabsolute', this.onQiblaHeading, true);
      window.addEventListener('deviceorientation', this.onQiblaHeading, true);
      if (this._qiblaWatch !== null && this._qiblaWatch !== undefined) {
        navigator.geolocation.clearWatch(this._qiblaWatch);
      }
      // watched rather than read once: walking a few streets moves the bearing, and
      // the first fix is usually the least accurate one the device will offer
      this._qiblaWatch = navigator.geolocation.watchPosition(pos => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const bearing = this.bearingToKaaba(lat, lng);
        this.setState({
          qiblaStatus: 'granted',
          qiblaLat: lat,
          qiblaLng: lng,
          qiblaAcc: pos.coords.accuracy,
          qiblaBearing: bearing,
          qiblaSpin: this.qiblaSpinFor(bearing, this.state.qiblaHeading)
        });
      }, err => this.setState({
        // a refusal and a failed fix need opposite advice: one is fixed in settings,
        // the other by walking outside
        qiblaStatus: err && err.code === err.PERMISSION_DENIED ? 'denied' : 'nofix'
      }), {
        enableHighAccuracy: true,
        maximumAge: 3000,
        timeout: 15000
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
      /* The Arabic is what gets shared. It is the text itself rather than one
         reading of it, and it is the same words whoever receives it. A
         translation goes only when there is no Arabic, and the summary only when
         there is neither. An entry that is purely a PDF has none of the three and
         shares as its title and link, which is what it is. */
      const text = r.ar || r.body || r.tr || r.sum || '';
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
      const pools = {};
      LIB_KINDS.forEach(k => { pools[k.key] = st[k.state] || k.seed; });
      const nahj = st.liveNahj || NAHJ;
      const all = [];
      Object.keys(pools).forEach(k => (pools[k] || []).forEach(x => all.push([k, x])));
      // driven off BOOK_PARTS so a new section is searchable the day it is added
      Object.values(BOOK_PARTS).flat().forEach(([k]) => (nahj[k] || []).forEach(x => all.push(['nahj', x])));
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
    this.refreshPendingCount();
    this.syncPendingAttempts();
    if (this.state.screen === 'kids' && this.state.kidsTab === 'quiz') {
      this.loadLeaderboard(this.state.kidsQuizLevel || DEFAULT_LEVEL);
    }
    this._onlineSync = () => this.syncPendingAttempts();
    window.addEventListener('online', this._onlineSync);
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
          /* Content arriving from the server is normalised on the way in, not
             only at boot: the remote copy keeps whatever the admin last saved,
             so a boot-time migration alone would be undone by the next refresh. */
          const value = key === 'kidsQuizzes' ? migrateQuizzes(data[key]) : data[key];
          lsSet(key, value);
          update[stateKey] = key === 'stories' ? pruneExpiredStories(value) : value;
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
    if (this._onlineSync) window.removeEventListener('online', this._onlineSync);
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
    /* The next prayer's cell in the strip is filled with the accent, and the two
       inks on it used to be written out as cream and a dimmer gold. That is
       right on the light theme's deep green and wrong on the gold the dark theme
       swaps in: the name landed at 1.9:1 and the time, gold on gold, at 1.15 —
       not dim, gone. Derived from the fill now, so the pill is legible whatever
       the accent becomes; the second value keeps the name a step ahead of the
       icon and the clock, which is what the two literals were for. */
    const pillInk = inkOn(NEU.accent);
    const pillInk2 = pillInk === '#fff' ? 'rgba(255,251,240,.82)' : 'rgba(20,18,13,.78)';
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
      title: 'Salat',
      icon: '🕋',
      tone: ['#1f5145', '#e4efe9'],
      go: () => this.setState({
        screen: 'library',
        libTab: 'salat',
        libCat: 'All',
        libQuery: ''
      })
    }, {
      title: 'Amaal',
      icon: '🌙',
      tone: ['#7a5c9e', '#efe9f5'],
      go: () => this.setState({
        screen: 'library',
        libTab: 'amaal',
        libCat: 'All',
        libQuery: ''
      })
    }, {
      title: 'Books',
      icon: '📖',
      tone: ['#2c5d52', '#e6f0eb'],
      go: () => this.setState({
        screen: 'library',
        libTab: 'nahj',
        nahjBook: 'nahj',
        libCat: 'All'
      })
    }, {
      title: this.t('kids.title'),
      icon: RUBIKS_CUBE,
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
      title: 'Fourteen Infallibles',
      icon: '🌟',
      tone: ['#6e2230', '#f5e7e9'],
      go: () => this.go('infallibles')
    }, {
      title: 'Mosque Finder',
      icon: '🧕',
      tone: ['#2f6f7a', '#e5f0f2'],
      go: () => this.go('mosques')
    }, {
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
    const amaalCount = (st.liveAamals || []).length;
    const lastRead = st.lastRead;
    const READ_KIND = { nahj: 'Books', learning: 'Learning' };
    LIB_KINDS.forEach(k => { READ_KIND[k.key] = k.title; });
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
          ...neuFlat(R.tile),
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
        color: NEU.ink,
        marginBottom: 12,
        ...wallHalo()
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
    const ploc = this.prayerLocation();
    const psrc = this.prayerSource();
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
      /* Two files rather than a CSS filter. The mark is forest green and gold on
         transparency; the green sits at 1.3:1 on the dark page and simply is not
         there, while the gold reads fine. No single filter lifts one and leaves
         the other — brightness enough to rescue the green blows the gold out to
         white. The dark file is the same artwork with its green mapped to the
         value the theme already uses for that green, and nothing else changed. */
      src: st.dark ? "./app-title-logo-dark.png" : "./app-title-logo.png",
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
    /* Both kickers were literals, and both came up a tenth short of AA once the
       card under them became a pane over the wallpaper. The neutral one is just
       the muted rung, which already steps down over glass; the gold is a shade
       deeper than the one used elsewhere for the same reason. */
    }, [['Gregorian', NEU.muted, gregShort], ['Hijri', onSurf('#6d5a1c'), hijri]].map(([label, tone, value]) => /*#__PURE__*/React.createElement("div", {
      key: label,
      onClick: () => this.go('calendar'),
      style: {
        ...neuFlat(R.inner),
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
        color: NEU.ink,
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
        cursor: 'pointer'
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
        color: NEU.ink,
        ...wallHalo()
      }
    }, "Today's Updates"), /*#__PURE__*/React.createElement("div", {
      onClick: () => { if (activeStories(this.state.liveStories).length) this.openStory(0); },
      style: {
        fontSize: 12.5,
        color: onSurf('#1f5145'),
        fontWeight: 600,
        cursor: 'pointer',
        padding: '12px 10px',
        margin: '-12px -10px',
        minHeight: 44,
        display: 'flex',
        alignItems: 'center',
        // the padding here is a 44px tap target, not decoration; it stays
        ...wallHalo()
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
        borderRadius: R.tile,
        padding: 2.5,
        background: 'conic-gradient(from 210deg,#d8b863,#1f5145,#6e2230,#d8b863)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: '100%',
        height: '100%',
        borderRadius: R.inner,
        background: s.photo ? `url(${s.photo}) center/cover` : s.img || s.color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        /* The gap between the ring and the photograph was the opaque page tone,
           left over from when the page was a flat cream field. Over a wallpaper
           that is a cream hoop floating on a sunset. */
        border: `2.5px solid ${GLASS ? NEU.glass : NEU.bg}`,
        position: 'relative',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        /* The sheen gives a flat colour tile some curvature. On a photograph it
           is just a white haze over the one thing worth looking at. */
        background: s.photo ? 'none'
          : 'radial-gradient(120% 80% at 30% 22%, rgba(255,255,255,.22), transparent 62%)'
      }
    }))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        color: NEU.muted,
        marginTop: 6,
        lineHeight: 1.2,
        fontWeight: 600,
        /* The plate these carried had to be forced to a uniform height, or
           three captions of different lengths gave three different-sized boxes
           in a row. With the halo there is no box to keep level, so the height
           goes back to whatever the words need. */
        ...wallHalo()
      }
    }, s.short)))), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.go('prayer'),
      className: "neu-press",
      style: {
        position: 'relative',
        overflow: 'hidden',
        border: sc.night ? '1px solid rgba(255,255,255,.08)' : '1px solid rgba(255,255,255,.6)',
        borderRadius: R.card,
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
    }, this.t('home.in'), " ", cd), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        marginTop: 5,
        fontSize: 11.5,
        fontWeight: 600,
        color: sc.sub
      }
    }, icon('map-pin', { size: 12, style: { flexShrink: 0 } }), ploc.name), psrc.kind === 'fallback' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        marginTop: 3,
        fontSize: 10.5,
        fontWeight: 700,
        color: sc.accent,
        lineHeight: 1.3
      }
    }, icon('triangle-alert', { size: 11, style: { flexShrink: 0 } }), "Dublin timetable shown"), psrc.kind === 'cached' && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 3,
        fontSize: 10.5,
        fontWeight: 700,
        color: sc.sub,
        lineHeight: 1.3
      }
    }, "Saved timetable")), prayerDial(next.name, sc, prog))), /*#__PURE__*/React.createElement("div", {
      style: {
        /* Was the page tone and its shadow written out by hand, which is why it
           was the one card on this screen that stayed opaque when the wallpaper
           landed: a solid cream slab between two frosted panes, with the picture
           visibly stopping at its top edge and starting again below it. */
        ...neuCard(R.card),
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
        borderRadius: R.inner,
        background: p.isNext ? NEU.accent : 'transparent',
        boxShadow: p.isNext ? neuUpOn('31,81,69', .7) : 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        display: 'flex',
        color: p.isNext ? pillInk2 : onSurf('#75601f')
      }
    }, icon(PRAYER_ICONS[p.name] || 'moon', {
      size: 19,
      sw: 1.7
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        color: p.isNext ? pillInk : NEU.ink2,
        fontWeight: p.isNext ? 700 : 600,
        lineHeight: 1
      }
    }, p.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11.5,
        color: p.isNext ? pillInk2 : NEU.muted,
        fontWeight: 600,
        fontVariantNumeric: 'tabular-nums',
        lineHeight: 1
      }
    }, p.time)))),
    /* Opens the section, not one amaal. A single rotating pick was a guess at
       what someone wanted today, and it was a poor one: the taqeebat go by the
       prayer and the weekly devotions by the weekday, so which amaal is due is
       something the reader knows and a shuffle does not. */
    amaalCount > 0 && this.renderHomeTile({
      icon: 'book-heart',
      kicker: 'Daily Taqeebat and Zaiyarat',
      title: 'After every prayer, and through the week',
      sub: `${amaalCount} to read`,
      tone: ['#8a4b2c', '#f7ebe2'],
      onClick: () => this.setState({
        screen: 'library',
        libTab: 'aamal',
        libCat: 'All',
        libQuery: ''
      })
    }),
    // the type test also retires marks written by older builds, which could name
    // a Learning chapter and then fail to reopen it
    lastRead && lastRead.title && LIB_TYPES.indexOf(lastRead.type) >= 0 && this.renderHomeTile({
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
      sub: 'Ten questions, fifteen seconds each',
      tone: ['#8a2f52', '#f7e6ed'],
      onClick: () => this.setState({ screen: 'kids', kidsTab: 'quiz', quizRun: null })
    }),
    /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 18,
        fontWeight: 600,
        color: NEU.ink,
        margin: '18px 0 12px',
        ...wallHalo()
      }
    }, this.t('home.explore')), iconGrid(quickCards),
    sectionHead('Tools'), iconGrid(toolCards),
    maulanas.length > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        background: 'linear-gradient(120deg,#1f5145,#163b30)',
        border: '1px solid rgba(255,255,255,.08)',
        borderRadius: R.card,
        padding: '12px 14px',
        marginTop: 14
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
        borderRadius: R.chip,
        background: 'rgba(216,184,99,.18)',
        // pressed into the card rather than sitting flat on it, like every other
        // small well in the app
        boxShadow: 'inset 2px 2px 5px rgba(8,22,18,.45), inset -1.5px -1.5px 4px rgba(216,184,99,.16)',
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
        borderRadius: R.pill,
        background: 'linear-gradient(145deg,#e2c67c,#d8b863)',
        /* Written out rather than taken from neuUpOn, whose lit edge is the page
           highlight: an opaque cream edge is right on a cream page and far too
           bright on a gold pill sitting on dark green. Same two-sided light,
           pitched for where this actually sits. */
        boxShadow: '3.5px 3.5px 9px rgba(8,22,18,.45), -2px -2px 6px rgba(243,234,212,.14)',
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
        color: NEU.muted,
        marginBottom: 5,
        paddingLeft: 2,
        ...wallHalo()
      }
    }, this.t('home.sponsored')), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: '100%',
        aspectRatio: '16 / 7',
        overflow: 'hidden',
        /* The frame behind the slide was the opaque sunk tone, so on the
           wallpaper it read as a hole cut in the picture while an image loaded
           or cross-faded. Same pane as every other card here; the slide covers
           it once it arrives. */
        ...neuFlat(R.card)
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
        background: NEU.sunk,
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
    }, this.t('prayer.settings'))), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.go('location'),
      className: "neu-press",
      style: {
        ...neuCard(14, .75),
        padding: '11px 14px',
        marginBottom: 14,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        minHeight: 44
      }
    }, icon('map-pin', { size: 16, stroke: onSurf('#1f5145'), style: { flexShrink: 0 } }), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0,
        fontSize: 13,
        color: NEU.ink,
        fontWeight: 600
      }
    }, this.prayerLocation().name, /*#__PURE__*/React.createElement("span", {
      style: {
        fontWeight: 500,
        color: this.prayerSource().kind === 'fallback' ? '#6e2230' : NEU.muted
      }
    }, this.prayerSource().kind === 'fallback' ? " · showing Dublin's timetable" : this.prayerSource().kind === 'cached' ? ' · saved timetable' : this.prayerSource().kind === 'preset' ? " · centre's timetable" : ' · updated today')), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        color: NEU.muted,
        fontSize: 18,
        flexShrink: 0
      }
    }, "›")), tab === 'today' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
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
        color: p.isNext ? onSurf('#1f5145') : onSurf('#75601f'),
        width: 30,
        textAlign: 'center'
      },
      dir: "rtl"
    }, p.glyph), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 16.5,
        color: p.isNext ? onSurf('#1f5145') : NEU.ink2,
        fontWeight: p.isNext ? 700 : 500
      }
    }, p.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: NEU.muted,
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
        color: p.isNext ? onSurf('#1f5145') : NEU.ink2,
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
          color: NEU.ink
        }
      }, preset.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11.5,
          color: NEU.muted,
          marginTop: 2
        }
      }, preset.sub)), active && /*#__PURE__*/React.createElement("span", {
        style: {
          color: onSurf('#1f5145'),
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
        color: NEU.ink
      }
    }, this.t('prayer.adhan')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: NEU.muted,
        marginTop: 1
      }
    }, this.t('prayer.adhanSub'))), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setAdhanEnabled(!st.adhanEnabled),
      role: "switch",
      "aria-checked": st.adhanEnabled ? 'true' : 'false',
      "aria-label": 'Adhan sound',
      /* The padding is the tap target and the child is the switch. Putting both
         on one element meant border-radius rounded the padded box while
         background-clip painted only the middle band of it — below where the
         corners curve, so the pill came out square-ended. */
      style: {
        padding: '9px 0',
        margin: '-9px 0',
        cursor: 'pointer',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 48,
        height: 26,
        borderRadius: 13,
        background: st.adhanEnabled ? NEU.accent : NEU.sunk,
        boxShadow: st.adhanEnabled ? 'none' : neuIn(.3),
        position: 'relative',
        transition: 'background .2s'
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
    })))), st.adhanEnabled && (() => {
      /* The choice itself lives in More, where a setting is looked for. What is
         left here is the answer to "which one is playing", and a way through to
         change it — a label with a chevron, not a second copy of the control. */
      const sounds = adhanSounds(st.liveAzans, st.liveAzanOverrides);
      const chosen = sounds.find(x => x.key === st.adhanSound) || sounds[0];
      return /*#__PURE__*/React.createElement("div", {
        onClick: () => this.go('more'),
        className: "neu-press",
        style: {
          display: 'flex', alignItems: 'center', gap: 10, marginTop: 12,
          padding: '11px 13px', minHeight: 48, boxSizing: 'border-box',
          borderRadius: 13, cursor: 'pointer',
          background: NEU.surf, border: NEU.edge, boxShadow: neuUp(.6)
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: { flex: 1, minWidth: 0 }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10, letterSpacing: 1, textTransform: 'uppercase',
          fontWeight: 700, color: NEU.muted
        }
      }, this.t('prayer.adhanSound')), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13, fontWeight: 700, color: NEU.ink, marginTop: 2,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }
      }, chosen.label)), /*#__PURE__*/React.createElement("span", {
        "aria-hidden": "true",
        style: { color: NEU.muted, fontSize: 20, flexShrink: 0 }
      }, "›"));
    })(), st.adhanEnabled && /*#__PURE__*/React.createElement("div", {
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
        color: onSurf('#1f5145'),
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
        color: onSurf('#6e2230'),
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
        color: NEU.ink
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
      // padding is the tap target, the child is the switch — see the adhan one above
      style: {
        padding: '9px 0',
        margin: '-9px 0',
        cursor: 'pointer',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 48,
        height: 26,
        borderRadius: 13,
        background: st.notifEnabled ? NEU.accent : NEU.sunk,
        boxShadow: st.notifEnabled ? 'none' : neuIn(.3),
        position: 'relative',
        transition: 'background .2s'
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
    }))) : /*#__PURE__*/React.createElement("div", {
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
        color: onSurf('#1f5145'),
        cursor: 'pointer'
      }
    }, this.t('prayer.allowNotif')), !notifSupported && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 8,
        fontSize: 11.5,
        color: NEU.muted
      }
    }, this.t('prayer.noNotif'))))), tab !== 'settings' && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        fontSize: 11.5,
        color: NEU.muted,
        lineHeight: 1.5,
        padding: '6px 20px'
      }
    }, this.t('prayer.note')));
  }

  /* ── LIBRARY ── */
  /* \u2500\u2500 SAVED \u2500\u2500
     Bookmarks and favourites live under one tab because they are the same act
     with different intent; splitting them across two screens would hide half of
     what a reader has kept. Removal is a two-step press rather than a dialog \u2014
     the app has no modal, and an accidental tap on a phone is easy. */
  /* ── LEADERBOARD ──
     One board per difficulty, read from the public view. Rank, name, score,
     correct, time and date; the participant's own row is marked by a label as
     well as a tint, because a colour alone tells a colour-blind reader nothing.
     Loading, empty and error each have their own state, and the error offers a
     retry rather than leaving a blank panel. */
  renderLeaderboard(st) {
    const diff = st.lbTab;
    const meta = QUIZ_LEVELS.find(l => l.key === diff) || QUIZ_LEVELS[0];
    const best = (st.quizBest || {})[diff];
    const fmtTime = ms => {
      const t = Math.round((ms || 0) / 1000);
      return t >= 60 ? `${Math.floor(t / 60)}m ${String(t % 60).padStart(2, '0')}s` : `${t}s`;
    };
    const fmtDate = v => {
      const d = new Date(v);
      return isNaN(d) ? '' : d.toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' });
    };
    const mine = row => !!best && row.display_name === st.quizName && row.score === best.score && row.correct === best.correct;
    const tab = L => /*#__PURE__*/React.createElement("div", {
      key: L.key,
      onClick: () => this.loadLeaderboard(L.key),
      "aria-pressed": diff === L.key ? 'true' : 'false',
      style: {
        flex: 1, textAlign: 'center', padding: '11px 4px', borderRadius: 12,
        fontSize: 12.5, fontWeight: diff === L.key ? 800 : 600, cursor: 'pointer',
        background: NEU.surf, color: diff === L.key ? L.color : NEU.muted,
        border: NEU.edge, boxShadow: diff === L.key ? neuIn(.55) : neuUp(.55),
        minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'box-shadow .18s ease, color .18s ease'
      }
    }, L.label);
    const panel = children => /*#__PURE__*/React.createElement("div", {
      style: { ...neuCard(16, .85), padding: '24px 18px', textAlign: 'center' }
    }, children);
    let body;
    if (st.lbState === 'loading' || st.lbState === 'idle') {
      body = panel(/*#__PURE__*/React.createElement("div", {
        style: { fontSize: 13, color: NEU.muted }
      }, "Loading the ", meta.label, " leaderboard\u2026"));
    } else if (st.lbState === 'error') {
      const msg = st.lbError === 'offline' ? 'You are offline, so the leaderboard cannot be shown. Your own results are safe and will be sent when you reconnect.' : st.lbError === 'not_deployed' ? 'The leaderboard service is not available yet.' : 'The leaderboard could not be loaded.';
      body = panel(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        style: { fontSize: 13, color: NEU.ink, lineHeight: 1.5 }
      }, /*#__PURE__*/React.createElement("span", { "aria-hidden": "true" }, "\u26a0 "), msg), /*#__PURE__*/React.createElement("div", {
        onClick: () => this.loadLeaderboard(diff),
        style: {
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          marginTop: 14, padding: '12px 20px', borderRadius: 12, cursor: 'pointer',
          border: `1.5px solid ${NEU.accent}`, color: NEU.accent,
          fontSize: 13, fontWeight: 700, minHeight: 44
        }
      }, "Try again")));
    } else if (!st.lbRows.length) {
      body = panel(/*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
        style: { fontFamily: 'Spectral,serif', fontSize: 16, fontWeight: 600, color: NEU.ink }
      }, "No ", meta.label, " results yet"), /*#__PURE__*/React.createElement("div", {
        style: { fontSize: 12.5, color: NEU.muted, marginTop: 6, lineHeight: 1.5 }
      }, "Be the first to finish ", /^[aeiou]/i.test(meta.label) ? 'an' : 'a', " ", meta.label, " quiz.")));
    } else {
      body = /*#__PURE__*/React.createElement("ol", {
        style: { listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 7 }
      }, st.lbRows.map((row, i) => {
        const you = mine(row);
        return /*#__PURE__*/React.createElement("li", {
          key: row.id || i,
          style: {
            ...neuCard(13, you ? .95 : .7),
            padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 11,
            border: you ? `1.5px solid ${NEU.accent}` : NEU.edge
          }
        }, /*#__PURE__*/React.createElement("span", {
          // read out, not hidden: with list-style removed the ol does not
          // announce positions, and rank is the whole point of the row
          "aria-label": 'Rank ' + (i + 1),
          style: {
            flexShrink: 0, width: 28, textAlign: 'center',
            fontFamily: 'Spectral,serif', fontSize: 15, fontWeight: 700,
            color: i < 3 ? meta.color : NEU.muted
          }
        }, i + 1), /*#__PURE__*/React.createElement("div", {
          style: { flex: 1, minWidth: 0 }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 14, fontWeight: you ? 800 : 600, color: NEU.ink,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }
        }, row.display_name, you ? /*#__PURE__*/React.createElement("span", {
          style: {
            marginLeft: 6, fontSize: 9.5, letterSpacing: .8, textTransform: 'uppercase',
            fontWeight: 800, color: NEU.accent
          }
        }, "\u2022 You") : null), /*#__PURE__*/React.createElement("div", {
          style: { fontSize: 11, color: NEU.muted, marginTop: 2 }
        }, row.correct, "/", row.total, " correct \u00b7 ", fmtTime(row.duration_ms), " \u00b7 ", fmtDate(row.submitted_at))), /*#__PURE__*/React.createElement("span", {
          style: {
            flexShrink: 0, fontSize: 15, fontWeight: 800, color: meta.color,
            fontVariantNumeric: 'tabular-nums'
          }
        }, row.score));
      }));
    }
    return /*#__PURE__*/React.createElement("section", {
      "aria-label": "Quiz leaderboard",
      style: { marginBottom: 14 }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        fontFamily: 'Spectral,serif', fontSize: 18, fontWeight: 600,
        color: NEU.ink, margin: '4px 0 10px'
      }
    }, "Leaderboard"), /*#__PURE__*/React.createElement("div", {
      role: "tablist",
      "aria-label": "Leaderboard difficulty",
      style: { display: 'flex', gap: 8, marginBottom: 12 }
    }, QUIZ_LEVELS.map(tab)), best && /*#__PURE__*/React.createElement("div", {
      style: {
        ...neuWell(13, .7), padding: '11px 13px', marginBottom: 10,
        display: 'flex', alignItems: 'center', gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: { flex: 1, minWidth: 0 }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 9.5, letterSpacing: 1.1, textTransform: 'uppercase',
        fontWeight: 800, color: NEU.muted
      }
    }, "Your best ", meta.label, " result"), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 13, color: NEU.ink, marginTop: 2 }
    }, best.correct, "/", best.total, " correct \u00b7 ", fmtTime(best.durationMs))), /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0, fontSize: 17, fontWeight: 800, color: meta.color,
        fontVariantNumeric: 'tabular-nums'
      }
    }, best.score)), st.pendingCount > 0 && /*#__PURE__*/React.createElement("div", {
      role: "status",
      style: {
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
        padding: '10px 12px', borderRadius: 12, background: '#f5eeda',
        fontSize: 12, color: onSurf('#7d6220'), fontWeight: 600, lineHeight: 1.45
      }
    }, /*#__PURE__*/React.createElement("span", { style: { flex: 1 } }, /*#__PURE__*/React.createElement("span", { "aria-hidden": "true" }, "\u21bb "), st.pendingCount, " result", st.pendingCount === 1 ? '' : 's', " waiting to be sent."), /*#__PURE__*/React.createElement("span", {
      onClick: this.retrySync,
      role: "button",
      tabIndex: 0,
      onKeyDown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.retrySync(); } },
      style: {
        flexShrink: 0, padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
        border: '1px solid rgba(125,98,32,.4)', fontWeight: 700, minHeight: 44,
        display: 'flex', alignItems: 'center'
      }
    }, "Send now")), body);
  }

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
    }, icon('search', { size: 17, stroke: NEU.muted }), /*#__PURE__*/React.createElement("input", {
      value: st.savedQuery,
      onChange: e => this.setState({ savedQuery: e.target.value }),
      "aria-label": `Search ${kind === 'bookmark' ? 'bookmarks' : 'favourites'}`,
      placeholder: 'Search titles and passages',
      style: { border: 'none', outline: 'none', background: 'transparent', fontSize: 14, color: NEU.ink2, width: '100%' }
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
        color: onSurf('#6e2230'), fontSize: 13, fontWeight: 700, minHeight: 44
      }
    }, st.savedConfirm === clearKey ? `Tap again to clear all ${all.length}` : `Clear all ${kind === 'bookmark' ? 'bookmarks' : 'favourites'}`),
    /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 11.5, color: NEU.muted, marginTop: 18, lineHeight: 1.6, textAlign: 'center' }
    }, 'Saved on this device. Clearing your browser or app data may remove your bookmarks and progress.'));
  }

  renderLibrary(st) {
    const q = st.libQuery.trim().toLowerCase();
    const nahjData = st.liveNahj || NAHJ;
    const libMeta = {
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
    LIB_KINDS.forEach(k => {
      const list = st[k.state] || k.seed;
      libMeta[k.key] = {
        title: k.title, accent: k.accent, tint: k.tint, list,
        cats: ['All', ...new Set(list.map(it => it.cat).filter(Boolean))]
      };
    });
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
          flexShrink: 0,
          minWidth: 62,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 5,
          padding: '10px 6px 8px',
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
        color: active ? onSurf(lm.accent) : NEU.muted,
        border: NEU.edge,
        boxShadow: active ? neuIn(.55) : neuUp(.55)
      };
    };
    /* An order is only offered where the section can actually be put in it. A
       dropdown that reshuffles nothing reads as broken, and the day the admin
       adds a "Monday Duʿāʾ" the option appears on its own. */
    const sortOpts = (LIB_SORTS[st.libTab] || []).filter(([k]) =>
      // 'az' and 'given' need nothing of the data to be true of it
      k === 'az' || k === 'given' ? true
      : k === 'day' ? lm.list.some(it => dayRank(libText(it)) >= 0)
      : lm.list.some(it => prayerRank(libText(it)) >= 0 || dayRank(libText(it)) >= 0));
    const sortDefault = LIB_SORT_DEFAULT[st.libTab] || 'az';
    const sortPick = (st.libSort || {})[st.libTab];
    const sortMode = sortOpts.some(([k]) => k === sortPick) ? sortPick
      : sortOpts.some(([k]) => k === sortDefault) ? sortDefault : 'az';
    let libCards = [];
    if (LIB_KIND[st.libTab]) {
      // nearly every ziyārah title starts with a variant spelling of the word
      // itself, so ordering only reads properly by what comes after it
      const alpha = t => {
        let k = sortKey(t);
        if (st.libTab === 'ziyarah') k = k.replace(/^(ziyarat|ziyarah|ziarat|ziarah)\s+(of\s+)?/i, '');
        return k;
      };
      libCards = lm.list.filter(it => {
        const catOk = st.libCat === 'All' || it.cat === st.libCat;
        const qOk = !q || (it.title || '').toLowerCase().includes(q) || (it.sub || '').toLowerCase().includes(q)
          || (it.tr || '').toLowerCase().includes(q);
        return catOk && qOk;
      });
      /* One section is a catalogue rather than an index: its order groups the
         occasional prayers, then the isteghfar, then the week, and alphabetising
         that scatters the groups. 'given' means leave it as it was written. */
      if (sortMode !== 'given') libCards = libCards.sort((a, b) => {
        // A–Z always breaks the tie, so an entry the title says nothing about
        // still lands somewhere predictable rather than wherever it was typed.
        const ba = libBand(sortMode, a), bb = libBand(sortMode, b);
        if (ba !== bb) return ba - bb;
        const wa = libWithin(sortMode, ba, a), wb = libWithin(sortMode, bb, b);
        if (wa !== wb) return wa - wb;
        return alpha(a.title).localeCompare(alpha(b.title), 'en', { sensitivity: 'base', numeric: true });
      });
    }
    let nahjCards = [];
    // each book keeps its own chosen part, so switching books and back lands
    // where the reader left off rather than resetting to the first section
    const parts = BOOK_PARTS[st.nahjBook] || NAHJ_PARTS;
    const bookPart = parts.some(([k]) => k === st.nahjTab) ? st.nahjTab : parts[0][0];
    if (st.libTab === 'nahj') {
      nahjCards = orderBook(nahjData[bookPart]).filter(it => !q || (it.title || '').toLowerCase().includes(q) || (it.tr || '').toLowerCase().includes(q));
    }
    const nahjTabStyle = k => ({
      flex: 1,
      textAlign: 'center',
      // 8px left these at 33px tall, under the minimum target the rest of the app keeps to
      padding: '12px 0',
      minHeight: 44,
      boxSizing: 'border-box',
      fontSize: 13,
      cursor: 'pointer',
      borderRadius: 11,
      transition: 'box-shadow .18s ease, color .18s ease',
      // bookPart, not st.nahjTab: a part carried over from the other book is not
      // the part being shown, and an unlit row would be lying about which it is
      fontWeight: bookPart === k ? 700 : 500,
      color: bookPart === k ? '#2c5d52' : NEU.muted,
      background: NEU.surf,
      boxShadow: bookPart === k ? neuIn(.55) : neuUp(.55)
    });
    /* The book comes first and the parts belong to it, so the book row is the
       heavier of the two — same depth language, one step up in weight. */
    const bookTabStyle = k => ({
      flex: 1,
      textAlign: 'center',
      padding: '13px 6px',
      minHeight: 44,
      boxSizing: 'border-box',
      fontFamily: 'Spectral,serif',
      fontSize: 14,
      cursor: 'pointer',
      borderRadius: 13,
      transition: 'box-shadow .18s ease, color .18s ease, background .18s ease',
      fontWeight: st.nahjBook === k ? 700 : 600,
      color: st.nahjBook === k ? '#2c5d52' : NEU.muted,
      background: st.nahjBook === k ? '#e6efe9' : NEU.surf,
      border: NEU.edge,
      boxShadow: st.nahjBook === k ? neuIn(.6) : neuUp(.6)
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
      className: "s",
      // seven of these will not sit across a phone at a readable size, so the
      // row scrolls rather than squeezing every label into four characters
      style: {
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        margin: '0 -20px',
        padding: '0 20px 4px'
      }
    }, [...LIB_KINDS.map(k => [k.key, k.tab, k.icon]),
        ['nahj', 'Books', '📖'], ['saved', 'Saved', '🔖']].map(libTab))), st.libTab === 'saved' && /*#__PURE__*/React.createElement("div", {
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
        padding: '0 14px',
        marginBottom: 14
      }
    }, icon('search', { size: 17, stroke: NEU.muted }), /*#__PURE__*/React.createElement("input", {
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
        color: NEU.ink2,
        width: '100%',
        // the field is the target, not just the well drawn around it
        padding: '12px 0',
        minHeight: 44,
        boxSizing: 'border-box'
      }
    }), st.libQuery && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({
        libQuery: ''
      }),
      style: {
        color: NEU.muted,
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
    }, c))), sortOpts.length > 1 && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        ...neuWell(14, .8),
        padding: '0 14px',
        marginBottom: 14
      }
    }, /*#__PURE__*/React.createElement("label", {
      htmlFor: "abi-lib-sort",
      style: {
        fontSize: 11,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: NEU.muted,
        flexShrink: 0
      }
    }, 'Sort'), /*#__PURE__*/React.createElement("select", {
      id: "abi-lib-sort",
      className: "abi-select",
      value: sortMode,
      onChange: e => this.setState({ libSort: { ...st.libSort, [st.libTab]: e.target.value } }),
      style: {
        flex: 1,
        minWidth: 0,
        border: 'none',
        outline: 'none',
        background: 'transparent',
        fontSize: 13.5,
        fontWeight: 600,
        color: lm.accent,
        padding: '12px 0',
        minHeight: 44,
        boxSizing: 'border-box'
      }
    }, sortOpts.map(([k, label]) => /*#__PURE__*/React.createElement("option", {
      key: k,
      value: k
    }, label))), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        color: NEU.muted,
        fontSize: 11,
        flexShrink: 0
      }
    }, "▾")), st.libTab === 'nahj' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginBottom: 10
      }
    }, BOOKS.map(([k, label]) => /*#__PURE__*/React.createElement("div", {
      key: k,
      onClick: () => this.setState({
        nahjBook: k
      }),
      style: bookTabStyle(k)
    }, label))), st.libTab === 'nahj' && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginBottom: 16
      }
    }, parts.map(([k, label]) => /*#__PURE__*/React.createElement("div", {
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
        color: NEU.ink,
        lineHeight: 1.3
      }
    }, it2.title, it2.sub && /*#__PURE__*/React.createElement("div", {
      /* Fourteen entries called Salaat of Masoomeen (as) are one entry as far as
         a list of titles is concerned. Only drawn when there is one, so nothing
         that already exists gains a line. */
      style: {
        fontFamily: 'Hanken Grotesk, system-ui, sans-serif',
        fontSize: 12, fontWeight: 500, color: NEU.muted, marginTop: 3, lineHeight: 1.35
      }
    }, it2.sub)), /*#__PURE__*/React.createElement("span", {
      style: {
        flexShrink: 0,
        color: NEU.muted,
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
        color: onSurf('#2c5d52'),
        background: '#e6efe9',
        padding: '3px 7px',
        borderRadius: 6,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, n.ref), /*#__PURE__*/React.createElement("span", {
      style: {
        color: NEU.muted,
        fontSize: 14,
        flexShrink: 0
      }
    }, "⤢")), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 14.5,
        fontWeight: 600,
        color: NEU.ink,
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
        color: onSurf('#2c5d52'),
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
       // named down to the section: "Sahifa e Sajjadia" is not empty when its
       // Munājāt are, and saying so sends the admin looking in the wrong place
       : `Nothing here yet — ${st.libTab === 'nahj'
            ? (BOOKS.find(([k]) => k === st.nahjBook) || [, ''])[1] + ' · ' + (parts.find(([k]) => k === bookPart) || [, ''])[1]
            : lm.title} is filled in from the admin dashboard.`));
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
    /* The section's own colour, lifted for the dark reader. It marks the kicker, the
       language pills and the skip buttons — crimson on near-black measured 1.56:1,
       which is the label on the page you are least able to do without. */
    const readAccent = onSurf(LIB_KIND[rtype] ? LIB_KIND[rtype].accent
      : rtype === 'nahj' ? '#2c5d52' : rtype === 'learning' ? '#3a4a78' : '#7d6220');
    // per-language content: items may carry body_ur / body_fa / body_hi alongside the English body
    const TR_CODES = { 'हिन्दी': 'hi', 'فارسی': 'fa', 'Urdu': 'ur' };
    const trCode = TR_CODES[st.lang];
    const KICKERS = {
      dua: { English: 'Supplication', 'العربية': 'دعاء', 'हिन्दी': 'दुआ', 'فارسی': 'دعا', Urdu: 'دعا' },
      ziyarah: { English: 'Salutation', 'العربية': 'زيارة', 'हिन्दी': 'ज़ियारत', 'فارسی': 'زیارت', Urdu: 'زیارت' },
      aamal: { English: 'Taqeebat & Ziyarat', 'العربية': 'تعقيبات', 'हिन्दी': 'ताक़ीबात', 'فارسی': 'تعقیبات', Urdu: 'تعقیبات' },
      amaal: { English: 'Amaal', 'العربية': 'أعمال', 'हिन्दी': 'आमाल', 'فارسی': 'اعمال', Urdu: 'اعمال' },
      salat: { English: 'Salat', 'العربية': 'صلاة', 'हिन्दी': 'नमाज़', 'فارسی': 'نماز', Urdu: 'نماز' }
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
    /* Books and Learning are PDFs \u2014 the scan is the edition. A du\u02bf\u0101\u02be, ziy\u0101rah or
       amaal is the text itself, and the PDF beside it was a second and worse
       copy of the same words: no line numbers, no bookmarks, no language switch,
       no saving a passage. Every one of those entries that carries a PDF link
       also carries the Arabic, so the tab goes and nothing goes with it. */
    const hasPdf = !!r.pdf && (rtype === 'nahj' || rtype === 'learning' || rtype === 'salat');
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
        this.destroyPdf();
        this.audioStop();
        // a Learning chapter was opened from Madrasa, and back means where you were
        this.setState({ screen: rtype === 'learning' ? 'kids' : 'library', kidsTab: rtype === 'learning' ? 'books' : this.state.kidsTab, readingItem: null, readingType: null, readingLang: null });
        const sc = document.querySelector('.app > .s');
        if (sc) sc.scrollTop = 0;
      },
      style: { display: 'flex', alignItems: 'center', gap: 5, cursor: 'pointer', color: rd.accent, fontSize: 14, fontWeight: 600, minHeight: 44, padding: '0 8px', margin: '0 -8px' }
    }, React.createElement("span", { style: { fontSize: 18 } }, "\u2039"), " ", rtype === 'learning' ? 'Learning' : this.t('lib.back')),
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
        ),
      tabs.length > 1 && React.createElement("div", { style: { display: 'flex', gap: 8, marginTop: 8 } }, tabs.map(pill))),
    /* The recitation sits above the text and outside the language tabs: it is the
       same recitation whichever script is on screen, and a reader following along
       must not lose their place in it by switching to the translation.

       Custom controls rather than the browser's, because the five that matter for
       a forty-minute duʿāʾ \u2014 play, pause, stop, back, forward \u2014 are not the five a
       native player puts within thumb reach on every platform. */
    /* An entry can exist before its text does — the Salat catalogue arrived as a
       list of names, and the method of each one has to be typed, pasted or
       scanned in afterwards. Without this the reader draws a title and then
       nothing at all, which reads as a broken page rather than an empty one. */
    tabs.length === 0 && !r.audio && React.createElement("div", {
      style: {
        ...neuWell(18), padding: '30px 22px', textAlign: 'center', marginBottom: 14
      }
    }, React.createElement("div", {
      style: { fontSize: 14.5, color: rd.ink, lineHeight: 1.6 }
    }, 'The text for this one has not been added yet.'),
      React.createElement("div", {
        style: { fontSize: 12.5, color: rd.muted, lineHeight: 1.6, marginTop: 7 }
      }, st.adminLoggedIn
        ? 'Add it under Admin › Library › Salat — as text, or as a PDF of the page it is printed on.'
        : 'It is on its way. Everything else in this section is listed and ready.')),
    r.audio && this.renderAudioPlayer(st, r, rd, readAccent),
    /* Under the player rather than beside the title. Up there they crowded a long
       name into a column half the width of the screen, and they are things you
       reach for once you have decided about the text — not before you have read
       the first line of it. */
    React.createElement("div", {
      style: { display: 'flex', gap: 9, justifyContent: 'flex-end', marginBottom: 14 }
    }, shareBtn, bookmarkBtn, favouriteBtn),
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
    lang === 'pdf' && hasPdf && this.renderPdf(st, r, rd, readAccent, dark)));
  }

  /* \u2500\u2500 PDF \u2500\u2500
     Rendered here rather than handed to Google's viewer, which is what this used
     to do: that sent the address of whatever anyone was reading to a third party,
     needed a live connection every time, and could not offer a download. pdf.js
     draws the page on a canvas from bytes this app fetched itself.

     The cost of that swap is honest and worth stating: a viewer running in the
     page can only read a file the file's own host allows it to read. An uploaded
     PDF always works; a linked one works if that host permits it, and says so
     plainly when it does not. */
  renderPdf(st, r, rd, accent, dark) {
    const url = r.pdf;
    const status = this._pdfUrl === url ? st.pdfStatus : 'loading';
    const page = st.pdfPage;
    const pages = st.pdfPages;
    const btn = (label, onClick, o = {}) => React.createElement("div", {
      onClick: o.disabled ? undefined : onClick,
      "aria-disabled": o.disabled ? 'true' : undefined,
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        minHeight: 44, padding: '11px 14px', borderRadius: 13, flex: o.flex,
        border: `1.5px solid ${o.disabled ? rd.border : (o.solid ? accent : rd.border)}`,
        background: o.solid && !o.disabled ? accent : rd.surf,
        color: o.disabled ? rd.muted : (o.solid ? '#fff' : accent),
        fontSize: 13.5, fontWeight: 600,
        cursor: o.disabled ? 'default' : 'pointer',
        opacity: o.disabled ? .55 : 1
      }
    }, o.icon ? icon(o.icon, { size: 16 }) : null, label);

    const message = {
      blocked: 'This PDF is stored somewhere that does not allow other sites to read it, so it cannot be shown here. It will still open in your browser.',
      missing: 'This PDF could not be found at its link. It may have been moved or removed.',
      password: 'This PDF is password protected, so it cannot be shown here.',
      offline: 'The viewer could not be downloaded. Connect to the internet once and it will be available offline afterwards.'
    };

    return React.createElement(React.Fragment, null,
      /* The canvas mounting is what starts the load: it fires after the element
         exists, so there is never a first page drawn into nothing. */
      React.createElement("div", {
        style: {
          position: 'relative', borderRadius: 16, overflow: 'auto',
          border: `1px solid ${rd.border}`, background: dark ? '#15191a' : '#e8e2d6',
          padding: 10, textAlign: 'center', maxHeight: '68vh',
          WebkitOverflowScrolling: 'touch'
        }
      }, React.createElement("canvas", {
        ref: el => {
          this._pdfCanvas = el;
          if (!el) return;
          this.ensurePdf(url);
          /* Only when the node is new. This component re-renders on a one-second
             clock, and drawing again cancels the draw in flight and blanks the
             canvas — on a big page that loop never lets a page finish. */
          if (this._pdfDoc && this._pdfDrawn !== el) this.drawPdfPage();
        },
        "aria-label": `${r.title || 'Document'}, page ${page}${pages ? ' of ' + pages : ''}`,
        role: "img",
        style: {
          display: status === 'ready' ? 'inline-block' : 'none',
          maxWidth: '100%', borderRadius: 8,
          boxShadow: '0 4px 16px -6px rgba(0,0,0,.35)', background: '#fff'
        }
      }), status !== 'ready' && React.createElement("div", {
        role: "status",
        style: {
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          gap: 10, minHeight: 220, padding: '30px 18px', color: rd.muted, fontSize: 13.5, lineHeight: 1.6
        }
      }, icon(status === 'error' ? 'triangle-alert' : 'book-open', {
        size: 26, stroke: status === 'error' ? '#a2564a' : rd.muted
      }), status === 'error' ? (message[st.pdfError] || message.blocked) : 'Opening the document\u2026')),

      status === 'ready' && pages > 1 && React.createElement("div", {
        style: { display: 'flex', alignItems: 'center', gap: 9, marginTop: 12 }
      }, btn('\u2039', () => this.goPdfPage(page - 1), { disabled: page <= 1 }),
         React.createElement("div", {
           role: "status",
           "aria-live": "polite",
           style: {
             flex: 1, textAlign: 'center', fontSize: 13.5, fontWeight: 600,
             color: rd.text, minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center'
           }
         }, `Page ${page} of ${pages}`),
         btn('\u203a', () => this.goPdfPage(page + 1), { disabled: page >= pages })),

      status === 'ready' && React.createElement("div", {
        style: { display: 'flex', gap: 9, marginTop: 9 }
      }, btn('Zoom out', () => this.zoomPdf(1 / 1.25), { flex: 1, disabled: st.pdfZoom <= 0.75 }),
         btn('Zoom in', () => this.zoomPdf(1.25), { flex: 1, disabled: st.pdfZoom >= 3 })),

      React.createElement("div", {
        style: { display: 'flex', gap: 9, marginTop: 9 }
      }, btn(st.pdfSaving ? 'Saving\u2026' : 'Download', () => this.downloadPdf(url, r.title),
             { flex: 1, solid: true, icon: 'book-heart', disabled: st.pdfSaving }),
         btn('Open in browser', () => window.open(url, '_blank', 'noopener,noreferrer'), { flex: 1 })),

      React.createElement("div", {
        style: { fontSize: 11.5, color: rd.muted, lineHeight: 1.6, textAlign: 'center', marginTop: 14 }
      }, 'Downloaded copies are saved by your browser, not inside the app.'));
  }

  /* A file gets into the library one of two ways, and the two are not equal. An
     uploaded file is served from this project's own storage, which permits the
     app to read it, so it can be played or shown inside the reader. A pasted
     link works only if the host it lives on allows that \u2014 many do not. The
     control says which is which up front rather than leaving an administrator to
     find out from a reader. */
  /* Ask the function for a signed URL, then PUT the bytes at it. Split out of
     uploadMedia so the sniff-and-shrink stage above stays readable, and because
     it is the only part that needs to hold on to the request. */
  signAndPut(kind, file, onDone, say) {
    say('sending', 'Preparing…', 0);
    return fetch(EDGE_UPLOAD_MEDIA, {
      method: 'POST',
      headers: {
        apikey: SB_KEY,
        Authorization: 'Bearer ' + SB_KEY,
        'Content-Type': 'application/json',
        'x-abi-install': installId()
      },
      body: JSON.stringify({ kind, bytes: file.size, filename: (file.name || '').slice(0, 120) })
    }).then(res => res.json().catch(() => ({})).then(body => ({ res, body })))
      .then(({ res, body }) => {
        if (!res.ok || !body || !body.uploadUrl) {
          const err = (body && body.error) || 'upload_failed';
          say('error',
            err === 'rate_limited' ? 'Too many uploads just now. Try again in a few minutes.'
            : err === 'too_large' ? 'That file is over the limit.'
            : err === 'bucket_missing' ? 'Storage is not set up for this yet — see supabase/README.md.'
            : 'Upload could not start. Paste a link instead.');
          return;
        }
        /* XHR rather than fetch for this leg: a 60 MB upload with no sign of
           progress is one a person cancels. */
        return new Promise(resolve => {
          const xhr = new XMLHttpRequest();
          this._upload = xhr;
          xhr.open('PUT', body.uploadUrl, true);
          xhr.setRequestHeader('Content-Type', file.type
            || (kind === 'audio' ? 'audio/mpeg' : kind === 'image' ? 'image/png' : 'application/pdf'));
          xhr.upload.onprogress = e => {
            if (!e.lengthComputable) return;
            const pct = Math.round(e.loaded / e.total * 100);
            say('sending', `Uploading… ${pct}%`, pct);
          };
          xhr.onload = () => {
            this._upload = null;
            if (xhr.status >= 200 && xhr.status < 300) {
              if (onDone) onDone(body.publicUrl);
              say('done', 'Uploaded. The link below is filled in.');
            } else {
              say('error', 'The file did not finish uploading. Try again, or paste a link.');
            }
            resolve();
          };
          xhr.onerror = () => {
            this._upload = null;
            say('error', 'The upload was interrupted. Try again, or paste a link.');
            resolve();
          };
          xhr.onabort = () => { this._upload = null; resolve(); };
          xhr.send(file);
        });
      });
  }

  renderMediaPicker(st, d, o) {
    const kind = o.kind;
    const spec = MEDIA_KINDS[kind];
    const field = o.field;
    const up = st.adminUpload && st.adminUpload.kind === kind ? st.adminUpload : null;
    const busy = !!up && (up.state === 'reading' || up.state === 'sending');
    const tone = !up ? null
      : up.state === 'error' ? { bg: '#fdf0f2', edge: '#dfc4ca', ink: '#6e2230' }
      : up.state === 'done' ? { bg: '#eef7f4', edge: '#c4ddd7', ink: '#1f5145' }
      : { bg: '#f4ede0', edge: '#e2d3b4', ink: '#7d6220' };
    const inputId = 'abi-up-' + kind;
    const inp2 = {
      width: '100%', border: NEU.edge, background: NEU.sunk, boxShadow: neuIn(.7),
      borderRadius: 11, padding: '11px 13px', minHeight: 44, fontSize: 14,
      color: NEU.ink, outline: 'none', boxSizing: 'border-box'
    };
    return /*#__PURE__*/React.createElement("div", {
      style: {
        border: NEU.edge, background: NEU.surf, boxShadow: neuUp(.6),
        borderRadius: 14, padding: 13, marginBottom: 11
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
        fontWeight: 700, color: NEU.muted, marginBottom: 9
      }
    }, o.heading), /*#__PURE__*/React.createElement("label", {
      htmlFor: inputId,
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        minHeight: 46, padding: '12px 14px', borderRadius: 12,
        border: '1.5px dashed #c4ddd7',
        background: busy ? '#f0e8d6' : '#eef7f4',
        color: busy ? '#7d6220' : '#1f5145',
        fontSize: 13.5, fontWeight: 700, cursor: busy ? 'default' : 'pointer'
      }
    }, icon(kind === 'audio' ? 'book-heart' : 'book-open', { size: 16 }),
       busy ? up.msg : 'Upload ' + spec.upload + ' from this device'),
    /*#__PURE__*/React.createElement("input", {
      id: inputId,
      type: "file",
      accept: spec.accept,
      disabled: busy,
      onChange: e => {
        const f = e.target.files && e.target.files[0];
        e.target.value = '';
        this.uploadMedia(kind, f, url => this.setDraft({ [field]: url }));
      },
      style: { position: 'absolute', width: 1, height: 1, opacity: 0, pointerEvents: 'none' }
    }),
    /* A bar rather than a percentage alone: 60 MB over a phone connection is long
       enough that a number which has not moved looks the same as one that never
       will. */
    busy && typeof up.pct === 'number' && /*#__PURE__*/React.createElement("div", {
      role: "progressbar",
      "aria-valuenow": up.pct,
      "aria-valuemin": 0,
      "aria-valuemax": 100,
      "aria-label": 'Upload progress',
      style: { height: 5, borderRadius: 3, background: '#e6ded0', marginTop: 9, overflow: 'hidden' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { height: '100%', width: up.pct + '%', background: '#1f5145', transition: 'width .2s linear' }
    })),
    busy && /*#__PURE__*/React.createElement("div", {
      onClick: this.cancelUpload,
      style: {
        marginTop: 9, textAlign: 'center', minHeight: 40, padding: '10px',
        borderRadius: 11, border: '1px solid rgba(110,34,48,.3)',
        color: onSurf('#6e2230'), fontSize: 12.5, fontWeight: 600, cursor: 'pointer'
      }
    }, 'Cancel upload'),
    up && !busy && /*#__PURE__*/React.createElement("div", {
      role: "status",
      style: {
        marginTop: 9, padding: '9px 11px', borderRadius: 11,
        background: tone.bg, border: `1px solid ${tone.edge}`,
        color: tone.ink, fontSize: 12, lineHeight: 1.5
      }
    }, up.msg), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 11, color: NEU.muted, margin: '11px 0 7px', lineHeight: 1.5 }
    }, o.hint), /*#__PURE__*/React.createElement("input", {
      value: d[field] || '',
      onChange: e => this.setDraft({ [field]: e.target.value }),
      placeholder: "https://\u2026",
      style: inp2
    }), o.extraField && /*#__PURE__*/React.createElement("input", {
      value: d[o.extraField] || '',
      onChange: e => this.setDraft({ [o.extraField]: e.target.value }),
      placeholder: o.extraPlaceholder,
      maxLength: 60,
      style: { ...inp2, marginTop: 9 }
    }), d[field] && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setDraft({ [field]: '' }),
      style: {
        marginTop: 9, textAlign: 'center', minHeight: 40, padding: '10px',
        borderRadius: 11, border: '1px solid rgba(110,34,48,.3)',
        color: onSurf('#6e2230'), fontSize: 12.5, fontWeight: 600, cursor: 'pointer'
      }
    }, 'Remove this ' + spec.label));
  }

  /* Shorthands, so every editor asks for the same two blocks the same way. */
  renderPdfPicker(st, d) {
    return this.renderMediaPicker(st, d, {
      kind: 'pdf', field: 'pdf', heading: 'PDF (optional)',
      hint: '\u2026 or paste a link. A linked PDF opens in the browser, but only shows inside the app if its host allows other sites to read it.'
    });
  }
  renderAudioPicker(st, d) {
    return this.renderMediaPicker(st, d, {
      kind: 'audio', field: 'audio', heading: 'Recitation (optional)',
      extraField: 'reciter', extraPlaceholder: 'Reciter (optional)',
      hint: '\u2026 or paste a direct link to an MP3 or M4A file, not a page it sits on. The player appears at the top of the reader.'
    });
  }

  renderAudioPlayer(st, r, rd, accent) {
    const at = st.audioAt || 0;
    const dur = st.audioDur || 0;
    const playing = !!st.audioPlaying;
    const clock = t => {
      if (!isFinite(t) || t < 0) t = 0;
      const m = Math.floor(t / 60), sec = Math.floor(t % 60);
      return m + ':' + String(sec).padStart(2, '0');
    };
    const btn = (label, mark, onClick, big) => /*#__PURE__*/React.createElement("div", {
      onClick,
      "aria-label": label,
      style: {
        // play keeps 44; the three around it come down to 40, still well clear
        // of the 24px minimum and enough to let the row read as one control
        width: big ? 44 : 40, height: big ? 44 : 40, borderRadius: big ? 14 : 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer', flexShrink: 0,
        border: big ? 'none' : `1px solid ${rd.border}`,
        background: big ? accent : rd.surf,
        color: big ? inkOn(accent) : accent,
        fontSize: big ? 17 : 13.5, fontWeight: 700,
        boxShadow: big ? '0 5px 13px -8px rgba(0,0,0,.5)' : 'none'
      }
    }, mark);

    return /*#__PURE__*/React.createElement("div", {
      style: {
        background: rd.surf, border: `1px solid ${rd.border}`, borderRadius: 15,
        padding: '10px 12px 11px', marginBottom: 12
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }
    }, icon('book-heart', { size: 14, stroke: accent, style: { flexShrink: 0 } }),
       /*#__PURE__*/React.createElement("div", {
         style: { fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', fontWeight: 700, color: rd.muted }
       }, 'Recitation'),
       r.reciter && /*#__PURE__*/React.createElement("div", {
         style: {
           fontSize: 11, color: rd.muted, marginLeft: 'auto', minWidth: 0,
           overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
         }
       }, r.reciter)),

    /*#__PURE__*/React.createElement("audio", {
      ref: this.bindAudio,
      src: r.audio,
      preload: "metadata",
      style: { display: 'none' }
    }),

    /* The clock sits on the bar's own line rather than under it. Two numbers
       need a line of their own only when they are being read; here they are
       glanced at, and the row they had cost more height than the bar. */
    /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex', alignItems: 'center', gap: 9,
        fontSize: 10.5, color: rd.muted, fontVariantNumeric: 'tabular-nums'
      }
    }, /*#__PURE__*/React.createElement("span", { style: { flexShrink: 0 } }, clock(at)),
    /* The bar is a slider so it can be dragged with a thumb and moved with the
       arrow keys, which a row of div buttons cannot be. */
    /*#__PURE__*/React.createElement("input", {
      type: "range",
      className: "abi-seek",
      min: 0, max: 1000,
      value: dur ? Math.round(at / dur * 1000) : 0,
      onChange: e => this.audioSeek(+e.target.value / 1000),
      "aria-label": 'Seek within the recitation',
      "aria-valuetext": clock(at) + ' of ' + clock(dur),
      style: { flex: 1, minWidth: 0, display: 'block', accentColor: accent }
    }),
       /*#__PURE__*/React.createElement("span", { style: { flexShrink: 0 } }, dur ? clock(dur) : '\u2014')),

    /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 9, marginTop: 5 }
    }, btn('Back 15 seconds', '\u21ba15', () => this.audioSkip(-15)),
       btn(playing ? 'Pause' : 'Play', playing ? '\u2016' : '\u25b6', this.audioToggle, true),
       btn('Stop', '\u25a0', this.audioStop),
       btn('Forward 15 seconds', '15\u21bb', () => this.audioSkip(15))),

    /* Named speeds rather than a button that cycles through them: a reader
       following the Arabic wants to pick a pace and see that they have it, not
       tap four times to get back to the one they started from.

       They keep a row to themselves. Sharing one with the transport left each
       pill 26px wide, which neither holds "0.75\u00d7" nor gives a thumb anything to
       aim at \u2014 the row of height that buys is not worth either. */
    React.createElement("div", {
      role: "radiogroup",
      "aria-label": "Playback speed",
      style: { display: 'flex', alignItems: 'stretch', gap: 5, marginTop: 6 }
    }, AUDIO_RATES.map(v => {
      const on = Math.abs((st.audioRate || 1) - v) < 0.01;
      return React.createElement("div", {
        key: v,
        onClick: () => this.setAudioRate(v),
        role: "radio",
        "aria-checked": on ? 'true' : 'false',
        "aria-label": v + ' times speed',
        style: {
          flex: 1, minWidth: 0, height: 36, borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: `1px solid ${on ? accent : rd.border}`,
          background: on ? accent : rd.surf,
          color: on ? inkOn(accent) : rd.muted,
          fontSize: 11.5, fontWeight: 700, cursor: 'pointer',
          fontVariantNumeric: 'tabular-nums'
        }
      }, (v === 1 ? '1' : String(v)) + '\u00d7');
    })));
  }

  /* ── CLASSIFIEDS ── */
  renderClassifieds(st) {
    const allLabel = this.t('class.all');
    const cats = [allLabel, 'Food', 'Butcher', 'Travel', 'Education', 'Services'];
    const q = st.classQuery.trim().toLowerCase();
    const shown = st.liveClassifieds.filter(c => c.name !== 'SoftEire Technology Limited').filter(c => st.classCat === allLabel || st.classCat === 'All' || c.cat === st.classCat).filter(c => !q || c.name.toLowerCase().includes(q) || c.desc.toLowerCase().includes(q));
    /* Sponsors sit under the pinned tile, in two passes rather than a comparator
       so each group keeps the order the admin put it in. A sponsor is only ahead
       while its ad is actually running: the day the booking ends it takes its
       place back in the list, with no second thing for anyone to remember to
       switch off. */
    const sponsors = sponsoredNames(st.liveAds);
    const isSponsored = c => sponsors.has(sponsorKey(c.name));
    const cards = [PINNED_CLASSIFIED, ...shown.filter(isSponsored), ...shown.filter(c => !isSponsored(c))];
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
        color: NEU.head,
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
    }, icon('search', { size: 17, stroke: NEU.muted }), /*#__PURE__*/React.createElement("input", {
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
        color: NEU.ink2,
        width: '100%',
        // the field is the target, not just the well drawn around it
        padding: '12px 0',
        minHeight: 44,
        boxSizing: 'border-box'
      }
    }), st.classQuery && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({
        classQuery: ''
      }),
      style: {
        color: NEU.muted,
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
    }, isSponsored(b) && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        marginBottom: 11,
        padding: '4px 9px 4px 7px',
        borderRadius: 7,
        background: 'linear-gradient(120deg,#f2e4bd,#e8d39a)',
        border: '1px solid #dcc588',
        color: '#6d5312',
        fontSize: 9.5,
        letterSpacing: 1,
        textTransform: 'uppercase',
        fontWeight: 800
      }
    }, icon('star', { size: 11, fill: '#6d5312', stroke: '#6d5312', style: { flexShrink: 0 } }), 'Sponsored'),
    /*#__PURE__*/React.createElement("div", {
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
        /* A logo is given a plain light ground rather than the category tint:
           most arrive as a PNG cut out on white, and a coloured square behind one
           reads as a mistake. The lettered tile keeps the tint. */
        background: b.logo ? '#fffdf9' : b.tint,
        border: b.logo ? '1px solid rgba(203,195,178,.7)' : 'none',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Spectral,serif',
        fontSize: 22,
        fontWeight: 600,
        color: b.ink
      }
    }, b.logo ? /*#__PURE__*/React.createElement("img", {
      src: b.logo,
      alt: "",
      loading: "lazy",
      /* contain, not cover: a logo cropped to a square is a logo with its name
         cut off. The empty name is deliberate — the business name is read out
         immediately beside it, and repeating it helps nobody. */
      style: { width: '100%', height: '100%', objectFit: 'contain', padding: 4, boxSizing: 'border-box' }
    }) : b.name[0]), /*#__PURE__*/React.createElement("div", {
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
        color: NEU.ink
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
        color: NEU.muted,
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
        color: NEU.ink2
      }
    }, icon('phone', { size: 15 }), this.t('class.call'))), b.web && /*#__PURE__*/React.createElement("a", {
      href: b.web,
      target: "_blank",
      rel: "noopener noreferrer",
      // the only control on this card with no text in it: a screen reader would
      // otherwise read out the bare URL, or nothing at all
      "aria-label": `${b.name} website`,
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
    }, icon('globe', { size: 16, stroke: onSurf('#7d6220') })))))), cards.length === 0 && /*#__PURE__*/React.createElement("div", {
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
        color: NEU.muted,
        lineHeight: 1.5,
        padding: '18px 24px 0'
      }
    }, this.t('class.disclaimer')));
  }

  /* ── MORE ── */
  /* \u2500\u2500 PRAYER LOCATION \u2500\u2500
     A menu, the device, and a way back to the community default. Nothing
     here asks for permission until "Use my location" is pressed \u2014 opening the
     screen must not trigger a browser prompt. */
  renderLocation(st) {
    const loc = this.prayerLocation();
    const src = this.prayerSource();
    const isHome = loc.id === ABI_HOME.id;
    /* Forty-three towns as forty-three cards was a screen you scrolled rather
       than a choice you made, and it needed a search field of its own to be
       usable at all. One menu replaces both: the phone draws the list, and a
       phone already knows how to scroll and type into its own menus.
       Alphabetical, because a menu is scanned by name — the source order runs by
       size, which tells you nothing when you are looking for Tuam. */
    const towns = IE_LOCATIONS.filter(l => l.id !== ABI_HOME.id)
      .slice().sort((a, b) => a.name.localeCompare(b.name));
    const ERR = {
      offline: 'No connection, so the timetable could not be refreshed.',
      api: 'The prayer-time service is not responding.',
      bad: 'The prayer-time service returned an incomplete timetable.'
    };
    const dateLabel = d => {
      if (!d) return '';
      const [y, m, dd] = d.split('-').map(Number);
      return new Date(y, m - 1, dd).toLocaleDateString('en-IE', { day: 'numeric', month: 'short', year: 'numeric' });
    };
    /* One banner, saying exactly what the times on screen are. A wrong town shown
       quietly would be worse than no times at all. */
    const status = src.kind === 'live' ? { tone: '#1f5145', bg: '#e4efe9', mark: 'check', text: `Live timetable for ${loc.name}, updated today.` } : src.kind === 'cached' ? { tone: '#7d6220', bg: '#f5eeda', mark: 'info', text: `Showing the last timetable saved for ${loc.name}, from ${dateLabel(src.date)}.` } : src.kind === 'preset' ? { tone: '#1f5145', bg: '#e4efe9', mark: 'info', text: "Showing the centre's own published timetable for Dublin." } : { tone: '#6e2230', bg: '#f5e7e9', mark: 'alert', text: `No timetable loaded for ${loc.name} yet \u2014 the times shown are Dublin's community timetable, not ${loc.name}'s.` };
    const townLabel = l => `${l.name} \u00b7 ${l.region}`;
    return /*#__PURE__*/React.createElement("div", {
      style: { padding: '8px 20px 100px' },
      className: "afu"
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => this.go('more'),
      style: {
        display: 'inline-flex', alignItems: 'center', gap: 4, color: onSurf('#1f5145'),
        fontSize: 14, fontWeight: 600, cursor: 'pointer', padding: '12px 10px',
        margin: '0 -10px', minHeight: 44, boxSizing: 'border-box'
      }
    }, /*#__PURE__*/React.createElement("span", { style: { fontSize: 18 } }, "\u2039"), " More"),
    /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif', fontSize: 26, fontWeight: 600,
        color: NEU.head, margin: '10px 0 4px'
      }
    }, "Prayer Location"), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 13, color: NEU.muted, marginBottom: 16 }
    }, "Prayer times are calculated for the town you choose."),
    /*#__PURE__*/React.createElement("div", {
      style: { ...neuCard(18, 1), padding: '15px 16px', marginBottom: 12 }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10, letterSpacing: 1.1, textTransform: 'uppercase',
        fontWeight: 800, color: onSurf('#1f5145')
      }
    }, "Current location"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex', alignItems: 'center', gap: 10, marginTop: 7
      }
    }, icon('map-pin', { size: 19, stroke: onSurf('#1f5145') }), /*#__PURE__*/React.createElement("div", {
      style: { flex: 1, minWidth: 0 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontFamily: 'Spectral,serif', fontSize: 21, fontWeight: 600, color: NEU.ink, lineHeight: 1.15 }
    }, loc.name), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 12, color: NEU.muted, marginTop: 2 }
    }, loc.outside ? `${loc.region} \u00b7 outside Ireland` : loc.region + (isHome ? ' \u00b7 community default' : '')))),
    /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex', gap: 9, alignItems: 'flex-start', marginTop: 12,
        padding: '10px 12px', borderRadius: 12, background: status.bg
      }
    }, icon(status.mark === 'check' ? 'check' : status.mark === 'alert' ? 'triangle-alert' : 'info', {
      size: 15, stroke: status.tone, style: { flexShrink: 0, marginTop: 1 }
    }), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 12, color: status.tone, lineHeight: 1.45, fontWeight: 600 }
    }, status.text)), st.autoTimesErr && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex', alignItems: 'center', gap: 10, marginTop: 9,
        fontSize: 12, color: NEU.muted, lineHeight: 1.45
      }
    }, /*#__PURE__*/React.createElement("span", { style: { flex: 1 } }, ERR[st.autoTimesErr] || 'The timetable could not be refreshed.'), /*#__PURE__*/React.createElement("div", {
      onClick: () => { this._autoTimesLastTry = 0; this.fetchAutoTimes(true).then(ok => this.showToast(ok ? 'Timetable updated' : 'Still could not reach the service')); },
      style: {
        flexShrink: 0, padding: '11px 13px', borderRadius: 11, cursor: 'pointer',
        border: '1.5px solid rgba(31,81,69,.35)', color: onSurf('#1f5145'),
        fontSize: 12.5, fontWeight: 700, minHeight: 44, display: 'flex', alignItems: 'center'
      }
    }, st.autoTimesBusy ? 'Trying\u2026' : 'Try again')), !isHome && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setPrayerLocation(null),
      style: {
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        marginTop: 12, padding: '12px', borderRadius: 12, cursor: 'pointer',
        border: '1.5px solid rgba(31,81,69,.35)', color: onSurf('#1f5145'),
        fontSize: 13, fontWeight: 700, minHeight: 44
      }
    }, icon('rotate-ccw', { size: 15 }), "Reset to Dublin, the community default")),
    /*#__PURE__*/React.createElement("div", {
      onClick: this.useDeviceLocation,
      className: "neu-press",
      style: {
        ...neuCard(16, .9), padding: '14px 15px', cursor: 'pointer', marginBottom: 16,
        display: 'flex', alignItems: 'center', gap: 12, minHeight: 44
      }
    }, icon('locate-fixed', { size: 19, stroke: onSurf('#1f5145'), style: { flexShrink: 0 } }), /*#__PURE__*/React.createElement("div", {
      style: { flex: 1, minWidth: 0 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 14.5, fontWeight: 700, color: NEU.ink }
    }, st.locBusy ? "Finding you\u2026" : "Use my location"), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 11.5, color: NEU.muted, marginTop: 1, lineHeight: 1.4 }
    }, "Your device will ask permission first. Refusing is fine \u2014 pick a town from the menu below instead.")),
    /*#__PURE__*/React.createElement("span", { "aria-hidden": "true", style: { color: NEU.muted, fontSize: 18 } }, "\u203a")),
    /*#__PURE__*/React.createElement("div", {
      style: { ...neuCard(16, .9), padding: '13px 15px' }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10, letterSpacing: 1.1, textTransform: 'uppercase',
        fontWeight: 800, color: NEU.muted, marginBottom: 9
      }
    }, "Choose a town"), /*#__PURE__*/React.createElement("div", {
      style: { position: 'relative' }
    }, /*#__PURE__*/React.createElement("select", {
      value: loc.id,
      onChange: e => {
        const pick = IE_LOCATIONS.find(l => l.id === e.target.value);
        if (pick) this.setPrayerLocation(pick);
      },
      "aria-label": "Prayer location",
      style: {
        width: '100%', boxSizing: 'border-box', minHeight: 48,
        appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
        padding: '13px 36px 13px 14px', borderRadius: 12,
        border: NEU.edge, background: NEU.sunk, boxShadow: neuIn(.3),
        fontSize: 14.5, fontWeight: 600, fontFamily: 'inherit',
        color: NEU.ink, cursor: 'pointer',
        // the option list is drawn by the OS, and without this it comes up
        // black-on-white while the app is in dark mode
        colorScheme: st.dark ? 'dark' : 'light'
      }
      /* A device fix is not one of the towns, so it is only in the menu while it
         is the selection \u2014 without it the select has no option matching its own
         value, and every browser answers that by showing the first one, which
         would put Dublin's name over Cork's times. */
    }, loc.device && /*#__PURE__*/React.createElement("option", {
      key: 'device',
      value: 'device'
    }, townLabel(loc)), /*#__PURE__*/React.createElement("option", {
      key: ABI_HOME.id,
      value: ABI_HOME.id
    }, `${ABI_HOME.name} \u00b7 community default`), /*#__PURE__*/React.createElement("optgroup", {
      key: 'towns',
      label: "Cities and towns"
    }, towns.map(l => /*#__PURE__*/React.createElement("option", {
      key: l.id,
      value: l.id
    }, townLabel(l))))), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        position: 'absolute', right: 14, top: '50%', marginTop: -6,
        color: NEU.muted, fontSize: 12, lineHeight: 1, pointerEvents: 'none'
      }
    }, "\u25be")), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 11.5, color: NEU.muted, marginTop: 9, lineHeight: 1.5 }
    }, "The menu covers the island's main towns. If yours is not there, choose the nearest one \u2014 a few kilometres makes no difference to a prayer time.")),
    /*#__PURE__*/React.createElement("div", {
      style: { ...neuWell(16, .7), padding: '15px 16px', marginTop: 20 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }
    }, icon('info', { size: 15, stroke: NEU.muted }), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10, letterSpacing: 1.1, textTransform: 'uppercase',
        fontWeight: 800, color: NEU.muted
      }
    }, "How these times are worked out")), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 12.5, color: NEU.ink, lineHeight: 1.6 }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, PRAYER_METHOD.name), " \u00b7 ", PRAYER_METHOD.detail), /*#__PURE__*/React.createElement("div", {
      style: { color: NEU.muted, marginTop: 5 }
    }, "Sunset (ghur\u016bb) and Maghrib are calculated and shown separately, as this community observes them."), /*#__PURE__*/React.createElement("div", {
      style: { color: NEU.muted, marginTop: 5 }
    }, "Source: ", PRAYER_METHOD.source, ". Dublin also carries the centre's own published timetable, used when no calculation has been fetched."), src.date && /*#__PURE__*/React.createElement("div", {
      style: { color: NEU.muted, marginTop: 5 }
    }, "Last retrieved: ", dateLabel(src.date), " for ", loc.name, ".")), this.renderTimeReport(st, loc)));
  }

  /* ── REPORT AN INCORRECT TIME ──
     Collapsed until asked for, because most people will never need it. Three
     fields, none of them about the person sending it. */
  renderTimeReport(st, loc) {
    const rs = st.reportState || {};
    const prayers = ['Fajr', 'Sunrise', 'Dhuhr', 'Sunset', 'Maghrib', 'Midnight'];
    const shown = (this.getActivePrayers().find(p => p.name === st.reportPrayer) || {}).time || '\u2014';
    if (!st.reportOpen) {
      return /*#__PURE__*/React.createElement("div", {
        onClick: () => this.setState({ reportOpen: true, reportState: null }),
        className: "neu-press",
        style: {
          ...neuCard(14, .75), marginTop: 14, padding: '13px 15px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', gap: 10, minHeight: 44
        }
      }, icon('triangle-alert', { size: 16, stroke: onSurf('#7d6220'), style: { flexShrink: 0 } }), /*#__PURE__*/React.createElement("div", {
        style: { flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: 600, color: NEU.ink }
      }, "Report an incorrect time"), /*#__PURE__*/React.createElement("span", {
        "aria-hidden": "true", style: { color: NEU.muted, fontSize: 18, flexShrink: 0 }
      }, "\u203a"));
    }
    const field = { ...neuWell(12, .7), width: '100%', boxSizing: 'border-box', padding: '12px 13px', border: NEU.edge, outline: 'none', fontSize: 14, color: NEU.ink, minHeight: 44, fontFamily: 'inherit' };
    const label = t => /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 12, fontWeight: 700, color: NEU.ink, margin: '12px 0 5px' }
    }, t);
    return /*#__PURE__*/React.createElement("div", {
      style: { ...neuCard(16, .9), marginTop: 14, padding: '16px 16px 18px' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'flex-start', gap: 10 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { flex: 1, minWidth: 0 }
    }, /*#__PURE__*/React.createElement("h3", {
      style: { fontFamily: 'Spectral,serif', fontSize: 17, fontWeight: 600, color: NEU.ink, margin: 0 }
    }, "Report an incorrect time"), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 12, color: NEU.muted, marginTop: 3, lineHeight: 1.5 }
    }, "For ", loc.name, ". No account and no contact details \u2014 we only need the time.")), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({ reportOpen: false, reportState: null }),
      "aria-label": "Close the report form",
      style: {
        flexShrink: 0, width: 44, height: 44, margin: '-10px -10px 0 0', display: 'flex',
        alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
        color: NEU.muted, fontSize: 22, lineHeight: 1
      }
    }, "\u00d7")),
    label('Which prayer?'),
    /*#__PURE__*/React.createElement("div", {
      style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 7 }
    }, prayers.map(p => /*#__PURE__*/React.createElement("div", {
      key: p,
      onClick: () => this.setState({ reportPrayer: p, reportState: null }),
      role: "button",
      "aria-pressed": st.reportPrayer === p ? 'true' : 'false',
      style: {
        textAlign: 'center', padding: '11px 3px', borderRadius: 11, cursor: 'pointer',
        fontSize: 12.5, fontWeight: st.reportPrayer === p ? 800 : 600,
        color: st.reportPrayer === p ? NEU.accent : NEU.muted,
        background: NEU.surf, border: NEU.edge,
        boxShadow: st.reportPrayer === p ? neuIn(.5) : neuUp(.5),
        minHeight: 44, display: 'flex', alignItems: 'center', justifyContent: 'center'
      }
    }, p))),
    /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 12, color: NEU.muted, marginTop: 8 }
    }, "The app is currently showing ", /*#__PURE__*/React.createElement("strong", { style: { color: NEU.ink } }, shown), " for ", st.reportPrayer, "."),
    label('What should it be? (optional)'),
    /*#__PURE__*/React.createElement("input", {
      value: st.reportExpected,
      onChange: e => this.setState({ reportExpected: e.target.value.slice(0, 5), reportState: null }),
      placeholder: "HH:MM, e.g. 05:12",
      inputMode: "numeric",
      maxLength: 5,
      "aria-label": "The correct time, as HH:MM",
      style: field
    }),
    label('Anything else? (optional)'),
    /*#__PURE__*/React.createElement("textarea", {
      value: st.reportNote,
      onChange: e => this.setState({ reportNote: e.target.value.slice(0, 500), reportState: null }),
      rows: 3,
      maxLength: 500,
      placeholder: "For example: this is a few minutes out all week.",
      "aria-label": "A short note about what is wrong",
      dir: "auto",
      style: { ...field, resize: 'vertical', lineHeight: 1.5 }
    }),
    /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 11, color: NEU.muted, marginTop: 4, textAlign: 'right', fontVariantNumeric: 'tabular-nums' }
    }, st.reportNote.length, "/500"),
    /*#__PURE__*/React.createElement("div", {
      onClick: rs.kind === 'sending' ? undefined : this.submitTimeReport,
      style: {
        marginTop: 12, padding: '13px 0', borderRadius: 12, textAlign: 'center',
        background: NEU.accent, color: '#f3ead4', fontSize: 14, fontWeight: 800,
        cursor: rs.kind === 'sending' ? 'default' : 'pointer', opacity: rs.kind === 'sending' ? .6 : 1,
        minHeight: 44
      }
    }, rs.kind === 'sending' ? 'Sending\u2026' : 'Send report'),
    /* One live region for both outcomes, so a screen reader hears the result
       without the focus having to move. */
    /*#__PURE__*/React.createElement("div", {
      role: "status",
      "aria-live": "polite",
      style: {
        fontSize: 12.5, lineHeight: 1.5, marginTop: rs.kind ? 10 : 0, fontWeight: 600,
        color: rs.kind === 'sent' ? NEU.accent : '#6e2230'
      }
    }, rs.kind === 'sent' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", { "aria-hidden": "true" }, "\u2713 "), 'Thank you \u2014 this has been sent to the administrators.') : rs.kind === 'error' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", { "aria-hidden": "true" }, "\u26a0 "), rs.message) : ''),
    /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 11, color: NEU.muted, marginTop: 12, lineHeight: 1.55 }
    }, "Sent with the town, the prayer and the date only. No name, email or phone number is collected."));
  }

  /* ── SCREEN HEAD ──
     Every one of these secondary screens opens the same way: what section this
     is, then what it is called, then the administrator's way in. Written once
     so a new section cannot arrive with its title set two pixels off. Named
     screenHead, not sectionHead: renderHome already has a local by that name. */
  screenHead(st, kicker, title, adminSection) {
    return React.createElement("div", {
      style: { display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, padding: '8px 0 16px' }
    }, React.createElement("div", null, React.createElement("div", {
      style: { fontSize: 13, color: st.dark ? '#8e9490' : NEU.muted, fontWeight: 500 }
    }, kicker), React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif', fontSize: 26, fontWeight: 600,
        color: st.dark ? '#ece6d8' : '#27241f', marginTop: 2, lineHeight: 1.15
      }
    }, title)), st.adminLoggedIn && adminSection && React.createElement("div", {
      onClick: () => this.setState({ screen: 'admin', adminSection, adminEditIdx: null, adminEditDraft: {} }),
      style: {
        flexShrink: 0, fontSize: 12, fontWeight: 700, color: onSurf('#1f5145'),
        cursor: 'pointer', background: '#e6efe9', borderRadius: R.chip, padding: '8px 13px'
      }
    }, 'Edit'));
  }

  /* ── THE FOURTEEN INFALLIBLES ──
     A list that opens into one life at a time. The list carries only what tells
     them apart at a glance — the ordinal, the name and the two dates — because
     fourteen cards each showing a paragraph is a wall, not a list. */
  renderInfallibles(st) {
    const list = st.liveInfallibles || INFALLIBLES;
    const open = st.infOpen !== null && st.infOpen !== undefined ? list[st.infOpen] : null;
    const HON = { 's': 'ṣallā Allāhu ʿalayhi wa-ālih', 'a': 'ʿalayhi al-salām', 'aj': 'ʿajjala Allāhu farajah' };
    const HON_SHORT = { 's': '(ṣ)', 'a': '(ʿa)', 'aj': '(ʿaj)' };
    if (open) {
      return React.createElement("div", { style: { padding: '8px 20px 100px' }, className: "afu" },
        React.createElement("div", {
          onClick: () => this.setState({ infOpen: null }),
          style: {
            display: 'inline-flex', alignItems: 'center', gap: 7, minHeight: 44,
            margin: '0 0 6px -6px', padding: '0 6px', cursor: 'pointer',
            fontSize: 13.5, fontWeight: 600, color: NEU.muted
          }
        }, '‹ ', 'All fourteen'),
        React.createElement("div", { style: { ...neuCard(R.card), padding: '18px 18px 20px' } },
          React.createElement("div", {
            style: {
              fontSize: 10.5, letterSpacing: 1, textTransform: 'uppercase',
              fontWeight: 800, color: onSurf('#6e2230')
            }
          }, open.role || ''),
          React.createElement("div", {
            style: {
              fontFamily: 'Spectral,serif', fontSize: 24, fontWeight: 600,
              color: NEU.head, marginTop: 4, lineHeight: 1.2
            }
          }, open.name, open.hon ? ' ' + (HON_SHORT[open.hon] || '') : ''),
          open.hon && HON[open.hon] && React.createElement("div", {
            style: { fontSize: 11.5, color: NEU.faint, marginTop: 3, fontStyle: 'italic' }
          }, HON[open.hon]),
          React.createElement("div", {
            style: { display: 'flex', flexDirection: 'column', gap: 1, margin: '15px 0 4px' }
          }, [['Born', open.born], ['Passed', open.died], ['Resting place', open.rest]]
            .filter(([, v]) => v && v !== '—').map(([label, value]) => React.createElement("div", {
              key: label,
              style: { display: 'flex', gap: 10, alignItems: 'baseline', padding: '6px 0', borderTop: NEU.rule }
            }, React.createElement("div", {
              style: { flexShrink: 0, width: 92, fontSize: 11, fontWeight: 700, color: NEU.muted, textTransform: 'uppercase', letterSpacing: .6 }
            }, label), React.createElement("div", {
              style: { fontSize: 13.5, color: NEU.ink, lineHeight: 1.45 }
            }, value)))),
          React.createElement("div", {
            style: { fontSize: 14.5, color: NEU.ink2, lineHeight: 1.72, marginTop: 14, whiteSpace: 'pre-wrap' }
          }, open.bio || '')),
        React.createElement("div", {
          style: { display: 'flex', gap: 8, marginTop: 14 }
        }, [['‹ Previous', st.infOpen - 1], ['Next ›', st.infOpen + 1]]
          .filter(([, i]) => i >= 0 && i < list.length).map(([label, i]) => React.createElement("div", {
            key: label,
            onClick: () => { this.setState({ infOpen: i }); const m = document.getElementById('abi-main'); if (m) m.scrollTop = 0; },
            className: "neu-press",
            style: {
              ...neuCard(R.pill, .7), flex: 1, minHeight: 44, display: 'flex',
              alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              fontSize: 13, fontWeight: 600, color: NEU.ink
            }
          }, label))));
    }
    return React.createElement("div", { style: { padding: '8px 20px 100px' }, className: "afu" },
      this.screenHead(st, 'Community', 'Fourteen Infallibles', 'infallibles'),
      React.createElement("div", {
        style: { fontSize: 13, color: NEU.muted, lineHeight: 1.6, marginBottom: 16 }
      }, 'The Prophet, his daughter, and the twelve Imams — peace be upon them all.'),
      list.length === 0 ? React.createElement("div", {
        style: { ...neuWell(R.card), padding: '30px 20px', textAlign: 'center', fontSize: 14, color: NEU.muted }
      }, 'Nothing here yet.') : React.createElement("div", null, list.map((p, i) => React.createElement("div", {
        key: i,
        onClick: () => { this.setState({ infOpen: i }); const m = document.getElementById('abi-main'); if (m) m.scrollTop = 0; },
        className: "neu-press",
        style: {
          ...neuCard(R.tile, .85), display: 'flex', alignItems: 'center', gap: 13,
          padding: '12px 14px', marginBottom: 9, cursor: 'pointer', minHeight: 44
        }
      }, React.createElement("span", {
        "aria-hidden": "true",
        style: {
          flexShrink: 0, width: 34, height: 34, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12.5, fontWeight: 800, color: '#f5e7e9', ...neuDisc('#6e2230')
        }
      }, i + 1), React.createElement("div", { style: { flex: 1, minWidth: 0 } },
        React.createElement("div", {
          style: {
            fontFamily: 'Spectral,serif', fontSize: 15, fontWeight: 600, color: NEU.ink,
            lineHeight: 1.25, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }
        }, p.name, p.hon ? ' ' + (HON_SHORT[p.hon] || '') : ''),
        React.createElement("div", {
          style: {
            fontSize: 11.5, color: NEU.muted, marginTop: 2, lineHeight: 1.35,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }
        }, p.role || '')), React.createElement("span", {
        "aria-hidden": "true",
        style: { flexShrink: 0, fontSize: 20, color: onSurf('#6e2230'), opacity: .7 }
      }, '›')))));
  }

  /* ── MOSQUE FINDER ──
     Ships empty on purpose. The addresses of real places of worship are not
     something to guess at, so the list is the administrators' to fill and the
     empty state says so rather than pretending to be loading. */
  renderMosques(st) {
    const list = st.liveMosques || MOSQUES;
    const q = (st.mosqueQuery || '').trim().toLowerCase();
    const shown = !q ? list : list.filter(m =>
      [m.name, m.address, m.city, m.county].filter(Boolean).join(' ').toLowerCase().includes(q));
    const chip = (label, href) => href && React.createElement("a", {
      key: label, href, target: '_blank', rel: 'noopener noreferrer',
      style: {
        display: 'inline-flex', alignItems: 'center', minHeight: 40, padding: '9px 13px',
        borderRadius: R.chip, background: '#e6efe9', color: onSurf('#1f5145'),
        fontSize: 12.5, fontWeight: 700, textDecoration: 'none'
      }
    }, label);
    return React.createElement("div", { style: { padding: '8px 20px 100px' }, className: "afu" },
      this.screenHead(st, 'Community', 'Mosque Finder', 'mosques'),
      list.length > 0 && React.createElement("input", {
        value: st.mosqueQuery || '',
        onChange: e => this.setState({ mosqueQuery: e.target.value }),
        placeholder: 'Search by name, town or county',
        "aria-label": 'Search mosques',
        style: {
          ...neuWell(R.pill, .7), width: '100%', padding: '12px 14px', fontSize: 14,
          color: NEU.ink, outline: 'none', marginBottom: 14, minHeight: 44, boxSizing: 'border-box'
        }
      }),
      shown.length === 0 ? React.createElement("div", {
        style: { ...neuWell(R.card), padding: '30px 22px', textAlign: 'center' }
      }, React.createElement("div", {
        style: { fontSize: 14.5, color: NEU.ink2, lineHeight: 1.6 }
      }, list.length === 0 ? 'No mosques listed yet.' : 'Nothing matches that search.'),
        list.length === 0 && React.createElement("div", {
          style: { fontSize: 12.5, color: NEU.muted, lineHeight: 1.6, marginTop: 7 }
        }, 'An administrator can add them from the admin panel.')) :
      shown.map((m, i) => React.createElement("div", {
        key: i,
        style: { ...neuCard(R.tile, .85), padding: '14px 15px 13px', marginBottom: 10 }
      }, React.createElement("div", {
        style: { fontFamily: 'Spectral,serif', fontSize: 16.5, fontWeight: 600, color: NEU.ink, lineHeight: 1.25 }
      }, m.name || 'Mosque'),
        m.denom && React.createElement("div", {
          style: {
            display: 'inline-block', marginTop: 6, padding: '3px 9px', borderRadius: 7,
            background: '#f3e6e8', color: onSurf('#6e2230'),
            fontSize: 10, fontWeight: 800, letterSpacing: .6, textTransform: 'uppercase'
          }
        }, m.denom),
        React.createElement("div", {
          style: { fontSize: 13, color: NEU.ink2, lineHeight: 1.55, marginTop: 7, whiteSpace: 'pre-wrap' }
        }, [m.address, [m.city, m.county].filter(Boolean).join(', ')].filter(Boolean).join('\n')),
        m.note && React.createElement("div", {
          style: { fontSize: 12, color: NEU.muted, lineHeight: 1.55, marginTop: 6 }
        }, m.note),
        React.createElement("div", {
          style: { display: 'flex', flexWrap: 'wrap', gap: 7, marginTop: 11 }
        }, [chip('Directions', m.map || (m.address ? 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent([m.name, m.address, m.city, m.county, 'Ireland'].filter(Boolean).join(', ')) : '')),
            chip('Call', m.phone ? 'tel:' + String(m.phone).replace(/\s+/g, '') : ''),
            chip('Website', m.web || '')].filter(Boolean)))));
  }

  /* ── REPORT AN ISSUE ──
     The category is a list rather than a free-text box because it is the field
     that decides who reads the report, and a typed one is a field nobody can
     sort by. Contact is optional and labelled as optional: most reports do not
     need a reply, and asking for an address you will not use is collecting
     personal data for nothing. */
  renderReportIssue(st) {
    const rs = st.issueState || {};
    const busy = rs.kind === 'sending';
    const sent = rs.kind === 'sent';
    const label = t => React.createElement("div", {
      style: { fontSize: 11, letterSpacing: .8, textTransform: 'uppercase', fontWeight: 800, color: NEU.muted, marginBottom: 7 }
    }, t);
    return React.createElement("div", { style: { padding: '8px 20px 100px' }, className: "afu" },
      this.screenHead(st, 'More', 'Report an issue', null),
      React.createElement("div", {
        style: { fontSize: 13, color: NEU.muted, lineHeight: 1.6, marginBottom: 18 }
      }, 'Something wrong, or something you would like to see? This goes straight to the administrators.'),
      sent ? React.createElement("div", {
        style: { ...neuCard(R.card), padding: '26px 22px', textAlign: 'center' }
      }, React.createElement("div", { style: { fontSize: 30, marginBottom: 8 }, "aria-hidden": "true" }, '✓'),
        React.createElement("div", {
          style: { fontFamily: 'Spectral,serif', fontSize: 18, fontWeight: 600, color: NEU.head }
        }, 'Thank you'),
        React.createElement("div", {
          style: { fontSize: 13.5, color: NEU.ink2, lineHeight: 1.6, marginTop: 7 }
        }, 'Your report has been sent to the administrators.'),
        React.createElement("div", {
          onClick: () => this.setState({ issueState: null, issueCat: '', issueMsg: '', issueContact: '' }),
          className: "neu-press",
          style: {
            ...neuCard(R.pill, .7), marginTop: 18, minHeight: 44, display: 'flex',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            fontSize: 13.5, fontWeight: 600, color: NEU.ink
          }
        }, 'Send another')) :
      React.createElement("div", { style: { ...neuCard(R.card), padding: '17px 16px 18px' } },
        label('What is it about?'),
        React.createElement("div", { style: { position: 'relative', marginBottom: 15 } },
          React.createElement("select", {
            value: st.issueCat || '',
            onChange: e => this.setState({ issueCat: e.target.value, issueState: null }),
            "aria-label": 'Issue category',
            style: {
              ...neuWell(R.pill, .7), width: '100%', minHeight: 46, padding: '12px 38px 12px 14px',
              fontSize: 14, color: st.issueCat ? NEU.ink : NEU.faint, outline: 'none',
              appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
              colorScheme: st.dark ? 'dark' : 'light', cursor: 'pointer', boxSizing: 'border-box'
            }
          }, React.createElement("option", { value: '' }, 'Choose a category…'),
             ISSUE_CATS.map(c => React.createElement("option", { key: c, value: c }, c))),
          React.createElement("span", {
            "aria-hidden": "true",
            style: { position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', color: NEU.muted, fontSize: 12, pointerEvents: 'none' }
          }, '▾')),
        label('What happened?'),
        React.createElement("textarea", {
          value: st.issueMsg || '',
          onChange: e => this.setState({ issueMsg: e.target.value.slice(0, 2000), issueState: null }),
          placeholder: 'Describe the problem, or the suggestion, in your own words.',
          rows: 6,
          "aria-label": 'Your report',
          style: {
            ...neuWell(R.pill, .7), width: '100%', padding: '12px 14px', fontSize: 14,
            color: NEU.ink, outline: 'none', resize: 'vertical', lineHeight: 1.55,
            fontFamily: 'inherit', boxSizing: 'border-box', marginBottom: 4
          }
        }),
        React.createElement("div", {
          style: { fontSize: 11, color: NEU.faint, textAlign: 'right', marginBottom: 14 }
        }, (st.issueMsg || '').length + ' / 2000'),
        label('How to reach you — optional'),
        React.createElement("input", {
          value: st.issueContact || '',
          onChange: e => this.setState({ issueContact: e.target.value.slice(0, 120), issueState: null }),
          placeholder: 'Email or phone, only if you would like a reply',
          "aria-label": 'Your contact details, optional',
          style: {
            ...neuWell(R.pill, .7), width: '100%', padding: '12px 14px', fontSize: 14,
            color: NEU.ink, outline: 'none', minHeight: 44, boxSizing: 'border-box', marginBottom: 4
          }
        }),
        React.createElement("div", {
          style: { fontSize: 11, color: NEU.muted, lineHeight: 1.55, marginBottom: 16 }
        }, 'Leave this blank and the report is anonymous. Nothing else about you or your phone is sent.'),
        rs.kind === 'error' && React.createElement("div", {
          style: { fontSize: 12.5, fontWeight: 600, color: onSurf('#a03a3a'), lineHeight: 1.5, marginBottom: 12 }
        }, '⚠ ' + rs.message),
        React.createElement("div", {
          onClick: busy ? undefined : () => this.submitIssue(),
          className: busy ? undefined : "neu-press",
          style: {
            minHeight: 48, borderRadius: R.pill, display: 'flex', alignItems: 'center',
            justifyContent: 'center', cursor: busy ? 'default' : 'pointer',
            background: busy ? NEU.sunk : NEU.accent, color: busy ? NEU.muted : inkOn(NEU.accent),
            fontSize: 14.5, fontWeight: 700,
            boxShadow: busy ? 'none' : neuUpOn('31,81,69', .8)
          }
        }, busy ? 'Sending…' : 'Send report')));
  }

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
      label: 'Report an issue',
      sub: 'Tell the administrators what is wrong, or suggest something',
      glyph: '⚑',
      go: () => this.go('report')
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
    const ploc = this.prayerLocation();
    const psrc = this.prayerSource();
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
      onClick: () => this.go('location'),
      className: "neu-press",
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        ...neuCard(16, .9),
        padding: '15px 16px',
        marginBottom: 11,
        cursor: 'pointer',
        minHeight: 44
      }
    }, /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        flexShrink: 0,
        width: 40,
        height: 40,
        borderRadius: 12,
        background: 'linear-gradient(145deg,#1f5145e6,#1f5145)',
        color: '#e4efe9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 11px -6px #1f5145'
      }
    }, icon('map-pin', { size: 18 })), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: NEU.ink
      }
    }, "Prayer Location"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: psrc.kind === 'fallback' ? '#6e2230' : NEU.muted,
        marginTop: 1
      }
    }, `Current location: ${ploc.name}${ploc.outside ? '' : ', Ireland'}` + (psrc.kind === 'fallback' ? ' · no timetable yet' : ''))), /*#__PURE__*/React.createElement("span", {
      "aria-hidden": "true",
      style: {
        color: NEU.muted,
        fontSize: 20
      }
    }, "›")), /*#__PURE__*/React.createElement("div", {
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
        color: onSurf('#1f5145')
      }
    }, m.glyph), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 600,
        color: NEU.ink
      }
    }, m.label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 12,
        color: NEU.muted,
        marginTop: 1
      }
    }, m.sub)), /*#__PURE__*/React.createElement("span", {
      style: {
        color: NEU.muted,
        fontSize: 20
      }
    }, "›")))), (() => {
      /* The azan a person wants to hear is a setting, and this is where someone
         comes looking for one — it used to sit under a toggle inside the prayer
         screen, which is where you go to read times, not to change preferences.

         Thirteen switches meant thirteen rows of scrolling past a screen of
         near-identical names to answer a question with one answer, so the list
         is a menu. The menu says which adhan; the switch above it says whether
         any adhan sounds at all, which is the one thing a menu cannot say.

         Shown even when the shipped adhan is the only one. Hiding it until a
         second arrives means the first person to look for the setting concludes
         there isn't one — and nobody asks for an azan to be uploaded to a screen
         they have no reason to believe exists. */
      const sounds = adhanSounds(st.liveAzans, st.liveAzanOverrides);
      const chosen = sounds.find(x => x.key === st.adhanSound) || sounds[0];
      const on = st.adhanEnabled;
      const playing = st.adhanPreview === chosen.key;
      return [/*#__PURE__*/React.createElement("div", {
        key: 'azan-head',
        style: {
          fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase',
          fontWeight: 700, color: NEU.muted, marginBottom: 12, paddingLeft: 2
        }
      }, this.t('prayer.adhanSound')), /*#__PURE__*/React.createElement("div", {
        key: 'azan-card',
        style: {
          background: NEU.surf, boxShadow: neuUp(), border: NEU.edge,
          borderRadius: 16, padding: '6px 16px 4px', marginBottom: 24
        }
      }, /*#__PURE__*/React.createElement("div", {
        onClick: () => this.setAdhanEnabled(!on),
        role: "switch",
        "aria-checked": on ? 'true' : 'false',
        "aria-label": "Play the adhan",
        style: {
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '12px 0', minHeight: 48, boxSizing: 'border-box',
          borderBottom: NEU.rule, cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: { flex: 1, minWidth: 0 }
      }, /*#__PURE__*/React.createElement("div", {
        style: { fontSize: 14.5, color: NEU.ink2, fontWeight: 600 }
      }, "Play the adhan"), /*#__PURE__*/React.createElement("div", {
        style: { fontSize: 11.5, color: NEU.muted, marginTop: 1 }
      }, on ? "Sounds at each prayer time" : "Silent at prayer times")), /*#__PURE__*/React.createElement("div", {
        "aria-hidden": "true",
        style: {
          flexShrink: 0, width: 44, height: 26, borderRadius: 15,
          /* Same track as the Dark mode switch further down. The sunk token
             measured 1.06:1 against the card in light mode — an off switch you
             could only find by its inset shadow. */
          background: on ? onSurf('#1f5145') : st.dark ? '#3b4247' : '#d8d0bf',
          position: 'relative', transition: 'background .2s'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          position: 'absolute', top: 3, left: 3,
          transform: on ? 'translateX(18px)' : 'none',
          width: 20, height: 20, borderRadius: '50%', background: '#fff',
          boxShadow: '0 1px 3px rgba(0,0,0,.2)', transition: 'transform .2s ease'
        }
      }))), /*#__PURE__*/React.createElement("div", {
        style: { display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0 4px' }
      }, /*#__PURE__*/React.createElement("div", {
        style: { flex: 1, minWidth: 0, position: 'relative' }
      }, /*#__PURE__*/React.createElement("select", {
        value: chosen.key,
        onChange: e => this.setAdhanSound(e.target.value),
        "aria-label": this.t('prayer.adhanSound'),
        style: {
          width: '100%', boxSizing: 'border-box', minHeight: 48,
          appearance: 'none', WebkitAppearance: 'none', MozAppearance: 'none',
          padding: '13px 34px 13px 13px', borderRadius: 12,
          border: NEU.edge, background: NEU.sunk, boxShadow: neuIn(.3),
          fontSize: 14, fontWeight: 600, fontFamily: 'inherit',
          color: on ? NEU.ink : NEU.muted, cursor: 'pointer',
          // the option list is drawn by the OS, and without this it comes up
          // black-on-white while the app is in dark mode
          colorScheme: st.dark ? 'dark' : 'light'
        }
      }, sounds.map(snd => /*#__PURE__*/React.createElement("option", {
        key: snd.key,
        value: snd.key
      }, snd.label))), /*#__PURE__*/React.createElement("span", {
        "aria-hidden": "true",
        style: {
          position: 'absolute', right: 13, top: '50%', marginTop: -6,
          color: NEU.muted, fontSize: 12, lineHeight: 1, pointerEvents: 'none'
        }
      }, "▾")), /*#__PURE__*/React.createElement("div", {
        onClick: () => this.previewAdhan(chosen),
        role: "button",
        "aria-label": (playing ? 'Stop ' : 'Preview ') + chosen.label,
        style: {
          flexShrink: 0, width: 48, height: 48, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: NEU.edge, background: NEU.sunk, boxShadow: neuUp(.4),
          color: onSurf('#1f5145'), fontSize: 13, cursor: 'pointer'
        }
      }, playing ? '■' : '▶')), /*#__PURE__*/React.createElement("div", {
        style: { fontSize: 11.5, color: NEU.muted, padding: '0 0 12px' }
      }, chosen.sub))];
    })(), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: NEU.muted,
        marginBottom: 12,
        paddingLeft: 2
      }
    }, this.t('more.language')),/*#__PURE__*/React.createElement("div", {
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
        color: st.lang === l ? onSurf('#1f5145') : NEU.ink2,
        fontWeight: st.lang === l ? 700 : 400
      }
    }, l), st.lang === l && icon('check', { size: 18, stroke: NEU.accent, sw: 2.4 })))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: 1.2,
        textTransform: 'uppercase',
        fontWeight: 700,
        color: NEU.muted,
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
        color: NEU.ink2
      }
    }, this.t('more.dark')), /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setDark(!st.dark),
      role: "switch",
      "aria-checked": st.dark ? 'true' : 'false',
      "aria-label": this.t('more.dark'),
      // padding is the tap target, the child is the switch — see the adhan one
      style: {
        padding: '8px 0',
        margin: '-8px 0',
        cursor: 'pointer',
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 48,
        height: 28,
        borderRadius: 16,
        background: st.dark ? '#1f5145' : '#d8d0bf',
        position: 'relative',
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
    })))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '13px 0'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 14.5,
        color: NEU.ink2
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
        color: NEU.ink2,
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
        color: NEU.ink2,
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
        color: NEU.ink
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
        color: NEU.muted,
        fontSize: 18
      }
    }, "\u203a")), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        fontSize: 11.5,
        color: NEU.muted,
        marginTop: 26,
        lineHeight: 1.6
      }
    }, "For support please email us at ", /*#__PURE__*/React.createElement("a", {
      href: "mailto:info@softeire.com",
      style: {
        color: onSurf('#1f5145'),
        fontWeight: 600,
        textDecoration: 'underline',
        textDecorationColor: 'rgba(31,81,69,.3)'
      }
    }, "info@softeire.com"), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-block',
        marginTop: 10
      }
    }, "Ahlul Bayt Ireland · V1.5"), /*#__PURE__*/React.createElement("br", null), "Built for the community, by ", /*#__PURE__*/React.createElement("a", {
      href: "https://www.softeire.com",
      target: "_blank",
      rel: "noopener noreferrer",
      style: {
        color: onSurf('#1f5145'),
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
        color: onSurf('#1f5145'),
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
        color: NEU.head,
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
        color: NEU.muted,
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
        color: onSurf('#1f5145'),
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
        color: onSurf('#1f5145'),
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
        background: NEU.sunk,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 22
      }
    }, icon('wifi-off', { size: 34, stroke: NEU.muted, sw: 1.7 })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 21,
        fontWeight: 600,
        color: NEU.ink
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
        color: onSurf('#1f5145'),
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
      color: NEU.ink,
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
        color: NEU.head,
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
        color: onSurf('#6e2230'),
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
        color: NEU.muted
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
      id: 'azans',
      label: 'Adhan'
    }, {
      id: 'infallibles',
      label: 'Infallibles'
    }, {
      id: 'mosques',
      label: 'Mosques'
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
      color: NEU.ink,
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
            color: NEU.head,
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
            color: NEU.label,
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
            color: NEU.label,
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
            color: NEU.label,
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
          color: onSurf('#6e2230'),
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
            color: NEU.muted
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
          color: onSurf('#7d6220')
        }), btn('Cancel', this.cancelEdit, {
          flex: 1,
          border: NEU.edge,
          background: NEU.surf, boxShadow: neuUp(),
          color: NEU.ink2
        })));
      }
      return /*#__PURE__*/React.createElement("div", null, btn('+ Add Story', () => this.startEdit(-1, {
        kind: 'announce',
        color: onSurf('#6e2230')
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
          color: NEU.ink,
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
        color: onSurf('#1f5145'),
        fontSize: 12,
        padding: '6px 12px'
      }), btn('✕', () => {
        const a = [...st.liveStories];
        a.splice(i, 1);
        save('stories', 'liveStories', a, 'Deleted');
      }, {
        background: '#fdf0f2',
        color: onSurf('#6e2230'),
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
            logo: (d.logo || '').trim(),
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
            color: NEU.head,
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
        }), this.renderMediaPicker(st, d, {
          kind: 'image', field: 'logo', heading: 'Logo (optional)',
          hint: '… or paste a link. Shown on the listing card in place of the initial; anything larger is shrunk to 320px before it is stored.'
        }), d.logo && /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex', alignItems: 'center', gap: 11,
            marginBottom: 11, padding: '10px 12px', borderRadius: 13,
            background: NEU.surf, border: NEU.edge, boxShadow: neuUp(.6)
          }
        }, /*#__PURE__*/React.createElement("img", {
          src: d.logo,
          alt: '',
          style: {
            width: 44, height: 44, borderRadius: 12, objectFit: 'contain',
            background: '#fffdf9', flexShrink: 0
          }
        }), /*#__PURE__*/React.createElement("div", {
          style: { fontSize: 11.5, color: NEU.muted, lineHeight: 1.5 }
        }, 'This is how the logo will appear on the card.')),
        /*#__PURE__*/React.createElement("div", {
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
          color: NEU.ink2
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
          color: NEU.ink,
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
          color: onSurf('#1f5145'),
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
          color: NEU.ink,
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
        color: onSurf('#1f5145'),
        fontSize: 12,
        padding: '6px 12px'
      }), btn('✕', () => {
        const a = st.liveClassifieds.filter(c => c.name !== 'SoftEire Technology Limited');
        a.splice(i, 1);
        save('classifieds', 'liveClassifieds', a, 'Deleted');
      }, {
        background: '#fdf0f2',
        color: onSurf('#6e2230'),
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
            color: NEU.head,
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
            color: NEU.faint,
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
            color: NEU.faint,
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
          color: NEU.ink2
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
          color: NEU.ink,
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
        color: onSurf('#1f5145'),
        fontSize: 12,
        padding: '6px 12px'
      }), btn('✕', () => {
        const a = [...(st.liveCalEvents || [])];
        a.splice(i, 1);
        save('calEvents', 'liveCalEvents', a, 'Deleted');
      }, {
        background: '#fdf0f2',
        color: onSurf('#6e2230'),
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
            color: NEU.head,
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
            color: NEU.ink2
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
            color: NEU.ink,
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
          color: NEU.ink2
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
          color: NEU.ink
        }
      }, p.name), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11.5,
          color: NEU.muted,
          marginTop: 2
        }
      }, p.sub)), /*#__PURE__*/React.createElement("span", {
        style: {
          color: onSurf('#75601f'),
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
            color: NEU.head,
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
            color: NEU.faint,
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
            color: NEU.faint,
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
          color: NEU.ink2
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
          color: NEU.faint,
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
            color: NEU.head,
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
            color: NEU.faint,
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
          color: NEU.ink2
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
          color: NEU.ink,
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
        color: onSurf('#1f5145'),
        fontSize: 12,
        padding: '6px 12px'
      }), btn('✕', () => {
        const a = [...list];
        a.splice(i, 1);
        save('askImam', 'liveAskImam', a, 'Maulana removed');
      }, {
        background: '#fdf0f2',
        color: onSurf('#6e2230'),
        fontSize: 12,
        padding: '6px 10px'
      }))), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 12,
          fontWeight: 700,
          color: onSurf('#1f5145'),
          marginTop: 4
        }
      }, "● Live — the Ask Your Maulana card is showing at the top of Explore")) : /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13,
          color: NEU.faint,
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
          const from = (d.from || '').trim();
          const until = (d.until || '').trim();
          // a run that ends before it starts would never show, and would look
          // like a broken billboard rather than a mistyped booking
          if (from && until && until < from) {
            this.showToast('The end date is before the start date');
            return;
          }
          const item = {
            name: (d.name || '').trim(),
            link: (d.link || '').trim(),
            img: d.img,
            from,
            until,
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
            color: NEU.head,
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
            color: NEU.muted
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
            color: NEU.faint,
            margin: '-4px 2px 12px',
            lineHeight: 1.45
          }
        }, "Leave the link empty for a non-clickable ad. A wide banner works best — the slide is shown at roughly 16:7."), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 12.5,
            fontWeight: 600,
            color: NEU.label,
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
          color: onSurf('#6e2230'),
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
            color: NEU.muted,
            marginBottom: 14
          }
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
            color: NEU.label,
            marginBottom: 4
          }
        }, "Runs from (optional)"), /*#__PURE__*/React.createElement("input", {
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
            color: NEU.label,
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
            margin: '-4px 0 12px',
            lineHeight: 1.5
          }
        }, "Both days count in full. Leave either blank to run open-ended. While an ad is running, its business is marked Sponsored in Classifieds and listed near the top."),
        /*#__PURE__*/React.createElement("div", {
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
            color: NEU.ink2,
            fontWeight: 600
          }
        }, (() => {
          // the toggle says what the ad is doing, not merely what the switch is set to
          const s = adStatus({ ...d, on: d.on !== false });
          if (d.on === false) return 'Paused — not shown on the home page';
          if (s === 'scheduled') return 'Scheduled — starts ' + shortDate(d.from);
          if (s === 'ended') return 'Finished — the run ended ' + shortDate(d.until);
          return 'Live — shown in the billboard' + (d.until ? ' until ' + shortDate(d.until) : '');
        })())), /*#__PURE__*/React.createElement("div", {
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
          color: NEU.ink2
        })));
      }
      const liveCount = activeAds(list).length;
      return /*#__PURE__*/React.createElement("div", null, btn('+ Add Ad', () => this.startEdit(-1, {
        name: '',
        link: '',
        img: '',
        from: '',
        until: '',
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
          color: NEU.ink,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, a.name || 'Untitled ad'), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10.5,
          color: adStatus(a) === 'live' ? NEU.muted : adStatus(a) === 'scheduled' ? '#7d6220' : '#a03a3a',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, (() => {
        const s = adStatus(a);
        return (s === 'paused' ? 'Paused'
          : s === 'scheduled' ? '⏳ Scheduled ' + shortDate(a.from)
          : s === 'ended' ? 'Ended ' + shortDate(a.until)
          : '● Live' + (a.until ? ' until ' + shortDate(a.until) : ''))
          + ' · ' + (a.link || 'No link');
      })())), btn(a.on === false ? 'Show' : 'Pause', () => {
        const arr = [...list];
        arr[i] = {
          ...a,
          on: a.on === false
        };
        save('ads', 'liveAds', arr, a.on === false ? 'Ad is live' : 'Ad paused');
      }, {
        background: '#f3ecd9',
        color: onSurf('#7d6220'),
        fontSize: 12,
        padding: '6px 10px'
      }), btn('Edit', () => this.startEdit(i, {
        ...a
      }), {
        background: '#e6efe9',
        color: onSurf('#1f5145'),
        fontSize: 12,
        padding: '6px 12px'
      }), btn('✕', () => {
        const arr = [...list];
        arr.splice(i, 1);
        save('ads', 'liveAds', arr, 'Ad removed');
      }, {
        background: '#fdf0f2',
        color: onSurf('#6e2230'),
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

    /* \u2500 ADHAN \u2500 */
    /* The shipped adhan is not in this list and cannot be removed. It is the only
       one already in the service-worker cache, so it is the one that still plays
       when the phone is offline at Fajr \u2014 an uploaded azan is a choice on top of
       it, never a replacement for it. */
    const renderAzansSection = () => {
      const d = st.adminEditDraft;
      const list = st.liveAzans || [];
      if (editing) {
        const isNew = st.adminEditIdx === -1;
        const saveAzan = () => {
          if (!(d.name || '').trim()) {
            this.showToast('Give the adhan a name');
            return;
          }
          if (!(d.url || '').trim()) {
            this.showToast('Upload an audio file or paste a link');
            return;
          }
          if (!/^https?:\/\//.test(d.url.trim())) {
            this.showToast('Audio link must start with http(s)://');
            return;
          }
          const item = {
            id: d.id || randomId(),
            name: (d.name || '').trim().slice(0, 40),
            reciter: (d.reciter || '').trim().slice(0, 40),
            url: (d.url || '').trim()
          };
          const a = [...list];
          if (isNew) a.push(item);else a[st.adminEditIdx] = item;
          save('azans', 'liveAzans', a, isNew ? 'Adhan added!' : 'Adhan updated!');
        };
        return /*#__PURE__*/React.createElement("div", {
          style: { padding: '0 0 20px' }
        }, /*#__PURE__*/React.createElement("div", {
          style: { fontSize: 13, fontWeight: 700, color: NEU.head, marginBottom: 14 }
        }, isNew ? 'Add Adhan' : 'Edit Adhan'), /*#__PURE__*/React.createElement("input", {
          value: d.name || '',
          onChange: e => this.setDraft({ name: e.target.value }),
          placeholder: "Name shown to listeners (e.g. Makkah Adhan)",
          maxLength: 40,
          style: inp
        }), this.renderMediaPicker(st, d, {
          kind: 'audio', field: 'url', heading: 'Adhan audio',
          extraField: 'reciter', extraPlaceholder: 'Muadhdhin (optional)',
          hint: '\u2026 or paste a direct link to an MP3 or M4A file.'
        }), /*#__PURE__*/React.createElement("div", {
          style: { display: 'flex', gap: 10 }
        }, btn('Save', saveAzan, {
          flex: 1, background: '#1f5145', color: '#f3ead4'
        }), btn('Cancel', this.cancelEdit, {
          flex: 1, border: NEU.edge, background: NEU.surf, boxShadow: neuUp(), color: NEU.ink2
        })));
      }
      const ov = st.liveAzanOverrides || {};
      const setOv = (key, patch, msg) => {
        const next = { ...ov, [key]: { ...(ov[key] || {}), ...patch } };
        if (!next[key].name && !next[key].hidden) delete next[key];
        this.setState({ azanRenaming: null });
        this.saveContent('azanOverrides', 'liveAzanOverrides', next);
        this.showToast(msg);
      };
      /* The twelve that ship with the app. They cannot be deleted \u2014 the files are
         inside the build \u2014 so removing one means taking it off the list everyone
         sees, which comes to the same thing. Anyone who had chosen a hidden adhan
         falls back to the Classic, as playAdhan already does for a missing one. */
      const builtinRow = a => {
        const o = ov[a.key] || {};
        const hidden = !!o.hidden;
        const renaming = st.azanRenaming === a.key;
        return /*#__PURE__*/React.createElement("div", {
          key: a.key,
          style: {
            display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
            background: NEU.surf, boxShadow: neuUp(), border: NEU.edge,
            borderRadius: 14, padding: '10px 12px', marginBottom: 8,
            opacity: hidden ? .55 : 1
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: { flex: 1, minWidth: 120 }
        }, /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 13, fontWeight: 600, color: NEU.ink,
            textDecoration: hidden ? 'line-through' : 'none',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }
        }, o.name || a.label), /*#__PURE__*/React.createElement("div", {
          style: { fontSize: 10.5, color: NEU.muted, marginTop: 1 }
        }, hidden ? 'Hidden from the app' : 'Built in \u00b7 Shia adhan')),
        btn('Play', () => {
          this.stopAdhan();
          this.adhanAudio = new Audio(a.file);
          this.adhanAudio.play().catch(() => this.showToast('That file could not be played'));
        }, { background: '#f3ecd9', color: onSurf('#7d6220'), fontSize: 12, padding: '6px 10px' }),
        btn(renaming ? 'Close' : 'Rename', () => this.setState({
          azanRenaming: renaming ? null : a.key,
          azanRenameText: o.name || a.label
        }), { background: '#e6efe9', color: onSurf('#1f5145'), fontSize: 12, padding: '6px 12px' }),
        btn(hidden ? 'Show' : 'Hide', () => setOv(a.key, { hidden: !hidden },
          hidden ? 'Shown again' : 'Hidden from the app'),
          { background: hidden ? '#e6efe9' : '#fdf0f2', color: onSurf(hidden ? '#1f5145' : '#6e2230'),
            fontSize: 12, padding: '6px 10px' }),
        renaming && /*#__PURE__*/React.createElement("div", {
          style: { display: 'flex', gap: 8, width: '100%', marginTop: 2 }
        }, /*#__PURE__*/React.createElement("input", {
          value: st.azanRenameText || '',
          onChange: e => this.setState({ azanRenameText: e.target.value }),
          placeholder: a.label,
          maxLength: 40,
          style: { ...inp, marginBottom: 0, flex: 1 }
        }), btn('Save', () => setOv(a.key, { name: (st.azanRenameText || '').trim().slice(0, 40) },
          'Renamed'), { background: '#1f5145', color: '#f3ead4', fontSize: 12, padding: '6px 12px' }),
          o.name && btn('Reset', () => setOv(a.key, { name: '' }, 'Name reset'),
            { background: NEU.surf, border: NEU.edge, color: NEU.ink2, fontSize: 12, padding: '6px 10px' })));
      };
      return /*#__PURE__*/React.createElement("div", null, btn('+ Add Adhan', () => this.startEdit(-1, {
        name: '', reciter: '', url: ''
      }), {
        background: '#1f5145', color: '#f3ead4', marginBottom: 14, width: '100%'
      }), /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex', alignItems: 'center', gap: 11,
          background: '#eef7f4', border: '1px solid #c4ddd7', borderRadius: 13,
          padding: '11px 13px', marginBottom: 9
        }
      }, icon('check', { size: 16, stroke: onSurf('#1f5145'), style: { flexShrink: 0 } }),
         /*#__PURE__*/React.createElement("div", {
           style: { flex: 1, minWidth: 0 }
         }, /*#__PURE__*/React.createElement("div", {
           style: { fontSize: 13, fontWeight: 600, color: onSurf('#1f5145') }
         }, 'Classic Adhan'), /*#__PURE__*/React.createElement("div", {
           style: { fontSize: 10.5, color: '#4a6b62', marginTop: 1 }
         }, 'Shipped with the app \u00b7 always available offline \u00b7 cannot be hidden'))),
      /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10, letterSpacing: 1, textTransform: 'uppercase',
          fontWeight: 700, color: NEU.muted, margin: '14px 0 8px'
        }
      }, 'Built in \u00b7 ' + BUILTIN_ADHANS.length + ' Shia adhan'),
      BUILTIN_ADHANS.map(builtinRow),
      /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10, letterSpacing: 1, textTransform: 'uppercase',
          fontWeight: 700, color: NEU.muted, margin: '18px 0 8px'
        }
      }, 'Uploaded \u00b7 ' + list.length),
      list.map((a, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: {
          display: 'flex', alignItems: 'center', gap: 10,
          background: NEU.surf, boxShadow: neuUp(), border: NEU.edge,
          borderRadius: 14, padding: '10px 12px', marginBottom: 8
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: { flex: 1, minWidth: 0 }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 13, fontWeight: 600, color: NEU.ink,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }
      }, a.name || 'Untitled'), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10.5, color: NEU.muted, marginTop: 1,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
        }
      }, a.reciter || 'Uploaded')), btn('Play', () => {
        this.stopAdhan();
        this.adhanAudio = new Audio(a.url);
        this.adhanAudio.play().catch(() => this.showToast('That file could not be played'));
      }, {
        background: '#f3ecd9', color: onSurf('#7d6220'), fontSize: 12, padding: '6px 10px'
      }), btn('Edit', () => this.startEdit(i, { ...a }), {
        background: '#e6efe9', color: onSurf('#1f5145'), fontSize: 12, padding: '6px 12px'
      }), btn('\u2715', () => {
        const arr = [...list];
        arr.splice(i, 1);
        save('azans', 'liveAzans', arr, 'Adhan removed');
      }, {
        background: '#fdf0f2', color: onSurf('#6e2230'), fontSize: 12, padding: '6px 10px'
      }))), /*#__PURE__*/React.createElement("div", {
        style: { fontSize: 11.5, color: NEU.muted, marginTop: 10, lineHeight: 1.6 }
      }, 'Everyone chooses their own from this list under More → Adhan Sound, and the choice stays on their device. Removing one here sends anyone who had chosen it back to the Classic Adhan.'));
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
            color: NEU.head,
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
            color: NEU.ink2,
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
          color: NEU.ink2
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
              color: NEU.head,
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
              color: NEU.ink2
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
            color: NEU.ink2
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
              color: NEU.head,
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
            color: NEU.ink2
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
              color: NEU.head,
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
            color: NEU.ink2
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
            color: NEU.head,
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
            color: NEU.faint,
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
            color: NEU.faint,
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
          color: NEU.ink2
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
          background: NEU.sunk,
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
          color: NEU.ink,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, getLabel(it, i)), btn('Edit', () => this.startEdit(i, {
        ...it,
        _sub: ks
      }), {
        background: '#e6efe9',
        color: onSurf('#1f5145'),
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
        color: onSurf('#6e2230'),
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
              color: NEU.head,
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
              color: NEU.ink2
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
            color: NEU.ink2
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
              color: NEU.head,
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
            color: NEU.ink2
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
          background: NEU.sunk,
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
          color: NEU.ink,
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }
      }, it.title), btn('Edit', () => this.startEdit(i, {
        ...it,
        _sub: hs
      }), {
        background: '#e6efe9',
        color: onSurf('#1f5145'),
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
        color: onSurf('#6e2230'),
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
          background: NEU.sunk,
          borderRadius: 12,
          padding: 4,
          marginBottom: 14
        }
      }, [...LIB_KINDS.map(k => [k.key, k.tab]), ['nahj', 'Books']].map(([k, label]) => /*#__PURE__*/React.createElement("div", {
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
        color: onSurf('#1f5145'),
        padding: '6px 12px',
        fontSize: 12
      }), btn('Delete', onDelete, {
        background: '#f3e6e8',
        color: onSurf('#6e2230'),
        padding: '6px 12px',
        fontSize: 12
      }));
      if (LIB_KIND[lt]) {
        const kind = LIB_KIND[lt];
        const key = kind.sb;
        const stateKey = kind.state;
        const label = kind.title;
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
            if (d.audio && !/^https?:\/\//.test(d.audio.trim())) {
              this.showToast('Audio link must start with http(s)://');
              return;
            }
            const item = {
              title: d.title || '',
              sub: (d.sub || '').trim(),
              cat: (d.cat || '').trim() || 'General',
              ar: d.ar || '',
              tr: d.tr || '',
              note: d.note || '',
              body: d.body || '',
              body_ur: d.body_ur || '',
              body_fa: d.body_fa || '',
              body_hi: d.body_hi || '',
              pdf: (d.pdf || '').trim(),
              audio: (d.audio || '').trim(),
              reciter: (d.reciter || '').trim()
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
              color: NEU.head,
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
            placeholder: kind.catHint,
            style: inp
          }), /*#__PURE__*/React.createElement("input", {
            value: d.sub || '',
            onChange: e => this.setDraft({
              sub: e.target.value
            }),
            // shown under the title in the list, for entries whose titles repeat
            placeholder: 'Subtitle (optional) — shown under the title',
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
              color: NEU.faint,
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
          /* No PDF picker here any more: the reader stopped offering a PDF tab
             on these three sections, so anything uploaded from this form would
             go where nobody could open it. Links already saved are left in the
             draft untouched — this only stops new ones being added. */
          }), this.renderAudioPicker(st, d),
          /*#__PURE__*/React.createElement("div", {
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
            color: NEU.ink2
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
            color: NEU.ink,
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
      const groups = BOOKS.flatMap(([bk, bl]) =>
        (BOOK_PARTS[bk] || []).map(([k, l]) => [k, bl + ' · ' + l]));
      if (editing) {
        const d = st.adminEditDraft;
        const isNew = st.adminEditIdx === -1;
        const g = d._group || 'sermons';
        const saveItem = () => {
          if (!(d.title || '').trim()) {
            this.showToast('Title is required');
            return;
          }
          // every part copied, so a book gaining a section later cannot drop one
          const next = { ...nahj };
          groups.forEach(([k]) => { next[k] = [...(nahj[k] || [])]; });
          if (d.pdf && !/^https?:\/\//.test(d.pdf.trim())) {
            this.showToast('PDF link must start with http(s)://');
            return;
          }
          if (d.audio && !/^https?:\/\//.test(d.audio.trim())) {
            this.showToast('Audio link must start with http(s)://');
            return;
          }
          const item = {
            ref: d.ref || '',
            title: d.title || '',
            sum: d.sum || '',
            ar: d.ar || '',
            tr: d.tr || '',
            pdf: (d.pdf || '').trim(),
            audio: (d.audio || '').trim(),
            reciter: (d.reciter || '').trim()
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
            color: NEU.head,
            marginBottom: 14
          }
        }, isNew ? 'Add Book Entry' : 'Edit Book Entry'), /*#__PURE__*/React.createElement("select", {
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
          placeholder: "Reference (e.g. Sermon 1, Letter 31, Supplication 20)",
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
        }), this.renderPdfPicker(st, d), this.renderAudioPicker(st, d), /*#__PURE__*/React.createElement("div", {
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
          color: NEU.ink2
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
          color: NEU.muted,
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
          color: NEU.ink,
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
    /* ─ FOURTEEN INFALLIBLES ─
       Order is meaning here, so the list is reordered by hand rather than
       sorted: the Prophet first and the twelfth Imam last is not an
       alphabetical accident. */
    const renderInfalliblesSection = () => {
      const list = st.liveInfallibles || INFALLIBLES;
      const rowStyle = {
        display: 'flex', alignItems: 'center', gap: 10,
        background: NEU.surf, boxShadow: neuUp(), border: NEU.edge,
        borderRadius: 13, padding: '11px 13px', marginBottom: 9
      };
      if (editing) {
        const d = st.adminEditDraft;
        const isNew = st.adminEditIdx === -1;
        const saveItem = () => {
          if (!(d.name || '').trim()) return this.showToast('Name is required');
          const item = {
            name: (d.name || '').trim(),
            hon: (d.hon || '').trim(),
            role: (d.role || '').trim(),
            born: (d.born || '').trim(),
            died: (d.died || '').trim(),
            rest: (d.rest || '').trim(),
            bio: d.bio || ''
          };
          const a = [...list];
          if (isNew) a.push(item);else a[st.adminEditIdx] = item;
          save('infallibles', 'liveInfallibles', a, isNew ? 'Added!' : 'Updated!');
        };
        const field = (labelText, key, placeholder, rows) => React.createElement(React.Fragment, { key },
          React.createElement("div", {
            style: { fontSize: 11, fontWeight: 700, color: NEU.muted, marginBottom: 5, letterSpacing: .5, textTransform: 'uppercase' }
          }, labelText),
          rows ? React.createElement("textarea", {
            value: d[key] || '',
            onChange: e => this.setDraft({ [key]: e.target.value }),
            placeholder, rows,
            style: { ...inp, resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit' }
          }) : React.createElement("input", {
            value: d[key] || '',
            onChange: e => this.setDraft({ [key]: e.target.value }),
            placeholder, style: inp
          }));
        return React.createElement("div", { style: { padding: '0 0 20px' } },
          React.createElement("div", {
            style: { fontSize: 13, fontWeight: 700, color: NEU.head, marginBottom: 14 }
          }, isNew ? 'Add an entry' : 'Edit entry'),
          field('Name', 'name', 'Imam Ja\u02bffar al-\u1e62\u0101diq'),
          React.createElement("div", {
            style: { fontSize: 11, fontWeight: 700, color: NEU.muted, marginBottom: 5, letterSpacing: .5, textTransform: 'uppercase' }
          }, 'Honorific'),
          React.createElement("select", {
            value: d.hon || '',
            onChange: e => this.setDraft({ hon: e.target.value }),
            "aria-label": 'Honorific',
            style: { ...inp, colorScheme: st.dark ? 'dark' : 'light', cursor: 'pointer' }
          }, [['', 'None'], ['s', '(\u1e63) \u2014 the Prophet'], ['a', '(\u02bfa) \u2014 peace be upon him or her'], ['aj', '(\u02bfaj) \u2014 may Allah hasten his return']]
            .map(([v, t]) => React.createElement("option", { key: v, value: v }, t))),
          field('Title or role', 'role', 'The sixth Imam'),
          field('Born', 'born', '83 AH / 702 CE, Medina'),
          field('Passed', 'died', '148 AH / 765 CE, Medina'),
          field('Resting place', 'rest', 'Jannat al-Baq\u012b\u02bf, Medina'),
          field('Biography', 'bio', 'A few sentences.', 9),
          React.createElement("div", { style: { display: 'flex', gap: 9, marginTop: 4 } },
            btn('Save', saveItem, { background: NEU.accent, color: inkOn(NEU.accent), boxShadow: neuUpOn('31,81,69', .7) }),
            btn('Cancel', () => this.cancelEdit())));
      }
      return React.createElement("div", { style: { padding: '0 0 20px' } },
        btn('+ Add an entry', () => this.setState({ adminEditIdx: -1, adminEditDraft: {} }),
          { background: NEU.accent, color: inkOn(NEU.accent), boxShadow: neuUpOn('31,81,69', .7), marginBottom: 14 }),
        list.map((p, i) => React.createElement("div", { key: i, style: rowStyle },
          React.createElement("div", {
            style: {
              flexShrink: 0, width: 26, height: 26, borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center', background: '#f3e6e8',
              color: onSurf('#6e2230'), fontSize: 11, fontWeight: 800
            }
          }, i + 1),
          React.createElement("div", { style: { flex: 1, minWidth: 0 } },
            React.createElement("div", {
              style: { fontSize: 13.5, fontWeight: 600, color: NEU.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
            }, p.name),
            React.createElement("div", {
              style: { fontSize: 11.5, color: NEU.muted, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
            }, p.role || '')),
          React.createElement("div", { style: { display: 'flex', gap: 5, flexShrink: 0 } },
            i > 0 && btn('\u2191', () => {
              const a = [...list];
              a.splice(i - 1, 0, a.splice(i, 1)[0]);
              save('infallibles', 'liveInfallibles', a, 'Moved up');
            }, { padding: '6px 10px', fontSize: 12 }),
            i < list.length - 1 && btn('\u2193', () => {
              const a = [...list];
              a.splice(i + 1, 0, a.splice(i, 1)[0]);
              save('infallibles', 'liveInfallibles', a, 'Moved down');
            }, { padding: '6px 10px', fontSize: 12 }),
            btn('Edit', () => this.setState({ adminEditIdx: i, adminEditDraft: { ...p } }),
              { background: '#e6efe9', color: onSurf('#1f5145'), padding: '6px 12px', fontSize: 12 }),
            btn('Delete', () => save('infallibles', 'liveInfallibles', list.filter((_, x) => x !== i), 'Deleted'),
              { background: '#f3e6e8', color: onSurf('#6e2230'), padding: '6px 12px', fontSize: 12 })))));
    };

    /* ─ MOSQUES ─ */
    const renderMosquesSection = () => {
      const list = st.liveMosques || MOSQUES;
      const rowStyle = {
        display: 'flex', alignItems: 'center', gap: 10,
        background: NEU.surf, boxShadow: neuUp(), border: NEU.edge,
        borderRadius: 13, padding: '11px 13px', marginBottom: 9
      };
      if (editing) {
        const d = st.adminEditDraft;
        const isNew = st.adminEditIdx === -1;
        const saveItem = () => {
          if (!(d.name || '').trim()) return this.showToast('Name is required');
          if (!(d.address || '').trim()) return this.showToast('Address is required');
          for (const [k, what] of [['web', 'Website'], ['map', 'Map link']]) {
            if ((d[k] || '').trim() && !/^https?:\/\//.test(d[k].trim()))
              return this.showToast(what + ' must start with http(s)://');
          }
          const item = {
            name: (d.name || '').trim(),
            denom: (d.denom || '').trim(),
            address: (d.address || '').trim(),
            city: (d.city || '').trim(),
            county: (d.county || '').trim(),
            phone: (d.phone || '').trim(),
            web: (d.web || '').trim(),
            map: (d.map || '').trim(),
            note: (d.note || '').trim()
          };
          const a = [...list];
          if (isNew) a.push(item);else a[st.adminEditIdx] = item;
          save('mosques', 'liveMosques', a, isNew ? 'Mosque added!' : 'Mosque updated!');
        };
        const field = (labelText, key, placeholder, rows) => React.createElement(React.Fragment, { key },
          React.createElement("div", {
            style: { fontSize: 11, fontWeight: 700, color: NEU.muted, marginBottom: 5, letterSpacing: .5, textTransform: 'uppercase' }
          }, labelText),
          rows ? React.createElement("textarea", {
            value: d[key] || '',
            onChange: e => this.setDraft({ [key]: e.target.value }),
            placeholder, rows,
            style: { ...inp, resize: 'vertical', lineHeight: 1.6, fontFamily: 'inherit' }
          }) : React.createElement("input", {
            value: d[key] || '',
            onChange: e => this.setDraft({ [key]: e.target.value }),
            placeholder, style: inp
          }));
        return React.createElement("div", { style: { padding: '0 0 20px' } },
          React.createElement("div", {
            style: { fontSize: 13, fontWeight: 700, color: NEU.head, marginBottom: 14 }
          }, isNew ? 'Add a mosque' : 'Edit mosque'),
          field('Name', 'name', 'Ahlul-Bait Islamic Centre'),
          field('Community', 'denom', 'Shia \u2014 or leave blank'),
          field('Address', 'address', 'Street and building', 3),
          field('Town or city', 'city', 'Dublin'),
          field('County', 'county', 'Co. Dublin'),
          field('Phone', 'phone', '+353 1 234 5678'),
          field('Website', 'web', 'https://\u2026'),
          field('Map link', 'map', 'https://\u2026 \u2014 leave blank to search the address'),
          field('Note', 'note', 'Jumuah at 13:30, ladies\u2019 entrance on the side \u2014 anything worth knowing', 3),
          React.createElement("div", { style: { display: 'flex', gap: 9, marginTop: 4 } },
            btn('Save', saveItem, { background: NEU.accent, color: inkOn(NEU.accent), boxShadow: neuUpOn('31,81,69', .7) }),
            btn('Cancel', () => this.cancelEdit())));
      }
      return React.createElement("div", { style: { padding: '0 0 20px' } },
        btn('+ Add a mosque', () => this.setState({ adminEditIdx: -1, adminEditDraft: {} }),
          { background: NEU.accent, color: inkOn(NEU.accent), boxShadow: neuUpOn('31,81,69', .7), marginBottom: 14 }),
        list.length === 0 && React.createElement("div", {
          style: { fontSize: 13, color: NEU.muted, lineHeight: 1.6, padding: '4px 2px 12px' }
        }, 'Nothing listed yet. Whatever is added here is what everyone sees under Tools \u203a Mosque Finder.'),
        list.map((m, i) => React.createElement("div", { key: i, style: rowStyle },
          React.createElement("div", { style: { flex: 1, minWidth: 0 } },
            React.createElement("div", {
              style: { fontSize: 13.5, fontWeight: 600, color: NEU.ink, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
            }, m.name),
            React.createElement("div", {
              style: { fontSize: 11.5, color: NEU.muted, marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }
            }, [m.city, m.county].filter(Boolean).join(', ') || m.address || '')),
          React.createElement("div", { style: { display: 'flex', gap: 6, flexShrink: 0 } },
            btn('Edit', () => this.setState({ adminEditIdx: i, adminEditDraft: { ...m } }),
              { background: '#e6efe9', color: onSurf('#1f5145'), padding: '6px 12px', fontSize: 12 }),
            btn('Delete', () => save('mosques', 'liveMosques', list.filter((_, x) => x !== i), 'Deleted'),
              { background: '#f3e6e8', color: onSurf('#6e2230'), padding: '6px 12px', fontSize: 12 })))));
    };

    const sectionContent = {
      stories: renderStoriesSection,
      library: renderLibrarySection,
      azans: renderAzansSection,
      classifieds: renderClassifiedsSection,
      events: renderEventsSection,
      prayers: renderPrayersSection,
      announcement: renderAnnouncementSection,
      pinned: renderPinnedSection,
      askImam: renderAskImamSection,
      ads: renderAdsSection,
      kids: renderKidsSection,
      health: renderHealthSection,
      infallibles: renderInfalliblesSection,
      mosques: renderMosquesSection
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
        color: onSurf('#1f5145'),
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
        color: NEU.head
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
        background: THEME_DARK ? NEU.sunk : '#e8f0ec',
        color: onSurf('#1f5145')
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
        color: onSurf('#6e2230')
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
        color: onSurf('#6e2230'),
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
      style: { fontFamily: 'Spectral,serif', fontSize: 26, fontWeight: 600, color: NEU.head, marginTop: 2 }
    }, this.t('cal.title'))),
    /*#__PURE__*/React.createElement("div", {
      style: { ...neuCard(22, 1.15), padding: '16px 14px' }
    },
      /*#__PURE__*/React.createElement("div", {
        style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }
      }, arrowBtn("‹", canPrev, () => canPrev && goMonth(0, -1)), /*#__PURE__*/React.createElement("div", {
        style: { flex: 1, textAlign: 'right', fontFamily: 'Spectral,serif', fontSize: 17, fontWeight: 600, color: NEU.ink }
      }, monthOnly), /*#__PURE__*/React.createElement("div", {
        style: { position: 'relative', width: 66, height: 66, flexShrink: 0, borderRadius: '50%', background: 'radial-gradient(circle,#ffffff 55%,#eef5f1 56%)', border: '2px solid #1f5145', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 14px -6px rgba(31,81,69,.55)' }
      }, /*#__PURE__*/React.createElement("div", {
        style: { position: 'absolute', inset: 5, borderRadius: '50%', border: '1.5px dashed #75601f' }
      }), /*#__PURE__*/React.createElement("div", {
        style: { fontFamily: 'Spectral,serif', fontSize: 24, fontWeight: 700, color: onSurf('#1f5145') }
      }, selDay)), /*#__PURE__*/React.createElement("div", {
        style: { flex: 1, textAlign: 'left', fontFamily: 'Spectral,serif', fontSize: 17, fontWeight: 600, color: NEU.ink }
      }, String(calY)), arrowBtn("›", canNext, () => canNext && goMonth(0, 1))),
      /*#__PURE__*/React.createElement("div", {
        style: { textAlign: 'center', fontSize: 12.5, color: onSurf('#7d6220'), fontWeight: 600, marginTop: 7 }
      }, selHijri, " AH"),
      /*#__PURE__*/React.createElement("div", {
        style: { display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginTop: 12, marginBottom: 2 }
      }, weekHead.map((w, i) => /*#__PURE__*/React.createElement("div", {
        key: i,
        style: { textAlign: 'center', fontSize: 11, fontWeight: 700, color: NEU.muted }
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
        style: { fontSize: 13.5, fontWeight: 600, color: c.sel ? '#fffdf9' : c.isToday ? onSurf('#1f5145') : NEU.ink2, lineHeight: 1 }
      }, c.day), /*#__PURE__*/React.createElement("span", {
        style: { fontSize: 10, fontWeight: 600, color: c.sel ? 'rgba(255,255,255,.75)' : onSurf('#7d6220'), lineHeight: 1 }
      }, c.hijriDay))))),
    /*#__PURE__*/React.createElement("div", {
      style: { background: NEU.surf, boxShadow: neuUp(), border: NEU.edge, borderRadius: 18, marginTop: 16, overflow: 'hidden' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', background: THEME_DARK ? NEU.sunk : '#e8f0ec' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'center', gap: 9 }
    }, calIcon, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 16.5, fontWeight: 700, color: onSurf('#1f5145') }
    }, "On this day")), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 13.5, fontWeight: 600, color: onSurf('#1f5145') }
    }, dayLabelShort)), /*#__PURE__*/React.createElement("div", {
      style: { padding: '2px 16px 12px' }
    }, selEvents.length > 0 ? selEvents.map((ev, si) => /*#__PURE__*/React.createElement("div", {
      key: si,
      style: { padding: '12px 0', borderTop: si > 0 ? '1px solid #f1ebdd' : 'none' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 11.5, letterSpacing: .7, textTransform: 'uppercase', fontWeight: 700, color: onSurf(ev.color) }
    }, ev.type), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 17, fontWeight: 600, color: NEU.ink, marginTop: 2, lineHeight: 1.3 }
    }, ev.title), ev.desc && /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 14, color: NEU.muted, marginTop: 4, lineHeight: 1.55 }
    }, ev.desc), st.adminLoggedIn && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({ screen: 'admin', adminSection: 'events', adminEditIdx: (st.liveCalEvents || []).indexOf(ev), adminEditDraft: { ...ev } }),
      style: { marginTop: 8, display: 'inline-block', fontSize: 11, color: onSurf('#1f5145'), fontWeight: 600, cursor: 'pointer', padding: '4px 10px', border: '1px solid #c4ddd7', borderRadius: 8, background: '#eef7f4' }
    }, "Edit"))) : /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 14, color: NEU.muted, padding: '12px 0 4px' }
    }, this.t('cal.noEvent')), /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 4, paddingTop: 10, borderTop: '1px solid #f1ebdd' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: NEU.muted, fontWeight: 600 }
    }, clockIcon, dayLabelShort), st.adminLoggedIn && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({ screen: 'admin', adminSection: 'events', adminEditIdx: -1, adminEditDraft: { date: selDayStr, type: 'Community', notice: 'day' } }),
      style: { fontSize: 11, color: onSurf('#1f5145'), fontWeight: 600, cursor: 'pointer', padding: '5px 10px', border: '1px solid #c4ddd7', borderRadius: 8, background: '#eef7f4' }
    }, "+ Add event")))),
    /*#__PURE__*/React.createElement("div", {
      style: { background: NEU.surf, boxShadow: neuUp(), border: NEU.edge, borderRadius: 18, marginTop: 14, overflow: 'hidden' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', background: THEME_DARK ? NEU.sunk : '#e8f0ec' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', alignItems: 'center', gap: 9 }
    }, bellIcon, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 16.5, fontWeight: 700, color: onSurf('#1f5145') }
    }, "Reminder (" + dayReminders.length + ")")), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 13.5, fontWeight: 600, color: onSurf('#1f5145') }
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
      style: { flex: 1, fontSize: 15, color: NEU.ink, lineHeight: 1.45 }
    }, /*#__PURE__*/React.createElement("span", {
      style: { fontWeight: 600 }
    }, rm.title), rm.desc && /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 13.5, color: NEU.muted, marginTop: 2, lineHeight: 1.4 }
    }, rm.desc)), st.adminLoggedIn && /*#__PURE__*/React.createElement("span", {
      onClick: () => this.setState({ screen: 'admin', adminSection: 'events', adminEditIdx: (st.liveCalEvents || []).indexOf(rm), adminEditDraft: { ...rm } }),
      style: { flexShrink: 0, fontSize: 11, color: onSurf('#1f5145'), fontWeight: 600, cursor: 'pointer' }
    }, "Edit")))), st.adminLoggedIn ? /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({ screen: 'admin', adminSection: 'events', adminEditIdx: -1, adminEditDraft: { date: selDayStr, type: 'Community', notice: 'reminder' } }),
      style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, padding: '11px', borderRadius: 12, border: '1px dashed #c4ddd7', background: '#f4fbf8', color: onSurf('#1f5145'), fontSize: 13.5, fontWeight: 600, cursor: 'pointer' }
    }, "+ Add A Reminder") : dayReminders.length === 0 && /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 14, color: NEU.muted, textAlign: 'center', padding: '4px 0' }
    }, "No reminders for this day."))),
    st.adminLoggedIn && /*#__PURE__*/React.createElement("div", {
      onClick: () => this.setState({ screen: 'admin', adminSection: 'events', adminEditIdx: null, adminEditDraft: {} }),
      style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 16, padding: '12px', borderRadius: 14, border: '1px dashed #c4ddd7', background: '#f4fbf8', cursor: 'pointer' }
    }, /*#__PURE__*/React.createElement("span", {
      style: { color: onSurf('#1f5145'), fontSize: 14, fontWeight: 600 }
    }, "⚙ Manage Events & Reminders")),
    calEventList.length > 0 && /*#__PURE__*/React.createElement("div", {
      id: 'cal-upcoming',
      style: { marginTop: 26 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 700, color: NEU.muted, marginBottom: 12 }
    }, this.t('cal.upcoming')), /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', flexDirection: 'column', gap: 10 }
    }, calEventList.map((e, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      onClick: () => this.setState({ calViewY: e.y, calViewM: e.m, calDay: e.day }),
      style: { display: 'flex', gap: 13, alignItems: 'center', background: NEU.surf, boxShadow: neuUp(), border: NEU.edge, borderRadius: 15, padding: '13px 15px', cursor: 'pointer' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { flexShrink: 0, width: 46, textAlign: 'center', borderRight: '1px solid #f1ebdd', paddingRight: 11 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 18, fontWeight: 700, color: onSurf(e.color), lineHeight: 1 }
    }, e.day), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 10, color: NEU.muted, marginTop: 2 }
    }, e.dateLabel)), /*#__PURE__*/React.createElement("div", {
      style: { flex: 1 }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 10, letterSpacing: .6, textTransform: 'uppercase', fontWeight: 700, color: onSurf(e.color) }
    }, "🔔 ", e.type), /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 14.5, fontWeight: 600, color: NEU.ink, marginTop: 1 }
    }, e.title)))))),
    /*#__PURE__*/React.createElement("div", {
      style: { textAlign: 'center', fontSize: 11.5, color: NEU.muted, lineHeight: 1.5, padding: '22px 24px 0' }
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
        onClick: () => {
          if (k === 'quiz' && this.state.lbState === 'idle') this.loadLeaderboard(this.state.kidsQuizLevel || DEFAULT_LEVEL);
          this.setState({
            kidsTab: k
          });
        },
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
        color: NEU.ink,
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
        color: NEU.ink,
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
    }, "— ", q.who)))), kt === 'books' && !st.learnBook && /*#__PURE__*/React.createElement(React.Fragment, null,
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
        color: onSurf('#7d6220'),
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
    }, "Register your child ↗")), kt === 'books' && this.renderLearning(st), kt === 'quiz' && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 17,
        fontWeight: 600,
        color: NEU.ink,
        marginBottom: 12
      }
    }, "Quiz Time"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 8,
        marginBottom: 14
      }
    }, QUIZ_LEVELS.map(L => {
      const on = (st.kidsQuizLevel || DEFAULT_LEVEL) === L.key;
      const n = (st.liveKidsQuizzes || []).filter(q => quizLevel(q) === L.key).length;
      return /*#__PURE__*/React.createElement("div", {
        key: L.key,
        onClick: () => {
          this.clearQuizTimers();
          this.setState({ kidsQuizLevel: L.key, quizRun: null });
          this.loadLeaderboard(L.key);
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
      const lvl = st.kidsQuizLevel || DEFAULT_LEVEL;
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
      if (!r) return (() => {
        const draft = st.quizNameDraft === null ? st.quizName : st.quizNameDraft;
        const count = Math.min(10, pool.length);
        const mins = Math.ceil(count * SCORING.SECONDS_PER_QUESTION / 60);
        const begin = () => {
          const name = this.setQuizName(draft);
          if (name) this.startQuizRun(lvl, name);
        };
        const nameErr = st.quizNameErr;
        return /*#__PURE__*/React.createElement("div", {
          style: {
            ...neuCard(18, .9),
            padding: '22px 18px',
            marginBottom: 14
          }
        }, /*#__PURE__*/React.createElement("div", {
          style: { textAlign: 'center' }
        }, /*#__PURE__*/React.createElement("div", {
          "aria-hidden": "true",
          style: { fontSize: 36, marginBottom: 6 }
        }, "🎯"), /*#__PURE__*/React.createElement("h2", {
          style: {
            fontFamily: 'Spectral,serif', fontSize: 20, fontWeight: 600,
            color: NEU.ink, margin: 0
          }
        }, "Community Quiz")),
        /* Everything the participant is agreeing to before they begin. */
        /*#__PURE__*/React.createElement("dl", {
          style: {
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8,
            margin: '16px 0 0'
          }
        }, [
          ['Questions', String(count)],
          ['Difficulty', lvlMeta.label],
          ['Time each', SCORING.SECONDS_PER_QUESTION + ' seconds'],
          ['About', mins <= 1 ? 'Under 2 minutes' : mins + ' minutes']
        ].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
          key: k,
          style: { ...neuWell(12, .6), padding: '9px 11px' }
        }, /*#__PURE__*/React.createElement("dt", {
          style: {
            fontSize: 9.5, letterSpacing: 1.1, textTransform: 'uppercase',
            fontWeight: 800, color: NEU.muted, margin: 0
          }
        }, k), /*#__PURE__*/React.createElement("dd", {
          style: {
            fontSize: 14, fontWeight: 700,
            color: k === 'Difficulty' ? lvlMeta.color : NEU.ink, margin: '2px 0 0'
          }
        }, v)))),
        /*#__PURE__*/React.createElement("div", {
          style: { marginTop: 16 }
        }, /*#__PURE__*/React.createElement("label", {
          htmlFor: "abi-quiz-name",
          style: {
            display: 'block', fontSize: 12.5, fontWeight: 700,
            color: NEU.ink, marginBottom: 6
          }
        }, "Display name"), /*#__PURE__*/React.createElement("input", {
          id: "abi-quiz-name",
          value: draft,
          maxLength: NAME_MAX,
          autoComplete: "off",
          spellCheck: false,
          "aria-invalid": nameErr ? 'true' : 'false',
          "aria-describedby": "abi-quiz-name-help" + (nameErr ? ' abi-quiz-name-err' : ''),
          onChange: e => this.setState({ quizNameDraft: e.target.value, quizNameErr: null }),
          onKeyDown: e => { if (e.key === 'Enter') begin(); },
          dir: "auto",
      placeholder: "e.g. Zainab, \u0639\u0644\u06cc, Ahmed K.",
          style: {
            ...neuWell(12, .7),
            width: '100%', boxSizing: 'border-box', padding: '13px 14px',
            border: nameErr ? '1.5px solid #6e2230' : NEU.edge,
            outline: 'none', fontSize: 15, color: NEU.ink, minHeight: 44
          }
        }), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex', justifyContent: 'space-between', gap: 8, marginTop: 5
          }
        }, /*#__PURE__*/React.createElement("div", {
          id: "abi-quiz-name-help",
          style: { fontSize: 11, color: NEU.muted, lineHeight: 1.45 }
        }, NAME_MIN, "\u2013", NAME_MAX, " characters. Any language."), /*#__PURE__*/React.createElement("div", {
          style: {
            fontSize: 11, color: NEU.muted, fontVariantNumeric: 'tabular-nums', flexShrink: 0
          }
        }, sanitiseName(draft).length, "/", NAME_MAX)),
        /* Errors are announced, not only shown: the input is off-screen for a
           screen-reader user by the time the message appears. */
        /*#__PURE__*/React.createElement("div", {
          id: "abi-quiz-name-err",
          role: "alert",
          style: {
            fontSize: 12, color: onSurf('#6e2230'), fontWeight: 600,
            marginTop: nameErr ? 6 : 0, lineHeight: 1.4
          }
        }, nameErr ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
          "aria-hidden": "true"
        }, "\u26a0 "), nameErr) : '')),
        /*#__PURE__*/React.createElement("div", {
          onClick: begin,
          style: {
            marginTop: 14, padding: '14px 0', borderRadius: 13,
            background: lvlMeta.color, color: '#fffdf9', fontSize: 15,
            fontWeight: 800, cursor: 'pointer', textAlign: 'center', minHeight: 44
          }
        }, "Start Quiz"),
        /*#__PURE__*/React.createElement("p", {
          style: {
            fontSize: 11.5, color: NEU.muted, lineHeight: 1.55,
            margin: '12px 0 0', textAlign: 'center'
          }
        }, "Enter a display name for the leaderboard. You do not need to create an account. Avoid using your full name or private information."));
      })()

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
        }, cheer[2]), (() => {
          const parts = scoreParts(r.score, total, r.durationMs, true);
          const secs = Math.round((r.durationMs || 0) / 1000);
          const sub = st.quizSubmit || {};
          const line = (label, value) => /*#__PURE__*/React.createElement("div", {
            key: label,
            style: { display: 'flex', justifyContent: 'space-between', gap: 10, padding: '3px 0' }
          }, /*#__PURE__*/React.createElement("span", null, label), /*#__PURE__*/React.createElement("span", {
            style: { fontWeight: 700, fontVariantNumeric: 'tabular-nums' }
          }, value));
          /* Plain arithmetic, shown rather than asserted — a score nobody can
             check is a score nobody trusts. */
          return /*#__PURE__*/React.createElement("div", {
            style: {
              textAlign: 'left', marginTop: 16, padding: '13px 14px',
              borderRadius: 13, background: 'rgba(0,0,0,.16)',
              fontSize: 12.5, color: 'rgba(243,234,212,.92)', lineHeight: 1.5
            }
          }, /*#__PURE__*/React.createElement("div", {
            style: {
              fontSize: 9.5, letterSpacing: 1.1, textTransform: 'uppercase',
              fontWeight: 800, color: '#d8b863', marginBottom: 6
            }
          }, "How this score was worked out"),
          line(`${r.score} correct × ${SCORING.BASE_PER_CORRECT}`, parts.answers),
          line('Finished the quiz', '+' + parts.completion),
          line(`Time bonus (${secs}s of ${total * SCORING.SECONDS_PER_QUESTION}s)`, '+' + parts.time),
          /*#__PURE__*/React.createElement("div", {
            style: {
              display: 'flex', justifyContent: 'space-between', gap: 10,
              borderTop: '1px solid rgba(243,234,212,.25)', marginTop: 6,
              paddingTop: 6, fontWeight: 800
            }
          }, /*#__PURE__*/React.createElement("span", null, "Total"), /*#__PURE__*/React.createElement("span", {
            style: { color: '#d8b863', fontVariantNumeric: 'tabular-nums' }
          }, parts.answers + parts.completion + parts.time)),
          /*#__PURE__*/React.createElement("div", {
            style: { fontSize: 11, color: 'rgba(243,234,212,.7)', marginTop: 7 }
          }, "The time bonus is always worth less than one correct answer, so answering carefully never loses to answering quickly."),
          /* Submission state, announced as it changes. */
          /*#__PURE__*/React.createElement("div", {
            role: "status",
            "aria-live": "polite",
            style: {
              display: 'flex', alignItems: 'center', gap: 8, marginTop: 10,
              paddingTop: 9, borderTop: '1px solid rgba(243,234,212,.25)',
              fontSize: 11.5, color: 'rgba(243,234,212,.9)', lineHeight: 1.45
            }
          }, sub.state === 'sending' ? 'Sending your result…' : sub.state === 'ok' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", { "aria-hidden": "true" }, "✓ "), 'Result confirmed and added to the ' + lvlMeta.label + ' leaderboard.') : sub.state === 'queued' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", { style: { flex: 1 } }, /*#__PURE__*/React.createElement("span", { "aria-hidden": "true" }, "↻ "), sub.message || 'Saved on this device — waiting to be sent when you are back online.'), /*#__PURE__*/React.createElement("span", {
            onClick: this.retrySync,
            role: "button",
            tabIndex: 0,
            onKeyDown: e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.retrySync(); } },
            style: {
              flexShrink: 0, padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
              border: '1px solid rgba(243,234,212,.45)', fontWeight: 700, minHeight: 44,
              display: 'flex', alignItems: 'center'
            }
          }, 'Retry')) : sub.state === 'rejected' ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", { "aria-hidden": "true" }, "⚠ "), sub.message || 'This result was not accepted.') : ''));
        })(), /*#__PURE__*/React.createElement("div", {
          style: {
            display: 'flex',
            gap: 10,
            marginTop: 18
          }
        }, /*#__PURE__*/React.createElement("div", {
          onClick: () => this.startQuizRun(lvl, r.name || st.quizName),
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
          color: onSurf('#6e2230')
        }
      }, "Question ", r.pos + 1, " of ", r.qs.length), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10.5,
          fontWeight: 700,
          color: onSurf('#7d6220')
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
          transform: `scaleX(${answered ? 0 : r.timeLeft / SCORING.SECONDS_PER_QUESTION})`,
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
          color: NEU.ink,
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
            color: NEU.ink,
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
    })(), this.renderLeaderboard(st)));
  }

  /* \u2500\u2500 LEARNING \u2500\u2500
     Two courses, and inside each one its chapters as tiles. The chapter is a PDF
     and nothing else, so opening one hands it straight to the reader that already
     knows how to draw a PDF \u2014 there is no second viewer here. */
  renderLearning(st) {
    const books = st.liveLearning || LEARNING;
    const open = books.find(b => b.id === st.learnBook) || null;
    const q = (st.learnQuery || '').trim().toLowerCase();

    if (!open) {
      return /*#__PURE__*/React.createElement("div", {
        style: { display: 'flex', flexDirection: 'column', gap: 12, marginTop: 20 }
      }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase',
          fontWeight: 700, color: onSurf('#1f5145')
        }
      }, 'Learning'), /*#__PURE__*/React.createElement("div", {
        style: { fontSize: 12.5, color: NEU.muted, marginTop: 3, lineHeight: 1.5 }
      }, 'Read the course books here, chapter by chapter.')),
      books.map(b => /*#__PURE__*/React.createElement("div", {
        key: b.id,
        onClick: () => this.setState({ learnBook: b.id, learnQuery: '' }),
        style: {
          display: 'flex', alignItems: 'center', gap: 14,
          background: NEU.surf, boxShadow: neuUp(), border: NEU.edge,
          borderRadius: 18, padding: 16, cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement("div", {
        "aria-hidden": "true",
        style: {
          flexShrink: 0, width: 48, height: 48, borderRadius: 14,
          background: '#e6efe9', color: onSurf('#1f5145'),
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }
      }, icon('book-open', { size: 22 })), /*#__PURE__*/React.createElement("div", {
        style: { flex: 1, minWidth: 0 }
      }, /*#__PURE__*/React.createElement("div", {
        style: { fontFamily: 'Spectral,serif', fontSize: 17, fontWeight: 600, color: NEU.ink, lineHeight: 1.25 }
      }, b.title), /*#__PURE__*/React.createElement("div", {
        style: { fontSize: 12.5, color: NEU.muted, marginTop: 3, lineHeight: 1.45 }
      }, b.sub), /*#__PURE__*/React.createElement("div", {
        style: {
          fontSize: 10.5, letterSpacing: .7, textTransform: 'uppercase', fontWeight: 700,
          color: onSurf('#1f5145'), marginTop: 7
        }
      }, `${(b.chapters || []).length} chapters`)), /*#__PURE__*/React.createElement("span", {
        "aria-hidden": "true",
        style: { flexShrink: 0, color: NEU.muted, fontSize: 20 }
      }, "\u203a"))));
    }

    /* Ordered by the number the book itself gives each chapter, falling back to
       the order they were listed in. A chapter numbered 0 is the cover, and 0 is
       a real position \u2014 hence the explicit check rather than a truthy one. */
    const chapters = [...(open.chapters || [])]
      .map((c, i) => ({ ...c, i }))
      .sort((a, b) => {
        const na = typeof a.no === 'number' ? a.no : Infinity;
        const nb = typeof b.no === 'number' ? b.no : Infinity;
        return na - nb || a.i - b.i;
      })
      .filter(c => !q || (c.title || '').toLowerCase().includes(q));

    return /*#__PURE__*/React.createElement(React.Fragment, null,
      /*#__PURE__*/React.createElement("div", {
        onClick: () => this.setState({ learnBook: null, learnQuery: '' }),
        style: {
          display: 'inline-flex', alignItems: 'center', gap: 7, minHeight: 44,
          padding: '10px 14px 10px 10px', borderRadius: 13, marginBottom: 12,
          background: NEU.surf, boxShadow: neuUp(.6), border: NEU.edge,
          color: onSurf('#1f5145'), fontSize: 13, fontWeight: 700, cursor: 'pointer'
        }
      }, /*#__PURE__*/React.createElement("span", { "aria-hidden": "true", style: { fontSize: 16 } }, "\u2039"), 'All courses'),

      /*#__PURE__*/React.createElement("div", {
        style: { marginBottom: 12 }
      }, /*#__PURE__*/React.createElement("div", {
        style: { fontFamily: 'Spectral,serif', fontSize: 21, fontWeight: 600, color: NEU.head, lineHeight: 1.2 }
      }, open.title), /*#__PURE__*/React.createElement("div", {
        style: { fontSize: 12.5, color: NEU.muted, marginTop: 3 }
      }, open.sub)),

      (open.chapters || []).length > 12 && /*#__PURE__*/React.createElement("div", {
        style: {
          display: 'flex', alignItems: 'center', gap: 10,
          ...neuWell(14, .8), padding: '0 14px', marginBottom: 14
        }
      }, icon('search', { size: 17, stroke: NEU.muted }), /*#__PURE__*/React.createElement("input", {
        value: st.learnQuery || '',
        onChange: e => this.setState({ learnQuery: e.target.value }),
        placeholder: 'Search ' + (open.chapters || []).length + ' chapters',
        "aria-label": 'Search chapters in ' + open.title,
        style: {
          border: 'none', outline: 'none', background: 'transparent', fontSize: 14,
          color: NEU.ink2, width: '100%', padding: '12px 0', minHeight: 44, boxSizing: 'border-box'
        }
      }), (st.learnQuery || '') && /*#__PURE__*/React.createElement("div", {
        onClick: () => this.setState({ learnQuery: '' }),
        "aria-label": "Clear search",
        style: {
          color: NEU.muted, cursor: 'pointer', fontSize: 20, lineHeight: 1,
          width: 44, height: 44, margin: -12, display: 'flex',
          alignItems: 'center', justifyContent: 'center', flexShrink: 0
        }
      }, "\u00d7")),

      /*#__PURE__*/React.createElement("div", {
        style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }
      }, chapters.map(c => /*#__PURE__*/React.createElement("div", {
        key: c.file,
        onClick: () => this.openReading('learning', {
          title: c.title,
          ref: open.title,
          pdf: LEARNING_BASE + open.id + '/' + c.file
        }),
        style: {
          background: NEU.surf, boxShadow: neuUp(), border: NEU.edge,
          borderRadius: 16, padding: '13px 13px 12px', cursor: 'pointer',
          display: 'flex', flexDirection: 'column', gap: 8, minHeight: 96
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: { display: 'flex', alignItems: 'center', gap: 6, minHeight: 20 }
      }, /* The badge carries the chapter number. Teaching Jurisprudence has no
           numbering, so every one of its tiles fell through to the word PDF —
           which every tile in the section is, so it distinguished nothing and
           just repeated itself down the grid. Numbered courses keep the badge;
           unnumbered ones show the title and the icon and nothing else. */
      typeof c.no === 'number' && /*#__PURE__*/React.createElement("span", {
        style: {
          fontSize: 10, letterSpacing: .7, textTransform: 'uppercase', fontWeight: 700,
          color: onSurf('#1f5145'), background: '#e6efe9', padding: '3px 7px', borderRadius: 6,
          whiteSpace: 'nowrap'
        }
      }, 'Ch ' + c.no), icon('book-open', { size: 14, stroke: '#8a8272', style: { marginLeft: 'auto', flexShrink: 0 } })),
      /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: 'Spectral,serif', fontSize: 14, fontWeight: 600, color: NEU.ink,
          lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical', overflow: 'hidden'
        }
      }, c.title)))),

      chapters.length === 0 && /*#__PURE__*/React.createElement("div", {
        style: { textAlign: 'center', padding: '34px 20px', color: NEU.muted, fontSize: 14 }
      }, `No chapter matching "${st.learnQuery}"`));
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
        color: onSurf('#1f5145'),
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
        background: NEU.sunk,
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
        color: NEU.head,
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
        color: NEU.label,
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
        color: NEU.muted,
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
        color: NEU.head,
        marginTop: 2
      }
    }, "Khums & Zakat")), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 6,
        background: NEU.sunk,
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
        color: NEU.muted,
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
        color: NEU.muted,
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
        color: NEU.muted,
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
        color: NEU.muted,
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
  /* \u2500\u2500 QIBLA \u2500\u2500
     Two questions, answered in the order a person actually asks them: which way
     do I turn from here, and how far off am I. The dial answers the first by
     rotating with the phone; the bearing beneath it answers the second and stays
     true whether or not the device has a usable compass. */
  renderQibla(st) {
    const { qiblaStatus, qiblaBearing, qiblaLat, qiblaLng, qiblaAcc, qiblaHeading, qiblaMotion } = st;
    const bearing = qiblaBearing;
    const heading = qiblaHeading;
    const cardinals = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const cardinal = bearing !== null ? cardinals[Math.round(bearing / 22.5) % 16] : null;
    const spin = st.qiblaSpin === null ? 0 : st.qiblaSpin;
    /* Signed, so the instruction can say which way to turn rather than making the
       reader work it out from a number between 0 and 360. */
    const turn = bearing === null || heading === null
      ? null
      : (((bearing - heading) % 360) + 540) % 360 - 180;
    const aligned = turn !== null && Math.abs(turn) <= 5;
    const distKm = qiblaLat !== null && qiblaLng !== null ? (() => {
      const R = 6371;
      const toRad = d => d * Math.PI / 180;
      const dLat = toRad(21.4225 - qiblaLat);
      const dLng = toRad(39.8262 - qiblaLng);
      const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(qiblaLat)) * Math.cos(toRad(21.4225)) * Math.sin(dLng / 2) ** 2;
      return Math.round(2 * R * Math.asin(Math.sqrt(a)));
    })() : null;
    const live = qiblaStatus === 'granted';
    const ring = aligned ? '#1f5145' : 'rgba(203,195,178,.85)';

    /* Called, not mounted as a component: a function defined inside render is a new
       type on every pass, and React would tear the dial down and rebuild it each
       time \u2014 which resets the rotation mid-transition and makes the needle jump. */
    const dial = () => /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        // 268 keeps a margin either side of a 320px phone once the page padding is taken
        width: 268,
        height: 268,
        borderRadius: '50%',
        // the needle group is a square that rotates, and its bounding box sticks out
        // past the circle on the diagonal — unclipped, that is a page you can drag sideways
        overflow: 'hidden',
        background: NEU.surf,
        border: NEU.edge,
        boxShadow: aligned
          ? neuUp(1.5) + ', 0 0 0 3px rgba(31,81,69,.28)'
          : neuUp(1.5),
        transition: 'box-shadow .35s ease'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 14,
        borderRadius: '50%',
        border: `1px ${aligned ? 'solid' : 'dashed'} ${ring}`,
        transition: 'border-color .35s ease'
      }
    }),
    /* 24 ticks, one every 15\u00b0: enough to read a turn against, few enough to stay
       quiet behind the needle. */
    Array.from({ length: 24 }).map((_, i) => /*#__PURE__*/React.createElement("div", {
      key: i,
      "aria-hidden": "true",
      style: {
        position: 'absolute',
        left: '50%',
        top: 20,
        width: 1,
        height: i % 6 === 0 ? 11 : 6,
        background: i % 6 === 0 ? '#b9ae95' : 'rgba(203,195,178,.9)',
        transformOrigin: '50% 114px',
        transform: `translateX(-50%) rotate(${i * 15}deg)`
      }
    })),
    [['N', { top: 34, left: '50%', transform: 'translateX(-50%)' }, '#6e2230'],
     ['S', { bottom: 34, left: '50%', transform: 'translateX(-50%)' }, NEU.muted],
     ['E', { right: 32, top: '50%', transform: 'translateY(-50%)' }, NEU.muted],
     ['W', { left: 32, top: '50%', transform: 'translateY(-50%)' }, NEU.muted]
    ].map(([lbl, pos, col]) => /*#__PURE__*/React.createElement("div", {
      key: lbl,
      "aria-hidden": "true",
      style: { position: 'absolute', fontSize: 12.5, fontWeight: 700, color: col, ...pos }
    }, lbl)),
    bearing !== null && /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        transform: `rotate(${spin}deg)`,
        transition: 'transform .32s cubic-bezier(.2,.8,.2,1)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 26,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 34,
        height: 34,
        borderRadius: 10,
        background: '#1c1a17',
        border: `2px solid ${aligned ? '#e8d39a' : '#d8b863'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 6px 14px -6px rgba(28,26,23,.6)'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: { width: 15, height: 10, border: '1.5px solid #d8b863', borderRadius: 1 }
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 0,
        height: 0,
        marginTop: 6,
        borderLeft: '9px solid transparent',
        borderRight: '9px solid transparent',
        borderTop: `20px solid ${aligned ? '#1f5145' : '#2c5d52'}`
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        width: 3,
        height: 62,
        background: `linear-gradient(${aligned ? '#1f5145' : '#2c5d52'},rgba(205,191,158,0))`
      }
    }))),
    /* The centre well is the one number that stays true with or without a compass. */
    /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        inset: '31%',
        borderRadius: '50%',
        background: NEU.surf,
        boxShadow: neuIn(.9),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
      }
    }, bearing !== null ? [
      /*#__PURE__*/React.createElement("div", {
        key: 'deg',
        style: {
          fontFamily: 'Spectral,serif',
          fontSize: 30,
          fontWeight: 600,
          color: aligned ? onSurf('#1f5145') : NEU.head,
          lineHeight: 1,
          transition: 'color .35s ease'
        }
      }, Math.round(bearing) + '\u00b0'),
      /*#__PURE__*/React.createElement("div", {
        key: 'card',
        style: {
          fontSize: 10,
          letterSpacing: 1.1,
          textTransform: 'uppercase',
          fontWeight: 700,
          color: NEU.muted,
          marginTop: 5
        }
      }, cardinal + ' from north')
    ] : icon(qiblaStatus === 'loading' ? 'locate-fixed' : 'compass', {
      size: 34, stroke: '#8a8272'
    })));

    const stat = (label, value) => /*#__PURE__*/React.createElement("div", {
      key: label,
      style: {
        flex: 1,
        minWidth: 0,
        background: NEU.surf,
        boxShadow: neuUp(),
        border: NEU.edge,
        borderRadius: 15,
        padding: '12px 13px'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10,
        letterSpacing: .7,
        textTransform: 'uppercase',
        color: NEU.muted,
        fontWeight: 700
      }
    }, label), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 16,
        fontWeight: 700,
        color: NEU.ink,
        marginTop: 4
      }
    }, value));

    const note = (mark, tone, text) => /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        gap: 11,
        alignItems: 'flex-start',
        background: tone.bg,
        border: `1px solid ${tone.edge}`,
        borderRadius: 16,
        padding: '13px 14px',
        marginTop: 12
      }
    }, icon(mark, { size: 17, stroke: tone.ink, style: { flexShrink: 0, marginTop: 1 } }),
    /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 12.5, color: tone.text, lineHeight: 1.55 }
    }, text));

    const GOLD = { bg: 'linear-gradient(120deg,#faf4e6,#f6efe0)', edge: '#ecdfc2', ink: '#a8873a', text: '#8a7846' };
    const GREEN = { bg: '#eef7f4', edge: '#c4ddd7', ink: '#1f5145', text: '#4a6b62' };

    return /*#__PURE__*/React.createElement("div", {
      style: { padding: '8px 20px 100px' },
      className: "afu"
    }, /*#__PURE__*/React.createElement("div", {
      style: { padding: '8px 56px 14px 0' }
    }, /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 13, color: NEU.muted, fontWeight: 500 }
    }, this.t('more.qiblaSub')), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 26,
        fontWeight: 600,
        color: NEU.head,
        marginTop: 2
      }
    }, this.t('qibla.title'))),

    /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', justifyContent: 'center', margin: '10px 0 4px' }
    }, dial()),

    /* One line that changes as you turn, announced rather than merely redrawn. */
    /*#__PURE__*/React.createElement("div", {
      role: "status",
      "aria-live": "polite",
      style: { textAlign: 'center', marginTop: 16, minHeight: 52 }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral,serif',
        fontSize: 22,
        fontWeight: 600,
        color: aligned ? onSurf('#1f5145') : NEU.head,
        lineHeight: 1.25
      }
    }, bearing === null
      ? (qiblaStatus === 'loading' ? this.t('qibla.detecting') : 'Direction not set yet')
      : heading === null
        ? `Face ${Math.round(bearing)}\u00b0 ${cardinal}`
        : aligned
          ? 'You are facing the Qibla'
          : `Turn ${turn > 0 ? 'right' : 'left'} ${Math.round(Math.abs(turn))}\u00b0`),
    /*#__PURE__*/React.createElement("div", {
      style: { fontSize: 12.5, color: NEU.muted, marginTop: 5 }
    }, bearing === null
      ? 'Allow location to calculate the bearing'
      : heading === null
        ? 'Bearing from true north \u00b7 turn with a compass'
        : 'Hold the phone flat and turn slowly')),

    /*#__PURE__*/React.createElement("div", {
      onClick: qiblaStatus === 'loading' ? undefined : this.locateQibla,
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 9,
        textAlign: 'center',
        padding: '14px',
        minHeight: 48,
        boxSizing: 'border-box',
        borderRadius: 16,
        background: qiblaStatus === 'loading' ? '#f0e8d6' : '#1f5145',
        color: qiblaStatus === 'loading' ? '#7d6220' : '#f3ead4',
        fontSize: 15,
        fontWeight: 700,
        cursor: qiblaStatus === 'loading' ? 'default' : 'pointer',
        margin: '16px 0 14px',
        boxShadow: qiblaStatus === 'loading' ? 'none' : '0 8px 18px -8px rgba(22,59,48,.5)'
      }
    }, icon(live ? 'rotate-ccw' : 'locate-fixed', { size: 18 }),
       qiblaStatus === 'loading' ? this.t('qibla.detecting')
       : live ? 'Recheck my position'
       : this.t('qibla.allow')),

    qiblaStatus === 'denied' && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        padding: '12px',
        borderRadius: 14,
        background: '#fdf0f2',
        border: '1px solid #dfc4ca',
        color: onSurf('#6e2230'),
        fontSize: 13,
        fontWeight: 600,
        marginBottom: 14
      }
    }, this.t('qibla.error')),

    qiblaStatus === 'nofix' && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        padding: '12px',
        borderRadius: 14,
        background: NEU.sunk,
        border: '1px solid #e2d3b4',
        color: onSurf('#7d6220'),
        fontSize: 13,
        fontWeight: 600,
        marginBottom: 14
      }
    }, 'Your position could not be read. Move outdoors or near a window and try again.'),

    qiblaStatus === 'unsupported' && /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'center',
        padding: '12px',
        borderRadius: 14,
        background: NEU.sunk,
        color: onSurf('#7d6220'),
        fontSize: 13,
        marginBottom: 14
      }
    }, this.t('qibla.unsupported')),

    /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', gap: 10, marginBottom: 10 }
    }, stat('Qibla bearing', bearing === null ? '\u2014' : bearing.toFixed(1) + '\u00b0'),
       stat(this.t('qibla.distance'), distKm === null ? '\u2014' : `\u2248 ${distKm.toLocaleString()} km`)),
    /*#__PURE__*/React.createElement("div", {
      style: { display: 'flex', gap: 10 }
    }, stat('Compass', heading === null ? 'Unavailable' : Math.round(heading) + '\u00b0'),
       stat('GPS accuracy', qiblaAcc === null ? '\u2014' : '\u00b1 ' + Math.round(qiblaAcc) + ' m')),

    /* Said plainly, because "the compass is not working" is the moment a person
       decides the whole screen is wrong. The bearing above is still correct. */
    live && heading === null && note('navigation', GOLD,
      qiblaMotion === 'denied'
        ? 'Motion access was declined, so the arrow cannot follow you. The bearing above is still correct \u2014 line it up using true north on a separate compass.'
        : 'No live compass on this device yet. The bearing above is still correct \u2014 line it up using true north on a separate compass. Some phones only report a heading once you move.'),

    note('shield-check', GREEN,
      'Your coordinates stay on this device and are never sent anywhere. For the best reading, hold the phone flat and step away from metal, magnets and speakers.'),

    /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: NEU.muted,
        lineHeight: 1.6,
        textAlign: 'center',
        marginTop: 16
      }
    }, 'The bearing is the great-circle direction from your GPS position to the Ka' + '\u02bf' + 'ba in Makkah.'));
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
    /* A photograph posted with nothing written on it. Every text field is checked
       rather than the title alone, because a story carrying only an āyah or only
       a caption still needs the words to stay readable. */
    const photoOnly = !!cur.photo && !isQuiz &&
      !['tag', 'title', 'sub', 'ar', 'body', 'cta'].some(k => String(cur[k] || '').trim());
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
        /* This layer used to darken the whole frame to keep white text readable
           over a photograph — including the middle, by a fifth, to protect words
           that were never there. Most posts here are a poster or a flyer, and the
           middle of one of those is the whole point of posting it.

           Nothing is dimmed now except to make something specific readable, and
           each piece carries its own: captionScrim on the caption block, which is
           as tall as the writing in it; a backing behind the name and the close ×
           (a fade alone left the way out of a bright photograph at 3:1); a
           drop-shadow on the progress bars. All that is left here is a short fade
           under the chrome, and on a solid-colour story the vignette it has
           always had. */
        background: cur.photo
          ? TOP_FADE
          : 'radial-gradient(120% 90% at 50% 0%,rgba(255,255,255,.14),rgba(0,0,0,.2))'
      }
    }), !photoOnly && /*#__PURE__*/React.createElement("div", {
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
        padding: '54px 16px 0',
        // outlines both the track and the fill, so the count of stories survives
        // a photograph that is white where the bars sit
        filter: cur.photo ? 'drop-shadow(0 1px 2px rgba(0,0,0,.6))' : 'none'
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
        padding: '16px 18px 0',
        // inherited by the name, the tag and the close ×, which sit on the thin
        // top fade rather than on a wash
        textShadow: cur.photo ? '0 1px 4px rgba(0,0,0,.6)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        background: cur.photo ? CHROME_PAD : 'transparent',
        borderRadius: 22,
        padding: cur.photo ? '3px 13px 3px 3px' : 0,
        margin: cur.photo ? '-3px 0 -3px -3px' : 0
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
        lineHeight: 1,
        borderRadius: '50%',
        background: cur.photo ? CHROME_PAD : 'transparent'
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
        /* marginTop rather than flex:1 so the block is only as tall as the words
           in it — its scrim is a background, and a background can only hug the
           text if the box does. It still sits at the foot of the frame. */
        marginTop: 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '80px 26px 40px',
        pointerEvents: 'none',
        background: cur.photo && !photoOnly ? captionScrim(isQuiz) : 'none',
        // inherited by every caption below; the CTA opts out, being dark on white
        textShadow: cur.photo ? '0 1px 3px rgba(0,0,0,.55), 0 2px 14px rgba(0,0,0,.4)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        letterSpacing: 1.4,
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,.88)',
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
        color: 'rgba(255,255,255,.93)',
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
          nahjBook: 'nahj',
          nahjTab: 'sermons',
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
        color: NEU.head,
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
        textShadow: 'none' // dark label on a white pill, so the inherited shadow would only smudge it
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
    /* The tone is a pair picked for a pale page: a saturated accent and the wash
       that goes under it. The wash still works as the glyph on the filled circle
       in either theme, but the accent is printed straight onto the card for the
       kicker and the chevron, and on a dark card it was 2.2:1 — dark ink on dark
       board. It has always been that; the wallpaper is what made it worth
       looking at. onSurf is the mechanism already built for exactly this. */
    const [ink, tint] = o.tone;
    const kick = onSurf(ink);
    return /*#__PURE__*/React.createElement("div", {
      onClick: o.onClick,
      className: "neu-press",
      style: {
        /* Today's reminder is one of the three surfaces that stay raised; the
           rest of these rows lie flat. */
        ...(o.lift ? neuCard(R.tile, .85) : neuFlat(R.tile)),
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
        ...neuDisc(ink)
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
        color: kick
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
        color: kick,
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
        lift: true,
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
        ...neuFlat(R.tile),
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
        color: onSurf('#7d6220')
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
      shadow: 'none',
      ink: '#f9ece7',
      sub: 'rgba(249,236,231,.74)',
      chip: '#ff7566',
      kicker: 'Live now'
    } : ahead ? {
      bg: 'linear-gradient(135deg,#24604f 0%,#193f34 100%)',
      shadow: 'none',
      ink: '#f3ead4',
      sub: 'rgba(243,234,212,.72)',
      chip: '#d8b863',
      kicker: s.label || 'Upcoming'
    } : {
      ...neuFlat(R.tile),
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
        borderRadius: R.tile,
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
        color: NEU.head,
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
        color: onSurf('#1f5145'),
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
        color: NEU.head,
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
        color: NEU.muted,
        marginTop: 2
      }
    }, d.en)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: NEU.muted,
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
        color: NEU.muted,
        fontWeight: 600
      }
    }, free ? 'Hundreds completed: ' : 'Rounds completed: ', /*#__PURE__*/React.createElement("span", {
      style: {
        color: onSurf('#1f5145'),
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
        color: onSurf('#6e2230'),
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
        color: NEU.head,
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
    /* The mosque in the wallpaper stands where the bar does. An opaque bar cut it
       off at the knees, so on home the bar is frosted too and the silhouette
       carries on behind the labels. */
    const glass = st.screen === 'home';
    return /*#__PURE__*/React.createElement("nav", {
      className: "abi-nav",
      "aria-label": "Primary",
      style: {
        flexShrink: 0,
        background: glass ? (st.dark ? NEU_D.glass : NEU_L.glass) : st.dark ? NEU_D.bg : NEU.bg,
        ...(glass ? FROST : null),
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
    /* Exactly one screen is built below, so this names the one being built. The
       wallpaper is the home screen's alone: every other screen is a working
       surface — a timetable, a reader, an admin form — and a picture behind a
       form is something to see past rather than something to look at. */
    const onHome = st.screen === 'home';
    GLASS = onHome;
    return /*#__PURE__*/React.createElement("div", {
      className: "app",
      dir: isRtl ? 'rtl' : 'ltr',
      style: {
        background: st.dark ? NEU_D.bg : NEU.bg
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: "#abi-main",
      className: "abi-skip"
    }, "Skip to content"), onHome && homeBackdrop(st.dark), /*#__PURE__*/React.createElement("main", {
      id: "abi-main",
      className: "s",
      style: {
        flex: '1 1 auto',
        overflowY: 'auto',
        overflowX: 'hidden',
        position: 'relative',
        // transparent on home, or the scroller would paint the page tone straight
        // over the wallpaper sitting behind it
        background: onHome ? 'transparent' : st.dark ? NEU_D.bg : NEU.bg
      }
    }, showBrand && this.renderBrandMark(), st.screen === 'home' && this.renderHome(st, next, cd, greg, hijri, salaam), st.screen === 'prayer' && this.renderPrayer(st, next, cd, greg), st.screen === 'library' && this.renderLibrary(st), st.screen === 'reading' && this.renderReading(st), st.screen === 'classifieds' && this.renderClassifieds(st), st.screen === 'more' && this.renderMore(st), st.screen === 'about' && this.renderAbout(), st.screen === 'location' && this.renderLocation(st), st.screen === 'offline' && this.renderOffline(), st.screen === 'admin' && this.renderAdmin(st), st.screen === 'calendar' && this.renderCalendar(st), st.screen === 'kids' && this.renderKids(st), st.screen === 'health' && this.renderHealth(st), st.screen === 'qibla' && this.renderQibla(st), st.screen === 'khums' && this.renderKhums(st), st.screen === 'tasbeeh' && this.renderTasbeeh(st), st.screen === 'wallpaper' && this.renderWallpaper(st), st.screen === 'infallibles' && this.renderInfallibles(st), st.screen === 'mosques' && this.renderMosques(st), st.screen === 'report' && this.renderReportIssue(st), st.screen === 'stories' && this.renderStories(st)), st.adhanPending && /*#__PURE__*/React.createElement("div", {
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
runStorageMigrations();
ReactDOM.createRoot(document.getElementById('root')).render(/*#__PURE__*/React.createElement(App, null));
