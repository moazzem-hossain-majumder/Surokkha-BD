"use client";

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
}) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-full border border-border bg-surface p-1">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          type="button"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className="h-11 rounded-full px-4 text-sm font-semibold text-ink-2 transition-colors hover:text-ink aria-selected:bg-accent aria-selected:text-white"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
