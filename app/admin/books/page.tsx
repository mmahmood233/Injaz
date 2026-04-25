import { prisma } from "@/lib/prisma";
import { BookOpen, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookImportPanel } from "@/components/admin/BookImportPanel";

export default async function AdminBooksPage() {
  const [books, categories] = await Promise.all([
    prisma.book.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({ orderBy: { nameAr: "asc" } }),
  ]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-injaz-navy" style={{ fontFamily: "Cairo, sans-serif" }}>
            إدارة الكتب
          </h1>
          <p className="text-muted-foreground">{books.length} كتاب في القاعدة</p>
        </div>
      </div>

      {/* Import Panel */}
      <BookImportPanel categories={categories} />

      {/* Books Table */}
      <div className="mt-8 space-y-3">
        {books.map((book) => (
          <Card key={book.id} className="border-border/60">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-injaz-navy text-sm" style={{ fontFamily: "Cairo, sans-serif" }}>
                    {book.titleAr}
                  </h3>
                  <p className="text-xs text-muted-foreground">{book.author}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {book.category && (
                    <Badge variant="outline" className="text-xs">{book.category.nameAr}</Badge>
                  )}
                  {book.canReadOnline && (
                    <Badge variant="success" className="text-xs">متاح للقراءة</Badge>
                  )}
                  {book.isPublicDomain && (
                    <Badge variant="secondary" className="text-xs">ملك عام</Badge>
                  )}
                  <Badge variant={book.isPublished ? "default" : "secondary"} className="text-xs">
                    {book.isPublished ? "منشور" : "مسودة"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {books.length === 0 && (
          <div className="text-center py-20">
            <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد كتب بعد</p>
          </div>
        )}
      </div>
    </div>
  );
}
