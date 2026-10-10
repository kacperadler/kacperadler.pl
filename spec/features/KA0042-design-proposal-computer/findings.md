# KA0042 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. The send-error banner puts the mail link in a column of its own

- Kind: bug
- Found by: 2026-10-10-proposal-computer-dc1c52da (worker), 2026-10-10
- Where: `src/components/contact/contact-form.astro` (`.contact-form-wrap[data-state="error-submit"] .form-error { display: flex; }`)
- What: the banner is a flex row of the icon, a text run and the `<a>` to the email, so the link is a separate flex item: on `/` at 1440 px wide, with the wrapper set to `data-state="error-submit"`, the 140 px link starts 468 px into the 662 px banner, beside the wrapped sentence instead of after "napisz mailem na". Seen with a throwaway Playwright script on the dev server; the computer proposal works around it on its own page (`display: block`, inline icon).
- Suggestion: lay the banner out as one run of text (block, the icon inline or floated), or wrap the sentence and the link in one `<span>` so the flex row has two items. The error copy stays as it is.
- Status: open
