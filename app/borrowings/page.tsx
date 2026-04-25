import { redirect } from "next/navigation";
import Link from "next/link";
import { BookMarked, Calendar, AlertTriangle, CheckCircle } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatArabicDate, borrowingStatusAr } from "@/lib/utils";

export default async function BorrowingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const isAdmin = session.user.role === "ADMIN";

  const borrowings = await prisma.borrowing.findMany({
    where: isAdmin ? {} : { memberId: session.user.id },
    include: {
      book: true,
      member: true,
    },
    orderBy: { borrowedAt: "desc" },
  });

  const statusColor: Record<string, string> = {
    BORROWED: "warning",
    RETURNED: "success",
    OVERDUE: "danger",
  };

  const statusIcon: Record<string, React.ComponentType<{ className?: string }>> = {
    BORROWED: BookMarked,
    RETURNED: CheckCircle,
    OVERDUE: AlertTriangle,
  };

  return (
    <div>
      {/* Hero */}
      <section className="injaz-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-6">
            <BookMarked className="w-4 h-4 text-injaz-gold" />
            <span className="text-white/90 text-sm">سجل الاستعارة</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "Cairo, sans-serif" }}>
            الاستعارة
          </h1>
          <p className="text-white/70 text-lg">
            {isAdmin ? "جميع سجلات استعارة الكتب" : "سجل استعارتك الشخصي"}
          </p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          {borrowings.length === 0 ? (
            <div className="text-center py-20">
              <BookMarked className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">لا توجد سجلات استعارة</p>
            </div>
          ) : (
            <div className="space-y-4">
              {borrowings.map((borrowing) => {
                const Icon = statusIcon[borrowing.status] || BookMarked;
                const colorVariant = statusColor[borrowing.status] as "warning" | "success" | "danger";

                return (
                  <Card key={borrowing.id} className="border-border/60">
                    <CardContent className="p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-lg injaz-gradient flex items-center justify-center flex-shrink-0">
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <Link href={`/books/${borrowing.bookId}`} className="hover:text-injaz-blue">
                                <h3 className="font-bold text-injaz-navy" style={{ fontFamily: "Cairo, sans-serif" }}>
                                  {borrowing.book.titleAr}
                                </h3>
                              </Link>
                              {isAdmin && (
                                <p className="text-sm text-muted-foreground">
                                  العضو: {borrowing.member.fullName}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>استُعير: {formatArabicDate(borrowing.borrowedAt)}</span>
                          </div>
                          {borrowing.dueDate && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <Calendar className="w-4 h-4" />
                              <span>الإرجاع: {formatArabicDate(borrowing.dueDate)}</span>
                            </div>
                          )}
                          {borrowing.returnedAt && (
                            <div className="flex items-center gap-1.5 text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>أُرجع: {formatArabicDate(borrowing.returnedAt)}</span>
                            </div>
                          )}
                          <Badge variant={colorVariant}>
                            {borrowingStatusAr(borrowing.status)}
                          </Badge>
                        </div>
                      </div>

                      {borrowing.notes && (
                        <p className="text-xs text-muted-foreground mt-3 border-t border-border pt-3">
                          ملاحظة: {borrowing.notes}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
