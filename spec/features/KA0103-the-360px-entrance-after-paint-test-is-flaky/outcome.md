# KA0103 - Outcome

- Merged: 2026-10-28, `545af2d`
- Branch: h/2026-10-28-ka0103-4e3e9c16
- Reviews: review-1.md PASS
- Cost: worker $2.89, reviews $0.58; review rounds 1

## What went in

- The head script starts the first-screen entrance only once the browser reports the first contentful paint (with a fallback for a tab hidden before paint), so the entrance never begins before anything is on screen.
- The blueprint test checks the entrance starts after that paint at both widths; AGENTS.md, DESIGN.md and the global.css comment describe the new start signal.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Nothing: F1-F3 dropped.
