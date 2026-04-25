export interface BookCandidate {
  title: string;
  author: string;
  description?: string;
  coverUrl?: string;
  isbn?: string;
  source: "google" | "openlibrary" | "gutendex";
  googleBooksId?: string;
  openLibraryId?: string;
  legalReadUrl?: string;
  previewUrl?: string;
  isPublicDomain: boolean;
  canReadOnline: boolean;
}

interface GoogleBookVolume {
  id: string;
  volumeInfo: {
    title?: string;
    authors?: string[];
    description?: string;
    categories?: string[];
    imageLinks?: { thumbnail?: string; smallThumbnail?: string };
    previewLink?: string;
    industryIdentifiers?: Array<{ type: string; identifier: string }>;
  };
  accessInfo?: {
    webReaderLink?: string;
    viewability?: string;
    publicDomain?: boolean;
  };
}

interface OpenLibraryDoc {
  key?: string;
  title?: string;
  author_name?: string[];
  isbn?: string[];
  cover_i?: number;
  first_publish_year?: number;
}

interface GutendexBook {
  id: number;
  title?: string;
  authors?: Array<{ name?: string }>;
  formats?: Record<string, string>;
  subjects?: string[];
}

export async function searchGoogleBooks(query: string): Promise<BookCandidate[]> {
  try {
    const apiKey = process.env.GOOGLE_BOOKS_API_KEY;
    const url = apiKey
      ? `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10&key=${apiKey}`
      : `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=10`;

    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();

    if (!data.items) return [];
    return data.items.map((item: GoogleBookVolume) => normalizeGoogleBookResult(item));
  } catch {
    return [];
  }
}

export function normalizeGoogleBookResult(item: GoogleBookVolume): BookCandidate {
  const v = item.volumeInfo;
  const access = item.accessInfo;

  const isbn =
    v.industryIdentifiers?.find((i) => i.type === "ISBN_13")?.identifier ||
    v.industryIdentifiers?.find((i) => i.type === "ISBN_10")?.identifier;

  let coverUrl = v.imageLinks?.thumbnail || v.imageLinks?.smallThumbnail;
  if (coverUrl) coverUrl = coverUrl.replace("http://", "https://");

  const isPublicDomain = access?.publicDomain ?? false;
  const viewability = access?.viewability;
  const canReadOnline = viewability === "ALL_PAGES" || isPublicDomain;

  const legalReadUrl =
    canReadOnline && access?.webReaderLink ? access.webReaderLink : undefined;
  const previewUrl =
    viewability === "PARTIAL" || viewability === "ALL_PAGES"
      ? v.previewLink
      : undefined;

  return {
    title: v.title || "بدون عنوان",
    author: v.authors?.join("، ") || "مجهول",
    description: v.description,
    coverUrl,
    isbn,
    source: "google",
    googleBooksId: item.id,
    legalReadUrl: legalReadUrl || undefined,
    previewUrl: previewUrl || undefined,
    isPublicDomain,
    canReadOnline,
  };
}

export async function searchOpenLibrary(query: string): Promise<BookCandidate[]> {
  try {
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(query)}&limit=10&lang=ara`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.docs) return [];
    return data.docs.map((doc: OpenLibraryDoc) => normalizeOpenLibraryResult(doc));
  } catch {
    return [];
  }
}

export function normalizeOpenLibraryResult(doc: OpenLibraryDoc): BookCandidate {
  const isbn = doc.isbn?.[0];
  const coverUrl = doc.cover_i
    ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
    : undefined;

  const olKey = doc.key?.replace("/works/", "") || "";
  const legalReadUrl = olKey
    ? `https://openlibrary.org/works/${olKey}`
    : undefined;

  return {
    title: doc.title || "بدون عنوان",
    author: doc.author_name?.join("، ") || "مجهول",
    coverUrl,
    isbn,
    source: "openlibrary",
    openLibraryId: doc.key,
    legalReadUrl,
    isPublicDomain: false,
    canReadOnline: false,
  };
}

export async function getOpenLibraryCoverByISBN(isbn: string): Promise<string | null> {
  const url = `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg?default=false`;
  try {
    const res = await fetch(url, { method: "HEAD" });
    if (res.ok) return `https://covers.openlibrary.org/b/isbn/${isbn}-L.jpg`;
    return null;
  } catch {
    return null;
  }
}

export async function searchGutendex(query: string): Promise<BookCandidate[]> {
  try {
    const url = `https://gutendex.com/books/?search=${encodeURIComponent(query)}&languages=ar`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (!data.results) return [];

    return data.results.map((book: GutendexBook) => {
      const formats = book.formats || {};
      const readUrl =
        formats["text/html"] ||
        formats["application/epub+zip"] ||
        undefined;

      return {
        title: book.title || "بدون عنوان",
        author: book.authors?.map((a) => a.name).join("، ") || "مجهول",
        source: "gutendex" as const,
        legalReadUrl: readUrl,
        isPublicDomain: true,
        canReadOnline: !!readUrl,
      };
    });
  } catch {
    return [];
  }
}

export async function importBookCandidate(candidate: BookCandidate) {
  return {
    titleAr: candidate.title,
    author: candidate.author,
    description: candidate.description || null,
    coverUrl: candidate.coverUrl || null,
    isbn: candidate.isbn || null,
    source: candidate.source,
    googleBooksId: candidate.googleBooksId || null,
    openLibraryId: candidate.openLibraryId || null,
    legalReadUrl: candidate.legalReadUrl || null,
    previewUrl: candidate.previewUrl || null,
    isPublicDomain: candidate.isPublicDomain,
    canReadOnline: candidate.canReadOnline,
    isPublished: false,
  };
}
