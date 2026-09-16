"use client";

import { reviews, reviewsSection } from "@/lib/content";
import RailArrow from "./RailArrow";
import { useRail } from "./useRail";

function Stars() {
  return (
    <div className="flex gap-0.5" aria-label="5 out of 5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="17"
          height="17"
          viewBox="0 0 20 20"
          fill="var(--color-magenta)"
          aria-hidden="true"
        >
          <path d="M10 1.6l2.47 5.2 5.53.77-4 4.03.96 5.8L10 14.7l-4.96 2.7.96-5.8-4-4.03 5.53-.77z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * "REVIEWS" (facts SS4.11): the heading and its italic sub-line on the left, a
 * rail of tan cards on the right, exactly as the blueprint lays it out.
 *
 * Attribution is deliberately non-identifying, see the note in lib/content.ts.
 */
export default function Reviews() {
  const { ref, atStart, atEnd, scrollByCard } = useRail<HTMLUListElement>();

  return (
    <section aria-labelledby="reviews-heading" className="bg-cream py-16 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        {/* Column split measured off the blueprint (page 2, 1332 CSS px): the
            heading block runs to about 31.4% of the viewport, the first tan
            card starts at 50% of it, and the cards run off the right edge. The
            50% track reproduces that start at 1280, 1440 and 1920 alike, and
            the heading text is capped at the blueprint's own measure rather
            than filling the track. */}
        <div className="grid gap-8 lg:grid-cols-[minmax(0,50%)_minmax(0,1fr)] lg:gap-0">
          <header className="reveal self-center lg:max-w-[31.4vw]">
            <h2 id="reviews-heading" className="display text-[13vw] text-magenta sm:text-6xl">
              {reviewsSection.title}
            </h2>
            <p className="mt-4 text-lg font-medium italic leading-snug text-purple sm:text-xl">
              {reviewsSection.subtitle}
            </p>

          </header>

          {/* The rail and its two controls. `relative` is what the arrows
              position against at lg, and `rail-bleed-r` is on THIS box, not on
              the <ul> inside it, so the box itself reaches the viewport's edge
              and the right-hand arrow lands on the screen's edge rather than
              on the container's.

              `min-w-0` is load-bearing, not tidiness: a grid item's default
              `min-width: auto` refuses to shrink below its content, and the
              content here is a rail 1367px wide. The <ul> used to be the grid
              item itself and shrank because `overflow-x-auto` makes a scroll
              container; wrapping it handed that job to a plain div, which
              simply grew, and the whole page leaked 977px sideways at 390. */}
          <div className="relative min-w-0 rail-bleed-r">
          <ul
            ref={ref}
            /* scroll-pl matches the padding, or snap-start rests the rail at
               scrollLeft == padding-left and the first card loses its gutter. */
            /* `rail-bleed-r` (globals.css) carries the rail out through the
               container's own right margin to the VIEWPORT's edge, so the cut
               happens where the screen ends. It used to be `-mr-12`, which
               only cleared the 48px gutter: correct up to 1400px, and short by
               half the overflow on anything wider. */
            className="rail reveal -mx-5 flex snap-x snap-mandatory scroll-pl-5 gap-4 overflow-x-auto scroll-smooth px-5 pb-4 sm:-mx-8 sm:scroll-pl-8 sm:px-8 lg:mx-0 lg:scroll-pl-0 lg:px-0"
          >
            {/* Keyed on the quote, not the author: attributions are deliberately
                non-identifying and therefore repeat. */}
            {reviews.map((r) => (
              <li
                key={r.quote.slice(0, 40)}
                className="flex w-[82vw] shrink-0 snap-start flex-col rounded-[40px] bg-tan p-7 sm:w-[340px] lg:w-[min(30vw,430px)]"
              >
                <Stars />
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-purple">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
                <footer className="mt-5 border-t-2 border-purple/12 pt-4">
                  <p className="font-bold leading-tight text-purple">{r.author}</p>
                  <p className="text-sm text-purple/65">{r.source}</p>
                </footer>
              </li>
            ))}
          </ul>

            {/* One pair of controls, two placements, the same pattern the
                Locations rail uses. Below lg they sit in a row under the rail,
                where they cover nothing; from lg each one lands against the
                rail's own edge, over the cards, vertically centred (Kazim,
                2026-09-16: at the far left and far right of the reviews is
                more useful than under the REVIEWS heading). The -8px is half
                the rail's own pb-4, so they centre on the cards rather than on
                the scroller. The Previous arrow sits just OUTSIDE the rail
                (`-left-20`), in the cream the heading column leaves empty, so
                it never covers a quote; the Next one has no such room, since
                the rail now runs to the screen's edge, so it takes its disc
                and sits over the card it scrolls.

                They also lost `tone="purple"`, which drew bare magenta
                chevrons with no disc. That tone was right while they sat on
                the section's cream, under the heading; against a tan card it
                is a 1.9:1 fill that reads as a smudge on the quote rather than
                as a control. The default tone is the same purple disc the
                Locations rail already uses over its own cards. */}
            <div className="mt-4 flex items-center justify-center gap-2 lg:mt-0 lg:contents">
              <RailArrow
                direction="prev"
                onClick={() => scrollByCard(-1)}
                disabled={atStart}
                label="Previous reviews"
                className="lg:absolute lg:-left-20 lg:top-[calc(50%-8px)] lg:z-10 lg:-translate-y-1/2"
              />
              <RailArrow
                direction="next"
                onClick={() => scrollByCard(1)}
                disabled={atEnd}
                label="Next reviews"
                className="lg:absolute lg:right-5 lg:top-[calc(50%-8px)] lg:z-10 lg:-translate-y-1/2"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
