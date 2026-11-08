"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const GOOGLE_MAPS_TILES = {
  streets: {
    name: "Google Maps",
    url: "https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    attribution: "© Google Maps",
  },
  satellite: {
    name: "Satellite",
    url: "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
    attribution: "© Google Maps Satellite",
  },
} as const;

type LayerType = keyof typeof GOOGLE_MAPS_TILES;

const pinIcon = L.divIcon({
  className: "custom-pin-marker",
  html: `<div style="position:relative;width:28px;height:36px;transform:translate(-50%,-100%);">
    <svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.26801 0 0 6.26801 0 14C0 24.5 14 36 14 36C14 36 28 24.5 28 14C28 6.26801 21.732 0 14 0Z" fill="#E11D48" stroke="#FFFFFF" stroke-width="2"/>
      <circle cx="14" cy="14" r="5" fill="#FFFFFF"/>
    </svg>
  </div>`,
  iconSize: [28, 36],
  iconAnchor: [14, 36],
});

function ClickHandler({ onChange }: { onChange: (p: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e) {
      onChange({ lat: Number(e.latlng.lat.toFixed(6)), lng: Number(e.latlng.lng.toFixed(6)) });
    },
  });
  return null;
}

function RecenterOnPin({ pin }: { pin: { lat: number; lng: number } | null }) {
  const map = useMap();
  useEffect(() => {
    if (pin) {
      map.flyTo([pin.lat, pin.lng], Math.max(map.getZoom(), 13), { duration: 0.6 });
    }
  }, [pin, map]);
  return null;
}

export function PinPicker({
  pin,
  onChange,
}: {
  pin: { lat: number; lng: number } | null;
  onChange: (p: { lat: number; lng: number }) => void;
}) {
  const [layer, setLayer] = useState<LayerType>("streets");

  return (
    <div className="relative h-full w-full">
      {/* Map Layer Switcher: Google Maps vs Satellite */}
      <div className="absolute top-3 right-3 z-[1000] flex rounded-md border border-border bg-surface/95 backdrop-blur-sm shadow-sm overflow-hidden text-xs">
        <button
          type="button"
          onClick={() => setLayer("streets")}
          className={`px-2.5 py-1.5 font-semibold transition-colors duration-150 ${
            layer === "streets"
              ? "bg-brand text-brand-ink"
              : "text-ink hover:bg-surface-2"
          }`}
        >
          Google Maps
        </button>
        <button
          type="button"
          onClick={() => setLayer("satellite")}
          className={`px-2.5 py-1.5 font-semibold border-l border-border transition-colors duration-150 ${
            layer === "satellite"
              ? "bg-brand text-brand-ink"
              : "text-ink hover:bg-surface-2"
          }`}
        >
          Satellite
        </button>
      </div>

      <MapContainer
        center={pin ?? [23.685, 90.3563]}
        zoom={pin ? 13 : 7}
        scrollWheelZoom
        className="h-full w-full"
      >
        <TileLayer
          key={layer}
          url={GOOGLE_MAPS_TILES[layer].url}
          attribution={GOOGLE_MAPS_TILES[layer].attribution}
          maxZoom={20}
        />
        <ClickHandler onChange={onChange} />
        <RecenterOnPin pin={pin} />
        {pin && <Marker position={pin} icon={pinIcon} />}
      </MapContainer>
    </div>
  );
}
