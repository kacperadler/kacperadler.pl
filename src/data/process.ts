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
    badge: "~30 min",
    description:
      "Opowiadasz, jak dziś pracujecie i co Was spowalnia. Ja zadaję pytania i szukam tego, co da się zautomatyzować.",
    icon: "lucide:messages-square",
    num: "01",
    title: "Rozmowa",
  },
  {
    badge: "2–3 dni",
    description:
      "Dostajesz krótki dokument: co robimy, w jakiej kolejności, ile to potrwa, ile kosztuje i ile czasu zaoszczędzisz. Bez ukrytych kosztów.",
    icon: "lucide:clipboard-list",
    num: "02",
    title: "Plan i wycena",
  },
  {
    badge: "co tydzień",
    description:
      "Co tydzień widzisz coś, co działa, a nie prezentację. Problemy łapiemy wcześnie.",
    icon: "lucide:layers",
    num: "03",
    title: "Wdrożenie etapami",
  },
  {
    badge: "na bieżąco",
    description:
      "Nie musisz znać się na technologii. Mówisz, co nie gra, a ja zamieniam to na konkretne zmiany.",
    icon: "lucide:message-circle",
    num: "04",
    title: "Feedback",
  },
  {
    badge: "po wdrożeniu",
    description:
      "Monitoruję system, poprawiam błędy, zanim staną się problemem, i rozwijam go razem z firmą.",
    icon: "lucide:shield-check",
    num: "05",
    title: "Opieka",
  },
];
