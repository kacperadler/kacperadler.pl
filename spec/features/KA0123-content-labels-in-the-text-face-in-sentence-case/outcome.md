# KA0123 - Outcome

- Merged: 2026-10-29, `2235917`
- Branch: h/2026-10-29-ka0123-labels-15157b52
- Reviews: review-1.md PASS
- Cost: worker $5.05, reviews $1.40; review rounds 1

## What went in

- Content labels (case rows Problem/Rozwiązanie/Efekt, service facts, form legends, contact and about links, footer headings and the like) are Geist captions at 13px/500 in sentence case instead of spaced mono caps; badges and the drawing's labels stay mono.
- DESIGN.md says which labels are captions and which stay mono; design.spec.ts checks them.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0139 (F1).
