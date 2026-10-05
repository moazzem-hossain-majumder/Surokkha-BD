import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitch } from "./LanguageSwitch";
import { ThemeToggle } from "./ThemeToggle";
import { AuthNav } from "./AuthNav";
import { MoreNav } from "./MoreNav";

function Mark() {
  return (
    <div className="relative group flex items-center justify-center">
      <div className="absolute -inset-0.5 rounded-lg bg-brand/20 opacity-0 blur-xs transition-opacity duration-300 group-hover:opacity-100" />
      <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" className="relative transition-transform duration-300 group-hover:scale-105">
        <rect width="32" height="32" rx="8" fill="var(--brand)" />
        <path d="M16 5 6.5 8.5v7c0 5.2 3.6 8.9 9.5 11 5.9-2.1 9.5-5.8 9.5-11v-7z" fill="var(--brand-ink)" />
        <path d="M9.5 16.5c2-1.6 3.6-1.6 5.5 0s3.5 1.6 5.5 0 2.4-1.2 3-.8" fill="none" stroke="var(--brand)" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

export function Header() {
  const t = useTranslations("header");
  const primary = [
    { href: "/hazards", label: t("nav.hazards") },
    { href: "/map", label: t("nav.map") },
    { href: "/shelters", label: t("nav.shelters") },
    { href: "/report", label: t("nav.report") },
    { href: "/relief", label: t("nav.relief") },
    { href: "/volunteer", label: t("nav.volunteer") },
    { href: "/contacts", label: t("nav.contacts") },
    { href: "/plan", label: t("nav.plan") },
  ];
  const more = [
    { href: "/explorer", label: t("nav.explorer") },
    { href: "/quiz", label: t("nav.quiz") },
    { href: "/games", label: t("nav.games") },
    { href: "/ferries", label: t("nav.ferries") },
  ];
  const nav = [...primary, ...more];

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-surface/85 pt-[env(safe-area-inset-top,0px)] backdrop-blur-xl shadow-2xs transition-colors">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-5 py-2.5">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5 rounded-lg focus-visible:outline-offset-2" aria-label={t("home")}>
          <Mark />
          <span className="hidden whitespace-nowrap font-display text-lg font-extrabold tracking-tight text-ink group-hover:text-brand transition-colors sm:inline">
            {t("brand")}
          </span>
        </Link>
        <nav aria-label={t("nav.label")} className="hidden items-center gap-0.5 xl:flex">
          {primary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-10 items-center whitespace-nowrap rounded-full px-3 text-sm font-semibold text-ink-2 transition-all duration-200 hover:bg-surface-2 hover:text-ink active:scale-95"
            >
              {item.label}
            </Link>
          ))}
          <MoreNav label={t("nav.more")} items={more} />
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          {/* Emergency Hotline Quick Dial Pill */}
          <Link
            href="/contacts"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-sun/10 border border-sun/25 px-3 py-1 text-xs font-bold text-sun hover:bg-sun hover:text-white transition-all duration-200 active:scale-95 shadow-2xs"
            title="Emergency Hotlines: 999 & 1090"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sun opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-sun" />
            </span>
            <span>🚨 999 / 1090</span>
          </Link>
          <AuthNav />
          <LanguageSwitch />
          <ThemeToggle />
        </div>
      </div>
      <nav aria-label={t("nav.label")} className="flex gap-1 overflow-x-auto border-t border-border/80 px-3 py-1.5 xl:hidden scrollbar-none">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex h-9 shrink-0 items-center whitespace-nowrap rounded-full px-3 text-sm font-semibold text-ink-2 hover:bg-surface-2 hover:text-ink active:scale-95 transition-all"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
