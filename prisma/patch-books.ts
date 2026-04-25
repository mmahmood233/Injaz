/**
 * Patches existing book records with:
 * 1. Real cover images fetched from Google Books / Open Library
 * 2. Curated legal reading links from Hindawi, Wikisource, Archive.org
 *
 * Run: npx tsx prisma/patch-books.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ─── Curated legal reading data ───────────────────────────────────────────────
// Sources used:
//   hindawi.org   — publishes classic Arabic books under open license (legal, free)
//   ar.wikisource.org — public-domain Arabic texts
//   archive.org   — public-domain scans
//   gutenberg.org — public-domain ebooks

interface BookPatch {
  titleAr: string;
  coverUrl?: string;
  legalReadUrl?: string;
  previewUrl?: string;
  canReadOnline: boolean;
  isPublicDomain: boolean;
  googleBooksQuery?: string; // fallback: search this if coverUrl is missing
}

const BOOK_PATCHES: BookPatch[] = [
  {
    titleAr: "الأيام",
    // Hindawi publishes الأيام legally (طه حسين donated it to public domain via Hindawi)
    legalReadUrl: "https://www.hindawi.org/books/76962067/",
    canReadOnline: true,
    isPublicDomain: true,
    googleBooksQuery: "الأيام طه حسين",
  },
  {
    titleAr: "كليلة ودمنة",
    legalReadUrl: "https://ar.wikisource.org/wiki/%D9%83%D9%84%D9%8A%D9%84%D8%A9_%D9%88%D8%AF%D9%85%D9%86%D8%A9",
    canReadOnline: true,
    isPublicDomain: true,
    googleBooksQuery: "كليلة ودمنة ابن المقفع",
  },
  {
    titleAr: "مقدمة ابن خلدون",
    legalReadUrl: "https://ar.wikisource.org/wiki/%D9%85%D9%82%D8%AF%D9%85%D8%A9_%D8%A7%D8%A8%D9%86_%D8%AE%D9%84%D8%AF%D9%88%D9%86",
    canReadOnline: true,
    isPublicDomain: true,
    googleBooksQuery: "مقدمة ابن خلدون",
  },
  {
    titleAr: "موسم الهجرة إلى الشمال",
    // Copyrighted — legal preview via Google Books
    previewUrl: "https://www.google.com/books/edition/%D9%85%D9%88%D8%B3%D9%85_%D8%A7%D9%84%D9%87%D8%AC%D8%B1%D8%A9_%D8%A5%D9%84%D9%89_%D8%A7%D9%84%D8%B4%D9%85%D8%A7/1CQKAQAAMAAJ",
    canReadOnline: false,
    isPublicDomain: false,
    googleBooksQuery: "موسم الهجرة إلى الشمال الطيب صالح",
  },
  {
    titleAr: "رجال في الشمس",
    // Copyrighted — link to publisher page as reference
    previewUrl: "https://www.google.com/books/edition/%D8%B1%D8%AC%D8%A7%D9%84_%D9%81%D9%8A_%D8%A7%D9%84%D8%B4%D9%85%D8%B3/gp_EAQAAIAAJ",
    canReadOnline: false,
    isPublicDomain: false,
    googleBooksQuery: "رجال في الشمس غسان كنفاني",
  },
  {
    titleAr: "في الشعر الجاهلي",
    legalReadUrl: "https://www.hindawi.org/books/82099957/",
    canReadOnline: true,
    isPublicDomain: true,
    googleBooksQuery: "في الشعر الجاهلي طه حسين",
  },
  {
    titleAr: "أسرار البلاغة",
    legalReadUrl: "https://ar.wikisource.org/wiki/%D8%A3%D8%B3%D8%B1%D8%A7%D8%B1_%D8%A7%D9%84%D8%A8%D9%84%D8%A7%D8%BA%D8%A9",
    canReadOnline: true,
    isPublicDomain: true,
    googleBooksQuery: "أسرار البلاغة الجرجاني",
  },
  {
    titleAr: "الأمير الصغير",
    // Copyrighted translation
    previewUrl: "https://www.google.com/books/edition/%D8%A7%D9%84%D8%A3%D9%85%D9%8A%D8%B1_%D8%A7%D9%84%D8%B5%D8%BA%D9%8A%D8%B1/Vu0XAQAAIAAJ",
    canReadOnline: false,
    isPublicDomain: false,
    googleBooksQuery: "الأمير الصغير سانت اكزوبيري عربي",
  },
];

// ─── Google Books cover fetcher ────────────────────────────────────────────────
async function fetchGoogleBooksCover(query: string): Promise<string | null> {
  try {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const url = apiKey
      ? `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5&key=${apiKey}`
      : `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=5`;

    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    if (!data.items?.length) return null;

    for (const item of data.items) {
      const thumb =
        item.volumeInfo?.imageLinks?.thumbnail ||
        item.volumeInfo?.imageLinks?.smallThumbnail;
      if (thumb) {
        // Force HTTPS and higher resolution
        return thumb
          .replace("http://", "https://")
          .replace("zoom=1", "zoom=3")
          .replace("&edge=curl", "");
      }
    }
    return null;
  } catch {
    return null;
  }
}

// ─── Open Library cover fetcher (by ISBN) ─────────────────────────────────────
async function fetchOpenLibraryCover(isbn: string): Promise<string | null> {
  const url = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;
  try {
    const res = await fetch(url, { method: "HEAD" });
    if (res.ok && res.status === 200) {
      return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
    }
    return null;
  } catch {
    return null;
  }
}

// ─── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("📚 بدء تحديث بيانات الكتب...\n");

  const books = await prisma.book.findMany();

  for (const book of books) {
    const patch = BOOK_PATCHES.find((p) => p.titleAr === book.titleAr);
    if (!patch) {
      console.log(`⏭️  لم يُعثر على بيانات لـ: ${book.titleAr}`);
      continue;
    }

    console.log(`🔍 معالجة: ${book.titleAr}`);

    // ── Cover: try existing → Open Library by ISBN → Google Books ──
    let coverUrl = book.coverUrl;

    if (!coverUrl && book.isbn) {
      console.log(`   جاري البحث في Open Library بالـ ISBN: ${book.isbn}`);
      coverUrl = await fetchOpenLibraryCover(book.isbn);
      if (coverUrl) console.log(`   ✅ غلاف من Open Library`);
    }

    if (!coverUrl && patch.googleBooksQuery) {
      console.log(`   جاري البحث في Google Books: "${patch.googleBooksQuery}"`);
      coverUrl = await fetchGoogleBooksCover(patch.googleBooksQuery);
      if (coverUrl) console.log(`   ✅ غلاف من Google Books`);
    }

    if (!coverUrl) {
      console.log(`   ⚠️  لم يُعثر على غلاف`);
    }

    // ── Update the record ──
    await prisma.book.update({
      where: { id: book.id },
      data: {
        coverUrl: coverUrl ?? book.coverUrl,
        legalReadUrl: patch.legalReadUrl ?? book.legalReadUrl,
        previewUrl: patch.previewUrl ?? book.previewUrl,
        canReadOnline: patch.canReadOnline,
        isPublicDomain: patch.isPublicDomain,
      },
    });

    const status = patch.canReadOnline
      ? "🟢 قراءة كاملة"
      : patch.previewUrl
      ? "🔵 معاينة"
      : "⚪ تفاصيل فقط";

    console.log(`   ${status} — ${patch.legalReadUrl ?? patch.previewUrl ?? "لا رابط"}`);
    console.log();

    // Small delay to be polite to APIs
    await new Promise((r) => setTimeout(r, 400));
  }

  console.log("🎉 اكتمل تحديث الكتب!\n");

  // Summary
  const updated = await prisma.book.findMany();
  const withCover    = updated.filter((b) => b.coverUrl).length;
  const canRead      = updated.filter((b) => b.canReadOnline).length;
  const hasPreview   = updated.filter((b) => b.previewUrl && !b.canReadOnline).length;

  console.log("📊 ملخص:");
  console.log(`   ${withCover}/${updated.length} كتاب لديه غلاف`);
  console.log(`   ${canRead}/${updated.length} كتاب متاح للقراءة الكاملة`);
  console.log(`   ${hasPreview}/${updated.length} كتاب يملك معاينة`);
}

main()
  .catch((e) => { console.error("❌ خطأ:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
