"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { HANDOVER_METHODS, HANDOVER_METHOD_LABELS } from "@/lib/relief";
import { Button } from "@/components/ui/Button";
import { createPledge, type PledgeFormState } from "../actions";

const initialState: PledgeFormState = { error: null, success: false };

export function PledgeForm({ locale, needId, signedIn }: { locale: string; needId: string; signedIn: boolean }) {
  const t = useTranslations("relief");
  const [state, action, pending] = useActionState(createPledge.bind(null, locale), initialState);

  if (!signedIn) {
    return <p className="text-sm text-ink-2">{t("signInToPledge")}</p>;
  }

  if (state.success) {
    return <p className="text-sm font-semibold text-brand">{t("pledgeSuccess")}</p>;
  }

  return (
    <form action={action} className="grid gap-4 sm:grid-cols-2">
      <input type="hidden" name="needId" value={needId} />
      <label className="block">
        <span className="text-sm font-semibold">{t("pledgeQty")}</span>
        <input name="qty" type="number" min={1} step="any" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("handoverMethod")}</span>
        <select name="handoverMethod" required className="mt-1 h-11 w-full rounded-input border border-border bg-surface px-3">
          {HANDOVER_METHODS.map((m) => (
            <option key={m} value={m}>
              {locale === "bn" ? HANDOVER_METHOD_LABELS[m].bn : HANDOVER_METHOD_LABELS[m].en}
            </option>
          ))}
        </select>
      </label>
      <label className="block sm:col-span-2">
        <span className="text-sm font-semibold">{t("pledgeNote")}</span>
        <textarea name="note" rows={2} className="mt-1 w-full rounded-input border border-border bg-surface px-3 py-2" />
      </label>
      <div className="sm:col-span-2">
        <Button type="submit" disabled={pending}>
          {pending ? t("submitting") : t("pledgeSubmit")}
        </Button>
        {state.error && <p className="mt-2 text-sm text-sun">{state.error}</p>}
      </div>
    </form>
  );
}
