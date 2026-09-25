import { getTranslations, setRequestLocale } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { getCurrentProfile } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";

interface AuditRow {
  id: string;
  action: string;
  entity: string;
  entity_id: string | null;
  at: string;
  actor_id: string | null;
}

export default async function AdminAuditPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const profile = await getCurrentProfile();
  if (profile?.role !== "admin") redirect({ href: "/admin", locale });

  const t = await getTranslations("admin");
  const supabase = await createClient();
  const { data } = await supabase
    .from("audit_log")
    .select("id, action, entity, entity_id, at, actor_id")
    .order("at", { ascending: false })
    .limit(100);

  const rows = (data ?? []) as AuditRow[];

  return (
    <div>
      <h2 className="text-xl font-bold">{t("audit.title")}</h2>
      <ul className="mt-4 space-y-2">
        {rows.map((r) => (
          <li key={r.id}>
            <Card className="p-4 text-sm">
              <span className="font-semibold">{r.action}</span> · {r.entity}
              {r.entity_id ? ` #${r.entity_id.slice(0, 8)}` : ""} ·{" "}
              <span className="text-ink-3">{new Date(r.at).toLocaleString(locale === "bn" ? "bn-BD" : "en-US")}</span>
            </Card>
          </li>
        ))}
        {rows.length === 0 && <p className="text-ink-2">{t("audit.none")}</p>}
      </ul>
    </div>
  );
}
