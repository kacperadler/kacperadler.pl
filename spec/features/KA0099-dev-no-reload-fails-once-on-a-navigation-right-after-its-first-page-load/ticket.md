# KA0099 - dev-no-reload fails once on a navigation right after its first page load

```json
{
  "id": "KA0099",
  "title": "dev-no-reload fails once on a navigation right after its first page load",
  "date": "2026-10-14"
}
```

## Description

in the first full `bun run test:e2e` after merging main (KA0091) into this branch, the spec failed its first try with `locator.evaluate: Execution context was destroyed, most likely because of a navigation` at line 21, right after `page.goto(${DEV_URL}/ui)` and before it touches any file, then passed on retry (`1 flaky`, `167 passed`). With 1 worker it is the first spec that loads a page of the dev server. Three runs of it with `ui-catalogue.spec.ts`, `--retries=0` and `node_modules/.vite` removed before each did not reproduce it (59 passed each). The cause is not known; [INFERENCE] a reload the dev server sends on its first request (for example Vite optimizing a dependency it just found), which the dev server's stdout (`stdout: "ignore"` in `playwright.config.ts`) does not show.

## Goal

The full e2e run passes every time: `dev-no-reload` survives the navigation right after its first page load, so a red run means a real bug.

- Kind: bug

Evidence:
- `tests/e2e/dev-no-reload.spec.ts:21`
- Found by: 2026-10-14-ka0092-e2e-port-race-a3f5757f (worker), 2026-10-14

## Done means

- The fix, with a test that proves it: make the spec wait for a page that has settled (for example a first `page.goto` before the probe, or a second one when the first navigates away) and log the dev server's reload reason when it happens; the no-watch setting itself stays as KA0091 left it.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- make the spec wait for a page that has settled (for example a first `page.goto` before the probe, or a second one when the first navigates away) and log the dev server's reload reason when it happens; the no-watch setting itself stays as KA0091 left it.

## Decisions

- 2026-10-14: Source: F1 of KA0092
