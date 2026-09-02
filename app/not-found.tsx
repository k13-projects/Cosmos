import Link from "next/link";
import { site } from "@/lib/content";
import CosmosLogo from "@/components/CosmosLogo";

export default function NotFound() {
  return (
    <main
      id="main"
      className="pattern flex min-h-screen flex-col items-center justify-center px-5 text-center"
    >
      <CosmosLogo className="h-auto w-[220px] text-yellow" title={`${site.name}, home`} />

      <p className="display mt-10 text-7xl text-yellow sm:text-8xl">404</p>
      <h1 className="mt-3 text-2xl font-bold leading-tight text-white sm:text-3xl">
        That one got eaten.
      </h1>
      <p className="mt-3 max-w-md text-[17px] leading-relaxed text-white/85">
        The page you were after is not here. The menu, our locations and catering are all on the
        home page.
      </p>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link href="/" className="btn btn-yellow sheen sheen-hover">
          Back to home
        </Link>
        <Link href="/#locations" className="btn btn-ghost-yellow">
          Find a location
        </Link>
      </div>
    </main>
  );
}
