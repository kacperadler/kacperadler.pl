# KA0156 - the FAQ inline link's underline disappears in forced-colors mode

```json
{
  "id": "KA0156",
  "title": "the FAQ inline link's underline disappears in forced-colors mode",
  "date": "2026-11-05"
}
```

## Description

F3 of KA0152 (spec/features/KA0152-the-home-page-reaches-a-jury-estimate-of-8-5-scored-blind-with-its-motion/findings.md).

- Kind: fix
- Found by: 2026-11-05-review-4b102012 (review), 2026-11-05
- Where: `src/components/mb/link.astro:68`
- What: It is now `text-decoration: none` plus a `linear-gradient` background, and forced-colors mode removes gradient backgrounds. In Windows High Contrast the link "formularzu" keeps only its system link colour and loses its underline. `text-decoration` survives that mode.

## Goal

<!-- What we are after, what it moves in spec/vision.md, and the evidence (file:line, a command and its output). -->

- Kind: fix

## Done means

<!-- Each observable result, and the test that proves it; the project's checks pass. -->

## Scope

In:
<!-- - `path/to/file.ts`: what changes there. -->

Out:
<!-- - What this ticket does not do, and which ticket does. -->

## Decisions

- 2026-11-05: Source: F3 of KA0152
