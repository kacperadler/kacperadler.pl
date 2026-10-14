export const siteConfig = {
  // Self-hosted Umami analytics. No cookies, no fingerprinting, no
  // third party - the script only loads in PROD and respects the
  // visitor's Do Not Track setting (see base-head.astro).
  analytics: {
    umamiUrl: "https://analytics.kacperadler.pl",
    umamiWebsiteId: "937a952a-548b-4e9d-ba9a-d511be5454f6",
  },
  description:
    "Automatyzuję ręczną pracę w firmach z pomocą AI: agenci, integracje, narzędzia wewnętrzne. Audyt, wdrożenie i stała opieka, bez zatrudniania działu IT.",
  email: "kontakt@kacperadler.pl",
  lang: "pl",
  locale: "pl-PL",
  name: "Kacper Adler",
  ogImage: "/og-default.png",
  role: "AI Engineer · Partner technologiczny",
  social: {
    github: "https://github.com/kacperadler",
    linkedin: "https://www.linkedin.com/in/kacperadler/",
  },
  tagline: "Wdrożenia AI i automatyzacje dla firm.",
  // The home page's <title>; other pages are "<page> - <name>".
  title: "Wdrożenia AI i automatyzacje dla firm | Kacper Adler",
  url: "https://kacperadler.pl",
} as const;

export type SiteConfig = typeof siteConfig;
