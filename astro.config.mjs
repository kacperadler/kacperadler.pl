// @ts-check
import { fileURLToPath } from "node:url";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import icon from "astro-icon";

/** @param {string} path */
const r = (path) => fileURLToPath(new URL(path, import.meta.url));

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
  integrations: [icon({ iconDir: "src/styles" }), sitemap(), mdx()],
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
