# KA0083 - The /ui components get the feedback of 2026-10-14: buttons, loading, avatars, radio, choice, card, contact form

```json
{
  "id": "KA0083",
  "title": "The /ui components get the feedback of 2026-10-14: buttons, loading, avatars, radio, choice, card, contact form",
  "date": "2026-10-14"
}
```

## Description

The human went through the /ui catalogue (http://agent:4321/ui) on 2026-10-14 and gave 16 points. This ticket carries every point he asked to change; the points he called fine (badge, separator, label, checkbox, inputs) stay as they are.

## Goal

The components in `src/components/mb/` behave as the human described, in the catalogue and everywhere the site uses them.

- Kind: improvement
- Plan: tak

## Done means

- Every button (all variants, every place the site uses `button.astro` or a `.btn`): the white offset layer sits under it and stays still; on hover the face lifts slightly (as if it came closer to the cursor), so a bit more of the white shows; on press (`:active`) the face goes down onto the layer and the white is not visible. The press is clearly visible (points 1 and 3). Works with the keyboard (`:focus-visible` keeps a visible outline) and with `prefers-reduced-motion` (no movement, still a clear pressed state).
- Loading button: when loading starts, the label slides out to the left and the spinner slides in from the right; when loading ends, the spinner slides out to the right and the label slides back in from the left. The button keeps its width throughout (point 2).
- The catalogue gets a demo button that, on click, goes into loading for 3-5 s and comes back by itself (point 15).
- The arrow-right icon in a button no longer moves on hover (point 4).
- Avatar group: looks right (even overlap, ring between avatars, the "+N" counter matching the avatars); the plan proposes the look, and the human accepts it on the screenshots (point 6).
- Radio is round (point 10).
- Choice: refined; the plan proposes what changes (states, spacing, selected look), and the human accepts it on the screenshots (point 11).
- Card hover: the bar slides in from left to right on hover in, and on hover out slides out to the right (left to right again, not back); both slower than now, so it does not irritate (point 13).
- Contact form: focusing a field no longer highlights the whole form, only the field (point 14).
- While a form is sending (loading), its inputs, textarea, radios and checkboxes are disabled, so nothing can be edited, with a visible disabled style; they come back when sending ends (point 16; covers KA0052's disabled style for these fields).
- Playwright tests: button hover/active transforms, loading enter/exit order and the demo button returning by itself, round radio, card bar direction, form fields disabled while sending, no whole-form highlight on focus. Viewport-high screenshots of each changed component in the ticket folder for the human.
- `bun run check` and `bun run test` pass.

## Scope

In:
- `src/components/mb/`: `button.astro`, `spinner.astro`, `avatar-group.astro`, `avatar.astro`, `radio.astro`, the choice component, `card.astro`, `contact-form.astro`, `input.astro`, `textarea.astro`, `checkbox.astro` (disabled state only); `src/pages/_ui` catalogue entries; tests.

Out:
- Badge, separator, label, checkbox look, inputs look: the human said they are fine.
- KA0058 (arrow shrinking in a narrow container) unless the plan shows the same lines fix it.

## Decisions

- 2026-10-14: The human's 16-point feedback on the /ui catalogue, as Done means lists; points 5, 7, 8, 9, 12 are fine as they are.
