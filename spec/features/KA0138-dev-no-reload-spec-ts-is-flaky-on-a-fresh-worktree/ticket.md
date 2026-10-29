# KA0138 - dev-no-reload.spec.ts is flaky on a fresh worktree

```json
{
  "id": "KA0138",
  "title": "dev-no-reload.spec.ts is flaky on a fresh worktree",
  "date": "2026-10-29"
}
```

## Description

the first full `bun run test` in a worktree right after `bun install` failed this test once and passed it on retry (`1 flaky, 241 passed`): `locator.evaluate: Execution context was destroyed, most likely because of a navigation` at `html.evaluate(...)`, right after `page.goto(`${DEV_URL}/ui`)`. The page navigated on its own before the probe was set. [INFERENCE] Vite's first-visit dependency optimisation reloads the page, which is a reload the spec does not cause and does not wait out.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: bug

Evidence:
- `tests/e2e/dev-no-reload.spec.ts:21`
- Found by: 2026-10-29-ka0136-www-680e2089 (worker), 2026-10-29

## Done means

- The fix, with a test that proves it: before setting the probe, wait until the dev server has settled (for example a warm-up `goto` of `/ui` and `waitForLoadState("networkidle")`, or `optimizeDeps.include` for the deps `/ui` pulls in), so the test only sees reloads caused by the file it writes. Keep the assertion itself.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- before setting the probe, wait until the dev server has settled (for example a warm-up `goto` of `/ui` and `waitForLoadState("networkidle")`, or `optimizeDeps.include` for the deps `/ui` pulls in), so the test only sees reloads caused by the file it writes. Keep the assertion itself.

## Decisions

- 2026-10-29: Source: F1 of KA0136
- 2026-10-29: Dropped by the coordinator: the same flake as KA0099, which stays the one ticket for it.
