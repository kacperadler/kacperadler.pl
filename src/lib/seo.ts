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
        serviceType?: string;
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
  name: siteConfig.name,
  url: siteConfig.url,
  jobTitle: siteConfig.role,
  description: siteConfig.description,
  image: ogImageUrl,
  knowsAbout: [
    "React",
    "TypeScript",
    "React Native",
    "Next.js",
    "Astro",
    "Frontend Development",
    "Mobile Development",
    "Web Performance",
    "B2B Applications",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    email: siteConfig.email,
    availableLanguage: ["Polish", "English"],
  },
  sameAs: [siteConfig.social.github, siteConfig.social.linkedin],
};

export const websiteSchema: WebSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  inLanguage: siteConfig.locale,
};

/* Build a ProfessionalService schema with an OfferCatalog populated from the
 * services content collection. Lets crawlers / AI agents enumerate the
 * actual offerings instead of inferring them from page copy. */
export function professionalServiceSchema(
  services: CollectionEntry<"services">[]
): ProfessionalServiceSchema {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${siteConfig.name} - ${siteConfig.role}`,
    url: siteConfig.url,
    description: siteConfig.description,
    areaServed: ["Poland", "European Union"],
    founder: {
      "@type": "Person",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Usługi",
      itemListElement: services.map((s) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: s.data.title,
          description: s.data.description,
          serviceType: s.data.tags.join(", "),
        },
      })),
    },
  };
}
