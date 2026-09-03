# Engineering handoff, Cosmos Burger, 2026-09-02 (v7)

**Author:** Natalia (frontend-engineer) - **Branch:** `cosmos_sep02_v10` - **Not committed**
**Screens:** `docs/handoffs/screens/engineering_2026-09-02_v7/`
**Fixes:** Kazim's two plate wheel bugs (Lessons 24, 25, 26)

---

## Status

**PASS.** Both bugs are gone and the gesture Kazim liked is now a real, designed one.
`tsc --noEmit` clean, `next build` clean, no `any`, no `console.log`, console clean at 1280
and 375, no horizontal leak at 375. Production build is serving on port 9157 and left
running.

---

## Summary

### What was actually wrong

The diagnosis in the brief is confirmed on both counts. **There was no drag implementation
at all.** What Kazim grabbed was the browser's own image drag on the plate `<img>`: it makes
a ghost image that follows the pointer, offers the file on drop (the download he saw), and
it swallows `pointerout`. The wheel's hover pause was driven by a `pointerover` /
`pointerout` pair, so the `pointerout` that would have un-paused it never arrived and the
wheel stayed frozen for the rest of the session. Two bugs, one cause.

### 1. Native image drag is dead

`draggable={false}` on every plate image, wheel and mobile row (they are the same `Plate`
component, so one prop covers both). `-webkit-user-drag: none`, `-webkit-user-select: none`
and `user-select: none` on the plate buttons and the images. `pointer-events: none` on the
images, so every pointer event lands on the button, which is the element the wheel listens
to and hit-tests `:hover` on (verified: `elementFromPoint` on a plate centre returns the
BUTTON). An `onDragStart` that calls `preventDefault()` on the button, and a native
`dragstart` listener on the hub that does the same and clears the pause state.
`touch-action: pan-y` on the wheel plates and `touch-manipulation` on the row plates, so
vertical page scroll on a touchscreen is untouched.

### 2. Drag to spin is a real gesture

**The mapping is angular, not a scaled vertical delta.** The hub is a real point on the page
(0x0 anchor, about 307px past the right edge at 1280), so the pointer's angle round it can
be measured directly, and the grabbed plate then rides the ray from the hub to the hand for
the whole gesture. A scaled vertical delta cannot promise that: it needs a fudge factor that
is right at one radius and wrong everywhere else. Angles also make the wheel behave the same
whether the plate grabbed is at the top of the visible arc or the bottom.

The seam matters and is handled: the visible plates sit at roughly 180 degrees, which is
exactly where `atan2` wraps from +180 to -180, so every frame's delta is normalised to the
short way round before it is applied. Without that the wheel would jump 360 degrees every
time the hand crossed the horizontal.

- `pointerdown` on a plate captures the pointer **on the plate, not on the hub**, so the
  click that follows a plain press still targets the button and still opens the menu.
  Window-level `pointermove` / `pointerup` / `pointercancel` are added for the length of the
  gesture as well, so a failed or lost capture cannot orphan the drag.
- Release hands the measured angular velocity (an exponential moving average, newest sample
  weighted 0.3) to the same `boost` the scroll throw uses, as the amount **above** ambient.
  It decays with the same 0.45s e-fold, so the throw eases back into the ambient turn and
  the wheel never stops. A hand that had already been still for more than 80ms throws
  nothing, which is what stops a paused hand from flinging the wheel on release.
- Click versus drag, exactly as specified: under 6px of travel **and** released inside 300ms
  is a click. Anything else is a drag, and the click it produces is swallowed by a
  capture-phase `click` listener on the hub before React's own handler at the root sees it.
- Cursor `grab` on the plates, `grabbing` on the whole document for the length of the drag
  (the pointer is captured, so it spends most of a drag off the plate and off the wheel).
- Plates stay upright: they already counter-rotate by `--wheel-rot`, and the drag writes the
  same variable, so nothing changed there.

**Touch is deliberately excluded.** On the visible arc the drag is a vertical gesture, which
is also the page scroll, and a wheel that eats the scroll on a touchscreen is a trap.
`pointerdown` ignores `pointerType === "touch"` and `touch-action: pan-y` gives that gesture
to the browser. A tap still opens the pop-up. Flagged in Risks as a decision, not an
oversight.

### 3. A pause that cannot strand (Lessons 25)

The event-driven `hovered` and `focused` flags are gone. The rAF loop now **reads the pause
back out of the DOM on every frame**: `hub.querySelector("[data-spoke]:hover")` and
`document.activeElement` inside the hub matching `:focus-visible`. An event that never
arrives can no longer freeze the wheel, because nothing is remembered between frames. It
also makes the pause and the tooltip share one source of truth: the tooltip is CSS
`group-hover` / `group-focus-visible`, so the wheel is still exactly when the pill is up.

On top of that, the explicit exits the brief asked for are all wired: `pointerleave` on the
hub, `pointerup`, `pointercancel`, `dragstart`, window `blur` and `visibilitychange`. Blur
and a hidden tab also **suspend** hover (a stale `:hover` can survive a blur) until the hand
moves again, which is the same mechanism a throw uses.

**The one place a flag was unavoidable:** a drag ends with the grabbed plate still under the
pointer, so the hover pause would swallow the throw on the very frame it started. Hover is
therefore ignored from the moment a drag is recognised until the next genuine pointer move,
tracked by a single `pointermove` listener that removes itself. Tooltips are hidden for the
same window, because during and just after a throw the plates slide under a still pointer
and the pill would strobe from one dish to the next.

**One behaviour change that is not in the brief but is required by it:** a plate focused by
a mouse press no longer pulls the wheel round. `focusin` now only drives the focus-to-view
ease when the plate matches `:focus-visible`, which a mouse press does not. Without it every
click and every drag start would fight the keyboard's own animation. Keyboard focus is
unchanged.

### 4. Reduced motion

The wheel is still static and the plates still do not bob, but the CSS override
`.wheel-hub { transform: none !important }` had to go: it would have made the drag invisible
here, and a drag is the visitor's own hand, not motion. The static arc now rests on the JS,
which never starts the loop, never attaches the scroll handler, and pins `--wheel-rot` to 0.
A drag rotates the wheel and is released with zero momentum. Tooltips work.

---

## Verified in the browser

Production build, gstack berth `cosmos` (`BROWSE_PORT=39157`), 1280x900 unless stated.
Numbers are `--wheel-rot` in degrees, read off the hub.

**(a) Ambient still runs.** 78.25 at t=0, 84.70 at t=3s = **2.15 deg/s** (target 2.143).
Second reading after the whole test pass: 41.22 to 47.52 = **2.10 deg/s**. The first attempt
read 4.64 deg/s because `scrollIntoView` had just injected a scroll boost that had not
finished decaying; that is the boost working, not a fault, and it is why the reading is
taken 2.5s after any scroll.

**(b) Drag.** Grabbed spoke 9 at (1150, 537), 200px up in 20 synthetic pointer steps.

| moment | rotation |
|---|---|
| before `pointerdown` | 119.68 |
| at `pointerdown` | 119.68 |
| end of the 200px drag | **140.37** (+20.69, the wheel followed the hand) |
| at `pointerup` | 140.37 (no jump on release) |
| +300ms | 164.13 (throw carrying, ~79 deg/s) |
| +2s | 192.54 |
| +3s | 194.93 (**2.39 deg/s**, back at ambient and still advancing) |

`clicks seen: 0`, `dialog: false`, URL unchanged, `document.activeElement: BODY`.
`html.wheel-grabbing` removed on release. Mid-drag state, screenshotted:
`data-drag` set, `wheel-grabbing` set, **0 tooltips visible**.

The plate tracks the pointer's **angle**: after a 200px straight-line drag the pointer was
at (1150, 337) and the plate centre at (1222, 391), both on the same ray from the hub
(-143.6 degrees). See Risks 3.

**Click suppression.** Drag then the click the browser fires afterwards: **no dialog**.
A press that moved 2px and was released in 60ms, then the same click: **dialog opens**.
A real mouse click (Playwright, not synthetic) on a plate with the wheel running:
**dialog opens**, URL unchanged.

**(c) Hover.** Spoke 2 hovered with the real mouse: tooltip "Better Mac burger", opacity 1,
cursor `grab`. Wheel 20.63 to 20.63 over 2s, **paused**. Mouse moved off to the About
heading: 21.57 to 25.86 over 2s = **2.145 deg/s**, resumed. The `data-drag` left over from
the previous throw cleared on the first real mouse move, as designed.

**(d) Native drag.** 24 plate images, all `img.draggable === false` and
`getAttribute("draggable") === "false"`. A dispatched `DragEvent("dragstart")` on an image:
`defaultPrevented: true`, dispatch returned `false`. Same on the button. Computed styles on
the plate button: `user-select: none`, `-webkit-user-drag: none`, `touch-action: pan-y`;
on the image `-webkit-user-drag: none`, `pointer-events: none`.

**(e) Click without moving** opens the pop-up. Covered under (b).

**(f) Reduced motion** via `Emulation.setEmulatedMedia`: rotation **0.00 drift** over 2s,
plate `animation-name: none` (float off), a drag moved the wheel **+20.63 degrees**, and
1.5s after release the rotation was **unchanged: momentum 0.00**. Hub transform is a live
`matrix(0.935875, 0.352332, ...)`, i.e. the rotation is applied, not forced to `none`.
Tooltip on a real hover here: opacity 1.

**(g) Console:** no messages at all at 1280, no errors at 375.

**(h) 375:** `.plate-wheel` `display: none`, 3 row plates, all three labels visible at
opacity 1 ("Blue cheese", "BBQ chicken sandwich", "Better Mac burger"), images
`draggable false` and `-webkit-user-drag: none`, `touch-action: manipulation`,
`scrollWidth 375 === innerWidth 375` (no leak). A tap on the middle plate opens the menu
pop-up.

**Keyboard, unchanged.** Tab lands on spoke 1, `:focus-visible` true, the wheel pulls it
into view (box left 1046, right 1219, fully on screen), tooltip opacity 1, and the wheel
holds still: 0.00 drift over 1.5s. Enter opens the pop-up. Escape closes it and returns
focus to the plate, which correctly keeps the wheel paused. Tabbing out of the wheel scrolls
the About band off screen and the IntersectionObserver stops the loop, which is the existing
design, not a regression: scrolling back resumes at 2.10 deg/s.

### Screens

`docs/handoffs/screens/engineering_2026-09-02_v7/`

```
wheel-rest-1280.png                  wheel turning, nothing hovered
hover-paused-tooltip-1280.png        real hover, tooltip up, wheel held still
drag-in-progress-1280.png            mid drag: no tooltip, plates upright
wheel-after-drag-1280.png            after the throw
keyboard-focus-1280.png              Tab to a plate, pulled into view
click-opens-menu-1280.png            a still click opens the menu pop-up
reduced-motion-static-1280.png       reduced motion, static arc
reduced-motion-hover-tooltip-1280.png  reduced motion, tooltip still works
mobile-row-375.png                   three plates, labels always on
mobile-menu-open-375.png             tap opens the pop-up
```

---

## Files

```
components/PlateWheel.tsx   drag to spin (pointer capture, angular mapping, velocity,
                            momentum into the existing boost, click vs drag), pause read
                            from the DOM every frame instead of from events, focus ease
                            gated on :focus-visible, draggable={false} + onDragStart on
                            the plates, cursor and touch-action classes
app/globals.css             .plate-btn drag proofing, .wheel-hub[data-drag] tooltip
                            suppression, html.wheel-grabbing cursor, reduced-motion block
                            no longer forces transform: none on the hub
```

Nothing else was touched. No new dependencies.

---

## Risks

1. **The 300ms click window is the brief's rule, and it has a cost.** A deliberate slow
   press that does not move (press, think, release after half a second) is treated as a
   drag of zero degrees and does **not** open the pop-up. Implemented as specified. If Olga
   or Kazim find it annoying in the hand, the fix is one constant: drop the time test and
   keep only the 6px test. Flagged, not changed.
2. **Touch cannot spin the wheel.** By design, so the page still scrolls on a touchscreen
   at 1024 and up (iPad landscape, touch laptops). Tap still opens the pop-up. If a wheel
   drag on touch is wanted, it needs `touch-action: none` on the plates plus a direction
   test in `pointerdown`, and that is its own pass with its own scroll-regression risk.
3. **The plate tracks the pointer's angle, not its exact position.** Drag well off the
   ring's radius and the plate stays on the ray to the hand but not literally under it:
   measured 76px apart after a 200px straight drag on a 190px plate, so the cursor is still
   on or beside the plate. This is inherent to any wheel and is the natural behaviour, but
   it is a deliberate choice, recorded here.
4. **`pointer-events: none` on the plate images** moves the hit target from the image to
   the button. Verified identical in practice (`elementFromPoint` returns the button, hover
   and click behave as before), but any future CSS that expects to hover the image itself
   would silently do nothing.
5. **The reduced-motion CSS guard is gone.** `.wheel-hub { transform: none !important }` had
   to be removed so a drag can move the wheel there. The static arc now depends on the JS
   pinning `--wheel-rot` to 0. If the component's effect ever fails to run, the fallback is
   the CSS variable's own `0deg` default, so it is still static, but the belt is now a
   single strap.
6. **`html.wheel-grabbing *` is a universal `!important` cursor override.** Active only
   between `pointerdown` and release, and removed on unmount, but it is a blunt selector.
7. **The drag was verified with synthetic PointerEvents.** `browse` has no
   `Input.dispatchMouseEvent` in its CDP allowlist, so a hardware-level mouse drag could not
   be driven. Hover, click, keyboard and the mobile tap were all verified with **real**
   input. A real mouse and a real trackpad drag are Olga's to confirm.
8. **Note for whoever automates this next:** Playwright's actionability check cannot hover
   or click a moving element, so `$B hover` and `$B click` time out against the turning
   wheel. Freeze it first (emulate reduced motion, or hover it while frozen and then clear
   the emulation, which is what this pass did) or the test reads as a failure when nothing
   is wrong.

---

## Next

**qa-test-engineer (Olga)**, through the Michael (code-review) gate.

The full gesture matrix, on real hardware:

- **mouse**: grab a plate and spin it, both directions, fast and slow. The wheel must follow
  the hand, must never open the menu on a drag, and must always come back to the ambient
  turn after release. Release with the hand still and it should ease back up to ambient
  rather than fling.
- **trackpad**: the same, plus a two-finger scroll during a drag (the hub's position is
  re-read every move, so the wheel should stay under the hand while the page scrolls).
- **touch** (iPad or a touch laptop at 1024 and up): a swipe over the plates must scroll the
  **page**, not the wheel. A tap must open the pop-up. Confirm there is no ghost image and
  no download prompt on a long press.
- **keyboard**: Tab to a plate, it comes into view and the wheel holds; Enter opens the
  pop-up; Escape returns focus to the plate; Tab through all six.
- **reduced motion** with the real OS setting on: static arc, plates not bobbing, drag still
  works, no throw, tooltips work.
- **the original bug, explicitly**: press and drag a plate hard, release, and confirm the
  wheel keeps turning afterwards and that nothing downloads. Then hover a plate and move
  away, twice, and confirm it pauses and resumes both times.
- **alt-tab away mid-drag** and come back: the wheel must be turning.

Rebuild note, unchanged from v3 and still true: `pkill -f next-server`,
`rm -rf .next/cache/images`, then `npm run build && npm run start`. Port 9157.

---

## Human gate

**Kazim decides:**

1. **The 300ms click rule.** A slow, deliberate press with no movement currently does not
   open the menu. Keep it (matches the brief), or loosen it to distance only.
2. **Touch drag.** The wheel is mouse and pen only, so a finger still scrolls the page.
   Accept, or spend a pass on a direction-aware touch drag.

Nothing is committed. James commits.
