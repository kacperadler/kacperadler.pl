export const siteConfig = {
  // Self-hosted Umami analytics. No cookies, no fingerprinting, no
  // third party - the script only loads in PROD and respects the
  // visitor's Do Not Track setting (see base-head.astro).
  analytics: {
    umamiUrl: "https://analytics.kacperadler.pl",
    umamiWebsiteId: "937a952a-548b-4e9d-ba9a-d511be5454f6",
  },
  description:
    "Aplikacje webowe, narzędzia B2B i landing pages - od architektury po deploy. Pracuję w sprintach, async, z zespołami produktowymi w PL/EU.",
  email: "kontakt@kacperadler.pl",
  lang: "pl",
  locale: "pl-PL",
  name: "Kacper Adler",
  // Public NocoDB shared form view endpoint. The UUID is not a secret
  // (it appears in the client bundle); spam protection is layered via
  // honeypot field + manual moderation in NocoDB.
  nocodbFormUrl:
    "https://crm.kacperadler.pl/api/v1/db/public/shared-view/3f05fcfa-3df7-4e2a-9eb1-4c9538c14c12/rows",
  ogImage: "/og-default.png",
  role: "Frontend Engineer",
  social: {
    github: "https://github.com/kacperadler",
    linkedin: "https://www.linkedin.com/in/kacperadler/",
  },
  tagline:
    "Buduję interfejsy dla produktów, z których ludzie korzystają codziennie.",
  url: "https://kacperadler.pl",
} as const;

export type SiteConfig = typeof siteConfig;
