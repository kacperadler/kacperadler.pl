# KA0146 - Outcome

- Merged: 2026-11-05, `8a5e104`
- Branch: arthur/2026-11-05-worker-aab5e8bd
- Reviews: review-1.md PASS, review-2.md PASS
- Cost: worker $13.84, reviews $0.95; review rounds 2

## What went in

- astro.config.mjs: `build.inlineStylesheets: "always"`, so each page carries its CSS in `<style>` and no stylesheet blocks the first paint.
- AGENTS.md: describes the process drawings and outcome lines, the `panel` bands (`.mb-band` with `field-edge.astro`), the `poster` heading, the 280px gap, the drawings' lime layer as the second scroll motion, and the inlined CSS.
- DESIGN.md: concept card, colours per section, the `display-poster` size, `panel` as a section band, the new components, the drawings and the wavy edge, the second scroll motion, and the curves exception.
- spec/features/KA0146-redesign-inspired-by-the-skills-section-of-safwatk-com-on-the-new-palette/findings.md: F1 (Lighthouse runner) and F2 (process section height).
- spec/features/KA0146-redesign-inspired-by-the-skills-section-of-safwatk-com-on-the-new-palette/jury-before.md: self-scored jury card of the home page before the redesign.
- spec/features/KA0146-redesign-inspired-by-the-skills-section-of-safwatk-com-on-the-new-palette/jury-after.md: self-scored jury card of the current build: all five outcome lines, CSS inlined, mobile largest paint 1236 ms.
- spec/features/KA0146-redesign-inspired-by-the-skills-section-of-safwatk-com-on-the-new-palette/plan.md: drops the "Proposal" marks for steps 01–03 and the lede (KA-D8).
- spec/features/KA0146-redesign-inspired-by-the-skills-section-of-safwatk-com-on-the-new-palette/screenshots/before-1440.png: full home page at 1440px before.
- spec/features/KA0146-redesign-inspired-by-the-skills-section-of-safwatk-com-on-the-new-palette/screenshots/before-390.png: full home page at 390px before.
- spec/features/KA0146-redesign-inspired-by-the-skills-section-of-safwatk-com-on-the-new-palette/screenshots/after-1440.png: full home page at 1440px from the current build.
- spec/features/KA0146-redesign-inspired-by-the-skills-section-of-safwatk-com-on-the-new-palette/screenshots/after-390.png: full home page at 390px from the current build.
- src/components/mb/field-edge.astro: new; the wavy edge of a colour band (`.mb-band-edge`), filled with the band's colour, with a 1px ink line.
- src/components/mb/process-figure.astro: new; the five step drawings, an ink layer plus a lime layer revealed on scroll (drawn at once under reduced motion or without browser support).
- src/components/mb/section-head.astro: new `poster` prop for the full-width 40–88px headline with the lede under it.
- src/components/mb/sections/about.astro: on a `.mb-band` colour band with edges; poster heading.
- src/components/mb/sections/cases.astro: on a `.mb-band` colour band with edges; poster heading.
- src/components/mb/sections/contact.astro: poster heading.
- src/components/mb/sections/faq.astro: poster heading.
- src/components/mb/sections/how-i-work.astro: drawing on each card, outcome line, lede, poster heading, 280px same-side gap; lucide icons removed.
- src/components/mb/sections/problems.astro: on a `.mb-band` colour band with edges; poster heading.
- src/components/mb/sections/services.astro: poster heading.
- src/data/process.ts: each step has a `figure` and an `outcome` instead of `icon`; all five outcome lines in the owner's words (KA-D8, KA-D9).
- src/pages/_ui/catalogue.astro: catalogue samples of the five drawings, a `.mb-band` with its edges, and the poster heading.
- src/pages/llms-full.txt.ts: each process step lists its outcome after `→`.
- src/styles/global.css: new `.mb-band` rule (sets the section colour to `panel` for everything inside, adds the band padding).
- src/styles/tokens.css: new `--mb-edge` token (16px, the wavy edge's height).
- tests/e2e/design.spec.ts: headline sizes 40/88px and 110px at a 20px default font; new check that the three bands are `panel` with no seam at their edges.
- tests/e2e/home.spec.ts: the drawing sits above the title inside each card; the lime layers are empty at the top, drawn for steps 1–2 midway, all drawn at the button; under reduced motion all drawn; same-side gap 280px.

## Checks on main

- `bun install --frozen-lockfile`: passed.
- `npm run check`: passed.
- `npm test`: passed.

## Left open

- Tickets from findings: KA0150 (F1), KA0151 (F2).
