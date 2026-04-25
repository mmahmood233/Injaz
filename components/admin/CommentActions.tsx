"use client";

import { useState } from "react";
import { Trash2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CommentActionsProps {
  commentId: string;
  isApproved: boolean;
}

export function CommentActions({ commentId, isApproved }: CommentActionsProps) {
  const [loading, setLoading] = useState(false);
  const [deleted, setDeleted] = useState(false);

  async function handleDelete() {
    if (!confirm("هل تريد حذف هذا التعليق؟")) return;
    setLoading(true);
    await fetch("/api/admin/comments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: commentId }),
    });
    setDeleted(true);
    setLoading(false);
    window.location.reload();
  }

  async function handleToggleApproval() {
    setLoading(true);
    await fetch("/api/admin/comments", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: commentId, isApproved: !isApproved }),
    });
    setLoading(false);
    window.location.reload();
  }

  if (deleted) return null;

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggleApproval}
        disabled={loading}
        className="h-8 text-xs border-green-300 text-green-700 hover:bg-green-50"
      >
        <Check className="w-3 h-3 ml-1" />
        {isApproved ? "إلغاء الموافقة" : "موافقة"}
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
