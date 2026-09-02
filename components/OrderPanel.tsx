"use client";

import { useEffect, useRef } from "react";
import {
  ORDER_CHANNEL_ORDER,
  orderChannels,
  orderPopup,
  orderRows,
  type Location,
  type OrderChannel,
} from "@/lib/content";

/**
 * Per-location ordering.
 *
 * Five rows share one brand but each hall has its own storefront, so a single
 * global "order" link would send a guest standing in Little Italy to Carlsbad.
 * This lists every row and renders only the channels actually wired for it. A
 * row with nothing connected says so plainly rather than showing a control that
 * goes nowhere.
 *
 * To connect one, fill its `ordering` block in lib/content.ts. Nothing here
 * changes.
 */

function liveChannels(l: Location): OrderChannel[] {
  return ORDER_CHANNEL_ORDER.filter((c) => Boolean(l.ordering[c]));
}

/**
 * No third-party logo files were supplied for this build and we do not reuse
 * another project's licensed marks, so a channel reads as a brand text chip.
 */
function ChannelLink({ channel, url }: { channel: OrderChannel; url: string }) {
  const meta = orderChannels[channel];
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex min-h-11 flex-1 basis-[9rem] items-center justify-center gap-2 rounded-[14px] border-2 border-purple/15 bg-white px-3 py-2 text-purple transition hover:-translate-y-0.5 hover:border-magenta hover:shadow-[var(--shadow-soft)]"
    >
      <span className="text-left leading-tight">
        <span className="block text-sm font-bold tracking-tight">{meta.provider}</span>
        <span className="block text-xs uppercase tracking-wide text-magenta-ink">{meta.label}</span>
      </span>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0 opacity-55"
      >
        <path
          d="M7 17 17 7M17 7H9m8 0v8"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

function LocationRow({ location, highlight }: { location: Location; highlight: boolean }) {
  const live = liveChannels(location);
  const ref = useRef<HTMLLIElement>(null);

  useEffect(() => {
    if (!highlight) return;
    // The pop-up opens at its top; scroll the asked-for row into view inside it.
    ref.current?.scrollIntoView({ block: "nearest" });
  }, [highlight]);

  return (
    <li
      ref={ref}
      className={[
        "rounded-[18px] border-2 p-4 transition-colors",
        highlight ? "border-magenta bg-white" : "border-purple/12 bg-white/60",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-magenta-ink">
            {location.area}
          </p>
          <h3 className="mt-0.5 text-lg font-semibold leading-tight text-purple">{location.name}</h3>
        </div>
        {location.status && (
          <span className="shrink-0 rounded-full border-2 border-purple/25 px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.14em] text-purple/70">
            {location.status}
          </span>
        )}
      </div>

      {location.status ? (
        <p className="mt-2 text-sm text-purple/70">{orderPopup.comingSoon}</p>
      ) : live.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {live.map((c) => (
            <ChannelLink key={c} channel={c} url={location.ordering[c] as string} />
          ))}
        </div>
      ) : (
        <p className="mt-2 text-sm text-purple/70">{orderPopup.empty}</p>
      )}
    </li>
  );
}

export default function OrderPanel({ focusLocation }: { focusLocation?: string }) {
  const anyLive = orderRows.some((l) => liveChannels(l).length > 0);

  return (
    <div className="space-y-4">
      <ul className="space-y-3">
        {orderRows.map((l) => (
          <LocationRow key={l.id} location={l} highlight={l.id === focusLocation} />
        ))}
      </ul>

      {!anyLive && <p className="text-center text-sm text-purple/70">{orderPopup.emptyAll}</p>}
    </div>
  );
}
