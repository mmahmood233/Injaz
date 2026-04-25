import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const body = await req.json();
  const { bookId, memberId, dueDate, notes } = body;

  if (!bookId || !memberId) {
    return NextResponse.json({ error: "الكتاب والعضو مطلوبان" }, { status: 400 });
  }

  const borrowing = await prisma.borrowing.create({
    data: {
      bookId,
      memberId,
      dueDate: dueDate ? new Date(dueDate) : null,
      notes: notes || null,
      status: "BORROWED",
    },
  });

  await prisma.adminLog.create({
    data: { adminId: session.user.id, action: `تسجيل استعارة جديدة للكتاب: ${bookId}` },
  });

  return NextResponse.json({ id: borrowing.id });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { id, status, returnedAt } = await req.json();
  if (!id) return NextResponse.json({ error: "معرف الاستعارة مطلوب" }, { status: 400 });

  const borrowing = await prisma.borrowing.update({
    where: { id },
    data: {
      status,
      returnedAt: returnedAt ? new Date(returnedAt) : undefined,
    },
  });

  return NextResponse.json({ id: borrowing.id });
}
