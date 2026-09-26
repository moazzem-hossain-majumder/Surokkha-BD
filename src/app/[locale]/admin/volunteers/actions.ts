"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserEmail } from "@/lib/supabase/admin";
import { sendEmail, notificationEmailHtml } from "@/lib/email";
import { taskInputSchema } from "@/lib/volunteers";

export interface TaskFormState {
  error: string | null;
}

export async function createTask(locale: string, _prev: TaskFormState, formData: FormData): Promise<TaskFormState> {
  const parsed = taskInputSchema.safeParse({
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    requiredSkills: formData.getAll("requiredSkills").map(String),
    slots: Number(formData.get("slots")),
    location: String(formData.get("location") ?? ""),
    districtCode: String(formData.get("districtCode") ?? ""),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { error } = await supabase.from("volunteer_tasks").insert({
    title: parsed.data.title,
    description: parsed.data.description,
    required_skills: parsed.data.requiredSkills,
    slots: parsed.data.slots,
    location: parsed.data.location,
    district_code: parsed.data.districtCode,
    created_by: user.id,
  });

  if (error) return { error: error.message };
  revalidatePath(`/${locale}/admin/volunteers`);
  revalidatePath(`/${locale}/volunteer`);
  return { error: null };
}

export async function closeTask(locale: string, id: string) {
  const supabase = await createClient();
  await supabase.from("volunteer_tasks").update({ status: "closed" }).eq("id", id);
  revalidatePath(`/${locale}/admin/volunteers`);
  revalidatePath(`/${locale}/volunteer`);
}

// Coordinator accepts or declines an application. Notifies the volunteer by
// email (best-effort). When accepting fills every slot, the task is marked
// "filled" so it drops off the public open-tasks list.
export async function decideApplication(locale: string, applicationId: string, decision: "accepted" | "declined") {
  const supabase = await createClient();
  const { data: application, error } = await supabase
    .from("task_applications")
    .update({ status: decision })
    .eq("id", applicationId)
    .select("id, volunteer_id, task_id, volunteer_tasks(title, slots)")
    .single();

  if (error || !application) return;

  if (decision === "accepted") {
    const { count } = await supabase
      .from("task_applications")
      .select("id", { count: "exact", head: true })
      .eq("task_id", application.task_id)
      .eq("status", "accepted");
    const task = (application as unknown as { volunteer_tasks: { title: string; slots: number } | null }).volunteer_tasks;
    if (task && (count ?? 0) >= task.slots) {
      await supabase.from("volunteer_tasks").update({ status: "filled" }).eq("id", application.task_id);
    }
  }

  revalidatePath(`/${locale}/admin/volunteers`);
  revalidatePath(`/${locale}/volunteer`);

  const email = await getUserEmail(application.volunteer_id);
  if (!email) return;
  const task = (application as unknown as { volunteer_tasks: { title: string } | null }).volunteer_tasks;
  const title = task?.title ?? "a task";
  await sendEmail(
    email,
    `Surokkha BD: your application was ${decision}`,
    notificationEmailHtml(`Your application was ${decision}`, [`Your application to "${title}" was ${decision} by the coordinator.`])
  );
}
