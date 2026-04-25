import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { User, BookOpen, Star, Calendar, BookMarked } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatArabicDate, readingStatusAr } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function MemberProfilePage({ params }: Props) {
  const { id } = await params;

  const member = await prisma.user.findUnique({
    where: { id },
    include: {
      memberBooks: {
        include: { book: { include: { category: true } } },
        orderBy: { createdAt: "desc" },
      },
      reviews: {
        include: { book: true },
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      _count: { select: { memberBooks: true, reviews: true, comments: true } },
    },
  });

  if (!member) notFound();

  const readBooks = member.memberBooks.filter((mb) => mb.status === "READ");
  const readingBooks = member.memberBooks.filter((mb) => mb.status === "READING");
  const wantToRead = member.memberBooks.filter((mb) => mb.status === "WANT_TO_READ");

  return (
    <div className="min-h-screen bg-background">
      {/* Profile Hero */}
      <section className="injaz-gradient py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 max-w-3xl mx-auto">
            <div className="w-28 h-28 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center flex-shrink-0 shadow-xl">
              {member.avatarUrl ? (
                <Image src={member.avatarUrl} alt={member.fullName} fill className="object-cover rounded-full" />
              ) : (
                <span className="text-white text-4xl font-bold" style={{ fontFamily: "Cairo, sans-serif" }}>
                  {member.fullName.charAt(0)}
                </span>
              )}
            </div>
            <div className="text-center md:text-right">
              <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "Cairo, sans-serif" }}>
                {member.fullName}
              </h1>
              {member.bio && <p className="text-white/70 leading-relaxed max-w-lg">{member.bio}</p>}
              <p className="text-white/50 text-sm mt-2">
                <Calendar className="w-3.5 h-3.5 inline ml-1" />
                عضو منذ {formatArabicDate(member.joinedAt)}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-10 max-w-5xl">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { icon: BookOpen, value: member._count.memberBooks, label: "كتاب" },
            { icon: Star, value: member._count.reviews, label: "مراجعة" },
            { icon: BookMarked, value: member._count.comments, label: "تعليق" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/60 text-center">
              <CardContent className="p-5">
                <stat.icon className="w-6 h-6 text-injaz-blue mx-auto mb-2" />
                <p className="text-2xl font-bold text-injaz-navy" style={{ fontFamily: "Cairo, sans-serif" }}>
                  {stat.value}
                </p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Books */}
          <div className="lg:col-span-2 space-y-8">
            {/* Currently Reading */}
            {readingBooks.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-injaz-navy mb-4 flex items-center gap-2" style={{ fontFamily: "Cairo, sans-serif" }}>
                  <BookOpen className="w-5 h-5 text-injaz-blue" />
                  يقرأ حالياً
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {readingBooks.map((mb) => (
                    <BookListItem key={mb.id} mb={mb} />
                  ))}
                </div>
              </div>
            )}

            {/* Read Books */}
            {readBooks.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-injaz-navy mb-4 flex items-center gap-2" style={{ fontFamily: "Cairo, sans-serif" }}>
                  <BookMarked className="w-5 h-5 text-injaz-blue" />
                  الكتب التي قرأها ({readBooks.length})
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {readBooks.map((mb) => (
                    <BookListItem key={mb.id} mb={mb} />
                  ))}
                </div>
              </div>
            )}

            {/* Want to Read */}
            {wantToRead.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-injaz-navy mb-4 flex items-center gap-2" style={{ fontFamily: "Cairo, sans-serif" }}>
                  <Star className="w-5 h-5 text-injaz-gold" />
                  يرغب في قراءته
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {wantToRead.map((mb) => (
                    <BookListItem key={mb.id} mb={mb} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reviews Sidebar */}
          <div>
            <h2 className="text-xl font-bold text-injaz-navy mb-4 flex items-center gap-2" style={{ fontFamily: "Cairo, sans-serif" }}>
              <Star className="w-5 h-5 text-injaz-gold" />
              آخر المراجعات
            </h2>
            {member.reviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">لا توجد مراجعات بعد</p>
            ) : (
              <div className="space-y-4">
                {member.reviews.map((review) => (
                  <Card key={review.id} className="border-border/60">
                    <CardContent className="p-4">
                      <Link href={`/books/${review.bookId}`} className="hover:text-injaz-blue">
                        <h4 className="font-bold text-injaz-navy text-sm mb-1 line-clamp-1">
                          {review.book.titleAr}
                        </h4>
                      </Link>
                      {review.rating && (
                        <div className="flex gap-0.5 mb-2">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < review.rating! ? "text-injaz-gold fill-injaz-gold" : "text-gray-200 fill-gray-200"}`} />
                          ))}
                        </div>
                      )}
                      <p className="text-xs text-muted-foreground line-clamp-3">{review.reviewText}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function BookListItem({ mb }: { mb: { book: { id: string; titleAr: string; author: string; coverUrl: string | null; category: { nameAr: string } | null }; status: string } }) {
  return (
    <Link href={`/books/${mb.book.id}`}>
      <Card className="card-hover border-border/60 overflow-hidden">
        <CardContent className="p-3 flex gap-3">
          <div className="relative w-12 h-16 rounded bg-gray-50 flex-shrink-0 overflow-hidden">
            {mb.book.coverUrl ? (
              <Image src={mb.book.coverUrl} alt={mb.book.titleAr} fill className="object-contain" sizes="48px" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-injaz-blue/30" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-injaz-navy text-xs line-clamp-2 mb-1">{mb.book.titleAr}</h4>
            <p className="text-xs text-muted-foreground mb-1">{mb.book.author}</p>
            <Badge variant="outline" className="text-xs py-0 px-2">
              {readingStatusAr(mb.status)}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
