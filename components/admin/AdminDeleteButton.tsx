"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  endpoint: string;
  id: string;
  label?: string;
  confirmText?: string;
}

export function AdminDeleteButton({ endpoint, id, label = "حذف", confirmText = "هل أنت متأكد من الحذف؟ لا يمكن التراجع." }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(confirmText)) return;
    setLoading(true);
    try {
      const res = await fetch(`${endpoint}?id=${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.error || "فشل الحذف");
      } else {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 transition-colors disabled:opacity-50"
      style={{ fontFamily: "Cairo, sans-serif" }}
    >
      <Trash2 className="w-3.5 h-3.5" />
      {loading ? "..." : label}
    </button>
  );
}
