import { catering } from "@/lib/content";

/**
 * "CATERING" (facts SS4.8). The only outbound CTA on the page that is a real
 * link rather than a pop-up: ezCater hosts the whole catering order, so there
 * is nothing for us to collect. Verified live 2026-09-02.
 */
export default function CateringSection() {
  return (
    <section id="catering" className="scroll-mt-28 bg-cream py-16 sm:py-20 lg:scroll-mt-32 lg:py-24">
      <div className="mx-auto max-w-[860px] px-5 text-center sm:px-8">
        <h2 className="reveal display text-[13vw] text-purple sm:text-6xl lg:text-[72px]">
          {catering.title}
        </h2>

        <p
          className="reveal mt-3 text-xl font-bold leading-tight text-magenta-ink sm:text-2xl lg:text-3xl"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          {catering.subtitle}
        </p>

        <p
          className="reveal mx-auto mt-8 max-w-[62ch] text-[16px] leading-relaxed text-purple sm:text-[17px]"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          {catering.body}
        </p>

        <div className="reveal mt-10" style={{ "--i": 3 } as React.CSSProperties}>
          <a
            href={catering.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-purple w-full sm:w-auto sm:min-w-[280px]"
          >
            {catering.cta}
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
              className="shrink-0 opacity-70"
            >
              <path
                d="M7 17 17 7M17 7H9m8 0v8"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="sr-only">
              {" "}
              on {catering.provider} (opens in a new tab)
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
