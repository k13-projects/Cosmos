# Lessons & Workflow Rules — K13

> How Claude/Cursor should operate on Kazim's (K13) projects. Review at session start.
> Author/owner of this project: **Kazim** (aka K13, Kazimiro, Kazim Anil Korkmaz).
> Halil, Memo (MCS) and Volkan are EDISYN-only collaborators — do not attribute this project's work to them.

## Workflow orchestration
1. **Plan mode default** — enter plan mode for any non-trivial task (3+ steps or architecture). If it goes sideways, STOP and re-plan. Write detailed specs upfront.
2. **Subagent strategy** — use subagents liberally to keep the main context clean. Offload research, exploration, parallel analysis. One task per subagent. Throw more compute at hard problems.
3. **Self-improvement loop** — after ANY correction from Kazim, add the pattern to this file. Write rules that prevent the same mistake. Review at session start.
4. **Verify before done** — never mark complete without proving it works (tests, logs, diffs). Ask: "Would a staff engineer approve this?"
5. **Demand elegance (balanced)** — for non-trivial changes, pause: "is there a more elegant way?" If a fix feels hacky, redo it properly. Skip for obvious fixes — don't over-engineer.
6. **Autonomous bug fixing** — given a bug, just fix it. Point at logs/errors/failing tests, then resolve. No hand-holding.

## Task management
1. Plan first → write to `tasks/todo.md` with checkable items.
2. Verify the plan before implementing.
3. Track progress — check items off as you go.
4. Explain changes — high-level summary at each step.
5. Document results — add a review section to `tasks/todo.md`.
6. Capture lessons — update this file after corrections.

## Core principles
- **Simplicity first** — every change as simple as possible; minimal code impact.
- **No laziness** — find root causes; no temporary fixes; senior-developer standard.
- **Minimal impact** — only touch what's necessary; don't introduce bugs.

## UX rule #1
> Never assume the user knows what to do. Always guide them — but stay minimal.
Every screen/form/modal answers "what do I do next?" Helper text, clear empty states, actionable errors. Minimal ≠ silent.

## The Hail Mary
On `hail mary` / `hm` (or `hail mary that shit` / `hm pls`): new branch → commit the whole session as a documented grouped-bullet record → `git push -u`. `hm-1` = skip the branch; `hm++` = also `gh pr create` + `gh pr merge <n> --merge` (real merge, no squash/rebase, no `--delete-branch`, keep every branch). Plain hail mary stops after push. Full spec in `HAIL_MARY.md`.

## Learned patterns
> Add entries here after corrections from Kazim.

### Shipping, corrected by Kazim 2026-07-30
0. **Never run `hm` / `hm-1` / `hm++` on your own initiative.** Branch → PR → merge is always the
   *mechanism*, that part was never in question and no commit has ever landed on `main` outside a
   PR. What is not yours to decide is *when to pull the trigger*. Build the work, push a branch if
   useful, then stop and report. Kazim says `hm` / `hm++`. Merging to `main` is his call, every time,
   including for changes that look obviously safe.

### Verification
1. **"Fixed" needs a before/after pair.** Paste both numbers. An adjective is a claim, not a result.
   Example: `scrollHeight 667 == clientHeight 667, title at -543px` → `scrollHeight 1238 > 667,
   title at 28px`.
2. **A dead server measures as flawlessly clean.** Every check returns zero because there is
   nothing to check, and that reads as a pass. Assert the page actually loaded before trusting any
   sweep, `curl` the URL, and check the DOM has content.
3. **`next start` renames its process to `next-server`.** `pkill -f "next start"` misses it and the
   stale server keeps serving the previous build, so fixes look like they did nothing. Cost two
   cycles. Use `pkill -f next-server`, then verify the new markup is actually served with `curl`.
4. **Say what you could not test.** An untested area reported as passing is worse than no report.
5. **`next start` serves images from `.next/cache/images`, which survives `npm run build`.**
   Re-cropping a photo in `scripts/build-assets.sh` and rebuilding is not enough: the optimizer
   keeps serving the old bytes under the same `/_next/image?url=...` key, so a corrected crop
   screenshots as the old one. Cost one cycle on the band fidelity gate. `rm -rf .next/cache/images`
   before restarting, and check the shot against the exported file, not against the last shot.
   Related: killing a slow `/_next/image` request mid-flight leaves that width wedged for the life
   of the process. Restart the server rather than retrying the URL.

### Agents
8. **Agents audit; one hand edits.** Parallel agents editing the same files clobber each other.
   They return measurements, screenshots and exact diffs.
9. **Split agents by device tier AND by lens** (QA / designer / front-end) so the same page gets
   several independent readings.
10. **Verify every agent finding before acting.** They self-correct, but they are wrong exactly
    where they did not double-check. Reproduce it yourself first.
11. **The browse daemon is shared between parallel agents and is NOT isolated.** Viewports and tabs
    bleed across sessions, this produced five phantom failures in one sweep. Assert
    `window.innerWidth` in-band inside every measurement.

### Blueprint fidelity, corrected by Kazim 2026-09-02
14. **The client PDF wins over everything, including K13 DNA and the client's own slide deck.**
    We put a giant animated Cosmos wordmark with a sheen in the hero because the ideas deck said
    "animated logo" and the house has a signature-moment habit. The PDF hero is a photo and a nav,
    nothing else. Kazim: "bize böyle bir şey verilmemiş." Add a K13 flourish only where the PDF
    leaves a gap, never on top of what it draws.
15. **A transparent PNG from the client is a sticker, not a photo.** `Cosmos General.png` has an
    alpha channel because it is meant to sit on the purple pattern with the plates rising over the
    table's top edge (depth). We flattened it on cream and shipped a square band. Never matte a
    client cutout; ask what the transparency is for by looking at where the PDF places it.
16. **Read the geometry of the mockup, not just the inventory.** The About plates in the PDF hang
    on an arc along the right edge, like a wheel whose hub is off-screen. We rendered a straight
    column. Kazim wants the wheel: it turns with scroll, hover shows an instant CAPS tooltip that
    stays, and it never covers "Fresh always" (the PDF does not).
17. **Logo top-left: no ground behind it, ever.** Readability comes from a soft shadow, and the
    logo is sized to the nav pill's height. The purple backdrop added at the QA gate for the
    scroll-overlap bug was the wrong fix; the right one is the shadow plus keeping section
    headlines clear of the fixed header.
18. **Footer contact block: never dump addresses.** Locations already live in their own section.
    CONTACT INFO and FOLLOW US are two symmetric, tidy columns; the handle sits under its label,
    not beside it.

### The fidelity gate, corrected by Kazim 2026-09-02 (second round)
19. **Photo bands are crops, not slots.** Each band in the PDF has its own aspect and framing
    (hero ~0.78 of width, fries ~0.35, chicken sandwich ~0.49, phone ~0.62). We gave every band
    one height and let `object-cover` pick the middle, so a portrait sandwich photo showed only
    the bun. Intake must record aspect + framing per band; the build must reproduce the PDF's crop
    (crop the asset in `build-assets.sh` when the source framing differs), never a uniform vh.
20. **Rails match the PDF's density.** Locations in the PDF shows two full cards and a third cut,
    big cards (~33% of the width), the « arrow on the left at mid-height. We showed four narrow
    cards. Card count visible, card size and arrow placement are part of the spec, not styling
    freedom. Same for Reviews (heading left, cards to the right, scrolling).
21. **QA on a mockup-driven build is not done without the fidelity gate:** one side-by-side per
    band (PDF slice vs screenshot at 1280 and 375) with a per-band verdict written in the QA
    report. Measurements (leaks, tap targets, collisions) do not replace looking. Owner: Olga;
    James blocks the merge without it.
22. **Attribution for the 2026-09-02 miss:** James (intake spec omitted geometry), Olga (gate
    skipped the side-by-side), Natalia (fidelity table compared inventory, not geometry).

### Interactive motion components, corrected by Kazim 2026-09-02 (plate wheel)
24. **Any image inside a draggable or scroll-driven component must be `draggable={false}`** with
    `user-select: none` and `-webkit-user-drag: none`, or the browser's native image drag takes
    over: Kazim "dragged the wheel", the ghost image followed, and releasing it triggered an image
    download. Native drag also swallows `pointerout`, so a hover-paused wheel never resumed.
25. **Every pause state needs an exit that does not depend on the event you hope for.** Hover
    pause must clear on `pointerleave`, `pointerup`, `pointercancel`, `dragstart`, window blur
    and visibility change; belt and braces, re-check `:hover` on the next frame.
26. **If a gesture is possible, it must be designed, not accidental.** Kazim liked dragging the
    wheel; make drag-to-spin a real gesture (pointer capture, velocity, momentum decaying back
    to the ambient speed, click-vs-drag threshold so a drag never opens the menu pop-up), and
    have QA test the gesture matrix (mouse, trackpad, touch, keyboard, reduced motion).
27. **`motion` opacity tweens flash on cancel.** A lone opacity animation is handed to the
    browser's animation engine, and cancelling it (rapid clicks, interrupted exit) paints one
    frame at the element's base value: a leaving plate flashed back to 100%. Keep transform in
    `motion`, move opacity to CSS transitions. Found on the Best Sellers carousel, 2026-09-02.
28. **Travel and wobble are two different springs.** A single physical spring cannot arrive
    from 60% away with a 5% overshoot and still show a visible settle; decouple them (arrival
    envelope, then a small damped settle) when a client asks for "a little shake, but smooth".

### Scroll ownership, found by Lorena 2026-09-08 (menu pop-up would not scroll)
29. **Any scrollable box inside a Lenis page needs `data-lenis-prevent`.** Lenis listens for
    the wheel on the window, cancels the event and moves the document itself, so a dialog with
    its own `overflow-y: auto` gets the scrollbar but no scroll: 3433px of menu in a 720px
    window, wheel `defaultPrevented`, scrollTop 0 before and after. Do not reach for
    `lenis.stop()` while the dialog is open: a stopped Lenis still cancels every wheel event
    (its own `onVirtualScroll`), which is the same bug wearing a different hat. The same
    applies to any future drawer, rail-in-a-modal or in-page scroller.
30. **QA the production build, never `next dev`.** The dev bundle does not hydrate under
    this site's static CSP (no `'unsafe-eval'`), silently: no console error, the page renders
    from the server, and every click and every reveal does nothing. A whole round of "the
    pop-up does not open" was that. `npm run build && npx next start -p 9157` is the only
    server that measures anything real here (CLAUDE.md already says how to kill it).

### Collision measurement, corrected by Natalia 2026-09-15 (mobile plate wheel)
31. **`getBoundingClientRect()` ignores an ancestor's `overflow: hidden`.** A script sweeping
    the mobile plate wheel's full rotation for text collisions read minus 60 to 90px against the
    values band on first pass, a false alarm: the wheel's belt clips everything to a small box,
    but the rect the script was comparing was the plate's full, unclipped layout position, most
    of it never actually painted. Fixed by intersecting each element with its clipping
    ancestor's own rect first, and only comparing what survives that intersection. Any script
    that judges visual collision from raw `getBoundingClientRect()` values, not just this
    project's wheel, needs the same clip step whenever the element sits inside an
    `overflow: hidden`/`clip` box.
32. **A CSS-only per-element tooltip that is "always on" does not scale to a dense repeating
    ring.** The mobile wheel's 24 spokes (6 dishes x 4 repeats) can put ten-plus captions on
    screen at once inside a 90 to 100 degree arc; showing a name under every visible plate
    crowded them into unreadable overlap. Gate the always-on caption to the PRIMARY instances
    only (here: `primary` from `about.plates`) — the ring keeps turning, so a repeat's own named
    instance comes back into view on its own, and nothing is permanently unlabeled.
    **Superseded by Lesson 33's fix, same day (Olga, QA gate):** cutting to six was not enough.
    Six always-on captions can still land inside the same 90 to 100 degree visible arc at once
    (they are not evenly spaced within the belt's own view window, only around the full circle),
    and because the belt clips vertically while the ring never stops turning, any always-on
    caption's own position sweeps across the clip edge every rotation and gets sliced mid-word.
    "Fewer captions" was the wrong axis; "not always on" was the fix. See Lesson 33.

### Caption visibility on a moving, clipped ring, corrected by Olga 2026-09-15 (QA gate)
33. **On a ring that never stops turning inside a clipped belt, no always-on caption is safe,
    no matter how few.** James caught this from the built screenshots before the QA pass even
    started: several of the mobile wheel's six "primary" captions (Lesson 32) were stacked into
    overlapping pills, and the same captions were sliced mid-word ("EN", "E" with no plate under
    them) by the belt's own `overflow-hidden` edge. Root cause: an always-on element's position is
    exactly as moving as the plate it labels, so it inevitably sweeps through the clip boundary
    on every revolution — there is no caption count low enough to make "always visible" safe
    inside a clipping, continuously-rotating container. Fixed by dropping "always on" entirely and
    matching the desktop ring's own model: hidden by default, revealed only on `:focus-visible`
    (keyboard/screen-reader), the same class on both rings. Touch has no hover to lose, and a tap
    already opens the menu and names the dish there. **The general rule:** inside any
    continuously-animated, clipped container, a label's visibility must be tied to a discrete,
    non-animating trigger (focus, hover, a click-to-reveal state) — never "on by default while
    true," even for a subset of elements, even if the subset is small.
