import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabaseEnv } from "@/lib/env";

// Refreshes the Supabase auth session on every request (needed because Server
// Components can't write cookies themselves) and returns the response the
// caller should continue with. Safe to call even when Supabase isn't
// configured yet: it's then a no-op.
export async function updateSession(request: NextRequest, response: NextResponse): Promise<NextResponse> {
  const env = getSupabaseEnv();
  if (!env) return response;

  const supabase = createServerClient(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });

  // Touching getUser() is what actually refreshes an expiring session.
  await supabase.auth.getUser();
  return response;
}
