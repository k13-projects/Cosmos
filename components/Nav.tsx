"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { menuSection, nav, site } from "@/lib/content";
import CosmosLogo from "./CosmosLogo";
import { useModals } from "./ModalProvider";

/**
 * The blueprint's nav (facts SS4): the yellow script logo top left, a floating
 * purple pill carrying the five anchors and the yellow ORDER ONLINE pill, all
 * sitting over the hero photo. It gains a shadow once the page has scrolled, so
 * the pill still reads as a bar when it is over cream rather than photography.
 *
 * The mobile sheet has the same keyboard contract as a dialog, because it
 * visually covers the page while open: Escape closes it, Tab stays inside, and
 * focus returns to the button that opened it.
 */
export default function Nav() {
  const { openOrder } = useModals();
  const [open, setOpen] = useState(false);
  const [stuck, setStuck] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key !== "Tab" || !sheetRef.current) return;

      const items = Array.from(
        sheetRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])"),
      ).filter((el) => el.offsetParent !== null);
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (e.shiftKey && (active === first || active === toggleRef.current)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    const t = window.setTimeout(() => {
      sheetRef.current?.querySelector<HTMLElement>("a[href]")?.focus();
    }, 60);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 sm:px-6 sm:py-4 lg:gap-6 lg:px-8">
        <a href="#top" aria-label={`${site.name}, home`} className="shrink-0">
          <CosmosLogo className="h-9 w-auto text-yellow drop-shadow-[0_2px_10px_rgba(59,4,66,0.45)] sm:h-11 lg:h-[52px]" />
        </a>

        {/* The pill itself. Pushed right so the logo keeps the left edge, as in
            the blueprint. */}
        <div
          className={[
            "ml-auto flex items-center rounded-[999px] bg-purple transition-shadow duration-300",
            stuck ? "shadow-[0_10px_30px_rgba(59,4,66,0.35)]" : "shadow-none",
          ].join(" ")}
        >
          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 pl-5 pr-2 md:flex lg:gap-3 lg:pl-7"
          >
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                /* min-h-11: this row renders from 768px up, which includes phone
                   landscape, a touchscreen. Line height alone gives a 24px hit
                   box. whitespace-nowrap keeps "About us" on one line at 768. */
                className="inline-flex min-h-11 items-center whitespace-nowrap px-2 text-[15px] font-semibold text-white transition-colors hover:text-yellow lg:text-[17px]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => openOrder()}
            className="btn btn-sm btn-yellow sheen sheen-hover m-1.5 hidden whitespace-nowrap sm:inline-flex"
          >
            {menuSection.orderCta}
          </button>

          <button
            ref={toggleRef}
            type="button"
            onClick={() => (open ? close() : setOpen(true))}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="flex h-12 w-12 items-center justify-center rounded-full text-yellow md:hidden"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              {open ? (
                <path
                  d="M6 6l12 12M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 6h18M3 12h18M3 18h18"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/*
        `inert` while closed. max-h-0 + overflow-hidden only hides the sheet
        visually; its links keep a layout box and stay in the tab order, so a
        keyboard user would land on invisible controls with no focus ring.
      */}
      <div
        id="mobile-nav"
        ref={sheetRef}
        inert={!open}
        className={[
          "mx-4 overflow-hidden rounded-[24px] bg-purple shadow-[0_18px_40px_rgba(59,4,66,0.4)] transition-[max-height,opacity] duration-300 md:hidden",
          open ? "max-h-[80vh] overflow-y-auto opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <nav aria-label="Mobile" className="flex flex-col px-5 py-2">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={close}
              className="border-b border-white/15 py-4 text-lg font-semibold text-white last:border-0"
            >
              {item.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openOrder();
            }}
            className="btn btn-yellow sheen sheen-hover mb-5 mt-4"
          >
            {menuSection.orderCta}
          </button>
        </nav>
      </div>
    </header>
  );
}
