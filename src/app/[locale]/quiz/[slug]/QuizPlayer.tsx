"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { recordQuizCompletion } from "@/lib/badges";
import type { QuizQuestion } from "@/lib/quiz";

export function QuizPlayer({ hazardSlug, questions, locale }: { hazardSlug: string; questions: QuizQuestion[]; locale: string }) {
  const t = useTranslations("quiz");
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  if (questions.length === 0) {
    return <p className="text-ink-2">{t("noQuestions")}</p>;
  }

  const q = questions[index];
  const options = locale === "bn" ? q.options_bn : q.options_en;

  function choose(i: number) {
    if (selected !== null) return;
    setSelected(i);
    if (i === q.answer_index) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= questions.length) {
      recordQuizCompletion(hazardSlug);
      setDone(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  if (done) {
    return (
      <Card className="p-6 text-center">
        <p className="text-lg font-bold">{t("resultsTitle", { score, total: questions.length })}</p>
        <p className="mt-2 text-ink-2">{t("resultsNote")}</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <p className="text-sm text-ink-2">{t("questionOf", { current: index + 1, total: questions.length })}</p>
      <p className="mt-2 text-lg font-semibold">{locale === "bn" ? q.question_bn : q.question_en}</p>

      <div className="mt-4 space-y-2">
        {options.map((opt, i) => {
          const isCorrect = i === q.answer_index;
          const isSelected = i === selected;
          const showState = selected !== null;
          return (
            <button
              key={i}
              type="button"
              onClick={() => choose(i)}
              disabled={selected !== null}
              className={`block w-full rounded-input border px-4 py-3 text-left text-sm font-medium transition-colors ${
                showState && isCorrect
                  ? "border-brand bg-brand/10"
                  : showState && isSelected
                    ? "border-sun bg-sun/10"
                    : "border-border bg-surface hover:bg-surface-2"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>

      {selected !== null && (
        <div className="mt-4">
          <p className="text-sm text-ink-2">{locale === "bn" ? q.explanation_bn : q.explanation_en}</p>
          <div className="mt-3">
            <Button type="button" onClick={next}>
              {index + 1 >= questions.length ? t("finish") : t("next")}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
