interface BarDatum {
  label: string;
  value: number;
  displayValue?: string;
}

// A small hand-rolled chart (no charting library added this phase -- see
// memory.md) that always ships with a real <table> of the same numbers, per
// P5-3 (chart accessibility). The table is inside a <details> so sighted
// users aren't forced to scroll past it, but it's real DOM content, not
// hidden from assistive tech.
export function BarChart({
  data,
  valueLabel,
  summary,
  tableCaption,
}: {
  data: BarDatum[];
  valueLabel: string;
  summary: string;
  tableCaption: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <div>
      <p className="sr-only">{summary}</p>
      <ul className="space-y-2" aria-hidden="true">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-3">
            <span className="w-32 shrink-0 truncate text-sm text-ink-2">{d.label}</span>
            <span className="h-4 flex-1 overflow-hidden rounded-full bg-surface-2">
              <span
                className="block h-full rounded-full bg-brand"
                style={{ width: `${Math.max(2, (d.value / max) * 100)}%` }}
              />
            </span>
            <span className="w-20 shrink-0 text-right text-sm font-semibold">{d.displayValue ?? d.value.toLocaleString()}</span>
          </li>
        ))}
      </ul>

      <details className="mt-3">
        <summary className="cursor-pointer text-sm font-semibold text-ink-2">View as table</summary>
        <table className="mt-2 w-full text-left text-sm">
          <caption className="sr-only">{tableCaption}</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-1 pr-2">
                Category
              </th>
              <th scope="col" className="py-1">
                {valueLabel}
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.label} className="border-b border-border/50">
                <td className="py-1 pr-2">{d.label}</td>
                <td className="py-1">{d.displayValue ?? d.value.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </div>
  );
}
