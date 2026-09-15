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
 * 2026-09-10 (Lorena's round 3, client email SS2): "centered, not left
 * aligned" — she is reversing the round-2 read of the blueprint (Lessons 14,
 * 16), which had shifted these columns left of centre specifically so the
 * wheel's plates never cover "Fresh always". Her instruction wins outright:
 * the grid below is centred at every breakpoint again, full stop. The
 * plate/text collision this reopens is re-solved on the wheel's side instead
 * (smaller reach + a taller clear lane, both here and in
 * components/PlateWheel.tsx / app/globals.css) rather than by moving this
 * band off-centre a second time.
 */
export default function Values() {
  return (
    <section
      aria-label="What Cosmos stands for"
      // lg:pt-28: the clear lane the wheel's lowest reach lands in
      // (components/PlateWheel.tsx). Centring the grid put "Fresh always"
      // back under the wheel's full horizontal reach, so this lane grew back
      // to give the (now smaller) wheel vertical room instead of the
      // horizontal room the left-shifted grid used to donate.
      className="on-magenta bg-magenta-deep pb-16 pt-10 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-28"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* Centred at every breakpoint, per Lorena. lg:max-w-[780px]: the
            blueprint's three columns span about 58% of the 1332px page
            (James measured 130 to 830px). */}
        <div className="mx-auto grid max-w-[720px] grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-8 lg:max-w-[780px] lg:gap-10">
          {values.map((value, i) => {
            const Icon = valueIcons[value.icon];
            return (
              <div
                key={value.title}
                className="reveal flex flex-col items-center text-center"
                style={{ "--i": i } as React.CSSProperties}
              >
                {/* Fixed-height frame, not the icon's own height: the three
                    source images are different aspect ratios (see Icons.tsx),
                    so their rendered heights differ. Centring each inside the
                    same frame keeps every title starting at the same
                    baseline instead of jumping around with the artwork. */}
                <div className="flex h-[60px] items-center sm:h-[68px]">
                  <Icon className="text-yellow" />
                </div>
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
