# KA0124 - Running text in the full ink and at 16px

```json
{
  "id": "KA0124",
  "title": "Running text in the full ink and at 16px",
  "date": "2026-10-28",
  "after": [
    "KA0125"
  ]
}
```

## Description

Taste Skill "Running text is in the full ink at 16px or more; grey is for secondary notes" (`SKILL.md` step 6.7) and `colour.md` §3. `inspect.mjs`: body 15px (`body-size` WARN at 1440 and 768), and 55% of the page's text is `#c8c3b8` (`--ink-2`) against 37% in `--ink` (`report.json` `textColors`). The difference from ink is small on this ground, so the visible change is modest: every lead and card sentence a step brighter and 1px larger.

## Goal

Running text is easier to read: full ink colour and 16px.

- Kind: improvement

Evidence:
- `--ink-2` on running text: `src/components/mb/section-head.astro:169-174` (section leads), `src/components/mb/sections/hero.astro:218-224` (subtitle), `src/components/mb/sections/problems.astro:74-79`, `src/components/mb/card.astro:262-281`, `src/components/mb/accordion-item.astro:139-144` (FAQ answers); 15px in 15 component files (`grep -rln 'font-size: 15px'`)
- Found by: 2026-10-28-ka0118-taste-audit-bf2d703a (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: running text (leads, card sentences, FAQ answers, the hero subtitle) in `--ink` at 16px; `--ink-2` for notes, captions and the drawing. Visitor sees: a page that reads finished and confident, less "grey on dark". Cost: about 15 declarations; DESIGN.md's typography roles updated; no test under `tests/` names `--ink-2` or its value. Approved decision: none recorded; the palette is unchanged, only which role running text uses. KA0108 (form fields at 15px) is separate.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- running text (leads, card sentences, FAQ answers, the hero subtitle) in `--ink` at 16px; `--ink-2` for notes, captions and the drawing. Visitor sees: a page that reads finished and confident, less "grey on dark". Cost: about 15 declarations; DESIGN.md's typography roles updated; no test under `tests/` names `--ink-2` or its value. Approved decision: none recorded; the palette is unchanged, only which role running text uses. KA0108 (form fields at 15px) is separate.

## Decisions

- 2026-10-28: Source: F5 of KA0118
- 2026-10-28: The human approved it (took the coordinator's recommendation).
