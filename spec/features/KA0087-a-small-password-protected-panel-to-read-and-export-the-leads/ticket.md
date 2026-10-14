# KA0087 - A small password-protected panel to read and export the leads

```json
{
  "id": "KA0087",
  "title": "A small password-protected panel to read and export the leads",
  "date": "2026-10-14",
  "after": [
    "KA0027"
  ]
}
```

## Description

KA0027 stores every contact-form lead in SQLite on a Dokploy volume. The human needs to read and download them without opening the database by hand. On 2026-10-14 he chose SQLite over Postgres and asked for the panel as its own ticket, since it is not small.

## Goal

The human reads every lead and downloads them from the site itself, behind a login, with nothing to install.

- Kind: improvement
- Plan: tak

## Done means

- A panel route on the Node server KA0027 adds, behind a login (password from an env var, never committed; the plan proposes the session mechanism): list of leads, newest first; one lead's details; CSV export of all leads.
- Not indexed (noindex, absent from the sitemap), and every panel route refuses without login.
- E2E: refusal without login, wrong password, list, details, CSV contents.
- `README.md`: the env var to set in Dokploy.
- `bun run lint`, `bun run check`, `bun run build` and `bun run test:e2e` pass.

## Scope

In:
- The panel pages and their API routes, the login, tests, `README.md`.

Out:
- Editing or deleting leads (the plan may propose it as a later step).

## Decisions

- 2026-10-14: The human: SQLite stays; the panel is its own ticket, after KA0027.
