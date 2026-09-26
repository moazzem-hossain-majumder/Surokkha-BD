import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { requireRole } from "@/lib/auth";

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const profile = await requireRole(locale, ["coordinator", "admin"]);
  const t = await getTranslations("admin");

  const nav = [
    { href: "/admin", label: t("nav.overview") },
    { href: "/admin/alerts", label: t("nav.alerts") },
    { href: "/admin/shelters", label: t("nav.shelters") },
    { href: "/admin/reports", label: t("nav.reports") },
    { href: "/admin/relief", label: t("nav.relief") },
    { href: "/admin/volunteers", label: t("nav.volunteers") },
    ...(profile.role === "admin" ? [{ href: "/admin/audit", label: t("nav.audit") }] : []),
  ] as const;

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-10">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h1 className="text-3xl">{t("title")}</h1>
        <p className="text-sm text-ink-3">
          {t("signedInAs")} {profile.display_name || t(`roles.${profile.role}`)}
        </p>
      </div>
      <nav aria-label={t("nav.label")} className="mt-6 flex flex-wrap gap-2 border-b border-border pb-4">
        {nav.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex h-10 items-center rounded-full border border-border bg-surface px-4 text-sm font-semibold hover:bg-surface-2"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="mt-8">{children}</div>
    </div>
  );
}
