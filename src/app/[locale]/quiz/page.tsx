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
      <div className="max-w-xl">
        <h1 className="text-3xl font-black text-ink tracking-tight sm:text-4xl">{t("title")}</h1>
        <p className="mt-2 text-base text-ink-2 leading-relaxed">{t("intro")}</p>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HAZARD_SLUGS.map((slug) => (
          <Link key={slug} href={`/quiz/${slug}`} className="group block">
            <Card
              variant="interactive"
              className="overflow-hidden border border-border p-0"
            >
              {/* Photo Header */}
              <div className="relative h-36 overflow-hidden">
                <img
                  src={`/images/hazards/${slug}.jpg`}
                  alt={tHazards(`items.${slug}`)}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute bottom-2.5 left-3 right-3 z-10 flex items-center justify-between font-mono text-xs">
                  <span className="inline-flex items-center rounded-sm bg-black/70 px-2 py-0.5 font-semibold text-white border border-white/20 text-[11px]">
                    SOP CHECK
                  </span>
                  <span className="text-[11px] font-semibold text-white">5 Questions</span>
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-base font-bold text-ink tracking-tight group-hover:text-brand transition-colors">
                  {tHazards(`items.${slug}`)}
                </h2>
                <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5 text-xs">
                  <span className="font-mono text-ink-3">PROTOCOL ASSESSMENT</span>
                  <span className="font-semibold text-brand">
                    {t("start")} →
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
