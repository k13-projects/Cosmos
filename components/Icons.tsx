import type { ValueIconName, SocialId } from "@/lib/content";

/**
 * Every icon on the page, drawn inline (or, for the values band, masked from
 * a client-supplied silhouette).
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

/** Line-art burger: sesame top bun, patty, wavy lettuce, bottom bun. Still
 * used as the menu pop-up's placeholder tile (below); the values band no
 * longer draws it (see valueIcons). */
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

/**
 * The values band's three icons, Lorena's own (client email 2026-09-10 SS3),
 * replacing the hand-drawn burger/heart/leaf above. Exported as trimmed
 * alpha silhouettes (`public/icons/values/{burger,vibes,fresh}.png`,
 * `scripts/build-assets.sh`) specifically so a CSS mask can paint them in
 * `currentColor`, the same yellow-token inheritance the inline SVGs gave for
 * free; a plain `<img>` could not do that.
 *
 * The three sources are different aspect ratios (burger 270x239, vibes
 * 270x132, fresh 270x224: her vibes mark is a wide horizontal lockup, the
 * other two are closer to square), so a shared square box either crops the
 * wide one or strands it tiny in a mostly-empty square (the cut-off look her
 * note SS3 flagged in the first place). Each box below holds the same ink
 * AREA instead of the same footprint: width follows the source's own
 * `aspect-[]` so nothing is stretched, and only the width is chosen per icon
 * (from width = sqrt(area x ratio)) so the three read as one visual weight
 * side by side rather than three different-sized silhouettes sharing one box.
 */
function maskIcon(src: string, box: string) {
  return function ValueMaskIcon({ className = "" }: IconProps) {
    return (
      <span
        aria-hidden="true"
        className={[box, className].filter(Boolean).join(" ")}
        style={{
          display: "inline-block",
          backgroundColor: "currentColor",
          WebkitMaskImage: `url(${src})`,
          maskImage: `url(${src})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    );
  };
}

const BurgerValueIcon = maskIcon(
  "/icons/values/burger.png",
  "w-[68px] aspect-[270/239] sm:w-[76px]",
);
const VibesValueIcon = maskIcon(
  "/icons/values/vibes.png",
  "w-[92px] aspect-[270/132] sm:w-[103px]",
);
const FreshValueIcon = maskIcon(
  "/icons/values/fresh.png",
  "w-[70px] aspect-[270/224] sm:w-[79px]",
);

export const valueIcons: Record<ValueIconName, (p: IconProps) => React.ReactElement> = {
  burger: BurgerValueIcon,
  vibes: VibesValueIcon,
  fresh: FreshValueIcon,
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
