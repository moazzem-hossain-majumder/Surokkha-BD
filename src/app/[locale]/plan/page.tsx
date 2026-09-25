import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PlanForm } from "./PlanForm";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "plan" });
  return { title: t("title") };
}

export default async function PlanPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("plan");

  return (
    <div className="mx-auto max-w-[1000px] px-5 py-16">
      <h1 className="text-3xl sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 max-w-2xl text-ink-2">{t("intro")}</p>
      <p className="mt-2 text-sm text-ink-3">{t("privacyNote")}</p>
      <div className="mt-8">
        <PlanForm />
      </div>
    </div>
  );
}
