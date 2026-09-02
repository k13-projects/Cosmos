# Cosmos Burger QA Report v3

**Date:** 2026-09-02
**Tester:** Olga (qa-test-engineer), two-agent Chrome gate
**Branch:** `cosmos_sep02_v4` (nothing committed by me, nothing edited by me)
**Build under test:** production server already running on `http://localhost:9157`, not
touched, not restarted
**Browser:** gstack Chromium, berth `cosmos`, `BROWSE_PORT=39157`
**Scope:** the fidelity gate on Natalia's engineering pass (`engineering_2026-09-02_v3.md`):
band crops, Locations rail density, and the endless plate wheel. **Report-only** - findings
are listed for James to apply, nothing here was fixed at the source.

## Verdict: PASS

Thirteen bands, both widths, 26 side-by-sides, all read by eye. No MISS. Two MINOR verdicts,
both already known and already flagged to Kazim/the client in Natalia's handoff, not new
findings. Regression sweep across 11 viewports: zero horizontal leaks, zero AA tap-target
failures, zero hidden-but-focusable controls, zero scroll traps, header clearance positive
after every anchor jump at both 1280 and 375. Wheel: running on arrival, scroll adds and decays
velocity correctly, focus/hover pause and resume correctly, zero collisions across a full
revolution at all six required widths, reduced motion holds it static with tooltips still
working. Locations rail: correct density, keyboard-reachable arrows that disable at their
edges, Order pill opens the pop-up pre-highlighted on the right hall, Coming Soon on Station 8,
swipe/scroll works at 375. Console clean.

---

## 1. Fidelity - 13 bands, PDF vs build

Each row: side-by-side opened and read, not just measured. Filenames are in
`docs/handoffs/screens/qa_2026-09-02_v3/`.

| # | Band | 1280 verdict | 375 verdict | Side-by-sides | Note |
|---|---|---|---|---|---|
| 1 | Hero (nav) | MINOR | MATCH | `sbs-1280-01`, `sbs-375-01` | Crop is the blueprint's, horizontally exact. Height is capped at 86vh (774px built vs 1009px blueprint at 1280) so the About band peeks under the fold; already in Natalia's Human Gate #1, Kazim's call. No wordmark in hero, by Kazim's decision - correct, not a defect. |
| 2 | About (wheel intro) | MATCH | MATCH | `sbs-1280-02`, `sbs-375-02` | Headline, copy, plate arc position all match. Mobile shows a stacked layout with visible dish labels under the plates - a sensible mobile adaptation of the desktop hover tooltip, not a mismatch (PDF has no mobile mock to compare against). |
| 3 | Values (icon row) | MATCH | MATCH | `sbs-1280-03`, `sbs-375-03` | Icons, headlines, copy, layout all match at both widths. |
| 4 | Best sellers (carousel) | MATCH | MATCH | `sbs-1280-04`, `sbs-375-04` | Carousel is mid-cycle in both captures (different dish showing on each side), which is expected for a rotating carousel - structure, type, arrows and dots all match. |
| 5 | Fries | MATCH | MATCH | `sbs-1280-05`, `sbs-375-05` | Near pixel-identical at 1280; all four bowls, same board, same crop at 375. |
| 6 | Menu (CTA band) | MATCH | MATCH | `sbs-1280-06`, `sbs-375-06` | Headline, copy, both buttons match at both widths. |
| 7 | Spread | MATCH | MATCH | `sbs-1280-07`, `sbs-375-07` | Full table spread, same plates, same arrangement, same crop at both widths. |
| 8 | Catering | MATCH | MATCH | `sbs-1280-08`, `sbs-375-08` | Headline, sub-line, copy, CTA all match. |
| 9 | Locations | MATCH | MATCH | `sbs-1280-09`, `sbs-375-09` | Two full cards + third cut at 1280 (matches blueprint density exactly), one card + peek at 375. See §4 for interaction checks. |
| 10 | Chicken sandwich | MINOR (known) | MINOR (known) | `sbs-1280-10`, `sbs-375-10` | Framing matches the blueprint's exact aspect (whole sandwich centred, bowls at each edge). Scale is ~1.45x tighter than the blueprint because our source photo is narrower than Lorena's original - already flagged to the client, Natalia's Risk #2. Not a build defect. |
| 11 | Reviews | MINOR (known) | MATCH | `sbs-1280-11`, `sbs-375-11` | Card position, size, heading and copy match. Heading block sits at 3.8% from the left vs the blueprint's 9.9% - this is the site-wide 48px page gutter vs the blueprint's ~10% margin, already flagged as Natalia's Risk #3 (a separate pass, moves every section). Not new, not a Reviews-specific bug. |
| 12 | Phone (UGC) | MATCH | MATCH | `sbs-1280-12`, `sbs-375-12` | Near pixel-identical at both widths. |
| 13 | Footer | MATCH | MATCH | `sbs-1280-13`, `sbs-375-13` | Wordmark placement and purple pattern ground match the visible portion of the blueprint crop. Built footer carries the full CONTACT INFO / FOLLOW US symmetric columns per Lesson 18; the blueprint's crop for this band only captured the wordmark, so there is nothing to contradict. |

**No MISS.** Both MINOR rows are pre-existing, already-surfaced items from Natalia's own
handoff (source photo scale, page margins) - carried here for completeness, not raised as new.

---

## 2. Regression fitcheck, 11 viewports

`window.innerWidth` asserted in-band on every run; page walked to the foot and back before
measuring so scroll-reveal content isn't misread as hidden.

| Viewport | h-leak | tap AA fail | hidden-focusable | scroll traps | 1st fold visible px | notes |
|---|---|---|---|---|---|---|
| 320x568 | 0 | 0 | 0 | 0 | 125 | |
| 375x667 | 0 | 0 | 0 | 0 | 207 | |
| 430x932 | 0 | 0 | 0 | 0 | 472 | |
| 768x1024 | 0 | 0 | 0 | 0 | 418 | |
| 844x390 (landscape) | 0 | 0 | 0 | 0 | 55 | short but never zero |
| 932x430 (landscape) | 0 | 0 | 0 | 0 | 60 | short but never zero |
| 1024x768 | 0 | 0 | 0 | 0 | 108 | |
| 1280x900 | 0 | 0 | 0 | 0 | 126 | |
| 1366x900 | 0 | 0 | 0 | 0 | 126 | |
| 1536x900 | 0 | 0 | 0 | 0 | 126 | |
| 1920x1080 | 0 | 0 | 0 | 0 | 151 | |

Tap targets under the 44px touch guideline (advisory, not AA): 12 at phone widths, 10 at
tablet/desktop - same generic secondary links every pass, none under the 24px AA floor, not
part of the pass bar.

**Image-serving false positive, investigated and closed.** The harness flagged `hero.webp`,
`band-phone.webp` and `monkey-fries.png` as "upscaled" at desktop widths (e.g. natural width
1016 vs a 1280 CSS box). Verified directly: `curl` of the exact served URL and an in-page
`fetch()` + `createImageBitmap()` of the same `currentSrc` both decode to the true source size
(hero 1525x1203, monkey-fries 818x651) - no upscale, bytes are correct. The `img.naturalWidth`
DOM property under-reports by a fixed ratio tied to this test harness's CDP viewport override,
not to the live image pipeline. Confirmed a harness artifact, not a site defect; noted so a
future sweep doesn't re-chase it.

### Header clearance after anchor jump (5 anchors x 2 widths)

| Anchor | 1280 clearance | 375 clearance |
|---|---|---|
| #about | 152px | 158px |
| #menu | 168px | 158px |
| #locations | 348px | 216px |
| #catering | 273px | 185px |
| #contact | 862px | 455px |

Positive at every anchor, both widths. No ink on ink after any jump.

---

## 3. The plate wheel

**Running on arrival.** `--wheel-rot` reads 18.68deg at t=0 after landing on `#about` and
36.07deg at t=3s - never frozen, confirmed again at t=6s (42.64deg). A fresh page load lands on
a non-zero, moving value.

**Scroll adds velocity, decays.** Baseline ambient rate ~2.3deg/s (matches the 2.143deg/s
target from a 7s/plate-step cadence). A single `scrollBy(0,600)` pushed rotation from 50.75deg
to 67.17deg near-instantly and continued climbing to 75.83deg over the next 0.3s before
settling back to the ambient rate - a real velocity injection that decays, not a step change.

**Focus pauses, pulls into view, resumes.** Plate 0 sits off-screen right (x=1585 at 1280,
viewport width 1280) until focused; on `.focus()` it eases to x=1049 (on-screen, matches
Natalia's own 1877->1046 figure) and the tooltip opacity goes to 1. Rotation holds dead still
at -31.20deg for 4+ seconds while focused (confirmed identical across 5 samples), then resumes
moving within 1.5s of blur (-30.68 -> -27.07 -> -23.75deg, ambient rate).

**Hover pause: confirmed via the shared code path, not a clean end-to-end capture.** The
tooltip and pause logic share the same condition class list
(`group-hover:opacity-100` / `group-focus-visible:opacity-100`) that focus already proved
works. A direct hover attempt did freeze rotation exactly (122.23deg held across two checks),
but this harness's `hover` command times out waiting for the target to stabilize - because the
target is, correctly, always moving - so a full hover-then-unhover-then-resume cycle wasn't
captured cleanly with a passing command. Not reported as a defect; reported as untested by this
method. Focus is the reliable proxy and it passed clean.

**Reduced motion (`Emulation.setEmulatedMedia`, real CDP media override).** `--wheel-rot`
pinned at 0deg, held identical across 2s, computed `transform: none` on `.wheel-hub`. Tooltip
on focus still shows (opacity 1, "Blue cheese") under the override. Override cleared after.

**Full-revolution clearance, 5-degree steps, all 24 plates (not just the 6 named ones).**
Verified the sweep isn't stalled first: a single plate's position was read at 8 points around
the circle and produced 8 clearly distinct (x,y) pairs, confirming the CSS var mutation drives
real geometry change, not a frozen loop.

| Viewport | Min gap, plate to About copy | Vertical overlap with "Fresh always" ever occurs | Min gap, plate to "Fresh always" |
|---|---|---|---|
| 1024 | 135px | no | n/a - never in the same row |
| 1280 | 358px | no | n/a - never in the same row |
| 1366 | 429px | no | n/a - never in the same row |
| 1440 | 473px | yes | 418px |
| 1536 | 521px | yes | 466px |
| 1920 | 713px | yes | 658px |

The About-copy clearances reproduce Natalia's own figures exactly (135/358/473/713), confirming
her measurement method. Her "Fresh always" figures (84/100/165, tightening as width grows) used
a horizontal-only comparison against an element that, at 1024-1366, never shares a screen row
with the wheel at all - a straight left-edge subtraction between two elements 700px+ apart
vertically reads as a false near-miss. Re-measured with true 2D rectangle overlap (only
comparing plate and text when their vertical ranges actually intersect): **zero collisions at
all six required widths**, and the real clearances where rows do overlap (1440+) are far wider
than her figures suggested (418-658px, not 15-165px). This is a correction to the number, not a
new defect - the wheel was never in danger of the collision her table implied.

---

## 4. Locations rail

- **Density at 1280:** two full cards + third cut, confirmed in the fidelity side-by-side and
  independently in the live DOM (4 cards total, rail `scrollWidth` 1997 vs `clientWidth` 1280).
- **Keyboard:** "Previous locations" / "Next locations" both `tabIndex 0`. Previous starts
  correctly `disabled` at rest; clicking Next moves `scrollLeft` 0 -> 467 -> 717 and Next
  correctly self-disables once the rail hits its scroll end (`scrollLeft + clientWidth >=
  scrollWidth`). Edge-disable confirmed both directions.
- **Order pill -> pop-up:** clicking Order on the Miramar/San Clemente card opens
  `role="dialog"` "Order Online" with that exact row outlined/highlighted in the list,
  confirmed visually via screenshot, not just by DOM text. Escape closes it cleanly (0 dialogs
  after).
- **Coming Soon:** present on "Station 8 Public Market (Coming Soon)", both in the rail card
  and in the Order pop-up's listing.
- **Swipe/scroll at 375:** rail `scrollWidth` 1258 vs `clientWidth` 375 (overflow present, one
  card + peek, matches the side-by-side). `scrollTo({left:300, behavior:'smooth'})` snaps to
  309px (the card's own snap point) - confirmed working, snap-mandatory intact. Arrow hit boxes
  measure 48x48 at this width, clear of the 44px guideline, and sit outside any card's tappable
  area.

---

## 5. Console

Cleared and re-checked fresh at 375, 1280 and 1920 after a full scroll-to-foot-and-back: **zero
JavaScript errors** at any of the three. Two `link preload` advisory warnings only (hero and
spicy-jam images preloaded but not consumed within a few seconds of load) - a performance
advisory, not an error, not new to this pass.

---

## Not tested

- Real hardware / a finger on real glass. Touch was exercised via `scrollTo`/`scrollBy`, not a
  real touch gesture - `Input.dispatchTouchEvent` is not on this harness's CDP allowlist.
- A clean, uninterrupted hover-then-unhover cycle on the plate wheel (see §3) - focus was used
  as the reliable proxy for the shared pause/tooltip code path.
- Screen readers, Safari, Firefox, the live preview domain, performance/Core Web Vitals.

## Risks carried forward (not new, not mine to resolve)

Three items from Natalia's own Human Gate remain open and unaffected by this pass: the hero's
86vh cap, the chicken band's tighter-than-blueprint scale (needs Lorena's wider original), and
the site-wide page-gutter vs the blueprint's ~10% margin. None of the three block this QA gate;
all three are Kazim's call, already surfaced once and not re-raised here as new findings.

## Findings for James

None requiring a source change. The two MINOR fidelity rows and the corrected wheel-clearance
figures above are informational, not action items - nothing here should block Natalia's content
work or a merge.

---

**Screenshots:** `docs/handoffs/screens/qa_2026-09-02_v3/` (26 side-by-sides, pre-existing from
the prior run, all read in full for this report)
**Sidecar:** `docs/reports/Cosmos_QA-Report_2026-09-02_v3.qa.json`
**Next:** security-auditor
