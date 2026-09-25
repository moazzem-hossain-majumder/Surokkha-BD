import { getSupabaseEnv } from "@/lib/env";

export const dynamic = "force-dynamic";

// Health check. Also usable as a keep-alive ping for the free Supabase project.
export async function GET() {
  const env = getSupabaseEnv();
  if (!env) {
    return Response.json({ ok: true, app: "surokkha-bd", supabase: "not-configured" });
  }
  try {
    const res = await fetch(`${env.url}/auth/v1/health`, {
      headers: { apikey: env.anonKey },
      cache: "no-store",
    });
    return Response.json({ ok: true, app: "surokkha-bd", supabase: res.ok ? "reachable" : "error", status: res.status });
  } catch {
    return Response.json({ ok: true, app: "surokkha-bd", supabase: "unreachable" });
  }
}
