# KA0003 - Outcome

- Merged: 2026-10-10, `8412871`
- Branch: h/2026-10-10-deps-and-astro-7-3f9b93b9
- Reviews: review-1.md PASS, review-2.md PASS
- Cost: worker $7.34, reviews $0.97; review rounds 2

## What went in

- `package.json`, `bun.lock`: Astro 7.3.8 and every other package on its latest release, except TypeScript kept on 6 (astro check does not support 7).
- `astro.config.mjs`, `.prettierrc`: `compressHTML` keeps Astro 6's whitespace; Prettier's `astroCompressHTML` matches it.
- `Dockerfile`, CI: bun 1.4.3 and nginx 1.30 images; Playwright 1.64.
- Source files: reformatted by Ultracite 7.12 key sorting and prettier-plugin-astro 1.x, no behaviour change; the mobile sheet lost its `aria-label` (KA0015).
- `AGENTS.md`, `README.md`: Astro 7, the image versions, the compressHTML rule.

## Checks on main

- `npm run check`: passed.
- CI macOS: off (no H_GITHUB_ACTIONS_TOKEN)

## Left open

- Tickets from findings: KA0013 (F1), KA0014 (F2), KA0015 (F3); F4 fixed.
