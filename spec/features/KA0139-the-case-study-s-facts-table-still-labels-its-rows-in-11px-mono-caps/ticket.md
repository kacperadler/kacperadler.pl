# KA0139 - The case study's facts table still labels its rows in 11px mono caps

```json
{
  "id": "KA0139",
  "title": "The case study's facts table still labels its rows in 11px mono caps",
  "date": "2026-10-29"
}
```

## Description

KA0123 moved the content labels of the home page (services, cases, the hero's caption, trust, the form, contact links, footer titles) to a 13px Geist caption in sentence case. The case study page's facts table has the same kind of label - read with the content, not a mark of the drawing - and it was not in the ticket's list, so it stays Geist Mono 11px uppercase at 0.12em, the "tiny uppercase letter-spaced label" KA0118 F3 removes elsewhere.

## Goal

On a case study page, the facts table's row labels match the home page's content labels (Geist caption, sentence case) instead of 11px spaced mono caps, so the two pages read as one design.

- Kind: improvement

Evidence:
- `src/pages/realizacje/[slug].astro:97-103` (`.mb-case-fact dt`: the role, period and stack rows of every case study page)
- Found by: 2026-10-29-ka0123-labels-15157b52 (worker), 2026-10-29

## Done means

- The fix, with a test that proves it: the same rule as the home page's step facts (`.mb-service-fact dt`): drop the mono, the uppercase and the tracking, 13px at 500 in `--muted`; add `.mb-case-fact dt` to the content labels check in `tests/e2e/design.spec.ts` (on a case study page). The page's section label stays mono.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- the same rule as the home page's step facts (`.mb-service-fact dt`): drop the mono, the uppercase and the tracking, 13px at 500 in `--muted`; add `.mb-case-fact dt` to the content labels check in `tests/e2e/design.spec.ts` (on a case study page). The page's section label stays mono.

## Decisions

- 2026-10-29: Source: F1 of KA0123
