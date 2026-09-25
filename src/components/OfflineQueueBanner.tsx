"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { flushQueue, getQueueLength } from "@/lib/offlineQueue";

async function submit(payload: Record<string, unknown>): Promise<boolean> {
  const res = await fetch("/api/reports", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return res.ok;
}

// Shows a small banner when reports are waiting to be sent (submitted while
// offline), and retries automatically once the browser comes back online.
export function OfflineQueueBanner() {
  const t = useTranslations("offlineQueue");
  const [count, setCount] = useState(0);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    async function trySync() {
      setCount(getQueueLength());
      if (getQueueLength() === 0) return;
      setSyncing(true);
      await flushQueue(submit);
      setCount(getQueueLength());
      setSyncing(false);
    }
    trySync();
    window.addEventListener("online", trySync);
    return () => window.removeEventListener("online", trySync);
  }, []);

  if (count === 0) return null;

  return (
    <div role="status" className="border-b border-border bg-brand-soft px-5 py-2 text-center text-sm">
      {syncing ? t("syncing") : t("waiting", { count })}
    </div>
  );
}
