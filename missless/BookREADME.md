# Missless — Book a Demo (Vanilla)

Plain HTML + CSS + JavaScript. No build step. Open `index.html` in a browser and it works.

## Structure

```
index.html
css/
  style.css
js/
  main.js
assets/
  favicon.svg
```

## What's wired up

- **Navbar**
  - Logo (inline SVG)
  - Products and Industries dropdowns (open on hover; click toggles on touch / no-hover devices)
  - Pricing, About direct links
  - Contact us CTA
  - Mobile hamburger drawer with `<details>` for sub-menus

- **Hero**
  - "Schedule a demo" heading with gradient on "demo"
  - Sub-heading + body
  - Choose a time CTA that scrolls to `#booking`
  - Trust badge ("No pressure...")
  - 3 feature pills (15-minute walkthrough / Personalized / Works with your number)

- **Booking flow (3 steps)**
  - Step 1 — Form: full name, business name, work email (required), phone, message, consent line, marketing checkbox. The "Choose a time" button stays disabled until name + business + valid email are filled
  - Step 2 — Calendar: month nav, past dates and other-month dates are disabled, click to select
  - Step 3 — Time grid: 12 slots, single selection, then "Confirm demo"
  - Confirmation screen with summary of email + date + time

- **Footer**
  - Deep navy background (`#0B1437`)
  - 5 columns: Brand / Product / Solutions / Company / Resources
  - Bottom row: copyright + legal links (auto-updates year)

## Submit endpoint

Inside `js/main.js`, the confirm button POSTs to `/api/book-demo`. If your hosting doesn't expose that endpoint yet, the fetch silently no-ops and the user still sees the confirmation screen. Wire it to your real backend when ready.

## Brand tokens

Centralized as CSS variables at the top of `css/style.css`:

```
--blue-600   #2563EB   primary
--purple-600 #9333EA   gradient mid
--pink-500   #EC4899   gradient end
--navy       #0B1437   footer
```

Swap any of these and the whole page updates.

## Browser support

Modern evergreen browsers. Uses CSS Grid, `aspect-ratio`, `backdrop-filter`, and `accent-color` — all supported in Chrome, Edge, Firefox, Safari (recent versions).
