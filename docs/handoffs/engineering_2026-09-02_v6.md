# Engineering handoff, Locations corner mark (Natalia, 2026-09-02, v6)

## Status PASS, with one pre-existing bug flagged (not mine to fix)

## Summary
Integrated Valentina's picked treatment, design_2026-09-02_v2.md row **C, detailed trace**
(Canny line art, purple `#751080` ink on transparent), into the five Locations cards in
`components/Locations.tsx`. Opacity target changed mid-build: the brief's original 15-20%
became Kazim's correction to 60-80%, "pick by look and by the text-over-mark contrast
rule." Picked **0.7**.

**Why 0.7.** Screenshotted the rail at 0.6, 0.7 and 0.8 at 1280
(`opacity-0.6-1280.png`, `opacity-0.7-1280.png`, `opacity-0.8-1280.png`). All three read
clean and legible, none muddy the card; the trace line art is thin enough that the
difference between 0.6 and 0.8 is subtle at normal viewing distance. 0.7 sits at Kazim's
own stated target and gives the most headroom on both sides if it needs to move later.

**The contrast rule that actually mattered.** At 0.35 (the original brief) a worst-case
full-alpha line pixel composites to roughly 4.5:1 against purple body text, passable but
tight. At 0.6-0.8 the same worst case drops to 1.5-2.5:1, a real failure, not a marginal
one. Computed (WCAG relative luminance, cream `#FFF2E1` under the mark's own alpha, purple
text `#751080`):

| opacity | worst-case composite bg | text contrast |
|---|---|---|
| 0.35 | `#CFA3BF` | 4.49:1 |
| 0.6 | `#AC6AA7` | 2.52:1 |
| 0.7 | `#9E549D` | 1.97:1 |
| 0.8 | `#913D93` | 1.54:1 |

The fix at this opacity range is not "reduce opacity until AA passes" (0.6-0.8 all fail
outright), it is **zero geometric overlap between the mark's box and any real text or
control, at every breakpoint**, verified by measurement below, not by eye. Once overlap is
zero, the contrast table above is moot: text next to the mark, not on it, sits on plain
cream at 8.89:1, untouched by mark opacity.

## What shipped
1. **Assets.** `public/locations/trace/*.png` already sized correctly (≤800px long edge,
   RGBA, purple ink): windmill 613×800, oceanside 800×704, miramar 800×776, global-fork
   450×800, station-8 800×466. No downscaling needed. Added
   `public/locations/README.md` documenting the two unused alternatives (`*.svg`
   silhouettes, `duotone/*.png` stamps) so they are not mistaken for dead files.
2. **Content.** `lib/content.ts`: added `mark: { src, width, height, alt }` to the
   `Location` type and all five entries. Oceanside's is commented PROVISIONAL, per
   Valentina's Risk (drawn from an old-site archive photo, not Lorena's current
   storefront shot, which has not landed).
3. **Component.** `components/Locations.tsx`: `next/image`, intrinsic `width`/`height`
   from the source PNG (no layout shift), `sizes="(min-width: 1024px) 7vw, (min-width:
   640px) 13vw, 16vw"`, `object-contain object-right-bottom` (the crops are not square),
   `pointer-events-none`, `aria-hidden`, `alt=""`. Width `21%` of the card, `aspect-square`
   box. Opacity via `opacity-[var(--mark-opacity)]`, the token defined once in
   `app/globals.css` (`--mark-opacity: 0.7`) so it is a one-line tune.
4. **Two geometry fixes**, both found by measuring `getBoundingClientRect`/`Range` rects
   against the mark's own box, not by eye:
   - `lg:max-w-[76%]` on the hours line only. Oceanside's hours string
     ("Mon to Thu 11:00 AM to 8:45 PM, Fri and Sat to 9:45 PM, Sun to 8:45 PM") wraps at
     1280 and 1440, and by default the wrapped line ran under the mark's box (measured:
     line right edge 972px vs. mark left edge 921px, a 51px overlap). 76% forces the wrap
     one word earlier; clears with margin (~15-40px depending on breakpoint). Address and
     the phone link (`w-fit`, self-start) were left alone: they never reach that far, and
     constraining them too force-wrapped an otherwise one-line address for no reason.
   - `bottom-[88px]` on the mark below `sm`, reverting to the flush `bottom-4` at `sm` and
     up. Below 640px the rail's `<li>`s stretch to the tallest card in the row (flex
     default `align-items: stretch`), so a card with little content still gets the full
     row height, and the Directions link, sitting at that height's true bottom, landed
     directly under the mark's flush-corner position (measured: visible overlap on every
     one of the five cards at 375, confirmed with a screenshot before the fix). Live-tested
     bottom offsets from 60-110px; 80-100px is the clean window (clears the controls row
     without reaching Oceanside's hours/phone text above it); picked 88px, the middle.
     Shrinking the mark instead of moving it was tried first and does not work: even at
     10% width (illegibly small, defeats the point of the mark) the overlap at 1280 does
     not clear.
5. Card div made `relative`; a new inner wrapper carries `relative z-10` around all the
   pre-existing content (everything except the mark). `position: absolute` paints above
   static in-flow content in the same stacking context regardless of DOM order, so without
   this the mark would paint over the text wherever the two boxes touch, even after the
   geometry fixes closed the gap to a few pixels. Belt-and-suspenders, not the primary
   defense (zero overlap is).

## Verification
- `npm run build && npm run start` on port 9157 (`pkill -f next-server`,
  `rm -rf .next/cache/images` first, per Lessons #3/#5). Build clean, `tsc --noEmit` clean,
  no `console.log`.
- Geometry measured with real DOM rects (`getBoundingClientRect`, `Range.getClientRects()`
  for actual text glyph extent, not the paragraph's full-width box) at 375, 640, 768, 1280
  and 1440, for all five cards: mark-vs-Order overlap, mark-vs-Directions overlap,
  mark-vs-any-text overlap. All `false` at every breakpoint after the two fixes above.
- Screenshots, `docs/handoffs/screens/engineering_2026-09-02_v6/`:
  `rail-1280.png`, `rail-768.png`, `rail-375.png` (full rail, marks visible),
  `card-closeup-windmill.png` (single-card detail), `opacity-0.6-1280.png` /
  `opacity-0.7-1280.png` / `opacity-0.8-1280.png` (the opacity comparison for James).
- `scrollWidth === innerWidth` at 375 (375 === 375, no horizontal overflow).
- Console clean at every breakpoint tested.
- Server left running on :9157 for Kazim.

## Files
- `components/Locations.tsx`
- `lib/content.ts`
- `app/globals.css`
- `public/locations/README.md` (new)
- `docs/handoffs/screens/engineering_2026-09-02_v6/*.png`

## Risks
- **Oceanside mark is provisional** (Valentina's v1 Risk, carried forward): drawn from an
  old-site archive photo, not Lorena's current storefront shot. Re-check when her photo
  lands; swap `mark.src` in `lib/content.ts` if the awning/trellis silhouette does not
  match the real building.
- **Pre-existing bug, not caused by this change, found while measuring it: the Oceanside
  card overflows its own fixed card height at 1280 and 1440.** At `lg`, cards are
  aspect-locked (`lg:aspect-[443/289]`, Lessons 20, part of the blueprint density spec).
  Oceanside carries more content than any other card (a two-line hours string plus a phone
  number, the only location with one), and even before any mark existed, that content
  stack plus its Order/Directions row does not fit inside the fixed card height at 1280 or
  1440: the controls render below the visible cream card, on the purple pattern behind it.
  Confirmed by reverting to the unmodified `git stash` baseline and measuring the same
  overflow (`controlsBottom` 844px vs. `cardBottom` 788px at 1280, zero mark-related
  changes present). My `lg:max-w-[76%]` hours fix (needed to clear the mark) makes this
  slightly worse, not better, at 1280 specifically (Oceanside's hours goes from 2 lines to
  3, adding about 24px): the alternative was leaving 0.7-opacity line art directly under
  real body text, which fails contrast outright, so the trade favors the mark fix. This is
  a card-density problem independent of the mark and needs its own decision (shorten
  Oceanside's hours string, let that one card break the aspect lock, or something else);
  not fixed here because Lessons 20 locks card size/density as spec, not styling freedom,
  and it is out of this task's scope. Flagging for James/Kazim to triage separately.
- **Global Fork's mark is the entrance, not the tower** (Valentina's v1 Risk, unchanged):
  deliberate, the real building is a generic apartment block.
- **Station 8's mark is drawn from a pre-opening construction render** (Valentina's v1
  Risk, unchanged): the venue has not opened, no finished-building photo exists yet.

## Next
**qa-test-engineer (Olga)**, via the Michael code-review gate.

## Human gate
**Oceanside mark provisional**, confirm once Lorena's storefront photo lands. Also decide
on the pre-existing Oceanside card-overflow bug above (unrelated to this change, found
while verifying it).
