import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "يجب تسجيل الدخول أولاً" }, { status: 401 });
  }

  const role = session.user.role;
  if (role !== "MEMBER" && role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { bookId, commentText } = await req.json();
  if (!bookId || !commentText?.trim()) {
    return NextResponse.json({ error: "بيانات غير مكتملة" }, { status: 400 });
  }

  const comment = await prisma.bookComment.create({
    data: {
      bookId,
      memberId: session.user.id,
      commentText: commentText.trim(),
      isApproved: true,
    },
  });

  return NextResponse.json(comment);
}
