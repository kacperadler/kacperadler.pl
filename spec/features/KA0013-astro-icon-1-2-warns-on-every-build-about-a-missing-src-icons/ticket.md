# KA0013 - astro-icon 1.2 warns on every build about a missing `src/icons`

```json
{
  "id": "KA0013",
  "title": "astro-icon 1.2 warns on every build about a missing `src/icons`",
  "date": "2026-10-10"
}
```

## Description

`bun run build` prints `[WARN] [astro-icon] Failed to load icons from "src/icons": ENOENT` because the project has no local icon folder (all icons come from `@iconify-json/lucide`). The 1.2.0 plugin logs the failed `readdir` as a warning. Output is unaffected; the warning is noise in every build and CI log.

## Goal

Every build and CI log is free of the astro-icon warning, so a real warning stands out.

- Kind: cleanup
- Model: haiku

Evidence:
- `astro.config.mjs` (`icon()`), `node_modules/astro-icon/dist/vite-plugin-astro-icon.js:30`
- Found by: 2026-10-10-deps-and-astro-7-3f9b93b9 (worker), 2026-10-10

## Done means

- `bun run build` prints no astro-icon warning about `src/icons` (the option that skips local icons, or `iconDir` pointed at an existing folder); every icon on the site renders as before.
- `bun run lint`, `bun run check`, `bunx prettier --check "**/*.astro"`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `astro.config.mjs` (the `icon()` options).

## Decisions

- 2026-10-10: Source: F1 of KA0003
- 2026-10-10: Rebuilt by the coordinator from F1 of KA0003: an earlier edit had emptied this file.
- 2026-10-10: The human approved it.
