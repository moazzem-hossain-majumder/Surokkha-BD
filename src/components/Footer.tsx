import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="mt-24 border-t border-border bg-surface-2">
      <div className="mx-auto max-w-[1200px] px-5 py-10">
        <p className="max-w-2xl text-ink-2">{t("disclaimer")}</p>
        <nav aria-label={t("moreLinksLabel")} className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <Link href="/progress" className="underline">
            {t("progressLink")}
          </Link>
          <Link href="/teacher" className="underline">
            {t("teacherLink")}
          </Link>
          <Link href="/lite" className="underline">
            {t("liteLink")}
          </Link>
          <Link href="/privacy" className="underline">
            {t("privacyLink")}
          </Link>
          <Link href="/terms" className="underline">
            {t("termsLink")}
          </Link>
          <Link href="/case-study" className="underline">
            {t("caseStudyLink")}
          </Link>
        </nav>
        <p className="mt-4 text-sm text-ink-3">{t("status")}</p>
      </div>
    </footer>
  );
}
