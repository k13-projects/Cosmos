"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Lenis smooth scroll + the IntersectionObserver that drives `.reveal`.
 * Both are fully disabled when the user prefers reduced motion, Lenis never
 * starts, and every `.reveal` is marked visible immediately.
 */
export default function SmoothScroll() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    let lenis: Lenis | undefined;
    let frame = 0;

    const startLenis = () => {
      lenis = new Lenis({ duration: 1.05, wheelMultiplier: 1, touchMultiplier: 1.6 });
      const raf = (time: number) => {
        lenis?.raf(time);
        frame = requestAnimationFrame(raf);
      };
      frame = requestAnimationFrame(raf);
    };

    const stopLenis = () => {
      cancelAnimationFrame(frame);
      lenis?.destroy();
      lenis = undefined;
    };

    // --- reveal observer ---
    const targets = document.querySelectorAll<HTMLElement>(".reveal");
    let observer: IntersectionObserver | undefined;

    const revealAll = () => targets.forEach((el) => el.classList.add("is-visible"));

    const observe = () => {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              observer?.unobserve(entry.target);
            }
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.08 },
      );
      targets.forEach((el) => observer?.observe(el));
    };

    const apply = () => {
      stopLenis();
      observer?.disconnect();
      // No observer support, or the user wants no motion: just show everything.
      if (reduced.matches || typeof IntersectionObserver === "undefined") {
        revealAll();
      } else {
        startLenis();
        observe();
      }
    };

    apply();
    reduced.addEventListener("change", apply);

    return () => {
      reduced.removeEventListener("change", apply);
      stopLenis();
      observer?.disconnect();
    };
  }, []);

  return null;
}
