import { z } from "zod";
import type { Bilingual } from "@/lib/hazards";

export const SKILLS = [
  "medical",
  "first_aid",
  "boat_operation",
  "logistics",
  "driving",
  "counselling",
  "communications",
] as const;
export type Skill = (typeof SKILLS)[number];

export const SKILL_LABELS: Record<Skill, Bilingual> = {
  medical: { en: "Medical", bn: "চিকিৎসা" },
  first_aid: { en: "First aid", bn: "প্রাথমিক চিকিৎসা" },
  boat_operation: { en: "Boat operation", bn: "নৌকা চালনা" },
  logistics: { en: "Logistics", bn: "সরবরাহ ব্যবস্থাপনা" },
  driving: { en: "Driving", bn: "গাড়ি চালনা" },
  counselling: { en: "Counselling", bn: "কাউন্সেলিং" },
  communications: { en: "Communications", bn: "যোগাযোগ" },
};

export const AVAILABILITIES = ["weekdays", "weekends", "anytime", "on_call"] as const;
export type Availability = (typeof AVAILABILITIES)[number];

export const TASK_STATUSES = ["open", "filled", "closed"] as const;
export type TaskStatus = (typeof TASK_STATUSES)[number];

export const APPLICATION_STATUSES = ["applied", "accepted", "declined", "withdrawn"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

// Kept in sync with the check constraints in
// supabase/migrations/0006_relief_and_volunteers.sql.
export const volunteerProfileSchema = z.object({
  skills: z.array(z.enum(SKILLS)).min(1),
  districtCode: z.string().min(1).max(10),
  availability: z.enum(AVAILABILITIES),
});
export type VolunteerProfileInput = z.infer<typeof volunteerProfileSchema>;

export const taskInputSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10).max(1000),
  requiredSkills: z.array(z.enum(SKILLS)).min(1),
  slots: z.number().int().positive(),
  location: z.string().trim().min(2).max(200),
  districtCode: z.string().min(1).max(10),
});
export type TaskInput = z.infer<typeof taskInputSchema>;

export const applicationInputSchema = z.object({
  taskId: z.string().uuid(),
  note: z.string().trim().max(300).optional(),
});
export type ApplicationInput = z.infer<typeof applicationInputSchema>;

export interface PublicTask {
  id: string;
  title: string;
  description: string;
  required_skills: Skill[];
  slots: number;
  slots_filled: number;
  location: string;
  district_code: string;
  status: TaskStatus;
  created_at: string;
}
