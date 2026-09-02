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
   * The floating burger cascade down the right edge (facts SS4.2). Six plates on
   * lg, the first three only on small screens, where six would either overlap
   * the copy or shrink to nothing. `alt` is empty on purpose: these are
   * decorative, every dish they show is named in the menu pop-up.
   */
  plates: [
    { src: "/menu/plates/1.png", width: 845, height: 507 },
    { src: "/menu/plates/2.png", width: 1003, height: 700 },
    { src: "/menu/plates/3.png", width: 1083, height: 632 },
    { src: "/menu/plates/4.png", width: 1178, height: 684 },
    { src: "/menu/plates/5.png", width: 1200, height: 663 },
    { src: "/menu/plates/6.png", width: 1020, height: 646 },
  ],
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
 * The four full-bleed photo bands that separate the sections (facts SS4.5, 4.7,
 * 4.10, 4.12). Decorative dividers, but each shows real food, so each carries
 * real alt text rather than being hidden.
 */
export const photoBands = {
  fries: {
    src: "/photos/band-fries.webp",
    alt: "Four bowls of Cosmos loaded fries lined up on a wooden board, seen from above",
  },
  spread: {
    src: "/photos/band-spread.webp",
    alt: "A table spread of Cosmos burgers, chicken tenders and loaded fries on white plates",
  },
  chicken: {
    src: "/photos/band-chicken.webp",
    alt: "A Cosmos crispy chicken sandwich topped with slaw, with loaded fries behind it",
  },
  phone: {
    src: "/photos/band-phone.webp",
    alt: "A guest photographing a Cosmos burger and a beer with their phone",
  },
} as const;

export const hero = {
  src: "/photos/hero.webp",
  alt: "Seven Cosmos smash burgers stacked on a wooden board under warm string lights",
} as const;

/* -------------------------------------------------------------------------- */
/* Locations                                                                   */
/*                                                                             */
/* Four food halls, exactly as the docx and the blueprint list them. Oceanside  */
/* is deliberately NOT here: the docx puts it in the ORDER ONLINE pop-up only,  */
/* not in the LOCATIONS section, even though the current live site treats it as */
/* a flagship. Followed literally per facts SS6.1 and flagged for Lorena.       */
/*                                                                             */
/* Hours are the docx's single 11:00 AM to 9:00 PM for all four (facts SS6.9).  */
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
  /** Storefronts for THIS location. Empty string = not connected yet. */
  ordering: OrderLinks;
};

/**
 * `(760) 607-9227` -> `+17606079227`, for a `tel:` href.
 *
 * Kept as a helper rather than a second field per location so the display
 * string and the dial string can never drift. Unused today because no phone
 * number is confirmed for the halls (see `contact` below), and kept because the
 * moment the client supplies one it is the only correct way to render it.
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
 * The ORDER ONLINE pop-up's own list. It is NOT `locations`: the docx lists
 * five rows here and only four cards in the Locations section, the extra row
 * being Oceanside (facts SS5, SS6.1). Kept as a separate list so the pop-up can
 * carry Oceanside without inventing a location card for it.
 */
export const orderRows: Location[] = [
  locations[0],
  {
    id: "oceanside",
    area: "Oceanside",
    // The docx says only "Oceanside". The street address below is from the
    // current live site and is shown in the pop-up for recognition only.
    name: "208 N Coast Hwy",
    address: "208 N Coast Hwy, Oceanside, CA 92054",
    hours: "11:00 AM to 9:00 PM",
    mapsQuery: "Cosmos Burger, 208 N Coast Hwy, Oceanside, CA 92054",
    ordering: {
      toastPickup: "",
      toastDelivery: "",
      // Public on burgerscosmos.com; the locale prefix has been stripped.
      doordash:
        "https://www.doordash.com/store/cosmos-burger-oceanside-oceanside-25982698/51403146/",
    },
  },
  locations[1],
  locations[2],
  locations[3],
];

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
/* TODO(client, Lorena): no menu file was supplied. Categories and item names   */
/* below come from the current live site (facts SS5). There are NO prices       */
/* anywhere, by decision, because none were supplied and an invented price is   */
/* worse than none. Descriptions exist only for the five signature items and    */
/* every one of them is drawn from the client's own docx wording, nothing is    */
/* written for them here.                                                      */
/*                                                                             */
/* Photos: the five best-seller cutouts are the only item photography we have.  */
/* The six plate cutouts are NOT reused for other items: their dishes cannot be */
/* matched to a menu name with confidence, and a burger photographed under the  */
/* wrong name is a promise the kitchen cannot keep. Everything else gets the    */
/* branded placeholder tile.                                                   */
/* -------------------------------------------------------------------------- */

export type MenuItem = {
  name: string;
  /** Only where the client's own copy supports one. */
  description?: string;
  /** Only where we hold real photography of this exact item. */
  image?: { src: string; alt: string };
};

export type MenuCategory = { id: string; title: string; items: MenuItem[] };

export const menuPopup = {
  title: "Our Menu",
  subtitle: "Everything we serve, across all four food halls.",
  orderCta: "Order",
  /** The honest gap, stated on the page rather than hidden. */
  note: "Full menu with prices coming soon.",
  categories: [
    {
      id: "burgers",
      title: "Burgers",
      items: [
        { name: "BBQ" },
        { name: "Better Mac" },
        {
          name: "Blue Cheese",
          description: "A favorite in our guest reviews.",
          image: {
            src: "/menu/best-sellers/blue-cheese.png",
            alt: "The Blue Cheese smash burger with crumbled blue cheese, lettuce and caramelised onion",
          },
        },
        {
          name: "Cosmos",
          description: "Our signature Cosmos Burger.",
          image: {
            src: "/menu/best-sellers/cosmos-burger.png",
            alt: "The Cosmos Burger, a double smash burger with cheese and pickles",
          },
        },
        {
          name: "Spicy Jam",
          description: "Our signature Spicy Jam Burger.",
          image: {
            src: "/menu/best-sellers/spicy-jam.png",
            alt: "The Spicy Jam smash burger on a white plate",
          },
        },
        { name: "The Basic" },
        { name: "Truffle" },
        { name: "Vegetarian" },
      ],
    },
    {
      id: "chicken-sandwiches",
      title: "Chicken Sandwiches",
      items: [
        { name: "BBQ" },
        { name: "Garlic Parm" },
        { name: "Hot Chicks" },
        // No photo: the client's "THE CHICKS" cutout is the tenders plate, and
        // it is used on the Chicken Tenders row below. A tenders photo under a
        // sandwich name would misdescribe the dish.
        { name: "The Chicks" },
        { name: "Truffle Honey" },
      ],
    },
    {
      id: "artisan-hot-dog",
      title: "Artisan Hot Dog",
      items: [{ name: "The OG" }],
    },
    {
      id: "chicken-tenders",
      title: "Chicken Tenders",
      items: [
        { name: "BBQ" },
        { name: "Garlic Parm" },
        { name: "Hot Chicks" },
        {
          name: "The Chicks",
          description: "One of our best sellers.",
          image: {
            src: "/menu/best-sellers/the-chicks.png",
            alt: "The Chicks chicken tenders with a pot of dipping sauce and pickles",
          },
        },
        { name: "Truffle Honey" },
      ],
    },
    {
      id: "sides",
      title: "Sides",
      items: [
        { name: "Chick Fries" },
        { name: "Cosmos Fries" },
        {
          name: "Monkey Fries",
          description: "Our iconic loaded fries.",
          image: {
            src: "/menu/best-sellers/monkey-fries.png",
            alt: "A bowl of Monkey Fries loaded with sauce, chives and pickled onion",
          },
        },
        { name: "Regular Fries" },
        { name: "Tater Tots" },
        { name: "Truffle Fries" },
        { name: "Onion Rings" },
        { name: "Coleslaw" },
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
 * anywhere, so nothing here is confirmed for the four food halls this site
 * covers. Rather than publish a number that may ring the wrong counter, the
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
  /** Rendered only while there is no phone or email to show. */
  fallback: "Questions? Message us on Instagram.",
} as const;

export const socials = [
  { id: "instagram", label: "Instagram", href: site.instagram },
  { id: "facebook", label: "Facebook", href: site.facebook },
  { id: "tiktok", label: "TikTok", href: site.tiktok },
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
