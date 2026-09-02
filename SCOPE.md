# SCOPE.md, Cosmos Burger

## In scope
- One-pager (Next.js App Router) covering all 13 sections in `PROJECT_BRIEF.md`'s page map.
- Two pop-ups: menu (priced category grid, from Lorena's printed menu) and order-online
  (per-location Toast/DoorDash).
- Cosmos Burger's own brand system (tokens, Horizon stand-in, Poppins body, pattern, icons).
- Motion layer (P2) + one signature interaction (P3: animated hero logo).
- Legal routes: `/accessibility`, `/privacy`, `/terms` (human legal review before ship).
- 404 page, security headers, sitemap/robots, OG/social images, favicon (light/dark).
- Asset pipeline (`scripts/build-assets.sh`) deriving `public/` from the gitignored
  `Cosmos Assets/` client library.

## Out of scope (this build)
- Contact/enquiry forms, backend, database. No forms are required by the brief; catering routes
  to ezCater's own site.
- Grubhub / Uber Eats integration (on the live site today, not in Lorena's brief; channels stay
  defined in `lib/content.ts` but only render with a real URL).
- Multi-route site (old WordPress structure). This is a one-pager with anchors, matching the
  blueprint.
- Any content for locations beyond the five food halls now covered (the docx's original four plus
  Oceanside, added 2026-09-02, see decisions below).

## Risks
- **No ordering URLs supplied.** Toast/DoorDash links are blank for 3 of 5 halls; buttons degrade
  to "coming soon" until Lorena provides them, same open item as Lobster Lab's ordering URLs
  (pending ledger p15).
- **Contact info is blank** (docx). Footer ships with socials only until Lorena supplies an
  address/phone/email for "CONTACT INFO."
- **Plate names are a photo match, not a client confirmation.** The six wheel plates were named
  by matching them one-glance against the old site's item shots (James, 2026-09-02); flagged for
  Lorena to confirm against the real menu.

## Open questions for Lorena (batched, do not drip)
1. Ordering URLs: Toast + DoorDash links per food hall. Carlsbad DoorDash and Oceanside DoorDash
   are already public; everything else, including both Toast links for every hall, is open.
2. Contact info: what should the footer's CONTACT INFO show (address, phone, email)?
3. Plate names: the six wheel plates are named by matching them against the old site's item
   shots, one glance per plate, not a client-confirmed list. Can you confirm the six names?
4. Chicken sandwich photo: the photo band above Reviews is cropped from a narrower file than the
   blueprint used, so it can't reproduce the blueprint's exact crop (see `build-assets.sh`). If
   you still have the original, wider chicken-sandwich photo used in the PDF, that would let the
   band match the blueprint's own framing exactly.

Menu content (prices + descriptions) is DONE, closed 2026-09-02 (`COSMOS MENU.png`).
