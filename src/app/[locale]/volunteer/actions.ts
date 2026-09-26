"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserEmail } from "@/lib/supabase/admin";
import { sendEmail, notificationEmailHtml } from "@/lib/email";
import { volunteerProfileSchema, applicationInputSchema } from "@/lib/volunteers";

export interface ProfileFormState {
  error: string | null;
}

export async function saveVolunteerProfile(
  locale: string,
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const parsed = volunteerProfileSchema.safeParse({
    skills: formData.getAll("skills").map(String),
    districtCode: String(formData.get("districtCode") ?? ""),
    availability: String(formData.get("availability") ?? ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { error } = await supabase.from("volunteers").upsert({
    user_id: user.id,
    skills: parsed.data.skills,
    district_code: parsed.data.districtCode,
    availability: parsed.data.availability,
  });

  if (error) return { error: error.message };
  revalidatePath(`/${locale}/volunteer`);
  return { error: null };
}

export interface ApplyFormState {
  error: string | null;
  success: boolean;
}

export async function applyToTask(locale: string, _prev: ApplyFormState, formData: FormData): Promise<ApplyFormState> {
  const parsed = applicationInputSchema.safeParse({
    taskId: String(formData.get("taskId") ?? ""),
    note: String(formData.get("note") ?? "") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input", success: false };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to apply.", success: false };

  const { data: profile } = await supabase.from("volunteers").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!profile) return { error: "Set up your volunteer profile first.", success: false };

  const { error } = await supabase.from("task_applications").insert({
    task_id: parsed.data.taskId,
    volunteer_id: user.id,
    note: parsed.data.note ?? null,
  });

  if (error) return { error: error.message, success: false };

  revalidatePath(`/${locale}/volunteer`);

  const { data: task } = await supabase.from("volunteer_tasks").select("title, created_by").eq("id", parsed.data.taskId).maybeSingle();
  if (task?.created_by) {
    const email = await getUserEmail(task.created_by);
    if (email) {
      await sendEmail(
        email,
        `Surokkha BD: new application for "${task.title}"`,
        notificationEmailHtml("New volunteer application", [`A volunteer applied to "${task.title}".`])
      );
    }
  }

  return { error: null, success: true };
}
