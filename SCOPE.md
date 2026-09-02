# SCOPE.md, Cosmos Burger

## In scope
- One-pager (Next.js App Router) covering all 13 sections in `PROJECT_BRIEF.md`'s page map.
- Two pop-ups: menu (category grid, no prices) and order-online (per-location Toast/DoorDash).
- Cosmos Burger's own brand system (tokens, Horizon stand-in, Poppins body, pattern, icons).
- Motion layer (P2) + one signature interaction (P3: animated hero logo).
- Legal routes: `/accessibility`, `/privacy`, `/terms` (human legal review before ship).
- 404 page, security headers, sitemap/robots, OG/social images, favicon (light/dark).
- Asset pipeline (`scripts/build-assets.sh`) deriving `public/` from the gitignored
  `Cosmos Assets/` client library.

## Out of scope (this build)
- Contact/enquiry forms, backend, database. No forms are required by the brief; catering routes
  to ezCater's own site.
- Prices anywhere on the site (none supplied; menu pop-up is descriptive only).
- Grubhub / Uber Eats integration (on the live site today, not in Lorena's brief; channels stay
  defined in `lib/content.ts` but only render with a real URL).
- Multi-route site (old WordPress structure). This is a one-pager with anchors, matching the
  blueprint.
- Any content for locations beyond the four food halls named in the docx (Oceanside handled per
  the order pop-up only, see decisions below).

## Risks
- **No menu content supplied.** Menu pop-up is built from the live site's item list (names only,
  no descriptions/prices), so it may need a full content pass once Lorena sends the real menu.
- **No ordering URLs supplied.** Toast/DoorDash links are blank for 3 of 5 rows; buttons degrade
  to "coming soon" until Lorena provides them, same open item as Lobster Lab's ordering URLs
  (pending ledger p15).
- **Horizon is a paid Adobe Font**, not confirmed available to THG. The Archivo stand-in is
  isolated to one token (`--font-display`) so swapping later is a one-line change, but headline
  proportions will shift slightly if Horizon becomes available.
- **Contact info is blank** (docx). Footer ships with socials only until Lorena supplies an
  address/phone/email for "CONTACT INFO."
- **Oceanside inconsistency** (in the order pop-up, absent from Locations) is followed literally
  per the docx; flagged for Lorena to confirm it is intentional.

## Open questions for Lorena (batched, do not drip)
1. Menu content: can you send the menu (PDF or item list) with descriptions and prices for the
   pop-up?
2. Ordering URLs: Toast + DoorDash links for San Clemente (Miramar), Little Italy (Global Fork),
   and UCSD Campus (Station 8). Carlsbad DoorDash and Oceanside DoorDash are already public.
3. Contact info: what should the footer's CONTACT INFO show (address, phone, email)?
4. Oceanside: it appears only in the order pop-up list, not in the Locations section. Is that
   intentional, or should Oceanside get a location card too?
5. Fonts: does THG have an Adobe Fonts license for Horizon, or should the Archivo stand-in ship
   as the permanent display face?
