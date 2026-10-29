# KA0125 - Outcome

- Merged: 2026-10-29, `0852107`
- Branch: h/2026-10-29-ka0125-taste-3b4f95a7
- Reviews: review-1.md PASS
- Cost: worker $1.92, reviews $0.64; review rounds 1

## What went in

- The page middleware (renamed line-breaks.ts, beside the one-letter-word rule) puts an invisible word joiner after a hyphen between two capitals and a lowercase letter, so "CRM-y" and the like never break at the hyphen; the hyphen keeps Geist's glyph (U+2011 would fall back to another font).
- llms-full.txt keeps the plain text; line-breaks.spec.ts checks every page at 390 and 1440.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Findings: none; no findings.md on this ticket.
