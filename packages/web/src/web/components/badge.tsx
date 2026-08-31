interface BadgeProps {
  size?: number;
  className?: string;
}

/** Circular enamel badge — double ring, arc lettering, pine + antler mark. */
export function EnamelBadge({ size = 132, className = "" }: BadgeProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      aria-label="Vânător — revizuire și ghid"
    >
      <defs>
        <path id="badge-arc-top" d="M 32 100 A 68 68 0 0 1 168 100" fill="none" />
        <path id="badge-arc-bottom" d="M 40 100 A 60 60 0 0 0 160 100" fill="none" />
        <radialGradient id="badge-fill" cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#2E3D22" />
          <stop offset="100%" stopColor="#16200E" />
        </radialGradient>
      </defs>

      <circle cx="100" cy="100" r="97" fill="url(#badge-fill)" />
      <circle cx="100" cy="100" r="97" fill="none" stroke="#C9A227" strokeWidth="2.5" />
      <circle cx="100" cy="100" r="87" fill="none" stroke="#7FAE55" strokeWidth="1" opacity="0.55" />

      <text
        fill="#C9A227"
        style={{
          fontFamily: '"Oswald", sans-serif',
          fontSize: 12,
          letterSpacing: "0.3em",
          fontWeight: 500,
        }}
      >
        <textPath href="#badge-arc-top" startOffset="50%" textAnchor="middle">
          EST. 2026
        </textPath>
      </text>

      {/* pine + antler mark */}
      <g stroke="#7FAE55" strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M100 46 L100 74" />
        <path d="M100 52 L90 44 M100 52 L110 44" />
        <path d="M92 46 L86 38 M108 46 L114 38" />
      </g>
      <path d="M100 78 L112 104 H88 Z" fill="#7FAE55" opacity="0.9" />
      <path d="M100 92 L118 122 H82 Z" fill="#7FAE55" opacity="0.75" />

      <text
        x="100"
        y="152"
        textAnchor="middle"
        fill="#F2EFE4"
        style={{
          fontFamily: '"Bitter", serif',
          fontSize: 25,
          fontWeight: 700,
          letterSpacing: "0.04em",
        }}
      >
        VÂNĂTOR
      </text>

      <text
        fill="#A9B79A"
        style={{
          fontFamily: '"Oswald", sans-serif',
          fontSize: 10.5,
          letterSpacing: "0.26em",
          fontWeight: 500,
        }}
      >
        <textPath href="#badge-arc-bottom" startOffset="50%" textAnchor="middle">
          REVIZUIRE · GHID · ARMURII
        </textPath>
      </text>
    </svg>
  );
}

/** Small mark used in the header / footer. */
export function BadgeMark({ size = 38, className = "" }: BadgeProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      className={className}
      aria-label="Vânător"
    >
      <circle cx="100" cy="100" r="95" fill="#212D18" stroke="#C9A227" strokeWidth="6" />
      <circle cx="100" cy="100" r="80" fill="none" stroke="#7FAE55" strokeWidth="3" opacity="0.6" />
      <g stroke="#7FAE55" strokeWidth="7" fill="none" strokeLinecap="round">
        <path d="M100 42 L100 72" />
        <path d="M100 50 L86 38 M100 50 L114 38" />
      </g>
      <path d="M100 76 L118 112 H82 Z" fill="#7FAE55" />
      <path d="M100 96 L126 146 H74 Z" fill="#7FAE55" opacity="0.8" />
    </svg>
  );
}
