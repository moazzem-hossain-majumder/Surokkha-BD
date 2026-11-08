export function Badge({ className = "", ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border border-border bg-surface-2 px-2.5 py-0.5 text-xs font-semibold text-ink-2 ${className}`}
      {...props}
    />
  );
}
