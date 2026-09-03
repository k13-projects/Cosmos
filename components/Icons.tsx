import type { ValueIconName, SocialId } from "@/lib/content";

/**
 * Every icon on the page, drawn inline.
 *
 * The client's brand library ships 12 yellow line icons as raster inside a PDF
 * (facts SS3), not as vectors, so the three the values band needs are redrawn
 * here to match the blueprint's outline style: burger, sound-wave heart, leaf.
 * Inline rather than files because each is well under a kilobyte and they must
 * inherit their colour from a token.
 *
 * All are decorative: each one sits directly above its own text label, so an
 * accessible name would be read out twice.
 */

type IconProps = { className?: string };

const base = {
  viewBox: "0 0 48 48",
  fill: "none",
  "aria-hidden": true,
  focusable: "false",
} as const;

/** Line-art burger: sesame top bun, patty, wavy lettuce, bottom bun. */
function BurgerIcon({ className = "" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <g stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 20c0-7.2 8.1-12 18-12s18 4.8 18 12" />
        <path d="M6 20h36" />
        <path d="M8 26h32" />
        <path d="M7 32c2.8 0 2.8 2.6 5.7 2.6S15.5 32 18.3 32s2.9 2.6 5.7 2.6 2.9-2.6 5.7-2.6 2.9 2.6 5.7 2.6S38.2 32 41 32" />
        <path d="M8 39c0 .6.5 1 1 1h30c.6 0 1-.4 1-1a5 5 0 0 0-5-5H13a5 5 0 0 0-5 5Z" />
        <path d="M17 14.5h.02M24 12.5h.02M31 14.5h.02" strokeWidth="3.4" />
      </g>
    </svg>
  );
}

/** Sound-wave heart: a solid heart between two pairs of arcs. */
function VibesIcon({ className = "" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path
        d="M24 39.5c-.6 0-1.2-.2-1.7-.6C18 35.3 12 30 12 23.6A7.6 7.6 0 0 1 19.6 16c1.9 0 3.6.8 4.4 2 .8-1.2 2.5-2 4.4-2a7.6 7.6 0 0 1 7.6 7.6c0 6.4-6 11.7-10.3 15.3-.5.4-1.1.6-1.7.6Z"
        fill="currentColor"
      />
      <g stroke="currentColor" strokeWidth="2.6" strokeLinecap="round">
        <path d="M8.6 15.5a15 15 0 0 0 0 17M2.8 11.5a22 22 0 0 0 0 25" />
        <path d="M39.4 15.5a15 15 0 0 1 0 17M45.2 11.5a22 22 0 0 1 0 25" />
      </g>
    </svg>
  );
}

/** Two leaves on a stem. */
function FreshIcon({ className = "" }: IconProps) {
  return (
    <svg {...base} className={className}>
      <path
        d="M23.4 27.6C21.7 18.6 26.9 11 39.5 8.4c1.6 5.6 1.1 11.2-2 15.6-3.5 5-9 6.4-14.1 3.6Z"
        fill="currentColor"
      />
      <path
        d="M21.2 30.6c-5.4 1.9-11 .1-14.1-4.5-2.7-4-3-9.2-1.3-14.3 11.4 1.4 16.5 8.6 15.4 18.8Z"
        fill="currentColor"
      />
      <path
        d="M9 39.5c4.6-6.4 9.5-10.7 14.7-13"
        stroke="currentColor"
        strokeWidth="2.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const valueIcons: Record<ValueIconName, (p: IconProps) => React.ReactElement> = {
  burger: BurgerIcon,
  vibes: VibesIcon,
  fresh: FreshIcon,
};

/** Placeholder tile artwork in the menu pop-up, where we hold no photo. */
export function MenuPlaceholderIcon({ className = "" }: IconProps) {
  return <BurgerIcon className={className} />;
}

/**
 * Menu glyphs: the small chilli and "V" disc the printed menu (Lorena,
 * COSMOS MENU.png, 2026-09-02) marks spicy and vegetarian items with. Colours
 * are sampled from that image and live as tokens in `app/globals.css`
 * (`--color-chilli*`, `--color-veg`), not hardcoded here.
 */
function SpicyIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}>
      <circle cx="12" cy="12" r="12" fill="var(--color-chilli-bg)" />
      <path
        d="M12.6 8.6c-.7-1-.2-2 .7-2.4"
        stroke="var(--color-chilli-stem)"
        strokeWidth="1.4"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M8.3 9.2c-2.3 1.9-2.6 5.1-.7 7 2 2 5.6 1.7 7.9-.5 1.9-1.9 2.3-4.6.9-6.3-1.5-1.8-4.7-1.9-7.1-.5-1 .6-1.8 1.3-2.2 1.9-1 1.4-.6 3.3.8 4.5"
        fill="var(--color-chilli)"
      />
    </svg>
  );
}

/**
 * The checkmark takes its colour from `currentColor` (`text-cream` in
 * practice) rather than a fixed white token, same convention as the burger /
 * vibes / fresh icons above.
 */
function VegetarianIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={className}>
      <circle cx="12" cy="12" r="12" fill="var(--color-veg)" />
      <path
        d="M8.4 8.4 12 15.6l3.6-7.2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export const menuTagIcons: Record<"spicy" | "vegetarian", (p: IconProps) => React.ReactElement> = {
  spicy: SpicyIcon,
  vegetarian: VegetarianIcon,
};

/* -------------------------------------------------------------------------- */
/* Socials                                                                     */
/* -------------------------------------------------------------------------- */

function InstagramIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="17.5" cy="6.5" r="1.3" fill="currentColor" />
    </svg>
  );
}

function FacebookIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" className={className}>
      <path
        d="M14.5 8.5V6.8c0-.8.5-1 .9-1h2V2.6h-2.8c-3 0-3.7 2.3-3.7 3.7v2.2H8v3.3h2.9V22h3.6v-10.2h2.6l.4-3.3h-3Z"
        fill="currentColor"
      />
    </svg>
  );
}

function TikTokIcon({ className = "" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false" className={className}>
      <path
        d="M20.5 8.6a6.6 6.6 0 0 1-4.4-1.7v6.9a5.9 5.9 0 1 1-5.9-5.9c.3 0 .6 0 .9.1v3a2.9 2.9 0 1 0 2 2.8V1.9h3a4 4 0 0 0 4.4 3.7v3Z"
        fill="currentColor"
      />
    </svg>
  );
}

export const socialIcons: Record<SocialId, (p: IconProps) => React.ReactElement> = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  tiktok: TikTokIcon,
};
