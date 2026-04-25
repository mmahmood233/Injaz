"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, Download, BookOpen, Check, ExternalLink, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { BookCandidate } from "@/lib/bookApis";

interface Category {
  id: string;
  nameAr: string;
  slug: string;
}

interface BookImportPanelProps {
  categories: Category[];
}

export function BookImportPanel({ categories }: BookImportPanelProps) {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<BookCandidate[]>([]);
  const [selected, setSelected] = useState<BookCandidate | null>(null);
  const [categoryId, setCategoryId] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [publishedId, setPublishedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showManual, setShowManual] = useState(false);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    setResults([]);
    setSelected(null);
    setError("");
    try {
      const res = await fetch(`/api/books?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setResults(data.results || []);
    } catch {
      setError("فشل البحث. تحقق من الاتصال بالإنترنت.");
    }
    setSearching(false);
  }

  async function handleImport() {
    if (!selected) return;
    setPublishing(true);
    setError("");
    try {
      const res = await fetch("/api/admin/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titleAr: selected.title,
          author: selected.author,
          description: selected.description,
          coverUrl: selected.coverUrl,
          isbn: selected.isbn,
          source: selected.source,
          googleBooksId: selected.googleBooksId,
          openLibraryId: selected.openLibraryId,
          legalReadUrl: selected.legalReadUrl,
          previewUrl: selected.previewUrl,
          isPublicDomain: selected.isPublicDomain,
          canReadOnline: selected.canReadOnline,
          isPublished: true,
          categoryId: categoryId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setPublishedId(data.id);
      setSelected(null);
      setResults([]);
      setQuery("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    }
    setPublishing(false);
  }

  async function handleManualSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPublishing(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);
    try {
      const res = await fetch("/api/admin/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          isPublicDomain: data.isPublicDomain === "on",
          canReadOnline: data.canReadOnline === "on",
          isPublished: data.isPublished === "on",
          categoryId: categoryId || null,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setPublishedId(json.id);
      setShowManual(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ");
    }
    setPublishing(false);
  }

  return (
    <div className="space-y-6">
      {/* Search */}
      <Card className="border-injaz-blue/20 bg-injaz-blue/2">
        <CardContent className="p-6">
          <h2 className="text-lg font-bold text-injaz-navy mb-4 flex items-center gap-2" style={{ fontFamily: "Cairo, sans-serif" }}>
            <Search className="w-5 h-5 text-injaz-blue" />
            استيراد كتاب من API
          </h2>
          <form onSubmit={handleSearch} className="flex gap-3">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث عن كتاب بالعنوان أو الكاتب..."
              className="flex-1"
            />
            <Button type="submit" disabled={searching} className="injaz-gradient border-0 text-white">
              {searching ? "جاري البحث..." : "بحث"}
              <Search className="w-4 h-4 mr-2" />
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowManual(!showManual)}>
              <Plus className="w-4 h-4 ml-1" />
              إضافة يدوية
            </Button>
          </form>

          {/* Results */}
          {results.length > 0 && !selected && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-h-80 overflow-y-auto">
              {results.map((book, i) => (
                <button
                  key={i}
                  onClick={() => setSelected(book)}
                  className="text-right p-3 rounded-xl border border-border hover:border-injaz-blue/40 hover:bg-injaz-blue/5 transition-all flex gap-3"
                >
                  {book.coverUrl && (
                    <div className="relative w-12 h-16 flex-shrink-0 rounded overflow-hidden">
                      <Image src={book.coverUrl} alt={book.title} fill className="object-cover" sizes="48px" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-injaz-navy text-sm line-clamp-1">{book.title}</p>
                    <p className="text-xs text-muted-foreground">{book.author}</p>
                    <div className="flex gap-1 mt-1">
                      <Badge variant="outline" className="text-xs py-0">{book.source === "google" ? "Google Books" : book.source === "openlibrary" ? "Open Library" : "Gutendex"}</Badge>
                      {book.canReadOnline && <Badge variant="success" className="text-xs py-0">متاح</Badge>}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.length === 0 && query && !searching && (
            <p className="text-sm text-muted-foreground mt-3">لا توجد نتائج. جرّب بحثاً مختلفاً.</p>
          )}

          {/* Selected book preview */}
          {selected && (
            <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200">
              <div className="flex gap-4">
                {selected.coverUrl && (
                  <div className="relative w-16 h-24 flex-shrink-0 rounded overflow-hidden shadow">
                    <Image src={selected.coverUrl} alt={selected.title} fill className="object-cover" sizes="64px" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-bold text-injaz-navy" style={{ fontFamily: "Cairo, sans-serif" }}>{selected.title}</h3>
                  <p className="text-sm text-muted-foreground mb-1">{selected.author}</p>
                  {selected.description && <p className="text-xs text-muted-foreground line-clamp-2">{selected.description}</p>}
                  <div className="flex flex-wrap gap-1 mt-2">
                    {selected.isPublicDomain && <Badge variant="secondary" className="text-xs">ملك عام</Badge>}
                    {selected.canReadOnline && selected.legalReadUrl && (
                      <a href={selected.legalReadUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 flex items-center gap-1 hover:underline">
                        <ExternalLink className="w-3 h-3" /> رابط القراءة
                      </a>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-3 items-end">
                <div className="space-y-1">
                  <Label className="text-xs">التصنيف</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger className="w-48 h-8 text-xs">
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.nameAr}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleImport} disabled={publishing} className="h-8 text-sm bg-green-600 hover:bg-green-700 text-white border-0">
                  <Download className="w-4 h-4 ml-1" />
                  {publishing ? "جاري الاستيراد..." : "استيراد ونشر"}
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setSelected(null)}>
                  إلغاء
                </Button>
              </div>
            </div>
          )}

          {publishedId && (
            <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200 flex items-center gap-2 text-sm text-green-700">
              <Check className="w-4 h-4" />
              تم نشر الكتاب بنجاح!{" "}
              <a href={`/books/${publishedId}`} className="underline" target="_blank" rel="noopener noreferrer">
                عرض الكتاب
              </a>
            </div>
          )}

          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </CardContent>
      </Card>

      {/* Manual Add Form */}
      {showManual && (
        <Card className="border-border/60">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-injaz-navy mb-4" style={{ fontFamily: "Cairo, sans-serif" }}>
              إضافة كتاب يدوياً
            </h3>
            <form onSubmit={handleManualSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>عنوان الكتاب بالعربية *</Label>
                <Input name="titleAr" required placeholder="عنوان الكتاب" />
              </div>
              <div className="space-y-1.5">
                <Label>اسم المؤلف *</Label>
                <Input name="author" required placeholder="اسم الكاتب" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label>وصف الكتاب</Label>
                <Textarea name="description" placeholder="نبذة عن الكتاب..." rows={3} />
              </div>
              <div className="space-y-1.5">
                <Label>رابط غلاف الكتاب</Label>
                <Input name="coverUrl" placeholder="https://..." dir="ltr" />
              </div>
              <div className="space-y-1.5">
                <Label>رابط القراءة القانوني</Label>
                <Input name="legalReadUrl" placeholder="https://..." dir="ltr" />
              </div>
              <div className="space-y-1.5">
                <Label>ISBN</Label>
                <Input name="isbn" placeholder="9789..." dir="ltr" />
              </div>
              <div className="space-y-1.5">
                <Label>التصنيف</Label>
                <Select value={categoryId} onValueChange={setCategoryId}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر التصنيف" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.nameAr}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 flex flex-wrap gap-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" name="canReadOnline" className="rounded" />
                  متاح للقراءة الإلكترونية
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" name="isPublicDomain" className="rounded" />
                  ملك عام (Public Domain)
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" name="isPublished" className="rounded" defaultChecked />
                  نشر فوراً
                </label>
              </div>
              <div className="md:col-span-2 flex gap-3">
                <Button type="submit" disabled={publishing} className="injaz-gradient border-0 text-white">
                  {publishing ? "جاري الحفظ..." : "حفظ الكتاب"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowManual(false)}>
                  إلغاء
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
