# KA0022 - Outcome

- Merged: 2026-10-10, `3da9e1f`
- Branch: h/2026-10-10-e2e-flakes-d37bc784
- Reviews: review-1.md PASS
- Cost: worker $3.31, reviews $0.82; review rounds 1

## What went in

- `playwright.config.ts`: the e2e server runs `bun run build && bun run preview`, so every run tests the tree it is in, never a stale `dist/`.
- `.github/workflows/ci.yml`: the e2e job has no separate build step; `README.md`, `AGENTS.md` say so.
- `tests/e2e/contact-form.spec.ts`: `pickType()` clicks the project-type label once it holds still (smooth scroll had made a forced click miss).
- `tests/e2e/mobile-sheet.spec.ts`: axe runs once the sheet's animations finish, not on an opacity value.

## Checks on main

- `npm run check`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none; no findings.md on this ticket.
