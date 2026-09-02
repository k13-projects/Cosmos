import Image from "next/image";
import { about } from "@/lib/content";

/**
 * "UNLEASH THE FLAVOR" (facts SS4.2).
 *
 * The blueprint runs a cascade of six floating burger plates down the right
 * edge of this band, spilling over the seam into the magenta values band below.
 * That is the piece flagged as hardest to make responsive in the design
 * handoff, and it is solved by splitting it rather than scaling it:
 *
 *   lg and up  the six-plate cascade, absolutely positioned down the right
 *              edge, the last two overhanging into the values band. The copy
 *              column is capped well short of it, so they never meet.
 *   below lg   three plates as a row under the copy, still floating and still
 *              breaking the seam. A cascade squeezed into a phone's right edge
 *              would leave the paragraphs about 28 characters wide, which is
 *              unreadable, and any overlap at all fails the fitcheck measure.
 */
export default function About() {
  return (
    <section
      id="about"
      // z-10 over the values band so the overhanging plates draw on top of it.
      // overflow stays visible for the same reason; the sideways spill is
      // clamped by overflow-x on <body>.
      className="pattern pattern-soft relative z-10 pb-16 pt-16 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-28"
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

      {/* --- the cascade, lg and up ------------------------------------- */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[36%] max-w-[520px] lg:block"
      >
        {about.plates.map((plate, i) => (
          <div
            key={plate.src}
            className="absolute w-[62%]"
            style={{
              // Evenly spaced down the band; the last two run past 100% so they
              // break the seam into the values band, as the blueprint does.
              top: `${4 + i * 19}%`,
              right: i % 2 === 0 ? "6%" : "26%",
            }}
          >
            <Image
              src={plate.src}
              alt=""
              width={plate.width}
              height={plate.height}
              sizes="320px"
              className="float h-auto w-full drop-shadow-[0_18px_30px_rgba(43,3,48,0.35)]"
              style={{ animationDelay: `${-(i * 0.65)}s` }}
            />
          </div>
        ))}
      </div>

      {/* --- three plates, below lg -------------------------------------- */}
      <div
        aria-hidden="true"
        className="pointer-events-none relative -mb-14 mt-10 flex items-end justify-center gap-1 px-4 sm:-mb-16 sm:gap-3 lg:hidden"
      >
        {about.plates.slice(0, 3).map((plate, i) => (
          <Image
            key={plate.src}
            src={plate.src}
            alt=""
            width={plate.width}
            height={plate.height}
            sizes="(max-width: 640px) 33vw, 220px"
            className="float h-auto w-1/3 max-w-[220px] drop-shadow-[0_14px_24px_rgba(43,3,48,0.35)]"
            style={{ animationDelay: `${-(i * 0.65)}s` }}
          />
        ))}
      </div>
    </section>
  );
}
