import Image from "next/image";
import { menuSection, spread } from "@/lib/content";
import { CheckMenuButton, OrderOnlineButton } from "./Buttons";

/**
 * "EXPLORE OUR MENU" (facts SS4.6): purple with the burger pattern, two pills.
 *
 * The table spread (facts SS4.7) closes the band. It is NOT a photo band: the
 * client's `Cosmos General.png` is a cutout whose transparent top wedge is the
 * table's back edge, and the blueprint lays it on the bottom of this pattern so
 * the pattern fills that wedge and the rearmost plates read as standing in
 * front of it (Lessons 15). So it lives inside this section, full bleed, no
 * frame, no rounded box, keeping its own baked-in shadows. The band ends where
 * the table's bottom meets the cream Catering ground.
 */
export default function MenuSection() {
  return (
    <section id="menu" className="pattern scroll-mt-28 pb-0 pt-20 sm:pt-24 lg:scroll-mt-32 lg:pt-28">
      <div className="mx-auto max-w-[900px] px-5 text-center sm:px-8">
        <h2 className="reveal display text-[12vw] text-yellow sm:text-6xl lg:text-[76px]">
          {menuSection.headline}
        </h2>

        <p
          className="reveal mx-auto mt-8 max-w-[62ch] text-[16px] leading-relaxed text-white sm:text-[17px]"
          style={{ "--i": 1 } as React.CSSProperties}
        >
          {menuSection.body}
        </p>

        <div
          className="reveal mx-auto mt-10 flex w-full max-w-[420px] flex-col gap-3"
          style={{ "--i": 2 } as React.CSSProperties}
        >
          <CheckMenuButton className="w-full" />
          <OrderOnlineButton className="w-full" />
        </div>
      </div>

      {/*
        Scaled to width, never squashed. Below about 720px the cutout is held at
        its 720px width and the table simply crops at the sides: shrinking it to
        a 375px viewport would leave each plate under 40px across and the whole
        spread unreadable.
      */}
      <div className="relative mt-10 w-full overflow-hidden sm:mt-12">
        <Image
          src={spread.src}
          alt={spread.alt}
          width={spread.width}
          height={spread.height}
          sizes="100vw"
          className="relative left-1/2 h-auto w-[max(100%,720px)] max-w-none -translate-x-1/2"
        />
      </div>
    </section>
  );
}
