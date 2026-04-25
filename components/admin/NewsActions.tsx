"use client";

import { useState } from "react";
import { Trash2, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  newsId: string;
  isPublished: boolean;
}

export function NewsActions({ newsId, isPublished }: Props) {
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);

  async function handleToggle() {
    setLoading(true);
    await fetch("/api/admin/news", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: newsId, isPublished: !isPublished }),
    });
    setLoading(false);
    window.location.reload();
  }

  async function handleDelete() {
    if (!confirm("هل تريد حذف هذا الخبر نهائياً؟")) return;
    setLoading(true);
    await fetch("/api/admin/news", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: newsId }),
    });
    setDeleted(true);
    setLoading(false);
    window.location.reload();
  }

  if (deleted) return null;

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggle}
        disabled={loading}
        className={`h-8 text-xs ${isPublished ? "border-orange-300 text-orange-600 hover:bg-orange-50" : "border-green-300 text-green-700 hover:bg-green-50"}`}
      >
        {isPublished ? <EyeOff className="w-3 h-3 ml-1" /> : <Eye className="w-3 h-3 ml-1" />}
        {isPublished ? "إخفاء" : "نشر"}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={handleDelete}
        disabled={loading}
        className="h-8 text-xs border-red-300 text-red-600 hover:bg-red-50"
      >
        <Trash2 className="w-3 h-3 ml-1" />
        حذف
      </Button>
    </div>
  );
}
