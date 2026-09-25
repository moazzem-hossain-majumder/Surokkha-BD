import districtsData from "@/content/districts.json";
import type { Bilingual } from "@/lib/hazards";

export interface District {
  code: string;
  name: Bilingual;
  division: Bilingual;
  lat: number;
  lng: number;
}

export const DISTRICTS: District[] = districtsData;

export function getDistrict(code: string): District | undefined {
  return DISTRICTS.find((d) => d.code === code);
}
