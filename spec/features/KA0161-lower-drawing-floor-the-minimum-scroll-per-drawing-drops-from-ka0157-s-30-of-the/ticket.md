# KA0161 - **lower drawing floor.** The minimum scroll per drawing drops from KA0157's 30% of the viewport to 18% at 1440 px and 28% at 390 px

```json
{
  "id": "KA0161",
  "title": "**lower drawing floor.** The minimum scroll per drawing drops from KA0157's 30% of the viewport to 18% at 1440 px and 28% at 390 px",
  "date": "2026-11-06"
}
```

## Description

F3 of KA0158 (spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/findings.md).

- Kind: fix
- Found by: 2026-11-06-review-92cd94cd (review), 2026-11-06
- Where: `tests/e2e/home.spec.ts:943-944`
- What: With strict order and every part whole on screen, a drawing gets about 21–23% at 1440 px. The worker recorded this as F2; the owner should judge it on the preview.

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

- 2026-11-06: Source: F3 of KA0158
