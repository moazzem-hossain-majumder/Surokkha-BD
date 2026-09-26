import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";

export default async function AdminOverview({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const supabase = await createClient();

  const [{ count: pendingReports }, { count: activeAlerts }, { count: shelterCount }, { data: needsData }, { data: tasksData }] =
    await Promise.all([
      supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("alerts").select("id", { count: "exact", head: true }).gt("expires_at", new Date().toISOString()),
      supabase.from("shelters").select("id", { count: "exact", head: true }).eq("active", true),
      supabase.from("relief_needs_public").select("status, qty_needed, qty_pledged"),
      supabase.from("volunteer_tasks_public").select("status, slots, slots_filled"),
    ]);

  const needs = needsData ?? [];
  const needsFulfilledPct = needs.length
    ? Math.round((needs.filter((n) => n.qty_pledged >= n.qty_needed).length / needs.length) * 100)
    : 0;

  const openTasks = (tasksData ?? []).filter((t) => t.status !== "closed");
  const totalSlots = openTasks.reduce((sum, t) => sum + t.slots, 0);
  const filledSlots = openTasks.reduce((sum, t) => sum + Math.min(t.slots_filled, t.slots), 0);
  const taskFillPct = totalSlots ? Math.round((filledSlots / totalSlots) * 100) : 0;

  const stats = [
    { label: t("stats.pendingReports"), value: pendingReports ?? 0 },
    { label: t("stats.activeAlerts"), value: activeAlerts ?? 0 },
    { label: t("stats.activeShelters"), value: shelterCount ?? 0 },
    { label: t("stats.needsFulfilled"), value: `${needsFulfilledPct}%` },
    { label: t("stats.taskFillRate"), value: `${taskFillPct}%` },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((s) => (
        <Card key={s.label} className="p-5">
          <p className="text-3xl font-bold">{s.value}</p>
          <p className="mt-1 text-sm text-ink-2">{s.label}</p>
        </Card>
      ))}
    </div>
  );
}
