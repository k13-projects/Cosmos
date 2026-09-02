/**
 * Single source of truth for every visitor-facing string and link on the site.
 * Components read from here; they never hardcode copy. See CLAUDE.md, "Copy
 * lives in lib/content.ts".
 *
 * PROVENANCE
 *   copy       -> Cosmos Assets/COSMOS WEBSITE STRUCTURE.docx, transcribed to
 *                 docs/intake/client_structure_docx.txt (Lorena, THG)
 *   structure  -> Cosmos Assets/COSMOS WEBSITE (1).pdf, the Canva blueprint,
 *                 read into docs/intake/BLUEPRINT_FACTS_2026-09-02.md SS4
 *   socials    -> the live site burgerscosmos.com (facts SS1); the docx left
 *                 FOLLOW US blank
 *   menu items -> the live site's item list (facts SS5). No menu file supplied.
 *   reviews    -> the docx, verbatim, attribution deliberately non-identifying
 *
 * HOUSE COPY RULES APPLIED (facts SS6.6)
 *   Lorena's copy uses en dashes ("San Diego - perfect for food near me").
 *   The house rule bans em and en dashes in visitor-facing copy, so those are
 *   rewritten with commas. Nothing else is changed: her spelling stands, and
 *   that includes the "Flavour" / "FLAVOR" mix and the "food near me" SEO
 *   phrasing. Both are flagged to her, not silently corrected.
 */

/**
 * The canonical production host. Preview deploys (cosmos.k13projects.com, any
 * Vercel preview URL) set NEXT_PUBLIC_SITE_URL to their own origin, which flips
 * `isProduction` false and makes robots.ts noindex them. Without that, a
 * preview copy competes with the real site for the same search results.
 *
 * TODO(client): swap PRODUCTION_URL to the live domain at cutover. The current
 * WordPress site answers on burgerscosmos.com.
 */
export const PRODUCTION_URL = "https://www.burgerscosmos.com";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || PRODUCTION_URL;
export const isProduction = SITE_URL === PRODUCTION_URL;

export const site = {
  name: "Cosmos Burger",
  operator: "Tiger Hospitality Group",
  operatorUrl: "https://tigerhospitalitygroup.com",
  url: SITE_URL,
  // From the logo lockup (facts SS1).
  tagline: "Burger, Chicken, Beer",
  // Built from the docx menu paragraph, which is the client's own SEO copy.
  description:
    "Smash burgers, crispy chicken sandwiches, tenders and loaded fries in San Diego. Home of the Spicy Jam Burger and Monkey Fries, at Cosmos Burger.",
  instagram: "https://www.instagram.com/burger.cosmos",
  instagramHandle: "@burger.cosmos",
  facebook: "https://www.facebook.com/CosmosBurger/",
  tiktok: "https://www.tiktok.com/@cosmosburger.sandiego",
} as const;

// Source: facts SS4, the floating purple nav pill.
export const nav = [
  { label: "About us", href: "#about" },
  { label: "Our Menu", href: "#menu" },
  { label: "Locations", href: "#locations" },
  { label: "Catering", href: "#catering" },
  { label: "Contact", href: "#contact" },
] as const;

/* -------------------------------------------------------------------------- */
/* Ordering                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * ===========================================================================
 * ORDERING, the one place to wire every storefront
 * ===========================================================================
 * Each location owns its own links. To connect one, paste its URL into the
 * matching `ordering` block below. Nothing else changes: the ORDER ONLINE
 * pop-up reads this and renders whatever exists.
 *
 * An empty string is not a bug. It renders an honest "coming soon" line
 * instead of a dead link, so a half-wired site never sends a guest to a
 * storefront that is not there.
 *
 * WHAT IS KNOWN TODAY (facts SS5). Every URL field in the docx is blank.
 * The two DoorDash links below are public on the current live site. Toast
 * storefronts for the food halls are not public. So three of five rows ship
 * with nothing connected, which is a gap on the client, not a mistake here.
 *
 * TODO(client, Lorena): Toast pickup + Toast delivery + DoorDash for San
 * Clemente (Miramar), Little Italy (Global Fork) and UCSD Campus (Station 8),
 * and the Toast links for Carlsbad and Oceanside. Same ask as Lobster Lab.
 *
 * Grubhub and Uber Eats exist on the current live site but are not in Lorena's
 * brief, so they are deliberately absent here rather than half-supported.
 */

/**
 * No third-party channel logo files were supplied for this build, and we do not
 * reuse another project's licensed marks, so each channel renders as a text
 * chip in the brand instead. `short` is what the chip shows.
 */
export const orderChannels = {
  toastPickup: { provider: "Toast", label: "Pick up", short: "Toast" },
  toastDelivery: { provider: "Toast", label: "Delivery", short: "Toast" },
  doordash: { provider: "DoorDash", label: "Delivery", short: "DoorDash" },
} as const;

export type OrderChannel = keyof typeof orderChannels;
export type OrderLinks = Partial<Record<OrderChannel, string>>;

/** Render order inside a row, so the two Toast options always sit together. */
export const ORDER_CHANNEL_ORDER: OrderChannel[] = [
  "toastPickup",
  "toastDelivery",
  "doordash",
];

// Verified live 2026-09-02: "Cosmos Burger Catering", lists Carlsbad + Oceanside.
export const catering = {
  title: "Catering",
  subtitle: "Big Cravings. Bigger Gatherings",
  // docx, verbatim
  body: "Let us take care of the food while you enjoy the moment. Choose your Cosmos favorites, feed your crew, and make your next gathering one worth talking about.",
  cta: "Order catering",
  provider: "ezCater",
  url: "https://www.ezcater.com/brand/pvt/cosmos-burger",
} as const;

/* -------------------------------------------------------------------------- */
/* Sections                                                                    */
/* -------------------------------------------------------------------------- */

// Headline from the blueprint (facts SS4.2); paragraphs from the docx, verbatim.
export const about = {
  headline: "Unleash the flavor",
  body: [
    "At Cosmos, we're all about serving up burgers made with fresh, premium ingredients and bold flavor combinations.",
    "From our juicy burgers and crispy chicken sandwiches to golden fries and chicken tenders, every bite is made to be satisfying, flavorful, and anything but boring.",
    "We're known for our signature Spicy Jam Burger and iconic Monkey Fries, but there's always something on the menu worth craving.",
    "Whether you're grabbing a quick bite, hanging with friends, or treating yourself to something seriously delicious, Cosmos is here for good food, good vibes, and big flavor.",
  ],
  /**
   * The plate wheel down the right edge (facts SS4.2, blueprint page 1).
   *
   * The blueprint hangs the six plates on an arc, as if on a wheel whose hub
   * sits off the right edge of the viewport, the lowest plate spilling over the
   * seam into the values band. The client folder is literally named "Burgers
   * circle". components/PlateWheel.tsx rebuilds that geometry.
   *
   * NAMES. Matched by photo against the old site's item shots (James,
   * 2026-09-02, `Cosmos Assets/OLD SITE MENU/`), one glance per plate rather
   * than pixel RMSE: plate 1 -> Blue cheese, plate 2 -> BBQ chicken sandwich,
   * plate 3 -> Better Mac burger, plate 4 -> Cosmos burger, plate 5 -> Spicy
   * jam, plate 6 -> Hot Chicks sandwich. `.display` already renders names in
   * caps, so these stay natural case here.
   *
   * TODO(client, Lorena): confirm all six against the real menu.
   */
  plates: [
    { src: "/menu/plates/1.png", width: 845, height: 507, name: "Blue cheese" },
    { src: "/menu/plates/2.png", width: 1003, height: 700, name: "BBQ chicken sandwich" },
    { src: "/menu/plates/3.png", width: 1083, height: 632, name: "Better Mac burger" },
    { src: "/menu/plates/4.png", width: 1178, height: 684, name: "Cosmos burger" },
    { src: "/menu/plates/5.png", width: 1200, height: 663, name: "Spicy jam" },
    { src: "/menu/plates/6.png", width: 1020, height: 646, name: "Hot Chicks sandwich" },
  ],
  /** Helper text under the wheel's first plate, for keyboard and screen reader. */
  platesHint: "Open the full menu",
} as const;

// docx, verbatim except the two en dashes, which become commas (house rule).
export const values = [
  {
    icon: "burger",
    title: "Bold Flavour",
    body: "Our burgers, packed with bold flavors, are a favorite in San Diego, perfect for food near me cravings.",
  },
  {
    icon: "vibes",
    title: "Real Vibes",
    body: "Feel the real vibes at Cosmos Burger. We're a community spot for burger lovers seeking authentic experiences.",
  },
  {
    icon: "fresh",
    title: "Fresh always",
    body: "At Cosmos Burger, freshness is our promise. Enjoy the freshest burgers in San Diego, always made to order!",
  },
] as const;

export type ValueIconName = (typeof values)[number]["icon"];

/**
 * The best-seller carousel (facts SS4.4, styled after le-smash.com).
 *
 * Each name is a two-word stack: the first word outlined, the second solid.
 * Single-word items in the client's list do not exist, but MONKEY FRIES and THE
 * CHICKS still split across two lines the same way, which is what the blueprint
 * does with "BLUE / CHEESE".
 *
 * Order is the client's own, from the docx best-sellers reference.
 */
export const bestSellers = [
  {
    id: "spicy-jam",
    words: ["Spicy", "Jam"],
    src: "/menu/best-sellers/spicy-jam.png",
    width: 1200,
    height: 697,
    alt: "The Spicy Jam smash burger on a white plate",
  },
  {
    id: "blue-cheese",
    words: ["Blue", "Cheese"],
    src: "/menu/best-sellers/blue-cheese.png",
    width: 1075,
    height: 661,
    alt: "The Blue Cheese smash burger with crumbled blue cheese, lettuce and caramelised onion",
  },
  {
    id: "monkey-fries",
    words: ["Monkey", "Fries"],
    src: "/menu/best-sellers/monkey-fries.png",
    width: 818,
    height: 651,
    alt: "A bowl of Monkey Fries loaded with sauce, chives and pickled onion",
  },
  {
    id: "the-chicks",
    words: ["The", "Chicks"],
    src: "/menu/best-sellers/the-chicks.png",
    width: 957,
    height: 685,
    alt: "The Chicks chicken tenders with a pot of dipping sauce and pickles",
  },
  {
    id: "cosmos-burger",
    words: ["Cosmos", "Burger"],
    src: "/menu/best-sellers/cosmos-burger.png",
    width: 1150,
    height: 673,
    alt: "The Cosmos Burger, a double smash burger with cheese and pickles",
  },
] as const;

// Headline from the blueprint (facts SS4.6); body from the docx, verbatim.
export const menuSection = {
  headline: "Explore our menu",
  body: "Discover the best burgers in San Diego at Cosmos Burger! From our signature Cosmos Burger to fresh fast food options for lunch, dinner, or brunch, we have it all. Visit us for delicious food near me today!",
  menuCta: "Check out our menu",
  orderCta: "Order online",
} as const;

/**
 * The three full-bleed photo bands that separate the sections (facts SS4.5,
 * 4.10, 4.12). Decorative dividers, but each shows real food, so each carries
 * real alt text rather than being hidden.
 *
 * The fourth divider in the blueprint, under EXPLORE OUR MENU, is NOT a band:
 * see `spread` below.
 */
export const photoBands = {
  fries: {
    src: "/photos/band-fries.webp",
    alt: "Four bowls of Cosmos loaded fries lined up on a wooden board, seen from above",
    ratio: 1332 / 618,
  },
  chicken: {
    src: "/photos/band-chicken.webp",
    alt: "A Cosmos crispy chicken sandwich topped with slaw, with loaded fries behind it",
    ratio: 1332 / 647,
  },
  phone: {
    src: "/photos/band-phone.webp",
    alt: "A guest photographing a Cosmos burger and a beer with their phone",
    ratio: 1332 / 821,
  },
} as const;

/**
 * The table spread under EXPLORE OUR MENU (facts SS4.7).
 *
 * `Cosmos General.png` is a CUTOUT, not a photograph of a scene: it carries an
 * alpha channel whose transparent top wedge is the shape of the table's back
 * edge, with the rearmost plates rising above it. The blueprint lays it on the
 * bottom of the purple pattern band so that wedge fills with pattern and those
 * plates read as standing in front of it. Flattening it onto a ground (which
 * this build did on its first pass) throws that away and leaves a square band.
 * `scripts/build-assets.sh` exports it with alpha intact.
 */
export const spread = {
  src: "/photos/spread.webp",
  width: 2000,
  height: 1334,
  alt: "A table spread of Cosmos burgers, chicken tenders and loaded fries on white plates",
} as const;

export const hero = {
  src: "/photos/hero.webp",
  alt: "Seven Cosmos smash burgers stacked on a wooden board under warm string lights",
  ratio: 1332 / 1051,
} as const;

/* -------------------------------------------------------------------------- */
/* Locations                                                                   */
/*                                                                             */
/* Five food halls. The docx and blueprint list four; Oceanside was docx-only, */
/* order-pop-up-only, even though the current live site treats it as a         */
/* flagship. Kazim decided (2026-09-02) it gets a full Locations card too, so   */
/* it is now in this array like every other hall, placed right after Carlsbad. */
/*                                                                             */
/* Hours are the docx's single 11:00 AM to 9:00 PM for the original four       */
/* (facts SS6.9); Oceanside's own hours and phone are the live site's           */
/* (burgerscosmos.com, captured 2026-09-02), since the docx never covered it.   */
/* Station 8's address follows the docx, which disagrees with THG-Website       */
/* (9145 Scholars Drive South); the docx is newer and the client's own          */
/* (facts SS6.7).                                                              */
/* -------------------------------------------------------------------------- */

export type Location = {
  /** Stable key, also the deep-link target inside the order pop-up. */
  id: string;
  area: string;
  name: string;
  address: string;
  hours: string;
  mapsQuery: string;
  /** Set only when the location is NOT simply trading, so it stays meaningful. */
  status?: "Coming Soon";
  /**
   * Public phone number, display format. Rendered with `telHref` below.
   * Confirmed for Oceanside only (live site); the other four have none
   * confirmed yet, so the field stays optional rather than guessed.
   */
  phone?: string;
  /** Storefronts for THIS location. Empty string = not connected yet. */
  ordering: OrderLinks;
};

/**
 * `(760) 607-7083` -> `+17606077083`, for a `tel:` href.
 *
 * Kept as a helper rather than a second field per location so the display
 * string and the dial string can never drift.
 */
export function telHref(phone: string): string {
  return `tel:+1${phone.replace(/\D/g, "")}`;
}

export const locations: Location[] = [
  {
    id: "carlsbad",
    area: "Carlsbad",
    name: "Windmill Food Hall",
    address: "890 Palomar Airport Rd, Carlsbad, CA 92011",
    hours: "11:00 AM to 9:00 PM",
    mapsQuery: "Cosmos Burger, 890 Palomar Airport Rd, Carlsbad, CA 92011",
    ordering: {
      toastPickup: "", // TODO(client): Toast storefront not public
      toastDelivery: "",
      // Public on burgerscosmos.com; the locale prefix has been stripped.
      doordash: "https://www.doordash.com/store/cosmos-burger-carlsbad-26018232/29386346/",
    },
  },
  {
    // Oceanside (Kazim, 2026-09-02): promoted from the order-pop-up-only row
    // it used to be to a full Locations card, placed right after Carlsbad.
    // Address, hours and phone are the live site's (burgerscosmos.com,
    // captured 2026-09-02); the docx never covered this hall at all.
    id: "oceanside",
    area: "Oceanside",
    name: "Cosmos Burger Oceanside",
    address: "208 N Coast Hwy, Oceanside, CA 92054",
    hours: "Mon to Thu 11:00 AM to 8:45 PM, Fri and Sat to 9:45 PM, Sun to 8:45 PM",
    mapsQuery: "Cosmos Burger, 208 N Coast Hwy, Oceanside, CA 92054",
    phone: "(760) 607-7083",
    ordering: {
      toastPickup: "",
      toastDelivery: "",
      // Public on burgerscosmos.com; the locale prefix has been stripped.
      doordash:
        "https://www.doordash.com/store/cosmos-burger-oceanside-oceanside-25982698/51403146/",
    },
  },
  {
    id: "san-clemente",
    area: "San Clemente",
    name: "Miramar Food Hall",
    address: "1720 North El Camino Real, San Clemente, CA 92672",
    hours: "11:00 AM to 9:00 PM",
    mapsQuery: "Cosmos Burger, 1720 N El Camino Real, San Clemente, CA 92672",
    ordering: { toastPickup: "", toastDelivery: "", doordash: "" },
  },
  {
    id: "little-italy",
    area: "Little Italy",
    name: "Global Fork Food Hall",
    address: "550 W Date St Suite B, San Diego, CA 92101",
    hours: "11:00 AM to 9:00 PM",
    mapsQuery: "Cosmos Burger, 550 W Date St, San Diego, CA 92101",
    ordering: { toastPickup: "", toastDelivery: "", doordash: "" },
  },
  {
    id: "ucsd",
    area: "UCSD Campus",
    name: "Station 8 Public Market",
    address: "9165 Theatre District Drive, La Jolla, CA 92037",
    // Station 8 has not opened. Bare opening times beside a Coming Soon badge
    // read as "open now", so the hours say what is actually true instead.
    hours: "Opening soon",
    mapsQuery: "Station 8 Public Market, 9165 Theatre District Dr, La Jolla, CA 92037",
    status: "Coming Soon",
    ordering: { toastPickup: "", toastDelivery: "", doordash: "" },
  },
];

/**
 * The ORDER ONLINE pop-up's own list. Used to diverge from `locations`
 * (Oceanside was a pop-up-only row, invented nowhere else); now that
 * Oceanside has a real Locations card too, every hall has exactly one row in
 * each place, from the same object, so the pop-up is simply the same list.
 * Kept as its own export, rather than importing `locations` directly at every
 * call site, so a future divergence has one place to happen again.
 */
export const orderRows: Location[] = locations;

export const orderPopup = {
  title: "Order Online",
  subtitle: "Choose your Cosmos and we'll take you to its ordering page.",
  /** Shown on a row with no live channel. Never a dead button. */
  empty: "Online ordering coming soon, order at the counter.",
  /** Shown instead on a location that has not opened yet. */
  comingSoon: "Opening soon",
  /** Shown once, under the list, if nothing at all is wired. */
  emptyAll: "Online ordering is being set up. Come see us at the counter in the meantime.",
} as const;

/* -------------------------------------------------------------------------- */
/* Menu pop-up                                                                 */
/*                                                                             */
/* PROVENANCE (Kazim, 2026-09-02): no menu file supplied yet. Every category,   */
/* item name and photo below comes from the old site, burgerscosmos.com,        */
/* captured 2026-09-02 (`Cosmos Assets/OLD SITE MENU/`), until Lorena sends the */
/* real menu. There are NO prices anywhere, by decision: none were ever         */
/* supplied and an invented price is worse than none. Descriptions exist only   */
/* for the five signature items and every one is the client's own docx wording; */
/* nothing is written for them here.                                           */
/*                                                                             */
/* Photos: the five best-seller cutouts (transparent, brand-styled) stay on     */
/* their five items, kept rather than replaced by the flatter old-site shots.   */
/* Every other food item now carries its own old-site product photo, so no      */
/* item in Burgers / Chicken Sandwiches / Artisan Hot Dog / Chicken Tenders /    */
/* Sides shows the placeholder tile. Those photos are 640px-wide exports        */
/* (`scripts/build-assets.sh`, the `items` step); the Tile component renders    */
/* them with `fill` inside a fixed aspect box, so no width/height is stored     */
/* per item here (unlike `bestSellers`/`plates`, which use a plain `<Image>`).   */
/*                                                                             */
/* More and Drinks are new categories (Kazim, 2026-09-02), also old-site only:   */
/* More holds the food extras the old site lists with no photos downloaded, so   */
/* every item there gets the branded placeholder tile, same as any food item     */
/* with no photo. Drinks is name-only, no tiles at all, grouped Beer / Wine and  */
/* Cocktail / Soft the way a physical drinks menu reads.                        */
/* -------------------------------------------------------------------------- */

export type MenuItem = {
  name: string;
  /** Only where the client's own copy supports one. */
  description?: string;
  /** Only where we hold real photography of this exact item. */
  image?: { src: string; alt: string };
};

/** A tile grid category: photo per item (or the branded placeholder), no prices. */
export type TileMenuCategory = { id: string; title: string; kind: "tiles"; items: MenuItem[] };

/** A name-only group inside a `kind: "list"` category, e.g. "Beer / Wine". */
export type MenuItemGroup = { title: string; items: readonly string[] };

/** A name-only category: no tiles, no photos, grouped names (the Drinks list). */
export type ListMenuCategory = {
  id: string;
  title: string;
  kind: "list";
  groups: readonly MenuItemGroup[];
};

export type MenuCategory = TileMenuCategory | ListMenuCategory;

export const menuPopup = {
  title: "Our Menu",
  subtitle: "Everything we serve, across all five locations.",
  orderCta: "Order",
  /** The honest gap, stated on the page rather than hidden. */
  note: "Prices at the counter and on the ordering apps. Full menu coming soon.",
  categories: [
    {
      id: "burgers",
      title: "Burgers",
      kind: "tiles",
      items: [
        { name: "BBQ Burger", image: { src: "/menu/items/bbq-burger.webp", alt: "BBQ Burger" } },
        {
          name: "Better Mac Burger",
          image: { src: "/menu/items/better-mac-burger.webp", alt: "Better Mac Burger" },
        },
        {
          name: "Blue Cheese Burger",
          description: "A favorite in our guest reviews.",
          image: {
            src: "/menu/best-sellers/blue-cheese.png",
            alt: "The Blue Cheese smash burger with crumbled blue cheese, lettuce and caramelised onion",
          },
        },
        {
          name: "Cosmos Burger",
          description: "Our signature Cosmos Burger.",
          image: {
            src: "/menu/best-sellers/cosmos-burger.png",
            alt: "The Cosmos Burger, a double smash burger with cheese and pickles",
          },
        },
        {
          name: "Spicy Jam Burger",
          description: "Our signature Spicy Jam Burger.",
          image: {
            src: "/menu/best-sellers/spicy-jam.png",
            alt: "The Spicy Jam smash burger on a white plate",
          },
        },
        { name: "The Basic Burger", image: { src: "/menu/items/the-basic-burger.webp", alt: "The Basic Burger" } },
        { name: "Truffle Burger", image: { src: "/menu/items/truffle-burger.webp", alt: "Truffle Burger" } },
        {
          name: "Vegetarian Burger",
          image: { src: "/menu/items/vegetarian-burger.webp", alt: "Vegetarian Burger" },
        },
      ],
    },
    {
      id: "chicken-sandwiches",
      title: "Chicken Sandwiches",
      kind: "tiles",
      items: [
        { name: "BBQ Chicken Sandwich", image: { src: "/menu/items/bbq-chicken-sandwich.webp", alt: "BBQ Chicken Sandwich" } },
        {
          name: "Garlic Parm Sandwich",
          image: { src: "/menu/items/garlic-parm-sandwich.webp", alt: "Garlic Parm Sandwich" },
        },
        {
          name: "Hot Chicks Sandwich",
          image: { src: "/menu/items/hot-chicks-sandwich.webp", alt: "Hot Chicks Sandwich" },
        },
        {
          name: "The Chicks Sandwich",
          image: { src: "/menu/items/the-chicks-sandwich.webp", alt: "The Chicks Sandwich" },
        },
        {
          name: "Truffle Honey Sandwich",
          image: { src: "/menu/items/truffle-honey-sandwich.webp", alt: "Truffle Honey Sandwich" },
        },
      ],
    },
    {
      id: "artisan-hot-dog",
      title: "Artisan Hot Dog",
      kind: "tiles",
      items: [{ name: "The OG Hot Dog", image: { src: "/menu/items/the-og-hot-dog.webp", alt: "The OG Hot Dog" } }],
    },
    {
      id: "chicken-tenders",
      title: "Chicken Tenders",
      kind: "tiles",
      items: [
        { name: "BBQ Chicken Tenders", image: { src: "/menu/items/bbq-chicken-tenders.webp", alt: "BBQ Chicken Tenders" } },
        {
          name: "Garlic Parm Tenders",
          image: { src: "/menu/items/garlic-parm-tender.webp", alt: "Garlic Parm Tenders" },
        },
        {
          name: "Hot Chicks Tenders",
          image: { src: "/menu/items/hot-chicks-tender.webp", alt: "Hot Chicks Tenders" },
        },
        {
          name: "The Chicks Tenders",
          description: "One of our best sellers.",
          image: {
            src: "/menu/best-sellers/the-chicks.png",
            alt: "The Chicks chicken tenders with a pot of dipping sauce and pickles",
          },
        },
        {
          name: "Truffle Honey Tenders",
          image: { src: "/menu/items/truffle-honey-tender.webp", alt: "Truffle Honey Tenders" },
        },
      ],
    },
    {
      id: "sides",
      title: "Sides",
      kind: "tiles",
      items: [
        { name: "Chick Fries", image: { src: "/menu/items/chick-fries.webp", alt: "Chick Fries" } },
        {
          name: "Cosmos Fries",
          image: { src: "/menu/items/cosmos-fries.webp", alt: "Cosmos Fries" },
        },
        {
          name: "Monkey Fries",
          description: "Our iconic loaded fries.",
          image: {
            src: "/menu/best-sellers/monkey-fries.png",
            alt: "A bowl of Monkey Fries loaded with sauce, chives and pickled onion",
          },
        },
        {
          name: "Regular Fries",
          image: { src: "/menu/items/regular-fries.webp", alt: "Regular Fries" },
        },
        { name: "Tater Tots", image: { src: "/menu/items/tater-tots.webp", alt: "Tater Tots" } },
        {
          name: "Truffle Fries",
          image: { src: "/menu/items/truffle-fries.webp", alt: "Truffle Fries" },
        },
        { name: "Onion Rings", image: { src: "/menu/items/onion-rings.webp", alt: "Onion Rings" } },
        { name: "Coleslaw", image: { src: "/menu/items/coleslaw.webp", alt: "Coleslaw" } },
      ],
    },
    {
      // Food extras the old site lists with no photos downloaded (facts:
      // burgerscosmos.com, captured 2026-09-02). Branded placeholder tile,
      // same as any tiled item with no photo.
      id: "more",
      title: "More",
      kind: "tiles",
      items: [
        { name: "Kids Burger" },
        { name: "Cauliflower Bites" },
        { name: "Tiramisu" },
        { name: "Bundle for 4" },
      ],
    },
    {
      // Name-only, no tiles (old site has no drink photography). Grouped the
      // way a physical drinks menu reads: Beer / Wine, then Cocktail / Soft.
      // White Claw sits with the beers (hard seltzer, sold alongside beer at
      // the counter); Cocktail sits with the soft drinks (no dedicated liquor
      // list on the old site, one line item).
      id: "drinks",
      title: "Drinks",
      kind: "list",
      groups: [
        {
          title: "Beer / Wine",
          items: [
            "Latitude 33 Blood Orange IPA",
            "Hazy IPA",
            "Buenaveza Lager",
            "Pupil Societe IPA",
            "Salty Crew IPA",
            "Cali Pilsner",
            "Sierra Nevada Pale Ale",
            "Sierra Nevada Octoberfest",
            "Blue Moon",
            "Pacifico",
            "Corona",
            "White Claw",
            "Sauvignon Blanc",
            "Chardonnay",
            "Cabernet Sauvignon",
            "Grenache Rosé",
          ],
        },
        {
          title: "Cocktail / Soft",
          items: [
            "Cocktail",
            "Booch Craft Strawberry Lemonade",
            "Nova Kombucha Dragon Fruit",
            "Lemonade",
            "Perrier",
            "Fiji Water",
          ],
        },
      ],
    },
  ] satisfies MenuCategory[],
} as const;

/* -------------------------------------------------------------------------- */
/* Reviews, verbatim quotes from the client docx                              */
/*                                                                             */
/* ATTRIBUTION IS DELIBERATELY NON-IDENTIFYING. The docx supplies no reviewer   */
/* names, and none are added: publishing a named individual's words as          */
/* advertising without consent creates exposure under California Civil Code     */
/* s.3344 on top of the Google/Yelp platform terms. Same posture as Lobster     */
/* Lab. Proper fix later: the official Google/Yelp embed widgets, which are     */
/* licensed for exactly this.                                                   */
/*                                                                             */
/* Two punctuation normalisations, no words changed: a spaced hyphen ("melt in  */
/* your mouth- pair with") becomes a comma under the house dash rule, and a     */
/* double space in "blue  cheese" is collapsed.                                 */
/* -------------------------------------------------------------------------- */

export type Review = { quote: string; author: string; source: "Google" | "Yelp" };

export const reviewsSection = {
  title: "Reviews",
  // docx, verbatim
  subtitle:
    "The best part of Cosmos? Hearing it straight from the people who come back for another bite.",
} as const;

export const reviews: Review[] = [
  {
    quote:
      "This was HANDS DOWN the BEST burger I have ever had! The Blue Cheese burger is out of this world. The freshest ingredients, the beef and bun will melt in your mouth, pair with a great Hazy and you are good for the day!",
    author: "Google reviewer",
    source: "Google",
  },
  {
    quote:
      "Let me just start by saying WOAH! I just had the BBQ Burger at Cosmos Burgers and it was delicious. At first bite the burger delivered and every single bite afterwards to completion. I am full, satisfied, and blown away. Great location, across from the Flower fields, and fun things to do for the whole family.",
    author: "Google reviewer",
    source: "Google",
  },
  {
    quote:
      "After a day at the beach was so happy to stumble across this place. Food was delicious, employees super helpful and tentative with service. Super cute atmosphere too.",
    author: "Yelp reviewer",
    source: "Yelp",
  },
  {
    quote:
      "Delicious food and wonderful service, I've been here many times and take friends here and they always enjoy it as well. I'm a sucker for a good burger, and the blue cheese burger is top notch and probably the best burger I've ever had.",
    author: "Yelp reviewer",
    source: "Yelp",
  },
];

/* -------------------------------------------------------------------------- */
/* Footer                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * CONTACT INFO is blank in the docx (facts SS6.4). The live WordPress site
 * carries two hall phone numbers and a third unattributed one, and no email
 * anywhere, so nothing here is confirmed for the five food halls this site
 * covers (Oceanside's own confirmed number lives on its Locations card, not
 * here). Rather than publish a number that may ring the wrong counter, the
 * footer offers the one channel that is definitely monitored, Instagram DMs,
 * and lists the halls.
 *
 * TODO(client, Lorena): supply the address, phone and email CONTACT INFO should
 * show. Fill `phone` and `email` and the footer renders them, no code change.
 */
export const contact = {
  heading: "Contact info",
  phone: "",
  email: "",
  /** The one channel that is definitely monitored. Always shown. */
  fallback: "Questions? Message us on Instagram.",
} as const;

/** Handles are shown under each icon in the footer, so the row is self-labelling. */
export const socials = [
  { id: "instagram", label: "Instagram", handle: site.instagramHandle, href: site.instagram },
  { id: "facebook", label: "Facebook", handle: "/CosmosBurger", href: site.facebook },
  { id: "tiktok", label: "TikTok", handle: "@cosmosburger.sandiego", href: site.tiktok },
] as const;

export type SocialId = (typeof socials)[number]["id"];

export const footer = {
  followUs: "Follow us",
  operatorLabel: "Operated by",
  legal: [
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms" },
    { href: "/accessibility", label: "Accessibility" },
  ],
} as const;
