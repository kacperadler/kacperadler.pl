# KA0114 - One-letter Polish words end lines

```json
{
  "id": "KA0114",
  "title": "One-letter Polish words end lines",
  "date": "2026-10-28",
  "after": [
    "KA0108"
  ]
}
```

## Description

not a good-css entry; seen while measuring F2. Polish typesetting keeps one-letter words (a, i, o, u, w, z) with the next word. Today at 390 the second problems cell ends a line on "maile i" (`screenshots/p2-wrap-problems-390-before.png`), and `text-wrap: pretty` produced "zanim o / niego" (`p2-wrap-problems-390-after.png`). CSS has no rule for it.

## Goal

Single-letter Polish words (a, i, o, u, w, z) never stand alone at a line end.

- Kind: improvement

Evidence:
- copy in `src/data/home.ts`, `src/content/**` (rendered everywhere text wraps)
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: a non-breaking space after one-letter words, written in the copy or added by one build-time helper used where copy is rendered (and in `llms-full.txt` left as a normal space). Cost: a helper plus its call sites, or a copy pass; the copy change goes in `copy(<section>)` commits.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- a non-breaking space after one-letter words, written in the copy or added by one build-time helper used where copy is rendered (and in `llms-full.txt` left as a normal space). Cost: a helper plus its call sites, or a copy pass; the copy change goes in `copy(<section>)` commits.

## Decisions

- 2026-10-28: Source: F10 of KA0104
- 2026-10-28: The human approved it; runs one at a time after KA0108 (shared CSS files).
