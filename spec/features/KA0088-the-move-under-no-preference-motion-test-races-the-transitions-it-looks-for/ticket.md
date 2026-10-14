# KA0088 - The "move under no-preference" motion test races the transitions it looks for

```json
{
  "id": "KA0088",
  "title": "The \"move under no-preference\" motion test races the transitions it looks for",
  "date": "2026-10-14"
}
```

## Description

in one full `bun run test` (with `CI` set, so retries on) it failed once and passed on retry, reported `1 flaky`; alone with `--repeat-each=6 --retries=0` it passed 6 of 6. After each hover, press or focus the test asks `getAnimations()` for a transition that is still running. A `--mb-snap` one lasts only 0.12s, so on a loaded machine the transition can end before the test looks, and the test fails though the motion played. The run that flaked shared the machine with other worktrees' builds and dev servers.

## Goal

The motion test passes or fails on the code, never on timing: it waits for the very transitions it asserts instead of racing them, so a full run never reports a flaky retry from it.

- Kind: bug

Evidence:
- `tests/e2e/ui-catalogue.spec.ts`, `motion (astro dev)` › `hover, press and focus move under no-preference` (and `runningTransitions`)
- Found by: 2026-10-14-ka0054-contact-link-step-7f2526ae (worker), 2026-10-14

## Done means

- The fix, with a test that proves it: record the transitions the action starts (a `transitionrun` / `transitionstart` listener set up before the action, read after it) instead of sampling the ones still running after it. The reduced-motion half, which expects none, stays as it is.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- record the transitions the action starts (a `transitionrun` / `transitionstart` listener set up before the action, read after it) instead of sampling the ones still running after it. The reduced-motion half, which expects none, stays as it is.

## Decisions

- 2026-10-14: Source: F1 of KA0054
- 2026-10-14: The human approved the ticket.
