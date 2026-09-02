"use client";

import { useRef } from "react";
import { about } from "@/lib/content";
import PlateWheel, { PlateRow } from "./PlateWheel";

/**
 * "UNLEASH THE FLAVOR" (facts SS4.2).
 *
 * The blueprint hangs the six plates on an arc down the right edge, as if on a
 * wheel whose hub sits off-screen right, the lowest one spilling over the seam
 * into the values band. That is what components/PlateWheel.tsx draws, and the
 * band's scroll progress turns it. Below 1024px it becomes the three-plate row.
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
      className="pattern pattern-soft relative z-10 scroll-mt-28 pb-16 pt-20 sm:pb-20 sm:pt-24 lg:scroll-mt-32 lg:pb-24 lg:pt-36"
    >
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="max-w-[640px]">
          <h2 className="reveal display text-[13vw] text-yellow sm:text-6xl lg:text-[76px]">
            {about.headline}
          </h2>

          {/* max-w-[62ch] keeps the measure in the readable 45 to 75 character
              band; the full column runs past 80 at 1280. */}
          <div className="mt-7 max-w-[62ch] space-y-5 text-[16px] leading-relaxed text-white sm:text-[17px]">
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
      <PlateRow />
    </section>
  );
}
