import type { Metadata } from "next";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import contacts from "@/content/contacts.json";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Bilingual } from "@/lib/hazards";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contacts" });
  return { title: t("title") };
}

function pick(text: Bilingual, locale: string) {
  return locale === "bn" ? text.bn : text.en;
}

export default async function ContactsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contacts");
  const activeLocale = await getLocale();
  const p = (text: Bilingual) => pick(text, activeLocale);

  return (
    <div className="mx-auto max-w-[800px] px-5 py-16">
      <h1 className="text-3xl sm:text-4xl">{t("title")}</h1>
      <p className="mt-3 text-ink-2">{t("intro")}</p>

      <ul className="mt-8 space-y-3">
        {contacts.map((c) => (
          <li key={c.id}>
            <Card className={`flex flex-wrap items-center justify-between gap-4 p-5 ${c.featured ? "border-brand" : ""}`}>
              <div>
                <p className="font-bold">{p(c.name as Bilingual)}</p>
                <p className="mt-1 text-sm text-ink-2">{p(c.what as Bilingual)}</p>
                <p className="mt-2 text-xs text-ink-3">
                  {t("verified")}: {c.verified}
                </p>
              </div>
              <a
                href={`tel:${c.number.replace(/[^0-9+]/g, "")}`}
                className="inline-flex h-14 min-w-[6rem] items-center justify-center rounded-full bg-sun px-6 text-xl font-bold text-white"
              >
                {c.number}
              </a>
            </Card>
          </li>
        ))}
      </ul>

      <Badge className="mt-8">{t("sourceNote")}</Badge>
    </div>
  );
}
