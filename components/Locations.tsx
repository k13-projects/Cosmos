"use client";

import { locations } from "@/lib/content";
import { OrderOnlineButton } from "./Buttons";
import RailArrow from "./RailArrow";
import { useRail } from "./useRail";

function mapsHref(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

/**
 * "LOCATIONS, Find us" (facts SS4.9). Four cream cards on a horizontal
 * scroll-snap rail with the blueprint's own arrows.
 *
 * The rail is kept at every width rather than stacking on mobile: four cards
 * stacked is a 2,400px column of near-identical blocks, and the snap row is
 * exactly what the blueprint draws. Each card is a plain element carrying two
 * real controls, Directions and Order, so nothing is nested inside a link.
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
          exists for, and here the honest fix is to reveal the rail as one unit
          when the section scrolls into view. */}
      <div className="reveal relative">
        <ul
          ref={ref}
          /* scroll-pl matches the padding. Without it, snap-start pulls the first
             card flush to the port, resting the rail at scrollLeft == padding-left
             and putting the card hard against the viewport edge. */
          className="rail flex snap-x snap-mandatory scroll-pl-5 gap-4 overflow-x-auto scroll-smooth px-5 pb-4 sm:scroll-pl-8 sm:px-8 lg:scroll-pl-12 lg:px-12"
        >
          {locations.map((l) => (
            <li key={l.id} className="flex w-[80vw] shrink-0 snap-start sm:w-[360px]">
              <div className="flex w-full flex-col rounded-[40px] bg-cream p-7">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-magenta-ink">
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

                <h3 className="mt-2 text-[22px] font-bold leading-tight text-purple">
                  {l.name}
                  {l.status && <span className="sr-only"> ({l.status})</span>}
                </h3>

                <p className="mt-3 text-[15px] leading-snug text-purple/80">{l.address}</p>

                <p className="mt-3 flex items-center gap-2 text-[15px] font-semibold text-purple">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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

                <div className="mt-6 flex flex-wrap items-center gap-3">
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
            </li>
          ))}
        </ul>

        <div className="mx-auto mt-4 flex max-w-[1400px] items-center gap-2 px-5 sm:px-8 lg:px-12">
          <RailArrow
            direction="prev"
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
            label="Previous locations"
          />
          <RailArrow
            direction="next"
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
            label="Next locations"
          />
        </div>
      </div>
    </section>
  );
}
