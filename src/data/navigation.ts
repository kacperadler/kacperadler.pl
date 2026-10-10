import { getCollection } from "astro:content";

export interface NavLink {
  href: string;
  label: string;
}

/* Section links carry the path, so they lead back to the home page
 * sections from /realizacje/ and the legal pages too. */
const services: NavLink = { href: "/#services", label: "Usługi" };
const how: NavLink = { href: "/#how", label: "Proces" };
const experience: NavLink = { href: "/#experience", label: "Współprace" };

export const caseStudiesNav: NavLink = {
  href: "/realizacje/",
  label: "Realizacje",
};

/* "Realizacje" is in the menu only when the list page it points at is
 * built, i.e. when at least one case study exists. */
export async function primaryNav(): Promise<readonly NavLink[]> {
  const hasCaseStudies = (await getCollection("caseStudies")).length > 0;
  return hasCaseStudies
    ? [services, caseStudiesNav, how, experience]
    : [services, how, experience];
}

export const contactCta: NavLink = {
  href: "/#contact",
  label: "Porozmawiajmy",
};
