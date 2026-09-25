import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "bn"],
  defaultLocale: "en",
  // English has no URL prefix. Bangla lives under /bn.
  localePrefix: "as-needed",
});
