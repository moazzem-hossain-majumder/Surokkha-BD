import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getDistrict } from "@/lib/districts";
import { Card } from "@/components/ui/Card";
import { progressPercent, type PublicNeed, type PledgeStatus, type HandoverMethod } from "@/lib/relief";
import { NeedForm } from "./NeedForm";
import { NeedStatusButtons } from "./NeedStatusButtons";
import { PledgeControls } from "./PledgeControls";

interface PledgeRow {
  id: string;
  need_id: string;
  donor_id: string;
  qty: number;
  handover_method: HandoverMethod;
  status: PledgeStatus;
  created_at: string;
}

export default async function AdminReliefPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("admin");
  const supabase = await createClient();

  const [{ data: needsData }, { data: pledgesData }] = await Promise.all([
    supabase.from("relief_needs_public").select("*").order("created_at", { ascending: false }).limit(50),
    supabase
      .from("pledges")
      .select("id, need_id, donor_id, qty, handover_method, status, created_at")
      .order("created_at", { ascending: false })
      .limit(200),
  ]);

  const needs = (needsData ?? []) as PublicNeed[];
  const pledgesByNeed = new Map<string, PledgeRow[]>();
  for (const p of (pledgesData ?? []) as PledgeRow[]) {
    const list = pledgesByNeed.get(p.need_id) ?? [];
    list.push(p);
    pledgesByNeed.set(p.need_id, list);
  }

  return (
    <div className="space-y-8">
      <Card className="p-6">
        <h2 className="text-xl font-bold">{t("relief.newNeed")}</h2>
        <div className="mt-4">
          <NeedForm locale={locale} />
        </div>
      </Card>

      <section>
        <h2 className="text-xl font-bold">{t("relief.existing")}</h2>
        <ul className="mt-4 space-y-4">
          {needs.map((n) => {
            const pledges = pledgesByNeed.get(n.id) ?? [];
            const pct = progressPercent(n.qty_pledged, n.qty_needed);
            const district = getDistrict(n.district_code);
            return (
              <li key={n.id}>
                <Card className="p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">
                        {n.item} · {n.qty_needed} {n.unit}
                      </p>
                      <p className="text-sm text-ink-2">
                        {district ? (locale === "bn" ? district.name.bn : district.name.en) : n.district_code} ·{" "}
                        {t(`relief.status.${n.status}`)}
                      </p>
                    </div>
                    {n.status === "open" && <NeedStatusButtons locale={locale} id={n.id} />}
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-ink-3">
                    {t("relief.pledgedOfNeeded", { pledged: n.qty_pledged, needed: n.qty_needed, unit: n.unit })} ·{" "}
                    {t("relief.delivered")}: {n.qty_delivered}
                  </p>

                  {pledges.length > 0 && (
                    <ul className="mt-3 space-y-2 border-t border-border pt-3">
                      {pledges.map((p) => (
                        <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                          <span>
                            {p.qty} {n.unit} · {t(`relief.handover.${p.handover_method}`)} ·{" "}
                            <span className="font-semibold">{t(`relief.pledgeStatus.${p.status}`)}</span>
                          </span>
                          <PledgeControls locale={locale} pledgeId={p.id} status={p.status} />
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              </li>
            );
          })}
          {needs.length === 0 && <p className="text-ink-2">{t("relief.none")}</p>}
        </ul>
      </section>
    </div>
  );
}
