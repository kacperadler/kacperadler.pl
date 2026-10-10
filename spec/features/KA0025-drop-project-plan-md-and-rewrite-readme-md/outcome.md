# KA0025 - Outcome

- Merged: 2026-10-10, `1918d42`
- Branch: h/2026-10-10-drop-project-plan-new-re-c8398883
- Reviews: review-1.md PASS
- Cost: worker $1.46, reviews $0.53; review rounds 1

## What went in

- `project-plan.md`: deleted; its decisions still true in the code are in `AGENTS.md` (stack, icons, nav scroll, nginx 404, SEO schemas, fonts).
- `README.md`: the site as it is: purpose, stack, commands, checks, Dokploy deploy, links to `AGENTS.md`, `DESIGN.md`, `spec/vision.md`.
- `spec/vision.md`, `.agents/harness/criteria/*`: no `project-plan.md` mentions (kept by the human).

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0046 (F1), KA0047 (F2), KA0048 (F3, folded into KA0047), KA0049 (F4, fixed on main).
