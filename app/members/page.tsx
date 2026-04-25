import { prisma } from "@/lib/prisma";
import { MemberCard } from "@/components/MemberCard";
import { Users } from "lucide-react";

export default async function MembersPage() {
  const members = await prisma.user.findMany({
    where: { role: "MEMBER" },
    include: {
      _count: { select: { memberBooks: true, reviews: true } },
    },
    orderBy: { joinedAt: "desc" },
  });

  return (
    <div>
      {/* Hero */}
      <section className="injaz-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-6">
            <Users className="w-4 h-4 text-injaz-gold" />
            <span className="text-white/90 text-sm">مجتمع القراء</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "Cairo, sans-serif" }}>
            أعضاء النادي
          </h1>
          <p className="text-white/70 text-lg">{members.length} عضو نشط في مجتمعنا القرائي</p>
        </div>
      </section>

      {/* Members Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          {members.length === 0 ? (
            <div className="text-center py-20">
              <Users className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">لا يوجد أعضاء مسجلون بعد</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {members.map((member) => (
                <MemberCard
                  key={member.id}
                  id={member.id}
                  fullName={member.fullName}
                  bio={member.bio}
                  avatarUrl={member.avatarUrl}
                  booksCount={member._count.memberBooks}
                  reviewsCount={member._count.reviews}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
