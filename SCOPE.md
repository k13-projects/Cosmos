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
Two of the original four closed on 2026-09-08 and are kept here as a record rather than deleted,
so a later reader does not re-ask them:

1. **Ordering URLs: still open.** Toast pickup and Toast delivery are missing for every hall.
   DoorDash is now wired for four of the five (Carlsbad and Oceanside were already public;
   Little Italy and San Clemente came from Lorena on 2026-09-08). Station 8 has not opened, so
   its row stays "coming soon" on purpose.
2. **Contact info: still open.** The footer ships with socials only until she supplies an
   address, phone and email for CONTACT INFO. Her team had not confirmed as of 2026-09-08.
3. ~~Plate names~~ **closed 2026-09-08**: Lorena confirmed all six wheel plates are named
   correctly as they are.
4. ~~Chicken sandwich photo~~ **closed 2026-09-09**: she sent two Drive files. The first is
   byte-identical to the file the band is already cut from, so the wider original the blueprint
   used does not exist on her side either; the second is a different sandwich. The band stays as
   built and `cosmos 2-003.jpg` is on file for a future use.

Also closed since: the **location drawings** (2026-09-10, hers now ship for four of the five
halls, Miramar stays ours at her request) and the **Frings photo** (2026-09-10, the last menu
item that rendered a placeholder tile).

Menu content (prices + descriptions) is DONE, closed 2026-09-02 (`COSMOS MENU.png`).
