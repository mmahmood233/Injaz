import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

export async function saveUploadedFile(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("نوع الملف غير مسموح به. الأنواع المسموحة: JPG, PNG, WEBP");
  }

  if (file.size > MAX_SIZE) {
    throw new Error("حجم الملف كبير جداً. الحد الأقصى 5MB");
  }

  await mkdir(UPLOAD_DIR, { recursive: true });

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeName = `${randomUUID()}.${ext}`;
  const filePath = path.join(UPLOAD_DIR, safeName);

  const bytes = await file.arrayBuffer();
  await writeFile(filePath, Buffer.from(bytes));

  return `/uploads/${safeName}`;
}
