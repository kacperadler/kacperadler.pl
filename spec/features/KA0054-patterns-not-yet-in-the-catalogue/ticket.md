# KA0054 - Patterns not yet in the catalogue

```json
{
  "id": "KA0054",
  "title": "Patterns not yet in the catalogue",
  "date": "2026-10-10"
}
```

## Description

these one-off patterns are outside KA0037's list, so `/ui` does not show them; each still has its styles only in its section.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: improvement

Evidence:
- `src/components/sections/contact.astro` (`.v2-contact-link`), `src/components/layout/mobile-sheet.astro` (`.sheet-link`, `.sheet-close`), `src/components/layout/nav.astro` (`.brand`, `.mark`, `.menu-btn`), `src/components/sections/how-i-work.astro` (`.step-dot`), `src/components/contact/contact-form.astro` (`.form-error`, `.form-success-card`)
- Found by: 2026-10-10-ui-catalogue-47d20fec (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: move each into `src/components/ui/` and add it to `/ui` when a redesign touches it.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- move each into `src/components/ui/` and add it to `/ui` when a redesign touches it.

## Decisions

- 2026-10-10: Source: F4 of KA0037
