# kacperadler.pl

Portfolio Kacpra Adlera - Frontend Engineer (~5 lat, React/TS). Statyczny build Astro 6, produkcyjnie na Dokploy (Dockerfile + nginx).

> Wizja: [`spec/vision.md`](./spec/vision.md)
> Konwencje pracy z agentami: [`AGENTS.md`](./AGENTS.md)
> Design system: [`DESIGN.md`](./DESIGN.md)
> Historia projektu (fazy): [`project-plan.md`](./project-plan.md)

## Stack

- **[Astro 6](https://docs.astro.build)** (TypeScript strict, content collections, output static)
- **Vanilla CSS** + scoped `<style>` w `.astro` - dark-only (`color-scheme: dark` w `tokens.css`), jeden akcent (navy)
- **[Ultracite](https://www.ultracite.ai/)** (Biome 2) - lint + format dla TS/JS/JSON/CSS
- **[Prettier](https://prettier.io)** + `prettier-plugin-astro` - formatowanie `*.astro` (Biome ich nie obsługuje natywnie)
- **[Husky](https://typicode.github.io/husky/)** + **lint-staged** - pre-commit hooks
- **[Playwright](https://playwright.dev)** + `@axe-core/playwright` - testy E2E i a11y
- Self-hosted **[Geist](https://vercel.com/font)** Variable woff2 (SIL OFL 1.1, GDPR-friendly)
- Hosting: **[Dokploy](https://dokploy.com)** (self-hosted) - `Dockerfile` (bun build → nginx) + `nginx.conf`

## Wymagania

- **[bun](https://bun.sh) ≥ 1.3** w `PATH` (pre-commit hook woła `bunx`); Node 22+ (Astro CLI)

## Setup

```bash
bun install         # install deps
bun dev             # dev server (localhost:4321)
bun run build       # production build → dist/
bun run preview     # preview prod build lokalnie
```

## Edytor

Projekt zawiera config dla VS Code (`.vscode/`) i Zed (`.zed/`). Format-on-save uruchamia Biome (`source.fixAll.biome` + `source.organizeImports.biome`) dla TS/JS/JSON/CSS i Prettier dla `.astro`.

**Wymagane extension'y:**

- VS Code: `astro-build.astro-vscode`, `biomejs.biome`, `esbenp.prettier-vscode` (recommendations w `.vscode/extensions.json`)
- Zed: **Astro**, **Biome** (instaluje się z poziomu `cmd+shift+x`)

`.editorconfig` (LF, UTF-8, 2-space indent) działa w obu edytorach natywnie.

## Skrypty

| Komenda               | Opis                                                            |
| :-------------------- | :-------------------------------------------------------------- |
| `bun dev`             | Astro dev server                                                |
| `bun run build`       | Production build do `dist/`                                     |
| `bun run preview`     | Preview prod build                                              |
| `bun run check`       | `astro check` - type-check `.astro`                             |
| `bun run lint`        | `ultracite check` - lint Biome (TS/JS/JSON/CSS)                 |
| `bun run format`      | `ultracite fix` + `prettier --write '**/*.astro'`               |
| `bun run test:e2e`    | Playwright E2E (chromium, headless; wymaga `bun run build`)     |
| `bun run test:e2e:ui` | Playwright UI mode                                              |
| `bun astro ...`       | passthrough do Astro CLI (`bun astro add`, `bun astro sync`, …) |

## Pre-commit

`husky` + `lint-staged` na każdy commit:

- `ultracite fix` na staged `*.{ts,tsx,js,jsx,json,jsonc,css}`
- `prettier --write` na staged `*.astro`
- `astro check` na cały projekt

## CI

GitHub Actions (`.github/workflows/ci.yml`) na `push` / `pull_request` do `main`, dwa joby:

1. **build**: setup Node 22 + bun (wersja z `packageManager` w `package.json`), `bun install --frozen-lockfile`, `bun run lint`, `bun run check`, `bunx prettier --check '**/*.astro'`, `bun run build`
2. **e2e** (po build): Playwright chromium (cache przeglądarek), `bun run build`, `bun run test:e2e`, upload `playwright-report/`

Dependabot (`.github/dependabot.yml`) - bun + github-actions weekly, minor + patch zgrupowane w 1 PR.

## Struktura

```
src/
├── components/{ui,layout,sections,contact}/   # kebab-case
├── content/{services,projects,experience,blog}/
├── data/                  # site-config, navigation, process
├── layouts/               # base-layout, legal-layout
├── pages/                 # index, 404, legal *.md, og-default.png.ts, llms*.txt.ts
├── scripts/               # vanilla TS, ładowane przez <script>
├── styles/                # tokens.css, global.css
├── lib/                   # seo, dates
└── assets/
tests/e2e/                 # Playwright specs
```

Path aliasy: `@/components`, `@/layouts`, `@/lib`, `@/scripts`, `@/styles`, `@/data`, `@/content`, `@/assets`.

## Deploy

Dokploy na własnym serwerze:

- Build type: **Dockerfile** z repo - multi-stage `oven/bun:1.3.13-alpine` (`bun install --frozen-lockfile` + `bun run build`) → `nginx:1.27-alpine` serwuje `dist/`
- `nginx.conf`: gzip, security headers, cache rules (immutable dla `/_astro/` i fontów)
- Container port **80**, routing przez Traefik w Dokploy z certyfikatem Let's Encrypt

Lokalny test obrazu:

```bash
docker build -t kacperadler-pl-test .
docker run --rm -p 8089:80 kacperadler-pl-test
```
