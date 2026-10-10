# KA0053 - The site's .prose and the ported .prose are two typography sources

```json
{
  "id": "KA0053",
  "title": "The site's .prose and the ported .prose are two typography sources",
  "date": "2026-10-10"
}
```

## Description

the catalogue's typography uses the ported `src/styles/prose.css`; the legal pages and case studies use the hand-written `.prose` in `global.css` (other sizes, Geist Mono headings, blue links). Both match `.prose`, so `prose.css` resets what the site's version adds (heading font and tracking, inline code box, centering) and must load after `global.css`; `ui-catalogue.spec.ts` checks it wins on `/ui`. Moving the site over changes how those pages look, which KA0037 rules out.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: cleanup

Evidence:
- `src/styles/global.css` (`.prose`, legal pages and case studies), `src/styles/prose.css`
- Found by: 2026-10-10-ui-catalogue-47d20fec (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: once a proposal settles the typography, load one `.prose` everywhere and delete the other, with the resets in `prose.css`.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- once a proposal settles the typography, load one `.prose` everywhere and delete the other, with the resets in `prose.css`.

## Decisions

- 2026-10-10: Source: F3 of KA0037
