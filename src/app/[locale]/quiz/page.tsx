import { getTranslations, setRequestLocale } from "next-intl/server";
import { HAZARD_SLUGS } from "@/lib/hazards";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";

export default async function QuizHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("quiz");
  const tHazards = await getTranslations("hazards");

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-12">
      <div className="text-center max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 border border-brand/20 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand mb-3">
          🧠 Disaster Mastery Quizzes
        </span>
        <h1 className="text-4xl font-black text-ink tracking-tight sm:text-5xl">{t("title")}</h1>
        <p className="mt-3 text-lg text-ink-2 leading-relaxed">{t("intro")}</p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {HAZARD_SLUGS.map((slug) => (
          <Link key={slug} href={`/quiz/${slug}`} className="group block">
            <Card
              variant="interactive"
              className="overflow-hidden border border-border/80 p-0 shadow-md group-hover:shadow-xl transition-all"
            >
              {/* Photo Header with gradient scrim */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={`/images/hazards/${slug}.jpg`}
                  alt={tHazards(`items.${slug}`)}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
                <div className="absolute bottom-3 left-4 right-4 z-10 flex items-center justify-between">
                  <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-bold text-white backdrop-blur-md border border-white/20">
                    SOP Quiz
                  </span>
                  <span className="text-xs font-bold text-white/90">5 Questions</span>
                </div>
              </div>

              <div className="p-5">
                <h2 className="text-lg font-black text-ink tracking-tight group-hover:text-brand transition-colors">
                  {tHazards(`items.${slug}`)}
                </h2>
                <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
                  <span className="text-xs font-semibold text-ink-3">Interactive Test</span>
                  <span className="text-sm font-bold text-brand group-hover:translate-x-1 transition-transform">
                    {t("start")}
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
