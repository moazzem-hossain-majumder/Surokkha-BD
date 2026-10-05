"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Confetti } from "@/components/ui/Confetti";
import { recordQuizCompletion } from "@/lib/badges";
import type { QuizQuestion } from "@/lib/quiz";
import { playChime, playThud, playSuccessFanfare } from "@/lib/soundEffects";

const OPTION_LETTERS = ["A", "B", "C", "D"];

export function QuizPlayer({ hazardSlug, questions, locale }: { hazardSlug: string; questions: QuizQuestion[]; locale: string }) {
  const t = useTranslations("quiz");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [done, setDone] = useState(false);

  if (questions.length === 0) {
    return <p className="text-ink-2">{t("noQuestions")}</p>;
  }

  const q = questions[index];
  const options = locale === "bn" ? q.options_bn : q.options_en;
  const progressPercent = Math.round(((index + (selected !== null ? 1 : 0)) / questions.length) * 100);

  function choose(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.answer_index) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
      playChime();
    } else {
      setStreak(0);
      playThud();
    }
  }

  function next() {
    if (index + 1 >= questions.length) {
      recordQuizCompletion(hazardSlug);
      setDone(true);
      playSuccessFanfare();
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  if (done) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <Card className="animate-pop relative overflow-hidden p-8 sm:p-10 text-center shadow-xl border border-border bg-surface">
        <Confetti active={percentage >= 70} />

        <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-3xl bg-brand/10 border-2 border-brand text-5xl shadow-md animate-float">
          {percentage >= 70 ? "🎉" : "📚"}
        </div>
        <p className="text-3xl font-black text-ink tracking-tight">
          {t("resultsTitle", { score, total: questions.length })}
        </p>
        <p className="mt-2 text-ink-2 text-base max-w-md mx-auto">{t("resultsNote")}</p>

        <div className="mt-8 flex justify-center gap-4">
          <div className="rounded-2xl bg-surface-2 px-6 py-4 border border-border shadow-xs">
            <span className="block text-xs font-bold uppercase tracking-wider text-ink-3">Mastery Level</span>
            <span className="text-3xl font-extrabold text-brand">{percentage}%</span>
          </div>
          <div className="rounded-2xl bg-surface-2 px-6 py-4 border border-border shadow-xs">
            <span className="block text-xs font-bold uppercase tracking-wider text-ink-3">Completed</span>
            <span className="text-3xl font-extrabold text-ink">{questions.length} Qs</span>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            onClick={() => {
              setIndex(0);
              setSelected(null);
              setScore(0);
              setStreak(0);
              setDone(false);
            }}
            className="px-8 h-12 text-base font-bold shadow-md cursor-pointer"
          >
            {locale === "bn" ? "আবার চেষ্টা করুন" : "Retake Quiz"}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="relative overflow-hidden border border-border p-6 sm:p-8 shadow-xl bg-surface transition-all">
      {/* Animated progress bar and streak tracker */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-bold text-ink-3 uppercase tracking-wide">
          <span>{t("questionOf", { current: index + 1, total: questions.length })}</span>
          <div className="flex items-center gap-2">
            {streak > 1 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[11px] font-extrabold text-amber-600 animate-pop">
                🔥 {streak} Streak!
              </span>
            )}
            <span className="text-brand font-mono font-bold">{progressPercent}%</span>
          </div>
        </div>
        <div className="mt-2.5 h-2.5 w-full overflow-hidden rounded-full bg-surface-2 border border-border/50">
          <div
            className="h-full bg-gradient-to-r from-teal-500 to-brand transition-all duration-500 ease-out"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <p className="mt-2 text-xl sm:text-2xl font-black text-ink leading-snug tracking-tight">
        {locale === "bn" ? q.question_bn : q.question_en}
      </p>

      <div className="mt-7 space-y-3">
        {options.map((opt, i) => {
          const isCorrect = i === q.answer_index;
          const isSelected = i === selected;
          const showState = selected !== null;

          let btnClass = "border-border bg-surface hover:bg-surface-2 hover:border-brand/40 hover:-translate-y-0.5 text-ink";
          if (showState && isCorrect) {
            btnClass = "border-brand bg-brand/15 text-brand font-bold shadow-md ring-2 ring-brand/40 animate-shield";
          } else if (showState && isSelected) {
            btnClass = "border-sun bg-sun/15 text-sun font-bold animate-shake";
          } else if (showState) {
            btnClass = "border-border/50 opacity-55 bg-surface/50 text-ink-3";
          }

          return (
            <button
              key={i}
              type="button"
              onClick={() => choose(i)}
              disabled={selected !== null}
              className={`group flex w-full items-center justify-between rounded-xl border px-5 py-4 text-left text-sm sm:text-base font-semibold transition-all duration-200 cursor-pointer shadow-2xs ${btnClass}`}
            >
              <div className="flex items-center gap-3.5">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-all ${
                    showState && isCorrect
                      ? "bg-brand text-white shadow-xs scale-110"
                      : showState && isSelected
                      ? "bg-sun text-white shadow-xs"
                      : "bg-surface-2 text-ink-2 group-hover:bg-brand group-hover:text-white"
                  }`}
                >
                  {OPTION_LETTERS[i]}
                </span>
                <span className="leading-snug">{opt}</span>
              </div>
              {showState && isCorrect && <span className="text-xl font-black text-brand">✓</span>}
              {showState && isSelected && !isCorrect && <span className="text-xl font-black text-sun">✗</span>}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-7 animate-pop rounded-2xl border border-border/80 bg-surface-2 p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-bold text-ink">
                {selected === q.answer_index
                  ? (locale === "bn" ? "সঠিক উত্তর!" : "Correct!")
                  : (locale === "bn" ? "সঠিক উত্তরটি লক্ষ্য করুন:" : "Notice the explanation:")}
              </p>
              <p className="mt-1 text-sm text-ink-2 leading-relaxed font-normal">
                {locale === "bn" ? q.explanation_bn : q.explanation_en}
              </p>
            </div>
          </div>
          <div className="mt-5 flex justify-end">
            <Button type="button" onClick={next} className="shadow-md px-7 h-11 text-sm font-bold cursor-pointer">
              {index + 1 >= questions.length ? t("finish") : t("next")}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
