# KA0010 - Outcome

- Merged: 2026-10-10, `d450f62`
- Branch: h/2026-10-10-v2-comments-point-at-bas-b61ff73a
- Reviews: review-1.md PASS
- Cost: worker $0.00, reviews $0.13; review rounds 1

## What went in

- `src/components/layout/footer.astro`, `src/components/layout/mobile-sheet.astro`: the glass comments point at the overrides at the bottom of `src/layouts/base-layout.astro`; no `v2-layout`, `v2-body` or v1 left.

## Checks on main

- `npm run check`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none; no findings.md on this ticket.
