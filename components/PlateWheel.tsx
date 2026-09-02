"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { about } from "@/lib/content";
import { useModals } from "./ModalProvider";

/* -------------------------------------------------------------------------- *
 * Geometry
 *
 * Measured off the blueprint render (Cosmos Assets/_derived/mockup, page 1 at
 * 1332 CSS px). Fitting a circle through the visible centres of plates 1, 3 and
 * 6 gives hub (1773, 1697) and radius 652, i.e.
 *
 *   hub sits  0.676 R  to the RIGHT of the viewport edge
 *   radius    R = 0.49 x viewport width
 *   plates    every 14.1 degrees, the first at -148.8 degrees
 *
 * Angles are CSS angles: 0 points right, positive turns clockwise, y grows
 * downward, which is the convention the fit was done in.
 *
 * The one hard constraint this buys: whatever the wheel's rotation, no plate
 * centre can ever sit further left than hub - R, which is
 * (right edge - 0.324 R). The About copy and the values band's third column
 * both live well left of that line, so the wheel provably cannot reach them.
 * Measured numbers at 1280 and 1440 are in the handoff.
 * -------------------------------------------------------------------------- */

/** Hub distance beyond the container's right edge, in units of R. */
const HUB_OFFSET_RATIO = 0.676;
const FIRST_ANGLE_DEG = -148.8;
const STEP_DEG = -14.1;
/**
 * Total turn across the band, and it runs UPWARD from the blueprint pose only.
 *
 * The direction is not a taste call. Six plates on this arc need about 6 plate
 * heights of vertical room; the About band plus the values band's top padding
 * is barely more than that. Turning the wheel the other way pushes the lowest
 * plate down into the value columns, which the blueprint does not do. Rotating
 * up from the still frame keeps rho = 0 as the deepest the arc ever reaches, so
 * "no plate ever touches Fresh always" is a geometric fact rather than a
 * measurement that holds at the widths we happened to test.
 */
const SWEEP_DEG = 32;

const angleFor = (i: number): number => FIRST_ANGLE_DEG + i * STEP_DEG;

/**
 * The blueprint's plate wheel (facts SS4.2, Lessons 16).
 *
 * Six plates hang on an arc down the right edge as if bolted to a wheel whose
 * hub is off-screen right, the lowest spilling over the seam into the values
 * band. Scrolling the About band turns the hub; each plate counter-rotates by
 * the same amount so it stays upright. Two transforms change per frame, written
 * from one rAF-throttled scroll handler, and nothing reflows.
 *
 * Hover or focus names the dish on an instant yellow pill. The plates are real
 * buttons rather than decoration because a focusable control that does nothing
 * is worse than no control: each opens the menu pop-up, which is where the
 * dishes are actually listed.
 */
export default function PlateWheel({
  sectionRef,
}: {
  /** The element whose scroll progress drives the rotation (the About band). */
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const hubRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hub = hubRef.current;
    const section = sectionRef.current;
    if (!hub || !section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let queued = false;

    const paint = (): void => {
      queued = false;
      const rect = section.getBoundingClientRect();
      const travel = rect.height + window.innerHeight;
      if (travel <= 0) return;
      // 0 as the band's top reaches the bottom of the viewport, 1 as its bottom
      // leaves the top. The band is read around progress 0.5, which puts the
      // arc mid-turn there and the blueprint's own pose on the way in.
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / travel));
      hub.style.setProperty("--wheel-rot", `${(progress * SWEEP_DEG).toFixed(2)}deg`);
    };

    const onScroll = (): void => {
      if (queued) return;
      queued = true;
      frame = requestAnimationFrame(paint);
    };

    const apply = (): void => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (reduced.matches) {
        hub.style.setProperty("--wheel-rot", "0deg"); // static arc, blueprint pose
        return;
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
      paint();
    };

    apply();
    reduced.addEventListener("change", apply);

    return () => {
      reduced.removeEventListener("change", apply);
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sectionRef]);

  return (
    // pointer-events-none so the band's copy stays selectable underneath; each
    // plate turns them back on for itself.
    // overflow-x-clip, not hidden: the hub sits off the right edge and would
    // otherwise widen the document, but the lowest plate must still spill
    // vertically over the seam into the values band, as the blueprint draws it.
    // `hidden` clips both axes; `clip` leaves the other one visible.
    <div className="plate-wheel pointer-events-none absolute inset-0 hidden overflow-x-clip overflow-y-visible lg:block">
      <div
        ref={hubRef}
        className="wheel-hub absolute top-[67%] h-0 w-0"
        style={{ left: `calc(100% + var(--wheel-r) * ${HUB_OFFSET_RATIO})` }}
      >
        {about.plates.map((plate, i) => (
          <div
            key={plate.src}
            className="absolute left-0 top-0 h-0 w-0"
            style={{ transform: `rotate(${angleFor(i)}deg) translateX(var(--wheel-r))` }}
          >
            {/* Centres the plate on the spoke's tip. Its own element so every
                node below carries exactly one transform. */}
            <div
              className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2"
              style={{ width: "var(--plate-w)" }}
            >
              <Plate
                plate={plate}
                index={i}
                placement="left"
                // Undo the spoke's angle and the hub's live rotation, so the
                // plate hangs upright at every position on the wheel.
                style={{ transform: `rotate(calc(${-angleFor(i)}deg - var(--wheel-rot, 0deg)))` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * The three-plate row below 1024px. Same plates, same tooltips, no wheel: a
 * six-plate arc squeezed into a phone's right edge leaves the paragraphs about
 * 28 characters wide, and any overlap at all fails the fitcheck measure.
 */
export function PlateRow() {
  return (
    <div className="pointer-events-none relative -mb-14 mt-10 flex items-end justify-center gap-1 px-4 sm:-mb-16 sm:gap-3 lg:hidden">
      {about.plates.slice(0, 3).map((plate, i) => (
        <div key={plate.src} className="w-1/3 max-w-[220px]">
          <Plate plate={plate} index={i} placement="above" />
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

type PlateData = (typeof about.plates)[number];

/**
 * One plate: the cutout, and the tooltip naming it.
 *
 * The tooltip is CSS-only (group-hover / group-focus-visible) so it appears on
 * the same frame as the pointer, has no timer to cancel and cannot be stranded
 * open by a lost event. On the wheel it opens to the LEFT: the arc lives on the
 * right edge, so a right-hand tooltip would be off-screen.
 */
function Plate({
  plate,
  index,
  placement,
  style,
}: {
  plate: PlateData;
  index: number;
  placement: "left" | "above";
  style?: React.CSSProperties;
}) {
  const { openMenu } = useModals();
  const tipId = `${useId()}plate-tip`;

  return (
    <button
      type="button"
      onClick={openMenu}
      aria-describedby={tipId}
      style={style}
      className="group pointer-events-auto relative block w-full rounded-[999px] focus-visible:outline-offset-8"
    >
      {/* The visible label is the tooltip, which is hover-only. The button still
          needs a name of its own, and it should say what pressing it does. */}
      <span className="sr-only">
        {plate.name}. {about.platesHint}
      </span>

      <Image
        src={plate.src}
        alt=""
        width={plate.width}
        height={plate.height}
        sizes="(max-width: 1023px) 33vw, 320px"
        className="float h-auto w-full drop-shadow-[0_18px_30px_rgba(43,3,48,0.35)]"
        style={{ animationDelay: `${-(index * 0.65)}s` }}
      />

      <span
        id={tipId}
        role="tooltip"
        className={[
          "plate-tip pointer-events-none absolute z-10 rounded-[999px] bg-yellow px-4 py-2",
          "text-[13px] leading-tight text-purple opacity-0 shadow-[0_8px_20px_rgba(43,3,48,0.35)]",
          "transition-opacity duration-[80ms] group-hover:opacity-100 group-focus-visible:opacity-100",
          placement === "left"
            ? "right-[84%] top-1/2 -translate-y-1/2 whitespace-nowrap lg:text-[15px]"
            : // Centred over a ~112px plate on a 375px screen. Capped and
              // allowed to wrap so the longest name cannot push a pixel of the
              // document past the viewport, which would open a sideways scroll.
              "bottom-[92%] left-1/2 w-max max-w-[30vw] -translate-x-1/2 text-center",
        ].join(" ")}
      >
        <span className="display block tracking-[0.02em]">{plate.name}</span>
      </span>
    </button>
  );
}
