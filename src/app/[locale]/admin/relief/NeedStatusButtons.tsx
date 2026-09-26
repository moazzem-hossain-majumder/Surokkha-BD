"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { closeNeed } from "./actions";

export function NeedStatusButtons({ locale, id }: { locale: string; id: string }) {
  const t = useTranslations("admin");
  const [pending, startTransition] = useTransition();
  return (
    <div className="flex gap-2">
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => closeNeed(locale, id, "fulfilled"))}
        className="h-9 rounded-full border border-border bg-surface px-3 text-xs font-semibold hover:bg-surface-2 disabled:opacity-50"
      >
        {t("relief.markFulfilled")}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => closeNeed(locale, id, "closed"))}
        className="h-9 rounded-full border border-border bg-surface px-3 text-xs font-semibold text-sun hover:bg-surface-2 disabled:opacity-50"
      >
        {t("relief.close")}
      </button>
    </div>
  );
}
