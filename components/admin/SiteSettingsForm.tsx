"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, Check } from "lucide-react";

interface Props {
  settings: Record<string, string>;
}

export function SiteSettingsForm({ settings }: Props) {
  const [values, setValues] = useState<Record<string, string>>(settings);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function set(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) {
      const json = await res.json();
      setError(json.error || "حدث خطأ");
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
      {/* من نحن */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-injaz-navy border-b border-border pb-2" style={{ fontFamily: "Cairo, sans-serif" }}>
          قسم &quot;من نحن&quot;
        </h2>
        {(["about_p1", "about_p2", "about_p3"] as const).map((key, i) => (
          <div key={key} className="space-y-1.5">
            <Label>الفقرة {i + 1}</Label>
            <Textarea
              value={values[key] ?? ""}
              onChange={(e) => set(key, e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
        ))}
      </section>

      {/* الرؤية والرسالة */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-injaz-navy border-b border-border pb-2" style={{ fontFamily: "Cairo, sans-serif" }}>
          الرؤية والرسالة
        </h2>
        <div className="space-y-1.5">
          <Label>رؤيتنا</Label>
          <Textarea
            value={values.vision ?? ""}
            onChange={(e) => set("vision", e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>
        <div className="space-y-1.5">
          <Label>رسالتنا</Label>
          <Textarea
            value={values.mission ?? ""}
            onChange={(e) => set("mission", e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>
      </section>

      {/* لقاء الأربعاء */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-injaz-navy border-b border-border pb-2" style={{ fontFamily: "Cairo, sans-serif" }}>
          لقاء الأربعاء الثقافي
        </h2>
        <div className="space-y-1.5">
          <Label>وصف اللقاء</Label>
          <Textarea
            value={values.wednesday_desc ?? ""}
            onChange={(e) => set("wednesday_desc", e.target.value)}
            rows={3}
            className="resize-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label>الوقت</Label>
            <Input
              value={values.wednesday_time ?? ""}
              onChange={(e) => set("wednesday_time", e.target.value)}
              placeholder="٦:٠٠ — ٨:٠٠ مساءً"
            />
          </div>
          <div className="space-y-1.5">
            <Label>الموعد</Label>
            <Input
              value={values.wednesday_day ?? ""}
              onChange={(e) => set("wednesday_day", e.target.value)}
              placeholder="كل يوم أربعاء"
            />
          </div>
          <div className="space-y-1.5">
            <Label>المكان</Label>
            <Input
              value={values.wednesday_location ?? ""}
              onChange={(e) => set("wednesday_location", e.target.value)}
              placeholder="مقر إنجاز البحرين"
            />
          </div>
        </div>
      </section>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button
        type="submit"
        disabled={loading}
        className="injaz-gradient border-0 text-white px-8"
      >
        {saved ? (
          <>
            <Check className="w-4 h-4 ml-2" />
            تم الحفظ
          </>
        ) : (
          <>
            <Save className="w-4 h-4 ml-2" />
            {loading ? "جاري الحفظ..." : "حفظ التغييرات"}
          </>
        )}
      </Button>
    </form>
  );
}
