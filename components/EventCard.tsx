import { Calendar, Clock, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatArabicDate, eventStatusAr } from "@/lib/utils";
import { GeneratedEventVisual } from "./GeneratedEventVisual";

interface EventCardProps {
  title: string;
  description?: string | null;
  eventDate: Date | string;
  startTime?: string | null;
  endTime?: string | null;
  location?: string | null;
  status: string;
  month?: string | null;
}

export function EventCard({
  title,
  description,
  eventDate,
  startTime,
  endTime,
  location,
  status,
}: EventCardProps) {
  const isPast = status === "PAST";

  return (
    <Card className={`card-hover border-border/60 overflow-hidden ${isPast ? "opacity-80" : ""}`}>
      <GeneratedEventVisual title={title} className="h-40" />
      <div className={`h-1 ${isPast ? "bg-gray-300" : "injaz-gradient"}`} />
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-bold text-injaz-navy leading-snug" style={{ fontFamily: "Cairo, sans-serif" }}>
            {title}
          </h3>
          <Badge
            variant={isPast ? "secondary" : "default"}
            className={`flex-shrink-0 text-xs ${!isPast ? "bg-green-600 border-0 text-white" : ""}`}
          >
            {eventStatusAr(status)}
          </Badge>
        </div>

        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
            {description}
          </p>
        )}

        <div className="flex flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4 text-injaz-blue flex-shrink-0" />
            <span>{formatArabicDate(eventDate)}</span>
          </div>
          {(startTime || endTime) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4 text-injaz-blue flex-shrink-0" />
              <span>
                {startTime}
                {endTime && ` — ${endTime}`}
              </span>
            </div>
          )}
          {location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 text-injaz-blue flex-shrink-0" />
              <span>{location}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
