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
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-brand-soft/70 via-brand-soft/35 to-transparent">
        {/* Subtle Ambient Glow Elements */}
        <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-brand/15 blur-3xl pointer-events-none animate-glow" />
        <div className="absolute top-48 right-10 h-72 w-72 rounded-full bg-sun/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1200px] px-5 pb-36 pt-16 sm:pt-24">
          {/* Live System Pulsing Badge */}
          <div className="inline-flex items-center gap-2.5 rounded-full border border-brand/30 bg-surface/85 px-4 py-2 text-xs font-bold text-brand shadow-xs backdrop-blur-md mb-6 hover:shadow-md transition-all">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-sonar absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand" />
            </span>
            <span className="tracking-wide">
              {locale === "bn" ? "সরাসরি প্রস্তুতি ও সতর্কবার্তা ব্যবস্থা • ২৪/৭ সক্রিয়" : "LIVE EARLY WARNING & PREPAREDNESS SYSTEM • 24/7 ACTIVE"}
            </span>
          </div>

          <h1 className="max-w-3xl text-4xl font-black sm:text-6xl text-ink tracking-tight leading-[1.12]">
            {t("title")}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-ink-2 leading-relaxed font-normal">
            {t("subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link
              href="/hazards"
              className="shimmer-effect inline-flex h-14 items-center justify-center rounded-full bg-brand px-8 font-extrabold text-white shadow-md transition-all duration-300 hover:bg-brand/90 hover:scale-105 active:scale-95 cursor-pointer"
            >
              {t("primary")}
            </Link>
            <Link
              href="/contacts"
              className="inline-flex h-14 items-center justify-center rounded-full bg-sun px-8 font-extrabold text-white shadow-md transition-all duration-300 hover:bg-sun/90 hover:scale-105 active:scale-95 ring-2 ring-sun/30 cursor-pointer"
            >
              📞 {t("emergency")}
            </Link>
            <Link
              href="/plan"
              className="inline-flex h-14 items-center justify-center rounded-full border border-border bg-surface px-7 font-extrabold text-ink shadow-xs transition-all duration-300 hover:bg-surface-2 hover:border-brand/40 hover:scale-105 active:scale-95 cursor-pointer"
            >
              📋 {t("secondary")}
            </Link>
          </div>

          {/* Quick interactive highlights with glassmorphic depth */}
          <div className="mt-14 grid grid-cols-2 gap-3.5 sm:grid-cols-4 max-w-3xl">
            <Link
              href="/map"
              className="group rounded-2xl border border-border/80 bg-surface/90 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-xl transition-transform group-hover:scale-110">
                🗺️
              </div>
              <p className="mt-2.5 text-sm font-bold text-ink group-hover:text-brand transition-colors">Google Maps</p>
              <p className="text-xs text-ink-3">Live satellite &amp; quakes</p>
            </Link>

            <Link
              href="/hazards"
              className="group rounded-2xl border border-border/80 bg-surface/90 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-xl transition-transform group-hover:scale-110">
                🛡️
              </div>
              <p className="mt-2.5 text-sm font-bold text-ink group-hover:text-brand transition-colors">14 Hazards</p>
              <p className="text-xs text-ink-3">Photo safety guides</p>
            </Link>

            <Link
              href="/games"
              className="group rounded-2xl border border-border/80 bg-surface/90 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-xl transition-transform group-hover:scale-110">
                🎮
              </div>
              <p className="mt-2.5 text-sm font-bold text-ink group-hover:text-brand transition-colors">Safety Games</p>
              <p className="text-xs text-ink-3">Animated simulations</p>
            </Link>

            <Link
              href="/volunteer"
              className="group rounded-2xl border border-border/80 bg-surface/90 p-4 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-lg"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand/10 text-xl transition-transform group-hover:scale-110">
                🤝
              </div>
              <p className="mt-2.5 text-sm font-bold text-ink group-hover:text-brand transition-colors">Volunteer Hub</p>
              <p className="text-xs text-ink-3">Community response</p>
            </Link>
          </div>

          {/* National Live Readiness Metrics Ticker */}
          <div className="mt-8 flex flex-wrap items-center gap-6 rounded-2xl border border-border/60 bg-surface/60 px-5 py-3.5 backdrop-blur-xs text-xs text-ink-2 max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand" />
              <span><strong>64</strong> Districts Covered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand" />
              <span><strong>4,000+</strong> Shelters Mapped</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand" />
              <span><strong>100%</strong> Offline PWA</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-brand" />
              <span><strong>USGS</strong> Real-Time Quakes</span>
            </div>
          </div>
        </div>
        <Landscape className="absolute inset-x-0 bottom-0 h-44 w-full pointer-events-none" />
      </section>

      <HazardPreview />

      <section id="severity" className="mx-auto max-w-[1200px] px-5 pt-20">
        <h2 className="text-3xl font-black sm:text-4xl text-ink tracking-tight">{s("title")}</h2>
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
