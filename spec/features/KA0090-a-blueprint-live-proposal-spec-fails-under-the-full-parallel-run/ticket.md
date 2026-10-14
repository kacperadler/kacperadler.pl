# KA0090 - A blueprint-live proposal spec fails under the full parallel run

```json
{
  "id": "KA0090",
  "title": "A blueprint-live proposal spec fails under the full parallel run",
  "date": "2026-10-14"
}
```

## Description

in one local `CI= bun run test` (161 tests, default worker count) it failed after 1.3s while the other 160 passed; run alone with `--repeat-each 3` it passed 3 of 3. The test runs against `astro dev` and touches none of this ticket's files (`nginx.conf`, the new Docker spec), so it looks timing-dependent under load [INFERENCE: the failure output was not inspected beyond its title].

## Goal

The full parallel e2e run passes every time: the blueprint-live proposal spec waits for the state it asserts instead of racing the drawing animation, so a red run means a real bug.

- Kind: bug

Evidence:
- `tests/e2e/ui-proposals.spec.ts:775` ("a cell under the cursor is selected whole while it is still drawing")
- Found by: 2026-10-14-ka0089-api-rate-limit-259a6610 (worker), 2026-10-14

## Done means

- The fix, with a test that proves it: read the failing assertion from a loaded run (`--repeat-each` with all workers) and wait on the drawing state instead of a fixed timing; the proposal's own behaviour stays as it is.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- read the failing assertion from a loaded run (`--repeat-each` with all workers) and wait on the drawing state instead of a fixed timing; the proposal's own behaviour stays as it is.

## Decisions

- 2026-10-14: Source: F1 of KA0089
