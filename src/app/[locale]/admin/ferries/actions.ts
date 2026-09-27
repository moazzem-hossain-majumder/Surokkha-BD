"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const scheduleSchema = z.object({
  route: z.string().trim().min(2).max(200),
  fromPlace: z.string().trim().min(1).max(120),
  toPlace: z.string().trim().min(1).max(120),
  departs: z.string().trim().min(1).max(300),
  days: z.string().trim().min(1).max(120),
  contact: z.string().trim().max(120).optional(),
  sourceName: z.string().trim().min(1).max(200),
});

export interface ScheduleFormState {
  error: string | null;
}

export async function createSchedule(locale: string, _prev: ScheduleFormState, formData: FormData): Promise<ScheduleFormState> {
  const parsed = scheduleSchema.safeParse({
    route: String(formData.get("route") ?? ""),
    fromPlace: String(formData.get("fromPlace") ?? ""),
    toPlace: String(formData.get("toPlace") ?? ""),
    departs: String(formData.get("departs") ?? ""),
    days: String(formData.get("days") ?? ""),
    contact: String(formData.get("contact") ?? "") || undefined,
    sourceName: String(formData.get("sourceName") ?? ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const { error } = await supabase.from("ferry_schedules").insert({
    route: parsed.data.route,
    from_place: parsed.data.fromPlace,
    to_place: parsed.data.toPlace,
    departs: parsed.data.departs,
    days: parsed.data.days,
    contact: parsed.data.contact ?? null,
    source_name: parsed.data.sourceName,
  });

  if (error) return { error: error.message };
  revalidatePath(`/${locale}/admin/ferries`);
  revalidatePath(`/${locale}/ferries`);
  return { error: null };
}

export async function deleteSchedule(locale: string, id: string) {
  const supabase = await createClient();
  await supabase.from("ferry_schedules").delete().eq("id", id);
  revalidatePath(`/${locale}/admin/ferries`);
  revalidatePath(`/${locale}/ferries`);
}

export async function resolveHelpRequest(locale: string, id: string, reply: string, status: "answered" | "closed") {
  const supabase = await createClient();
  await supabase.from("ferry_help_requests").update({ reply, status }).eq("id", id);
  revalidatePath(`/${locale}/admin/ferries`);
}
