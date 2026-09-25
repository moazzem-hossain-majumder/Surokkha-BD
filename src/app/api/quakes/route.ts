// Proxies the USGS earthquake feed, scoped to a box around Bangladesh and neighbours.
// Cached for 10 minutes so repeat visits don't hammer USGS, and so the map has
// something to show even if USGS is briefly unreachable (we just return an empty list).
const BBOX = { minLat: 19, maxLat: 27.5, minLng: 86, maxLng: 94.5 };
const USGS_URL =
  `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=-30days` +
  `&minlatitude=${BBOX.minLat}&maxlatitude=${BBOX.maxLat}` +
  `&minlongitude=${BBOX.minLng}&maxlongitude=${BBOX.maxLng}&minmagnitude=2.5&orderby=time`;

export const revalidate = 600; // 10 minutes

export interface QuakeFeature {
  id: string;
  mag: number;
  place: string;
  time: number;
  lat: number;
  lng: number;
  depthKm: number;
  url: string;
}

export async function GET() {
  try {
    const res = await fetch(USGS_URL, { next: { revalidate } });
    if (!res.ok) throw new Error(`USGS responded ${res.status}`);
    const data = await res.json();

    const quakes: QuakeFeature[] = (data.features ?? []).map(
      (f: {
        id: string;
        properties: { mag: number; place: string; time: number; url: string };
        geometry: { coordinates: [number, number, number] };
      }) => ({
        id: f.id,
        mag: f.properties.mag,
        place: f.properties.place,
        time: f.properties.time,
        lng: f.geometry.coordinates[0],
        lat: f.geometry.coordinates[1],
        depthKm: f.geometry.coordinates[2],
        url: f.properties.url,
      })
    );

    return Response.json({ ok: true, source: "USGS", fetchedAt: new Date().toISOString(), quakes });
  } catch {
    return Response.json(
      { ok: false, source: "USGS", fetchedAt: new Date().toISOString(), quakes: [] },
      { status: 200 }
    );
  }
}
