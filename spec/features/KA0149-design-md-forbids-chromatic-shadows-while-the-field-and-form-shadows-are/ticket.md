# KA0149 - DESIGN.md forbids chromatic shadows while the field and form shadows are chromatic

```json
{
  "id": "KA0149",
  "title": "DESIGN.md forbids chromatic shadows while the field and form shadows are chromatic",
  "date": "2026-11-05"
}
```

## Description

F2 of KA0145 (spec/features/KA0145-new-colour-palette-galactic-blue-true-blue-and-lime-green/findings.md).

- Kind: docs
- Found by: 2026-11-05-worker-9c8d687a (worker), 2026-11-05
- Where: `DESIGN.md:243`
- What: the Don'ts say "Don't add soft or chromatic drop shadows", but the focused field's hard shadow and the sent contact form's shadow have been the accent colour since before KA0145 (now `true-blue`, `input.astro`, `textarea.astro`, `contact-form.astro`).
- Suggestion: reword the line to forbid soft shadows and any chromatic shadow other than the `true-blue` state shadow, or make those shadows `ink`; the owner picks which.

## Goal

<!-- What we are after, what it moves in spec/vision.md, and the evidence (file:line, a command and its output). -->

- Kind: docs

## Done means

<!-- Each observable result, and the test that proves it; the project's checks pass. -->

## Scope

In:
<!-- - `path/to/file.ts`: what changes there. -->

Out:
<!-- - What this ticket does not do, and which ticket does. -->

## Decisions

- 2026-11-05: Source: F2 of KA0145
