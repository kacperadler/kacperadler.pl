# KA0028 - Review 1

- Job: 2026-10-10-review-case-studies-fram-b9d65d54
- Branch: h/2026-10-10-case-studies-frame-57492fb9
- Commit reviewed: 712c078cd4e81027993bbe354f8a7eb368ad1d6c
- Verdict: PASS

## Final message

Comprehensive review complete. Summary below.

**Findings:** none blocking.

**Notes (non-blocking):**
- `src/components/layout/nav.astro:24` — `inPage` logic (`!link.href.includes("#") && path.startsWith(link.href)`) is simple string-prefix matching; works for the only page-link case (`/realizacje/`) but would silently misbehave if a future page link shared a prefix with another route. Not exercised today, no bug now.
- The double e2e build (`E2E_FIXTURES=none` then the normal build) adds real wall time to CI (~another `astro build` pass, roughly +1-2s locally) but is the only way to prove the "neither built" state from static HTML on disk; reasonable tradeoff for what the ticket's Decisions explicitly ask to prove.

**Checks run (in this worktree, `~/.bun/bin` on PATH):**
- `bun install --frozen-lockfile` — 367 packages, clean.
- `bun run lint` — "Checked 68 files… No fixes applied."
- `bun run check` — 0 errors, 0 warnings, 0 hints.
- `bunx prettier --check "**/*.astro"` — all formatted.
- `bun run build` (no fixtures, production state) — 4 pages; `grep -ril realizacje dist/` → no matches (confirms list page, case study page, menu entry, sitemap, llms*.txt all absent when no case study exists).
- `E2E_FIXTURES=1 bun run build` — 6 pages, `/realizacje/` and `/realizacje/przyklad/` present; previewed and curled both, titles correct, "Realizacje" present in home nav HTML.
- `bun run test:e2e` — 27 passed (30.9s), matches worker's claim including the new 4 case-study-list/menu specs and the "no case studies" spec reading `dist-no-case-studies/` from disk.
- Pixel-parity check for `.prose` move (`legal-layout.astro` → `global.css`): extracted the rendered `<div class="prose">…</div>` fragment on `/regulamin` from a build at base commit `83712f3` vs this branch — byte-identical (4276 bytes, `o==n` True). Compared the bundled minified `.prose` CSS rule text in both builds — identical values, same property order. Only HTML differences between the two builds are the nav hrefs (`#services` → `/#services`, intentional, covered by updated specs) and a hashed CSS filename (expected from the bundle content change elsewhere).
- Verified `git diff` range adds no em-dash (`grep -P "\x{2014}"` on added lines — none).
- Verified branch doesn't touch `Dockerfile`, `nginx.conf`, or `og-default.png.ts` (absent from diff stat) — no Docker build required.
- Viewed worker's screenshots `08-list-desktop-hover-and-menu.png` and `11-menu-mobile-open.png`: list page renders period/company/role/summary/"Zobacz realizację" card, "Realizacje" active in desktop nav; mobile sheet shows "Realizacje" between "Usługi" and "Proces". Matches worker's description.
- `git status --short` clean after all runs; no stray artifacts left in the worktree.

Ticket's Decisions satisfied: frame (collection/page/schema/experience link/sample MDX fixture/axe-zero) from the original two commits intact; F1 (stale nav comment) and F2 (`/realizacje/` index) both fixed with the list page and nav entry gated on case-study existence, proven both ways. `AGENTS.md`, `DESIGN.md`, `README.md`, `findings.md` updated consistently with the code.

PASS
