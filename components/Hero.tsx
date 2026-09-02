"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { hero, site } from "@/lib/content";
import CosmosLogo from "./CosmosLogo";

/**
 * The hero band, and the P3 signature moment.
 *
 * Slide 2 of the client's ideas deck asks for "Banner: Picture and Animated
 * logo" (facts SS4.1), so the wordmark writes itself on over the photo: a
 * clip-path wipe left to right, one sheen sweep behind it, then a slow ambient
 * breathe. All three collapse to the finished state under prefers-reduced-motion
 * (app/globals.css), where the logo simply appears.
 *
 * The animation is armed only once the hero photo has decoded. Playing it
 * against an empty grey box wastes the one moment the page gets to introduce
 * itself, and on a slow connection that is exactly what happens.
 */
export default function Hero() {
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    // Fallback timer as well as the load event: a cached image can finish
    // decoding before this effect runs, in which case onLoad never fires.
    const t = window.setTimeout(() => setArmed(true), 400);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <section id="top" className="relative isolate overflow-hidden bg-purple">
      {/*
        min-h floor relaxes on short viewports. A flat floor plus the floating
        nav leaves phone landscape with nothing of the next section visible, so
        nothing signals that the page continues.
      */}
      <div className="relative h-[86vh] min-h-[min(460px,78vh)] w-full">
        <Image
          src={hero.src}
          alt={hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
          onLoad={() => setArmed(true)}
        />

        {/*
          Two jobs, and they must not become one: a light scrim across the top
          band so the nav pill and the wordmark hold contrast against the
          bokeh, and a fade into the purple About band at the very bottom seam.
          A plain top-to-bottom gradient does both at once and tints the
          burgers themselves purple, which is the one thing the photography is
          there for. The stops keep the middle of the frame untouched.
        */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgb(117 16 128 / 0.42) 0%, rgb(117 16 128 / 0.10) 26%, rgb(117 16 128 / 0) 46%, rgb(117 16 128 / 0) 74%, rgb(117 16 128 / 0.95) 100%)",
          }}
        />

        <div className="absolute inset-x-0 top-[26%] flex justify-center px-6">
          <h1 className="m-0">
            <span className={armed ? "logo-breathe block" : "block"}>
              <span className={`sheen block ${armed ? "logo-write" : ""}`}>
                <CosmosLogo className="h-auto w-[min(76vw,600px)] text-yellow drop-shadow-[0_6px_28px_rgba(59,4,66,0.55)]" />
              </span>
            </span>
            <span className="sr-only">
              {site.name}, {site.tagline}
            </span>
          </h1>
        </div>
      </div>
    </section>
  );
}
