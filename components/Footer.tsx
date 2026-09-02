import { contact, footer, site, socials } from "@/lib/content";
import CosmosLogo from "./CosmosLogo";
import { socialIcons } from "./Icons";

/**
 * The footer (facts SS4.13): the big yellow wordmark on purple with the burger
 * pattern, then two equal columns, then the legal row.
 *
 * FOLLOW US and CONTACT INFO are symmetric by construction (a two-column grid
 * of equal fractions, one shared label style, one shared body style), because
 * the first pass grew a four-hall address dump under CONTACT INFO and threw the
 * whole block off balance. The halls already have their own section; they do
 * not belong here (Lessons 18).
 *
 * CONTACT INFO renders only what exists. The docx left it blank and no phone or
 * email is confirmed for these four halls, so it offers the one channel that is
 * definitely monitored. Fill `contact.phone` or `contact.email` in
 * lib/content.ts and each appears here with no code change.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="pattern scroll-mt-28 pb-10 pt-16 sm:pt-20 lg:scroll-mt-32 lg:pt-24">
      <div className="mx-auto max-w-[1100px] px-5 sm:px-8">
        <div className="reveal flex justify-center">
          <CosmosLogo
            className="h-auto w-[240px] text-yellow sm:w-[320px]"
            title={`${site.name}, home`}
          />
        </div>

        <div className="mt-14 grid gap-12 text-center sm:grid-cols-2 sm:gap-8">
          {/* --- FOLLOW US ------------------------------------------------- */}
          <section className="reveal" aria-labelledby="footer-follow">
            <h2 id="footer-follow" className="display text-2xl text-yellow sm:text-[28px]">
              {footer.followUs}
            </h2>

            {/* The handle sits UNDER its icon, so the row reads as three
                labelled channels rather than three anonymous glyphs. */}
            {/* A three-column grid, not a flex row: the handles are 14 to 22
                characters and a fixed-width flex cell runs them into each other. */}
            <ul className="mx-auto mt-6 grid max-w-[400px] grid-cols-3 gap-x-2">
              {socials.map((s) => {
                const Icon = socialIcons[s.id];
                return (
                  <li key={s.id} className="min-w-0">
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center gap-2 text-white transition-colors hover:text-yellow"
                    >
                      <span className="flex h-11 w-11 items-center justify-center rounded-full text-yellow">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span className="w-full break-words text-[11px] leading-snug sm:text-[12px]">{s.handle}</span>
                      <span className="sr-only">
                        {site.name} on {s.label} (opens in a new tab)
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </section>

          {/* --- CONTACT INFO ---------------------------------------------- */}
          <section
            className="reveal"
            aria-labelledby="footer-contact"
            style={{ "--i": 1 } as React.CSSProperties}
          >
            <h2 id="footer-contact" className="display text-2xl text-yellow sm:text-[28px]">
              {contact.heading}
            </h2>

            <div className="mt-6 space-y-2 text-[16px] leading-relaxed text-white">
              <p>{contact.fallback}</p>
              <p>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block py-1 font-semibold text-yellow underline underline-offset-4"
                >
                  {site.instagramHandle}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </p>
              {contact.phone && (
                <p>
                  <a
                    className="inline-block py-1 underline underline-offset-4 hover:text-yellow"
                    href={`tel:${contact.phone}`}
                  >
                    {contact.phone}
                  </a>
                </p>
              )}
              {contact.email && (
                <p>
                  <a
                    className="inline-block py-1 underline underline-offset-4 hover:text-yellow"
                    href={`mailto:${contact.email}`}
                  >
                    {contact.email}
                  </a>
                </p>
              )}
            </div>
          </section>
        </div>

        {/* --- operator, legal, copyright, all centred -------------------- */}
        <div className="mt-14 border-t-2 border-white/15 pt-8 text-center">
          <p className="text-[15px] text-white/85">
            {footer.operatorLabel}{" "}
            <a
              href={site.operatorUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block py-1 font-semibold text-yellow underline underline-offset-4"
            >
              {site.operator}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </p>

          {/* py-1.5 keeps every target at least 24x24 CSS px (WCAG 2.5.8 AA) */}
          <nav aria-label="Footer" className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
            {footer.legal.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="inline-flex min-h-[24px] items-center px-2 py-1.5 text-sm font-semibold text-white/80 transition-colors hover:text-yellow"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <p className="mt-4 text-sm text-white/70">
            © {year} {site.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
