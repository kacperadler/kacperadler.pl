# KA0088 - Outcome

- Merged: 2026-10-14, `4d67b3d`
- Branch: h/2026-10-14-ka0088-motion-test-race-85b614c5
- Reviews: review-1.md PASS
- Cost: worker $1.28, reviews $0.84; review rounds 1

## What went in

- `tests/e2e/ui-catalogue.spec.ts`: `transitionsStartedBy` waits until nothing runs, then records the `transitionrun` events one action starts; `expectMotion` takes the action, so hover, press and focus are each checked on their own transitions instead of racing them; reduced motion still expects none.
- `findings.md`: F1 dev-server reload on a commit during e2e (ticket KA0091), F2 port race between worktrees (ticket KA0092).

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0091 (F1), KA0092 (F2).
