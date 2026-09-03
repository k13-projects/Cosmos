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
 * THE RING. The blueprint draws six plates on a visible arc; this is now an
 * endless wheel, so the set repeats four times at 15 degrees (360 / 24) to
 * close the circle with no gap. 15 is the blueprint's own 14.1 rounded to a
 * step that divides 360, so the density on the visible arc is unchanged.
 *
 * WHAT IS ON SCREEN. A plate is left of the container's right edge only while
 * cos(angle) < -0.676, i.e. for angles 132.5 to 227.5 degrees. That is a 95
 * degree window, about 6.3 plates, which is what the blueprint draws. Two
 * consequences, and they hold at EVERY phase of the rotation rather than at the
 * poses we happened to test:
 *
 *   horizontally  no plate centre is ever further left than hub - R, which is
 *                 (right edge - 0.324 R). The About copy and the values band's
 *                 third column both live well left of that line.
 *   vertically    the envelope is hub_y +/- 0.737 R. A closed ring reaches
 *                 0.103 R deeper than the old 32-degree sweep did, so the hub
 *                 is raised to 61% of the band (was 67%) and R is trimmed, to
 *                 put the floor back where the values band's clear lane is.
 *
 * Measured clearances across a full revolution are in the handoff.
 * -------------------------------------------------------------------------- */

/** Hub distance beyond the container's right edge, in units of R. */
const HUB_OFFSET_RATIO = 0.676;
const FIRST_ANGLE_DEG = -148.8;
/** 360 / 24: four copies of the six-plate set close the ring. */
const SPOKE_STEP_DEG = -15;
const SPOKE_COUNT = 24;

/** Ambient turn: one plate-step every 7 seconds. */
const AMBIENT_DEG_PER_S = 15 / 7;
/** Extra degrees the wheel turns per pixel of scroll, on top of ambient. */
const SCROLL_DEG_PER_PX = 0.05;
/** e-folding time for a scroll or drag boost to fall back to the ambient speed. */
const BOOST_DECAY_S = 0.45;
const MAX_BOOST_DEG_PER_S = 150;
/** Exponential approach rate when a keyboard focus pulls a plate into view. */
const FOCUS_EASE_PER_S = 7;

/* --- the grab gesture ----------------------------------------------------- */

/** A press that stays inside this radius and this long is a click, not a drag. */
const CLICK_SLOP_PX = 6;
// No time limit on a click: a slow, deliberate press that does not move is still a click
// (James, 2026-09-02). Only distance separates a click from a drag.
/** Weight of the newest sample in the drag's smoothed angular velocity. */
const DRAG_VEL_SMOOTHING = 0.3;
/** A hand already at rest for this long before letting go throws nothing. */
const DRAG_STALE_MS = 80;

const angleFor = (i: number): number => FIRST_ANGLE_DEG + i * SPOKE_STEP_DEG;

/** The angle, in the visible window, that a focused plate is brought to. */
const VIEW_ANGLE_DEG = 180;

/**
 * The blueprint's plate wheel (facts SS4.2, Lessons 16), turning endlessly.
 *
 * Plates hang on a wheel whose hub sits off-screen right, the lowest spilling
 * over the seam into the values band. The wheel is already turning when the
 * visitor arrives and keeps turning after they stop: a slow ambient rotation
 * from one rAF loop, with scroll injecting velocity on top that eases back to
 * ambient. Each plate counter-rotates by the same amount so it stays upright.
 *
 * IT CAN ALSO BE GRABBED (Lessons 26). A press on a plate captures the pointer
 * and the wheel follows the hand 1:1, by the angle of the pointer round the
 * hub rather than by a scaled vertical delta: the hub is a real point on the
 * page, so the plate that was grabbed stays under the finger for the whole
 * gesture, which a scaled delta cannot promise. Letting go hands the measured
 * angular velocity back to the same boost that scroll uses, so the throw decays
 * into the ambient turn and the wheel never stops. A press that moves under
 * 6px is a click, however long it is held, and opens the menu pop-up as
 * before; anything else is a drag and the click is swallowed.
 *
 * Touch is deliberately left out of this: on the visible arc the drag is a
 * vertical gesture, which is also the page scroll, and a wheel that eats the
 * scroll on a touchscreen is a trap. `touch-action: pan-y` gives that gesture
 * to the browser, and a tap still opens the pop-up.
 *
 * It stops turning when there is nobody to see it (the band out of view, or the
 * tab hidden) and while a plate is hovered or focused, so its name can be read
 * off a still plate. Those two pauses are re-read from the DOM on every frame
 * (`:hover`, `:focus-visible`) rather than tracked from events, because an
 * event that never arrives leaves the wheel frozen for good (Lessons 25): that
 * is exactly what the browser's native image drag did to it.
 *
 * Under reduced motion the loop never starts and the ring is a static arc in
 * the blueprint's own pose. The grab still works there, because it is the
 * visitor's own hand and not motion, but it is thrown with no momentum.
 *
 * Hover or focus names the dish on an instant yellow pill. The plates are real
 * buttons rather than decoration because a focusable control that does nothing
 * is worse than no control: each opens the menu pop-up, which is where the
 * dishes are actually listed. Only the first six carry a name and a tab stop.
 * The other eighteen are the same six dishes again, so announcing them would
 * read the menu out four times; they stay clickable and hoverable and are
 * hidden from assistive tech. Tabbing to one of the six turns the wheel until
 * that plate is in view, because a focus ring on an off-screen plate is a
 * keyboard trap in everything but name.
 */
export default function PlateWheel({
  sectionRef,
}: {
  /** The element whose visibility gates the rotation (the About band). */
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const hubRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hub = hubRef.current;
    const section = sectionRef.current;
    if (!hub || !section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    const FOCUS_VISIBLE_OK =
      typeof CSS !== "undefined" && CSS.supports("selector(:focus-visible)");

    let frame = 0;
    let running = false;
    let rot = 0;
    let boost = 0;
    let lastFrameMs = 0;
    let lastScrollY = window.scrollY;
    let onScreen = true;
    let focusTarget: number | null = null;

    // The grab gesture.
    let pointerId: number | null = null;
    let grabbed: HTMLElement | null = null;
    let dragAngle = 0; // the pointer's angle round the hub at the last move
    let dragVel = 0; // smoothed, degrees per second
    let dragVelSeen = false;
    let dragMovedPx = 0;
    let dragStartX = 0;
    let dragStartY = 0;
    let dragStartMs = 0;
    let dragLastMs = 0;
    let dragged = false; // this press has passed the click threshold
    let suppressClick = false;
    /**
     * A drag ends with the grabbed plate still under the pointer, so the hover
     * pause would swallow the throw the moment the hand let go. Hover is
     * ignored until the hand moves again of its own accord. The same flag
     * covers a stale `:hover` left behind by a blur or a hidden tab.
     */
    let hoverBlocked = false;

    const write = (): void => {
      hub.style.setProperty("--wheel-rot", `${rot.toFixed(2)}deg`);
    };

    const matchesSafe = (el: Element, selector: string): boolean => {
      try {
        return el.matches(selector);
      } catch {
        return false;
      }
    };

    /** True while the pointer rests on a plate and has not just thrown the wheel. */
    const hoverPaused = (): boolean =>
      !hoverBlocked && hub.querySelector("[data-spoke]:hover") !== null;

    /** True while a plate inside the wheel holds a visible keyboard focus ring. */
    const focusPaused = (): boolean => {
      const el = document.activeElement;
      if (!(el instanceof Element) || !hub.contains(el)) return false;
      return FOCUS_VISIBLE_OK ? matchesSafe(el, ":focus-visible") : true;
    };

    const tick = (now: number): void => {
      const dt = lastFrameMs ? Math.min(0.05, (now - lastFrameMs) / 1000) : 0;
      lastFrameMs = now;

      if (focusTarget !== null) {
        const k = 1 - Math.exp(-FOCUS_EASE_PER_S * dt);
        rot += (focusTarget - rot) * k;
        if (Math.abs(focusTarget - rot) < 0.05) {
          rot = focusTarget;
          focusTarget = null;
        }
      } else {
        // A plate under the pointer or holding focus stands still so its name
        // can be read off it, and a plate under the hand is driven by the hand.
        // Both are read back from the DOM here rather than trusted from an
        // event that may never arrive (Lessons 25).
        if (pointerId === null && !hoverPaused() && !focusPaused()) {
          rot += (AMBIENT_DEG_PER_S + boost) * dt;
        }
        if (rot > 360 || rot < -360) rot %= 360;
      }
      boost *= Math.exp(-dt / BOOST_DECAY_S);

      write();
      frame = requestAnimationFrame(tick);
    };

    const start = (): void => {
      if (running || reduced.matches || !onScreen || document.hidden) return;
      running = true;
      lastFrameMs = 0;
      frame = requestAnimationFrame(tick);
    };

    const stop = (): void => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const onScroll = (): void => {
      const y = window.scrollY;
      const delta = y - lastScrollY;
      lastScrollY = y;
      if (!running || pointerId !== null) return;
      const next = boost + (delta * SCROLL_DEG_PER_PX) / BOOST_DECAY_S;
      boost = Math.max(-MAX_BOOST_DEG_PER_S, Math.min(MAX_BOOST_DEG_PER_S, next));
    };

    /** Spoke index of the plate a pointer or focus event landed on, or -1. */
    const spokeOf = (target: EventTarget | null): number => {
      if (!(target instanceof Element)) return -1;
      const button = target.closest<HTMLElement>("[data-spoke]");
      return button ? Number(button.dataset.spoke) : -1;
    };

    /* --- the grab gesture ------------------------------------------------- */

    /** The pointer's angle round the hub, in the spokes' own CSS convention. */
    const angleOf = (event: PointerEvent): number => {
      const box = hub.getBoundingClientRect(); // the hub is a 0x0 anchor
      return (Math.atan2(event.clientY - box.top, event.clientX - box.left) * 180) / Math.PI;
    };

    /** The short way round, so the +/-180 seam the plates sit on never jumps. */
    const shortest = (deg: number): number => {
      let d = deg % 360;
      if (d > 180) d -= 360;
      if (d < -180) d += 360;
      return d;
    };

    /** Tooltips are hidden while the wheel is being thrown; see globals.css. */
    const syncDragFlag = (): void => {
      if (dragged || hoverBlocked) hub.setAttribute("data-drag", "");
      else hub.removeAttribute("data-drag");
    };

    const onIdleMove = (): void => {
      hoverBlocked = false;
      syncDragFlag();
      window.removeEventListener("pointermove", onIdleMove);
    };

    /** Ignore hover until the hand moves again, so nothing can strand the wheel. */
    const suspendHover = (): void => {
      hoverBlocked = true;
      syncDragFlag();
      window.removeEventListener("pointermove", onIdleMove);
      window.addEventListener("pointermove", onIdleMove);
    };

    const endDrag = (event?: PointerEvent): void => {
      if (pointerId === null) return;
      if (event && event.pointerId !== pointerId) return;

      // A press that barely moved and was let go quickly is a click. Anything
      // else is a drag, and a drag must never open the menu pop-up.
      const isClick = !dragged && dragMovedPx <= CLICK_SLOP_PX;
      suppressClick = !isClick;

      if (grabbed && event) {
        try {
          grabbed.releasePointerCapture(event.pointerId);
        } catch {
          // Already released; the capture is gone either way.
        }
      }
      pointerId = null;
      grabbed = null;
      root.classList.remove("wheel-grabbing");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);

      const threw = dragged;
      dragged = false;
      if (threw) suspendHover();
      else syncDragFlag();

      // Hand the wheel back to the ambient loop at the speed it had. `boost` is
      // the amount ABOVE ambient and decays with the same e-fold the scroll
      // throw uses, so the wheel eases back to ambient and never stops. A hand
      // that had already come to rest throws nothing, and reduced motion never
      // throws at all.
      const stale = !event || event.timeStamp - dragLastMs > DRAG_STALE_MS;
      const released = reduced.matches || stale || !dragVelSeen ? 0 : dragVel;
      boost = reduced.matches
        ? 0
        : Math.max(
            -MAX_BOOST_DEG_PER_S,
            Math.min(MAX_BOOST_DEG_PER_S, released - AMBIENT_DEG_PER_S),
          );
      dragVel = 0;
      dragVelSeen = false;
      start();
    };

    const onPointerMove = (event: PointerEvent): void => {
      if (pointerId === null || event.pointerId !== pointerId) return;

      const angle = angleOf(event);
      const delta = shortest(angle - dragAngle);
      dragAngle = angle;
      rot += delta;
      if (rot > 360 || rot < -360) rot %= 360;

      const dt = (event.timeStamp - dragLastMs) / 1000;
      dragLastMs = event.timeStamp;
      if (dt > 0 && dt < 0.1) {
        const instant = delta / dt;
        dragVel = dragVelSeen ? dragVel + (instant - dragVel) * DRAG_VEL_SMOOTHING : instant;
        dragVelSeen = true;
      }

      dragMovedPx = Math.max(
        dragMovedPx,
        Math.hypot(event.clientX - dragStartX, event.clientY - dragStartY),
      );
      if (!dragged && dragMovedPx > CLICK_SLOP_PX) {
        dragged = true;
        syncDragFlag();
      }

      // The rAF loop is not running under reduced motion, and the wheel still
      // has to follow the hand there.
      write();
    };

    const onPointerUp = (event: PointerEvent): void => endDrag(event);
    const onPointerCancel = (event: PointerEvent): void => endDrag(event);

    const onPointerDown = (event: PointerEvent): void => {
      if (event.pointerType === "touch" || !event.isPrimary || event.button !== 0) return;
      const plate =
        event.target instanceof Element
          ? event.target.closest<HTMLElement>("[data-spoke]")
          : null;
      if (!plate) return;

      pointerId = event.pointerId;
      grabbed = plate;
      dragAngle = angleOf(event);
      dragVel = 0;
      dragVelSeen = false;
      dragMovedPx = 0;
      dragStartX = event.clientX;
      dragStartY = event.clientY;
      dragStartMs = event.timeStamp;
      dragLastMs = event.timeStamp;
      dragged = false;
      suppressClick = false;
      hoverBlocked = false;
      boost = 0; // a scroll throw does not survive being grabbed
      focusTarget = null;
      syncDragFlag();
      root.classList.add("wheel-grabbing");

      try {
        // Captured on the plate, not on the hub, so the click that follows a
        // press still targets the button and still opens the menu pop-up.
        plate.setPointerCapture(event.pointerId);
      } catch {
        // Capture is a nicety; the window-level up and cancel still end it.
      }
      window.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);
      window.addEventListener("pointercancel", onPointerCancel);
      // No preventDefault here: it would kill the focus and the click that a
      // plain press still owes the visitor. The native image drag is stopped in
      // the markup and in globals.css instead.
    };

    /**
     * The bug Kazim found (Lessons 24): the browser's own image drag took the
     * gesture, the ghost image followed the pointer, dropping it opened the
     * file, and `pointerout` never fired, so the hover-paused wheel stayed
     * frozen. Belt and braces on top of `draggable={false}`.
     */
    const onDragStart = (event: Event): void => {
      event.preventDefault();
      endDrag();
      suspendHover();
    };

    /** Swallows the click that ends a drag, before React's own handler sees it. */
    const onClickCapture = (event: MouseEvent): void => {
      if (!suppressClick) return;
      suppressClick = false;
      event.preventDefault();
      event.stopPropagation();
    };

    const onPointerLeave = (): void => {
      hoverBlocked = false;
      syncDragFlag();
    };

    const onWindowBlur = (): void => {
      endDrag();
      suspendHover();
    };

    /* --- keyboard ---------------------------------------------------------- */

    const onFocusIn = (event: Event): void => {
      const spoke = spokeOf(event.target);
      if (spoke < 0) return;
      // A plate focused by a mouse press is not a keyboard visit; pulling the
      // wheel round under the hand would fight the grab.
      if (pointerId !== null) return;
      if (
        FOCUS_VISIBLE_OK &&
        event.target instanceof Element &&
        !matchesSafe(event.target, ":focus-visible")
      ) {
        return;
      }
      // Turn the shortest way round until this plate sits in the visible window.
      const wanted = VIEW_ANGLE_DEG - angleFor(spoke);
      let target = wanted;
      while (target - rot > 180) target -= 360;
      while (target - rot < -180) target += 360;
      focusTarget = target;
      if (!running) write();
    };

    const onVisibility = (): void => {
      if (document.hidden) {
        endDrag();
        suspendHover();
        stop();
      } else {
        start();
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) start();
        else stop();
      },
      { rootMargin: "120px" },
    );

    const apply = (): void => {
      endDrag();
      stop();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      observer.disconnect();

      if (reduced.matches) {
        rot = 0;
        hub.style.setProperty("--wheel-rot", "0deg"); // static arc, blueprint pose
        return;
      }
      lastScrollY = window.scrollY;
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      observer.observe(section);
      start();
    };

    hub.addEventListener("pointerdown", onPointerDown);
    hub.addEventListener("pointerleave", onPointerLeave);
    hub.addEventListener("dragstart", onDragStart);
    hub.addEventListener("click", onClickCapture, true);
    hub.addEventListener("focusin", onFocusIn);
    window.addEventListener("blur", onWindowBlur);

    apply();
    reduced.addEventListener("change", apply);

    return () => {
      reduced.removeEventListener("change", apply);
      hub.removeEventListener("pointerdown", onPointerDown);
      hub.removeEventListener("pointerleave", onPointerLeave);
      hub.removeEventListener("dragstart", onDragStart);
      hub.removeEventListener("click", onClickCapture, true);
      hub.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("blur", onWindowBlur);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      window.removeEventListener("pointermove", onIdleMove);
      root.classList.remove("wheel-grabbing");
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(frame);
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
        className="wheel-hub absolute top-[61%] h-0 w-0"
        style={{ left: `calc(100% + var(--wheel-r) * ${HUB_OFFSET_RATIO})` }}
      >
        {Array.from({ length: SPOKE_COUNT }, (_, spoke) => {
          const plate = about.plates[spoke % about.plates.length];
          const isPrimary = spoke < about.plates.length;
          return (
            <div
              key={spoke}
              className="absolute left-0 top-0 h-0 w-0"
              style={{ transform: `rotate(${angleFor(spoke)}deg) translateX(var(--wheel-r))` }}
            >
              {/* Centres the plate on the spoke's tip. Its own element so every
                  node below carries exactly one transform. */}
              <div
                className="absolute left-0 top-0 -translate-x-1/2 -translate-y-1/2"
                style={{ width: "var(--plate-w)" }}
              >
                <Plate
                  plate={plate}
                  spoke={spoke}
                  index={spoke % about.plates.length}
                  primary={isPrimary}
                  placement="left"
                  // Undo the spoke's angle and the hub's live rotation, so the
                  // plate hangs upright at every position on the wheel, while
                  // it is being dragged as much as while it turns on its own.
                  style={{
                    transform: `rotate(calc(${-angleFor(spoke)}deg - var(--wheel-rot, 0deg)))`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * The three-plate row below 1024px. Same plates, no wheel: a six-plate arc
 * squeezed into a phone's right edge leaves the paragraphs about 28 characters
 * wide, and any overlap at all fails the fitcheck measure. No drag either: the
 * wheel it would turn is not on screen.
 *
 * The names are ALWAYS on here, never hover-revealed. This row only renders on
 * widths that are overwhelmingly touchscreens, and a touchscreen has no hover:
 * a tap fires `:focus` but not `:focus-visible`, and then the menu dialog takes
 * the focus anyway, so a hover/focus tooltip is invisible on the exact device
 * this row exists for. Unlabelled it is three anonymous photographs that happen
 * to be buttons. mt-16 rather than mt-10 is the headroom the name sits in.
 */
export function PlateRow() {
  return (
    <div className="pointer-events-none relative -mb-14 mt-16 flex items-end justify-center gap-1 px-4 sm:-mb-16 sm:gap-3 lg:hidden">
      {about.plates.slice(0, 3).map((plate, i) => (
        <div key={plate.src} className="w-1/3 max-w-[220px]">
          <Plate plate={plate} index={i} primary placement="above" />
        </div>
      ))}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

type PlateData = (typeof about.plates)[number];

interface PlateProps {
  plate: PlateData;
  /** Position on the ring, used by the wheel's hover, focus and drag handling. */
  spoke?: number;
  /** Index within the six-plate set, for the float animation's offset. */
  index: number;
  /**
   * False for the eighteen repeats of the set: same dish, still clickable and
   * hoverable, but out of the tab order and hidden from assistive tech so the
   * menu is not announced four times over.
   */
  primary: boolean;
  placement: "left" | "above";
  style?: React.CSSProperties;
}

/**
 * One plate: the cutout, and the tooltip naming it.
 *
 * The tooltip is CSS-only (group-hover / group-focus-visible) so it appears on
 * the same frame as the pointer, has no timer to cancel and cannot be stranded
 * open by a lost event. On the wheel it opens to the LEFT: the arc lives on the
 * right edge, so a right-hand tooltip would be off-screen.
 *
 * `draggable={false}` and `onDragStart` are not belt and braces, they are the
 * fix (Lessons 24): a photo inside a control is a drag source to the browser,
 * and its native drag hijacks the gesture, offers the file for download on
 * drop, and swallows the pointer events the wheel needs to un-pause itself.
 */
function Plate({ plate, spoke, index, primary, placement, style }: PlateProps) {
  const { openMenu } = useModals();
  const tipId = `${useId()}plate-tip`;
  const onWheel = placement === "left";

  return (
    <button
      type="button"
      onClick={openMenu}
      onDragStart={(event) => event.preventDefault()}
      data-spoke={spoke}
      tabIndex={primary ? undefined : -1}
      aria-hidden={primary ? undefined : true}
      // Only the wheel's pill is a tooltip. The row's pill is a permanently
      // visible label whose text is already in the button's accessible name, so
      // pointing at it here would make a screen reader say the dish twice.
      aria-describedby={onWheel && primary ? tipId : undefined}
      style={style}
      className={[
        "group plate-btn pointer-events-auto relative block w-full select-none",
        "rounded-[999px] focus-visible:outline-offset-8",
        onWheel
          ? // Grab to spin. `touch-pan-y` keeps the page's own vertical scroll
            // on a touchscreen, where the drag would be the same gesture.
            "cursor-grab touch-pan-y"
          : "touch-manipulation",
      ].join(" ")}
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
        draggable={false}
        // The ring's far side is clipped off the right edge, so a lazy plate
        // would never intersect anything and would pop in as it rotated round.
        // Eager, but explicitly low priority: twenty-four elements share six
        // URLs, and none of them should race the hero for the connection.
        loading="eager"
        fetchPriority="low"
        className="float h-auto w-full drop-shadow-[0_18px_30px_rgba(43,3,48,0.35)]"
        style={{ animationDelay: `${-(index * 0.65)}s` }}
      />

      <span
        id={tipId}
        role={onWheel ? "tooltip" : undefined}
        aria-hidden={onWheel && primary ? undefined : true}
        className={[
          "plate-tip pointer-events-none absolute z-10 rounded-[999px] bg-yellow px-3 py-1.5",
          "text-[13px] leading-tight text-purple shadow-[0_8px_20px_rgba(43,3,48,0.35)] sm:px-4 sm:py-2",
          onWheel
            ? // The wheel: hover or keyboard focus, on the same frame as the
              // pointer. Opens LEFT because the arc lives on the right edge.
              "right-[84%] top-1/2 -translate-y-1/2 whitespace-nowrap opacity-0 transition-opacity" +
              " duration-[80ms] group-hover:opacity-100 group-focus-visible:opacity-100 lg:text-[15px]"
            : // The touch row: always on. Centred over a ~112px plate on a
              // 375px screen, capped and allowed to wrap so the longest name
              // cannot push a pixel of the document past the viewport, which
              // would open a sideways scroll.
              "bottom-[96%] left-1/2 w-max max-w-[31vw] -translate-x-1/2 text-center opacity-100",
        ].join(" ")}
      >
        <span className="display block tracking-[0.02em]">{plate.name}</span>
      </span>
    </button>
  );
}
