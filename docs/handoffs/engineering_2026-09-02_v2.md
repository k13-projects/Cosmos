# Engineering handoff v2 — Cosmos Burger, blueprint fidelity pass (Natalia, 2026-09-02)

## Status      PASS

## Summary
Five corrections from Kazim's review of the live preview against Lorena's PDF, all landed 1:1 with
the blueprint. The hero is a photograph and a nav again, the About plates hang on a scroll-driven
wheel with instant tooltips, the table spread is a cutout laid on the purple pattern instead of a
flat band, the nav logo has a shadow and no ground, and the footer is two symmetric columns with no
address dump. `npm run build` and `npx tsc --noEmit` are clean, no `any`, no `console.log`, no em or
en dash in visitor copy, zero console errors, and `scrollWidth == innerWidth` at 320, 375, 414, 768,
1024, 1280 and 1440.

Nothing committed, no branch created, still on `cosmos_sep02_v3`.

## What Kazim asked for, what changed, and the proof

| # | Ask | What changed | Proof |
|---|-----|--------------|-------|
| 1 | Hero is the photo and the nav only, no wordmark, delete the dead CSS | `components/Hero.tsx` drops the animated `<CosmosLogo>`, the `logo-write` / `logo-breathe` / sheen wrappers and the `armed` state; the `<h1>` survives as the page's accessible name. `.logo-write`, `.logo-write::after`, `.logo-breathe`, `@keyframes logo-wipe` and `@keyframes logo-breathe` deleted from `app/globals.css`, and their reduced-motion entry with them. | `01_hero_1280.png`, `07_hero_375.png`. Read back from the shipped stylesheet: `logo-write` **false**, `logo-breathe` **false**, `logo-wipe` **false**. Hero is a client component no longer. |
| 2 | The plates are a wheel on an arc, scroll turns it, instant tooltip, never over the copy or "Fresh always" | New `components/PlateWheel.tsx`. Hub off-screen right at `100% + 0.676R`, `R = clamp(430px, 39.4vw, 560px)`, six spokes 14.1 degrees apart from -148.8, each plate counter-rotated. One rAF-throttled scroll handler writes `--wheel-rot` on the hub only, `will-change: transform`, no layout write. Names live in `about.plates[].name`. Below 1024 the three-plate row stays, with the same tooltips. | Rotation: `--wheel-rot` **17.12deg** → **26.59deg**, hub transform `matrix(0.95569, 0.294374, ...)` → `matrix(0.894232, 0.447603, ...)` (`02_`/`03_about_wheel_1280_rot*.png`). Tooltip: `04_tooltip_1280.png`, `16_tooltip_focus_1280.png`, `08_about_row_tooltip_375.png`; yellow `rgb(250,240,12)` on purple `rgb(117,16,128)`, Archivo 900 uppercase, `transition-duration 0.08s`, opacity 0 → 1 on hover and on focus. Clearances below. |
| 3 | The spread is a sticker on the pattern, not a photo band | `scripts/build-assets.sh` no longer mattes `Cosmos General.png` onto cream; it resizes to 2000px and encodes with `cwebp -q 84 -alpha_q 100`, writes `public/photos/spread.webp` and deletes `band-spread.webp`. The cutout now closes the purple EXPLORE OUR MENU band (`components/MenuSection.tsx`), full bleed, no frame, its own shadows, and the cream Catering band starts exactly at its bottom. | `spread.webp` is **RGBA 2000x1334, alpha bbox (0, 162, 2000, 1334)**: the transparent top wedge survived. `05_spread_sticker_1280.png` shows the rearmost plates standing over the pattern. Measured at 1280: image 3857 → 4711, `#menu` bottom 4711, `#catering` top **4711**. At 375 it holds 720px and crops at the sides (`09_spread_sticker_375.png`). |
| 4 | Nav logo: no backdrop, a shadow, bigger, and fix the overlap at the source | `components/Nav.tsx` drops the `stuck ? bg-purple` pill behind the logo. New `.logo-shadow` utility, a purple-tinted double `drop-shadow`. Logo 58px on a phone, 72px at lg (1.3x the 48px and 56px pills), nudged down so the swoosh dips below the pill line; the link keeps a `min-h-11` box. Overlap fixed with `scroll-padding-top: 8rem` plus `scroll-mt-28 lg:scroll-mt-32` on `#about`, `#menu`, `#catering`, `#locations`, `#contact`, and About's top padding raised to `lg:pt-36`. | Logo over the hero `01_`/`07_`, over the About band `14_navlogo_over_about_375.png`, over cream `15_navlogo_over_cream_1280.png`. Anchor jump to `#about`: at 375 headline top **320px**, header bottom **82px**, clearance **238px**; at 1280 headline top **400px**, header bottom **104px**, clearance **296px**. |
| 5 | Footer: symmetric, tidy, no address dump | `components/Footer.tsx` rebuilt: wordmark centred, then a two-column `sm:grid-cols-2` of FOLLOW US (three icons, each handle beneath it) and CONTACT INFO (the Instagram line, the handle on its own line, phone and email only when non-empty). The four-hall list is gone; `locations` is no longer imported. Operator, legal and © centred below. | Columns measure **502px and 502px** at 1280, at x 122 and 656. `/Windmill|Palomar|Miramar Food Hall|Global Fork/.test(footer.textContent)` → **false**. `06_footer_1280.png`, `10_footer_375.png`, `11_footer_320.png`, `12_footer_768.png`. |

## No-overlap proof for the wheel

Swept every 150px of scroll through the whole About and values run, at four widths, asserting
`window.innerWidth` in band each time. `collide` counts any plate whose bottom passes the value
icon row while its left edge is still left of the third column's right edge.

| Width | Plate arc vs About copy (min gap) | Topmost visible plate vs band top | Third column ("Fresh always") | Collisions |
|-------|----------------------------------|-----------------------------------|-------------------------------|-----------|
| 1024 | copy right 688, nearest plate left 804 → **+116** | **123px below** the seam at worst | col3 right 992, icon row 1674 | **0** |
| 1280 | copy right 688, nearest plate left 1021 → **+333** | **57px below** | col3 right 1158, icon row 1674 | **0** |
| 1440 | copy right 708, nearest plate left 1154 → **+446** | **8px below** | col3 right 1238, icon row 1674 | **0** |
| 1920 | copy right 948, nearest plate left 1634 → **+686** | **8px below** | col3 right 1478, icon row 1674 | **0** |

Single-frame numbers at 1280, blueprint pose (`--wheel-rot: 2.43deg`), for the record: plates at
(l, t, r, b) = (1105, 944, 1297, 1059), (1050, 1045, 1242, 1179), (1023, 1177, 1215, 1289),
(1026, 1301, 1218, 1412), (1060, 1423, 1252, 1529), (1121, 1523, 1313, 1644). About band 774 → 1530,
so the lowest plate spills **114px** over the seam, as the blueprint draws it, and stops **30px**
above the icon row.

The direction of the turn is a constraint, not a taste call. Six plates on this arc need roughly six
plate heights of vertical room and the band plus the values band's top padding is barely more than
that, so the wheel rotates **upward only** from the blueprint pose (rho 0 → +32 degrees across the
band). That makes rho = 0 the deepest the arc can ever reach and turns "no plate touches Fresh
always" into geometry rather than a measurement that happens to hold at the widths we tested.

## Plate names

Each `plates/N.png` was compared to the five named best-seller cutouts by RGB RMSE after cropping to
the alpha bounding box and resizing to 160x160. Three are the same photograph; three match nothing
we hold a name for.

| Plate | Name shipped | Basis |
|-------|--------------|-------|
| 1 | BLUE CHEESE | blue-cheese **50.5**, runner-up spicy-jam 54.2 |
| 2 | CHICKEN SANDWICH | no match (best 55.2). Crispy chicken, red glaze, slaw. Reads like **Hot Chicks**. |
| 3 | SMASH BURGER | no match (best 58.1). Double smash, cheese, shredded lettuce. Reads like **The Basic**. |
| 4 | COSMOS BURGER | cosmos-burger **53.0**, runner-up spicy-jam 56.5 |
| 5 | SPICY JAM | spicy-jam **49.4**, runner-up blue-cheese 58.4 |
| 6 | CRISPY CHICKEN | no match (best 70.1). Crispy chicken with purple slaw. Reads like **Truffle Honey**. |

MONKEY FRIES and THE CHICKS are **not** on the wheel: neither photograph appears among the six
plates, so neither name was used.

## Files

**New**
- `components/PlateWheel.tsx` — the wheel, the three-plate row, and the shared `Plate` (cutout +
  tooltip). The only new file.
- `public/photos/spread.webp` — the cutout, alpha intact.
- `docs/handoffs/screens/engineering_2026-09-02_v3/` — 16 screenshots.

**Changed**
- `components/Hero.tsx` — wordmark and its animation removed; server component again.
- `components/About.tsx` — client component so it can hand its own element to the wheel; copy
  untouched; `scroll-mt` and `lg:pt-36` added.
- `components/Nav.tsx` — logo ground removed, `.logo-shadow`, new sizes, tighter md nav row.
- `components/Footer.tsx` — rebuilt, addresses removed.
- `components/MenuSection.tsx` — the spread cutout closes the band.
- `components/Values.tsx` — `lg:pt-36`, the clear lane the lowest plate lands in.
- `components/CateringSection.tsx`, `components/Locations.tsx` — `scroll-mt` only.
- `app/page.tsx` — the spread `PhotoBand` removed.
- `app/globals.css` — hero-logo animation deleted; `.plate-wheel`, `.wheel-hub`, `.logo-shadow`
  added; `scroll-padding-top` 7rem → 8rem; reduced-motion block updated.
- `lib/content.ts` — plate names + `platesHint`, `spread` replaces `photoBands.spread`, social
  handles.
- `scripts/build-assets.sh` — the cutout export.

**Deleted:** `public/photos/band-spread.webp`.

**Not touched:** every other component, `next.config.mjs`, `package.json`. No dependency added.
`.claude/Lessons.md` shows as modified in `git status`, but not by me; it already carried items
14 to 18 when I read it.

## Bugs found and fixed during the pass

1. The wheel's hub sits past the right edge, which widened the document to `scrollWidth 1704` at
   1280. Fixed with `overflow-x-clip` on the wheel frame: `hidden` would have clipped the vertical
   axis too and killed the spill over the seam that the blueprint draws.
2. The mobile tooltip was `whitespace-nowrap` and pushed the document to 391px at 375. Capped at
   `max-w-[30vw]` and allowed to wrap, only for the row placement.
3. The footer handle `@cosmosburger.sandiego` overflowed its grid cell (a grid item's default
   `min-width: auto` beats `minmax(0,1fr)`): `min-w-0` on the `li`, `w-full` on the span.
4. At 768 the 1.3x logo pushed the nav pill 38px past the viewport. The logo holds 52px at md and
   the nav row tightens there, returning to the blueprint's spacing at lg.

## Verification
- `npm run build` clean, 11 static routes. `npx tsc --noEmit` clean. No `any`, no `console.log`, no
  em or en dash anywhere in `app/`, `components/`, `lib/`.
- Chrome (gstack, berth `cosmos` / 39157), production build on 9157, server stopped afterwards.
- `scrollWidth == innerWidth` at **320, 375, 414, 768, 1024, 1280, 1440**, measured after a full
  scroll to the foot of the page. The header pill's right edge is inside the viewport at all seven.
- `browse console --errors`: zero errors at 375 and 1280 after sweeping the whole page. The only
  entries are `link preload` warnings from `next/image` priority hints, unchanged from the v1 pass.
- Plate buttons: `aria-describedby` resolves to the tooltip's `id`, tooltip has `role="tooltip"`,
  focus alone raises it to opacity 1, and pressing one opens the menu pop-up.
- Shipped `prefers-reduced-motion` block read back from `.next/static/css/*.css`: it neutralises
  `.wheel-hub` transform, `.float`, `.reveal` and `.sheen`, and `PlateWheel` never attaches its
  scroll listener when `matchMedia("(prefers-reduced-motion: reduce)")` matches.

**What I could not test:** reduced motion was verified by reading the shipped CSS and the JS gate,
not by emulating the media query, because the browser tool exposes no flag for it. Landscape phone,
and the widths between 1440 and 1920, were not swept. `scripts/build-assets.sh` was not re-run end
to end; only the `spread.webp` step was executed and its output verified.

## Risks
- **The wheel is tuned to this copy.** `--wheel-r`, `--plate-w` and the hub's `top: 67%` were chosen
  against the current About band height. Materially longer or shorter copy changes the band, and the
  first thing to re-measure is the lowest plate's bottom against the values icon row.
- **Three plate names are ours, not Lorena's.** They are honest generics and they show in a tooltip
  a guest will read as a dish name. Human gate below.
- **`md` (768 to 1023) breaks the 1.3x logo rule** at 52px. It is the only width where the rule and
  the nav cannot both be satisfied; if Lorena wants the full-size mark there, the nav has to lose a
  link or the CTA.
- **The cutout is held at 720px below that width**, so the leftmost and rightmost plates crop off on
  a phone. That is the deliberate trade against squashing it; if the crop loses a dish Lorena wants
  seen, the fix is a second, tighter crop of the same PNG, not a resize.
- Horizon is still unlicensed; every display headline, the tooltips included, is Archivo at
  `wdth 125 / weight 900`.

## Next
**qa-test-engineer (Olga)** for a targeted re-check of the five changes, via the Michael
(code-review) gate. Worth her time specifically: the wheel at 1366 and 1536 (widths I did not sweep),
reduced motion with a real OS setting, and the tooltip on a touch device, where there is no hover and
the plate's only behaviour is opening the menu pop-up.

## Human gate
**Plate names for Lorena to confirm.** Three of the six plates match no named photograph we hold:

1. Plate 2, crispy chicken with red glaze and slaw, shipped as **CHICKEN SANDWICH**. Is it Hot Chicks?
2. Plate 3, double smash with cheese and shredded lettuce, shipped as **SMASH BURGER**. Is it The Basic?
3. Plate 6, crispy chicken with purple slaw, shipped as **CRISPY CHICKEN**. Is it Truffle Honey?

One line each in `lib/content.ts` (`about.plates[].name`) and they are corrected. The other three
(BLUE CHEESE, COSMOS BURGER, SPICY JAM) are pixel matches to her own named files and need no answer.
