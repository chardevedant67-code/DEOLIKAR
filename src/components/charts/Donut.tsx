interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutProps {
  segments: DonutSegment[];
  size?: number;
  stroke?: number;
  trackColor?: string;
  children?: React.ReactNode;
}

/** Minimal donut — segments animate smoothly as the values change. Decorative; values are also shown as text. */
export function Donut({ segments, size = 160, stroke = 20, trackColor = "rgba(255,255,255,0.08)", children }: DonutProps) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = segments.reduce((sum, s) => sum + Math.max(s.value, 0), 0) || 1;
  const gap = segments.length > 1 ? 3 : 0;

  const lengths = segments.map((segment) => (Math.max(segment.value, 0) / total) * circumference);
  const arcs = segments.map((segment, i) => ({
    ...segment,
    length: Math.max(lengths[i] - gap, 0),
    offset: lengths.slice(0, i).reduce((sum, l) => sum + l, 0),
  }));

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} aria-hidden="true">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={trackColor} strokeWidth={stroke} />
        {arcs.map((arc) => (
          <circle
            key={arc.label}
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={arc.color}
            strokeWidth={stroke}
            strokeLinecap="butt"
            strokeDasharray={`${arc.length} ${circumference - arc.length}`}
            strokeDashoffset={-arc.offset}
            style={{ transition: "stroke-dasharray 0.7s cubic-bezier(0.22,1,0.36,1), stroke-dashoffset 0.7s cubic-bezier(0.22,1,0.36,1)" }}
          />
        ))}
      </svg>
      {children ? <div className="absolute inset-0 flex flex-col items-center justify-center text-center">{children}</div> : null}
    </div>
  );
}
