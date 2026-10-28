// @ts-check
import { fileURLToPath } from "node:url";
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import icon from "astro-icon";

/** @param {string} path */
const r = (path) => fileURLToPath(new URL(path, import.meta.url));

/* The component catalogue is a dev tool: `astro dev` serves it at /ui, the
 * production build never sees it (no dist/ui/, no sitemap entry). The page
 * lives in src/pages/_ui/, which Astro skips when it collects routes, and
 * this integration routes it only for the dev server. */
/** @type {import("astro").AstroIntegration} */
const uiCatalogue = {
  hooks: {
    "astro:config:setup": ({ command, injectRoute }) => {
      if (command === "dev") {
        injectRoute({
          entrypoint: "./src/pages/_ui/index.astro",
          pattern: "/ui",
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

    // The e2e dev server (playwright.config.ts sets E2E_DEV_NO_WATCH=1)
    // ignores every path, so no file written during the run - a commit's
    // lint-staged fix of a source file, astro check, an edit - makes it
    // reload the page a running spec holds or restart. Astro keeps its own
    // watch.ignored unset in dev, and a null watch would not survive the
    // merge with it, so the matcher is a function that ignores everything.
    server:
      process.env.E2E_DEV_NO_WATCH === "1"
        ? { watch: { ignored: () => true } }
        : {},
  },
});
