# KA0119 - The hero entrance timing test is flaky under load

```json
{
  "id": "KA0119",
  "title": "The hero entrance timing test is flaky under load",
  "date": "2026-10-28"
}
```

## Description

in a full `bun run test` (177 passed, 1 flaky) the test "on load the header, the headline, the hero drawing, the buttons and the trust bar come in as one sequence of about 1.7s at 1440px" failed once and passed on retry; run alone with `--repeat-each 5 --retries 0` it passed 10 of 10. Which assertion failed was not kept (the run's output was filtered to the summary). The test reads the live animations of the home page right after load (start against first contentful paint, `playState`), and this ticket does not touch the home page, so the failure is timing under parallel load (other worktrees' e2e runs on the same machine) [INFERENCE].

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: risk

Evidence:
- `tests/e2e/blueprint.spec.ts:275`
- Found by: 2026-10-28-ka0102-007a1fe0 (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: reproduce with `--repeat-each 20` under load, name the assertion that fails, and make it independent of how fast the machine paints. The entrance itself stays as it is.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- reproduce with `--repeat-each 20` under load, name the assertion that fails, and make it independent of how fast the machine paints. The entrance itself stays as it is.

## Decisions

- 2026-10-28: Source: F1 of KA0102
- 2026-10-28: Dropped by the coordinator: duplicate of KA0103, which fixes this test.
