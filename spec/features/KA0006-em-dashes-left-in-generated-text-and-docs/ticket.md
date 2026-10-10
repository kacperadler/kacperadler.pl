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

Em-dashes are never in the copy or docs (vision, styleguide). After this none is left, including the public `/llms.txt` and `/llms-full.txt`.

- Kind: cleanup
- Model: haiku

Evidence:
- `src/pages/llms.txt.ts:42`, `src/pages/llms.txt.ts:46`, `src/pages/llms-full.txt.ts:61`, `src/pages/llms-full.txt.ts:107-109`, `DESIGN.md:173-174`, `DESIGN.md:183`, `DESIGN.md:190`, `DESIGN.md:192`
- Found by: 2026-10-10-onboard-kacperadler-pl-6c85f5ea (worker), 2026-10-10

## Done means

- Each listed em-dash (U+2014) becomes ` - `; `grep -rn $'\u2014' src DESIGN.md` finds nothing; no other change.
- `bun run lint`, `bun run check`, `bunx prettier --check "**/*.astro"`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts`, `DESIGN.md`.

## Decisions

- 2026-10-10: Source: F3 of KA0001
- 2026-10-10: The human approved it.
- 2026-10-10: The human: "KA0006 OK", merge after a PASS.
