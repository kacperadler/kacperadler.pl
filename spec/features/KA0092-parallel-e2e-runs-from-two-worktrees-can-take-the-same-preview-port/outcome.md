# KA0092 - Outcome

- Merged: 2026-10-14, `bb6279f`
- Branch: h/2026-10-14-ka0092-e2e-port-race-a3f5757f
- Reviews: review-1.md PASS, review-2.md PASS
- Cost: worker $2.64, reviews $1.00; review rounds 2

## What went in

- `playwright.config.ts`: each run claims its preview and dev ports with a `<port>.<pid>` file in `$TMPDIR/kacperadler-e2e-ports`, counting up from 4329 past ports that are busy or claimed by a live run; claims are removed on exit and a dead process's claim is ignored, so two worktrees running the suite at once never share a port.
- `tests/e2e/e2e-ports.spec.ts` (new): loads the config in two processes at once and checks the four ports differ.
- `AGENTS.md`: how the tests pick ports.
- `findings.md`: F1 dev-no-reload flake (ticket KA0099), F2 dropped.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0099 (F1).
