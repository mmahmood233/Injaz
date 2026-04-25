import { redirect } from "next/navigation";
import Image from "next/image";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/LoginForm";

export default async function LoginPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="bg-white rounded-2xl px-6 py-4 inline-flex items-center justify-center shadow-md mb-4 border border-border/50">
            <Image
              src="/images/injaz-logo.png"
              alt="INJAZ Bahrain"
              width={140}
              height={56}
              className="h-12 w-auto object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-bold text-injaz-navy" style={{ fontFamily: "Cairo, sans-serif" }}>
            نادي إنجاز للقراءة
          </h1>
          <p className="text-muted-foreground text-sm mt-1">تسجيل دخول الأعضاء</p>
        </div>

        <div className="bg-white rounded-2xl border border-border shadow-lg p-8">
          <h2 className="text-xl font-bold text-injaz-navy mb-6 text-center" style={{ fontFamily: "Cairo, sans-serif" }}>
            تسجيل الدخول
          </h2>
          <LoginForm />
          <p className="text-xs text-center text-muted-foreground mt-6 leading-relaxed">
            العضوية في النادي بالدعوة فقط. تواصل مع الإدارة لإنشاء حسابك.
          </p>
        </div>
      </div>
    </div>
  );
}
