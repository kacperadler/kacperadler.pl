// @ts-check
import { fileURLToPath } from "node:url";
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
  // .prettierrc mirrors it as astroCompressHTML so formatting never changes output.
  compressHTML: true,

  integrations: [icon(), sitemap()],
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
        "@/stores": r("./src/stores"),
        "@/styles": r("./src/styles"),
      },
    },
  },
});
