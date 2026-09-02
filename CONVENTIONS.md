# K13 Project Conventions (house rules)

Extracted from Kazim's repos. These are the defaults; override per project as needed.

## Git workflow
- **NEVER commit directly to `main` (`beta` for EDISYN) — any repo, ever.** Every change, including
  routine data refreshes, goes branch → PR → **real GitHub merge** (`gh pr merge --merge`, no
  squash/rebase, keep all branches). No exceptions. _(Kazim, 2026-06-24.)_
- **Repos:** GitHub under `k13-projects` (personal/client) — EDISYN lives under `halilsekeroglu`.
- **Branch naming:** `<shortcode>_<monDD>_v<N>` — lowercase 3-letter month + zero-padded day + iteration number.
  - Examples: `tiger_18`, `st8_apr24_v10`, `vida_apr16_v5`, `tmb_may21_v3`, `mira_jun01_v1`.
  - One branch per iteration/attempt; bump `v<N>` for each new try the same day.
  - Pick a short project shortcode once (tiger, st8, gf, mira, vida, tmb, nox, cengo, tng…).
- **Merge style:** feature branch → PR into `main` (`beta` for EDISYN). PRs titled by what shipped.

## Local dev ports (one fixed port per project)
**Why:** running two projects at once shouldn't crash either. If every app defaults to 3000/5173 they fight over the port — the second silently bumps to a wrong port (stale tabs, broken API calls) or errors. So **each project owns one fixed port** and pins its dev server to it. Two projects can then run side by side, forever.

**The K13 dev block: `9130–9199`** (the "913x" nods to K13; the whole block is clear of system, AirPlay, and our other running services).

| Port | Project | Shortcode | Stack |
|------|---------|-----------|-------|
| 9130 | K13 Website | `site` | static |
| 9131 | THG-Website (Tiger) | `tiger` | node/express |
| 9132 | STATION8 | `st8` | next |
| 9133 | GlobalFork | `gf` | next |
| 9134 | Miramar | `mira` | static |
| 9135 | baa atelier | `baa` | next |
| 9136 | TrustMeBro | `tmb` | next |
| **9137** | **K13 War Room (Mission Control)** | `K13_HQ` | static |
| 9138 | NoxZipper | `nox` | next |
| 9139 | CENGO | `cengo` | static |
| 9140 | tap-n-grab | `tng` | vite |
| 9141 | Gurbet Store | `gbt` | static |
| 9142 | BarFix | `bfx` | next |
| 9143 | Fadilov Finance | `fafi` | node |
| 9144 | EDISYN | `edisyn` | vite — _left as-is, not pinned (per Kazim)_ |
| 9145 | soulseek tool | `slsk` | static |
| 9146 | La Vida | `vida` | _reserved_ — site live, local repo lost (recover from GitHub) |
| 9147 | ~~ClickBank~~ | `cb` | ⚰️ **dead** — empty folder, no repo. Do **not** recycle the row (one port per project, for life). |
| 9148 | ~~SecuriVision~~ | `sv` | ⚰️ **dead** — Fatih's project, no `k13-projects` remote, local history gone. Row retired, not recycled. |
| 9149 | Egg & Out | `ego` | next |
| 9150 | AcuFlow (ProjectVerse) | `acu` | next |
| **9151** | **HoK_Website** | `hok` | next — first claim (2026-06-25) |
| **9152** | **TLC (Three Lions Capital)** | `tlc` | next — claimed 2026-06-24 |
| **9153** | **CarlosAlmaraz** | `carlos` | static — reassigned from 9151 on 2026-07-30; repo updated ✅ |
| **9154** | **LobsterLab** | `lobster` | next — reassigned from 9151 on 2026-07-30; repo + `package.json` updated ✅ |
| **9155** | **HeartBreak_Os** | `heartbreak` | static — claimed 2026-07-30 |
| **9156** | **Investment Corp Project (ICP)** | `icp` | next — claimed 2026-08-31, private member platform build starting |
| 9157–9199 | _future projects_ | — | — |

> ⚠️ **Registry audit, 2026-07-29 — the "one port for life" rule had already broken.** Three
> projects were simultaneously claiming **9151** (HoK_Website, CarlosAlmaraz, LobsterLab), each
> self-assigned because this table stopped at 9150 and nobody wrote back to it. TLC took 9152
> without recording it either. Resolved above by first-claim date, and **both reassigned repos are
> now fixed** (2026-07-30): LobsterLab → 9154 in `CLAUDE.md` + `package.json`, CarlosAlmaraz → 9153
> in `CLAUDE.md` + `README.md`. Each repo also carries a line saying what its port used to be and
> why it moved, so the next session doesn't "correct" it back. LobsterLab's own stale copy of this
> table — the snapshot that ended at 9150 and caused the collision — was resynced in the same pass.
>
> ✅ **Closed out 2026-07-30.** Both repos' feature branches (`lobster_jul29_v3`, `carlo_jun29_v1`)
> have since merged into their `main`, and the new ports survived the merge — LobsterLab's `main` and
> working tree read 9154, Carlos's read 9153, with the "was 9151" provenance line intact in each. No
> repo on this machine claims 9151 any more except HoK_Website, which owns it.
>
> Two more repos never joined the block at all — their docs and dev scripts still use the old
> ports, so this table is aspirational for them:
> - **CENGO** — table says 9139, `CLAUDE.md` + dev command still say **8000**.
> - **Gurbet Store** — table says 9141, `CLAUDE.md` + dev command still say **8080**.
> - **`tap-n-grab`** — pinned to 9140 in `package.json`, but `vite.config.ts` still hardcodes 8080,
>   so `npm run preview` ignores its own pin.
>
> **Root cause, and the real fix:** ports were pinned once in a manual sweep (five repos, all on
> 2026-06-20) and the mechanism was never built — so every project created *since* self-assigned
> blind. A markdown table nobody can query will drift again. The port registry should become
> **data** (`.k13/ports.json`), with `refresh.py` reading each repo's actual pinned port out of
> `package.json` / `CLAUDE.md` and the War Room rendering the 9130–9199 block with collisions
> flagged. Until then, **check this table before claiming, and write back to it after.**

**Rules**
- **One port per project, for life.** Claim the next free row when a project is born; never reuse or reshuffle. **Retired rows stay retired** — a dead project's port is not recycled.
- **Write back to this table the moment you claim.** A port claimed only in a project's own `CLAUDE.md` is invisible to the next project, which is exactly how the 9151 three-way collision happened.
- **Pin it (don't let the server pick).** Hard-code the assigned port in the dev script so a collision fails *loudly* instead of silently moving:
  - **Vite:** `"dev": "vite --port 91XX --strictPort"`  (`--strictPort` = error on conflict, don't drift)
  - **Next:** `"dev": "next dev -p 91XX"`
  - **Express/Node:** read `PORT` and default it: `const PORT = process.env.PORT || 91XX`
  - **Static site / no build:** `python3 -m http.server 91XX --bind 127.0.0.1`
- **Bind to `127.0.0.1`** for personal/internal tools (localhost-only, not exposed to the network).
- **macOS:** never use **5000** or **7000** — AirPlay Receiver (`ControlCe`) squats them by default.
- Record the project's port in its `CLAUDE.md` ("Run locally") so it's one glance away.

**GStack Berths** — the same "pin it, one per project for life" doctrine applied to GStack
Browser, which is one shared Chromium instance machine-wide by default and will otherwise let
two sessions in two different projects steal the same active tab from each other. No separate
table: `BROWSE_PORT = <dev port> + 30000`, `CHROMIUM_PROFILE = ~/.gstack/berths/<shortcode>`,
pinned in the project's `.claude/settings.json` → `"env"`. Full spec: `GSTACK_BERTHS.md`.
- Check before you pick: `lsof -nP -iTCP:91XX -sTCP:LISTEN` (silent output = free).

## Commit messages
- **Current standard — Hail Mary grouped-bullet** (see `HAIL_MARY.md`): for any non-trivial commit.
  Imperative **no-emoji** subject ≤ 72 chars (headline a non-techie can grok) → plain-language
  overview paragraph → `---` technical details **grouped by file/area/concern** → `Co-Authored-By` footer.
  Tiny one-line fixes can stay one line.
- **Document completely & sell the work (so the Mission Control board can pick it up).** Same
  grouped-bullet body — but don't write high-level and move on: list **every** change in tidy groups
  so nothing goes undocumented (git is the record; don't rely on memory to remember it later).
  Write it **stakeholder-friendly** — we show these to stakeholders, so present and "sell" the work
  warmly, not as terse dev shorthand. **Structure it so the War Room board can grab the words it
  needs** (shape it to suit the board) — but it's prose for humans, **not** a rigid cut-paste schema.
  **Tasteful emoji are fine** where they add clarity or warmth (a group marker, a 🔒 on a security
  fix); just no overuse — don't put one on every line, and don't ban them either.
- **Legacy styles still seen in older repos:** Conventional Commits (`feat:`/`fix:`/`chore:`/`docs:`/`style:`/`refactor:`)
  and emoji prefixes (✨🎨📱🐛🔒🚀) on static/marketing sites. Fine, but prefer the grouped-bullet format above for substantial work.
- Always imperative and specific ("Add Vendor Opportunities CTA", not "updates").

## Build methodology — the P0→P5 phases
Repeatable for any new site:
- **P0 — Foundation:** scaffold (Next.js / Vite), brand tokens, smooth scroll, nav shell, gitignore, work plan.
- **P1 — Static homepage:** the full design in code, section by section, no motion yet.
- **P2 — Motion layer:** auto-triggered scroll reveals, transitions, the living hero.
- **P3 — Signature moment:** one memorable interaction (orbit, piazza walk, parallax).
- **P4 — Inner pages:** routing, detail pages, contact + booking forms.
- **P5 — Polish:** OG images, sitemap, robots, a11y/508 baseline, error pages, security headers.

## Standard "done" checklist (P5)
- [ ] Favicon set (light/dark aware) + OG/social images
- [ ] sitemap.xml + robots.txt + SEO metadata
- [ ] ADA / 508 accessibility pass + `prefers-reduced-motion`
- [ ] Mobile / iPhone optimization pass
- [ ] `fitcheck` passes — nine viewports, zero AA tap-target failures, zero horizontal leaks, zero
      hidden-but-focusable controls, next section visible at every size. Paste the before/after
      numbers for anything fixed.
- [ ] Security hardening: headers, cookie flags; for Supabase apps — RLS, JWT auth, webhook verification
- [ ] Error pages (404/500)
- [ ] Progress report (standalone, shareable HTML with base64-embedded images, Gmail-safe) — see Reports below

## Reports — archive every version + two-agent QA gate
Reports are client-facing deliverables; treat them as such.
- **Archive, never overwrite.** Write each report to `docs/reports/<Project>_<Type>_<YYYY-MM-DD>.html`
  (e.g. `Miramar_Development-Report_2026-06-25.html`); same-day re-run → `_v2`, `_v3`. The dated file
  is permanent — link a "latest" copy if the site needs one, but never delete/overwrite an older one.
  The name carries project + type + date so an emailed file explains itself. Types:
  `Development-Report`, `Security-Audit`, `Legal-Compliance`.
- **Two-agent Chrome QA gate — not "done" until design signs off.** One agent **builds** the report;
  a second **tests** it in Chrome (screenshots desktop + mobile like a real user) and runs the
  design-review checklist (spacing, hierarchy, AI-slop, palette match, motion + `prefers-reduced-motion`,
  broken assets/links, Gmail-safe base64). Loop fail → fix → re-review until approval; only on PASS
  does the report take its archived name and ship. Log approval in a sidecar
  `docs/reports/<same-name>.qa.json` (date, screenshots, verdict). Applies to **all** reports.
  _(Org-wide rule broadcast from the War Room, 2026-06-26.)_

## Stack defaults (pick per project)
| Need | Default |
|------|---------|
| Premium animated site | **Next.js (App Router)** + `motion` / GSAP + Lenis (smooth scroll) |
| Fast build / from Lovable | **Vite + React + shadcn/ui** + Tailwind |
| Simple brochure site | **Static HTML/CSS/JS** + Express (local preview) |
| Backend / auth / DB | **Supabase** (Postgres + RLS) |
| Deploy | **Vercel** (Cloudflare for edge/DNS) |
| Forms | Formspree |
| Live events | Google Sheets (fetch + parse + fallback) |
| Instagram feed | Behold.so |

## Per-repo
- Keep a `.claude/` folder with project context so Cursor+Claude has the brief.
- Keep `CLAUDE.md` at the root with these rules + the project specifics.

## Identity
- **Author / owner:** Kazim — aka **K13**, **Kazimiro** (Kazim Anil Korkmaz). New projects are authored by Kazim.
- Git identity for new repos: run `scripts/setup-identity.sh` (name `K13`, email `223161079+k13-projects@users.noreply.github.com`).
- **Halil, Memo (MCS), and Volkan are EDISYN-only collaborators** — not authors of your other or new projects. Never attribute new work to them.

## Workflow & subagents (how Claude/Cursor should operate)
Full rules live in `.claude/Lessons.md`. In short:
- **Plan mode** for any non-trivial task (3+ steps); re-plan if it goes sideways.
- **Use subagents liberally** — offload research/exploration/parallel analysis; one task per subagent.
- **Verify before done** — prove it works (tests, logs, diffs). "Would a staff engineer approve this?"
- **Demand elegance** on non-trivial changes; skip for obvious fixes.
- **Autonomous bug fixing** — point at logs/errors and just fix.
- Track work in `tasks/todo.md`; capture corrections in `.claude/Lessons.md` (self-improvement loop).
- Core principles: simplicity first · no laziness (root causes, no temp fixes) · minimal impact.
- **UX rule #1:** never assume the user knows what to do — always guide, stay minimal.
- **Role subagents** in `.claude/agents/`: `designer` (UX/visual), `frontend-engineer` (implementation), `marketing-specialist` (SEO/ads/copy).

## The Hail Mary (ship command)
When Kazim says **`hail mary`** / **`hm`** (or `hail mary that shit` / `hm pls`), ship the session: new branch → documented grouped-bullet commit → `git push -u`. **`hm-1`** skips the *new* branch (commits on the current feature branch — never `main`); **`hm++`** also opens a PR and merges it (`gh pr merge --merge`, real merge, no squash/rebase, keep all branches). Plain hail mary stops after push. Full spec in **`HAIL_MARY.md`**; helper at `scripts/hm.sh`.
