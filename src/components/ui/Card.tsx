export function Card({ className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`rounded-card border border-border bg-surface ${className}`} {...props} />;
}
