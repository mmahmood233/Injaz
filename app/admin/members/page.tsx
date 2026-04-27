import { prisma } from "@/lib/prisma";
import { Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatArabicDate } from "@/lib/utils";
import { AddMemberForm } from "@/components/admin/AddMemberForm";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";

export default async function AdminMembersPage() {
  const members = await prisma.user.findMany({
    where: { role: "MEMBER" },
    include: {
      _count: { select: { memberBooks: true, reviews: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-injaz-navy" style={{ fontFamily: "Cairo, sans-serif" }}>
            إدارة الأعضاء
          </h1>
          <p className="text-muted-foreground">{members.length} عضو مسجل</p>
        </div>
        <AddMemberForm />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {members.map((member) => (
          <Card key={member.id} className="border-border/60">
            <CardContent className="p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-injaz-blue/10 flex items-center justify-center flex-shrink-0 font-bold text-injaz-blue text-lg">
                  {member.fullName.charAt(0)}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-injaz-navy" style={{ fontFamily: "Cairo, sans-serif" }}>
                    {member.fullName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{member.email}</p>
                  {member.bio && <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{member.bio}</p>}
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {member._count.memberBooks} كتاب
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {member._count.reviews} مراجعة
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatArabicDate(member.createdAt)}
                  </span>
                  <AdminDeleteButton
                    endpoint="/api/admin/members"
                    id={member.id}
                    confirmText={`هل أنت متأكد من حذف العضو "${member.fullName}"؟ سيتم حذف جميع بياناته.`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {members.length === 0 && (
          <div className="text-center py-20">
            <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">لا يوجد أعضاء بعد</p>
          </div>
        )}
      </div>
    </div>
  );
}
