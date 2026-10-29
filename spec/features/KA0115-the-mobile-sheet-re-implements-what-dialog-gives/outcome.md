# KA0115 - Outcome

- Merged: 2026-10-29, `ff69c00`
- Branch: h/2026-10-28-ka0115-dialog-sheet-875a78e9
- Reviews: review-1.md PASS
- Cost: worker $6.41, reviews $0.73; review rounds 1

## What went in

- mobile-sheet.astro renders the phone menu as a native `<dialog>` opened with showModal(): the browser gives the modal role, Escape, focus and the inert page; the fade uses @starting-style, the scroll lock is one `:has(:modal)` rule. Nothing looks different.
- mobile-sheet.ts shrank from 149 to 95 lines: it keeps the tab trap and returns focus to the menu button on close.
- mobile-sheet.spec.ts pins the box, backdrop, exit fade and the Safari-only rules (simulated in Chromium).

## Checks on main

- `npm run check`: passed.
- `npm test`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0134 (F1).
