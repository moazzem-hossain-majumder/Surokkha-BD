"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card } from "@/components/ui/Card";
import { recordGamePlay } from "@/lib/badges";

// Scenarios are derived from the vetted lightning guide content
// (src/content/hazards/lightning.json "during" list and myth/fact) plus one
// widely-taught, uncontroversial fact (hard-topped vehicles are safe due to
// their metal shell) -- nothing here is a new safety claim invented for the
// game. Keep this list in sync if lightning.json's guidance ever changes.
interface Scenario {
  text: { en: string; bn: string };
  safe: boolean;
  explanation: { en: string; bn: string };
}

const SCENARIOS: Scenario[] = [
  {
    text: { en: "Sheltering inside a strong, concrete building.", bn: "একটি মজবুত পাকা দালানের ভেতরে আশ্রয় নেওয়া।" },
    safe: true,
    explanation: { en: "A strong building is the safest place to be during a thunderstorm.", bn: "বজ্রপাতের সময় পাকা দালানই সবচেয়ে নিরাপদ স্থান।" },
  },
  {
    text: { en: "Standing under a tall, isolated tree in an open field.", bn: "খোলা মাঠে একটি লম্বা, একাকী গাছের নিচে দাঁড়ানো।" },
    safe: false,
    explanation: { en: "Tall trees attract lightning strikes and are one of the most dangerous places to stand.", bn: "লম্বা গাছে বজ্রপাত বেশি পড়ে, তাই এটি দাঁড়ানোর জন্য সবচেয়ে বিপজ্জনক জায়গাগুলোর একটি।" },
  },
  {
    text: { en: "Crouching low on the balls of your feet, feet together, with no shelter nearby.", bn: "কাছে কোনো আশ্রয় না থাকলে দুই পা একসাথে রেখে, পায়ের পাতায় ভর দিয়ে নিচু হয়ে বসা।" },
    safe: true,
    explanation: { en: "If you're truly stuck outside with no shelter, this crouch reduces your risk (though going indoors is always better).", bn: "সত্যিই বাইরে আটকা পড়লে এবং কাছে আশ্রয় না থাকলে এই ভঙ্গি ঝুঁকি কমায় (তবে ঘরে ঢোকাই সবসময় সেরা)।" },
  },
  {
    text: { en: "Lying flat on the ground in an open field during a storm.", bn: "ঝড়ের সময় খোলা মাঠে মাটিতে চিত হয়ে শোয়া।" },
    safe: false,
    explanation: { en: "Lying flat increases the ground contact area current can travel through. Crouch instead -- don't lie down.", bn: "চিত হয়ে শুলে বিদ্যুৎ প্রবাহিত হওয়ার জন্য মাটির সংস্পর্শের ক্ষেত্র বেড়ে যায়। শুয়ে না পড়ে নিচু হয়ে বসুন।" },
  },
  {
    text: { en: "Standing in a small boat on open water.", bn: "খোলা পানিতে একটি ছোট নৌকায় দাঁড়ানো।" },
    safe: false,
    explanation: { en: "Get off the water and away from open water as soon as you hear thunder.", bn: "মেঘ ডাকা শোনামাত্র পানি থেকে উঠে আসুন এবং খোলা পানি থেকে দূরে থাকুন।" },
  },
  {
    text: { en: "Touching a plugged-in appliance or a water tap indoors during the storm.", bn: "ঝড়ের সময় ঘরের ভেতরে প্লাগে লাগানো যন্ত্র বা পানির কল স্পর্শ করা।" },
    safe: false,
    explanation: { en: "Lightning can travel through wiring and plumbing. Stay away from both indoors.", bn: "বজ্রপাত তার ও পানির লাইন দিয়ে ভেতরে প্রবেশ করতে পারে। ঘরের ভেতরেও দুটো থেকে দূরে থাকুন।" },
  },
  {
    text: { en: "Sitting inside a car with a hard metal roof and the windows up.", bn: "শক্ত ধাতব ছাদ ও জানালা বন্ধ রেখে গাড়ির ভেতরে বসে থাকা।" },
    safe: true,
    explanation: { en: "A hard-topped vehicle's metal shell directs a strike around the occupants -- a well-known safe spot (avoid touching metal parts inside).", bn: "গাড়ির শক্ত ধাতব খোলস বজ্রপাতকে ভেতরের মানুষের চারপাশ দিয়ে সরিয়ে দেয় -- এটি একটি সুপরিচিত নিরাপদ জায়গা (ভেতরের ধাতব অংশ স্পর্শ করা এড়িয়ে চলুন)।" },
  },
  {
    text: { en: "Standing near a window indoors, watching the storm.", bn: "ঘরের ভেতরে জানালার কাছে দাঁড়িয়ে ঝড় দেখা।" },
    safe: false,
    explanation: { en: "Stay away from windows even when you're inside a strong building.", bn: "পাকা দালানের ভেতরে থাকলেও জানালা থেকে দূরে থাকুন।" },
  },
];

export function LightningGame() {
  const t = useTranslations("games.lightning");
  const locale = useLocale();
  const [index, setIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [chosen, setChosen] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);

  const scenario = SCENARIOS[index];

  function choose(answer: boolean) {
    if (chosen !== null) return;
    setChosen(answer);
    if (answer === scenario.safe) setCorrect((c) => c + 1);
  }

  function next() {
    if (index + 1 >= SCENARIOS.length) {
      const score = Math.round((correct / SCENARIOS.length) * 100);
      recordGamePlay("lightning", score);
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setChosen(null);
  }

  if (done) {
    const score = Math.round((correct / SCENARIOS.length) * 100);
    return (
      <Card className="p-6 text-center">
        <p className="text-lg font-bold">{t("resultsTitle", { correct, total: SCENARIOS.length })}</p>
        <p className="mt-2 text-ink-2">{score === 100 ? t("perfect") : t("resultsNote")}</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <p className="text-sm text-ink-2">
        {index + 1} / {SCENARIOS.length}
      </p>
      <p className="mt-2 text-lg font-semibold">{locale === "bn" ? scenario.text.bn : scenario.text.en}</p>

      <div className="mt-4 flex gap-3">
        <button
          type="button"
          onClick={() => choose(true)}
          disabled={chosen !== null}
          className={`flex-1 rounded-input border px-4 py-3 text-sm font-semibold ${
            chosen !== null && scenario.safe ? "border-brand bg-brand/10" : chosen === true ? "border-sun bg-sun/10" : "border-border bg-surface hover:bg-surface-2"
          }`}
        >
          {t("safe")}
        </button>
        <button
          type="button"
          onClick={() => choose(false)}
          disabled={chosen !== null}
          className={`flex-1 rounded-input border px-4 py-3 text-sm font-semibold ${
            chosen !== null && !scenario.safe ? "border-brand bg-brand/10" : chosen === false ? "border-sun bg-sun/10" : "border-border bg-surface hover:bg-surface-2"
          }`}
        >
          {t("notSafe")}
        </button>
      </div>

      {chosen !== null && (
        <div className="mt-4">
          <p className="text-sm text-ink-2">{locale === "bn" ? scenario.explanation.bn : scenario.explanation.en}</p>
          <button type="button" onClick={next} className="mt-3 h-10 rounded-full bg-brand px-4 text-sm font-semibold text-white">
            {index + 1 >= SCENARIOS.length ? t("finish") : t("next")}
          </button>
        </div>
      )}
    </Card>
  );
}
