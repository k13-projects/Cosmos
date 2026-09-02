# The Hail Mary — K13's ship command

> The single most important workflow command. When Kazim (K13) says "hail mary"
> (or any trigger below), Claude/Cursor performs this end-to-end. Recognize it in any project.

## Triggers (case-insensitive, any of)
- `hail mary`
- `hail mary that shit`
- `hail mary pls` / `hail mary please`
- `hm`
- `hm pls` / `hm please`

## What it does (plain `hail mary` / `hm`)
1. **New branch** — create a branch following *this project's* naming convention
   (`<shortcode>_<monDD>_v<N>` by default; run `scripts/new-branch.sh`), and check out to it.
2. **Commit the session** — stage everything and write ONE commit that documents the whole
   session as a living historical record: what changed, why it mattered, decisions made, paths
   considered. Use the Hail Mary commit format below.
3. **Push** — `git push -u origin HEAD` so the branch tracks the remote.

Plain hail mary **stops after push.** Do NOT open/merge a PR unless `hm++` is used.

## Variants
- **`hm-1`** — same as hail mary but **skip step 1** (use when already on the target branch).
- **`hm++`** — full end-to-end ship. Hail mary **plus**:
  4. **Open a PR** against `main` with `gh pr create` — tight summary + test plan, mirroring the
     commit overview.
  5. **Merge the PR** with `gh pr merge <num> --merge` — a **real merge commit**. No squash, no
     rebase, no `--delete-branch`. **Keep every branch on origin** (standing rule).

## Hail Mary commit format ("grouped-bullet")
Non-trivial commits get the full treatment; tiny one-line fixes can stay one line.
1. **Subject** — imperative, one sentence, **no emoji**, ≤ 72 chars. Reads like a headline a
   non-technical person can grok.
2. **Overview** — 2–5 plain-language sentences: what changed, why it mattered, what the
   user/visitor will notice. Avoid code identifiers here.
3. `---` then **Technical details** — bullets **grouped by file / area / concern** (don't label
   sections "non-technical/technical"; the structure speaks for itself).
4. **Footer** — `Co-Authored-By: Claude <noreply@anthropic.com>`

## Notes
- Everything is **per-project**: branch format, commit style, and standing rules can differ.
  If the repo has its own `CONVENTIONS.md`/`CLAUDE.md`, that wins — read it first.
- A helper exists: `scripts/hm.sh` does the mechanical branch+commit+push (and `--ship` for
  hm++). The agent still composes the commit message (the script reads it from a file).
