# KA0160 - On desktop a drawing draws over about a fifth of the viewport's scroll, not KA0157's 30%

```json
{
  "id": "KA0160",
  "title": "On desktop a drawing draws over about a fifth of the viewport's scroll, not KA0157's 30%",
  "date": "2026-11-06"
}
```

## Description

F2 of KA0158 (spec/features/KA0158-the-process-animates-in-order-step-1-mark-then-its-drawing-then-step-2-mark-then/findings.md).

- Kind: ux
- Found by: 2026-11-05-worker-dbbe606f (worker), 2026-11-05
- Where: `src/components/mb/sections/how-i-work.astro` (the run's slots), `tests/e2e/home.spec.ts` (the `draw` share per viewport)
- What: KA0158 plays the five marks, rails and drawings one after another, each whole on screen. The desktop zigzag (KA0152) puts all five steps in about 1100px of list. A 900 to 1000px viewport sees all of them within about 1400px of scroll, so the five drawings share that span. Each gets about 210 to 230px of scroll at 1440px (21 to 23% of the viewport) where KA0157 had at least 30%. At 390px a drawing still gets about 270px (32%). The e2e test pins 18% at 1440x1000 and 28% at 390x844.
- Suggestion: if the owner finds the desktop draw too quick on the preview, give the desktop process more scroll. That means a taller list (KA0152's layout and height, out of KA0158's scope) or letting a drawing play while partly under the header. Otherwise drop this entry.

## Goal

<!-- What we are after, what it moves in spec/vision.md, and the evidence (file:line, a command and its output). -->

- Kind: ux

## Done means

<!-- Each observable result, and the test that proves it; the project's checks pass. -->

## Scope

In:
<!-- - `path/to/file.ts`: what changes there. -->

Out:
<!-- - What this ticket does not do, and which ticket does. -->

## Decisions

- 2026-11-06: Source: F2 of KA0158
