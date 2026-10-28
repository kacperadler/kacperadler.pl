# KA0128 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

## F1. After sending, the "Wiadomość wysłana." heading can land above the viewport

- Kind: improvement
- Found by: 2026-10-28-ka0128-compact-success-c-a217f217 (worker), 2026-10-28
- Where: `src/components/mb/contact-form.astro` (`.mb-form-success`), `src/scripts/contact-form.ts` (`setState`)
- What: the success card is centred in the sheet, whose top stays put. When the visitor sent with the submit button high in the viewport (scrolled past the form's top), the card's upper half sits above the viewport: at 1280x720, a 30-line message, the submit button scrolled to the viewport's middle (its top at 361px), the card's h3 ends up at -63px (throwaway Playwright probe on this branch's build). KA0128 shortens the sheet by up to 9 lines (223px at 1440 and 390 wide), so the card's centre sits up to half of that (about 111px) higher than before. Also, the focused submit button turns invisible on success and focus drops to `<body>` (the same probe read `document.activeElement` as `BODY`).
- Suggestion: on success, move focus to the success card (`tabindex="-1"` on `[data-form-success]`, `focus({ preventScroll: true })`) and scroll it into view only when its heading is out of view (`scrollIntoView({ block: "nearest" })`); when the heading is in view the page stays still, as KA0128 leaves it.
- Status: open
