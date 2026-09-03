"use client";

import Image from "next/image";
import { motion, useReducedMotion, type TargetAndTransition, type Transition } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { bestSellers } from "@/lib/content";

const HEADING = "Our best sellers";
const AUTO_ADVANCE_MS = 6000;

/* ---------------------------------------------------------------------------
 * The plate flight (Kazim's brief, 2026-09-02)
 *
 * "come from the left, move to the center, and when clicked again go out from
 *  the right ... make it shake a little, but not super swiftly ... stopping,
 *  going back a little, and then staying in the middle and slowly stopping."
 *
 * A single framer spring cannot do both halves of that. The overshoot of a
 * spring is a fixed fraction of its travel: to arrive from -60% of the stage
 * and only overshoot ~5%, the damping ratio has to be ~0.62, and at 0.62 the
 * second swing is 0.4% of the stage (sub-pixel) — one bounce, no "shake". Drop
 * the damping to get three visible swings and the first overshoot grows to
 * 25-40% of the stage, which reads as snappy and cartoonish.
 *
 * So the travel and the wobble are decoupled: one damped cosine whose amplitude
 * envelope changes gear the moment it first crosses the centre. Big, fast,
 * decelerating arrival; then a small wobble that decays on its own, gentler
 * clock. Sampled at 60 Hz and handed to motion as a linear keyframe track, so
 * the curve that ships is exactly the curve described here.
 * ------------------------------------------------------------------------- */

/** Where the plate starts / ends its flight, in % of the stage width. */
const TRAVEL = 60;
/** Seconds for the first half-cycle: -60% of the stage to the first peak. */
const ARRIVE = 0.34;
/** How far past centre the first swing carries, in % of the stage width. */
const OVERSHOOT = 5;
/** Seconds per half-period of the settle wobble. */
const HALF = 0.145;
/** Amplitude left after each half-period of the wobble (peak ratio). */
const DECAY = 0.42;
/** Total length of the entry, seconds. */
const ENTER_MS = 1050;
/** The outgoing plate's flight, seconds. */
const EXIT_MS = 450;
/**
 * How long the incoming plate waits before it starts. Kazim asked for a
 * handoff, not a swap: "go out from the right and THEN from the left the next
 * one comes in". A tenth of a second is enough for the eye to read the order
 * and still far too short to feel like a gap.
 */
const ENTER_DELAY = 0.1;
/** Reduced motion: a plain cross-fade, no travel, no wobble. */
const FADE_MS = 250;
/**
 * Minimum gap between two committed slide changes. Long enough that the
 * outgoing plate is gone (EXIT_MS) before another one is asked to leave, so at
 * most two plates are ever in flight; short enough that a second click lands
 * while the first plate is still wobbling and feels answered. Anything clicked
 * inside the window is queued, not dropped.
 */
const LOCK_MS = 480;

type Dir = 1 | -1;

/** The 60 Hz keyframe track for one entry, mirrored by `dir`. */
function flightTrack(dir: Dir) {
  const k1 = Math.log(TRAVEL / OVERSHOOT); // arrival envelope, 2.485
  const tau = -HALF / Math.log(DECAY); // wobble envelope, 0.167 s
  const total = ENTER_MS / 1000;
  const frames = Math.round(total * 60);
  const x: string[] = [];
  const times: number[] = [];
  for (let n = 0; n <= frames; n += 1) {
    const t = (n / frames) * total;
    const arriving = t <= ARRIVE;
    const amp = arriving
      ? TRAVEL * Math.exp(-k1 * (t / ARRIVE))
      : OVERSHOOT * Math.exp(-(t - ARRIVE) / tau);
    const phase = arriving
      ? Math.PI * (t / ARRIVE)
      : Math.PI * (1 + (t - ARRIVE) / HALF);
    x.push(`${(-dir * amp * Math.cos(phase)).toFixed(3)}%`);
    times.push(n / frames);
  }
  x[x.length - 1] = "0%"; // land dead centre, never on a rounding remainder
  return { x, times };
}

/**
 * The best-seller carousel (facts SS4.4), styled after the client's own
 * reference, le-smash.com: the item name as a giant two-word stack, first word
 * outlined and second solid, over the cutout on its plate, with arrows either
 * side.
 *
 * All five slides stay mounted (rather than an AnimatePresence pair) for two
 * reasons: every plate image is decoded before it is ever asked to fly, so a
 * plate never arrives as an empty box, and the accessibility contract stays
 * exactly what it was — five `slide` groups, only the current one exposed.
 * Each slide reads its own role from the index: current plays the flight, the
 * one just left plays the exit, the rest sit off-stage at zero opacity.
 * Keyboard (left/right), swipe, dots and arrows all drive the same queue.
 * Auto-advance runs only when the user has not asked for reduced motion, and
 * stops the moment a pointer or focus enters, or the tab goes to the
 * background, so it can never move under someone who is reading.
 */
export default function BestSellers() {
  const reduced = useReducedMotion() ?? false;
  const [state, setState] = useState<{ i: number; prev: number | null; dir: Dir }>({
    i: 0,
    prev: null,
    dir: 1,
  });
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  const count = bestSellers.length;
  const autoplay = !reduced;

  // Queue of steps the visitor has asked for but that have not been committed
  // yet, plus the lock that meters them out. Clicking five times in a second
  // always lands on the fifth slide; it just gets there in two hops instead of
  // five, so plates never stack up.
  const pending = useRef(0);
  const locked = useRef(false);
  const timer = useRef<number | null>(null);

  const flush = useCallback(() => {
    if (locked.current || pending.current === 0) return;
    const delta = pending.current;
    pending.current = 0;
    locked.current = true;
    setState((s) => ({
      i: ((s.i + delta) % count + count) % count,
      prev: s.i,
      dir: delta > 0 ? 1 : -1,
    }));
    timer.current = window.setTimeout(
      () => {
        locked.current = false;
        flush();
      },
      reduced ? FADE_MS + 10 : LOCK_MS,
    );
  }, [count, reduced]);

  const step = useCallback(
    (delta: number) => {
      if (delta === 0) return;
      pending.current += delta;
      flush();
    },
    [flush],
  );

  // Dots address a slide, not a direction: take the short way round the ring so
  // slide 5 -> slide 1 travels forwards, the way the eye expects.
  const goTo = useCallback(
    (target: number) => {
      const current = (((state.i + pending.current) % count) + count) % count;
      let delta = target - current;
      if (delta > count / 2) delta -= count;
      if (delta < -count / 2) delta += count;
      step(delta);
    },
    [state.i, count, step],
  );

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  useEffect(() => {
    if (!autoplay || paused) return;
    const t = window.setInterval(() => step(1), AUTO_ADVANCE_MS);
    return () => window.clearInterval(t);
  }, [autoplay, paused, step]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      step(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      step(-1);
    }
  };

  const track = useMemo(() => ({ next: flightTrack(1), prev: flightTrack(-1) }), []);

  return (
    <section
      aria-labelledby="best-sellers-heading"
      // overflow-x-clip, not overflow-hidden: the seam tab is pulled half its
      // own height ABOVE this section on purpose, and overflow-hidden cropped
      // it flat. `clip` on one axis leaves the other visible; `hidden` cannot.
      // It is also what catches the plates on their way in and out: they are
      // clipped at the section edge, never inside the stage.
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
          if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
        }}
        className="reveal mx-auto max-w-[1100px] rounded-[40px] px-4 sm:px-8"
      >
        <div className="relative mx-auto flex items-center gap-1 sm:gap-4">
          <CarouselArrow direction="prev" onClick={() => step(-1)} />

          {/* Slides are stacked, so the band's height never jumps between a
              tall burger and a wide bowl of fries, and nothing reflows while a
              plate is mid-flight: the stage is sized by aspect ratio alone. */}
          <div className="relative min-w-0 flex-1">
            <div className="relative aspect-[4/3] w-full sm:aspect-[16/11]">
              {bestSellers.map((item, i) => {
                const active = i === state.i;
                const leaving = i === state.prev && i !== state.i;
                const inFlight = active || leaving;

                let plateAnim: TargetAndTransition;
                let plateTrans: Transition;
                let nameAnim: TargetAndTransition;
                let nameTrans: Transition;
                // Opacity is a plain CSS transition, NOT a motion value. Measured
                // on the shipped build: motion hands a lone opacity tween to the
                // browser's own animation engine, and cancelling that at the end
                // paints exactly one frame at the element's base value before the
                // final value lands. The leaving plate flashed back to 100% at
                // 362 ms, the arriving plate blinked to 0% at 346 ms, the arriving
                // name at 771 ms. Transform never does it (the keyframe track
                // keeps it on motion's own clock), so x and y stay with motion and
                // opacity goes to CSS, where the computed value is the target and
                // there is nothing to cancel.
                let opacity = 0;
                let opacityTransition = "none";
                let nameOpacityTransition = "none";

                if (reduced) {
                  // No travel, no wobble: a 0.25 s cross-fade and nothing else.
                  plateAnim = { x: "0%" };
                  plateTrans = { duration: 0 };
                  nameAnim = { y: 0 };
                  nameTrans = { duration: 0 };
                  opacity = active ? 1 : 0;
                  opacityTransition = inFlight ? `opacity ${FADE_MS}ms linear` : "none";
                  nameOpacityTransition = opacityTransition;
                } else if (active) {
                  const t = state.dir === 1 ? track.next : track.prev;
                  // A keyframe array sets its own first frame, so the plate is
                  // placed off-stage and flown in, whatever it was doing before.
                  plateAnim = { x: state.prev === null ? "0%" : t.x };
                  plateTrans =
                    state.prev === null
                      ? { duration: 0 }
                      : {
                          duration: ENTER_MS / 1000,
                          delay: ENTER_DELAY,
                          times: t.times,
                          ease: "linear",
                        };
                  // The name does not travel with the plate: it rises and fades
                  // in on the spot, landing just as the plate's wobble drops
                  // under a couple of pixels.
                  nameAnim = { y: state.prev === null ? 0 : [18, 0] };
                  nameTrans =
                    state.prev === null
                      ? { duration: 0 }
                      : { duration: 0.55, delay: ENTER_DELAY + 0.12, ease: [0.22, 1, 0.36, 1] };
                  opacity = 1;
                  // Set even on the very first render, when nothing is moving
                  // yet. A CSS transition only fires on a value CHANGE, and the
                  // server already renders this slide at opacity 1, so there is
                  // nothing to animate on mount. Leaving it at "none" until the
                  // first click meant the outgoing plate of that first change
                  // had no transition declared in the before-change style and
                  // snapped to invisible instead of fading: measured, the very
                  // first NEXT after a page load cut rather than crossed.
                  opacityTransition = `opacity 240ms linear ${ENTER_DELAY * 1000}ms`;
                  nameOpacityTransition = `opacity 460ms var(--ease-brand) ${
                    ENTER_DELAY * 1000 + 160
                  }ms`;
                } else if (leaving) {
                  plateAnim = { x: `${state.dir * TRAVEL}%` };
                  // Accelerating away, the mirror of the arrival: it leaves the
                  // centre gently and is gone before it clears the arrow.
                  plateTrans = { duration: EXIT_MS / 1000, ease: [0.42, 0, 1, 1] };
                  nameAnim = { y: -12 };
                  nameTrans = { duration: 0.26, ease: [0.42, 0, 1, 1] };
                  opacity = 0;
                  // Held visible for 0.36 s, by which point the plate is a third
                  // of the way to the stage edge: long enough to read as leaving
                  // to the right, short enough never to reach the arrow. The name
                  // goes faster, because the two names sit on the same spot and
                  // the old one has to be gone before the new one arrives.
                  opacityTransition = "opacity 360ms linear";
                  nameOpacityTransition = "opacity 200ms linear";
                } else {
                  // Parked. Reset instantly; it is already invisible.
                  plateAnim = { x: "0%" };
                  plateTrans = { duration: 0 };
                  nameAnim = { y: 0 };
                  nameTrans = { duration: 0 };
                }

                return (
                  <div
                    key={item.id}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${i + 1} of ${count}, ${item.words.join(" ")}`}
                    aria-hidden={!active}
                    inert={!active}
                    className={[
                      "absolute inset-0 flex flex-col items-center justify-start",
                      active ? "" : "pointer-events-none",
                    ].join(" ")}
                  >
                    <motion.p
                      className="carousel-xfade display text-center text-[13vw] leading-[0.86] sm:text-[9vw] lg:text-[104px]"
                      initial={false}
                      animate={nameAnim}
                      transition={nameTrans}
                      style={{
                        opacity,
                        transition: nameOpacityTransition,
                        willChange: inFlight ? "transform, opacity" : "auto",
                      }}
                    >
                      <span className="block text-outline">{item.words[0]}</span>
                      <span className="block text-purple">{item.words[1]}</span>
                    </motion.p>
                    <motion.div
                      className="carousel-xfade relative -mt-[2%] min-h-0 w-full flex-1"
                      initial={false}
                      animate={plateAnim}
                      transition={plateTrans}
                      style={{
                        opacity,
                        transition: opacityTransition,
                        willChange: inFlight ? "transform, opacity" : "auto",
                      }}
                      data-plate={item.id}
                    >
                      <Image
                        src={item.src}
                        alt={item.alt}
                        fill
                        sizes="(max-width: 1100px) 90vw, 900px"
                        className="object-contain object-bottom"
                        draggable={false}
                        priority={i === 0}
                      />
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>

          <CarouselArrow direction="next" onClick={() => step(1)} />
        </div>

        <div className="mt-6 flex items-center justify-center gap-1">
          {bestSellers.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${item.words.join(" ")}`}
              aria-current={i === state.i}
              className="flex h-11 w-8 items-center justify-center"
            >
              <span
                className={[
                  "block h-2.5 rounded-full transition-all duration-300",
                  i === state.i ? "w-7 bg-magenta" : "w-2.5 bg-purple/25",
                ].join(" ")}
              />
            </button>
          ))}
        </div>

        {/* Announces the change for a screen reader without moving focus. */}
        <p aria-live="polite" className="sr-only">
          {bestSellers[state.i].words.join(" ")}, {state.i + 1} of {count}
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
      // z-10: the plate flies over this arrow on its way out, and the arrow has
      // to stay clickable the whole time.
      className="relative z-10 flex h-12 w-10 shrink-0 items-center justify-center text-magenta transition-transform hover:scale-110 sm:h-14 sm:w-14"
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
