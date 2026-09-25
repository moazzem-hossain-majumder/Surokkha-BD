"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { HAZARD_SLUGS, type HazardSlug } from "@/lib/hazards";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { createLocalStorageStore } from "@/lib/store";

interface PlanData {
  district: string;
  familySize: string;
  hasElderly: boolean;
  hasChildren: boolean;
  hasDisability: boolean;
  hasLivestock: boolean;
  hazards: HazardSlug[];
}

const empty: PlanData = {
  district: "",
  familySize: "",
  hasElderly: false,
  hasChildren: false,
  hasDisability: false,
  hasLivestock: false,
  hazards: [],
};

const planStore = createLocalStorageStore("safety-plan");

function loadPlan(): PlanData {
  const raw = planStore.get();
  if (!raw) return empty;
  try {
    return { ...empty, ...JSON.parse(raw) };
  } catch {
    return empty;
  }
}

export function PlanForm() {
  const t = useTranslations("plan");
  const tHaz = useTranslations("hazards");
  const [data, setData] = useState<PlanData>(() => (typeof window === "undefined" ? empty : loadPlan()));
  const [saved, setSaved] = useState(false);

  function update<K extends keyof PlanData>(key: K, value: PlanData[K]) {
    setData((d) => ({ ...d, [key]: value }));
    setSaved(false);
  }

  function toggleHazard(slug: HazardSlug) {
    setData((d) => ({
      ...d,
      hazards: d.hazards.includes(slug) ? d.hazards.filter((h) => h !== slug) : [...d.hazards, slug],
    }));
    setSaved(false);
  }

  function save() {
    planStore.set(JSON.stringify(data));
    setSaved(true);
  }

  const checklist = [
    t("checklist.water"),
    t("checklist.food"),
    t("checklist.documents"),
    t("checklist.torch"),
    t("checklist.phone"),
    t("checklist.medicine"),
    ...(data.hasElderly ? [t("checklist.elderly")] : []),
    ...(data.hasChildren ? [t("checklist.children")] : []),
    ...(data.hasDisability ? [t("checklist.disability")] : []),
    ...(data.hasLivestock ? [t("checklist.livestock")] : []),
  ];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
      <Card className="p-6 print:hidden">
        <div className="space-y-5">
          <label className="block">
            <span className="text-sm font-semibold">{t("district")}</span>
            <input
              value={data.district}
              onChange={(e) => update("district", e.target.value)}
              className="mt-1 h-12 w-full rounded-input border border-border bg-surface px-3"
              placeholder={t("districtPlaceholder")}
            />
          </label>

          <label className="block">
            <span className="text-sm font-semibold">{t("familySize")}</span>
            <input
              value={data.familySize}
              onChange={(e) => update("familySize", e.target.value)}
              inputMode="numeric"
              className="mt-1 h-12 w-full rounded-input border border-border bg-surface px-3"
            />
          </label>

          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold">{t("household")}</legend>
            {(
              [
                ["hasElderly", t("elderly")],
                ["hasChildren", t("children")],
                ["hasDisability", t("disability")],
                ["hasLivestock", t("livestock")],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex min-h-11 items-center gap-3">
                <input
                  type="checkbox"
                  checked={data[key]}
                  onChange={(e) => update(key, e.target.checked)}
                  className="h-5 w-5 rounded border-border accent-[var(--brand)]"
                />
                {label}
              </label>
            ))}
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold">{t("mainHazards")}</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {HAZARD_SLUGS.map((slug) => (
                <button
                  key={slug}
                  type="button"
                  aria-pressed={data.hazards.includes(slug)}
                  onClick={() => toggleHazard(slug)}
                  className="h-10 rounded-full border border-border bg-surface px-3 text-sm font-medium hover:bg-surface-2 aria-pressed:border-brand aria-pressed:bg-brand-soft"
                >
                  {tHaz(`items.${slug}`)}
                </button>
              ))}
            </div>
          </fieldset>

          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={save}>{t("save")}</Button>
            {saved && <span className="text-sm text-brand">{t("saved")}</span>}
          </div>
        </div>
      </Card>

      <Card className="p-6" id="printable-plan">
        <h2 className="text-xl font-bold">{t("cardTitle")}</h2>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-sm">
          <dt className="text-ink-3">{t("district")}</dt>
          <dd>{data.district || "—"}</dd>
          <dt className="text-ink-3">{t("familySize")}</dt>
          <dd>{data.familySize || "—"}</dd>
        </dl>

        <h3 className="mt-5 font-semibold">{t("goBag")}</h3>
        <ul className="mt-2 space-y-1.5">
          {checklist.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-ink-2">
              <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>

        {data.hazards.length > 0 && (
          <>
            <h3 className="mt-5 font-semibold">{t("relevantHazards")}</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {data.hazards.map((h) => (
                <li key={h} className="rounded-full bg-surface-2 px-3 py-1 text-sm">
                  {tHaz(`items.${h}`)}
                </li>
              ))}
            </ul>
          </>
        )}

        <Button variant="secondary" className="mt-6 print:hidden" onClick={() => window.print()}>
          {t("print")}
        </Button>
      </Card>
    </div>
  );
}
