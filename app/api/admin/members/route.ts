import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const { fullName, email, password, bio } = await req.json();
  if (!fullName || !email || !password) {
    return NextResponse.json({ error: "بيانات ناقصة" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "البريد الإلكتروني مستخدم بالفعل" }, { status: 409 });
  }

  const hashed = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: { fullName, email, password: hashed, bio: bio || null, role: "MEMBER" },
  });

  await prisma.adminLog.create({
    data: { adminId: session.user.id, action: `إضافة عضو جديد: ${fullName}` },
  });

  return NextResponse.json({ id: user.id });
}
