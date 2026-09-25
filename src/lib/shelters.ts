import sheltersData from "@/content/shelters.json";
import type { Bilingual } from "@/lib/hazards";

export type ShelterType = "cyclone" | "flood" | "hospital";

export interface Shelter {
  id: string;
  name: Bilingual;
  type: ShelterType;
  district: string;
  lat: number;
  lng: number;
  capacity: number;
  contact: string;
  accessible: boolean;
}

export const SHELTERS: Shelter[] = sheltersData as Shelter[];
