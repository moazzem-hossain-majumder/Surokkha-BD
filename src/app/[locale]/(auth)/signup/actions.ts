"use server";

import { createClient } from "@/lib/supabase/server";
import type { AuthFormState } from "../login/actions";

export async function signUp(locale: string, _prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();

  if (!email || password.length < 8) return { error: "weakPassword", info: null };

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: displayName || undefined },
      emailRedirectTo: `${siteUrl}/auth/callback?locale=${locale}`,
    },
  });
  if (error) return { error: error.message.includes("already registered") ? "alreadyRegistered" : "signUpFailed", info: null };

  return { error: null, info: "checkEmail" };
}
