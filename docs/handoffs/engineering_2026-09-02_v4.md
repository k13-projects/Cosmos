# Engineering handoff, Cosmos Burger, 2026-09-02 (v4)

**Author:** Natalia (frontend-engineer) · **Branch:** `cosmos_sep02_v5` · **Not committed**

---

## Status

**Done.** Content pass on Kazim's 2026-09-02 answers: menu (27 old-site item photos wired,
More + Drinks categories added), Oceanside promoted to a full Locations card, plate names
matched by photo, font wording settled, `SCOPE.md`/`tasks/todo.md` open-questions rewritten.
`tsc --noEmit` clean. No `next build`/`next dev`/`next start` run (port 9157 is live for the
client demo, per instruction) — that pass and screenshots are James's.

---

## Summary

### 1. Menu: old-site content until Lorena sends the real menu

`scripts/build-assets.sh` gained an `items` step: every file in `Cosmos Assets/OLD SITE MENU/`
(27 white-background product shots, captured burgerscosmos.com 2026-09-02) exports to
`public/menu/items/<slug>.webp`, 640px wide, quality 82. PNG sources go through `sips` first;
webp sources go through `dwebp` first (cwebp's own encoder doesn't read webp back in), same
crop-then-encode shape as the rest of the script. Ran clean, 27 files out.

`lib/content.ts` `menuPopup`: every one of the 27 food items in Burgers / Chicken Sandwiches /
Artisan Hot Dog / Chicken Tenders / Sides now carries a photo — the 5 existing best-seller
cutouts stayed on their items (kept, not replaced, my call), the other 22 wired to their
`/menu/items/` export. No item shows the placeholder tile anymore. Alt text is the item name.

Two new categories, both old-site sourced: **More** (Kids Burger, Cauliflower Bites, Tiramisu,
Bundle for 4 — no photos downloaded, so the branded placeholder tile, same as any tiled item
with no photo) and **Drinks** (22 names, no tiles, grouped Beer / Wine and Cocktail / Soft).
Drinks needed a new shape, not just new data: `MenuCategory` is now a discriminated union
(`TileMenuCategory | ListMenuCategory`), and `MenuPanel.tsx` branches on `category.kind` —
`"tiles"` renders the existing `Tile` grid unchanged, `"list"` renders a new `DrinkGroups`
component (two-column grouped name list, no photos, no prices). No other category's rendering
changed.

Foot note replaced: "Full menu with prices coming soon." → "Prices at the counter and on the
ordering apps. Full menu coming soon." No descriptions invented; the five signature one-liners
are untouched.

### 2. Oceanside is now a Locations card

Moved from the order-pop-up-only object into `locations`, placed right after Carlsbad. Data:
address, hours ("Mon to Thu 11:00 AM to 8:45 PM, Fri and Sat to 9:45 PM, Sun to 8:45 PM") and
phone `(760) 607-7083` from the old site (burgerscosmos.com, captured 2026-09-02); DoorDash URL
was already in content. `Location` gained an optional `phone` field, rendered on the card with
`telHref` the way LobsterLab does it (min-h-11 tap target, `tel:` link, own icon).

Since every hall now has one card and one pop-up row from the same object, `orderRows` is
simply `locations` — the old three-item splice-in-Oceanside array is gone, so Oceanside cannot
drift out of sync or list twice. Confirmed: `orderRows.length === locations.length === 5`, one
`id: "oceanside"` in the whole file. JSON-LD (`app/layout.tsx`) picks up the fifth `Restaurant`
automatically, it already maps over `locations`; no code change needed there.

### 3. Plate names, matched by photo (James, 2026-09-02)

`about.plates[].name`: plate 1 Blue cheese (unchanged), plate 2 BBQ chicken sandwich (was
"Chicken sandwich"), plate 3 Better Mac burger (was "Smash burger"), plate 4 Cosmos burger
(unchanged), plate 5 Spicy jam (unchanged), plate 6 Hot Chicks sandwich (was "Crispy chicken").
`.display` already uppercases via CSS, so names stay natural case in content. Comment rewritten
to record the photo-match provenance instead of the old RMSE note (which no longer described
how the names were chosen).

### 4. Font: Archivo ships permanently

Removed "swap point"/pending-swap wording from `CLAUDE.md`, `app/layout.tsx`, and
`app/globals.css`. Each now says once, factually: the guide's face is Horizon (Adobe Font, not
free), Archivo ships as the permanent display face. `--font-display` itself is unchanged — the
token still exists, it just isn't described as a pending swap point anymore.

### 5. `SCOPE.md` and `tasks/todo.md` brought current

Removed the font and Oceanside questions (both settled). Open questions for Lorena are now:
menu prices/descriptions, Toast+DoorDash per hall, contact info, plate names (photo-matched,
needs confirmation), and a new ask — the original wider chicken-sandwich photo used in the PDF
band (the file we hold can't reproduce the blueprint's exact crop, noted in `build-assets.sh`
already). `tasks/todo.md` "Blocked on client" mirrors the same five. Stale "four food halls"
counts fixed in `SCOPE.md`, `lib/content.ts` (footer contact comment), `components/Footer.tsx`,
`components/Locations.tsx` comments, and `menuPopup.subtitle`.

---

## Verification

- `npx tsc --noEmit` — clean, both before and after every edit batch.
- `npx eslint .` — not configured in this repo (no `eslint.config.*`, no local `eslint`
  devDependency); skipped per instruction.
- `grep -n "—\|–" lib/content.ts` — no matches. No em/en dash in visitor-facing copy.
- `ls public/menu/items | wc -l` → **27**.
- Photo-path check (python, output below): every one of the 27 tiled food items resolves an
  existing file on disk; the 4 `More` items correctly have no `image` field (placeholder tile
  by design).

```
[burgers] BBQ                  -> /menu/items/bbq-burger.webp                   OK
[burgers] Better Mac           -> /menu/items/better-mac-burger.webp            OK
[burgers] Blue Cheese          -> /menu/best-sellers/blue-cheese.png            OK
[burgers] Cosmos               -> /menu/best-sellers/cosmos-burger.png          OK
[burgers] Spicy Jam            -> /menu/best-sellers/spicy-jam.png              OK
[burgers] The Basic            -> /menu/items/the-basic-burger.webp             OK
[burgers] Truffle              -> /menu/items/truffle-burger.webp               OK
[burgers] Vegetarian           -> /menu/items/vegetarian-burger.webp            OK
[chicken-sandwiches] BBQ                  -> /menu/items/bbq-chicken-sandwich.webp         OK
[chicken-sandwiches] Garlic Parm          -> /menu/items/garlic-parm-sandwich.webp         OK
[chicken-sandwiches] Hot Chicks           -> /menu/items/hot-chicks-sandwich.webp          OK
[chicken-sandwiches] The Chicks           -> /menu/items/the-chicks-sandwich.webp          OK
[chicken-sandwiches] Truffle Honey        -> /menu/items/truffle-honey-sandwich.webp       OK
[artisan-hot-dog] The OG               -> /menu/items/the-og-hot-dog.webp               OK
[chicken-tenders] BBQ                  -> /menu/items/bbq-chicken-tenders.webp          OK
[chicken-tenders] Garlic Parm          -> /menu/items/garlic-parm-tender.webp           OK
[chicken-tenders] Hot Chicks           -> /menu/items/hot-chicks-tender.webp            OK
[chicken-tenders] The Chicks           -> /menu/best-sellers/the-chicks.png             OK
[chicken-tenders] Truffle Honey        -> /menu/items/truffle-honey-tender.webp         OK
[sides] Chick Fries          -> /menu/items/chick-fries.webp                  OK
[sides] Cosmos Fries         -> /menu/items/cosmos-fries.webp                 OK
[sides] Monkey Fries         -> /menu/best-sellers/monkey-fries.png           OK
[sides] Regular Fries        -> /menu/items/regular-fries.webp                OK
[sides] Tater Tots           -> /menu/items/tater-tots.webp                   OK
[sides] Truffle Fries        -> /menu/items/truffle-fries.webp                OK
[sides] Onion Rings          -> /menu/items/onion-rings.webp                  OK
[sides] Coleslaw             -> /menu/items/coleslaw.webp                     OK
[more] Kids Burger          -> (no image, placeholder tile)
[more] Cauliflower Bites    -> (no image, placeholder tile)
[more] Tiramisu             -> (no image, placeholder tile)
[more] Bundle for 4         -> (no image, placeholder tile)

total tile items: 31, with image: 27, no image (placeholder): 4
missing files: 0
```

---

## Files

```
scripts/build-assets.sh    items step: 27 old-site photos -> public/menu/items/*.webp, 640w q82
lib/content.ts              menuPopup rewritten (27 photos wired, More + Drinks categories,
                             MenuCategory discriminated union, note text), about.plates names,
                             locations (+Oceanside, +phone field), orderRows simplified,
                             menuPopup.subtitle, footer contact comment
components/MenuPanel.tsx    DrinkGroups (list-kind rendering), category.kind branch
components/Locations.tsx    telHref import, phone rendering on the card, "four"->"five" comments
components/Footer.tsx       "four"->"five" halls comment (contact info unchanged, still pending)
app/layout.tsx              font comment: Archivo permanent, no swap-point wording
app/globals.css             font comment: Archivo permanent, no swap-point wording
CLAUDE.md                   font line: Archivo permanent, Horizon named as the guide's face only
SCOPE.md                    Risks + Open questions for Lorena rewritten to current state
tasks/todo.md               "Blocked on client" mirrors SCOPE.md's open questions
public/menu/items/          27 new files (untracked, not yet added)
```

---

## Risks

1. **Menu is still not the real menu.** Names, categories and photos are the old site's; prices
   and descriptions remain entirely absent by decision. Full content pass still needed once
   Lorena sends the real menu.
2. **Plate names on the wheel got longer.** "BBQ chicken sandwich" (plate 2, used in the mobile
   `PlateRow` too) is longer than any name that shipped before ("Crispy chicken" was the
   longest). The tooltip pill is designed to wrap and cap at `31vw`, but I could not visually
   confirm it on a live server — James/Olga should eyeball the mobile plate row and the wheel
   tooltip at 375px for this specific name.
3. **Contact info (footer) is still pending**, unchanged, per instruction. Only the Locations
   card phone (Oceanside) is now live; the footer's own `contact.phone`/`contact.email` stay
   blank until Lorena supplies them.
4. **`dwebp` is a new build-time dependency** for `build-assets.sh` (same `brew install webp`
   package as `cwebp`, already required). Script exits with an explicit error if it's missing.
5. **`PROJECT_BRIEF.md` was not touched.** Its page map still says "4 food halls" and its house
   decisions still say Oceanside is order-pop-up-only. Out of my assigned scope for this pass;
   flagging so it doesn't read as contradicting `SCOPE.md`.

---

## Next

**James** — build + fidelity/browser pass (port 9157 was in use for the live client demo, so
`next build`/`dev`/`start` were not run here; `tsc --noEmit` is the extent of my verification).
Then **qa-test-engineer (Olga)** through the Michael (code-review) gate, per usual — menu photo
grid, Drinks list layout, Oceanside card + phone tap target, and the plate-name length risk
above are the things worth a specific look.

---

## Human gate

Nothing here needs Kazim's sign-off before the next stage — every open item in this pass was
already his own decision (menu treatment, Oceanside, plate names, font). Nothing committed.
James commits.
