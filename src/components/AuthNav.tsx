"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export function AuthNav() {
  const t = useTranslations("header");
  const [signedIn, setSignedIn] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    async function init() {
      try {
        const supabase = createClient();
        const { data } = await supabase.auth.getUser();
        if (!cancelled) setSignedIn(Boolean(data.user));
        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
          setSignedIn(Boolean(session?.user));
        });
        unsubscribe = () => sub.subscription.unsubscribe();
      } catch {
        if (!cancelled) setSignedIn(false);
      }
    }

    init();
    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  if (signedIn === null) return <span className="inline-block h-10 w-16" aria-hidden="true" />;

  return (
    <Link
      href={signedIn ? "/account" : "/login"}
      className="flex h-10 items-center rounded-full px-3.5 text-sm font-semibold text-ink-2 hover:bg-surface-2 hover:text-ink"
    >
      {signedIn ? t("nav.account") : t("nav.login")}
    </Link>
  );
}
