export const siteConfig = {
  name: "Kacper Adler",
  role: "Frontend Engineer",
  tagline:
    "Buduję interfejsy dla produktów, z których ludzie korzystają codziennie.",
  description:
    "Aplikacje webowe, narzędzia B2B i landing pages - od architektury po deploy. Pracuję w sprintach, async, z zespołami produktowymi w PL/EU.",
  url: "https://kacperadler.pl",
  locale: "pl-PL",
  lang: "pl",
  email: "kontakt@kacperadler.pl",
  social: {
    github: "https://github.com/kacperadler",
    linkedin: "https://www.linkedin.com/in/kacperadler/",
  },
  ogImage: "/og-default.png",
  // Public NocoDB shared form view endpoint. The UUID is not a secret
  // (it appears in the client bundle); spam protection is layered via
  // honeypot field + manual moderation in NocoDB.
  nocodbFormUrl:
    "https://crm.kacperadler.pl/api/v1/db/public/shared-view/3f05fcfa-3df7-4e2a-9eb1-4c9538c14c12/rows",
} as const;

export type SiteConfig = typeof siteConfig;
