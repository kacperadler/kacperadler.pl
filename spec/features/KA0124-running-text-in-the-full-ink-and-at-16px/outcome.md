# KA0124 - Outcome

- Merged: 2026-10-29, `bf651c5`
- Branch: h/2026-10-29-ka0124-running-text-87853270
- Reviews: review-1.md PASS
- Cost: worker $3.38, reviews $1.06; review rounds 1

## What went in

- Running text (section leads, hero subtitle, problem sentences, card content, FAQ answers, prose, the after-send message) is in the full `--ink` at 16px or more; notes, captions, labels and the drawing stay `--ink-2`. The palette did not change.
- DESIGN.md defines running text; the e2e specs check the colours without naming --ink-2 values.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none; no findings.md on this ticket.
