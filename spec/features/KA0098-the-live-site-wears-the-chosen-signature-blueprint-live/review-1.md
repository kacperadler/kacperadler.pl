# KA0098 - Review 1

- Job: 2026-10-28-review-ka0098-blueprint-30d7d2d2
- Branch: h/2026-10-28-ka0098-blueprint-live-li-4aa472de
- Commit reviewed: a4833992845bc76aad7c95b0dbd351afb5721075
- Verdict: PASS

## Final message

No further blocking issues found. Final assessment below.

**Checks run (this worktree, not the human's dev server on :4400):**
- `bun install --frozen-lockfile`: ok.
- `bun run lint`: `Checked 111 files … No fixes applied.`
- `bun run check`: `0 errors, 0 warnings, 0 hints`.
- `bun run build`: succeeds, static + `/api/lead` server output as expected.
- `bun run test:e2e`: `175 passed`, 2 flaky (both pass on Playwright's configured CI retry: `tests/e2e/blueprint.spec.ts:275` entrance-after-paint check at 360px, and an unrelated `dev-no-reload.spec.ts` race). Matches CI's own retry config (`retries: process.env.CI ? 2 : 0`), so this is a green CI run, not a failure. Count (175+2=177) matches the worker's claim.
- Docker not required: branch doesn't touch `Dockerfile`, `nginx.conf` or `og-default.png.ts`.
- No em-dash (U+2014) added anywhere in the diff (`grep -P '\x{2014}'` on the full diff: no hits).
- `/ui/proposal*` and `src/styles/proposals/*` fully removed; `tests/e2e/ui-proposals.spec.ts` deleted, `ui-catalogue.spec.ts:768` asserts the routes 404.

**Independent verification of the entrance (the human's hardest-to-trust ask)**

Visual screenshots (`home-1440-top-after-entrance.png`, `home-1440-offer-section.png`) show the settled blueprint: datum cross, dimension braces/callouts, `§ NN /` labels, numbered cells, title block — matches `DESIGN.md`.

I didn't take the worker's frame-by-frame claims on faith. I decoded `entrance-load-and-scroll-1440.mp4` myself (ffmpeg → raw pixel pipes, Python, no PIL available) and tracked pixel-precise y-offsets per 60fps frame, independent of the worker's own `measure.mjs`:
- First non-flat (content) frame lands at video t≈0.535s (consistent with "dark tab, navigation inside the recording" — no white flash).
- Headline top-of-glyph y: 145→126→122→115→89→87→83→**81 (settled, stable from t≈1.0s through t=2.5s)**, i.e. a real 64px rise over ~450ms — matches the claimed `bl-enter-slide` 64px/0.6s.
- Header content bottom-extent y: 10→33→37→43→65→66→69→**70 (settled at t≈1.03s, stable to t=2.5s)** — real ~480ms drop, matches `bl-enter-down`.
- Subtitle region mean luma ramps 17.3→31.8 over t≈0.72–1.55s — real fade-in, matches its 0.3s delay.
- Entrance plateaus (std/mean flat) from t≈2.1s until the recorded wheel-scroll begins ≈t=2.8s — matches "ends by 1.7s and stays," no scroll-driven motion.

My first eyeball pass on a coarse composite wrongly suggested "no visible travel"; the pixel-level per-frame numbers above correct that — the entrance genuinely plays, gradually, after first paint, in this exact committed artifact. This satisfies the coordinator's explicit ask (header/headline/subtitle each caught mid-motion across sampled frames).

**Code review**: `global.css` entrance machinery (`--bl-p`/`--bl-s`/`--bl-e`, paused→`go` via inline head script + 2×rAF), `header.astro`, `hero.astro`, `trust.astro` (staggered `--mb-cell` cascade) match the human's 2026-10-28 decisions (header-down-first, headline-before-subtitle, trust logos one-by-one). `card.astro`, `section-head.astro`, `step-marker.astro`, `footer.astro`, `page-frame.astro` all stand drawn (`--bl-p` initial `1`, no entrance wiring, no scroll-timeline) — the "no drawing on scroll" decision is honored; the only motion tied to scroll is the pre-existing (KA0075, out-of-scope) process-rail blue fill, explicitly carved out in `AGENTS.md`'s Don't list and untouched logic-wise here. `DESIGN.md` "The drawing" and `tokens.css` updated in the same branch as required for a token change. `findings.md` F1 (404 page's own rule doesn't draw) correctly logged `open`, out of scope, non-blocking.

**Lighthouse (inconclusive, not a finding against the branch)**: I ran Lighthouse mobile twice against the built `dist/` myself: 92 and 91 (vision.md requires ≥95), LCP 2.7s/2.4s vs the worker's claimed 99/1.7s. `ps aux` shows this host concurrently running dozens of unrelated agent/CI sessions at high CPU; TBT swung 70ms→210ms between my two back-to-back runs on the identical build, which alone proves the measurement environment is contended and unreliable for an 8-point-sensitive metric. CLS matched at 0 both times (a contention-insensitive metric). No code-level reason to expect a regression (CSS-only `@property`/`clip-path`/background-size tricks, no added JS beyond the pre-existing-pattern `ResizeObserver`, no new network requests). I'm not treating this noisy self-produced measurement as ground truth to fail on.

**Notes (non-blocking)**
- Lighthouse Performance ≥95 on home unverified by me due to host contention; worker's own claimed run (99) is plausible given the diff's nature, but not independently confirmed.
- `blueprint.spec.ts:275` (360px entrance-after-paint) is flaky even with CI's retry budget; the underlying 2×rAF "first paint" heuristic is a race that occasionally loses, matching what I found of its sensitivity to load. Not disqualifying (CI retries absorb it), worth a future hardening pass.

PASS
