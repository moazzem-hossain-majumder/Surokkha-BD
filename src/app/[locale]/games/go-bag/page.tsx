import { getTranslations, setRequestLocale } from "next-intl/server";
import { GoBagGame } from "./GoBagGame";

export default async function GoBagGamePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("games.goBag");

  return (
    <div className="mx-auto max-w-[700px] px-5 py-10">
      <h1 className="text-3xl">{t("title")}</h1>
      <p className="mt-2 text-ink-2">{t("description")}</p>
      <div className="mt-6">
        <GoBagGame />
      </div>
    </div>
  );
}
