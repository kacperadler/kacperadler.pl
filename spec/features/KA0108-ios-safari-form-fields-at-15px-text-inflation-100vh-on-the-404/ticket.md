# KA0108 - iOS Safari: form fields at 15px, text inflation, 100vh on the 404

```json
{
  "id": "KA0108",
  "title": "iOS Safari: form fields at 15px, text inflation, 100vh on the 404",
  "date": "2026-10-28",
  "after": [
    "KA0105"
  ]
}
```

## Description

good-css "The reset" (`foundations.md`): `input, textarea, select { font-size: max(16px, 1rem) }`, `-webkit-text-size-adjust: 100%`, `svh` for document heights. Measured: the email field and the message box render at 15px (computed style, both widths). [INFERENCE] iOS Safari zooms the page into any focused field under 16px, so a visitor filling the contact form on an iPhone is left zoomed in and pinches out after sending; at 16px it does not zoom. [INFERENCE] the same Safari inflates text after rotating to landscape without `text-size-adjust`, and its `100vh` is the toolbar-hidden height, so the 404 content sits lower than the visible centre. None of these reproduce in Chromium; they need a real iPhone before and after.

## Goal

On an iPhone a form field does not zoom the page when tapped, text keeps its size in landscape, and the 404 fits the visible screen.

- Kind: improvement

Evidence:
- `src/components/mb/input.astro:29`, `src/components/mb/textarea.astro:23` (15px); `src/styles/global.css:13-22` (no `-webkit-text-size-adjust`); `src/pages/404.astro:29` (`min-height: calc(100vh - 240px)`)
- Found by: 2026-10-28-ka0104-good-css-audit-d0007900 (worker), 2026-10-28

## Done means

- The fix, with a test that proves it: raise the two field sizes to `max(16px, 1rem)` (the visible change: field text 1px larger), add `-webkit-text-size-adjust: 100%` to the root, write `100svh` in `404.astro`. Cost: about 4 lines and a check on an iPhone; would rank second if the zoom is confirmed there. Out: `maximum-scale` / `user-scalable=no` in the viewport meta (good-css forbids it).
- `npm test` and `npm run check` pass. The structure test holds.

## Scope

In:
- raise the two field sizes to `max(16px, 1rem)` (the visible change: field text 1px larger), add `-webkit-text-size-adjust: 100%` to the root, write `100svh` in `404.astro`. Cost: about 4 lines and a check on an iPhone; would rank second if the zoom is confirmed there. Out: `maximum-scale` / `user-scalable=no` in the viewport meta (good-css forbids it).
- raise the pagination page-jump input (`src/components/mb/pagination.astro`, `.mb-page-jump-input`) to `max(16px, 1rem)` as well.

## Decisions

- 2026-10-28: Source: F4 of KA0104
- 2026-10-28: The human approved it; runs one at a time after KA0105 (shared CSS files).
- 2026-10-28: The coordinator: the pagination page-jump input at 16px is in scope, since the Goal is that no form field zooms the page on iOS; the human was told and did not object.
