"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function setReportStatus(
  locale: string,
  id: string,
  status: "verified" | "rejected" | "resolved"
) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  await supabase
    .from("reports")
    .update({
      status,
      verified_by: user?.id ?? null,
      verified_at: new Date().toISOString(),
    })
    .eq("id", id);

  revalidatePath(`/${locale}/admin/reports`);
  revalidatePath(`/${locale}/map`);
}
