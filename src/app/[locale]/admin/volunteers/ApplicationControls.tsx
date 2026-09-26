"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { decideApplication } from "./actions";

export function ApplicationControls({ locale, applicationId }: { locale: string; applicationId: string }) {
  const t = useTranslations("admin");
  const [pending, startTransition] = useTransition();

  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => decideApplication(locale, applicationId, "accepted"))}
        className="h-9 rounded-full border border-border bg-surface px-3 text-xs font-semibold hover:bg-surface-2 disabled:opacity-50"
      >
        {t("volunteers.accept")}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => decideApplication(locale, applicationId, "declined"))}
        className="h-9 rounded-full border border-border bg-surface px-3 text-xs font-semibold text-sun hover:bg-surface-2 disabled:opacity-50"
      >
        {t("volunteers.decline")}
      </button>
    </div>
  );
}
