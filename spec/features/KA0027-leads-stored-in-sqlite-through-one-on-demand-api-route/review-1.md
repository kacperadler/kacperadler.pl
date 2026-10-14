# KA0027 - Review 1

- Job: 2026-10-14-review-ka0027-leads-sqli-37f89005
- Branch: h/2026-10-14-ka0027-leads-sqlite-2f54061e
- Commit reviewed: e2b989a1cddc351e73776c7db0949010090cd7e3
- Verdict: PASS

## Final message

## Review: KA0027 leads in SQLite through /api/lead

### Findings
None that block the merge.

### Notes (non-blocking)
- `src/pages/api/lead.ts:98` email subject/text interpolate `lead.type` only through the fixed `projectTypes` whitelist and a numeric `id`; visitor-controlled `email`/`message` never reach Resend headers or body — verified by mutation (see below).
- Node version risk flagged by the worker (local Node 24 vs CI's Node 22.13+ for `node:sqlite`) is real but can only be settled by CI itself; not something this review can close locally.
- F1 (no rate limit on `/api/lead`) correctly filed as `open` in `findings.md`, not required by this ticket's Done means — matches instructions.

### Checks run (in this worktree, against `128929f6..e2b989a1`)
- `bun install --frozen-lockfile`: clean, 378 packages.
- `bun run lint`: 109 files, no fixes.
- `bun run check`: 0 errors/warnings/hints.
- `bun run build`: static pages → `dist/client/`, Node route → `dist/server/`, sitemap built, no `/api/lead` in it.
- `bun run test:e2e` (full suite, chromium): **142 passed** (3.6 min).
- **Mutation testing** (throwaway edits, reverted after each, tree confirmed clean via `git status --porcelain`):
  - Removed honeypot early-return in `src/pages/api/lead.ts` → `contact-form.spec.ts` "server answers a filled honeypot…" failed as expected (row `bot-...@example.com` got saved).
  - Disabled the `projectTypes` whitelist check in `src/lib/lead.ts` (`const type = true`) → "unknown project type" 400 test failed (got 200).
  - Removed the `try/catch` around `sendEmail` in `src/pages/api/lead.ts` → 3 tests in `lead-api.spec.ts` failed (uncaught `fetch failed` instead of 200-with-log).
  - Injected visitor `email`/`message` into the notification text → `lead-api.spec.ts` "saves the lead and e-mails its number and type, without what the visitor wrote" failed, correctly catching the leak.
- **Docker** (`Dockerfile`/`nginx.conf`/`docker-start.sh` changed, so required by review guide):
  - `docker build -t kacperadler-pl-test .` succeeded.
  - Ran with `-v ka-leads-test:/data`: `GET /` → 200 with all four security headers; unknown path → 404; valid lead POST → 200 `{"ok":true}`, `Cache-Control: no-store`, logs `[lead] saved #1` + the "no e-mail…not set" warning; invalid POST → 400 `{"error":"invalid","fields":["email"]}`; honeypot POST → 200, nothing extra saved.
  - `docker stop`: 0.76 s, exit code 0.
  - After `docker rm`, a fresh container reading the same volume recovered exactly row `#1` (`t@example.com`, `ai`, `test z dockera`) — volume persistence confirmed.
- `node:sqlite` insert path is parameterized (`db.prepare("INSERT INTO leads (email, type, message) VALUES (?, ?, ?)")`); no string-built SQL anywhere in `src/lib/leads-db.ts` — no injection vector despite the folder name's "sqli" abbreviation.
- Grep for `nocodb` (any case) across `src`, `tests`, `AGENTS.md`, `README.md`: no matches.
- Grep for em-dash (U+2014) across the changed docs/code/scripts: no matches.

### Scope / Decisions / vision check
- `src/lib/send-email.ts` and `src/lib/leads-db.ts` are standalone, take all inputs as arguments, read no env, know nothing about leads — matches the ticket's Decisions overriding the plan's single-file route.
- `src/pages/api/lead.ts` only reads `process.env`, validates via `src/lib/lead.ts`, and wires the two modules — matches.
- Each module has its own spec (`leads-db.spec.ts`, `send-email.spec.ts`), plus `lead-api.spec.ts` for the route and a retargeted `contact-form.spec.ts` — matches "each module gets its own test."
- Pages stay static (`dist/client/`), only `/api/lead` is on-demand — matches vision's "Not the goal" (no other `prerender=false` routes, no CMS/React/Tailwind/Cloudflare).
- README "Dokploy krok po kroku" section present with Resend setup, volume (`kacperadler-leads` → `/data`, before first deploy), three env vars, deploy, and four-point verification — matches Done means' step-by-step requirement.
- Copy change isolated in its own `copy(ui):` commit; everything else matches Conventional Commits with `(KA0027)` scope.

PASS
