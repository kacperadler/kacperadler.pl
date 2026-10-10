# KA0016 - Outcome

- Merged: 2026-10-10, `2f475d1`
- Branch: h/2026-10-10-e2e-preview-stays-attach-7fb609bf
- Reviews: review-1.md PASS
- Cost: worker $1.01, reviews $0.71; review rounds 1

## What went in

- `playwright.config.ts`: the e2e run starts and owns its own preview (attached, `--ignore-lock`) on `E2E_PORT`, else 4329, else a free port, and never reuses a server it did not start; passes without a TTY, with or without `CI`, next to a stray server on 4329.

## Checks on main

- `npm run check`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0022 (F1, review note).
