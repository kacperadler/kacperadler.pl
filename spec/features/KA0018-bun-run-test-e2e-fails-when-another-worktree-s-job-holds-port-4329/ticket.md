# KA0018 - `bun run test:e2e` fails when another worktree's job holds port 4329

```json
{
  "id": "KA0018",
  "title": "`bun run test:e2e` fails when another worktree's job holds port 4329",
  "date": "2026-10-10"
}
```

## Description

Parallel jobs run in worktrees on one machine and every one starts `astro preview --port 4329`. On this job, `bun run test:e2e` stopped with `Error: http://localhost:4329 is already used` while `ss -ltnp 'sport = :4329'` showed `astro preview` from `2026-10-10-mobile-menu-accessible-n-264b11e8`. KA0012's review hit the same and worked around it with a throwaway config on port 4341. Turning on `reuseExistingServer` would be worse: it would test the other worktree's build.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: risk

Evidence:
- `playwright.config.ts` (`webServer` on port 4329)
- Found by: 2026-10-10-design-md-dark-only-at-78ab9b6c (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: let the port come from an environment variable (default 4329, as `AGENTS.md` says) so the harness can give each job its own, or pick a free port at config load; document it in `AGENTS.md` `## Komendy`.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- let the port come from an environment variable (default 4329, as `AGENTS.md` says) so the harness can give each job its own, or pick a free port at config load; document it in `AGENTS.md` `## Komendy`.

## Decisions

- 2026-10-10: Source: F2 of KA0008
- 2026-10-10: Dropped: KA0016 covers it (env var port, no reuse of a foreign server).
