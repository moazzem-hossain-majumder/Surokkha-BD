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
  icon: string;
}

const SCENARIOS: Scenario[] = [
  {
    text: { en: "Sheltering inside a strong, concrete building.", bn: "একটি মজবুত পাকা দালানের ভেতরে আশ্রয় নেওয়া।" },
    safe: true,
    explanation: { en: "A strong building is the safest place to be during a thunderstorm.", bn: "বজ্রপাতের সময় পাকা দালানই সবচেয়ে নিরাপদ স্থান।" },
    icon: "🏢",
  },
  {
    text: { en: "Standing under a tall, isolated tree in an open field.", bn: "খোলা মাঠে একটি লম্বা, একাকী গাছের নিচে দাঁড়ানো।" },
    safe: false,
    explanation: { en: "Tall trees attract lightning strikes and are one of the most dangerous places to stand.", bn: "লম্বা গাছে বজ্রপাত বেশি পড়ে, তাই এটি দাঁড়ানোর জন্য সবচেয়ে বিপজ্জনক জায়গাগুলোর একটি।" },
    icon: "🌳",
  },
  {
    text: { en: "Crouching low on the balls of your feet, feet together, with no shelter nearby.", bn: "কাছে কোনো আশ্রয় না থাকলে দুই পা একসাথে রেখে, পায়ের পাতায় ভর দিয়ে নিচু হয়ে বসা।" },
    safe: true,
    explanation: { en: "If you're truly stuck outside with no shelter, this crouch reduces your risk (though going indoors is always better).", bn: "সত্যিই বাইরে আটকা পড়লে এবং কাছে আশ্রয় না থাকলে এই ভঙ্গি ঝুঁকি কমায় (তবে ঘরে ঢোকাই সবসময় সেরা)।" },
    icon: "🧘",
  },
  {
    text: { en: "Lying flat on the ground in an open field during a storm.", bn: "ঝড়ের সময় খোলা মাঠে মাটিতে চিত হয়ে শোয়া।" },
    safe: false,
    explanation: { en: "Lying flat increases the ground contact area current can travel through. Crouch instead -- don't lie down.", bn: "চিত হয়ে শুলে বিদ্যুৎ প্রবাহিত হওয়ার জন্য মাটির সংস্পর্শের ক্ষেত্র বেড়ে যায়। শুয়ে না পড়ে নিচু হয়ে বসুন।" },
    icon: "⚠️",
  },
  {
    text: { en: "Standing in a small boat on open water.", bn: "খোলা পানিতে একটি ছোট নৌকায় দাঁড়ানো।" },
    safe: false,
    explanation: { en: "Get off the water and away from open water as soon as you hear thunder.", bn: "মেঘ ডাকা শোনামাত্র পানি থেকে উঠে আসুন এবং খোলা পানি থেকে দূরে থাকুন।" },
    icon: "🛶",
  },
  {
    text: { en: "Touching a plugged-in appliance or a water tap indoors during the storm.", bn: "ঝড়ের সময় ঘরের ভেতরে প্লাগে লাগানো যন্ত্র বা পানির কল স্পর্শ করা।" },
    safe: false,
    explanation: { en: "Lightning can travel through wiring and plumbing. Stay away from both indoors.", bn: "বজ্রপাত তার ও পানির লাইন দিয়ে ভেতরে প্রবেশ করতে পারে। ঘরের ভেতরেও দুটো থেকে দূরে থাকুন।" },
    icon: "🔌",
  },
  {
    text: { en: "Sitting inside a car with a hard metal roof and the windows up.", bn: "শক্ত ধাতব ছাদ ও জানালা বন্ধ রেখে গাড়ির ভেতরে বসে থাকা।" },
    safe: true,
    explanation: { en: "A hard-topped vehicle's metal shell directs a strike around the occupants -- a well-known safe spot (avoid touching metal parts inside).", bn: "গাড়ির শক্ত ধাতব খোলস বজ্রপাতকে ভেতরের মানুষের চারপাশ দিয়ে সরিয়ে দেয় -- এটি একটি সুপরিচিত নিরাপদ জায়গা (ভেতরের ধাতব অংশ স্পর্শ করা এড়িয়ে চলুন)।" },
    icon: "🚗",
  },
  {
    text: { en: "Standing near a window indoors, watching the storm.", bn: "ঘরের ভেতরে জানালার কাছে দাঁড়িয়ে ঝড় দেখা।" },
    safe: false,
    explanation: { en: "Stay away from windows even when you're inside a strong building.", bn: "পাকা দালানের ভেতরে থাকলেও জানালা থেকে দূরে থাকুন।" },
    icon: "🪟",
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
      <Card className="animate-pop relative overflow-hidden p-8 text-center border border-border shadow-xl bg-gradient-to-b from-surface to-surface-2">
        <Confetti active={score >= 70} />
        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-brand/10 border-2 border-brand text-5xl shadow-md animate-float">
          {score === 100 ? "⚡" : score >= 75 ? "🛡️" : "⛈️"}
        </div>
        <p className="text-3xl font-black text-ink tracking-tight">
          {t("resultsTitle", { correct, total: SCENARIOS.length })}
        </p>
        <p className="mt-2 text-ink-2 text-base max-w-md mx-auto">
          {score === 100 ? t("perfect") : t("resultsNote")}
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <div className="rounded-2xl bg-surface px-6 py-4 border border-border shadow-xs">
            <span className="block text-xs font-bold uppercase tracking-wider text-ink-3">Survival Rating</span>
            <span className="text-3xl font-extrabold text-brand">{score}%</span>
          </div>
          <div className="rounded-2xl bg-surface px-6 py-4 border border-border shadow-xs">
            <span className="block text-xs font-bold uppercase tracking-wider text-ink-3">Safe Choices</span>
            <span className="text-3xl font-extrabold text-ink">{correct} / {SCENARIOS.length}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={() => {
              setIndex(0);
              setCorrect(0);
              setStreak(0);
              setChosen(null);
              setDone(false);
            }}
            className="h-12 rounded-full bg-brand px-8 text-base font-bold text-white shadow-md hover:bg-brand/90 hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            {locale === "bn" ? "আবার খেলুন" : "Play Again"}
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="relative">
      {/* Screen flash effect */}
      {flashEffect === "lightning" && (
        <div className="pointer-events-none fixed inset-0 z-50 animate-lightning" />
      )}

      <Card
        className={`relative overflow-hidden p-6 sm:p-8 border transition-all duration-300 shadow-xl bg-surface ${
          flashEffect === "lightning"
            ? "border-sun shadow-sun/30 animate-shake"
            : flashEffect === "shield"
            ? "border-brand shadow-brand/30 animate-shield"
            : "border-border"
        }`}
      >
        {/* Storm Atmospheric Backdrop Header */}
        <div className="flex flex-wrap items-center justify-between border-b border-border/80 pb-4 gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/15 text-lg">
              ⚡
            </span>
            <span className="text-sm font-extrabold text-ink">
              {locale === "bn" ? "বজ্রপাত নিরাপত্তা সিমুলেশন" : "Lightning Survival Sim"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {streak > 1 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-amber-600 animate-pop">
                🔥 {streak}x Streak!
              </span>
            )}
            <span className="rounded-full bg-surface-2 px-3 py-1 text-xs font-bold text-ink-2 border border-border">
              {index + 1} / {SCENARIOS.length}
            </span>
          </div>
        </div>

        {/* Dynamic Electric Progress Line */}
        <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-2 border border-border/40">
          <div
            className="h-full bg-gradient-to-r from-teal-500 via-brand to-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${((index + 1) / SCENARIOS.length) * 100}%` }}
          />
        </div>

        {/* Scenario Card with Realistic Icon & Context */}
        <div className="mt-8 flex items-start gap-5">
          <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-surface-2 border border-border text-3xl shadow-sm animate-float">
            {scenario.icon}
          </span>
          <div>
            <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-ink-3">
              {locale === "bn" ? "পরিস্থিতি" : "Scenario"}
            </span>
            <p className="mt-1 text-xl sm:text-2xl font-black text-ink leading-snug tracking-tight">
              {locale === "bn" ? scenario.text.bn : scenario.text.en}
            </p>
          </div>
        </div>

        {/* Action Choice Buttons with rich spring feedback */}
        <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
          <button
            type="button"
            onClick={() => choose(true)}
            disabled={chosen !== null}
            className={`group flex flex-1 items-center justify-center gap-3 rounded-2xl border px-6 py-4 text-base font-extrabold transition-all duration-200 cursor-pointer ${
              chosen !== null && scenario.safe
                ? "border-brand bg-brand/15 text-brand shadow-md scale-[1.02] ring-2 ring-brand/40"
                : chosen === true
                ? "border-sun bg-sun/15 text-sun animate-shake"
                : "border-border bg-surface hover:bg-brand/10 hover:border-brand/40 hover:-translate-y-0.5 active:scale-95 text-ink shadow-xs"
            }`}
          >
            <span className="text-2xl transition-transform group-hover:scale-110">🛡️</span>
            <span>{t("safe")}</span>
          </button>

          <button
            type="button"
            onClick={() => choose(false)}
            disabled={chosen !== null}
            className={`group flex flex-1 items-center justify-center gap-3 rounded-2xl border px-6 py-4 text-base font-extrabold transition-all duration-200 cursor-pointer ${
              chosen !== null && !scenario.safe
                ? "border-brand bg-brand/15 text-brand shadow-md scale-[1.02] ring-2 ring-brand/40"
                : chosen === false
                ? "border-sun bg-sun/15 text-sun animate-shake"
                : "border-border bg-surface hover:bg-sun/10 hover:border-sun/40 hover:-translate-y-0.5 active:scale-95 text-ink shadow-xs"
            }`}
          >
            <span className="text-2xl transition-transform group-hover:scale-110">⚡</span>
            <span>{t("notSafe")}</span>
          </button>
        </div>

        {/* Feedback Section with animated explanation */}
        {chosen !== null && (
          <div className="mt-6 animate-pop rounded-2xl border border-border bg-surface-2 p-5 shadow-sm">
            <div className="flex items-start gap-3.5">
              <span className="text-3xl">
                {chosen === scenario.safe ? "✅" : "⚠️"}
              </span>
              <div>
                <p className="text-lg font-black text-ink">
                  {chosen === scenario.safe
                    ? (locale === "bn" ? "সঠিক জীবনরক্ষাকারী সিদ্ধান্ত!" : "Safe Survival Decision!")
                    : (locale === "bn" ? "মারাত্মক বিপজ্জনক ভুল!" : "Extremely Dangerous Mistake!")}
                </p>
                <p className="mt-1.5 text-sm text-ink-2 leading-relaxed font-normal">
                  {locale === "bn" ? scenario.explanation.bn : scenario.explanation.en}
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={next}
                className="h-11 rounded-full bg-brand px-7 text-sm font-bold text-white shadow-md hover:bg-brand/90 hover:scale-105 active:scale-95 transition-all cursor-pointer"
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
