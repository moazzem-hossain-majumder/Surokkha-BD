"use server";

import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AuthFormState {
  error: string | null;
  info: string | null;
}

export async function signInWithPassword(
  locale: string,
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "missingFields", info: null };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "invalidCredentials", info: null };

  redirect({ href: "/account", locale });
  return { error: null, info: null }; // unreachable: redirect() always throws, but keeps TS happy
}

export async function signInWithMagicLink(
  locale: string,
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "missingFields", info: null };

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${siteUrl}/auth/callback?locale=${locale}` },
  });
  if (error) return { error: "sendFailed", info: null };

  return { error: null, info: "magicLinkSent" };
}
