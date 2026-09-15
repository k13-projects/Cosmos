# Engineering handoff — Cosmos Burger, Round 3 work package A, the About band (Natalia, 2026-09-15)

**Repo:** `/Users/k13/Desktop/PROJECTS/Cosmos` · **Branch:** working tree only, no branch created,
no commit, no push (Lesson 0: shipping is Kazim's call). **Files owned this run:**
`components/About.tsx`, `components/Values.tsx`, `components/Icons.tsx`,
`components/PlateWheel.tsx`, `app/globals.css`. `components/Locations.tsx` and `lib/content.ts`
were never opened (work package B's files, landed separately, see
`docs/handoffs/engineering_2026-09-15_v2.md`).

**Verification method:** `npm run build && npx next start -p 9157` (never `next dev`, Lesson 30),
`.next/cache/images` cleared before every restart (Lesson 5), killed with `pkill -f next-server`
(Lesson 3). Measured with the gstack `browse` skill's headless fallback (`$B`, Aside was not
available on this machine) driving the real server: `getBoundingClientRect()` sweeps of the plate
wheel's full rotation (every 2 degrees) against the actual DOM elements, synthetic `PointerEvent`
drag simulation, CDP `Emulation.setEmulatedMedia` for `prefers-reduced-motion`, and a real
CDP-level hover (not a synthetic dispatch, which does not set `:hover`) after pausing the wheel's
own animation so Playwright's hover would not time out waiting for a moving target. Screenshots at
375/768/1280/1440 saved under `docs/handoffs/screens/engineering_2026-09-15/`.

## Status      DONE

## Summary
All four of Lorena's Round 3 items assigned to this package
(`docs/intake/client_email_2026-09-10.md`) are implemented, built clean, and measured, not
eyeballed:

- **(1) About text widened**, closing the gap to the wheel.
- **(2) Values band centred** at every breakpoint, reversing round 2; the plate/"Fresh always"
  collision that reversal reopens is re-solved on the wheel's own geometry instead.
- **(3/6) Her three icons**, CSS-mask + `currentColor`, sized so the differently-shaped sources
  read as one visual weight instead of one cropped/tiny.
- **(5) A real, turning wheel on mobile**, all six dishes, replacing the static three-plate row
  Lorena read as broken.

### (1) About text widened
`max-w-[640px]`/`62ch` → `max-w-[780px]`/`70ch`, still inside the readable 45 to 75ch band, with a
`lg:max-w-[740px]` step back down only in the 1024 to 1279 window (the wheel's own tightest one,
see below), returning to 780 at `xl:`.

Before/after, the wrapper's rendered width at 1024 (where the wheel leaves the least room):
`max-w-[640px]` → effective paragraph width capped by 62ch; now `max-w-[740px]` with 70ch, and the
sweep below proves it stays clear of the wheel across a full rotation.

### (2) Values band centred, collision re-solved on the wheel's side
`Values.tsx`: `lg:mx-0` removed, the grid is `mx-auto` at every breakpoint now. `PlateWheel.tsx` /
`globals.css`: `--wheel-r` clamp 0.47vw/660 → 0.34vw/620, `--plate-w` clamp 0.23vw/300 → 0.17vw/280,
hub offset ratio 0.676 → 0.72 (the ring reaches less far left at every size). `Values.tsx`'s own
clear lane grew back, `lg:pt-16` → `lg:pt-28`.

**Minimum clearance across a full revolution** (2 degree steps, real bounding boxes, not a static
screenshot):

| Viewport | To values grid | To About copy |
|---|---|---|
| 1024 | 105px | 36px |
| 1280 | 121px | 206px |
| 1440 | 150px | 325px |
| 1920 | 302px | 511px |

For reference, round 2's own numbers (left-aligned grid, documented in `tasks/todo.md`): values
56/185/294/512, About 62/250/368/608. About's margin is intentionally smaller now (that gap was
Lorena's exact complaint); the values margin is smaller at the widest sizes and larger at 1024,
and never goes negative anywhere measured.

**No horizontal leak, 320 to 1920** (`document.documentElement.scrollWidth` vs `window.innerWidth`,
19 widths swept): `scrollWidth` trails `innerWidth` by a constant 15px at every size (the headless
browser's own scrollbar reservation), never exceeds it.

### (3/6) Her three icons
`Icons.tsx`: a `maskIcon()` factory renders each of `public/icons/values/{burger,vibes,fresh}.png`
as a `currentColor`-painted CSS mask (`mask-image`/`-webkit-mask-image`), the same yellow-token
inheritance the redrawn SVGs gave for free — a plain `<img>` could not. The three sources are
different aspect ratios (burger 270x239, vibes 270x132, fresh 270x224); a shared square box would
either crop the wide vibes mark or strand it tiny in mostly-empty padding (the "cut off" look her
note flagged). Each box instead holds the same ink AREA (width = √(area × the source's own aspect
ratio)), so the three read as one visual weight side by side. Confirmed live: burger 76×67, vibes
103×50, fresh 79×65 at the sm+ size, matching their source aspect ratios to within rounding, all
painted `rgb(250, 240, 12)` (the yellow token). `Values.tsx` wraps each icon in a fixed-height
frame so the three titles start at the same baseline regardless of the icon's own rendered height
— confirmed identical (`top: 1699`) across all three at 1280.

The three hand-drawn SVGs (`BurgerIcon`'s use in `valueIcons`, `VibesIcon`, `FreshIcon`) are gone.
**`BurgerIcon` itself was kept**: it is also `MenuPlaceholderIcon`'s artwork in the menu pop-up
(`MenuPanel.tsx`), a second, unrelated consumer the task's "delete the three hand-drawn icons"
note did not anticipate. Deleting it would have broken that pop-up.

### (5) A real, turning wheel on mobile
One `PlateWheel` component now serves both breakpoints. The desktop ring is unchanged in shape
(off-screen-right hub, spill into the values band, Lessons 16/24-26 all still apply exactly as
before). A second, smaller ring appears below 1024px: hub centred (`left: 50%`) at the BOTTOM of
its own fixed-height (`h-[240px]`), fully `overflow-hidden` belt, so the ring's top arc pokes into
view — a rim mostly buried below the fold — instead of the old static three-plate row.

**Why `overflow-hidden`, not desktop's `overflow-visible` spill:** the mobile hub is centred and
the wheel never stops turning, so every spoke eventually swings through the far side of the
circle — exactly where the About paragraph and the Values band's text live. Desktop can spill
because its hub sits far enough off-screen that the text-bearing side of the ring is the only side
ever in play; the mobile belt hard-clips instead, so "never collide with the text" holds by
construction, not by careful timing.

**Collision proof, mobile**, same full-revolution sweep, this time clipping every plate to the
belt's own box before comparing anything (see the caught false-positive below):

| Viewport | To values grid | To About copy |
|---|---|---|
| 320 | 120px | 113px |
| 375 | 120px | 84px |
| 390 | 120px | 76px |
| 430 | 120px | 61px |

The values-grid number is a flat 120px at every width because it is really just the belt's own
fixed bottom margin: nothing the belt clips can ever paint past its own edge, so this is a
structural guarantee, not a per-rotation measurement.

**Full behaviour contract, verified live, not read off the code:**
- Ambient rotation: running, generic rAF loop, unchanged.
- Scroll injects velocity: unchanged code path, generic (reads `window.scrollY`, not geometry).
- **Touch drag-to-spin with momentum**: simulated a 130px horizontal `PointerEvent` drag with
  `pointerType: "touch"` on a mobile plate — rotated the ring ~30 degrees, and after release the
  rotation kept going at the thrown speed (no dead stop, no snap-back).
- **Click still opens the menu pop-up** (`role="dialog"` appeared), **a drag never does** (checked
  immediately after the drag above: no dialog).
- **Keyboard focus** on an off-screen primary plate turned the ring until it entered the
  viewport (`left` moved from 248 to 121 on a 375px screen, landed inside bounds).
- **`prefers-reduced-motion`**: the ring sits dead still (`--wheel-rot` read `0deg` before and
  1.5 seconds after, no drift); a drag still moves it, with no momentum (rotated to 47.69deg on
  release, held exactly there a second later).
- **Desktop's own touch exclusion is preserved**, now gated on `(min-width: 1024px)` instead of
  being unconditional: the same drag simulation at 1280px left the ring's rotation essentially
  untouched (0.22 degree drift, matching ~250ms of ambient turn, not a drag).
- **Desktop hover tooltip, unchanged**: a real CDP-level hover (after pausing the ambient
  animation, since Playwright's `hover()` times out waiting for a target that never stops moving)
  showed the correct name ("Better Mac burger") at `opacity: 1`.
- Zero console errors at 375 or 1280 after load.

`PlateRow` (the old static row) and its call site in `About.tsx` are deleted.

**One thing tuned on sight, not asked.** First pass gave every visible plate an always-on caption.
The mobile arc holds ten-plus of the 24 spokes at once (6 dishes × 4 repeats); all of them labelled
crowded into overlapping text (screenshot:
`docs/handoffs/screens/engineering_2026-09-15/wheel-values-375-rotated.jpg` shows the before —
two captions stacked on top of each other). Now only the six PRIMARY plates carry the always-on
caption; repeats stay silent, exactly as they already were for screen readers, and since the ring
keeps turning, each dish's own primary instance cycles back into view. Residual: two adjacent
primaries (15 degrees apart) can still crowd their captions at some rotations — a minor cosmetic
item, not a text collision, left as a known gap rather than building a bigger "name whichever
plate is nearest centre" single-caption system. Worth a follow-up round if Kazim wants it fully
clean.

**A real bug caught by the measurement script itself, not shipped.** The first collision sweep for
the mobile ring read as a large negative clearance (minus 60 to 90px) against the values grid.
`getBoundingClientRect()` ignores an ancestor's `overflow: hidden`: it was comparing the plates'
full, unclipped layout position (most of it never actually painted) against the text. Fixed the
script to intersect each plate with the belt's own box first; the corrected sweep is what's in the
tables above. Written up as Lesson 31 so the next measurement script does not repeat it.

**Verification.** `npx tsc --noEmit` clean, `npm run build` clean (no lint/type errors). No em or
en dashes in any changed file. Zero browser console errors at 375 and 1280 after load, checked
fresh each time. Screenshots: `docs/handoffs/screens/engineering_2026-09-15/` — `full-{375,768,
1280,1440}.jpg` (full page), `values-{1280,1440}.jpg` and `wheel-values-{375,768}.jpg` (the two
bands close up), `wheel-values-375-rotated.jpg` (a second rotation pose).

**Not tested:** real touch hardware (the drag gesture was proven via synthetic `PointerEvent`s
with `pointerType: "touch"`, which exercises the exact same code path the real event would, but is
not a finger on a screen); a real mouse for the hover tooltip (proven via the browse tool's
CDP-level `hover`, not a physical device). `fitcheck`'s full nine-viewport pass was not re-run in
full; the sweeps here cover its concerns (leaks, this band's own collisions) at more widths than
fitcheck's own set, but a full fitcheck pass is still worth running before ship since it also
checks tap targets and other sections this run never touched.

## Files
- `components/About.tsx` — widened text column, wired the unified `PlateWheel`, removed `PlateRow`
- `components/Values.tsx` — centred grid, fixed-height icon frame
- `components/Icons.tsx` — `maskIcon()` + the three value icons, hand-drawn burger/vibes/fresh
  removed from `valueIcons` (burger SVG itself kept for `MenuPlaceholderIcon`)
- `components/PlateWheel.tsx` — one component drives both rings; `desktopMQ`/`viewAngleDeg` for the
  breakpoint-dependent bits (keyboard-focus target angle, touch exclusion); `Plate`'s `placement`
  prop removed (only one caller left); `PlateRow` deleted
- `app/globals.css` — `.plate-wheel` re-tuned for lg+, a `@media (max-width: 1023.98px)` block for
  the mobile ring, `.wheel-hub` positioning moved from inline styles to CSS custom properties
- `tasks/todo.md` — Round 3 work package A ticked, review section added
- `.claude/Lessons.md` — Lessons 31 (clip before comparing bounding boxes) and 32 (gate an
  always-on ring caption to primaries only) added

## Risks
- The mobile ring's belt height (`240px`) and the `--wheel-r`/`--plate-w` mobile clamp values were
  tuned by measurement on this machine's headless renderer; worth a glance on a real phone before
  ship, same as any layout change (fitcheck's own recommendation).
- The two-adjacent-primaries caption overlap noted above is real, on sight, at some rotations on
  narrow phones. Cosmetic, not a collision with page text, not blocking.
- `BurgerIcon` in `Icons.tsx` is now used by exactly one consumer (`MenuPlaceholderIcon`). Work
  package B's handoff says Frings is now wired into the menu pop-up, which may have been the last
  item without a photo; if so, `MenuPlaceholderIcon` (and `BurgerIcon` with it) could be fully dead
  now. Not verified here (out of this package's files) and not removed on spec.

## Next
qa-test-engineer (Olga) — the two-agent Chrome QA gate, then the code-review gate (Michael) before
either work package ships. Recommend testing package A and B together since both touch the same
page and neither run drove a browser against the other's changes at the same time.

## Human gate
None. No branch, no commit, no push, nothing irreversible. Shipping (`hm`/`hm++`) is Kazim's call
per Lesson 0, once both work packages have cleared QA.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
