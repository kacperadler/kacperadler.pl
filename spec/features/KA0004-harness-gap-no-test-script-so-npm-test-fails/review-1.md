# KA0004 - Review 1

- Job: 2026-10-10-review-npm-test-runs-e2e-346cc6fa
- Branch: h/2026-10-10-npm-test-runs-e2e-864bcb4f
- Commit reviewed: 9778cd9c4c4e17aecaf370333515b6f229b22c74
- Verdict: PASS

## Final message

Clean, at target commit.

Findings: none blocking.

Notes (non-blocking):
- Ticket's Done means cites "16/16"; actual suite is 18 specs (`services-grid.spec.ts` added since the ticket's figure was written, pre-existing drift unrelated to this diff). The worker correctly flagged this rather than silently diverging; not caused by this branch's scope.
- F1 (fixed preview port 4329 collides with other worktrees under `CI=true`) is correctly logged as an open finding in `findings.md` rather than fixed inline — right call, it requires touching `playwright.config.ts`, outside KA0004's declared scope (`package.json`, one script).

Checks run (in this worktree, `~/.bun/bin` on PATH):
- `bun install --frozen-lockfile`: 366 packages, ok.
- `bun run lint`: 68 files, no fixes, exit 0.
- `bun run check`: 0 errors/warnings/hints.
- `bunx prettier --check "**/*.astro"`: all matched files use Prettier style.
- `bun run build`: 4 pages built, exit 0.
- `npm test`: 18 passed (18.8s), exit 0.
- `bun run test:e2e`: 18 passed (19.9s), exit 0.
- Mutation 1 (ticket's own acceptance test): appended a throwing test to `tests/e2e/skip-link.spec.ts`; `npm test` exited 1 with the failing test shown, other 18 still passed; restored via `git checkout --`.
- Mutation 2 (fix-removal): deleted the `"test"` script key from `package.json` via script; `npm test` exited 1 with `Missing script: "test"`, confirming the one added line is the actual fix, not incidental; restored via `git checkout --`.
- `git diff` scanned for U+2014: no match.
- Worktree confirmed clean and at commit `9778cd9` after all throwaway edits were reverted.

Diff is exactly in-scope: one line in `package.json`, one new `findings.md` per the project's standard ticket-findings workflow. No AGENTS.md `## Don't` rule touched, no vision.md violations, no Dockerfile/nginx/og-image touch requiring a docker build check.

PASS
