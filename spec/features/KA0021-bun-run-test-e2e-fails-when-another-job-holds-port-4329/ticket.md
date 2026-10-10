# KA0021 - `bun run test:e2e` fails when another job holds port 4329

```json
{
  "id": "KA0021",
  "title": "`bun run test:e2e` fails when another job holds port 4329",
  "date": "2026-10-10"
}
```

## Description

the port is hardcoded and shared by every worktree. On 2026-10-10 `bun run test:e2e` exited 1 with `http://localhost:4329 is already used` because another worktree's Playwright run (`2026-10-10-e2e-preview-stays-attach-7fb609bf`) and an unrelated `python3 -m http.server 4329` (serving `/tmp/ka0016-empty`) held the port. `reuseExistingServer` is only true outside CI, so it never reuses a foreign server safely. Reproduce: start any server on 4329, then run `bun run test:e2e`.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: risk

Evidence:
- `playwright.config.ts:4` (`const PORT = 4329;`)
- Found by: 2026-10-10-astro-icon-warning-9a6df689 (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: pick a free port per run (for example `process.env.E2E_PORT ?? 0`-style allocation, or a port derived from the worktree) so concurrent worktrees do not collide. Stays out: changing the preview command or the test specs.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- pick a free port per run (for example `process.env.E2E_PORT ?? 0`-style allocation, or a port derived from the worktree) so concurrent worktrees do not collide. Stays out: changing the preview command or the test specs.

## Decisions

- 2026-10-10: Source: F1 of KA0013
- 2026-10-10: Dropped: KA0016 covers it (env var port, no reuse of a foreign server).
