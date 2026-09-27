import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";

export default async function GamesHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("games");

  return (
    <div className="mx-auto max-w-[700px] px-5 py-10">
      <h1 className="text-3xl">{t("title")}</h1>
      <p className="mt-2 text-ink-2">{t("intro")}</p>

      <ul className="mt-8 space-y-4">
        <li>
          <Link href="/games/lightning">
            <Card className="p-5 hover:bg-surface-2">
              <p className="font-semibold">{t("lightning.title")}</p>
              <p className="mt-1 text-sm text-ink-2">{t("lightning.description")}</p>
            </Card>
          </Link>
        </li>
        <li>
          <Link href="/games/go-bag">
            <Card className="p-5 hover:bg-surface-2">
              <p className="font-semibold">{t("goBag.title")}</p>
              <p className="mt-1 text-sm text-ink-2">{t("goBag.description")}</p>
            </Card>
          </Link>
        </li>
      </ul>
    </div>
  );
}
