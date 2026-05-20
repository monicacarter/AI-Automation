# Missless — Homepage

The production VS Code-ready build of the Missless homepage. Vanilla HTML, CSS, and JavaScript — no framework, no build step, no dependencies to install.

---

## How to run

**Easiest:** double-click `index.html`. It will open in your default browser.

**Recommended (live reload while editing):**
1. Open the `missless` folder in VS Code
2. Install the **Live Server** extension by Ritwick Dey
3. Right-click `index.html` → **Open with Live Server**

The site runs entirely offline. The only external dependency is Google Fonts (Geist + Instrument Serif), which load on first visit and then cache.

---

## File structure

```
missless/
├── index.html          ← The full page (one file, all sections, schema markup)
├── css/
│   └── style.css       ← All styling, design tokens, animations, responsive
├── js/
│   └── main.js         ← Scroll reveals, donut animation, counters, tabs, mobile nav
├── assets/
│   ├── logo.png        ← Primary logo (color, for nav)
│   ├── logo-light.png  ← White variant (for dark footer)
│   └── favicon.png     ← 64×64 favicon
└── README.md
```

### Optional drop-ins (not included)

- `assets/og-image.jpg` — 1200×630 social preview image, referenced in `<meta property="og:image">`. Add when ready.
- `assets/audio/` — Industry demo audio files for the "Hear It In Action" player. The play button currently toggles UI state only; wire it to real audio when you have the recordings.

---

## What's in the build

- **All 11 sections** from the content brief: nav, hero, hear-it-in-action, hidden tax, solution, how it works, platform, industries, why missless, pricing + onboarding, FAQ, final CTA, footer.
- **Full schema markup** in `<head>`: Organization, WebSite, SoftwareApplication, FAQPage (JSON-LD).
- **SEO meta** complete: title, description, keywords, canonical, Open Graph, Twitter cards.
- **Responsive** at 1100px, 880px, 760px, and 460px breakpoints.
- **Accessibility:** semantic HTML, one `<h1>`, ARIA labels on interactive elements, keyboard-navigable mega menus with ESC-to-close, `<details>`/`<summary>` FAQ accordions that work without JS, `prefers-reduced-motion` honored.
- **Motion:** scroll-triggered fade-ups (IntersectionObserver), animated waveforms, floating proof cards, gradient drift on the final CTA, donut ring fill, counter animations, button halo pulse.

---

## Brand tokens (in `css/style.css`)

Defined as CSS variables on `:root` — change once, propagate everywhere.

| Token            | Hex       | Use                            |
|------------------|-----------|--------------------------------|
| `--blue`         | `#2563EB` | Primary buttons, links         |
| `--blue-hover`   | `#1D4ED8` | Button hover                   |
| `--violet`       | `#7C3AED` | Gradient accents, chips        |
| `--pink`         | `#EC4899` | Pink chips, accents            |
| `--green`        | `#10B981` | Confirmation, success states   |
| `--gold`         | `#F59E0B` | "5 to 7 days" highlight        |
| `--navy`         | `#0B1220` | Footer, onboarding card        |
| `--bg`           | `#F8FAFC` | Page background                |
| `--ink-900`      | `#0F172A` | Headings                       |
| `--ink-500`      | `#475569` | Body text                      |

Gradients:
- `--grad-bv` — Blue → violet (primary accent)
- `--grad-pv` — Pink → violet (used on dark onboarding card)
- `--grad-bvp` — Blue → violet → pink (final CTA "opportunity")

Fonts:
- **Geist** (Google Fonts) — body and display, weights 300–800
- **Instrument Serif italic** — editorial accent words ("another lead", "conversation", "questions", "opportunity", etc.)

---

## Editing tips

- **All copy** lives in `index.html` — text is plain, no templating.
- **Section spacing, colors, and shadows** are controlled by tokens at the top of `style.css`. Change a single hex value to recolor an entire chip system or gradient.
- **Animation timing** is in seconds/ms inside the relevant `@keyframes` blocks — search for `@keyframes` in `style.css` to find them all (`pulse`, `wave`, `float`, `halo`, `hubPulse`, `dash`, `bgDrift`, `twinkle`).
- **Reveal stagger** is controlled by `data-delay="180"` on individual elements in `index.html`. Each unit is one millisecond.
- **Industry pills** in the Hear It In Action player swap the label only — to wire real audio, edit `js/main.js` around the `INDUSTRY_LABELS` block.

---

## Performance notes

- All animations are transform + opacity only (GPU-accelerated, no layout shift).
- Fonts preconnect to `fonts.gstatic.com` for faster first paint.
- JavaScript is deferred — does not block render.
- Images have explicit `width` and `height` attributes to prevent CLS.
- No build step means no bundling — the site is ~200KB total before fonts.

---

## Browser support

Modern Chrome, Firefox, Safari, Edge (last 2 years). IE is not supported.

---

© 2026 Missless. Built for production.
