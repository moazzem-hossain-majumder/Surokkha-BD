"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { applyToTask, type ApplyFormState } from "./actions";

const initialState: ApplyFormState = { error: null, success: false };

export function ApplyForm({ locale, taskId, hasProfile }: { locale: string; taskId: string; hasProfile: boolean }) {
  const t = useTranslations("volunteer");
  const [state, action, pending] = useActionState(applyToTask.bind(null, locale), initialState);

  if (state.success) return <p className="text-sm font-semibold text-brand">{t("applySuccess")}</p>;
  if (!hasProfile) return <p className="text-sm text-ink-2">{t("needProfileToApply")}</p>;

  return (
    <form action={action} className="mt-2 flex flex-wrap items-center gap-2">
      <input type="hidden" name="taskId" value={taskId} />
      <input
        name="note"
        placeholder={t("applyNotePlaceholder")}
        className="h-10 min-w-0 flex-1 rounded-input border border-border bg-surface px-3 text-sm"
      />
      <Button type="submit" size="md" disabled={pending}>
        {pending ? t("submitting") : t("apply")}
      </Button>
      {state.error && <p className="w-full text-sm text-sun">{state.error}</p>}
    </form>
  );
}
