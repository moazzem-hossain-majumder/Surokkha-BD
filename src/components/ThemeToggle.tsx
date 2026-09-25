"use client";

import { useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import { themeStore } from "@/lib/store";

type Theme = "light" | "dark" | "system";

function apply(theme: Theme) {
  const root = document.documentElement;
  if (theme === "system") root.removeAttribute("data-theme");
  else root.setAttribute("data-theme", theme);
  themeStore.set(theme === "system" ? null : theme);
}

const icons: Record<Theme, React.ReactNode> = {
  light: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ),
  dark: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
    </svg>
  ),
  system: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  ),
};

export function ThemeToggle() {
  const t = useTranslations("theme");
  const raw = useSyncExternalStore(themeStore.subscribe, themeStore.get, () => null);
  const current: Theme = raw === "light" || raw === "dark" ? raw : "system";

  return (
    <div role="group" aria-label={t("label")} className="flex rounded-full border border-border bg-surface p-0.5">
      {(["light", "dark", "system"] as const).map((theme) => (
        <button
          key={theme}
          type="button"
          aria-pressed={current === theme}
          aria-label={t(theme)}
          title={t(theme)}
          onClick={() => apply(theme)}
          className="grid h-11 w-11 place-items-center rounded-full text-ink-2 transition-colors hover:text-ink aria-pressed:bg-brand aria-pressed:text-brand-ink"
        >
          {icons[theme]}
        </button>
      ))}
    </div>
  );
}
