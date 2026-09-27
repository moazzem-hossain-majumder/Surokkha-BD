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
    <div className="mx-auto max-w-[700px] px-5 py-10">
      <h1 className="text-3xl">{t("title")}</h1>
      <p className="mt-2 text-ink-2">{t("intro")}</p>

      <ul className="mt-8 grid gap-3 sm:grid-cols-2">
        {HAZARD_SLUGS.map((slug) => (
          <li key={slug}>
            <Link href={`/quiz/${slug}`}>
              <Card className="p-4 hover:bg-surface-2">
                <p className="font-semibold">{tHazards(`items.${slug}`)}</p>
                <p className="mt-1 text-sm text-brand">{t("start")}</p>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
