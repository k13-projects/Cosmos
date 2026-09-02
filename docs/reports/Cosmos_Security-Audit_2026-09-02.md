# Security Audit — Cosmos Burger

- **Project:** Cosmos Burger (Tiger Hospitality Group)
- **What it serves:** public marketing one-pager, no accounts, no forms, no analytics, no cookies. Every CTA is either an in-page anchor, an in-page modal, or an outbound link to a third party (ezCater, DoorDash, Instagram, Facebook, TikTok, Google Maps).
- **Stack:** Next.js 15 App Router, statically prerendered, no backend, no database, deployed to Vercel.
- **Reviewed by:** Irina (security-auditor), K13 Software Studio
- **Date:** 2026-09-02
- **Overall posture:** Strong. No secrets, no backend, no forms, no data collection means most of the checklist is not applicable by design. The one real gap is a missing Content-Security-Policy; everything else is either already correct or cosmetic.

---

## Verdict

Ship-safe as a static site. Zero critical or high findings. One medium finding (no CSP) is real defense-in-depth work worth doing before or shortly after launch, not a blocker. Two low findings are cheap cleanups. The rest is recorded as "fine and why" so the client and Kate (release-engineer) have the full picture, not just a list of complaints.

---

## Findings

| # | Severity | Area | Finding | Fix | File:line |
|---|----------|------|---------|-----|-----------|
| 1 | Medium | Headers / CSP | No `Content-Security-Policy` header anywhere. Every other header (nosniff, frame-options, referrer-policy, permissions-policy, HSTS) is set, but nothing restricts script/style/connect sources. On a static site with no user input this is low exploitability today, but it is the one header that actually stops an XSS payload from running if one is ever introduced (a future form, a future third-party embed, a copy-paste mistake in JSX). Same gap exists on the LobsterLab sibling, so this is a house-wide gap, not unique to Cosmos. | Add the CSP below. Requires a nonce-based approach, not a pure hash list, because Next 15's App Router injects ~25 additional inline `<script>self.__next_f.push(...)</script>` tags per page for RSC hydration, on top of the two source-level inline scripts — a hash-only CSP would break the site. See "Proposed CSP" section below for the exact implementation. | `next.config.mjs:19-45` (add a `Content-Security-Policy` entry); new `middleware.ts` |
| 2 | Low | Config accuracy | `PREVIEW_HOST` regex used in the `has: [{ type: "host", ... }]` matcher is `"cosmos\\.k13projects\\.com"` with no `^`/`$` anchors, but the code comment above it claims "Anchored, so `cosmos.k13projects.com.evil.com` cannot match it." Next's host matcher compiles this to a plain regex test, which is **not** anchored as written — a host containing that substring anywhere would still match. Actual impact is very low (Vercel only routes traffic for hostnames actually assigned to this project; there's no live attack path from this alone), but the comment overstates a protection that isn't implemented, and the fix is one line. | Change the value to `"^cosmos\\.k13projects\\.com$"` so the code matches its own comment. | `next.config.mjs:9` |
| 3 | Low | Static exposure | `public/styleguide.html` (Valentina's 131KB internal design-DNA reference, colors/type/motion tokens) ships into the production build and is publicly reachable at `/styleguide.html` on the live domain. It already carries its own `<meta name="robots" content="noindex">` and holds no secrets, so this is not a data leak, but it's an internal working document sitting on the client's public site under a guessable path. | Exclude it from the deploy (move it outside `public/`, e.g. to `docs/`, or gate it behind a build step that only copies it in preview builds) before cutover. Not urgent, but it's the kind of thing a curious visitor or a competitor finds and screenshots. | `public/styleguide.html` |
| 4 | Info | Secrets hygiene | `.gitignore` covers `.env` and `.env*.local` but not the broader `.env*`, so a stray `.env.production` or `.env.development` file would not be caught. No such file exists today and the project has no secrets (`NEXT_PUBLIC_SITE_URL` is the only env var, and it's public by its own `NEXT_PUBLIC_` prefix), so there is nothing exposed right now. Flagging only because CLAUDE.md itself notes "if forms are added, no service keys client-side" — this is the pattern to have ready before that day. | Broaden the pattern to `.env*` (keep `!.env.example` if one is ever added). | `.gitignore:12-14` |
| 5 | Info | Dependencies | `npm audit --omit=dev` reports **0 vulnerabilities**. `package-lock.json` is committed, so `npm ci` gives a reproducible build. Dependency versions use caret ranges (`^15.5.22` etc.) rather than exact pins, but with a committed lockfile this is standard practice and not a real risk — noted for completeness, no action needed. | None required. | `package.json:11-25` |
| 6 | Info | Git history | The repo has no commits yet (`git log` returns "does not have any commits yet"). This means the "no secrets in git history" checklist item is trivially true today — there is no history to scan — but it also means it has not actually been exercised. Re-run a secrets scan (`git log -p \| grep -i` for key patterns, or `gitleaks`) after the first push, since a fresh `git add -A` sweeps in everything untracked and nobody has reviewed that diff yet. | Confirm with a diff review before the first commit lands (release-engineer's job, not this audit's). | repo root |

---

## Proposed Content-Security-Policy

The two source-level inline scripts are both static and non-user-influenced, confirmed by reading `lib/content.ts` (every value is a hardcoded literal, no `request`, `searchParams`, or user input feeds either script):

1. `app/layout.tsx:109-113` — `document.documentElement.classList.add('js')`, a fixed string literal, never changes.
2. `app/layout.tsx:116-119` — the JSON-LD block, built from `structuredData()`, which only reads `locations` and `site` out of `lib/content.ts` (static data, edited by hand, not from any request).

Reading the actual prerendered output at `.next/server/app/index.html` (static read, no server touched) also surfaces a detail that matters for getting this right: Next 15's App Router injects roughly 25 additional inline `<script>` tags per page (`self.__next_f.push(...)`) to stream the React Server Component payload for hydration. A CSP built only from hashes of the two source scripts would pass those two and **break the site**, because none of those framework-generated scripts would be covered. Next.js's own documented answer to this is a nonce read from middleware, which the framework automatically applies to every script it generates — you only have to wire the nonce onto the two custom scripts yourself.

**1. Add `middleware.ts` at the project root:**

```ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");

  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'unsafe-inline'`, // Tailwind + inline style="" attrs (aspect-ratio, gradients) — see note below
    `img-src 'self' data:`,
    `font-src 'self'`, // next/font self-hosts both faces, no fonts.gstatic.com needed
    `connect-src 'self'`,
    `frame-ancestors 'self'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `object-src 'none'`,
    `upgrade-insecure-requests`,
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  matcher: [
    // Skip static assets and the Next.js image optimizer; apply to real pages.
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|avif)$).*)",
  ],
};
```

**2. Read the nonce and set it on the two custom scripts in `app/layout.tsx`:**

```tsx
import { headers } from "next/headers";
// ...
const nonce = headers().get("x-nonce") ?? undefined;
// ...
<script nonce={nonce} dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('js')` }} />
// ...
<script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }} />
```

Next automatically forwards the same nonce to every script tag it generates for that request (RSC hydration chunks included), so nothing else changes.

**3. `style-src 'unsafe-inline'` is a deliberate, documented exception.** `CosmosLogo.tsx`/`LogoSprite` set `style={{ aspectRatio, position: "absolute", ... }}` as React inline style attributes, and the hero veil gradient is also an inline `style`. CSP nonces do not cover `style=""` attributes (only `<style>` blocks and `<link>`), so the only strict alternative is `'unsafe-hashes'` (patchy browser support) or moving every inline style to a Tailwind class (e.g. `aspect-[1.68]` instead of `style={{aspectRatio}}`). Given this is CSS, not script, the exploit surface is materially lower than `script-src`; accepting `unsafe-inline` on `style-src` only, while keeping `script-src` strict, is the standard real-world tradeoff (it's what Next.js's own CSP docs example does). If James wants the fully strict version later, the fix is replacing the handful of `style={{}}` inline attributes with static Tailwind classes — small, mechanical, not urgent.

**Tradeoff to flag to Kazim:** adding `middleware.ts` means the CSP header (and the nonce) is generated per-request at the Vercel Edge, not baked into the static HTML at build time. The page content itself stays fully static (same `next build` output, same CDN caching of the HTML/JS/CSS); only the response headers are computed per-request, which is normal and cheap on Vercel. This does not change hosting cost materially for a marketing site at this traffic level.

---

## What is fine, and why

- **No RLS/Supabase/auth section applies.** There is no backend, no database, no accounts. Nothing in the checklist about JWTs, service-role keys, or row-level security is relevant to this build, and confirming that absence (no Supabase client, no API routes, no `app/api/`) is itself the finding.
- **No forms exist**, so there is no input-validation, spam-protection, or injection surface to review. Catering intentionally routes out to ezCater rather than collecting anything in-app (`lib/content.ts:113-121`).
- **No cookies are set.** Nothing to check for `Secure`/`HttpOnly`/`SameSite`; the privacy page states plainly that the site collects nothing.
- **Both `dangerouslySetInnerHTML` uses are static and audited** (`app/layout.tsx:109-119`): the `js` class toggle is a hardcoded string, and the JSON-LD is built only from `lib/content.ts`'s hardcoded `locations`/`site` objects — no request data, no query params, no user input reaches either script.
- **Every external link carries `target="_blank" rel="noopener noreferrer"`**, verified across `Footer.tsx`, `Locations.tsx`, `OrderPanel.tsx`, and `CateringSection.tsx` — six occurrences, all six correctly paired, no reverse-tabnabbing exposure.
- **Every external URL in `lib/content.ts` is HTTPS and matches an expected domain**: `ezcater.com`, `doordash.com`, `instagram.com`, `facebook.com`, `tiktok.com`, `tigerhospitalitygroup.com`, plus `google.com/maps` query links built by `Locations.tsx`. No tracking parameters, no shortened/obfuscated URLs, no unexpected third-party hosts.
- **The logo `<use>` sprite has no external `href`.** `CosmosLogo.tsx`/`lib/logo.ts` inline the wordmark as raw SVG path data extracted from the client's own file at build time (`scripts/build-assets.sh`); the `<use href="#cosmos-wordmark">` reference is same-document only, not a remote SVG sprite (which would be an XSS vector if it were remote and mutable).
- **`next.config.mjs`'s `images.remotePatterns`/`domains` is unset**, meaning `next/image` will only ever serve images from `public/`. No remote image optimization endpoint is exposed, so there's no SSRF-via-image-proxy surface.
- **`npm audit --omit=dev` returns 0 vulnerabilities** as of 2026-09-02, and `package-lock.json` is committed for a reproducible build.
- **`poweredByHeader: false`** removes the `X-Powered-By: Next.js` fingerprinting header (`next.config.mjs:13`).
- **The preview-host `X-Robots-Tag: noindex, nofollow` rule and `robots.ts`/`isProduction` gate** correctly stop the `cosmos.k13projects.com` stakeholder preview from competing with `burgerscosmos.com` in search — belt-and-braces between the header and the generated `robots.txt` (`app/robots.ts:4-14`, `lib/content.ts:34-35`).
- **Modals are properly accessible and don't create a security-adjacent trap**: `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, real focus trap with Tab/Shift+Tab cycling, Escape closes, focus restores to the trigger element on close, and the mobile nav sheet uses the HTML `inert` attribute while closed so its links can't be tabbed into while invisible (`Modal.tsx:32-59`, `Nav.tsx:157-160`).
- **No third-party content is embedded** — no iframes, no third-party widgets, no analytics/tracking scripts of any kind loaded on the page. DoorDash and ezCater are outbound links only, opened in a new tab; nothing from those services runs inside this site's own page.
- **Fonts are self-hosted via `next/font`** (Poppins + Archivo), confirmed against the built HTML: zero requests to `fonts.googleapis.com`/`fonts.gstatic.com` on the live page (the reference-only `public/styleguide.html` does pull Google Fonts by CDN link, but that's an internal doc page, not the shipped site — see finding #3).

---

## Launch checklist

Run once the site is actually deployed to Vercel (cannot be verified pre-deploy):

1. `curl -sI https://<preview-or-prod-url>/` and confirm all six headers are present: `x-content-type-options`, `x-frame-options`, `referrer-policy`, `permissions-policy`, `strict-transport-security`, and (once added) `content-security-policy`.
2. `curl -sI https://cosmos.k13projects.com/` and confirm `x-robots-tag: noindex, nofollow` is present on the preview host specifically (and absent on the eventual production domain).
3. Confirm HTTP → HTTPS redirect happens automatically (Vercel does this by default for all custom domains; no action needed, just verify once the domain is attached).
4. HSTS `preload` is already set in the header (`max-age=63072000; includeSubDomains; preload`) — optional follow-up once the production domain (`burgerscosmos.com` or whatever it becomes at cutover) is live and stable: submit it at hstspreload.org. Not urgent, and irreversible-ish (hard to remove once browsers ship it), so this is a decision for Kazim/Kate at actual cutover, not before.
5. Re-run `npm audit --omit=dev` right before the production deploy, not just today, since new advisories can land between now and ship day.
6. If the CSP from this report is added, load the live page in a real browser and check the console for CSP violation reports before calling it done — the nonce-forwarding behavior for Next's RSC scripts should be verified against a real deploy, not just reasoned about statically.

---

## Disclaimer

Prepared for informational purposes by K13 Software Studio as of 2026-09-02. This is an engineering security review performed by static analysis of the source tree and the prerendered build output, not a formal penetration test or compliance certification. No live server on port 9157 was started, stopped, or modified to produce this report.
