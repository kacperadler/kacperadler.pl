# KA0117 - Outcome

- Merged: 2026-10-29, `5516a19`
- Branch: h/2026-10-28-ka0117-derived-colours-4daffb81
- Reviews: review-1.md PASS
- Cost: worker $1.01, reviews $0.53; review rounds 1

## What went in

- tokens.css: the hairline colour `--v2-line` is mixed from `--ink` at 10% (`oklch(from var(--ink) l c h / 0.1)`), so a new ink changes the hairlines too; it still paints rgb(32, 34, 36) on the background, nothing looks different.
- design.spec.ts checks the exact colour and that it follows a changed ink; DESIGN.md updated.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none; no findings.md on this ticket.
