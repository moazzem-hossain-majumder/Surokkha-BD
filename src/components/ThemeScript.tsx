"use client";

import { THEME_INIT_SCRIPT } from "@/lib/theme-init";

// Sets the saved theme before first paint (no flash).
// React 19 warns about executable <script> tags rendered on the client, so on the client
// the tag gets a non-executable type. The server-rendered copy is what actually runs.
export function ThemeScript() {
  return (
    <script
      suppressHydrationWarning
      type={typeof window === "undefined" ? undefined : "application/json"}
      dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
    />
  );
}
