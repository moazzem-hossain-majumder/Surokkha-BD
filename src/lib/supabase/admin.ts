import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { getSupabaseEnv } from "@/lib/env";

// Service-role client. NEVER import this into client code or a Client Component:
// it bypasses Row Level Security entirely. Used only by trusted server code
// (the report intake route) that needs to do things a normal user's RLS-scoped
// session cannot, such as rate-limit checks across all reports.
export function createAdminClient() {
  const env = getSupabaseEnv();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!env || !serviceKey) {
    throw new Error("Supabase admin client requires NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
  return createSupabaseClient(env.url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

// Generates a short-lived signed URL for a private report photo. Used only
// from admin/coordinator pages, never exposed to the public.
export async function getReportPhotoUrl(path: string, expiresInSeconds = 300): Promise<string | null> {
  const admin = createAdminClient();
  const { data, error } = await admin.storage.from("report-photos").createSignedUrl(path, expiresInSeconds);
  if (error) return null;
  return data.signedUrl;
}
