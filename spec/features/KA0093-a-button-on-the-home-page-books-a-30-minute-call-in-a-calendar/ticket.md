# KA0093 - A button on the home page books a 30-minute call in a calendar

```json
{
  "id": "KA0093",
  "title": "A button on the home page books a 30-minute call in a calendar",
  "date": "2026-10-14",
  "after": [
    "KA0075"
  ]
}
```

## Description

The brief (KA0075 `brief.md` 4.11) gives the contact section a second way in next to the form: a button that opens a calendar (Cal.com or Calendly) to book a 30-minute call. It needs the human's booking link.

## Goal

A visitor who would rather talk than write books a 30-minute call in two clicks, without waiting for a reply.

- Kind: improvement

## Done means

- With the human's booking link, the hero CTA and the contact section have "Umów 30 min", which opens the booking page; the link lives in `src/data/site-config.ts`. No third-party script loads until the visitor clicks (privacy policy unchanged, or updated if the embed needs it). An e2e test checks the link.
- `bun run check` and `bun run test` pass.

## Scope

In:
- `src/data/site-config.ts`, the hero and contact sections.

Out:
- The form (KA0027) stays as it is.

## Decisions

- 2026-10-14: From the redesign brief (KA0075 `brief.md` 4.11, 8): the human gives the booking link and picks Cal.com or Calendly.
