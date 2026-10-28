# KA0100 - The `sm` card has the default card's padding

```json
{
  "id": "KA0100",
  "title": "The `sm` card has the default card's padding",
  "date": "2026-10-28"
}
```

## Description

the card's comment says `size` "sm" halves the padding, and DESIGN.md says "32px padding (16px on `sm`)", but no rule sets `--mb-card-pad` for `.mb-card-sm`: commit fc0f732 (KA0071) removed the `.mb-card-sm { --mb-card-pad: var(--v2-space-md); gap: 12px; }` block with the box-shadow hover. So every `sm` cell (contact links, the about link cells, the experience list, the trust bar) has 32px padding on the desktop, and below 880px it keeps 32px while the `default` card drops to 16px. KA0075 set the trust bar's mobile padding locally (`trust.astro`) and left the shared rule alone, because restoring it changes every `sm` cell on the site.

## Goal

Small cells (contact links, the about link cells, the trust bar) get the half padding the design system promises again, so they look lighter than the large cards on the desktop and on a phone; or, if 32px is now the chosen look, the comment and DESIGN.md say so. Keeps the design system honest to what the site shows.

- Kind: bug

Evidence:
- `src/components/mb/card.astro:151`
- Found by: 2026-10-14-ka0075-preview-fixes-opu-7d8611e5 (worker), 2026-10-14

## Done means

- The fix, with a test that proves it: restore `.mb-card-sm { --mb-card-pad: var(--v2-space-md); }` in `card.astro`, check the catalogue (/ui) and the home page's `sm` cells at 1440px and 390px, then drop the trust bar's local padding override. Or, if 32px is now the intended look, change the comment and DESIGN.md to say so.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- restore `.mb-card-sm { --mb-card-pad: var(--v2-space-md); }` in `card.astro`, check the catalogue (/ui) and the home page's `sm` cells at 1440px and 390px, then drop the trust bar's local padding override. Or, if 32px is now the intended look, change the comment and DESIGN.md to say so.

## Decisions

- 2026-10-28: Source: F1 of KA0075
