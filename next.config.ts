import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

// Content-Security-Policy (P6-5 security review).
//
// script-src and style-src include 'unsafe-inline' because:
//  - ThemeScript (src/components/ThemeScript.tsx) renders a small inline
//    <script> to set the theme before first paint, avoiding a flash.
//  - Several components (BarChart's bar widths, print styles) set inline
//    `style={{...}}` attributes.
// The gold-standard fix is a per-request nonce threaded through proxy.ts and
// into those tags, which Next.js supports -- but that touches proxy.ts,
// which also runs the i18n and auth-session logic, and I have no way to
// test that live from here. Shipping a CSP that silently breaks routing or
// login is worse than shipping a slightly looser one that's easy to verify
// visually. This is flagged in memory.md as a good next hardening step once
// you can test it.
// React's development build calls eval() (for readable stack traces) and
// Turbopack's hot reload uses a websocket, so `next dev` needs both allowed.
// Production builds get neither -- verify with `npm run build && npm run start`.
const isDev = process.env.NODE_ENV !== "production";

const CSP = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: https://tile.openstreetmap.org https://*.google.com https://*.googleapis.com https://*.gstatic.com",
  "font-src 'self' data:",
  `connect-src 'self' https://*.supabase.co https://*.google.com https://*.googleapis.com${isDev ? " ws://localhost:* http://localhost:*" : ""}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(self)" },
          { key: "Content-Security-Policy", value: CSP },
          { key: "X-Frame-Options", value: "DENY" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
