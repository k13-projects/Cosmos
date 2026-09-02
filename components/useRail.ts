"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Shared behaviour for the two horizontal scroll-snap rails, locations and
 * reviews: step by one card, and know when the rail is at either end so the
 * arrows can disable instead of silently doing nothing.
 *
 * The resting start position is NOT scrollLeft 0. Each rail carries horizontal
 * padding and `snap-start` pulls the first card flush to the port, so it settles
 * at scrollLeft == padding-left. Comparing against 0 leaves the Previous arrow
 * permanently enabled on mobile.
 */
export function useRail<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const syncEdges = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const padLeft = parseFloat(getComputedStyle(el).paddingLeft) || 0;
    setAtStart(el.scrollLeft <= padLeft + 2);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 2);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    syncEdges();
    el.addEventListener("scroll", syncEdges, { passive: true });
    window.addEventListener("resize", syncEdges);
    return () => {
      el.removeEventListener("scroll", syncEdges);
      window.removeEventListener("resize", syncEdges);
    };
  }, [syncEdges]);

  const scrollByCard = useCallback((dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const card = el.querySelector("li");
    const step = card ? card.getBoundingClientRect().width + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  }, []);

  return { ref, atStart, atEnd, scrollByCard };
}
