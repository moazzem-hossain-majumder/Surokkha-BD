import { getTranslations, setRequestLocale } from "next-intl/server";
import { PRIVACY_SECTIONS, PRIVACY_LAST_UPDATED } from "@/content/legal/privacy";

export default async function PrivacyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("legal");

  return (
    <div className="mx-auto max-w-[700px] px-5 py-10">
      <h1 className="text-3xl">{t("privacyTitle")}</h1>
      <p className="mt-1 text-sm text-ink-3">
        {t("lastUpdated")}: {PRIVACY_LAST_UPDATED}
      </p>
      <div className="mt-8 space-y-6">
        {PRIVACY_SECTIONS.map((s, i) => (
          <section key={i}>
            <h2 className="text-lg font-bold">{locale === "bn" ? s.heading.bn : s.heading.en}</h2>
            <p className="mt-2 text-ink-2">{locale === "bn" ? s.body.bn : s.body.en}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
