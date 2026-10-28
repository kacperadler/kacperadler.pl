# KA0114 - Review 1

- Job: 2026-10-28-review-ka0114-one-letter-71d731a7
- Branch: h/2026-10-28-ka0114-one-letter-words-08082bc6
- Commit reviewed: 337f47bcc984bcd776a2dfc26276918fbe708c7e
- Verdict: PASS

## Final message

Worktree clean, no leftover mutations.

Findings: none.

Notes (non-blocking):
- The one documented limit (one-letter word at the very end of a text node, right before an inline tag, e.g. `<em>`/`<strong>` splitting a sentence) keeps a normal space. Verified via `grep -oP '(?<=[>\s])[AaIiOoUuWwZz] (?=<)'` across every generated page (`index`, `realizacje/przyklad`, `realizacje/index`, `lista/index`, `404`, `regulamin`, `polityka-prywatnosci`): the only hit is the screen-reader-only `<span class="sr-only"> i </span>`, which is never visually rendered. So the limit has zero current impact on the live site, matching the worker's claim; a future inline-markup split next to a one-letter word would silently re-create the bug, but that's the documented, inherent limit of a token-local regex approach, not a defect introduced here.

Checks run (in this worktree, `bun install --frozen-lockfile` first):
- `bun run lint` → 115 files, no fixes needed.
- `bun run check` → 99 files, 0 errors/warnings/hints.
- `bun run build` → succeeds; verified in `dist/client/index.html`: 30 `&nbsp;` insertions in visible text, JSON-LD (`<script type="application/ld+json">`) untouched, `alt` attributes untouched, no `<` corruption. `dist/client/llms-full.txt` has 0 `&nbsp;`/U+00A0.
- `bun run test:e2e` → 204 passed (3.0m), full suite including the Docker-backed `lead-rate-limit` spec (Docker available and used by the suite itself).
- Visual check of the before/after screenshots in the ticket's `screenshots/`: at 390px, "maile i / zapytania" → "maile / i zapytania" and "osoby, a / reszta" → "osoby, / a reszta"; one-letter words moved off the line end as intended.
- Mutation testing against `src/lib/one-letter-words.ts` / `src/middleware.ts` (throwaway edits, reverted with `git checkout --`, worktree confirmed clean afterward):
  - Removed `w` from the letter class → unit assertion fails (`"Dane i w domu"` no longer binds "i w"/"w domu" correctly).
  - Replaced the quoted-attribute-aware tag pattern with a naive `<[^>]*>` (the exact HTML-corruption vector named in the review Focus) → `data-x="w > z o x"` attribute gets corrupted (`z o x` → `z&nbsp;o&nbsp;x`), caught by the unit assertion.
  - Removed `script` from the raw-content element list (JSON-LD corruption vector) → `{"a":"i w domu"}` inside `<script type="application/ld+json">` gets corrupted, caught by the unit assertion.
  - Removed the `content-type` guard in `src/middleware.ts`, rebuilt → `llms-full.txt` loses its "maile i zapytania" normal-space string (would fail the spec's `toContain`), and `dist/client/og-default.png` is corrupted into non-PNG `data` (binary body put through `.text()`/`new Response`), which would fail `og-image.spec.ts`.

All CI-equivalent commands pass, the diff stays inside KA0114's scope (ticket explicitly allows the single-helper approach taken), no em-dash, no `AGENTS.md` Don't violated, no vision.md "What stays true"/"Not the goal" item touched, `DESIGN.md` correctly left alone (no token/visual change).

PASS
