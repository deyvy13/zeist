import type { ReactNode } from "react";

// Aurora text: gradient mint text with a slow background-position animation.
// Inspired by magicui aurora-text. SSR-safe (pure CSS keyframes, no framer).
// Use for highlight words inside larger headlines.

export function AuroraText({
  children,
  className = "",
  as: Tag = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: "span" | "strong" | "em" | "h1" | "h2";
}) {
  return (
    <>
      <style>{`
        @keyframes zeist-aurora {
          0%   { background-position:   0% 50%; }
          50%  { background-position: 100% 50%; }
          100% { background-position:   0% 50%; }
        }
        .zeist-aurora-text {
          background: linear-gradient(
            110deg,
            var(--color-mint-500) 0%,
            #7cffe0 25%,
            var(--color-mint-600) 50%,
            #a6ffe6 75%,
            var(--color-mint-500) 100%
          );
          background-size: 300% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          animation: zeist-aurora 6s ease-in-out infinite;
        }
      `}</style>
      <Tag className={`zeist-aurora-text ${className}`}>{children}</Tag>
    </>
  );
}
