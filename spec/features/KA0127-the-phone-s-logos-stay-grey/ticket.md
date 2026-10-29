# KA0127 - The phone's logos stay grey

```json
{
  "id": "KA0127",
  "title": "The phone's logos stay grey",
  "date": "2026-10-28",
  "after": [
    "KA0126"
  ]
}
```

## Description

Taste Skill `motion.md` "Hover styles go behind `(hover: hover)`"; the logos are grey (`grayscale(100%)`, 0.6 opacity in cases) until a pointer hovers their cell, so on a phone a visitor never sees ReX, LeadBuster or Energia Direct in their colours (`screenshots/p2-cases-390-before.png`). Not in KA0110, which guards hover styles from sticky taps but leaves the resting state grey.

## Goal

On phones the client logos show in colour, as they do on hover on a desktop.

- Kind: improvement

Evidence:
- `src/components/mb/sections/cases.astro:165-180`, the trust bar's logos (`src/components/mb/sections/trust.astro`)
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: under `(hover: none)` show the logos in colour at rest. Visitor sees on a phone: the client logos as the companies use them. Cost: 2 small rules. Approved decision: the grey-until-hover logos are part of the KA0075 trust bar and cases ("grey until the cell is hovered, like every logo on the page"); the human picks.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- under `(hover: none)` show the logos in colour at rest. Visitor sees on a phone: the client logos as the companies use them. Cost: 2 small rules. Approved decision: the grey-until-hover logos are part of the KA0075 trust bar and cases ("grey until the cell is hovered, like every logo on the page"); the human picks.

## Decisions

- 2026-10-28: Source: F11 of KA0118
- 2026-10-28: The human approved it (took the coordinator's recommendation).
- 2026-10-29: The human: the logos in "O mnie" (about.astro) stay grey on phones; only the trust bar and cases logos go colour.
