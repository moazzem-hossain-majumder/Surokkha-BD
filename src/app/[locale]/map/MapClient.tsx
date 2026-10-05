"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SHELTERS } from "@/lib/shelters";
import type { QuakeFeature } from "@/app/api/quakes/route";
import type { MapReport, MapStyle } from "@/components/map/LeafletMap";
import { REPORT_TYPE_LABELS } from "@/lib/reports";
import { createClient } from "@/lib/supabase/client";
import { Segmented } from "@/components/ui/Segmented";
import { Card } from "@/components/ui/Card";
import type { Bilingual } from "@/lib/hazards";

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap").then((m) => m.LeafletMap), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center bg-surface-2 text-ink-3">
      <div className="flex flex-col items-center gap-2">
        <span className="h-6 w-6 rounded-full border-2 border-brand border-t-transparent animate-spin" />
        <span className="text-xs font-semibold">Loading Google Maps Tiles…</span>
      </div>
    </div>
  ),
});

function pick(text: Bilingual, locale: string) {
  return locale === "bn" ? text.bn : text.en;
}

export function MapClient() {
  const t = useTranslations("map");
  const locale = useLocale();
  const [view, setView] = useState<"map" | "list">("map");
  const [mapStyle, setMapStyle] = useState<MapStyle>("google-streets");
  const [showShelters, setShowShelters] = useState(true);
  const [showQuakes, setShowQuakes] = useState(true);
  const [showReports, setShowReports] = useState(true);
  const [nativeEmbed, setNativeEmbed] = useState(false);
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
      // Supabase fallback
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
    <div className="space-y-4">
      {/* Google Maps Official Status Bar & Coordinate HUD */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/80 bg-surface/90 px-4 py-2.5 backdrop-blur-md shadow-xs">
        <div className="flex items-center gap-2.5">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white shadow-xs border border-border text-base">
            🗺️
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-ink tracking-tight">
                {locale === "bn" ? "গুগল ম্যাপস ইঞ্জিন সক্রিয়" : "Google Maps Engine Active"}
              </span>
              <span className="inline-flex items-center rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                LIVE
              </span>
            </div>
            <p className="text-[11px] text-ink-3">
              23.6850° N, 90.3563° E • Bangladesh Delta Basin
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Native Google Maps Embed Toggle */}
          <button
            type="button"
            onClick={() => setNativeEmbed((v) => !v)}
            className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-bold transition-all cursor-pointer ${
              nativeEmbed
                ? "bg-brand text-white shadow-xs"
                : "border border-border bg-surface text-ink-2 hover:bg-surface-2 hover:text-ink"
            }`}
          >
            <span>🌐</span>
            <span>{nativeEmbed ? (locale === "bn" ? "ডিজাস্টার ম্যাপে ফিরুন" : "Back to Disaster Map") : (locale === "bn" ? "নেটিভ গুগল ম্যাপস ভিউ" : "Native Google Maps View")}</span>
          </button>
        </div>
      </div>

      {/* Control Layer Buttons and Map Style Switchers */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            aria-pressed={showShelters}
            onClick={() => setShowShelters((v) => !v)}
            className="flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-3.5 text-sm font-semibold transition-all cursor-pointer aria-pressed:border-brand aria-pressed:bg-brand-soft shadow-2xs hover:shadow-xs active:scale-95"
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#4B3FBF" }} aria-hidden="true" />
            <span>{t("layerShelters")}</span>
            <span className="rounded-full bg-black/10 dark:bg-white/10 px-1.5 py-0.2 text-xs font-bold">
              {SHELTERS.length}
            </span>
          </button>
          <button
            type="button"
            aria-pressed={showQuakes}
            onClick={() => setShowQuakes((v) => !v)}
            className="flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-3.5 text-sm font-semibold transition-all cursor-pointer aria-pressed:border-brand aria-pressed:bg-brand-soft shadow-2xs hover:shadow-xs active:scale-95"
          >
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: "#B3261E" }} aria-hidden="true" />
            <span>{t("layerQuakes")}</span>
            {quakes.length > 0 && (
              <span className="rounded-full bg-sun/15 text-sun px-1.5 py-0.2 text-xs font-bold">
                {quakes.length}
              </span>
            )}
          </button>
          <button
            type="button"
            aria-pressed={showReports}
            onClick={() => setShowReports((v) => !v)}
            className="flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-3.5 text-sm font-semibold transition-all cursor-pointer aria-pressed:border-brand aria-pressed:bg-brand-soft shadow-2xs hover:shadow-xs active:scale-95"
          >
            <span className="h-2.5 w-2.5 rotate-45 rounded-[3px]" style={{ background: "#D9730D" }} aria-hidden="true" />
            <span>{t("layerReports")}</span>
            {reports.length > 0 && (
              <span className="rounded-full bg-amber-500/15 text-amber-600 px-1.5 py-0.2 text-xs font-bold">
                {reports.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {view === "map" && !nativeEmbed && (
            <div className="flex flex-wrap items-center gap-1 rounded-full border border-border bg-surface p-1 text-xs shadow-2xs">
              <span className="hidden pl-2 pr-1 font-bold text-ink-3 sm:inline">Google Style:</span>
              {(["google-streets", "google-hybrid", "google-terrain", "osm"] as const).map((style) => (
                <button
                  key={style}
                  type="button"
                  onClick={() => setMapStyle(style)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                    mapStyle === style
                      ? "bg-brand text-white shadow-sm"
                      : "text-ink-2 hover:bg-surface-2 hover:text-ink"
                  }`}
                >
                  {style === "google-streets"
                    ? (locale === "bn" ? "গুগল রাস্তা" : "Google Roads")
                    : style === "google-hybrid"
                    ? (locale === "bn" ? "স্যাটেলাইট" : "Satellite Hybrid")
                    : style === "google-terrain"
                    ? (locale === "bn" ? "ভূসংস্থান" : "Terrain")
                    : "OSM"}
                </button>
              ))}
            </div>
          )}
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
      </div>

      <p className="text-xs text-ink-3">
        {t("shelterSource")}
        {" · "}
        {quakeStatus === "loading" && t("quakeLoading")}
        {quakeStatus === "error" && t("quakeError")}
        {quakeStatus === "ok" && fetchedAt && `${t("quakeSource")} (${dateFmt.format(new Date(fetchedAt))})`}
      </p>

      {view === "map" ? (
        <div className="relative h-[65vh] min-h-[400px] overflow-hidden rounded-sheet border border-border shadow-md">
          {nativeEmbed ? (
            /* Native Interactive Google Maps View */
            <div className="relative h-full w-full">
              <iframe
                title="Google Maps Bangladesh Interactive"
                src="https://maps.google.com/maps?q=Bangladesh&t=m&z=7&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
              />
              <div className="absolute top-4 left-4 z-10 rounded-xl bg-surface/90 px-3 py-1.5 backdrop-blur-md border border-border shadow-md text-xs font-bold text-ink">
                🌐 Native Google Maps Mode • Live Satellite &amp; Navigation
              </div>
            </div>
          ) : (
            <LeafletMap
              shelters={showShelters ? SHELTERS : []}
              quakes={showQuakes ? quakes : []}
              reports={showReports ? reports : []}
              showShelters={showShelters}
              showQuakes={showQuakes}
              showReports={showReports}
              mapStyle={mapStyle}
              locale={locale}
            />
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {showShelters && (
            <section>
              <h2 className="text-lg font-bold">{t("layerShelters")}</h2>
              <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                {SHELTERS.map((s) => (
                  <li key={s.id}>
                    <Card variant="interactive" className="p-4">
                      <p className="font-semibold text-ink">{pick(s.name, locale)}</p>
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
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {quakes.map((q) => (
                    <li key={q.id}>
                      <Card variant="interactive" className="p-4">
                        <p className="font-semibold text-ink">M{q.mag.toFixed(1)} — {q.place}</p>
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
                <ul className="mt-2 grid gap-2 sm:grid-cols-2">
                  {reports.map((r) => (
                    <li key={r.id}>
                      <Card variant="interactive" className="p-4">
                        <p className="font-semibold text-ink">
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
