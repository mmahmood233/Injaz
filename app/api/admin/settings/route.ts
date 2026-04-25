import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const ALLOWED_KEYS = [
  "about_p1", "about_p2", "about_p3",
  "vision", "mission",
  "wednesday_desc", "wednesday_time", "wednesday_day", "wednesday_location",
];

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const body = await req.json();

  await Promise.all(
    ALLOWED_KEYS.filter((k) => k in body).map((key) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: String(body[key]) },
        create: { key, value: String(body[key]) },
      })
    )
  );

  return NextResponse.json({ ok: true });
}
