"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { setShelterActive } from "./actions";

export function ActiveToggle({ locale, id, active }: { locale: string; id: string; active: boolean }) {
  const t = useTranslations("admin");
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => setShelterActive(locale, id, !active))}
      className="text-sm font-semibold text-brand underline"
    >
      {pending ? t("saving") : active ? t("shelters.deactivate") : t("shelters.activate")}
    </button>
  );
}
