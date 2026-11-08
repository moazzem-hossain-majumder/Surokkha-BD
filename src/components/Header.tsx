import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { LanguageSwitch } from "./LanguageSwitch";
import { ThemeToggle } from "./ThemeToggle";
import { AuthNav } from "./AuthNav";
import { MoreNav } from "./MoreNav";

function Mark() {
  return (
    <div className="relative flex items-center justify-center">
      <svg viewBox="0 0 32 32" width="32" height="32" aria-hidden="true" className="relative">
        <rect width="32" height="32" rx="6" fill="var(--brand)" />
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
    <header className="sticky top-0 z-40 border-b border-border bg-surface pt-[env(safe-area-inset-top,0px)]">
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-5 py-2.5">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-offset-2" aria-label={t("home")}>
          <Mark />
          <span className="hidden whitespace-nowrap font-display text-lg font-bold tracking-tight text-ink sm:inline">
            {t("brand")}
          </span>
        </Link>
        <nav aria-label={t("nav.label")} className="hidden items-center gap-1 xl:flex">
          {primary.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex min-h-9 items-center whitespace-nowrap rounded-md px-2.5 text-sm font-medium text-ink-2 transition-colors duration-150 hover:bg-surface-2 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
          <MoreNav label={t("nav.more")} items={more} />
        </nav>
        <div className="flex shrink-0 items-center gap-2">
          {/* Direct Emergency Dispatch Hotline */}
          <Link
            href="/contacts"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-md border border-sun bg-surface px-2.5 py-1.5 text-xs font-semibold text-sun transition-colors duration-150 hover:bg-sun hover:text-white"
            title="National Hotlines: 999 & 1090"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>SOS 999 / 1090</span>
          </Link>
          <AuthNav />
          <LanguageSwitch />
          <ThemeToggle />
        </div>
      </div>
      <nav aria-label={t("nav.label")} className="flex gap-1 overflow-x-auto border-t border-border px-3 py-1.5 xl:hidden scrollbar-none">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex h-8 shrink-0 items-center whitespace-nowrap rounded-md px-2.5 text-xs font-medium text-ink-2 hover:bg-surface-2 hover:text-ink transition-colors duration-150"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
