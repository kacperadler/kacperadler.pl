// @ts-check
import { fileURLToPath } from "node:url";
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import icon from "astro-icon";

/** @param {string} path */
const r = (path) => fileURLToPath(new URL(path, import.meta.url));

/* The component catalogue and the design proposals are a dev tool: `astro
 * dev` serves them at /ui, /ui/proposal and /ui/proposal/<id>, the
 * production build never sees them (no dist/ui/, no sitemap entry). The
 * pages live in src/pages/_ui/, which Astro skips when it collects routes,
 * and this integration routes them only for the dev server. */
/** @type {import("astro").AstroIntegration} */
const uiCatalogue = {
  hooks: {
    "astro:config:setup": ({ command, injectRoute }) => {
      if (command === "dev") {
        injectRoute({
          entrypoint: "./src/pages/_ui/index.astro",
          pattern: "/ui",
        });
        injectRoute({
          entrypoint: "./src/pages/_ui/proposal/index.astro",
          pattern: "/ui/proposal",
        });
        injectRoute({
          entrypoint: "./src/pages/_ui/proposal/[id].astro",
          pattern: "/ui/proposal/[id]",
        });
      }
    },
  },
  name: "ui-catalogue",
};

/* The e2e build (E2E_FIXTURES=1, playwright.config.ts) gets a paginated
 * list at /lista/ with the pagination "go to page" field, which
 * pagination-jump.spec.ts serves through nginx.conf. No other build has it. */
/** @type {import("astro").AstroIntegration} */
const paginationFixture = {
  hooks: {
    "astro:config:setup": ({ injectRoute }) => {
      if (process.env.E2E_FIXTURES === "1") {
        injectRoute({
          entrypoint: "./tests/fixtures/pagination/list.astro",
          pattern: "/lista/[...page]",
        });
      }
    },
  },
  name: "pagination-fixture",
};

// https://astro.build/config
export default defineConfig({
  // The output stays static: every page is prerendered into dist/client/.
  // The Node adapter (a standalone server in dist/server/) runs only the
  // routes marked prerender = false - the lead store, src/pages/api/lead.ts.
  adapter: node({ mode: "standalone" }),

  // Astro 7 defaults to 'jsx' whitespace rules, which drop the space between
  // inline elements written on separate lines (e.g. "Ostatnia aktualizacja:"
  // and its date). Keep the HTML-aware compression the templates are written for;
  // Biome formats .astro markup by the same HTML whitespace rules.
  compressHTML: true,

  // astro-icon 1.2 has no option to skip local icons and warns when iconDir is
  // missing. All icons come from @iconify-json/lucide, so point it at an existing
  // folder with no SVGs (src/styles) and the local collection stays empty.
  integrations: [
    icon({ iconDir: "src/styles" }),
    sitemap(),
    mdx(),
    uiCatalogue,
    paginationFixture,
  ],

  // The adapter would turn on file-backed sessions; nothing here uses them.
  session: false,
  site: "https://kacperadler.pl",

  vite: {
    resolve: {
      alias: {
        "@/assets": r("./src/assets"),
        "@/components": r("./src/components"),
        "@/content": r("./src/content"),
        "@/data": r("./src/data"),
        "@/layouts": r("./src/layouts"),
        "@/lib": r("./src/lib"),
        "@/scripts": r("./src/scripts"),
        "@/styles": r("./src/styles"),
      },
    },
  },
});
