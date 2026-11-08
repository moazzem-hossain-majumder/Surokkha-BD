"use client";

import { useLocale } from "next-intl";
import { useSyncExternalStore } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { bnPromptStore } from "@/lib/store";

const noopSubscribe = () => () => {};
const prefersBangla = () => navigator.languages?.some((l) => l.toLowerCase().startsWith("bn")) ?? false;

// Offers Bangla to visitors whose browser prefers it. Never switches on its own.
export function BanglaPrompt() {
  const locale = useLocale();
  const pathname = usePathname();
  const dismissed = useSyncExternalStore(bnPromptStore.subscribe, bnPromptStore.get, () => "1");
  const bn = useSyncExternalStore(noopSubscribe, prefersBangla, () => false);

  if (locale !== "en" || dismissed || !bn) return null;

  return (
    <div role="region" aria-label="Language" className="border-b border-border bg-brand-soft">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-3 px-5 py-2">
        <p lang="bn" className="text-sm font-medium">আপনি কি বাংলায় দেখতে চান?</p>
        <Link
          href={pathname}
          locale="bn"
          lang="bn"
          onClick={() => bnPromptStore.set("1")}
          className="inline-flex h-8 items-center rounded-md bg-brand px-3 text-xs font-semibold text-brand-ink transition-colors duration-150 hover:bg-brand/90"
        >
          বাংলায় দেখুন
        </Link>
        <button
          type="button"
          onClick={() => bnPromptStore.set("1")}
          className="inline-flex h-8 items-center rounded-md px-2.5 text-xs font-medium text-ink-2 hover:text-ink transition-colors duration-150"
        >
          Stay in English
        </button>
      </div>
    </div>
  );
}
