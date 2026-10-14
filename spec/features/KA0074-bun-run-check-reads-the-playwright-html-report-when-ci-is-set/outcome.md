# KA0074 - Outcome

- Merged: 2026-10-14, `4e894b9`
- Branch: h/2026-10-14-ka0074-check-ignores-rep-1bbf59cb
- Reviews: review-1.md PASS
- Cost: worker $0.84, reviews $0.63; review rounds 1

## What went in

- `tsconfig.json`: `exclude` adds `playwright-report`, `test-results` and `dist-no-case-studies`, so `astro check` reads only the project's own files, whatever an e2e run left behind.
- `tests/e2e/check-input.spec.ts`: puts a type-broken probe into each of those folders and asserts, through TypeScript's own config parsing as `astro check` does it, that none is checked while project files still are.
- `AGENTS.md`: the new spec in the e2e list.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none; no findings.md on this ticket.
