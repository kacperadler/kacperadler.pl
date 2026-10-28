# KA0106 - One-word last lines in paragraphs (text-wrap: pretty)

```json
{
  "id": "KA0106",
  "title": "One-word last lines in paragraphs (text-wrap: pretty)",
  "date": "2026-10-28",
  "after": [
    "KA0105"
  ]
}
```

## Description

good-css "The reset" (`foundations.md`): `text-wrap: pretty` on `:root`. Counting elements in `<main>` (p, h3, li, dd, summary, at least four words) whose last line holds a single word: 21 at 1440 and 28 at 390 today, 3 and 7 with `:root { text-wrap: pretty }` (a `<p>` inside an `<li>` counts twice). The problems cells, the experience entries, the FAQ questions and the section leads lose their lone last words; nothing else moves (`screenshots/p2-wrap-problems-{1440,390}-{before,after}.png`: "poprosisz." no longer sits alone at 390).

## Goal

Paragraphs end without a lone word on the last line, on desktop and on a phone.

- Kind: improvement

Evidence:
- `src/styles/global.css:9-22` (no `text-wrap` on the root; only h1/h2 balance)
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: add `text-wrap: pretty` to the `html` rule in `global.css`. Cost: one line; no test pins line breaks. Chrome 117+ and Safari 26+; Firefox ignores it and keeps today's wrapping. It can move a one-letter word to a line end ("zanim o / niego" in the 390 after shot); F10 covers that.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- add `text-wrap: pretty` to the `html` rule in `global.css`. Cost: one line; no test pins line breaks. Chrome 117+ and Safari 26+; Firefox ignores it and keeps today's wrapping. It can move a one-letter word to a line end ("zanim o / niego" in the 390 after shot); F10 covers that.

## Decisions

- 2026-10-28: Source: F2 of KA0104
- 2026-10-28: Carried by KA0105, approved together with it.
