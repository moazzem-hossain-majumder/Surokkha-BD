"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { DISTRICTS, getDistrict } from "@/lib/districts";
import { deathsLabel, deathsMidpoint, toCsv, type HistoricalEvent } from "@/lib/historicalEvents";
import { BarChart } from "@/components/charts/BarChart";
import { Card } from "@/components/ui/Card";

export function ExplorerClient({ events, locale }: { events: HistoricalEvent[]; locale: string }) {
  const t = useTranslations("explorer");
  const tHazards = useTranslations("hazards");
  const [districtFilter, setDistrictFilter] = useState<string>("all");

  const hazardName = (slug: string) => {
    try {
      return tHazards(`items.${slug}`);
    } catch {
      return slug;
    }
  };

  const filtered = useMemo(() => {
    if (districtFilter === "all") return events;
    return events.filter((e) => e.district_codes.includes(districtFilter));
  }, [events, districtFilter]);

  const byHazard = useMemo(() => {
    const totals = new Map<string, number>();
    for (const e of filtered) {
      totals.set(e.hazard_slug, (totals.get(e.hazard_slug) ?? 0) + deathsMidpoint(e));
    }
    return Array.from(totals.entries())
      .map(([slug, value]) => ({ label: hazardName(slug), value }))
      .sort((a, b) => b.value - a.value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered]);

  const timeline = useMemo(() => [...filtered].sort((a, b) => a.year - b.year), [filtered]);

  function downloadCsv() {
    const csv = toCsv(filtered);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "surokkha-bd-historical-events.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <label className="block">
          <span className="text-sm font-semibold">{t("filterByDistrict")}</span>
          <select
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="mt-1 h-11 w-full min-w-[200px] rounded-input border border-border bg-surface px-3"
          >
            <option value="all">{t("allDistricts")}</option>
            {DISTRICTS.map((d) => (
              <option key={d.code} value={d.code}>
                {locale === "bn" ? d.name.bn : d.name.en}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={downloadCsv}
          className="h-11 rounded-full border border-border bg-surface px-4 text-sm font-semibold hover:bg-surface-2"
        >
          {t("downloadCsv")}
        </button>
      </div>

      <section>
        <h2 className="text-xl font-bold">{t("hazardComparison")}</h2>
        <p className="mt-1 text-sm text-ink-2">{t("hazardComparisonNote")}</p>
        <Card className="mt-4 p-5">
          {byHazard.length > 0 ? (
            <BarChart
              data={byHazard}
              valueLabel={t("estimatedDeaths")}
              summary={t("hazardComparisonSummary", { count: byHazard.length })}
              tableCaption={t("hazardComparison")}
            />
          ) : (
            <p className="text-sm text-ink-2">{t("noData")}</p>
          )}
        </Card>
      </section>

      <section>
        <h2 className="text-xl font-bold">{t("timeline")}</h2>
        <ul className="mt-4 space-y-3">
          {timeline.map((e) => (
            <li key={e.id}>
              <Card className="p-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="font-semibold">
                    {e.year} \u00b7 {locale === "bn" ? e.name_bn : e.name_en}
                  </p>
                  <p className="text-sm text-ink-2">{hazardName(e.hazard_slug)}</p>
                </div>
                <p className="mt-1 text-sm text-ink-2">{locale === "bn" ? e.summary_bn : e.summary_en}</p>
                <p className="mt-1 text-xs text-ink-3">
                  {t("estimatedDeaths")}: {deathsLabel(e)}
                  {e.affected != null && ` \u00b7 ${t("affected")}: ${e.affected.toLocaleString()}`}
                  {e.district_codes.length > 0 &&
                    ` \u00b7 ${e.district_codes
                      .map((c) => {
                        const d = getDistrict(c);
                        return d ? (locale === "bn" ? d.name.bn : d.name.en) : c;
                      })
                      .join(", ")}`}
                </p>
                <p className="mt-1 text-xs text-ink-3">
                  {t("source")}: {e.source_name}
                  {e.source_url && (
                    <>
                      {" \u00b7 "}
                      <a href={e.source_url} target="_blank" rel="noreferrer" className="underline">
                        {t("link")}
                      </a>
                    </>
                  )}
                </p>
                {e.note && <p className="mt-1 text-xs italic text-ink-3">{e.note}</p>}
              </Card>
            </li>
          ))}
          {timeline.length === 0 && <p className="text-ink-2">{t("noData")}</p>}
        </ul>
      </section>
    </div>
  );
}
