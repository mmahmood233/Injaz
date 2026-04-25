import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const body = await req.json();
  const { title, content, type, isPublished, coverImageUrl } = body;

  if (!title || !content) {
    return NextResponse.json({ error: "العنوان والمحتوى مطلوبان" }, { status: 400 });
  }

  const news = await prisma.news.create({
    data: {
      title,
      content,
      type: type || "NEWS",
      isPublished: Boolean(isPublished),
      coverImageUrl: coverImageUrl || null,
      publishedAt: isPublished ? new Date() : null,
    },
  });

  await prisma.adminLog.create({
    data: { adminId: session.user.id, action: `إضافة خبر: ${title}` },
  });

  return NextResponse.json({ id: news.id });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { id, isPublished } = await req.json();
  if (!id) return NextResponse.json({ error: "معرف مطلوب" }, { status: 400 });

  await prisma.news.update({
    where: { id },
    data: { isPublished, publishedAt: isPublished ? new Date() : null },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "معرف مطلوب" }, { status: 400 });

  await prisma.news.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
