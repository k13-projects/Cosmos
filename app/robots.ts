import type { MetadataRoute } from "next";
import { site, isProduction } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  // A preview deploy must never be indexed: a second copy of the same content
  // splits ranking signals and can surface instead of the real site.
  if (!isProduction) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
