"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import type { PledgeStatus } from "@/lib/relief";
import { updatePledgeStatus } from "./actions";

const NEXT_STATUS: Partial<Record<PledgeStatus, PledgeStatus>> = {
  pledged: "in_transit",
  in_transit: "delivered",
};

export function PledgeControls({ locale, pledgeId, status }: { locale: string; pledgeId: string; status: PledgeStatus }) {
  const t = useTranslations("admin");
  const [pending, startTransition] = useTransition();
  const next = NEXT_STATUS[status];

  if (status === "delivered" || status === "cancelled") return null;

  return (
    <div className="flex gap-2">
      {next && (
        <button
          type="button"
          disabled={pending}
          onClick={() => startTransition(() => updatePledgeStatus(locale, pledgeId, next))}
          className="h-9 rounded-full border border-border bg-surface px-3 text-xs font-semibold hover:bg-surface-2 disabled:opacity-50"
        >
          {t(`relief.pledgeStatus.advanceTo.${next}`)}
        </button>
      )}
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => updatePledgeStatus(locale, pledgeId, "cancelled"))}
        className="h-9 rounded-full border border-border bg-surface px-3 text-xs font-semibold text-sun hover:bg-surface-2 disabled:opacity-50"
      >
        {t("relief.pledgeStatus.cancel")}
      </button>
    </div>
  );
}
