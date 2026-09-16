import Image from "next/image";

export interface PhotoBandProps {
  src: string;
  alt: string;
  /**
   * The blueprint band's own width:height, measured off the PDF render
   * (Cosmos Assets/_derived/mockup, stitched at 1332 CSS px):
   * fries 1332:618, chicken 1332:647, phone 1332:821.
   */
  ratio: number;
  /** The photo's own average colour; the band's ground until it paints. */
  tone: string;
}

/**
 * One of the three full-bleed photo bands that separate the sections
 * (facts SS4.5, 4.10, 4.12).
 *
 * Every band used to be one 45vh slot with `object-cover`, which is the miss
 * Lessons 19 records: a band in the blueprint is a CROP, with its own aspect
 * and its own framing, and object-cover on a portrait source picked the middle
 * of a bun. So the band now holds the blueprint's aspect, and the framing is
 * baked into the file by scripts/build-assets.sh. The exported webp already
 * carries this exact ratio, so `object-cover` has nothing left to decide and
 * the crop is identical at every width.
 *
 * The two clamps are the only places the aspect is allowed to lose:
 *   max-height  a 1.62 band is 1184px tall at 1920, which is a photo the guest
 *               has to scroll past rather than look at. Capped at 96vh / 900px.
 *   min-height  below ~390px the thinnest band would be under 180px, which
 *               reads as a stripe rather than a photograph. It costs a few
 *               pixels off the sides of the crop and no subject.
 *
 * The `tone` ground (lib/content.ts) covers the moment before the photograph
 * arrives. These bands are lazy and nearly a screen tall on a desktop, so an
 * unpainted one is a screen-high empty box sitting on the page's cream, which
 * reads as a fault rather than as a photo on its way.
 */
export default function PhotoBand({ src, alt, ratio, tone }: PhotoBandProps) {
  return (
    <div
      className="relative max-h-[min(96vh,900px)] min-h-[180px] w-full overflow-hidden"
      style={{ aspectRatio: String(ratio), backgroundColor: tone }}
    >
      <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
    </div>
  );
}
