import type { HTMLAttributes } from "react";

type GridPatternProps = HTMLAttributes<SVGSVGElement> & {
  size?: number;
  strokeDasharray?: string;
};

export function GridPattern({
  size = 40,
  strokeDasharray,
  className = "",
  ...rest
}: GridPatternProps) {
  const id = `grid-pattern-${size}`;
  return (
    <svg
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full text-[color:var(--color-mint-500)]/25 ${className}`}
      {...rest}
    >
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
        <radialGradient id={`${id}-fade`} cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="white" stopOpacity="1" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-mask`}>
          <rect width="100%" height="100%" fill={`url(#${id}-fade)`} />
        </mask>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} mask={`url(#${id}-mask)`} />
    </svg>
  );
}
