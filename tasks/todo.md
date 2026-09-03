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
- [x] Menu pop-up: category grid, live-site item list (superseded 2026-09-02 by the real, priced
      menu, see the P1-P4 review below)
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
- [x] Menu content: real menu with descriptions + prices, from `COSMOS MENU.png` (Lorena,
      2026-09-02); see the P1-P4 review below
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
ADA/508 pass, the security-header audit, and the progress report. Ordering URLs and footer contact
details remain gaps on the client, and every one of them degrades to an honest "coming soon"
rather than a dead control. Menu prices closed 2026-09-02, see below.

---

## Review — real menu rebuild (Natalia, 2026-09-02)

**What changed.** Lorena sent the real menu (`COSMOS MENU.png`) with prices, descriptions,
spicy/vegetarian marks, the combo offer and the allergen line. Rebuilt `menuPopup` in
`lib/content.ts` from it, item by item, transcribed and cross-checked against the image:
- Every `MenuItem` now carries `price` (printed verbatim, e.g. "$7.5", not "$7.50") and an
  optional `description`, `tags` (`spicy` | `vegetarian`), and `note` (the "swap for tots" upsell
  on the three loaded-fries sides).
- `MenuCategory` dropped the `kind: "tiles" | "list"` union: every category is a tile grid now, so
  `ListMenuCategory`, `MenuItemGroup` and the whole Drinks category (no menu, invented for the
  old-site build) are gone, and `MenuPanel.tsx`'s `DrinkGroups` component with them.
- Kids Burger, Tiramisu and Bundle for 4 are removed (not on the real menu); Cauliflower Bites
  moved out of the deleted "More" category into Sides, where the real menu has it, alongside the
  new Frings item.
- `MenuPanel.tsx`: price sits right-aligned to the name in the display font; description renders
  at 14px Poppins, `text-purple/75`; spicy (chilli) and vegetarian ("V" disc) glyphs are new inline
  SVGs in `components/Icons.tsx`, coloured from new tokens in `app/globals.css`
  (`--color-chilli*`, `--color-veg`) sampled off the client's own PNG, not hardcoded hex; a category
  `note` renders italic under the header (the "served with signature Cosmos sauce and pickles"
  line on both chicken categories); the combo card is a `bg-magenta-deep` card with a yellow
  `.display` heading at the bottom of Sides; the footer note is now the allergen line, with a
  spicy/vegetarian legend and a "View the printed menu" link to `/menu/cosmos-menu.png` above it.
- `scripts/build-assets.sh`: swapped the BBQ Burger photo for Lorena's `BBQ UPDATED.png` (its alpha
  channel is fully opaque edge to edge, so the trim step is a documented no-op, then flattened onto
  white to match the other item shots); swapped the table-spread source from `Cosmos General.png`
  to Lorena's `additional photo.png`, same cutout, same alpha bbox, differing only in a 470x230px
  patch where the old file carried a sparkle artifact baked into the wood grain, the new file does
  not; added the `cosmos-menu.png` (2000w, the link target) / `cosmos-menu.webp` (kept for a future
  thumbnail, unused today) export of the printed menu itself.
- `app/layout.tsx`: added `Menu`/`MenuSection`/`MenuItem` JSON-LD with real prices, built by
  `menuStructuredData()` in `lib/content.ts` from the same `menuPopup` data the pop-up renders, one
  shared object with a stable `@id` that every Restaurant's `hasMenu` now points at. Per the
  James/Lorena meeting 2026-09-02: the menu is website content for SEO, not only a PDF, so it stays
  in the DOM (it already was, inside the modal) and now also in structured data.

**Verification.** `npx tsc --noEmit` clean. `scripts/check-menu-photos.mjs` (new, read-only, no
deps) parses every `image.src` and `printedMenuHref` out of the `menuPopup` block in
`lib/content.ts` and confirms the file exists under `public/`: 28 paths checked, 0 missing.
Grepped every changed file for em/en dashes: none. Not run: `next build`/`next dev` (a demo server
is on :9157 for the client; out of bounds for this pass).

**Decisions made, not asked:**
1. Prices render exactly as printed ("$7.5", "$9.5"), not normalised to "$7.50".
2. The "swap for tots +$1" note renders as "Swap for tots, add $1", the house no-em/en-dash rule
   applied to what would otherwise read as a dash-flavoured aside; the plus signs in the combo copy
   ("+$8", "regular fries + your choice of soda") are arithmetic, not dashes, and stay as printed.
3. BBQ UPDATED.png's "trim to alpha bbox" step is a no-op (verified: alpha is 255 everywhere), kept
   in the script anyway since a future re-export of that asset might not be.
4. `additional photo.png` replaces `Cosmos General.png` as the spread source: the only difference
   is the sparkle artifact, which has no business on a product photo.
5. `/menu/cosmos-menu.png` (not `.webp`) is the "View the printed menu" link target: opened in a
   new tab to be read or printed, PNG has the broadest right-click save/print support. The webp
   export is kept for a future inline thumbnail; nothing links to it yet.

**Untouched, on purpose:** `public/locations/`, `docs/handoffs/design_*`, `next.config.mjs`,
security headers, motion layer, every non-menu section. No new dependency added.
