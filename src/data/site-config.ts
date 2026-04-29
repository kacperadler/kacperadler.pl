export const siteConfig = {
  name: "Kacper Adler",
  role: "Frontend Engineer",
  tagline: "Buduję szybkie, czytelne interfejsy we frontendzie.",
  description:
    "Frontend Engineer specjalizujący się w React i TypeScript. ~5 lat doświadczenia. Aplikacje webowe, landing pages, narzędzia wewnętrzne.",
  url: "https://kacperadler.pl",
  locale: "pl-PL",
  lang: "pl",
  email: "kontakt@kacperadler.pl",
  social: {
    github: "https://github.com/kacperadler",
    linkedin: "https://www.linkedin.com/in/kacperadler/",
    x: "https://x.com/kacperadler",
  },
  ogImage: "/og-default.png",
} as const;

export type SiteConfig = typeof siteConfig;
