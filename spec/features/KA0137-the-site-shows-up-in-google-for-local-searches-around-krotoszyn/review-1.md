# KA0137 - Review 1

- Job: 2026-11-23-review-45952759
- Branch: arthur/2026-11-23-worker-8fea5da1
- Commit reviewed: ff8eaf0192bb6d892a96f3de999c25591a4af3de
- Verdict: PASS

## Final message

No blocking findings. The branch at `ff8eaf0` meets every Done-means item that KA-D37 leaves in play:

- **FAQ copy:** the home page gets a ninth FAQ item. Its answer names Krotoszyn and the six towns the ticket lists, and says Kacper works in person nearby and remotely elsewhere.
- **Structured data:** `ProfessionalService` now has `address` (Krotoszyn, wielkopolskie, PL, no street) and `areaServed` with each town as a `City`, followed by `Poland` and `European Union`. A test reads both from the built home page.
- **Title and description:** the title names Krotoszyn. The description names Krotoszyn and Wielkopolska. Both are pinned by exact-string assertions in `home.spec.ts:1416-1423`.
- **One town list:** `localTowns` in `src/data/home.ts` feeds both the FAQ answer and the JSON-LD.
- **Decisions kept:** no town pages, no sitemap change, no street address, as KA-D37 requires. The edits stay within the ticket's Scope files, plus the spec and `AGENTS.md` updates.
- **Tests updated:** the FAQ layout test now checks a five/four column split, which matches `Math.ceil(faq.length / 2)` in `faq.astro:15`. It still checks the same things as before: columns side by side, rows aligned, and opening a question grows only its own column.

The wording is still for the owner to approve on the branch, as KA-D37 says. The worker's message lists every string to approve.

## Notes
- (minor) src/data/site-config.ts:18: the description is long. It is now 189 characters, and Google usually cuts snippets at about 155–160. The second sentence ("Audyt, wdrożenie i stała opieka…") will probably be cut off in search results.
- (minor) src/data/home.ts:183: the local copy is inside a closed accordion. The question "Pracujesz na miejscu czy zdalnie?" names no town, so a visitor sees no place name until it is opened. The answer is still in the HTML (native `<details>`). The worker flagged this as the trade-off for keeping about to three paragraphs (KA0075).

## Checks
- `bun run lint`: `Checked 139 files in 1556ms. No fixes applied.`
- `bun run check`: 0 errors, 0 warnings, 1 hint.
- `npm test` on the tip: 270 passed, 12 skipped, in 5.5 minutes. The skipped ones are the Docker-guarded specs. The dev-no-reload messages in the output are its own retry log; that spec passed.
- `npm run mutate`: the project has no such script.
- Hand mutation: I removed the `...localTowns.map(...)` spread from `areaServed` in `src/lib/seo.ts`. `home.spec.ts -g "names Krotoszyn"` then failed at the `areaServed` `toEqual` (line 1470), on the first run and both retries. I restored the file with `git checkout -- src/lib/seo.ts`, and the tree is clean.
- `findings.md`: the ticket folder on the branch doesn't have one; it holds only `ticket.md`.

PASS