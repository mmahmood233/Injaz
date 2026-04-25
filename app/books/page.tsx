import { prisma } from "@/lib/prisma";
import { BookCard } from "@/components/BookCard";
import { BookOpen } from "lucide-react";

export default async function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParams;

  const categories = await prisma.category.findMany({ orderBy: { nameAr: "asc" } });

  const books = await prisma.book.findMany({
    where: {
      isPublished: true,
      ...(category ? { category: { slug: category } } : {}),
      ...(search
        ? {
            OR: [
              { titleAr: { contains: search } },
              { author: { contains: search } },
              { description: { contains: search } },
            ],
          }
        : {}),
    },
    include: { category: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      {/* Hero */}
      <section className="injaz-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-6">
            <BookOpen className="w-4 h-4 text-injaz-gold" />
            <span className="text-white/90 text-sm">مكتبتنا الرقمية</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "Cairo, sans-serif" }}>
            الكتب الإلكترونية
          </h1>
          <p className="text-white/70 text-lg">
            {books.length} كتاب في مجموعتنا — قراءة قانونية وآمنة
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b border-border sticky top-16 z-30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-wrap items-center gap-3">
            <form className="flex gap-2 flex-1 min-w-[200px] max-w-sm">
              <input
                name="search"
                defaultValue={search}
                placeholder="ابحث عن كتاب أو كاتب..."
                className="flex-1 h-9 px-3 rounded-md border border-input text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button type="submit" className="h-9 px-4 rounded-md bg-injaz-blue text-white text-sm hover:bg-injaz-blue-light transition-colors">
                بحث
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              <a
                href="/books"
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  !category ? "bg-injaz-blue text-white" : "bg-secondary text-secondary-foreground hover:bg-injaz-blue/10"
                }`}
              >
                الكل
              </a>
              {categories.map((cat) => (
                <a
                  key={cat.id}
                  href={`/books?category=${cat.slug}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    category === cat.slug ? "bg-injaz-blue text-white" : "bg-secondary text-secondary-foreground hover:bg-injaz-blue/10"
                  }`}
                >
                  {cat.nameAr}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {books.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">لا توجد كتب مطابقة</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  id={book.id}
                  titleAr={book.titleAr}
                  author={book.author}
                  description={book.description}
                  coverUrl={book.coverUrl}
                  categoryNameAr={book.category?.nameAr}
                  canReadOnline={book.canReadOnline}
                  previewUrl={book.previewUrl}
                  legalReadUrl={book.legalReadUrl}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
