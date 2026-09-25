"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const pinIcon = L.divIcon({
  className: "",
  html: `<span style="display:block;width:20px;height:20px;border-radius:9999px;background:#B3261E;border:3px solid white;box-shadow:0 0 0 1px rgba(0,0,0,.3)"></span>`,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

function ClickHandler({ onChange }: { onChange: (p: { lat: number; lng: number }) => void }) {
  useMapEvents({
    click(e) {
      onChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export function PinPicker({
  pin,
  onChange,
}: {
  pin: { lat: number; lng: number } | null;
  onChange: (p: { lat: number; lng: number }) => void;
}) {
  return (
    <MapContainer center={pin ?? [23.685, 90.3563]} zoom={pin ? 12 : 7} scrollWheelZoom className="h-full w-full">
      <TileLayer url="https://tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap contributors" />
      <ClickHandler onChange={onChange} />
      {pin && <Marker position={pin} icon={pinIcon} />}
    </MapContainer>
  );
}
