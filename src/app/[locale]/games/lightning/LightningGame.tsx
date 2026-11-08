"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Confetti } from "@/components/ui/Confetti";
import { recordGamePlay } from "@/lib/badges";
import { playChime, playThunder, playSuccessFanfare } from "@/lib/soundEffects";

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
  const [streak, setStreak] = useState(0);
  const [chosen, setChosen] = useState<boolean | null>(null);
  const [done, setDone] = useState(false);
  const [flashEffect, setFlashEffect] = useState<"lightning" | "shield" | null>(null);

  const scenario = SCENARIOS[index];

  function choose(answer: boolean) {
    if (chosen !== null) return;
    setChosen(answer);
    const isCorrect = answer === scenario.safe;
    if (isCorrect) {
      setCorrect((c) => c + 1);
      setStreak((s) => s + 1);
      setFlashEffect("shield");
      playChime();
    } else {
      setStreak(0);
      setFlashEffect("lightning");
      playThunder();
    }
    setTimeout(() => setFlashEffect(null), 700);
  }

  function next() {
    if (index + 1 >= SCENARIOS.length) {
      const score = Math.round((correct / SCENARIOS.length) * 100);
      recordGamePlay("lightning", score);
      setDone(true);
      playSuccessFanfare();
      return;
    }
    setIndex((i) => i + 1);
    setChosen(null);
  }

  if (done) {
    const score = Math.round((correct / SCENARIOS.length) * 100);
    return (
      <Card className="p-8 text-center border border-border bg-surface rounded-md">
        <Confetti active={score >= 70} />
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-md bg-brand/10 border border-brand text-brand">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <p className="text-2xl font-bold text-ink tracking-tight">
          {t("resultsTitle", { correct, total: SCENARIOS.length })}
        </p>
        <p className="mt-1 text-ink-2 text-sm max-w-md mx-auto">
          {score === 100 ? t("perfect") : t("resultsNote")}
        </p>

        <div className="mt-6 flex justify-center gap-3">
          <div className="rounded-md bg-surface-2 px-5 py-3 border border-border text-center">
            <span className="block text-[11px] font-mono uppercase tracking-wider text-ink-3">Rating</span>
            <span className="text-2xl font-bold text-brand">{score}%</span>
          </div>
          <div className="rounded-md bg-surface-2 px-5 py-3 border border-border text-center">
            <span className="block text-[11px] font-mono uppercase tracking-wider text-ink-3">Safe Choices</span>
            <span className="text-2xl font-bold text-ink">{correct} / {SCENARIOS.length}</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={() => {
              setIndex(0);
              setCorrect(0);
              setStreak(0);
              setChosen(null);
              setDone(false);
            }}
            className="h-10 rounded-md bg-brand px-6 text-sm font-semibold text-brand-ink hover:bg-brand/90 transition-colors duration-150 cursor-pointer"
          >
            {locale === "bn" ? "আবার খেলুন" : "Play Again"}
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative">
      <Card
        className={`p-6 border bg-surface rounded-md transition-colors duration-150 ${
          flashEffect === "shield"
            ? "border-brand ring-1 ring-brand/30"
            : flashEffect === "lightning"
            ? "border-sun ring-1 ring-sun/30"
            : "border-border"
        }`}
      >
        {/* Storm Atmospheric Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-border pb-3 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-ink uppercase">
              {locale === "bn" ? "বজ্রপাত নিরাপত্তা সিমুলেশন" : "Lightning Survival Sim"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {streak > 1 && (
              <span className="inline-flex items-center rounded-sm bg-surface-2 border border-border px-2 py-0.5 text-[11px] font-mono font-semibold text-brand">
                STREAK: {streak}
              </span>
            )}
            <span className="rounded-sm bg-surface-2 px-2 py-0.5 text-xs font-mono font-semibold text-ink-2 border border-border">
              {index + 1} / {SCENARIOS.length}
            </span>
          </div>
        </div>

        {/* Progress Line */}
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-xs bg-surface-2 border border-border">
          <div
            className="h-full bg-brand transition-all duration-200 ease-out"
            style={{ width: `${((index + 1) / SCENARIOS.length) * 100}%` }}
          />
        </div>

        {/* Scenario Card */}
        <div className="mt-6">
          <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-wider text-ink-3">
            {locale === "bn" ? "পরিস্থিতি" : "SCENARIO"} {index + 1}
          </span>
          <p className="mt-1 text-lg sm:text-xl font-bold text-ink leading-snug tracking-tight">
            {locale === "bn" ? scenario.text.bn : scenario.text.en}
          </p>
        </div>

        {/* Action Choice Buttons */}
        <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
          <button
            type="button"
            onClick={() => choose(true)}
            disabled={chosen !== null}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-5 py-3 text-sm font-semibold transition-colors duration-150 cursor-pointer ${
              chosen !== null && scenario.safe
                ? "border-brand bg-brand/10 text-brand font-bold"
                : chosen === true
                ? "border-sun bg-sun/10 text-sun font-bold"
                : "border-border bg-surface hover:bg-surface-2 hover:border-ink-3/40 text-ink"
            }`}
          >
            <span>[SAFE] {t("safe")}</span>
          </button>

          <button
            type="button"
            onClick={() => choose(false)}
            disabled={chosen !== null}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md border px-5 py-3 text-sm font-semibold transition-colors duration-150 cursor-pointer ${
              chosen !== null && !scenario.safe
                ? "border-brand bg-brand/10 text-brand font-bold"
                : chosen === false
                ? "border-sun bg-sun/10 text-sun font-bold"
                : "border-border bg-surface hover:bg-surface-2 hover:border-ink-3/40 text-ink"
            }`}
          >
            <span>[DANGEROUS] {t("notSafe")}</span>
          </button>
        </div>

        {/* Feedback Section */}
        {chosen !== null && (
          <div className="mt-6 rounded-md border border-border bg-surface-2 p-4">
            <div>
              <p className="text-xs font-mono font-bold uppercase text-ink">
                {chosen === scenario.safe
                  ? (locale === "bn" ? "সঠিক সিদ্ধান্ত" : "SAFE SURVIVAL PROTOCOL")
                  : (locale === "bn" ? "বিপজ্জনক ভুল" : "HAZARDOUS ACTION")}
              </p>
              <p className="mt-1 text-xs text-ink-2 leading-relaxed">
                {locale === "bn" ? scenario.explanation.bn : scenario.explanation.en}
              </p>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={next}
                className="h-9 rounded-md bg-brand px-5 text-xs font-semibold text-brand-ink hover:bg-brand/90 transition-colors duration-150 cursor-pointer"
              >
                {index + 1 >= SCENARIOS.length ? t("finish") : t("next")}
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
