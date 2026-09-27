"use server";

import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

// Lightweight anti-spam, matching the approach already used for community
// reports (src/app/api/reports/route.ts): a honeypot field, a minimum
// fill-time, and an hourly per-IP cap (ferry_help_requests.ip_hash was added
// in migration 0010 for this). Added in the Phase 6 security review (P6-5) --
// this form previously had none, unlike every other public-facing insert.
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const MIN_ELAPSED_MS = 2000;

const schema = z.object({
  route: z.string().trim().min(2).max(200),
  message: z.string().trim().min(5).max(1000),
  contactOptional: z.string().trim().max(100).optional(),
  website: z.string().max(0).optional(), // honeypot: real visitors leave this empty
  startedAt: z.coerce.number(),
});

export interface HelpRequestFormState {
  error: string | null;
  success: boolean;
}

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "surokkha-dev-salt";
  return createHash("sha256").update(salt + ip).digest("hex");
}

async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export async function submitFerryHelpRequest(
  locale: string,
  _prev: HelpRequestFormState,
  formData: FormData
): Promise<HelpRequestFormState> {
  const parsed = schema.safeParse({
    route: String(formData.get("route") ?? ""),
    message: String(formData.get("message") ?? ""),
    contactOptional: String(formData.get("contactOptional") ?? "") || undefined,
    website: String(formData.get("website") ?? ""),
    startedAt: formData.get("startedAt"),
  });
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Invalid input", success: false };

  if (parsed.data.website) return { error: null, success: true }; // honeypot tripped: pretend success
  if (Date.now() - parsed.data.startedAt < MIN_ELAPSED_MS) {
    return { error: "Please take a moment before submitting.", success: false };
  }

  const ipHash = hashIp(await getClientIp());
  const admin = createAdminClient();
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const { count } = await admin
    .from("ferry_help_requests")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  if ((count ?? 0) >= RATE_LIMIT_MAX) {
    return { error: "Too many requests from this connection recently, please try again later.", success: false };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase.from("ferry_help_requests").insert({
    route: parsed.data.route,
    message: parsed.data.message,
    contact_optional: parsed.data.contactOptional ?? null,
    requester_id: user?.id ?? null,
    ip_hash: ipHash,
  });

  if (error) return { error: error.message, success: false };
  revalidatePath(`/${locale}/ferries`);
  return { error: null, success: true };
}
