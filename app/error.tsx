"use client";

import Link from "next/link";
import { useEffect } from "react";
import { site } from "@/lib/content";
import CosmosLogo from "@/components/CosmosLogo";

/**
 * The route's error boundary.
 *
 * The P5 pass (tasks/todo.md) accepted Next's stark default here on the
 * grounds that a static marketing page has no server logic to throw. That is
 * true of the server and untrue of the browser: the page ships a plate wheel
 * with pointer capture, two pop-ups and a scroll driver, and a throw in any of
 * them replaces the whole site with an unbranded white page. A guest who hits
 * that has no way back to the menu, which is the one thing they came for.
 *
 * `reset()` re-renders the segment: a transient failure (a lost chunk on a
 * flaky connection) recovers in place without a reload.
 *
 * Deliberately not reported anywhere: this build has no analytics and no error
 * service, and quietly adding a third-party beacon would change what the site
 * sends about its visitors and break the CSP it ships. `console.error` keeps
 * the detail where a developer can see it and a guest cannot.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main"
      className="pattern flex min-h-screen flex-col items-center justify-center px-5 text-center"
    >
      <CosmosLogo className="h-auto w-[220px] text-yellow" title={`${site.name}, home`} />

      <h1 className="display mt-10 text-5xl text-yellow sm:text-6xl">Something burned</h1>
      <p className="mt-4 max-w-md text-[17px] leading-relaxed text-white/85">
        That is on us, not on you. Try again, and if it keeps happening the menu, our locations and
        catering are all on the home page.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button type="button" onClick={reset} className="btn btn-yellow sheen sheen-hover">
          Try again
        </button>
        <Link href="/" className="btn btn-ghost-yellow">
          Back to home
        </Link>
      </div>
    </main>
  );
}
