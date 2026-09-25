import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ReportForm } from "./ReportForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "report" });
  return { title: t("title") };
}

export default async function ReportPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("report");

  return (
    <div className="mx-auto max-w-xl px-5 py-16">
      <h1 className="text-3xl sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 text-ink-2">{t("intro")}</p>
      <p className="mt-2 text-sm text-ink-3">{t("moderationNote")}</p>
      <div className="mt-8">
        <ReportForm />
      </div>
    </div>
  );
}
