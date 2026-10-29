# KA0135 - The inline "formularzu" link in the FAQ lede is 21px tall

```json
{
  "id": "KA0135",
  "title": "The inline \"formularzu\" link in the FAQ lede is 21px tall",
  "date": "2026-10-29"
}
```

## Description

the ticket's Description measures the inline "formularzu" link at 21px at 390px, but its Goal and Scope name only the header buttons and the footer links, so this branch leaves it. A link inside running text is exempt from WCAG 2.5.8 (the inline exception), and a vertical hit area on it would cover the lines of text above and below.

## Goal

The \"formularzu\" link inside the FAQ intro text is only 21px tall on a phone. Decide whether links inside running text get a wider tap area (only sideways, never into the lines above and below), or stay as they are, which WCAG 2.5.8 allows for inline links.

- Kind: improvement

Evidence:
- `src/components/mb/sections/faq.astro:25` (`Link variant="inline"`, styles in `src/components/mb/link.astro`)
- Found by: 2026-10-29-ka0111-tap-targets-b799f968 (worker), 2026-10-29

## Done means

- The fix, with a test that proves it: decide whether inline links get a hit area at all; if so, only a horizontal one (`inset-inline`), never into the neighbouring lines. Other inline links (`prose.astro` in the legal pages and case studies) would follow the same rule.
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- decide whether inline links get a hit area at all; if so, only a horizontal one (`inset-inline`), never into the neighbouring lines. Other inline links (`prose.astro` in the legal pages and case studies) would follow the same rule.

## Decisions

- 2026-10-29: Source: F1 of KA0111
