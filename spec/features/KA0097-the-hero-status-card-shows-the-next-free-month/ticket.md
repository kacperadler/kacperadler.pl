# KA0097 - The hero status card shows the next free month

```json
{
  "id": "KA0097",
  "title": "The hero status card shows the next free month",
  "date": "2026-10-14",
  "after": [
    "KA0075"
  ]
}
```

## Description

The brief (KA0075 `brief.md` 4.2) puts "Wolne terminy: [miesiąc]" on the hero status card; KA0075 left it out because the month must stay true.

## Goal

A visitor sees when Kacper can start, and the date never goes stale.

- Kind: improvement

## Done means

- The status card shows the next free month from one value the human sets (e.g. in `src/data/site-config.ts`); the row is absent when the value is empty or in the past at build time. e2e covers both.
- `bun run check` and `bun run test` pass.

## Scope

In:
- `src/data/site-config.ts`, the hero section.

Out:
- The calendar booking (KA0093).

## Decisions

- 2026-10-14: From the redesign brief (KA0075 `brief.md` 4.11); the human wants it as its own ticket.
