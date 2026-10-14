import type { ImageMetadata } from "astro";
import apptensionLogo from "@/assets/experience/apptension.svg";
import energiadirectLogo from "@/assets/experience/energiadirect.svg";
import helpfindLogo from "@/assets/experience/helpfind.svg";
import paylooLogo from "@/assets/experience/payloo.jpg";
import pwcLogo from "@/assets/experience/pwc.svg";
import rexLogo from "@/assets/experience/rex.svg";

/* Logo of each entry in src/content/experience, by entry id. The trust bar
 * (#trust), the case highlights (#cases) and the full experience list
 * (#about) read it. */
export const logoBySlug: Readonly<Record<string, ImageMetadata>> = {
  apptension: apptensionLogo,
  energiadirect: energiadirectLogo,
  helpfind: helpfindLogo,
  payloo: paylooLogo,
  pwc: pwcLogo,
  rex: rexLogo,
};
