"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { resolveHelpRequest } from "./actions";

export function HelpRequestControls({ locale, id }: { locale: string; id: string }) {
  const t = useTranslations("admin");
  const [reply, setReply] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      <input
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder={t("ferries.replyPlaceholder")}
        className="h-9 min-w-0 flex-1 rounded-input border border-border bg-surface px-3 text-sm"
      />
      <button
        type="button"
        disabled={pending || reply.trim().length === 0}
        onClick={() => startTransition(() => resolveHelpRequest(locale, id, reply.trim(), "answered"))}
        className="h-9 rounded-full border border-border bg-surface px-3 text-xs font-semibold hover:bg-surface-2 disabled:opacity-50"
      >
        {t("ferries.markAnswered")}
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => resolveHelpRequest(locale, id, reply.trim(), "closed"))}
        className="h-9 rounded-full border border-border bg-surface px-3 text-xs font-semibold text-sun hover:bg-surface-2 disabled:opacity-50"
      >
        {t("ferries.close")}
      </button>
    </div>
  );
}
