# KA0043 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. The send-error banner splits its sentence into flex columns

- Kind: bug
- Found by: 2026-10-10-proposal-professional-943bf522 (worker), 2026-10-10
- Where: `src/components/contact/contact-form.astro` (`.form-error`, `.contact-form-wrap[data-state="error-submit"] .form-error { display: flex }`)
- What: the banner is a flex row whose children are the icon, a bare text node, the `<a>` with the email and the trailing `.`; the text and the link become separate flex items with the 10px gap between them. On `/` at 1440px, with `data-state="error-submit"` set on `[data-contact-wrap]`, the link sits 468px from the banner's left edge as its own column and the period stands apart after a gap ("kontakt@kacperadler.pl ."); in a narrower form (the professional proposal's two-column contact at 1440px) the sentence wraps inside its column while the email stays in another.
- Suggestion: wrap the message (text, link and period) in one `<span>` (or `<p>`) so it is a single flex item next to the icon. Out: the banner's look.
- Status: open

## F2. The header brand wraps to two lines on a 390px phone

- Kind: improvement
- Found by: 2026-10-10-proposal-professional-943bf522 (worker), 2026-10-10
- Where: `src/components/layout/nav.astro` (`.brand`, `.nav-tail`)
- What: at 390px the brand, the "Porozmawiajmy" CTA and the menu button do not fit one row, so "Kacper" and "Adler" break onto two lines; `.nav .brand` measures 46.5px tall on both `/ui/proposal/baseline` and `/ui/proposal/professional` (one line would be about 28px).
- Suggestion: keep the brand on one line (`white-space: nowrap`) and give the room elsewhere on narrow screens, for example a smaller CTA padding or the CTA only in the mobile sheet below a breakpoint. Out: the brand mark itself.
- Status: open
