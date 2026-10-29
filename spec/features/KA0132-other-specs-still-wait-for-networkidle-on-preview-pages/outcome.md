# KA0132 - Outcome

- Merged: 2026-10-29, `764e225`
- Branch: h/2026-10-29-ka0132-networkidle-1fbb497b
- Reviews: review-1.md PASS
- Cost: worker $2.05, reviews $0.89; review rounds 1

## What went in

- Preview specs wait for the state each test asserts instead of network idle: sendALead returns once the stub answered or the browser submitted natively; a11y, contact-form (sendLong) and design (resize) drop their networkidle waits.
- With the analytics host hanging, the 10 affected tests pass; before, 3 of 4 timed out.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none; no findings.md on this ticket.
