import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const body = await req.json();
  const {
    titleAr, author, description, coverUrl, isbn, source,
    googleBooksId, openLibraryId, legalReadUrl, previewUrl,
    isPublicDomain, canReadOnline, isPublished, categoryId,
  } = body;

  if (!titleAr || !author) {
    return NextResponse.json({ error: "العنوان والكاتب مطلوبان" }, { status: 400 });
  }

  const book = await prisma.book.create({
    data: {
      titleAr,
      author,
      description: description || null,
      coverUrl: coverUrl || null,
      isbn: isbn || null,
      source: source || null,
      googleBooksId: googleBooksId || null,
      openLibraryId: openLibraryId || null,
      legalReadUrl: legalReadUrl || null,
      previewUrl: previewUrl || null,
      isPublicDomain: Boolean(isPublicDomain),
      canReadOnline: Boolean(canReadOnline),
      isPublished: Boolean(isPublished),
      categoryId: categoryId || null,
    },
  });

  await prisma.adminLog.create({
    data: { adminId: session.user.id, action: `إضافة كتاب: ${titleAr}` },
  });

  return NextResponse.json({ id: book.id });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const body = await req.json();
  const { id, ...data } = body;
  if (!id) return NextResponse.json({ error: "معرّف الكتاب مطلوب" }, { status: 400 });

  const book = await prisma.book.update({ where: { id }, data });

  await prisma.adminLog.create({
    data: { adminId: session.user.id, action: `تعديل كتاب: ${book.titleAr}` },
  });

  return NextResponse.json({ id: book.id });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "معرّف الكتاب مطلوب" }, { status: 400 });

  const book = await prisma.book.findUnique({ where: { id } });
  if (!book) return NextResponse.json({ error: "الكتاب غير موجود" }, { status: 404 });

  await prisma.memberBook.deleteMany({ where: { bookId: id } });
  await prisma.bookReview.deleteMany({ where: { bookId: id } });
  await prisma.bookComment.deleteMany({ where: { bookId: id } });
  await prisma.borrowing.deleteMany({ where: { bookId: id } });
  await prisma.book.delete({ where: { id } });

  await prisma.adminLog.create({
    data: { adminId: session.user.id, action: `حذف كتاب: ${book.titleAr}` },
  });

  return NextResponse.json({ success: true });
}
