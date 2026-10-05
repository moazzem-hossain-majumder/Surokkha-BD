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
    <section id="hazards" className="mx-auto max-w-[1200px] px-5 pt-20">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 border border-brand/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-brand mb-2">
            <span className="h-2 w-2 rounded-full bg-brand animate-ping" />
            <span>Real-time Preparedness Protocols</span>
          </div>
          <h2 className="mt-1 text-3xl font-black sm:text-4xl text-ink tracking-tight">{t("title")}</h2>
          <p className="mt-2 max-w-2xl text-ink-2">{t("intro")}</p>
        </div>
        <Link
          href="/hazards"
          className="inline-flex items-center gap-2 text-sm font-bold text-brand hover:text-brand/80 group transition-all"
        >
          <span>View all 14 guides</span>
          <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
        </Link>
      </div>

      <div data-hazard={active} className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {HAZARD_SLUGS.map((slug) => {
            const isSelected = active === slug;
            return (
              <li key={slug}>
                <button
                  type="button"
                  data-hazard={slug}
                  aria-pressed={isSelected}
                  onClick={() => handleSelect(slug)}
                  className={`group flex min-h-14 w-full items-center gap-3 rounded-card border p-3 text-left transition-all duration-300 cursor-pointer ${
                    isSelected
                      ? "border-accent bg-accent-soft shadow-md scale-[1.02] ring-2 ring-accent/40 font-bold"
                      : "border-border bg-surface hover:bg-surface-2 hover:border-brand/30 hover:-translate-y-0.5"
                  }`}
                >
                  <span
                    className={`h-3 w-3 shrink-0 rounded-full transition-transform duration-300 ${
                      isSelected ? "bg-accent scale-125 shadow-xs" : "bg-accent/70 group-hover:scale-110"
                    }`}
                    aria-hidden="true"
                  />
                  <span className="text-sm font-semibold leading-snug text-ink">{t(`items.${slug}`)}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Dynamic Interactive Hazard Spotlight Card with real photography */}
        <div className="relative min-h-[360px] overflow-hidden rounded-sheet border border-border shadow-xl bg-surface-2 group transition-all">
          {/* Real-life Hazard Background Image with smooth zoom */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              key={active}
              src={`/images/hazards/${active}.jpg`}
              alt={t(`items.${active}`)}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105 animate-pop"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/25" />
          </div>

          {/* Spotlight Overlay Content */}
          <div className="relative z-10 flex h-full flex-col justify-end p-7 sm:p-8 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md border border-white/25">
                <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                {t("selected")}
              </span>
              <span className="inline-flex items-center rounded-full bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white/90 backdrop-blur-md border border-white/10">
                Official SOP Verified
              </span>
            </div>

            <h3 className="mt-2.5 text-2xl font-black sm:text-4xl text-white tracking-tight drop-shadow-md">
              {t(`items.${active}`)}
            </h3>
            <p className="mt-2 max-w-md text-sm text-white/90 line-clamp-2 drop-shadow-xs leading-relaxed">
              {t("previewNote")}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href={`/hazards/${active}`}
                className="inline-flex h-11 items-center gap-2 rounded-full bg-white px-6 text-sm font-bold text-ink shadow-md transition-all duration-300 hover:bg-white/90 hover:scale-105 active:scale-95"
              >
                <span>{t("viewGuide")}</span>
                <span aria-hidden="true">→</span>
              </Link>
              <Link
                href={`/quiz/${active}`}
                className="inline-flex h-11 items-center gap-1.5 rounded-full bg-white/15 px-5 text-sm font-bold text-white backdrop-blur-md border border-white/30 transition-all duration-300 hover:bg-white/25 hover:scale-105 active:scale-95"
              >
                <span>🧠 Test Knowledge</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
