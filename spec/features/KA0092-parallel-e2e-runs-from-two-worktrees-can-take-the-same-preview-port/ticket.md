# KA0092 - Parallel e2e runs from two worktrees can take the same preview port

```json
{
  "id": "KA0092",
  "title": "Parallel e2e runs from two worktrees can take the same preview port",
  "date": "2026-10-14"
}
```

## Description

Two or three sentences: what changes, and for whom.

## Goal

Two worktrees can run the e2e suite at the same time without one stealing the other's preview port, so a red run means a real bug.

- Kind: risk

Evidence:
- `playwright.config.ts`: free-port probe, then `astro preview` binds later; review of KA0088 saw `EADDRINUSE :4329` once, a rerun passed 158/158.

## Done means

- Two `bun run test:e2e` runs started together in two worktrees both pass: the preview server binds a port no other run can take (or retries on EADDRINUSE), shown by a run of both at once.
- `bun run check` and `bun run test` pass.

## Scope

In:
- `playwright.config.ts`: how the preview port is chosen and bound.

Out:
- The dev-server reload on a commit (KA0091) and the ui-proposals flake (KA0090).

## Decisions

- 2026-10-14: Source: F2 of KA0088
