import { createHash } from "node:crypto";
import { reportInputSchema, MAX_PHOTO_BYTES } from "@/lib/reports";
import { createAdminClient } from "@/lib/supabase/admin";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const RATE_LIMIT_MAX = 3;
const MIN_ELAPSED_MS = 3000; // real people take at least a few seconds to fill this in

function hashIp(ip: string): string {
  const salt = process.env.IP_HASH_SALT ?? "surokkha-dev-salt";
  return createHash("sha256").update(salt + ip).digest("hex");
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.headers.get("x-real-ip") ?? "unknown";
}

function dataUrlToBuffer(dataUrl: string): { buffer: Buffer; contentType: string } | null {
  const match = /^data:(image\/\w+);base64,(.+)$/.exec(dataUrl);
  if (!match) return null;
  return { buffer: Buffer.from(match[2], "base64"), contentType: match[1] };
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "invalidBody" }, { status: 400 });
  }

  const parsed = reportInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, error: "invalidInput" }, { status: 400 });
  }
  const input = parsed.data;

  // Honeypot: a real visitor never fills the hidden "website" field.
  if (input.website) {
    return Response.json({ ok: true }); // pretend success; don't tip off the bot
  }
  // Bot heuristic: near-instant submissions are almost never a real person.
  if (input.elapsedMs < MIN_ELAPSED_MS) {
    return Response.json({ ok: false, error: "tooFast" }, { status: 400 });
  }

  const ipHash = hashIp(getClientIp(request));
  const admin = createAdminClient();

  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString();
  const { count } = await admin
    .from("reports")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);

  if ((count ?? 0) >= RATE_LIMIT_MAX) {
    return Response.json({ ok: false, error: "rateLimited" }, { status: 429 });
  }

  let photoPath: string | null = null;
  if (input.photoDataUrl) {
    const decoded = dataUrlToBuffer(input.photoDataUrl);
    if (!decoded) {
      return Response.json({ ok: false, error: "invalidPhoto" }, { status: 400 });
    }
    if (decoded.buffer.byteLength > MAX_PHOTO_BYTES) {
      return Response.json({ ok: false, error: "photoTooLarge" }, { status: 400 });
    }
    const ext = decoded.contentType.split("/")[1] ?? "jpg";
    photoPath = `${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadError } = await admin.storage
      .from("report-photos")
      .upload(photoPath, decoded.buffer, { contentType: decoded.contentType });
    if (uploadError) {
      return Response.json({ ok: false, error: "uploadFailed" }, { status: 500 });
    }
  }

  const { error: insertError } = await admin.from("reports").insert({
    type: input.type,
    description: input.description,
    location: `SRID=4326;POINT(${input.lng} ${input.lat})`,
    district_code: input.districtCode ?? null,
    photo_path: photoPath,
    contact_optional: input.contactOptional ?? null,
    ip_hash: ipHash,
    status: "pending",
  });

  if (insertError) {
    return Response.json({ ok: false, error: "saveFailed" }, { status: 500 });
  }

  return Response.json({ ok: true });
}
