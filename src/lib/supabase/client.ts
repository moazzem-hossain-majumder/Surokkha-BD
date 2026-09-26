import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseEnv } from "@/lib/env";

export function createClient() {
  const env = getSupabaseEnv();
  if (!env) {
    throw new Error("Supabase is not configured. Copy .env.example to .env.local and fill it in.");
  }
  return createBrowserClient(env.url, env.anonKey);
}
