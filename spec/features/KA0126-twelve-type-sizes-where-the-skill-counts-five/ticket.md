# KA0126 - Twelve type sizes where the skill counts five

```json
{
  "id": "KA0126",
  "title": "Twelve type sizes where the skill counts five",
  "date": "2026-10-28"
}
```

## Description

Taste Skill "Five sizes on a page is the ceiling ... nine sizes that are all near each other reads as mush" (`type.md` §2), `size-count` WARN. The four text sizes 13-16 and the three lead sizes 18-22 are a pixel or two apart.

## Goal

The page uses a small set of type sizes, so the hierarchy is clear and consistent.

- Kind: improvement

Evidence:
- `inspect.mjs` sizes at 1440: 11 / 12 / 13 / 14 / 15 / 16 / 18 / 20 / 22 / 30 / 54 / 64; `font-size: 13px` ×9, `14px` ×18, `15px` ×15, `16px` ×5 in components (`grep -rn`)
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: fold 13/14 into one small size and 15/16 into the body (F5), 18/20/22 into one lead; keep the mono marks at their size. Visitor sees: little on its own; it makes F1's contrast cleaner. Cost: about 40 declarations; DESIGN.md typography. Approved decision: touches the component sizes of the approved look (KA0075 / KA0098); KA0104 F16 dropped a full fluid scale for that reason, this is the narrower merge. Lowest benefit in this list.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- fold 13/14 into one small size and 15/16 into the body (F5), 18/20/22 into one lead; keep the mono marks at their size. Visitor sees: little on its own; it makes F1's contrast cleaner. Cost: about 40 declarations; DESIGN.md typography. Approved decision: touches the component sizes of the approved look (KA0075 / KA0098); KA0104 F16 dropped a full fluid scale for that reason, this is the narrower merge. Lowest benefit in this list.

## Decisions

- 2026-10-28: Source: F10 of KA0118
- 2026-10-28: The human approved it (took the coordinator's recommendation).
- 2026-10-29: The human saw the before/after and accepted the look ("jest ok").
