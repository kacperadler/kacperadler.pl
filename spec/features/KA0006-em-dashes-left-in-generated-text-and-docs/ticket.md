# KA0006 - Em-dashes left in generated text and docs

```json
{
  "id": "KA0006",
  "title": "Em-dashes left in generated text and docs",
  "date": "2026-10-10"
}
```

## Description

Em-dashes are never to be added (KA0001 answers, question 8), and the sweeps in `edce860` and `a7636fb` removed them, but these lines still carry the em-dash (U+2014), two of them in the public `/llms.txt` and `/llms-full.txt`.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: cleanup

Evidence:
- `src/pages/llms.txt.ts:42`, `src/pages/llms.txt.ts:46`, `src/pages/llms-full.txt.ts:61`, `src/pages/llms-full.txt.ts:107-109`, `DESIGN.md:173-174`, `DESIGN.md:183`, `DESIGN.md:190`, `DESIGN.md:192`
- Found by: 2026-10-10-onboard-kacperadler-pl-6c85f5ea (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: replace each with ` - `; no other change.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- replace each with ` - `; no other change.

## Decisions

- 2026-10-10: Source: F3 of KA0001
