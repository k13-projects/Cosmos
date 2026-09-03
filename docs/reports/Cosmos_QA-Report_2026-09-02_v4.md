# Cosmos Burger, QA report, plate wheel gesture matrix

**Date:** 2026-09-02 (v4) - **Author:** Olga (qa-test-engineer) - **Branch:** `cosmos_sep02_v10`
**Build under test:** production (`npm run build && npm run start`), port 9157
**Screens:** `docs/handoffs/screens/qa_2026-09-02_v4/`
**Scope:** the plate wheel Natalia rebuilt in `engineering_2026-09-02_v7.md`, on the full gesture
matrix Kazim asked for, at 1280x900 and 1440x900 for the wheel, 1024x768 touch for the tablet and
375x812 touch for the phone row.

---

## Verdict

**PASS.** Every row of the matrix passes on the build as it now stands.

Three defects were found and fixed at the source during the gate. Two of them stopped the wheel
dead, which is the exact class of bug Kazim reported in the first place, and one put the keyboard
focus ring below the fold. All three are fixed in `components/PlateWheel.tsx` (plus a small new
`lib/scroller.ts`), with before and after numbers below, and every affected row re-run.

Natalia's own work stands up well. The two original bugs are genuinely gone: no native drag event
of any kind fires during a real 300px mouse drag, nothing downloads, and the wheel follows the hand
to within 0.01 degrees.

---

## How this was driven

Natalia flagged that `browse` has no `Input.dispatchMouseEvent` in its CDP allowlist, so her drag
proof was synthetic PointerEvents. It also has no `Emulation.*`. This pass therefore did not use
`browse` at all. It drove a Playwright Chromium (the copy bundled with gstack,
`~/.claude/skills/gstack/node_modules/playwright`) directly from `bun`, which gives:

- `page.mouse.move / down / up / wheel` - real `Input.dispatchMouseEvent`, browser-trusted.
- `page.touchscreen.tap` and raw `Input.dispatchTouchEvent` over a CDPSession - real touch.
- `context({ reducedMotion: "reduce" })` - real `Emulation.setEmulatedMedia`.
- `CDPSession.send("Performance.getMetrics")` - real layout and style-recalc counters.

Playwright's actionability check is the thing that cannot hover a moving element, not the input
layer. Every hover and click here is a raw coordinate `mouse.move` with no actionability wait, so
the wheel was left turning for those assertions rather than frozen first.

Rotation is read as the `--wheel-rot` custom property written on the hub each frame, cross-checked
against the rendered `matrix()` on `getComputedStyle(.wheel-hub).transform` (they agreed exactly:
`37.32 -> 43.84` against `37.32 -> 43.84`). The custom property is used for the numbers because the
matrix only resolves to -180..180 and cannot express a continuous sweep.

**Two things could not be driven with real input, and are reported as weaker proof:**

1. **A real hidden tab.** Playwright pins every page to `visibilityState: "visible"`. Headed mode,
   `ignoreDefaultArgs` for the backgrounding flags, `Page.setWebLifecycleState` and
   `Emulation.setFocusEmulationEnabled` were all tried; the page stays visible. The pause was
   therefore exercised by overriding `Document.prototype.hidden` and dispatching a real
   `visibilitychange`, which runs the component's actual handler and its actual `document.hidden`
   read. What is not proven is the browser's own tab switch.
2. **A real `pointercancel`.** No mouse gesture produces one, and touch is excluded from the drag by
   design. Dispatched as a synthetic `PointerEvent`. The `pointerup`-outside-the-window and
   window-blur paths next to it were both driven with real input.

Two harness traps worth recording, because both first read as product bugs: Lenis owns this page's
scroll and silently ignores `window.scrollTo` (`scrollIntoView` it does follow), and at 375 the
wheel's plates are still in the DOM with zero-size rects, so `document.querySelector(".plate-btn")`
selects a hidden wheel plate rather than a row plate.

---

## The matrix

| # | Row | Method | Verdict |
|---|---|---|---|
| 1 | Ambient on arrival, after idle, tab hidden and back | real page load, real timing; hidden tab semi-synthetic | PASS |
| 2 | Mouse drag 250px both ways, no click/dialog/nav/ghost, momentum then decay | real `Input.dispatchMouseEvent` | PASS (fixed) |
| 3 | Slow press 1.5s, no movement, opens the menu | real mouse | PASS |
| 4 | Drag ending off-element, off-window, pointercancel, blur | real mouse (pointercancel synthetic) | PASS |
| 5 | Hover pause and resume, tooltip, rapid sweep | real mouse, wheel left turning | PASS |
| 6 | Tab reaches each plate, tooltip, Enter, Escape, Tab away | real `keyboard.press` | PASS (fixed) |
| 7 | Trackpad scroll adds velocity and decays, long flick does not run away | real `mouse.wheel` | PASS |
| 8 | Touch: swipe scrolls at 1024, tap opens; phone row at 375 | real `Input.dispatchTouchEvent` | PASS |
| 9 | Reduced motion: static, tooltips, drag without momentum, click | real `Emulation.setEmulatedMedia` | PASS |
| 10 | No leak at 375/768/1280/1920, no console errors, no copy collision over a revolution | real measurement, real drags | PASS |
| 11 | Frame time under 16.7ms during a drag and a throw, no layout thrash | real `Performance.getMetrics` + rAF | PASS |

---

## Row by row

### 1. Ambient

Target is 15/7 = 2.143 deg/s.

| moment | 1280x900 | 1440x900 |
|---|---|---|
| on arrival, before any scroll | 2.16 deg/s | 2.15 deg/s |
| after scrolling the band into view | 2.16 | 2.17 |
| after 10s idle | 2.14 | 2.14 |
| tab hidden, 2.5s | drift **0.00 deg** | not re-run, same code path |
| back from hidden | 2.14 | 2.14 |

Hidden mid-drag then back and released: 2.15 deg/s, `wheel-grabbing` off, `data-drag` off.

### 2. Mouse drag and throw

**Following is 1:1 on the angle, not approximately.** Grab at (1167.67, 486.69), hub measured at
(1587.17, 661.31), drag 250px straight up:

```
rotation followed        22.74 deg
pointer's angle sweep    22.75 deg      error -0.01 deg
grabbed plate's ray from the hub  -134.64 deg
pointer's ray from the hub        -134.65 deg
```

Mid-drag state, screenshotted (`mid-drag-1280.png`): `data-drag` set, `wheel-grabbing` set, cursor
`grabbing`, **0 tooltips visible**, plates upright.

Across all four throws (up and down, 1280 and 1440): `clicks seen: 0`, no dialog, URL unchanged, no
download, `jump on release 0.00 deg`.

Native drag is dead. Listening for `dragstart`, `drag`, `dragend`, `drop` and `selectstart` in the
capture phase across a real 300px mouse drag with 60 moves: **`[]`, nothing fired at all.** All 24
images `draggable === false` and `getAttribute("draggable") === "false"`; a dispatched `dragstart`
returns `defaultPrevented: true`; `user-select: none`, `-webkit-user-drag: none`,
`touch-action: pan-y`; text selection after the drag is empty.

Momentum, sampled every frame:

| case | +0.3s | +1s | +3s | frames under 0.25 deg/s |
|---|---|---|---|---|
| forward throw, 1280 | 106.07 deg/s | 39.09 | 5.56 | **0** |
| forward throw, 1440 | 90.57 | 33.84 | 5.01 | **0** |
| reverse throw, 1280 | -82.13 | -26.89 | -0.54 | 5 (41ms) |
| reverse throw, 1440 | -75.30 | -24.57 | -0.33 | 6 (50ms) |
| hand parked before release, 1280 | 2.20 | 2.14 | 2.15 | **0** |
| hand parked before release, 1440 | 2.20 | 2.14 | 2.14 | **0** |

Two defects were found here and fixed. See **Defects** below. The reverse-throw figure is the wheel
changing direction, and is discussed there too.

### 3. Slow deliberate press

James's distance-only click rule behaves exactly as intended.

| gesture | result |
|---|---|
| press, 0px, hold 1515ms, release | menu opens ("Our Menu", opacity 1) |
| press, 2px wobble, hold 1400ms, release | menu opens |
| press, 9px of travel, release | **menu does not open** |

No download, no native dialog.

### 4. Drags that end somewhere else

Every case measured after moving the hand away from the wheel and letting any boost decay for 4s.

| case | wheel after | stuck cursor | stuck pause | orphan tooltip |
|---|---|---|---|---|
| release over the About copy at x=200 | 2.15 deg/s | no | no | no |
| `pointerup` at (-200, -300), outside the window | 2.15 | no | no | no |
| window blur mid-drag, no `pointerup` at all | 2.14 | no | no | no |
| `pointercancel` mid-drag (synthetic) | 2.15 | no | no | no |
| native `dragstart` mid-press | 2.12 | no | no | no |

`html.wheel-grabbing` removed in every case, `document.body` cursor back to `auto`, `data-drag`
cleared once the hand moved.

### 5. Hover

Wheel left turning; pointer placed by raw coordinates.

| check | 1280 | 1440 |
|---|---|---|
| tooltip 120ms after the pointer lands | up, opacity 1, "Blue cheese" | up, opacity 1, "Blue cheese" |
| `text-transform` on the pill | `uppercase` | `uppercase` |
| wheel drift while hovered, 2.5s | **0.00 deg** | **0.00 deg** |
| speed 34ms (two frames) after moving off | 2.25 deg/s | 2.08 deg/s |
| sustained after resume | 2.14 | 2.15 |

Rapid sweep, 6 plates x 4 passes, sampling every frame in-page: 286 frames, peak opacity 1, **0
orphan tooltips** after moving off, wheel back at 2.14 deg/s. 184 of those frames had two pills
above zero opacity at once, which is the 80ms cross-fade from one plate to the next; at 40ms into a
transition only one pill is at full opacity and the other has already dropped out. That reads as a
cross-fade, not a flicker.

### 6. Keyboard

Real `Tab` presses walking in from the top of the document, all six plates:

| plate | dish | box top | box bottom | fully on screen | tooltip |
|---|---|---|---|---|---|
| spoke 0 | Blue cheese | 399 | 502 | yes | opacity 1 |
| spoke 1 | BBQ chicken sandwich | 390 | 511 | yes | opacity 1 |
| spoke 2 | Better Mac burger | 400 | 501 | yes | opacity 1 |
| spoke 3 | Cosmos burger | 400 | 500 | yes | opacity 1 |
| spoke 4 | Spicy jam | 403 | 498 | yes | opacity 1 |
| spoke 5 | Hot Chicks sandwich | 396 | 505 | yes | opacity 1 |

Same at 1440 (tops 609 to 623, all fully on screen). The wheel aims perfectly in every case: the
settled rotation matched the wanted rotation to **0.00 degrees** at all six stops.

`Enter` opens the menu. `Escape` closes it and returns focus to the same plate (spoke 5 to spoke 5).
Wheel drift while a plate holds focus: **0.00 deg over 1.5s**. After focus leaves the wheel:
2.19 deg/s. 6 tab stops out of 24 plates, the other 18 being repeats.

A defect was found here and fixed. See **Defects**.

### 7. Trackpad

| gesture | page | wheel |
|---|---|---|
| 40 wheel events of 6px | scrollY 835 to 1054 (219px) | +11.65 deg, peak **9.6 deg/s** (ambient is 2.14) |
| then left alone | | decayed back to **2.15 deg/s** |
| 15 wheel events of 400px | scrollY 1075 to 7002 (**5927px**) | +3.11 deg, peak **56.5 deg/s** |
| scrolled back to the band | | **2.14 deg/s** |

No runaway. A 5927px flick turns the wheel about 3 degrees, because the band leaves the viewport and
the IntersectionObserver stops the loop. The 150 deg/s cap was never approached, so no change was
needed.

### 8. Touch

**Tablet, 1024x768, real `Input.dispatchTouchEvent`.** Wheel is `display: block` here.
`touch-action: pan-y` on the plates.

- Vertical swipe of 240px starting on a plate: **page scrolled 316px**, by design. The wheel turned
  17.00 deg, which is the scroll boost, not a grab: `wheel-grabbing` false, `data-drag` false.
- Tap on a plate: **menu opens.**
- Long press of 1400ms: no download, no native dialog, no ghost. Opens the menu, consistent with the
  distance-only click rule.
- Menu closed by tapping its close control, then a neutral tap: wheel back at **2.14 deg/s**, no
  stale hover, no focus left in the hub.
- `scrollWidth 1024 === innerWidth 1024`.

One thing to know rather than a defect: closing the menu with the **Escape key** on a touch device
returns focus to the plate with `:focus-visible`, and the wheel then holds still, correctly, until
focus moves. That is the designed focus pause, not a stuck wheel. It cost a cycle to establish.

**Phone, 375x812, real touch.** Wheel `display: none`, three row plates:

| plate | label | opacity | caps | tap target | draggable | touch-action |
|---|---|---|---|---|---|---|
| 1 | Blue cheese | 1 | uppercase | 112x67 | false | manipulation |
| 2 | BBQ chicken sandwich | 1 | uppercase | 112x78 | false | manipulation |
| 3 | Better Mac burger | 1 | uppercase | 112x65 | false | manipulation |

Real tap on the middle plate opens the menu. `scrollWidth 375 === innerWidth 375`, with the menu
open too.

### 9. Reduced motion

Real `Emulation.setEmulatedMedia` through Playwright's `reducedMotion: "reduce"`.

```
media query matches       true
rotation drift over 3s    0.00 deg
hub transform             matrix(1, 0, 0, 1, 0, 0)     (live rotate(), not forced to none)
plate float animation     animation-name: none
hover tooltip             "BBQ chicken sandwich", opacity 1
focus tooltip             "Better Mac burger", opacity 1, :focus-visible true
drag                      0.00 -> 24.61 deg, the wheel follows the hand
momentum 1.5s later       0.00 deg
slow click                menu opens
```

### 10. Regression

| width | scrollWidth vs innerWidth, on load | after scrolling the whole page | leak | console |
|---|---|---|---|---|
| 375x812 | 375 vs 375 | 375 vs 375 | no | clean |
| 768x1024 | 768 vs 768 | 768 vs 768 | no | clean |
| 1280x900 | 1280 vs 1280 | 1280 vs 1280 | no | clean |
| 1920x1080 | 1920 vs 1920 | 1920 vs 1920 | no | clean |

**Collision over a full revolution.** Driven by real mouse drags in strokes, sampling the rectangle
of every on-screen plate image against the "Unleash the flavor" heading, all three About paragraphs
and the "Fresh always" column, as a 2D rectangle intersection.

| width | swept | samples | largest step | 5-degree buckets covered | overlaps | closest approach |
|---|---|---|---|---|---|---|
| 1280x900 | 363.06 deg | 433 | 1.27 deg | **72 / 72** | **NONE** | 58.00 px |
| 1440x900 | 358.27 deg | 433 | 1.15 deg | **72 / 72** | **NONE** | 80.00 px |

### 11. Performance

Frame time from `requestAnimationFrame` deltas in-page, counters from CDP `Performance.getMetrics`.
Headless Chromium runs at 120Hz here, so the frames come in at about 8.3ms; the 16.7ms budget is the
bar being checked.

| window | frames | avg | p50 | p95 | max | over 16.7ms | layouts | style recalcs |
|---|---|---|---|---|---|---|---|---|
| ambient, 2s | 238 | 8.40 ms | 8.30 | 9.20 | 24.30 | 1 (0.42%) | 39 (2.02 ms) | 239 (177.91 ms) |
| 2s continuous drag, 240 real mouse moves | 241 | **8.33 ms** | 8.30 | 9.00 | 9.40 | **0** | **0** | 246 (179.16 ms) |
| 2s of throw and decay | 240 | **8.33 ms** | 8.30 | 9.10 | 9.20 | **0** | **0** | 241 (163.21 ms) |

**Zero layouts during a drag and during a throw**, so no forced reflow and no thrash. Long tasks
over the whole run: **0**. The single 24.3ms frame in the ambient window is during page settle, not
during a gesture. Style recalc runs once per frame at about 0.75ms, which is the `--wheel-rot`
change cascading to 24 plates and their pills; it is a tenth of the 8.3ms frame and a twentieth of
the 16.7ms budget.

---

## Defects found and fixed

### D1. The wheel stopped dead mid-throw and stayed stopped

**Severity: high.** Same class as the bug Kazim reported.

Throw the wheel and let go without moving your hand. The plates slide out from under the motionless
pointer, which fires `pointerleave` on the hub even though the hand never moved. `onPointerLeave`
lifted the hover suspension; the next plate then arrived under that same still pointer, `:hover`
matched, and the hover pause swallowed the throw. The wheel stopped and stayed stopped until the
hand moved.

Reproduced deterministically at 1440x900, 4 runs with the hand held still after release:

| | before | after |
|---|---|---|
| run 1 | 0 flat frames | 0 flat frames |
| run 2 | 0 flat frames | 0 flat frames |
| run 3 | **319 flat frames, 2657 ms standstill**, final speed 0.00 deg/s | 0 flat frames, 2.41 deg/s |
| run 4 | **315 flat frames, 2624 ms standstill**, final speed 0.00 deg/s | 0 flat frames, 2.38 deg/s |

At the moment of the stall: `hover = 1`, `data-drag = 0`. It never showed at 1280, which is why it
survived Natalia's pass: it needs a plate to leave the pointer before the next one arrives, and that
is a matter of geometry and phase.

**Fix.** `onIdleMove` (a window `pointermove`) is now the only thing that lifts the hover
suspension, because a real pointer move is the only proof the hand moved. The `pointerleave`
listener on the hub is gone. This cannot strand the wheel in the Lessons 25 sense: a stuck
suspension only ever *suppresses* the pause, so the hazard runs one way and the fix removes it.

After the fix, 8 runs out of 8 across both widths: 0 flat frames, back at ambient.

### D2. A slow drag ended in a dead beat

**Severity: medium.**

Release a drag with the hand already at rest and `endDrag` treated the throw as a released speed of
zero, subtracted ambient from it, and so set the wheel's speed to exactly nothing at the moment of
release before creeping back up over about a second and a half.

| | before | after |
|---|---|---|
| longest run of flat frames | **5 frames, 42.5 ms** | **0 frames, 0 ms** |
| instantaneous speed at +50ms | **0.00 deg/s** | 1.30 to 2.35 deg/s |
| average over +0 to +0.3s | 0.57 deg/s | **2.20 deg/s** |
| average over +0.3 to +1s | 1.60 | 2.14 |
| average over +1 to +3s | 2.09 | 2.15 |

**Fix.** A throwless release (hand stale, no velocity sample, or reduced motion) now hands the wheel
straight back to the ambient turn rather than decelerating it to a standstill first. Natalia's
intent was that a parked hand must not fling the wheel, and it still cannot; it just no longer stops
it either.

### D3. The keyboard focus ring landed below the fold

**Severity: high (accessibility).**

A visitor already looking at the About band who tabs forward through the nav and into the wheel
landed on the first plate with its focus ring **at top 916 in a 900px viewport**, three runs out of
three at human tab speed, and the page never recovered. The component's own docstring calls an
off-screen focus ring "a keyboard trap in everything but name", and this was one.

Two causes, both needed fixing:

1. **Chrome scrolls a newly focused element into view by the smallest amount that reveals it where
   it is, and it does so after `focusin`.** The wheel then eases that plate round to the hub's own
   level, up to a full diameter away. Measured: hub at 403 when `focusin` fires, at 967 half a
   second later. A correction computed inside `focusin` reads a page that is about to move and
   correctly decides to do nothing.
2. **Lenis owns this page's scroll.** A native `scrollIntoView` issued while Lenis has an animation
   in flight (a nav link's own focus scroll) does not win and does not lose: it settled at
   scrollY 268 instead of 574, three runs out of three.

**Fix.** A new `lib/scroller.ts` publishes the Lenis instance from `SmoothScroll`, so anything that
needs to move the page asks the owner of the scroll instead of racing it (and falls back to the
native call under reduced motion, where Lenis never starts). The wheel centres the hub through it,
on a 500ms timer armed by a keyboard focus, which is after the browser's own scroll has landed.

| entry path, 1280x900 | before | after |
|---|---|---|
| tab in from the page top | top 1089, scrollY 95, off screen | top 399, on screen |
| band already in view, nav tabbed every 60ms | 2 of 3 off screen | **3 of 3 on screen** |
| band already in view, nav tabbed every 250ms | 2 of 3 off screen | **3 of 3 on screen** |
| band already in view, nav tabbed every 600ms | **3 of 3 off screen** | **3 of 3 on screen** |

The correction is gated on `:focus-visible` and bails while a pointer is down, so a mouse click and
a mouse drag move the page by **0px**, verified.

Dead state removed while in there: `dragStartMs`, unread since James dropped the 300ms half of the
click rule.

---

## Recorded, not fixed

**A reverse throw passes through zero for 40 to 110 ms.** Throw the wheel backwards, against its
ambient direction, and it must decelerate through a standstill before it can resume turning
forwards. Measured over six runs: 41 to 109 ms under 0.25 deg/s at the crossing, with the wheel at
-82 deg/s at +0.3s and back at +2.4 deg/s by +3s.

This is not a stall, it is a direction change, and it is inherent to having a directional ambient.
The dwell length is set by the acceleration at the crossing, which is `AMBIENT / BOOST_DECAY_S` =
2.143 / 0.45 = 4.76 deg/s squared. Shortening it means shortening `BOOST_DECAY_S`, which would cut
every forward throw short as well. A forward throw and a parked release both show **zero** flat
frames, so the wheel is never left stopped. Flagged for Kazim rather than changed.

**Out of matrix, seen in an artifact:** at 375, mid-scroll, the fixed Cosmos wordmark sits directly
over the About paragraph text (`mobile-row-375.png`). Lesson 17 covers this with the drop shadow and
it is doing some work, but the overlap is legible-ish rather than clean. Not part of this gate and
not touched. Worth a look on the next design pass.

---

## Files changed

```
components/PlateWheel.tsx      D1 hover suspension lifted only by a real pointer move
                               D2 a throwless release returns to ambient, not to a standstill
                               D3 hub centred through the page's scroll owner, on a timer armed
                                  after the browser's own focus scroll has landed
                               dead dragStartMs removed
components/SmoothScroll.tsx    publishes and clears the Lenis instance
lib/scroller.ts                new: the page's scroll owner, and why anything else must go
                               through it
```

`tsc --noEmit` clean, `next build` clean, no console output at any width tested.
Nothing committed. James commits.
