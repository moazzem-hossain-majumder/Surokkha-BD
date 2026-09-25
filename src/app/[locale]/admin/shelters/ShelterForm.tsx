"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { DISTRICTS } from "@/lib/districts";
import { Button } from "@/components/ui/Button";
import { createShelter, type ShelterFormState } from "./actions";

const initialState: ShelterFormState = { error: null };

export function ShelterForm({ locale }: { locale: string }) {
  const t = useTranslations("admin");
  const [state, action, pending] = useActionState(createShelter.bind(null, locale), initialState);

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <label className="block">
        <span className="text-sm font-semibold">{t("shelters.nameEn")}</span>
        <input name="nameEn" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("shelters.nameBn")}</span>
        <input name="nameBn" required lang="bn" className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("shelters.type")}</span>
        <select name="type" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3">
          <option value="cyclone">{t("shelters.types.cyclone")}</option>
          <option value="flood">{t("shelters.types.flood")}</option>
          <option value="hospital">{t("shelters.types.hospital")}</option>
          <option value="other">{t("shelters.types.other")}</option>
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("shelters.district")}</span>
        <select name="districtCode" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3">
          {DISTRICTS.map((d) => (
            <option key={d.code} value={d.code}>
              {locale === "bn" ? d.name.bn : d.name.en}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("shelters.lat")}</span>
        <input name="lat" type="number" step="any" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("shelters.lng")}</span>
        <input name="lng" type="number" step="any" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("shelters.capacity")}</span>
        <input name="capacity" type="number" min={0} className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("shelters.contact")}</span>
        <input name="contact" className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="flex items-center gap-2">
        <input name="accessible" type="checkbox" className="h-5 w-5" />
        <span className="text-sm font-semibold">{t("shelters.accessible")}</span>
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("shelters.sourceName")}</span>
        <input name="sourceName" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? t("saving") : t("shelters.create")}
        </Button>
        {state.error && <p className="mt-2 text-sm text-sun">{state.error}</p>}
      </div>
    </form>
  );
}
