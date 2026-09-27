"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card } from "@/components/ui/Card";
import { HAZARD_SLUGS } from "@/lib/hazards";
import { getProgress, computeBadges, type Badge } from "@/lib/badges";

interface LoadedState {
  badges: Badge[];
  quizCount: number;
}

export function ProgressClient() {
  const t = useTranslations("progress");
  const locale = useLocale();
  const [loaded, setLoaded] = useState<LoadedState | null>(null);

  // Progress lives in localStorage, which doesn't exist during SSR, so this
  // reads it once after mount rather than during render (avoids a hydration
  // mismatch between the server's empty guess and the real client state).
  useEffect(() => {
    function load() {
      const p = getProgress();
      setLoaded({ badges: computeBadges(p, HAZARD_SLUGS.length), quizCount: p.quizzesCompleted.length });
    }
    load();
  }, []);

  if (!loaded) return null; // avoid a flash of empty state before the effect runs

  return (
    <div>
      <p className="text-ink-2">{t("quizzesCompleted", { count: loaded.quizCount, total: HAZARD_SLUGS.length })}</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {loaded.badges.map((b) => (
          <li key={b.id}>
            <Card className={`p-4 ${b.earned ? "" : "opacity-40"}`}>
              <p className="font-semibold">{locale === "bn" ? b.label_bn : b.label_en}</p>
              <p className="mt-1 text-xs text-ink-3">{b.earned ? t("earned") : t("notYetEarned")}</p>
            </Card>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-xs text-ink-3">{t("localNote")}</p>
    </div>
  );
}
