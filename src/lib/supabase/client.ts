import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/env";

export function createClient() {
  const env = getSupabaseEnv() || {
    url: "https://placeholder-surokkha.supabase.co",
    anonKey: "placeholder-anon-key",
  };
  return createBrowserClient(env.url, env.anonKey);
}
