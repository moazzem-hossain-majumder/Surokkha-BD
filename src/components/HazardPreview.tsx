"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { HAZARD_SLUGS, type HazardSlug } from "@/lib/hazards";
import { playChime } from "@/lib/soundEffects";

export function HazardPreview() {
  const t = useTranslations("hazards");
  const [active, setActive] = useState<HazardSlug>("cyclone");

  function handleSelect(slug: HazardSlug) {
    setActive(slug);
    playChime();
  }

  return (
    <section id="hazards" className="mx-auto max-w-[1200px] px-5 pt-16">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-0.5 text-xs font-mono font-semibold uppercase tracking-wider text-ink-2 mb-2">
            <span>Verified SOP Protocols · 14 Hazards</span>
          </div>
          <h2 className="text-2xl font-bold sm:text-3xl text-ink tracking-tight">{t("title")}</h2>
          <p className="mt-1.5 max-w-2xl text-sm text-ink-2 leading-relaxed">{t("intro")}</p>
        </div>
        <Link
          href="/hazards"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline transition-colors duration-150"
        >
          <span>View all 14 guides</span>
          <span aria-hidden="true">→</span>
        </Link>
      </div>

      <div data-hazard={active} className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {HAZARD_SLUGS.map((slug) => {
            const isSelected = active === slug;
            return (
              <li key={slug}>
                <button
                  type="button"
                  data-hazard={slug}
                  aria-pressed={isSelected}
                  onClick={() => handleSelect(slug)}
                  className={`group flex min-h-12 w-full items-center gap-2.5 rounded-md border p-2.5 text-left transition-colors duration-150 ease-out cursor-pointer ${
                    isSelected
                      ? "border-accent bg-accent-soft font-bold text-ink"
                      : "border-border bg-surface hover:bg-surface-2 hover:border-ink-3/40"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 shrink-0 rounded-xs transition-colors duration-150 ${
                      isSelected ? "bg-accent" : "bg-ink-3/50"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="text-xs font-medium leading-snug text-ink">{t(`items.${slug}`)}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Dynamic Hazard Spotlight Card with real photography */}
        <div className="relative min-h-[340px] overflow-hidden rounded-md border border-border bg-surface-2">
          {/* Real-life Hazard Background Image */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              key={active}
              src={`/images/hazards/${active}.jpg`}
              alt={t(`items.${active}`)}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/60" />
          </div>

          {/* Spotlight Overlay Content */}
          <div className="relative z-10 flex h-full flex-col justify-end p-6 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-md bg-black/70 px-2 py-0.5 text-xs font-mono font-semibold uppercase tracking-wider text-white border border-white/20">
                {t("selected")}
              </span>
              <span className="inline-flex items-center rounded-md bg-black/70 px-2 py-0.5 text-[11px] font-mono text-neutral-300 border border-white/10">
                BMD / DDM Protocol Verified
              </span>
            </div>

            <h3 className="mt-2 text-2xl font-bold sm:text-3xl text-white tracking-tight">
              {t(`items.${active}`)}
            </h3>
            <p className="mt-1.5 max-w-md text-xs text-neutral-200 line-clamp-2 leading-relaxed">
              {t("previewNote")}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <Link
                href={`/hazards/${active}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-md bg-white px-4 text-xs font-semibold text-neutral-950 transition-colors duration-150 hover:bg-neutral-200"
              >
                <span>{t("viewGuide")}</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href={`/quiz/${active}`}
                className="inline-flex h-9 items-center gap-1.5 rounded-md border border-white/30 bg-black/50 px-3.5 text-xs font-semibold text-white transition-colors duration-150 hover:bg-black/70"
              >
                <span>Assessment Quiz</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
