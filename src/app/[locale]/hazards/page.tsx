import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { HAZARD_SLUGS } from "@/lib/hazards";
import { Card } from "@/components/ui/Card";

export default async function HazardsIndex({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hazards");

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-16">
      <h1 className="text-3xl sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 max-w-2xl text-ink-2">{t("intro")}</p>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {HAZARD_SLUGS.map((slug) => (
          <li key={slug} data-hazard={slug}>
            <Link href={`/hazards/${slug}`} className="block">
              <Card className="flex h-full items-center gap-3 p-4 transition-colors hover:bg-surface-2">
                <span className="h-4 w-4 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span className="font-semibold">{t(`items.${slug}`)}</span>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
