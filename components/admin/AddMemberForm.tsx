"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function AddMemberForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    const res = await fetch("/api/admin/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const json = await res.json();
      setError(json.error || "حدث خطأ");
    } else {
      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        window.location.reload();
      }, 1000);
    }
    setLoading(false);
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} className="injaz-gradient border-0 text-white">
        <Plus className="w-4 h-4 ml-1" />
        إضافة عضو
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-injaz-navy" style={{ fontFamily: "Cairo, sans-serif" }}>
            إضافة عضو جديد
          </h2>
          <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label>الاسم الكامل</Label>
            <Input name="fullName" placeholder="محمد أحمد" required />
          </div>
          <div className="space-y-1.5">
            <Label>البريد الإلكتروني</Label>
            <Input name="email" type="email" placeholder="user@example.com" dir="ltr" required />
          </div>
          <div className="space-y-1.5">
            <Label>كلمة المرور</Label>
            <Input name="password" type="password" placeholder="كلمة مرور قوية" required />
          </div>
          <div className="space-y-1.5">
            <Label>نبذة عن العضو</Label>
            <Textarea name="bio" placeholder="اكتب نبذة مختصرة..." rows={3} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-green-600">تم إضافة العضو بنجاح!</p>}

          <div className="flex gap-3 pt-2">
            <Button type="submit" disabled={loading} className="flex-1 injaz-gradient border-0 text-white">
              {loading ? "جاري الإضافة..." : "إضافة العضو"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              إلغاء
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
