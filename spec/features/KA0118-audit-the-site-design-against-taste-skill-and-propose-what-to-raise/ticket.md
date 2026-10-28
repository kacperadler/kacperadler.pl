# KA0118 - Audit the site design against Taste Skill and propose what to raise

```json
{
  "id": "KA0118",
  "title": "Audit the site design against Taste Skill and propose what to raise",
  "date": "2026-10-28"
}
```

## Description

Read Taste Skill (https://www.tasteskill.dev/, repo github.com/Leonxlnx/taste-skill): the default `taste-skill` SKILL.md and the audit-first `redesign-skill` SKILL.md, read from GitHub, not installed into the repo. Judge kacperadler.pl (home, 404, legal) against them at 1440px and 390px: typography, spacing, colour, layout, hierarchy, copy presentation, motion. The result is a list of proposals for the human, not code changes.

## Goal

See what would make the site look less templated and more convincing to a business owner, while keeping what the human approved: the blueprint-live look (KA0098), its first-screen entrance, the section order and copy (KA0075).

- Kind: improvement

## Done means

- `findings.md` here lists each proposal as a finding: the Taste Skill rule, where it applies (section, file:line), what a visitor would see change, its cost, and whether it touches an approved decision (then say which); ordered by visible benefit. Rules that do not fit (dark/light dual mode on a dark-only site, a design system library, anything good-css KA0104 already ticketed as KA0105-KA0117) are listed as dropped with the reason.
- For the top three proposals, before/after screenshots at 1440px and 390px from a throwaway change, reverted; each one viewport high.
- Nothing on the site changes: `git diff main -- src` is empty at the end.

## Scope

In:
- `findings.md` and screenshots in this folder.

Out:
- Adopting any proposal: each becomes its own ticket from its finding, approved by the human.

## Decisions

- 2026-10-28: The human asked to use tasteskill.dev to see how to raise the site further; a report-only audit like KA0104, budget about $10.
- 2026-10-28: The human took the coordinator's recommendation: adopt F1, F3, F5, F9, F10, F11; F2 once he sends publishable screenshots; drop F4, F6, F7, F8.
