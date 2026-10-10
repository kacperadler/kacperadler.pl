# KA0056 - The axe check runs only on the baseline proposal

```json
{
  "id": "KA0056",
  "title": "The axe check runs only on the baseline proposal",
  "date": "2026-10-10"
}
```

## Description

every proposal ticket asks for "axe zero on the proposal page", but the spec runs axe on `/ui/proposal/baseline` only. A proposal that drops contrast (minimal, brutalism, ...) passes `bun run test:e2e`; for KA0039 the check on `/ui/proposal/minimal` was a throwaway script (0 violations).

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: risk

Evidence:
- `tests/e2e/ui-proposals.spec.ts:165` ("has no detectable WCAG 2.1 AA violations")
- Found by: 2026-10-10-proposal-minimal-a56f3f1a (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: run the same axe test once per folder in `src/styles/proposals/` (the spec already reads them into `proposals`). The frame pages stay as they are.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- run the same axe test once per folder in `src/styles/proposals/` (the spec already reads them into `proposals`). The frame pages stay as they are.

## Decisions

- 2026-10-10: Source: F1 of KA0039
- 2026-10-10: Dropped by the coordinator: KA0040 (9ae67a7) runs axe on every proposal folder.
