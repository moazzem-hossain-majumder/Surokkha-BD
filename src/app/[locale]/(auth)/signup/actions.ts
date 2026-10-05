"use server";

import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import type { AuthFormState } from "../login/actions";

export async function signUp(locale: string, _prevState: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const displayName = String(formData.get("displayName") ?? "").trim();

  if (!email || password.length < 8) return { error: "weakPassword", info: null };

  const supabase = await createClient();

  // Create user via Admin API with auto-confirm to avoid hitting free-tier email rate limit
  try {
    const admin = createAdminClient();
    const createRes = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: displayName || undefined },
    });

    if (createRes.error) {
      if (createRes.error.message.includes("already registered") || createRes.error.message.includes("already been registered")) {
        return { error: "alreadyRegistered", info: null };
      }
      throw createRes.error;
    }

    const { error: signInErr } = await supabase.auth.signInWithPassword({ email, password });
    if (signInErr) throw signInErr;

    redirect({ href: "/dashboard", locale });
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err && String((err as { digest: string }).digest).startsWith("NEXT_REDIRECT")) {
      throw err;
    }

    console.warn("Admin create fallback to standard signup:", err);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { display_name: displayName || undefined },
        emailRedirectTo: `${siteUrl}/auth/callback?locale=${locale}`,
      },
    });

    if (error) {
      return {
        error: error.message.includes("already registered") ? "alreadyRegistered" : "signUpFailed",
        info: null,
      };
    }

    if (data?.session) {
      redirect({ href: "/dashboard", locale });
    }

    return { error: null, info: "checkEmail" };
  }

  return { error: null, info: null };
}

