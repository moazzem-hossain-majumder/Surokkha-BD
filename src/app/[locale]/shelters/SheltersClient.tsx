"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SHELTERS } from "@/lib/shelters";
import { DISTRICTS, getDistrict } from "@/lib/districts";
import { nearest } from "@/lib/geo";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { Bilingual } from "@/lib/hazards";

const LeafletMap = dynamic(() => import("@/components/map/LeafletMap").then((m) => m.LeafletMap), {
  ssr: false,
  loading: () => <div className="grid h-full place-items-center text-ink-3">…</div>,
});

function pick(text: Bilingual, locale: string) {
  return locale === "bn" ? text.bn : text.en;
}

type Origin = { lat: number; lng: number; label: string } | null;

export function SheltersClient() {
  const t = useTranslations("shelters");
  const locale = useLocale();
  const [origin, setOrigin] = useState<Origin>(null);
  const [status, setStatus] = useState<"idle" | "locating" | "denied" | "unsupported">("idle");
  const [district, setDistrict] = useState("");

  function useMyLocation() {
    if (typeof navigator === "undefined" || !("geolocation" in navigator)) {
      setStatus("unsupported");
      return;
    }
    setStatus("locating");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setOrigin({ lat: pos.coords.latitude, lng: pos.coords.longitude, label: t("myLocation") });
        setStatus("idle");
      },
      () => setStatus("denied"),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function pickDistrict(code: string) {
    setDistrict(code);
    const d = getDistrict(code);
    if (d) setOrigin({ lat: d.lat, lng: d.lng, label: pick(d.name, locale) });
  }

  const results = useMemo(() => {
    if (!origin) return null;
    return nearest(origin, SHELTERS, 10);
  }, [origin]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <Button onClick={useMyLocation}>{t("useLocation")}</Button>
          <span className="text-sm text-ink-3">{t("or")}</span>
          <select
            value={district}
            onChange={(e) => pickDistrict(e.target.value)}
            className="h-12 rounded-input border border-border bg-surface px-3 text-sm"
          >
            <option value="">{t("chooseDistrict")}</option>
            {DISTRICTS.map((d) => (
              <option key={d.code} value={d.code}>
                {pick(d.name, locale)}
              </option>
            ))}
          </select>
        </div>

        {status === "locating" && <p className="mt-3 text-sm text-ink-2">{t("locating")}</p>}
        {status === "denied" && <p className="mt-3 text-sm text-ink-2">{t("locationDenied")}</p>}
        {status === "unsupported" && <p className="mt-3 text-sm text-ink-2">{t("locationUnsupported")}</p>}

        {origin && (
          <p className="mt-3 text-sm text-ink-3">
            {t("showingNear")} {origin.label}
          </p>
        )}

        {!results ? (
          <p className="mt-6 text-ink-2">{t("emptyState")}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {results.map((s) => (
              <li key={s.id}>
                <Card className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{pick(s.name, locale)}</p>
                      <p className="mt-1 text-sm text-ink-2">
                        {t(`shelterType.${s.type}`)} · {t("capacity")}: {s.capacity}
                      </p>
                      <p className="mt-1 text-sm text-ink-2">{s.contact}</p>
                      {s.accessible && <p className="mt-1 text-xs text-brand">{t("accessible")}</p>}
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-bold">{s.distanceKm.toFixed(1)} km</p>
                      <a
                        href={`https://www.openstreetmap.org/directions?to=${s.lat}%2C${s.lng}`}
                        className="mt-1 inline-block text-sm font-semibold text-brand underline"
                      >
                        {t("directions")}
                      </a>
                    </div>
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-6 text-xs text-ink-3">{t("sourceNote")}</p>
      </div>

      <div className="h-[420px] overflow-hidden rounded-sheet border border-border lg:sticky lg:top-24">
        <LeafletMap
          shelters={results ?? SHELTERS}
          quakes={[]}
          showShelters
          showQuakes={false}
          locale={locale}
          center={origin ? [origin.lat, origin.lng] : undefined}
          zoom={origin ? 10 : undefined}
        />
      </div>
    </div>
  );
}
