import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getHazard, HAZARD_SLUGS, isHazardSlug, type Bilingual } from "@/lib/hazards";
import { ReadAloud } from "@/components/ReadAloud";
import { Card } from "@/components/ui/Card";

export function generateStaticParams() {
  return HAZARD_SLUGS.map((slug) => ({ slug }));
}

function pick(text: Bilingual, locale: string) {
  return locale === "bn" ? text.bn : text.en;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isHazardSlug(slug)) return {};
  const t = await getTranslations({ locale, namespace: "hazards" });
  return { title: t(`items.${slug}`) };
}

export default async function HazardPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  if (!isHazardSlug(slug)) notFound();

  const t = await getTranslations("hazardPage");
  const tHaz = await getTranslations("hazards");
  const hazard = await getHazard(slug);
  const activeLocale = await getLocale();
  const p = (text: Bilingual) => pick(text, activeLocale);

  const readAloudText = [
    tHaz(`items.${slug}`),
    p(hazard.summary),
    t("before"),
    ...hazard.before.map(p),
    t("during"),
    ...hazard.during.map(p),
    t("after"),
    ...hazard.after.map(p),
  ].join(". ");

  return (
    <div data-hazard={slug}>
      <section className="relative overflow-hidden border-b border-border bg-surface-2">
        <div className="absolute inset-0 z-0 pointer-events-none">
          <img
            src={`/images/hazards/${slug}.jpg`}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover opacity-15 filter blur-[2px] dark:opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/85 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1200px] px-5 pb-16 pt-10">
          <Link href="/hazards" className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline">
            ← {t("allHazards")}
          </Link>
          <div className="mt-4 grid gap-8 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <h1 className="text-3xl font-extrabold sm:text-5xl text-ink tracking-tight">{tHaz(`items.${slug}`)}</h1>
              <p className="mt-4 max-w-2xl text-lg text-ink-2">{p(hazard.summary)}</p>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-ink-2">
                <span className="rounded-full bg-surface px-3 py-1.5 border border-border shadow-xs">
                  <strong className="text-ink">{t("season")}:</strong> {p(hazard.season)}
                </span>
                <span className="rounded-full bg-surface px-3 py-1.5 border border-border shadow-xs">
                  <strong className="text-ink">{t("where")}:</strong> {p(hazard.where)}
                </span>
              </div>
              <div className="mt-6">
                <ReadAloud text={readAloudText} />
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="group relative overflow-hidden rounded-2xl border border-border shadow-md aspect-video">
                <img
                  src={`/images/hazards/${slug}.jpg`}
                  alt={tHaz(`items.${slug}`)}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-[1200px] px-5 py-12">
        {hazard.signals && (
          <section className="mb-12">
            <h2 className="text-2xl">{t("signals")}</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {hazard.signals.map((s) => (
                <Card key={s.range} className="p-4">
                  <p className="text-sm font-semibold text-accent">
                    {t("signalNumbers")} {s.range}: {p(s.name)}
                  </p>
                  <p className="mt-1 text-ink-2">{p(s.meaning)}</p>
                </Card>
              ))}
            </div>
          </section>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {(
            [
              ["before", hazard.before],
              ["during", hazard.during],
              ["after", hazard.after],
            ] as const
          ).map(([key, items]) => (
            <section key={key}>
              <h2 className="text-xl font-bold">{t(key)}</h2>
              <ul className="mt-4 space-y-3">
                {items.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                    <span className="text-ink-2">{p(item)}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <section className="mt-12">
          <h2 className="text-2xl">{t("mythsTitle")}</h2>
          <div className="mt-4 space-y-4">
            {hazard.myths.map((m, i) => (
              <Card key={i} className="p-5">
                <p className="text-ink-3">
                  <span className="font-semibold text-ink">{t("myth")}:</span> {p(m.myth)}
                </p>
                <p className="mt-2">
                  <span className="font-semibold text-accent">{t("fact")}:</span> {p(m.fact)}
                </p>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-12 border-t border-border pt-6 text-sm text-ink-3">
          <p className="font-semibold text-ink-2">{t("sources")}</p>
          <ul className="mt-2 space-y-1">
            {hazard.sources.map((s, i) => (
              <li key={i}>{s.url ? <a href={s.url} className="underline hover:text-ink">{s.name}</a> : s.name}</li>
            ))}
          </ul>
          <p className="mt-3">{t(hazard.status === "reviewed" ? "reviewed" : "draftNotice")}</p>
        </section>
      </div>
    </div>
  );
}
