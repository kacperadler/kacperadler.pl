# KA0135 - Outcome

- Merged: 2026-10-29, `27511b7`
- Branch: h/2026-10-29-ka0135-faq-link-eb498eb3
- Reviews: review-1.md PASS
- Cost: worker $2.20, reviews $0.60; review rounds 1

## What went in

- Inline and prose links keep no tap area past their own text (WCAG 2.5.8 inline exception; a taller area would cover the neighbour lines); CSS unchanged, link.astro comment says why.
- tap-targets.spec.ts: on /, /regulamin/ and /polityka-prywatnosci/ at 390px each link takes a tap on its centre and none from the lines above and below.
- AGENTS.md and DESIGN.md state the rule.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none; no findings.md on this ticket.
