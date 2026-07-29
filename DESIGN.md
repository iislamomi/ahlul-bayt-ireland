# Design

Neumorphic soft UI on a warm sand page. Depth, not colour, carries interactive state: surfaces sit at the page tone and are raised or pressed by a paired shadow from one fixed light source. Colour is reserved for meaning.

## Theme

**Light, warm-neutral, single fixed light source (top-left).**

The page tone (`#ece5d8`) is deliberately deeper than a near-white so both the highlight and the shade have room to read. Every card, chip, tab, button and dial sits on that same tone; what distinguishes them is whether they stand out of the page or sink into it.

There is a **dark mode** (`st.dark`, persisted) with its own token pair, currently reaching the reader and library surfaces.

## Color

Tokens live in `app.js` as `NEU` / `NEU_D`, mirrored as CSS variables in `index.html`. Change both together.

### Surface (light)

| Token | Value | Role |
|---|---|---|
| `NEU.bg` / `--neu-bg` | `#ece5d8` | Page |
| `NEU.surf` | `#ece5d8` | Raised surfaces — same tone as the page |
| `NEU.sunk` | `#e6dfd1` | Wells: inputs, tracks, image frames |
| `NEU.hi` / `--neu-hi` | `#fffbf0` | Highlight, top-left |
| `NEU.lo` / `--neu-lo` | `#cbc3b2` | Shade, bottom-right |
| `NEU.edge` | `1px solid rgba(255,255,255,.55)` | Soft top-light rim |
| `NEU.rule` | `1px solid rgba(203,195,178,.5)` | Divider |

### Surface (dark)

`NEU_D`: bg/surf `#1a1d1f`, sunk `#171a1b`, hi `#252a2d`, lo `#0e1011`.

### Ink

| Token | Value | Contrast on page | Role |
|---|---|---|---|
| `NEU.ink` | `#2c2823` | 11.7:1 | Body, titles |
| `NEU.muted` | `#6b6252` | 4.8:1 | Secondary, captions, meta, inactive nav, chevrons |
| — | `#75601f` | 4.9:1 | Gold secondary: prayer glyphs, Hijri labels |

There is no lighter tier. Both values sit where they do precisely to clear 4.5:1 on `#ece5d8`; every colour that used to sit between them (`#a1977f`, `#b1a690`, `#c2a35a`, `#a89d88`, `#cdbf9e`, `#6f675a`) failed and was folded into these two. **Do not reintroduce a lighter grey for "elegance".**

### Accent

`NEU.accent` `#1f5145` (deep green, 7.2:1) — primary actions, current selection, live state indicators. One accent; everything else is identity colour.

### Identity colours

Not a palette — a lookup. Each names a *thing*, and the same hue means the same thing wherever it appears (Explore pebble, library tab tint, event dot, reader accent).

| Section | Ink | Tint |
|---|---|---|
| Duʿāʾ | `#7d6220` | `#f5eeda` |
| Ziyārah | `#6e2230` | `#f5e7e9` |
| Books | `#2c5d52` | `#e6f0eb` |
| Daily Amaals | `#8a4b2c` | `#f7ebe2` |
| Kids Corner | `#c06014` | `#fbe9dc` |
| Quiz | `#8a2f52` | `#f7e6ed` |
| Health | `#3f7a45` | `#e9f2e7` |
| Classifieds | `#7a5c9e` | `#efe9f5` |
| Tasbeeh | `#3a4a78` | `#e9ecf5` |
| Wallpapers | `#2f6f7a` | `#e5f0f2` |
| Khums & Zakat | `#7a6a2c` | `#f2eede` |
| Qibla | `#1f5145` | `#e4efe9` |
| Calendar | `#b8923f` | `#f7efdd` |

Event types carry their own set (`EVENT_COLORS` / `EVENT_TINTS`), including Historical Event `#7a5c9e`.

**Identity colours are never used for label text at small sizes** — several fall under 4.5:1 at 9.5px. They live in fills, dots and pebbles; labels stay `NEU.ink`. Where a category colour does have to carry text (a classifieds badge), `CAT_INK` maps it to a text-safe value at render time, because listings store the colour they were saved with.

### Semantic

Live / urgent `#c0392b`–`#ff7566`; destructive `#6e2230`; gold accent on dark surfaces `#d8b863`.

## Typography

Three families on a clear contrast axis. One sans carries all UI; the serif is reserved for titles; Arabic has its own faces.

| Family | Use |
|---|---|
| **Hanken Grotesk** (400/500/600/700) | All UI: body, labels, buttons, data, numerals |
| **Spectral** (400/500/600, italic 400) | Screen titles, card headings, prayer names |
| **Noto Naskh Arabic** (400/500/700) | Arabic scripture and duʿāʾ text |
| **Amiri** (400/700) | Arabic prayer glyphs and short marks |

Fixed rem/px scale, not fluid — this is product UI at consistent phone DPI.

| Step | Size | Use |
|---|---|---|
| Screen title | 26px Spectral 600 | Page headers |
| Card heading | 15.5–20px Spectral 600 | Card titles, prayer name |
| Body | 13.5–14px | Lists, rows, reader translation |
| Label | 12–13px 600 | Buttons, chips, tabs |
| Meta | 11–12px | Timestamps, categories, counts |
| Kicker | 9.5px 800, `letter-spacing: 1.3` uppercase | Section state labels only |

Reader text scales 0.6×–1.5× via the in-app control; Arabic and its embedded Latin lines scale together.

**Floors:** nothing informational below 10px. Reading content ≥ 14px.

## Layout

- **Frame:** single column, `max-width: 430px`, full-bleed below 480px. Fixed bottom nav, scrolling content area.
- **Gutter:** 20px page padding throughout. Cards align to it; nothing hangs off it.
- **Rhythm:** 8/10/12/14/16/18/26px vertical gaps. Related items 8–12px, sections 14–18px, across a boundary 26px.
- **Radii:** 9–11px controls · 13–16px cards and ribbons · 20px chips · 26px hero surfaces · 50% pebbles. Inner elements are tighter than their container.
- **Grid:** Explore (6) and Tools (5) are 3-column grids of 123×98 tiles. Library and content lists are 1D flex.
- **Home order:** the page leads with what to do now — date, on this day, happening now, updates, next prayer, prayer times, then three full-width lead-in tiles (today's amaal, continue reading, take a quiz), then the Explore and Tools grids.
- **Touch targets:** 44×44 minimum.

## Components

Two states express nearly everything:

- **Raised** — `neuCard(radius, depth)` / `neuUp(depth)`. Available, actionable, at rest.
- **Pressed** — `neuWell(radius, depth)` / `neuIn(depth)`. Selected, or a well: inputs, tracks, image frames, the icon pebble.

Depth `d` scales the extrusion: `.4` pebble · `.55` chip · `.72` tab · `.8–1` card · `1.6` hero.

- **Tabs** (Library, Kids, admin): icon + label; selected presses into the page and its icon lifts out of it.
- **Chips**: raised at rest, pressed when active; label takes the section accent, never a fill.
- **Buttons**: raised; primary takes the accent as a fill, destructive takes `#6e2230` as ink.
- **Inputs**: sunken wells, soft white rim, no visible border.
- **Toggles**: sunken groove, raised knob, accent fill when on.
- **Home lead-in tiles** (`renderHomeTile`): full-width row, recessed pebble left, kicker + title + detail centre, chevron right, all in that section's identity colour. One per thing-to-do-next; they are the answer to "where do I start".
- **Coloured surfaces** (Next Prayer, live majlis, On this day) carry `neuUpOn(rgb, d)` — the shade takes the surface's own hue so one light source still reads.

## Motion

150–250ms, `ease` or `cubic-bezier(.2,.8,.2,1)`. Motion conveys state only.

| Pattern | Use |
|---|---|
| `fu` fade-up 380ms | Screen entry; Explore tiles stagger 26ms apart |
| `po` pop 300ms | Toasts, count changes |
| `su` slide-up 320ms | Sheets |
| Shadow crossfade 180–200ms | Raised ↔ pressed on tabs and chips |
| `live-dot` / `live-ring` | Live majlis only — the one looping animation in the app |

Press feedback is global: any element with inline `cursor: pointer` dims slightly on `:active`; `.neu-press` and `.neu-tap` add a real inset for raised surfaces.

`prefers-reduced-motion: reduce` flattens every animation and transition app-wide.

## Texture

A fixed SVG grain overlay (`.app::after`, opacity .28, `pointer-events: none`) sits above the content. Without it the large same-tone fields read as plastic.

## Accessibility layer

Every control in the app is a tappable `div`. Rather than thread roles through
twelve thousand `createElement` calls, `enhanceTappables()` walks the DOM after
each render and turns anything carrying an inline `cursor: pointer` into a real
button: `tabindex="0"`, `role="button"`, and an accessible name (falling back to
`SYMBOL_LABELS` when the only content is a glyph like × or ›). Elements that
contain their own controls are skipped, so focus lands on the thing you press.

A single delegated `keydown` maps Enter and Space onto `click()`. A
`MutationObserver` on `.app` re-runs the sweep on structural change, debounced
16ms — trailing, always rescheduling, because a leading-edge guard can be
swallowed by timer throttling in a background tab.

**Consequences for new code:** give a control an inline `cursor: pointer` and it
becomes keyboard-operable for free. If its only content is an icon or a glyph,
add an explicit `aria-label` — nothing else can infer one. Toggles should carry
`role="switch"` and `aria-checked` themselves.

Floors held across all 17 screens: 44×44 targets, 4.5:1 text, nothing under
10px. The two home date ribbons are the deliberate exception at 191×31 — wide,
slim by request, and past the 24×24 minimum.

## Conventions

- `app.js` is hand-edited **pre-transpiled** `React.createElement` output. There is no JSX source and no build step. Match the surrounding call style.
- All styling is inline objects. Tokens come from `NEU` / `NEU_D` and the `neu*` helpers — do not hard-code surface or shadow values.
- Icons are Lucide, kept verbatim in the `LUCIDE` table and drawn via `icon(name, opts)`. Section identity uses emoji, deliberately, because it carries colour.
- The service worker caches the shell. **Bump `CACHE` in `sw.js` on every change** or users keep the old build.
