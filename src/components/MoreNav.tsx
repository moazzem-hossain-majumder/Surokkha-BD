"use client";

import { Link, usePathname } from "@/i18n/navigation";

// "More" dropdown for the less-used pages, so the main header row stays on one line.
// `key={pathname}` remounts the <details> on navigation, which closes it.
export function MoreNav({ label, items }: { label: string; items: { href: string; label: string }[] }) {
  const pathname = usePathname();
  return (
    <details key={pathname} className="group relative">
      <summary className="flex min-h-11 cursor-pointer list-none items-center gap-1 whitespace-nowrap rounded-full px-3 text-sm font-semibold text-ink-2 hover:bg-surface-2 hover:text-ink [&::-webkit-details-marker]:hidden">
        {label}
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="transition-transform group-open:rotate-180">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </summary>
      <div className="absolute right-0 top-full z-50 mt-1 min-w-44 rounded-card border border-border bg-surface p-1 shadow-lg">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-11 items-center whitespace-nowrap rounded-lg px-3 text-sm font-semibold text-ink-2 hover:bg-surface-2 hover:text-ink"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </details>
  );
}
