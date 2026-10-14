/* Process steps - 5-stage flow used in the home page "Proces" section and
 * also served via /llms-full.txt for AI agents that want the full content
 * without parsing HTML. Single source of truth so both stay in sync. */

export interface ProcessStep {
  badge: string;
  description: string;
  icon: string;
  num: string;
  title: string;
}

export const processSteps: readonly ProcessStep[] = [
  {
    badge: "30 min",
    description:
      "Opowiadasz o procesie, który zjada czas zespołu. Ja szukam, co da się zautomatyzować.",
    icon: "lucide:messages-square",
    num: "01",
    title: "Rozmowa",
  },
  {
    badge: "2–3 dni",
    description:
      "Dostajesz krótki dokument: co robimy, ile to trwa, ile kosztuje i ile zyskasz.",
    icon: "lucide:clipboard-list",
    num: "02",
    title: "Plan i wycena",
  },
  {
    badge: "co tydzień",
    description: "Pracuję małymi etapami. Co tydzień widzisz coś, co działa.",
    icon: "lucide:code",
    num: "03",
    title: "Wdrożenie etapami",
  },
  {
    badge: "na bieżąco",
    description:
      "Nie musisz znać się na technologii. Mówisz, co ma działać inaczej, a ja zamieniam to na konkretne zmiany.",
    icon: "lucide:message-circle",
    num: "04",
    title: "Feedback",
  },
  {
    badge: "po wdrożeniu",
    description: "Monitoring i rozwój. Twój system nie zostaje sam.",
    icon: "lucide:rocket",
    num: "05",
    title: "Opieka",
  },
];
