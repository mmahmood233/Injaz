"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, BookOpen, Calendar, Newspaper,
  MessageSquare, BookMarked, LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const adminLinks = [
  { href: "/admin", label: "نظرة عامة", icon: LayoutDashboard, exact: true },
  { href: "/admin/members", label: "الأعضاء", icon: Users },
  { href: "/admin/books", label: "الكتب", icon: BookOpen },
  { href: "/admin/events", label: "الفعاليات", icon: Calendar },
  { href: "/admin/news", label: "الأخبار", icon: Newspaper },
  { href: "/admin/comments", label: "التعليقات", icon: MessageSquare },
  { href: "/admin/borrowings", label: "الاستعارات", icon: BookMarked },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 min-h-screen bg-injaz-navy flex flex-col">
      {/* Logo */}
      <div className="p-5 border-b border-white/10">
        <div className="bg-white rounded-xl px-3 py-2 mb-3 flex items-center justify-center">
          <Image
            src="/images/injaz-logo.png"
            alt="INJAZ Bahrain"
            width={110}
            height={44}
            className="h-8 w-auto object-contain"
          />
        </div>
        <p className="text-center text-white/60 text-xs" style={{ fontFamily: "Cairo, sans-serif" }}>
          لوحة إدارة نادي القراءة
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {adminLinks.map((link) => {
          const isActive = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                isActive
                  ? "bg-injaz-gold text-white shadow-md"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              )}
            >
              <link.icon className="w-4 h-4 flex-shrink-0" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
