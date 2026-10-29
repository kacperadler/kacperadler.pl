# KA0123 - Review 1

- Job: 2026-10-29-review-ka0123-labels-2b7e4e39
- Branch: h/2026-10-29-ka0123-labels-15157b52
- Commit reviewed: d36e39df6ac7ab65a7d81ab166393edfbcfb31bb
- Verdict: PASS

## Final message

Worktree clean, no leftover mutations.

---

**Findings:** none blocking.

**Notes:**
- `spec/features/KA0123.../findings.md` F1: case study facts table (`[slug].astro` `.mb-case-fact dt`) left in 11px mono caps, correctly out of this ticket's evidence list, logged `open` for a follow-up ticket.
- Font-size/weight (`13px`/`500`) duplicated as literals across 8 components rather than a shared class/token; matches existing codebase convention (other labels also use literal px), not a regression.
- `.mb-legend-label` ("Czego potrzebujesz") is verified against `.mb-label` in `tests/e2e/ui-catalogue.spec.ts` (dev catalogue) rather than in `design.spec.ts`'s production `CONTENT_LABELS` array; the component is shared so this still proves the fix, just via a different spec file than the other seven labels.

**Checks run (in worktree, this range):**
- `bun install --frozen-lockfile` - ok.
- `bun run lint` - `Checked 119 files in 1150ms. No fixes applied.`
- `bun run check` - `0 errors, 0 warnings, 0 hints`.
- `bun run build` - completed, no errors.
- `bun run test:e2e` - `245 passed (5.3m)`.
- Mutation: reverted `.mb-service-fact dt` to mono/uppercase/11px, ran `design.spec.ts -g "content labels"` → failed as expected (`Expected: "Geist", Received: "Geist Mono"`); restored file, confirmed `git status` clean.
- Visual diff of `1440-2-services-{before,after}.png` and `390-5-form-{before,after}.png`: labels (`Dla kogo`, `Co dostajesz`, `Czas`, `Problem`, `Rozwiązanie`, `Email`, `Czego potrzebujesz`) switched from uppercase tracked mono to sentence-case Geist; drawing marks (`§ 02 / OFERTA`, `02.1`, `07.1`, tag badges) stayed mono in both; layout, viewport, and scroll position identical between pairs.
- Diff scan for added em-dashes (U+2014): none.
- `git diff --stat` file list vs ticket evidence list: matches (contact-link, field-set, field, footer, label, cases, hero, services, trust + `DESIGN.md`/`AGENTS.md` + two spec files + findings.md); no Dockerfile/nginx/og-image/tokens.css touched, so no Docker build required.

PASS
