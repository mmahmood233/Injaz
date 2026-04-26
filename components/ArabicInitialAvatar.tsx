interface ArabicInitialAvatarProps {
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZE_CLASSES: Record<string, { container: string; text: string }> = {
  xs: { container: "w-6 h-6", text: "text-[11px]" },
  sm: { container: "w-8 h-8", text: "text-sm" },
  md: { container: "w-10 h-10", text: "text-base" },
  lg: { container: "w-16 h-16", text: "text-2xl" },
  xl: { container: "w-28 h-28", text: "text-5xl" },
};

const GRADIENTS = [
  { from: "#0A4F8F", to: "#061428" },
  { from: "#C9A84C", to: "#7a5c1e" },
  { from: "#059669", to: "#065f46" },
  { from: "#7c3aed", to: "#4c1d95" },
  { from: "#dc2626", to: "#7f1d1d" },
  { from: "#0891b2", to: "#164e63" },
];

function hashName(name: string): number {
  let hash = 5381;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 33) ^ name.charCodeAt(i);
  }
  return Math.abs(hash);
}

export function ArabicInitialAvatar({
  name,
  size = "md",
  className = "",
}: ArabicInitialAvatarProps) {
  const { container, text } = SIZE_CLASSES[size];
  const hash = hashName(name);
  const gradient = GRADIENTS[hash % GRADIENTS.length];
  const initial = name.trim().charAt(0) || "؟";

  return (
    <div
      className={`${container} rounded-full flex items-center justify-center flex-shrink-0 ${className}`}
      style={{
        background: `linear-gradient(135deg, ${gradient.from} 0%, ${gradient.to} 100%)`,
      }}
      aria-label={name}
    >
      <span
        className={`${text} font-bold text-white select-none`}
        style={{ fontFamily: "Cairo, sans-serif", lineHeight: 1 }}
      >
        {initial}
      </span>
    </div>
  );
}
