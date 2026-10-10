export interface NavLink {
  href: string;
  label: string;
}

export const primaryNav: readonly NavLink[] = [
  { href: "#services", label: "Usługi" },
  // Realizacje disabled until real case-studies land - restore { label: "Realizacje", href: "#projects" } when ready.
  { href: "#how", label: "Proces" },
  { href: "#experience", label: "Współprace" },
] as const;

export const contactCta: NavLink = {
  href: "#contact",
  label: "Porozmawiajmy",
};
