# PROJECT_BRIEF.md, Cosmos Burger

## What
A new marketing one-pager for **Cosmos Burger** (smash burgers, chicken sandwiches, tenders,
loaded fries), replacing the current WordPress site at burgerscosmos.com. Built from Lorena's
Canva blueprint, the copy deck, and the brand guidelines in `Cosmos Assets/` (gitignored, see
`docs/intake/BLUEPRINT_FACTS_2026-09-02.md` for the full source read).

## For
**Tiger Hospitality Group** (THG), K13's largest client. Stakeholder on the desk: **Eren**
(THG). Brief authored by **Lorena** (THG's designer, same designer/format as Global Fork and
Lobster Lab). Sibling project to mirror: `LobsterLab` (same client, same one-pager-with-pop-ups
shape, its own brand).

## Success criteria
- The full blueprint renders section-by-section in code: hero, About, Values, Best Sellers
  carousel, Menu CTA band, Catering, Locations (5 locations (4 food halls plus Oceanside)), Reviews, footer, plus the two
  pop-ups (menu, order online).
- Cosmos Burger's own brand ships (magenta `#CD1AE0` / yellow `#FAF00C` / purple `#751080` /
  cream `#FFF2E1`, Horizon-style display via the Archivo stand-in, Poppins body) — never THG's
  black/gold or Lobster Lab's navy/orange.
- No dead buttons: every CTA that lacks a client-supplied URL degrades to an honest "coming
  soon" rather than linking nowhere.
- Motion (P2/P3) matches K13 DNA: rise+fade reveals, sheen sweep, all gated behind
  `prefers-reduced-motion`. P3 signature moment: the animated hero logo.
- Passes the P5 done checklist (favicon, OG, sitemap/robots, a11y/508, fitcheck, security
  headers, 404/500) before ship.
- Deployed to Vercel on its own dev port for life (9157) and, later, its production domain.

## Page map (single page, anchors; source: blueprint facts §4)
1. **Hero** — full-bleed photo, animated logo (P3 signature).
2. **About** (`#about`, purple) — "UNLEASH THE FLAVOR" + 4 body paragraphs + floating burger
   cascade (6 plates).
3. **Values band** (magenta) — Bold Flavour / Real Vibes / Fresh always, 3 columns with icons.
4. **OUR BEST SELLERS** (cream) — le-smash-style carousel, 5 items (Spicy Jam, Blue Cheese,
   Monkey Fries, The Chicks, Cosmos Burger).
5. **Photo band** — fries bowls.
6. **EXPLORE OUR MENU** (`#menu`, purple + pattern) — CHECK OUT OUR MENU (menu pop-up) + ORDER
   ONLINE (location pop-up) CTAs.
7. **Photo band** — plate spread.
8. **CATERING** (`#catering`, cream) — ORDER CATERING → ezCater (live URL).
9. **LOCATIONS** (`#locations`, purple + pattern) — 4 food-hall cards (Carlsbad, San Clemente,
   Little Italy, UCSD Campus).
10. **Photo band** — chicken sandwich.
11. **REVIEWS** (cream) — 4 quotes, tan cards, 5-star.
12. **Photo band** — phone photographing a burger.
13. **Footer** (`#contact`, purple + pattern) — logo, FOLLOW US (socials), CONTACT INFO.

Pop-ups: **menu pop-up** (category grid, no prices, live-site item list) and **location pop-up**
(Toast + DoorDash per hall, "coming soon" where no URL exists).

## House decisions already taken (do not re-litigate; see facts §6-7)
Oceanside follows the docx literally (order pop-up only); menu pop-up ships without prices;
Station 8 address follows the docx; reviews are attributed "Google reviewer"/"Yelp reviewer";
hours follow the docx's single 11-9 for all four halls; Horizon is stood in with Archivo
(`axes: ["wdth"]`, weight 900) pending an Adobe Fonts answer; house copy rules (no em/en dashes)
override Lorena's copy, spelling kept as hers.
