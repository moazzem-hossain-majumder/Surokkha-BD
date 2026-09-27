"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { createSchedule, type ScheduleFormState } from "./actions";

const initialState: ScheduleFormState = { error: null };

export function ScheduleForm({ locale }: { locale: string }) {
  const t = useTranslations("admin");
  const [state, action, pending] = useActionState(createSchedule.bind(null, locale), initialState);

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <label className="block sm:col-span-2">
        <span className="text-sm font-semibold">{t("ferries.route")}</span>
        <input name="route" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("ferries.fromPlace")}</span>
        <input name="fromPlace" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("ferries.toPlace")}</span>
        <input name="toPlace" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block sm:col-span-2">
        <span className="text-sm font-semibold">{t("ferries.departs")}</span>
        <input name="departs" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("ferries.days")}</span>
        <input name="days" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("ferries.contact")}</span>
        <input name="contact" className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block sm:col-span-2">
        <span className="text-sm font-semibold">{t("ferries.sourceName")}</span>
        <input name="sourceName" required placeholder="BIWTA, terminal enquiry, etc." className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? t("saving") : t("ferries.createSchedule")}
        </Button>
        {state.error && <p className="mt-2 text-sm text-sun">{state.error}</p>}
      </div>
    </form>
  );
}
