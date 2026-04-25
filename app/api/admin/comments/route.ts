import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "معرف التعليق مطلوب" }, { status: 400 });

  await prisma.bookComment.delete({ where: { id } });

  await prisma.adminLog.create({
    data: { adminId: session.user.id, action: `حذف تعليق بالمعرف: ${id}` },
  });

  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { id, isApproved } = await req.json();
  if (!id) return NextResponse.json({ error: "معرف التعليق مطلوب" }, { status: 400 });

  const comment = await prisma.bookComment.update({ where: { id }, data: { isApproved } });

  return NextResponse.json({ id: comment.id });
}
