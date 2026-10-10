# KA0041 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. The button's arrow shrinks to nothing in a narrow box

- Kind: bug
- Found by: 2026-10-10-proposal-modernist-da8a6493 (worker), 2026-10-10
- Where: `src/components/ui/button.astro` (`.btn :global(.btn-icon)`)
- What: the icon is a flex item with `width: 14px` and the default `flex-shrink: 1` (plus `max-width: 100%` on every `svg` from `global.css`), so when the button is narrower than its content the arrow gives way first. On `/ui` (no proposal) the Primary · md row renders the arrow at 0×14 px in every state and Primary · sm at about 8×14 px (measured with `getBoundingClientRect()` on `#ui-button ~ .ui-row .btn .btn-icon`); the 160px catalogue cells are the narrow box. The hero has room, so the home page does not show it today; any tight layout (a narrow column, a long label) would.
- Suggestion: `flex-shrink: 0` on `.btn-icon` (the spinner already has it), and let the catalogue's button cells grow to the button (`.ui-grid` min width) so the forced states show the arrow. Out: the button's look.
- Status: open

## F2. The proposal frame documents a scope that loses to scoped descendant selectors

- Kind: risk
- Found by: 2026-10-10-proposal-modernist-da8a6493 (worker), 2026-10-10
- Where: `src/styles/proposals/baseline/proposal.css` (the how-to comment), `AGENTS.md` (`## Wygląd`, "Propozycje designu")
- What: both say that `[data-proposal="<id>"] .class` matches the scoped component selector and wins the tie by order. That holds for one class only: Astro adds its attribute to every compound, so `.radio span` is `.radio[data-astro-cid-x] span[data-astro-cid-x]` (0,3,1) and `.radio input:checked + span` is (0,5,2), while `[data-proposal="<id>"] .radio span` is (0,2,1) and loses. A proposal written by the documented pattern silently keeps the current look on radios, field errors, the card-hover badge, the services grid's last card, the step dots and more. The modernist proposal works around it with an id-weight scope (`html[data-proposal="modernist"]:not(#id-weight)`).
- Suggestion: document the per-compound attribute in the baseline comment and `AGENTS.md`, and name one way to outweigh it (the id-weight `:not()` scope, or repeating the scope attribute per compound). Out: changing how Astro scopes styles.
- Status: open

## F3. axe runs only on the baseline proposal

- Kind: improvement
- Found by: 2026-10-10-proposal-modernist-da8a6493 (worker), 2026-10-10
- Where: `tests/e2e/ui-proposals.spec.ts` ("has no detectable WCAG 2.1 AA violations")
- What: every proposal ticket (KA0041 among them) requires "axe zero on the proposal page", but the spec checks `/ui/proposal/baseline` only; a later edit to a proposal's CSS or to a shared component can break a proposal's contrast with nothing failing. KA0041 checked `/ui/proposal/modernist` with a throwaway run of the same AxeBuilder call (zero violations at 1440 and 390 px).
- Suggestion: run the axe test once per folder in `src/styles/proposals/` (the spec already lists them in `proposals`). Out: the other tests of the spec.
- Status: open
