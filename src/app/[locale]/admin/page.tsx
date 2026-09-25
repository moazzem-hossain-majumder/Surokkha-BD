import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";

export default async function AdminOverview({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const supabase = await createClient();

  const [{ count: pendingReports }, { count: activeAlerts }, { count: shelterCount }] = await Promise.all([
    supabase.from("reports").select("id", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("alerts").select("id", { count: "exact", head: true }).gt("expires_at", new Date().toISOString()),
    supabase.from("shelters").select("id", { count: "exact", head: true }).eq("active", true),
  ]);

  const stats = [
    { label: t("stats.pendingReports"), value: pendingReports ?? 0 },
    { label: t("stats.activeAlerts"), value: activeAlerts ?? 0 },
    { label: t("stats.activeShelters"), value: shelterCount ?? 0 },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {stats.map((s) => (
        <Card key={s.label} className="p-5">
          <p className="text-3xl font-bold">{s.value}</p>
          <p className="mt-1 text-sm text-ink-2">{s.label}</p>
        </Card>
      ))}
    </div>
  );
}
