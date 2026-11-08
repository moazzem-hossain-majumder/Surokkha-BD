import { getTranslations, setRequestLocale } from "next-intl/server";
import { HazardPreview } from "@/components/HazardPreview";
import { SeverityBadge } from "@/components/SeverityBadge";
import { Link } from "@/i18n/navigation";

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("hero");
  const s = await getTranslations("severity");

  return (
    <div className="bg-bg text-ink">
      {/* 1. HERO SECTION: Centered high-contrast typography and balanced telemetry grid */}
      <section className="border-b border-border bg-surface py-16 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-5">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-black tracking-tight sm:text-6xl sm:leading-[1.1] text-ink">
              {t("title")}
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-2 leading-relaxed">
              {t("subtitle")}
            </p>

            {/* Strict action controls: 1 solid accent, monochrome secondary */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/hazards"
                className="inline-flex h-11 items-center justify-center rounded-md bg-brand px-6 text-sm font-semibold text-brand-ink transition-colors duration-150 ease-out hover:bg-brand/90"
              >
                {t("primary")}
              </Link>
              <Link
                href="/contacts"
                className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-surface px-5 text-sm font-semibold text-ink transition-colors duration-150 ease-out hover:bg-surface-2 hover:border-ink-3/40"
              >
                {t("secondary")}
              </Link>
              <Link
                href="/map"
                className="inline-flex h-11 items-center justify-center rounded-md border border-border bg-surface px-5 text-sm font-semibold text-ink transition-colors duration-150 ease-out hover:bg-surface-2 hover:border-ink-3/40"
              >
                {t("map")}
              </Link>
            </div>

            {/* Exact operational telemetry specs - centered border grid */}
            <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-px border border-border bg-border sm:grid-cols-4 rounded-md overflow-hidden text-xs text-left">
              <div className="bg-surface p-4">
                <p className="font-mono text-ink-3 text-[11px] uppercase tracking-wider">Coverage</p>
                <p className="mt-1 text-sm font-bold text-ink">64 Districts</p>
              </div>
              <div className="bg-surface p-4">
                <p className="font-mono text-ink-3 text-[11px] uppercase tracking-wider">Shelters</p>
                <p className="mt-1 text-sm font-bold text-ink">4,000+ Mapped</p>
              </div>
              <div className="bg-surface p-4">
                <p className="font-mono text-ink-3 text-[11px] uppercase tracking-wider">Spatial Index</p>
                <p className="mt-1 text-sm font-bold text-ink">&lt;15ms Query</p>
              </div>
              <div className="bg-surface p-4">
                <p className="font-mono text-ink-3 text-[11px] uppercase tracking-wider">Sync State</p>
                <p className="mt-1 text-sm font-bold text-ink">Offline Cache</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPECIFICATION BORDER GRID: Replaces the 3/4 glassmorphic icon grid with structured specifications */}
      <section className="mx-auto max-w-[1200px] px-5 py-12">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 border-b border-border pb-3">
          <h2 className="text-xl font-bold tracking-tight text-ink">System Capabilities &amp; Architecture</h2>
          <span className="font-mono text-xs text-ink-3">OFFLINE-FIRST CORE SPECIFICATION</span>
        </div>

        <div className="mt-6 grid grid-cols-1 divide-y divide-border border border-border bg-surface sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4 rounded-md overflow-hidden">
          {/* Item 1 */}
          <div className="flex flex-col justify-between p-5">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-ink-3">
                <span>01 // GIS</span>
                <span className="text-brand font-semibold">&lt;15ms</span>
              </div>
              <h3 className="mt-2 text-base font-bold text-ink">Shelter Routing</h3>
              <p className="mt-2 text-xs text-ink-2 leading-relaxed">
                Leaflet 1.9 map client with Haversine distance computations to 4,000+ geo-tagged cyclone and flood shelters across 64 districts.
              </p>
            </div>
            <Link
              href="/map"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
            >
              <span>Inspect GIS map</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Item 2 */}
          <div className="flex flex-col justify-between p-5">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-ink-3">
                <span>02 // PROTOCOLS</span>
                <span className="text-brand font-semibold">14 Hazards</span>
              </div>
              <h3 className="mt-2 text-base font-bold text-ink">Operational SOPs</h3>
              <p className="mt-2 text-xs text-ink-2 leading-relaxed">
                Verified checklists cross-referenced against BMD, DDM, and FFWC criteria covering pre-disaster hardening, crisis survival, and disease mitigation.
              </p>
            </div>
            <Link
              href="/hazards"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
            >
              <span>Read hazard guides</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Item 3 */}
          <div className="flex flex-col justify-between p-5">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-ink-3">
                <span>03 // DISPATCH</span>
                <span className="text-brand font-semibold">IndexedDB</span>
              </div>
              <h3 className="mt-2 text-base font-bold text-ink">Incident Reports</h3>
              <p className="mt-2 text-xs text-ink-2 leading-relaxed">
                Citizen-generated field reports with GPS coordinates, photographic evidence, and offline queuing that syncs automatically when signal is restored.
              </p>
            </div>
            <Link
              href="/report"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
            >
              <span>Submit incident report</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Item 4 */}
          <div className="flex flex-col justify-between p-5">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-ink-3">
                <span>04 // LOGISTICS</span>
                <span className="text-brand font-semibold">Real-time P2P</span>
              </div>
              <h3 className="mt-2 text-base font-bold text-ink">Relief Distribution</h3>
              <p className="mt-2 text-xs text-ink-2 leading-relaxed">
                Transparent resource registry matching community requests for rations, water purification units, and medical supplies directly to volunteers.
              </p>
            </div>
            <Link
              href="/relief"
              className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-brand hover:underline"
            >
              <span>Open relief board</span>
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE HAZARD SPOTLIGHT */}
      <HazardPreview />

      {/* 4. SEVERITY MATRIX: Clean technical specification */}
      <section id="severity" className="mx-auto max-w-[1200px] px-5 py-16">
        <div className="border-b border-border pb-3">
          <h2 className="text-2xl font-bold text-ink tracking-tight">{s("title")}</h2>
          <p className="mt-1 text-sm text-ink-2">{s("intro")}</p>
        </div>
        <div className="mt-6 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-5">
          {([0, 1, 2, 3, 4] as const).map((level) => (
            <SeverityBadge key={level} level={level} />
          ))}
        </div>
      </section>
    </div>
  );
}
