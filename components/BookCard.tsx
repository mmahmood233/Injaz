import Link from "next/link";
import Image from "next/image";
import { BookOpen, ExternalLink, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { truncate } from "@/lib/utils";

interface BookCardProps {
  id: string;
  titleAr: string;
  author: string;
  description?: string | null;
  coverUrl?: string | null;
  categoryNameAr?: string | null;
  canReadOnline?: boolean;
  previewUrl?: string | null;
  legalReadUrl?: string | null;
}

export function BookCard({
  id,
  titleAr,
  author,
  description,
  coverUrl,
  categoryNameAr,
  canReadOnline,
  previewUrl,
  legalReadUrl,
}: BookCardProps) {
  return (
    <Card className="group card-hover overflow-hidden border-border/60 h-full flex flex-col">
      {/* Cover */}
      <div className="relative h-56 bg-gray-50 overflow-hidden flex items-center justify-center">
        {coverUrl ? (
          <Image
            src={coverUrl}
            alt={titleAr}
            fill
            className="object-contain group-hover:scale-105 transition-transform duration-300 p-1"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 w-full h-full bg-gradient-to-br from-injaz-blue/5 to-injaz-blue/15">
            <BookOpen className="w-12 h-12 text-injaz-blue/30" />
            <p className="text-xs text-injaz-blue/40 text-center px-4 font-medium">{titleAr}</p>
          </div>
        )}
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1 z-10">
          {canReadOnline && (
            <Badge variant="default" className="text-xs bg-green-600 border-0 shadow-sm">
              متاح للقراءة
            </Badge>
          )}
          {!canReadOnline && previewUrl && (
            <Badge variant="secondary" className="text-xs shadow-sm">
              معاينة
            </Badge>
          )}
        </div>
      </div>

      <CardContent className="p-4 flex flex-col flex-1">
        {categoryNameAr && (
          <Badge variant="outline" className="w-fit mb-2 text-xs text-injaz-blue border-injaz-blue/30">
            {categoryNameAr}
          </Badge>
        )}
        <h3 className="font-bold text-injaz-navy text-base leading-snug mb-1 line-clamp-2" style={{ fontFamily: "Cairo, sans-serif" }}>
          {titleAr}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">{author}</p>
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3 flex-1">
            {truncate(description, 120)}
          </p>
        )}

        <div className="flex flex-col gap-2 mt-auto">
          <Button asChild variant="outline" size="sm" className="border-injaz-blue/30 text-injaz-blue hover:bg-injaz-blue hover:text-white w-full">
            <Link href={`/books/${id}`}>
              <Eye className="w-4 h-4 ml-1" />
              عرض التفاصيل
            </Link>
          </Button>
          {canReadOnline && legalReadUrl && (
            <Button asChild size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white border-0">
              <a href={legalReadUrl} target="_blank" rel="noopener noreferrer">
                <BookOpen className="w-4 h-4 ml-1" />
                قراءة إلكترونية
                <ExternalLink className="w-3 h-3 mr-1" />
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
