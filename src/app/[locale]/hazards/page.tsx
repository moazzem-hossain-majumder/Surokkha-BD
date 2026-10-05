import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HAZARD_SLUGS, getHazard } from "@/lib/hazards";
import { Card } from "@/components/ui/Card";

export default async function HazardsIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hazards");
  const tGuide = await getTranslations("hazardPage");

  const hazardsData = await Promise.all(
    HAZARD_SLUGS.map(async (slug) => {
      const h = await getHazard(slug);
      return {
        slug,
        title: t(`items.${slug}`),
        summary: locale === "bn" ? h.summary.bn : h.summary.en,
        season: locale === "bn" ? h.season.bn : h.season.en,
      };
    })
  );

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl font-extrabold sm:text-4xl text-ink tracking-tight">{t("title")}</h1>
        <p className="mt-3 text-base text-ink-2">{t("intro")}</p>
      </div>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {hazardsData.map((h) => (
          <li key={h.slug} data-hazard={h.slug} className="group">
            <Link href={`/hazards/${h.slug}`} className="block h-full focus:outline-none">
              <Card className="flex h-full flex-col overflow-hidden border border-border/80 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-brand/40">
                <div className="relative aspect-video w-full overflow-hidden bg-surface-2">
                  <img
                    src={`/images/hazards/${h.slug}.jpg`}
                    alt={h.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-black/60 text-white backdrop-blur-xs border border-white/20">
                    {h.season}
                  </span>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5">
                  <div>
                    <h2 className="text-xl font-bold text-ink group-hover:text-brand transition-colors">
                      {h.title}
                    </h2>
                    <p className="mt-2 line-clamp-2 text-sm text-ink-2">
                      {h.summary}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-3 text-sm font-semibold text-brand">
                    <span>{tGuide("before")} &amp; {tGuide("during")}</span>
                    <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
                  </div>
                </div>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
