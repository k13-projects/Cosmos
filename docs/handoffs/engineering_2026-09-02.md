# Engineering handoff — Cosmos Burger, P1 to P4 (Natalia, 2026-09-02)

## Status      PASS

## Summary
Built the whole Cosmos Burger one-pager from Lorena's Canva blueprint: all thirteen bands in her
order, the two pop-ups, the animated hero logo (P3), the motion layer (P2), the three legal
routes, 404, robots/sitemap, favicon, OG image and per-hall JSON-LD. `npm run build` is clean, no
`any`, no `console.log`, zero browser console errors and zero horizontal leak at 1280x900 and
375x812. Every string lives in `lib/content.ts` with provenance; every CTA without a client URL
degrades to an honest "coming soon" rather than a dead control.

## Files

**New**
- `components/` — `CosmosLogo.tsx`, `Nav.tsx`, `Hero.tsx`, `About.tsx`, `Values.tsx`,
  `BestSellers.tsx`, `PhotoBand.tsx`, `MenuSection.tsx`, `CateringSection.tsx`, `Locations.tsx`,
  `Reviews.tsx`, `Footer.tsx`, `Icons.tsx`, `Buttons.tsx`, `Modal.tsx`, `ModalProvider.tsx`,
  `OrderPanel.tsx`, `MenuPanel.tsx`, `LegalPage.tsx`, `RailArrow.tsx`, `useRail.ts`
- `app/` — `accessibility/page.tsx`, `privacy/page.tsx`, `terms/page.tsx`, `not-found.tsx`,
  `robots.ts`, `sitemap.ts`, `icon.svg`, `opengraph-image.png`
- `lib/logo.ts` — the wordmark path data + its ink bounding box
- `scripts/make-og.py` — regenerates `app/opengraph-image.png` from committed assets
- `docs/handoffs/screens/engineering_2026-09-02/` — 30 screenshots, desktop + mobile + both modals

**Rewritten**
- `lib/content.ts` — every section, both pop-ups, locations, order rows, reviews, footer
- `app/globals.css` — Valentina's `@theme` block and utilities merged over Selma's smaller token
  set, keeping her `.js .reveal` guard, Lenis rules and reduced-motion block
- `app/page.tsx`, `app/layout.tsx` (metadata, JSON-LD, logo sprite, skip link)
- `tasks/todo.md` — P1 to P4 ticked, Review section added

**Not touched:** `public/styleguide.html`, `docs/handoffs/design_2026-09-02.md`,
`scripts/build-assets.sh`, `next.config.mjs`, `package.json`. No dependency added. Nothing
committed, no branch created.

## Blueprint fidelity

| # | Band (facts SS4) | Built as | Deviation | Why |
|---|---|---|---|---|
| — | Nav | Yellow script logo left, floating purple pill with five white Poppins 600 anchors + yellow ORDER ONLINE pill, shadow on scroll. Mobile: hamburger to a purple sheet with LobsterLab's keyboard contract (Escape, focus trap, focus restore, `inert` while closed). | ORDER ONLINE is hidden below 640px, present in the sheet. | At 375 the pill plus five links plus a CTA cannot coexist; same posture as LobsterLab. |
| 1 | Hero | Full-bleed `hero.webp`, 86vh, bottom fade into purple, and the P3 animated wordmark: a 0.9s clip-path wipe, one sheen sweep, then a 4s ambient breathe. Static under reduced motion. | The blueprint's hero carries no wordmark; slide 2 of the ideas deck asks for "Banner: Picture and Animated logo". | Followed the deck, which is the client's own ask and the brief's named signature moment. |
| 2 | About, purple | "UNLEASH THE FLAVOR" yellow display, four white paragraphs, six floating plates cascading down the right edge and over the seam into the values band. | (a) The band carries the burger pattern; the Canva render is flat purple. (b) Below 1024px the cascade becomes three plates in a row under the copy, still floating, still breaking the seam. | (a) The build brief specifies the pattern here and it matches every other purple band. (b) A six-plate right-edge cascade leaves the paragraphs about 28 characters wide on a phone. The plates never overlap text at any width. |
| 3 | Values, magenta | Three tiles, hand-drawn yellow line icons (burger, sound-wave heart, leaf), yellow Poppins 700 titles, white body. | Ground is `--color-magenta-deep` `#B317C4`, not the brand `#CD1AE0`. | White body on the brand magenta is 4.36:1 and fails AA. Valentina's token, and repainting it is an accessibility regression. |
| 4 | Best sellers, cream | Magenta seam tab straddling the band edge; a five-slide carousel, two-word display stack (first word outline purple, second solid), cutout below, chevron arrows, dots, keyboard, swipe, `aria-roledescription="carousel"`, live region, autoplay only when motion is allowed and paused on hover/focus/hidden tab. | Arrows are magenta, not the blueprint's yellow. | This band's ground is cream, and yellow on cream is the one pairing the token sheet rules out at any size. |
| 5 | Photo band | `band-fries.webp`, full bleed, 45vh, `object-cover`. | none | |
| 6 | Explore our menu, purple + pattern | Yellow display headline, white body, two yellow pills: CHECK OUT OUR MENU and ORDER ONLINE. | none | |
| 7 | Photo band | `band-spread.webp`. | none | |
| 8 | Catering, cream | Purple display "CATERING", magenta-ink "Big Cravings. Bigger Gatherings", purple body, purple pill with yellow text to ezCater in a new tab. | none | |
| 9 | Locations, purple + pattern | Yellow "LOCATIONS" + italic white "Find us"; four cream cards, radius 40, on a scroll-snap rail with chevron arrows. Area label magenta-ink caps, hall name, address, hours, Directions to Google Maps, Order pill that opens the pop-up on that hall's row. Station 8 carries Coming Soon and reads "Opening soon". | (a) The rail is kept at every width instead of stacking on mobile. (b) The Order pill is purple, not yellow. | (a) Four stacked cards is a 2,400px column of near-identical blocks, and the snap row is what the blueprint draws. (b) A yellow pill on a cream card has almost no separation; purple-with-yellow is the pairing the blueprint itself uses for ORDER CATERING on cream. |
| 10 | Photo band | `band-chicken.webp`. | none | |
| 11 | Reviews, cream | Magenta display "REVIEWS", italic purple sub-line, tan cards radius 40, five magenta stars, four verbatim quotes, "Google reviewer" / "Yelp reviewer" plus the source label. | none | Two punctuation normalisations only, no words changed: a spaced hyphen becomes a comma under the house dash rule, and a double space is collapsed. |
| 12 | Photo band | `band-phone.webp`. | none | |
| 13 | Footer, purple + pattern | Big yellow wordmark, FOLLOW US with Instagram/Facebook/TikTok as inline yellow SVG, CONTACT INFO, operator line to tigerhospitalitygroup.com, Privacy/Terms/Accessibility, © year. | CONTACT INFO shows "Questions? Message us on Instagram" plus the four halls, and no phone or email. | The docx left the block blank and no number is confirmed for these four halls. `contact.phone`/`contact.email` are empty strings with a `TODO(client)`; fill either and the footer renders it with no code change. |
| — | Order pop-up | Five rows in the docx's order, Toast Pickup / Toast Delivery / DoorDash per row, modelled exactly like LobsterLab's `orderChannels` + `locations[].ordering`. Only the two public DoorDash URLs are wired; the rest render "Online ordering coming soon, order at the counter." Station 8 reads "Opening soon". | Channels are brand text chips, not logos. Oceanside appears here but not in Locations. | No third-party logo files were supplied and we do not reuse another project's licensed marks. Oceanside follows the docx literally, per facts SS6.1, and is commented as such. |
| — | Menu pop-up | Junk-Burgers-style grid, five categories, 27 items, an Order pill per category, "Full menu with prices coming soon." at the foot. | No prices. Photos only on the five items we actually hold photography for; everything else gets a branded purple tile with the yellow burger icon. | No menu file was supplied. The six plate cutouts are deliberately NOT reused: their dishes cannot be matched to a menu name with confidence, and a burger photographed under the wrong name is a promise the kitchen cannot keep. |

## Decisions taken (recorded, not asked)
1. **Pattern on the About band.** The build brief asked for it, the Canva render is flat. Shipped
   at `.pattern-soft` (55% of the asset's own alpha) so it does not fight the plate cascade.
2. **Plate cascade splits at 1024px.** Six down the right edge above, three in a row below. The
   alternative squeezes the copy to about 28 characters on a phone.
3. **Locations stay a snap rail on mobile**, matching the blueprint rather than stacking.
4. **Carousel is hand-built** on React state, no library, so the reduced-motion contract is exact
   rather than approximate and no dependency was added.
5. **"The Chicks" photo moved.** The client's `Best Sellers/THE CHICKS.png` is the chicken tenders
   plate, not the sandwich. It now sits on the Chicken Tenders row and the Chicken Sandwiches row
   has no photo. Its alt text was corrected everywhere.
6. **Reviews punctuation.** A spaced hyphen became a comma (house dash rule) and one double space
   was collapsed. No word in any quote was changed. The emoji in the Yelp quote was dropped with
   the same normalisation; if it should stay, it is a one-line change in `lib/content.ts`.
7. **`PRODUCTION_URL` is `https://www.burgerscosmos.com`**, the domain this site replaces, so
   `robots.ts` noindexes every preview. Change it at cutover if the domain changes.
8. **Legal pages are written for a site that collects nothing** (no forms, no analytics, no
   cookies). The privacy page says so plainly instead of boilerplate. There is a code comment,
   not a page note, recording that counsel review is pending, and that the CCPA disclosures
   LobsterLab carries become required here the moment anything is collected.

## Bugs found in the browser pass, and fixed
1. The wordmark rendered as a bare swoosh everywhere. An `<svg>` wrapping a `<use>` of a
   `<symbol>` must not repeat the symbol's offset viewBox: the use box sits at the origin, so the
   window was shifted by (20, 314) user units and clipped all but the tail.
2. The hero's purple veil was a single top-to-bottom gradient and tinted the burgers purple.
   Replaced with stops that scrim only the top band and the bottom seam.
3. `overflow-hidden` cropped the "OUR BEST SELLERS" seam tab flat (it is pulled half its height
   above its own section). `overflow-x-clip` leaves the vertical axis visible; `hidden` cannot.
   At 375px the tab also ran wider than the viewport and read as a full-width bar, not a pill.
4. `snap-start` with no `scroll-padding` rests a rail at `scrollLeft == padding-left`, which put
   the first location card hard against the viewport edge.
5. Two inline footer links measured 21 and 23px tall. WCAG 2.5.8 exempts inline text links, but an
   automated sweep flags them on every run, so they were padded past 24px.

## Verification
- `npm run build` clean, 11 static routes, no type errors. `npx tsc --noEmit` clean.
- No `console.log`, no `any`, no em or en dash anywhere in `app/`, `components/`, `lib/`.
- Chrome (gstack, berth `cosmos`/39157) at **1280x900** and **375x812**: `browse console --errors`
  reports none on either; `scrollWidth == innerWidth` at both, so no horizontal leak; one `<h1>`;
  title correct; both pop-ups open, trap focus, close on Escape and on the close button.
- Tap-target sweep at 375: zero controls under 24x24 (the skip link is 1x1 until focused).
- `/accessibility`, `/privacy`, `/terms` 200; an unknown path 404s to the branded page;
  `robots.txt` and `sitemap.xml` render; the built HTML carries four `Restaurant` JSON-LD entries.
- The shipped stylesheet's `prefers-reduced-motion` block was read back from
  `.next/static/css/*.css` and neutralises `.reveal`, `.logo-write`, `.logo-breathe`, `.sheen` and
  `.float`; Lenis and carousel autoplay are gated in JS by `matchMedia`.
- Screenshots: `docs/handoffs/screens/engineering_2026-09-02/` (12 desktop bands, 12 mobile, both
  modals at both widths, mobile nav sheet, 404, privacy).

**What I could not test:** reduced motion was verified by reading the shipped CSS and the JS
gates, not by emulating the media query, because the browser tool exposes no flag for it. Olga
should confirm it with a real OS-level setting. I also did not run `fitcheck`, so the seven
viewports between 320 and 1920 that I did not measure are unproven.

## Risks
- **Horizon is still not licensed.** Everything is set in Archivo at `wdth 125 / weight 900`.
  Headline widths will shift when the real face lands; nothing uses a fixed line break, so it
  should absorb it, but every display headline wants a re-look that day.
- **The plate cascade is absolutely positioned by percentage** down the About band. If the About
  copy grows or shrinks materially, the plates re-space with it and the lowest one's overhang into
  the values band will change. It is the first thing to re-measure after any copy edit.
- **Three of five order rows have no URL at all**, so most of the ORDER ONLINE pop-up is a
  "coming soon" list today. It is honest, but it is not a finished ordering experience.
- **The menu pop-up is built from the live site's item list**, not from a client menu. Names may be
  stale and there are no prices. Expect a full content pass when Lorena sends the real menu.
- **`app/opengraph-image.png` is generated through macOS `qlmanage`**, so `scripts/make-og.py`
  will not run on CI or Linux. The PNG is committed, so that only matters when regenerating.
- The best-seller carousel autoplays every 6 seconds. If Lorena finds it fast, `AUTO_ADVANCE_MS`
  in `components/BestSellers.tsx` is the one number to change.

## Next
**qa-test-engineer (Olga)**, via the Fadil code-review gate.

## Human gate
Two items, both already on the batched list for Lorena, and neither blocks QA:
1. **Horizon licence.** Does THG have an Adobe Fonts seat? If not, Archivo ships permanently and
   Lorena should be told the headlines read very slightly narrower than her Canva.
2. **The Yelp review's emoji.** The docx quote contains one. It was dropped in the same
   normalisation pass as the dashes. If quotes must be byte-for-byte verbatim, say so and it goes
   back in.

## Evolution
Rasterised the client's logo SVG at three colour assignments before writing a line of code, to
find out which of its three fill classes is actually the mark. It turned out to be one of three
(`.st0`), with the other two a keyline and an unused "BURGERS & CHICKEN" lockup, and the ink
bounding box came out of the same raster. Ten minutes of measuring saved shipping a logo with dead
margin around it, and it is worth repeating on any project whose identity arrives as one vector.
