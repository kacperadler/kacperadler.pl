# KA0095 - Kacper's own AI automation as the first case study, with a demo

```json
{
  "id": "KA0095",
  "title": "Kacper's own AI automation as the first case study, with a demo",
  "date": "2026-10-14",
  "after": [
    "KA0075"
  ]
}
```

## Description

The brief (KA0075 `brief.md` 4.7, 8) makes Kacper's own AI automation the first and most important case study: a real problem, a measured effect (e.g. hours saved a week), labelled honestly as his own project, with a demo (recording, GIF or screenshots).

## Goal

A visitor sees AI work running for real, with a number, before reading about client projects.

- Kind: improvement

## Done means

- The first case study on the home page and its page under `/realizacje/` show the problem, the solution, the measured effect and the demo the human supplies, marked "Projekt własny". An e2e test checks the order and the label.
- `bun run check` and `bun run test` pass.

## Scope

In:
- `src/content/case-studies/` (KA0028 collection), the home page's case-study section.

Out:
- Client case studies (KA0030 to KA0035).

## Decisions

- 2026-10-14: From the redesign brief (KA0075 `brief.md` 4.7, 8): the human names the automation, gives the number and the demo.
