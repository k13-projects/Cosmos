# CLAUDE.md — Cosmos Burger

> House rules for this repo. See `CONVENTIONS.md` for the full K13 conventions and
> `.claude/Lessons.md` for the workflow rules. Review both at session start.

## Identity
- **Author/owner:** Kazim (K13 / Kazimiro). This is Kazim's project.
- Git identity: name `K13`, email `223161079+k13-projects@users.noreply.github.com` (`scripts/setup-identity.sh`).
- Collaborators Halil, Memo (MCS), Volkan are **EDISYN-only**, not involved here.

## Project
- **What:** marketing one-pager for Cosmos Burger (smash burgers, chicken sandwiches, tenders,
  loaded fries), replacing the current WordPress site at burgerscosmos.com. Built from Lorena's
  Canva blueprint; see `docs/intake/BLUEPRINT_FACTS_2026-09-02.md` for the full source read.
- **For:** client, **Tiger Hospitality Group** (THG). Stakeholder on the desk: **Eren**.
- **Shortcode:** `cosmos`   ·   **Deploy:** Vercel, project `cosmos` (team katalizor-kazims-projects), auto-deploys `main`   ·   **Repo:** https://github.com/k13-projects/Cosmos.git
- **Sibling:** `LobsterLab` is the nearest sibling (same client, same designer Lorena, same
  one-pager-with-pop-ups shape) — read its `CLAUDE.md` before building. Cosmos Burger has its
  **own** brand: magenta `#CD1AE0` / yellow `#FAF00C` / purple `#751080`, Archivo (the guide's
  face is Horizon, an Adobe Font; Archivo ships permanently, Kazim 2026-09-02) + Poppins. Never
  Tiger's black/gold Bebas Neue identity, never Lobster Lab's
  navy/orange Sofia Pro Narrow.

## Stakeholder preview
- **Address:** https://cosmos.k13projects.com (open, no gate; deployed 2026-09-02 with `Deploy Preview COSMOS`).
- **Production branch:** `main`. A merged PR redeploys it on its own; never deploy the working tree by CLI.
- **Out of search on purpose:** `NEXT_PUBLIC_SITE_URL=https://cosmos.k13projects.com` is set on Vercel, so
  `robots.ts` disallows everything and `next.config.mjs` adds `X-Robots-Tag: noindex` on the preview host.
  At cutover to the client domain, delete that variable and add the real domain to the project.
- DNS: CNAME `cosmos -> cname.vercel-dns.com` at GoDaddy (k13projects.com stays on GoDaddy nameservers).

## Run locally
- **Assigned dev port: `9157`** (K13 dev-port registry in `CONVENTIONS.md`, one fixed port per
  project, for life). Claimed 2026-09-02, next free row after ICP's 9156. Pinned in
  `package.json` as `next dev -p 9157`.
- Open: **http://localhost:9157/** · macOS: never use 5000/7000 (AirPlay squats them).
- `npm install` → `./scripts/build-assets.sh` (once, requires the gitignored asset library) → `npm run dev`.
- **Killing the dev/prod server:** the process renames itself, so `pkill -f "next start"` does
  **not** match it. Use `pkill -f next-server` (or kill the PID from
  `lsof -nP -iTCP:9157 -sTCP:LISTEN`). A stale server silently serves the previous build and
  makes fixes look like they did nothing.

## Asset library (gitignored, how to regenerate)
`Cosmos Assets/` holds ~70MB of client-supplied source: the blueprint PDF, structure docx, ideas
pptx, brand guidelines PDF, logo files (SVG/AI/EPS), and photos. It is **gitignored** — if it is
missing from a fresh clone, that is expected; ask the owner for it.
- `scripts/build-assets.sh` derives everything under `public/` from it: `public/photos/*.webp`
  (hero + 4 photo bands), `public/menu/best-sellers/*.png` and `public/menu/plates/*.png`
  (transparent cutouts, trimmed to their alpha bounding box), `public/brand/logo.svg` and
  `public/brand/pattern.png`. **Don't hand-copy files into `public/`**, add them to the script so
  a fresh clone can regenerate.
- Idempotent, safe to re-run. Requires `cwebp`, `sips`, and python3 with Pillow.

## Copy lives in `lib/content.ts`
Every string on the site (`site`, `nav`, and everything Natalia adds after) lives in
`lib/content.ts` with a provenance comment pointing at
`docs/intake/BLUEPRINT_FACTS_2026-09-02.md`. Components read from it; they never hardcode
strings.

## fitcheck
Run `fitcheck` after any layout, breakpoint or nav change — those are exactly the edits that
regress one screen size while fixing another. Nine viewports, shared measurement harness, trust
gate. Also part of the P5 "done" checklist. Skill: `~/.claude/skills/fitcheck/SKILL.md`.

## Git workflow, always branch → PR → merge
**Never commit directly to `main`, no exceptions.** Every change goes on a branch, into a PR, and
lands via a real GitHub merge (`gh pr merge --merge`; no squash/rebase, keep all branches).
- **Branch naming:** `cosmos_<monDD>_v<N>`, e.g. `cosmos_sep02_v1`. `scripts/new-branch.sh cosmos`
  picks the next `v<N>`.
- **Commits:** Hail Mary grouped-bullet, imperative no-emoji subject ≤ 72 chars → plain-language
  overview → `---` → technical details grouped by area → `Co-Authored-By: Claude <noreply@anthropic.com>`.
  Tiny fixes may stay one line.
- **Hail Mary:** `hm` → branch + documented commit + `git push -u`. `hm-1` skips the new branch
  (never on `main`); `hm++` also opens and merges the PR. Full spec in `HAIL_MARY.md`, mechanics
  in `scripts/hm.sh`.

## How Claude/Cursor should work here
- Plan mode for non-trivial tasks; use subagents liberally (`.claude/agents/`).
- **Desk questions go to Jessica.** Anything shaped like "what needs my attention", "what's on my
  plate", "status across projects", "draft a reply to X" — invoke `executive-assistant`
  (`.claude/agents/executive-assistant.md`, display name Jessica) explicitly and answer in her
  voice. Don't answer these directly as the raw session.
- Track work in `tasks/todo.md`; log corrections in `.claude/Lessons.md`.
- Verify before done; demand elegance; minimal impact; UX rule #1 (always guide the user).
- Build in phases P0→P5; run the P5 polish checklist before calling a site done.
- Mobile-first; `prefers-reduced-motion` for animations. No forms in this build (catering routes
  to ezCater); if that changes, no service keys client-side.

## Stack
- Next.js 15 (App Router) · Tailwind v4 · Lenis (smooth scroll) · `motion` · TypeScript. Deploy
  Vercel. No backend, no database, no forms in this build.

## Commands
- `scripts/setup-identity.sh` — set git identity to K13 (run once)
- `scripts/new-branch.sh [shortcode]` — next iteration branch
- `scripts/save.sh "feat: message"` — stage all + conventional commit
- `scripts/ship.sh` — push + open PR
- `scripts/hm.sh [--here] [--ship] <msgfile>` — Hail Mary / hm-1 / hm++ mechanics
- `scripts/polish-check.sh` — audit the P5 done-checklist
- `scripts/build-assets.sh` — regenerate `public/` from `Cosmos Assets/`

---

<!--K13_BROADCAST_START · managed by War Room — do not hand-edit-->
## 📡 War Room Broadcasts (org-wide rules)
> Synced from the K13 War Room. Each entry is a house rule that applies to every K13 project. Managed automatically — edit the rule in the War Room, not here.

<!--bc:2026-06-29-agent-agency-org-->
### 2026-08-13 · Team K13: named departments, the handoff contract & the autonomy contract
**K13 runs as team K13 — a controlled delivery pipeline, not a swarm.** Each AI specialist owns one repeatable stage, emits a predictable artifact, and hands off cleanly to the next. The **main Claude session is the GM (James)** — the only layer that sequences work (the hierarchy is flat: subagents don't spawn subagents, so agents never hand off to each other directly). **Jessica** runs Kazim's desk.

- **Roster + status legend:** `starter-kit/ORG.md` (War Room). Lean 7 to build first: Selma (`solutions-architect`) → Valentina (`brand-dna-designer`) → Natalia (`frontend-engineer`) → Olga (`qa-test-engineer`) → Irina (`security-auditor`) → Kate (`release-engineer`) → Gabi (`report-writer`). Human names are display labels; the functional `name:` is the routing key.
- **Handoff contract + Definition of Done:** `starter-kit/AGENT_HANDOFF_PROTOCOL.md`. Every delivery agent ends with the handoff block (Status / Summary / Files / Risks / Next / Human gate) and writes its artifact to `docs/handoffs/<stage>_<YYYY-MM-DD>.md` (same-day re-run → `_v2`, never overwrite).
- **Delegation is not optional.** James does not do a pipeline stage's work himself and call it done — every stage gets its named agent actually invoked (Task tool, `subagent_type` matching the agent file), even on a small project. **No artifact = the work never happened**: the War Room Org tab reads only `docs/handoffs/`, so skipping the artifact makes team K13 invisible on the board.
- **Autonomy contract — don't drip questions at Kazim.** Agents proceed by default. Only `Human gate` items come back to him: irreversible/destructive steps, money, real scope changes, anything that leaves for a client. Every other decision gets made, then **recorded in the handoff** instead of asked. Questions that genuinely survive are batched at the end of a run — never one at a time.
- **Parallel work:** sequential by default; James may fan out several agents **concurrently for independent work** (QA dimensions, security + a11y, research) and relay findings between them — each still writes its own handoff.
- **Agent vs skill:** token-heavy + isolatable → agent; in-context checklist/workflow → skill (compliance-checklist, media-generation).

<!--bc:2026-08-25-fitcheck-house-word-->
### 2026-08-25 · fitcheck: run the responsive-readiness pass after any layout, breakpoint or nav change
**Run `fitcheck` after any layout, breakpoint or nav change** — those are exactly the edits that regress one screen size while fixing another. `fitcheck` (alias `fit`) is the K13 responsive-readiness house pass: nine viewports (320 → 1920, including the two landscape sizes everyone forgets), a shared measurement harness with a trust gate, and the bug classes that only appear at one size — horizontal leaks, tap targets under the WCAG 2.5.8 AA floor, panels that are invisible but still in the tab order, scroll containers that strand their own header, and heroes that exactly fill a short viewport so nothing signals the page continues. It measures, looks, fixes at the source, and re-measures. It is also part of the P5 "done" checklist (`starter-kit/CONVENTIONS.md`). Skill: `~/.claude/skills/fitcheck/SKILL.md`.

<!--bc:2026-08-28-cc-commit-check-->
### 2026-08-28 · CC? — the pre-close commit check
**Ask `CC?` before closing a tab.** It means: "is anything lost if I close right now?" The session audits itself, read-only, and answers in one of two shapes: `✅ CC: safe to close` (one line of why), or `⚠️ CC: save these first` listing each unsaved item with a proposed save action, then waits for your pick. The sweep, in order: (1) git — uncommitted session work, unpushed commits, feature branches without a PR, open unmerged PRs (a repo's own known auto-refresh churn is excluded, not every dirty tree); (2) unwritten rules — corrections, decisions, or coined commands from the conversation not yet in this repo's `CLAUDE.md`/`Lessons.md`/memory; (3) deferrals not parked in a tracking ledger if this repo has one; (4) deliverables stranded in scratchpad/temp or outside any repo; (5) end of a working day — offer a journal/changelog entry if this repo keeps one, never auto-write it. `CC?` itself never saves anything — saving only happens after you choose.

<!--bc:2026-08-28-gstack-berths-->
### 2026-08-28 · GStack Berths: one browser slot per project
**Claim a `berth` for GStack Browser, do not share it blind.** GStack Browser is one shared Chromium instance for the whole machine by default (one profile directory, one fixed port 34567), not per project. Two Claude Code sessions in two different projects that both touch it (`/qa`, `/design-review`, `/browse`, `connect-chrome`, sidebar chat) end up driving the exact same window, stealing each other's active tab. The fix uses gstack's own supported per-workspace knobs: pin `CHROMIUM_PROFILE` and `BROWSE_PORT` in this project's `.claude/settings.json` under "env", derived from the dev port already claimed in `CONVENTIONS.md` so there is never a second table to drift: `BROWSE_PORT = <dev port> + 30000` (e.g. 9137 to 39137), `CHROMIUM_PROFILE = ~/.gstack/berths/<shortcode>`. Claim it once, the next time you are actively working in this project with GStack Browser alongside another active session; until claimed, nothing changes (opt-in, additive, no breakage). Never reach for `browse --force-restart` as a shortcut instead: it destroys the other session's tabs, cookies, and logins. Full spec + root cause: `K13-WarRoom/starter-kit/GSTACK_BERTHS.md`.

<!--K13_BROADCAST_END-->
