# Engineering handoff: Cosmos Burger, Round 5 (Kazim's read of round 4), Natalia, 2026-09-15

**Repo:** `/Users/k13/Desktop/PROJECTS/Cosmos` · **Branch:** working tree only, no branch created,
no commit, no push (Lesson 0: shipping is Kazim's call). **Files owned this run:**
`components/PlateWheel.tsx`, `app/globals.css`. `components/Locations.tsx` and `lib/content.ts`
were not touched (another agent's finished work this session).

**Verification method:** `npm run build && npx next start -p 9157` (never `next dev`, Lesson 30),
`.next/cache/images` cleared before restart (Lesson 5), killed with `pkill -f next-server`
(Lesson 3). Measured with the `chrome-devtools` MCP driving the real production server: full-
rotation `getBoundingClientRect()` sweeps (clip-aware, Lesson 31), synthetic `PointerEvent` drags,
real keyboard `.focus()` calls on every reachable plate, an init-script `matchMedia` override to
force `prefers-reduced-motion`, and a live-injected stylesheet to build and screenshot a rejected
caption candidate without ever writing it to a file. Screenshots under
`docs/handoffs/screens/engineering_2026-09-15_v5/`.

## Status      DONE

## Summary
Both of Kazim's round-4 follow-ups are built and measured. (1) Mobile now names the current dish:
a single "reel" caption, fixed above the belt, names whichever plate sits closest to the top of
the arc and updates as the wheel turns; the per-plate-caption alternative was built, screenshotted
and rejected on real evidence (overlapping pills, captions sliced by the clip edge), not by
assumption. (2) The mobile ring is now 12 spokes (two copies of the six dishes, 30 degrees apart)
instead of round 4's 6, with the plate size and radius re-tuned so twelve plates clear each other
by a measured, comfortably-positive margin at every width, not just "more of them." The desktop
ring is unchanged, proved by diff and by live measurement, not just by not having edited it.

## For Kazim
Two things from your read of round 4. First: the phone now tells you what you're looking at, the
same way the mouse does on desktop, but as one name above the wheel that changes to whatever dish
is currently on top, rather than a name under every plate (that version collided and got cut off
when I actually built and tested it, so I didn't ship it). Second: about twice as many burgers are
visible at once on the wheel now, without the crowding round 3 had, because I measured exactly how
close they could get before ship. Nothing is live yet; that is your call once QA has looked at it.

## Job 1: names on mobile

**The two shapes, built and screenshotted, not just described.** Round 3/4 already proved
always-on per-plate captions fail on this ring (Lessons 32/33): I re-proved it at this round's
tighter spacing rather than trusting the old finding to still apply, by actually turning every
primary caption on (a live stylesheet injection, never written to the shipped file) and
screenshotting it: `candidateA-per-plate-390.png` shows overlapping pills and three of the six
primary captions extending past the belt's own clip box mid-word, worst-case pairwise gap 3px.
Shipped the alternative the brief itself named: `candidateB-reel-caption-390.png`, one caption,
fixed in a strip above the belt (outside its clip entirely), naming whichever dish is currently
closest to the top of the arc.

**Why this can never collide or get clipped, by construction, not by luck.** It is the only
caption on screen, so there is nothing to overlap. It lives in the belt's own top margin, a
region no plate is ever drawn in (the belt's arc geometry is completely unchanged; only the
margin above it changed), so it cannot be sliced by the clip line either. It updates from the
same two places that already drive `--wheel-rot` (the rAF loop and, separately, the drag handler,
since the rAF loop does not run under reduced motion), so it never lags behind what the wheel is
actually showing. Verified live: text changed from `Blue cheese` to `BBQ chicken sandwich` over an
8-second window with the wheel in view, stayed frozen when the section scrolled out of view
(matching the wheel's own existing pause behaviour), and updated correctly during a reduced-motion
drag too.

**Accessibility: additive, not a replacement.** The caption is `aria-hidden`. The real accessible
name for every one of the six dishes already exists (the button's own `sr-only` text plus the
focus-revealed tooltip, Lesson 33's fix, unchanged this round), reverified live for all six primary
mobile plates this round (table below). An auto-updating live region announcing the ambient
rotation forever would be noise, not a name; the caption is a sighted, touch-first convenience on
top of an already-complete keyboard/screen-reader contract, not a substitute for it.

## Job 2: more burgers, without crowding

**The geometry constraint, worked before the numbers.** Kazim asked for "a third, or a half" of
round 4's 60-degree gap. Only two spoke counts tile the six dishes onto a full circle in that
range: 12 spokes (30 degrees, "half") or 18 (20 degrees, "third"); going to any other integer
spoke count means the six dishes stop repeating evenly. Picked 30 degrees, the actual middle
between round 4's one copy (too sparse, his own complaint about round 3 in reverse) and round 3's
four copies (too crowded, the complaint that started this): two copies is the literal midpoint of
one and four on the scale that matters here (how many times the same six dishes repeat), not a
number chosen because it was the easier CSS edit.

**The plate size had to move too, and I proved that, not assumed it.** At round 4's plate size
(112 to 156px), 30-degree spacing already overlaps: the chord between neighbouring spokes
(`2R·sin(15°)`) is shorter than the plate width once the angle halves. `--wheel-r` moved
165-215px to 180-220px and `--plate-w` moved 112-156px to 68-84px (roughly halved: the real
lever), both re-tuned until a full-rotation sweep came back clean.

**Measured, full rotation (2-degree steps, 180 samples), real `getBoundingClientRect()`s,
clip-aware (Lesson 31):**

| viewport | min edge-to-edge gap between neighbouring plates | plates visible (any overlap w/ belt) | plates "substantially" visible (>=50% of own area) | any rotation shows a hole? |
|---|---|---|---|---|
| 375 | 9.2px | 6 to 7 of 12 | 5 to 6 | no, 0 of 180 samples |
| 390 | 9.6px | 6 to 7 of 12 | 5 to 6 | no, 0 of 180 samples |
| 430 | 10.6px | 6 to 7 of 12 | 5 to 6 | no, 0 of 180 samples |

Comfortably positive at every width, not near zero and not the wide-open gap round 4 had: worked
out analytically first (the chord formula against the six plates' average aspect ratio, ~1.65:1)
before touching the file, landed within 1px of what the real rendered rects gave back, so the
starting numbers were not a guess that happened to work. 5 to 6 plates substantially visible at
once (not slivers: at least half their own area inside the clip) against round 4's own reported 1
to 2: this is the "more burgers, not crowded" trade Kazim asked for, with a number behind both
halves of that sentence, not just the first half.

**Belt height, sag, and the gap to Values.** Belt height is unchanged, 280px: the arc's own
vertical footprint is identical to round 4 (same hub position, same clip box for the plates
themselves), because the new caption lives entirely in the margin ABOVE the belt (`mt-10` on the
caption, `mt-3` on the belt, replacing round 4's plain `mt-14` on the belt alone), not inside the
clipped arc, so it cannot compete with a plate for space by construction rather than by a lucky
number. Sag at 30 degrees (`R·(1-cos30°)`) runs about 24 to 30px across 375 to 430, comfortably
inside what the already-unchanged 280px belt clears.

Belt-to-first-values-icon gap: **80px** at every tested width, not round 4's reported 104px. This
is a measurement-methodology finding, not a regression, and it is Lesson 35 now: the Values band's
icon sits inside a `.reveal` card, whose scroll-triggered entrance transform has not necessarily
finished the moment it is first scrolled into the same viewport as the belt. Reading the rect right
after that first scroll gives 104px, reproducing round 4's own number exactly; deliberately
scrolling the Values section well past its own reveal trigger and re-reading settles at 80px, twice,
reproducibly. 80px also matches the CSS math exactly (`pb-10` 40px + Values' own `pt-10` 40px),
which a transient animation offset cannot. 80px is what a real visitor actually sees, since nobody
can be looking at a gap whose lower edge has not scrolled into view yet.

## Desktop: proved untouched, not just unedited

`SPOKE_COUNT`, `SPOKE_STEP_DEG`, `FIRST_ANGLE_DEG` and the `--hub-left` calc/clamp formula are
byte-identical to round 4's file (`git diff` shows only the `MOBILE_*` constants and the mobile
media-query block changed). Live at 1440: computed `--wheel-r`/`--plate-w`/`--hub-left`/`--hub-top`
match round 4's values exactly, 24 spokes render, `document.documentElement.scrollWidth` is 1425
against a 1440 viewport (the 15px is the scrollbar, not a leak), and full-rotation clearances to
both the About copy and the Values grid stayed comfortably positive (313px, 108px).

**One honest caveat.** This session's browse-automation tooling hit the same class of instability
round 4's own handoff already documented (a tab whose painted frame stops matching its own live
DOM/CSSOM state), worse this round, with repeated navigation timeouts that did not clear inside
the time available. Every number above was read from the DOM directly (`getBoundingClientRect()`,
computed styles), which does not depend on the paint being correct, so none of it is in question.
What I could not get was a second clean screenshot of the desktop ring actually painted; the one
attempt kept (`desktop-1440-attempt.png`) has rects that check out against the numbers above but an
empty-looking crop, kept for the record rather than discarded or silently redone with a claim it
was clean.

## Full behaviour contract, reverified live on the changed build

- All six primary mobile dishes reachable by Tab, each correctly named (`Blue cheese`, `BBQ
  chicken sandwich`, `Better Mac burger`, `Cosmos burger`, `Spicy jam`, `Hot Chicks sandwich`),
  each landing inside the belt's clip box on focus, `belt.scrollTop` staying 0 throughout
  (Lesson 34 holds at the new spoke count). The six repeats confirmed `tabindex="-1"` and
  `aria-hidden="true"`.
- Touch drag-to-spin with momentum: a synthetic 130px `pointerType: "touch"` drag rotated the ring
  (209.65 to 219.21deg while dragging) and kept turning after release (219.21 to 248.44deg over
  the next 300ms, no dead stop). The same drag's trailing click did not open the menu pop-up; a
  plain tap with no movement did, and closed again cleanly on Escape.
- `prefers-reduced-motion` (forced via an init-script `matchMedia` override; this tool has no
  direct reduced-motion flag): ring pinned at 0deg and static for 1.2s with nobody touching it; a
  drag still moves it (0 to 9.67deg) and holds exactly there with zero drift 600ms after release,
  no momentum.
- Scroll injects rotation velocity on top of ambient: 0.64deg over a 300ms window of pure ambient
  (matches the documented 15/7 deg/s exactly) vs 4.21deg over the same window right after a 250px
  scroll.
- `draggable="false"` confirmed on the rendered `<img>`; `overflow-clip` confirmed in the belt's
  rendered class list.
- Desktop click-to-open-menu and hover tooltip: unchanged code path, not re-driven this round
  (same call round 4 made for the same reason).

## Verification
`npx tsc --noEmit` clean, `npm run build` clean (no lint/type errors). No em or en dashes in either
changed file, `tasks/todo.md`, or the new Lessons entry. `npm run build && npx next start -p 9157`,
`.next/cache/images` cleared before restart, killed with `pkill -f next-server` (Lessons 3, 5). All
measurement against that production server, never `next dev` (Lesson 30).

**Not tested:** real touch hardware (synthetic `PointerEvent`s, same limitation every prior round
noted); a real mouse for the desktop hover tooltip (this round's edits never touched that code
path). A clean desktop screenshot at 1440 and a full-viewport mobile screenshot at 430 (see the
"one honest caveat" above; the underlying measurements are not in question, only a second visual
confirmation is missing). What is captured: `baseline-round4-390.png` (before), the two caption
candidates, `mobile-375-final.png` (the shipped look, text and caption clean, wheel partly below
the 375 crop), `desktop-1440-attempt.png` (kept with its caveat, not discarded).

## Files
- `components/PlateWheel.tsx`: mobile ring rebuilt to `MOBILE_SPOKE_COUNT` = 12 /
  `MOBILE_SPOKE_STEP_DEG` = -30 (two copies of the six dishes, mirroring the desktop ring's own
  repeat pattern instead of round 4's one-off six-unique-spokes scheme); new `captionRef` +
  `updateCaption()` (reads the nearest-to-top-of-arc spoke every tick and on every drag move, only
  writes the DOM when the dish actually changes); new caption JSX above the belt, `lg:hidden`,
  `aria-hidden`; belt's own top margin `mt-14` to `mt-3` (the caption's `mt-10` replaces the rest).
- `app/globals.css`: mobile `.plate-wheel` `--wheel-r`/`--plate-w` clamps re-tuned for twelve
  plates; updated geometry comments explaining the round-5 numbers and why they had to move
  together.
- `tasks/todo.md`: Round 5 ticked, review section added with the full measurement tables.
- `.claude/Lessons.md`: Lesson 35 added (reveal-animated elements measure wrong until they've
  actually revealed).

## Risks
- The new `--wheel-r`/`--plate-w` clamp values were tuned by measurement on this machine's headless
  renderer; worth a glance on a real phone before ship, same standing recommendation every layout
  round carries.
- The belt-to-icon gap correction (104px to 80px) is a measurement fix, not a code change, but it
  is worth QA independently confirming 80px on a fresh, fully-settled page rather than taking this
  handoff's number on trust, precisely because it contradicts a previously-reported figure.
- Real touch hardware, a real mouse, and a fully clean desktop screenshot were not obtained this
  round; the desktop claim rests on DOM/CSS proof (diff + live computed values + clearance sweep),
  which is solid, but a human glance at the actual desktop ring before ship is still worth doing
  given the tooling instability documented above.

## Next
qa-test-engineer (Olga): the two-agent Chrome QA gate on both jobs together, with particular
attention to: the caption's readability and timing on a real phone, the 30-degree spacing's real-
world feel (not just the measured clearance), and an independent desktop-ring glance given this
round's screenshot caveat. Then the code-review gate (Michael) before shipping.

## Human gate
None. No branch, no commit, no push, nothing irreversible. Shipping (`hm`/`hm++`) is Kazim's call
per Lesson 0, once QA has cleared this round.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
