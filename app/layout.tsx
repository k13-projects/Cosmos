import type { Metadata, Viewport } from "next";
import { Poppins, Archivo } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import { LogoSprite } from "@/components/CosmosLogo";
import { isProduction, locations, menuStructuredData, site } from "@/lib/content";

/**
 * Poppins for body, buttons and nav (guide + mockup, facts SS3). Display face
 * ships as Archivo at its widest width axis, weight 900, permanently (Kazim,
 * 2026-09-02): the guide itself was set in Horizon (Adobe Font, not free),
 * Archivo is the wide-geometric match K13 chose in its place. See facts SS6.5.
 */
const body = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-cosmos-body",
});

const display = Archivo({
  subsets: ["latin"],
  // Variable font so the wdth axis is available; weight is pinned to 900 in
  // CSS (the .display utility) since next/font only allows `axes` when weight
  // is "variable", not a fixed value.
  weight: "variable",
  axes: ["wdth"],
  display: "swap",
  variable: "--font-cosmos-display",
});

const TITLE = "Cosmos Burger | Burgers, Chicken and Fries in San Diego";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: TITLE, template: "%s | Cosmos Burger" },
  description: site.description,
  keywords: [
    "Cosmos Burger",
    "smash burgers San Diego",
    "Spicy Jam Burger",
    "Monkey Fries",
    "chicken sandwich San Diego",
    "Windmill Food Hall",
    "Global Fork Food Hall",
    "burger catering San Diego",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: TITLE,
    description: site.description,
  },
  twitter: { card: "summary_large_image", title: TITLE, description: site.description },
  // Preview deploys set NEXT_PUBLIC_SITE_URL, which flips this off so a
  // preview copy never competes with the real site in search results.
  robots: { index: isProduction, follow: isProduction },
};

export const viewport: Viewport = {
  themeColor: "#751080",
  width: "device-width",
  initialScale: 1,
};

/**
 * Restaurant schema, one entry per hall, so each counter can rank locally.
 * Station 8 is included with its Coming Soon status carried as `openingHours`
 * omitted rather than a fabricated opening time.
 *
 * One shared `Menu` object (built from the same `menuPopup` data the pop-up
 * renders, see `lib/content.ts`) carries the real prices; every Restaurant's
 * `hasMenu` points at it by `@id` rather than repeating the whole menu five
 * times. Decided at the James/Lorena meeting 2026-09-02: the menu is website
 * content, not only a PDF, for SEO.
 */
function structuredData() {
  const menuId = `${site.url}/#menu`;
  const menu = menuStructuredData(menuId);

  return {
    "@context": "https://schema.org",
    "@graph": [
      menu,
      ...locations.map((l) => ({
        "@type": "Restaurant",
        name: `${site.name}, ${l.name}`,
        servesCuisine: ["American", "Burgers"],
        priceRange: "$$",
        url: site.url,
        image: `${site.url}/opengraph-image`,
        sameAs: [site.instagram, site.facebook, site.tiktok],
        address: { "@type": "PostalAddress", streetAddress: l.address },
        ...(l.status ? {} : { openingHours: "Mo-Su 11:00-21:00" }),
        hasMenu: { "@id": menuId },
        parentOrganization: {
          "@type": "Organization",
          name: site.operator,
          url: site.operatorUrl,
        },
      })),
    ],
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the inline script below adds `js` to this
    // element's class list before React hydrates, which is the whole point of
    // it, and React would otherwise log that as a mismatch on every dev load.
    // Scoped to <html> itself, so a real mismatch anywhere inside still warns.
    <html lang="en" className={`${body.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        {/*
          Marks the document as JS-capable before first paint. `.reveal` only
          starts hidden under `.js`, so a no-JS or JS-failed render shows the
          full page instead of a blank one. Must stay inline and synchronous.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.add('js')`,
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-yellow focus:px-5 focus:py-3 focus:font-semibold focus:text-purple"
        >
          Skip to content
        </a>
        <LogoSprite />
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
