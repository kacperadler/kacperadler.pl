# KA0014 - Outcome

- Merged: 2026-10-10, `2ec2514`
- Branch: h/2026-10-10-types-node-to-22-343e2e70
- Reviews: review-1.md PASS
- Cost: worker $0.00, reviews $0.12; review rounds 1

## What went in

- `package.json`, `bun.lock`: `@types/node` pinned to `^22`, the Node CI builds on; `bun outdated` lists it and TypeScript, both by decision.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none; no findings.md on this ticket.
