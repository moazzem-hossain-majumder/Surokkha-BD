export interface LatLng {
  lat: number;
  lng: number;
}

const EARTH_RADIUS_KM = 6371;

// Great-circle distance between two points, in kilometres.
export function haversineKm(a: LatLng, b: LatLng): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

export function nearest<T extends LatLng>(origin: LatLng, items: T[], limit = 10): (T & { distanceKm: number })[] {
  return items
    .map((item) => ({ ...item, distanceKm: haversineKm(origin, item) }))
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);
}
