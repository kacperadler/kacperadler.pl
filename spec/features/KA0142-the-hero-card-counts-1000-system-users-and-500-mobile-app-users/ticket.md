# KA0142 - The hero card counts 1000+ system users and 500+ mobile app users

```json
{
  "id": "KA0142",
  "title": "The hero card counts 1000+ system users and 500+ mobile app users",
  "date": "2026-10-29"
}
```

## Description

The human wants the hero card's figures raised (`hero-card-before.jpg` in this folder): 250+ becomes 1000+, and 100+ becomes 500+ counting all the mobile apps he has built, not one client's.

## Goal

The hero card's "W liczbach" reads: „1000+ / osób codziennie pracuje w systemach, które współtworzyłem” and „500+ / osób codziennie korzysta z aplikacji mobilnych, które stworzyłem”; „24 h” stays.

- Kind: improvement
- Model: haiku
- Evidence: `src/components/mb/sections/hero.astro:48-53` (the figures and texts); `tests/e2e/home.spec.ts:180-186` (the asserted copy).

## Done means

- The page shows the two new figures and texts above; `home.spec.ts` asserts them.
- Any other place carrying the old 250+/100+ hero claim (`llms-full.txt`, AGENTS.md, DESIGN.md: grep `250+` and `100+`) says the same; Energia Direct's own ~100 daily users in its case study stays as is.
- `bun run lint`, `bun run check`, the home spec pass; one before/after screenshot of the card at 390px, same frame.

## Scope

In:
- `hero.astro`, `home.spec.ts`, the files the grep finds.

Out:
- Layout, sizes, the 24 h line, the case studies.

## Decisions

- 2026-10-29: The human asked for it: "+1000 osób", "+500 z aplikacji mobilnych, bo robiłem też inne w przeszłości"; the wording above is the coordinator's, keeping "codziennie" from today's copy.
