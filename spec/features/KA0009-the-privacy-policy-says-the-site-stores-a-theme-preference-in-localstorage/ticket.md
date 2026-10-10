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

- The fix, with a test that proves it: remove the `localStorage` paragraphs from the privacy policy (the site stores nothing in the browser), drop `localStorage` from the terms' technical requirements, and bump `lastUpdated` on both; copy commits per page.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- remove the `localStorage` paragraphs from the privacy policy (the site stores nothing in the browser), drop `localStorage` from the terms' technical requirements, and bump `lastUpdated` on both; copy commits per page.

## Decisions

- 2026-10-10: Source: F2 of KA0002
