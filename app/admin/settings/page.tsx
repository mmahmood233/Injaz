import { prisma } from "@/lib/prisma";
import { Settings } from "lucide-react";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";

export default async function AdminSettingsPage() {
  const rows = await prisma.siteSetting.findMany();
  const settings = Object.fromEntries(rows.map((r) => [r.key, r.value]));

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-7 h-7 text-injaz-blue" />
        <div>
          <h1 className="text-3xl font-bold text-injaz-navy" style={{ fontFamily: "Cairo, sans-serif" }}>
            إعدادات الموقع
          </h1>
          <p className="text-muted-foreground text-sm">تعديل محتوى صفحة &quot;عن النادي&quot;</p>
        </div>
      </div>

      <SiteSettingsForm settings={settings} />
    </div>
  );
}
