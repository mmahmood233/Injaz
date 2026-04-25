"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

interface CommentFormProps {
  bookId: string;
}

export function CommentForm({ bookId }: CommentFormProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, commentText: text }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "حدث خطأ");
      }
      setText("");
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        window.location.reload();
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="شارك رأيك في هذا الكتاب..."
        className="mb-3 resize-none"
        rows={3}
      />
      {error && <p className="text-sm text-destructive mb-2">{error}</p>}
      {success && <p className="text-sm text-green-600 mb-2">تم إضافة تعليقك بنجاح!</p>}
      <Button
        type="submit"
        size="sm"
        disabled={loading || !text.trim()}
        className="injaz-gradient border-0 text-white"
      >
        <Send className="w-4 h-4 ml-1" />
        {loading ? "جاري الإرسال..." : "إرسال التعليق"}
      </Button>
    </form>
  );
}
