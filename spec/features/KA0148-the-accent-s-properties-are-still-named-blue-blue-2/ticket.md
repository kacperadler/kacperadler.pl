# KA0148 - The accent's properties are still named `--blue` / `--blue-2`

```json
{
  "id": "KA0148",
  "title": "The accent's properties are still named `--blue` / `--blue-2`",
  "date": "2026-11-05",
  "budget": 1
}
```

## Description

F1 of KA0145 (spec/features/KA0145-new-colour-palette-galactic-blue-true-blue-and-lime-green/findings.md).

- Kind: refactor
- Found by: 2026-11-05-worker-9c8d687a (worker), 2026-11-05
- Where: `src/styles/tokens.css:39`
- What: after KA0145 `--blue` holds Lime Green and `--blue-2` its lighter step; about 30 components read them by those names (`git grep -c 'var(--blue' -- src`). `tokens.css` and `DESIGN.md` say the name is left over, but a reader of a component sees `var(--blue)` paint green. The ticket's Scope keeps components out unless they set a colour outside the tokens, so the branch kept the names.
- Suggestion: rename `--blue` → `--accent` and `--blue-2` → `--accent-2` in every `src` file in one cutover (no alias), and the `lime` / `lime-2` rows of the `DESIGN.md` table with them. No visual change; the e2e suite pins computed colours, not property names.
- Budget: 1

## Goal

<!-- What we are after, what it moves in spec/vision.md, and the evidence (file:line, a command and its output). -->

- Kind: refactor

## Done means

<!-- Each observable result, and the test that proves it; the project's checks pass. -->

## Scope

In:
<!-- - `path/to/file.ts`: what changes there. -->

Out:
<!-- - What this ticket does not do, and which ticket does. -->

## Decisions

- 2026-11-05: Source: F1 of KA0145
