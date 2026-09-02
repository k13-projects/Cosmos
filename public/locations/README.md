# Locations marks

Three techniques were built and compared for the Locations card corner watermark
(`docs/handoffs/design_2026-09-02_v2.md`). Kazim picked **row C, detailed trace**, at 70%
opacity (see `docs/handoffs/engineering_2026-09-02_v6.md` for the picked value and why).
That is what ships, wired from `lib/content.ts` (`Location.mark`) into
`components/Locations.tsx`.

- `trace/*.png`, **shipped.** Canny edge line art, purple `#751080` ink on transparent,
  RGBA, capped at 800px on the long edge.
- `*.svg` (this directory's root), row A, hand-drawn flat silhouette icons. Not used, kept
  as the documented alternative if the trace treatment is ever revisited.
- `duotone/*.png`, row B, photo-derived duotone stamps (cream-to-purple luminance map,
  alpha-faded edges). Not used, kept as the documented alternative for the same reason.

Do not delete the unused rows: they are the comparison record Kazim picked from, and
either can be swapped back in by pointing `lib/content.ts`'s `mark.src` at the other
directory (same position/size contract, `object-fit: contain` for B and C since those
crops are not square).
