# KA0048 - src/lib/dates.ts is imported nowhere

```json
{
  "id": "KA0048",
  "title": "src/lib/dates.ts is imported nowhere",
  "date": "2026-10-10"
}
```

## Description

nothing in `src/` or `tests/` imports `lib/dates` (grep for `lib/dates|\./dates` is empty); `totalYearsFloor` and the rest were for the "~N lat" experience title, which the section no longer renders. The experience section and `llms*.txt.ts` slice years from `startDate` inline.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: cleanup

Evidence:
- `src/lib/dates.ts`, `AGENTS.md` `## Struktura` (`lib/ # seo, dates`)
- Found by: 2026-10-10-drop-project-plan-new-re-c8398883 (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: delete `src/lib/dates.ts` and its `AGENTS.md` mention, or make the three inline year computations use it; pick one.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- delete `src/lib/dates.ts` and its `AGENTS.md` mention, or make the three inline year computations use it; pick one.

## Decisions

- 2026-10-10: Source: F3 of KA0025
- 2026-10-10: Folded into KA0047.
