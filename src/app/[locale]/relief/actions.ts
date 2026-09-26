"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserEmail } from "@/lib/supabase/admin";
import { sendEmail, notificationEmailHtml } from "@/lib/email";
import { pledgeInputSchema } from "@/lib/relief";

export interface PledgeFormState {
  error: string | null;
  success: boolean;
}

export async function createPledge(
  locale: string,
  _prev: PledgeFormState,
  formData: FormData
): Promise<PledgeFormState> {
  const parsed = pledgeInputSchema.safeParse({
    needId: String(formData.get("needId") ?? ""),
    qty: Number(formData.get("qty")),
    handoverMethod: String(formData.get("handoverMethod") ?? ""),
    note: String(formData.get("note") ?? "") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input", success: false };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Sign in to pledge.", success: false };

  const { error } = await supabase.from("pledges").insert({
    need_id: parsed.data.needId,
    donor_id: user.id,
    qty: parsed.data.qty,
    handover_method: parsed.data.handoverMethod,
    note: parsed.data.note ?? null,
  });

  if (error) return { error: error.message, success: false };

  revalidatePath(`/${locale}/relief`);
  revalidatePath(`/${locale}/relief/${parsed.data.needId}`);

  // Best-effort notification to the coordinator who posted the need.
  const { data: need } = await supabase.from("relief_needs").select("item, created_by").eq("id", parsed.data.needId).maybeSingle();
  if (need?.created_by) {
    const email = await getUserEmail(need.created_by);
    if (email) {
      await sendEmail(
        email,
        `Surokkha BD: new pledge for "${need.item}"`,
        notificationEmailHtml("New pledge received", [
          `Someone pledged ${parsed.data.qty} toward "${need.item}".`,
          `Handover method: ${parsed.data.handoverMethod}.`,
        ])
      );
    }
  }

  return { error: null, success: true };
}
