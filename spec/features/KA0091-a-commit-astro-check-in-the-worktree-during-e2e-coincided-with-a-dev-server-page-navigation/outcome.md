# KA0091 - Outcome

- Merged: 2026-10-14, `67f1fb5`
- Branch: h/2026-10-14-ka0091-dev-reload-during-86060043
- Reviews: review-1.md PASS
- Cost: worker $2.91, reviews $0.48; review rounds 1

## What went in

- `astro.config.mjs`: with `E2E_DEV_NO_WATCH=1` the dev server ignores every path, so a commit, `astro check` or an edit during an e2e run cannot reload a page under a test; plain `bun dev` still watches.
- `playwright.config.ts`: the e2e dev server runs with `E2E_DEV_NO_WATCH=1`.
- `tests/e2e/dev-no-reload.spec.ts` (new): touches two rendered sources and checks the open page did not reload.
- `AGENTS.md`, `README.md`: the no-watch mode.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: F1 dropped.
