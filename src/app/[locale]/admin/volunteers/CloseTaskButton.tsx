"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { closeTask } from "./actions";

export function CloseTaskButton({ locale, id }: { locale: string; id: string }) {
  const t = useTranslations("admin");
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => closeTask(locale, id))}
      className="h-9 rounded-full border border-border bg-surface px-3 text-xs font-semibold text-sun hover:bg-surface-2 disabled:opacity-50"
    >
      {t("volunteers.closeTask")}
    </button>
  );
}
