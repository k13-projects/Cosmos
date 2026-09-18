import type { Location } from "@/lib/content";

/**
 * The trading-status badge, e.g. Coming Soon.
 *
 * It exists because a guest who reads only the card would otherwise drive to a
 * hall that has not opened. Lorena asked for it again on 2026-09-17 after
 * looking at the live preview, which is the useful part of the note: the badge
 * was already there, as a thin outline pill in purple-on-cream, and it did not
 * register as a badge at a glance. So it is filled now, and the same component
 * serves both places it appears (the Locations card and the Order pop-up row)
 * rather than the two copies of identical markup that used to drift apart.
 *
 * Callers still own the accessible text: `Locations.tsx` appends the status to
 * the heading in an `sr-only` span, because the visible pill sits in a
 * different flex row from the name and a screen reader would otherwise read
 * them apart.
 *
 * The padding is tighter below `sm`. At 375px the filled badge sits beside the
 * area eyebrow, and the four extra pixels each side were enough to wrap "UCSD
 * CAMPUS" onto a second line. Same badge, same weight, four pixels less.
 */
export default function StatusBadge({ status }: { status: NonNullable<Location["status"]> }) {
  return (
    <span className="shrink-0 rounded-full bg-purple px-2.5 py-1 text-[12px] font-bold uppercase leading-none tracking-[0.1em] text-cream shadow-sm sm:px-3 sm:py-1.5">
      {status}
    </span>
  );
}
