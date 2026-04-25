"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AddNewsForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [type, setType] = useState("NEWS");
  const [isPublished, setIsPublished] = useState(true);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));

    const res = await fetch("/api/admin/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, type, isPublished }),
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
        إضافة خبر
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-injaz-navy" style={{ fontFamily: "Cairo, sans-serif" }}>إضافة خبر</h2>
          <button onClick={() => setOpen(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>عنوان الخبر *</Label>
            <Input name="title" required placeholder="عنوان الخبر" />
          </div>
          <div className="space-y-1.5">
            <Label>المحتوى *</Label>
            <Textarea name="content" required placeholder="اكتب الخبر هنا..." rows={5} />
          </div>
          <div className="space-y-1.5">
            <Label>نوع الخبر</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NEWS">خبر</SelectItem>
                <SelectItem value="COVERAGE">تغطية</SelectItem>
                <SelectItem value="ACHIEVEMENT">إنجاز</SelectItem>
                <SelectItem value="FEATURED_MEMBER">العضو المتميز</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublished"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="isPublished">نشر فوراً</Label>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-green-600">تم نشر الخبر!</p>}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1 injaz-gradient border-0 text-white">
              {loading ? "جاري الحفظ..." : "حفظ الخبر"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
