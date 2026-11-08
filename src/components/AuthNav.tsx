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
      className="flex h-9 items-center rounded-md px-3 text-sm font-medium text-ink-2 hover:bg-surface-2 hover:text-ink transition-colors duration-150"
    >
      {signedIn ? t("nav.account") : t("nav.login")}
    </Link>
  );
}
