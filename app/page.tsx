import Link from "next/link";
import { BookOpen, Users, Calendar, Star, Quote, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookCard } from "@/components/BookCard";
import { EventCard } from "@/components/EventCard";
import { NewsCard } from "@/components/NewsCard";
import { HeroSection } from "@/components/HeroSection";
import { ScrollReveal, StaggerReveal, StaggerItem, CurtainReveal, SectionLabel } from "@/components/ScrollReveal";
import { TiltCard } from "@/components/TiltCard";
import { prisma } from "@/lib/prisma";

async function getHomeData() {
  const [books, events, news, members, memberOfMonth] = await Promise.all([
    prisma.book.findMany({ where: { isPublished: true }, include: { category: true }, orderBy: { createdAt: "desc" }, take: 4 }),
    prisma.event.findMany({ where: { status: "UPCOMING" }, orderBy: { eventDate: "asc" }, take: 3 }),
    prisma.news.findMany({ where: { isPublished: true }, orderBy: { publishedAt: "desc" }, take: 3 }),
    prisma.user.findMany({ where: { role: "MEMBER" }, include: { _count: { select: { memberBooks: true, reviews: true } } }, take: 4 }),
    prisma.news.findFirst({ where: { isPublished: true, type: "FEATURED_MEMBER" }, orderBy: { publishedAt: "desc" } }),
  ]);
  return { books, events, news, members, memberOfMonth };
}

export default async function HomePage() {
  const { books, events, news, members, memberOfMonth } = await getHomeData();

  return (
    <div className="min-h-screen">

      <HeroSection memberCount={members.length} bookCount={books.length + 4} eventCount={events.length + 2} />

      {/* ── VISION & MISSION ── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <SectionLabel>هويتنا</SectionLabel>
            <CurtainReveal><h2 className="section-title arabic-border-decoration inline-block">رؤيتنا ورسالتنا</h2></CurtainReveal>
          </div>
          <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <StaggerItem>
              <TiltCard>
                <Card className="border-l-4 border-l-injaz-blue border-border/60 bg-white shadow-md h-full">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-xl injaz-gradient flex items-center justify-center mb-5 shadow-md">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-injaz-navy mb-4" style={{ fontFamily: "Cairo, sans-serif" }}>رؤيتنا</h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      أن يكون النادي مساحة ثقافية عربية رائدة تنمي عادة القراءة، وتبني مجتمعًا قرائيًا واعيًا، يجمع بين المتعة، والمعرفة، والحوار والإبداع.
                    </p>
                  </CardContent>
                </Card>
              </TiltCard>
            </StaggerItem>
            <StaggerItem>
              <TiltCard>
                <Card className="border-l-4 border-l-injaz-gold border-border/60 bg-white shadow-md h-full">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-xl bg-injaz-gold flex items-center justify-center mb-5 shadow-md">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-injaz-navy mb-4" style={{ fontFamily: "Cairo, sans-serif" }}>رسالتنا</h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      نشر ثقافة القراءة باللغة العربية من خلال توفير بيئة جاذبة للقراء، وتنظيم فعاليات أدبية وحوارية مبتكرة، وتمكين الأعضاء من التفاعل، والمشاركة، والقيادة، وصناعة أثر ثقافي مستدام داخل المجتمع.
                    </p>
                  </CardContent>
                </Card>
              </TiltCard>
            </StaggerItem>
          </StaggerReveal>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal direction="right">
              <SectionLabel>من نحن</SectionLabel>
              <CurtainReveal><h2 className="text-3xl font-bold text-injaz-navy mb-5" style={{ fontFamily: "Cairo, sans-serif" }}>نبذة عن النادي</h2></CurtainReveal>
              <p className="text-muted-foreground leading-relaxed text-base mb-5">
                نادي قراءة عربي يوفر للأعضاء مساحة هادئة وملهمة للقراءة، ويجمع بينهم في بيئة ثقافية تفاعلية تسمح لهم بمناقشة الكتب، وتبادل الآراء، والمشاركة في فعاليات أدبية وفكرية متنوعة.
              </p>
              <p className="text-muted-foreground leading-relaxed text-base mb-8">
                يقوم النادي على الجمع بين القراءة الفردية والأنشطة الجماعية، بحيث يتمكن العضو من الاستفادة من المكان في أي وقت مخصص للنادي، وفي الوقت نفسه يشارك أسبوعيًا في فعالية ثقافية تقام كل يوم أربعاء.
              </p>
              <Button asChild variant="outline" className="border-injaz-blue/40 text-injaz-blue hover:bg-injaz-blue hover:text-white">
                <Link href="/about">اقرأ المزيد <ChevronLeft className="w-4 h-4 mr-1" /></Link>
              </Button>
            </ScrollReveal>

            <StaggerReveal className="grid grid-cols-2 gap-4" stagger={0.1}>
              {[
                { icon: BookOpen, title: "القراءة الفردية", desc: "مساحة هادئة لكل عضو للقراءة بتركيز" },
                { icon: Users, title: "لقاء الأربعاء", desc: "فعالية ثقافية أسبوعية كل أربعاء" },
                { icon: Calendar, title: "فعاليات شهرية", desc: "برنامج شهري متنوع من الأنشطة الأدبية" },
                { icon: Star, title: "تكريم المتميزين", desc: "تقدير مستمر لأكثر الأعضاء مشاركةً ونشاطاً" },
              ].map((item) => (
                <StaggerItem key={item.title}>
                  <TiltCard>
                    <div className="p-4 rounded-xl bg-injaz-blue/3 border border-injaz-blue/10 hover:border-injaz-blue/30 transition-colors h-full">
                      <div className="w-10 h-10 rounded-lg injaz-gradient flex items-center justify-center mb-3 shadow-sm">
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <h4 className="font-bold text-injaz-navy text-sm mb-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                    </div>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerReveal>
          </div>
        </div>
      </section>

      {/* ── MEMBER OF MONTH ── */}
      {memberOfMonth && (
        <section className="py-16 bg-gradient-to-r from-injaz-navy to-injaz-blue">
          <div className="container mx-auto px-4">
            <ScrollReveal className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-injaz-gold/20 border border-injaz-gold/30 rounded-full px-4 py-1.5 mb-6">
                <Star className="w-4 h-4 text-injaz-gold fill-injaz-gold" />
                <span className="text-injaz-gold text-sm font-semibold">العضو المتميز للشهر</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-4" style={{ fontFamily: "Cairo, sans-serif" }}>{memberOfMonth.title}</h2>
              <p className="text-white/70 leading-relaxed mb-6">{memberOfMonth.content.slice(0, 200)}...</p>
              <Button asChild variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Link href="/news">قراءة المزيد</Link>
              </Button>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── BOOKS ── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal className="flex items-center justify-between mb-10">
            <div>
              <SectionLabel>مكتبتنا</SectionLabel>
              <CurtainReveal><h2 className="section-title">أحدث الكتب</h2></CurtainReveal>
            </div>
            <Button asChild variant="outline" className="border-injaz-blue/30 text-injaz-blue hover:bg-injaz-blue hover:text-white hidden sm:flex">
              <Link href="/books">جميع الكتب <ChevronLeft className="w-4 h-4 mr-1" /></Link>
            </Button>
          </ScrollReveal>

          <StaggerReveal className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" stagger={0.1}>
            {books.map((book) => (
              <StaggerItem key={book.id}>
                <TiltCard className="h-full">
                  <BookCard
                    id={book.id} titleAr={book.titleAr} author={book.author}
                    description={book.description} coverUrl={book.coverUrl}
                    categoryNameAr={book.category?.nameAr} canReadOnline={book.canReadOnline}
                    previewUrl={book.previewUrl} legalReadUrl={book.legalReadUrl}
                  />
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <ScrollReveal className="flex items-center justify-between mb-10">
            <div>
              <SectionLabel>أنشطتنا</SectionLabel>
              <CurtainReveal><h2 className="section-title">الفعاليات القادمة</h2></CurtainReveal>
            </div>
            <Button asChild variant="outline" className="border-injaz-blue/30 text-injaz-blue hover:bg-injaz-blue hover:text-white hidden sm:flex">
              <Link href="/events">جميع الفعاليات <ChevronLeft className="w-4 h-4 mr-1" /></Link>
            </Button>
          </ScrollReveal>

          <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.12}>
            {events.map((event) => (
              <StaggerItem key={event.id}>
                <EventCard title={event.title} description={event.description} eventDate={event.eventDate}
                  startTime={event.startTime} endTime={event.endTime} location={event.location}
                  status={event.status} month={event.month} />
              </StaggerItem>
            ))}
          </StaggerReveal>

          <ScrollReveal className="mt-8 p-5 rounded-xl bg-injaz-blue/5 border border-injaz-blue/15 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full injaz-gradient flex items-center justify-center flex-shrink-0 shadow-md">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-bold text-injaz-navy text-sm" style={{ fontFamily: "Cairo, sans-serif" }}>لقاء الأربعاء الثقافي الأسبوعي</p>
              <p className="text-sm text-muted-foreground">يعقد النادي فعالية ثقافية أسبوعية كل يوم أربعاء — لا تفوتها!</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ── NEWS ── */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <ScrollReveal className="flex items-center justify-between mb-10">
            <div>
              <SectionLabel>أخبارنا</SectionLabel>
              <CurtainReveal><h2 className="section-title">آخر الأخبار</h2></CurtainReveal>
            </div>
            <Button asChild variant="outline" className="border-injaz-blue/30 text-injaz-blue hover:bg-injaz-blue hover:text-white hidden sm:flex">
              <Link href="/news">جميع الأخبار <ChevronLeft className="w-4 h-4 mr-1" /></Link>
            </Button>
          </ScrollReveal>

          <StaggerReveal className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" stagger={0.12}>
            {news.map((item) => (
              <StaggerItem key={item.id}>
                <NewsCard id={item.id} title={item.title} content={item.content}
                  coverImageUrl={item.coverImageUrl} type={item.type} publishedAt={item.publishedAt} />
              </StaggerItem>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* ── MEMBERS ── */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <SectionLabel>مجتمعنا</SectionLabel>
            <CurtainReveal><h2 className="section-title">أعضاء النادي</h2></CurtainReveal>
            <ScrollReveal><p className="section-subtitle">مجتمع من القراء الشغوفين يصنعون أثراً ثقافياً مشتركاً</p></ScrollReveal>
          </div>

          <StaggerReveal className="grid grid-cols-2 md:grid-cols-4 gap-4" stagger={0.1}>
            {members.map((member) => (
              <StaggerItem key={member.id}>
                <TiltCard>
                  <Link href={`/members/${member.id}`}>
                    <Card className="border-border/60 text-center p-5 cursor-pointer group">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-injaz-blue to-injaz-blue-light flex items-center justify-center mx-auto mb-3 shadow-md group-hover:shadow-lg transition-shadow">
                        <span className="text-white text-xl font-bold" style={{ fontFamily: "Cairo, sans-serif" }}>
                          {member.fullName.charAt(0)}
                        </span>
                      </div>
                      <h4 className="font-bold text-injaz-navy text-sm mb-1" style={{ fontFamily: "Cairo, sans-serif" }}>{member.fullName}</h4>
                      <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3 text-injaz-blue" />{member._count.memberBooks}</span>
                        <span className="flex items-center gap-1"><Star className="w-3 h-3 text-injaz-gold" />{member._count.reviews}</span>
                      </div>
                    </Card>
                  </Link>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerReveal>

          <ScrollReveal className="text-center mt-8">
            <Button asChild variant="outline" className="border-injaz-blue/30 text-injaz-blue hover:bg-injaz-blue hover:text-white">
              <Link href="/members">عرض جميع الأعضاء <ChevronLeft className="w-4 h-4 mr-1" /></Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>

      {/* ── QUOTE CTA ── */}
      <section className="py-20 injaz-gradient relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10 text-center">
          <ScrollReveal>
            <Quote className="w-12 h-12 text-white/20 mx-auto mb-6" />
            <h2 className="text-2xl md:text-4xl font-bold text-white max-w-3xl mx-auto leading-relaxed mb-8" style={{ fontFamily: "Cairo, sans-serif" }}>
              &quot;الكتاب مرآة يرى فيها العاقل ما لا يرى غيره&quot;
            </h2>
            <p className="text-white/60 mb-8">— علي بن أبي طالب</p>
            <Button asChild size="lg" className="bg-white text-injaz-blue hover:bg-white/90 font-bold border-0">
              <Link href="/login">انضم إلى النادي</Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
