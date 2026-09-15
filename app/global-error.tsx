"use client";

import { useEffect } from "react";

/**
 * The last resort: a throw in the root layout itself, which replaces
 * `app/layout.tsx` entirely. It therefore has to ship its own <html> and
 * <body>, and it cannot use the site's fonts, tokens or components, because
 * the layout that loads them is exactly what failed.
 *
 * So this is hand-styled in the brand's raw hex rather than its tokens, and
 * kept to plain markup with no imports beyond React. It is the one page on the
 * site allowed to hardcode a colour.
 */
export default function GlobalError({
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
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",
          padding: "2rem 1.25rem",
          textAlign: "center",
          background: "#751080",
          color: "#FFFFFF",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
        }}
      >
        <h1 style={{ margin: 0, fontSize: "2rem", color: "#FAF00C" }}>Cosmos Burger</h1>
        <p style={{ margin: 0, maxWidth: "34rem", lineHeight: 1.6 }}>
          The site could not load. Please try again in a moment.
        </p>
        <button
          type="button"
          onClick={reset}
          style={{
            marginTop: "0.5rem",
            minHeight: "44px",
            padding: "0 1.5rem",
            borderRadius: "999px",
            border: "none",
            background: "#FAF00C",
            color: "#751080",
            fontWeight: 700,
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}
