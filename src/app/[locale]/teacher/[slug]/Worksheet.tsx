"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card } from "@/components/ui/Card";
import type { HazardContent } from "@/lib/hazards";
import type { QuizQuestion } from "@/lib/quiz";

export function Worksheet({ hazard, questions }: { hazard: HazardContent; questions: QuizQuestion[] }) {
  const t = useTranslations("teacher");
  const locale = useLocale();
  const [showAnswerKey, setShowAnswerKey] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-4 print:hidden">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={showAnswerKey} onChange={(e) => setShowAnswerKey(e.target.checked)} className="h-4 w-4" />
          {t("showAnswerKey")}
        </label>
        <button
          type="button"
          onClick={() => window.print()}
          className="h-10 rounded-full bg-brand px-4 text-sm font-semibold text-white"
        >
          {t("print")}
        </button>
      </div>

      <Card className="mt-6 p-6 print:border-0 print:p-0 print:shadow-none">
        <h2 className="text-xl font-bold">{locale === "bn" ? "নিরাপত্তা প্রস্তুতি" : "Safety preparation checklist"}</h2>
        <p className="mt-1 text-sm text-ink-2">{locale === "bn" ? hazard.summary.bn : hazard.summary.en}</p>
        <ol className="mt-4 space-y-2">
          {hazard.before.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span className="mt-0.5 inline-block h-4 w-4 shrink-0 border border-ink-3" aria-hidden="true" />
              {locale === "bn" ? item.bn : item.en}
            </li>
          ))}
        </ol>

        <h2 className="mt-8 text-xl font-bold">{t("quizSection")}</h2>
        <ol className="mt-4 space-y-4">
          {questions.map((q, i) => (
            <li key={q.id} className="text-sm">
              <p className="font-semibold">
                {i + 1}. {locale === "bn" ? q.question_bn : q.question_en}
              </p>
              <ol className="mt-1 space-y-1 pl-4" style={{ listStyleType: "lower-alpha" }}>
                {(locale === "bn" ? q.options_bn : q.options_en).map((opt, j) => (
                  <li key={j}>{opt}</li>
                ))}
              </ol>
            </li>
          ))}
          {questions.length === 0 && <p className="text-ink-2">{t("noQuestions")}</p>}
        </ol>

        {showAnswerKey && questions.length > 0 && (
          <div className="mt-8 border-t border-border pt-4" style={{ breakBefore: "page" }}>
            <h2 className="text-lg font-bold">{t("answerKey")}</h2>
            <ol className="mt-3 space-y-2 text-sm">
              {questions.map((q, i) => (
                <li key={q.id}>
                  {i + 1}. {String.fromCharCode(97 + q.answer_index)}) {(locale === "bn" ? q.options_bn : q.options_en)[q.answer_index]}
                  {" \u2014 "}
                  <span className="text-ink-2">{locale === "bn" ? q.explanation_bn : q.explanation_en}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </Card>
    </div>
  );
}
