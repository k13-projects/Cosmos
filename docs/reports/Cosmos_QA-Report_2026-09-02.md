# Cosmos Burger, QA report (Olga, 2026-09-02)

## Verdict: PASS

Zero open AA failures and zero horizontal leaks at all nine viewports, on the home page and on
every legal route plus the 404. Five defects were found and fixed at the source during this pass.
Two delivery defects are logged unfixed because they live outside my edit scope, and neither is an
AA or leak failure.

**Build under test:** production (`npm run build && npm run start`), port 9157, Chromium via the
`cosmos` gstack berth (profile `~/.gstack/berths/cosmos`, `BROWSE_PORT=39157`). Every measurement
asserts `window.innerWidth` in band, because the browse daemon is shared. Server confirmed 200 with
a populated DOM before any sweep was trusted.

**Note on the config under test:** Ana's security hardening (CSP, HSTS, anchored preview host) landed
in `next.config.mjs` at 03:34, mid pass. I did not revert it. I rebuilt and re-verified the whole
console and interaction pass against the CSP actually being served, because a new CSP is exactly the
kind of change that breaks a page in silence. It does not: zero console errors, no CSP violations,
React hydration confirmed live by opening a modal.

---

## Viewport matrix, final state

| Viewport | Leak | Tap targets under AA | Hidden but focusable | Scroll origin traps | Next section visible | Verdict |
|---|---|---|---|---|---|---|
| 320x568 | 0 | none | none | none | 80px | PASS |
| 375x667 | 0 | none | none | none | 93px | PASS |
| 430x932 | 0 | none | none | none | 130px | PASS |
| 768x1024 | 0 | none | none | none | 143px | PASS |
| 844x390 (landscape) | 0 | none | none | none | 55px | PASS |
| 932x430 (landscape) | 0 | none | none | none | 60px | PASS |
| 1024x768 | 0 | none | none | none | 108px | PASS |
| 1280x800 | 0 | none | none | none | 112px | PASS |
| 1920x1080 | 0 | none | none | none | 151px | PASS |

Horizontal leak is also 0 on `/accessibility`, `/privacy`, `/terms` and a 404 path at all nine
viewports. The hero never exactly fills a short viewport: the smallest continuation cue is 55px at
844x390, so there is always a signal the page continues.

---

## Findings

| id | severity | viewport | what | evidence | fix / status |
|---|---|---|---|---|---|
| QA-01 | High | all, worst at 375 and 1280 | The fixed header logo had no ground of its own. Once scrolled, the yellow wordmark sat directly on yellow display headlines. Same ink on the same ink, so both the logo and the headline became unreadable. | Logo colour `rgb(250,240,12)` over headline colour `rgb(250,240,12)`. Overlap at 375: logo 79x36px and hamburger 44x48px over "Unleash the flavor". At 1280: logo 104x52px. `docs/handoffs/screens/engineering_2026-09-02/desktop-02-about-plate-cascade.png`, `mobile-01.png` | FIXED. The logo now takes the nav pill's own purple ground when `stuck`, transparent over the hero as the blueprint draws it. Padding is cancelled by an equal negative margin so the glyph does not move: 1280 box 32,20 to 152,72 became 20,14 144x64, glyph still at 32,20. Ground `rgba(0,0,0,0)` at top, `rgb(117,16,128)` when stuck. `components/Nav.tsx`. Proof: `fix-header-ground-1280.png`, `fix-header-ground-375.png` |
| QA-02 | High (WCAG 2.4.7) | 320 to 1024 | Location rail cards that start outside the horizontal scroller never intersect the viewport, so their `.reveal` never flipped to `is-visible`. They stayed at `opacity: 0` permanently while their Order and Directions controls remained in the tab order. A keyboard user landed on invisible controls with no focus ring. | Harness `hiddenButFocusable` before: 4 controls at 320/375/430/768, 2 at 844/932/1024, 0 at 1280/1920. Named: "Order", "Directions to Global Fork", "Order", "Directions to Station 8". Ancestor in every case `LI.reveal flex w-[80vw] ...`, reason `ancestor opacity 0`. | FIXED at the cause. The reveal belongs to the rail as a unit, not to cards inside a horizontal scroller, so it moved to the rail wrapper and the per-card `.reveal` and `--i` stagger were removed. After: `hiddenButFocusable` empty at all nine viewports. `components/Locations.tsx` |
| QA-03 | High (WCAG 1.4.10 reflow) | 375 (and any width below ~430) | `/accessibility` scrolled horizontally by 95px. The single 13 character word "Accessibility" in the display face (Archivo at `wdth 125`) cannot wrap, so it simply ran out of its column. `/privacy` and `/terms` hid the bug by having a space to break at. | `htmlScrollWidth 470` vs `clientWidth 375`, leak 95. `h1` rect 335px wide but `scrollWidth 450px` at `text-[12vw]` (45px). No element measured past the right edge, which is why an offender scan came back empty: the overflow was inside the heading's own line box. | FIXED at the cause. `text-[12vw]` became `text-[8.5vw]` plus `break-words` as a guard so no future title can leak either. After: leak 0 on all three legal routes at 320, 375 and 430, and 0 at all nine viewports. Title still sets on one line (heights 25/29/34px). `components/LegalPage.tsx`. Proof: `m-accessibility-fixed.png` |
| QA-04 | Medium (UX rule #1) | all | The Order pill on a location card highlighted the right row in the pop-up but did not scroll to it. A guest tapping Order on the Little Italy card got the pop-up parked at the top showing Carlsbad, with their own hall highlighted below the fold. The feature was half built. | Before, at 375: modal `scrollTop 0`, Global Fork row highlighted `rgb(205,26,224)` but at `top 624, bottom 749` in a 667px viewport, `inView false`. Root cause: `Modal`'s "always open at the top" reset ran on a 20ms timer, after `LocationRow`'s mount time `scrollIntoView`, and silently undid it. | FIXED at the cause, not with a longer delay. The row now declares itself with `data-modal-anchor` and `Modal` performs both the reset and the anchor scroll in one code path, so there is no race left to lose. After: 375 `scrollTop 0 -> 253` and `inView true`; also 320 (411), 844x390 (466), 1280 (94), all `inView true`. Control preserved: a plain ORDER ONLINE still opens at `scrollTop 0` with nothing highlighted. `components/Modal.tsx`, `components/OrderPanel.tsx`. Proof: `m-modal-order-deeplink-littleitaly.png` |
| QA-05 | Low | all | The "Coming Soon" badge, the one piece of copy that stops a guest driving to a hall that has not opened, was set at 10px in `text-purple/70`, in both the location card and the order pop-up. | Harness `typography.under12px` reported `"Coming Soon 10px"` at all nine viewports. | FIXED. 12px, tracking tightened to 0.1em, colour raised to full `text-purple`, border to `purple/30`, in both places. After: `under12px` empty at all nine viewports. `components/Locations.tsx`, `components/OrderPanel.tsx` |
| QA-06 | Low | 1280 and 1920 | Two full bleed photo bands are delivered below the width they are displayed at, so they are upscaled on a large screen. | `band-chicken.webp` natural 1366 wide rendered at 1920 (1.41x). `band-phone.webp` natural 1639 rendered at 1920 (1.17x). | LOGGED, NOT FIXED, outside my edit scope. Root cause found: `scripts/build-assets.sh` line 38 uses `sips -Z 2048`, which constrains the *longest* edge. Both sources are portrait (`cosmos 2-121.jpg` 1690x2533, `cosmos 1-64.jpg` 1510x1887), so constraining height starves the width these full bleed bands actually need. Fix is to constrain width for these two entries. Note the ceiling is the photography itself: native widths are only 1690 and 1510, so 1:1 at 1920 is not reachable. band-chicken can still recover 1366 to 1690, a 24% gain; band-phone is currently upscaled *by the pipeline* from 1510 to 1639, which costs bytes for no detail. Route to Natalia. |
| QA-07 | Low | 1280 and 1920 | The Monkey Fries carousel cutout is rendered slightly larger than its source. | `monkey-fries.png` natural 818 wide, rendered 892. It is the smallest of the five best seller cutouts. | LOGGED, NOT FIXED. Client supplied asset at 1366x768 trimmed to its alpha box. Only a re-shoot or a re-export at higher resolution fixes it. Cosmetic at this scale. |

### Observations, no action taken

- **Advisory tap targets.** 10 to 12 controls sit between 24x24 and 44x44 at every viewport. All
  clear the WCAG 2.5.8 AA floor, so none is a failure. They are the carousel arrows (40x48), the
  five carousel dots (32x44), and the footer's inline text links (around 32px tall), which WCAG
  2.5.8 explicitly exempts as inline. QA-01 incidentally lifted the logo from 83x36 to 107x48,
  clearing 44x44 as a side effect.
- **404 title.** The 404 page reuses the site default `<title>`. Its `h1`, "That one got eaten.",
  is correct and on brand. A 404 specific title would be a small SEO improvement.
- **Menu pop-up rhythm.** Some item cards carry a description and most do not, so the grid rows sit
  at ragged heights. This is content driven, not a layout bug, and resolves when the real menu lands.
- **Nav sheet does not dim the page behind it.** It behaves as a dropdown rather than an overlay.
  It carries the full dialog keyboard contract regardless, so this is a look decision, not a defect.

### Deliberate deviations I did not touch

Per brief, the four decisions in Natalia's fidelity table were left alone and I agree with all four
on the evidence: the `magenta-deep` values band (white body on brand magenta is 4.36:1 and fails
AA), the purple Order pill on cream cards, magenta carousel arrows on cream, and the three plate
mobile cascade. I log no disagreement.

---

## Checks that passed

**Structure and semantics.** Exactly one `h1` on every route. Heading outline runs h1, h2, h3 with
no skipped level. 19 images, zero missing `alt`, zero broken, 9 correctly empty for decorative art.
Skip link is 1x1 until focused then 162x48, and its `#main` target exists.

**Keyboard.** Focus rings are 3px solid and colour aware: magenta on light grounds, white inside the
purple nav pill. Nav sheet opens, traps Tab, closes on Escape, restores `inert` and returns focus to
the toggle with the correct label. Both modals trap focus, close on Escape and on the close button,
carry `aria-modal` and `aria-labelledby`, and open on their own title rather than mid content
(title top 28px at 320x568, 52px at 844x390).

**Modals on short viewports.** No scroll origin trap in either modal at 320x568 or 844x390. The
`min-h-full` wrapper does its job: the panel scrolls (`scrollHeight 979` against `clientHeight 568`
at 320) and every control including the last is reachable.

**Locations rail.** Rests at `scrollLeft 0` with Prev correctly disabled, which is the exact bug
class fitcheck warns about when `snap-start` makes the resting position equal padding-left. Four
Next presses reach `scrollLeft 913 = max` with Next disabled, Prev enabled, and card 4 fully in view
(left 55, right 355 in a 375 viewport).

**Carousel.** Five dots, two arrows, `aria-roledescription="carousel"`, live region present,
inactive slides `inert` and `aria-hidden`. It loops rather than dead ending, so both arrows stay
enabled by design.

**Anchor jumps.** All five nav anchors at both 375 and 1280 land with their heading clear of the
fixed header (`html { scroll-padding-top: 7rem }`). Verified by clicking all ten, not by inference.

**Plate cascade.** Zero overlap between any plate and any About paragraph at 375 or 1280. Natalia's
claim holds.

**Seam tab.** Still reads as a pill at the 320 floor: 263px wide, left 28, right 292, radius 999px,
clear margin both sides.

**Reduced motion.** Emulated with real CDP `Emulation.setEmulatedMedia`, so
`matchMedia('(prefers-reduced-motion: reduce)').matches` genuinely returned `true`. This is the same
signal an OS level setting produces, not an injected stylesheet. Result: zero running animations,
re-checked after 3 seconds to catch the 4s ambient breathe. Hero logo fully visible, `opacity 1`,
`clip-path none`, `transform none`, `animation-name none`, 600x260. All 23 reveals visible and
untransformed. Lenis never starts.

**No JavaScript.** The served `<html>` does not carry the `js` class, so with scripting off the
`.js .reveal` rule never matches and nothing can hide. Verified by stripping the class: 0 of 12
sections invisible, 0 of 23 reveals at `opacity 0`, 4143 characters of body text still present.

**Console and network.** Zero console errors on `/`, `/accessibility`, `/privacy`, `/terms` and a
404 path, at 1280, both before and after Ana's CSP landed. No 404 assets. The only 404 logged is the
intentional test path's own document request.

---

## Two measurements I got wrong first, and how I caught them

Recording these because both are the failure mode Lessons warns about, where a check returns clean
because it never actually ran.

1. **The header overlap sweep returned zero overlaps and it was a false negative.** I swept scroll
   positions in a tight loop calling `window.scrollTo` and reading `getBoundingClientRect` on the
   next line. Lenis virtualizes scrolling, so the scroll had not been applied when I measured, and
   every iteration measured the top of the page. Re-measured with real settle time between the
   scroll and the read, and reproduced James's finding exactly. A scroll that did not happen
   measures as clean, in the same way a dead server does.
2. **I nearly logged a false anchor jump failure.** I read `scroll-margin-top` on the section
   elements, saw `0px`, and inferred that three of five anchors at 375 would drop their heading
   behind the header. Wrong property on the wrong element: the offset is `scroll-padding-top: 7rem`
   on `html`, which belongs to the scroll container. Clicking all ten anchors showed every heading
   clears the header. Discarded before it reached this table.

---

## What I could not test

- **Real hardware.** Chromium at emulated sizes only. No physical iPhone or Android, no real touch
  swipe on the rail or the carousel. I drove the rail with its arrows and with programmatic scroll,
  which exercises the same code path but is not a thumb. Momentum, rubber banding and iOS Safari's
  dynamic toolbar are unproven.
- **Screen readers.** I verified semantics (roles, labels, live region, `inert`, `aria-hidden`,
  heading outline) but ran no VoiceOver or NVDA pass, so how the carousel and the pop-ups actually
  announce is unverified.
- **Other browsers.** Chromium only. No Safari or Firefox. `text-[8.5vw]`, `break-words` and the
  sticky modal header are all well supported, but untested there.
- **Horizon.** Still unlicensed, so everything is set in Archivo. Every display headline width in
  this report, including the QA-03 fix which is sized against the real title strings, will shift the
  day the real face lands. QA-03 is the one to re-measure first.
- **The ordering flow.** Three of five rows have no URL. I confirmed the two wired DoorDash links
  render and point outward, but followed no external destination: not DoorDash, not ezCater, not
  Google Maps, not the three social links.
- **Ana's CSP over real HTTPS.** Verified over `http://localhost`, where `upgrade-insecure-requests`
  and HSTS are inert. Behaviour on the real preview domain is unproven.
- **Performance.** No Lighthouse run, no throttled network, no Core Web Vitals. The upscaled bands
  in QA-06 are a delivery observation, not a measured budget.

---

## Files I changed

- `components/Nav.tsx` (QA-01)
- `components/Locations.tsx` (QA-02, QA-05)
- `components/LegalPage.tsx` (QA-03)
- `components/Modal.tsx` (QA-04)
- `components/OrderPanel.tsx` (QA-04, QA-05)

`npx tsc --noEmit` clean and `npm run build` clean after every change. Nothing committed, no branch
created, no file outside `components/` touched.

## Evidence

38 screenshots in `docs/handoffs/screens/qa_2026-09-02/`: nine bands at 1280 and at 375, spot checks
at 320 and 1920, both modals at both widths, the deep link proof, the nav sheet, the 404, privacy,
the accessibility fix, both header ground before and after captures, and the two reduced motion
proofs.
