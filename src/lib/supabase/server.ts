import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseEnv } from "@/lib/env";

export async function createClient() {
  const env = getSupabaseEnv() || {
    url: "https://placeholder-surokkha.supabase.co",
    anonKey: "placeholder-anon-key",
  };
  const cookieStore = await cookies();
  return createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Called from a Server Component: safe to ignore (session refresh comes in Phase 3).
        }
      },
    },
  });
}
