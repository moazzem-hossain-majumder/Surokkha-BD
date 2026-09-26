"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getUserEmail } from "@/lib/supabase/admin";
import { sendEmail, notificationEmailHtml } from "@/lib/email";
import { needInputSchema, type PledgeStatus } from "@/lib/relief";

export interface NeedFormState {
  error: string | null;
}

export async function createNeed(locale: string, _prev: NeedFormState, formData: FormData): Promise<NeedFormState> {
  const parsed = needInputSchema.safeParse({
    districtCode: String(formData.get("districtCode") ?? ""),
    item: String(formData.get("item") ?? ""),
    unit: String(formData.get("unit") ?? ""),
    qtyNeeded: Number(formData.get("qtyNeeded")),
    note: String(formData.get("note") ?? "") || undefined,
    deadline: String(formData.get("deadline") ?? "") || undefined,
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not signed in" };

  const { error } = await supabase.from("relief_needs").insert({
    district_code: parsed.data.districtCode,
    item: parsed.data.item,
    unit: parsed.data.unit,
    qty_needed: parsed.data.qtyNeeded,
    note: parsed.data.note ?? null,
    deadline: parsed.data.deadline ? new Date(parsed.data.deadline).toISOString() : null,
    created_by: user.id,
  });

  if (error) return { error: error.message };
  revalidatePath(`/${locale}/admin/relief`);
  revalidatePath(`/${locale}/relief`);
  return { error: null };
}

export async function closeNeed(locale: string, id: string, status: "fulfilled" | "closed") {
  const supabase = await createClient();
  await supabase.from("relief_needs").update({ status }).eq("id", id);
  revalidatePath(`/${locale}/admin/relief`);
  revalidatePath(`/${locale}/relief`);
}

// Coordinator moves a pledge through its handover lifecycle. Notifies the
// donor by email (best-effort) so they know their pledge status changed.
export async function updatePledgeStatus(locale: string, pledgeId: string, status: PledgeStatus) {
  const supabase = await createClient();
  const { data: pledge, error } = await supabase
    .from("pledges")
    .update({ status })
    .eq("id", pledgeId)
    .select("id, donor_id, qty, need_id, relief_needs(item)")
    .single();

  revalidatePath(`/${locale}/admin/relief`);
  revalidatePath(`/${locale}/relief`);
  revalidatePath(`/${locale}/relief/${pledge?.need_id ?? ""}`);

  if (error || !pledge) return;

  const email = await getUserEmail(pledge.donor_id);
  if (!email) return;
  const item = (pledge as unknown as { relief_needs: { item: string } | null }).relief_needs?.item ?? "your pledge";
  const statusLabel: Record<PledgeStatus, string> = {
    pledged: "pledged",
    in_transit: "on its way",
    delivered: "delivered",
    cancelled: "cancelled",
  };
  await sendEmail(
    email,
    `Surokkha BD: your pledge is now ${statusLabel[status]}`,
    notificationEmailHtml(`Your pledge is now ${statusLabel[status]}`, [
      `Your pledge of ${pledge.qty} for "${item}" is now marked as ${statusLabel[status]}.`,
    ])
  );
}
