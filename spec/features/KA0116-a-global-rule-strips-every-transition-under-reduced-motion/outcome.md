# KA0116 - Outcome

- Merged: 2026-10-29, `34f7f6f`
- Branch: h/2026-10-28-ka0116-reduced-motion-f79e6032
- Reviews: review-1.md PASS
- Cost: worker $8.03, reviews $1.21; review rounds 1

## What went in

- global.css and 20 components under src/components/mb/: motion (transforms, height, shadows' movement, smooth scroll, the button's press) is opted in under `prefers-reduced-motion: no-preference`; colour and opacity fades run for everyone, so a visitor with reduced motion sees gentle fades instead of sudden jumps. The old global rule that stripped every transition is gone.
- tests/e2e/motion.ts, design.spec.ts and ui-catalogue.spec.ts check that nothing moves under reduce and fades remain; the a11y test waits for fades to end; AGENTS.md and DESIGN.md record the convention.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none; no findings.md on this ticket.
