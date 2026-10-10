# KA0004 - Harness gap: no `test` script, so `npm test` fails

```json
{
  "id": "KA0004",
  "title": "Harness gap: no `test` script, so `npm test` fails",
  "date": "2026-10-10",
  "after": [
    "KA0016"
  ]
}
```

## Description

`h merge` and `h review-needed` run only `npm run check` and `npm test`. `npm run check` works (`astro check`, 0 errors), but `package.json` has no `test` script: `npm test` exits 1 with `Missing script: "test"`. This repository is checked with `bun run lint`, `bun run check`, `bunx prettier --check "**/*.astro"`, `bun run build` and `bun run test:e2e`, as in `.github/workflows/ci.yml`. `bun run test:e2e` also needs `bun` on PATH, since `playwright.config.ts` starts the server with `bun run preview`, and a Chromium build matching `@playwright/test`.

## Goal

`h merge` and `h review-needed` check this repository on main with `npm test`, so a broken e2e suite reaches main unnoticed today. After this, `npm test` runs the repository's own e2e suite. Waits for KA0003 (both change `package.json`).

- Kind: risk

Evidence:
- `package.json:9`
- Found by: 2026-10-10-onboard-kacperadler-pl-6c85f5ea (worker), 2026-10-10

## Done means

- `package.json` has `"test": "playwright test"` (the e2e suite, as `test:e2e`); `npm test` in the main checkout passes 16/16 with `~/.bun/bin` on PATH, and fails when one spec is broken by hand (checked once, not committed).
- `bun run lint`, `bun run check`, `bunx prettier --check "**/*.astro"`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `package.json` (one script).

## Decisions

- 2026-10-10: Source: F1 of KA0001
- 2026-10-10: The human approved it.
- 2026-10-10: The human: merge once its review passes (or h review-needed says no review).
