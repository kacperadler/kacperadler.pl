# KA0114 - Findings

## F1. A one-letter word right before an inline tag keeps a normal space

- Kind: note
- Found by: 2026-10-28-review-ka0114-one-letter-71d731a7 (review), 2026-10-28
- Where: `src/lib/one-letter-words.ts`
- What: a sentence split by `<em>`/`<strong>` right after a one-letter word would not bind it; today the only such case is a screen-reader-only span.
- Status: dropped (documented limit in AGENTS.md, no case on the site)

