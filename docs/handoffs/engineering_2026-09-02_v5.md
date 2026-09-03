# Engineering handoff, Cosmos Burger, 2026-09-02 (v5)

**Author:** Natalia (frontend-engineer) · **Branch:** `cosmos_sep02_v6` · **Not committed**

---

## Status

**Done.** Rebuilt the menu pop-up from Lorena's real menu (`COSMOS MENU.png`, 3349x1882),
transcribed and cross-checked item by item against the image: prices, descriptions, spicy/
vegetarian marks, the "swap for tots" upsell, the combo card and the allergen footer line.
Swapped the BBQ Burger photo and the table-spread source per Lorena's update. Added Menu/
MenuSection/MenuItem JSON-LD with prices. `npx tsc --noEmit` clean. No `next build`/`next dev`/
`next start` run (port 9157 is live for the client demo, per instruction); `scripts/build-assets.sh`
was run (writes only to `public/`) and a new photo-path check script confirms every reference
resolves.

---

## Summary

### 1. Menu content: the real menu replaces the old-site placeholder

`lib/content.ts`, `menuPopup`: rewrote every category from the printed menu.
- **`MenuItem`** gained `price: string` (printed verbatim: `"$7.5"`, not `"$7.50"`), optional
  `description`, `tags?: ("spicy" | "vegetarian")[]`, and `note?` (the "swap for tots" line on
  Monkey/Chicks/Cosmos Fries).
- **`MenuCategory`** dropped the `kind: "tiles" | "list"` union entirely: the real menu has no
  drinks list, so `ListMenuCategory`, `MenuItemGroup` and the whole invented Drinks category are
  gone, and `MenuPanel.tsx`'s `DrinkGroups` component with them. `MenuCategory` is now one flat
  shape (`id`, `title`, optional `note`, `items`) — no union to branch on.
- **Removed:** Kids Burger, Tiramisu, Bundle for 4, the "More" category, all drinks — none are on
  the real menu.
- **Moved:** Cauliflower Bites out of the deleted "More" category into Sides, alongside the new
  Frings item (both real-menu items with no photo on file, so both render the branded placeholder
  tile).
- Category `note` is new: both Chicken Sandwiches and Chicken Tenders carry "Served with signature
  Cosmos sauce and pickles" from the menu.
- `menuPopup.combo` (heading + body, printed verbatim) and `menuPopup.note` (now the allergen line,
  replacing "Prices at the counter...") are new/changed top-level fields.
- `menuPopup.printedMenuHref`/`printedMenuLabel` point the new "View the printed menu" link at
  `/menu/cosmos-menu.png`.
- Spelling follows the menu: "Chicks Fries", "Frings".

### 2. `MenuPanel.tsx`: price, description, tags, note, category note, combo card, footer

- Price renders right-aligned to the name in `.display` (Archivo); the name itself stays the
  existing bold Poppins treatment (unchanged tile scaffolding, minimal impact).
- Description renders at 14px, `text-purple/75`, default body font (Poppins is already the page
  default, no extra class needed).
- Spicy/vegetarian tags render as small inline glyphs next to the item name (new `SpicyIcon`/
  `VegetarianIcon` in `components/Icons.tsx`, see below), and the item `note` (e.g. "Swap for
  tots, add $1") renders as a small magenta/yellow pill under the description.
- A category's `note` renders italic under its header.
- `ComboCallout`, a new component, renders a `bg-magenta-deep` card with a yellow `.display`
  heading, appended after the Sides grid only (`category.id === "sides"`).
- The footer changed from a single honest-gap sentence to: a spicy/vegetarian legend (icons +
  labels from `menuTagLabels`/`menuTagOrder` in content.ts, not hardcoded), the allergen line
  (`menuPopup.note`), and the "View the printed menu" link (`target="_blank"`, `sr-only "(opens in
  a new tab)"`, matching the existing convention in `OrderPanel.tsx`/`CateringSection.tsx`).
- The per-category Order pill and the photo grid are unchanged.

### 3. New glyphs: `SpicyIcon` / `VegetarianIcon`

`components/Icons.tsx`: two new inline SVGs, colours sampled directly off Lorena's PNG (not
guessed, not hardcoded hex in the component) and stored as tokens in `app/globals.css`:
`--color-chilli-bg` (`#ff914d`), `--color-chilli` (`#c60c00`), `--color-chilli-stem` (`#72a82e`),
`--color-veg` (`#00bf63`). The vegetarian checkmark uses `currentColor` (rendered `text-cream`),
same convention as the existing burger/vibes/fresh icons, rather than a fixed white fill.
`menuTagIcons` maps `"spicy" | "vegetarian"` to the two components, same pattern as `valueIcons`/
`socialIcons`.

### 4. `scripts/build-assets.sh`: BBQ photo, spread source, printed-menu export

- **BBQ Burger** (`menu/items/bbq-burger.webp`): now built from Lorena's `BBQ UPDATED.png`
  (1750x2432, alpha PNG). Its alpha channel is fully opaque edge to edge (verified: min/max both
  255), so "trim to alpha bbox" is a documented no-op; kept in the script anyway in case a future
  re-export of that asset isn't. Flattened onto white to match every other item shot in
  `menu/items/`, which are white-background product photos, not cutouts. 640px wide, q82, same as
  the rest of that step.
- **Table spread** (`photos/spread.webp`): source swapped from `PHOTOS/Cosmos General.png` to
  Lorena's `LORENA UPDATE 2026-09-02/additional photo.png`. Verified by pixel diff: identical size
  (2528x1686) and identical alpha bbox, differing ONLY in a 470x230px patch at the bottom right,
  where `Cosmos General.png` carries a small sparkle artifact baked into the wood grain (reads as
  a watermark, not food) that `additional photo.png` does not have. Meaningful difference on a
  product photo, so the clean file wins. Rest of that block (alpha-preserving cutout export)
  unchanged.
- **New: printed menu export.** `COSMOS MENU.png` exports to `public/menu/cosmos-menu.png` (2000w,
  the actual link target — opened in a new tab to read/print, PNG has the broadest right-click
  save/print support) and `public/menu/cosmos-menu.webp` (same width, kept for a possible future
  inline thumbnail; nothing links to it today, recorded rather than left unexplained).

### 5. SEO: Menu/MenuSection/MenuItem JSON-LD

Per the James/Lorena meeting 2026-09-02 ("the menu is website content for SEO, not only a PDF"),
which was already true (the pop-up is in the DOM) but not yet in structured data.

`lib/content.ts`: new `menuStructuredData(id)`, builds one `Menu` object with `hasMenuSection` /
`hasMenuItem` / `Offer.price` / `Offer.priceCurrency` directly from `menuPopup` — same data the
pop-up renders, so the two can't drift apart. `app/layout.tsx`: `structuredData()` now puts that
one `Menu` object at the front of `@graph` with a stable `@id` (`${site.url}/#menu`), and every
`Restaurant` entry's new `hasMenu: { "@id": menuId }` points at it, so the menu isn't repeated five
times.

### 6. New verification script: `scripts/check-menu-photos.mjs`

Read-only, zero dependencies (plain Node, no `tsx`/`ts-node` in this repo). Parses the
`menuPopup` block out of `lib/content.ts` as text (scoped between `export const menuPopup = {`
and `export function menuStructuredData(`, so it can't pick up an unrelated `src:` elsewhere in
the file), collects every `image.src` and `printedMenuHref`, and confirms each resolves under
`public/`. Exit code reflects pass/fail for CI use later.

---

## Verification

- `npx tsc --noEmit` — clean, before and after every edit batch.
- `bash scripts/build-assets.sh` — ran clean, 48 files in `public/` (writes only to `public/`,
  per instruction; did not touch `Cosmos Assets/`).
- `node scripts/check-menu-photos.mjs` — **28 paths checked, 0 missing**:

```
OK    /menu/best-sellers/blue-cheese.png
OK    /menu/best-sellers/cosmos-burger.png
OK    /menu/best-sellers/monkey-fries.png
OK    /menu/best-sellers/spicy-jam.png
OK    /menu/best-sellers/the-chicks.png
OK    /menu/cosmos-menu.png
OK    /menu/items/bbq-burger.webp
OK    /menu/items/bbq-chicken-sandwich.webp
OK    /menu/items/bbq-chicken-tenders.webp
OK    /menu/items/better-mac-burger.webp
OK    /menu/items/chick-fries.webp
OK    /menu/items/coleslaw.webp
OK    /menu/items/cosmos-fries.webp
OK    /menu/items/garlic-parm-sandwich.webp
OK    /menu/items/garlic-parm-tender.webp
OK    /menu/items/hot-chicks-sandwich.webp
OK    /menu/items/hot-chicks-tender.webp
OK    /menu/items/onion-rings.webp
OK    /menu/items/regular-fries.webp
OK    /menu/items/tater-tots.webp
OK    /menu/items/the-basic-burger.webp
OK    /menu/items/the-chicks-sandwich.webp
OK    /menu/items/the-og-hot-dog.webp
OK    /menu/items/truffle-burger.webp
OK    /menu/items/truffle-fries.webp
OK    /menu/items/truffle-honey-sandwich.webp
OK    /menu/items/truffle-honey-tender.webp
OK    /menu/items/vegetarian-burger.webp

28 paths checked, 0 missing.
```

- `grep -nP '[\x{2013}\x{2014}]' lib/content.ts components/MenuPanel.tsx components/Icons.tsx app/layout.tsx scripts/build-assets.sh` —
  no matches. No em/en dash in any changed file.
- `npx eslint .` — not configured in this repo (no `eslint.config.*`); skipped, same as v4.
- Not run: `next build`/`next dev`/`next start` (port 9157 is the live client demo) — that pass,
  screenshots and the fidelity check are James's, per instruction.

---

## Files

```
lib/content.ts                menuPopup rewritten from COSMOS MENU.png: MenuItem (price,
                               description?, tags?, note?), MenuCategory simplified (note?, no
                               kind union), ListMenuCategory/MenuItemGroup deleted, More/Drinks
                               categories deleted, combo + printedMenu fields, allergen note,
                               menuTagLabels/menuTagOrder, menuStructuredData()
components/MenuPanel.tsx      Tile (price/description/tags/note), ComboCallout (new), category
                               note render, footer (legend + allergen line + printed-menu link),
                               DrinkGroups removed
components/Icons.tsx          SpicyIcon, VegetarianIcon (new), menuTagIcons map
app/globals.css               --color-chilli-bg/--color-chilli/--color-chilli-stem/--color-veg
                               tokens, sampled from the client PNG
app/layout.tsx                structuredData(): shared Menu JSON-LD via menuStructuredData(),
                               hasMenu on every Restaurant
scripts/build-assets.sh       BBQ Burger photo source swapped to BBQ UPDATED.png, spread source
                               swapped to additional photo.png, printed-menu export added
scripts/check-menu-photos.mjs new, read-only photo-path verifier
SCOPE.md                      menu price/description risk + open question removed (done);
                               "no prices" out-of-scope line removed
tasks/todo.md                 "Blocked on client" menu item checked off, new review section
public/menu/items/bbq-burger.webp   regenerated (new source photo)
public/photos/spread.webp           regenerated (new source photo)
public/menu/cosmos-menu.png         new (printed-menu link target)
public/menu/cosmos-menu.webp        new (unused today, future thumbnail)
```

---

## Risks

1. **Item photos are unchanged from the old-site pass** except BBQ. The real menu's own item
   photography, if Lorena has any beyond the printed PNG, would still be an upgrade over the
   old-site shots on the other 26 items; not asked for in this pass, flagging for a future ask.
2. **`Frings` and `Cauliflower Bites`** still show the branded placeholder tile (no photo on file
   for either). Same honest-gap pattern as before, just now on the real menu's own two no-photo
   items instead of on the deleted "More" list.
3. **Combo card color/typography is my read of "magenta-deep card, yellow display heading"**, not
   pixel-matched against the printed menu's own magenta starburst shape — a starburst wasn't
   asked for and would be a new visual element not in this site's existing shape vocabulary
   (cards, pills). Worth a look from James/Olga against the printed menu image.
4. **`additional photo.png` swap is a same-day, same-file client update**, not yet flagged back to
   Lorena as "used"; no action needed on our end, noting for the record.
5. **JSON-LD price format**: `Offer.price` is emitted as the digits only (`"13"`, `"7.5"`), with
   `priceCurrency: "USD"` alongside, per schema.org convention. Not validated against Google's
   Rich Results tool in this pass (no live URL to test against on :9157).

---

## Next

**James** — build + look (port 9157 is the live client demo, so `next build`/`dev`/`start` were
not run here; `tsc --noEmit` plus the photo-path script are the extent of my verification). Then
**qa-test-engineer (Olga)** through the Michael (code-review) gate — the combo card, the tag
glyphs at small size, the printed-menu link, and the JSON-LD (`view-source` + Rich Results test
once there's a live URL) are the things worth a specific look.

---

## Human gate

Nothing here needs Kazim's sign-off before the next stage. The menu content itself is Lorena's own
printed menu, transcribed verbatim; the presentation decisions (price/description styling, combo
card shape, PNG vs webp for the link, BBQ trim being a no-op, the spread-source swap) are called
out above as decisions made, not asked, per instruction. Nothing committed. James commits.
