# KA0062 - The send-error banner splits its sentence into flex columns

```json
{
  "id": "KA0062",
  "title": "The send-error banner splits its sentence into flex columns",
  "date": "2026-10-10"
}
```

## Description

the banner is a flex row whose children are the icon, a bare text node, the `<a>` with the email and the trailing `.`; the text and the link become separate flex items with the 10px gap between them. On `/` at 1440px, with `data-state="error-submit"` set on `[data-contact-wrap]`, the link sits 468px from the banner's left edge as its own column and the period stands apart after a gap ("kontakt@kacperadler.pl ."); in a narrower form (the professional proposal's two-column contact at 1440px) the sentence wraps inside its column while the email stays in another.

## Goal

What we are after, what it moves in `spec/vision.md`, and the evidence (file:line, a command and its output). A mechanical, fully specified change (a rename, a moved section, a list of exact edits) adds `- Model: haiku` under Kind; anything with behaviour to judge has no Model line.

- Kind: bug

Evidence:
- `src/components/contact/contact-form.astro` (`.form-error`, `.contact-form-wrap[data-state="error-submit"] .form-error { display: flex }`)
- Found by: 2026-10-10-proposal-professional-943bf522 (worker), 2026-10-10

## Done means

- The fix, with a test that proves it: wrap the message (text, link and period) in one `<span>` (or `<p>`) so it is a single flex item next to the icon. Out: the banner's look.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- wrap the message (text, link and period) in one `<span>` (or `<p>`) so it is a single flex item next to the icon. Out: the banner's look.

## Decisions

- 2026-10-10: Source: F1 of KA0043
