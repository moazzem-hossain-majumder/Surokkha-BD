import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import type { FerrySchedule } from "@/lib/ferries";
import { HelpRequestForm } from "./HelpRequestForm";

export default async function FerriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("ferries");
  const supabase = await createClient();

  const { data } = await supabase.from("ferry_schedules").select("*").order("route", { ascending: true });
  const schedules = (data ?? []) as FerrySchedule[];

  return (
    <div className="mx-auto max-w-[700px] px-5 py-10">
      <h1 className="text-3xl">{t("title")}</h1>
      <p className="mt-2 text-ink-2">{t("intro")}</p>
      <p className="mt-1 text-xs text-ink-3">{t("disclaimer")}</p>

      <ul className="mt-8 space-y-4">
        {schedules.map((s) => (
          <li key={s.id}>
            <Card className="p-5">
              <p className="font-semibold">{s.route}</p>
              <p className="mt-1 text-sm text-ink-2">
                {s.from_place} \u2192 {s.to_place}
              </p>
              <p className="mt-1 text-sm text-ink-2">{s.departs}</p>
              <p className="mt-1 text-xs text-ink-3">{s.days}</p>
              {s.contact && <p className="mt-1 text-xs text-ink-3">{t("contact")}: {s.contact}</p>}
              <p className="mt-1 text-xs text-ink-3">
                {t("source")}: {s.source_name}
              </p>
            </Card>
          </li>
        ))}
        {schedules.length === 0 && <p className="text-ink-2">{t("none")}</p>}
      </ul>

      <section className="mt-10">
        <h2 className="text-xl font-bold">{t("requestHelp")}</h2>
        <p className="mt-1 text-sm text-ink-2">{t("requestHelpIntro")}</p>
        <Card className="mt-4 p-6">
          <HelpRequestForm locale={locale} />
        </Card>
      </section>
    </div>
  );
}
