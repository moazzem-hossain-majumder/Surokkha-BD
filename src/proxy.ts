import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { routing } from "./i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

// Next.js 16 uses proxy.ts (formerly middleware.ts).
const handleI18n = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const response = handleI18n(request);
  return updateSession(request, response);
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
