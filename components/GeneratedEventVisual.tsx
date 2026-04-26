import {
  MessageCircle,
  BookOpen,
  Pencil,
  Award,
  CalendarDays,
  Users,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface EventVisualConfig {
  Icon: LucideIcon;
  gradient: string;
  ring: string;
}

interface GeneratedEventVisualProps {
  title: string;
  className?: string;
}

const CONFIGS: Array<EventVisualConfig & { keywords: string[] }> = [
  {
    keywords: ["نقاش", "حوار", "مناقشة"],
    Icon: MessageCircle,
    gradient: "from-[#1e3a8a] to-[#3730a3]",
    ring: "rgba(99,102,241,0.25)",
  },
  {
    keywords: ["قرائية", "قراءة", "كتاب", "أدبية"],
    Icon: BookOpen,
    gradient: "from-[#0A2447] to-[#0A4F8F]",
    ring: "rgba(201,168,76,0.25)",
  },
  {
    keywords: ["ورشة", "تدريب"],
    Icon: Pencil,
    gradient: "from-[#065f46] to-[#047857]",
    ring: "rgba(167,243,208,0.2)",
  },
  {
    keywords: ["تكريم", "جائزة", "تقدير", "مميز"],
    Icon: Award,
    gradient: "from-[#78350f] to-[#C9A84C]",
    ring: "rgba(253,230,138,0.25)",
  },
  {
    keywords: ["أربعاء", "أسبوعي"],
    Icon: CalendarDays,
    gradient: "from-[#0A4F8F] to-[#1d4ed8]",
    ring: "rgba(201,168,76,0.2)",
  },
  {
    keywords: ["اجتماع", "ملتقى", "لقاء"],
    Icon: Users,
    gradient: "from-[#164e63] to-[#0891b2]",
    ring: "rgba(186,230,253,0.2)",
  },
];

const DEFAULT_CONFIG: EventVisualConfig = {
  Icon: Star,
  gradient: "from-[#0A2447] to-[#0A4F8F]",
  ring: "rgba(201,168,76,0.2)",
};

export function GeneratedEventVisual({ title, className = "" }: GeneratedEventVisualProps) {
  const config =
    CONFIGS.find((c) => c.keywords.some((kw) => title.includes(kw))) ?? DEFAULT_CONFIG;

  const { Icon, gradient, ring } = config;

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

      {/* Radial glow at center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${ring} 0%, transparent 65%)`,
        }}
      />

      {/* Center icon */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-white/15 rounded-full p-4">
          <Icon className="w-10 h-10 text-white" />
        </div>
      </div>
    </div>
  );
}
