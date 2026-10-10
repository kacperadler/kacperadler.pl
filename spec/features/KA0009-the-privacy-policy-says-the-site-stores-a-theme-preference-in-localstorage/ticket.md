# KA0009 - The privacy policy says the site stores a theme preference in `localStorage`

```json
{
  "id": "KA0009",
  "title": "The privacy policy says the site stores a theme preference in `localStorage`",
  "date": "2026-10-10"
}
```

## Description

The privacy policy tells visitors the site saves `ka:theme` (`light` / `dark`) in `localStorage`, and the terms require a browser with `localStorage`. The theme toggle was removed in `6e1b55e`; `grep localStorage|ka:theme` over `src/` finds no code that reads or writes it, only these legal pages. Legal copy that describes processing which does not happen is a compliance risk.

## Goal

The privacy policy and terms say only what the site does: no theme stored in `localStorage` (vision: no cookies or trackers, said truthfully).

- Kind: bug

Evidence:
- `src/pages/polityka-prywatnosci.md:45`, `src/pages/polityka-prywatnosci.md:91`, `src/pages/regulamin.md:30`
- Found by: 2026-10-10-docs-and-agents-md-508a76bc (worker), 2026-10-10

## Done means

- The privacy policy no longer says the site stores a theme (or anything else) in `localStorage`; the terms no longer require `localStorage`; `lastUpdated` bumped on both; `grep -rn 'localStorage\|ka:theme' src/pages` finds nothing; no em-dash added; one `copy(...)` commit per page.
- `bun run lint`, `bun run check`, `bunx prettier --check "**/*.astro"`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `src/pages/polityka-prywatnosci.md`, `src/pages/regulamin.md`.

## Decisions

- 2026-10-10: Source: F2 of KA0002
- 2026-10-10: The human approved it.
- 2026-10-10: The human: merge once its review passes (or h review-needed says no review).
