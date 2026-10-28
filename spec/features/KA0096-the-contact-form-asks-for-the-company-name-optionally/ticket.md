# KA0096 - The contact form asks for the company name, optionally

```json
{
  "id": "KA0096",
  "title": "The contact form asks for the company name, optionally",
  "date": "2026-10-14",
  "after": [
    "KA0105"
  ]
}
```

## Description

The brief's contact form (KA0075 `brief.md` 4.11) has an optional company field; KA0075 left it out because it touches the leads table and the privacy policy.

## Goal

A visitor can say which company they write from, so Kacper knows the context before he replies, without making the form longer to fill.

- Kind: improvement

## Done means

- The form has an optional `Firma` field; `/api/lead` accepts it empty or up to a length limit; the leads table stores it (existing rows keep working); the e-mail still carries no visitor data; the privacy policy names the field. e2e covers empty, filled and too long.
- `bun run check` and `bun run test` pass.

## Scope

In:
- `src/lib/lead.ts`, `src/lib/leads-db.ts`, `src/pages/api/lead.ts`, the contact section, `src/pages/polityka-prywatnosci.md`.

Out:
- The leads panel (KA0087).

## Decisions

- 2026-10-14: From the redesign brief (KA0075 `brief.md` 4.11); the human: the field may be there but is not required.
- 2026-10-28: The human approved it.
