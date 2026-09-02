import { contact, footer, locations, site, socials } from "@/lib/content";
import CosmosLogo from "./CosmosLogo";
import { socialIcons } from "./Icons";

/**
 * The footer (facts SS4.13): the big yellow wordmark, FOLLOW US and CONTACT
 * INFO, on purple with the burger pattern.
 *
 * CONTACT INFO renders only what actually exists. The docx left the block
 * blank, and no phone or email is confirmed for the four halls, so rather than
 * publish a number that may ring the wrong counter it offers the one channel
 * that is definitely monitored plus the hall list. Fill `contact.phone` or
 * `contact.email` in lib/content.ts and they appear here with no code change.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="pattern pb-10 pt-16 sm:pt-20 lg:pt-24">
      <div className="mx-auto max-w-[1400px] px-5 sm:px-8 lg:px-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16">
          <div className="reveal flex flex-col items-center gap-8 lg:items-start">
            <CosmosLogo
              className="h-auto w-[240px] text-yellow sm:w-[300px]"
              title={`${site.name}, home`}
            />

            <div className="text-center lg:text-left">
              <h2 className="display text-2xl text-yellow sm:text-3xl">{footer.followUs}</h2>
              <ul className="mt-4 flex justify-center gap-2 lg:justify-start">
                {socials.map((s) => {
                  const Icon = socialIcons[s.id];
                  return (
                    <li key={s.id}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-11 w-11 items-center justify-center rounded-full text-yellow transition hover:bg-yellow hover:text-purple"
                      >
                        <Icon className="h-6 w-6" />
                        <span className="sr-only">
                          {site.name} on {s.label} (opens in a new tab)
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className="reveal" style={{ "--i": 1 } as React.CSSProperties}>
            <h2 className="display text-2xl text-yellow sm:text-3xl">{contact.heading}</h2>

            <div className="mt-5 space-y-3 text-[16px] text-white">
              {contact.phone && (
                <p>
                  <a className="underline underline-offset-4 hover:text-yellow" href={`tel:${contact.phone}`}>
                    {contact.phone}
                  </a>
                </p>
              )}
              {contact.email && (
                <p>
                  <a
                    className="underline underline-offset-4 hover:text-yellow"
                    href={`mailto:${contact.email}`}
                  >
                    {contact.email}
                  </a>
                </p>
              )}
              {!contact.phone && !contact.email && (
                <p>
                  {contact.fallback}{" "}
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
              )}
            </div>

            <ul className="mt-6 space-y-3 text-[15px] leading-snug text-white/85">
              {locations.map((l) => (
                <li key={l.id}>
                  <span className="block text-xs font-bold uppercase tracking-[0.18em] text-yellow">
                    {l.area}
                  </span>
                  {l.name}, {l.address}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-[15px] text-white/85">
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
          </div>
        </div>

        <div className="mt-14 flex flex-col-reverse items-center justify-between gap-6 border-t-2 border-white/15 pt-7 sm:flex-row">
          <p className="text-sm text-white/70">
            © {year} {site.name}. All rights reserved.
          </p>
          {/* py-1.5 keeps every target at least 24x24 CSS px (WCAG 2.5.8 AA) */}
          <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-4 gap-y-1">
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
        </div>
      </div>
    </footer>
  );
}
