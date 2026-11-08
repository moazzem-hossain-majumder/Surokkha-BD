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
    <div className="mx-auto max-w-6xl px-5 py-10 sm:py-14">
      {/* Page Header: Structured technical layout */}
      <div className="border-b border-border pb-6">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="text-3xl font-black tracking-tight sm:text-4xl text-ink">
            {t("title")}
          </h1>
          <span className="font-mono text-xs text-ink-3 uppercase tracking-wider">
            CITIZEN TELEMETRY &bull; INCIDENT DISPATCH
          </span>
        </div>
        <p className="mt-3 max-w-3xl text-base text-ink-2 leading-relaxed">
          {t("intro")}
        </p>
        <div className="mt-4 flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2 text-xs text-ink-3 w-fit">
          <span className="h-2 w-2 rounded-full bg-brand" />
          <span>{t("moderationNote")}</span>
        </div>
      </div>

      {/* 2-Column Responsive Form & Google Map */}
      <div className="mt-8">
        <ReportForm />
      </div>
    </div>
  );
}
