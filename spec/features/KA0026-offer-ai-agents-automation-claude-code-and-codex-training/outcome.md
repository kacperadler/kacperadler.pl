# KA0026 - Outcome

- Merged: 2026-10-10, `7453229`
- Branch: h/2026-10-10-ai-offer-first-658231fb
- Reviews: review-1.md PASS, review-2.md PASS
- Cost: worker $2.32, reviews $1.16; review rounds 2

## What went in

- `src/content/services/ai-agents.json`: the first service card, "Agenci AI i automatyzacje"; the other five keep their relative order after it.
- `src/components/contact/contact-form.astro`: "AI i automatyzacje" (`ai`) is the first project type.
- `src/components/sections/hero.astro`, `src/data/site-config.ts`, `src/pages/llms*.txt.ts`: name the AI offer first; no training claim.
- `tests/e2e/`: services order, the `ai` type sent and tracked, the radio row wrapping at 390 px.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0036 (F2; KA0045 dropped as its duplicate).
