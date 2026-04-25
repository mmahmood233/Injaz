import { prisma } from "@/lib/prisma";
import { EventCard } from "@/components/EventCard";
import { Calendar } from "lucide-react";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const { month } = await searchParams;

  const allEvents = await prisma.event.findMany({
    orderBy: { eventDate: "asc" },
  });

  const months = Array.from(new Set(allEvents.map((e) => e.month).filter(Boolean))) as string[];
  const filteredEvents = month
    ? allEvents.filter((e) => e.month === month)
    : allEvents;

  const upcoming = filteredEvents.filter((e) => e.status === "UPCOMING");
  const past = filteredEvents.filter((e) => e.status === "PAST");

  return (
    <div>
      {/* Hero */}
      <section className="injaz-gradient py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-6">
            <Calendar className="w-4 h-4 text-injaz-gold" />
            <span className="text-white/90 text-sm">أنشطتنا</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "Cairo, sans-serif" }}>
            الفعاليات
          </h1>
          <p className="text-white/70 text-lg">
            فعالية ثقافية أسبوعية كل أربعاء، وأنشطة متنوعة طوال الشهر
          </p>
        </div>
      </section>

      {/* Wednesday Banner */}
      <div className="bg-injaz-gold/10 border-b border-injaz-gold/20 py-3">
        <div className="container mx-auto px-4 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-injaz-gold flex-shrink-0" />
          <p className="text-sm font-medium text-injaz-navy">
            <span className="text-injaz-gold">لقاء الأربعاء الثقافي</span> — فعالية أسبوعية ثابتة كل يوم أربعاء من الساعة ٦:٠٠ مساءً
          </p>
        </div>
      </div>

      {/* Month Filters */}
      {months.length > 0 && (
        <div className="bg-white border-b border-border py-4">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap gap-2 items-center">
              <span className="text-sm font-medium text-muted-foreground ml-2">تصفية حسب الشهر:</span>
              <a
                href="/events"
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                  !month ? "bg-injaz-blue text-white" : "bg-secondary hover:bg-injaz-blue/10"
                }`}
              >
                جميع الفعاليات
              </a>
              {months.map((m) => (
                <a
                  key={m}
                  href={`/events?month=${encodeURIComponent(m)}`}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    month === m ? "bg-injaz-blue text-white" : "bg-secondary hover:bg-injaz-blue/10"
                  }`}
                >
                  {m}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Events */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          {/* Upcoming */}
          {upcoming.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-injaz-navy mb-6 flex items-center gap-2" style={{ fontFamily: "Cairo, sans-serif" }}>
                <span className="w-2 h-6 bg-green-500 rounded-full inline-block"></span>
                الفعاليات القادمة ({upcoming.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {upcoming.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            </div>
          )}

          {/* Past */}
          {past.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-injaz-navy mb-6 flex items-center gap-2" style={{ fontFamily: "Cairo, sans-serif" }}>
                <span className="w-2 h-6 bg-gray-300 rounded-full inline-block"></span>
                الفعاليات المنتهية ({past.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {past.map((event) => (
                  <EventCard key={event.id} {...event} />
                ))}
              </div>
            </div>
          )}

          {filteredEvents.length === 0 && (
            <div className="text-center py-20">
              <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">لا توجد فعاليات لهذا الشهر</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
