import { getTranslations, setRequestLocale } from "next-intl/server";
import { TERMS_SECTIONS, TERMS_LAST_UPDATED } from "@/content/legal/terms";

export default async function TermsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <div className="mx-auto max-w-[700px] px-5 py-10">
      <h1 className="text-3xl">{t("termsTitle")}</h1>
      <p className="mt-1 text-sm text-ink-3">
        {t("lastUpdated")}: {TERMS_LAST_UPDATED}
      </p>
      <div className="mt-8 space-y-6">
        {TERMS_SECTIONS.map((s, i) => (
          <section key={i}>
            <h2 className="text-lg font-bold">{locale === "bn" ? s.heading.bn : s.heading.en}</h2>
            <p className="mt-2 text-ink-2">{locale === "bn" ? s.body.bn : s.body.en}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
