# Design

Visual system for the Ahlul Bayt Ireland PWA. Theme: **Dusk & Sunset** — the palette of a twilight horizon: slate blue-grey darks, warm apricot/terracotta accents, soft cream paper surfaces. Introduced on the `ui-refresh` branch, replacing the previous green/gold identity.

## Color

All colors are inline hex in `app.js` (no build step, no CSS variables). Change a color by replacing its hex everywhere — roles are consistent.

### Core roles

| Role | Hex | Notes |
|---|---|---|
| App background | `#f6f1e7` | Warm paper; whole-app body |
| Card surface | `#fffdf9` | Cards, sheets, inputs |
| Card border | `#ece4d4` | Hairlines on cream |
| Ink | `#2c2823` / `#27241f` | Headings, body |
| Muted ink | `#9a8f7c` / `#6f675a` | Secondary text |
| **Primary (slate)** | `#334a5e` | Buttons, active states, links; was `#1f5145` |
| Primary deep | `#243646` | Dark panels, status bar, `#root` letterbox |
| Slate secondary | `#476478` | "Programme" event type, secondary surfaces |
| **Accent (apricot)** | `#e8a765` | Kickers on dark, stars, highlights; was `#d8b863` |
| Apricot deep | `#d99a5e` / `#b26b35` | Hijri labels; ochre ink on tints |
| **Terracotta** | `#8f4126` | Destructive/secondary accent; was maroon `#6e2230` |
| Indigo-slate | `#4a5a74` | "Dua e Kumail" type, Services category |
| Historical purple | `#7a5c9e` | Historical Event type |
| Cream-on-dark text | `#f3ead4` | Text over slate panels |

### Tints (light chips/backgrounds)

`#e7ecf1` (slate), `#f6e8d8` (apricot), `#f7e9e0` (terracotta), `#e8ecf2` (indigo), `#eee8f5` (purple). Paired with their role color as text.

### Semantic (unchanged by theme)

Success `#2e7d43` on `#e4f3e7`; error `#a33636` on `#fbe9e9`; live/alert dot `#c0392b`.

### Signature gradients

- **Dusk sky (prayer hero):** `linear-gradient(178deg,#26374a 0%,#334a5e 44%,#6d5450 68%,#c97c4e 88%,#e8a765 100%)` with layered mountain-silhouette SVG paths (`rgba(38,55,74,.55)`, `rgba(30,43,58,.85)`) and a radial sun glow at the horizon.
- **Home prayer ribbon:** same idea compressed — `linear-gradient(176deg, slate → rust → sunset)` with a single low ridge.
- **Story ring:** `conic-gradient(from 210deg,#e8a765,#334a5e,#8f4126,#e8a765)`.
- **Glass ribbons (home):** translucent cream/slate fills + `backdrop-filter: blur(16px) saturate(170%)`.

## Typography

- **Display / headings:** Spectral (serif), 600. Page titles 26px.
- **UI / body:** Hanken Grotesk, 400–800. Body 13–14px, labels 10–11.5px.
- **Arabic / Urdu / Farsi:** Noto Naskh Arabic, fallback Amiri. Reader Arabic 30px × user scale (0.6–1.5), line-height 1.9.
- Uppercase kickers: 8–11px, letter-spacing 1–1.5, weight 700–800. Used on dark panels and section labels only.

## Shape & Elevation

- Radius scale: 13–16px ribbons/cards, 18–22px feature cards, 9–12px buttons/inputs, 50% avatars/dots.
- Shadows are tinted to the surface hue (e.g. `rgba(36,54,70,.7)` under slate panels, `rgba(60,50,30,.5)` under cream glass). No pure-black shadows.
- Glass treatment (home ribbons only): translucent fill, 1px `rgba(255,255,255,.65)` border, inset highlight.

## Motion

- Micro-transitions 150–300ms ease; keyframes `fu` (fade-up), `po` (pop), `su` (sheet up), `notif-in`.
- Billboard cross-fade 600ms every 5s; quiz countdown bar `width 1s linear`.
- No orchestrated page-load sequences; screens render instantly.

## Components

- **Bottom nav:** frosted cream bar, slate active state.
- **Home ribbons:** slim glass rows (calendar tiles, On this day, Majlis Live) ≤ 76px tall.
- **Event types:** Community `#334a5e`, Majlis `#8f4126`, Class `#b26b35`, Programme `#476478`, Dua e Kumail `#4a5a74`, Friday Prayer `#8a4b2c`, Historical Event `#7a5c9e` — each with matching tint.
- **Kids tabs:** icon cards (🎬📚💡🎯) with per-tab ink+tint; selected card lifts 1px with tinted shadow.
- **Admin:** plain cream forms, slate Save buttons, terracotta destructive actions.

## Do not

- Reintroduce the old green (`#1f5145`) or gold (`#d8b863`) anywhere.
- Mix cool grays into the cream neutral family.
- Add borders thicker than 1.5px or side-stripe accents.
- Animate layout properties; transform/opacity only.
