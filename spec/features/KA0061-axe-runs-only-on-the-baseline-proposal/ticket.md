# KA0061 - axe runs only on the baseline proposal

```json
{
  "id": "KA0061",
  "title": "axe runs only on the baseline proposal",
  "date": "2026-10-10"
}
```

## Description

every proposal ticket (KA0041 among them) requires "axe zero on the proposal page", but the spec checks `/ui/proposal/baseline` only; a later edit to a proposal's CSS or to a shared component can break a proposal's contrast with nothing failing. KA0041 checked `/ui/proposal/modernist` with a throwaway run of the same AxeBuilder call (zero violations at 1440 and 390 px).

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: improvement

Evidence:
- `tests/e2e/ui-proposals.spec.ts` ("has no detectable WCAG 2.1 AA violations")
- Found by: 2026-10-10-proposal-modernist-da8a6493 (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: run the axe test once per folder in `src/styles/proposals/` (the spec already lists them in `proposals`). Out: the other tests of the spec.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- run the axe test once per folder in `src/styles/proposals/` (the spec already lists them in `proposals`). Out: the other tests of the spec.

## Decisions

- 2026-10-10: Source: F3 of KA0041
- 2026-10-10: Dropped by the coordinator: duplicate of KA0056.
