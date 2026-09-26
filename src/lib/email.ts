import "server-only";

// Thin wrapper around Resend's HTTP API (no SDK dependency, per rules.md's
// "ask before adding a dependency" -- a single fetch call doesn't need one).
// Email is best-effort: every call site wraps this and swallows failures so a
// notification problem never blocks the underlying action (a pledge, an
// application, a status change). Failures are logged server-side only, never
// shown to the user.
//
// Free-tier note: until a sending domain is verified in Resend, mail can only
// be sent from "onboarding@resend.dev" and only to the email address of the
// Resend account owner. See README / memory.md for what this means for testing.
const FROM = "Surokkha BD <onboarding@resend.dev>";

export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("sendEmail skipped: RESEND_API_KEY is not set");
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: FROM, to, subject, html }),
    });
    if (!res.ok) {
      console.error("sendEmail failed", res.status, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("sendEmail error", err);
    return false;
  }
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function notificationEmailHtml(heading: string, lines: string[], ctaUrl?: string, ctaLabel?: string): string {
  const body = lines.map((l) => `<p style="margin:0 0 12px;color:#333;font-size:15px;">${escapeHtml(l)}</p>`).join("\n");
  const cta = ctaUrl
    ? `<p style="margin:20px 0 0;"><a href="${ctaUrl}" style="background:#0f7a4a;color:#fff;padding:10px 18px;border-radius:999px;text-decoration:none;font-weight:600;">${escapeHtml(
        ctaLabel ?? "View"
      )}</a></p>`
    : "";
  return `
    <div style="font-family:system-ui,sans-serif;max-width:480px;margin:0 auto;padding:24px;">
      <h1 style="font-size:18px;color:#0f7a4a;margin:0 0 16px;">${escapeHtml(heading)}</h1>
      ${body}
      ${cta}
      <p style="margin:24px 0 0;color:#999;font-size:12px;">Surokkha BD is not an official warning system. This is an automated notification about relief/volunteer coordination on the platform.</p>
    </div>
  `;
}
