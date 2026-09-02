"use client";

import Image from "next/image";
import { menuPopup, type MenuItem, type MenuItemGroup } from "@/lib/content";
import { MenuPlaceholderIcon } from "./Icons";

/**
 * The menu pop-up, laid out as the client's own reference does it
 * (en.junkburgers.com, facts SS5): a photo tile per item, the name under it, an
 * Order button per category.
 *
 * No prices and no descriptions beyond the five the client's copy supports.
 * None were supplied, and an invented price or a made-up description is worse
 * than an honest gap, so the gap is stated at the foot of the panel instead.
 *
 * Drinks (Kazim, 2026-09-02) is a `kind: "list"` category instead: no old-site
 * drink photography exists, so it renders as grouped names, not tiles.
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

/** Drinks: grouped names, no photos, no tiles (no drink photography exists). */
function DrinkGroups({ groups }: { groups: readonly MenuItemGroup[] }) {
  return (
    <div className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-2">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-magenta-ink">
            {group.title}
          </p>
          <ul className="mt-2 space-y-1.5">
            {group.items.map((name) => (
              <li key={name} className="text-[15px] leading-snug text-purple">
                {name}
              </li>
            ))}
          </ul>
        </div>
      ))}
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

          {category.kind === "list" ? (
            <DrinkGroups groups={category.groups} />
          ) : (
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-4">
              {category.items.map((item) => (
                <Tile key={`${category.id}-${item.name}`} item={item} />
              ))}
            </ul>
          )}
        </section>
      ))}

      <p className="border-t-2 border-purple/12 pt-5 text-center text-sm text-purple/70">
        {menuPopup.note}
      </p>
    </div>
  );
}
