# KA0094 - One or two client testimonials on the home page

```json
{
  "id": "KA0094",
  "title": "One or two client testimonials on the home page",
  "date": "2026-10-14",
  "after": [
    "KA0075"
  ]
}
```

## Description

The brief (KA0075 `brief.md` 4.7, 8) asks for one or two client quotes as proof next to the case studies. The human collects them from clients, with their consent to publish name, role and company.

## Goal

A business owner sees that real clients vouch for Kacper, in their own words.

- Kind: improvement

## Done means

- The home page shows the quotes the human supplies, with name, role and company exactly as each client approved; the section is absent when there are none. An e2e test checks it.
- `bun run check` and `bun run test` pass.

## Scope

In:
- `src/content/` (a testimonials entry per quote), a home-page section.

Out:
- Case-study pages (KA0030 to KA0035).

## Decisions

- 2026-10-14: From the redesign brief (KA0075 `brief.md`, sections 4.11 and 8); waits for the human's input.
