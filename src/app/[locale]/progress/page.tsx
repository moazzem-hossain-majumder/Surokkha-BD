import { getTranslations, setRequestLocale } from "next-intl/server";
import { ProgressClient } from "./ProgressClient";

export default async function ProgressPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("progress");

  return (
    <div className="mx-auto max-w-[700px] px-5 py-10">
      <h1 className="text-3xl">{t("title")}</h1>
      <p className="mt-2 text-ink-2">{t("intro")}</p>
      <div className="mt-6">
        <ProgressClient />
      </div>
    </div>
  );
}
