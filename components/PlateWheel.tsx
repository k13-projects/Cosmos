"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { about } from "@/lib/content";
import { scrollPageTo } from "@/lib/scroller";
import { useModals } from "./ModalProvider";

/* -------------------------------------------------------------------------- *
 * Geometry
 *
 * Measured off the blueprint render (Cosmos Assets/_derived/mockup, page 1 at
 * 1332 CSS px). Fitting a circle through the visible centres of plates 1, 3 and
 * 6 gives hub (1773, 1697) and radius 652, i.e.
 *
 *   hub sits  0.72 R  to the RIGHT of the viewport edge (lg+, see below)
 *   radius    R = up to 0.49 x viewport width
 *   plates    every 14.1 degrees, the first at -148.8 degrees
 *
 * Angles are CSS angles: 0 points right, positive turns clockwise, y grows
 * downward, which is the convention the fit was done in.
 *
 * THE RING (desktop, lg+). The blueprint draws six plates on a visible arc;
 * this is now an endless wheel, so the set repeats four times at 15 degrees
 * (360 / 24) to close the circle with no gap. 15 is the blueprint's own 14.1
 * rounded to a step that divides 360, so the density on the visible arc is
 * unchanged. The ring's own phase (FIRST_ANGLE_DEG) never has to change for a
 * different hub position: because all 24 spokes are laid out around the full
 * circle, which portion is "in view" is decided entirely by where the hub
 * sits and how big R is, not by which index is spoke 0.
 *
 * THE RING (mobile, below 1024px) IS A DIFFERENT LAYOUT, NOT A SCALED COPY.
 * Round 3 put the same 24-spoke, four-times-repeated set on the mobile belt
 * and just shrank it (too crowded); round 4 cut it to six spokes, one copy
 * each, spaced 60 degrees apart (too sparse: 1 to 2 plates visible at a
 * time). Round 5 (2026-09-15, Kazim's own read of round 4: "reduce the gap
 * to a third, or a half... more burgers visible, but not overlapping and
 * not too close either") lands in between: MOBILE_SPOKE_COUNT is now 12,
 * two copies of the six dishes, 30 degrees apart (360 / 12) rather than
 * three copies at 20 degrees. Going all the way to three copies was tried
 * and measured (see the handoff) and lands the same plates closer together
 * than the "not too close" half of the brief wants once the six dishes
 * still have to fit the ring with no gap (the geometry forces repeats: 30
 * degrees needs 12 spokes to close the circle, 20 degrees needs 18). Same
 * full-circle spacing logic as round 4 and as the desktop ring: repeats,
 * not just the visible arc, or the wheel runs out of plates as it turns.
 * The repeats are what made round 3 crowded, so this round does not just
 * halve the angle and leave the plate size alone: `--wheel-r` and
 * `--plate-w` (app/globals.css) both move so twelve plates clear each
 * other by measurement, not by assumption; see the render below for how
 * many are visible at once now.
 *
 * ROUND 5, SECOND PASS (same day, James's own read + measurement). The
 * first pass bought its clearance mostly by shrinking `--plate-w` (a ~35%
 * cut), which reads as small floating props, not food; the lever it left
 * unused was `--wheel-r`, since the arc distance between neighbours at a
 * fixed angle grows with R just as much as it shrinks with plate size.
 * Plate size restored to within ~8% of round 4, R raised substantially
 * instead (app/globals.css has the numbers), re-measured until the real
 * minimum edge-to-edge gap landed between 16 and 24px, not the 9 to 11px
 * the first pass measured. The reel caption also moved: Kazim asked for
 * the name UNDER the burgers, and a solid yellow pill this prominent reads
 * as the nav's own ORDER ONLINE button, not a name (James). It is still
 * one fixed label with the same update mechanism, just below the belt now
 * instead of above it, and styled as plain text rather than a button.
 *
 * TWO HUBS, ONE COMPONENT, TWO SPOKE SETS. `--wheel-r`, `--plate-w`,
 * `--hub-top` and `--hub-left` (app/globals.css, on `.plate-wheel` /
 * `.wheel-hub`) carry two values each: the lg+ ("desktop") ring described
 * above, and a second, smaller one under 1024px. The mobile hub sits
 * centred, at the BOTTOM of its own belt (`top: 100%`, `left: 50%`) rather
 * than off the right edge, so the ring's TOP arc is what pokes into view,
 * like the rim of a wheel mostly buried below the fold. Both spoke sets are
 * always in the DOM (render below), toggled by a plain CSS media query
 * (`hidden lg:contents` / `contents lg:hidden`) rather than a JS viewport
 * check, so server and first client render are byte-identical: no
 * hydration mismatch to chase (Lesson 30's dev/prod gap is exactly the kind
 * of thing a JS-side breakpoint branch invites). Both sets share the ONE
 * hub element, so the rAF loop, the drag gesture and the pause/resume logic
 * below are written once and drive whichever set is visible; nothing in
 * this file (the rAF loop, the drag gesture, focus handling) knows or cares
 * which hub is live except where noted: every measurement is read back from
 * the DOM (`hub.getBoundingClientRect()`, `data-angle`), so the same code
 * drives both. The two places breakpoint genuinely matters in JS are
 * `desktopMQ` below: which way is "into view" for a keyboard-focused plate,
 * and whether touch should be allowed to grab the wheel (see both usages).
 *
 * WHY THE MOBILE BELT IS `overflow-hidden`, NOT `overflow-visible` LIKE
 * DESKTOP'S SPILL. Because the mobile hub is centred and the wheel keeps
 * turning, EVERY spoke eventually swings through the far side of the circle,
 * well below the belt, which is exactly where the About paragraph and the
 * Values band's text live. Desktop can spill (Lessons 16) because its hub
 * sits far enough off-screen that the text-bearing side of the ring is the
 * only side ever in play. The mobile belt instead hard-clips vertically, so
 * "never collide with the About copy or the values band's text" holds by
 * construction: the lower three quarters of the circle is not a spill risk
 * to manage, it is simply never drawn where anyone can see it.
 *
 * DESKTOP RE-SOLVE, corrected by Kazim 2026-09-15 (round 3). Lorena's round 3
 * also reversed round 2's left-shifted Values grid back to centred (her
 * instruction wins, Values.tsx), which reopened the plate/text collision
 * Lessons 14 and 16 exist to prevent, this time with far less horizontal
 * room to give at 1024px (a centred 780px grid leaves under 130px of
 * viewport to its right there). R and the plate size both came down from
 * round 2's peak (0.47vw/660 and 0.23vw/300) and the hub offset ratio grew
 * from 0.676 to 0.72, so less of the ring is ever left of the viewport edge
 * at any size; Values.tsx's own lg:pt clear lane grew back alongside it, so
 * the vertical margin makes up the rest of what horizontal room can no
 * longer give at the narrow end. Measured clearances across a full
 * revolution at 1024/1280/1440/1920 are in the handoff.
 * -------------------------------------------------------------------------- */

const FIRST_ANGLE_DEG = -148.8;
/** 360 / 24: four copies of the six-plate set close the ring. */
const SPOKE_STEP_DEG = -15;
const SPOKE_COUNT = 24;

/** Mobile ring (below 1024px): two copies of the six dishes (Kazim, round 5:
 * "reduce the gap to a third, or a half" from round 4's single copy). */
const MOBILE_SPOKE_COUNT = 12;
/** 360 / 12: spaced around the FULL circle, not the visible arc, so the ring
 * never runs out of plates as it turns (see the geometry note above). */
const MOBILE_SPOKE_STEP_DEG = -30;
/** -90 (straight up, toward the belt's open top) so the wheel's rest pose
 * (reduced motion, first paint) shows one dish centred with the rest
 * evenly flanking it, rather than a seam sitting dead centre. Also the
 * angle the reel caption below reads "current" from: whichever spoke sits
 * closest to -90 is the one poking furthest into view. */
const MOBILE_FIRST_ANGLE_DEG = -90;

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
const mobileAngleFor = (i: number): number => MOBILE_FIRST_ANGLE_DEG + i * MOBILE_SPOKE_STEP_DEG;


/**
 * lg+ (1024px) is where the desktop, off-screen-right hub takes over from the
 * mobile, hub-below-the-belt one (app/globals.css `.plate-wheel`). The two
 * places in this file that have to know which ring is live both read this.
 */
const DESKTOP_QUERY = "(min-width: 1024px)";

/**
 * The angle, in the visible window, that a focused plate is brought to: 180
 * degrees (pointing left, toward the viewport) for the desktop ring, whose
 * hub sits off to the right; -90 degrees (pointing up, toward the belt's
 * open top) for the mobile ring, whose hub sits below it.
 */
const viewAngleDeg = (desktop: MediaQueryList): number => (desktop.matches ? 180 : -90);
/**
 * How much clear room a keyboard-focused plate needs above and below the hub
 * before the band is scrolled to it. A plate is about 190px wide and roughly
 * half that tall, so this leaves the whole ring and its focus ring inside the
 * viewport rather than flush against an edge.
 */
const FOCUS_EDGE_MARGIN_PX = 140;
/**
 * How long to wait after a keyboard focus before correcting the page's scroll.
 * Long enough for the browser's own scroll-into-view (and Lenis's easing of it)
 * to have landed, so the correction is measured against where the page actually
 * ended up rather than where it was on the way there.
 */
const FOCUS_SCROLL_SETTLE_MS = 500;

/**
 * The blueprint's plate wheel (facts SS4.2, Lessons 16), turning endlessly.
 * One component, two rings (see the geometry note near the top of this
 * file): lg+ hangs plates off a hub past the right edge, the lowest one
 * spilling over the seam into the values band; below 1024px a second, smaller
 * ring hangs off a hub below its own clipped belt, so a curved rim of plates
 * pokes up into view instead (Lorena, client email 2026-09-10 SS5, replacing
 * the static three-plate row that used to render there). Either way the wheel
 * is already turning when the visitor arrives and keeps turning after they
 * stop: a slow ambient rotation from one rAF loop, with scroll injecting
 * velocity on top that eases back to ambient. Each plate counter-rotates by
 * the same amount so it stays upright.
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
 * Touch is deliberately left out of the DESKTOP ring only: on its visible arc
 * the drag is a vertical gesture, which is also the page scroll, and a wheel
 * that eats the scroll on a touchscreen is a trap. The mobile ring's arc runs
 * along the top of its belt, so its drag is mostly horizontal and does not
 * fight that same scroll, and touch drives it (see `desktopMQ` above). Either
 * way `touch-action: pan-y` gives the vertical gesture to the browser, and a
 * tap still opens the pop-up.
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
 * dishes are actually listed. Only the first six of each ring's spokes carry a
 * name and a tab stop (desktop: spokes 0 to 5 of 24; mobile: 0 to 5 of 12).
 * The repeats are the same six dishes again, so announcing them would read
 * the menu out several times over; they stay clickable and hoverable and are
 * hidden from assistive tech. Tabbing to one of the six turns the wheel until
 * that plate is in view, because a focus ring on an off-screen plate is a
 * keyboard trap in everything but name.
 *
 * MOBILE ALSO GETS A READ-AT-A-GLANCE CAPTION (Kazim, round 5: "on desktop
 * the name appears when the mouse is over a plate, and on mobile we skip
 * that part entirely"). A touchscreen has no hover, so the per-plate pill
 * above only ever shows for a keyboard or screen-reader visit; a visitor
 * scrolling with a thumb never saw a name at all. Round 3/4 tried naming
 * every visible plate at once and it collided and got sliced by the belt's
 * own clip edge no matter how few captions were on screen (Lessons 32/33):
 * an always-on label's position is exactly as moving as the plate it's
 * pinned to. This round's fix keeps that lesson rather than re-fighting it:
 * ONE caption, in a fixed spot below the belt (Kazim's own words, "under
 * the burgers"), outside its clip entirely, naming whichever dish currently
 * sits closest to the top of the arc (the one most fully in view). It
 * updates as the wheel turns, so it reads like a reel with the current dish
 * named, and because it never moves it can never collide with anything or
 * be cut mid-word. It is plain text, not a pill: an early build used the
 * same yellow-pill-on-purple shape as the site's own buttons (the nav's
 * ORDER ONLINE), which reads as a control, not a name (James's read,
 * caught before ship). It is `aria-hidden`: a screen-reader visitor already
 * gets every dish's real name off the button itself on focus, and an
 * automatically-changing live region would narrate the ambient rotation
 * forever, which is not a name, it's noise.
 */
export default function PlateWheel({
  sectionRef,
}: {
  /** The element whose visibility gates the rotation (the About band). */
  sectionRef: React.RefObject<HTMLElement | null>;
}) {
  const hubRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const hub = hubRef.current;
    const section = sectionRef.current;
    const captionEl = captionRef.current;
    if (!hub || !section) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const desktopMQ = window.matchMedia(DESKTOP_QUERY);
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
    let focusScrollTimer = 0;

    // The grab gesture.
    let pointerId: number | null = null;
    let grabbed: HTMLElement | null = null;
    let dragAngle = 0; // the pointer's angle round the hub at the last move
    let dragVel = 0; // smoothed, degrees per second
    let dragVelSeen = false;
    let dragMovedPx = 0;
    let dragStartX = 0;
    let dragStartY = 0;
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
      updateCaption(rot);
      updateTags(rot);
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

    /**
     * The mobile reel caption (see the doc comment above the component): finds
     * whichever of the twelve mobile spokes currently sits closest to the
     * mobile ring's own view angle (-90, straight up, `viewAngleDeg` with the
     * desktop query not matching) and writes that dish's name into the fixed
     * caption element, but only on an actual change, so this is a no-op every
     * other frame. Desktop never calls this (the caption element does not
     * exist there; `captionEl` is null and this returns immediately).
     */
    let lastCaptionIdx = -1;
    const updateCaption = (rotation: number): void => {
      if (!captionEl) return;
      const target = viewAngleDeg(desktopMQ);
      let best = 0;
      let bestDist = Infinity;
      for (let i = 0; i < MOBILE_SPOKE_COUNT; i++) {
        const dist = Math.abs(shortest(mobileAngleFor(i) + rotation - target));
        if (dist < bestDist) {
          bestDist = dist;
          best = i;
        }
      }
      const idx = best % about.plates.length;
      if (idx === lastCaptionIdx) return;
      lastCaptionIdx = idx;
      captionEl.textContent = about.plates[idx].name;
    };

    /**
     * The mobile name tags (Kazim, 2026-09-16: a tag stuck right under the
     * plate, yellow, rounded, purple type).
     *
     * Every plate carrying one all the time is what round 3 shipped and had to
     * take back: the belt clips vertically while the ring never stops turning,
     * so a tag on a low plate is sliced mid-word by the clip edge, and the
     * plates crowding the arc's ends stack their tags into each other. Both
     * failures happen at the ARC'S ENDS, and neither happens near the top,
     * where the plates are widest apart on screen and nothing is near the clip.
     *
     * So the tag is not a property of the plate, it is a property of where the
     * plate currently IS: fully on screen it wears one, half cut by an edge it
     * does not, and it fades as the wheel carries it in and out. `updateTags`
     * below is that test.
     */
    // The mobile ring only. Both rings live under the same hub and the hidden
    // one's spokes still answer a query, so tagging every `[data-spoke]` would
    // set the attribute on twenty four elements that render nothing.
    const plateEls = Array.from(
      hub.querySelectorAll<HTMLElement>('[data-ring="mobile"] [data-spoke]'),
    );
    const tagged = new Set<HTMLElement>();
    let lastTagRot = Number.NaN;
    /**
     * A plate wears its tag when the plate is FULLY on screen, and not before.
     *
     * The first rule tried was an angular window round the top of the arc, and
     * it was the wrong question: how much of a plate you can see depends on the
     * viewport's width, not on its angle, so a window tuned at 390 tagged a
     * half-cut plate at 430 and skipped a whole one at 375. Asking the geometry
     * directly costs twelve rect reads, throttled to every two degrees of turn,
     * and it is right at every width by construction.
     *
     * Both edges matter and they fail differently. Horizontally the viewport
     * cuts the plate, so its tag would be cut with it, which is the sliced
     * "EN", "E" that round 3 shipped and had to take back. Vertically the belt
     * clips, and the tag hangs BELOW its plate, so the plate can be entirely
     * visible while its tag is not: hence the tag's own height in the test,
     * not the plate's bottom.
     */
    const updateTags = (rotation: number): void => {
      if (desktopMQ.matches) return; // mobile only: desktop names on hover
      if (Math.abs(rotation - lastTagRot) < 2) return;
      lastTagRot = rotation;
      const belt = hub.parentElement;
      if (!belt) return;
      const beltBottom = belt.getBoundingClientRect().bottom;
      for (const el of plateEls) {
        const r = el.getBoundingClientRect();
        const tag = el.querySelector<HTMLElement>(".plate-tip");
        const tagRoom = (tag?.offsetHeight ?? 34) + 6;
        const show =
          r.left >= 2 &&
          r.right <= window.innerWidth - 2 &&
          r.bottom + tagRoom <= beltBottom;
        if (show === tagged.has(el)) continue;
        if (show) {
          el.setAttribute("data-tag", "");
          tagged.add(el);
        } else {
          el.removeAttribute("data-tag");
          tagged.delete(el);
        }
      }
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

    /**
     * Ignore hover until the hand moves again, so nothing can strand the wheel.
     *
     * `onIdleMove` above is the ONLY thing allowed to lift this, because a real
     * `pointermove` is the only proof the hand moved. It used to be lifted by
     * `pointerleave` on the hub as well, and that was wrong in the one case it
     * mattered: during a throw the plates slide out from under a motionless
     * pointer, which fires `pointerleave` on the hub with no hand movement at
     * all. The suspension lifted, the next plate arrived under the same still
     * pointer, and the hover pause swallowed the throw. Measured at the QA gate,
     * 1440x900, a 250px throw released with the hand held still: 2.62 seconds of
     * dead standstill, and it stayed stopped until the hand moved. Intermittent,
     * because it depends on a plate leaving the pointer before the next arrives,
     * which is why it never showed at 1280.
     *
     * Leaving this flag set can never freeze the wheel (it only suppresses the
     * pause), so there is no Lessons 25 hazard in having one fewer way to clear
     * it. The hazard is all on the other side.
     */
    const suspendHover = (): void => {
      hoverBlocked = true;
      syncDragFlag();
      window.removeEventListener("pointermove", onIdleMove);
      window.addEventListener("pointermove", onIdleMove);
    };

    const endDrag = (event?: PointerEvent): void => {
      if (pointerId === null) return;
      if (event && event.pointerId !== pointerId) return;
      const touchRelease = event?.pointerType === "touch" || event?.pointerType === "pen";

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
      // `suspendHover` is waiting for a real `pointermove` to prove the hand
      // moved, and a finger never provides one: it lifts and nothing moves
      // again. So on touch the suspension is released here, at the release
      // itself, which is the only moment a touchscreen can offer (Kazim,
      // 2026-09-16; Lessons 25, a pause whose only exit may never arrive).
      // There is nothing to suspend on touch anyway, since hover does not
      // exist there, and the desktop path is untouched.
      if (threw && !touchRelease) suspendHover();
      else {
        hoverBlocked = false;
        syncDragFlag();
      }

      // Hand the wheel back to the ambient loop at the speed it had. `boost` is
      // the amount ABOVE ambient and decays with the same e-fold the scroll
      // throw uses, so the wheel eases back to ambient and never stops.
      //
      // A hand that had already come to rest, and reduced motion, have no throw
      // to give. That is NOT the same as throwing zero: carrying a released
      // speed of zero means subtracting ambient here, which sets the wheel's
      // speed to exactly nothing at the moment of release and then creeps it
      // back up over about a second and a half. Measured at the QA gate: five
      // frames, 42.5ms, of dead standstill after a slow drag, and 0.00 deg/s
      // still at +50ms. The wheel is never allowed to stand still (Lessons 25,
      // 26), so a throwless release hands it straight back to the ambient turn.
      const stale = !event || event.timeStamp - dragLastMs > DRAG_STALE_MS;
      const noThrow = reduced.matches || stale || !dragVelSeen;
      boost = noThrow
        ? 0
        : Math.max(
            -MAX_BOOST_DEG_PER_S,
            Math.min(MAX_BOOST_DEG_PER_S, dragVel - AMBIENT_DEG_PER_S),
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
      // has to follow the hand there. Same for the reel caption: tick() would
      // normally keep it in sync, but tick() never runs under reduced motion.
      write();
      updateCaption(rot);
      updateTags(rot);
    };

    const onPointerUp = (event: PointerEvent): void => endDrag(event);
    const onPointerCancel = (event: PointerEvent): void => endDrag(event);

    const onPointerDown = (event: PointerEvent): void => {
      // The desktop ring's drag is a mostly-vertical gesture along its right-
      // edge arc, the same direction as the page scroll, so touch is left to
      // the browser there (touch-pan-y still ships the drag-to-spin CSS, it
      // just never receives a touch pointerdown). The mobile ring's arc runs
      // along the top of its belt, so a drag there is mostly horizontal and
      // does not fight the page's vertical scroll; touch is allowed.
      if ((event.pointerType === "touch" && desktopMQ.matches) || !event.isPrimary || event.button !== 0)
        return;
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

    const onWindowBlur = (): void => {
      endDrag();
      suspendHover();
    };

    /* --- keyboard ---------------------------------------------------------- */

    /**
     * Bring the hub within the viewport, which is where a focused plate comes to
     * rest (viewAngleDeg() points a focused plate straight at the hub's own
     * level: left of it on the desktop ring, above it on the mobile one).
     *
     * Through `scrollPageTo`, never natively: Lenis owns this page's scroll, and
     * a native call made while Lenis has an animation in flight settles between
     * the two rather than winning. See lib/scroller.ts.
     */
    const centreHub = (): void => {
      if (pointerId !== null) return; // a hand is on the wheel; leave the page alone
      const hubTop = hub.getBoundingClientRect().top;
      if (hubTop < FOCUS_EDGE_MARGIN_PX || hubTop > window.innerHeight - FOCUS_EDGE_MARGIN_PX) {
        scrollPageTo(window.scrollY + hubTop - window.innerHeight / 2);
      }
    };


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
      // The button's own data-angle, not angleFor(spoke): the desktop and
      // mobile spoke sets use different angle formulas for the same index
      // (24 spokes at 15deg vs 6 at 60deg), so the angle has to be read off
      // whichever button was actually focused, not recomputed from a single
      // ring's own constants.
      const btn =
        event.target instanceof Element ? event.target.closest<HTMLElement>("[data-spoke]") : null;
      const angle = btn?.dataset.angle !== undefined ? Number(btn.dataset.angle) : angleFor(spoke);
      // Turn the shortest way round until this plate sits in the visible window.
      const wanted = viewAngleDeg(desktopMQ) - angle;
      let target = wanted;
      while (target - rot > 180) target -= 360;
      while (target - rot < -180) target += 360;
      focusTarget = target;
      if (!running) write();

      // And put the band where that plate is GOING, which the browser gets
      // wrong on its own. Chrome scrolls a newly focused element into view by
      // the smallest amount that reveals it WHERE IT IS, and the wheel is about
      // to move that plate to the hub's own level, up to a full diameter away.
      // The two disagree and the focus ring lands off screen. Measured at the
      // QA gate, 1280x900, a visitor already looking at the About band tabbing
      // forward into the wheel: the ring settled at top 916 in a 900px
      // viewport, three runs out of three, and stayed there.
      //
      // The correction cannot be made here. Chrome's scroll runs AFTER focusin
      // (measured: hub at 403 when this fires, at 967 half a second later), so
      // a check now reads a page that is about to move and correctly decides to
      // do nothing. It has to run once that scroll has landed.
      window.clearTimeout(focusScrollTimer);
      focusScrollTimer = window.setTimeout(centreHub, FOCUS_SCROLL_SETTLE_MS);
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
        updateCaption(rot);
        updateTags(rot);
        return;
      }
      lastScrollY = window.scrollY;
      window.addEventListener("scroll", onScroll, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      observer.observe(section);
      updateCaption(rot); // first paint, before tick()'s own first frame lands
      updateTags(rot);
      start();
    };

    hub.addEventListener("pointerdown", onPointerDown);
    hub.addEventListener("dragstart", onDragStart);
    hub.addEventListener("click", onClickCapture, true);
    hub.addEventListener("focusin", onFocusIn);
    window.addEventListener("blur", onWindowBlur);

    apply();
    reduced.addEventListener("change", apply);

    return () => {
      reduced.removeEventListener("change", apply);
      hub.removeEventListener("pointerdown", onPointerDown);
      hub.removeEventListener("dragstart", onDragStart);
      hub.removeEventListener("click", onClickCapture, true);
      hub.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("blur", onWindowBlur);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerCancel);
      window.removeEventListener("pointermove", onIdleMove);
      window.clearTimeout(focusScrollTimer);
      root.classList.remove("wheel-grabbing");
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      cancelAnimationFrame(frame);
    };
  }, [sectionRef]);

  return (
    <>
      {/* pointer-events-none so the band's copy stays selectable underneath;
          each plate turns them back on for itself.

          Mobile (<1024): a normal-flow, fixed-height, fully clipped belt (see
          the geometry note above for why clipped, not a spill). `mt-14`:
          round 4's own spacing from the About copy, unchanged; the reel
          caption below is a new sibling AFTER this div, not a change to what
          sits above it. `h-[440px]`: round 5's own re-solve (James's read,
          same day): the plate size Kazim's first cut sacrificed was restored
          near round 4's own size, and the radius grew instead (the geometry
          note above), which needs more vertical room to keep the same
          visible arc than the old 280px belt could give the bigger circle.
          `overflow-clip`, not `overflow-hidden`: round 4's own keyboard test
          found that focusing an off-screen primary plate made the BROWSER
          auto-scroll this belt's own internal scrollport to reveal it,
          `belt.scrollTop` landing at 244px with no visible scrollbar (an
          `overflow:hidden` box is still a scrollable/focus-scrollable region
          per spec, scrollbar or not), silently desyncing every
          `hub.getBoundingClientRect()` read the drag gesture and
          `centreHub()` depend on from where the hub visually is.
          `overflow: clip` (already used on the desktop ring's x-axis below)
          clips identically but was built specifically to never become a
          scroll container, so there is no scrollport for a focus event to
          move: `belt.scrollTop` stays 0 no matter what receives focus inside
          it.
          lg+: the desktop ring, unchanged from before: `absolute inset-0`,
          `overflow-x-clip` (the hub sits off the right edge and would
          otherwise widen the document) with the y axis left open so the
          lowest plate can still spill over the seam into the values band, as
          the blueprint draws it. `clip` on both axes here, `visible` leaves
          the other one open. */}
      <div className="plate-wheel pointer-events-none relative mt-10 h-[var(--belt-h)] w-full overflow-clip lg:absolute lg:inset-0 lg:mt-0 lg:h-auto lg:w-auto lg:overflow-x-clip lg:overflow-y-visible">
        <div ref={hubRef} className="wheel-hub h-0 w-0">
          {/* Desktop ring (lg+): unchanged, 24 spokes (4 copies of the six),
              15deg apart. `hidden lg:contents`: gone from layout below
              1024px; at lg+ a transparent grouping wrapper (`display:
              contents`) so every spoke below still positions directly
              against `.wheel-hub`, not this wrapper (see the geometry note
              above on the two rings sharing one hub). */}
          <div className="hidden lg:contents">
            {Array.from({ length: SPOKE_COUNT }, (_, spoke) => (
              <WheelSpoke
                key={`d${spoke}`}
                plate={about.plates[spoke % about.plates.length]}
                spoke={spoke}
                angle={angleFor(spoke)}
                index={spoke % about.plates.length}
                primary={spoke < about.plates.length}
              />
            ))}
          </div>

          {/* Mobile ring (below 1024px): two copies of the six dishes, 30deg
              apart round the FULL circle (Kazim, round 5; see the geometry
              note above for why the full circle, not the visible arc, and
              why two copies rather than one or three). `contents lg:hidden`:
              the mirror of the wrapper above, present below 1024px, gone at
              lg+. Both sets are always in the DOM (a plain CSS toggle, not a
              JS breakpoint branch) so the server and the first client render
              are identical. Same repeat pattern as the desktop ring above:
              `plate % about.plates.length` cycles the six dishes, `primary`
              is true only for the first pass (spokes 0 to 5) so the second
              copy stays out of the tab order and hidden from assistive
              tech, same as desktop's repeats. */}
          <div data-ring="mobile" className="contents lg:hidden">
            {Array.from({ length: MOBILE_SPOKE_COUNT }, (_, spoke) => (
              <WheelSpoke
                key={`m${spoke}`}
                plate={about.plates[spoke % about.plates.length]}
                spoke={spoke}
                angle={mobileAngleFor(spoke)}
                index={spoke % about.plates.length}
                primary={spoke < about.plates.length}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile-only reel caption (round 5; see the doc comment above the
          component for why this is one fixed label rather than a per-plate
          one). Round 5, second pass (Kazim's own words, "under the burgers",
          and James's read: a solid yellow pill this prominent reads as the
          nav's ORDER ONLINE button, not a name). Moved BELOW the belt as a
          plain sibling AFTER it, and restyled as quiet text: no pill, no
          background, no uppercase `.display` weight, just yellow type on the
          purple ground the way `About`'s own body copy already relies on
          contrast rather than a card to read. `mt-4`: breathing room from the
          belt's own clip line, small and deliberate, not fighting for the
          same vertical space as a plate (that space is inside the belt's own
          overflow-clip box above; this element is outside it entirely, in
          normal flow, so it is structurally incapable of ever sharing a
          pixel with a plate or being cut mid-word by the clip line, the same
          guarantee the first pass had, just on the other side of the arc
          now). `aria-hidden`: purely a visual affordance for a sighted touch
          visitor, not a substitute for the real per-plate accessible name
          each button already carries (unchanged, still focus-revealed,
          Lesson 33). The initial text is the first mobile spoke's own dish
          (spoke 0 sits at the rest pose's top, MOBILE_FIRST_ANGLE_DEG), so
          there is no empty label before JS runs or under reduced motion
          before the effect's first paint. */}
    </>
  );
}

/* -------------------------------------------------------------------------- */

type PlateData = (typeof about.plates)[number];

/**
 * One spoke: places a `Plate` at `angle` degrees round the hub, at radius
 * `--wheel-r`. Shared by both rings (desktop's 24-spoke map and mobile's
 * 6-spoke map both call this) so their markup structure can never drift
 * apart from each other.
 */
function WheelSpoke({
  plate,
  spoke,
  angle,
  index,
  primary,
}: {
  plate: PlateData;
  /** Position within the caller's own set; passed straight through to `Plate`. */
  spoke: number;
  /** This spoke's angle in the wheel's own CSS convention (see angleFor/mobileAngleFor). */
  angle: number;
  index: number;
  primary: boolean;
}) {
  return (
    <div
      className="absolute left-0 top-0 h-0 w-0"
      style={{ transform: `rotate(${angle}deg) translateX(var(--wheel-r))` }}
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
          angle={angle}
          index={index}
          primary={primary}
          // Undo the spoke's angle and the hub's live rotation, so the
          // plate hangs upright at every position on the wheel, while
          // it is being dragged as much as while it turns on its own.
          style={{ transform: `rotate(calc(${-angle}deg - var(--wheel-rot, 0deg)))` }}
        />
      </div>
    </div>
  );
}

interface PlateProps {
  plate: PlateData;
  /** Position on the ring, used by the wheel's hover, focus and drag handling. */
  spoke?: number;
  /** This spoke's angle (`data-angle`): read back on keyboard focus, since
   * the desktop and mobile sets use different angle formulas for the same
   * `spoke` index and the wheel has to know which one actually fired. */
  angle: number;
  /** Index within the six-plate set, for the float animation's offset. */
  index: number;
  /**
   * False for the eighteen repeats of the set: same dish, still clickable and
   * hoverable, but out of the tab order and hidden from assistive tech so the
   * menu is not announced four times over.
   */
  primary: boolean;
  style?: React.CSSProperties;
}

/**
 * One plate on the ring: the cutout, and the tooltip naming it. Every plate on
 * the site is one of these now (the old static mobile row rendered a second,
 * simpler version of this same button; it is gone, see the geometry note
 * above).
 *
 * The tooltip's CSS is itself responsive, because it is the SAME markup on
 * both rings, and the SAME visibility rule on both (Lesson 33: no always-on
 * caption is safe inside a clipped, continuously-turning ring, no matter how
 * few): hidden by default, revealed only on `:focus-visible`. A touchscreen
 * has no hover to lose; a tap already opens the menu and names the dish
 * there.
 *   lg+ (the desktop ring)   opens to the LEFT: the arc lives on the right
 *     edge, so a right-hand tooltip would be off-screen. Unchanged from
 *     before this round.
 *   below lg (the mobile ring)   sits under the plate, capped and wrapped so
 *     the longest name can never reach past the belt's own clipped edge.
 *
 * `draggable={false}` and `onDragStart` are not belt and braces, they are the
 * fix (Lessons 24): a photo inside a control is a drag source to the browser,
 * and its native drag hijacks the gesture, offers the file for download on
 * drop, and swallows the pointer events the wheel needs to un-pause itself.
 */
function Plate({ plate, spoke, angle, index, primary, style }: PlateProps) {
  const { openMenu } = useModals();
  const tipId = `${useId()}plate-tip`;

  return (
    <button
      type="button"
      onClick={openMenu}
      onDragStart={(event) => event.preventDefault()}
      data-spoke={spoke}
      data-angle={angle}
      tabIndex={primary ? undefined : -1}
      aria-hidden={primary ? undefined : true}
      aria-describedby={primary ? tipId : undefined}
      style={style}
      // Grab to spin on both rings. `touch-pan-y` keeps the page's own
      // vertical scroll available to a touchscreen: the desktop ring never
      // receives a touch pointerdown at all (see desktopMQ above), so this is
      // only ever live for the mobile ring, where the drag is horizontal and
      // does not fight that vertical scroll.
      className="group plate-btn pointer-events-auto relative block w-full cursor-grab touch-pan-y select-none rounded-[999px] focus-visible:outline-offset-8"
    >
      {/* The visible label is a tooltip (lg+, hover-only) or an always-on
          caption (mobile). The button still needs a name of its own, and it
          should say what pressing it does. */}
      <span className="sr-only">
        {plate.name}. {about.platesHint}
      </span>

      <Image
        src={plate.src}
        alt=""
        width={plate.width}
        height={plate.height}
        sizes="(max-width: 1023px) 30vw, 320px"
        draggable={false}
        // The ring's far side is clipped off, so a lazy plate would never
        // intersect anything and would pop in as it rotated round. Eager, but
        // explicitly low priority: twenty-four elements share six URLs, and
        // none of them should race the hero for the connection.
        loading="eager"
        fetchPriority="low"
        className="float h-auto w-full drop-shadow-[0_18px_30px_rgba(43,3,48,0.35)]"
        style={{ animationDelay: `${-(index * 0.65)}s` }}
      />

      <span
        id={tipId}
        role="tooltip"
        aria-hidden={primary ? undefined : true}
        className={[
          "plate-tip pointer-events-none absolute z-10 w-max rounded-[999px] bg-yellow px-2.5 py-1",
          "text-[11px] leading-[1.15] text-purple shadow-[0_8px_20px_rgba(43,3,48,0.35)] sm:px-4 sm:py-2 sm:text-[13px]",
          // Mobile ring: QA gate, 2026-09-15 (James's read of the built
          // screenshots, confirmed live). The always-on-for-primaries design
          // this replaced put all six primary captions on screen at once
          // regardless of rotation, and because the belt clips vertically
          // while the ring never stops turning, a caption's own position
          // constantly sweeps across the clip boundary: at most instants
          // several were stacked into unreadable overlap, sliced mid-word by
          // the belt's overflow-hidden edge ("EN", "E" with no plate under
          // them). Matching the desktop ring's own model fixes both at the
          // root instead of chasing z-index or re-tuning the clip: hidden by
          // default, revealed only on focus-visible. Touch has no hover, but
          // a tap already opens the menu pop-up and names the dish there;
          // keyboard and screen-reader users get the same reveal desktop
          // does. Non-primary repeats are unfocusable (tabIndex -1), so this
          // is inert for them, same as before.
          "bottom-[-1.35em] left-1/2 max-w-[27vw] -translate-x-1/2 whitespace-normal text-center opacity-0",
          "transition-opacity duration-200 group-focus-visible:opacity-100 group-data-[tag]:opacity-100",
          // Desktop ring: hover/focus only, opens left of the plate.
          "lg:bottom-auto lg:left-auto lg:right-[84%] lg:top-1/2 lg:max-w-none lg:translate-x-0",
          "lg:-translate-y-1/2 lg:whitespace-nowrap lg:text-[15px] lg:group-hover:opacity-100",
        ].join(" ")}
      >
        <span className="display block tracking-[0.02em]">{plate.name}</span>
      </span>
    </button>
  );
}
