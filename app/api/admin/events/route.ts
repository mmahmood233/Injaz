import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const body = await req.json();
  const { title, description, eventDate, startTime, endTime, location, month, status } = body;

  if (!title || !eventDate) {
    return NextResponse.json({ error: "العنوان والتاريخ مطلوبان" }, { status: 400 });
  }

  const event = await prisma.event.create({
    data: {
      title,
      description: description || null,
      eventDate: new Date(eventDate),
      startTime: startTime || null,
      endTime: endTime || null,
      location: location || null,
      month: month || null,
      status: status || "UPCOMING",
    },
  });

  await prisma.adminLog.create({
    data: { adminId: session.user.id, action: `إضافة فعالية: ${title}` },
  });

  return NextResponse.json({ id: event.id });
}
