import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function LocaleNotFound() {
  const t = await getTranslations("notFound");
  return (
    <div className="mx-auto max-w-2xl px-5 py-24">
      <h1 className="text-3xl">{t("title")}</h1>
      <p className="mt-3 text-ink-2">{t("body")}</p>
      <Link href="/" className="mt-6 inline-flex h-12 items-center rounded-full bg-brand px-6 font-semibold text-brand-ink">
        {t("home")}
      </Link>
    </div>
  );
}
