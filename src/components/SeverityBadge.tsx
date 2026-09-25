import { useTranslations } from "next-intl";

const color = ["text-sev-0", "text-sev-1", "text-sev-2", "text-sev-3", "text-sev-4"] as const;
const edge = ["border-sev-0", "border-sev-1", "border-sev-2", "border-sev-3", "border-sev-4"] as const;

function Shape({ level }: { level: 0 | 1 | 2 | 3 | 4 }) {
  const oct = "8,3 16,3 21,8 21,16 16,21 8,21 3,16 3,8";
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
      {level === 0 && <circle cx="12" cy="12" r="8" fill="currentColor" />}
      {level === 1 && <path d="M12 4 21 20H3Z" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />}
      {level === 2 && <path d="M12 4 21 20H3Z" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />}
      {level === 3 && <polygon points={oct} fill="currentColor" />}
      {level === 4 && (
        <>
          <polygon points={oct} fill="none" stroke="currentColor" strokeWidth="2" />
          <polygon points="9,7 15,7 17,9 17,15 15,17 9,17 7,15 7,9" fill="currentColor" />
        </>
      )}
    </svg>
  );
}

// Severity is always shape + label + edge, never color alone.
export function SeverityBadge({ level }: { level: 0 | 1 | 2 | 3 | 4 }) {
  const t = useTranslations("severity");
  return (
    <div className={`flex items-center gap-3 rounded-card border border-l-[4px] border-border bg-surface px-4 py-3 ${edge[level]}`}>
      <span className={color[level]}><Shape level={level} /></span>
      <span className="font-semibold">{t(`levels.${level}`)}</span>
    </div>
  );
}
