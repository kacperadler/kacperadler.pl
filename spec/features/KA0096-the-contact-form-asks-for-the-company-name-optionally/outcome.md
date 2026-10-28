# KA0096 - Outcome

- Merged: 2026-10-28, `d7541b7`
- Branch: h/2026-10-28-ka0096-company-field-aeffbf3f
- Reviews: review-1.md PASS; merged unreviewed (--unreviewed): no PASS on 3f1bbfe (last PASS: d5c2b7e, 17 commits since)
- Cost: worker $6.84, reviews $2.09; review rounds 1

## What went in

- The contact form has an optional "Firma" field, with "(opcjonalnie)" smaller and dimmer after the label (field.astro's `optional` prop); on a wide sheet Email and Firma sit side by side, the project types below.
- lead.ts and /api/lead accept a company up to 200 characters, empty allowed; leads-db.ts stores it in a new column, old tables get it on first save; the e-mail and logs do not carry it.
- The privacy policy names the optional company name; e2e covers empty, filled, too long and the label's size and contrast; README, AGENTS.md, DESIGN.md updated.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Nothing: F1, F2 dropped.
