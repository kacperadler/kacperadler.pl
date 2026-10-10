# KA0004 - Harness gap: no `test` script, so `npm test` fails

```json
{
  "id": "KA0004",
  "title": "Harness gap: no `test` script, so `npm test` fails",
  "date": "2026-10-10"
}
```

## Description

`h merge` and `h review-needed` run only `npm run check` and `npm test`. `npm run check` works (`astro check`, 0 errors), but `package.json` has no `test` script: `npm test` exits 1 with `Missing script: "test"`. This repository is checked with `bun run lint`, `bun run check`, `bunx prettier --check "**/*.astro"`, `bun run build` and `bun run test:e2e`, as in `.github/workflows/ci.yml`. `bun run test:e2e` also needs `bun` on PATH, since `playwright.config.ts` starts the server with `bun run preview`, and a Chromium build matching `@playwright/test`.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: risk

Evidence:
- `package.json:9`
- Found by: 2026-10-10-onboard-kacperadler-pl-6c85f5ea (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: decide whether `package.json` gets a `test` script (for example one that runs the e2e suite) or the harness learns to run this repository's own commands. Onboarding changed neither.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- decide whether `package.json` gets a `test` script (for example one that runs the e2e suite) or the harness learns to run this repository's own commands. Onboarding changed neither.

## Decisions

- 2026-10-10: Source: F1 of KA0001
