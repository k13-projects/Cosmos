import { LOGO_ASPECT, LOGO_HEIGHT, LOGO_PATH, LOGO_VIEW_BOX, LOGO_WIDTH } from "@/lib/logo";

const SYMBOL_ID = "cosmos-wordmark";

/**
 * The wordmark is drawn once, hidden, at the top of the document, and every
 * instance on the page is an `<svg><use>` reference to it. That keeps the mark
 * a real vector (crisp at the 26px nav size and at the 400px hero size alike)
 * and re-colourable from a token, without paying the ~8KB path data three
 * times, and without the CSS-mask trick, which would also pick up the keyline
 * and the "BURGERS & CHICKEN" lockup the blueprint does not use.
 *
 * The supplied SVG's own fills (#F5E829 yellow, #964895 purple) are NOT the
 * brand hexes, so the symbol paints with `currentColor` and each call site sets
 * the colour from a token. See lib/logo.ts.
 *
 * Render <LogoSprite /> once per document, in the layout.
 */
export function LogoSprite() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
    >
      <symbol id={SYMBOL_ID} viewBox={LOGO_VIEW_BOX}>
        <path d={LOGO_PATH} fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
      </symbol>
    </svg>
  );
}

type Props = {
  /** Sets the drawn colour. Use a brand token class, e.g. `text-yellow`. */
  className?: string;
  /**
   * Accessible name. Omit for a decorative instance sitting beside real text,
   * so a screen reader does not read the brand name twice.
   */
  title?: string;
};

export default function CosmosLogo({ className = "", title }: Props) {
  return (
    <svg
      /*
       * NOT the symbol's own viewBox. A <use> of a <symbol> lays the symbol out
       * in a box at the origin sized to the use element (100% x 100% here), and
       * the symbol's viewBox then maps its artwork into that box. Repeating the
       * offset viewBox on this element shifts the window away from that box by
       * (20, 314) user units, which cropped everything but the swoosh.
       */
      viewBox={`0 0 ${LOGO_WIDTH} ${LOGO_HEIGHT}`}
      // Height is set by the caller; the width follows the mark's own ratio, so
      // it reserves its space and cannot shift layout while fonts load.
      style={{ aspectRatio: String(LOGO_ASPECT) }}
      className={className}
      role={title ? "img" : "presentation"}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <use href={`#${SYMBOL_ID}`} />
    </svg>
  );
}
