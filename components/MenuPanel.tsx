"use client";

import Image from "next/image";
import { menuPopup, type MenuItem } from "@/lib/content";
import { MenuPlaceholderIcon } from "./Icons";

/**
 * The menu pop-up, laid out as the client's own reference does it
 * (en.junkburgers.com, facts SS5): a photo tile per item, the name under it, an
 * Order button per category.
 *
 * No prices and no descriptions beyond the five the client's copy supports.
 * None were supplied, and an invented price or a made-up description is worse
 * than an honest gap, so the gap is stated at the foot of the panel instead.
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
             photo of a different burger is not. */
          <div className="flex h-full w-full items-center justify-center bg-purple">
            <MenuPlaceholderIcon className="h-12 w-12 text-yellow" />
          </div>
        )}
      </div>
      <p className="mt-2 text-[15px] font-bold leading-tight text-purple">{item.name}</p>
      {item.description && (
        <p className="mt-1 text-[13px] leading-snug text-purple/70">{item.description}</p>
      )}
    </li>
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

          <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
            {category.items.map((item) => (
              <Tile key={`${category.id}-${item.name}`} item={item} />
            ))}
          </ul>
        </section>
      ))}

      <p className="border-t-2 border-purple/12 pt-5 text-center text-sm text-purple/70">
        {menuPopup.note}
      </p>
    </div>
  );
}
