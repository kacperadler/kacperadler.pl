# KA0004 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

## F1. `npm test` / `test:e2e` fail when port 4329 is held by another worktree's preview

- Kind: risk
- Found by: 2026-10-10-npm-test-runs-e2e-864bcb4f (worker), 2026-10-10
- Where: `playwright.config.ts:5` and `:32`
- What: the config fixes the preview port at 4329 and sets `reuseExistingServer: !process.env.CI`. In a shell with `CI=true` (set here), Playwright refuses to reuse a server already on 4329 and exits with `http://localhost:4329 is already used`. Reproduced: while `astro preview --port 4329` from worktree `legal-pages-without-loca-bf44f552` was listening, `npm test` failed in this worktree; the suite passed once the port was free. Because `h merge` and `h review-needed` run `npm test` on main, a stray preview on 4329 turns a green suite into a false failure.
- Suggestion: read the port from an env var with 4329 as default (for example `PORT = Number(process.env.E2E_PORT ?? 4329)`), or pick a free port at run time; keep `reuseExistingServer` as is. Out of KA0004's scope (it touches `playwright.config.ts`, not `package.json`).
- Status: fixed in KA0016 (ticket KA0023 dropped)
