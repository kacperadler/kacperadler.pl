# kacperadler.pl — plan projektu

Migracja `example.html` (single-file prototyp) do produkcyjnego projektu Astro hostowanego na Cloudflare Pages, gotowego pod rozwój o blog.

---

## 1. Cele

- **1:1 funkcjonalność** względem `example.html` (motyw, akcent, active nav, flow cycle, timeline collapse, reveal, form, mobile sheet)
- **Lepsze fundamenty** niż prototyp: brak FOUC, lepsze a11y, IntersectionObserver zamiast scroll listenera, structured data, OG, sitemap
- **Gotowe pod blog** — content collections + layouty + RSS + ClientRouter zaprojektowane od początku
- **Lighthouse 100/100/100/100** na home (cel mierzalny przed deployem)
- **Hosting: Cloudflare Pages** (start jako static, hybrid później pod prawdziwy form)

---

## 2. Stack — final list

### Core
- **Astro 6.x** (TypeScript strict) — zainstalowane: 6.1.10
- **`@astrojs/check`** + `typescript` — type checking dla `.astro`
- **`@astrojs/mdx`** — pod blog i case-studies projektów (Faza 3)
- **`@astrojs/sitemap`** — auto-sitemap (Faza 6)
- **`@astrojs/rss`** — RSS pod blog (Faza 8)
- **`astro:assets` + `<Image />`** — auto-optymalizacja obrazków
- **`<ClientRouter />`** (View Transitions) — płynne przejścia
- **`astro-icon`** + `lucide` icon set — zamiast inline SVG

### Tooling
- **`ultracite`** (7.x) — Biome preset (lint + format dla TS/JS/JSON/CSS); `.astro` formatting wyłączony w `biome.jsonc` (przejmuje prettier)
- **`prettier` + `prettier-plugin-astro`** — formatowanie plików `.astro` (Biome formatuje pod nim niespójnie z Astro)
- **`husky` + `lint-staged`** — pre-commit hooks (`lint-staged` + `astro check`)
- **`bun`** — package manager (Node 22+)

### Runtime helpers
- **`zod`** — schemy dla content collections + walidacja form
- **`nanostores`** — minimalny state share (theme/accent między wyspami, jeśli zajdzie potrzeba)

### Testing
- **`vitest`** — unit (validators, helpers)
- **`@playwright/test`** — E2E: theme persist, nav active, form validation, mobile sheet

### Hosting
- **Cloudflare Pages** — statyczny deploy z gita, auto preview per branch
- **`wrangler`** (dev dependency) — lokalny preview + przyszłe Functions

### Później (Faza 7+)
- **`@astrojs/cloudflare`** — adapter pod hybrid SSR
- **Resend** lub **Plunk** — wysyłka maila z formularza
- **`partytown`** — analytics off-main-thread (gdy dojdzie GA/Plausible)

---

## 3. Decyzje architektoniczne

| Decyzja | Wybór | Uzasadnienie |
|---|---|---|
| CSS approach | **Vanilla CSS + scoped `<style>` w `.astro`** | Design opiera się na CSS variables (10+ tokenów × 2 themes × 3 akcenty) — Tailwind nie dodałby wartości |
| Naming convention plików | **kebab-case** | Decyzja właściciela; importy w PascalCase działają normalnie |
| FOUC prevention | **Inline script w `<head>`, `data-theme` na `<html>`** | Synchronicznie przed paint, zero błysku |
| Active section | **IntersectionObserver z rootMargin** | Tańszy i bardziej deterministyczny niż scroll listener |
| Form (na teraz) | **Mock + `console.info` payload + state machine na buttonie** | Bez wysyłki; gotowe do podpięcia Action |
| Form (potem) | **Astro Actions + Zod + Resend** | Walidacja shared client/server, type-safe |
| Hosting (start) | **CF Pages static** (bez adaptera) | Zero coldstart, najszybszy TTFB; form i tak mockowany |
| Hosting (potem) | **CF Pages + `@astrojs/cloudflare` w hybrid mode** | Jak będzie real form: home/blog static, `/actions/contact` jako Function |
| Tweaks panel w prod | **Wyłączony przez env flag** | `PUBLIC_ENABLE_TWEAKS=false` w prod; kod zostaje pod edit-mode |
| Fonts | **Self-hosted Geist (woff2 w `public/fonts`)** | -1 preconnect, -50ms FCP, GDPR-friendly |
| Icons | **`astro-icon` + lucide** | Sprite, tree-shake, mniejszy HTML |

---

## 4. Struktura katalogów

```
kacperadler.pl/
├── public/
│   ├── fonts/                       # self-hosted Geist
│   ├── favicon.svg
│   ├── og-default.png
│   └── robots.txt
├── src/
│   ├── assets/
│   │   └── projects/                # cover images projektów
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.astro         # variants: primary | ghost | submit
│   │   │   ├── chip.astro
│   │   │   ├── tag.astro
│   │   │   ├── section-head.astro
│   │   │   └── icon.astro
│   │   ├── layout/
│   │   │   ├── base-head.astro      # meta, OG, fonts, JSON-LD
│   │   │   ├── theme-script.astro   # inline anty-FOUC
│   │   │   ├── header.astro
│   │   │   ├── nav.astro
│   │   │   ├── mobile-sheet.astro
│   │   │   └── footer.astro
│   │   ├── sections/                # tylko home
│   │   │   ├── hero.astro
│   │   │   ├── services.astro
│   │   │   ├── projects.astro
│   │   │   ├── how-i-work.astro
│   │   │   ├── experience.astro
│   │   │   └── contact.astro
│   │   ├── theme/
│   │   │   ├── theme-fab.astro
│   │   │   └── tweaks-panel.astro
│   │   └── contact/
│   │       ├── contact-form.astro
│   │       └── contact-links.astro
│   ├── content/
│   │   ├── config.ts                # Zod schemas
│   │   ├── services/                # JSON
│   │   ├── projects/                # MDX (rich case-study w przyszłości)
│   │   ├── experience/              # JSON
│   │   └── blog/                    # MDX — PRZYSZŁOŚĆ
│   ├── data/
│   │   ├── site-config.ts
│   │   └── navigation.ts
│   ├── layouts/
│   │   ├── base-layout.astro
│   │   └── blog-post.astro          # PRZYSZŁOŚĆ
│   ├── pages/
│   │   ├── index.astro
│   │   ├── 404.astro
│   │   ├── rss.xml.ts               # PRZYSZŁOŚĆ
│   │   └── blog/                    # PRZYSZŁOŚĆ
│   │       ├── index.astro
│   │       └── [slug].astro
│   ├── scripts/                     # vanilla TS, ładowane przez <script>
│   │   ├── theme.ts
│   │   ├── nav-active.ts
│   │   ├── nav-scroll.ts
│   │   ├── mobile-sheet.ts
│   │   ├── flow-cycle.ts
│   │   ├── timeline-collapse.ts
│   │   ├── reveal.ts
│   │   └── contact-form.ts
│   ├── stores/
│   │   └── theme.ts                 # nanostores
│   ├── styles/
│   │   ├── global.css
│   │   ├── tokens.css               # CSS variables, themes, accents
│   │   └── utilities.css
│   ├── lib/
│   │   ├── seo.ts
│   │   └── validators.ts
│   ├── actions/                     # Astro Actions — PRZYSZŁOŚĆ
│   │   └── index.ts
│   └── env.d.ts
├── tests/
│   ├── unit/
│   └── e2e/
├── astro.config.mjs
├── biome.json                       # generowany przez ultracite init
├── .prettierrc                      # tylko dla *.astro
├── tsconfig.json                    # strict + path aliases
├── wrangler.toml
├── package.json
├── .gitignore
├── .nvmrc                           # Node 20
└── README.md
```

---

## 5. Mapa funkcjonalności (z `example.html` → Astro)

| # | Funkcja | Lokalizacja |
|---|---|---|
| 1 | Motyw light/dark, persist + prefers-color-scheme fallback | `theme-script.astro` (inline w head) + `scripts/theme.ts` |
| 2 | Akcent (navy/slate/royal) | `scripts/theme.ts` + `tokens.css` |
| 3 | Tweaks panel (postMessage edit-mode) | `tweaks-panel.astro`, opt-in via env flag |
| 4 | Sticky nav z `.scrolled` po >12px | `scripts/nav-scroll.ts` |
| 5 | Active section w menu (IO zamiast scroll) | `scripts/nav-active.ts` |
| 6 | CTA "Kontakt" przejmuje active w sekcji #contact | `scripts/nav-active.ts` (data-cta-active) |
| 7 | Mobile sheet (burger overlay) | `scripts/mobile-sheet.ts` + `mobile-sheet.astro` |
| 8 | Hero — chips technologiczne, hero-card | `sections/hero.astro` |
| 9 | Services grid (3 kafelki) | `sections/services.astro` + `content/services` |
| 10 | Projects grid (n kafelków) | `sections/projects.astro` + `content/projects` |
| 11 | How-I-work — auto-cycle flow nodes co 2.6s + hover sync | `scripts/flow-cycle.ts` (z Page Visibility API) |
| 12 | Experience timeline | `sections/experience.astro` + `content/experience` |
| 13 | Collapsible expand/collapse z animacją max-height | `scripts/timeline-collapse.ts` (+ reduced-motion) |
| 14 | Reveal-on-scroll | `scripts/reveal.ts` |
| 15 | Contact form — validation, button states, success | `contact-form.astro` + `scripts/contact-form.ts` |
| 16 | Footer z social linkami | `layout/footer.astro` |

### Form — state machine na buttonie (nowość vs prototyp)

```ts
type FormState = 'idle' | 'submitting' | 'success' | 'error';
```
- `aria-busy="true"` przy submitting
- `aria-live="polite"` na success message
- Mock: `console.info('[contact]', payload)` + setTimeout, gotowe do zamiany na `actions.contact()`
- CSS: `.btn-submit[data-state="success"]` — wizualny feedback

### Theme — anty-FOUC (nowość vs prototyp)

Inline w `<head>` przed pierwszym paint:
```js
(function () {
  try {
    const stored = localStorage.getItem('ka:theme');
    const accent = localStorage.getItem('ka:accent') || 'navy';
    const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = stored ?? (prefersDark ? 'dark' : 'light');
    document.documentElement.dataset.accent = accent;
  } catch {}
})();
```
**Uwaga:** `data-theme` przenosimy z `<body>` na `<html>` — krótszy CSS, lepsza zgodność z View Transitions.

---

## 6. Plan implementacji — fazy

### Faza 0 — scaffolding
- [x] `bun create astro@latest` (Empty + TypeScript strict) — pre-existing
- [x] `git init`, `.gitignore`, `.nvmrc` (Node 22)
- [x] `bunx ultracite@latest init` (Biome) → `.astro` excluded, prettier formatuje
- [x] `prettier` + `prettier-plugin-astro` + `.prettierrc` + `.prettierignore`
- [x] Husky + lint-staged: pre-commit `lint-staged` + `astro check`
- [x] tsconfig path aliases: `@/components`, `@/layouts`, `@/lib`, `@/scripts`, `@/styles`, `@/data`, `@/content`, `@/stores`, `@/assets`
- [x] Skrypty w `package.json`: `dev`, `build`, `preview`, `astro`, `check`, `lint`, `format`, `test`
- [x] `wrangler.toml` (CF Pages config od początku)
- [x] `astro.config.mjs` — `site` URL + vite alias mirror

### Faza 1 — fundamenty
- [x] `styles/tokens.css` — CSS variables (light/dark × navy/slate/royal) + `@font-face`
- [x] `styles/global.css` — reset + body + `prefers-reduced-motion`
- [x] `public/fonts/` — Geist + Geist Mono (Variable woff2 z vercel/geist-font), `font-display: swap`
- [x] `components/layout/theme-script.astro` (inline anty-FOUC) — render w `<head>`
- [x] `layouts/base-layout.astro` z `<ClientRouter />`
- [x] `components/layout/base-head.astro` — meta, OG, Twitter, JSON-LD `Person` + `WebSite`, font preload (sitemap link odłożony do Fazy 6)
- [x] `data/site-config.ts`, `data/navigation.ts`, `lib/seo.ts`

### Faza 2 — layout shell
- [ ] `layout/header.astro` + `layout/nav.astro`
- [ ] `layout/mobile-sheet.astro`
- [ ] `layout/footer.astro` + social links (icons via `astro-icon`)
- [ ] `theme/theme-fab.astro`
- [ ] `theme/tweaks-panel.astro` (opt-in via `PUBLIC_ENABLE_TWEAKS`)

### Faza 3 — content collections
- [ ] `content/config.ts` — Zod schemas (services, projects, experience)
- [ ] Migracja danych z `example.html` do plików w `content/`
- [ ] (placeholder) `content/blog/` + schema, ale bez stron jeszcze

### Faza 4 — sekcje home
- [ ] `sections/hero.astro` (eyebrow z animacją pulse, hero-grid, hero-card kv)
- [ ] `sections/services.astro` (mapowanie z collection)
- [ ] `sections/projects.astro` (mapowanie + cover gradient)
- [ ] `sections/how-i-work.astro` (flow-visual + lista)
- [ ] `sections/experience.astro` (timeline + collapsible)
- [ ] `sections/contact.astro` (info + form)
- [ ] `pages/index.astro` — kompozycja sekcji

### Faza 5 — interakcje
- [ ] `scripts/theme.ts` — fab toggle + tweaks panel + nanostore sync
- [ ] `scripts/nav-scroll.ts` — `.scrolled` state
- [ ] `scripts/nav-active.ts` — IO + CTA contact special case
- [ ] `scripts/mobile-sheet.ts`
- [ ] `scripts/flow-cycle.ts` — auto + hover sync + Page Visibility
- [ ] `scripts/timeline-collapse.ts` — animacja + `prefers-reduced-motion` skip
- [ ] `scripts/reveal.ts`
- [ ] `scripts/contact-form.ts` — state machine + walidacja + console.info mock

### Faza 6 — SEO + a11y + polish
- [ ] `@astrojs/sitemap` + `robots.txt`
- [ ] OG image (1200×630) — statyczny lub generator
- [ ] JSON-LD `Person` + `WebSite`
- [ ] `aria-live` na form-success, `aria-busy` na submit, `aria-current` na active link
- [ ] `404.astro`
- [ ] Lighthouse audit — cel 100×4
- [ ] axe-core audit przez Playwright

### Faza 7 — testy + deploy
- [ ] Vitest unit: `validators.ts` (email regex, form schema)
- [ ] Playwright E2E:
  - theme persist (set dark → reload → still dark)
  - nav active scroll
  - mobile sheet open/close
  - form invalid → error states, valid → success
  - timeline expand/collapse
- [ ] CI (GitHub Actions): `pnpm install` → `pnpm check` → `pnpm test` → `pnpm build`
- [ ] Cloudflare Pages: connect repo, build cmd `pnpm build`, output `dist`
- [ ] Custom domain `kacperadler.pl` + DNS

### Faza 8 (przyszłość) — blog
- [ ] `pages/blog/index.astro` — lista z `getCollection('blog')`
- [ ] `pages/blog/[slug].astro` — render MDX, TOC, prev/next
- [ ] `layouts/blog-post.astro`
- [ ] `pages/rss.xml.ts`
- [ ] Reading time, tagi, search (pagefind?)

### Faza 9 (przyszłość) — real form submit
- [ ] `pnpm astro add cloudflare` → `output: 'hybrid'`
- [ ] `actions/index.ts` — `contact` action z Zod + Resend
- [ ] Honeypot field + rate limit (CF KV)
- [ ] `scripts/contact-form.ts` — zamiana `console.info` na `actions.contact()`
- [ ] Sentry / CF Logpush dla błędów

---

## 7. Cloudflare Pages — deployment

### Start (Faza 7) — static deploy

1. Push repo na GitHub (`main`)
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `pnpm build`
   - Build output: `dist`
   - Node version: `20`
4. Environment variables (Production):
   - `PUBLIC_SITE_URL=https://kacperadler.pl`
   - `PUBLIC_ENABLE_TWEAKS=false`
5. Custom domain: kacperadler.pl + auto SSL
6. Preview deploys: każdy PR dostaje URL `*.pages.dev`

### `wrangler.toml` (od początku w repo)
```toml
name = "kacperadler-pl"
compatibility_date = "2026-04-01"
pages_build_output_dir = "./dist"
```

### Migracja do hybrid (Faza 9)
```bash
pnpm astro add cloudflare
```
```js
// astro.config.mjs
export default defineConfig({
  adapter: cloudflare(),
  output: 'hybrid',  // home/blog statyczne, akcje on-demand
});
// pages/index.astro: export const prerender = true;
// actions/index.ts: bez prerender — działa jako Function
```

---

## 8. Otwarte decyzje (do potwierdzenia w trakcie / przed startem)

- **OG image generator** — statyczny PNG czy on-the-fly (Satori)? Default: statyczny do czasu blogu, potem Satori per post
- **Email obfuscation** — Cloudflare email-decode tag jest aktywny w prototypie. Pominąć (bot odporność i tak słaba) czy zachować przez CF?
- **Analytics** — Plausible, Cloudflare Web Analytics, czy nic? Default: CF Web Analytics (free, privacy-first, zero JS)
- **Real form provider** — Resend (3000 maili/mc free), Plunk, czy Formspree? Default: Resend gdy dojdzie Faza 9
- **Czy hostować case-studies projektów na osobnych podstronach?** `pages/projects/[slug].astro` — natywne dla content collection. Default: TAK, w Fazie 4 dodać podstrony

---

## 9. Definicja "done" dla home

Przed deployem produkcyjnym:
- [ ] Lighthouse mobile: Performance ≥95, A11y 100, Best Practices 100, SEO 100
- [ ] CLS < 0.05, LCP < 2s, INP < 200ms (na 4G)
- [ ] Brak FOUC theme przy pierwszym wejściu w light/dark
- [ ] Działa bez JS (graceful degradation): treść widoczna, linki działają, form pokazuje natywną walidację
- [ ] `prefers-reduced-motion` szanowane wszędzie
- [ ] Keyboard nav: Tab przez wszystkie interaktywne, focus visible, Esc zamyka mobile sheet
- [ ] Screen reader: nav, form, theme toggle mają sensowne labele
- [ ] Test na realnym mobilnym device (iOS Safari, Android Chrome)

---

## 10. Następny krok

**Faza 0 + 1 — DONE.** Faza 2 — layout shell: `header.astro`, `nav.astro`, `mobile-sheet.astro`, `footer.astro` + theme-fab + tweaks-panel (opt-in env flag).
