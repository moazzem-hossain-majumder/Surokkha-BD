import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Card } from "@/components/ui/Card";

export default async function GamesHubPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("games");

  return (
    <div className="mx-auto max-w-[900px] px-5 py-12">
      {/* Header with Game Arcade Glow */}
      <div className="text-center max-w-xl mx-auto">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/10 border border-brand/20 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-brand mb-3">
          🎮 Interactive Life-Safety Training
        </span>
        <h1 className="text-4xl font-black text-ink tracking-tight sm:text-5xl">{t("title")}</h1>
        <p className="mt-3 text-lg text-ink-2 leading-relaxed">{t("intro")}</p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        {/* Lightning Survival Sim Game */}
        <Link href="/games/lightning" className="group block">
          <Card
            variant="interactive"
            className="overflow-hidden border border-border/80 p-0 shadow-md group-hover:border-amber-500/50 group-hover:shadow-xl transition-all"
          >
            {/* Visual Header Banner */}
            <div className="relative h-44 bg-gradient-to-br from-amber-600/20 via-surface to-surface-2 p-6 flex flex-col justify-between overflow-hidden">
              <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-amber-400/20 blur-2xl group-hover:scale-125 transition-transform" />
              <div className="flex items-center justify-between z-10">
                <span className="rounded-full bg-surface/90 border border-border px-3 py-1 text-xs font-bold text-ink shadow-2xs backdrop-blur-xs">
                  ⚡ 8 Scenarios
                </span>
                <span className="rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-extrabold px-3 py-1 text-xs border border-amber-500/30">
                  Quick Reflexes
                </span>
              </div>
              <div className="z-10 flex items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface border border-border text-3xl shadow-sm group-hover:scale-110 transition-transform">
                  ⚡
                </span>
                <div>
                  <h2 className="text-2xl font-black text-ink tracking-tight group-hover:text-amber-600 transition-colors">
                    {t("lightning.title")}
                  </h2>
                  <span className="text-xs text-ink-3">Live electric storm simulation</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-ink-2 leading-relaxed">{t("lightning.description")}</p>
              <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                <span className="text-xs font-bold text-ink-3">Difficulty: Realistic</span>
                <span className="inline-flex items-center gap-1 text-sm font-extrabold text-brand group-hover:translate-x-1 transition-transform">
                  <span>Start Game</span>
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
            className="overflow-hidden border border-border/80 p-0 shadow-md group-hover:border-teal-500/50 group-hover:shadow-xl transition-all"
          >
            {/* Visual Header Banner */}
            <div className="relative h-44 bg-gradient-to-br from-teal-600/20 via-surface to-surface-2 p-6 flex flex-col justify-between overflow-hidden">
              <div className="absolute -top-12 -right-12 h-36 w-36 rounded-full bg-brand/20 blur-2xl group-hover:scale-125 transition-transform" />
              <div className="flex items-center justify-between z-10">
                <span className="rounded-full bg-surface/90 border border-border px-3 py-1 text-xs font-bold text-ink shadow-2xs backdrop-blur-xs">
                  🎒 10 Items Limit
                </span>
                <span className="rounded-full bg-brand/20 text-brand font-extrabold px-3 py-1 text-xs border border-brand/30">
                  Critical Thinking
                </span>
              </div>
              <div className="z-10 flex items-center gap-3">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface border border-border text-3xl shadow-sm group-hover:scale-110 transition-transform">
                  🎒
                </span>
                <div>
                  <h2 className="text-2xl font-black text-ink tracking-tight group-hover:text-brand transition-colors">
                    {t("goBag.title")}
                  </h2>
                  <span className="text-xs text-ink-3">Evacuation backpack challenge</span>
                </div>
              </div>
            </div>

            <div className="p-6">
              <p className="text-sm text-ink-2 leading-relaxed">{t("goBag.description")}</p>
              <div className="mt-5 flex items-center justify-between border-t border-border/60 pt-4">
                <span className="text-xs font-bold text-ink-3">Difficulty: Moderate</span>
                <span className="inline-flex items-center gap-1 text-sm font-extrabold text-brand group-hover:translate-x-1 transition-transform">
                  <span>Pack Now</span>
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
