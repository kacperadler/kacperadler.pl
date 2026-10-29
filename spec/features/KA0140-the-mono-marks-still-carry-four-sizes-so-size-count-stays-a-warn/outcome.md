# KA0140 - Outcome

- Merged: 2026-10-29, `cda7934`
- Branch: h/2026-10-29-ka0140-mono-sizes-aeb45f1f
- Reviews: review-1.md PASS
- Cost: worker $2.52, reviews $0.69; review rounds 1

## What went in

- Geist Mono text uses 12px (labels, badges) and 14px (numbers): badge, case-study labels, service step and pagination numbers, step-marker without its 13px phone override.
- The brand k is 16px like the name beside it; favicon.svg and favicon.ico redrawn to match.
- /ui avatars and the prose table head moved onto the same sizes.
- type-scale.ts no longer skips mono text; favicon.spec.ts checks the favicon k against the brand k; DESIGN.md gives the sizes.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none; no findings.md on this ticket.
