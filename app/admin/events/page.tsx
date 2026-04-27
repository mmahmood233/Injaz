import { prisma } from "@/lib/prisma";
import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatArabicDate, eventStatusAr } from "@/lib/utils";
import { AddEventForm } from "@/components/admin/AddEventForm";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({ orderBy: { eventDate: "desc" } });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-injaz-navy" style={{ fontFamily: "Cairo, sans-serif" }}>
            إدارة الفعاليات
          </h1>
          <p className="text-muted-foreground">{events.length} فعالية</p>
        </div>
        <AddEventForm />
      </div>

      <div className="space-y-3">
        {events.map((event) => (
          <Card key={event.id} className="border-border/60">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-injaz-navy text-sm" style={{ fontFamily: "Cairo, sans-serif" }}>
                    {event.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3" />
                    {formatArabicDate(event.eventDate)}
                    {event.startTime && ` — ${event.startTime}`}
                    {event.location && ` — ${event.location}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {event.month && <Badge variant="outline" className="text-xs">{event.month}</Badge>}
                  <Badge
                    variant={event.status === "UPCOMING" ? "default" : "secondary"}
                    className={`text-xs ${event.status === "UPCOMING" ? "bg-green-600 border-0 text-white" : ""}`}
                  >
                    {eventStatusAr(event.status)}
                  </Badge>
                  <AdminDeleteButton
                    endpoint="/api/admin/events"
                    id={event.id}
                    confirmText={`هل أنت متأكد من حذف الفعالية "${event.title}"؟`}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {events.length === 0 && (
          <div className="text-center py-20">
            <Calendar className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">لا توجد فعاليات بعد</p>
          </div>
        )}
      </div>
    </div>
  );
}
