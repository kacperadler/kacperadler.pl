# KA0102 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

## F1. The hero entrance timing test is flaky under load

- Kind: risk
- Found by: 2026-10-28-ka0102-007a1fe0 (worker), 2026-10-28
- Where: `tests/e2e/blueprint.spec.ts:275`
- What: in a full `bun run test` (177 passed, 1 flaky) the test "on load the header, the headline, the hero drawing, the buttons and the trust bar come in as one sequence of about 1.7s at 1440px" failed once and passed on retry; run alone with `--repeat-each 5 --retries 0` it passed 10 of 10. Which assertion failed was not kept (the run's output was filtered to the summary). The test reads the live animations of the home page right after load (start against first contentful paint, `playState`), and this ticket does not touch the home page, so the failure is timing under parallel load (other worktrees' e2e runs on the same machine) [INFERENCE].
- Suggestion: reproduce with `--repeat-each 20` under load, name the assertion that fails, and make it independent of how fast the machine paints. The entrance itself stays as it is.
- Status: dropped (duplicate of KA0103, which fixes the same test)

## F2. dev-no-reload.spec.ts flaked once in the review's full run

- Kind: note
- Found by: 2026-10-28-review-ka0102-f324e853 (review), 2026-10-28
- Where: `tests/e2e/dev-no-reload.spec.ts`
- What: passed on retry; unrelated to this diff.
- Status: dropped (KA0099 already carries this flake)
