# Engineering handoff, Cosmos Burger, 2026-09-02 (v3)

**Author:** Natalia (frontend-engineer) · **Branch:** `cosmos_sep02_v4` · **Not committed**
**Screens:** `docs/handoffs/screens/engineering_2026-09-02_v4/`

---

## Status

**Done, ready for the fidelity gate.** Three items shipped: band crops rebuilt to the
blueprint's own geometry, the Locations rail rebuilt to the blueprint's density, and the
plate wheel turned into an endless rotation. `tsc --noEmit` clean, `next build` clean, no
`any`, no dashes in visitor copy, console clean at 1440 / 1280 / 768 / 375, no horizontal
scroll at any width, no broken images.

---

## Summary

### 1. Photo bands reproduce the blueprint's crops (Lessons 19)

The blueprint render was stitched back into two full pages (7626px and 2894px at 1332 CSS px
wide) and the band boundaries were found by row-difference, not by eye. Each band's crop was
then registered against the source photo by normalised cross-correlation over crop width and
offset, so the framing is a measured result rather than a judgement.

| band | boundary in the render | height | aspect W:H | source | NCC |
|---|---|---|---|---|---|
| hero | p1 y 0 to 1051 | 1051 | **1.2674** | `cosmos 1-84.jpg` 2244x1497 | 0.929 |
| fries | p1 y 3767 to 4385 | 618 | **2.1553** | `Chick fries….jpg` 2048x1366 | 0.885 |
| chicken | p2 y 0 to 647 | 647 | **2.0587** | `cosmos 2-121.jpg` 1690x2533 | n/a, see below |
| phone | p2 y 1445 to 2266 | 821 | **1.6224** | `cosmos 1-64.jpg` 1510x1887 | 0.998 |

The crop is now baked into the exported file by `scripts/build-assets.sh`, so `object-cover`
has nothing left to decide and the framing is identical at every width. `PhotoBand` only
holds the aspect. Kazim's eyeballed figures were close on hero (0.78 vs 0.789 measured) and
phone (0.62 vs 0.616); the fries band is taller than it looks in slide 4 alone, 0.464 rather
than 0.35, because it starts 133px above that slide's top edge.

**The chicken band is the one we cannot reproduce exactly, and the reason is in the source.**
The blueprint's crop was taken from a wider original than the file we hold: the sandwich is
~28% of the band's width there and ~41% of this file's width, so their frame runs roughly
380px past each edge of ours. Registration confirms it (best NCC 0.42, and the search wants a
crop 1.45x wider than the source). What ships is the blueprint's *framing* at the blueprint's
exact aspect, from the full width of the file we have: the whole sandwich centred, a fries
bowl cut at each edge, the plate rim just inside the bottom. The hot dog behind is outside
what 1690px can show at 2.06. **Ask Lorena for the original of `cosmos 2-121`,** and this band
becomes exact.

### 2. Locations rail at the blueprint's density (Lessons 20)

Measured off page 1 of the render and rebuilt in `vw`, so the density is the blueprint's at
every width rather than the container's. Two full cards and a third cut by the right edge,
exactly as drawn. The « sits in the blueprint's own lane at mid-height; the » is mirrored on
the right. Both are one pair of controls placed twice: below 1024 they are a row under the
rail where they cover nothing, and `lg:contents` dissolves that row so each can position
itself against the rail from 1024 up. Swipe and trackpad still drive the rail directly.

The blueprint draws only «, on the purple ground. A rail needs both, and » lands over the
cream card that bleeds off the edge, where a bare yellow chevron is a 1.2:1 fill and reads as
damage. So the yellow pair sits on a purple disc: invisible against the purple pattern where
the blueprint's own arrow lives, and an unmistakable control against a card. Yellow on purple
is 8:1.

Card type was scaled up to fill the larger card (hall name 29px at lg, address and hours
16px), and the Order + Directions row is pinned to the card floor with `mt-auto` so the four
cards line their buttons up even when San Clemente's address wraps. Station 8's Coming Soon
badge and the Order-pill-opens-the-pop-up behaviour are untouched.

`useRail.scrollByCard` now reads the rail's real `column-gap` instead of assuming 16px, or
the arrows would step short of a card at lg and park the rail between snap points.

**Reviews** was checked against page 2 and adjusted where it differed: the cards now start at
50% of the viewport and are 30vw wide, the heading text is capped at the blueprint's own
31.4vw measure, and the rail bleeds out through the section gutter so the second card is cut
by the page edge. What already matched (heading + italic sub-line in the left column, cards
scrolling right, tan ground) was left alone.

### 3. The plate wheel never stops

Four copies of the six-plate set at 15 degrees close the ring, so there is no gap at any
phase; 15 is the blueprint's own 14.1 rounded to a step that divides 360, so the density on
the visible arc is unchanged. One `requestAnimationFrame` loop turns it at one plate-step
every 7 seconds, and scroll injects velocity on top that decays back to ambient with a 0.45s
e-fold (0.05 degrees of extra turn per pixel scrolled). It is turning when the visitor
arrives and keeps turning after they stop.

It stops when nobody can see it: an IntersectionObserver on the About band, and
`visibilitychange` for a hidden tab. It also stops while a plate is hovered or focused, so
the name can be read off a still plate; the tooltip is still CSS-only and opens on the same
frame as the pointer. Under reduced motion the loop never starts, `--wheel-rot` is pinned to
0, and `.wheel-hub { transform: none !important }` holds the arc static regardless.

Twenty-four plates would be twenty-four tab stops announcing the same six dishes four times,
so only the first six carry a name and a tab stop; the rest are `aria-hidden`, `tabIndex -1`,
and still clickable and hoverable. Tabbing to one of the six turns the wheel until that plate
is in the visible window, because a focus ring on a plate that is off-screen right is a
keyboard trap in everything but name.

---

## Fidelity table (geometry)

Bands, measured in the browser at 1280x900 and 375x812. "Built aspect" is the rendered box.

| band | PDF aspect (measured) | built @1280 | built @375 | framing match | side by side |
|---|---|---|---|---|---|
| hero | 1.2674 | 1.6537 (capped) | 0.8152 (floored) | **yes**, horizontally exact; vertically the cap crops top and bottom | `compare-hero-1280.png`, `compare-hero-375.png` |
| fries | 2.1553 | **2.1554** | 2.0833 (floored) | **yes**, all four bowls, same board | `compare-fries-1280.png`, `compare-fries-375.png` |
| chicken | 2.0587 | **2.0588** | **2.0588** | **yes on framing, no on scale**: whole sandwich centred, bowls left and right, but 1.45x tighter than the blueprint because their original is wider than ours | `compare-chicken-1280.png`, `compare-chicken-375.png` |
| phone | 1.6224 | **1.6224** | **1.6225** | **yes**, hand + phone + plate, near pixel match | `compare-phone-1280.png`, `compare-phone-375.png` |

The two caps, and why they exist:

- **hero max-height 86vh.** At 1.2674 the hero is 1010px tall on a 1280 viewport, taller than
  a laptop window, and a hero with nothing under it does not say the page continues. The
  aspect holds exactly below ~981px of width; above that the cap governs. The crop itself is
  the blueprint's at every width. Kazim's call if he wants the cap lifted.
- **band min-height 180px.** Below ~390px of width the thinnest band would be under 180px and
  read as a stripe. It costs a few pixels off the sides of the crop and no subject. It binds
  on fries at 375 (180 instead of 174) and on nothing else.

Also changed on the hero: the fade into the About band now starts at 87% instead of 74%. Now
that the band carries the blueprint's crop, the bottom of the frame is the wooden board and
the front row of burgers, and the old fade painted them purple. The blueprint draws no fade
at all; this is the narrowest seam that still avoids a hard line. **The top scrim
(0.42 purple) was left alone** — it is a nav legibility decision that already passed a QA
gate, but the side-by-side shows the blueprint has no scrim there either. Flagged, not
changed.

### Locations rail geometry, measured at 1280

| measure | blueprint | built | match |
|---|---|---|---|
| first card from left | 10.74% | 10.70% | yes |
| card width | 33.33% | 33.30% | yes |
| gap | 3.23% | 3.20% | yes |
| third card left edge | 83.78% | 83.70% | yes |
| card aspect W:H | 1.533 | 1.533 | yes |
| « arrow from left | 2.48% | 2.40% | yes |
| « arrow vs card mid-height | centred | 649px vs 649px | yes |
| cards visible at rest | 2 full + 1 cut | 2 full + 1 cut | yes |

At 768: one full card and the next cut, ~1.5 visible. At 375: one card with the next peeking.
Screens `locations-1280.png`, `locations-768.png`, `locations-375.png`.

### Reviews geometry, measured at 1280

| measure | blueprint | built | match |
|---|---|---|---|
| first card from left | 50.0% | 50.0% | yes |
| card width | 30.0% | 30.0% | yes |
| heading sub-line width | 31.4% | 31.4% | yes |
| heading block from left | 9.9% | 3.8% | **no**, see risks |

Screen `reviews-1280.png`.

### Wheel clearances across a full revolution

Every plate's box was read at 2-degree steps through 360 degrees, plus 12px for the float
animation. Minimums:

| viewport | plate leftmost edge | About copy right edge | clearance | Values 3rd column ("Fresh always") clearance |
|---|---|---|---|---|
| 1024 | 823px | 688px | **135px** | **84px** |
| 1280 | 1046px | 688px | **358px** | **100px** |
| 1440 | 1181px | 708px | **473px** | **165px** |
| 1920 | 1661px | 948px | **713px** | no horizontal overlap at all |

These are phase-independent by construction, not a lucky sample. A plate is left of the
container's right edge only while `cos(angle) < -0.676`, so the ring's on-screen window is
132.5 to 227.5 degrees: the leftmost any plate centre can reach is `right edge - 0.324 R`,
and the vertical envelope is `hub_y ± 0.737 R`. A closed ring reaches 0.103 R deeper than the
old 32-degree sweep, so R was trimmed from 39.4vw to 35.5vw and the hub raised from 67% to
61% of the band to put that floor back inside the values band's clear lane.

Screens `wheel-phase-0.png`, `wheel-phase-120.png`, `wheel-phase-240.png` (1280).

### Behaviour proved in the browser

- ambient turn: `--wheel-rot` 40.57deg to 47.07deg over 3s with no input = 2.17 deg/s (target 2.143)
- scroll boost: a single `scrollTo` added ~40deg on top of ambient, then decayed
- hover pause: rot 68.64 to 68.64 over 2s while hovered, 71.86 after `pointerout`
- tooltip on a real hover: opacity 1, "Cosmos burger", 80ms transition
- focus pulls into view: plate 0 at left 1877px (off-screen) moved to left 1046px on focus
- 24 plate buttons, 6 in the tab order

---

## Files

```
scripts/build-assets.sh        crop_photo(): the four band crops, boxes + reasoning
components/PhotoBand.tsx       aspect from the blueprint, max/min clamps, prop interface
components/Hero.tsx            blueprint aspect + 86vh cap; bottom fade 74% -> 87%
components/Locations.tsx       rail rebuilt to the blueprint's density, arrows in the lane
components/Reviews.tsx         50% card start, 30vw cards, 31.4vw heading measure, edge bleed
components/RailArrow.tsx       className prop, purple disc for the yellow pair
components/PlateWheel.tsx      endless ring: 24 spokes, rAF, scroll boost, pause, focus-to-view
components/useRail.ts          scrollByCard reads the real column-gap
app/globals.css                --wheel-r 35.5vw, --plate-w 13.5vw, comment rewritten
lib/content.ts                 ratio on hero and each photo band
.claude/Lessons.md             new verification lesson 5 (the Next image cache)
public/photos/*.webp           regenerated: hero 1525x1203, fries 2000x928,
                               chicken 1690x821, phone 1510x931
docs/handoffs/screens/engineering_2026-09-02_v4/   26 files (pdf slices, band shots,
                               8 side-by-sides, 3 rail widths, reviews, 3 wheel phases)
```

---

## Risks

1. **Hero resolution.** The blueprint's hero crop uses 68% of the source width, so
   `hero.webp` is now 1525px wide instead of 2048. Sharp at 1x up to 1525px of viewport, soft
   on a 2x display. Never upscaled, by policy. The alternative is a wider crop that is not
   the blueprint's. Kazim's call.
2. **Chicken band scale.** Framing is right, scale is 1.45x tighter than the blueprint,
   because their original is wider than the file we hold. Only a wider original fixes it.
3. **Page gutters, not a Reviews bug.** The blueprint's page margin is ~10% of the width;
   ours is 48px (3.75%) site-wide from `lg:px-12`. That is why the Reviews heading starts at
   3.8% where the blueprint has 9.9%. Changing it moves every section on the page, so it is
   flagged rather than done. If Kazim wants the blueprint's margins, that is its own pass.
4. **The » arrow overlays the cut card.** Unavoidable while the third card bleeds to the edge
   as the blueprint draws it. The purple disc makes it read as a control. Olga should confirm
   it does not hide anything a guest needs on the third card at 1024 to 1440.
5. **Twenty-four plate elements, six images.** They are `loading="eager"` because the ring's
   far side is clipped off the right edge and a lazy plate would never intersect anything, so
   it would pop in as it rotated round. `fetchPriority="low"` keeps them behind the hero. The
   browser dedupes to six requests; worth a Lighthouse look at the fidelity gate.
6. **Reduced motion was verified from the built CSS, not from an emulated media query.**
   `browse` has no `emulateMedia`, so the JS branch was reasoned through and the CSS rule
   `.wheel-hub { transform: none !important }` was confirmed present in
   `.next/static/css/*.css`. Olga should tick it on a real machine with the OS setting on.
7. **`sips` is gone from `build-assets.sh`'s band path** but is still required for
   `spread.webp` and the pattern, so the script stays macOS only. Unchanged from before.

---

## Next

**qa-test-engineer (Olga)** for the fidelity gate, through the Michael (code-review) gate.

What the gate needs, per Lessons 21:

- the eight side-by-sides in `screens/engineering_2026-09-02_v4/`, with a written per-band
  verdict in the QA report, not a measurement in place of looking
- the » arrow over the third card at 1024, 1280 and 1440
- the wheel with the OS reduced-motion setting on: static arc, plates upright, no drift
- keyboard: tab into the wheel, confirm the plate that takes focus is brought into view and
  the wheel holds still while it is focused
- touch: the Locations rail must still swipe at 375 and 768, and the arrows must not sit over
  anything tappable
- the Locations rail's Order pill still opening the pop-up for the right hall, and Station 8
  still reading Coming Soon

Rebuild note for whoever runs this next: `rm -rf .next/cache/images` before `npm run start`,
or the optimizer serves the previous crops under the same URL and the fix looks like it did
nothing. Recorded as Lessons, Verification 5.

---

## Human gate

**Kazim decides:**

1. **Hero cap.** Keep `max-h-86vh`, or let the hero run to its full 1.2674 (1010px at 1280)
   with nothing of the About band visible below it, as the blueprint draws.
2. **Hero top scrim.** The blueprint has none. Ours is 0.42 purple across the top for nav
   legibility. Reduce it, or keep it.
3. **The chicken original.** Ask Lorena for the wider original of `cosmos 2-121`, or accept
   the tighter framing.
4. **Page margins.** The blueprint's ~10% page margin against our 48px. A separate pass if
   he wants it.

Nothing is committed. James commits.
