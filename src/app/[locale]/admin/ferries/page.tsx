import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import type { FerrySchedule, FerryHelpRequest } from "@/lib/ferries";
import { ScheduleForm } from "./ScheduleForm";
import { DeleteScheduleButton } from "./DeleteScheduleButton";
import { HelpRequestControls } from "./HelpRequestControls";

export default async function AdminFerriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const supabase = await createClient();

  const [{ data: schedulesData }, { data: requestsData }] = await Promise.all([
    supabase.from("ferry_schedules").select("*").order("route", { ascending: true }),
    supabase.from("ferry_help_requests").select("*").order("created_at", { ascending: false }).limit(100),
  ]);

  const schedules = (schedulesData ?? []) as FerrySchedule[];
  const requests = (requestsData ?? []) as FerryHelpRequest[];

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-xl font-bold">{t("ferries.newSchedule")}</h2>
        <div className="mt-4">
          <ScheduleForm locale={locale} />
        </div>
      </Card>

      <section>
        <h2 className="text-xl font-bold">{t("ferries.existingSchedules")}</h2>
        <ul className="mt-4 space-y-3">
          {schedules.map((s) => (
            <li key={s.id}>
              <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-semibold">{s.route}</p>
                  <p className="text-sm text-ink-2">
                    {s.from_place} \u2192 {s.to_place} \u00b7 {s.departs}
                  </p>
                </div>
                <DeleteScheduleButton locale={locale} id={s.id} />
              </Card>
            </li>
          ))}
          {schedules.length === 0 && <p className="text-ink-2">{t("ferries.noneYet")}</p>}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-bold">{t("ferries.helpRequests")}</h2>
        <ul className="mt-4 space-y-3">
          {requests.map((r) => (
            <li key={r.id}>
              <Card className="p-4">
                <p className="font-semibold">{r.route}</p>
                <p className="mt-1 text-sm text-ink-2">{r.message}</p>
                {r.contact_optional && <p className="mt-1 text-xs text-ink-3">{t("ferries.contact")}: {r.contact_optional}</p>}
                <p className="mt-1 text-xs text-ink-3">{t(`ferries.status.${r.status}`)}</p>
                {r.reply && <p className="mt-1 text-sm text-brand">{t("ferries.reply")}: {r.reply}</p>}
                {r.status === "open" && <HelpRequestControls locale={locale} id={r.id} />}
              </Card>
            </li>
          ))}
          {requests.length === 0 && <p className="text-ink-2">{t("ferries.noRequests")}</p>}
        </ul>
      </section>
    </div>
  );
}
