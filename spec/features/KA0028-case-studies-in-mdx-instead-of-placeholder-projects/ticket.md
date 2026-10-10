# KA0028 - Case studies in MDX: collection, list and page

```json
{
  "id": "KA0028",
  "title": "Case studies in MDX: collection, list and page",
  "date": "2026-10-10"
}
```

## Description

`src/content/projects/{alpha,beta,gamma,delta}.json` are placeholders nothing renders. The section "Z kim pracowałem" (`src/components/sections/experience.astro`, collection `experience`: PwC Polska, Apptension, Payloo, Helpfind, Energia Direct, ReX) lists where Kacper worked. The vision wants real case studies in Markdown or MDX.

## Goal

Each entry in "Z kim pracowałem" can lead to a case study page; this ticket builds the frame, and KA0030-KA0035 write one case study each.

- Kind: improvement

## Done means

- `@astrojs/mdx`; a `caseStudies` collection of `.mdx` files with a schema (company, slug, role, period, stack, summary, and an optional `experience` id that links it to its entry in `experience`); the JSON placeholders in `src/content/projects/` and the `projects` collection are deleted.
- A static page per case study at `/realizacje/<slug>` with SEO meta, in the sitemap and `llms*.txt`; an entry in "Z kim pracowałem" whose case study exists links to it, the others look as today.
- One sample `.mdx` used only by the e2e test fixtures or a draft flag that keeps it out of the build, so the frame is tested before KA0030 ships content; axe zero on the page; e2e covers the link and the page.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass (and the Biome format check that replaces `prettier --check`, once KA0024 is in).

## Scope

In:
- `astro.config.mjs` (mdx), `src/content.config.ts`, `src/content/projects/` (removed), `src/content/case-studies/`, `src/pages/realizacje/`, `src/components/sections/experience.astro`, `src/pages/llms*.txt.ts`, tests.

Out:
- The content of any case study (KA0030-KA0035), the blog (KA0029).

## Decisions

- 2026-10-10: The human: focus on developing KA first; remove `.claude`, `.vscode`, `.zed`; with Biome, Prettier is not needed; look over the repo for what to clean and what to keep; drop `project-plan.md`, turn what is left into tickets, and improve `README.md`.
- 2026-10-10: The human: case studies come one ticket per entry in "Z kim pracowałem"; this ticket is the frame for them.
