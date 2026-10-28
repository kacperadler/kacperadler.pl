# KA0130 - After sending, the "Wiadomość wysłana." heading can land above the viewport

```json
{
  "id": "KA0130",
  "title": "After sending, the \"Wiadomość wysłana.\" heading can land above the viewport",
  "date": "2026-10-28"
}
```

## Description

the success card is centred in the sheet, whose top stays put. When the visitor sent with the submit button high in the viewport (scrolled past the form's top), the card's upper half sits above the viewport: at 1280x720, a 30-line message, the submit button scrolled to the viewport's middle (its top at 361px), the card's h3 ends up at -63px (throwaway Playwright probe on this branch's build). KA0128 shortens the sheet by up to 9 lines (223px at 1440 and 390 wide), so the card's centre sits up to half of that (about 111px) higher than before. Also, the focused submit button turns invisible on success and focus drops to `<body>` (the same probe read `document.activeElement` as `BODY`).

## Goal

After sending, the visitor sees "Wiadomość wysłana." on screen and keyboard focus lands on the success card, wherever the page was scrolled.

- Kind: improvement

Evidence:
- `src/components/mb/contact-form.astro` (`.mb-form-success`), `src/scripts/contact-form.ts` (`setState`)
- Found by: 2026-10-28-ka0128-compact-success-c-a217f217 (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: on success, move focus to the success card (`tabindex="-1"` on `[data-form-success]`, `focus({ preventScroll: true })`) and scroll it into view only when its heading is out of view (`scrollIntoView({ block: "nearest" })`); when the heading is in view the page stays still, as KA0128 leaves it.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- on success, move focus to the success card (`tabindex="-1"` on `[data-form-success]`, `focus({ preventScroll: true })`) and scroll it into view only when its heading is out of view (`scrollIntoView({ block: "nearest" })`); when the heading is in view the page stays still, as KA0128 leaves it.

## Decisions

- 2026-10-28: Source: F1 of KA0128
