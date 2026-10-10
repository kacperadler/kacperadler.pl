# KA0023 - `npm test` / `test:e2e` fail when port 4329 is held by another worktree's preview

```json
{
  "id": "KA0023",
  "title": "`npm test` / `test:e2e` fail when port 4329 is held by another worktree's preview",
  "date": "2026-10-10"
}
```

## Description

the config fixes the preview port at 4329 and sets `reuseExistingServer: !process.env.CI`. In a shell with `CI=true` (set here), Playwright refuses to reuse a server already on 4329 and exits with `http://localhost:4329 is already used`. Reproduced: while `astro preview --port 4329` from worktree `legal-pages-without-loca-bf44f552` was listening, `npm test` failed in this worktree; the suite passed once the port was free. Because `h merge` and `h review-needed` run `npm test` on main, a stray preview on 4329 turns a green suite into a false failure.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: risk

Evidence:
- `playwright.config.ts:5` and `:32`
- Found by: 2026-10-10-npm-test-runs-e2e-864bcb4f (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: read the port from an env var with 4329 as default (for example `PORT = Number(process.env.E2E_PORT ?? 4329)`), or pick a free port at run time; keep `reuseExistingServer` as is. Out of KA0004's scope (it touches `playwright.config.ts`, not `package.json`).
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- read the port from an env var with 4329 as default (for example `PORT = Number(process.env.E2E_PORT ?? 4329)`), or pick a free port at run time; keep `reuseExistingServer` as is. Out of KA0004's scope (it touches `playwright.config.ts`, not `package.json`).

## Decisions

- 2026-10-10: Source: F1 of KA0004
- 2026-10-10: Dropped: KA0016 fixed it (own port, never reuses a foreign server).
