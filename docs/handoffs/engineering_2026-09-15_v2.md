# Engineering handoff — Cosmos Burger, Round 3 work package B, Locations (Natalia, 2026-09-15)

**Repo:** `/Users/k13/Desktop/PROJECTS/Cosmos` · **Branch:** `cosmos_sep10_v1` (working tree,
uncommitted per Lesson 0 — no commit, no branch, no push made this run) · **Files owned:**
`components/Locations.tsx`, `lib/content.ts` (globals.css untouched — Locations did not need it).
Package A (About/Values/Icons/PlateWheel) was being edited in parallel by another hand; none of
those files were opened or touched here.

**Verification method:** `npm run build` + `npx tsc --noEmit`, both clean, plus reading the
prerendered static HTML the build produced (`.next/server/app/index.html`) to confirm the actual
class strings and `<img width/height>` attributes landed as written. No dev/prod server was
started or killed (another agent owns port 9157), no browser was driven. The mobile-overlap and
title-clipping numbers below come from measuring the real Archivo variable font (fetched the exact
woff2 Next serves, `wdth=125` instance, via `fontTools`) against the actual CSS, not from
eyeballing or guessing.

## Status      DONE, with one flagged gap for the Chrome gate

## Summary
All four of Lorena's Round 3 Locations items (`docs/intake/client_email_2026-09-10.md`) are
implemented and build clean:

- **(a) Her four drawings wired in** with real intrinsic sizes, and the card's corner-mark box
  reworked so landscape/near-square art fills it instead of being squashed into a forced square.
- **(b) Item 8**, the Directions button hiding the drawing on mobile: root-caused (not just
  patched) to a specific regression, fixed by restoring mobile-only clearance.
- **(c) Item 7**, the Locations title cut off on mobile: root-caused to real word-width overflow
  against the section's `overflow-hidden`, fixed, and every other `display` headline on the page
  checked for the same bug class (found nowhere else, see table below).
- **(d) Frings photo** wired into the menu pop-up; the two stale "no photo" comments corrected.

### (a) Her drawings, real sizes, and the corner-mark geometry
`lib/content.ts` `mark` fields updated to the real PNG dimensions (verified with `sips`):
windmill 1400x1348, oceanside 1400x1606, global-fork 1400x848, station-8 1400x788. Miramar
untouched at 800x776 per her instruction (she prefers the one already on the site).

The corner-mark `<Image>` in `Locations.tsx` dropped `aspect-square`. That class forced every
mark into a 1:1 box regardless of its real shape, so `object-contain` letterboxed the landscape
and near-square drawings down to fit a square — exactly "small and floating." Removing it lets the
browser's native `aspect-ratio: attr(width) / attr(height)` (set automatically from the `width`/
`height` attributes `next/image` renders, which now carry the real numbers above) size the box to
each drawing's own shape, so four of the five render at full, uncropped size for the first time.

The one risk this creates: Oceanside (1400x1606) is the sole portrait outlier among otherwise
landscape/near-square art. Uncapped, at `w-[52%]` its natural height comes out to ~60% of the
card's own width — against a card whose *entire* height at `lg` is fixed at ~65% of its width
(the blueprint's 443:289 ratio baked into the `<li>`'s `min-h`). Left uncapped, that one card's
mark would be nearly as tall as the whole card. Added `max-h-[42vw] sm:max-h-[32vw]
lg:max-h-[18vw]` — the same three breakpoint values the `sizes` hint on the next line already
used, so it isn't a new number, just reused where it was missing. When a mark's natural height is
under the cap (four of five drawings), the cap never engages and nothing changes; only Oceanside
gets a small `object-contain` letterbox, which is a far smaller compromise than the old
force-everything-to-square did to the other four.

### (b) Item 8 — root cause, not a patch
Reproduced by measurement, not by eye. At 375/390px the card content box is ~236-248px wide; the
controls row (`Order` .btn-sm, 44px min-height + `Directions` link, 44px min-height, fixed labels
on every card so the row width never varies card to card) measures to roughly 210-215px combined,
i.e. it stays on one line at both required widths and sits flush against the card's floor
(`mt-auto`). The corner mark was positioned `-bottom-[6%] -right-[6%]` **unconditionally at every
breakpoint** — flush into the corner even on a 292px-wide phone card.

The file's own (now-stale) comment on that `<Image>` described a `bottom-[88px]` mobile-only
offset with a documented "safe window measured at 80-100px" for clearing the controls row without
reaching the text above it — but the actual `className` had only the unconditional `-bottom-[6%]`,
no responsive override at all. Checking `git log` on the file confirms the drift: commit `8247f50`
("Push the location marks into the corner and make them larger", 2026-09-02) grew the mark from
21% to 52% and replaced the old two-tier `bottom-[88px] / sm:bottom-4 / lg:bottom-5` scheme with a
single unconditional value, without re-testing mobile against the now much bigger mark — the exact
regression Lorena is reporting. The next commit (`24f3e6b`) added the `.halo` knockout as a safety
net, but a halo only erases the mark cream-clean under whatever sits on it; it doesn't stop the
mark's densest, most-legible corner from landing directly under the controls in the first place,
so the result read as "the button covers the drawing," not "the button politely knocks a hole in
it."

Fix: `bottom-[88px] sm:-bottom-[6%]`. I independently re-derived the clearance need against
today's actual button sizes (not just trusted the old number) and landed in the same 80-100px
window, so restoring 88px is evidence-backed, not a guess. At `sm` and up the flush corner is kept
exactly as before — no complaint from Lorena at those sizes, and the cards get materially wider
there, and this was already true at those sizes before this fix.

**Verified at 375 and 390** (the widths the task asked to reproduce at): mark box bottom edge at
88px, controls row top edge at 28px (p-7) + 44px (row height) = 72px from the card floor. 88 > 72
by 16px at both widths — clean separation, no overlap, independent of which card/drawing (this
depends only on the mark's bottom offset, not its height).

**Flagged, not fixed:** at a narrower phone (~320px, e.g. iPhone SE) the controls row wraps to two
lines (~120px tall including the wrap gap), which 88px alone does not fully clear — I calculated
roughly 60px of residual overlap in that one case. The task asked to reproduce and verify at 375
and 390 specifically, which is clean; I'm flagging 320px honestly per Lesson 4 rather than silently
extending scope, since I have no browser in this run to confirm exactly how it renders (the halo
knockout may still make it read fine — I don't know without seeing it). Worth a check in the Chrome
gate; if it's still a problem, the fix is either a slightly larger mobile offset or splitting the
shared `.halo` on the controls row into two independent per-button halos (currently one shared
`fit-content` halo wraps Order+Directions together, which is wider than either button alone).

### (c) Item 7 — Locations title clipping, root cause and page-wide check
Measured "LOCATIONS" against the real served font (Archivo, weight 900, `wdth=125`, the exact
variable-font instance `.display` selects) with `fontTools`, including the `-0.01em`
letter-spacing the class applies. At `text-[13vw]` (what every sibling `display` headline uses),
the word's advance width comes out to ~379px at 375px viewport and ~394px at 390px, against a
content box of 335px/350px (viewport minus the section's `px-5` padding) — 43-44px of unavoidable
overflow, because "Locations" is one word and can't wrap. The `<section>` carries
`overflow-hidden` (needed for the horizontal card rail below it), so that overflow wasn't
wrapping or spilling visibly — it was being sliced off the right edge. That's the actual "cut off."

I also checked the glyph box against the line box (the other half of what was asked): cap-height
letters in this font run 0 to ~0.70em; even at `line-height: 0.92` the browser's negative-leading
math leaves roughly -0.13em to 0.79em of vertical room around the baseline, comfortably clearing
0 to 0.70em. No vertical clipping — this bug is purely horizontal.

Fix: `text-[13vw]` to `text-[11vw]` on this one heading only. At 11vw the same word measures with
6.6px of clearance at the worst case in the viewport range this class applies to (320px, the
narrowest below `sm`), and more everywhere above that. `sm:text-6xl lg:text-[76px]` (the fixed
sizes at wider breakpoints) are untouched.

**Every other `.display` headline checked for the same bug class**, per the task's instruction not
to edit About's or Values' files myself:

| Component | Heading text | Mobile size | Result |
|---|---|---|---|
| `About.tsx` | "Unleash the flavor" | `text-[13vw]` | Multi-word, wraps normally inside its `max-w-[640px]` column; no `overflow-hidden` on the section. Not clipped. |
| `CateringSection.tsx` | "Catering" | `text-[13vw]` | Single word, measures within ~0-7px of its box across 320-390px (essentially fits, inside font-metric rounding); section has no `overflow-hidden` either, so even a stray sub-pixel would show, not slice off. Not clipped. |
| `MenuSection.tsx` | "Explore our menu" | `text-[12vw]` | Multi-word, wraps normally; no `overflow-hidden` on the section. Not clipped. |
| `Reviews.tsx` | "Reviews" | `text-[13vw]` | Single word, measures 29-44px **under** its box at 320-390px; comfortable margin. No `overflow-hidden` on the section either. Not clipped. |
| `LegalPage.tsx` | page titles | `text-[8.5vw]` | Not reproducible from Round 3 assets/content changes; smaller vw and `break-words` is already set. Did not deep-measure — out of scope for this ticket (not a page Lorena reviewed), flagging only. |

**Locations is the only one that had both conditions at once** (a single unbreakable word wide
enough to overflow its box, and a section that clips instead of letting it show) — which is why it
was the only headline that broke, and why I only touched this one file, per the instruction not to
edit About's or Values' components even to fix a shared bug class.

### (d) Frings photo
`lib/content.ts`: the Frings item in Sides now carries `image: { src:
"/menu/items/frings.webp", alt: "Frings" }` (opened the file to confirm it's a real 640x480, 4:3
bowl-of-fries-and-onion-rings photo, not just trusting the filename). `alt` text matches the
sibling convention for plain side items (`"Truffle Fries"`, `"Regular Fries"`, etc. — plain name,
not a descriptive sentence; that longer style is reserved for the featured burger/tender photos
reused elsewhere on the page). Confirmed in `MenuPanel.tsx` (read-only, not in my file list) that
the placeholder-vs-photo branch is a plain `item.image ? <Image/> : <placeholder>`, so this
content-only change is sufficient — no component edit needed. Both stale comments that said
"Frings and Cauliflower Bites have no photo on file" (one at the file's top block, one inline on
the Frings item itself) are corrected; Cauliflower Bites' own comment and behavior are untouched,
as instructed.

## Files changed
- `lib/content.ts` — mark sizes (windmill/oceanside/global-fork/station-8) + provenance comments;
  Frings `image` entry + two corrected comments.
- `components/Locations.tsx` — heading `text-[13vw]` to `text-[11vw]`; corner-mark `<Image>`
  dropped `aspect-square`, added `max-h-[42vw] sm:max-h-[32vw] lg:max-h-[18vw]`, changed
  `-bottom-[6%]` to `bottom-[88px] sm:-bottom-[6%]`; rewrote the stale geometry comment to match.
- `app/globals.css` — untouched, not needed.
- `tasks/todo.md` — package B's four checklist lines ticked.

## Risks
- Oceanside's letterboxed corner mark under the new `max-h` cap is reasoned from font/CSS math,
  not seen. It should look like a slightly narrower (not squashed) version of the same drawing;
  worth a visual glance in the QA gate since it's the one card whose treatment genuinely differs
  from its four siblings now.
- The 320px wrapped-controls gap flagged under (b) above.
- `LegalPage.tsx`'s `text-[8.5vw]` headline was named in the sweep but not deep-measured (out of
  Round 3's scope, no client complaint against it); flagging only, not claiming it's fine.

## Next
Olga (qa-test-engineer) for the Chrome gate: desktop + mobile screenshots at 375 and 390 minimum
(the sizes this fix targets), plus a look at 320px for the flagged wrap case, plus the Oceanside
card specifically for the new letterbox. Per house rule this report isn't "done" until it passes
that gate, logged in a sidecar `.qa.json`. Package A's own handoff (`docs/handoffs/engineering_2026-09-15.md`,
unsuffixed) covers About/Values/Icons/PlateWheel and should be read alongside this one before the
gate runs, since QA will be testing the same build.

## Human gate
None from this work package — everything here was already decided (Lorena's own email, Kazim's
2026-09-02 design direction for the corner mark, and the codebase's own prior measurements). The
one thing worth a heads-up rather than a decision: the 320px wrap-case gap above is a real,
named residual risk, not a silent one.

Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
