# KA0054 - Patterns not yet in the catalogue

```json
{
  "id": "KA0054",
  "title": "Patterns not yet in the catalogue",
  "date": "2026-10-10"
}
```

## Description

these one-off patterns are outside KA0037's list, so `/ui` does not show them; each still has its styles only in its section.

## Goal

Every pattern the site renders can be seen and judged on `/ui`: the contact link and the step marker become components in `src/components/mb/` and get catalogue entries, so a design change on `/ui` reaches them too.

- Kind: improvement

Evidence:
- `src/components/sections/contact.astro` (`.v2-contact-link`), `src/components/layout/mobile-sheet.astro` (`.sheet-link`, `.sheet-close`), `src/components/layout/nav.astro` (`.brand`, `.mark`, `.menu-btn`), `src/components/sections/how-i-work.astro` (`.step-dot`), `src/components/contact/contact-form.astro` (`.form-error`, `.form-success-card`)
- Found by: 2026-10-10-ui-catalogue-47d20fec (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: move each into `src/components/ui/` and add it to `/ui` when a redesign touches it.
- `npm test` and `npm run check` pass. The structure test holds.

- The step marker is vertically centred on its card (home `sections/how-i-work.astro` and `/ui`), whatever the card's height; the rail still runs from the first to the last marker. Playwright test: marker centre equals card centre within 1px, on desktop and 390px.

## Scope

In:
- move each into `src/components/ui/` and add it to `/ui` when a redesign touches it.

## Decisions

- 2026-10-10: Source: F4 of KA0037
- 2026-10-14: Read-only check (job 2026-10-14-ka-stale-tickets-check-954199ec): brand, header CTA, mobile sheet, form error (Alert) and success card are in the catalogue now. Still missing only the contact link (`.mb-contact-link`, `src/components/mb/sections/contact.astro:27-35,72-101`) and the step marker (`.mb-step-marker`, `src/components/mb/sections/how-i-work.astro:26-28,68-119`). Fix now: move those two into `src/components/mb/` (e.g. `contact-link.astro`, `step-marker.astro`) and add both to `src/pages/_ui/catalogue.astro`; `src/components/ui/` no longer exists.
- 2026-10-14: The human approved the ticket.
- 2026-10-14: The human: the step marker is not centred on its card; centre it (home and /ui).
- 2026-10-14: The human accepted the centred step marker (screenshots).
