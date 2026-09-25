"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ShelterFormState {
  error: string | null;
}

export async function createShelter(
  locale: string,
  _prev: ShelterFormState,
  formData: FormData
): Promise<ShelterFormState> {
  const supabase = await createClient();
  const lat = Number(formData.get("lat"));
  const lng = Number(formData.get("lng"));

  const { error } = await supabase.rpc("insert_shelter_point", {
    p_name_en: String(formData.get("nameEn")),
    p_name_bn: String(formData.get("nameBn")),
    p_type: String(formData.get("type")),
    p_district_code: String(formData.get("districtCode")),
    p_lat: lat,
    p_lng: lng,
    p_capacity: Number(formData.get("capacity")) || null,
    p_contact: String(formData.get("contact") || "") || null,
    p_accessible: formData.get("accessible") === "on",
    p_source_name: String(formData.get("sourceName")),
  });

  if (error) return { error: error.message };
  revalidatePath(`/${locale}/admin/shelters`);
  return { error: null };
}

export async function setShelterActive(locale: string, id: string, active: boolean) {
  const supabase = await createClient();
  await supabase.from("shelters").update({ active }).eq("id", id);
  revalidatePath(`/${locale}/admin/shelters`);
}
