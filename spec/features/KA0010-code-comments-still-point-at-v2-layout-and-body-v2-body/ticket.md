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

Evidence:
- `src/components/layout/footer.astro:69-70`, `src/components/layout/mobile-sheet.astro:50-51`
- Found by: 2026-10-10-docs-and-agents-md-508a76bc (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: reword both comments to point at `base-layout.astro`; no CSS change.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- reword both comments to point at `base-layout.astro`; no CSS change.

## Decisions

- 2026-10-10: Source: F3 of KA0002
