"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";
import { signOut } from "./actions";

export function SignOutButton({ locale }: { locale: string }) {
  const t = useTranslations("auth");
  const [pending, startTransition] = useTransition();
  return (
    <Button
      id="logout-button"
      data-testid="logout-button"
      variant="secondary"
      disabled={pending}
      onClick={() => startTransition(() => signOut(locale))}
    >
      {pending ? t("signingOut") : t("signOut")}
    </Button>
  );
}
