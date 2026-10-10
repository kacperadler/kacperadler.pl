# KA0064 - The send-error banner puts the mail link in a column of its own

```json
{
  "id": "KA0064",
  "title": "The send-error banner puts the mail link in a column of its own",
  "date": "2026-10-10"
}
```

## Description

the banner is a flex row of the icon, a text run and the `<a>` to the email, so the link is a separate flex item: on `/` at 1440 px wide, with the wrapper set to `data-state="error-submit"`, the 140 px link starts 468 px into the 662 px banner, beside the wrapped sentence instead of after "napisz mailem na". Seen with a throwaway Playwright script on the dev server; the computer proposal works around it on its own page (`display: block`, inline icon).

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: bug

Evidence:
- `src/components/contact/contact-form.astro` (`.contact-form-wrap[data-state="error-submit"] .form-error { display: flex; }`)
- Found by: 2026-10-10-proposal-computer-dc1c52da (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: lay the banner out as one run of text (block, the icon inline or floated), or wrap the sentence and the link in one `<span>` so the flex row has two items. The error copy stays as it is.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- lay the banner out as one run of text (block, the icon inline or floated), or wrap the sentence and the link in one `<span>` so the flex row has two items. The error copy stays as it is.

## Decisions

- 2026-10-10: Source: F1 of KA0042
- 2026-10-10: Dropped by the coordinator: duplicate of KA0062.
