"use client";

import Image from "next/image";
import { locations, telHref } from "@/lib/content";
import { OrderOnlineButton } from "./Buttons";
import RailArrow from "./RailArrow";
import { useRail } from "./useRail";

function mapsHref(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/* -------------------------------------------------------------------------- *
 * Rail density, measured off the blueprint render (page 1, 1332 CSS px wide)
 *
 *   card          443 x 289 px   = 33.3% of the viewport, aspect 1.533
 *   gap            43 px         =  3.2% of the viewpor
 *   first card    x 143          = 10.7% of the viewpor
 *   « arrow       x 33 to 100, y centred on the cards (card mid-height 751)
 *   at rest       two full cards and a third cut by the right edge
 *
 * The first build showed four narrow 360px cards, which is a different section
 * (Lessons 20). Everything below is in vw so the density is the blueprint's a
 * every width rather than the container's, and the third card still bleeds off
 * the edge the way the blueprint draws it.
 * -------------------------------------------------------------------------- */

/**
 * "LOCATIONS, Find us" (facts SS4.9). Cream cards on a horizontal scroll-snap
 * rail, at the blueprint's own card size and arrow placement.
 *
 * The rail is kept at every width rather than stacking on mobile: five cards
 * stacked is a tall column of near-identical blocks, and the snap row is
 * exactly what the blueprint draws. Each card is a plain element carrying two
 * real controls, Directions and Order, so nothing is nested inside a link.
 *
 * The arrows are one pair, placed twice. Below 1024 they sit in a row under the
 * rail, where they cover nothing; from 1024 the wrapper becomes `display:
 * contents` and each arrow lands in the blueprint's own lane, « at 2.4vw and »
 * mirrored, both at the cards' mid-height. Swiping and trackpad scrolling still
 * drive the rail directly at every width.
 */
export default function Locations() {
  const { ref, atStart, atEnd, scrollByCard } = useRail<HTMLUListElement>();

  return (
    <section id="locations" className="pattern scroll-mt-28 overflow-hidden py-16 sm:py-20 lg:scroll-mt-32 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <header className="reveal mb-10 lg:mb-12">
          <h2 className="display text-[13vw] text-yellow sm:text-6xl lg:text-[76px]">Locations</h2>
          <p className="mt-1 text-2xl font-semibold italic leading-none text-white sm:text-3xl">
            Find us
          </p>
        </header>
      </div>

      {/* The reveal belongs to the rail as a whole, never to the individual
          cards. A card that starts outside the horizontal scroller never
          intersects the viewport, so its `.reveal` never flips to `is-visible`:
          it stays opacity-0 forever while its Order and Directions controls
          remain in the tab order. That is the WCAG 2.4.7 bug class `inert`
          exists for, and here the honest fix is to reveal the rail as one uni
          when the section scrolls into view. */}
      <div className="reveal relative">
        <ul
          ref={ref}
          /* scroll-pl matches the padding. Without it, snap-start pulls the firs
             card flush to the port, resting the rail at scrollLeft == padding-lef
             and putting the card hard against the viewport edge. */
          className="rail flex snap-x snap-mandatory scroll-pl-5 gap-4 overflow-x-auto scroll-smooth px-5 pb-4 sm:scroll-pl-8 sm:px-8 lg:gap-[min(3.2vw,46px)] lg:scroll-pl-[10.7vw] lg:pl-[10.7vw] lg:pr-8"
        >
          {locations.map((l) => (
            <li
              key={l.id}
              className="flex w-[78vw] shrink-0 snap-start sm:w-[60vw] lg:w-[min(33.3vw,480px)] lg:min-h-[calc(min(33.3vw,480px)*289/443)]"
            >
              <div className="relative flex w-full flex-col overflow-hidden rounded-[40px] bg-cream p-7 lg:p-8">
                {/* Corner watermark, design_2026-09-02_v2.md row C ("detailed
                    trace"), Kazim's pick. `position:absolute` paints above
                    static in-flow content in the same stacking contex
                    regardless of DOM order, so the geometry below is wha
                    actually keeps it clear of every control and text line
                    (measured at 375, 640, 768, 1280, 1440), not z-order; the
                    inner wrapper right after this still carries `relative
                    z-10` as a second line of defence.
                    `bottom-[88px]` below `sm`: under 640px the rail's <li>s
                    stretch to the tallest card in the row, so a card can look
                    "short" against its own content even though the row is
                    tall, and the flush `bottom-4` corner (restored at `sm`
                    and up, where that stretch stops mattering) lands the
                    mark's box on the Directions link at 375. 88px clears the
                    controls row on every card with margin, without climbing
                    high enough to reach the text above it (safe window
                    measured at 80-100px).
                    `opacity-[var(--mark-opacity)]`: see the token's commen
                    in app/globals.css for the picked value. */}
                <Image
                  src={l.mark.src}
                  alt={l.mark.alt}
                  width={l.mark.width}
                  height={l.mark.height}
                  aria-hidden="true"
                  sizes="(min-width: 1024px) 18vw, (min-width: 640px) 32vw, 42vw"
                  /* Kazim, 2026-09-02: glued into the bottom-right corner, about two and a half
                     times the first size, and allowed to run into the card's rounded corner (the
                     card clips it). Text and controls sit above it in z-order. */
                  className="pointer-events-none absolute -bottom-[6%] -right-[6%] z-0 aspect-square h-auto w-[52%] object-contain object-right-bottom opacity-[var(--mark-opacity)]"
                />
                <div className="relative z-10 flex w-full flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-magenta-ink lg:text-sm">
                      {l.area}
                    </p>
                    {l.status && (
                      /* Not decoration: a guest who reads only the card would
                         otherwise drive to a hall that has not opened. */
                      <span className="shrink-0 rounded-full border-2 border-purple/30 px-2.5 py-1 text-[12px] font-bold uppercase leading-none tracking-[0.1em] text-purple">
                        {l.status}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-2 text-[22px] font-bold leading-tight text-purple lg:text-[29px]">
                    {l.name}
                    {l.status && <span className="sr-only"> ({l.status})</span>}
                  </h3>

                  <p className="mt-2 text-[15px] leading-snug text-purple/80 lg:text-[16px]">
                    {l.address}
                  </p>

                  {/* `lg:max-w-[76%]` only: hours is the one line long enough
                      to wrap (Oceanside's hours string does, at 1280 and
                      1440), and a wrapped line runs the full card width by
                      default, straight under the mark's corner. Below lg the
                      card is not aspect-locked (it grows with content), so the
                      default `bottom-[88px]` mark position above already
                      clears it and this is a no-op there. Address and the
                      phone link (already `w-fit`) never reach that far, so
                      they are left alone; constraining them too force-wraps a
                      short, already-one-line address for no reason. Shrinking
                      the mark instead of the text does not work either: even
                      at 10% width (illegibly small) Oceanside's hours string
                      still does not clear, a pre-existing gap between tha
                      hall's content and the card's fixed 1280/1440 height,
                      unrelated to the mark. See Risks in
                      docs/handoffs/engineering_2026-09-02_v6.md. */}
                  <p className="mt-2 flex items-center gap-2 text-[15px] font-semibold text-purple lg:max-w-[76%] lg:text-[16px]">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 lg:h-[18px] lg:w-[18px]"
                    >
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                      <path
                        d="M12 7v5.2l3.2 1.9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    {l.hours}
                  </p>

                  {l.phone && (
                    /* Only Oceanside carries one today; the other halls stay
                       unconfirmed rather than guessed (see the `phone` field's
                       comment in lib/content.ts). */
                    <a
                      href={telHref(l.phone)}
                      className="-ml-1 mt-1 inline-flex min-h-11 w-fit items-center gap-2 self-start rounded-lg px-1 text-[15px] font-semibold text-purple underline decoration-purple/30 underline-offset-4 transition hover:decoration-magenta"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7 2 2 0 0 1 6.5 3.5Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <span className="sr-only">Call {l.name}, </span>
                      {l.phone}
                    </a>
                  )}

                  {/* mt-auto pins the controls to the card's floor, so the five
                      cards line their buttons up even when one address wraps. */}
                  <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
                    <OrderOnlineButton
                      className="btn-sm"
                      variant="purple"
                      locationId={l.id}
                      label="Order"
                    />
                    <a
                      href={mapsHref(l.mapsQuery)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-11 items-center gap-1.5 px-1 text-sm font-bold uppercase tracking-[0.1em] text-magenta-ink underline decoration-magenta/40 underline-offset-4 transition hover:decoration-magenta"
                    >
                      Directions
                      <span className="sr-only"> to {l.name} (opens in a new tab)</span>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path
                          d="M5 12h14M13 6l6 6-6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {/* `lg:contents` dissolves this row so each arrow can position itself
            against the rail instead. One pair of controls, two placements.
            The -8px is half the rail's own pb-4: without it the arrows centre
            on the scroller, which sits 8px below the cards' own mid-height. */}
        <div className="mt-4 flex items-center justify-center gap-2 px-5 sm:px-8 lg:contents">
          <RailArrow
            direction="prev"
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
            label="Previous locations"
            className="lg:absolute lg:left-[2.4vw] lg:top-[calc(50%-8px)] lg:z-10 lg:-translate-y-1/2"
          />
          <RailArrow
            direction="next"
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
            label="Next locations"
            className="lg:absolute lg:right-[2.4vw] lg:top-[calc(50%-8px)] lg:z-10 lg:-translate-y-1/2"
          />
        </div>
      </div>
    </section>
  );
}
