import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  return (
    <footer className="mt-24 border-t border-border bg-surface-2">
      <div className="mx-auto max-w-[1200px] px-5 py-10">
        <p className="max-w-2xl text-ink-2">{t("disclaimer")}</p>
        <p className="mt-4 text-sm text-ink-3">{t("status")}</p>
      </div>
    </footer>
  );
}
