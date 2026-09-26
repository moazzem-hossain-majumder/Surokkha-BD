import { z } from "zod";
import type { Bilingual } from "@/lib/hazards";

export const NEED_STATUSES = ["open", "fulfilled", "closed"] as const;
export type NeedStatus = (typeof NEED_STATUSES)[number];

export const PLEDGE_STATUSES = ["pledged", "in_transit", "delivered", "cancelled"] as const;
export type PledgeStatus = (typeof PLEDGE_STATUSES)[number];

export const HANDOVER_METHODS = ["drop_off", "pickup", "courier", "other"] as const;
export type HandoverMethod = (typeof HANDOVER_METHODS)[number];

export const HANDOVER_METHOD_LABELS: Record<HandoverMethod, Bilingual> = {
  drop_off: { en: "I'll drop it off", bn: "আমি নিজে পৌঁছে দেব" },
  pickup: { en: "Please arrange pickup", bn: "সংগ্রহের ব্যবস্থা করুন" },
  courier: { en: "Courier / transport service", bn: "কুরিয়ার/পরিবহন সেবা" },
  other: { en: "Other", bn: "অন্যান্য" },
};

// Kept in sync with the check constraints in
// supabase/migrations/0006_relief_and_volunteers.sql.
export const needInputSchema = z.object({
  districtCode: z.string().min(1).max(10),
  item: z.string().trim().min(2).max(120),
  unit: z.string().trim().min(1).max(30),
  qtyNeeded: z.number().positive(),
  note: z.string().trim().max(500).optional(),
  deadline: z.string().optional(), // datetime-local string, converted server-side
});
export type NeedInput = z.infer<typeof needInputSchema>;

export const pledgeInputSchema = z.object({
  needId: z.string().uuid(),
  qty: z.number().positive(),
  handoverMethod: z.enum(HANDOVER_METHODS),
  note: z.string().trim().max(500).optional(),
});
export type PledgeInput = z.infer<typeof pledgeInputSchema>;

export interface PublicNeed {
  id: string;
  district_code: string;
  item: string;
  unit: string;
  qty_needed: number;
  qty_pledged: number;
  qty_delivered: number;
  note: string | null;
  deadline: string | null;
  status: NeedStatus;
  created_at: string;
}

export function progressPercent(pledgedOrDelivered: number, needed: number): number {
  if (needed <= 0) return 0;
  return Math.min(100, Math.round((pledgedOrDelivered / needed) * 100));
}
