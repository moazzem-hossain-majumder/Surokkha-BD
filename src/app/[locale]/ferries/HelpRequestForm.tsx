"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { submitFerryHelpRequest, type HelpRequestFormState } from "./actions";

const initialState: HelpRequestFormState = { error: null, success: false };

export function HelpRequestForm({ locale }: { locale: string }) {
  const t = useTranslations("ferries");
  const [state, action, pending] = useActionState(submitFerryHelpRequest.bind(null, locale), initialState);

  if (state.success) {
    return <p className="text-sm font-semibold text-brand">{t("requestSuccess")}</p>;
  }

  return (
    <form action={action} className="grid gap-4">
      <label className="block">
        <span className="text-sm font-semibold">{t("route")}</span>
        <input name="route" required placeholder={t("routePlaceholder")} className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("message")}</span>
        <textarea name="message" required rows={3} placeholder={t("messagePlaceholder")} className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("contactOptional")}</span>
        <input name="contactOptional" className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <div>
        <Button type="submit" disabled={pending}>
          {pending ? t("submitting") : t("submitRequest")}
        </Button>
        {state.error && <p className="mt-2 text-sm text-sun">{state.error}</p>}
      </div>
    </form>
  );
}
