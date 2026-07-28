# Ahlul Bayt Ireland

A calm companion for prayer, supplication and community life — the PWA for the
Ahlul Bayt Ireland community in Dublin.

Prayer times and the Islamic date, the community calendar, a library of duʿāʾ,
ziyārah, daily aamals and books, Kids Corner, classifieds, a tasbeeh counter and
wallpapers. Everything is editable from an in-app admin dashboard that publishes
straight to the community.

## Running it

There is **no build step**. Serve the directory over HTTP and open it:

```bash
python -m http.server 8777
```

Then visit `http://localhost:8777`.

`file://` will not work — the service worker needs a real origin.

## How it is put together

| File | What it is |
|---|---|
| `index.html` | Shell, CSP, fonts, and all global CSS |
| `app.js` | The entire application, ~12k lines |
| `sw.js` | Service worker: caches the shell for offline use |
| `manifest.json` | PWA manifest |
| `vendor/` | React and ReactDOM, vendored — no npm install |
| `PRODUCT.md` | Who this is for and what it is trying to be |
| `DESIGN.md` | The visual system: tokens, type, components, motion |

**`app.js` is hand-edited, pre-transpiled `React.createElement` output.** There
is no JSX source anywhere; this file *is* the source. Match the surrounding call
style when editing, and run `node --check app.js` before committing.

All styling is inline style objects. Colours and shadows come from the `NEU` /
`NEU_D` token blocks and the `neu*` helpers at the top of `app.js` — read
`DESIGN.md` before hard-coding a value.

## Two things that will catch you out

**The service worker caches everything.** Bump `CACHE` in `sw.js` on every
change or returning users keep the old build. To see local edits, unregister the
worker and clear caches *before* reloading — a plain refresh serves the old
`app.js`.

**Admin saves are live.** The dashboard writes straight to Supabase and the
whole community sees it immediately. There is no staging copy. When testing
admin screens, inject state rather than pressing Save.

## Content

Live content syncs from Supabase and falls back to `localStorage`, then to the
seed data in `app.js`. Prayer times come from the Aladhan API using the Jaʿfarī
(Leva Institute, Qum) method for Dublin, with a bundled preset as fallback.
Wallpapers are fetched from the Unsplash CDN; attribution is required by their
licence and is shown in the viewer.

## Deployment

Pushing to `main` deploys to Vercel: <https://ahlul-bayt-ireland.vercel.app>.
The `*.vercel.app` preview and branch URLs sit behind Vercel Authentication, so
verify against the production URL above rather than a preview link.
