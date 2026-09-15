"use client";

import { useRef } from "react";
import { about } from "@/lib/content";
import PlateWheel from "./PlateWheel";

/**
 * "UNLEASH THE FLAVOR" (facts SS4.2).
 *
 * The blueprint hangs the six plates on an arc down the right edge, as if on a
 * wheel whose hub sits off-screen right, the lowest one spilling over the seam
 * into the values band. That is what components/PlateWheel.tsx draws, and the
 * band's scroll progress turns it. Below 1024px PlateWheel draws a second,
 * smaller wheel of its own (Lorena, client email 2026-09-10 SS5: the static
 * three-plate row it used to render there read as broken, not styled).
 *
 * The section is a client component only to hand its own element to the wheel;
 * every string still comes from lib/content.ts.
 */
export default function About() {
  const ref = useRef<HTMLElement>(null);

  return (
    <section
      id="about"
      ref={ref}
      // z-10 over the values band so the overhanging plate draws on top of it.
      // overflow stays visible for the same reason; the sideways spill is
      // clamped by overflow-x on <body>.
      // scroll-mt clears the fixed header, so a jump to #about can never park
      // the yellow headline under the yellow logo (Lessons 17).
      // pb-10 below `sm`, not the pb-16 the band carried before round 3: under
      // 1024px the plate wheel is a clipped belt at the very bottom of this
      // section, so this padding is no longer space under a paragraph, it is
      // dead purple between the arc and the values band. Measured at 390: the
      // clip line to the first values icon was 144px, of which this is 24.
      // Lorena asked in round 2 for the values band to sit higher up the page,
      // so closing it serves a standing ask rather than being taste.
      className="pattern pattern-soft relative z-10 scroll-mt-28 pb-10 pt-20 sm:pb-20 sm:pt-24 lg:scroll-mt-32 lg:pb-24 lg:pt-36"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* 2026-09-10 (Lorena's round 3, client email SS1): "make the text
            wider, there is a large gap between the text and the burger
            wheel." Widened from max-w-[640px]/62ch: 780px keeps the wheel's
            own re-tuned reach clear (components/PlateWheel.tsx,
            app/globals.css) while the measure grows toward, not past, the
            readable band's upper end. */}
        {/* lg:max-w-[740px] xl:max-w-[780px]: 1024 to 1279 is the wheel's own
            tightest window (components/PlateWheel.tsx re-solve note), so the
            column gives back 40px there; 1280 and up have room to spare
            (measured 200px+ clear at every rotation) and get the full width. */}
        <div className="max-w-[780px] lg:max-w-[740px] xl:max-w-[780px]">
          <h2 className="reveal display text-[13vw] text-yellow sm:text-6xl lg:text-[76px]">
            {about.headline}
          </h2>

          {/* max-w-[70ch]: still inside the readable 45 to 75 character band,
              up from 62ch so the column actually widens rather than just
              having more room to run into on a wide box. */}
          <div className="mt-7 max-w-[70ch] space-y-5 text-[16px] leading-relaxed text-white sm:text-[17px]">
            {about.body.map((p, i) => (
              <p
                key={p.slice(0, 24)}
                className="reveal"
                style={{ "--i": i + 1 } as React.CSSProperties}
              >
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>

      <PlateWheel sectionRef={ref} />
    </section>
  );
}
