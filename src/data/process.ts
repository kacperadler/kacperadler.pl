/* Process steps - 5-stage flow used in the home page "Proces" section and
 * also served via /llms-full.txt for AI agents that want the full content
 * without parsing HTML. Single source of truth so both stay in sync.
 * `figure` names the step's line drawing (process-figure.astro), `outcome`
 * is what the client has after the step, shown under the description after
 * the lime arrow. */

export type ProcessFigureName =
  | "conversation"
  | "plan"
  | "stages"
  | "revision"
  | "care";

export interface ProcessStep {
  badge: string;
  description: string;
  figure: ProcessFigureName;
  num: string;
  outcome: string;
  title: string;
}

export const processSteps: readonly ProcessStep[] = [
  {
    badge: "~30 min",
    description:
      "Opowiadasz, jak dziś pracujecie i co Was spowalnia. Ja zadaję pytania i szukam tego, co da się zautomatyzować.",
    figure: "conversation",
    num: "01",
    outcome: "Pierwszy pomysł na automatyzację w 24 h.",
    title: "Rozmowa",
  },
  {
    badge: "2–3 dni",
    description:
      "Dostajesz krótki dokument: co robimy, w jakiej kolejności, ile to potrwa, ile kosztuje i ile czasu zaoszczędzisz. Bez ukrytych kosztów.",
    figure: "plan",
    num: "02",
    outcome: "Dokument z zakresem, terminem i ceną.",
    title: "Plan i wycena",
  },
  {
    badge: "co tydzień",
    description:
      "Widzisz działające kawałki systemu, a nie prezentacje. Problemy łapiemy wcześnie.",
    figure: "stages",
    num: "03",
    outcome: "Kolejna działająca część systemu do sprawdzenia.",
    title: "Wdrożenie etapami",
  },
  {
    badge: "na bieżąco",
    description:
      "Nie musisz znać się na technologii. Mówisz, co nie gra, a ja zamieniam to na konkretne zmiany.",
    figure: "revision",
    num: "04",
    outcome:
      "[DO UZUPEŁNIENIA - Kacper: co klient dostaje po zgłoszeniu uwag, np. w jakim czasie zmiana trafia do systemu]",
    title: "Feedback",
  },
  {
    badge: "po wdrożeniu",
    description:
      "Monitoruję system, poprawiam błędy, zanim staną się problemem, i rozwijam go razem z firmą.",
    figure: "care",
    num: "05",
    outcome:
      "[DO UZUPEŁNIENIA - Kacper: co obejmuje opieka, np. co monitorujesz i jak często klient dostaje raport]",
    title: "Opieka",
  },
];
