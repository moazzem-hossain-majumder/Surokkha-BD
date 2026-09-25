import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Supabase redirects here after a magic-link click or signup confirmation
// (PKCE flow: a `code` param to exchange for a session).
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const locale = url.searchParams.get("locale") === "bn" ? "bn" : "en";
  const next = locale === "bn" ? "/bn/account" : "/account";

  if (code) {
    const supabase = await createClient();
    await supabase.auth.exchangeCodeForSession(code);
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
