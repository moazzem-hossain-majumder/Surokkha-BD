"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { setReportStatus } from "./actions";

export function ModerationActions({ locale, id }: { locale: string; id: string }) {
  const t = useTranslations("admin");
  const [pending, startTransition] = useTransition();

  function set(status: "verified" | "rejected" | "resolved") {
    startTransition(() => setReportStatus(locale, id, status));
  }

  return (
    <div className="flex gap-2">
      <button disabled={pending} onClick={() => set("verified")} className="h-9 rounded-full bg-brand px-3 text-sm font-semibold text-brand-ink">
        {t("reports.verify")}
      </button>
      <button disabled={pending} onClick={() => set("rejected")} className="h-9 rounded-full border border-border bg-surface px-3 text-sm font-semibold">
        {t("reports.reject")}
      </button>
      <button disabled={pending} onClick={() => set("resolved")} className="h-9 rounded-full border border-border bg-surface px-3 text-sm font-semibold">
        {t("reports.resolve")}
      </button>
    </div>
  );
}
