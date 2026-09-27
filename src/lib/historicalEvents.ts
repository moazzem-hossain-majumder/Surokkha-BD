export interface HistoricalEvent {
  id: string;
  hazard_slug: string;
  name_en: string;
  name_bn: string;
  year: number;
  deaths_min: number | null;
  deaths_max: number | null;
  affected: number | null;
  damage_usd: number | null;
  district_codes: string[];
  summary_en: string;
  summary_bn: string;
  source_name: string;
  source_url: string | null;
  note: string | null;
}

export function deathsLabel(e: Pick<HistoricalEvent, "deaths_min" | "deaths_max">): string {
  const { deaths_min, deaths_max } = e;
  if (deaths_min == null && deaths_max == null) return "Unknown";
  if (deaths_min != null && deaths_max != null && deaths_min !== deaths_max) {
    return `${deaths_min.toLocaleString()}\u2013${deaths_max.toLocaleString()}`;
  }
  const n = deaths_max ?? deaths_min ?? 0;
  return `${n.toLocaleString()}+`;
}

export function deathsMidpoint(e: Pick<HistoricalEvent, "deaths_min" | "deaths_max">): number {
  const { deaths_min, deaths_max } = e;
  if (deaths_min != null && deaths_max != null) return (deaths_min + deaths_max) / 2;
  return deaths_min ?? deaths_max ?? 0;
}

export function toCsv(events: HistoricalEvent[]): string {
  const headers = ["year", "hazard", "name", "deaths_min", "deaths_max", "affected", "damage_usd", "districts", "source"];
  const escape = (v: unknown) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const rows = events.map((e) =>
    [e.year, e.hazard_slug, e.name_en, e.deaths_min, e.deaths_max, e.affected, e.damage_usd, e.district_codes.join("|"), e.source_name]
      .map(escape)
      .join(",")
  );
  return [headers.join(","), ...rows].join("\n");
}
