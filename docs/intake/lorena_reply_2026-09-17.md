# Lorena's reply, 17 September 2026, and what we did with it

Her answer to the combined Tiger email (`K13-WarRoom/docs/TIGER_SIGNOFF_EMAIL_2026-09-17_sent-to-client.html`),
received 17 Sep 2026 17:41, on the thread "Tiger Hospitality Sites: Status Update and Open Items".
Eren on cc. This file is the Cosmos part; the STATION8 part is in that repo's own intake folder,
and the Lobster Lab part shipped the same evening.

Everything marked DONE below is checkable on the preview.

---

## What she answered, verbatim in substance

**Toast ordering links.** Four, one per open hall:

| Her name for it | Our `id` | Link |
|---|---|---|
| Little Italy | `little-italy` (Global Fork Food Hall) | `order.toasttab.com/online/cosmos-burger-little-italy-550-w-date-st-suite-b` |
| Miramar | `san-clemente` (Miramar Food Hall) | `order.toasttab.com/online/cosmos-burger-miramar-food-hall-1720-north-el-camino-real` |
| Windmill | `carlsbad` (Windmill Food Hall) | `order.toasttab.com/online/cosmos-burger-windmill-food-hall-890-palomar-airport-road` |
| Oceanside | `oceanside` | `order.toasttab.com/online/cosmos-burgers-oceanside` |

Note the mapping: she names halls by their own brand, our ids are geographic. Station 8 has no
Toast link because the hall has not opened, which is the fifth of the five.

**Footer contact.** `info@burgerscosmos.com` is the email. The **address and phone are still
open**: she put that question to Eren in the same message and he has not answered yet.

**Cauliflower Bites photo.** She is asking her team. Still owed.

**Opening sequence.** "We don't have any footage available for now. What options do we have to
animate the main section of the website so it doesn't look like just a static product image?"

**Station 8 badge.** "Yes, please add a Coming Soon badge to this section."

**Locations title.** "I like how the Locations title looks now." Closed: it stays left aligned,
matching every other section heading. No change, and the blueprint's centred version is not coming
back unless she asks again.

---

## What we changed

**DONE. Toast is wired on all four open halls** (`lib/content.ts`). Every hall's Order pop-up now
shows two chips, Toast PICK UP and DoorDash DELIVERY, instead of DoorDash alone. Station 8 still
shows the badge and "Opening soon" and no chips, which is correct.

One judgement call worth recording: her link goes on `toastPickup`, and `toastDelivery` is left
empty for every hall. A Toast storefront URL proves an ordering page exists; it does not prove
that hall delivers through Toast. Claiming delivery we cannot see is the kind of thing a guest
finds out the hard way, so the chip says what we know. If a hall does deliver through Toast, one
URL in `toastDelivery` turns the third chip on with no other change.

**DONE. The footer carries the email** (`lib/content.ts` `contact.email`). `phone` stays an empty
string on purpose: the block hides itself until there is something true to put in it. The address
has no field at all, deliberately (`components/Footer.tsx` header comment) - if Eren wants a single
HQ address published, that is a small addition, not a config change.

**DONE, and it already existed. The Coming Soon badge.** This is the useful part of her note. The
card has carried a Coming Soon badge since the card was built; what it did not do is read as one.
It was a thin outline pill, purple on cream, and she looked straight past it. So:

- New `components/StatusBadge.tsx`, filled purple with cream text, which reads as a badge at a
  glance on a cream card.
- The identical markup that was copy-pasted in `Locations.tsx` and `OrderPanel.tsx` is now that
  one component, so the two surfaces cannot drift apart again.
- The `sr-only` status on the heading in `Locations.tsx` is kept: the visible pill sits in a
  different flex row from the name, so a screen reader needs the heading to carry it too.
- Padding is tighter below `sm`. Not a regression fix: the old outline pill was 2px of border
  wider each side, so the mobile badge is now narrower than what shipped before.

**DONE, and the interesting one. The hero moves.** Her question was what options exist without
footage. The answer that needs nothing from anybody is a slow camera on the still we already have:
`.hero-drift` (`app/globals.css`, class applied in `components/Hero.tsx`) eases the photograph from
106% to its own frame over 90 seconds and holds there.

- `scale` only, never `translate`. The image is a `fill` layer cropped to the blueprint's
  1332:1051, so scaling keeps the framing at both ends while a pan would slide the front row of
  burgers out of the bottom of the band.
- `forwards`, so it settles and stays settled. Scroll back to the top and the hero is not caught
  mid move, and nothing keeps painting after the band has left the screen.
- Not scroll-linked. The hero is the first thing on the page, so a scroll effect only plays as the
  band is leaving, which is the one moment nobody is looking at it.
- Reduced motion holds the settled frame, in the one block at the bottom of `globals.css` where
  every other motion decision in this project lives.

The bigger option, the burgers dropping in and assembling at the top of the page, is the idea she
liked when we met, and it does **not** need footage: `public/menu/plates/1-6.png` and
`public/menu/best-sellers/*.png` are already cutouts on transparent ground. It needs art direction
rather than animation, so it is quoted to her as a separate piece of work rather than slipped in.

---

## Still owed, and by whom

| What | Who | Note |
|---|---|---|
| Footer address and phone | **Eren** | She asked him on 17 Sep in the same message |
| Cauliflower Bites photo | Lorena | The last menu item with no picture |
| Toast delivery links, if any hall delivers through Toast | Lorena | Optional; pick-up is live either way |
| Decision on the opening sequence | Lorena and Kazim | Priced separately, needs art direction |
| Station 8 opening date | Lorena | Asked 17 Sep, not answered; the badge stays until there is one |
