# KA0083 - Review 1

- Job: 2026-10-14-review-ka0083-worker-ed6c09fc
- Branch: h/2026-10-14-ka0083-worker-63fce832
- Commit reviewed: 813b4755b40a21d06449660b976ff55265646d75
- Verdict: PASS

## Final message

## Findings

No blocking findings. One non-blocking correction to the task's own framing:

**F1 is very likely caused by this branch, not merely "a flake worth watching."** `spec/features/KA0083-.../findings.md` and `src/components/mb/button.astro` (`.mb-btn-spinner`): base (`4d0b902`) hid the loading spinner with `display: none`; this branch changes it to `visibility: hidden` + `transform: translateX(...)` (button.astro:260-270) so the clip (`overflow-x: clip` on `.mb-btn-face`) is what keeps it off-screen. In Astro dev, scoped-component CSS arrives via a Vite-injected stylesheet after first paint, so there's a window where the spinner is laid out unclipped/untransformed. I reproduced the asymmetry directly: 6 full-suite runs on `813b475` (CI=true, matching ci.yml) hit the flake once (109 passed, 1 flaky, `scrollWidth` 368); one full-suite run on base (`4d0b902`, identical conditions) had 0 failures in 99 tests. Isolated single-test runs on both pass every time (10/10), consistent with the bug needing the preceding tests' Vite warm-up state to manifest - not conclusive proof, but the mechanism and the empirical delta both point the same way. The worker's own hedge ("my change probably caused it") is accurate; the task's Focus line asserting it's "not caused by this branch" is not supported by the evidence. This doesn't block merge: the project's own findings.md→ticket workflow is the designated path for exactly this, it's filed as `open` with a concrete suggestion, and `bun run test` still exits 0 under real CI retry semantics (2 retries), which is what ci.yml actually runs.

## Notes (non-blocking)

- Screenshots `18-buttons-real-hover.png` / `19-buttons-real-pressed.png` genuinely capture live `:hover`/`:active`, not just forced states: I cropped the idle-column Outline button from both and diffed them - hover shows the white layer peeking past the bottom-right corner, press shows the button fully sunk onto a solid `ink-2` fill with the layer hidden, matching the CSS rules exactly.
- `spinner.astro` needed no change (plan's fallback "`paused` prop" path) - the scoped `:global(.mb-btn-spinner svg)` selector reaches it fine, confirmed by the passing loading-demo test.
- Implementation detail diverges harmlessly from the plan's file list: the clip/pad wrapper is named `.mb-btn-face` (doubling as the lift/press target) rather than a separate `.mb-btn-content`; behavior matches the plan's intent and all risks it called out (hit-area, clipping, focus ring) are satisfied without the `::after` hit-area hack the plan specified, because only the inner face moves now, not the clickable element - a simplification, not a regression.

## Checks run (in this worktree, range `4d0b902..813b475`)

- `bun install --frozen-lockfile`: ok.
- `bun run lint`: ultracite check, 102 files, no fixes needed.
- `bun run check`: astro check, 0 errors/0 warnings/0 hints.
- `bun run build`: static build completes.
- `bun run test` (CI=true, 2 retries as in `.github/workflows/ci.yml`): 109 passed, 1 flaky (`does not scroll sideways at 360px`, fails first try at 368px, passes on retry) - matches the worker's reported numbers exactly.
- Mutation 1: made `.mb-btn-layer` transform with the face on hover → all 4 raised-variant layer tests fail (`expect(frame.layer).toEqual(layer)`); reverted, worktree clean.
- Mutation 2: raised `.mb-btn-layer`'s `z-index` above `.mb-btn-face` → Default variant's stacking assertion (`faceOnTop()`) fails; reverted, worktree clean.
- `grep -rn "—"` across `AGENTS.md`, `DESIGN.md`, `src/`, `tests/e2e/`: no em-dash.
- Baseline comparison: throwaway `git worktree add --detach /tmp/ka0083-base 4d0b902...`, ran the same flaky test in isolation (5/5 pass) and the full suite (99 passed, 0 flaky) there; removed the worktree afterward.
- `tmp-probe.mjs` / `tmp-shots.mjs` / any `*.mp4`: absent from the tree and from the diff.

PASS
