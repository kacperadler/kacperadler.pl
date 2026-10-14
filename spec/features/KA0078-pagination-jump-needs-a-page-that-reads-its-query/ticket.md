# KA0078 - Pagination jump needs a page that reads its query

```json
{
  "id": "KA0078",
  "title": "Pagination jump needs a page that reads its query",
  "date": "2026-10-10"
}
```

## Description

the "go to page" field is a GET form that sends `<action>?<param>=<n>`. A prerendered page never sees that query (Astro strips it, `node_modules/astro/dist/core/request.js:19-21`), and Astro's `paginate()` builds path URLs (`/blog/2/`), so on today's static production build the jump would land on page 1. Only the dev-only `/ui` (now `prerender = false`) reads it.

## Goal

The pagination "go to page" field lands on the page asked for on the static production build, not on page 1, so it works once paginated pages (blog) exist.

- Kind: risk

Evidence:
- `src/components/mb/pagination.astro` (`jump` prop)
- Found by: 2026-10-10-mb-fixes-round-1-182a7c93 (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: when a paginated list ships (blog, case studies), serve it on demand with the Node adapter the vision already plans, or add an nginx rewrite from `?strona=<n>` to the path page; out: a JavaScript redirect.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- when a paginated list ships (blog, case studies), serve it on demand with the Node adapter the vision already plans, or add an nginx rewrite from `?strona=<n>` to the path page; out: a JavaScript redirect.

## Decisions

- 2026-10-10: Source: F1 of KA0071
- 2026-10-14: The human approved the ticket.
