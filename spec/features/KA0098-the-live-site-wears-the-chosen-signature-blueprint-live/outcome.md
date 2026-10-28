# KA0098 - Outcome

- Merged: 2026-10-28, `794139c`
- Branch: h/2026-10-28-ka0098-blueprint-live-li-4aa472de
- Reviews: review-1.md PASS
- Cost: worker $83.73, reviews $3.72; review rounds 1

## What went in

- The blueprint-live look is the live site's own: rulers, section-head dimension lines with the § label, numbered cells, the dash-dot process rail and the footer legend live in the components and tokens, not in a proposal stylesheet; everything below the first screen stands drawn, nothing animates on scroll.
- The first screen enters once on load, held until the first paint: the header drops from the top, the headline then the subtitle rise, the pen draws the datum, brace and title block, the figures cascade, the buttons rise, and the five trust logos rise left to right; about 1.7 s, ease-out cubic, transform and opacity only, the headline kept as LCP. Reduced motion, no JavaScript and in-site navigation show it all at once.
- A small page script marks the page live and feeds each cell's width into its dimension readout (CSS containment would break the KA0075 subgrids).
- Cards show only the CAD selection on hover (grips and the blue item number); the sliding top rule is gone.
- The design proposals, their /ui/proposal pages and tests are removed; /ui stays dev only.
- DESIGN.md ("The drawing"), AGENTS.md and README describe it; blueprint.spec.ts covers the entrance, reduced motion, no-JS and every page.

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0102 (F1), KA0103 (F3).
