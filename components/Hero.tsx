import Image from "next/image";
import { hero, site } from "@/lib/content";

/**
 * The hero band: the photograph, the fade into the purple About band, and the
 * nav that floats over it. Nothing else.
 *
 * The first pass put a large animated wordmark here, on the strength of slide 2
 * of the client's ideas deck ("Banner: Picture and Animated logo"). Lorena's
 * blueprint PDF draws a photo and a nav and no wordmark, and the PDF is the
 * agreement (Lessons 14). The wordmark component stays, in the nav and the
 * footer, where the blueprint does put it.
 *
 * The <h1> is the page's accessible name only. The band carries no visible
 * heading, so a visible one would have to be invented; a screen reader still
 * needs the document to say what this page is.
 */
export default function Hero() {
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
        />

        {/*
          Two jobs, and they must not become one: a light scrim across the top
          band so the nav pill and the logo hold contrast against the bokeh, and
          a fade into the purple About band at the very bottom seam. A plain
          top-to-bottom gradient does both at once and tints the burgers
          themselves purple, which is the one thing the photography is there
          for. The stops keep the middle of the frame untouched.
        */}
        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgb(117 16 128 / 0.42) 0%, rgb(117 16 128 / 0.10) 26%, rgb(117 16 128 / 0) 46%, rgb(117 16 128 / 0) 74%, rgb(117 16 128 / 0.95) 100%)",
          }}
        />

        <h1 className="sr-only">
          {site.name}, {site.tagline}
        </h1>
      </div>
    </section>
  );
}
