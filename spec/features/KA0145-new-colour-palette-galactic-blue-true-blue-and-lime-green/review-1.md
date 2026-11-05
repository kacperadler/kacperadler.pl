# KA0145 - Review 1

- Job: 2026-11-05-review-e8ba2bbc
- Branch: arthur/2026-11-05-worker-9c8d687a
- Commit reviewed: ad11d771c5a9f922d6d7d02e4b509ab54ff6555a
- Verdict: PASS

## Final message

No blocking findings. The branch matches KA-D1:

- **Ground:** `--v2-bg` is `var(--galactic-blue)` (`#04183b`). The panels are lighter steps of the same hue: `#0a2350` and `#112c5e`.
- **Accent and main buttons:** `--blue` is `var(--lime-green)` and `--blue-2` is `#a3e45c`. The header CTA and the send button are Lime Green with Galactic Blue text. The new design test checks this, and `after-contact-1440.png` shows it.
- **True Blue for state only:** True Blue appears only on state: the focus ring (`global.css`, `choice.astro`), the focused field's shadow (`input.astro`), a selected card's grips and filled number (`card.astro`, with `--v2-bg` text on it) and the sent form's shadow (`contact-form.astro`). It is never used for text and never as the accent.
- **Contrast:** I recomputed every pairing with the WCAG formula, against `#04183b`, `#0a2350` and `#112c5e`. All text is at 4.5:1 or more on all three surfaces. The weakest are `--muted` at 4.93, `--error` at 4.65 and Lime Green at 7.26, all on the elevated panel. Galactic Blue text scores 9.36 on Lime Green, 11.52 on `#a3e45c` and 5.30 on True Blue. A True Blue ring is 4.11 on the elevated panel, above the 3:1 a ring needs. The input frame is `--muted`, 5.57 on the panel.
- **No leftover colours:** none of the old values (`#8eaed8`, `#0a0c10`, `#14171c`, `#1a1e26`) remain in `src`, `public`, `DESIGN.md` or `tests`. No component sets a hex of its own.
- **`DESIGN.md`:** the palette table and the usage prose describe the new roles. The favicon and OG image recolour is accepted (KA-D3).
- **Screenshots:** before and after shots of the home page, the case-study page and the contact form, at 1440 and 390 px, are in the ticket folder.

## Notes
- (minor) src/styles/tokens.css:39: the accent token is still named `--blue`. It holds Lime Green, so a reader of a component sees `var(--blue)` paint green. The worker already logged this as finding F1, with the rename to `--accent` deferred.
- (minor) DESIGN.md:243: the Don'ts still forbid chromatic shadows, while the focused field and the sent form carry a True Blue shadow. Already logged as finding F2.

## Checks
- `npm run check`: 0 errors, 0 warnings, 0 hints.
- `npm run lint` (ultracite check): 120 files checked, no fixes applied.
- `npm test`: 249 passed, 8 skipped (the Docker specs, which skip in this sandbox), 0 failed, in 3.9 min.
- Contrast ratios: computed with a Python WCAG script, results as above.
- Screenshot: I looked at `after-contact-1440.png` only.
- Not run: `npm run mutate` and hand mutations, to keep within the small budget.

PASS