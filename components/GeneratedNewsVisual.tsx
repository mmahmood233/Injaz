import { Newspaper, Camera, Award, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface NewsVisualConfig {
  Icon: LucideIcon;
  gradient: string;
  label: string;
}

interface GeneratedNewsVisualProps {
  type: string;
  title?: string;
  className?: string;
}

const CONFIGS: Record<string, NewsVisualConfig> = {
  NEWS: {
    Icon: Newspaper,
    gradient: "from-[#1e3a8a] to-[#2563eb]",
    label: "خبر",
  },
  COVERAGE: {
    Icon: Camera,
    gradient: "from-[#4c1d95] to-[#7c3aed]",
    label: "تغطية",
  },
  ACHIEVEMENT: {
    Icon: Award,
    gradient: "from-[#065f46] to-[#C9A84C]",
    label: "إنجاز",
  },
  FEATURED_MEMBER: {
    Icon: Star,
    gradient: "from-[#0A2447] to-[#C9A84C]",
    label: "العضو المتميز",
  },
};

const DEFAULT_CONFIG: NewsVisualConfig = {
  Icon: Newspaper,
  gradient: "from-[#1e3a8a] to-[#2563eb]",
  label: "خبر",
};

export function GeneratedNewsVisual({ type, className = "" }: GeneratedNewsVisualProps) {
  const config = CONFIGS[type] ?? DEFAULT_CONFIG;
  const { Icon, gradient, label } = config;
  const isFeaturedMember = type === "FEATURED_MEMBER";

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${gradient} ${className}`}
    >
      {/* Dot grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.06,
          backgroundImage:
            "radial-gradient(circle, white 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />

      {/* Outer concentric ring */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="rounded-full border border-white/10"
          style={{ width: "80%", aspectRatio: "1" }}
        />
      </div>

      {/* Inner concentric ring */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="rounded-full border border-white/10"
          style={{ width: "55%", aspectRatio: "1" }}
        />
      </div>

      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.08) 0%, transparent 65%)",
        }}
      />

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
        {isFeaturedMember && (
          /* Circular initials placeholder for FEATURED_MEMBER */
          <div className="w-10 h-10 rounded-full bg-white/20 border border-white/30 flex items-center justify-center mb-1">
            <span
              className="text-white text-sm font-bold"
              style={{ fontFamily: "Cairo, sans-serif" }}
            >
              ع
            </span>
          </div>
        )}

        <div className="bg-white/15 rounded-full p-3">
          <Icon className="w-8 h-8 text-white" />
        </div>

        {/* Type label */}
        <span
          className="text-[10px] font-semibold text-white/70 tracking-wide px-2 py-0.5 rounded-full"
          style={{
            background: "rgba(255,255,255,0.1)",
            fontFamily: "Cairo, sans-serif",
          }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
