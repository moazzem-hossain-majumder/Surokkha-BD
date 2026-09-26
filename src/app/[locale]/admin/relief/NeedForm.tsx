"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { DISTRICTS } from "@/lib/districts";
import { Button } from "@/components/ui/Button";
import { createNeed, type NeedFormState } from "./actions";

const initialState: NeedFormState = { error: null };

export function NeedForm({ locale }: { locale: string }) {
  const t = useTranslations("admin");
  const [state, action, pending] = useActionState(createNeed.bind(null, locale), initialState);

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <label className="block">
        <span className="text-sm font-semibold">{t("relief.district")}</span>
        <select name="districtCode" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3">
          {DISTRICTS.map((d) => (
            <option key={d.code} value={d.code}>
              {locale === "bn" ? d.name.bn : d.name.en}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("relief.item")}</span>
        <input name="item" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("relief.unit")}</span>
        <input name="unit" required placeholder="bags, pieces, liters" className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("relief.qtyNeeded")}</span>
        <input name="qtyNeeded" type="number" min={1} step="any" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("relief.deadline")}</span>
        <input name="deadline" type="datetime-local" className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block sm:col-span-2">
        <span className="text-sm font-semibold">{t("relief.note")}</span>
        <textarea name="note" rows={2} className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2" />
      </label>

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? t("saving") : t("relief.create")}
        </Button>
        {state.error && <p className="mt-2 text-sm text-sun">{state.error}</p>}
      </div>
    </form>
  );
}
