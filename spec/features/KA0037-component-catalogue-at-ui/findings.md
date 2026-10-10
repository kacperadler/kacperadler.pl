# KA0037 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

## F1. Form error text fails WCAG AA contrast

- Kind: bug
- Found by: 2026-10-10-ui-catalogue-47d20fec (worker), 2026-10-10
- Where: `src/components/ui/field.astro` (`.err`, `color: #c44545`)
- What: axe on `/ui` reports color-contrast 3.66:1 (needs 4.5:1) for the error line under a field: `#c44545`, 12px, on `--v2-panel` `#14171c`. The live contact form shows the same line after submitting empty fields; the home a11y spec never reaches that state, so it passes. `tests/e2e/ui-catalogue.spec.ts` excludes `.field .err` from axe until this is decided.
- Suggestion: a lighter error red (one new token, documented in `DESIGN.md`, also used for the invalid border and the `.form-error` banner), then drop the exclude in the spec and add the invalid state to the home a11y spec.
- Status: fixed in c4d3186 (new `--error` token `#e07a70`: 6.15:1 on `--v2-panel`, 6.7:1 on `--v2-bg`; exclude removed; home a11y spec covers both form error states)

## F2. Inputs, textarea and radio have no disabled style

- Kind: improvement
- Found by: 2026-10-10-ui-catalogue-47d20fec (worker), 2026-10-10
- Where: `src/components/ui/input.astro`, `textarea.astro`, `radio.astro`
- What: the "disabled" samples on `/ui` look the same as "empty"; only the cursor differs. Button dims to 60% opacity when disabled, the fields do not. The site never disables a field today.
- Suggestion: decide the disabled look with the redesign (KA0038) and add it to the three components.
- Status: ticket KA0052

## F3. The site's .prose and the ported .prose are two typography sources

- Kind: cleanup
- Found by: 2026-10-10-ui-catalogue-47d20fec (worker), 2026-10-10
- Where: `src/styles/global.css` (`.prose`, legal pages and case studies), `src/styles/prose.css`
- What: the catalogue's typography uses the ported `src/styles/prose.css`; the legal pages and case studies use the hand-written `.prose` in `global.css` (other sizes, Geist Mono headings, blue links). Both match `.prose`, so `prose.css` resets what the site's version adds (heading font and tracking, inline code box, centering) and must load after `global.css`; `ui-catalogue.spec.ts` checks it wins on `/ui`. Moving the site over changes how those pages look, which KA0037 rules out.
- Suggestion: once a proposal settles the typography, load one `.prose` everywhere and delete the other, with the resets in `prose.css`.
- Status: ticket KA0053

## F4. Patterns not yet in the catalogue

- Kind: improvement
- Found by: 2026-10-10-ui-catalogue-47d20fec (worker), 2026-10-10
- Where: `src/components/sections/contact.astro` (`.v2-contact-link`), `src/components/layout/mobile-sheet.astro` (`.sheet-link`, `.sheet-close`), `src/components/layout/nav.astro` (`.brand`, `.mark`, `.menu-btn`), `src/components/sections/how-i-work.astro` (`.step-dot`), `src/components/contact/contact-form.astro` (`.form-error`, `.form-success-card`)
- What: these one-off patterns are outside KA0037's list, so `/ui` does not show them; each still has its styles only in its section.
- Suggestion: move each into `src/components/ui/` and add it to `/ui` when a redesign touches it.
- Status: ticket KA0054

## F5. Case study pages repeat the badge and tag markup

- Kind: cleanup
- Found by: 2026-10-10-ui-catalogue-47d20fec (worker), 2026-10-10
- Where: `src/pages/realizacje/[...index].astro` (`.case-period`), `src/pages/realizacje/[slug].astro` (`.case-stack li`), `src/styles/global.css` (`.case-link`)
- What: KA0028 landed on main while KA0037 was open. Its period pill copies the outline `<Badge>` styles, its stack chips repeat the tag pattern, and `.case-link` is a fourth link look; none of them use the `ui/` components, so a redesign on `/ui` would miss them.
- Suggestion: use `<Badge>` and `<Tag>` there (screenshots before and after), and add the case link as a `link.astro` variant shown on `/ui`.
- Status: ticket KA0055
