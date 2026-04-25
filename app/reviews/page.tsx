import { prisma } from "@/lib/prisma";
import { ReviewCard } from "@/components/ReviewCard";
import { Star } from "lucide-react";

export default async function ReviewsPage() {
  const reviews = await prisma.bookReview.findMany({
    include: {
      book: true,
      member: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      {/* Hero */}
      <section className="injaz-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-6">
            <Star className="w-4 h-4 text-injaz-gold fill-injaz-gold" />
            <span className="text-white/90 text-sm">آراء الأعضاء</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "Cairo, sans-serif" }}>
            مراجعات الكتب
          </h1>
          <p className="text-white/70 text-lg">{reviews.length} مراجعة كتبها أعضاء النادي</p>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          {reviews.length === 0 ? (
            <div className="text-center py-20">
              <Star className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">لا توجد مراجعات بعد</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <ReviewCard
                  key={review.id}
                  id={review.id}
                  bookId={review.bookId}
                  bookTitleAr={review.book.titleAr}
                  bookCoverUrl={review.book.coverUrl}
                  memberName={review.member.fullName}
                  memberAvatarUrl={review.member.avatarUrl}
                  rating={review.rating}
                  reviewText={review.reviewText}
                  createdAt={review.createdAt}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
