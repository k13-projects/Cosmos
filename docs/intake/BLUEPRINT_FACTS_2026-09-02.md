# Cosmos Burger website: blueprint facts (James's intake read, 2026-09-02)

> Source of truth for the build. Everything here was read directly from the client files in
> `Cosmos Assets/` (Lorena, Tiger Hospitality Group) or from the current live site. Where a fact
> is inferred or conflicting it is marked. Agents: read this before anything else, then the
> rendered mockup slices in `Cosmos Assets/_derived/mockup/` (page 1 = `mock_p1_s01..06`,
> page 2 = `mock_p2_s01..03`, top to bottom).

## 1. Who and what
- **Client:** Tiger Hospitality Group (THG), K13's first and largest client (7+ K13 repos:
  THG-Website, Miramar, GlobalFork, STATION8, LobsterLab, Egg-Out, La Vida). Stakeholder on the
  desk: **Eren** (THG). **Lorena** is THG's designer; she authored the Global Fork and Lobster Lab
  briefs and now this one. Same designer, same brief format as Lobster Lab, so LobsterLab is the
  nearest sibling and the pattern library to mirror (`/Users/k13/Desktop/PROJECTS/LobsterLab`).
- **Concept:** Cosmos Burger ("Burger · Chicken · Beer" on the logo). Smash burgers, chicken
  sandwiches, tenders, loaded fries. Signature items: Spicy Jam Burger, Monkey Fries.
- **Current live site:** https://www.burgerscosmos.com (WordPress, built by UPMAX Now). It only
  knows two locations (Oceanside 208 N Coast Hwy, Carlsbad 890 Palomar Airport Rd) and links
  DoorDash / Uber Eats / Grubhub. The new site replaces it.
- **Instagram** https://www.instagram.com/burger.cosmos · **Facebook**
  https://www.facebook.com/CosmosBurger/ · **TikTok** https://www.tiktok.com/@cosmosburger.sandiego
  (all from the live site; the docx left FOLLOW US blank).

## 2. Client files (Cosmos Assets/)
| File | What it is |
|---|---|
| `COSMOS WEBSITE (1).pdf` | **The blueprint.** Canva scroll mockup by Lorena, 1024 x 5866 + 1024 x 2226 pt, dated 2026-09-01. Rendered slices in `_derived/mockup/`. |
| `COSMOS WEBSITE STRUCTURE.docx` | Copy deck + structure (verbatim text in `docs/intake/client_structure_docx.txt`). |
| `COSMOS - WEBSITE IDEAS.pptx` | 5 slides of intent + 6 reference screenshots (`_derived/reference-sites/`): le-smash.com hero + best-seller carousel (image3, image5), en.junkburgers.com menu grid (image1, image6), bareburger.com and burgershop.restaurant location cards (image2, image4). |
| `LOGO & BRAND IDENTITY/Cosmos Burger Brand Guidelines.pdf` | 7 pages by Caner Ozcan: logo usage, palette, typography, brand style sliders, icon set + pattern (`_derived/brand-guide/`). |
| `LOGO & BRAND IDENTITY/COSMOS BURGER LOGO.svg` | Script wordmark, 1080 x 1080 viewBox, fills `#F5E829` yellow with `#964895` / `#A6539B` purple outline. Plain "Cosmos" script + swoosh, no tagline. |
| `LOGO & BRAND IDENTITY/COSMOS BURGER LOGO.ai` (2 pages) | p1 = wordmark with "BURGERS & CHICKEN" in the swoosh; p2 = plain wordmark. |
| `LOGO & BRAND IDENTITY/Background.png` | 2762 x 5587 transparent PNG: the yellow line-art burger pattern (alpha max 93/255, i.e. already faint). Tiles behind purple sections. |
| `PHOTOS/Best Sellers/*.png` | 5 transparent cutouts (1366 x 768): BLUE CHEESE, COSMOS BURGER, MONKEY FRIES, SPICY JAM, THE CHICKS. |
| `PHOTOS/Burgers circle/1..6.png` | 6 transparent burger-on-plate cutouts (the floating cascade in the About section). |
| `PHOTOS/cosmos 1-84.jpg` | Hero: stacked burgers under string lights (2244 x 1497). |
| `PHOTOS/Chick fries,cosmos,truffle,monkey.jpg` | Four fries bowls, top-down (photo band under Best Sellers). |
| `PHOTOS/Cosmos General.png` | Spread of plates (photo band above Catering). |
| `PHOTOS/cosmos 2-121.jpg` | Chicken sandwich hero (band above Reviews). |
| `PHOTOS/cosmos 1-64.jpg` | Phone photographing a burger (band above footer). |

## 3. Brand system (from the guide + sampled from the mockup)
- **Palette (guide):** Primary magenta `#CD1AE0` · Secondary yellow `#FAF00C` · Third deep purple
  `#751080`. Tint scales 100/80/60/40/20 %. ("DB5928" on the third row is a Canva artifact, ignore.)
- **Sampled from the mockup** (Canva rendered): purple `#740F80`, magenta `#CC1ADF`, yellow
  `#FAF00C`, **cream page ground `#FFF2E1`**, **review-card tan `#EDD9BF`**, body on purple = white,
  body on cream = purple. Use the guide hexes as tokens; cream and tan come from the mockup.
- **Logo fills:** SVG yellow is `#F5E829` with purple outline `#964895`; the guide shows the
  wordmark yellow-on-magenta, yellow-on-charcoal `#3B3B3B`, magenta-on-yellow, yellow-on-purple.
- **Typography (guide):** **Horizon** (display, wide heavy geometric, Adobe Fonts) for headlines,
  **Poppins** (body, buttons, nav), **Bookmania** (serif, listed but unused in the mockup).
  Mockup usage: headlines in Horizon caps (yellow on purple, purple/magenta on cream, an
  outline+solid stack on "BLUE CHEESE"), Poppins SemiBold for nav/buttons/sub-headlines, Poppins
  Regular body, Poppins Italic for "Find us" and the reviews sub-line.
- **Brand style sliders:** casual-leaning, warm, progressive, accessible, simple.
- **Brand assets:** 12 yellow line icons (burgers, bag, box, pin, fries, drink, sauces, hot dog);
  the burger line-art pattern. The values band uses three icons: burger, sound-wave heart, leaf.
- **Shapes:** everything is a pill or a large-radius rounded rectangle (nav bar pill, buttons,
  location cards ~40px radius, review cards, the "OUR BEST SELLERS" tab).

## 4. The page, top to bottom (mockup + docx + slides)
Single page with anchors. Nav: **About us · Our Menu · Locations · Catering · Contact** + yellow
**ORDER ONLINE** pill. Logo top-left (yellow script). Nav bar is a purple pill floating over the hero.
1. **Hero** — full-bleed `cosmos 1-84.jpg`. Slide 2 asks for a "Banner: Picture and **Animated
   logo**" (this is the P3 signature moment).
2. **About** (`#about`, purple `#751080`): headline **UNLEASH THE FLAVOR** (yellow Horizon), four
   white body paragraphs (docx, verbatim), and a vertical cascade of six floating burger plates
   (`Burgers circle/1..6.png`) down the right edge, spilling into the next band.
3. **Values band** (magenta `#CD1AE0`): three columns with yellow icons and yellow Poppins Bold
   titles: **Bold Flavour / Real Vibes / Fresh always** + white body (docx).
4. **OUR BEST SELLERS** (cream): a magenta tab pill with yellow text sits on the seam; below it a
   carousel styled after le-smash.com: giant name in Horizon (first word outlined, second solid,
   purple), the cutout on its plate, arrows. Five slides: SPICY JAM, BLUE CHEESE, MONKEY FRIES, THE
   CHICKS, COSMOS BURGER. Slide 2 calls them "Best sellers pictures siluet". A faint caption sits
   left of the plate in the mockup (leftover placeholder text; not required).
5. **Photo band** `Chick fries…jpg` (fries bowls).
6. **EXPLORE OUR MENU** (`#menu`, purple with the burger pattern): yellow Horizon headline, white
   body (docx), two yellow pills: **CHECK OUT OUR MENU** (opens the **menu pop-up**) and **ORDER
   ONLINE** (opens the **location pop-up**).
7. **Photo band** `Cosmos General.png` (spread).
8. **CATERING** (`#catering`, cream): purple Horizon "CATERING", magenta Poppins Bold "Big Cravings.
   Bigger Gatherings", purple body (docx), purple pill with yellow text **ORDER CATERING** →
   https://www.ezcater.com/brand/pvt/cosmos-burger (verified live: "Cosmos Burger Catering", lists
   Carlsbad + Oceanside).
9. **LOCATIONS** (`#locations`, purple + pattern): yellow Horizon "LOCATIONS" with italic "Find us";
   a horizontal row of cream rounded cards with « » arrows (reference: bareburger / burgershop cards
   with a photo, name, address, hours, button). Four cards (docx):
   - **CARLSBAD** · Windmill Food Hall · 890 Palomar Airport Rd, Carlsbad, CA 92011 · 11:00 AM – 9:00 PM
   - **SAN CLEMENTE** · Miramar Food Hall · 1720 North El Camino Real, San Clemente, CA 92672 · 11–9
   - **LITTLE ITALY** · Global Fork Food Hall · 550 W Date St Suite B, San Diego, CA 92101 · 11–9
   - **UCSD CAMPUS** · Station 8 Public Market · 9165 Theatre District Drive, La Jolla, CA 92037 · 11–9
10. **Photo band** `cosmos 2-121.jpg` (chicken sandwich).
11. **REVIEWS** (cream): magenta Horizon "REVIEWS", italic purple sub-line "The best part of Cosmos?
    Hearing it straight from the people who come back for another bite.", tan cards with five
    magenta stars. Four quotes in the docx (2 Google, 2 Yelp), verbatim.
12. **Photo band** `cosmos 1-64.jpg` (phone).
13. **Footer** (`#contact`, purple + pattern): big yellow logo, FOLLOW US (socials), CONTACT INFO
    (docx left it blank; see gaps).

## 5. The two pop-ups (docx)
- **CHECK OUT OUR MENU → menu pop-up.** "This will open a pop-up with the menu." No menu file was
  supplied. Reference (Junk Burgers): photo grid per category, name + short description, an Order
  button per category. Live-site categories/items, no prices anywhere:
  Burgers: BBQ, Better Mac, Blue Cheese, Cosmos, Spicy Jam, The Basic, Truffle, Vegetarian ·
  Chicken Sandwiches: BBQ, Garlic Parm, Hot Chicks, The Chicks, Truffle Honey · Artisan Hot Dog:
  The OG · Chicken Tenders: BBQ, Garlic Parm, Hot Chicks, The Chicks, Truffle Honey · Sides: Chick
  Fries, Cosmos Fries, Monkey Fries, Regular Fries, Tater Tots, Truffle Fries, Onion Rings, Coleslaw.
- **ORDER ONLINE → location pop-up.** Per location: **Toast** (Delivery · Pick up) and **DoorDash**.
  Five rows: Carlsbad Windmill Food Hall · **Oceanside** · San Clemente Miramar Food Hall · Little
  Italy Global Fork · UCSD Campus Station 8 ("Online ordering coming soon"). Every URL field in the
  docx is blank. Known public links today (live site): DoorDash Carlsbad
  https://www.doordash.com/store/cosmos-burger-carlsbad-26018232/29386346/ ; DoorDash Oceanside
  https://www.doordash.com/store/cosmos-burger-oceanside-oceanside-25982698/51403146/ (locale prefix
  stripped). Toast storefronts for the food halls are not public; LobsterLab's pattern is
  `toast.app/r/<slug>/order` per hall. Empty = honest "coming soon", never a dead button.

## 6. Conflicts and gaps (decisions taken by James; batched for Kazim/Lorena)
1. **Oceanside** is in the ORDER pop-up list but **not** in the LOCATIONS section of the docx or the
   mockup. The live site treats Oceanside as a flagship. Decision: follow the docx literally
   (order pop-up lists it, Locations section shows the four halls); confirm with Lorena.
2. **No menu content.** Build the menu pop-up from the live site's item list with the photos we
   have, no prices, so the button never dead-ends; ask Lorena for the menu (PDF or item list with
   descriptions and prices).
3. **No ordering URLs.** Toast + DoorDash per hall are blank; ask Lorena (same ask as Lobster Lab,
   pending ledger p15). Grubhub / Uber Eats exist on the live site but are not in her brief; keep
   the channels defined, render only what has a URL.
4. **Contact info blank.** Live site phones: Oceanside (760) 607-7083, Carlsbad (760) 607-9227
   (also lists (415) 747-4951). No email anywhere. Footer ships with socials + a "Contact us"
   mailto only once an address is supplied; ask.
5. **Fonts:** Horizon is an Adobe Font (not free). Stand-in shipped via next/font: **Archivo** at
   its widest width axis, weight 900 (closest free wide-geometric). Swap point isolated in one
   token. Ask whether THG has Adobe Fonts (the guide was set in Horizon).
6. **House copy rules vs. Lorena's copy:** her copy uses en dashes ("San Diego – perfect for food
   near me") and mixes "Flavour" (values band) with "FLAVOR" (headline). House rule bans em/en
   dashes in visitor-facing copy: rewrite around them with commas. Spelling kept as hers; flag.
   "food near me" SEO phrasing kept verbatim (client copy).
7. **Station 8 address** differs between the docx (9165 Theatre District Drive) and THG-Website
   (9145 Scholars Drive South). Docx wins (newer, client's own).
8. **Reviews attribution:** docx supplies no names, so cards read "Google reviewer" / "Yelp
   reviewer" (same posture as Lobster Lab, Civil Code s.3344).
9. **Hours** in the docx are a single "11:00 AM – 9:00 PM" for all four halls; the live site's
   Oceanside hours differ (Mon–Thu 11–8:45, Fri–Sat 11–9:45). Halls follow the docx.

## 7. House decisions (recorded, not asked)
- Stack: **Next.js 15 App Router + Tailwind v4 + Lenis + motion**, mirroring LobsterLab (same
  client, same designer, same one-pager-with-pop-ups shape). Deploy Vercel. Forms: none required by
  the brief (catering goes to ezCater).
- Shortcode **`cosmos`**, dev port **9157** (next free row after ICP's 9156), berth **39157** with
  profile `~/.gstack/berths/cosmos`. Branch pattern `cosmos_<monDD>_v<N>`.
- `Cosmos Assets/` is gitignored (70 MB of client binaries); `scripts/build-assets.sh` derives
  `public/` from it, LobsterLab-style (webp photos, PNG cutouts kept with alpha, SVG logo, pattern).
- Motion: K13 DNA (rise+fade reveals staggered idx*0.08s, the signature sheen sweep on the logo
  and yellow pills, 0.3s interactions, `--ease-brand: cubic-bezier(0.22,1,0.36,1)`), all gated
  behind `prefers-reduced-motion`. P3 signature = the animated hero logo.
- Copy lives in one `lib/content.ts` with provenance comments; components never hardcode strings.
- Legal routes as LobsterLab: `/accessibility`, `/privacy`, `/terms` (human legal review flag).

## 8. Geometry addendum (added after Kazim's second review, 2026-09-02)
Missing from the first read, and the reason two bands shipped wrong: the PDF's crops and
densities, measured on the 1332 px slices (1024 pt at 1.3x).
- **Photo bands are crops with their own aspect** (height as a fraction of width): hero ≈ 0.78,
  fries ≈ 0.35, spread = alpha sticker over the pattern, chicken sandwich ≈ 0.49 (whole sandwich
  centered, bowls left/right, hot dog behind), phone ≈ 0.62 (hand + phone + plate). Crop the
  source to the PDF's framing in `scripts/build-assets.sh`; never a uniform vh with object-cover.
- **Locations rail:** cream cards ≈ 33% of the width, ≈ 22% tall, gap ≈ 40 px, first card at
  ≈ 11% from the left, two full cards + a third cut at the edge, « arrow at left, mid-height.
- **Reviews:** heading + italic sub-line in a left column (≈ 32%), tan cards ≈ 30% wide from
  ≈ 50% of the width, scrolling right.
- **Hero:** photo + nav only. No wordmark in the hero (the slide deck's "animated logo" line is
  overruled by the PDF; Kazim 2026-09-02).
- **About plates:** an arc on the right edge (the client folder is "Burgers circle"); built as an
  endless wheel with scroll-added velocity and instant CAPS tooltips.
