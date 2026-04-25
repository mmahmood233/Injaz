import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "نادي إنجاز للقراءة",
  description:
    "مساحة عربية للقراءة والحوار وصناعة أثر ثقافي مستدام. نادي قراءة عربي يجمع المحبين للأدب والمعرفة.",
  keywords: ["نادي القراءة", "إنجاز", "البحرين", "الأدب العربي", "قراءة"],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen flex flex-col bg-background font-arabic antialiased">
        <SessionProvider session={session}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
