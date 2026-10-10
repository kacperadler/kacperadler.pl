# KA0074 - `bun run check` reads the Playwright HTML report when `CI` is set

```json
{
  "id": "KA0074",
  "title": "`bun run check` reads the Playwright HTML report when `CI` is set",
  "date": "2026-10-10"
}
```

## Description

with `CI` set (as in this job's shell) a run with a failing test retries it and records a trace (`trace: "on-first-retry"`), and the `html` reporter bundles the trace viewer into `playwright-report/trace/`. A later `bun run check` in the same tree then printed that viewer's minified source as diagnostics, although the folder is gitignored; after `rm -rf playwright-report test-results` the same `bun run check` reported 0 errors. After a run where everything passed (no trace), check passes with the report folder present. CI runs check before e2e, so it does not hit it there; a local or agent run in that order after a failure does.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: bug

Evidence:
- `playwright.config.ts` (`reporter`), `tsconfig.json` / `astro check` input
- Found by: 2026-10-10-landing-in-mb-d0b2016c (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: exclude `playwright-report` and `test-results` from what `astro check` reads (`exclude` in `tsconfig.json`), or write the HTML report outside the source tree.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- exclude `playwright-report` and `test-results` from what `astro check` reads (`exclude` in `tsconfig.json`), or write the HTML report outside the source tree.

## Decisions

- 2026-10-10: Source: F2 of KA0069
