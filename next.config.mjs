/** @type {import('next').NextConfig} */

// One Vercel deployment will eventually answer on two hostnames: the client's
// live domain and K13's stakeholder preview at cosmos.k13projects.com. This
// regex is how the preview is singled out below. Anchored, so
// `cosmos.k13projects.com.evil.com` cannot match it. No legacy redirects yet,
// this is a brand-new site with no prior slugs to carry forward (unlike
// LobsterLab, which 301s an old SpotHopper tree).
const PREVIEW_HOST = "cosmos\\.k13projects\\.com";

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  images: {
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [
      // Keep the preview domain out of search, whatever robots.txt says.
      {
        source: "/:path*",
        has: [{ type: "host", value: PREVIEW_HOST }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
