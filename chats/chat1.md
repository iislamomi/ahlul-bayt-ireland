# Scripture reading app design

_Started 2026-06-18 16:17 UTC_

---

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "Untitled"
The project currently has no files except possibly dotfiles — a `list_files` on the project root would return nothing else.
Current date is now June 18, 2026
</system-info>

<default aesthetic_system_instructions>
The user has not attached a design system. If they have ALSO not attached references or art direction, and the project is empty, you must ASK the user what visual aesthetic they want. Use the questions_v2 tool to ask about preferred vibe, audience, colors, type, mood, etc. Do NOT just pick your own visual aesthetic without getting the user's aesthetic input -- this is how you get slop!

Once answered, use this guidance when creating designs:
- Choose a type pairing from web-safe set or Google Fonts. Helvetica is a good choice. Avoid hard-to-read or overly stylized fonts. Use 1-3 fonts only.
- Foreground and background: choose a color tone (warm, cool, neutral, something in-between). Use subtly-toned whites and blacks; avoid saturations above 0.02 for whites.
- Accents: choose 0-2 additional accent colors using oklch. All accents should share same chroma and lightness; vary hue.
- NEVER write out an SVG yourself that's more complicated than a square, circle, diamond, etc.
- For imagery, never hand-draw SVGs; use subtly-striped SVG placeholders instead with monospace explainers for what should be dropped there (e.g. “product shot”)

CRITICAL: ignore default aesthetic entirely if given other aesthetic instructions like reference images, design systems or guidance, or if there are files in the project already.
</default aesthetic_system_instructions>

<pasted_text name="Pasted text (432 lines)">
You are a senior UI/UX designer, mobile app designer, Islamic community product designer, and frontend design specialist.

Design a complete UI concept for a mobile-first Progressive Web App called:

# Ahlul Bayt Ireland

This is a community-based Islamic web app for the Shia Muslim community living in Ireland.

The app should feel:

* Minimal
* Calm
* Respectful
* Premium but not flashy
* Community-focused
* Easy for elders and youth to use
* Clean and modern
* Spiritually warm
* Not overly decorative
* Not generic
* Not like a standard mosque template

The design should be suitable for a real PWA/web app, not just a landing page.

---

## Core Product Features

Design the UI for these V1 features:

1. Home dashboard
2. Prayer times
3. Dua library
4. Ziyarah library
5. Nahj al-Balagha library
6. Instagram-style story updates
7. Community classified business cards
8. Admin CMS interface
9. PWA install-friendly mobile experience

Do not include donations, public login, payments, audio, event booking, or user-generated posts in V1.

---

## Brand Direction

Brand name:

Ahlul Bayt Ireland

Audience:

Shia Muslim community in Ireland.

Design inspiration:

* Minimal Islamic design
* Subtle Karbala/Hussainia feeling
* Modern community app
* Calm reading experience for religious text
* Premium mobile app layout
* Clean cards and soft spacing

Avoid:

* Heavy Islamic patterns
* Overuse of green/gold
* Mosque-template look
* Loud gradients
* Too many icons
* Cluttered homepage
* Social media-style chaos
* Corporate SaaS feeling

---

## Colour Direction

Create a refined colour palette.

Suggested base direction:

* Background: warm off-white or soft ivory
* Primary text: deep charcoal or soft black
* Accent: deep green, muted gold, or maroon
* Secondary surfaces: light beige, soft grey, or muted cream
* Alert/active state: elegant gold or deep green
* Avoid neon colours

The colour palette should feel Islamic, elegant, and calm without becoming old-fashioned.

---

## Typography

Use typography that feels readable, respectful, and premium.

Requirements:

* Clear English font for interface text
* Beautiful readable Arabic typography for scripture
* Arabic text should be larger with generous line height
* English translation should be clearly separated from Arabic
* Headings should feel elegant but not decorative
* Body text must be easy to read on mobile

---

## Main Screens to Design

### 1. Home Screen

Design a mobile-first home screen with:

* Top greeting/header
* App name: Ahlul Bayt Ireland
* Today’s Gregorian date
* Today’s Hijri date
* Next prayer highlight card
* Full today prayer times summary
* Story bubbles near the top
* Quick access cards:

  * Prayer Times
  * Dua
  * Ziyarah
  * Nahj al-Balagha
  * Classifieds
* Small announcement card
* Bottom navigation

The home screen must immediately answer:

“What is the next prayer and what is happening in the community today?”

---

### 2. Prayer Times Screen

Design:

* Today’s prayer card
* Next prayer countdown
* Prayer time list:

  * Fajr
  * Sunrise
  * Dhuhr
  * Sunset
  * Maghrib
  * Midnight
* Monthly view tab
* Yearly calendar/PDF button
* Source note area: “Following Ahlul-Bait Ireland prayer timing”
* Clean mobile table design

The prayer screen should be extremely readable and trustworthy.

---

### 3. Dua Library Screen

Design:

* Search bar
* Category chips
* List of Dua cards
* Clean detail page
* Arabic scripture section
* English translation section
* Text size controls
* Share button

No audio player in V1.

The reading experience should feel calm and focused.

---

### 4. Ziyarah Library Screen

Design similar to Dua but with its own visual identity.

Include:

* Search
* Category filters
* Ziyarah cards
* Detail reading screen
* Arabic text
* English translation
* Text size controls

---

### 5. Nahj al-Balagha Screen

Design:

* Tabs for:

  * Sermons
  * Letters
  * Sayings
* Search bar
* Content cards
* Detail page
* Arabic text if available
* English translation
* Reference number
* Summary section

The design should feel like a serious reading library.

---

### 6. Story Updates

Design Instagram-style stories but make them respectful and community-focused.

Requirements:

* Circular story bubbles
* Story preview with title
* Full-screen story viewer
* Image/text story layout
* Progress bar
* Close button
* Optional link button
* Stories expire after 24 hours

Avoid making it look childish or too social-media heavy.

---

### 7. Classifieds Screen

Design a community business card section.

Each card should show:

* Business name
* Category
* Short description
* Location
* WhatsApp/call button
* Optional logo/image
* Website button if available

Include:

* Search
* Category filters
* Clean card grid/list
* Disclaimer: “Listings are shared for community information only.”

The design should feel community-supportive, not like a commercial marketplace.

---

### 8. Admin CMS Dashboard

Design a simple admin dashboard.

Admin modules:

* Prayer Times
* Hijri Date
* Dua
* Ziyarah
* Nahj al-Balagha
* Stories
* Classifieds
* Media Library
* Settings

Dashboard should include:

* Summary cards
* Quick actions
* Recent activity
* Expiring stories
* Active classifieds
* Prayer calendar status

Admin UI should be practical, clean, and easy for non-technical admins.

---

### 9. Admin Content Forms

Design form screens for:

* Add/edit prayer time
* Import yearly prayer calendar
* Add/edit Dua
* Add/edit Ziyarah
* Add/edit Nahj item
* Add/edit story
* Add/edit classified card

Form style:

* Clean
* Spacious
* Clear labels
* Preview before publish
* Save as draft
* Publish/unpublish controls
* Archive option

---

## Navigation

Design mobile navigation.

Recommended bottom nav:

1. Home
2. Prayer
3. Library
4. Stories
5. More

Library can include:

* Dua
* Ziyarah
* Nahj al-Balagha

Desktop navigation should be simple and not overcrowded.

---

## UI Components Required

Create reusable component designs for:

* Prayer time card
* Next prayer countdown
* Story bubble
* Story viewer
* Quick access card
* Islamic content card
* Arabic text block
* English translation block
* Text size control
* Search bar
* Category chips
* Classified business card
* Admin table
* Admin form
* Status badge
* Publish controls
* Media uploader
* Bottom navigation
* Empty state
* Loading state
* Error state

---

## Accessibility Requirements

Design for:

* Elder users
* Mobile users
* Low-light reading
* Arabic readability
* Large tap targets
* Strong colour contrast
* Simple navigation
* Clear visual hierarchy

Include:

* Text size controls for religious content
* High readability scripture layout
* Clear buttons
* No tiny icons without labels

---

## PWA Design Requirements

The app should feel installable like a mobile app.

Include:

* App icon concept
* Splash screen idea
* Home screen layout
* Mobile safe-area spacing
* Offline fallback screen
* Install prompt/banner concept

---

## Output Required

Create a full UI/UX design specification.

Include:

1. Design concept summary
2. Colour palette
3. Typography direction
4. Mobile-first layout system
5. Component library
6. Public screen designs
7. Admin CMS screen designs
8. Navigation structure
9. PWA design notes
10. Accessibility notes
11. Design do’s and don’ts
12. Frontend implementation notes for Tailwind CSS

If possible, also create a visual HTML/Tailwind prototype for the main mobile screens:

* Home
* Prayer Times
* Dua Detail
* Story Viewer
* Classifieds
* Admin Dashboard

Use placeholder content only. Do not invent full religious scripture. Use short placeholder Arabic and English text where needed.

The final design should feel like a refined Islamic community app for Ahlul Bayt Ireland, not a generic mosque website.

</pasted_text>

<!-- The user explicitly selected the following skills for this project, as attachments to their message. These are not optional context — they define how you work. Use them. -->
<attached-skill name="Design Components">
This project uses Design Components: every design is a single streaming `Name.dc.html` file. The full authoring spec is in your system prompt under "Writing code — Design Components" — follow it. Author and edit `.dc.html` content with the `dc_write`, `dc_html_str_replace`, `dc_js_str_replace`, and `dc_set_props` tools (not `write_file`; `str_replace_edit` works but won't stream); template edits stream into the live preview as you type.
</attached-skill>

<attached-skill name="Hi-fi design">
Create a high-fidelity, polished design.

Follow this general design process (use the todo list to remember):
(1) ask questions, (2) find existing UI kits and collect design context — copy ALL relevant components and read ALL relevant examples; ask the user if you can't find them, (3) start your file with assumptions + context + design reasoning (as if you are a junior designer and the user is your manager), with placeholders for the designs, and show it to the user early, (4) build out the designs and show the user again ASAP; append some next steps, (5) use your tools to check, verify and iterate on the design.

Good hi-fi designs do not start from scratch — they are rooted in existing design context. Ask the user to Import their codebase, or find a suitable UI kit / design resources, or ask for screenshots of existing UI. You MUST spend time trying to acquire design context, including components. If you cannot find them, ask the user for them. In the Import menu, they can link a local codebase, provide screenshots or Figma links; they can also link another project. Mocking a full product from scratch is a LAST RESORT and will lead to poor design. If stuck, try listing design assets and ls'ing design system files — be proactive! Some designs may need multiple design systems — get them all. Use the starter components (device frames and the like) to get high-quality scaffolding for free.

When presenting several options or explorations side-by-side, lay them out as labeled frames directly in the template — plain markup, not a canvas/artboard component, so every frame stays directly editable. The page is plain HTML — let the body itself scroll; never set `overflow:auto`/`scroll` on an inner wrapper, and don't build pan/zoom into the file. The outermost wrapper carries both the gray background and `width:max-content` (so the gray extends with the scroll) plus `min-width:100%; min-height:100vh; box-sizing:border-box; padding:48px; background:#e7e5df`. Inside it, each section is a start-aligned flex row — `display:flex; gap:48px; align-items:flex-start` — never centered on the horizontal axis: `justify-content:center`, `place-items:center`, or `margin:auto` on an overflowing row pushes frames off the left edge where scroll can't reach. Each frame gets `flex:none` and a fixed pixel width; a frame is a small label above a white card (`background:#fff; border-radius:2px; box-shadow:0 1px 3px rgba(0,0,0,.08)`).

When designing, asking many good questions is ESSENTIAL.

Give options: try to give 3+ variations across several dimensions. Mix by-the-book designs that match existing patterns with new and novel interactions, including interesting layouts, metaphors, and visual styles. Have some options that use color or advanced CSS; some with iconography and some without. Start your variations basic and get more advanced and creative as you go! Try remixing the brand assets and visual DNA in interesting ways — play with scale, fills, texture, visual rhythm, layering, novel layouts, type treatments. The goal is not the perfect option; it's exploring atomic variations the user can mix and match.

CSS, HTML, JS and SVG are amazing. Users often don't know what they can do. Surprise the user.

If you do not have an icon, asset or component, draw a placeholder: in hi-fi design, a placeholder is better than a bad attempt at the real thing.
</attached-skill>

<attached-skill name="Interactive prototype">
Create a fully interactive prototype with realistic state management and transitions. Use React useState/useEffect for dynamic behavior. Include hover states, click interactions, form validation, animated transitions, and multi-step navigation flows. It should feel like a real working app, not a static mockup.
</attached-skill>

<attached-skill name="Frontend design">
Use this guidance when designing frontend/UI work that is NOT governed by an existing brand or design system. Create distinctive HTML with exceptional attention to aesthetic details and creative choices.

### Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, etc. Use these for inspiration but design one that is true to the aesthetic direction.
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work — the key is intentionality, not intensity.

### Aesthetics Guidelines

- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt for distinctive, characterful choices. Pair a distinctive display font with a refined body font.
- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes.
- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Focus on high-impact moments: one well-orchestrated page load with staggered reveals creates more delight than scattered micro-interactions.
- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow. Grid-breaking elements. Generous negative space OR controlled density.
- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Gradient meshes, noise textures, geometric patterns, layered transparencies, dramatic shadows, decorative borders, grain overlays.

Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on the same choices across generations.

Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate animations and effects. Minimalist designs need restraint, precision, and careful attention to spacing and subtle details.
</attached-skill>


<system-reminder>Auto-injected reminder (ignore if not relevant): do not recreate copyrighted or branded UI unless the user's email domain matches that company. Create original designs instead.</system-reminder>

## Assistant

This is a rich, well-specified brief. Before I build, a few focused choices will shape the whole system — let me lock those down.

_[tool: questions_v2]_

## User

Questions answered:
- accent: 0
- mode: Light + a dark reading mode for scripture
- arabic_font: Amiri (classical naskh, traditional & warm)
- deliverable: Interactive mobile prototype only (clickable, real navigation)
- screens: All of them
- vibe: Warm & humane (soft, rounded, inviting)
- motion: Minimal — subtle, respectful

## Assistant

Got it — deep green + gold, warm & humane, Amiri scripture, light + a dark reading mode, all screens as one clickable mobile prototype. Let me set up and build.

_[tool: update_todos]_

_[tool: set_project_title]_

Building the core: device shell, nav, full data + logic, plus Home and Prayer screens.

_[tool: dc_write]_

_[tool: show_html]_

_[tool: show_html]_

`dangerouslySetInnerHTML` needs an `{__html}` object, not a string. Fixing.

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: eval_js]_

_[tool: eval_js]_

Content's all there — the screenshot capture just skipped the scrollable region (the DOM confirms Home renders fully). Foundation works. Now adding the Library + reading screens.

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

Now the logic for Stories, Classifieds, More, and Admin.

_[tool: dc_js_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

Adding the dark-toggle values, then the Story viewer and Admin form overlays.

_[tool: dc_js_str_replace]_

_[tool: dc_html_str_replace]_

_[tool: dc_js_str_replace]_

_[tool: update_todos]_

Let me spot-check a few screens render correctly, then hand off.

_[tool: multi_screenshot]_

Build is complete. Recording state and handing off for verification.

_[tool: update_todos]_

**Ahlul Bayt Ireland** — a complete, clickable mobile PWA prototype in one Design Component.

What's built, all navigable via the bottom nav (Home · Prayer · Library · Updates · More):
- **Home** — Salām greeting, Gregorian + Hijri dates, live next-prayer countdown, today's full timetable, story bubbles, quick-access cards, announcement, and a dismissible install banner.
- **Prayer Times** — Today/Monthly tabs, live countdown hero, full salāh list (Fajr → Midnight), yearly PDF button, Ahlul-Bait Ireland source note.
- **Library** — Duʿāʾ / Ziyārah / Nahj tabs with search + chips; Nahj has Sermons/Letters/Sayings sub-tabs. Tap any item → **reading view** with Amiri Arabic block, translation, **A− / A+ text size**, **dark reading mode**, and share.
- **Story viewer** — full-screen, auto-advancing progress bars, tap zones, link button, close.
- **Classifieds** — search, category chips, business cards (WhatsApp/Call/Website), community disclaimer.
- **More** — settings (dark mode + text size), plus About/Install, Offline fallback, and the **Admin dashboard** (stats, quick actions, expiring stories, recent activity) → **content form** (draft/publish/archive, uploader, live preview).

Palette: deep green + muted gold on warm ivory; Spectral (headings) + Hanken Grotesk (UI) + Amiri (scripture). Placeholder content throughout. Handing to verification now.

_[tool: ready_for_verification]_

A logic eval error slipped in — must fix. Let me find it.

_[tool: get_webview_logs]_

_[tool: grep]_

## Assistant

_[tool: grep]_

## Assistant

_[tool: read_file]_

_[tool: read_file]_

The source looks syntactically clean — the error may have been a mid-hot-reload transient. Let me reload fresh and confirm.

_[tool: show_html]_

`const dark` is declared twice. Let me find both.

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: show_html]_

Clock resolves now — logic loads. Let me confirm content renders and logs are clean.

_[tool: eval_js]_

Fixed and rendering. Handing to verification.

_[tool: ready_for_verification]_

Fixed the duplicate-variable error — the prototype now loads cleanly.

**Ahlul Bayt Ireland** is delivered: a single clickable mobile PWA prototype covering all nine feature areas — Home, Prayer Times, the Dua/Ziyarah/Nahj library with a dark-mode reading view, full-screen story viewer, Classifieds, More + settings, About/Install, Offline fallback, and the Admin dashboard + content form. Deep green + muted gold on warm ivory, with Spectral, Hanken Grotesk and Amiri type. Navigate via the bottom bar and the home quick-cards; all content is placeholder.

A background check is running. Next steps when you're ready: real prayer-time data, an actual app icon/splash asset, and filling in genuine scripture text.

## User

Found issues — fixing…

## Assistant

_[tool: str_replace_edit]_

_[tool: eval_js]_

_[tool: show_html]_

_[tool: eval_js]_

Nav restored. Quick navigation sanity check, then re-verify.

_[tool: eval_js]_

Navigation works — tapping **Prayer** loads the Prayer Times screen. The missing `showNav` flag is restored, so the bottom nav appears on all main screens and routing works.

_[tool: ready_for_verification]_

Bottom nav is back and routing works across all screens. The prototype is complete and navigable — Home, Prayer, Library (Dua/Ziyarah/Nahj + reading view with dark mode & text-size), Stories, Classifieds, More/settings, About/Install, Offline, and the Admin dashboard + form. Verification is running in the background.

## User

Save as standalone HTML: Ahlul Bayt Ireland.dc.html

## Assistant

I'll add a splash thumbnail then bundle. This design has no JS-referenced image assets — only Google Fonts (a `<link>`, which the bundler inlines), so no meta-tag lifting is needed.

_[tool: dc_html_str_replace]_

_[tool: super_inline_html]_

_[tool: show_html]_

_[tool: get_webview_logs]_

No errors and it renders offline. Delivering the file.

_[tool: present_fs_item_for_download]_

Your standalone file is ready above — a single self-contained HTML with fonts inlined that works fully offline, no internet needed.

