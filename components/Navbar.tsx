"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LogOut, User, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "الرئيسية" },
  { href: "/about", label: "عن النادي" },
  { href: "/members", label: "الأعضاء" },
  { href: "/books", label: "الكتب" },
  { href: "/reviews", label: "المراجعات" },
  { href: "/events", label: "الفعاليات" },
  { href: "/news", label: "الأخبار" },
  { href: "/borrowings", label: "الاستعارة" },
];

export function Navbar() {
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = session?.user?.role === "ADMIN";
  const isLoggedIn = !!session?.user;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-injaz-blue/10 bg-white/95 backdrop-blur shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/images/injaz-logo.png"
            alt="INJAZ Bahrain"
            width={110}
            height={44}
            className="h-9 w-auto object-contain"
            priority
          />
          <div className="hidden sm:block border-r border-injaz-blue/20 pr-3">
            <p className="font-bold text-injaz-navy text-sm leading-tight" style={{ fontFamily: "Cairo, sans-serif" }}>
              نادي القراءة
            </p>
            <p className="text-xs text-injaz-gold font-medium">Reading Club</p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-injaz-navy/80 hover:text-injaz-blue rounded-md hover:bg-injaz-blue/5 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="px-3 py-2 text-sm font-medium text-injaz-gold hover:text-injaz-gold-light rounded-md hover:bg-injaz-gold/5 transition-colors flex items-center gap-1"
            >
              <LayoutDashboard className="w-4 h-4" />
              لوحة الإدارة
            </Link>
          )}
        </nav>

        {/* Auth */}
        <div className="hidden lg:flex items-center gap-2">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                <User className="w-4 h-4 inline ml-1" />
                {session.user.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="border-injaz-blue/30 text-injaz-blue hover:bg-injaz-blue hover:text-white"
              >
                <LogOut className="w-4 h-4 ml-1" />
                خروج
              </Button>
            </div>
          ) : (
            <Button asChild size="sm" className="injaz-gradient border-0 text-white">
              <Link href="/login">تسجيل الدخول</Link>
            </Button>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden p-2 rounded-md text-injaz-navy hover:bg-injaz-blue/5"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="القائمة"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={cn(
          "lg:hidden bg-white border-t border-border overflow-hidden transition-all duration-300",
          mobileOpen ? "max-h-screen py-4" : "max-h-0"
        )}
      >
        <nav className="container mx-auto px-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-3 text-sm font-medium text-injaz-navy hover:bg-injaz-blue/5 rounded-md transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {isAdmin && (
            <Link
              href="/admin"
              className="px-4 py-3 text-sm font-medium text-injaz-gold hover:bg-injaz-gold/5 rounded-md transition-colors flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <LayoutDashboard className="w-4 h-4" />
              لوحة الإدارة
            </Link>
          )}
          <div className="pt-3 border-t border-border mt-2">
            {isLoggedIn ? (
              <div className="flex flex-col gap-2 px-4">
                <p className="text-sm text-muted-foreground">مرحباً، {session.user.name}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { signOut({ callbackUrl: "/" }); setMobileOpen(false); }}
                  className="w-fit border-injaz-blue/30 text-injaz-blue"
                >
                  <LogOut className="w-4 h-4 ml-1" />
                  تسجيل الخروج
                </Button>
              </div>
            ) : (
              <div className="px-4">
                <Button asChild size="sm" className="w-full injaz-gradient border-0 text-white">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>تسجيل الدخول</Link>
                </Button>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
