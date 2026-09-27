"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  route: z.string().trim().min(2).max(200),
  message: z.string().trim().min(5).max(1000),
  contactOptional: z.string().trim().max(100).optional(),
});

export interface HelpRequestFormState {
  error: string | null;
  success: boolean;
}

export async function submitFerryHelpRequest(
  locale: string,
  _prev: HelpRequestFormState,
  formData: FormData
): Promise<HelpRequestFormState> {
  const parsed = schema.safeParse({
    route: String(formData.get("route") ?? ""),
    message: String(formData.get("message") ?? ""),
    contactOptional: String(formData.get("contactOptional") ?? "") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input", success: false };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("ferry_help_requests").insert({
    route: parsed.data.route,
    message: parsed.data.message,
    contact_optional: parsed.data.contactOptional ?? null,
    requester_id: user?.id ?? null,
  });

  if (error) return { error: error.message, success: false };
  revalidatePath(`/${locale}/ferries`);
  return { error: null, success: true };
}
