"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function AddEventForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [status, setStatus] = useState("UPCOMING");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = Object.fromEntries(new FormData(e.currentTarget));

    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, status }),
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
        إضافة فعالية
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-injaz-navy" style={{ fontFamily: "Cairo, sans-serif" }}>إضافة فعالية</h2>
          <button onClick={() => setOpen(false)}><X className="w-5 h-5 text-muted-foreground" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>عنوان الفعالية *</Label>
            <Input name="title" required placeholder="لقاء الأربعاء الثقافي" />
          </div>
          <div className="space-y-1.5">
            <Label>الوصف</Label>
            <Textarea name="description" placeholder="وصف الفعالية..." rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>التاريخ *</Label>
              <Input name="eventDate" type="date" required />
            </div>
            <div className="space-y-1.5">
              <Label>الشهر</Label>
              <Input name="month" placeholder="مايو 2025" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>وقت البدء</Label>
              <Input name="startTime" placeholder="٦:٠٠ م" />
            </div>
            <div className="space-y-1.5">
              <Label>وقت الانتهاء</Label>
              <Input name="endTime" placeholder="٨:٠٠ م" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>المكان</Label>
            <Input name="location" placeholder="مقر إنجاز البحرين" />
          </div>
          <div className="space-y-1.5">
            <Label>الحالة</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UPCOMING">قادمة</SelectItem>
                <SelectItem value="PAST">منتهية</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-green-600">تم إضافة الفعالية!</p>}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1 injaz-gradient border-0 text-white">
              {loading ? "جاري الحفظ..." : "حفظ الفعالية"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>إلغاء</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
