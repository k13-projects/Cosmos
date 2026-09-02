import Image from "next/image";

/**
 * One of the four full-bleed photo bands that separate the sections
 * (facts SS4.5, 4.7, 4.10, 4.12).
 *
 * `sizes="100vw"` because it always spans the viewport, and the band is given a
 * fixed viewport-relative height so the page's rhythm does not depend on the
 * source photo's aspect ratio: two of the four are portrait.
 */
export default function PhotoBand({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-[38vh] max-h-[420px] min-h-[200px] w-full sm:h-[45vh]">
      <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
    </div>
  );
}
