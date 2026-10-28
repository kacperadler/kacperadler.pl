# KA0114 - Outcome

- Merged: 2026-10-28, `e1c3a33`
- Branch: h/2026-10-28-ka0114-one-letter-words-08082bc6
- Reviews: review-1.md PASS
- Cost: worker $1.98, reviews $0.90; review rounds 1

## What went in

- src/lib/one-letter-words.ts binds the one-letter Polish words (a, i, o, u, w, z) to the next word with a non-breaking space in visible text, leaving attributes, scripts, styles and code alone; src/middleware.ts runs every HTML page through it, so no line ends with a lone one-letter word.
- Unit and e2e tests cover it; the UI catalogue test accepts the non-breaking space; AGENTS.md records the rule and its limit.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Nothing: F1 dropped.
