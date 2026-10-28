# KA0125 - "CRM-y" in "Aplikacje szyte na miarę" breaks at its hyphen

```json
{
  "id": "KA0125",
  "title": "\"CRM-y\" in \"Aplikacje szyte na miarę\" breaks at its hyphen",
  "date": "2026-10-28",
  "after": [
    "KA0111"
  ]
}
```

## Description

Taste Skill `type.md` §8 "a break that splits a phrase ... Author the break". At 1440 the line ends "CRM-" and the next starts "y i panele" (`screenshots/p3-labels-1440-before.png`, the 02.4 cell).

## Goal

"CRM-y" never splits across two lines.

- Kind: improvement

Evidence:
- services, "Aplikacje szyte na miarę" (`customApps` in `src/data/home.ts`, rendered by `src/components/mb/sections/services.astro`)
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: a non-breaking hyphen (U+2011) in "CRM‑y", or carry it in KA0114 (one-letter Polish words), which already touches how copy breaks. Visitor sees: "CRM-y" whole. Cost: one character. Approved decision: none (same words).
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- a non-breaking hyphen (U+2011) in "CRM‑y", or carry it in KA0114 (one-letter Polish words), which already touches how copy breaks. Visitor sees: "CRM-y" whole. Cost: one character. Approved decision: none (same words).

## Decisions

- 2026-10-28: Source: F9 of KA0118
- 2026-10-28: The human approved it (took the coordinator's recommendation).
