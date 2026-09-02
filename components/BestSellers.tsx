"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { bestSellers } from "@/lib/content";

const HEADING = "Our best sellers";
const AUTO_ADVANCE_MS = 6000;

/**
 * The best-seller carousel (facts SS4.4), styled after the client's own
 * reference, le-smash.com: the item name as a giant two-word stack, first word
 * outlined and second solid, over the cutout on its plate, with arrows either
 * side.
 *
 * Built from scratch on scroll-free state rather than a carousel library: no
 * new dependency, and it lets the reduced-motion contract be exact rather than
 * approximate. Keyboard (left/right), swipe, dots and arrows all drive the same
 * index. Auto-advance runs only when the user has not asked for reduced motion,
 * and stops the moment a pointer or focus enters, or the tab goes to the
 * background, so it can never move under someone who is reading.
 */
export default function BestSellers() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [autoplay, setAutoplay] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const count = bestSellers.length;
  const go = useCallback((next: number) => setIndex(((next % count) + count) % count), [count]);

  // Autoplay is opt-out by motion preference, and re-checked if it changes.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setAutoplay(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!autoplay || paused) return;
    const t = window.setInterval(() => setIndex((i) => (i + 1) % count), AUTO_ADVANCE_MS);
    return () => window.clearInterval(t);
  }, [autoplay, paused, count]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    }
  };

  return (
    <section
      aria-labelledby="best-sellers-heading"
      // overflow-x-clip, not overflow-hidden: the seam tab is pulled half its
      // own height ABOVE this section on purpose, and overflow-hidden cropped
      // it flat. `clip` on one axis leaves the other visible; `hidden` cannot.
      className="relative overflow-x-clip bg-cream pb-16 pt-24 sm:pb-20 sm:pt-28 lg:pb-24"
    >
      {/* The seam tab, straddling the values band above and this one, as in the
          blueprint. Yellow on magenta is a display-size-only pairing (3.64:1),
          which this is, and it is a heading rather than a control. */}
      <h2
        id="best-sellers-heading"
        /* The mobile size is deliberately below the vw curve the other
           headlines follow. At 7vw the pill measured wider than a 375px
           viewport, so both its rounded ends were cut off and the seam tab read
           as a plain full-width magenta bar. */
        className="reveal display absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-[999px] bg-magenta px-5 py-3.5 text-[5.4vw] text-yellow shadow-[var(--shadow-soft)] sm:px-12 sm:py-5 sm:text-4xl lg:text-5xl"
      >
        {HEADING}
      </h2>

      <div
        role="group"
        aria-roledescription="carousel"
        aria-label="Cosmos best sellers"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          const start = touchStartX.current;
          touchStartX.current = null;
          if (start === null) return;
          const dx = e.changedTouches[0].clientX - start;
          if (Math.abs(dx) > 45) go(index + (dx < 0 ? 1 : -1));
        }}
        className="reveal mx-auto max-w-[1100px] rounded-[40px] px-4 sm:px-8"
      >
        <div className="relative mx-auto flex items-center gap-1 sm:gap-4">
          <CarouselArrow direction="prev" onClick={() => go(index - 1)} />

          {/* Slides are stacked, so the band's height never jumps between a
              tall burger and a wide bowl of fries. */}
          <div className="relative min-w-0 flex-1">
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/11]">
              {bestSellers.map((item, i) => {
                const active = i === index;
                return (
                  <div
                    key={item.id}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${count}, ${item.words.join(" ")}`}
                    aria-hidden={!active}
                    inert={!active}
                    className={[
                      "absolute inset-0 flex flex-col items-center justify-start transition-opacity",
                      active ? "opacity-100" : "pointer-events-none opacity-0",
                    ].join(" ")}
                    /* The outgoing slide leaves faster than the incoming one
                       arrives. With one shared duration the two names overlap at
                       half opacity in the middle of the cross-fade and the band
                       reads, briefly, as two burgers with two names. */
                    style={{
                      transitionTimingFunction: "var(--ease-brand)",
                      transitionDuration: active ? "480ms" : "180ms",
                    }}
                  >
                    <p className="display text-center text-[13vw] leading-[0.86] sm:text-[9vw] lg:text-[104px]">
                      <span className="block text-outline">{item.words[0]}</span>
                      <span className="block text-purple">{item.words[1]}</span>
                    </p>
                    <div className="relative -mt-[2%] min-h-0 w-full flex-1">
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 1100px) 90vw, 900px"
                        className="object-contain object-bottom"
                        priority={i === 0}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <CarouselArrow direction="next" onClick={() => go(index + 1)} />
        </div>

        <div className="mt-6 flex items-center justify-center gap-1">
          {bestSellers.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show ${item.words.join(" ")}`}
              aria-current={i === index}
              className="flex h-11 w-8 items-center justify-center"
            >
              <span
                className={[
                  "block h-2.5 rounded-full transition-all duration-300",
                  i === index ? "w-7 bg-magenta" : "w-2.5 bg-purple/25",
                ].join(" ")}
              />
            </button>
          ))}
        </div>

        {/* Announces the change for a screen reader without moving focus. */}
        <p aria-live="polite" className="sr-only">
          {bestSellers[index].words.join(" ")}, {index + 1} of {count}
        </p>
      </div>
    </section>
  );
}

function CarouselArrow({
  direction,
  onClick,
}: {
  direction: "prev" | "next";
  onClick: () => void;
}) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isPrev ? "Previous best seller" : "Next best seller"}
      className="flex h-12 w-10 shrink-0 items-center justify-center text-magenta transition-transform hover:scale-110 sm:h-14 sm:w-14"
    >
      {/* Chevron pair, as the blueprint draws it. Magenta rather than the
          blueprint's yellow: this band's ground is cream, and yellow on cream
          is the one pairing the token sheet rules out at any size. */}
      <svg
        width="34"
        height="34"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={isPrev ? "" : "rotate-180"}
      >
        <path
          d="M13 5.5 6.5 12l6.5 6.5M19 5.5 12.5 12l6.5 6.5"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
