"use server";

import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

export async function signOut(locale: string) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect({ href: "/", locale });
}
