import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-injaz-navy text-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-4 mb-5">
              <div className="bg-white rounded-xl px-3 py-2 shadow-md">
                <Image
                  src="/images/injaz-logo.png"
                  alt="INJAZ Bahrain"
                  width={110}
                  height={44}
                  className="h-9 w-auto object-contain"
                />
              </div>
              <div className="border-r border-white/20 pr-4">
                <p className="font-bold text-lg text-white" style={{ fontFamily: "Cairo, sans-serif" }}>
                  نادي القراءة
                </p>
                <p className="text-white/50 text-xs">Reading Club</p>
              </div>
            </div>
            <p className="text-white/70 text-sm leading-relaxed max-w-sm">
              مساحة عربية للقراءة والحوار وصناعة أثر ثقافي مستدام. نجمع محبي الكتب في بيئة ثقافية تفاعلية تنمي عادة القراءة وتبني مجتمعاً قرائياً واعياً.
            </p>
            <div className="flex items-center gap-2 mt-4 p-3 bg-white/5 rounded-lg border border-white/10 w-fit">
              <div className="w-1 h-8 bg-injaz-gold rounded-full"></div>
              <p className="text-white/80 text-sm italic">
                "نقرأ لنفهم، نتحاور لننمو"
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-injaz-gold mb-4">
              روابط سريعة
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/about", label: "عن النادي" },
                { href: "/members", label: "الأعضاء" },
                { href: "/books", label: "الكتب" },
                { href: "/events", label: "الفعاليات" },
                { href: "/news", label: "الأخبار" },
                { href: "/reviews", label: "المراجعات" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-white text-sm transition-colors hover:text-injaz-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider text-injaz-gold mb-4">
              تواصل معنا
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-injaz-gold flex-shrink-0" />
                <span>مقر إنجاز البحرين، المنامة، مملكة البحرين</span>
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Mail className="w-4 h-4 text-injaz-gold flex-shrink-0" />
                <span>reading@injaz.org.bh</span>
              </li>
              <li className="flex items-center gap-2 text-white/60 text-sm">
                <Phone className="w-4 h-4 text-injaz-gold flex-shrink-0" />
                <span dir="ltr">+973 1700 0000</span>
              </li>
            </ul>

            <div className="mt-6">
              <h4 className="text-xs text-white/40 mb-2">تابعونا</h4>
              <div className="flex gap-2">
                {["إكس", "إنستغرام", "لينكدإن"].map((platform) => (
                  <span
                    key={platform}
                    className="px-3 py-1 bg-white/10 hover:bg-injaz-gold/20 border border-white/10 rounded-full text-xs text-white/70 hover:text-white cursor-pointer transition-colors"
                  >
                    {platform}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-white/10 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} نادي إنجاز للقراءة — جميع الحقوق محفوظة
          </p>
          <p className="text-white/30 text-xs flex items-center gap-1">
            صُنع بـ <Heart className="w-3 h-3 text-red-400 fill-red-400" /> لمحبي الكتب
          </p>
        </div>
      </div>
    </footer>
  );
}
