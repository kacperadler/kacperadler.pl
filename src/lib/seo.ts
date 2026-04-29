import { siteConfig } from "@/data/site-config";

export interface PersonSchema {
  "@context": "https://schema.org";
  "@type": "Person";
  description: string;
  jobTitle: string;
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

export const personSchema: PersonSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: siteConfig.role,
  description: siteConfig.description,
  sameAs: [
    siteConfig.social.github,
    siteConfig.social.linkedin,
    siteConfig.social.x,
  ],
};

export const websiteSchema: WebSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  inLanguage: siteConfig.locale,
};
