import type { ImageMetadata } from "astro";
import apptensionLogo from "@/assets/experience/apptension.svg";
import energiadirectLogo from "@/assets/experience/energiadirect.svg";
import helpfindLogo from "@/assets/experience/helpfind.svg";
import paylooLogo from "@/assets/experience/payloo.jpg";
import pwcLogo from "@/assets/experience/pwc.svg";
import rexLogo from "@/assets/experience/rex.svg";

/* Logo of each entry in src/content/experience, by entry id. The trust bar
 * (#trust) and the full experience list (#about) read it. */
export const logoBySlug: Readonly<Record<string, ImageMetadata>> = {
  apptension: apptensionLogo,
  energiadirect: energiadirectLogo,
  helpfind: helpfindLogo,
  payloo: paylooLogo,
  pwc: pwcLogo,
  rex: rexLogo,
};

/* How the trust bar sets each logo:
 *   height    the tallest it may be, in px - by optical weight, not one
 *             height for all: a compact mark (PwC) needs more than a long
 *             wordmark (Energia Direct, also held to its cell's width) to
 *             read as the same size
 *   markOnly  the logo is a mark without the company's name, so the name
 *             is set in text beside it */
export const logoFitBySlug: Readonly<
  Record<string, { height: number; markOnly?: true }>
> = {
  apptension: { height: 28, markOnly: true },
  energiadirect: { height: 15 },
  helpfind: { height: 30 },
  payloo: { height: 28, markOnly: true },
  pwc: { height: 44 },
  rex: { height: 26 },
};
