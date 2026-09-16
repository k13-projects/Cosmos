# Engineering handoff — Cosmos Burger, Round 4 (Kazim's own read), Natalia, 2026-09-15

**Repo:** `/Users/k13/Desktop/PROJECTS/Cosmos` · **Branch:** working tree only, no branch created,
no commit, no push (Lesson 0: shipping is Kazim's call). **Files owned this run:**
`components/About.tsx` (read only, untouched), `components/Values.tsx` (read only, untouched),
`components/PlateWheel.tsx`, `app/globals.css`.

**Verification method:** `npm run build && npx next start -p 9157` (never `next dev`, Lesson 30),
`.next/cache/images` cleared before every restart (Lesson 5), killed with `pkill -f next-server`
(Lesson 3). Measured with the `chrome-devtools` MCP driving the real production server:
`getBoundingClientRect()` sweeps of full wheel rotations (both rings), synthetic `PointerEvent`
drags, real keyboard `.focus()` calls on every reachable plate, and an init-script `matchMedia`
override to force `prefers-reduced-motion` (this tool has no direct reduced-motion flag).
Screenshots under `docs/handoffs/screens/engineering_2026-09-15_v4/`.

## Status      DONE

## Summary
Both of Kazim's own findings from the live preview are fixed and measured, not eyeballed:
(1) the About band's composition now travels together at every width instead of opening an
unbounded gap on a 34" monitor, and (2) the mobile wheel shows the six dishes once, spaced for
calm and legibility, with every existing gesture/keyboard/reduced-motion behaviour reverified on
the changed code. One real, previously-invisible bug was found and fixed along the way (a
keyboard-focus-triggered scroll bug in the mobile belt), not shipped broken.

## For Kazim
Natalia fixed both things you flagged on Cosmos: on your big monitor the burger photos used to
drift way off to the right leaving a huge empty gap; now they travel with the text so the whole
section reads as one picture at every size, including your 34" width. On the phone, the wheel now
shows each of the six dishes once instead of the same six repeated four times, so it reads calm
and spacious instead of crowded. While testing it with a keyboard she also caught and fixed a bug
that would have made some dishes unreachable for a keyboard or screen-reader user. Nothing is
shipped yet; that is your call once QA has looked at it.

## Job 1: the About band on a wide monitor

**Root cause.** The plate wheel's hub was anchored to 100% of its own box, which spans the raw
viewport width (it is a sibling of the 1400px content column, not a child of it). Past 1400px the
copy's own right edge only travels at HALF the viewport's growth rate (`mx-auto` centring a
fixed-width container), while the hub travelled at the FULL rate, so the gap between them opened
without limit: 358px at 1440, 864px at 2560, 1304px at 3440 (my own measurement, real
`getBoundingClientRect()` sweeps, not the numbers quoted in the brief, though they land within a
few px of them).

**Fix.** One line in `app/globals.css` (`.plate-wheel`'s desktop `--hub-left`): subtract the same
growing side-margin the 1400px container has past that width, so the hub travels at the same
half-rate as the copy. Below 1400px this is a no-op; every clearance Round 3 tuned at 1024/1280 is
byte-for-byte unchanged.

**Deliberately not done: growing the 1400px container.** The brief named this as one of two
obvious levers. I worked the algebra and then proved it empirically: growing the container's own
max-width on top of the hub fix REOPENS the same unbounded growth (the container's own margin, not
just the hub's, would then be doing double duty, and the two effects don't cancel the way pulling
the hub in alone does). The math and the reasoning are written into the CSS comment in place, so
the next person doesn't have to re-derive it.

**Measured, before/after, full revolution (3 degree steps), real `getBoundingClientRect()`:**

| viewport | gap: copy to nearest plate | min clearance to values grid | min clearance to About copy | scrollWidth vs innerWidth |
|---|---|---|---|---|
| 1024 | 37 (unchanged from Round 3) | 113 | 37 | 1009 / 1024, no leak |
| 1280 | 239 (unchanged) | 123 | 239 | 1265 / 1280, no leak |
| 1440 | 358 → 345 | 144 | 345 | 1425 / 1440, no leak |
| 1920 | 544 → 291 | 74 | 291 | 1905 / 1920, no leak |
| 2560 | 864 → 291 | 71 | 291 | 2545 / 2560, no leak |
| 3440 | 1304 → 291 | 76 | 291 | 3425 / 3440, no leak |

The gap goes flat at 291px from 1920 up instead of climbing without bound. Every clearance number
stays comfortably positive; re-swept the tightest point (2560, values grid, 71px) at 1 degree
resolution and it never closes further (71.2px, stable). The values band stayed centred at every
width (left/right margin difference a constant 15px at every size, the browser's own scrollbar
reservation, not drift) and its grid never became three columns marooned in a wide row, since it
is still capped at `max-w-[780px]` regardless of the section's own width. Screenshots at 1440,
2560 and 3440 (`about-1440.jpg`, `about-2560.jpg`, `about-3440.jpg`) show the plate cascade reading
as one connected composition at every size, not a text column with a wheel stranded near the edge.

## Job 2: the mobile wheel, six dishes once

**What changed.** `SPOKE_COUNT` (24, four copies of six, 15 degrees apart) is untouched and still
drives the desktop ring, lg and up, exactly as before. A second, separate spoke set now drives the
mobile ring: `MOBILE_SPOKE_COUNT = 6`, each of the six dishes exactly once,
`MOBILE_SPOKE_STEP_DEG = -60` (360 / 6), spaced around the FULL circle rather than clustered into
the blueprint's ~90 degree visible arc. Both spoke sets are always in the DOM, toggled by a plain
CSS media query (`hidden lg:contents` / `contents lg:hidden`), never a JS breakpoint branch, so
server and first client render stay byte-identical (no hydration risk to chase). A small
`WheelSpoke` helper is now shared by both rings' `.map()` calls so their markup structure can't
drift apart. `--wheel-r` 150-190px to 165-215px, `--plate-w` 96-132px to 112-156px (bigger, per the
brief); belt height 240px to 280px for the wider 60 degree sag.

**The emptier arc, decided deliberately.** Six plates 60 degrees apart against a visible window
measured at roughly 90 to 100 degrees means the window is wider than the spacing, so at least one
plate is always inside it as the ring turns — swept a full 180-sample rotation at every tested
width and never once found zero plates visible. Most of the time 1 to 2 plates are visible at
once (up to 4 counting a sliver at the clip edge), against the old design's ten-plus. This reads
as a breath, not a hole: it's the direct, intended consequence of "too much, too crowded" being
the whole brief, not a side effect to correct for.

**A real bug found while testing the actual keyboard contract, not shipped.** Focusing every
reachable plate in turn (not just eyeballing a screenshot) found that tabbing to an off-screen
primary plate made the BROWSER auto-scroll the belt's own `overflow: hidden` box to reveal it —
`belt.scrollTop` landing at 244px with no scrollbar ever drawn, since an `overflow: hidden` box is
still a scrollable region per spec even with nothing to show for it. That silently desynced every
`hub.getBoundingClientRect()` read the drag gesture and the focus page-scroll correction depend on
from where the hub visually was. It only surfaces now: 24 densely-packed spokes almost always had
a primary already near the visible arc, so the browser rarely needed to auto-scroll; six spokes
spread round the whole circle are far more often off-screen at the moment of focus. Fixed with
`overflow: clip` in place of `overflow: hidden` (the desktop ring's own x-axis already uses this
technique) — `clip` was built specifically to never become a scroll container, so there is no
scrollport for a focus event to move. Written up as Lesson 34.

**Full behaviour contract, reverified live on the fixed build:**
- All six dishes reachable by keyboard, each correctly named on its caption, each landing inside
  the belt's visible clip box on focus, `belt.scrollTop` staying 0 the whole time.
- Touch drag-to-spin with momentum: a synthetic 130px `pointerType: "touch"` drag rotated the ring
  (300 → 344deg) and it kept turning after release (344 → 18deg over the next 300ms, no dead stop).
- Click opens the menu pop-up (`role="dialog"` appears); the drag above did not.
- `prefers-reduced-motion`: ring pinned at 0deg and static a full second with nobody touching it;
  a drag still moves it (0 → 35.84deg) and holds exactly there with zero drift a full second after
  release, no momentum.
- `draggable={false}` and `user-select: none` still present on every plate image/button.

**Collision + reachability, clip-aware sweep (Lesson 31), full revolution, every tested width:**

| viewport | all 6 dishes reachable | min clearance to values grid | min clearance to About copy | belt-to-first-icon gap |
|---|---|---|---|---|
| 320 | yes | 80 | 125 | (below `sm:`, same padding tier as 375/390/430) |
| 375 | yes | 80 | 105 | 104 |
| 390 | yes | 80 | 101 | 104 |
| 430 | yes | 80 | 76 | 104 |
| 768 | yes | 144 | 56 | 168 (crosses the `sm:` padding step, expected) |

No horizontal leak 320 to 768. The belt-to-first-values-icon gap stays 104px, exactly where
James/Olga's Round 3 fix left it: the belt grew 40px taller for the wider spacing, but the gap is
structurally set by About's own `pb-10` plus Values' internal icon offset, not by the belt's own
height, so it never needed to move — worked through in the CSS comment in place so the next
session doesn't have to re-derive it.

## Verification
`npx tsc --noEmit` clean, `npm run build` clean (no lint/type errors), no em/en dashes in any
changed file. Zero browser console errors at 375, 1440 and 3440 after load, checked fresh on the
rebuilt server each time. `npx next start -p 9157`, `.next/cache/images` cleared before every
restart, all measurement against that server (Lesson 30).

**Not tested:** real touch hardware (synthetic `PointerEvent`s, same limitation every prior round
noted); a real mouse for the desktop hover tooltip (this round's edits never touched that code
path, so it was not re-driven, same call QA made last round for the same reason).

**One environment note, not a product finding.** This machine hit its own documented flakiness
mid-run (`docs/handoffs/qa_2026-09-15.md` "Risks" already logged the same class of issue): one
browser tab drifted into a stale, internally-inconsistent render after many consecutive test
scripts (a hub position that stopped matching its own CSS `top` value on that one tab only), and a
separate `reload` call timed out once. Both were caught by cross-checking on a fresh tab before
trusting anything, not reported as bugs, and neither survived into the numbers above.

## Files
- `app/globals.css` — desktop `.plate-wheel` `--hub-left` formula (Job 1); mobile `--wheel-r` /
  `--plate-w` clamps and belt-height reasoning (Job 2).
- `components/PlateWheel.tsx` — mobile ring rebuilt to 6 unique spokes at 60 degrees
  (`MOBILE_SPOKE_COUNT`/`MOBILE_SPOKE_STEP_DEG`/`mobileAngleFor`); `overflow-clip` fix on the
  mobile belt; belt height 240px → 280px; `data-angle` added to each plate and `onFocusIn` reads it
  off the DOM instead of the desktop-only `angleFor(spoke)`, so keyboard targeting is correct for
  both rings; new shared `WheelSpoke` helper; stale "always on" tooltip doc comment corrected to
  match the actual (Lesson 33) focus-reveal behaviour.
- `tasks/todo.md` — Round 4 ticked, review section added.
- `.claude/Lessons.md` — Lesson 34 added (`overflow: hidden` is still a scrollport).

## Risks
- The mobile ring's new `--wheel-r`/`--plate-w` clamp values and the 280px belt height were tuned
  by measurement on this machine's headless renderer; worth a glance on a real phone before ship,
  same standing recommendation every layout round carries.
- The wide-screen fix assumes the About/Values containers stay at `max-w-[1400px]` — if that
  number ever changes, the matching literal in the `--hub-left` CSS comment has to change with it
  (documented in place, not a second hidden source of truth, but still a manual sync point).
- Real touch hardware and a real mouse were not used for the parts of the contract unaffected by
  this round's edits, consistent with every prior round.

## Next
qa-test-engineer (Olga) — the two-agent Chrome QA gate on both jobs together, then the code-review
gate (Michael) before shipping. Recommend re-running the same keyboard-focus contract herself
rather than taking this handoff's numbers on trust, same standing house practice.

## Human gate
None. No branch, no commit, no push, nothing irreversible. Shipping (`hm`/`hm++`) is Kazim's call
per Lesson 0, once QA has cleared this round.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
