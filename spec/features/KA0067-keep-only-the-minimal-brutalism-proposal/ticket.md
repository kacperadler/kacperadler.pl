# KA0067 - Keep only the minimal brutalism proposal

```json
{
  "id": "KA0067",
  "title": "Keep only the minimal brutalism proposal",
  "date": "2026-10-10"
}
```

## Description

Seven proposals live in `src/styles/proposals/` (KA0039-KA0044, KA0065). The human picked `minimal-brutalism`; the rest go.

## Goal

Only the chosen direction and the current design are left to compare, so the next steps build on one style.

- Kind: improvement

## Done means

- `src/styles/proposals/` holds only `baseline` and `minimal-brutalism`; the other five folders (minimal, brutalist, modernist, computer, professional, minimal-brutalism-computer) are deleted with their fonts and licenses.
- `/ui/proposal` lists the two; the switcher, list and axe e2e pass with them; nothing else in `src/` or `tests/` references a deleted proposal.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- `src/styles/proposals/`, tests or docs that name a deleted proposal.

Out:
- `minimal-brutalism` itself, the frame, the live site.

## Decisions

- 2026-10-10: The human: "minimal-brutalism I like a lot; delete the rest and make a branch where we build its components in the UI tab, to rework our landing at the end". The coordinator: the work goes in steps KA0067, KA0068, KA0069 on main; until KA0069 everything new is dev-only (/ui), so production does not change before the landing switch, which is what a separate branch would give; merge after PASS.
