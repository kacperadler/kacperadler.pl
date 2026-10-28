# KA0075 - Review 1

- Job: 2026-10-28-review-ka0075-preview-fi-6b43e469
- Branch: h/2026-10-14-ka0075-preview-fixes-opu-7d8611e5
- Commit reviewed: 5f941d6a92da83ed9c4310654d48f7e64b4ea664
- Verdict: PASS

## Final message

## Review: h/2026-10-14-ka0075-preview-fixes-opu-7d8611e5 @ 5f941d6a

Range judged: `fd694b9a..5f941d6a` (104 files, 3791/-1191), covering the entire chain of follow-ups from the first preview feedback (experience accordion frame, FAQ/contact empty-right-side) through the final about-section alignment fix. No earlier review was named for this branch, so the full range was in scope.

### Findings
None that block merge.

### Notes (non-blocking)
- `git log main` shows `main` tip (`121fc8f`) is a docs-only ticket.md bookkeeping commit not reachable from this branch; branch base `fd694b9` is itself a docs-only commit recording the 2026-10-27 about feedback. No code divergence between branch and main — confirmed `fd694b9` diff is `ticket.md` + one jpg only.
- No test exercises the server rejecting a duplicate project type via a non-form client directly against `checkLead` in isolation, but `tests/e2e/contact-form.spec.ts:223-224` (`"a project type twice"`) does drive this through the real `/api/lead` contract test, so the behavior is covered end-to-end.

### Checks run (in this worktree, not the main checkout)
- `bun install --frozen-lockfile` — 378 packages, clean.
- `bun run lint` — `Checked 124 files… No fixes applied.`
- `bun run check` — `0 errors, 0 warnings, 0 hints`.
- `bun run build` — completes, static + server output generated.
- `bun run test:e2e` — **202 passed (5.4m)**, matches worker's claim exactly.
- `Dockerfile` / `nginx.conf` / `og-default.png.ts` untouched in this range → no docker-build gate required.
- `git diff … | grep U+2014` on additions — no em-dash introduced.
- Grep for `tailwind|data-theme|theme-toggle|translateY|backdrop-filter|cookie|gtag|facebook` in additions — only a pre-existing `AGENTS.md` line and legitimate `border-radius` assertions in tests (radio exception, choice 0px, proposal-CSS injection test), nothing forbidden added.
- Grep for leftover `<<<<<<<`/merge-conflict markers — none.
- Spot-verified copy against ticket Decisions word-for-word: hero H1/subtitle/buttons/figures (`hero.astro`), about's three paragraphs (`home.ts:118-120`), cases copy (ReX ongoing, LeadBuster/LeadApartament "took over, not built from scratch," Helpfind team-credited "W zespole budowałem," Energia Direct "Ok. 100 użytkowników dziennie," launch month-only) — all match.
- `step-marker.astro`: scroll-driven fill animation gated under `@media (prefers-reduced-motion: no-preference) and @supports (animation-timeline: view())`; default (no-motion) state renders fully filled — matches vision.md's reduced-motion rule.
- `choice.astro` + `contact-form.astro` + `lib/lead.ts` + `contact-form.spec.ts:320-363`: native `type=checkbox`, shared `name="type"`, keyboard Tab/Space verified, submitted payload asserted as `["audit","partner"]` — not a tautological test, it reads the actual network POST body.
- `tests/e2e/home.spec.ts:974-1025` (about alignment): measures real `getBoundingClientRect()`/line-box geometry at 1440/1024/390, not styling assumptions; visually confirmed via the two delivered screenshots (text top level with photo top, links bottom level with photo bottom at 1440; stacked, uncropped, no overflow at 390).
- `DESIGN.md:143` documents new `--mb-section-gap`/`--mb-block-gap` tokens added in `tokens.css`; `AGENTS.md` content matches the file already loaded as repo-rules context, confirming it's current.
- No `#examples` references remain anywhere in `src/`; `llms-full.txt.ts` reads the merged `problems` (with `.effect`) and `caseHighlights`, consistent with the merge.
- Scope: touches beyond the ticket's listed `Scope` (choice/radio/contact-form components, content.config.ts, catalogue/proposal pages, leads-db.ts, navigation.ts) are direct, necessary consequences of explicitly-requested follow-up work (checkboxes, process rail, new logos, dead-link fix for the removed `#experience` id) — not unrelated scope creep.

PASS
