# KA0092 - Review 1

- Job: 2026-10-14-review-ka0092-e2e-port-r-ae2fbe8f
- Branch: h/2026-10-14-ka0092-e2e-port-race-a3f5757f
- Commit reviewed: c73581e7d2ce9daac61b85aab2f1080f5e0ad20d
- Verdict: PASS

## Final message

Worktree clean, claim directory empty, no stray files.

All checks pass, the fix's core mechanism was verified by both real concurrent `test:e2e` runs and a direct mutation test reproducing the worker's claimed failure mode.

**Checks run (in this worktree, c73581e):**
- `bun install --frozen-lockfile`: ok.
- `bun run lint`: 118 files, no fixes needed.
- `bun run check`: 0 errors/warnings/hints.
- `bun run build`: succeeds.
- `tests/e2e/e2e-ports.spec.ts` alone: 1 passed, picked 4330/4331 (4329 already held by a sibling worktree's leftover preview — itself evidence the mechanism correctly skips a held port).
- **Real two-worktree concurrency proof** (ticket's Done-means item): spun up a second worktree at the same commit (`/tmp/ka0092-review-copy2`), ran `bun run test:e2e` in both simultaneously. Mid-run, claim files showed `4330.<pidA> 4331.<pidA> 4332.<pidB> 4333.<pidB>` — four distinct ports, no overlap. Both finished **167 passed** (4.1m each), no `EADDRINUSE`. Claim directory empty after both exited.
- **Mutation test**: patched `if (taken) {` → `if (false) {` in `playwright.config.ts` (disables the backoff, the fix's core behavior), reran `e2e-ports.spec.ts`: failed with `Expected: 4, Received: 2` after retries — exactly what the worker reports. Reverted with `git checkout -- playwright.config.ts`; confirmed clean (`git status --short` empty).
- Reviewed the claim algorithm's interleavings by hand: write-then-read-then-conditional-remove is synchronous per process with no intervening fs call, so for any interleaving of two processes' writes/reads, at most one ends up holding a given port (worst case both see each other and both back off to the next port — a missed-opportunity, not a double-claim; never observed in the real run).
- `AGENTS.md` diff matches the file's current content (`bun run preview` line and `tests/e2e/` list), confirmed by direct read of the repo-rules copy already in context.
- Claim path: `join(tmpdir(), "kacperadler-e2e-ports")` — OS temp dir, no collision with any production path (`LEADS_DB_PATH=/data/leads.sqlite` is unrelated and untouched).
- No em-dash in the diff (`grep` on changed files: no matches).
- Commit is Conventional-Commits with ticket scope: `fix(KA0092): claim e2e ports so runs in two worktrees never share one`, 3 files, matches stat.
- No Dockerfile/nginx.conf/og-default.png.ts touched → no docker-build gate triggered. No tokens/palette/brand change → no DESIGN.md update needed. No vision.md violation (no cookies/tracker/English/light-theme/motion/Tailwind/other-adapter/CMS/React).

**Notes (non-blocking):**
- Stale-claim handling (dead pid's leftover file ignored) is verified only manually by the worker, not by an automated spec; acceptable given the ticket's Done-means doesn't require it and the pid-liveness check is simple enough to inspect by reading.
- Pid-reuse after a crash could in theory make a stale claim look "alive" and block a port until the new process holding that pid also exits; inherent to any pid-file lock, not something this ticket's scope asks to solve, and the worker's final message already names the closely related external-process limitation.

PASS
