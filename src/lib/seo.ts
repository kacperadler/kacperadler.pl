import type { CollectionEntry } from "astro:content";
import { siteConfig } from "@/data/site-config";

export interface PersonSchema {
  "@context": "https://schema.org";
  "@type": "Person";
  contactPoint: {
    "@type": "ContactPoint";
    availableLanguage: string[];
    contactType: string;
    email: string;
  };
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

export interface ProfessionalServiceSchema {
  "@context": "https://schema.org";
  "@type": "ProfessionalService";
  areaServed: string[];
  description: string;
  founder: { "@type": "Person"; name: string; url: string };
  hasOfferCatalog: {
    "@type": "OfferCatalog";
    itemListElement: Array<{
      "@type": "Offer";
      itemOffered: {
        "@type": "Service";
        description: string;
        name: string;
      };
    }>;
    name: string;
  };
  name: string;
  url: string;
}

const ogImageUrl = new URL(siteConfig.ogImage, siteConfig.url).toString();

export const personSchema: PersonSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  contactPoint: {
    "@type": "ContactPoint",
    availableLanguage: ["Polish", "English"],
    contactType: "customer service",
    email: siteConfig.email,
  },
  description: siteConfig.description,
  image: ogImageUrl,
  jobTitle: siteConfig.role,
  knowsAbout: [
    "Wdrożenia AI w firmach",
    "Automatyzacja procesów biznesowych",
    "Agenci AI",
    "Automatyzacja biznesu",
    "Integracje systemów",
    "Narzędzia wewnętrzne",
    "Aplikacje webowe i mobilne",
    "TypeScript",
    "React",
    "React Native",
  ],
  name: siteConfig.name,
  sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
  url: siteConfig.url,
};

export const websiteSchema: WebSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  inLanguage: siteConfig.locale,
  name: siteConfig.name,
  url: siteConfig.url,
};

/* Build a ProfessionalService schema with an OfferCatalog of the offer's
 * steps (the services collection): each step's name and what the client
 * gets. Lets crawlers / AI agents enumerate the offer instead of inferring
 * it from page copy. */
export function professionalServiceSchema(
  services: CollectionEntry<"services">[]
): ProfessionalServiceSchema {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    areaServed: ["Poland", "European Union"],
    description: siteConfig.description,
    founder: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          description: s.data.description,
          name: s.data.title,
        },
      })),
      name: "Oferta",
    },
    name: `${siteConfig.name} - ${siteConfig.role}`,
    url: siteConfig.url,
  };
}
