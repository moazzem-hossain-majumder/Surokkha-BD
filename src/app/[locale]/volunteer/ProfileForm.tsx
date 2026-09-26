"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { DISTRICTS } from "@/lib/districts";
import { SKILLS, SKILL_LABELS, AVAILABILITIES } from "@/lib/volunteers";
import type { VolunteerProfileInput } from "@/lib/volunteers";
import { Button } from "@/components/ui/Button";
import { saveVolunteerProfile, type ProfileFormState } from "./actions";

const initialState: ProfileFormState = { error: null };

export function ProfileForm({ locale, existing }: { locale: string; existing: VolunteerProfileInput | null }) {
  const t = useTranslations("volunteer");
  const [state, action, pending] = useActionState(saveVolunteerProfile.bind(null, locale), initialState);

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <fieldset className="sm:col-span-2">
        <legend className="text-sm font-semibold">{t("skills")}</legend>
        <div className="mt-2 flex flex-wrap gap-3">
          {SKILLS.map((s) => (
            <label key={s} className="flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm">
              <input type="checkbox" name="skills" value={s} defaultChecked={existing?.skills.includes(s)} className="h-4 w-4" />
              {locale === "bn" ? SKILL_LABELS[s].bn : SKILL_LABELS[s].en}
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block">
        <span className="text-sm font-semibold">{t("district")}</span>
        <select
          name="districtCode"
          required
          defaultValue={existing?.districtCode}
          className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3"
        >
          {DISTRICTS.map((d) => (
            <option key={d.code} value={d.code}>
              {locale === "bn" ? d.name.bn : d.name.en}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("availability")}</span>
        <select
          name="availability"
          required
          defaultValue={existing?.availability ?? "weekends"}
          className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3"
        >
          {AVAILABILITIES.map((a) => (
            <option key={a} value={a}>
              {t(`availabilities.${a}`)}
            </option>
          ))}
        </select>
      </label>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? t("saving") : existing ? t("updateProfile") : t("createProfile")}
        </Button>
        {state.error && <p className="mt-2 text-sm text-sun">{state.error}</p>}
      </div>
    </form>
  );
}
