# KA0047 - review.md still says package.json has no test script

```json
{
  "id": "KA0047",
  "title": "review.md still says package.json has no test script",
  "date": "2026-10-10"
}
```

## Description

"Not reasons to FAIL" lists "`npm test` failing because `package.json` has no `test` script (KA0001 findings, F1)", but `package.json` now has `"test": "playwright test"`.

## Goal

The criteria and README say what is true after KA0004, KA0025 and KA0026, and no dead helper stays in `src/`.

- Kind: cleanup
- Model: haiku

Evidence:
- `.agents/harness/criteria/review.md:39`
- Found by: 2026-10-10-drop-project-plan-new-re-c8398883 (worker), 2026-10-10

## Done means

- `.agents/harness/criteria/review.md`: the "no `test` script" line is deleted.
- `src/lib/dates.ts` and its `AGENTS.md` mention are deleted (KA0048); `git grep -n 'lib/dates' src tests` stays empty and the build passes.
- `README.md` line 3: the offer names AI agents and automation first, as the site does since KA0026 (no training claim); the role says "Inżynier oprogramowania" only after KA0036 merges, so here keep the role as main has it.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `.agents/harness/criteria/review.md`, `src/lib/dates.ts` (removed), `AGENTS.md`, `README.md`.

## Decisions

- 2026-10-10: Source: F2 of KA0025
- 2026-10-10: The coordinator folded KA0048 (dead dates.ts) and the README offer line into this ticket.
- 2026-10-10: Approved by the coordinator as a small cleanup that follows the human's decisions; merge after PASS needs the human.
