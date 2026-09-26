import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getDistrict } from "@/lib/districts";
import { Card } from "@/components/ui/Card";
import { progressPercent, type PublicNeed, type PledgeStatus, type HandoverMethod } from "@/lib/relief";
import { PledgeForm } from "./PledgeForm";

interface ActivityRow {
  id: string;
  qty: number;
  handover_method: HandoverMethod;
  status: PledgeStatus;
  created_at: string;
}

export default async function ReliefNeedPage({ params }: { params: Promise<{ locale: string; id: string }> }) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("relief");
  const supabase = await createClient();

  const [{ data: need }, { data: activity }, { data: userData }] = await Promise.all([
    supabase.from("relief_needs_public").select("*").eq("id", id).maybeSingle(),
    supabase.from("pledges_activity_public").select("*").eq("need_id", id).order("created_at", { ascending: false }),
    supabase.auth.getUser(),
  ]);

  if (!need) notFound();
  const n = need as PublicNeed;
  const pct = progressPercent(n.qty_pledged, n.qty_needed);
  const district = getDistrict(n.district_code);

  return (
    <div className="mx-auto max-w-[700px] px-5 py-10">
      <p className="text-sm text-ink-2">{district ? (locale === "bn" ? district.name.bn : district.name.en) : n.district_code}</p>
      <h1 className="mt-1 text-3xl">
        {n.item} · {n.qty_needed} {n.unit}
      </h1>
      {n.note && <p className="mt-2 text-ink-2">{n.note}</p>}
      {n.deadline && (
        <p className="mt-1 text-sm text-ink-3">
          {t("deadline")}: {new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-US", { dateStyle: "medium", timeZone: "Asia/Dhaka" }).format(new Date(n.deadline))}
        </p>
      )}

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
        <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
      </div>
      <p className="mt-1 text-xs text-ink-3">
        {t("pledgedOfNeeded", { pledged: n.qty_pledged, needed: n.qty_needed, unit: n.unit })} · {t("delivered")}: {n.qty_delivered}
      </p>

      {n.status !== "open" && <p className="mt-2 text-sm font-semibold">{t(`status.${n.status}`)}</p>}

      {n.status === "open" && (
        <Card className="mt-6 p-6">
          <h2 className="text-lg font-bold">{t("makeAPledge")}</h2>
          <div className="mt-4">
            <PledgeForm locale={locale} needId={n.id} signedIn={!!userData.user} />
          </div>
        </Card>
      )}

      <section className="mt-8">
        <h2 className="text-lg font-bold">{t("activityLog")}</h2>
        <ul className="mt-3 space-y-2">
          {((activity ?? []) as ActivityRow[]).map((a) => (
            <li key={a.id} className="text-sm text-ink-2">
              {t("activityLine", { qty: a.qty, unit: n.unit, status: t(`pledgeStatus.${a.status}`) })} ·{" "}
              {new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dhaka" }).format(
                new Date(a.created_at)
              )}
            </li>
          ))}
          {(activity ?? []).length === 0 && <p className="text-sm text-ink-3">{t("noActivity")}</p>}
        </ul>
      </section>
    </div>
  );
}
