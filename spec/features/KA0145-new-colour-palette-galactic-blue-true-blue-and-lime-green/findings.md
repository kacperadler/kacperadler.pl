# KA0145 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the merge adds the passed review's notes of kind security, bug or risk. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of four statuses: `fixed in <commit>` (the branch fixed it), `ticket <id>` (a planning ticket carries it), `deferred (client summary)` (it goes to the client in a summary, not on the board), or `dropped (<reason>)`. `open` lives only until the merge, which settles every `Status: open` entry as the project's findings mode says: a planning ticket each (the default), one planning ticket for all of them, or `deferred (client summary)`.

## F1. The accent's properties are still named `--blue` / `--blue-2`

- Kind: refactor
- Found by: 2026-11-05-worker-9c8d687a (worker), 2026-11-05
- Where: `src/styles/tokens.css:39`
- What: after KA0145 `--blue` holds Lime Green and `--blue-2` its lighter step; about 30 components read them by those names (`git grep -c 'var(--blue' -- src`). `tokens.css` and `DESIGN.md` say the name is left over, but a reader of a component sees `var(--blue)` paint green. The ticket's Scope keeps components out unless they set a colour outside the tokens, so the branch kept the names.
- Suggestion: rename `--blue` → `--accent` and `--blue-2` → `--accent-2` in every `src` file in one cutover (no alias), and the `lime` / `lime-2` rows of the `DESIGN.md` table with them. No visual change; the e2e suite pins computed colours, not property names.
- Budget: 1
- Status: ticket KA0148

## F2. DESIGN.md forbids chromatic shadows while the field and form shadows are chromatic

- Kind: docs
- Found by: 2026-11-05-worker-9c8d687a (worker), 2026-11-05
- Where: `DESIGN.md:243`
- What: the Don'ts say "Don't add soft or chromatic drop shadows", but the focused field's hard shadow and the sent contact form's shadow have been the accent colour since before KA0145 (now `true-blue`, `input.astro`, `textarea.astro`, `contact-form.astro`).
- Suggestion: reword the line to forbid soft shadows and any chromatic shadow other than the `true-blue` state shadow, or make those shadows `ink`; the owner picks which.
- Status: ticket KA0149
