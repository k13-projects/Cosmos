import type Lenis from "lenis";

/**
 * The page's scroll owner.
 *
 * Lenis runs the page's scrolling (components/SmoothScroll.tsx), and it does
 * not simply decorate the native one: it holds its own target and animates
 * towards it every frame. A component that scrolls the page natively while
 * Lenis has an animation in flight does not win and does not lose, it lands
 * somewhere in between. Measured at the QA gate on the plate wheel's keyboard
 * focus: with a nav link's focus scroll still running, `scrollIntoView` on the
 * About band settled at scrollY 268 instead of 574 in three runs out of three,
 * leaving the focused plate's ring 16px below the fold.
 *
 * So anything that needs to move the page asks here, and this hands the request
 * to whoever actually owns the scroll. Under reduced motion Lenis is destroyed
 * and never starts, and the native call is then the right one.
 */
let instance: Lenis | null = null;

/** Called by SmoothScroll when Lenis starts (with the instance) and stops (null). */
export const setScroller = (lenis: Lenis | null): void => {
  instance = lenis;
};

/** Scroll the page so its top is at `top` document pixels. */
export const scrollPageTo = (top: number): void => {
  const y = Math.max(0, top);
  if (instance) instance.scrollTo(y);
  else window.scrollTo({ top: y });
};
