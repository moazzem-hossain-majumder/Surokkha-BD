import { getTranslations, setRequestLocale } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { getDistrict } from "@/lib/districts";
import { Card } from "@/components/ui/Card";
import { Link } from "@/i18n/navigation";
import { progressPercent, type PublicNeed } from "@/lib/relief";

export default async function ReliefBoardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("relief");
  const supabase = await createClient();

  const { data } = await supabase
    .from("relief_needs_public")
    .select("*")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(100);

  const needs = (data ?? []) as PublicNeed[];

  return (
    <div className="mx-auto max-w-[900px] px-5 py-10">
      <h1 className="text-3xl">{t("title")}</h1>
      <p className="mt-2 text-ink-2">{t("intro")}</p>
      <p className="mt-1 text-xs text-ink-3">{t("disclaimer")}</p>

      <ul className="mt-8 space-y-4">
        {needs.map((n) => {
          const pct = progressPercent(n.qty_pledged, n.qty_needed);
          const district = getDistrict(n.district_code);
          return (
            <li key={n.id}>
              <Link href={`/relief/${n.id}`} className="block focus-visible:outline-offset-2">
                <Card className="p-5 hover:bg-surface-2">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <p className="font-semibold">
                      {n.item} · {n.qty_needed} {n.unit}
                    </p>
                    <p className="text-sm text-ink-2">
                      {district ? (locale === "bn" ? district.name.bn : district.name.en) : n.district_code}
                    </p>
                  </div>
                  {n.note && <p className="mt-1 text-sm text-ink-2">{n.note}</p>}
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-surface-2" aria-hidden="true">
                    <div className="h-full rounded-full bg-brand" style={{ width: `${pct}%` }} />
                  </div>
                  <p className="mt-1 text-xs text-ink-3">
                    {t("pledgedOfNeeded", { pledged: n.qty_pledged, needed: n.qty_needed, unit: n.unit })}
                  </p>
                </Card>
              </Link>
            </li>
          );
        })}
        {needs.length === 0 && <p className="text-ink-2">{t("none")}</p>}
      </ul>
    </div>
  );
}
