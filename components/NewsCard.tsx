import Link from "next/link";
import Image from "next/image";
import { Newspaper, Award, Star, Megaphone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatArabicDate, newsTypeAr, truncate } from "@/lib/utils";

interface NewsCardProps {
  id: string;
  title: string;
  content: string;
  coverImageUrl?: string | null;
  type: string;
  publishedAt?: Date | string | null;
}

const typeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  NEWS: Newspaper,
  COVERAGE: Megaphone,
  ACHIEVEMENT: Award,
  FEATURED_MEMBER: Star,
};

const typeColors: Record<string, string> = {
  NEWS: "bg-blue-100 text-blue-800",
  COVERAGE: "bg-purple-100 text-purple-800",
  ACHIEVEMENT: "bg-green-100 text-green-800",
  FEATURED_MEMBER: "bg-amber-100 text-amber-800",
};

export function NewsCard({ id, title, content, coverImageUrl, type, publishedAt }: NewsCardProps) {
  const Icon = typeIcons[type] || Newspaper;
  const colorClass = typeColors[type] || "bg-gray-100 text-gray-800";

  return (
    <Card className="group card-hover border-border/60 overflow-hidden h-full flex flex-col">
      {/* Image */}
      {coverImageUrl && (
        <div className="relative h-44 overflow-hidden bg-injaz-blue/5">
          <Image
            src={coverImageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      )}
      {!coverImageUrl && (
        <div className="h-44 bg-gradient-to-br from-injaz-blue/5 to-injaz-blue/15 flex items-center justify-center">
          <Icon className="w-12 h-12 text-injaz-blue/20" />
        </div>
      )}

      <CardContent className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${colorClass}`}>
            <Icon className="w-3 h-3" />
            {newsTypeAr(type)}
          </span>
          {publishedAt && (
            <span className="text-xs text-muted-foreground">{formatArabicDate(publishedAt)}</span>
          )}
        </div>

        <h3 className="font-bold text-injaz-navy leading-snug mb-2 line-clamp-2" style={{ fontFamily: "Cairo, sans-serif" }}>
          {title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {truncate(content, 140)}
        </p>
      </CardContent>
    </Card>
  );
}
