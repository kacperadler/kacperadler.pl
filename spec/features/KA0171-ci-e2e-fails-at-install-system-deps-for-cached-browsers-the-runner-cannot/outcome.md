# KA0171 - Outcome

- Merged: 2026-11-11, `c1e7ef5`
- Branch: arthur/2026-11-11-worker-589015dc
- Reviews: none
- Cost: worker $0.92, reviews $0.55; review rounds 0

## What went in

- .github/workflows/ci.yml: the e2e job installs Chromium with `bunx playwright install chromium` (no `--with-deps`, no `install-deps`, so no apt), then a "Check Chromium's system libraries" step fails with an `::error::` naming any library `ldd` reports missing before the Playwright tests run.

## Checks on main

- `bun install --frozen-lockfile`: passed.
- `npm run check`: passed.
- `npm test`: passed.

## Left open

- Findings: none; no findings.md on this ticket.
