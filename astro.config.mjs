// @ts-check
import { fileURLToPath } from "node:url";
import sitemap from "@astrojs/sitemap";
import { defineConfig } from "astro/config";
import icon from "astro-icon";

/** @param {string} path */
const r = (path) => fileURLToPath(new URL(path, import.meta.url));

// https://astro.build/config
export default defineConfig({
  site: "https://kacperadler.pl",

  vite: {
    resolve: {
      alias: {
        "@/components": r("./src/components"),
        "@/layouts": r("./src/layouts"),
        "@/lib": r("./src/lib"),
        "@/scripts": r("./src/scripts"),
        "@/styles": r("./src/styles"),
        "@/data": r("./src/data"),
        "@/content": r("./src/content"),
        "@/stores": r("./src/stores"),
        "@/assets": r("./src/assets"),
      },
    },
  },

  integrations: [
    icon(),
    sitemap({
      // /v2 is the redesign staging route; it's noindex via meta but
      // we also keep it out of the sitemap so we don't even advertise
      // its existence to crawlers.
      filter: (page) => !(page.endsWith("/v2/") || page.endsWith("/v2")),
    }),
  ],
});
