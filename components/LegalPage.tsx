import Link from "next/link";
import { site } from "@/lib/content";
import CosmosLogo from "./CosmosLogo";

/**
 * Shared shell and typography for the three legal routes.
 *
 * REVIEWED BY COUNSEL: PENDING. These pages are a good-faith implementation by
 * a build team, not legal advice, and no lawyer has read them. The privacy page
 * in particular describes a site that collects nothing, which is true of this
 * build (no forms, no analytics, no cookies). The moment any of that changes,
 * the page must change in the same commit, not after.
 */
export default function LegalPage({
  title,
  effective,
  children,
}: {
  title: string;
  effective?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cream">
      <header className="bg-purple">
        <div className="mx-auto flex max-w-[1400px] items-center px-5 py-4 sm:px-8 lg:px-12">
          <Link href="/">
            <CosmosLogo className="h-10 w-auto text-yellow sm:h-12" title={`${site.name}, home`} />
          </Link>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        {/* 8.5vw, not 12vw, and break-words as a guard. The display face is
            Archivo at wdth 125, so a single long title word cannot wrap and
            simply runs off: "Accessibility" measured 450px inside a 335px
            column at 375 and gave the document a 95px horizontal scroll.
            "Privacy Policy" and "Terms of Use" hid it by having a space to
            break at. The size makes the real titles fit on one line; the
            break-words guard means no future title can leak either. */}
        <h1 className="display break-words text-[8.5vw] text-purple sm:text-6xl">{title}</h1>
        {effective && (
          <p className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-magenta-ink">
            Effective {effective}
          </p>
        )}

        <div className="mt-8 text-[17px] leading-relaxed text-purple">{children}</div>

        <Link href="/" className="btn btn-purple mt-12">
          Back to {site.name}
        </Link>
      </main>
    </div>
  );
}

export function H2({ children }: { children: React.ReactNode }) {
  return <h2 className="display mt-10 text-2xl text-purple">{children}</h2>;
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mt-4">{children}</p>;
}

export function UL({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 list-disc space-y-2 pl-5">
      {items.map((t) => (
        <li key={t}>{t}</li>
      ))}
    </ul>
  );
}

export function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="inline-block py-1 font-semibold text-magenta-ink underline underline-offset-4">
      {children}
    </a>
  );
}
