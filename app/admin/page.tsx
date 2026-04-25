import Link from "next/link";
import { Users, BookOpen, Calendar, Newspaper, MessageSquare, BookMarked, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { formatArabicDate } from "@/lib/utils";

export default async function AdminDashboardPage() {
  const [
    membersCount,
    booksCount,
    eventsCount,
    newsCount,
    commentsCount,
    borrowingsCount,
    recentLogs,
  ] = await Promise.all([
    prisma.user.count({ where: { role: "MEMBER" } }),
    prisma.book.count({ where: { isPublished: true } }),
    prisma.event.count(),
    prisma.news.count({ where: { isPublished: true } }),
    prisma.bookComment.count(),
    prisma.borrowing.count({ where: { status: "BORROWED" } }),
    prisma.adminLog.findMany({
      include: { admin: true },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const stats = [
    { label: "الأعضاء", value: membersCount, icon: Users, href: "/admin/members", color: "bg-blue-500" },
    { label: "الكتب المنشورة", value: booksCount, icon: BookOpen, href: "/admin/books", color: "bg-green-500" },
    { label: "الفعاليات", value: eventsCount, icon: Calendar, href: "/admin/events", color: "bg-purple-500" },
    { label: "الأخبار", value: newsCount, icon: Newspaper, href: "/admin/news", color: "bg-amber-500" },
    { label: "التعليقات", value: commentsCount, icon: MessageSquare, href: "/admin/comments", color: "bg-pink-500" },
    { label: "استعارات نشطة", value: borrowingsCount, icon: BookMarked, href: "/admin/borrowings", color: "bg-red-500" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-injaz-navy" style={{ fontFamily: "Cairo, sans-serif" }}>
          لوحة الإدارة
        </h1>
        <p className="text-muted-foreground">مرحباً بك في لوحة تحكم نادي إنجاز للقراءة</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-10">
        {stats.map((stat) => (
          <Link key={stat.href} href={stat.href}>
            <Card className="card-hover border-border/60 cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.color} flex items-center justify-center flex-shrink-0 shadow-md`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-injaz-navy" style={{ fontFamily: "Cairo, sans-serif" }}>
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Card className="border-border/60">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-injaz-navy mb-4" style={{ fontFamily: "Cairo, sans-serif" }}>
              إجراءات سريعة
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {[
                { href: "/admin/members", label: "إضافة عضو", icon: Users },
                { href: "/admin/books", label: "استيراد كتاب", icon: BookOpen },
                { href: "/admin/events", label: "إضافة فعالية", icon: Calendar },
                { href: "/admin/news", label: "نشر خبر", icon: Newspaper },
              ].map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-2 p-3 rounded-xl border border-border hover:border-injaz-blue/30 hover:bg-injaz-blue/5 transition-all text-sm font-medium text-injaz-navy"
                >
                  <action.icon className="w-4 h-4 text-injaz-blue" />
                  {action.label}
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Log */}
        <Card className="border-border/60">
          <CardContent className="p-6">
            <h2 className="text-lg font-bold text-injaz-navy mb-4 flex items-center gap-2" style={{ fontFamily: "Cairo, sans-serif" }}>
              <TrendingUp className="w-5 h-5 text-injaz-blue" />
              سجل الإدارة
            </h2>
            {recentLogs.length === 0 ? (
              <p className="text-sm text-muted-foreground">لا توجد سجلات</p>
            ) : (
              <div className="space-y-3">
                {recentLogs.map((log) => (
                  <div key={log.id} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-injaz-blue mt-1.5 flex-shrink-0"></div>
                    <div>
                      <p className="text-sm text-foreground/80">{log.action}</p>
                      <p className="text-xs text-muted-foreground">
                        {log.admin.fullName} — {formatArabicDate(log.createdAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
