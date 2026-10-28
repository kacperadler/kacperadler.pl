export interface NavLink {
  href: string;
  label: string;
}

/* Every menu entry is a home page section. The links carry the path, so
 * they lead back to the home page sections from /realizacje/ and the legal
 * pages too. "Realizacje" is the home section #cases, which links the
 * /realizacje/ list when it is built. */
export const primaryNav: readonly NavLink[] = [
  { href: "/#services", label: "Oferta" },
  { href: "/#cases", label: "Realizacje" },
  { href: "/#how", label: "Proces" },
  { href: "/#about", label: "O mnie" },
  { href: "/#faq", label: "FAQ" },
];

export const contactCta: NavLink = {
  href: "/#contact",
  label: "Umów rozmowę",
};
