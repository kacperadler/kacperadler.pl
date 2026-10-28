# KA0104 - Audit the site CSS against good-css.com and propose what to adopt

```json
{
  "id": "KA0104",
  "title": "Audit the site CSS against good-css.com and propose what to adopt",
  "date": "2026-10-28"
}
```

## Description

Read the good-css skill (https://good-css.com/skills/good-css/SKILL.md and only the reference files its table names) and compare the site's CSS with it: tokens, global, components, the blueprint drawing and the entrance animation. The result is a list of proposals for the human, not code changes.

## Goal

See what modern CSS technique would visibly improve kacperadler.pl (text wrapping, fluid sizes, mobile touch behaviour, motion, colour tokens) or remove code, without touching the look the human approved in KA0075 and KA0098.

- Kind: improvement

## Done means

- `findings.md` in this folder lists each proposal as a finding: the good-css entry, where on the site it applies (file:line), what a visitor would see change, and its cost; ordered by visible benefit. Entries that do not fit the site (light/dark tokens on a dark-only site, logical properties with no RTL plans) are listed as dropped with the reason.
- For the top three proposals, a before/after screenshot at 1440px and 390px from a throwaway change, reverted; no code commit.
- Nothing on the site changes in this ticket: `git diff main -- src` is empty at the end.

## Scope

In:
- `spec/features/KA0104-*/findings.md` and screenshots.

Out:
- Adopting any proposal: each becomes its own ticket from its finding, approved by the human.

## Decisions

- 2026-10-28: The human asked whether to use the good-css.com skill to see what more the designs can get; the coordinator proposed a report-only audit first.
- 2026-10-28: The human approved the report-only audit, budget about $10.
