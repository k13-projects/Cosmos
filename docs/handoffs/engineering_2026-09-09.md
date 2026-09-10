# Engineering handoff, Cosmos Burger, 2026-09-09 (round 2)

**Authors:** James (GM) + Natalia (frontend-engineer) - **Branch:** `cosmos_sep09_v1` (from `cosmos_sep08_v1`)
**Source:** Lorena's email of 2026-09-08, `docs/intake/client_email_2026-09-08.md`
**Screens:** `docs/handoffs/screens/engineering_2026-09-09/`
**Work log with every decision:** `tasks/todo.md`, "Round 2"

---

## Status

**Built and self-verified; Olga's Chrome gate runs after this handoff.** `next build` clean.
Real-input proof of the scroll fix (Playwright `mouse.wheel`, not a synthetic event):

| viewport | menu pop-up scrollTop | page scrollY | scrollWidth == innerWidth |
|---|---|---|---|
| 1440x900 | 0 -> 1200 (of 3433) | 0 -> 1200 | yes |
| 800x600 (zoomed desktop) | 0 -> 1200 (of 4162) | 0 -> 1200 | yes |
| 390x844 mobile | 0 -> 1200 (of 5070) | 0 -> 600 | yes |

Before the fix, on the same build: scrollTop 0 -> 0, wheel `defaultPrevented: true`.

---

## 1. The defect: the menu pop-up would not scroll

**Cause.** Lenis owns the page's wheel. It listens on the window, cancels every wheel event
and animates the document itself. The dialog is its own `overflow-y: auto` box, so it
showed a scrollbar, but the wheel over it went to Lenis, which tried to move a page that
the dialog had locked (`body { overflow: hidden }`). Nothing moved. That is also Kazim's
"scrollbars that do not work when zoomed in or on a small screen": on those viewports the
pop-up fills the screen, so the dead scrollbar was the pop-up's.

**Fix.** `data-lenis-prevent` on the dialog's scroll container (`components/Modal.tsx`).
Lenis checks the event path for that attribute and leaves the event to the browser.

**Rejected.** `lenis.stop()` while a dialog is open. Read Lenis 1.3.26's `onVirtualScroll`:
a stopped instance still calls `preventDefault()` on every wheel event that is not inside a
prevented element. Same symptom, one more moving part. Lesson 29.

**Tooling note.** The first hour of this round was spent on `next dev`, where nothing
opened and nothing scrolled: the dev bundle does not hydrate under the site's static CSP
(no `'unsafe-eval'`), silently. Every measurement in this handoff is from `next start`.
Lesson 30.

## 2. The wheel, the values band and the seam tab (one geometry)

Lorena's three layout asks turn out to be one shape, the blueprint's own
(`Cosmos Assets/_derived/mockup/mock_p1_s02.png`): plates at about a quarter of the page
width, hanging over the right edge and spilling into the values band, with the three value
columns sitting LEFT of centre, high in the band, so the plates never touch them.

| | before | after | why |
|---|---|---|---|
| `--wheel-r` | clamp(390px, 35.5vw, 505px) | clamp(480px, 47vw, 660px) | blueprint R is 0.49vw; the old value was trimmed to fit a 144px clear lane that no longer exists |
| `--plate-w` | clamp(150px, 13.5vw, 190px) | clamp(215px, 23vw, 300px) | top plate measures 25% of the 1332px slice; Natalia's 20vw first pass still read smaller side by side |
| hub | `top-[61%]` | `top-[58%]` | a bigger R pushes the envelope floor (hub_y + 0.737R) deeper in px; raising the hub gives that back |
| values top lane | `lg:pt-36` | `lg:pt-16` | the "higher up" ask; the horizontal lane now does the collision work |
| values grid | centred, max 1100px | left, max 780px, 32px/16px type at lg | the blueprint's columns span ~58% of the page, left-pinned |
| seam tab | 5.4vw / 4xl / 5xl | 4.4vw / 3xl / 4xl | "make it smaller", one step everywhere; ends at 61px and 314px in a 375px viewport |

**Clearance, minimum over a full revolution (0 to 315 deg in 45 deg steps):**

| width | to values text | to About paragraphs | scrollWidth == innerWidth |
|---|---|---|---|
| 1024 | 56px | 62px | yes |
| 1280 | 185px | 250px | yes |
| 1440 | 294px | 368px | yes |
| 1920 | 512px | 608px | yes |

375 and 768: no leak (the wheel does not render below 1024; the three-plate row does).

Wheel behaviour (drag, hover pause, keyboard focus, reduced motion) is untouched: geometry
only. Plate names confirmed correct by Lorena, untouched.

## 3. Content

- **BBQ Burger tile.** Lorena's source is a 1750x2432 portrait with the burger in its lower
  half; the tile showed it at about half the size of its neighbours. `scripts/build-assets.sh`
  now cuts a full-width 4:3 box centred on the burger and plate (crown y~570, rim y~1824),
  which is the framing every other item shot has. See `bbq-tile-before-after-sibling.jpg`.
- **DoorDash San Clemente + Little Italy** wired in `lib/content.ts`. DoorDash serves a
  Cloudflare challenge to headless browsers, so the two URLs are verified by slug and shape
  only (same shape as the two live ones). One real click each before the reply goes out.
- **Chicken sandwich band: unchanged.** Her first Drive file is byte-identical to the
  `cosmos 2-121.jpg` the band is already cut from, so the wider original the blueprint used
  does not exist on her side either. Her second file is a different sandwich (top-down, on
  a yellow chair). Both are in `Cosmos Assets/LORENA UPDATE 2026-09-08/`, gitignored like
  the rest of the library. Decision: keep the blueprint's own photo at the blueprint's
  aspect; tell her plainly.

## Still open on the client

Toast links per hall - footer contact info - Oceanside storefront photo - her own location
drawings (ours stay until they arrive).

## Human Gate

None for Kazim beyond the merge itself (`hm++` is his call, Lessons "Shipping" 0).
Recommendation: merge; the reply to Lorena is drafted in Gmail and waits for the deploy.
