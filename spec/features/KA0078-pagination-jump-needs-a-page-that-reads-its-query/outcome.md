# KA0078 - Outcome

- Merged: 2026-10-14, `f6f7342`
- Branch: h/2026-10-14-ka0078-pagination-jump-077324c7
- Reviews: review-1.md PASS, review-2.md PASS, review-3.md PASS
- Cost: worker $4.57, reviews $1.99; review rounds 3

## What went in

- `nginx.conf`: a `map` turns `/blog/?strona=N`, `/realizacje/?strona=N` and `/lista/?strona=N` into a 302 to that list's page path, so the "go to page" field works without JavaScript; other paths (`/?strona=3`, `/api/`) are untouched and sit beside the rate limit.
- `src/components/` pagination: the jump field is a plain form with `name="strona"`; its only caller is `catalogue.astro`.
- `tests/e2e/pagination-jump.spec.ts` (new), with a list fixture: real nginx in Docker serving `dist/client`, checks the redirects and that the home page is left alone.
- `AGENTS.md`: the redirect and its limits.
- `findings.md`: F1 dropped.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none; no findings.md on this ticket.
