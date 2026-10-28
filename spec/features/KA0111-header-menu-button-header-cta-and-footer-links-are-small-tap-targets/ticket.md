# KA0111 - Header menu button, header CTA and footer links are small tap targets

```json
{
  "id": "KA0111",
  "title": "Header menu button, header CTA and footer links are small tap targets",
  "date": "2026-10-28",
  "after": [
    "KA0115"
  ]
}
```

## Description

good-css "Hit area larger than the visual" (`interaction.md`). Measured at 390: the menu button is 36x36, the header "Umów rozmowę" 36px tall, the five footer links 22px tall (under WCAG 2.5.8's 24px), the inline "formularzu" link 21px. A `::after` with `inset: min(0px, (100% - 44px) / 2)` grows the tappable area to 44px without changing what is drawn.

## Goal

The header menu button, header call button and footer links are easy to hit with a finger (at least 44px).

- Kind: improvement

Evidence:
- `src/components/mb/header.astro:41-49` and `src/components/mb/button.astro:279-284` (`size="sm"`, 36px); `src/components/mb/link.astro:162` (footer links)
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: add the hit-area pseudo-element to `.mb-btn-size-sm` and `.mb-link-footer` (`button.astro` has no `::after` today). `overflow-x: clip` on the button face (`button.astro:229`) would clip the area, so it goes on the outer element. Cost: about 10 lines. Visible change: none; taps near the edge land.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- add the hit-area pseudo-element to `.mb-btn-size-sm` and `.mb-link-footer` (`button.astro` has no `::after` today). `overflow-x: clip` on the button face (`button.astro:229`) would clip the area, so it goes on the outer element. Cost: about 10 lines. Visible change: none; taps near the edge land.

## Decisions

- 2026-10-28: Source: F7 of KA0104
- 2026-10-28: The human approved it.
