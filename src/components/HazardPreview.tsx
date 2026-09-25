"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { HAZARD_SLUGS, type HazardSlug } from "@/lib/hazards";
import { Landscape } from "./Landscape";

// Shows how each hazard tints the interface. Real hazard pages arrive in Phase 1.
export function HazardPreview() {
  const t = useTranslations("hazards");
  const [active, setActive] = useState<HazardSlug>("cyclone");

  return (
    <section id="hazards" className="mx-auto max-w-[1200px] px-5 pt-20">
      <h2 className="text-3xl sm:text-4xl">{t("title")}</h2>
      <p className="mt-3 max-w-2xl text-ink-2">{t("intro")}</p>

      <div data-hazard={active} className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {HAZARD_SLUGS.map((slug) => (
            <li key={slug}>
              <button
                type="button"
                data-hazard={slug}
                aria-pressed={active === slug}
                onClick={() => setActive(slug)}
                className="flex min-h-14 w-full items-center gap-3 rounded-card border border-border bg-surface px-3 py-2 text-left transition-colors hover:bg-surface-2 aria-pressed:border-accent aria-pressed:ring-2 aria-pressed:ring-accent"
              >
                <span className="h-3.5 w-3.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />
                <span className="text-sm font-medium leading-snug">{t(`items.${slug}`)}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="relative min-h-72 overflow-hidden rounded-sheet border border-border bg-accent-soft">
          <div className="relative z-10 p-6">
            <p className="text-sm text-ink-2">{t("selected")}</p>
            <h3 className="mt-1 text-2xl sm:text-3xl">{t(`items.${active}`)}</h3>
            <p className="mt-3 max-w-sm text-ink-2">{t("previewNote")}</p>
            <Link
              href={`/hazards/${active}`}
              className="relative z-10 mt-4 inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-white"
            >
              {t("viewGuide")}
            </Link>
          </div>
          <Landscape className="absolute inset-x-0 bottom-0 h-40 w-full" />
        </div>
      </div>
    </section>
  );
}
