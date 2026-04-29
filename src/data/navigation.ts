export interface NavLink {
  href: string;
  label: string;
}

export const primaryNav: readonly NavLink[] = [
  { label: "Usługi", href: "#services" },
  { label: "Realizacje", href: "#projects" },
  { label: "Jak pracuję", href: "#how" },
  { label: "Doświadczenie", href: "#experience" },
] as const;

export const contactCta: NavLink = {
  label: "Kontakt",
  href: "#contact",
};
