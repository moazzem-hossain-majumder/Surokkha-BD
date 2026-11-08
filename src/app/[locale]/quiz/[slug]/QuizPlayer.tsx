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
      <Card className="p-8 text-center border border-border bg-surface rounded-md">
        <Confetti active={percentage >= 70} />

        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-md bg-brand/10 border border-brand text-brand">
          <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <p className="text-2xl font-bold text-ink tracking-tight">
          {t("resultsTitle", { score, total: questions.length })}
        </p>
        <p className="mt-1 text-ink-2 text-sm max-w-md mx-auto">{t("resultsNote")}</p>

        <div className="mt-6 flex justify-center gap-3">
          <div className="rounded-md bg-surface-2 px-5 py-3 border border-border text-center">
            <span className="block text-[11px] font-mono uppercase tracking-wider text-ink-3">Score</span>
            <span className="text-2xl font-bold text-brand">{percentage}%</span>
          </div>
          <div className="rounded-md bg-surface-2 px-5 py-3 border border-border text-center">
            <span className="block text-[11px] font-mono uppercase tracking-wider text-ink-3">Total</span>
            <span className="text-2xl font-bold text-ink">{questions.length} Questions</span>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <Button
            type="button"
            onClick={() => {
              setIndex(0);
              setSelected(null);
              setScore(0);
              setStreak(0);
              setDone(false);
            }}
            className="px-6 h-10 text-sm font-semibold cursor-pointer"
          >
            {locale === "bn" ? "আবার চেষ্টা করুন" : "Retake Quiz"}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="border border-border p-6 bg-surface rounded-md">
      {/* Progress bar and streak tracker */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs font-mono text-ink-3 uppercase">
          <span>{t("questionOf", { current: index + 1, total: questions.length })}</span>
          <div className="flex items-center gap-2">
            {streak > 1 && (
              <span className="inline-flex items-center rounded-sm bg-surface-2 border border-border px-2 py-0.5 text-[11px] font-mono font-semibold text-brand">
                STREAK: {streak}
              </span>
            )}
            <span className="text-brand font-mono font-semibold">{progressPercent}%</span>
          </div>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-xs bg-surface-2 border border-border">
          <div
            className="h-full bg-brand transition-all duration-200 ease-out"
            style={{ width: `${((index + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <p className="mt-2 text-lg sm:text-xl font-bold text-ink leading-snug tracking-tight">
        {locale === "bn" ? q.question_bn : q.question_en}
      </p>

      <div className="mt-6 space-y-2.5">
        {options.map((opt, i) => {
          const isCorrect = i === q.answer_index;
          const isSelected = i === selected;
          const showState = selected !== null;

          let btnClass = "border-border bg-surface hover:bg-surface-2 hover:border-ink-3/40 text-ink";
          if (showState && isCorrect) {
            btnClass = "border-brand bg-brand/10 text-brand font-semibold";
          } else if (showState && isSelected) {
            btnClass = "border-sun bg-sun/10 text-sun font-semibold";
          } else if (showState) {
            btnClass = "border-border/50 opacity-50 bg-surface/50 text-ink-3";
          }

          return (
            <button
              key={i}
              type="button"
              onClick={() => choose(i)}
              disabled={selected !== null}
              className={`flex w-full items-center justify-between rounded-md border px-4 py-3 text-left text-sm font-medium transition-colors duration-150 cursor-pointer ${btnClass}`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-xs text-xs font-mono font-bold transition-colors ${
                    showState && isCorrect
                      ? "bg-brand text-brand-ink"
                      : showState && isSelected
                      ? "bg-sun text-white"
                      : "bg-surface-2 text-ink-2"
                  }`}
                >
                  {OPTION_LETTERS[i]}
                </span>
                <span className="leading-snug">{opt}</span>
              </div>
              {showState && isCorrect && <span className="text-sm font-mono font-bold text-brand">[CORRECT]</span>}
              {showState && isSelected && !isCorrect && <span className="text-sm font-mono font-bold text-sun">[INCORRECT]</span>}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-6 rounded-md border border-border bg-surface-2 p-4">
          <div className="flex items-start gap-2.5">
            <div>
              <p className="text-xs font-mono font-bold uppercase text-ink">
                {selected === q.answer_index
                  ? (locale === "bn" ? "সঠিক উত্তর" : "EXPLANATION")
                  : (locale === "bn" ? "ব্যাখ্যা" : "EXPLANATION")}
              </p>
              <p className="mt-1 text-xs text-ink-2 leading-relaxed">
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
