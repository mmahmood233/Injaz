"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Book { id: string; titleAr: string; }
interface Member { id: string; fullName: string; }

export function AddBorrowingForm({ books, members }: { books: Book[]; members: Member[] }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [bookId, setBookId] = useState("");
  const [memberId, setMemberId] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));

    const res = await fetch("/api/admin/borrowings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, bookId, memberId }),
    });

    if (!res.ok) {
      const json = await res.json();
      setError(json.error || "حدث خطأ");
    } else {
      setSuccess(true);
      setTimeout(() => { setOpen(false); setSuccess(false); window.location.reload(); }, 1000);
    }
    setLoading(false);
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="injaz-gradient border-0 text-white">
        <Plus className="w-4 h-4 ml-1" />
        تسجيل استعارة
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-injaz-navy" style={{ fontFamily: "Cairo, sans-serif" }}>تسجيل استعارة</h2>
          <button onClick={() => setOpen(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>الكتاب *</Label>
            <Select value={bookId} onValueChange={setBookId} required>
              <SelectTrigger><SelectValue placeholder="اختر الكتاب" /></SelectTrigger>
              <SelectContent>
                {books.map((b) => <SelectItem key={b.id} value={b.id}>{b.titleAr}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>العضو *</Label>
            <Select value={memberId} onValueChange={setMemberId} required>
              <SelectTrigger><SelectValue placeholder="اختر العضو" /></SelectTrigger>
              <SelectContent>
                {members.map((m) => <SelectItem key={m.id} value={m.id}>{m.fullName}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>تاريخ الإرجاع المتوقع</Label>
            <Input name="dueDate" type="date" />
          </div>
          <div className="space-y-1.5">
            <Label>ملاحظات</Label>
            <Input name="notes" placeholder="ملاحظات اختيارية" />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-green-600">تم التسجيل!</p>}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading || !bookId || !memberId} className="flex-1 injaz-gradient border-0 text-white">
              {loading ? "جاري الحفظ..." : "تسجيل"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
