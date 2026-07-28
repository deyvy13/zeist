import type { HTMLAttributes } from "react";

type DotPatternProps = HTMLAttributes<SVGSVGElement> & {
  size?: number;
  radius?: number;
  fade?: boolean;
};

export function DotPattern({
  size = 16,
  radius = 1,
  fade = true,
  className = "",
  ...rest
}: DotPatternProps) {
  const id = `dot-pattern-${size}-${radius}`;
  return (
    <svg
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full text-[color:var(--color-mint-500)]/30 ${className}`}
      {...rest}
    >
      <defs>
        <pattern id={id} x="0" y="0" width={size} height={size} patternUnits="userSpaceOnUse">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="currentColor" />
        </pattern>
        {fade && (
          <radialGradient id={`${id}-mask`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="white" stopOpacity="1" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
        )}
        {fade && (
          <mask id={`${id}-mask-el`}>
            <rect width="100%" height="100%" fill={`url(#${id}-mask)`} />
          </mask>
        )}
      </defs>
      <rect
        width="100%"
        height="100%"
        fill={`url(#${id})`}
        mask={fade ? `url(#${id}-mask-el)` : undefined}
      />
    </svg>
  );
}
