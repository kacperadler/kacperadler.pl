import { siteConfig } from "@/data/site-config";

export interface PersonSchema {
  "@context": "https://schema.org";
  "@type": "Person";
  description: string;
  image: string;
  jobTitle: string;
  knowsAbout: string[];
  name: string;
  sameAs: string[];
  url: string;
}

export interface WebSiteSchema {
  "@context": "https://schema.org";
  "@type": "WebSite";
  inLanguage: string;
  name: string;
  url: string;
}

const ogImageUrl = new URL(siteConfig.ogImage, siteConfig.url).toString();

export const personSchema: PersonSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: siteConfig.role,
  description: siteConfig.description,
  image: ogImageUrl,
  knowsAbout: [
    "React",
    "TypeScript",
    "Next.js",
    "React Native",
    "Frontend Development",
    "Web Performance",
    "B2B Applications",
    "Astro",
  ],
  sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
};

export const websiteSchema: WebSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  inLanguage: siteConfig.locale,
};
