"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { deleteSchedule } from "./actions";

export function DeleteScheduleButton({ locale, id }: { locale: string; id: string }) {
  const t = useTranslations("admin");
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => deleteSchedule(locale, id))}
      className="h-9 rounded-full border border-border bg-surface px-3 text-xs font-semibold text-sun hover:bg-surface-2 disabled:opacity-50"
    >
      {t("ferries.deleteSchedule")}
    </button>
  );
}
