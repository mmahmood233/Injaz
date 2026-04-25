"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function BorrowingActions({ borrowingId }: { borrowingId: string }) {
  const [loading, setLoading] = useState(false);

  async function markReturned() {
    setLoading(true);
    await fetch("/api/admin/borrowings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: borrowingId, status: "RETURNED", returnedAt: new Date().toISOString() }),
    });
    setLoading(false);
    window.location.reload();
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={markReturned}
      disabled={loading}
      className="h-8 text-xs border-green-300 text-green-700 hover:bg-green-50"
    >
      <CheckCircle className="w-3 h-3 ml-1" />
      تم الإرجاع
    </Button>
  );
}
