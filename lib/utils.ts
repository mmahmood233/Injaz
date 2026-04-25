import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatArabicDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ar-BH", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatArabicDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("ar-BH", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function readingStatusAr(status: string): string {
  const map: Record<string, string> = {
    READ: "قرأه",
    READING: "يقرأه حالياً",
    WANT_TO_READ: "يرغب في قراءته",
  };
  return map[status] || status;
}

export function borrowingStatusAr(status: string): string {
  const map: Record<string, string> = {
    BORROWED: "مستعار",
    RETURNED: "تم الإرجاع",
    OVERDUE: "متأخر",
  };
  return map[status] || status;
}

export function eventStatusAr(status: string): string {
  const map: Record<string, string> = {
    UPCOMING: "قادمة",
    PAST: "منتهية",
  };
  return map[status] || status;
}

export function newsTypeAr(type: string): string {
  const map: Record<string, string> = {
    NEWS: "خبر",
    COVERAGE: "تغطية",
    ACHIEVEMENT: "إنجاز",
    FEATURED_MEMBER: "العضو المتميز",
  };
  return map[type] || type;
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}
