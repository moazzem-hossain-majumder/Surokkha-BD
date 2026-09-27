import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import type { HistoricalEvent } from "@/lib/historicalEvents";
import { ExplorerClient } from "./ExplorerClient";

export default async function ExplorerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("explorer");
  const supabase = await createClient();

  const { data } = await supabase.from("historical_events").select("*").order("year", { ascending: true });
  const events = (data ?? []) as HistoricalEvent[];

  return (
    <div className="mx-auto max-w-[900px] px-5 py-10">
      <h1 className="text-3xl">{t("title")}</h1>
      <p className="mt-2 text-ink-2">{t("intro")}</p>
      <p className="mt-1 text-xs text-ink-3">{t("disclaimer")}</p>

      <div className="mt-8">
        <ExplorerClient events={events} locale={locale} />
      </div>
    </div>
  );
}
