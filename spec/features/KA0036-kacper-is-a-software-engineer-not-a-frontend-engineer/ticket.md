# KA0036 - Kacper is a software engineer, not a frontend engineer

```json
{
  "id": "KA0036",
  "title": "Kacper is a software engineer, not a frontend engineer",
  "date": "2026-10-10",
  "after": [
    "KA0026"
  ]
}
```

## Description

The site presents Kacper as a "Frontend Engineer" (`siteConfig.role` in `src/data/site-config.ts`, the footer line in `src/components/layout/footer.astro`, and whatever reads `role`: hero, meta, OG, JSON-LD, `llms*.txt`). The offer now leads with AI agents and automation (KA0026).

## Goal

The title matches what he sells: "Inżynier oprogramowania" everywhere the site names his role, so a visitor looking for AI and automation work is not told he only does frontend.

- Kind: improvement

## Done means

- Every place the site names Kacper's current role says "Inżynier oprogramowania" (`siteConfig.role`, footer, hero and status card if they say it, meta/OG/JSON-LD `jobTitle`, `llms*.txt`); `git grep -n -i 'frontend engineer\|frontend developer' src` finds only the job titles in `src/content/experience/` (past roles stay as they were).
- The hero and status card copy around the title still reads well with it; screenshots of the hero desktop and mobile in the final message; no em-dash.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass (and the Biome format check that replaces `prettier --check`, once KA0024 is in).

## Scope

In:
- `src/data/site-config.ts`, `src/components/layout/footer.astro`, hero and status card components, `src/pages/llms*.txt.ts`, structured data.

Out:
- `src/content/experience/` roles; the services copy (KA0026).

## Decisions

- 2026-10-10: Source: F2 of KA0026 (the hero and status card present only a frontend engineer).
- 2026-10-10: The human: "Inżynier oprogramowania" instead of developer; approved.
- 2026-10-10: After KA0026, which also edits the hero.
