"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { deleteAccount, type DeleteAccountState } from "./actions";

const initialState: DeleteAccountState = { error: null };

export function DeleteAccountForm({ locale }: { locale: string }) {
  const t = useTranslations("auth");
  const [open, setOpen] = useState(false);
  const [state, action, pending] = useActionState(deleteAccount.bind(null, locale), initialState);

  if (!open) {
    return (
      <button type="button" onClick={() => setOpen(true)} className="text-sm font-semibold text-sun underline">
        {t("deleteAccount")}
      </button>
    );
  }

  return (
    <form action={action} className="rounded-input border border-sun/40 bg-sun/5 p-4">
      <p className="text-sm font-semibold text-sun">{t("deleteAccountWarning")}</p>
      <p className="mt-1 text-xs text-ink-2">{t("deleteAccountNote")}</p>
      <label className="mt-3 block">
        <span className="text-sm">{t("deleteAccountConfirmLabel")}</span>
        <input name="confirm" required className="mt-1 h-10 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <div className="mt-3 flex gap-3">
        <button type="submit" disabled={pending} className="h-10 rounded-full bg-sun px-4 text-sm font-semibold text-white disabled:opacity-50">
          {pending ? t("saving") : t("deleteAccountConfirm")}
        </button>
        <button type="button" onClick={() => setOpen(false)} className="h-10 rounded-full border border-border bg-surface px-4 text-sm font-semibold">
          {t("cancel")}
        </button>
      </div>
      {state.error && <p className="mt-2 text-sm text-sun">{state.error}</p>}
    </form>
  );
}
