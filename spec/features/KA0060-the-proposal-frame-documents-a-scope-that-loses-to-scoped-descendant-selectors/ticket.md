# KA0060 - The proposal frame documents a scope that loses to scoped descendant selectors

```json
{
  "id": "KA0060",
  "title": "The proposal frame documents a scope that loses to scoped descendant selectors",
  "date": "2026-10-10"
}
```

## Description

both say that `[data-proposal="<id>"] .class` matches the scoped component selector and wins the tie by order. That holds for one class only: Astro adds its attribute to every compound, so `.radio span` is `.radio[data-astro-cid-x] span[data-astro-cid-x]` (0,3,1) and `.radio input:checked + span` is (0,5,2), while `[data-proposal="<id>"] .radio span` is (0,2,1) and loses. A proposal written by the documented pattern silently keeps the current look on radios, field errors, the card-hover badge, the services grid's last card, the step dots and more. The modernist proposal works around it with an id-weight scope (`html[data-proposal="modernist"]:not(#id-weight)`).

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: risk

Evidence:
- `src/styles/proposals/baseline/proposal.css` (the how-to comment), `AGENTS.md` (`## Wygląd`, "Propozycje designu")
- Found by: 2026-10-10-proposal-modernist-da8a6493 (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: document the per-compound attribute in the baseline comment and `AGENTS.md`, and name one way to outweigh it (the id-weight `:not()` scope, or repeating the scope attribute per compound). Out: changing how Astro scopes styles.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- document the per-compound attribute in the baseline comment and `AGENTS.md`, and name one way to outweigh it (the id-weight `:not()` scope, or repeating the scope attribute per compound). Out: changing how Astro scopes styles.

## Decisions

- 2026-10-10: Source: F2 of KA0041
- 2026-10-10: Dropped by the coordinator: duplicate of KA0057.
