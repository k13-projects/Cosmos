# Cosmos Burger QA Report v2

**Date:** 2026-09-02
**Tester:** Olga (qa-test-engineer), two-agent Chrome gate
**Branch:** `cosmos_sep02_v3` (base commit `9bd1689`, nothing committed by me)
**Build under test:** `npm run build && npx next start -p 9157`, production output, not `next dev`
**Browser:** gstack Chromium, berth `cosmos`, `BROWSE_PORT=39157`
**Scope:** targeted re-check of Natalia's PDF-fidelity pass (engineering handoff v2), plus the
house fitcheck the nav and layout changes require.

## Verdict: PASS

Three defects found, all three fixed at the source and re-proved with a before/after pair. Nothing
in Kazim's five asks was undone; the wheel, the cutout, the bare logo, the photo-only hero and the
address-free footer are all intact and are all now backed by numbers taken in a real browser.

---

## 1. Fitcheck, eleven viewports

Nine house viewports plus 1366 and 1536. Every run asserts `window.innerWidth` in band before it
measures, and every run walks the page to the foot and back first so scroll-reveal content is not
counted as hidden. `TRUST: ok` on all 11 runs, both before and after my changes.

| Viewport | h-leak | tap AA fails | hidden but focusable | scroll traps | text under 12px |
|---|---|---|---|---|---|
| 320x568 | 0 | 0 | 0 | 0 | 0 |
| 375x667 | 0 | 0 | 0 | 0 | 0 |
| 430x932 | 0 | 0 | 0 | 0 | 0 |
| 768x1024 | 0 | 0 | 0 | 0 | 0 |
| 844x390 (landscape) | 0 | 0 | 0 | 0 | 0 |
| 932x430 (landscape) | 0 | 0 | 0 | 0 | 0 |
| 1024x768 | 0 | 0 | 0 | 0 | 0 |
| 1366x768 | 0 | 0 | 0 | 0 | 0 |
| 1440x900 | 0 | 0 | 0 | 0 | 0 |
| 1536x864 | 0 | 0 | 0 | 0 | 0 |
| 1920x1080 | 0 | 0 | 0 | 0 | 0 |

The "text under 12px" column was **3 at 320, 375 and 430 on the first run** (the three footer
social handles at 11px) and is 0 everywhere after QA-v2-01.

### Header clearance after anchor navigation

Five anchors (`#about`, `#menu`, `#catering`, `#locations`, `#contact`) at all 11 viewports, 55
combinations. For each: the section's first visible headline box against the header box and against
the logo box.

- **Zero overlaps with the header band. Zero overlaps with the logo box.** There is no ink on ink
  after any anchor jump at any width.
- Minimum clearance **222px** (320/375/430 at `#catering` and `#locations`).
- Maximum clearance 589px (1920 at `#contact`).
- Logo hit box measures **134x58** at phone, **120x52** at md, **166x72** at lg. Every one clears
  the 44px guideline on both axes, so ask 4's hit-box requirement holds at every width.

---

## 2. The plate wheel

Swept every 120px of scroll through the entire About band at 1024, 1280, 1366, 1440, 1536 and 1920.
13 samples per width, and each run reports the number of **distinct** `--wheel-rot` values so a
sweep that did not actually move is visible rather than silently passing.

| Width | distinct rotations | min gap, copy to nearest plate | min gap, lowest plate to "Fresh always" icon row | collisions with copy | collisions with col 3 |
|---|---|---|---|---|---|
| 1024 | 13 | +114 | +107 | 0 | 0 |
| 1280 | 13 | +333 | +54 | 0 | 0 |
| 1366 | 13 | +401 | +30 | 0 | 0 |
| 1440 | 13 | +446 | +15 | 0 | 0 |
| 1536 | 13 | +494 | +15 | 0 | 0 |
| 1920 | 13 | +686 | +15 | 0 | 0 |

No plate intersects the About copy block or the values band's third column at any rotation, at any
of the six widths, including the two Natalia had not swept (1366, 1536). The wheel turns:
`--wheel-rot` runs 2.43deg to 32.00deg across the band and the hub's matrix changes with it.

**Method note.** My first sweep reported a flat 32deg at every sample and zero collisions. That was
a false pass: `scroll-behavior: smooth` is set on `html` and Lenis is active, so a 0.3s settle after
`window.scrollTo` measured the previous scroll position. The clean result came from a check that
never ran. Every number above is from the re-run with `behavior: "instant"`, a 0.55s settle, and the
distinct-rotation count as the proof the sweep moved. This is the same failure mode as the two in my
v1 report and it is now caught by an assertion rather than by luck.

### Tooltips

- **Hover, all six plates, at 1280 and 1920:** opacity 0 to 1, all six fully on screen, all
  `text-transform: uppercase`, transition 80ms.
- **Keyboard focus, plates 1, 4 and 6 at both widths:** `:focus-visible` matches and opacity rises
  to 1 with no pointer involved.
- **Semantics:** `aria-describedby` resolves to the tooltip's own `id`, `role="tooltip"` present,
  and each plate carries an `sr-only` accessible name plus the hint that pressing it opens the menu.

---

## 3. The spread cutout

Measured at 375, 768, 1280 and 1920, with the image scrolled into view and fully decoded.

| Width | rendered | aspect rendered vs source | seam gap, table bottom to Catering top | squashed |
|---|---|---|---|---|
| 375 | 720x480 | 1.4988 / 1.5 | **0** | no |
| 768 | 768x512 | 1.5 / 1.5 | **0** | no |
| 1280 | 1280x854 | 1.4988 / 1.4988 | **0** | no |
| 1920 | 1920x1281 | 1.4988 / 1.4988 | **0** | no |

The Catering band starts on exactly the pixel the table ends. The cutout's transparent top wedge
shows the purple burger pattern through it and the back row of plates stands above the table's back
edge, which is the whole point of ask 3 and Lesson 15. Screenshot
`11_spread_topedge_1280.png` is the evidence.

Alpha survives delivery: the optimizer returns **AVIF 1920x1281 with `hasAlpha: yes`** to a browser
Accept header. It falls back to JPEG, which has no alpha, only for a client that advertises neither
AVIF nor WebP. That is a very old browser and it would see the cutout flattened on black. Logged as
a risk, not a defect.

**A measurement I nearly filed as a bug.** The fitcheck image check reported the spread and both
photo bands as "upscaled", with `naturalWidth` tracking the viewport width exactly at every size.
That is a headless-Chromium reporting quirk for AVIF, not an under-delivery: the served file is
1920x1281 and the rendered screenshots at 375 and 1920 are both sharp. Reported here so the same
number does not get re-filed next pass.

---

## 4. The nav logo

Judged on four grounds at 1280, at the real rendered size, screenshots `20_` to `24_`.

| Ground | Reads? | Note |
|---|---|---|
| Hero photograph | Yes | comfortably, the photo is dark behind the mark |
| Purple pattern band | Yes | highest contrast of the four |
| Cream `#FFF2E1` | Yes, but | this is the weakest of the four. Yellow on cream is low contrast on its own and it is **entirely** the double drop-shadow that separates the mark. It reads as a logo, and it is the mechanism Kazim chose over a ground, so it stands. It is also the first thing to re-check if the shadow is ever softened. |
| A yellow display headline, mid scroll | Yes | the worst case, yellow on yellow. The purple shadow outlines the script well enough to read it. The headline behind is momentarily broken up, which is what a fixed header does to any content that passes under it, at any width. |

**No backdrop at any width.** Confirmed in markup and in every screenshot: there is no ground behind
the logo on a phone, at md, or at lg, scrolled or not. Lesson 17 holds.

The mid-scroll yellow-on-yellow pass-through is **accepted, not fixed**. The fix Kazim named for
that problem is scroll-margin so a headline never *lands* under the header, and that is proven clean
across all 55 anchor combinations above. Adding a ground back would undo ask 4.

---

## 5. The footer

Two defects, both fixed. Numbers at the four requested widths.

Column geometry is symmetric by construction and measures it: at 1280 both columns are **502px** at
x 122 and x 656, both `top: 529`, both **130px tall**. At 768 both are **336px**, both `top: 637`,
both **146px tall**. `/Windmill|Palomar|Miramar Food Hall|Global Fork/` against the footer text is
**false**: no address list, Lesson 18 holds.

Every icon and its handle share a centre line (`offset: 0`) at every width, before and after.

---

## Defects

### QA-v2-01: FOLLOW US handles were 11px and packed into cells too narrow to hold them
**Severity:** medium (legibility floor + the visual defect the coordinator flagged)
**Where:** `components/Footer.tsx`

The handle list was capped at `max-w-[400px]`, which made every cell **128px** at 1280 while
`@cosmosburger.sandiego` measures **159px** at 12px Poppins. The long handle wrapped to two lines
while its neighbours held one, and the three handle boxes sat **8px** apart in a 400px band under
icons spread across the full 502px column. The row read as one packed line of text beneath three
widely spaced glyphs rather than three labelled channels. The handles were also **11px**, the only
text on the site under the fitcheck's 12px legibility floor, and they are link labels.

Fixed by letting the grid take the whole column from `sm` up and raising the handle to 12px.

| | before | after |
|---|---|---|
| handle font size | **11px** (320/375/430) | **12px** at every width |
| fitcheck `under12px` at 320/375/430 | **3 entries** | **0** |
| cell width at 1280 | **128px** | **162px** |
| icon centres at 1280 | 237 / 373 / 509 (inside a 400px band) | **203 / 373 / 543** (across the full 502px column) |
| `@cosmosburger.sandiego` at 1280 | **2 lines** | **1 line** |
| FOLLOW US / CONTACT INFO at 1280 | 502 / 502px, both 146px tall | **502 / 502px, both 130px tall**, both `top: 529` |

### QA-v2-02: the mobile plate row never showed a dish name on a touchscreen
**Severity:** medium (UX rule #1, and a stated requirement of this pass)
**Where:** `components/PlateWheel.tsx`

Below 1024 the three-plate row carried the same hover/focus tooltip as the desktop wheel. A
touchscreen has no hover, and a tap on a `<button>` fires `:focus` but **not** `:focus-visible`, so
`group-focus-visible:opacity-100` never matched. Worse, the tap opens the menu dialog, which then
takes focus away entirely. Reproduced with a real pointer click at 375: after the click,
`focus: false`, `focusVisible: false`, `tipOpacity: "0"`, `modalOpen: true`.

The net effect on every phone was three anonymous burger photographs that happen to be buttons, with
no name, no label and no signal that they are interactive.

Fixed by making the name permanently visible on the row (it is a label there, not a tooltip) and
giving it headroom to sit in. The wheel's hover/focus tooltip is untouched. The pill's `role`,
`aria-describedby` and `aria-hidden` are now scoped to the wheel only, so a screen reader no longer
hears the dish name twice on the row.

| | before | after |
|---|---|---|
| tooltip opacity after a real tap at 375 | **0** | **1** |
| names visible at 375 / 430 / 320 | **none** | **all three**, uppercase, on screen |
| row top margin | `mt-10` (40px) | `mt-16` (64px), the lane the label sits in |
| horizontal leak at 320 / 375 / 430 | 0 | **0** |

### QA-v2-03: footer handles broke mid-word at 320, 375 and 768
**Severity:** low (cosmetic, surfaced by the QA-v2-01 font bump)
**Where:** `components/Footer.tsx`

`@cosmosburger.sandiego` is one unbreakable word to CSS, so `break-words` chopped it mid-syllable in
any cell narrower than 159px: "@cosmosbur / ger.sandiego" at 768, and at 320 all three handles broke
("@burger.cos / mos", "/CosmosBurg / er").

Fixed with a real break opportunity after each dot, plus a single column below 360px where even a
dotless handle cannot fit.

| Width | before | after |
|---|---|---|
| 320 | 3 handles broken mid-word, 3 columns of 88px | **1 column, all three on one line**, centred |
| 375 | TikTok handle broken mid-word | **wraps at the dot**, two lines, as intended |
| 768 | TikTok handle broken mid-word | **"@cosmosburger. / sandiego"**, a real boundary |
| 1280 | TikTok handle on two lines | **one line** |
| horizontal leak, all four | 0 | **0** |

---

## Reduced motion

Emulated for real this time, with `Emulation.setEmulatedMedia` over CDP rather than by reading the
shipped stylesheet. `matchMedia("(prefers-reduced-motion: reduce)").matches` returned **true** in
band for every check below, and **false** again after the override was cleared.

| Check | Result |
|---|---|
| `--wheel-rot` at scrollY 300 / 900 / 1500 | **0deg / 0deg / 0deg** |
| `.wheel-hub` computed transform | **none** at all three positions |
| plate float animation | `animation-name: none`, duration `0s` |
| tooltip on hover | opacity **1**, correct dish name |
| tooltip on keyboard focus | opacity **1**, correct dish name |
| `.reveal` elements stuck hidden | **0 of 24** |
| mobile row labels | all three at opacity **1** |

The wheel is a static arc in the blueprint pose, nothing floats, nothing is hidden, and every
tooltip still works. This closes the item Natalia listed as untested.

---

## Console

Swept every route at 1280, scrolling each to the foot and back: `/`, `/privacy`, `/terms`,
`/accessibility`, and a 404 path.

**Zero JavaScript errors on every route.** The only entries are `link preload` warnings from
`next/image` priority hints, unchanged from both previous passes. The one `error` line belongs to
the 404 route returning 404, which is the not-found page working.

---

## What I did not test

- Real hardware. Every touch conclusion here comes from Chromium's pointer emulation, not a phone in
  a hand. `Input.dispatchTouchEvent` is not on the browse CDP allowlist, so the tap path was
  exercised with a real pointer click, which shares the `:focus-visible` behaviour but is not
  identical to a finger.
- Screen readers. The ARIA wiring was read from the DOM, not heard.
- Safari and Firefox. Chromium only.
- The live preview domain. Everything here is `http://localhost:9157`.
- Performance and Core Web Vitals.
- External destinations (Instagram, Facebook, TikTok, the ordering provider).
- `scripts/build-assets.sh` end to end.

## Risks carried forward

- **The 15px clearance.** The lowest plate's deepest reach sits 15px above the "Fresh always" icon
  row at 1440 and above. Positive at every sample, but it is 15px, and the plate's drop shadow is
  not in that box. Any change to the About copy length, the values band's `lg:pt-36`, or the wheel
  radius re-opens this. It is the first number to re-measure after any copy edit.
- **`sips -Z 2048` in the build script** still starves the two portrait photo bands of width; they
  measure as upscaled from 768 up. Unchanged from my v1 report, still Natalia's call, still not a
  release blocker.
- **Horizon is unlicensed.** Every display headline and every plate tooltip is Archivo at
  `wdth 125 / weight 900`. When the real face lands, the tooltip pill widths and the footer handle
  widths are both sized against real strings and both need re-measuring.
- **The JPEG fallback flattens the cutout's alpha** for a browser that accepts neither AVIF nor
  WebP. Cosmetic, and only on browsers well below the support floor.
- **Three plate names are ours, not Lorena's.** Natalia's human gate is unchanged by this pass.
