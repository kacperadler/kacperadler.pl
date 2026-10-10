# KA0007 - Em-dash left in the KA0001 review record

```json
{
  "id": "KA0007",
  "title": "Em-dash left in the KA0001 review record",
  "date": "2026-10-10"
}
```

## Description

`spec/features/KA0001-.../review-1.md`, a reviewer's report the harness filed verbatim: the file still contains U+2014 em-dashes. The KA0006 Done-means grep covers only `src` and `DESIGN.md`, so this file was left as is. Reproduce: `grep -rn $'\u2014' spec`.

## Goal

The no-em-dash rule covers the site's copy and docs. Review records in `spec/features/*/review-N.md` are reviewers' reports filed verbatim (KA0006's review-1.md has one too); rewriting them changes a record, and new reviews will keep adding them. The coordinator recommends dropping this ticket and keeping records verbatim.

- Kind: cleanup

Evidence:
- `spec/features/KA0001-onboarding-vision-and-criteria-for-kacperadler-pl/review-1.md`
- Found by: 2026-10-10-em-dashes-out-3868f505 (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: decide whether a historical review record should be rewritten or kept verbatim; if rewritten, replace with ` - ` in a separate commit. Out of KA0006 scope.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- decide whether a historical review record should be rewritten or kept verbatim; if rewritten, replace with ` - ` in a separate commit. Out of KA0006 scope.

## Decisions

- 2026-10-10: Source: F1 of KA0006
