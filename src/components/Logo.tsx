import React from "react";

interface LogoProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "icon";
  variant?: "full" | "icon" | "wordmark";
  className?: string;
  showText?: boolean;
  textColor?: string;
}

const SIZE_MAP: Record<string, { container: string; text: string; iconSize: number }> = {
  xs: { container: "w-6 h-6", text: "text-xs", iconSize: 16 },
  sm: { container: "w-8 h-8", text: "text-sm", iconSize: 20 },
  md: { container: "w-10 h-10", text: "text-base", iconSize: 24 },
  lg: { container: "w-12 h-12", text: "text-lg", iconSize: 28 },
  xl: { container: "w-16 h-16", text: "text-2xl", iconSize: 36 },
  icon: { container: "w-10 h-10", text: "text-base", iconSize: 24 },
};

export const Logo: React.FC<LogoProps> = ({
  size = "md",
  variant = "full",
  className = "",
  showText = true,
  textColor = "text-slate-900 dark:text-white",
}) => {
  const s = SIZE_MAP[size] || SIZE_MAP.md;

  const SvgIcon: React.FC<{ iconOnly?: boolean }> = ({ iconOnly = false }) => (
    <svg
      width={s.iconSize}
      height={s.iconSize}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <defs>
        <linearGradient id={`logoGrad-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="55%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#14b8a8" />
        </linearGradient>
        <linearGradient id={`logoGradAlt-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ef4444" />
        </linearGradient>
      </defs>

      {!iconOnly && (
        <path
          d="M6 36 L42 36 L42 38 C42 39.1 41.1 40 40 40 L8 40 C6.9 40 6 39.1 6 38 L6 36 Z"
          fill={`url(#logoGradAlt-${size})`}
          opacity="0.25"
        />
      )}

      <path
        d="M11 20 L37 20 C38.1 20 39 19.1 39 18 L39 11 C39 9.9 38.1 9 37 9 L11 C9.9 9 9 9.9 9 11 L9 18 C9 19.1 9.9 20 11 20 Z"
        fill={`url(#logoGrad-${size})`}
        stroke="white"
        strokeWidth="1.5"
      />

      <path
        d="M10 18 L10 30 M38 18 L38 30 M14 24 L7 24 M33 24 L40 24"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {!iconOnly && (
        <>
          <path
            d="M14 28 L14 34 C14 34.55 13.55 35 13 35 C12.45 35 12 34.55 12 34 L12 28 C12 27.45 12.45 27 13 27 C13.55 27 14 27.45 14 28 Z"
            fill="white"
            opacity="0.6"
          />
          <path
            d="M13 28 L13 31"
            stroke="#1e293b"
            strokeWidth="1"
            strokeLinecap="round"
          />
          <path
            d="M34 28 L34 34 C34 34.55 33.55 35 33 35 C32.45 35 32 34.55 32 34 L32 28 C32 27.45 32.45 27 33 27 C33.55 27 34 27.45 34 28 Z"
            fill="white"
            opacity="0.6"
          />
          <path
            d="M33 28 L33 31"
            stroke="#1e293b"
            strokeWidth="1"
            strokeLinecap="round"
          />
        </>
      )}

      <circle
        cx="19"
        cy="17"
        r="5"
        fill={`url(#logoGradAlt-${size})`}
        opacity="0.8"
      />
      <path
        d="M19 14 L19 20 M16 17 L22 17"
        stroke="#fbbf24"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M28 13.5 C28.28 13.5 28.5 13.22 28.5 12.94 C28.5 12.66 28.28 12.38 28 12.38 C27.72 12.38 27.5 12.66 27.5 12.94 C27.5 13.22 27.72 13.5 28 13.5 Z"
        fill="white"
        opacity="0.85"
      />

      <path
        d="M34 14.5 C34.28 14.5 34.5 14.22 34.5 13.94 C34.5 13.66 34.28 13.38 34 13.38 C33.72 13.38 33.5 13.66 33.5 13.94 C33.5 14.22 33.72 14.5 34 14.5 Z"
        fill="white"
        opacity="0.7"
      />

      <circle cx="37" cy="17" r="2.5" fill="#fbbf24" opacity="0.9" />
    </svg>
  );

  const iconOnly = variant === "icon";

  if (iconOnly) {
    return (
      <div className={`${s.container} flex items-center justify-center ${className}`}>
        <SvgIcon iconOnly={true} />
      </div>
    );
  }

  if (variant === "wordmark") {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <SvgIcon iconOnly />
        {showText && (
          <span className={`font-extrabold tracking-tight ${textColor}`}>
            LIVINGSTONE<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
              EDU
            </span>
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <SvgIcon />
      {showText && (
        <span className={`font-extrabold tracking-tight ${textColor} ${s.text}`}>
          LIVINGSTONE<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-300 bg-clip-text text-transparent">
            EDU
          </span>
        </span>
      )}
    </div>
  );
};

export default Logo;
