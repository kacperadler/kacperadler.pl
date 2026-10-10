# KA0010 - Code comments still point at `v2-layout` and `body.v2-body`

```json
{
  "id": "KA0010",
  "title": "Code comments still point at `v2-layout` and `body.v2-body`",
  "date": "2026-10-10"
}
```

## Description

The comments say the glass treatment "lives in v2-layout via body.v2-body ... override" and that "v1 stays solid". Both files are gone: the overrides are at the bottom of `src/layouts/base-layout.astro` as plain `.site-footer` / `.sheet` rules.

## Goal

Code comments point at where the glass overrides live now (`base-layout.astro`), not at deleted files.

- Kind: cleanup
- Model: haiku

Evidence:
- `src/components/layout/footer.astro:69-70`, `src/components/layout/mobile-sheet.astro:50-51`
- Found by: 2026-10-10-docs-and-agents-md-508a76bc (worker), 2026-10-10

## Done means

- The comments in `src/components/layout/footer.astro` and `src/components/layout/mobile-sheet.astro` point at the glass overrides at the bottom of `src/layouts/base-layout.astro`, with no `v2-layout`, `v2-body` or `v1`; no CSS or markup change; `git grep -n 'v2-layout\|v2-body' src` finds nothing.
- `bun run lint`, `bun run check`, `bunx prettier --check "**/*.astro"`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `src/components/layout/footer.astro`, `src/components/layout/mobile-sheet.astro` (comments only).

## Decisions

- 2026-10-10: Source: F3 of KA0002
- 2026-10-10: The human: no light theme and no v2 in the app; this ticket removes their remaining mentions, approved on that reading.
