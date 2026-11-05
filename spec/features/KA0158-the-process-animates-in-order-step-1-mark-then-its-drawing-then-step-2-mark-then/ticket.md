# KA0158 - The process animates in order: step 1 mark, then its drawing, then step 2 mark, then its drawing

```json
{
  "id": "KA0158",
  "title": "The process animates in order: step 1 mark, then its drawing, then step 2 mark, then its drawing",
  "date": "2026-11-05"
}
```

## Description

The owner, 2026-11-05, after KA0157 merged, watching how the scroll drives the process section: "there should be animation for step 1 then step 1 box then animation for step 2 then step 2 box ect".

Today each piece runs on its own view timeline (`src/components/mb/process-figure.astro`: the drawing's lime layer on `view()` of the drawing; `src/components/mb/step-marker.astro`: the rail segment and the mark on their own), so the order depends on where each element sits on the screen. The zigzag puts step N+1's card beside step N's, so a later drawing can draw before an earlier mark fills: KA0157's frame `after-d-14.png` shows step 2's chain half drawn and step 3's first module drawn while mark 01 has only begun to fill.

## Goal

As the visitor scrolls down through the process, the animation runs strictly in order, one at a time: the rail reaches mark 01 and it fills, then step 01's drawing draws in, then the rail runs on to mark 02 and it fills, then step 02's drawing draws in, and so on to step 05. Scrolling back up plays it backwards. Each part keeps KA0157's calm, eased draw.

- Kind: ux

## Done means

- One shared scroll timeline for the section (for example a named `view-timeline` on the process list, or `timeline-scope`), with each step's mark and drawing given consecutive, non-overlapping ranges on it, in order 01 mark, 01 drawing, 02 mark, 02 drawing ... 05 drawing; each drawing still draws its pieces in its own order (KA0157).
- Every part animates while it is on screen: a drawing never draws while it is above or below the viewport, at 1440 px and at 390 px (one column).
- An e2e test scrolls through `#how` in small steps at 1440 and 390 px and fails when any later part has progressed before an earlier part is complete (mark N full before drawing N starts, drawing N complete before mark N+1 starts).
- Frames of a slow scroll at 1440 and 390 px after the change, at most 40 each, in this folder, and one side-by-side image of the same scroll position before and after.
- Scroll-driven CSS only: nothing plays on its own, no JavaScript animation, no new dependency. `prefers-reduced-motion: reduce` shows everything drawn and filled with no motion, as today, and its test still holds.
- axe zero violations; Lighthouse mobile Performance 95 or more, the other three 100 (Lighthouse runs in a job with Playwright's headless shell).
- `bun run check && bun run test` pass on the last commit, with `bun run lint` and `bun run build`.
- The owner sees it on a preview before the merge.

## Scope

In:
- `src/components/mb/process-figure.astro`, `src/components/mb/step-marker.astro`, `src/components/mb/sections/how-i-work.astro`, their e2e specs, `DESIGN.md` and `AGENTS.md` motion lines, this folder.

Out:
- The layout and height of the process section (KA0152); anything else on the page.

## Decisions
- 2026-11-05: KA0158 starts: the process animates in order, mark then drawing per step; preview before merge; the owner: "But right now im looking on this how the scroll trigger the animations and steps and there should be animation for step 1 then step 1 box then animation for step 2 then step 2 box ect" (KA-D19)
