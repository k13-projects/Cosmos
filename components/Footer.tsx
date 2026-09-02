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
/**
 * A handle with a real break opportunity after every dot.
 *
 * `@cosmosburger.sandiego` is one unbreakable word to CSS, so in a 107px grid
 * cell `break-words` chopped it mid-syllable ("@cosmosbur / ger.sandiego").
 * A `<wbr>` after each dot lets it wrap where a reader would expect
 * ("@cosmosburger. / sandiego") at every width, with no effect where the handle
 * already fits on one line.
 */
function Handle({ text }: { text: string }) {
  const parts = text.split(".");
  return (
    <>
      {parts.map((part, i) => (
        <span key={`${part}-${i}`}>
          {part}
          {i < parts.length - 1 && (
            <>
              .<wbr />
            </>
          )}
        </span>
      ))}
    </>
  );
}

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
                characters and a fixed-width flex cell runs them into each other.

                The grid takes the WHOLE column from sm up rather than a 400px
                cap. The cap made every cell 128px at 1280, which is 31px short
                of the longest handle (`@cosmosburger.sandiego` measures 159px at
                12px Poppins): it wrapped to two lines while its neighbours held
                one, and the three handle boxes sat 8px apart, so the row read as
                one packed line of text under three widely spaced glyphs instead
                of three labelled channels. At the full 502px the cells are 162px
                and only the long handle fills its own; the other two get about
                30px of air a side and each handle sits visibly under its icon.
                Below sm the cap is irrelevant (the column is already narrower)
                and the long handle wraps to two lines, which is correct there.

                One column below 360px. At 320 the three cells are 88px and even
                `/CosmosBurger` (95px, and dotless, so `<wbr>` cannot help it)
                has to break mid-word. Stacking gives every handle the full 280px
                and the row stays tidy at the floor width. */}
            <ul className="mx-auto mt-6 grid max-w-[400px] grid-cols-1 gap-y-6 min-[360px]:grid-cols-3 min-[360px]:gap-x-2 min-[360px]:gap-y-0 sm:max-w-none">
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
                      {/* 12px, not 11: below 12 this is the only text on the
                          page under the legibility floor the fitcheck enforces,
                          and it is a link label. */}
                      <span className="w-full break-words text-[12px] leading-snug">
                        <Handle text={s.handle} />
                      </span>
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
