import "server-only";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/roles";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle();
  return data as Profile | null;
}

// Redirects to /login if not signed in, or to / if signed in but lacking the
// required role. Use at the top of a protected Server Component.
export async function requireRole(locale: string, roles: Profile["role"][]): Promise<Profile> {
  const profile = await getCurrentProfile();
  if (!profile) {
    redirect({ href: "/login", locale });
    throw new Error("unreachable"); // redirect() always throws; this satisfies TypeScript's control-flow analysis
  }
  if (!roles.includes(profile.role)) {
    redirect({ href: "/", locale });
    throw new Error("unreachable");
  }
  return profile;
}
