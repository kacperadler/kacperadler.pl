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
    num: "01",
    icon: "lucide:messages-square",
    title: "Rozmowa",
    description:
      "Krótkie spotkanie albo wymiana maili - co Ci wygodniej. Opowiadasz, co chcesz zbudować i po co; ja zadaję pytania, czasem niewygodne.",
    badge: "~ 30 min",
  },
  {
    num: "02",
    icon: "lucide:clipboard-list",
    title: "Plan i wycena",
    description:
      "Po rozmowie dostajesz krótki dokument: co robimy, w jakiej kolejności, ile to zajmie i ile kosztuje. Bez ukrytych kosztów, bez niespodzianek w trakcie.",
    badge: "2–3 dni",
  },
  {
    num: "03",
    icon: "lucide:code",
    title: "Realizacja",
    description:
      "Pracuję małymi etapami - co tydzień widzisz coś, co działa, nie obrazek. Gdy coś idzie nie tak, łatwiej to zauważyć i poprawić.",
    badge: "podział na etapy",
  },
  {
    num: "04",
    icon: "lucide:message-circle",
    title: "Feedback i iteracje",
    description:
      "Nie musisz znać się na technologii. Mówisz „to powinno być szybsze”, „tu brakuje jasności”, „zmieńmy kolejność” - ja tłumaczę to na konkretne zmiany i pokazuję efekt.",
    badge: "na bieżąco",
  },
  {
    num: "05",
    icon: "lucide:rocket",
    title: "Wdrożenie i opieka",
    description:
      "Po wdrożeniu zostaje monitoring. Łapię błędy zanim staną się problemem, mierzę performance, przygotowuję poprawki. Twój produkt nie jest sam.",
    badge: "+ nadzór",
  },
];
