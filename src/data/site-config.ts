export const siteConfig = {
  name: "Kacper Adler",
  role: "Frontend Engineer",
  tagline: "Interfejsy dla produktów, z których ludzie korzystają codziennie.",
  description:
    "Aplikacje webowe, narzędzia B2B i landing pages dla Twoich produktów. React, TypeScript, React Native, Next.js — ~5 lat. Polska, B2B.",
  url: "https://kacperadler.pl",
  locale: "pl-PL",
  lang: "pl",
  email: "kontakt@kacperadler.pl",
  social: {
    github: "https://github.com/kacperadler",
    linkedin: "https://www.linkedin.com/in/kacperadler/",
  },
  ogImage: "/og-default.png",
} as const;

export type SiteConfig = typeof siteConfig;
