# KA0123 - Content labels in the text face, in sentence case

```json
{
  "id": "KA0123",
  "title": "Content labels in the text face, in sentence case",
  "date": "2026-10-28",
  "after": [
    "KA0124"
  ]
}
```

## Description

Taste Skill "No tiny uppercase letter-spaced labels" (the one gallery fashion the data condemns: 16% of top sites against 57% of weak ones, `tells.md` §4) and "No text under 13px" (`copy.md` §7). `inspect.mjs`: 52 micro-labels and 20 text blocks under 13px on the home page. Most are labels a visitor reads to understand content (11px Geist Mono caps, 0.12em tracking), not the drawing's own marks. Throwaway on services, cases and the form labels: Geist 13px, weight 500, `--muted`, sentence case. Measured after: 28 micro-labels, 16 blocks under 13px (`screenshots/p3-labels-{1440,390}-{before,after}.png`).

## Goal

Labels inside content read as plain text, larger and in sentence case, while the drawing's own marks keep the monospace; the page reads calmer and easier.

- Kind: improvement

Evidence:
- `src/components/mb/sections/services.astro:147-154` (Dla kogo / Co dostajesz / Czas), `src/components/mb/sections/cases.astro:203-209` (Problem / Rozwiązanie / Efekt), `src/components/mb/label.astro:27-35` (form: Email, Wiadomość), `src/components/mb/field-set.astro:55-62` (Czego potrzebujesz), `src/components/mb/contact-link.astro:52-59`, `src/components/mb/sections/hero.astro:277-285` (W liczbach), `src/components/mb/sections/trust.astro:66-75`, `src/components/mb/footer.astro:128-135`
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: the same for every content label in the list above; keep Geist Mono for the drawing's marks (the "§ 01 / Oferta" label, cell numbers, dimension lines, the title block's header, the footer legend, the datum). Visitor sees: "Dla kogo", "Problem", "Efekt" as quiet captions above the text they belong to, easier to read on a phone; the drawing stays. Cost: about 8 rules in 8 files, `DESIGN.md` (mono labels) updated; `home.spec.ts:600-615` reads the `dt` text, which stays. Approved decision: touches KA0098's direction ("minimal brutalism: ruled cells, square corners, mono labels, Geist") and DESIGN.md; the human decides where the line between label and drawing sits.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- the same for every content label in the list above; keep Geist Mono for the drawing's marks (the "§ 01 / Oferta" label, cell numbers, dimension lines, the title block's header, the footer legend, the datum). Visitor sees: "Dla kogo", "Problem", "Efekt" as quiet captions above the text they belong to, easier to read on a phone; the drawing stays. Cost: about 8 rules in 8 files, `DESIGN.md` (mono labels) updated; `home.spec.ts:600-615` reads the `dt` text, which stays. Approved decision: touches KA0098's direction ("minimal brutalism: ruled cells, square corners, mono labels, Geist") and DESIGN.md; the human decides where the line between label and drawing sits.

## Decisions

- 2026-10-28: Source: F3 of KA0118
- 2026-10-28: The human approved it (took the coordinator's recommendation).
