# KA0082 - The e2e build once ran without the case-study fixture

```json
{
  "id": "KA0082",
  "title": "The e2e build once ran without the case-study fixture",
  "date": "2026-10-11"
}
```

## Description

the first `bun run test:e2e` in a fresh worktree (`bun install`, `bun run lint`, `bun run check`, `bun run build`, then the suite) failed 9 tests: both `a11y.spec.ts` "home, legal, case study pages and 404" (0 case-study links) and 7 in `case-studies.spec.ts` (no `/realizacje/` in the sitemap, no "Realizacje" in the mobile sheet). The `E2E_FIXTURES=1` build served a site without `tests/fixtures/case-studies/przyklad.mdx`. The same order of commands later passed twice (`case-studies.spec.ts` alone, 7 passed; the full suite, 0 case-study failures), so the cause was not pinned. [INFERENCE] Astro's content data store (`node_modules/.astro/data-store.json`, `.astro/data-store.json`) is keyed on the config, not on `E2E_FIXTURES`, so a build can reuse entries synced for another fixture set.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: risk

Evidence:
- `src/content.config.ts:47-56`, `playwright.config.ts:83`
- Found by: 2026-10-11-ka0081-static-rulers-5d56c4d5 (worker), 2026-10-11

## Done means

- The fix, with a test that proves it: reproduce by alternating `E2E_FIXTURES=none bun run build` and `E2E_FIXTURES=1 bun run build` and listing `dist/realizacje/`; if the store is reused, clear it (or pass `--force`) in the e2e build command in `playwright.config.ts`. The content schema stays as is.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- reproduce by alternating `E2E_FIXTURES=none bun run build` and `E2E_FIXTURES=1 bun run build` and listing `dist/realizacje/`; if the store is reused, clear it (or pass `--force`) in the e2e build command in `playwright.config.ts`. The content schema stays as is.

## Decisions

- 2026-10-11: Source: F1 of KA0081
