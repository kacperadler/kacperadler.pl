import { type CollectionEntry, getCollection } from "astro:content";

export type CaseStudy = CollectionEntry<"caseStudies">;

export const caseStudyPath = (caseStudy: CaseStudy): string =>
  `/realizacje/${caseStudy.id}/`;

/* Case studies keyed by the id of the experience entry they belong
 * to. Astro only logs a reference to a missing entry, and two case studies
 * on one entry would leave it with two links, so both fail the build. */
export async function caseStudiesByExperience(): Promise<
  Map<string, CaseStudy>
> {
  const experienceIds = new Set(
    (await getCollection("experience")).map((entry) => entry.id)
  );
  const byExperience = new Map<string, CaseStudy>();
  for (const caseStudy of await getCollection("caseStudies")) {
    const experienceId = caseStudy.data.experience?.id;
    if (!experienceId) {
      continue;
    }
    if (!experienceIds.has(experienceId)) {
      throw new Error(
        `Case study "${caseStudy.id}" links to experience "${experienceId}", which does not exist.`
      );
    }
    const taken = byExperience.get(experienceId);
    if (taken) {
      throw new Error(
        `Case studies "${taken.id}" and "${caseStudy.id}" both link to experience "${experienceId}"; one entry takes one case study.`
      );
    }
    byExperience.set(experienceId, caseStudy);
  }
  return byExperience;
}

/* All case studies in the order of their experience entries; ones
 * without an entry follow, by company. */
export async function sortedCaseStudies(): Promise<CaseStudy[]> {
  const order = new Map(
    (await getCollection("experience")).map((entry) => [
      entry.id,
      entry.data.order,
    ])
  );
  const rank = (caseStudy: CaseStudy): number => {
    const experienceId = caseStudy.data.experience?.id;
    return experienceId === undefined
      ? Number.POSITIVE_INFINITY
      : (order.get(experienceId) ?? Number.POSITIVE_INFINITY);
  };
  return (await getCollection("caseStudies")).sort(
    (a, b) =>
      rank(a) - rank(b) || a.data.company.localeCompare(b.data.company, "pl")
  );
}
