# KA0133 - Above the default worker count, more specs time out

```json
{
  "id": "KA0133",
  "title": "Above the default worker count, more specs time out",
  "date": "2026-10-28",
  "after": [
    "KA0134"
  ]
}
```

## Description

`bunx playwright test --workers=12 --retries=0` on a 7-core machine already loaded by other worktrees: 8 failed, 210 passed. Four were the "database is locked" reads this ticket fixed; the rest were the axe scans of the home/legal pages and of `/ui` running past the 30 s test timeout and the pagination jump on the dev catalogue not finding the current page within 5 s. With the default workers (`CI` set: 1) two full runs passed 218 and 219 of 218 and 219.

## Goal

The suite passes with more parallel workers, so it does not time out on a faster or busier machine.

- Kind: risk

Evidence:
- `tests/e2e/a11y.spec.ts:28`, `tests/e2e/ui-catalogue.spec.ts:254`, `tests/e2e/ui-catalogue.spec.ts:783`
- Found by: 2026-10-28-ka0129-load-flakes-af11ddfd (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: if runs with more workers are wanted, give the axe tests a longer `test.setTimeout` (they scan several pages in one test) and look at the dev-server pagination test under load; otherwise keep the worker count as it is.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- if runs with more workers are wanted, give the axe tests a longer `test.setTimeout` (they scan several pages in one test) and look at the dev-server pagination test under load; otherwise keep the worker count as it is.

## Decisions

- 2026-10-28: Source: F3 of KA0129
- 2026-10-29: The human approved it ("mozesz zrobic wszytskie 5").
