import { prisma } from "@/lib/prisma";
import { BookMarked, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatArabicDate, borrowingStatusAr } from "@/lib/utils";
import { AddBorrowingForm } from "@/components/admin/AddBorrowingForm";
import { BorrowingActions } from "@/components/admin/BorrowingActions";

export default async function AdminBorrowingsPage() {
  const [borrowings, books, members] = await Promise.all([
    prisma.borrowing.findMany({
      include: { book: true, member: true },
      orderBy: { borrowedAt: "desc" },
    }),
    prisma.book.findMany({ where: { isPublished: true }, select: { id: true, titleAr: true } }),
    prisma.user.findMany({ where: { role: "MEMBER" }, select: { id: true, fullName: true } }),
  ]);

  const statusColor: Record<string, "warning" | "success" | "danger"> = {
    BORROWED: "warning",
    RETURNED: "success",
    OVERDUE: "danger",
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-injaz-navy" style={{ fontFamily: "Cairo, sans-serif" }}>
            إدارة الاستعارات
          </h1>
          <p className="text-muted-foreground">{borrowings.length} سجل استعارة</p>
        </div>
        <AddBorrowingForm books={books} members={members} />
      </div>

      <div className="space-y-3">
        {borrowings.map((b) => (
          <Card key={b.id} className="border-border/60">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-injaz-navy text-sm">{b.book.titleAr}</h3>
                  <p className="text-xs text-muted-foreground">العضو: {b.member.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    استُعير: {formatArabicDate(b.borrowedAt)}
                    {b.dueDate && ` — الإرجاع المتوقع: ${formatArabicDate(b.dueDate)}`}
                    {b.returnedAt && ` — أُرجع: ${formatArabicDate(b.returnedAt)}`}
                  </p>
                  {b.notes && <p className="text-xs text-muted-foreground mt-1">ملاحظة: {b.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={statusColor[b.status]}>{borrowingStatusAr(b.status)}</Badge>
                  {b.status === "BORROWED" && <BorrowingActions borrowingId={b.id} />}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {borrowings.length === 0 && (
          <div className="text-center py-20">
            <BookMarked className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد سجلات استعارة</p>
          </div>
        )}
      </div>
    </div>
  );
}
