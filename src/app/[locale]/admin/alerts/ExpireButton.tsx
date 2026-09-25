"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { expireAlert } from "./actions";

export function ExpireButton({ locale, id }: { locale: string; id: string }) {
  const t = useTranslations("admin");
  const [pending, startTransition] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => expireAlert(locale, id))}
      className="text-sm font-semibold text-sun underline"
    >
      {pending ? t("saving") : t("alerts.expireNow")}
    </button>
  );
}
