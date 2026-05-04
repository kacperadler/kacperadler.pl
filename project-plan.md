# kacperadler.pl — plan projektu

Migracja `example.html` (single-file prototyp) do produkcyjnego projektu Astro hostowanego na Cloudflare Pages, gotowego pod rozwój o blog.

---

## 1. Cele

- **1:1 funkcjonalność** względem `example.html` minus akcenty / tweaks panel (decyzja właściciela: tylko motyw light | dark | system, jeden akcent — navy)
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
- **`@astrojs/rss`** — RSS pod blog (Faza 10)
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
- **`nanostores`** — minimalny state share (theme między wyspami, jeśli zajdzie potrzeba)

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
| CSS approach | **Vanilla CSS + scoped `<style>` w `.astro`** | Design oparty na CSS variables + `light-dark()`; Tailwind/SCSS nie dodałyby wartości |
| Theming | **`light \| dark \| system` przez `light-dark()` + `color-scheme`** | "system" za free przez `prefers-color-scheme`, brak duplikacji w :root vs `[data-theme="dark"]`; jeden akcent (navy) |
| Naming convention plików | **kebab-case** | Decyzja właściciela; importy w PascalCase działają normalnie |
| FOUC prevention | **Inline script w `<head>`, `data-theme` na `<html>` tylko gdy forced** | Synchronicznie przed paint, system mode = brak atrybutu = @media |
| Active section | **IntersectionObserver z rootMargin** | Tańszy i bardziej deterministyczny niż scroll listener |
| Form (na teraz) | **Mock + `console.info` payload + state machine na buttonie** | Bez wysyłki; gotowe do podpięcia Action |
| Form (potem) | **Astro Actions + Zod + Resend** | Walidacja shared client/server, type-safe |
| Hosting (start) | **CF Pages static** (bez adaptera) | Zero coldstart, najszybszy TTFB; form i tak mockowany |
| Hosting (potem) | **CF Pages + `@astrojs/cloudflare` w hybrid mode** | Jak będzie real form: home/blog static, `/actions/contact` jako Function |
| Fonts | **Self-hosted Geist (variable woff2 w `public/fonts`)** | -1 preconnect, -50ms FCP, GDPR-friendly |
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
│   │   │   └── theme-fab.astro       # 3-state: light | dark | system
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
│   │   ├── tokens.css               # CSS variables + light-dark() + @font-face
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
| 1 | Motyw `light \| dark \| system` (3-state), persist do localStorage, system = `prefers-color-scheme` | `theme-script.astro` (inline w head) + `scripts/theme.ts` + `theme-fab.astro` |
| 2 | Sticky nav z `.scrolled` po >12px | `scripts/nav-scroll.ts` |
| 3 | Active section w menu (IO zamiast scroll) | `scripts/nav-active.ts` |
| 4 | CTA "Kontakt" przejmuje active w sekcji #contact | `scripts/nav-active.ts` (data-cta-active) |
| 5 | Mobile sheet (burger overlay) | `scripts/mobile-sheet.ts` + `mobile-sheet.astro` |
| 6 | Hero — chips technologiczne, hero-card | `sections/hero.astro` |
| 7 | Services grid (3 kafelki) | `sections/services.astro` + `content/services` |
| 8 | Projects grid (n kafelków) | `sections/projects.astro` + `content/projects` |
| 9 | How-I-work — auto-cycle flow nodes co 2.6s + hover sync | `scripts/flow-cycle.ts` (z Page Visibility API) |
| 10 | Experience timeline | `sections/experience.astro` + `content/experience` |
| 11 | Collapsible expand/collapse z animacją max-height | `scripts/timeline-collapse.ts` (+ reduced-motion) |
| 12 | Reveal-on-scroll | `scripts/reveal.ts` |
| 13 | Contact form — validation, button states, success | `contact-form.astro` + `scripts/contact-form.ts` |
| 14 | Footer z social linkami | `layout/footer.astro` |

### Form — state machine na buttonie (nowość vs prototyp)

```ts
type FormState = 'idle' | 'submitting' | 'success' | 'error';
```
- `aria-busy="true"` przy submitting
- `aria-live="polite"` na success message
- Mock: `console.info('[contact]', payload)` + setTimeout, gotowe do zamiany na `actions.contact()`
- CSS: `.btn-submit[data-state="success"]` — wizualny feedback

### Theme — anty-FOUC + 3-state (nowość vs prototyp)

Model: `light | dark | system`. CSS używa `light-dark()` + `color-scheme: light dark` na `:root`. Kiedy user wymusi `light` lub `dark`, JS ustawia `data-theme` na `<html>`, co zmienia `color-scheme` i tym samym `light-dark()`. Tryb `system` = brak atrybutu = `prefers-color-scheme` rządzi automatycznie.

Inline w `<head>` przed pierwszym paint:
```js
(() => {
  try {
    const stored = localStorage.getItem('ka:theme');
    if (stored === 'light' || stored === 'dark') {
      document.documentElement.dataset.theme = stored;
    }
    // null lub "system" → brak atrybutu → @media (prefers-color-scheme) via light-dark()
  } catch {}
})();
```

**Uwaga:** `data-theme` przenosimy z `<body>` na `<html>` — krótszy CSS, lepsza zgodność z View Transitions. Akcent (navy/slate/royal) z prototypu wyrzucony — tylko jedna paleta (navy).

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
- [x] `styles/tokens.css` — CSS variables (light/dark via `light-dark()`, navy single accent) + `@font-face`
- [x] `styles/global.css` — reset + body + `prefers-reduced-motion`
- [x] `public/fonts/` — Geist + Geist Mono (Variable woff2 z vercel/geist-font), `font-display: swap`
- [x] `components/layout/theme-script.astro` (inline anty-FOUC) — render w `<head>`
- [x] `layouts/base-layout.astro` z `<ClientRouter />`
- [x] `components/layout/base-head.astro` — meta, OG, Twitter, JSON-LD `Person` + `WebSite`, font preload (sitemap link odłożony do Fazy 6)
- [x] `data/site-config.ts`, `data/navigation.ts`, `lib/seo.ts`

### Faza 2 — layout shell
- [x] `layout/header.astro` (sticky wrap) + `layout/nav.astro` (desktop nav)
- [x] `layout/mobile-sheet.astro` (overlay; markup inert do F5)
- [x] `layout/footer.astro` + social links (icons via `astro-icon` + `@iconify-json/lucide`)
- [x] `theme/theme-fab.astro` — 3-state toggle (`light | dark | system`); markup + a11y, JS w F5

### Faza 3 — content collections
- [x] `src/content.config.ts` — Zod schemas (services, projects, experience, blog) z `import { z } from "astro/zod"` (Astro 5/6+ canonical)
- [x] Migracja danych z `example.html` do JSON: 3 services, 4 placeholder projects, 7 experience items
- [x] (placeholder) `content/blog/` + schema; brak wpisów do Fazy 8

### Faza 4 — sekcje home
- [x] UI primitives: `ui/{button,chip,tag,section-head}.astro`
- [x] `sections/hero.astro` (eyebrow z pulse, hero-grid, hero-card kv)
- [x] `sections/services.astro` (mapowanie z collection, sortowanie po `order`)
- [x] `sections/projects.astro` (mapowanie + cover gradient + glyph; filtruje `draft: true`)
- [x] `sections/how-i-work.astro` — zigzag timeline (file-tab header + 5 kart naprzemiennie L/R wokół centralnej osi, badge'e czasu na connectorach, statusbar footer); mobile = wszystko po prawej linii à la Experience
- [x] `sections/experience.astro` (timeline + collapsible markup; toggle JS w F5)
- [x] `sections/contact.astro` (info + form + contact-link), `contact/contact-form.astro`, `contact/contact-link.astro`
- [x] `pages/index.astro` — kompozycja sekcji
- [ ] `pages/projects/[slug].astro` — case-study route (decyzja sekcja 8); odłożone do real content

### Faza 5 — interakcje
- [x] ~~`scripts/theme.ts`~~ — wbudowany w `theme-fab.astro` (inline `<script>`, event delegation na `document`, sync na `astro:page-load`); wjechał już w F2 bo bez tego UX wyglądał jak bug
- [x] `scripts/nav-scroll.ts` — rAF-throttled scrollY > 12 → `.scrolled` na `[data-nav-wrap]`
- [x] `scripts/nav-active.ts` — IO + CTA contact special case (#contact ⇒ aktywne CTA, nie link)
- [x] `scripts/mobile-sheet.ts` — open/close + Escape + body-scroll lock + auto-close po kliknięciu linka
- [x] ~~`scripts/flow-cycle.ts`~~ — DROPPED. Sekcja how-i-work przeprojektowana na zigzag timeline (jeden komponent zamiast aside + list); auto-cycle stracił sens, hover state to czysty CSS
- [x] `scripts/timeline-collapse.ts` — class-based + CSS max-height transition (4000px gen. cap zamiast scrollHeight calc)
- [x] `scripts/reveal.ts` — IO once-only `.in` toggle, reduced-motion = instant final state
- [x] `scripts/contact-form.ts` — `idle | submitting | success | error` state machine, email/type/message validation, `console.info` mock z 600ms delay

### Faza 6 — SEO + a11y + polish ✅ DONE
- [x] `@astrojs/sitemap` + `public/robots.txt` (z linkiem do sitemap-index.xml)
- [x] OG image (1200×630) — `src/pages/og-default.png.ts` build-time endpoint przez sharp + SVG; zdjęcie po lewej (smart-crop), brand typografia po prawej
- [x] JSON-LD `Person` + `WebSite` — wjechało już w F1 (`src/lib/seo.ts`)
- [x] `aria-live="polite"` na form-success (F4), `aria-busy` na submit (F5), `aria-current="location"` na active nav link (F6)
- [x] `404.astro` — z BaseLayout(`noindex`), brand mark, dwa CTA (home + contact)
- [x] Skip-to-content link + globalne `:focus-visible` outline na każdym interactive (a11y baseline)
- [x] Heading hierarchy linear (h1 → h2 → h3) — fix `h4 → h3` w how-i-work step-cards po Lighthouse a11y findingu
- [x] **Lighthouse mobile 100/100/100/100** — Performance / A11y / Best Practices / SEO. Cel z sekcji 9 osiągnięty.
- [→ F7] **axe-core audit przez Playwright** — odłożone do F7 razem z E2E setupem (jeden wspólny `bun add -D @playwright/test @axe-core/playwright`)
- [→ post-deploy] Re-run Lighthouse z prawdziwej domeny po podpięciu CF Pages — sanity check na real network / brotli / CDN edge (zwykle wynik *lepszy* niż localhost)

### Faza 7 — copy improvement
*(Wcześniej Faza 8 — przeniesione przed deploy: nie chcemy `kacperadler.pl` na żywo z "Projekt placeholder × 4", a piszemy E2E testy raz przeciw realnemu copy zamiast iterować selektory po contencie.)*

- [ ] **`siteConfig`** (`src/data/site-config.ts`) — `name`, `role`, `tagline`, `description`, social handles, e-mail
- [ ] **Hero** — eyebrow ("Frontend Engineer · Polska"), `<h1>`, hero-sub, hero-card facts (Model / Lokalizacja / Języki / Czas odpowiedzi)
- [ ] **Services** (`content/services/*.json`) — opisy 3 serwisów (web-apps / landing-pages / internal-tools); rozważyć dodanie konkretnych liczb / metryk
- [ ] **Projects** (`content/projects/*.json`) — zastąpić 4 placeholdery (alpha/beta/gamma/delta) realnymi projektami z opisami case-study
- [ ] **How-I-work** — 5 kroków + headings + descriptions; aktualnie jest OK po zigzag refactorze, ale przejrzeć ton
- [ ] **Experience** (`content/experience/*.json`) — 7 wpisów timeline'a; doszlifować descriptions, sprawdzić daty / lokalizacje
- [ ] **Contact** — lead text, reply ("Odpowiadam zwykle w ciągu 24h"), spam disclaimer pod submit, success message
- [ ] **404** — copy "Tej strony nie ma" + paragraf — sprawdzić czy ton pasuje do reszty
- [ ] **Cross-section consistency audit**: konsekwentny ton (formalny vs swobodny), brak literówek, spójny mix PL/EN dla nazw technologii (np. "TypeScript" vs "Typescript")

### Faza 8 — testy + deploy
*(Wcześniej Faza 7 — po copy improvement, żeby E2E asserts trafiały od razu w finalną treść.)*

- [→ F9] ~~Vitest unit: `validators.ts`~~ — odłożone, `lib/validators.ts` powstaje dopiero w F9 razem z Zod schematem real form action. Teraz nic do testowania jednostkowo.
- [ ] **Playwright E2E** (`tests/e2e/*.spec.ts`):
  - theme persist (set dark → reload → still dark; system mode → no `data-theme`)
  - nav active scroll (scrollIntoView per section → odpowiedni link `.active` + `aria-current`)
  - contact CTA przejmuje active w sekcji `#contact`
  - mobile sheet open/close (hamburger click → `data-mobile-sheet="open"`; Escape close)
  - timeline expand/collapse (button click → `.expanded` toggle + button label swap)
  - contact form: invalid email → `data-invalid`; valid submit → `data-state="success"` + `data-show` na `.form-success`
  - skip-to-content link → focus reveals, click jumps to `#top`
- [ ] **axe-core a11y test** w Playwright (`@axe-core/playwright`) — runuje się jako jeden test w E2E suite, na wszystkich stronach (`/`, `/404`)
- [ ] **CI workflow update** (`.github/workflows/ci.yml`):
  - dodać job `e2e` z `bun playwright install --with-deps chromium` + `bun playwright test`
  - main job sekwencja: lint → check → prettier → build → e2e
- [ ] **Cloudflare Pages**:
  - Connect repo na CF dashboard
  - Build cmd: `bun run build`, output dir: `dist`
  - Env: `BUN_VERSION=1.3` + `PUBLIC_SITE_URL=https://kacperadler.pl`
  - Preview deploys per PR (`*.pages.dev`)
- [ ] **Custom domain** `kacperadler.pl` + DNS (CNAME → `kacperadler-pl.pages.dev`) + auto SSL
- [ ] **Post-deploy Lighthouse re-run** z prawdziwej domeny (sanity check)

### Faza 9 (przyszłość) — real form submit
- [ ] `bun astro add cloudflare` → `output: 'hybrid'` (lub server)
- [ ] `actions/index.ts` — `contact` action z Zod + Resend
- [ ] `lib/validators.ts` — schemat Zod współdzielony client/server
- [ ] Honeypot field + rate limit (CF KV)
- [ ] `scripts/contact-form.ts` — zamiana `console.info` mock na `actions.contact()`
- [ ] Sentry / CF Logpush dla błędów

### Faza 10 (przyszłość) — blog
- [ ] `bun astro add mdx` → `@astrojs/mdx` integration
- [ ] `pages/blog/index.astro` — lista z `getCollection('blog')`, sortowanie po `pubDate`
- [ ] `pages/blog/[slug].astro` — render MDX, TOC, prev/next
- [ ] `layouts/blog-post.astro` — meta na artykuł, breadcrumb, related posts
- [ ] `pages/rss.xml.ts` — `@astrojs/rss` feed
- [ ] Reading time, tagi, search (pagefind?)
- [ ] Per-post OG image (Satori / `@vercel/og`) generowany z tytułu

---

## 7. Cloudflare Pages — deployment

### Start (Faza 8) — static deploy

1. Push repo na GitHub (`main`)
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `bun run build`
   - Build output: `dist`
   - Build runtime: `BUN_VERSION=1.3` (env var)
4. Environment variables (Production):
   - `PUBLIC_SITE_URL=https://kacperadler.pl`
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

**Faza 0–6 — DONE.** Lighthouse mobile 100×4 ✅ (na localhost — re-run po deployu).

Następnie: **Faza 7 — copy improvement** (siteConfig + sekcje + content collections, audit tonu i spójności).

Potem: **Faza 8** testy + deploy → **Faza 9** real form submit → **Faza 10** blog.
