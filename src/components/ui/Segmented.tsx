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
    <div role="tablist" aria-label={label} className="inline-flex flex-wrap gap-1 rounded-md border border-border bg-surface p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          type="button"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className="h-8 rounded-sm px-3 text-xs font-semibold text-ink-2 transition-colors duration-150 hover:text-ink aria-selected:bg-brand aria-selected:text-brand-ink"
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
