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
      it (the file we hold can't reproduce the blueprint's exact crop). 2026-09-08: she sent two
      Drive options, see below.

## Round 2: Lorena's feedback on the preview (2026-09-08; built 2026-09-09)
Source: `docs/intake/client_email_2026-09-08.md`. Shipped as one `cosmos_sep09_v1` round, then
reply to her on the Station8 thread.
- [x] Menu pop-up: she cannot scroll to the bottom of the menu. Reproduced on the production
      build (3433px of menu in a 720px window, wheel `defaultPrevented`, scrollTop 0 before and
      after): Lenis cancels every wheel event on the window and moves the locked page instead.
      Fix: `data-lenis-prevent` on the dialog's scroll container (`components/Modal.tsx`), so
      the browser scrolls the dialog natively. `lenis.stop()` was rejected: a stopped Lenis
      still cancels the wheel everywhere (its own `onVirtualScroll`).
- [x] BBQ Burger photo: now a full-width 4:3 crop around the burger and plate, like every
      other item shot, instead of the whole portrait source in a tall white box
      (`scripts/build-assets.sh`, `public/menu/items/bbq-burger.webp`)
- [x] Values band ("Bold Flavors, Real Vibes, Fresh Always"): top lane lg:pt-36 -> lg:pt-16,
      columns left of centre in a 780px grid (the blueprint spans ~58% of the page) at
      32px/16px type at lg. The blueprint draws the columns left, not centred: the plates
      hang over the right edge and must never cover "Fresh always" (Lesson 16).
- [x] "OUR BEST SELLERS" title: one size down at every breakpoint (5.4vw/4xl/5xl ->
      4.4vw/3xl/4xl); pill ends at 61px and 314px inside a 375px viewport.
- [x] Plate wheel (About cascade): wider and bigger plates, closer to the blueprint's
      proportions: R 0.355vw -> 0.47vw (clamp 480 to 660px), plates 13.5vw -> 23vw (clamp
      215 to 300px), hub 61% -> 58% of the band. Natalia's first pass (0.44vw / 20vw) still
      read smaller than the blueprint side by side, so James pushed it. Min clearance to the
      values text across a full revolution: 56px at 1024, 185 at 1280, 294 at 1440, 512 at
      1920; to the About paragraphs 62 / 250 / 368 / 608. No horizontal leak 375 to 1920.
      Names confirmed correct, untouched.
- [x] Order pop-up: DoorDash Little Italy + DoorDash San Clemente wired (`lib/content.ts`).
      DoorDash serves a bot challenge to headless browsers, so the two URLs are verified by
      their slugs and shape only; click them once in a real browser.
- [x] Chicken sandwich band: **kept as is.** Her first Drive file is byte-identical to the
      `cosmos 2-121.jpg` the band is already cut from (so the wider original does not exist);
      her second, `cosmos 2-003.jpg`, is a different, top-down sandwich on a yellow chair, not
      the blueprint's shot. Both saved under `Cosmos Assets/LORENA UPDATE 2026-09-08/`.
- [ ] Location drawings: hold; she is sending her own. Ours stay until then.
- [x] Reply to Lorena once the round is live: sent by Kazim 2026-09-10 on the Station8 thread, cc Eren

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

## Round 3: Lorena's feedback on the preview (2026-09-10; built 2026-09-15)
Source: `docs/intake/client_email_2026-09-10.md`. Her assets (three icons, the Frings photo,
four location drawings) were pulled from Drive into `Cosmos Assets/LORENA UPDATE 2026-09-10/`
and are now regenerated by `scripts/build-assets.sh`, never hand-copied.

### Assets (James, done first so both work packages build on the same files)
- [x] Frings photo -> `public/menu/items/frings.webp`, cut to 4:3 like every other item shot
      (her source is 2304x1537 on white; crop 2049x1537 at x=127)
- [x] Her three value icons -> `public/icons/values/{burger,vibes,fresh}.png`, trimmed to the ink
      (500x500 sources, about 60% empty margin, which is half of why they read clipped). Kept as
      alpha silhouettes so the component can paint them with `currentColor`
- [x] Her four location drawings -> `public/locations/trace/{windmill,oceanside,global-fork,
      station-8}.png`, trimmed to the ink, capped 1000w and quantised to 128 colours (in full
      colour at 1400w each was 1.0 to 1.6 MB against the 100 to 150 KB traces they replace, and
      `public/` is committed; line art on one hue palettes with no visible loss). **Miramar is
      not replaced**: she prefers the one already on the site

### Work package A, the About band (Natalia)
- [x] 1. About copy wider, close the gap between the text and the wheel (desktop)
- [x] 2. Values band centred, not left aligned. This **reverses** round 2, which moved the columns
      left to match the blueprint. Her instruction wins; the plate/"Fresh always" collision
      (Lesson 16) has to be re-solved another way
- [x] 3/6. The three icons, hers instead of our redraws, at a size that is not cut off
- [x] 5. **The wheel does not work on mobile**: below 1024px there is no wheel at all, only a
      static row of the first three plates, which is exactly what she reported seeing. Treat as
      the defect it is

### Work package B, Locations (Natalia, second hand)
- [x] Her four drawings into `lib/content.ts` with their real intrinsic sizes (they are landscape
      now, the old traces were portrait, so the card's watermark geometry changes)
- [x] 7. The Locations title is cut off on mobile
- [x] 8. The Directions button covers the drawing on mobile
- [x] Frings wired into the menu pop-up so the placeholder tile is gone

### Still open from the client, carried into the reply
- [ ] Toast ordering links per food hall
- [ ] Footer contact info (address, phone, email)

---

## Review — work package A, the About band re-solve (Natalia, 2026-09-15)

**What changed.** `components/About.tsx`, `components/Values.tsx`, `components/Icons.tsx`,
`components/PlateWheel.tsx`, `app/globals.css`.

1. **About text widened.** The copy wrapper went from `max-w-[640px]`/`62ch` to
   `max-w-[780px]`/`70ch` (still inside the readable 45 to 75ch band), narrowed back to
   `lg:max-w-[740px]` only in the 1024 to 1279 window, the wheel's own tightest one, then
   back to 780 at `xl:`. Measured before/after screenshots: `docs/handoffs/screens/
   engineering_2026-09-15/full-1280.jpg`.
2. **Values band centred at every breakpoint** (`lg:mx-0` removed). Her instruction reverses
   round 2's left shift outright; the plate/"Fresh always" collision that shift was preventing
   (Lessons 14, 16) is re-solved on the wheel's side instead (next item), not by moving this
   band a second time.
3. **Desktop wheel re-tuned** for the room the centred grid gives back. `--wheel-r` clamp
   0.47vw/660 -> 0.34vw/620, `--plate-w` clamp 0.23vw/300 -> 0.17vw/280, hub offset ratio
   0.676 -> 0.72 (`app/globals.css` `.plate-wheel`). Values.tsx's own clear lane grew back,
   `lg:pt-16` -> `lg:pt-28`. Measured minimum clearance across a full revolution (2 degree
   steps, real `getBoundingClientRect()` sweep, not a screenshot read): to the values grid
   105px at 1024, 121 at 1280, 150 at 1440, 302 at 1920; to the About copy 36 / 206 / 325 /
   511. No horizontal leak 320 to 1920 (`scrollWidth` tracks `innerWidth` minus the scrollbar's
   own 15px at every width checked). For comparison, round 2's own numbers (left-aligned):
   values 56 / 185 / 294 / 512, About 62 / 250 / 368 / 608 — About's margin is intentionally
   smaller now (that gap was Lorena's complaint), values' margin is smaller at the widest sizes
   and larger at 1024, and neither ever goes negative.
4. **Lorena's three icons**, CSS-mask + `currentColor` (`components/Icons.tsx`,
   `maskIcon()`), so they keep inheriting the yellow token the redrawn SVGs used to give for
   free. Each box holds the same ink AREA rather than the same footprint (width = sqrt(area x
   the source's own aspect ratio)), so the wide vibes mark (270x132) reads the same visual
   weight as the two closer-to-square ones (burger 270x239, fresh 270x224) instead of being
   stranded tiny in a shared square. Values.tsx wraps each in a fixed-height frame so the three
   titles start at the same baseline regardless (confirmed identical `top` in the browser).
   The three hand-drawn SVGs are gone from Icons.tsx; `BurgerIcon` itself stays, still used by
   `MenuPlaceholderIcon`.
5. **A real, turning wheel on mobile.** One component now serves both breakpoints
   (`PlateWheel.tsx`): the desktop ring is unchanged in shape, and a second, smaller ring
   appears below 1024px, hub centred at the bottom of its own fixed-height, fully
   `overflow-hidden` belt (`app/globals.css`, mobile `.plate-wheel` override), so its top arc
   pokes into view with all six dishes instead of the old static three-plate row. Full contract
   verified live, not just read from the code (`npx next start`, real DOM, real events):
   scroll-driven ambient rotation, touch drag-to-spin with momentum (rotated 30 degrees on a
   130px synthetic drag, settled at the released speed, no snap-back), click still opens the
   menu pop-up, a drag never does, keyboard focus brings an off-screen primary plate into view,
   and under `prefers-reduced-motion` the ring sits dead still and a drag still moves it with no
   momentum (rotated to 47.69deg, held exactly there one second later). The desktop ring's own
   touch exclusion (Lessons 24 to 26, the drag there is a vertical gesture and would fight the
   page scroll) is preserved, gated on a `(min-width: 1024px)` match now instead of being
   unconditional. `PlateRow` is deleted.
6. **Collision proof for the mobile ring**, swept the same way as the desktop one, across a
   full rotation at 320/375/390/430: minimum clearance to the values grid a flat 120px at every
   width (the belt's own fixed bottom margin, since nothing the belt clips can ever reach past
   its own edge) and to the About copy 61 to 113px, closest at 430 (the ring is widest there).
   First pass of that sweep read as a large NEGATIVE clearance; the plates' own
   `getBoundingClientRect()` ignores an ancestor's `overflow: hidden`, so the script was
   comparing the wheel's off-screen full geometry, not what a visitor can actually see, against
   the text. Fixed by clipping each plate to the belt's own box before comparing anything
   (see the new Lesson below) — a real, not theoretical, false alarm caught before it shipped.

**One thing tuned after first pass, on sight, not asked:** with every visible plate's name
always on, a 90 to 100 degree arc holding ten-plus spokes (primaries and repeats both) at once
crowded into overlapping labels. Only the six primary plates now carry an always-on caption on
the mobile ring (repeats stay silent, same as they already were for screen readers); the wheel
keeps turning, so a repeat's own primary comes back into view on its own. Two adjacent primaries
(15 degrees apart) can still crowd their captions at some rotations — a real but minor residual,
not a text collision, left as a known item rather than a bigger rewrite (a "name whichever plate
is nearest centre" single caption would remove it entirely, if this is worth a follow-up round).

**Verification.** `npx tsc --noEmit` clean, `npm run build` clean (no lint/type errors), zero
browser console errors at 375/1280 after load. `npm run build && npx next start -p 9157`,
measured and screenshotted against that server, never `next dev` (Lesson 30). Screenshots at
375/768/1280/1440 of the About band, values band and both wheels:
`docs/handoffs/screens/engineering_2026-09-15/`. Not tested: real touch hardware (the drag
gesture was proven via synthetic PointerEvents with `pointerType: "touch"`, which exercises the
same code path but is not a finger); a real mouse for the desktop hover tooltip (proven via the
browse tool's CDP-level hover, which does set real `:hover`, confirmed after pausing the ambient
rotation, since Playwright's hover waits for the target to stop moving and times out on an
element that never does).

**Untouched, on purpose:** `components/Locations.tsx`, `lib/content.ts` (work package B's
files), the menu pop-up, order pop-up, every other section.

---

## Review — Chrome QA gate, both round 3 packages together (Olga, 2026-09-15)

All eight of Lorena's round-3 items PASS, independently re-measured across 320-1920px, zero
console errors, zero horizontal leak. One real bug found and fixed before the rest of the gate
even started: James read the engineering screenshots and flagged the mobile wheel's captions as
overlapping and sliced; reproduced live, root-caused to the "always on for primaries" design
sweeping across the belt's own clip edge every rotation, fixed by matching the desktop ring's own
focus-reveal model (`components/PlateWheel.tsx`) instead of patching around it. Rebuilt,
re-verified: clean at every width, keyboard focus still reveals one clean caption, touch drag +
momentum still works, click still opens the menu and a drag still doesn't.

One open, non-client item flagged for a follow-up: the empty purple band under the mobile wheel
(~200px / 25% of a 375px screen) between the wheel and the Values band doesn't clearly earn its
space; recommend trimming `Values.tsx`'s mobile `pt-14`/icon-frame height in a future round.

Full report: `docs/handoffs/qa_2026-09-15.md` · sidecar: `docs/handoffs/qa_2026-09-15.qa.json` ·
screenshots: `docs/handoffs/screens/qa_2026-09-15/`. Not committed, not branched, not shipped —
Kazim's call per Lesson 0.

---

## Review — the gate and the three things nobody asked for (James, 2026-09-15)

**The gate.** Olga ran the full Chrome QA gate on the production build with both packages
together, which neither engineer could do (they built in parallel, in disjoint files, blind to
each other). Report: `docs/handoffs/qa_2026-09-15.md`, sidecar `.qa.json`, screenshots under
`docs/handoffs/screens/qa_2026-09-15/`. All eight of Lorena's items PASS, zero console errors
and zero horizontal leak from 320 to 1920, the round-2 menu-pop-up scroll fix still holds, and
the fidelity gate passes on both bands that changed. She found and fixed one real bug on the
way: the mobile wheel's always-on plate captions overlapped each other and were sliced by the
belt's clip line (I caught it in package A's own screenshots; she reproduced it live, root
caused it and matched the desktop ring's focus-reveal model rather than patching the symptom).

**I verified two of the eight myself** rather than taking the report on trust, both of them
items Lorena reported with her own eyes: the location drawing is clear of the Directions button
at 390 (`/tmp` shot, card reads cleanly), and the Locations title is not clipped.

**One thing QA flagged and I fixed rather than deferring.** The mobile wheel left a dead band
between the arc's clip line and the first values icon: 144px at 390, on a screen that is 844
tall. `pb-16` -> `pb-10` on About below `sm` and `pt-14` -> `pt-10` on Values below `sm`, which
takes it to 104px. It is not decoration: Lorena's round-2 ask was literally to move that band
higher up the page, so closing a gap that opened underneath the new mobile wheel serves a
standing request. Re-measured after: 104px, no leak at 390, no new console errors.

**Two things nobody asked for, both production hygiene:**
- **22 iCloud duplicate files were committed and shipping in the deploy** (21 menu photos named
  `<name> 2.webp` plus a whole duplicate of `scripts/check-menu-photos.mjs`). Nothing in the
  codebase referenced any of them. Removed, and `.gitignore` now refuses the pattern so a sync
  cannot put them back.
- **The 500 page was Next's unbranded default.** P5 accepted that on the grounds that a static
  marketing site has no server logic to throw, which is true of the server and untrue of the
  browser: this page ships a wheel with pointer capture, two pop-ups and a scroll driver. Added
  `app/error.tsx` (branded, with a working "Try again" that re-renders the segment) and
  `app/global-error.tsx` (the last resort, hand-styled because the layout that loads the tokens
  is exactly what failed).

**Not shipped, on purpose.** Nothing is committed, branched or pushed: the merge is Kazim's
call (Lesson 0). The reply to Lorena is drafted and waiting at
`docs/intake/lorena_reply_2026-09-15.md`, to be sent by him **after** the merge is live, since
every claim in it is checkable on the preview and she checks.
