# KA0071 - Findings

What was discovered while doing this ticket but is not part of it: bugs, risks, gaps, and suggested changes. Workers add entries on their branch; the coordinator adds the non-blocking notes from reviews. One entry per finding, numbered, never deleted: only its Status changes.

A finding ends in one of three statuses: `fixed` (the branch fixed it; name the commit), `ticket K0000` (a planning ticket carries it), or `dropped (reason)`. `open` lives only until the merge: `h merge` turns every `Status: open` entry into a planning ticket and rewrites its status to `ticket K0000`.

`- Budget:` is optional: set it, in USD, only when the ticket this finding becomes is expected to cost more than the autopilot default, and leave the line out otherwise. `h merge` copies it into the ticket's JSON block as `budget`, which `h ticket status --autopilot` passes to `--budget`, capped at `H_AUTOPILOT_BUDGET_MAX`.

## F1. Pagination jump needs a page that reads its query

- Kind: risk
- Found by: 2026-10-10-mb-fixes-round-1-182a7c93 (worker), 2026-10-10
- Where: `src/components/mb/pagination.astro` (`jump` prop)
- What: the "go to page" field is a GET form that sends `<action>?<param>=<n>`. A prerendered page never sees that query (Astro strips it, `node_modules/astro/dist/core/request.js:19-21`), and Astro's `paginate()` builds path URLs (`/blog/2/`), so on today's static production build the jump would land on page 1. Only the dev-only `/ui` (now `prerender = false`) reads it.
- Suggestion: when a paginated list ships (blog, case studies), serve it on demand with the Node adapter the vision already plans, or add an nginx rewrite from `?strona=<n>` to the path page; out: a JavaScript redirect.
- Status: ticket KA0078

## F2. Two collapsed breadcrumbs with the same items share one popover id

- Kind: risk
- Found by: 2026-10-10-review-mb-fixes-round-1-35d5dc14 (review), 2026-10-10
- Where: `src/components/mb/breadcrumb.astro:60`
- What: the menu id is a hash of the items, so two identical collapsed breadcrumbs on one page would share it.
- Suggestion: none until a page renders two.
- Status: dropped (no page renders breadcrumb twice; the limit is documented in the component)
