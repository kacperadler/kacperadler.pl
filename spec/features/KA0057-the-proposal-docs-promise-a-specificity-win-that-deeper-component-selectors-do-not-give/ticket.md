# KA0057 - The proposal docs promise a specificity win that deeper component selectors do not give

```json
{
  "id": "KA0057",
  "title": "The proposal docs promise a specificity win that deeper component selectors do not give",
  "date": "2026-10-10"
}
```

## Description

the comment says `[data-proposal="<id>"] .class` matches the scoped component selector. Astro adds the scope attribute to every compound, so a rule like `.services-grid .service-panel:last-child:nth-child(odd)` is served as `.services-grid[data-astro-cid-sha2jjvw] .service-panel[data-astro-cid-sha2jjvw]:last-child:nth-child(odd)` (seen in the dev server's HTML) and outranks a `[data-proposal] .services-grid .service-panel...` override. The minimal proposal works around it with a `:root[data-proposal="minimal"]` prefix (ties two scoped compounds) and `input[type="radio"]` for the three-compound radio rule.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: improvement

Evidence:
- `src/styles/proposals/baseline/proposal.css:20` and the "Propozycje designu" paragraph in `AGENTS.md`
- Found by: 2026-10-10-proposal-minimal-a56f3f1a (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: document the `:root[data-proposal="<id>"]` prefix (and the per-compound attribute) in the baseline comment and `AGENTS.md`, so the next proposal does not rediscover it.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- document the `:root[data-proposal="<id>"]` prefix (and the per-compound attribute) in the baseline comment and `AGENTS.md`, so the next proposal does not rediscover it.

## Decisions

- 2026-10-10: Source: F2 of KA0039
