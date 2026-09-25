"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { bnPromptStore } from "@/lib/store";

const options = [
  { locale: "en", label: "EN", name: "English" },
  { locale: "bn", label: "বাং", name: "বাংলা" },
] as const;

export function LanguageSwitch() {
  const t = useTranslations("lang");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div role="group" aria-label={t("label")} className="flex rounded-full border border-border bg-surface p-0.5">
      {options.map((o) => (
        <button
          key={o.locale}
          type="button"
          lang={o.locale}
          aria-pressed={locale === o.locale}
          aria-label={o.name}
          title={o.name}
          onClick={() => {
            // An explicit choice means we should stop suggesting Bangla.
            bnPromptStore.set("1");
            router.replace(pathname, { locale: o.locale, scroll: false });
          }}
          className="h-11 min-w-11 rounded-full px-3 text-sm font-semibold text-ink-2 transition-colors hover:text-ink aria-pressed:bg-brand aria-pressed:text-brand-ink"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
