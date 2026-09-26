"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { DISTRICTS } from "@/lib/districts";
import { SKILLS, SKILL_LABELS } from "@/lib/volunteers";
import { Button } from "@/components/ui/Button";
import { createTask, type TaskFormState } from "./actions";

const initialState: TaskFormState = { error: null };

export function TaskForm({ locale }: { locale: string }) {
  const t = useTranslations("admin");
  const [state, action, pending] = useActionState(createTask.bind(null, locale), initialState);

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <label className="block sm:col-span-2">
        <span className="text-sm font-semibold">{t("volunteers.taskTitle")}</span>
        <input name="title" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block sm:col-span-2">
        <span className="text-sm font-semibold">{t("volunteers.taskDescription")}</span>
        <textarea name="description" required rows={2} className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2" />
      </label>
      <fieldset className="sm:col-span-2">
        <legend className="text-sm font-semibold">{t("volunteers.requiredSkills")}</legend>
        <div className="mt-2 flex flex-wrap gap-3">
          {SKILLS.map((s) => (
            <label key={s} className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm">
              <input type="checkbox" name="requiredSkills" value={s} className="h-4 w-4" />
              {locale === "bn" ? SKILL_LABELS[s].bn : SKILL_LABELS[s].en}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block">
        <span className="text-sm font-semibold">{t("volunteers.slots")}</span>
        <input name="slots" type="number" min={1} required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("volunteers.district")}</span>
        <select name="districtCode" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3">
          {DISTRICTS.map((d) => (
            <option key={d.code} value={d.code}>
              {locale === "bn" ? d.name.bn : d.name.en}
            </option>
          ))}
        </select>
      </label>
      <label className="block sm:col-span-2">
        <span className="text-sm font-semibold">{t("volunteers.location")}</span>
        <input name="location" required placeholder="Upazila / area" className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>

      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? t("saving") : t("volunteers.createTask")}
        </Button>
        {state.error && <p className="mt-2 text-sm text-sun">{state.error}</p>}
      </div>
    </form>
  );
}
