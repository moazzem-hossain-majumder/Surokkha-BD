import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapClient } from "./MapClient";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "map" });
  return { title: t("title") };
}

export default async function MapPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("map");

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-10">
      <h1 className="text-3xl sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 max-w-2xl text-ink-2">{t("intro")}</p>
      <div className="mt-6">
        <MapClient />
      </div>
    </div>
  );
}
