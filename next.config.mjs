/** @type {import('next').NextConfig} */

// One Vercel deployment will eventually answer on two hostnames: the client's
// live domain and K13's stakeholder preview at cosmos.k13projects.com. This
// regex is how the preview is singled out below. Anchored, so
// `cosmos.k13projects.com.evil.com` cannot match it. No legacy redirects yet,
// this is a brand-new site with no prior slugs to carry forward (unlike
// LobsterLab, which 301s an old SpotHopper tree).
const PREVIEW_HOST = "^cosmos\\.k13projects\\.com$";

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
          {
            // Static CSP, on purpose. The nonce-per-request variant from the
            // 2026-09-02 security audit needs `headers()` in the root layout,
            // which turns every route dynamic and gives up the static build.
            // This site has no user input, no forms and no third-party
            // scripts, so 'unsafe-inline' on script-src (required for Next's
            // own hydration chunks) carries no practical XSS surface here.
            // Revisit with the nonce approach the day analytics or a form is
            // added. Fonts and images are self-hosted by next/font and the
            // asset pipeline; data: covers the inline SVG favicon.
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data:",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors 'self'",
              "base-uri 'self'",
              "form-action 'self'",
              "object-src 'none'",
              "upgrade-insecure-requests",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
