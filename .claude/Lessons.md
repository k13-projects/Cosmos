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
