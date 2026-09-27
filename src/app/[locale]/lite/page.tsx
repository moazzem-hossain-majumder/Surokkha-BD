import { getTranslations, setRequestLocale } from "next-intl/server";
import { HAZARD_SLUGS } from "@/lib/hazards";
import { Link } from "@/i18n/navigation";

// Deliberately plain: no images, no map, no client components. This is the
// "slow connection" fallback (P5-8) -- every link on this page leads to a
// page that itself works without JS for the core content (hazard guides,
// contacts, plan are static/cached per architecture.md section 8).
export default async function LitePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("lite");
  const tHazards = await getTranslations("hazards");

  return (
    <div className="mx-auto max-w-[600px] px-5 py-10">
      <h1 className="text-2xl">{t("title")}</h1>
      <p className="mt-2">{t("intro")}</p>

      <h2 className="mt-6 text-lg font-bold">{t("emergency")}</h2>
      <p className="mt-1">
        <Link href="/contacts" className="underline">
          {t("contactsLink")}
        </Link>
      </p>

      <h2 className="mt-6 text-lg font-bold">{t("hazardGuides")}</h2>
      <ul className="mt-2 list-disc pl-5">
        {HAZARD_SLUGS.map((slug) => (
          <li key={slug}>
            <Link href={`/hazards/${slug}`} className="underline">
              {tHazards(`items.${slug}`)}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="mt-6 text-lg font-bold">{t("other")}</h2>
      <ul className="mt-2 list-disc pl-5">
        <li>
          <Link href="/shelters" className="underline">
            {t("sheltersLink")}
          </Link>
        </li>
        <li>
          <Link href="/plan" className="underline">
            {t("planLink")}
          </Link>
        </li>
        <li>
          <Link href="/relief" className="underline">
            {t("reliefLink")}
          </Link>
        </li>
        <li>
          <Link href="/" className="underline">
            {t("fullSiteLink")}
          </Link>
        </li>
      </ul>

      <p className="mt-8 text-sm text-ink-3">{t("note")}</p>
    </div>
  );
}
