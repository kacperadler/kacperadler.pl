// @ts-check
import { fileURLToPath } from "node:url";
import mdx from "@astrojs/mdx";
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

// https://astro.build/config
export default defineConfig({
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
  ],
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
