# kacperadler.pl

Portfolio Kacpra Adlera — Frontend Engineer (~5 lat, React/TS).

Migracja prototypu (`example.html`) do produkcyjnego Astro 6 hostowanego na Cloudflare Pages.

> Plan i decyzje architektoniczne: [`project-plan.md`](./project-plan.md)
> Konwencje pracy z asystentem: [`CLAUDE.md`](./CLAUDE.md)

## Stack

- **[Astro 6](https://docs.astro.build)** (TypeScript strict, kontent collections)
- **Vanilla CSS** + scoped `<style>` w `.astro` — theming `light | dark | system` przez `light-dark()` + `color-scheme`, jeden akcent (navy)
- **[Ultracite](https://www.ultracite.ai/)** (Biome 2) — lint + format dla TS/JS/JSON/CSS
- **[Prettier](https://prettier.io)** + `prettier-plugin-astro` — formatowanie `*.astro` (Biome ich nie obsługuje natywnie)
- **[Husky](https://typicode.github.io/husky/)** + **lint-staged** — pre-commit hooks
- Self-hosted **[Geist](https://vercel.com/font)** Variable woff2 (SIL OFL 1.1, GDPR-friendly)
- Hosting: **[Cloudflare Pages](https://pages.cloudflare.com)** (static, hybrid pod real form w Fazie 9)

## Wymagania

- **[bun](https://bun.sh) ≥ 1.3** (Node 22+ jeśli wracasz do node-only flow — `astro check` działa w node ekosystemie)

## Setup

```bash
bun install         # install deps
bun dev             # dev server (localhost:4321)
bun run build       # production build → dist/
bun run preview     # preview prod build lokalnie
```

## Skrypty

| Komenda           | Opis                                                                 |
| :---------------- | :------------------------------------------------------------------- |
| `bun dev`         | Astro dev server                                                     |
| `bun run build`   | Production build do `dist/`                                          |
| `bun run preview` | Preview prod build                                                   |
| `bun run check`   | `astro check` — type-check `.astro`                                  |
| `bun run lint`    | `ultracite check` — lint Biome (TS/JS/JSON/CSS)                      |
| `bun run format`  | `ultracite fix` + `prettier --write '**/*.astro'`                    |
| `bun astro ...`   | passthrough do Astro CLI (`bun astro add`, `bun astro sync`, …)      |

## Pre-commit

`husky` + `lint-staged` na każdy commit:

- `ultracite fix` na staged `*.{ts,tsx,js,jsx,json,jsonc,css}`
- `prettier --write` na staged `*.astro`
- `astro check` na cały projekt

## CI

GitHub Actions (`.github/workflows/ci.yml`) na `push` / `pull_request` do `main`:

1. checkout
2. setup-bun (czyta wersję z `packageManager` w `package.json`)
3. `bun install --frozen-lockfile`
4. `bun run lint`
5. `bun run check`
6. `bunx prettier --check '**/*.astro'`
7. `bun run build`

Dependabot (`.github/dependabot.yml`) — bun + github-actions weekly, minor + patch zgrupowane w 1 PR.

## Struktura

Pełna struktura w [`project-plan.md`](./project-plan.md) sekcja 4. Skrót:

```
src/
├── components/{ui,layout,sections,theme,contact}/   # kebab-case
├── content/{services,projects,experience,blog}/
├── data/                  # site-config, navigation
├── layouts/
├── pages/
├── scripts/               # vanilla TS, ładowane przez <script>
├── stores/                # nanostores
├── styles/                # tokens.css, global.css
├── lib/                   # seo, validators
└── actions/               # Astro Actions (Faza 9)
```

Path aliasy: `@/components`, `@/layouts`, `@/lib`, `@/scripts`, `@/styles`, `@/data`, `@/content`, `@/stores`, `@/assets`.

## Deploy

Cloudflare Pages (Faza 7+):

- Framework preset: **Astro**
- Build command: `bun run build`
- Build output: `dist`
- Build runtime: `BUN_VERSION=1.3` (env var)
- Production env: `PUBLIC_SITE_URL=https://kacperadler.pl`

Per-PR preview deploy automatycznie z `*.pages.dev`. Custom domain + auto SSL po podpięciu DNS.
