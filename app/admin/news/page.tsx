import { prisma } from "@/lib/prisma";
import { Newspaper } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatArabicDate, newsTypeAr } from "@/lib/utils";
import { AddNewsForm } from "@/components/admin/AddNewsForm";
import { NewsActions } from "@/components/admin/NewsActions";

export default async function AdminNewsPage() {
  const [news, members] = await Promise.all([
    prisma.news.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.user.findMany({
      where: { role: "MEMBER" },
      select: { id: true, fullName: true },
      orderBy: { fullName: "asc" },
    }),
  ]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-injaz-navy" style={{ fontFamily: "Cairo, sans-serif" }}>
            إدارة الأخبار
          </h1>
          <p className="text-muted-foreground">{news.length} خبر</p>
        </div>
        <AddNewsForm members={members} />
      </div>

      <div className="space-y-3">
        {news.map((item) => (
          <Card key={item.id} className="border-border/60">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-injaz-navy text-sm" style={{ fontFamily: "Cairo, sans-serif" }}>
                    {item.title}
                  </h3>
                  {item.publishedAt && (
                    <p className="text-xs text-muted-foreground mt-1">{formatArabicDate(item.publishedAt)}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{newsTypeAr(item.type)}</Badge>
                  <Badge variant={item.isPublished ? "default" : "secondary"} className="text-xs">
                    {item.isPublished ? "منشور" : "مسودة"}
                  </Badge>
                  <NewsActions newsId={item.id} isPublished={item.isPublished} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {news.length === 0 && (
          <div className="text-center py-20">
            <Newspaper className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد أخبار بعد</p>
          </div>
        )}
      </div>
    </div>
  );
}
