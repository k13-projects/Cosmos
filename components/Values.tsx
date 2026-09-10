import { values } from "@/lib/content";
import { valueIcons } from "./Icons";

/**
 * Bold Flavour / Real Vibes / Fresh always (facts SS4.3).
 *
 * The ground is `magenta-deep`, not the brand magenta. White body copy on
 * #CD1AE0 measures 4.36:1 and fails WCAG AA; #B317C4 clears it. This is the one
 * place the token deliberately departs from the guide hex, and repainting it
 * back is an accessibility regression, not a brand fix. See the design handoff.
 *
 * `on-magenta` switches the focus ring to yellow: the default magenta ring is
 * invisible against this ground.
 *
 * 2026-09-08 (Lorena's round 2, client email SS1): "move the section and its
 * text higher up the page and center it." The blueprint itself draws the three
 * columns left of centre, not centred (Lessons 14, 16: the plates hang over the
 * right edge and must never cover "Fresh always"), so that is the shape this
 * builds toward rather than literal geometric centering. The lg:pt clear lane
 * shrank because the wheel's own horizontal shift (its columns now sit left of
 * the wheel's reach) does more of the collision-avoidance work than a tall
 * empty band above the icons ever needs to; see PlateWheel.tsx / globals.css
 * for the wheel side of the same trade.
 */
export default function Values() {
  return (
    <section
      aria-label="What Cosmos stands for"
      // lg:pt-16 (was lg:pt-36) is still not decoration: it is the clear lane
      // the wheel's lowest reach lands in (components/PlateWheel.tsx), just a
      // shorter one now that the grid below is also narrower and left-shifted.
      className="on-magenta bg-magenta-deep pb-16 pt-14 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-16"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* Centred grid up to lg (no wheel there, PlateWheel.tsx only renders
            lg:block); at lg it moves to the left edge of the page's own
            container, matching the blueprint's left-shifted columns and
            leaving the right side clear for the wheel's reach. */}
        {/* lg:max-w-[780px]: the blueprint's three columns span about 58% of
            the 1332px page (James measured 130 to 830px), at a bigger type size
            than the first pass of this round carried; 680px at 28px read as a
            small block in a wide empty band next to the plates. */}
        <div className="mx-auto grid max-w-[720px] grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8 lg:mx-0 lg:max-w-[780px] lg:gap-10">
          {values.map((value, i) => {
            const Icon = valueIcons[value.icon];
            return (
              <div
                key={value.title}
                className="reveal flex flex-col items-center text-center"
                style={{ "--i": i } as React.CSSProperties}
              >
                <Icon className="h-16 w-16 text-yellow sm:h-[72px] sm:w-[72px]" />
                <h3 className="mt-5 text-2xl font-bold leading-tight text-yellow sm:text-[28px] lg:text-[32px]">
                  {value.title}
                </h3>
                <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-white lg:text-[16px]">
                  {value.body}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
