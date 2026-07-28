# Product

## Register

product

## Users

Members of the Ahlul Bayt Ireland community in Dublin — a Shia Muslim congregation spanning three generations who mostly reach this as an installed PWA on a phone, one-handed, often in or on the way to the centre.

Three groups matter most:

- **Older members.** The reason legibility outranks density everywhere in this app. Small type, thin strokes and 30px tap targets fail them first. When a choice is between fitting more on screen and being readable at arm's length in a bright room, readable wins.
- **Children and families.** Kids Corner, the quiz and the wallpapers are theirs. Forgiving tap targets, obvious feedback, and colour that signals where you are.
- **Everyone, at speed.** The most common visit is seconds long: what's the next prayer, is there a majlis tonight, what's on this day. That path must never require reading.

Secondary but critical: a **single volunteer admin** maintaining every piece of content from the same phone, through the in-app dashboard. They are not a CMS operator. Saves publish live to the whole community immediately, so the admin surface has to be hard to get wrong.

## Product Purpose

A calm companion for prayer, supplication and community life. It answers the recurring daily questions — prayer times, the Islamic date, what is happening at the centre — and holds the library the community reads from: duʿāʾ, ziyārah, daily aamals, books, kids' material.

It succeeds when someone opens it, gets their answer, and closes it without thinking about the app. It fails when it makes a person hunt, squint, or wonder whether they tapped the right thing.

Offline is not a feature here, it's the baseline: a service worker serves the whole shell, because the building has poor signal and prayer times must not depend on the network.

## Brand Personality

**Calm, warm, unhurried.**

Voice is plain and respectful. No exclamation marks, no marketing register, no cleverness. Religious terms carry their proper diacritics (Duʿāʾ, Ziyārah, Ṣalawāt, Ramaḍān) — getting them right is a form of respect and the community notices.

Emotionally the app should feel like the centre itself: soft light, warm materials, nothing shouting. Reverence without solemnity — Kids Corner is allowed to be playful.

## Anti-references

- **Startup SaaS.** Gradient heroes, big metrics, purple-blue tech palettes, "Elevate your practice" copy. This is a community noticeboard, not a product launch.
- **Institutional mosque websites.** Dense navy-and-gold tables, clip-art domes, three competing scripts, 2009 gradients.
- **Gamified faith apps.** Streaks, badges, notifications engineered for retention. The tasbeeh counter counts; it does not congratulate you for a 40-day streak.
- **Anything that reads as generated.** Identical card grids, an uppercase tracked eyebrow above every section, decorative glassmorphism.

## Design Principles

1. **Legibility outranks density.** Three generations use this. If a value has to give, give up the fitted-in extra row, not the readable line. Nothing sub-10px, nothing under 4.5:1, nothing you have to aim for.
2. **Depth carries state, colour carries meaning.** Raised means available, pressed means selected. Colour is reserved for what a thing *is* — a section's identity, a live majlis, an event type — never for decoration.
3. **The common path is wordless.** Next prayer, today's date, tonight's majlis should be readable from across the table without parsing a sentence.
4. **The admin cannot be allowed to break the community's app.** Every publishing action is live to everyone. Validate before saving, confirm what was saved, keep destructive actions distinguishable from routine ones.
5. **Reverence is in the details.** Correct diacritics, correct Arabic face, correct Hijri date, correct attribution. Sloppiness here reads as disrespect in a way it wouldn't in a normal app.

## Accessibility & Inclusion

Target: **WCAG 2.1 AA**, with two deliberate over-shoots for this audience.

- **Contrast.** Body and secondary text ≥ 4.5:1; the muted ink was darkened to `#6b6252` specifically to clear it on the page tone. Placeholder text held to the same bar, not the browser default grey.
- **Touch targets.** 44×44 CSS px minimum for anything tappable. Older hands and children's hands both miss small targets; this is the accommodation that matters most here.
- **Type floor.** No interactive or informational text below 10px, and nothing below 14px for reading content. The reader's own text-size control runs 60%–150% on top of that.
- **Keyboard and screen reader.** Every interactive element exposes a role, an accessible name and a visible focus ring, and activates on Enter and Space. The app is built from tappable `div`s, so this is provided by an enhancement layer rather than per-element markup.
- **Motion.** `prefers-reduced-motion: reduce` flattens all animation and transition. No motion is required to understand any state.
- **Language.** Five languages (English, العربية, हिन्दी, فارسی, Urdu) with correct RTL direction. Arabic renders in Noto Naskh Arabic / Amiri, never in a Latin fallback.
