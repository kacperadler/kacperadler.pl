# KA0035 - Case study: ReX Recruitment Exchange

```json
{
  "id": "KA0035",
  "title": "Case study: ReX Recruitment Exchange",
  "date": "2026-10-10",
  "after": [
    "KA0028"
  ]
}
```

## Description

"Z kim pracowałem" has ReX Recruitment Exchange (`src/content/experience/rex.json`), with one paragraph about the work. KA0028 builds the case study frame.

## Goal

A visitor who wants to know what working with Kacper looks like reads what he did at ReX Recruitment Exchange: the problem, his part, the stack, the outcome.

- Kind: improvement

## Done means

- `src/content/case-studies/rex.mdx` drafted from `src/content/experience/rex.json` and what the human adds: context, Kacper's role, what he built, stack, outcome; nothing claimed that the human has not given (no client names, numbers or results beyond his words); Polish, first person, the voice of the existing copy; no em-dash.
- The draft goes to the human as text before the commit that ships it; the page renders at `/realizacje/<slug>`, linked from its entry, axe zero; screenshot of the page in the final message.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass (and the Biome format check that replaces `prettier --check`, once KA0024 is in).

## Scope

In:
- `src/content/case-studies/rex.mdx`, images in `src/assets/` if the human gives any.

Out:
- The frame (KA0028), other case studies.

## Decisions

- 2026-10-10: Source: the human asked for one case study ticket per entry in "Z kim pracowałem".
- 2026-10-10: After KA0028. Needs from the human: what he can say about the work at ReX Recruitment Exchange (and what not).
- 2026-10-10: The human: the redesign (KA0037-KA0044) comes first; this waits.
