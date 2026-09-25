"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, CircleMarker, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTranslations } from "next-intl";
import { useEffectiveTheme } from "@/lib/useTheme";
import type { Shelter } from "@/lib/shelters";
import type { QuakeFeature } from "@/app/api/quakes/route";
import type { Bilingual } from "@/lib/hazards";

const OSM_ATTRIBUTION = '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const OSM_TILE_URL = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";

const SHELTER_COLOR: Record<Shelter["type"], string> = {
  cyclone: "#4B3FBF",
  flood: "#1565C0",
  hospital: "#B3261E",
};

function shelterIcon(type: Shelter["type"]) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:16px;height:16px;border-radius:9999px;background:${SHELTER_COLOR[type]};border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,.25)"></span>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function quakeRadius(mag: number) {
  return Math.max(4, mag * 3);
}

function FitOnMount({ points }: { points: [number, number][] }) {
  const map = useMap();
  useMemo(() => {
    if (points.length > 0) {
      map.fitBounds(points, { padding: [24, 24], maxZoom: 9 });
    }
  }, [map, points]);
  return null;
}

function pick(text: Bilingual, locale: string) {
  return locale === "bn" ? text.bn : text.en;
}

export function LeafletMap({
  shelters,
  quakes,
  showShelters,
  showQuakes,
  locale,
  center = [23.685, 90.3563],
  zoom = 7,
}: {
  shelters: Shelter[];
  quakes: QuakeFeature[];
  showShelters: boolean;
  showQuakes: boolean;
  locale: string;
  center?: [number, number];
  zoom?: number;
}) {
  const t = useTranslations("map");
  const theme = useEffectiveTheme();

  const fitPoints = useMemo<[number, number][]>(() => {
    const pts: [number, number][] = [];
    if (showShelters) shelters.forEach((s) => pts.push([s.lat, s.lng]));
    if (showQuakes) quakes.forEach((q) => pts.push([q.lat, q.lng]));
    return pts;
  }, [shelters, quakes, showShelters, showQuakes]);

  return (
    <MapContainer center={center} zoom={zoom} scrollWheelZoom className="h-full w-full">
      <TileLayer
        url={OSM_TILE_URL}
        attribution={OSM_ATTRIBUTION}
        className={theme === "dark" ? "map-tiles-dark" : undefined}
      />
      {fitPoints.length > 1 && <FitOnMount points={fitPoints} />}

      {showShelters &&
        shelters.map((s) => (
          <Marker key={s.id} position={[s.lat, s.lng]} icon={shelterIcon(s.type)}>
            <Popup>
              <p className="font-semibold">{pick(s.name, locale)}</p>
              <p className="text-sm text-ink-2">
                {t(`shelterType.${s.type}`)} · {t("capacity")}: {s.capacity}
              </p>
              <p className="text-sm text-ink-2">{s.contact}</p>
            </Popup>
          </Marker>
        ))}

      {showQuakes &&
        quakes.map((q) => (
          <CircleMarker
            key={q.id}
            center={[q.lat, q.lng]}
            radius={quakeRadius(q.mag)}
            pathOptions={{ color: "#B3261E", fillColor: "#B3261E", fillOpacity: 0.35, weight: 1 }}
          >
            <Popup>
              <p className="font-semibold">M{q.mag.toFixed(1)}</p>
              <p className="text-sm text-ink-2">{q.place}</p>
              <p className="text-xs text-ink-3">{new Date(q.time).toLocaleString(locale === "bn" ? "bn-BD" : "en-US")}</p>
            </Popup>
          </CircleMarker>
        ))}
    </MapContainer>
  );
}
