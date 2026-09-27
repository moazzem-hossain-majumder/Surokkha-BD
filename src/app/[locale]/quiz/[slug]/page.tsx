import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { isHazardSlug } from "@/lib/hazards";
import type { QuizQuestion } from "@/lib/quiz";
import { QuizPlayer } from "./QuizPlayer";

export default async function QuizPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (!isHazardSlug(slug)) notFound();

  const t = await getTranslations("quiz");
  const tHazards = await getTranslations("hazards");
  const supabase = await createClient();

  const { data } = await supabase.from("quiz_questions").select("*").eq("hazard_slug", slug);
  const questions = (data ?? []) as QuizQuestion[];

  return (
    <div className="mx-auto max-w-[700px] px-5 py-10">
      <p className="text-sm text-ink-2">{t("title")}</p>
      <h1 className="mt-1 text-3xl">{tHazards(`items.${slug}`)}</h1>
      <div className="mt-6">
        <QuizPlayer hazardSlug={slug} questions={questions} locale={locale} />
      </div>
    </div>
  );
}
