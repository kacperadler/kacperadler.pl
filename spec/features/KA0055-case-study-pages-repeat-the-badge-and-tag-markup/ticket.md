# KA0055 - Case study pages repeat the badge and tag markup

```json
{
  "id": "KA0055",
  "title": "Case study pages repeat the badge and tag markup",
  "date": "2026-10-10"
}
```

## Description

KA0028 landed on main while KA0037 was open. Its period pill copies the outline `<Badge>` styles, its stack chips repeat the tag pattern, and `.case-link` is a fourth link look; none of them use the `ui/` components, so a redesign on `/ui` would miss them.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: cleanup

Evidence:
- `src/pages/realizacje/[...index].astro` (`.case-period`), `src/pages/realizacje/[slug].astro` (`.case-stack li`), `src/styles/global.css` (`.case-link`)
- Found by: 2026-10-10-ui-catalogue-47d20fec (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: use `<Badge>` and `<Tag>` there (screenshots before and after), and add the case link as a `link.astro` variant shown on `/ui`.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- use `<Badge>` and `<Tag>` there (screenshots before and after), and add the case link as a `link.astro` variant shown on `/ui`.

## Decisions

- 2026-10-10: Source: F5 of KA0037
