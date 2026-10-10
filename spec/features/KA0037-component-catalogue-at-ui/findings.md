# KA0037 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

## F1. Form error text fails WCAG AA contrast

- Kind: bug
- Found by: 2026-10-10-ui-catalogue-47d20fec (worker), 2026-10-10
- Where: `src/components/ui/field.astro` (`.err`, `color: #c44545`)
- What: axe on `/ui` reports color-contrast 3.66:1 (needs 4.5:1) for the error line under a field: `#c44545`, 12px, on `--v2-panel` `#14171c`. The live contact form shows the same line after submitting empty fields; the home a11y spec never reaches that state, so it passes. `tests/e2e/ui-catalogue.spec.ts` excludes `.field .err` from axe until this is decided.
- Suggestion: a lighter error red (one new token, documented in `DESIGN.md`, also used for the invalid border and the `.form-error` banner), then drop the exclude in the spec and add the invalid state to the home a11y spec.
- Status: open

## F2. Inputs, textarea and radio have no disabled style

- Kind: improvement
- Found by: 2026-10-10-ui-catalogue-47d20fec (worker), 2026-10-10
- Where: `src/components/ui/input.astro`, `textarea.astro`, `radio.astro`
- What: the "disabled" samples on `/ui` look the same as "empty"; only the cursor differs. Button dims to 60% opacity when disabled, the fields do not. The site never disables a field today.
- Suggestion: decide the disabled look with the redesign (KA0038) and add it to the three components.
- Status: open

## F3. Legal pages keep their own .prose

- Kind: cleanup
- Found by: 2026-10-10-ui-catalogue-47d20fec (worker), 2026-10-10
- Where: `src/layouts/legal-layout.astro` (scoped `.prose`), `src/styles/prose.css`
- What: the catalogue's typography uses the ported `src/styles/prose.css`; the legal pages still use the hand-written `.prose` in their layout (other sizes, Geist Mono headings, blue links). Two typography sources; moving the legal pages over changes how they look, which KA0037 rules out.
- Suggestion: once a proposal settles the typography, load `prose.css` on the legal layout and delete its scoped copy.
- Status: open

## F4. Patterns not yet in the catalogue

- Kind: improvement
- Found by: 2026-10-10-ui-catalogue-47d20fec (worker), 2026-10-10
- Where: `src/components/sections/contact.astro` (`.v2-contact-link`), `src/components/layout/mobile-sheet.astro` (`.sheet-link`, `.sheet-close`), `src/components/layout/nav.astro` (`.brand`, `.mark`, `.menu-btn`), `src/components/sections/how-i-work.astro` (`.step-dot`), `src/components/contact/contact-form.astro` (`.form-error`, `.form-success-card`)
- What: these one-off patterns are outside KA0037's list, so `/ui` does not show them; each still has its styles only in its section.
- Suggestion: move each into `src/components/ui/` and add it to `/ui` when a redesign touches it.
- Status: open
