import { getTranslations, setRequestLocale } from "next-intl/server";
import { HazardPreview } from "@/components/HazardPreview";
import { Landscape } from "@/components/Landscape";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Link } from "@/i18n/navigation";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hero");
  const s = await getTranslations("severity");

  return (
    <>
      <section className="relative overflow-hidden border-b border-border bg-brand-soft">
        <div className="relative z-10 mx-auto max-w-[1200px] px-5 pb-40 pt-16 sm:pt-24">
          <h1 className="max-w-3xl text-4xl sm:text-6xl">{t("title")}</h1>
          <p className="mt-5 max-w-xl text-lg text-ink-2">{t("subtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-3">
  <Link href="/hazards" className="inline-flex h-14 items-center rounded-full bg-brand px-7 font-semibold text-brand-ink">
              {t("primary")}
            </Link>
            <Link href="/contacts" className="inline-flex h-14 items-center rounded-full bg-sun px-7 font-semibold text-white">
              {t("emergency")}
            </Link>
            <Link href="/plan" className="inline-flex h-14 items-center rounded-full border border-border bg-surface px-7 font-semibold">
              {t("secondary")}
            </Link>
          </div>
        </div>
        <Landscape className="absolute inset-x-0 bottom-0 h-44 w-full" />
      </section>

      <HazardPreview />

      <section id="severity" className="mx-auto max-w-[1200px] px-5 pt-20">
        <h2 className="text-3xl sm:text-4xl">{s("title")}</h2>
        <p className="mt-3 max-w-2xl text-ink-2">{s("intro")}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {([0, 1, 2, 3, 4] as const).map((level) => (
            <SeverityBadge key={level} level={level} />
          ))}
        </div>
      </section>
    </>
  );
}
