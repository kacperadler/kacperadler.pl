# KA0020 - Parallel worktrees collide on the e2e preview port 4329

```json
{
  "id": "KA0020",
  "title": "Parallel worktrees collide on the e2e preview port 4329",
  "date": "2026-10-10"
}
```

## Description

every worktree's `bun run test:e2e` serves on port 4329. While this job ran, another job's `astro preview` (worktree `2026-10-10-design-md-dark-only-at-78ab9b6c`) held 4329, and `bunx playwright test` here stopped with `http://localhost:4329 is already used`. With `CI` unset, `reuseExistingServer` is true, so the same run would instead test the other worktree's build and report its result as this branch's [INFERENCE: from the config line, not run with CI unset].

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: risk

Evidence:
- `playwright.config.ts:5` (`PORT = 4329`), `playwright.config.ts:32` (`reuseExistingServer: !process.env.CI`)
- Found by: 2026-10-10-mobile-menu-accessible-n-264b11e8 (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: let an env variable (for example `E2E_PORT`) override the port, defaulting to 4329, and have the harness give each job its own; keep CI as is.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- let an env variable (for example `E2E_PORT`) override the port, defaulting to 4329, and have the harness give each job its own; keep CI as is.

## Decisions

- 2026-10-10: Source: F2 of KA0015
- 2026-10-10: Dropped: KA0016 covers it (env var port, no reuse of a foreign server).
