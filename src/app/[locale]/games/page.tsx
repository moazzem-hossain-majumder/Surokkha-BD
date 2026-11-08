import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";

export default async function GamesHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("games");

  return (
    <div className="mx-auto max-w-[900px] px-5 py-12">
      <div className="max-w-xl">
        <h1 className="text-3xl font-black text-ink tracking-tight sm:text-4xl">{t("title")}</h1>
        <p className="mt-2 text-base text-ink-2 leading-relaxed">{t("intro")}</p>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {/* Lightning Survival Sim Game */}
        <Link href="/games/lightning" className="group block">
          <Card
            variant="interactive"
            className="overflow-hidden border border-border p-0"
          >
            {/* Real Photographic Banner */}
            <div className="relative h-40 overflow-hidden bg-surface-2">
              <img
                src="/images/hazards/lightning.jpg"
                alt="Severe thunderstorm and lightning simulation"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
                <span className="rounded-sm bg-black/70 border border-white/20 px-2 py-0.5 font-semibold text-white text-[11px]">
                  8 SCENARIOS
                </span>
                <span className="rounded-sm bg-black/70 border border-white/20 px-2 py-0.5 font-semibold text-neutral-300 text-[11px]">
                  REALISTIC SOP
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h2 className="text-xl font-bold tracking-tight">
                  {t("lightning.title")}
                </h2>
                <span className="font-mono text-xs text-neutral-300">Hazard mitigation training</span>
              </div>
            </div>

            <div className="p-4">
              <p className="text-xs text-ink-2 leading-relaxed">{t("lightning.description")}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="font-mono text-xs text-ink-3">PROTOCOL CHECK</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand">
                  <span>Start simulation</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          </Card>
        </Link>

        {/* 72-Hour Go-Bag Packing Game */}
        <Link href="/games/go-bag" className="group block">
          <Card
            variant="interactive"
            className="overflow-hidden border border-border p-0"
          >
            {/* Real Photographic Banner */}
            <div className="relative h-40 overflow-hidden bg-surface-2">
              <img
                src="/images/hazards/cyclone.jpg"
                alt="Emergency 72h evacuation go-bag preparation"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50" />
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-xs font-mono">
                <span className="rounded-sm bg-black/70 border border-white/20 px-2 py-0.5 font-semibold text-white text-[11px]">
                  10 ITEM THRESHOLD
                </span>
                <span className="rounded-sm bg-black/70 border border-white/20 px-2 py-0.5 font-semibold text-neutral-300 text-[11px]">
                  SURVIVAL KIT
                </span>
              </div>
              <div className="absolute bottom-3 left-3 right-3 text-white">
                <h2 className="text-xl font-bold tracking-tight">
                  {t("goBag.title")}
                </h2>
                <span className="font-mono text-xs text-neutral-300">Evacuation gear prioritization</span>
              </div>
            </div>

            <div className="p-4">
              <p className="text-xs text-ink-2 leading-relaxed">{t("goBag.description")}</p>
              <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                <span className="font-mono text-xs text-ink-3">SUPPLY CRITERIA</span>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-brand">
                  <span>Start simulation</span>
                  <span>→</span>
                </span>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
}
