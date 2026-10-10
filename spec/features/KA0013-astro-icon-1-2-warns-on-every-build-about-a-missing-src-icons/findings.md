# KA0013 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

## F1. `bun run test:e2e` fails when another job holds port 4329

- Kind: risk
- Found by: 2026-10-10-astro-icon-warning-9a6df689 (worker), 2026-10-10
- Where: `playwright.config.ts:4` (`const PORT = 4329;`)
- What: the port is hardcoded and shared by every worktree. On 2026-10-10 `bun run test:e2e` exited 1 with `http://localhost:4329 is already used` because another worktree's Playwright run (`2026-10-10-e2e-preview-stays-attach-7fb609bf`) and an unrelated `python3 -m http.server 4329` (serving `/tmp/ka0016-empty`) held the port. `reuseExistingServer` is only true outside CI, so it never reuses a foreign server safely. Reproduce: start any server on 4329, then run `bun run test:e2e`.
- Suggestion: pick a free port per run (for example `process.env.E2E_PORT ?? 0`-style allocation, or a port derived from the worktree) so concurrent worktrees do not collide. Stays out: changing the preview command or the test specs.
- Status: dropped (KA0016 covers it; ticket KA0021 dropped)
