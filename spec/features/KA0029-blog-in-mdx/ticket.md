# KA0029 - Blog in MDX

```json
{
  "id": "KA0029",
  "title": "Blog in MDX",
  "date": "2026-10-10",
  "after": [
    "KA0028"
  ]
}
```

## Description

Faza 10 of `project-plan.md`: blog with MDX, list, post pages, RSS. `src/content/blog/` exists and is empty.

## Goal

Articles that show how Kacper works (including AI agents and Claude Code / Codex) bring visitors who may send the form.

- Kind: improvement

## Done means

- `blog` collection in `.mdx` with a schema (title, description, pubDate, tags); `/blog` list sorted by date, `/blog/<slug>` post page with meta and prev/next, `rss.xml`; all static; sitemap and `llms*.txt` include posts; axe zero; e2e covers list and a post.
- Ships with the first post: a draft on how Kacper saves time with Claude Code / Codex automation, title and text approved by the human before the commit that ships it.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass (and the Biome format check that replaces `prettier --check`, once KA0024 is in).

## Scope

In:
- `src/content/blog/`, `src/content.config.ts`, `src/pages/blog/`, `src/pages/rss.xml.ts`, a layout for posts, nav link, tests.

Out:
- Search, per-post OG images, comments.

## Decisions

- 2026-10-10: The human: focus on developing KA first; remove `.claude`, `.vscode`, `.zed`; with Biome, Prettier is not needed; look over the repo for what to clean and what to keep; drop `project-plan.md`, turn what is left into tickets, and improve `README.md`.
- 2026-10-10: After KA0028 (both add MDX).
- 2026-10-10: The human: first post about Claude Code or Codex, roughly "how I save time with automation"; the title still to be polished.
