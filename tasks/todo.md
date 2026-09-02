# tasks/todo.md — Cosmos Burger build plan

Source of truth for scope: `PROJECT_BRIEF.md`, `SCOPE.md`,
`docs/intake/BLUEPRINT_FACTS_2026-09-02.md`. Phases P0→P5 per `CONVENTIONS.md`.

## P0 — Foundation (this run, Selma)
- [x] `PROJECT_BRIEF.md` + `SCOPE.md`
- [x] Next.js 15 App Router scaffold, hand-built (package.json, tsconfig, next.config.mjs,
      postcss.config.mjs)
- [x] Brand tokens in `app/globals.css` (magenta/yellow/purple/cream/tan, Horizon stand-in +
      Poppins, `--ease-brand`, `.js .reveal`, focus ring, reduced-motion block)
- [x] `app/layout.tsx` (fonts, inline `.js` script, skip link), `app/page.tsx` placeholder
- [x] `components/SmoothScroll.tsx` (Lenis + reveal observer)
- [x] `lib/content.ts` stub (`site`, `nav`)
- [x] `.gitignore`, `README.md`
- [x] `scripts/build-assets.sh` — hero + 4 photo bands, best-seller cutouts, plate cutouts, logo,
      pattern
- [x] `CLAUDE.md`, `.claude/Lessons.md`, `.claude/agents/`, `.claude/settings.json` (berth),
      `HAIL_MARY.md`, `CONVENTIONS.md`
- [x] Dev port 9157 claimed and written back to the War Room registry
- [x] Scaffold proven: build + dev server serves on :9157

## P1 — Static one-pager (all sections per facts §4)
- [x] Nav shell: floating purple pill, logo top-left, ORDER ONLINE yellow pill, anchors
- [x] Hero: full-bleed `hero.webp`, static logo (animation is P3)
- [x] About (`#about`, purple): "UNLEASH THE FLAVOR" + 4 body paragraphs + burger-plate cascade
      (6 plates)
- [x] Values band (magenta): Bold Flavour / Real Vibes / Fresh always, 3 columns + icons
- [x] OUR BEST SELLERS (cream): le-smash-style carousel, 5 items, magenta tab pill
- [x] Photo band: fries bowls
- [x] EXPLORE OUR MENU (`#menu`, purple + pattern): CHECK OUT OUR MENU + ORDER ONLINE CTAs
- [x] Photo band: plate spread
- [x] CATERING (`#catering`, cream): ORDER CATERING → ezCater
- [x] LOCATIONS (`#locations`, purple + pattern): 4 food-hall cards
- [x] Photo band: chicken sandwich
- [x] REVIEWS (cream): 4 quotes, tan cards, 5-star
- [x] Photo band: phone
- [x] Footer (`#contact`, purple + pattern): logo, FOLLOW US, CONTACT INFO
- [x] Menu pop-up: category grid, no prices, live-site item list
- [x] Order-online pop-up: Toast/DoorDash per hall, "coming soon" where no URL
- [x] Fill `lib/content.ts` completely (about, values, bestSellers, menu, catering, locations,
      reviews, footer, menuPopup, orderPopup) with provenance comments

## P2 — Motion layer
- [x] Scroll reveals on every section (`.reveal`, staggered `idx*0.08s`)
- [x] Sheen sweep on the logo and yellow pills
- [x] 0.3s interaction transitions, `--ease-brand`
- [x] Carousel motion (Best Sellers)
- [x] Confirm everything degrades cleanly under `prefers-reduced-motion`

## P3 — Signature moment
- [x] Animated hero logo (the blueprint's own ask, slide 2: "Banner: Picture and Animated logo")

## P4 — Inner pages
- [x] `/accessibility`, `/privacy`, `/terms` (flag for human legal review)
- [x] 404 page
- [x] Menu pop-up + order pop-up wired to real routes/state

## P5 — Polish
- [x] Favicon (`app/icon.svg`) + OG image (`app/opengraph-image.png`, `scripts/make-og.py`) —
      confirmed live: `/icon.svg` 200 image/svg+xml, `<link rel="icon">` in head, purple tile
      (`#751080`) behind the yellow glyph so it reads on both light and dark tab chrome (no
      change needed). OG confirmed 1200x630 PNG, logo + burgers legible at thumbnail size.
- [x] sitemap.xml + robots.txt + SEO meta + JSON-LD Restaurant per hall — verified by curl:
      title/description/canonical/OG/Twitter/theme-color/viewport/lang all present.
- [x] ADA/508 pass + `prefers-reduced-motion` audit — reduced-motion block confirmed in
      `app/globals.css`; skip-link, focus ring, alt text all present. Full WCAG audit already
      covered by QA gate (`docs/handoffs/qa_2026-09-02.md`).
- [x] `fitcheck` — covered by the QA gate (`docs/handoffs/qa_2026-09-02.md`), nine viewports
      passed there 2026-09-02; not re-run here since nothing layout-affecting changed since.
- [x] Security headers (`next.config.mjs`) — confirmed live on `/`: CSP, HSTS,
      X-Content-Type-Options, X-Frame-Options, Referrer-Policy, Permissions-Policy all present;
      CSP checked in-browser (gstack), no "Refused to load" violations. No cookies in this build.
- [x] 404 page in brand (500 still Next default — acceptable, no server-side logic in this
      build to trigger one; noted as a known gap, not a blocker)
- [ ] Shareable progress report (`docs/reports/Cosmos_Development-Report_<date>.html`) — Gabi
      (report-writer) running in parallel, not this handoff's job.

## Blocked on client (Lorena, batched — see `SCOPE.md` "Open questions")
- [ ] Menu content: real menu (PDF or item list) with descriptions + prices; names and photos are
      the old site's in the meantime
- [ ] Ordering URLs: Toast + DoorDash per food hall (Carlsbad DoorDash and Oceanside DoorDash are
      already public)
- [ ] Contact info for the footer (address/phone/email)
- [ ] Plate names: confirm the six wheel-plate names, matched by photo (one-glance, not client-
      confirmed)
- [ ] Chicken sandwich photo: the original, wider photo used in the PDF band, if Lorena still has
      it (the file we hold can't reproduce the blueprint's exact crop)

---

## Review — P1 to P4 build (Natalia, 2026-09-02)

**What landed.** The full thirteen-band one-pager in the blueprint's order, both pop-ups, the
three legal routes, 404, robots/sitemap, favicon, OG image and per-hall JSON-LD. `npm run build`
is clean, no `any`, no `console.log`, zero browser console errors at 1280x900 and 375x812, and no
horizontal leak at either width (`scrollWidth == innerWidth`).

**Four bugs found and fixed during the browser pass, not by reading the code:**
1. The wordmark rendered as a bare swoosh everywhere. An `<svg>` around a `<use>` of a `<symbol>`
   must NOT repeat the symbol's offset viewBox: the use box sits at the origin, so the window was
   shifted by (20, 314) user units and clipped all but the tail. Fixed in `components/CosmosLogo.tsx`.
2. The hero's purple veil was one top-to-bottom gradient and tinted the burgers purple. Replaced
   with stops that scrim only the top band and the bottom seam.
3. The "OUR BEST SELLERS" seam tab was cropped flat by `overflow-hidden`, and at 375px it ran
   wider than the viewport and read as a full-width bar rather than a pill.
4. `snap-start` with no `scroll-padding` rests a rail at `scrollLeft == padding-left`, which put
   the first location card hard against the viewport edge.

**One content error caught:** the client's `Best Sellers/THE CHICKS.png` is the chicken TENDERS
plate, not the sandwich. Its alt text was wrong and the photo was on the Chicken Sandwiches row.
Moved to Chicken Tenders; the sandwich row now has no photo, which is correct.

**Still open** (P5, and the client asks in `SCOPE.md`): `fitcheck` across the nine viewports, the
ADA/508 pass, the security-header audit, and the progress report. Ordering URLs, menu prices and
footer contact details all remain gaps on the client, and every one of them degrades to an honest
"coming soon" rather than a dead control.
