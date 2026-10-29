# KA0111 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. The inline "formularzu" link in the FAQ lede is 21px tall

- Kind: improvement
- Found by: 2026-10-29-ka0111-tap-targets-b799f968 (worker), 2026-10-29
- Where: `src/components/mb/sections/faq.astro:25` (`Link variant="inline"`, styles in `src/components/mb/link.astro`)
- What: the ticket's Description measures the inline "formularzu" link at 21px at 390px, but its Goal and Scope name only the header buttons and the footer links, so this branch leaves it. A link inside running text is exempt from WCAG 2.5.8 (the inline exception), and a vertical hit area on it would cover the lines of text above and below.
- Suggestion: decide whether inline links get a hit area at all; if so, only a horizontal one (`inset-inline`), never into the neighbouring lines. Other inline links (`prose.astro` in the legal pages and case studies) would follow the same rule.
- Status: ticket KA0135

## F2. The Decision names a --mb-footer-gap variable the code does not have

- Kind: note
- Found by: 2026-10-29-review-ka0111-tap-target-4867e93e (review), 2026-10-29
- Where: ticket.md Decisions; `src/components/mb/footer.astro` (`gap: 22px`)
- What: the option B Decision says to raise `--mb-footer-gap`; the worker wrote a literal, matching the file's other gaps.
- Status: dropped, settled by the 2026-10-29 Decisions line that accepts the literal.
