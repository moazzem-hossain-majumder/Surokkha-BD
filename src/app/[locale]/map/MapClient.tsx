"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SHELTERS } from "@/lib/shelters";
import type { QuakeFeature } from "@/app/api/quakes/route";
import type { MapReport } from "@/components/map/LeafletMap";
import { REPORT_TYPE_LABELS } from "@/lib/reports";
import { createClient } from "@/lib/supabase/client";
import { Segmented } from "@/components/ui/Segmented";
import { Card } from "@/components/ui/Card";
import type { Bilingual } from "@/lib/hazards";

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap").then((m) => m.LeafletMap), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-ink-3">…</div>,
});

function pick(text: Bilingual, locale: string) {
  return locale === "bn" ? text.bn : text.en;
}

export function MapClient() {
  const t = useTranslations("map");
  const locale = useLocale();
  const [view, setView] = useState<"map" | "list">("map");
  const [showShelters, setShowShelters] = useState(true);
  const [showQuakes, setShowQuakes] = useState(true);
  const [showReports, setShowReports] = useState(true);
  const [quakes, setQuakes] = useState<QuakeFeature[]>([]);
  const [reports, setReports] = useState<MapReport[]>([]);
  const [quakeStatus, setQuakeStatus] = useState<"loading" | "ok" | "error">("loading");
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/quakes")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setQuakes(data.quakes ?? []);
        setFetchedAt(data.fetchedAt ?? null);
        setQuakeStatus(data.ok ? "ok" : "error");
      })
      .catch(() => {
        if (!cancelled) setQuakeStatus("error");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // Verified reports are public via RLS, so the browser (anon key) client
    // can read them directly with no server route needed.
    let cancelled = false;
    try {
      const supabase = createClient();
      supabase
        .from("reports_public")
        .select("id, type, description, lat, lng, created_at")
        .order("created_at", { ascending: false })
        .limit(200)
        .then(({ data }) => {
          if (cancelled || !data) return;
          setReports(
            data.map((r) => ({
              id: r.id,
              type: r.type,
              description: r.description,
              lat: r.lat,
              lng: r.lng,
              createdAt: r.created_at,
            }))
          );
        });
    } catch {
      // Supabase not configured yet: no reports layer, no crash.
    }
    return () => {
      cancelled = true;
    };
  }, []);

  const dateFmt = useMemo(
    () => new Intl.DateTimeFormat(locale === "bn" ? "bn-BD" : "en-US", { dateStyle: "medium", timeStyle: "short" }),
    [locale]
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={showShelters}
            onClick={() => setShowShelters((v) => !v)}
            className="flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-3 text-sm font-semibold aria-pressed:border-brand aria-pressed:bg-brand-soft"
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#4B3FBF" }} aria-hidden="true" />
            {t("layerShelters")}
          </button>
          <button
            type="button"
            aria-pressed={showQuakes}
            onClick={() => setShowQuakes((v) => !v)}
            className="flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-3 text-sm font-semibold aria-pressed:border-brand aria-pressed:bg-brand-soft"
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#B3261E" }} aria-hidden="true" />
            {t("layerQuakes")}
          </button>
          <button
            type="button"
            aria-pressed={showReports}
            onClick={() => setShowReports((v) => !v)}
            className="flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-3 text-sm font-semibold aria-pressed:border-brand aria-pressed:bg-brand-soft"
          >
            <span className="h-2.5 w-2.5 rotate-45 rounded-[3px]" style={{ background: "#D9730D" }} aria-hidden="true" />
            {t("layerReports")}
          </button>
        </div>
        <Segmented
          label={t("viewLabel")}
          value={view}
          onChange={setView}
          options={[
            { value: "map", label: t("viewMap") },
            { value: "list", label: t("viewList") },
          ]}
        />
      </div>

      <p className="mt-3 text-xs text-ink-3">
        {t("shelterSource")}
        {" · "}
        {quakeStatus === "loading" && t("quakeLoading")}
        {quakeStatus === "error" && t("quakeError")}
        {quakeStatus === "ok" && fetchedAt && `${t("quakeSource")} (${dateFmt.format(new Date(fetchedAt))})`}
      </p>

      {view === "map" ? (
        <div className="mt-4 h-[60vh] min-h-[360px] overflow-hidden rounded-sheet border border-border">
          <LeafletMap
            shelters={showShelters ? SHELTERS : []}
            quakes={showQuakes ? quakes : []}
            reports={showReports ? reports : []}
            showShelters={showShelters}
            showQuakes={showQuakes}
            showReports={showReports}
            locale={locale}
          />
        </div>
      ) : (
        <div className="mt-4 space-y-6">
          {showShelters && (
            <section>
              <h2 className="text-lg font-bold">{t("layerShelters")}</h2>
              <ul className="mt-2 space-y-2">
                {SHELTERS.map((s) => (
                  <li key={s.id}>
                    <Card className="p-4">
                      <p className="font-semibold">{pick(s.name, locale)}</p>
                      <p className="text-sm text-ink-2">
                        {t(`shelterType.${s.type}`)} · {t("capacity")}: {s.capacity}
                      </p>
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          )}
          {showQuakes && (
            <section>
              <h2 className="text-lg font-bold">{t("layerQuakes")}</h2>
              {quakes.length === 0 ? (
                <p className="mt-2 text-ink-2">{t("noQuakes")}</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {quakes.map((q) => (
                    <li key={q.id}>
                      <Card className="p-4">
                        <p className="font-semibold">M{q.mag.toFixed(1)} — {q.place}</p>
                        <p className="text-sm text-ink-2">{dateFmt.format(new Date(q.time))}</p>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
          {showReports && (
            <section>
              <h2 className="text-lg font-bold">{t("layerReports")}</h2>
              {reports.length === 0 ? (
                <p className="mt-2 text-ink-2">{t("noReports")}</p>
              ) : (
                <ul className="mt-2 space-y-2">
                  {reports.map((r) => (
                    <li key={r.id}>
                      <Card className="p-4">
                        <p className="font-semibold">
                          {locale === "bn" ? REPORT_TYPE_LABELS[r.type].bn : REPORT_TYPE_LABELS[r.type].en}
                        </p>
                        <p className="text-sm text-ink-2">{r.description}</p>
                      </Card>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </div>
      )}
    </div>
  );
}
