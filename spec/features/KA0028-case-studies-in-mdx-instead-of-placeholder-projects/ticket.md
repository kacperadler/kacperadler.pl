# KA0028 - Case studies in MDX instead of placeholder projects

```json
{
  "id": "KA0028",
  "title": "Case studies in MDX instead of placeholder projects",
  "date": "2026-10-10"
}
```

## Description

`src/content/projects/{alpha,beta,gamma,delta}.json` are placeholders nothing renders. The vision wants real case studies, written in Markdown or MDX through content collections.

## Goal

Visitors see real work with its context and outcome, which supports the form being sent.

- Kind: improvement

## Done means

- `@astrojs/mdx`; the `projects` collection takes `.mdx` with a schema (title, client, year, stack, summary, cover); the JSON placeholders are deleted.
- A section on the home page and a page per case study (`/realizacje/<slug>`), static; SEO meta, sitemap, `llms*.txt` include them; axe zero on both; e2e covers the list and one page.
- Content: the case studies the human provides; the ticket ships with the ones he approved.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass (and the Biome format check that replaces `prettier --check`, once KA0024 is in).

## Scope

In:
- `src/content/projects/`, `src/content.config.ts`, `src/pages/realizacje/`, a home section, `astro.config.mjs` (mdx), `src/pages/llms*.txt.ts`, tests.

Out:
- The blog (KA0029).

## Decisions

- 2026-10-10: The human: focus on developing KA first; remove `.claude`, `.vscode`, `.zed`; with Biome, Prettier is not needed; look over the repo for what to clean and what to keep; drop `project-plan.md`, turn what is left into tickets, and improve `README.md`.
- 2026-10-10: Needs from the human before it starts: which projects, with what he can say about each.
