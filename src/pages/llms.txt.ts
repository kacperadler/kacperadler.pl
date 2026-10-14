/* llms.txt - machine-friendly site summary for AI agents (proposed
 * standard: https://llmstxt.org/). Markdown file at /llms.txt that
 * crawlers fetch instead of parsing HTML, gives them a structured
 * overview of the site.
 *
 * Concise version - just the headlines. /llms-full.txt carries the
 * full body copy (the offer, the projects, the process, the FAQ). */

import { getCollection } from "astro:content";
import { automations } from "@/data/home";
import { siteConfig } from "@/data/site-config";
import { caseStudyPath, sortedCaseStudies } from "@/lib/case-studies";

export const prerender = true;

export async function GET(): Promise<Response> {
  const offer = (await getCollection("services")).sort(
    (a, b) => a.data.order - b.data.order
  );

  const experience = (await getCollection("experience")).sort(
    (a, b) => a.data.order - b.data.order
  );

  const caseStudies = await sortedCaseStudies();

  const offerList = offer
    .map(
      (s) =>
        `- **${s.data.title}** (${s.data.duration}). Co dostajesz: ${s.data.description}`
    )
    .join("\n");

  const automationList = automations
    .map((a) => `- **${a.title}**: ${a.description}`)
    .join("\n");

  const experienceList = experience
    .map((item) => {
      const startYear = item.data.startDate.slice(0, 4);
      const endYear = item.data.endDate?.slice(0, 4);
      let period: string;
      if (item.data.current) {
        period = "teraz";
      } else if (item.data.badge) {
        period = item.data.badge;
      } else {
        period = `${startYear}–${endYear}`;
      }
      return `- **${item.data.company}** (${period}) - ${item.data.role}`;
    })
    .join("\n");

  const caseStudyList = caseStudies
    .map(
      (c) =>
        `- [${c.data.company}](${siteConfig.url}${caseStudyPath(c)}) (${c.data.period}) - ${c.data.role}: ${c.data.summary}`
    )
    .join("\n");

  const caseStudiesBlock =
    caseStudies.length > 0
      ? `## Realizacje\n\nLista: ${siteConfig.url}/realizacje/\n\n${caseStudyList}\n\n`
      : "";

  const body = `# ${siteConfig.name} - ${siteConfig.role}

> ${siteConfig.tagline} ${siteConfig.description}

## Oferta

${offerList}

## Co mogę zautomatyzować

${automationList}

## Doświadczenie

${experienceList}

${caseStudiesBlock}## Kontakt

- Email: ${siteConfig.email}
- LinkedIn: ${siteConfig.social.linkedin}
- GitHub: ${siteConfig.social.github}
- Strona: ${siteConfig.url}

## Pełna treść

Pełny opis oferty, wybranych projektów, procesu współpracy i odpowiedzi na częste pytania: ${siteConfig.url}/llms-full.txt
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
