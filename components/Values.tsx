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
 */
export default function Values() {
  return (
    <section
      aria-label="What Cosmos stands for"
      className="on-magenta bg-magenta-deep pb-16 pt-20 sm:pb-20 sm:pt-24 lg:pb-24 lg:pt-28"
    >
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-12 px-5 sm:grid-cols-3 sm:gap-8 sm:px-8">
        {values.map((value, i) => {
          const Icon = valueIcons[value.icon];
          return (
            <div
              key={value.title}
              className="reveal flex flex-col items-center text-center"
              style={{ "--i": i } as React.CSSProperties}
            >
              <Icon className="h-16 w-16 text-yellow sm:h-[72px] sm:w-[72px]" />
              <h3 className="mt-5 text-2xl font-bold leading-tight text-yellow sm:text-[28px]">
                {value.title}
              </h3>
              <p className="mt-3 max-w-[34ch] text-[15px] leading-relaxed text-white">
                {value.body}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
