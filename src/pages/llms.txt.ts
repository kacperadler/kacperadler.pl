/* llms.txt - machine-friendly site summary for AI agents (proposed
 * standard: https://llmstxt.org/). Markdown file at /llms.txt that
 * crawlers fetch instead of parsing HTML, gives them a structured
 * overview of the portfolio in ~80 lines.
 *
 * Concise version - just the headlines. /llms-full.txt carries the
 * full body copy (process step descriptions, service body text). */

import { getCollection } from "astro:content";
import { siteConfig } from "@/data/site-config";

export const prerender = true;

export async function GET(): Promise<Response> {
  const services = (await getCollection("services")).sort(
    (a, b) => a.data.order - b.data.order
  );

  const experience = (await getCollection("experience")).sort(
    (a, b) => a.data.order - b.data.order
  );

  const servicesList = services
    .map(
      (s) =>
        `- **${s.data.title}** (${s.data.tags.join(", ")}): ${s.data.description}`
    )
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
      return `- **${item.data.company}** (${period}) — ${item.data.role}`;
    })
    .join("\n");

  const body = `# ${siteConfig.name} — ${siteConfig.role}

> ${siteConfig.tagline} ${siteConfig.description}

## Usługi

${servicesList}

## Współprace

${experienceList}

## Kontakt

- Email: ${siteConfig.email}
- LinkedIn: ${siteConfig.social.linkedin}
- GitHub: ${siteConfig.social.github}
- Strona: ${siteConfig.url}

## Pełna treść

Pełny opis usług, procesu współpracy i opisy poszczególnych projektów: ${siteConfig.url}/llms-full.txt
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
