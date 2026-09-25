import { z } from "zod";
import type { Bilingual } from "@/lib/hazards";

export const REPORT_TYPES = ["flooding", "erosion", "landslide", "blocked_road", "damaged_embankment", "other"] as const;
export type ReportType = (typeof REPORT_TYPES)[number];

export const REPORT_TYPE_LABELS: Record<ReportType, Bilingual> = {
  flooding: { en: "Flooding", bn: "জলাবদ্ধতা/বন্যা" },
  erosion: { en: "Riverbank erosion", bn: "নদীভাঙন" },
  landslide: { en: "Landslide", bn: "ভূমিধস" },
  blocked_road: { en: "Blocked road", bn: "রাস্তা বন্ধ" },
  damaged_embankment: { en: "Damaged embankment", bn: "বাঁধের ক্ষতি" },
  other: { en: "Other", bn: "অন্যান্য" },
};

export const MAX_PHOTO_BYTES = 3 * 1024 * 1024; // after client-side compression

// Shared by the client form and the /api/reports route. Keep in sync with the
// `reports` table's check constraints in supabase/migrations/0003_reports_and_audit.sql.
export const reportInputSchema = z.object({
  type: z.enum(REPORT_TYPES),
  description: z.string().trim().min(10).max(1000),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  districtCode: z.string().max(10).optional(),
  contactOptional: z.string().trim().max(120).optional(),
  photoDataUrl: z
    .string()
    .refine((s) => s.startsWith("data:image/"), "Must be an image data URL")
    .optional(),
  // Honeypot: real users never fill this in. Bots filling every field often do.
  website: z.string().max(0, "").optional(),
  // Time-to-submit, in ms, measured client-side. Rejects near-instant bot submissions.
  elapsedMs: z.number().min(0),
});

export type ReportInput = z.infer<typeof reportInputSchema>;

export interface PublicReport {
  id: string;
  type: ReportType;
  description: string;
  lat: number;
  lng: number;
  districtCode: string | null;
  photoPath: string | null;
  createdAt: string;
}
