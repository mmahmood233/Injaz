import Link from "next/link";
import Image from "next/image";
import { User, BookMarked, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface MemberCardProps {
  id: string;
  fullName: string;
  bio?: string | null;
  avatarUrl?: string | null;
  booksCount: number;
  reviewsCount: number;
  achievement?: string | null;
}

export function MemberCard({
  id,
  fullName,
  bio,
  avatarUrl,
  booksCount,
  reviewsCount,
  achievement,
}: MemberCardProps) {
  return (
    <Card className="group card-hover border-border/60 overflow-hidden">
      <CardContent className="p-6 flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="relative w-20 h-20 mb-4">
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={fullName}
              fill
              className="object-cover rounded-full border-4 border-injaz-blue/10 group-hover:border-injaz-gold/40 transition-colors"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-injaz-blue to-injaz-blue-light flex items-center justify-center border-4 border-injaz-blue/10">
              <User className="w-8 h-8 text-white" />
            </div>
          )}
          {achievement && (
            <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-injaz-gold rounded-full flex items-center justify-center shadow-md">
              <Star className="w-3 h-3 text-white fill-white" />
            </div>
          )}
        </div>

        <h3 className="font-bold text-injaz-navy text-lg mb-1" style={{ fontFamily: "Cairo, sans-serif" }}>
          {fullName}
        </h3>

        {bio && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
            {bio}
          </p>
        )}

        {achievement && (
          <p className="text-xs text-injaz-gold font-medium mb-3 bg-injaz-gold/5 px-3 py-1 rounded-full border border-injaz-gold/20">
            {achievement}
          </p>
        )}

        <div className="flex items-center justify-center gap-4 mb-4 w-full border-t border-border pt-4">
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center text-injaz-blue">
              <BookMarked className="w-4 h-4" />
              <span className="font-bold text-lg">{booksCount}</span>
            </div>
            <p className="text-xs text-muted-foreground">كتاب</p>
          </div>
          <div className="w-px h-8 bg-border"></div>
          <div className="text-center">
            <div className="flex items-center gap-1 justify-center text-injaz-gold">
              <Star className="w-4 h-4" />
              <span className="font-bold text-lg">{reviewsCount}</span>
            </div>
            <p className="text-xs text-muted-foreground">مراجعة</p>
          </div>
        </div>

        <Button
          asChild
          variant="outline"
          size="sm"
          className="w-full border-injaz-blue/30 text-injaz-blue hover:bg-injaz-blue hover:text-white"
        >
          <Link href={`/members/${id}`}>عرض الملف</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
