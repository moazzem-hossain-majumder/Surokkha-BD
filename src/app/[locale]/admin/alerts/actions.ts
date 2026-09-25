"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface AlertFormState {
  error: string | null;
}

export async function createAlert(locale: string, _prev: AlertFormState, formData: FormData): Promise<AlertFormState> {
  const supabase = await createClient();
  const districtCodes = String(formData.get("districtCodes") ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const { error } = await supabase.from("alerts").insert({
    hazard_slug: String(formData.get("hazardSlug")),
    title_en: String(formData.get("titleEn")),
    title_bn: String(formData.get("titleBn")),
    body_en: String(formData.get("bodyEn") || "") || null,
    body_bn: String(formData.get("bodyBn") || "") || null,
    severity: Number(formData.get("severity")),
    district_codes: districtCodes,
    source_name: String(formData.get("sourceName")),
    source_url: String(formData.get("sourceUrl") || "") || null,
    expires_at: new Date(String(formData.get("expiresAt"))).toISOString(),
  });

  if (error) return { error: error.message };
  revalidatePath(`/${locale}/admin/alerts`);
  return { error: null };
}

export async function expireAlert(locale: string, id: string) {
  const supabase = await createClient();
  await supabase.from("alerts").update({ expires_at: new Date().toISOString() }).eq("id", id);
  revalidatePath(`/${locale}/admin/alerts`);
}
