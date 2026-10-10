# KA0049 - KA0029 cites the deleted project-plan.md

```json
{
  "id": "KA0049",
  "title": "KA0029 cites the deleted project-plan.md",
  "date": "2026-10-10"
}
```

## Description

the Description opens with "Faza 10 of `project-plan.md`", a file this ticket deletes. The Done means and Scope already carry the work, so nothing is lost; the reference just dangles (the file stays in git history).

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: cleanup

Evidence:
- `spec/features/KA0029-blog-in-mdx/ticket.md:16`
- Found by: 2026-10-10-drop-project-plan-new-re-c8398883 (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: the coordinator rewrites the sentence to "Blog with MDX, list, post pages, RSS." when KA0029 is next touched.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- the coordinator rewrites the sentence to "Blog with MDX, list, post pages, RSS." when KA0029 is next touched.

## Decisions

- 2026-10-10: Source: F4 of KA0025
- 2026-10-10: Done by the coordinator on main: KA0029's Description no longer cites project-plan.md.
