import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/uploads";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "غير مصرح" }, { status: 403 });
  }

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    return NextResponse.json({ error: "لم يتم تحميل ملف" }, { status: 400 });
  }

  try {
    const url = await saveUploadedFile(file);
    return NextResponse.json({ url });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "فشل رفع الملف" },
      { status: 400 }
    );
  }
}
