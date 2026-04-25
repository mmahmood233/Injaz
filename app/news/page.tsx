import { prisma } from "@/lib/prisma";
import { NewsCard } from "@/components/NewsCard";
import { Newspaper } from "lucide-react";

export default async function NewsPage() {
  const news = await prisma.news.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
  });

  const featured = news.find((n) => n.type === "FEATURED_MEMBER");
  const rest = news.filter((n) => n.type !== "FEATURED_MEMBER" || n !== featured);

  return (
    <div>
      {/* Hero */}
      <section className="injaz-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-6">
            <Newspaper className="w-4 h-4 text-injaz-gold" />
            <span className="text-white/90 text-sm">آخر المستجدات</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "Cairo, sans-serif" }}>
            الأخبار والتغطيات
          </h1>
          <p className="text-white/70 text-lg">أخبار النادي وإنجازاته وتغطيات فعالياته</p>
        </div>
      </section>

      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Featured member */}
          {featured && (
            <div className="mb-10 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="px-3 py-1 bg-amber-500 text-white text-xs rounded-full font-semibold">العضو المتميز</span>
              </div>
              <h2 className="text-2xl font-bold text-injaz-navy mb-3" style={{ fontFamily: "Cairo, sans-serif" }}>
                {featured.title}
              </h2>
              <p className="text-muted-foreground leading-relaxed">{featured.content}</p>
            </div>
          )}

          {/* News Grid */}
          {rest.length === 0 ? (
            <div className="text-center py-20">
              <Newspaper className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">لا توجد أخبار بعد</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((item) => (
                <NewsCard
                  key={item.id}
                  id={item.id}
                  title={item.title}
                  content={item.content}
                  coverImageUrl={item.coverImageUrl}
                  type={item.type}
                  publishedAt={item.publishedAt}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
