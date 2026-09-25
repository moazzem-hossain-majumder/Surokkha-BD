"use client";

import { useActionState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import type { AuthFormState } from "../login/actions";
import { signUp } from "./actions";

const initialState: AuthFormState = { error: null, info: null };

export function SignupForm({ locale }: { locale: string }) {
  const t = useTranslations("auth");
  const [state, action, pending] = useActionState(signUp.bind(null, locale), initialState);

  if (state.info === "checkEmail") {
    return <p className="text-brand">{t("info.checkEmail")}</p>;
  }

  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="text-sm font-semibold">{t("displayName")}</span>
        <input name="displayName" type="text" autoComplete="name" className="mt-1 h-12 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("email")}</span>
        <input name="email" type="email" required autoComplete="email" className="mt-1 h-12 w-full rounded-input border border-border bg-surface px-3" />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">{t("password")}</span>
        <input name="password" type="password" required minLength={8} autoComplete="new-password" className="mt-1 h-12 w-full rounded-input border border-border bg-surface px-3" />
        <span className="mt-1 block text-xs text-ink-3">{t("passwordHint")}</span>
      </label>
      <Button type="submit" disabled={pending} className="w-full">
        {pending ? t("signingUp") : t("createAccount")}
      </Button>
      {state.error && <p className="text-sm text-sun">{t(`errors.${state.error}`)}</p>}
    </form>
  );
}
