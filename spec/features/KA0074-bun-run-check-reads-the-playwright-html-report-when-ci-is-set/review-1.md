# KA0074 - Review 1

- Job: 2026-10-14-review-ka0074-check-igno-a72bc30a
- Branch: h/2026-10-14-ka0074-check-ignores-rep-1bbf59cb
- Commit reviewed: 486198ecda8d5909746de088e64c410f4e81d4e6
- Verdict: PASS

## Final message

Verified end-to-end. Findings:

**Mechanism cross-check.** Traced the real `astro check` path through `node_modules/@astrojs/language-server/dist/check.js` → `@volar/kit/lib/createChecker.js` → confirmed it calls `ts.parseJsonSourceFileConfigFileContent(ts.readJsonConfigFile(tsconfigPath, ts.sys.readFile), ts.sys, path.dirname(tsconfigPath), undefined, tsconfigPath, undefined, extraFileExtensions)` with `extraFileExtensions` from the Astro language plugin (`{ extension: 'astro', isMixedContent: true, scriptKind: 7 }`, `ts.ScriptKind.Deferred === 7` confirmed in `typescript.d.ts`). The new test's `checkedFiles()` in `tests/e2e/check-input.spec.ts` reproduces this call signature exactly (same args, same basePath). Minor cosmetic difference: test uses `extension: ".astro"` vs. real plugin's `"astro"` (no dot); traced `getSupportedExtensions`/`fileExtensionIs` (plain `endsWith` string match) in `typescript.js` and confirmed this difference is functionally inert for real filenames. Not tautological: it exercises TypeScript's actual config-parsing API, not a re-implementation.

**Mutation test.** Reverted `tsconfig.json`'s `exclude` to the pre-fix `["dist"]`, ran `tests/e2e/check-input.spec.ts`: failed on all 3 retries, listing exactly the three probe `probe.ts` paths under `dist-no-case-studies/`, `playwright-report/`, `test-results/`. Restored the fix, same spec: 1 passed. This matches the worker's claimed before/after behavior.

**Full checks run in this worktree** (after `bun install --frozen-lockfile`):
- `bun run lint`: "Checked 103 files … No fixes applied." — pass.
- `bun run check`: "Result (76 files): 0 errors, 0 warnings, 0 hints" — pass, matches worker's claim.
- `bun run build`: completes, 4 pages built — pass.
- `CI=1 bun run test:e2e` (full suite, reproducing the ticket's trigger condition): 118 passed, 1 flaky (`ui-proposals.spec.ts` contrast-ratio assertion on `blueprint-live` design proposal, retried and passed) — unrelated to this diff (file untouched by the branch, pre-existing visual-contrast flake), 119 total executions matches worker's reported count.
- `git status --short` clean before and after all runs; no leftover probe/build artifacts.

**Scope note.** Ticket's explicit Scope list names only `playwright-report` and `test-results`; the branch also excludes `dist-no-case-studies`. Justified in the worker's final message (same leak class: gitignored folder with minified `_astro/*.js`, built by the e2e `webServer` command in `playwright.config.ts`, confirmed present in `.gitignore` and in the webServer command). Consistent with the ticket's Goal statement ("reports only the project's own files, whatever an earlier e2e run … left") rather than a contradiction of it; not a Decision violation. Not blocking.

**Other guide checks:** no em-dash added (checked diff for U+2014: none); no Tailwind/CMS/React/third-party scripts touched; commit message `fix(KA0074): ...` matches repo's ticket-scoped Conventional Commits convention (seen in `git log`); `AGENTS.md` `tests/e2e/` list updated to include `check-input`, consistent with styleguide's requirement that a behavior change ships with an updated spec and doc.

No findings that block. All CI-equivalent commands green, test is a genuine, non-tautological regression test proven by mutation, branch stays inside the ticket's intent.

PASS
