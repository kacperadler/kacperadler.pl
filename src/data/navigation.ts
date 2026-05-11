export interface NavLink {
  href: string;
  label: string;
}

export const primaryNav: readonly NavLink[] = [
  { label: "Usługi", href: "#services" },
  // Realizacje disabled until real case-studies land - restore { label: "Realizacje", href: "#projects" } when ready.
  { label: "Proces", href: "#how" },
  { label: "Współprace", href: "#experience" },
] as const;

export const contactCta: NavLink = {
  label: "Porozmawiajmy",
  href: "#contact",
};
