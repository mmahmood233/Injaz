"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Member {
  id: string;
  fullName: string;
}

interface Props {
  members: Member[];
}

export function AddNewsForm({ members }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [type, setType] = useState("NEWS");
  const [isPublished, setIsPublished] = useState(true);
  const [selectedMemberId, setSelectedMemberId] = useState("");

  function handleTypeChange(val: string) {
    setType(val);
    if (val !== "FEATURED_MEMBER") setSelectedMemberId("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const data = Object.fromEntries(new FormData(e.currentTarget));

    // Auto-set title to member name when FEATURED_MEMBER and no custom title
    const selectedMember = members.find((m) => m.id === selectedMemberId);
    const title =
      type === "FEATURED_MEMBER" && selectedMember && !String(data.title).trim()
        ? `العضو المتميز: ${selectedMember.fullName}`
        : data.title;

    const res = await fetch("/api/admin/news", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, title, type, isPublished, featuredMemberId: selectedMemberId || undefined }),
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
            <Label>نوع الخبر</Label>
            <Select value={type} onValueChange={handleTypeChange}>
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

          {/* Member picker — only when FEATURED_MEMBER */}
          {type === "FEATURED_MEMBER" && (
            <div className="space-y-1.5">
              <Label>اختر العضو *</Label>
              <Select value={selectedMemberId} onValueChange={setSelectedMemberId}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر عضواً..." />
                </SelectTrigger>
                <SelectContent>
                  {members.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                      {m.fullName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label>
              عنوان الخبر
              {type === "FEATURED_MEMBER" && selectedMemberId && (
                <span className="text-xs text-muted-foreground mr-1">(اختياري — سيُملأ تلقائياً)</span>
              )}
              {type !== "FEATURED_MEMBER" && " *"}
            </Label>
            <Input
              name="title"
              required={type !== "FEATURED_MEMBER"}
              placeholder={
                type === "FEATURED_MEMBER" && selectedMemberId
                  ? `العضو المتميز: ${members.find((m) => m.id === selectedMemberId)?.fullName ?? ""}`
                  : "عنوان الخبر"
              }
            />
          </div>

          <div className="space-y-1.5">
            <Label>المحتوى *</Label>
            <Textarea name="content" required placeholder="اكتب الخبر هنا..." rows={5} />
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
            <Button
              type="submit"
              disabled={loading || (type === "FEATURED_MEMBER" && !selectedMemberId)}
              className="flex-1 injaz-gradient border-0 text-white"
            >
              {loading ? "جاري الحفظ..." : "حفظ الخبر"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
