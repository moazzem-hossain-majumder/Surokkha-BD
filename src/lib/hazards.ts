export const HAZARD_SLUGS = [
  "cyclone",
  "riverine-flood",
  "flash-flood",
  "urban-waterlogging",
  "riverbank-erosion",
  "landslide",
  "earthquake",
  "lightning",
  "nor-wester",
  "drought",
  "heatwave",
  "cold-wave-fog",
  "salinity",
  "tsunami",
] as const;

export type HazardSlug = (typeof HAZARD_SLUGS)[number];

export const REGION_SLUGS = ["coast", "river", "haor", "hill", "city", "northwest"] as const;
export type RegionSlug = (typeof REGION_SLUGS)[number];

export interface Bilingual {
  en: string;
  bn: string;
}

export interface HazardMyth {
  myth: Bilingual;
  fact: Bilingual;
}

export interface HazardSignal {
  range: string;
  name: Bilingual;
  meaning: Bilingual;
}

export interface HazardSource {
  name: string;
  url?: string;
}

export interface HazardContent {
  slug: HazardSlug;
  regions: RegionSlug[];
  season: Bilingual;
  where: Bilingual;
  summary: Bilingual;
  before: Bilingual[];
  during: Bilingual[];
  after: Bilingual[];
  myths: HazardMyth[];
  signals?: HazardSignal[];
  sources: HazardSource[];
  status: "draft" | "reviewed";
}

// Statically imported so hazard pages can be pre-rendered and cached offline.
// JSON imports are widened to `string` by TypeScript, so each module is cast to
// HazardContent here, once, instead of fighting the inferred literal-union types.
const modules: Record<HazardSlug, () => Promise<{ default: unknown }>> = {
  cyclone: () => import("@/content/hazards/cyclone.json"),
  "riverine-flood": () => import("@/content/hazards/riverine-flood.json"),
  "flash-flood": () => import("@/content/hazards/flash-flood.json"),
  "urban-waterlogging": () => import("@/content/hazards/urban-waterlogging.json"),
  "riverbank-erosion": () => import("@/content/hazards/riverbank-erosion.json"),
  landslide: () => import("@/content/hazards/landslide.json"),
  earthquake: () => import("@/content/hazards/earthquake.json"),
  lightning: () => import("@/content/hazards/lightning.json"),
  "nor-wester": () => import("@/content/hazards/nor-wester.json"),
  drought: () => import("@/content/hazards/drought.json"),
  heatwave: () => import("@/content/hazards/heatwave.json"),
  "cold-wave-fog": () => import("@/content/hazards/cold-wave-fog.json"),
  salinity: () => import("@/content/hazards/salinity.json"),
  tsunami: () => import("@/content/hazards/tsunami.json"),
};

export function isHazardSlug(value: string): value is HazardSlug {
  return (HAZARD_SLUGS as readonly string[]).includes(value);
}

export async function getHazard(slug: HazardSlug): Promise<HazardContent> {
  const mod = await modules[slug]();
  return mod.default as HazardContent;
}
