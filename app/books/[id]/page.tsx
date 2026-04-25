import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ExternalLink, Star, User, MessageSquare, Eye } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatArabicDate } from "@/lib/utils";
import { CommentForm } from "@/components/CommentForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BookDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const isMember = session?.user?.role === "MEMBER" || session?.user?.role === "ADMIN";

  const book = await prisma.book.findUnique({
    where: { id, isPublished: true },
    include: {
      category: true,
      comments: {
        where: { isApproved: true },
        include: { member: true },
        orderBy: { createdAt: "desc" },
      },
      reviews: {
        include: { member: true },
        orderBy: { createdAt: "desc" },
      },
      memberBooks: {
        where: { status: "READ" },
        include: { member: true },
        take: 6,
      },
    },
  });

  if (!book) notFound();

  const avgRating =
    book.reviews.length > 0
      ? book.reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / book.reviews.filter((r) => r.rating).length
      : null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Sidebar: Cover + Actions */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Cover */}
              <div className="relative w-full aspect-[3/4] max-w-xs mx-auto rounded-2xl overflow-hidden shadow-2xl bg-gray-50 mb-6 flex items-center justify-center">
                {book.coverUrl ? (
                  <Image src={book.coverUrl} alt={book.titleAr} fill className="object-contain p-1" sizes="300px" />
                ) : (
                  <div className="absolute inset-0 injaz-gradient flex flex-col items-center justify-center gap-3 p-6">
                    <BookOpen className="w-16 h-16 text-white/60" />
                    <p className="text-white/80 text-center font-medium text-sm leading-relaxed">{book.titleAr}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {book.canReadOnline && book.legalReadUrl && (
                  <Button asChild size="lg" className="w-full bg-green-600 hover:bg-green-700 text-white border-0">
                    <a href={book.legalReadUrl} target="_blank" rel="noopener noreferrer">
                      <BookOpen className="w-5 h-5 ml-2" />
                      قراءة إلكترونية
                      <ExternalLink className="w-4 h-4 mr-2" />
                    </a>
                  </Button>
                )}
                {!book.canReadOnline && book.previewUrl && (
                  <Button asChild size="lg" variant="outline" className="w-full border-injaz-blue/30 text-injaz-blue">
                    <a href={book.previewUrl} target="_blank" rel="noopener noreferrer">
                      <Eye className="w-5 h-5 ml-2" />
                      معاينة الكتاب
                      <ExternalLink className="w-4 h-4 mr-2" />
                    </a>
                  </Button>
                )}
                {!book.canReadOnline && !book.previewUrl && (
                  <div className="p-4 rounded-xl bg-muted/50 border border-border text-sm text-muted-foreground text-center leading-relaxed">
                    لا يتوفر رابط قراءة قانوني لهذا الكتاب حاليًا، ويمكنك الاطلاع على التفاصيل والمشاركة في النقاش إذا كنت عضوًا.
                  </div>
                )}
              </div>

              {/* Members who read */}
              {book.memberBooks.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-semibold text-injaz-navy mb-3">قرأه من أعضاء النادي</p>
                  <div className="flex flex-wrap gap-2">
                    {book.memberBooks.map((mb) => (
                      <Link key={mb.id} href={`/members/${mb.memberId}`} title={mb.member.fullName}>
                        <div className="w-9 h-9 rounded-full bg-injaz-blue/10 flex items-center justify-center text-injaz-blue text-xs font-bold hover:bg-injaz-blue hover:text-white transition-colors border border-injaz-blue/20">
                          {mb.member.fullName.charAt(0)}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Book Info */}
            <div>
              {book.category && (
                <Badge variant="outline" className="mb-3 text-injaz-blue border-injaz-blue/30">
                  {book.category.nameAr}
                </Badge>
              )}
              <h1 className="text-3xl font-bold text-injaz-navy mb-2" style={{ fontFamily: "Cairo, sans-serif" }}>
                {book.titleAr}
              </h1>
              {book.titleOriginal && (
                <p className="text-muted-foreground text-sm mb-2" dir="ltr">{book.titleOriginal}</p>
              )}
              <p className="text-lg text-injaz-blue font-medium mb-4">{book.author}</p>

              {avgRating && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.round(avgRating) ? "text-injaz-gold fill-injaz-gold" : "text-gray-200 fill-gray-200"}`} />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({book.reviews.length} مراجعة)</span>
                </div>
              )}

              {book.isbn && (
                <p className="text-sm text-muted-foreground mb-2">
                  <span className="font-medium">ISBN:</span> <span dir="ltr">{book.isbn}</span>
                </p>
              )}
              {book.source && (
                <p className="text-sm text-muted-foreground mb-4">
                  <span className="font-medium">المصدر:</span> {book.source}
                </p>
              )}

              {book.isPublicDomain && (
                <Badge variant="success" className="mb-4">ملك عام — مفتوح للقراءة والتوزيع</Badge>
              )}
            </div>

            {/* Description */}
            {book.description && (
              <Card className="border-border/60">
                <CardContent className="p-6">
                  <h2 className="text-lg font-bold text-injaz-navy mb-3" style={{ fontFamily: "Cairo, sans-serif" }}>
                    نبذة عن الكتاب
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">{book.description}</p>
                </CardContent>
              </Card>
            )}

            {/* Reviews */}
            {book.reviews.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-injaz-navy mb-4 flex items-center gap-2" style={{ fontFamily: "Cairo, sans-serif" }}>
                  <Star className="w-5 h-5 text-injaz-gold" />
                  مراجعات الأعضاء ({book.reviews.length})
                </h2>
                <div className="space-y-4">
                  {book.reviews.map((review) => (
                    <Card key={review.id} className="border-border/60">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-9 h-9 rounded-full bg-injaz-blue/10 flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-injaz-blue" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-injaz-navy">{review.member.fullName}</p>
                            <p className="text-xs text-muted-foreground">{formatArabicDate(review.createdAt)}</p>
                          </div>
                          {review.rating && (
                            <div className="flex gap-0.5 mr-auto">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating! ? "text-injaz-gold fill-injaz-gold" : "text-gray-200 fill-gray-200"}`} />
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">{review.reviewText}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Comments */}
            <div>
              <h2 className="text-xl font-bold text-injaz-navy mb-4 flex items-center gap-2" style={{ fontFamily: "Cairo, sans-serif" }}>
                <MessageSquare className="w-5 h-5 text-injaz-blue" />
                النقاش ({book.comments.length})
              </h2>

              {isMember ? (
                <CommentForm bookId={book.id} />
              ) : (
                <div className="p-4 rounded-xl bg-injaz-blue/5 border border-injaz-blue/15 text-center mb-6">
                  <p className="text-sm text-muted-foreground mb-3">
                    سجّل دخولك كعضو للمشاركة في النقاش
                  </p>
                  <Button asChild size="sm" className="injaz-gradient border-0 text-white">
                    <Link href="/login">تسجيل الدخول</Link>
                  </Button>
                </div>
              )}

              {book.comments.length > 0 ? (
                <div className="space-y-4">
                  {book.comments.map((comment) => (
                    <Card key={comment.id} className="border-border/60">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-injaz-blue/10 flex items-center justify-center flex-shrink-0">
                            {comment.member.avatarUrl ? (
                              <Image src={comment.member.avatarUrl} alt={comment.member.fullName} width={32} height={32} className="rounded-full object-cover" />
                            ) : (
                              <span className="text-xs font-bold text-injaz-blue">{comment.member.fullName.charAt(0)}</span>
                            )}
                          </div>
                          <div>
                            <p className="font-semibold text-xs text-injaz-navy">{comment.member.fullName}</p>
                            <p className="text-xs text-muted-foreground">{formatArabicDate(comment.createdAt)}</p>
                          </div>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{comment.commentText}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  لا توجد تعليقات بعد — كن أول من يشارك في النقاش!
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
