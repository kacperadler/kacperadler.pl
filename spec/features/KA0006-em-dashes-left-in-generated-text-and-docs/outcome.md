# KA0006 - Outcome

- Merged: 2026-10-10, `f8e8e2e`
- Branch: h/2026-10-10-em-dashes-out-3868f505
- Reviews: review-1.md PASS
- Cost: worker $0.00, reviews $0.25; review rounds 1

## What went in

- `src/pages/llms.txt.ts`, `src/pages/llms-full.txt.ts`, `DESIGN.md`: no em-dash left; the public `/llms.txt` and `/llms-full.txt` use ` - `.

## Checks on main

- `npm run check`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0007 (F1).
