import { prisma } from "@/lib/prisma";
import { MessageSquare, Trash2, Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatArabicDate } from "@/lib/utils";
import { CommentActions } from "@/components/admin/CommentActions";

export default async function AdminCommentsPage() {
  const comments = await prisma.bookComment.findMany({
    include: {
      book: true,
      member: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-injaz-navy" style={{ fontFamily: "Cairo, sans-serif" }}>
          إدارة التعليقات
        </h1>
        <p className="text-muted-foreground">{comments.length} تعليق</p>
      </div>

      <div className="space-y-3">
        {comments.map((comment) => (
          <Card key={comment.id} className="border-border/60">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className="font-semibold text-sm text-injaz-navy">{comment.member.fullName}</span>
                    <span className="text-muted-foreground text-xs">على</span>
                    <span className="text-sm text-injaz-blue font-medium">{comment.book.titleAr}</span>
                    <span className="text-xs text-muted-foreground">{formatArabicDate(comment.createdAt)}</span>
                    <Badge variant={comment.isApproved ? "success" : "warning"} className="text-xs">
                      {comment.isApproved ? "موافق عليه" : "قيد المراجعة"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{comment.commentText}</p>
                </div>
                <CommentActions commentId={comment.id} isApproved={comment.isApproved} />
              </div>
            </CardContent>
          </Card>
        ))}

        {comments.length === 0 && (
          <div className="text-center py-20">
            <MessageSquare className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد تعليقات</p>
          </div>
        )}
      </div>
    </div>
  );
}
