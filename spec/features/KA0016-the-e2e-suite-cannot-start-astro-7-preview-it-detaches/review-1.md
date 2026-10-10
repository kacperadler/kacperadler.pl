# KA0016 - Review 1

- Job: 2026-10-10-review-e2e-preview-stays-de4a76ea
- Branch: h/2026-10-10-e2e-preview-stays-attach-7fb609bf
- Commit reviewed: 80b65b1966d82da6f9844d94741f7f5ee80d9ea2
- Verdict: PASS

## Final message

All ticket Done-means lines independently verified in this worktree, including mutation tests on each piece the worker claims is load-bearing.

**Findings:** none that block.

**Notes (non-blocking):**
- `playwright.config.ts:32` comment attributes the port fallback to "another server (a preview from another worktree, `bun dev`)" — accurate and matches the actual sandbox collision scenario tested.
- One flaky `contact-form.spec.ts:173` failure surfaced once during a parallel (4-worker, no-CI) run; three immediate reruns under identical conditions (4 workers, same stray/free-port setup) passed 18/18 each time. Not caused by this diff — the file isn't touched, and `workers: process.env.CI ? 1 : undefined` is unchanged from base. Pre-existing flake, out of scope.
- Ticket's "choice to judge" (fallback to a free port instead of failing on a busy 4329) is not optional: Done-means bullet 3 explicitly requires `test:e2e` to pass "while another server listens on 4329," which no fail-on-busy design could satisfy. Worker's framing as a discretionary choice undersells that it's mandated, but the implementation is correct.

**Checks run (in this worktree, `~/.bun/bin` on PATH, `bun install --frozen-lockfile`, playwright chromium already cached):**
- `bun run lint` → 68 files, no fixes.
- `bun run check` → 0 errors/warnings/hints.
- `bunx prettier --check "**/*.astro"` → all files match style.
- `bun run build` → 4 pages, clean.
- `bun run test:e2e </dev/null` (no CI, stray fake server on 4329 serving "stray"): 18 passed, preview on port 35249 (OS-picked).
- `CI=true bun run test:e2e </dev/null` (same stray on 4329): 18 passed, preview on port 43775, 1 worker.
- Cleanup after both runs: `ss -ltnp` showed nothing on 35249/43775; `astro preview status` → "No preview server is running."; stray on 4329 still answering "stray" untouched.
- `E2E_PORT=4329 bun run test:e2e` with stray held: refused immediately — "http://localhost:4329 is already used" — no tests ran.
- Stray killed, 4329 free, no-CI run: preview picked 4329 directly, 18 passed (after confirming one transient unrelated flake didn't recur across 3 reruns).
- Mutation 1 — removed `process.env.E2E_PORT = String(PORT)` writeback: all 18 tests failed (`page.goto` connection failures), as claimed.
- Mutation 2 — flipped `reuseExistingServer` to `true` with stray on 4329 and `E2E_PORT=4329`: webServer reused the stray; multiple tests failed/timed out against the wrong content (axe-core and contact-form specs failing within seconds to 30s), consistent with "the fake server was reused."
- Mutation 3 — stripped `--ignore-lock` from the command: reproduced the ticket's exact failure, `Error: Process from config.webServer exited early.`, and left a detached background preview running (`astro preview status` showed pid, background:true); stopped it with `astro preview stop`.
- All three mutations reverted (`git checkout -- playwright.config.ts`); final `git status`/`git diff --stat` on the file clean.
- Scope: `git diff --stat` for the range shows only `playwright.config.ts` (35+/4-); `package.json` and `.github/workflows/ci.yml` untouched, matching the ticket's Scope and the worker's claim.
- No em-dash (U+2014) in the diff; no `AGENTS.md` `## Don't` rule touched (no Tailwind, theming, scroll listener, cookies/trackers); no tokens/brand/palette change so no `DESIGN.md` update needed; no `tests/e2e/` spec changes, consistent with the ticket's explicit `Out:` line.

PASS
