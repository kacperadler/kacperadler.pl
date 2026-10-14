# KA0084 - The card bar slides in and out in the direction the cursor moves

```json
{
  "id": "KA0084",
  "title": "The card bar slides in and out in the direction the cursor moves",
  "date": "2026-10-14",
  "after": [
    "KA0083"
  ]
}
```

## Description

On 2026-10-14 the human, looking at KA0083's card hover (the top bar slides in from the left and out to the right), asked for it to follow the cursor in a grid of cards: moving left to right it works as now; moving right to left the bar should slide in from the right and out to the left.

## Goal

In a grid of cards the bar follows the hand: it enters from the side the cursor came in and leaves toward the side the cursor went out, so a sweep across the grid reads as one movement in either direction.

- Kind: improvement

## Done means

- `card.astro`: on pointer enter the bar slides in from the side edge (left or right) nearer the entry point; on pointer leave it slides out toward the side edge nearer the exit point. Entry or exit through the top or bottom picks the nearer side by horizontal position.
- Keyboard focus, touch, and no JavaScript: today's left-to-right behaviour.
- Reduced motion: no slide, as KA0083 has it.
- Speed, easing and the slight delay stay as KA0083 set them: the human likes the lag as the bar follows the cursor across the grid (recording `hover-left-to-right.mp4` in this folder, left to right, 2026-10-14). In it, on a 4-card row, the bar leaving one card is still sliding out to the right while the next card's bar slides in, so the two read as one sweep; right to left must look the same, mirrored.
- A catalogue entry in `/ui` with a 3-card grid.
- Secondary button (`button.astro`): hover adds no border (light frame); the face looks as at idle, only lifted, as KA0083 has it. Today it does (`secondary-hover-border.jpg` in this folder: idle vs hover). Playwright test: border colour/width the same at idle and hover.
- Playwright tests: entering from the right starts the bar on the right; leaving to the left ends it on the left; left-to-right unchanged; focus keeps left-to-right.
- `bun run check` and `bun run test` pass.

## Scope

In:
- `src/components/mb/card.astro`, the secondary variant's hover in `src/components/mb/button.astro`, the `/ui` catalogue, tests.

Out:
- Anything else in KA0083.

## Decisions

- 2026-10-14: The human asked for the bar to follow the cursor direction in a card grid (Telegram).
- 2026-10-14: Waits for KA0083 (same file).
- 2026-10-14: The human likes the slight delay of the bar moving left to right; keep it in both directions (`hover-left-to-right.mp4`).
- 2026-10-14: The human approved the ticket.
- 2026-10-14: The human added: the Secondary button must not get a border on hover (`secondary-hover-border.jpg`).
