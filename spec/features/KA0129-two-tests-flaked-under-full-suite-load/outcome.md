# KA0129 - Outcome

- Merged: 2026-10-28, `8be5bac`
- Branch: h/2026-10-28-ka0129-load-flakes-af11ddfd
- Reviews: review-1.md PASS
- Cost: worker $5.70, reviews $0.60; review rounds 1

## What went in

- contact-form.spec.ts waits for the page's load event instead of network idle, which hung on the remote analytics; its reads of the lead database wait up to 5 s for a write in progress, with a test for that.
- og-image.spec.ts reads the built og-default.png from disk and keeps the pixel checks.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0131 (F1), KA0132 (F2), KA0133 (F3).
