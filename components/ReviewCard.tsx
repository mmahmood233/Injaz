import Link from "next/link";
import Image from "next/image";
import { Star, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatArabicDate } from "@/lib/utils";

interface ReviewCardProps {
  id: string;
  bookId: string;
  bookTitleAr: string;
  bookCoverUrl?: string | null;
  memberName: string;
  memberAvatarUrl?: string | null;
  rating?: number | null;
  reviewText: string;
  createdAt: Date | string;
}

export function ReviewCard({
  bookId,
  bookTitleAr,
  bookCoverUrl,
  memberName,
  memberAvatarUrl,
  rating,
  reviewText,
  createdAt,
}: ReviewCardProps) {
  return (
    <Card className="card-hover border-border/60">
      <CardContent className="p-5">
        <div className="flex gap-4">
          {/* Book Cover */}
          <Link href={`/books/${bookId}`} className="flex-shrink-0">
            <div className="relative w-14 h-20 rounded-md overflow-hidden bg-gray-50">
              {bookCoverUrl ? (
                <Image src={bookCoverUrl} alt={bookTitleAr} fill className="object-contain" sizes="56px" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Star className="w-5 h-5 text-injaz-blue/30" />
                </div>
              )}
            </div>
          </Link>

          <div className="flex-1 min-w-0">
            <Link href={`/books/${bookId}`} className="hover:text-injaz-blue transition-colors">
              <h4 className="font-bold text-injaz-navy text-sm mb-1 line-clamp-1" style={{ fontFamily: "Cairo, sans-serif" }}>
                {bookTitleAr}
              </h4>
            </Link>

            {/* Rating */}
            {rating && (
              <div className="flex items-center gap-0.5 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${i < rating ? "text-injaz-gold fill-injaz-gold" : "text-gray-200 fill-gray-200"}`}
                  />
                ))}
              </div>
            )}

            <p className="text-sm text-foreground/80 leading-relaxed line-clamp-3 mb-3">
              {reviewText}
            </p>

            {/* Member */}
            <div className="flex items-center gap-2">
              {memberAvatarUrl ? (
                <Image src={memberAvatarUrl} alt={memberName} width={24} height={24} className="rounded-full object-cover" />
              ) : (
                <div className="w-6 h-6 rounded-full bg-injaz-blue/10 flex items-center justify-center">
                  <User className="w-3 h-3 text-injaz-blue" />
                </div>
              )}
              <span className="text-xs font-medium text-injaz-navy">{memberName}</span>
              <span className="text-xs text-muted-foreground">·</span>
              <span className="text-xs text-muted-foreground">{formatArabicDate(createdAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
