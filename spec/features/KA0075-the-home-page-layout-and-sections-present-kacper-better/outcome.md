# KA0075 - Outcome

- Merged: 2026-10-28, `01f7736`
- Branch: h/2026-10-14-ka0075-preview-fixes-opu-7d8611e5
- Reviews: review-1.md PASS, review-2.md none
- Cost: worker $131.04, reviews $3.84; review rounds 2

## What went in

- The home page follows the brief's order and presents Kacper as an AI Engineer: hero with the chosen H1, subtitle, two buttons and a results card with figures (no status badge, which now lives in the mobile menu); meta, og and twitter titles and the footer tagline match.
- "Brzmi znajomo?" is six equal cards, each a problem with its effect under a hairline; the separate examples section (#examples) is gone and tailor-made apps moved into the offer.
- The offer is three steps on one grid with one primary button; the process is five steps on a rail that fills while scrolling (static under reduced motion), staggered left and right on the desktop, with a call button under it.
- "Co już działa" shows four cases newest first (ReX, LeadBuster and LeadApartament, Helpfind, Energia Direct), named by their logos; the trust bar sets logos by optical weight; the experience section was removed.
- About sits level with the photo; FAQ and contact fill the width; the contact form comes first, its project types (Audyt AI, Wdrożenie, Stała współpraca, Inne) are checkboxes with several allowed per lead, and the server accepts that list.
- More room between and inside sections (new section and block gap tokens); e2e tests cover the order, copy, geometry at 1440/1024/390 and the lead payload; AGENTS, DESIGN and README describe the new layout.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0100 (F1), KA0101 (F2).
