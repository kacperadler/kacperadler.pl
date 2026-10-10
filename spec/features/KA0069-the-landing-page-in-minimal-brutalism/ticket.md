# KA0069 - The landing page in minimal brutalism

```json
{
  "id": "KA0069",
  "title": "The landing page in minimal brutalism",
  "date": "2026-10-10",
  "after": [
    "KA0068"
  ]
}
```

## Description

After KA0068 the minimal brutalism components exist in `src/components/mb/`. This ticket moves the landing (home page, header, footer, contact form, legal and case study layouts) onto them.

## Goal

The live site looks like the minimal brutalism direction the human picked, with nothing of the old style left behind.

- Kind: improvement

## Done means

- The home page and every production page use the `mb` components; the old `src/components/ui/` components, styles and tokens nobody uses any more are deleted; the proposal frame and `/ui/proposal` stay (dev only) with `baseline` now being the new design; the `minimal-brutalism` proposal folder is removed; `/ui` shows the new components.
- Content, Umami events, form states, SEO tags, sitemap and `llms*.txt` stay as they are; axe zero on home, legal and case study pages at 1440px and 360px.
- Before and after screenshots of the home page (desktop and 360px) in the final message, for the reviewer.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass; no push (the human decides the deploy).

## Scope

In:
- `src/components/`, `src/layouts/`, `src/pages/`, `src/styles/`, tests, `DESIGN.md`, `AGENTS.md`.

Out:
- New content, copy changes, KA0029-KA0035.

## Decisions

- 2026-10-10: The human: "minimal-brutalism I like a lot; delete the rest and make a branch where we build its components in the UI tab, to rework our landing at the end". The coordinator: the work goes in steps KA0067, KA0068, KA0069 on main; until KA0069 everything new is dev-only (/ui), so production does not change before the landing switch, which is what a separate branch would give; merge after PASS.
- 2026-10-10: The coordinator: the proposal frame stays for KA0072 (signature proposals on top of the new design).
