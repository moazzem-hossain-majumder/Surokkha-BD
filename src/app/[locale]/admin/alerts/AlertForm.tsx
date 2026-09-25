"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { HAZARD_SLUGS } from "@/lib/hazards";
import { Button } from "@/components/ui/Button";
import { createAlert, type AlertFormState } from "./actions";

const initialState: AlertFormState = { error: null };

export function AlertForm({ locale }: { locale: string }) {
  const t = useTranslations("admin");
  const tHaz = useTranslations("hazards");
  const [state, action, pending] = useActionState(createAlert.bind(null, locale), initialState);

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <label className="block">
        <span className="text-sm font-semibold">{t("alerts.hazard")}</span>
        <select name="hazardSlug" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3">
          {HAZARD_SLUGS.map((slug) => (
            <option key={slug} value={slug}>
              {tHaz(`items.${slug}`)}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("alerts.severity")}</span>
        <select name="severity" required defaultValue="2" className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3">
          {[0, 1, 2, 3, 4].map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("alerts.titleEn")}</span>
        <input name="titleEn" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("alerts.titleBn")}</span>
        <input name="titleBn" required lang="bn" className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block sm:col-span-2">
        <span className="text-sm font-semibold">{t("alerts.bodyEn")}</span>
        <textarea name="bodyEn" rows={2} className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2" />
      </label>
      <label className="block sm:col-span-2">
        <span className="text-sm font-semibold">{t("alerts.bodyBn")}</span>
        <textarea name="bodyBn" lang="bn" rows={2} className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2" />
      </label>
      <label className="block sm:col-span-2">
        <span className="text-sm font-semibold">{t("alerts.districtCodes")}</span>
        <input name="districtCodes" placeholder="BAR,PAT,BHO" className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
        <span className="mt-1 block text-xs text-ink-3">{t("alerts.districtCodesHint")}</span>
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("alerts.sourceName")}</span>
        <input name="sourceName" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("alerts.sourceUrl")}</span>
        <input name="sourceUrl" type="url" className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block sm:col-span-2">
        <span className="text-sm font-semibold">{t("alerts.expiresAt")}</span>
        <input name="expiresAt" type="datetime-local" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? t("saving") : t("alerts.create")}
        </Button>
        {state.error && <p className="mt-2 text-sm text-sun">{state.error}</p>}
      </div>
    </form>
  );
}
