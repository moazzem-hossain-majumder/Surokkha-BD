import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Card } from "@/components/ui/Card";
import { AlertForm } from "./AlertForm";
import { ExpireButton } from "./ExpireButton";

interface AlertRow {
  id: string;
  hazard_slug: string;
  title_en: string;
  title_bn: string;
  severity: number;
  district_codes: string[];
  source_name: string;
  expires_at: string;
}

export default async function AdminAlertsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const supabase = await createClient();

  const { data } = await supabase
    .from("alerts")
    .select("id, hazard_slug, title_en, title_bn, severity, district_codes, source_name, expires_at")
    .order("issued_at", { ascending: false })
    .limit(50);

  const alerts = (data ?? []) as AlertRow[];

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-xl font-bold">{t("alerts.newAlert")}</h2>
        <div className="mt-4">
          <AlertForm locale={locale} />
        </div>
      </Card>

      <section>
        <h2 className="text-xl font-bold">{t("alerts.existing")}</h2>
        <ul className="mt-4 space-y-3">
          {alerts.map((a) => {
            // Checking expiry inherently needs the current time; this is a Server
            // Component that renders fresh per request, so no stale-memoization risk.
            // eslint-disable-next-line react-hooks/purity
            const active = new Date(a.expires_at).getTime() > Date.now();
            return (
              <li key={a.id}>
                <Card className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div>
                    <p className="font-semibold">{locale === "bn" ? a.title_bn : a.title_en}</p>
                    <p className="text-sm text-ink-2">
                      {t("alerts.severity")} {a.severity} · {a.source_name} ·{" "}
                      {active ? t("alerts.active") : t("alerts.expired")}
                    </p>
                  </div>
                  {active && <ExpireButton locale={locale} id={a.id} />}
                </Card>
              </li>
            );
          })}
          {alerts.length === 0 && <p className="text-ink-2">{t("alerts.none")}</p>}
        </ul>
      </section>
    </div>
  );
}
