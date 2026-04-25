import Link from "next/link";
import Image from "next/image";
import { BookOpen, Users, Calendar, ArrowLeft, Star, Quote, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookCard } from "@/components/BookCard";
import { EventCard } from "@/components/EventCard";
import { NewsCard } from "@/components/NewsCard";
import { prisma } from "@/lib/prisma";

async function getHomeData() {
  const [books, events, news, members, memberOfMonth] = await Promise.all([
    prisma.book.findMany({
      where: { isPublished: true },
      include: { category: true },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    prisma.event.findMany({
      where: { status: "UPCOMING" },
      orderBy: { eventDate: "asc" },
      take: 3,
    }),
    prisma.news.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: "desc" },
      take: 3,
    }),
    prisma.user.findMany({
      where: { role: "MEMBER" },
      include: {
        _count: { select: { memberBooks: true, reviews: true } },
      },
      take: 4,
    }),
    prisma.news.findFirst({
      where: { isPublished: true, type: "FEATURED_MEMBER" },
      orderBy: { publishedAt: "desc" },
    }),
  ]);
  return { books, events, news, members, memberOfMonth };
}

export default async function HomePage() {
  const { books, events, news, members, memberOfMonth } = await getHomeData();

  return (
    <div className="min-h-screen">
      {/* ======= HERO ======= */}
      <section className="relative overflow-hidden injaz-pattern">
        <div className="injaz-gradient absolute inset-0 opacity-95" />
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="max-w-3xl mx-auto text-center">
            {/* Club name tag */}
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-8">
              <BookOpen className="w-4 h-4 text-injaz-gold" />
              <span className="text-white/90 text-sm font-medium">نادي إنجاز للقراءة</span>
            </div>

            {/* Main headline */}
            <h1
              className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
              style={{ fontFamily: "Cairo, sans-serif" }}
            >
              نقرأ لنفهم،
              <br />
              <span className="text-injaz-gold">نتحاور لننمو،</span>
              <br />
              ونصنع أثرًا ثقافيًا مستدامًا.
            </h1>

            <p className="text-white/80 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
              نادي قراءة عربي يجمع المحبين للكتب في بيئة ثقافية تفاعلية، يلتقي فيها الأعضاء كل أربعاء في حوار أدبي وفكري مثري.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="xl" className="bg-white text-injaz-blue hover:bg-white/90 font-bold border-0">
                <Link href="/about">
                  تعرف على النادي
                  <ArrowLeft className="w-5 h-5 mr-2" />
                </Link>
              </Button>
              <Button asChild size="xl" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-injaz-blue font-bold transition-colors">
                <Link href="/events">استعرض الفعاليات</Link>
              </Button>
              <Button asChild size="xl" className="bg-injaz-gold hover:bg-injaz-gold-light text-white border-0">
                <Link href="/books">تصفح الكتب</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-14 max-w-lg mx-auto">
              {[
                { value: members.length, label: "عضو نشط" },
                { value: books.length + 4, label: "كتاب مُضاف" },
                { value: events.length + 2, label: "فعالية" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-3xl font-bold text-white" style={{ fontFamily: "Cairo, sans-serif" }}>
                    {stat.value}+
                  </p>
                  <p className="text-white/60 text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Wave bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="hsl(40 30% 97%)" />
          </svg>
        </div>
      </section>

      {/* ======= VISION & MISSION ======= */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-injaz-gold font-semibold mb-2 tracking-wider text-sm uppercase">هويتنا</p>
            <h2 className="section-title arabic-border-decoration inline-block">رؤيتنا ورسالتنا</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-l-4 border-l-injaz-blue border-border/60 bg-white shadow-md card-hover">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl injaz-gradient flex items-center justify-center mb-5 shadow-md">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-injaz-navy mb-4" style={{ fontFamily: "Cairo, sans-serif" }}>
                  رؤيتنا
                </h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  أن يكون النادي مساحة ثقافية عربية رائدة تنمي عادة القراءة، وتبني مجتمعًا قرائيًا واعيًا، يجمع بين المتعة، والمعرفة، والحوار والإبداع.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-injaz-gold border-border/60 bg-white shadow-md card-hover">
              <CardContent className="p-8">
                <div className="w-12 h-12 rounded-xl bg-injaz-gold flex items-center justify-center mb-5 shadow-md">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-injaz-navy mb-4" style={{ fontFamily: "Cairo, sans-serif" }}>
                  رسالتنا
                </h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  نشر ثقافة القراءة باللغة العربية من خلال توفير بيئة جاذبة للقراء، وتنظيم فعاليات أدبية وحوارية مبتكرة، وتمكين الأعضاء من التفاعل، والمشاركة، والقيادة، وصناعة أثر ثقافي مستدام داخل المجتمع.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ======= ABOUT INTRO ======= */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <p className="text-injaz-gold font-semibold mb-2 tracking-wider text-sm uppercase">من نحن</p>
                <h2 className="text-3xl font-bold text-injaz-navy mb-5" style={{ fontFamily: "Cairo, sans-serif" }}>
                  نبذة عن النادي
                </h2>
                <p className="text-muted-foreground leading-relaxed text-base mb-5">
                  نادي قراءة عربي يوفر للأعضاء مساحة هادئة وملهمة للقراءة، ويجمع بينهم في بيئة ثقافية تفاعلية تسمح لهم بمناقشة الكتب، وتبادل الآراء، والمشاركة في فعاليات أدبية وفكرية متنوعة.
                </p>
                <p className="text-muted-foreground leading-relaxed text-base mb-8">
                  يقوم النادي على الجمع بين القراءة الفردية والأنشطة الجماعية، بحيث يتمكن العضو من الاستفادة من المكان في أي وقت مخصص للنادي، وفي الوقت نفسه يشارك أسبوعيًا في فعالية ثقافية تقام كل يوم أربعاء.
                </p>
                <Button asChild variant="outline" className="border-injaz-blue/40 text-injaz-blue hover:bg-injaz-blue hover:text-white">
                  <Link href="/about">
                    اقرأ المزيد
                    <ChevronLeft className="w-4 h-4 mr-1" />
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: BookOpen, title: "القراءة الفردية", desc: "مساحة هادئة لكل عضو للقراءة بتركيز" },
                  { icon: Users, title: "لقاء الأربعاء", desc: "فعالية ثقافية أسبوعية كل أربعاء" },
                  { icon: Calendar, title: "فعاليات شهرية", desc: "برنامج شهري متنوع من الأنشطة الأدبية" },
                  { icon: Star, title: "تكريم المتميزين", desc: "تقدير مستمر لأكثر الأعضاء مشاركةً ونشاطاً" },
                ].map((item) => (
                  <div key={item.title} className="p-4 rounded-xl bg-injaz-blue/3 border border-injaz-blue/10 hover:border-injaz-blue/30 transition-colors">
                    <div className="w-10 h-10 rounded-lg injaz-gradient flex items-center justify-center mb-3 shadow-sm">
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <h4 className="font-bold text-injaz-navy text-sm mb-1">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======= MEMBER OF THE MONTH ======= */}
      {memberOfMonth && (
        <section className="py-16 bg-gradient-to-r from-injaz-navy to-injaz-blue">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-injaz-gold/20 border border-injaz-gold/30 rounded-full px-4 py-1.5 mb-6">
                <Star className="w-4 h-4 text-injaz-gold fill-injaz-gold" />
                <span className="text-injaz-gold text-sm font-semibold">العضو المتميز للشهر</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: "Cairo, sans-serif" }}>
                {memberOfMonth.title}
              </h2>
              <p className="text-white/70 leading-relaxed mb-6">
                {memberOfMonth.content.slice(0, 200)}...
              </p>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link href="/news">قراءة المزيد</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* ======= BOOKS ======= */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-injaz-gold font-semibold mb-1 tracking-wider text-sm uppercase">مكتبتنا</p>
              <h2 className="section-title">أحدث الكتب</h2>
            </div>
            <Button asChild variant="outline" className="border-injaz-blue/30 text-injaz-blue hover:bg-injaz-blue hover:text-white hidden sm:flex">
              <Link href="/books">
                جميع الكتب
                <ChevronLeft className="w-4 h-4 mr-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
      </section>

      {/* ======= EVENTS ======= */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-injaz-gold font-semibold mb-1 tracking-wider text-sm uppercase">أنشطتنا</p>
              <h2 className="section-title">الفعاليات القادمة</h2>
            </div>
            <Button asChild variant="outline" className="border-injaz-blue/30 text-injaz-blue hover:bg-injaz-blue hover:text-white hidden sm:flex">
              <Link href="/events">
                جميع الفعاليات
                <ChevronLeft className="w-4 h-4 mr-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard
                key={event.id}
                title={event.title}
                description={event.description}
                eventDate={event.eventDate}
                startTime={event.startTime}
                endTime={event.endTime}
                location={event.location}
                status={event.status}
                month={event.month}
              />
            ))}
          </div>

          {/* Wednesday highlight */}
          <div className="mt-8 p-5 rounded-xl bg-injaz-blue/5 border border-injaz-blue/15 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full injaz-gradient flex items-center justify-center flex-shrink-0 shadow-md">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-injaz-navy text-sm" style={{ fontFamily: "Cairo, sans-serif" }}>
                لقاء الأربعاء الثقافي الأسبوعي
              </p>
              <p className="text-sm text-muted-foreground">
                يعقد النادي فعالية ثقافية أسبوعية كل يوم أربعاء — لا تفوتها!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======= NEWS ======= */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-injaz-gold font-semibold mb-1 tracking-wider text-sm uppercase">أخبارنا</p>
              <h2 className="section-title">آخر الأخبار</h2>
            </div>
            <Button asChild variant="outline" className="border-injaz-blue/30 text-injaz-blue hover:bg-injaz-blue hover:text-white hidden sm:flex">
              <Link href="/news">
                جميع الأخبار
                <ChevronLeft className="w-4 h-4 mr-1" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
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
        </div>
      </section>

      {/* ======= MEMBERS HIGHLIGHT ======= */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-injaz-gold font-semibold mb-2 tracking-wider text-sm uppercase">مجتمعنا</p>
            <h2 className="section-title">أعضاء النادي</h2>
            <p className="section-subtitle">مجتمع من القراء الشغوفين يصنعون أثراً ثقافياً مشتركاً</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {members.map((member) => (
              <Link key={member.id} href={`/members/${member.id}`}>
                <Card className="card-hover border-border/60 text-center p-5 cursor-pointer group">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-injaz-blue to-injaz-blue-light flex items-center justify-center mx-auto mb-3 shadow-md group-hover:shadow-lg transition-shadow">
                    <span className="text-white text-xl font-bold" style={{ fontFamily: "Cairo, sans-serif" }}>
                      {member.fullName.charAt(0)}
                    </span>
                  </div>
                  <h4 className="font-bold text-injaz-navy text-sm mb-1" style={{ fontFamily: "Cairo, sans-serif" }}>
                    {member.fullName}
                  </h4>
                  <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-injaz-blue" />
                      {member._count.memberBooks}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-injaz-gold" />
                      {member._count.reviews}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline" className="border-injaz-blue/30 text-injaz-blue hover:bg-injaz-blue hover:text-white">
              <Link href="/members">
                عرض جميع الأعضاء
                <ChevronLeft className="w-4 h-4 mr-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ======= QUOTE CTA ======= */}
      <section className="py-20 injaz-gradient relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Quote className="w-12 h-12 text-white/20 mx-auto mb-6" />
          <h2
            className="text-2xl md:text-4xl font-bold text-white max-w-3xl mx-auto leading-relaxed mb-8"
            style={{ fontFamily: "Cairo, sans-serif" }}
          >
            "الكتاب مرآة يرى فيها العاقل ما لا يرى غيره"
          </h2>
          <p className="text-white/60 mb-8">— علي بن أبي طالب</p>
          <Button asChild size="lg" className="bg-white text-injaz-blue hover:bg-white/90 font-bold border-0">
            <Link href="/login">انضم إلى النادي</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
