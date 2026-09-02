import { menuSection } from "@/lib/content";
import { CheckMenuButton, OrderOnlineButton } from "./Buttons";

/** "EXPLORE OUR MENU" (facts SS4.6): purple with the burger pattern, two pills. */
export default function MenuSection() {
  return (
    <section id="menu" className="pattern py-20 sm:py-24 lg:py-28">
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
    </section>
  );
}
