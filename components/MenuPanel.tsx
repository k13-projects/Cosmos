"use client";

import Image from "next/image";
import { menuPopup, menuTagLabels, menuTagOrder, type MenuItem } from "@/lib/content";
import { MenuPlaceholderIcon, menuTagIcons } from "./Icons";

/**
 * The menu pop-up, laid out as the client's own reference does it
 * (en.junkburgers.com, facts SS5): a photo tile per item, the name and price
 * under it, an Order button per category. Content (prices, descriptions,
 * tags, the combo card, the allergen line) comes straight from `menuPopup`,
 * transcribed from Lorena's printed menu (`lib/content.ts` provenance).
 */

function Tile({ item }: { item: MenuItem }) {
  return (
    <li className="flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[16px] bg-white">
        {item.image ? (
          <Image
            src={item.image.src}
            alt={item.image.alt}
            fill
            sizes="(max-width: 640px) 45vw, 220px"
            className="object-contain p-2"
          />
        ) : (
          /* No photography for this item. A branded tile is honest; a stand-in
             photo of a different item is not. */
          <div className="flex h-full w-full items-center justify-center bg-purple">
            <MenuPlaceholderIcon className="h-12 w-12 text-yellow" />
          </div>
        )}
      </div>

      <div className="mt-2 flex items-baseline justify-between gap-2">
        <p className="text-[15px] font-bold leading-tight text-purple">
          {item.name}
          {item.tags?.map((tag) => {
            const Icon = menuTagIcons[tag];
            return (
              <Icon
                key={tag}
                className={`ml-1.5 inline-block h-[15px] w-[15px] align-[-2px] ${tag === "vegetarian" ? "text-cream" : ""}`}
              />
            );
          })}
        </p>
        <span className="display shrink-0 text-[15px] text-purple">{item.price}</span>
      </div>

      {item.description && (
        <p className="mt-1 text-[14px] leading-snug text-purple/75">{item.description}</p>
      )}

      {item.note && (
        <p className="mt-1.5 inline-block w-fit rounded-full bg-magenta px-2.5 py-1 text-[11px] font-bold leading-none text-yellow">
          {item.note}
        </p>
      )}
    </li>
  );
}

/** The combo upsell at the bottom of Sides, printed menu, verbatim. */
function ComboCallout() {
  return (
    <div className="mt-6 rounded-[24px] bg-magenta-deep px-6 py-7 text-center sm:px-10 sm:py-8">
      <h4 className="display text-xl text-yellow sm:text-2xl">{menuPopup.combo.heading}</h4>
      <p className="mx-auto mt-3 max-w-md text-[15px] leading-snug text-white/90">
        {menuPopup.combo.body}
      </p>
    </div>
  );
}

export default function MenuPanel({ onOrder }: { onOrder: () => void }) {
  return (
    <div className="space-y-10">
      {menuPopup.categories.map((category) => (
        <section key={category.id} aria-labelledby={`menu-${category.id}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 id={`menu-${category.id}`} className="display text-2xl text-purple sm:text-3xl">
              {category.title}
            </h3>
            <button
              type="button"
              onClick={onOrder}
              className="btn btn-sm btn-purple sheen sheen-hover"
            >
              {menuPopup.orderCta}
              <span className="sr-only"> {category.title}</span>
            </button>
          </div>

          {category.note && <p className="mt-1 text-sm italic text-purple/70">{category.note}</p>}

          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {category.items.map((item) => (
              <Tile key={`${category.id}-${item.name}`} item={item} />
            ))}
          </ul>

          {category.id === "sides" && <ComboCallout />}
        </section>
      ))}

      <div className="border-t-2 border-purple/12 pt-5">
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {menuTagOrder.map((tag) => {
            const Icon = menuTagIcons[tag];
            return (
              <li
                key={tag}
                className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-purple/70"
              >
                <Icon className={`h-4 w-4 ${tag === "vegetarian" ? "text-cream" : ""}`} />
                {menuTagLabels[tag]}
              </li>
            );
          })}
        </ul>

        <p className="mt-4 text-center text-sm text-purple/70">{menuPopup.note}</p>

        <p className="mt-3 text-center">
          <a
            href={menuPopup.printedMenuHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-magenta-ink underline underline-offset-4 transition-colors hover:text-purple"
          >
            {menuPopup.printedMenuLabel}
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </p>
      </div>
    </div>
  );
}
