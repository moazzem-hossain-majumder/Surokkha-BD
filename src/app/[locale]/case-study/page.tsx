import { getTranslations, setRequestLocale } from "next-intl/server";

export default async function CaseStudyPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("caseStudy");

  return (
    <article className="mx-auto max-w-[750px] px-5 py-10">
      <p className="text-sm font-semibold text-brand">{t("kicker")}</p>
      <h1 className="mt-1 text-3xl">{t("title")}</h1>
      <p className="mt-3 text-lg text-ink-2">{t("subtitle")}</p>

      <section className="mt-8">
        <h2 className="text-xl font-bold">{t("problemHeading")}</h2>
        <p className="mt-2 text-ink-2">{t("problemBody")}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold">{t("solutionHeading")}</h2>
        <p className="mt-2 text-ink-2">{t("solutionBody")}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold">{t("stackHeading")}</h2>
        <p className="mt-2 text-ink-2">{t("stackBody")}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold">{t("decisionsHeading")}</h2>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-ink-2">
          <li>{t("decision1")}</li>
          <li>{t("decision2")}</li>
          <li>{t("decision3")}</li>
          <li>{t("decision4")}</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold">{t("honestyHeading")}</h2>
        <p className="mt-2 text-ink-2">{t("honestyBody")}</p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold">{t("roadmapHeading")}</h2>
        <p className="mt-2 text-ink-2">{t("roadmapBody")}</p>
      </section>

      <p className="mt-10 text-sm text-ink-3">{t("footerNote")}</p>
    </article>
  );
}
