"use client";

import { useActionState, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { signInWithMagicLink, signInWithPassword, type AuthFormState } from "./actions";

const initialState: AuthFormState = { error: null, info: null };

export function LoginForm({ locale }: { locale: string }) {
  const t = useTranslations("auth");
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [passwordState, passwordAction, passwordPending] = useActionState(
    signInWithPassword.bind(null, locale),
    initialState
  );
  const [magicState, magicAction, magicPending] = useActionState(signInWithMagicLink.bind(null, locale), initialState);

  const state = mode === "password" ? passwordState : magicState;

  return (
    <div className="space-y-5">
      <div role="tablist" aria-label={t("modeLabel")} className="inline-flex rounded-full border border-border bg-surface p-1">
        <button
          type="button"
          role="tab"
          aria-selected={mode === "password"}
          onClick={() => setMode("password")}
          className="h-10 rounded-full px-4 text-sm font-semibold text-ink-2 aria-selected:bg-brand aria-selected:text-brand-ink"
        >
          {t("passwordTab")}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === "magic"}
          onClick={() => setMode("magic")}
          className="h-10 rounded-full px-4 text-sm font-semibold text-ink-2 aria-selected:bg-brand aria-selected:text-brand-ink"
        >
          {t("magicTab")}
        </button>
      </div>

      {mode === "password" ? (
        <form action={passwordAction} className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold">{t("email")}</span>
            <input name="email" type="email" required autoComplete="email" className="mt-1 h-12 w-full rounded-input border border-border bg-surface px-3" />
          </label>
          <label className="block">
            <span className="text-sm font-semibold">{t("password")}</span>
            <input name="password" type="password" required autoComplete="current-password" className="mt-1 h-12 w-full rounded-input border border-border bg-surface px-3" />
          </label>
          <Button type="submit" disabled={passwordPending} className="w-full">
            {passwordPending ? t("signingIn") : t("signIn")}
          </Button>
        </form>
      ) : (
        <form action={magicAction} className="space-y-4">
          <label className="block">
            <span className="text-sm font-semibold">{t("email")}</span>
            <input name="email" type="email" required autoComplete="email" className="mt-1 h-12 w-full rounded-input border border-border bg-surface px-3" />
          </label>
          <Button type="submit" disabled={magicPending} className="w-full">
            {magicPending ? t("sending") : t("sendMagicLink")}
          </Button>
        </form>
      )}

      {state.error && <p className="text-sm text-sun">{t(`errors.${state.error}`)}</p>}
      {state.info && <p className="text-sm text-brand">{t(`info.${state.info}`)}</p>}
    </div>
  );
}
