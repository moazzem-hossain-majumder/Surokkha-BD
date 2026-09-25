// Layered delta landscape. Colors come from the active hazard scope (--h-accent).
export function Landscape({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 240" preserveAspectRatio="xMidYMax slice" aria-hidden="true" className={className}>
      <circle cx="620" cy="72" r="28" fill="var(--h-accent)" opacity="0.35" />
      <path className="landscape-layer" fill="var(--h-accent)" opacity="0.18" d="M0 120C120 80 240 150 400 110s280-40 400 0V240H0Z" />
      <path className="landscape-layer" fill="var(--h-accent)" opacity="0.3" d="M0 160c140-30 260 30 420-10s270-30 380 0V240H0Z" />
      <path className="landscape-layer" fill="var(--h-accent)" opacity="0.5" d="M0 200c160-25 280 25 440-5s260-25 360-5V240H0Z" />
    </svg>
  );
}
