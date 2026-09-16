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

## Round 4: Kazim's own read of the live preview (2026-09-15)

### Job 1: the About band on a very wide monitor (34")
- [x] Wide-screen composition: keep the copy and the plate wheel travelling together as the
      viewport grows, so the gap between them stays bounded instead of growing without limit.
      Tested 1024/1280/1440/1920/2560/3440.

### Job 2: the mobile wheel, too crowded
- [x] One set of six dishes on mobile, not the desktop's four-times-repeated 24, spaced to suit
      the small ring. Desktop ring untouched.
- [x] Bigger, calmer, better-spaced plates; kept every existing behaviour (scroll rotation, drag
      momentum, tap-opens-menu, focus reveal, keyboard reach, reduced motion, `draggable={false}`).
      Tested 320/375/390/430/768.

---

## Review — Round 4, wide-screen composition + the mobile wheel (Natalia, 2026-09-15)

**What changed.** `app/globals.css` (`.plate-wheel`'s desktop `--hub-left` formula, the mobile
`--wheel-r`/`--plate-w` clamps), `components/PlateWheel.tsx` (mobile ring rebuilt to 6 unique
spokes, `overflow-clip` fix, belt height, `data-angle`-based focus targeting, a new `WheelSpoke`
helper shared by both rings). `components/About.tsx` and `components/Values.tsx` were read but
not touched; the wide-screen fix lives entirely in the wheel's own CSS, not the containers.

### Job 1: the wide-screen gap, root cause and fix
The wheel's hub was anchored to 100% of its own box, which spans the raw viewport (the wheel div
is a sibling of the 1400px content column, not a child of it). Past 1400px the copy's own right
edge only travels at HALF the viewport's growth rate (`mx-auto` centring a fixed-width container),
while the old hub travelled at the FULL rate, so the gap between them opened without limit.
Fixed by subtracting the same growing container margin from the hub's own position
(`app/globals.css`, one line, documented in place), which makes the hub travel at that same
half-rate past 1400px. The container's own `max-w-[1400px]` was deliberately left unchanged: the
math shows growing it further would have REOPENED the same unbounded growth (tried, measured,
rejected, see the file's own comment). Below 1400px the fix is a no-op: every clearance Round 3
tuned there (1024, 1280) is byte-for-byte unchanged.

**Measured (real `getBoundingClientRect()` sweeps, 3 degree steps, full revolution, gstack
chrome-devtools):**

| viewport | gap: copy to nearest plate, before | after | min clearance to values grid | min clearance to About copy |
|---|---|---|---|---|
| 1024 | (unchanged, Round 3's own 105/113) | 113 | 113 | 37 |
| 1280 | (unchanged) | 123 | 123 | 239 |
| 1440 | 358 | 345 | 144 | 345 |
| 1920 | 544 | 291 | 74 | 291 |
| 2560 | 864 | 291 | 71 | 291 |
| 3440 | 1304 | 291 | 76 | 291 |

The gap goes FLAT at 291px from 1920 up instead of climbing to 864 and then 1304; every clearance
number stays comfortably positive (re-swept at 1 degree resolution at the tightest point, 2560,
minimum 71.2px, never closer). No horizontal leak 1024 to 3440 (`scrollWidth` tracks `innerWidth`
minus the browser's own constant 15px scrollbar reservation at every width). The values band's
grid stayed centred at every width (left/right margin difference a constant 15px, the same
scrollbar artifact, not drift) and never became three columns marooned in a wide row, since its
own grid is still capped at `max-w-[780px]` regardless of viewport. Screenshots at 1440, 2560 and
3440 (`docs/handoffs/screens/engineering_2026-09-15_v4/about-*.jpg`) show the composition reading
as one connected cascade at every size, not a column and a stranded wheel.

### Job 2: the mobile wheel, six dishes once
`SPOKE_COUNT` (24, four copies of six, 15 degrees apart) stays exactly as it was for the desktop
ring, lg and up. A second, separate spoke set drives the mobile ring: `MOBILE_SPOKE_COUNT = 6`,
each of the six dishes exactly once, `MOBILE_SPOKE_STEP_DEG = -60` (360 / 6), spaced around the
FULL circle rather than clustered into the blueprint's ~90 degree visible arc, so the ring never
runs out of plates as it turns. Both spoke sets are always in the DOM (a plain `hidden lg:contents`
/ `contents lg:hidden` CSS toggle, not a JS breakpoint branch), so server and first client render
stay identical, no hydration risk. `--wheel-r` 150-190 to 165-215, `--plate-w` 96-132 to 112-156
(bigger, per the brief); belt height 240px to 280px to give the wider 60 degree sag room.

**The emptier arc, decided deliberately.** Six plates 60 degrees apart against a visible window
measured at roughly 90 to 100 degrees means the window is WIDER than the spacing, so at least one
plate is always inside it as the ring turns (confirmed: zero rotations out of a 180-sample full
sweep at any tested width showed no plate at all). Most of the time 1 to 2 plates are visible at
once (up to 4 counting a sliver at the clip edge), against the old design's 10+. This reads as a
breath, not a hole, chosen over cramming more plates back in specifically because "too much, too
crowded" was the whole brief; a wider window with more plates on screen was tried in earlier
rounds and is the thing being undone here.

**A real bug found and fixed, not shipped broken.** Testing the actual keyboard contract (focus
every reachable plate, not just eyeballing a screenshot) found that tabbing to an off-screen
primary plate made the BROWSER auto-scroll the belt's own `overflow: hidden` box to reveal it,
`belt.scrollTop` landing at 244px with no scrollbar ever drawn. That silently broke the hub's own
`getBoundingClientRect()` reads everywhere in the file (the drag gesture, the focus page-scroll
correction), which is why it only showed up now: 24 densely-packed spokes almost always had a
primary already near the visible arc, so the browser rarely needed to auto-scroll; six spokes
spread round the whole circle are far more often off-screen at the moment of focus. Fixed with
`overflow: clip` instead of `overflow: hidden` (the desktop ring's own x-axis already uses this),
which cannot become a scroll container at all. Lesson 34.

**Full behaviour contract, reverified live on the fixed build, not assumed carried over:**
- All six dishes reachable by Tab, each correctly named, each landing inside the belt's visible
  clip on focus, `belt.scrollTop` staying 0 throughout.
- Touch drag-to-spin with momentum: a synthetic 130px `pointerType: "touch"` drag rotated the ring
  and it kept turning after release (rotation still climbing 300ms later).
- Click opens the menu pop-up; the same drag does not.
- `prefers-reduced-motion` (forced via an init-script `matchMedia` override, this tool has no
  direct reduced-motion flag): ring pinned at 0deg and static for a full second with nobody
  touching it; a drag still moves it (0 to 35.84deg) and holds exactly there with zero drift a
  full second after release, no momentum.
- `draggable={false}` and `user-select: none` still present on every plate image/button.

**Collision + reachability, swept the clip-aware way (Lesson 31), full revolution, 320/375/390/
430/768:**

| viewport | all 6 dishes reachable | min clearance to values grid | min clearance to About copy | belt-to-first-icon gap |
|---|---|---|---|---|
| 320 | yes | 80 | 125 | (not measured, `sm:` padding differs above 640) |
| 375 | yes | 80 | 105 | 104 |
| 390 | yes | 80 | 101 | 104 |
| 430 | yes | 80 | 76 | 104 |
| 768 | yes | 144 | 56 | 168 (crosses the `sm:` padding step) |

No horizontal leak 320 to 768. The belt-to-first-values-icon gap stays 104px, unchanged from
where James/Olga's round-3 fix left it: the belt grew 40px taller but the gap is structurally set
by About's own `pb-10` plus Values' internal icon offset, not by the belt's height, so it never
needed to move for this round's changes (worked through in the file's own comment).

**Verification.** `npx tsc --noEmit` clean, `npm run build` clean. `npm run build && npx next
start -p 9157`, `.next/cache/images` cleared before every restart, killed with
`pkill -f next-server` (Lessons 3, 5). All measurement against that production server, never
`next dev` (Lesson 30). Zero console errors at 375, 1440 and 3440 after load. Screenshots:
`docs/handoffs/screens/engineering_2026-09-15_v4/`.

**Not tested:** real touch hardware (synthetic `PointerEvent`s again, same as every prior round);
a real mouse for the desktop hover tooltip (untouched by this round's edits, so not re-driven,
same call QA made last round for the same reason). This machine hit its own documented flakiness
mid-run (a navigation timeout, one browser tab that silently drifted into a stale, inconsistent
render after several consecutive test scripts): both were caught by re-verifying on a fresh page
rather than trusted, never shipped as a finding.

---

## Round 5: Kazim's own read of round 4 ("çok daha güzel olmuş"), two more asks (2026-09-15)

### Job 1: the dishes need their names on mobile
- [x] Give the phone a way to read each dish's name, not just desktop's hover tooltip. Measured
      whether a caption fits under every visible plate at the new spacing; it doesn't (proved with
      a live candidate + screenshot), so named the plate at the top of the arc instead, in a fixed
      spot outside the belt's clip, updating as the wheel turns.

### Job 2: more burgers on screen, without crowding
- [x] Reduce the mobile gap between plates to a third or a half of round 4's 60deg, keeping the
      ring full (repeats), and prove neighbouring plates neither overlap nor sit too close.
      Landed on half (12 spokes, 30deg, two copies) with the plate size and belt shrunk to match.
      Desktop ring proved untouched. Tested 375/390/430.

---

## Review: Round 5, mobile names + tighter spacing (Natalia, 2026-09-15)

**What changed.** `components/PlateWheel.tsx` (mobile ring now 12 spokes, two copies of six, 30deg
apart, mirroring the desktop ring's own repeat pattern; a new reel caption above the belt, updated
imperatively from the same rAF loop and drag handler that already drive `--wheel-rot`), `app/
globals.css` (mobile `--wheel-r`/`--plate-w` clamps re-tuned for twelve plates). Desktop constants
and formula untouched (verified by diff and by live DOM read: 24 spokes, same `--hub-left`
calc/clamp values, byte-identical to round 4's file).

**Job 1, the caption shape.** Built and screenshotted both candidates at 390 before deciding
(`docs/handoffs/screens/engineering_2026-09-15_v5/`): candidate A (every visible primary plate
captioned, the pre-Lesson-33 shape, forced on live via an injected stylesheet, never shipped) shows
overlapping pills and three of six primary captions extending outside the belt's own clip box,
worst-case pairwise gap 3px (`candidateA-per-plate-390.png`); candidate B (one caption, fixed above
the belt, naming whichever dish sits closest to the top of the arc) reads clean at the same
rotation density (`candidateB-reel-caption-390.png`). Shipped B. It cannot collide with anything or
be clipped mid-word because it never moves and never shares vertical space with a plate: it sits
in a strip above the belt's own clip box, not inside it, `aria-hidden` since the real per-plate
accessible name already exists on focus and an auto-changing live region would narrate the ambient
rotation forever. Verified live: the caption text changes as the wheel turns (`Blue cheese` to
`BBQ chicken sandwich` over an 8s window with the belt in view), stays put and pauses when the
section scrolls out of view (matching the wheel's own on-screen gating), and updates correctly
during a reduced-motion drag too (the rAF loop that normally drives it does not run there, so
`onPointerMove` updates it directly, same pattern the code already uses for `write()`).

**Job 2, the spacing.** Only two spoke counts tile the six dishes onto a full circle in the 20 to
30deg range Kazim named: 12 spokes (30deg, "half") or 18 (20deg, "third"). Picked 30deg/12 spokes,
the literal middle between round 4's one copy (too sparse) and round 3's four copies (too
crowded), and verified by measurement that it clears rather than assuming it does: at the OLD
plate size (round 4's 112 to 156px), 30deg already overlapped (the chord between neighbours is
shorter than the plate width once spacing halves), so the plate size and belt genuinely had to
absorb the change, not just the angle. `--wheel-r` 165-215 to 180-220, `--plate-w` 112-156 to
68-84.

**Measured, full rotation (2deg steps), real `getBoundingClientRect()`s, clip-aware (Lesson 31):**

| viewport | min edge-to-edge gap, neighbouring plates | plates visible (any overlap w/ belt) | plates "substantially" visible (>=50% area) | no rotation shows a hole |
|---|---|---|---|---|
| 375 | 9.2px | 6 to 7 of 12 | 5 to 6 | confirmed, 180 samples |
| 390 | 9.6px | 6 to 7 of 12 | 5 to 6 | confirmed, 180 samples |
| 430 | 10.6px | 6 to 7 of 12 | 5 to 6 | confirmed, 180 samples |

Comfortably positive at every width without being the wide-open gap round 4 had (worked out
analytically first from the chord formula `2R sin(15deg)` against the average plate aspect ratio,
landed within 1px of the swept numbers, then confirmed against the real rendered rects rather than
trusted as estimated). 5 to 6 plates substantially visible at once, against round 4's 1 to 2: this
is the "more burgers, not crowded" Kazim asked for, not just a numeric compromise.

**Belt height, sag, gap to Values.** Belt height unchanged (280px): the arc itself keeps round 4's
own vertical footprint, and the new caption lives in the margin ABOVE the belt (`mt-10` on the
caption plus `mt-3` on the belt, replacing round 4's plain `mt-14`), never inside the clipped box,
so it cannot compete for space with a plate by construction. Sag at 30deg is `R*(1-cos30)`, about
24 to 30px across 375 to 430, well inside what the unchanged 280px belt already clears.
Belt-to-first-values-icon gap: **80px** at every tested width (375/390/430), not round 4's reported
104px, re-measured carefully after finding the discrepancy was a `.reveal` entrance-animation
settle artifact (Lesson 35), not a real regression: reading the icon's rect right after scrolling
it into the same viewport (round 4's likely method, and my own first pass) catches it still
mid-entrance-transform; scrolling it well past its own reveal trigger first and re-reading settles
at 80px both times, reproducibly. 80px matches the CSS math exactly (`pb-10` 40px + Values' own
`pt-10` 40px), which a transient reveal offset cannot.

**Desktop, proved untouched.** `SPOKE_COUNT`/`SPOKE_STEP_DEG`/`FIRST_ANGLE_DEG` and the `--hub-left`
calc/clamp formula are byte-identical to round 4's file (confirmed by `git diff`, not just "I
didn't mean to touch it"). Live at 1440: `--wheel-r`/`--plate-w`/`--hub-left`/`--hub-top` computed
values match round 4's exactly, 24 spokes render, no horizontal leak (`scrollWidth` 1425 at a 1440
viewport, the 15px is the scrollbar), clearances to the About copy and Values grid both stayed
comfortably positive (313px, 108px). A same-session browser-tooling instability (documented in
round 4's own handoff as a standing risk, not a product bug) made a clean desktop screenshot
unreliable this round: the DOM/rect state read correctly and consistently, but the same tab's
painted output stopped matching it partway through the session. Numeric proof stands on its own;
see "Not tested" below for exactly what a screenshot could not confirm this round.

**Full behaviour contract, reverified live on the changed build:**
- All six primary mobile dishes reachable by Tab, each correctly named
  (`Blue cheese`/`BBQ chicken sandwich`/`Better Mac burger`/`Cosmos burger`/`Spicy jam`/`Hot Chicks
  sandwich`), each landing inside the belt's clip on focus, `belt.scrollTop` staying 0 throughout
  (Lesson 34 still holds at the new spoke count). The six repeats (spokes 6-11) confirmed
  `tabindex="-1"` and `aria-hidden="true"`.
- Touch drag-to-spin with momentum: a synthetic 130px `pointerType: "touch"` drag rotated the ring
  (209.65 to 219.21deg while dragging) and kept turning after release (219.21 to 248.44deg over
  the next 300ms). The same drag's trailing click did not open the menu pop-up; a plain tap (no
  movement) did, and closed again cleanly.
- `prefers-reduced-motion` (forced via an init-script `matchMedia` override): ring pinned at 0deg
  and static for 1.2s with nobody touching it; a drag still moves it (0 to 9.67deg) and holds
  exactly there with zero drift 600ms after release, no momentum.
- Scroll injects rotation velocity on top of ambient: 0.64deg over 300ms of pure ambient vs 4.21deg
  over the same window right after a 250px scroll.
- `draggable="false"` confirmed on the rendered `<img>`; `overflow-clip` confirmed in the belt's
  rendered class list.

**Verification.** `npx tsc --noEmit` clean, `npm run build` clean (no lint/type errors), no em/en
dashes in either changed file. `npm run build && npx next start -p 9157`, `.next/cache/images`
cleared before restart, killed with `pkill -f next-server` (Lessons 3, 5). All measurement against
that production server, never `next dev` (Lesson 30). Screenshots:
`docs/handoffs/screens/engineering_2026-09-15_v5/`.

**Not tested:** real touch hardware (synthetic `PointerEvent`s again); a real mouse for the desktop
hover tooltip (untouched by this round's edits). A clean desktop screenshot at 1440 and mobile
screenshots at 430 (the full behaviour contract and every measurement table above were still
captured live via `getBoundingClientRect()`/DOM reads, which do not depend on the paint): this
session's browse tooling repeatedly stopped responding (navigation timeouts, then a tab whose
painted frame stopped matching its own live DOM state, matching round 4's documented standing
risk) and did not recover cleanly enough in the time available to get a second clean shot at every
width. What is captured: `baseline-round4-390.png` (before), `candidateA-per-plate-390.png` and
`candidateB-reel-caption-390.png` (the caption decision), `mobile-375-final.png` (the shipped
390/375 look, wheel partly below the fold in the 375 crop), `desktop-1440-attempt.png` (rects
correct per the numbers above, paint not trustworthy, kept for the record rather than discarded).

---

## Open loops found by the intake audit (2026-09-16)

Kazim asked whether anything the client asked for had been missed. The whole intake was re-read
against the built code: the meeting recording, the blueprint, her deck and structure documents,
and all three email rounds. Full audit in the session record; what survived verification is
below. These are written here because the audit's real finding is that **a request with no home
in a list evaporates**, and four of these had none.

**Open with the client (folded into `docs/intake/lorena_reply_2026-09-16.md`):**
- [ ] **The opening sequence.** In the meeting she liked the burgers-dropping idea for the hero
      and said she would check with Eren about that month's photo shoot. The answer never came
      and nobody chased it. The hero is still a still photograph. Transcript 12:26:36 to 12:28:35.
- [ ] **Station 8's hours.** The docx lists 11:00 AM to 9:00 PM; the card says "Opening soon"
      because the hall has not opened. A studio judgement, never confirmed with her.
- [ ] **The Locations title.** Her blueprint centres it with "Find us" under its right edge
      (verified against `Cosmos Assets/_derived/mockup/mock_p1_s06.png`); we built it left
      aligned. The only headline on the page that departs from her own alignment.
- [ ] **Cauliflower Bites photo**, the last menu item without one. Never on the open-questions
      list; only ever mentioned in an unsent draft.

**Open with Eren, not Lorena:**
- [ ] **The purple in transparent.** His request, which Lorena tried and disliked ("it is not the
      color of the brand identity"), left at "he will talk with you about what kind of options"
      (transcript 12:12:32 to 12:13:37). Never chased, never listed. Belongs in a note to him,
      not in her email.

**Client-facing document that was wrong: closed 2026-09-16.**
- [x] `Cosmos_Development-Report_2026-09-02.html` told the client the animated wordmark was "the
      signature moment of the site" and that the menu carried "no prices", both false within
      hours of it being written. **Kazim confirmed it was never sent**, so nothing is in THG's
      hands. Moved to `docs/reports/archive/` with the reason written beside it, because the
      remaining risk was not the client's copy but ours: a wrong report sitting in the reports
      folder is one someone mails later. A fresh one comes from `devreport Cosmos`, not from
      correcting that file.

**Answered but never told to her** (no action unless she asks):
- Her round-2 "move the values band higher" was largely given back in round 3, to keep the plates
  off "Fresh always" once she asked for the columns to be centred.
- The animated hero logo was built and then removed (Lesson 14).
- "Bold Flavour" beside "Unleash the flavor" keeps her own spelling mix; two handoffs promise this
  was "flagged to her" and there is no record that it was.

**Stale ticks corrected nowhere yet:** `tasks/todo.md` P3 and `SCOPE.md` still tick the animated
hero logo as delivered, and the plate-name confirmation still reads open in `lib/content.ts`
though she confirmed it on 2026-09-08.
