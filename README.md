# نادي إنجاز للقراءة — Injaz Reading Club

منصة رقمية كاملة لنادي إنجاز للقراءة، مبنية بـ Next.js 15 وTailwind CSS وPrisma وSQLite.

---

## 🚀 التثبيت والتشغيل

### 1. تثبيت المتطلبات

```bash
npm install
```

### 2. إعداد ملف البيئة

انسخ ملف `.env.example` وأعد تسميته إلى `.env`:

```bash
cp .env.example .env
```

محتوى `.env`:

```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
GOOGLE_BOOKS_API_KEY=""   # اختياري — يحسّن نتائج البحث
```

### 3. تهيئة قاعدة البيانات

```bash
npx prisma migrate dev --name init
```

### 4. زرع البيانات التجريبية

```bash
npx prisma db seed
```

### 5. تشغيل الموقع

```bash
npm run dev
```

افتح المتصفح على: **http://localhost:3000**

---

## 🔑 بيانات الدخول

| الدور | البريد الإلكتروني | كلمة المرور |
|-------|-------------------|-------------|
| **مدير** | admin@injaz-reading.local | admin123456 |
| عضو | sarah@injaz-reading.local | member123456 |
| عضو | mohammed@injaz-reading.local | member123456 |
| عضو | fatima@injaz-reading.local | member123456 |
| عضو | abdullah@injaz-reading.local | member123456 |

---

## 📚 كيفية عمل APIs الكتب

### قواعد المشروعية القانونية

- **Google Books API**: يُستخدم للبيانات الببليوغرافية (عنوان، كاتب، وصف، غلاف). رابط القراءة يُضاف فقط إذا أتاح Google Books نسخة كاملة.
- **Open Library API**: مصدر احتياطي للبيانات والأغلفة.
- **Project Gutenberg / Gutendex**: للكتب ذات الملك العام (public domain) فقط.
- **لا يُرفع أي PDF مخترق أو مقرصن على الإطلاق.**

### منطق الكتب

```
إذا كان canReadOnline = true ولديه legalReadUrl → زر "قراءة إلكترونية"
إذا كان لديه previewUrl فقط → زر "معاينة الكتاب"
لا يوجد رابط قانوني → تفاصيل الكتاب فقط + نقاش الأعضاء
```

---

## ➕ كيفية إضافة كتاب

### الإضافة من API (موصى به)

1. سجّل دخولك كمدير.
2. اذهب إلى **لوحة الإدارة → الكتب**.
3. ابحث عن الكتاب في خانة البحث.
4. اختر النتيجة المناسبة.
5. حدد التصنيف.
6. انقر "استيراد ونشر".

### الإضافة اليدوية

1. في نفس الصفحة، انقر "إضافة يدوية".
2. أدخل العنوان، الكاتب، الوصف.
3. أضف رابط القراءة القانوني إن توفّر.
4. احفظ.

---

## 🛠️ بنية المشروع

```
app/
  page.tsx              — الصفحة الرئيسية
  about/               — عن النادي
  members/             — الأعضاء
  books/               — الكتب
  reviews/             — المراجعات
  events/              — الفعاليات
  news/                — الأخبار
  borrowings/          — الاستعارة
  login/               — تسجيل الدخول
  admin/               — لوحة الإدارة (مدير فقط)

components/
  Navbar.tsx            — شريط التنقل
  Footer.tsx            — تذييل الصفحة
  BookCard.tsx          — بطاقة الكتاب
  MemberCard.tsx        — بطاقة العضو
  EventCard.tsx         — بطاقة الفعالية
  NewsCard.tsx          — بطاقة الخبر
  ReviewCard.tsx        — بطاقة المراجعة
  admin/               — مكونات لوحة الإدارة

lib/
  prisma.ts            — عميل Prisma
  auth.ts              — إعداد NextAuth
  bookApis.ts          — وظائف APIs الكتب
  permissions.ts       — صلاحيات الأدوار
  uploads.ts           — رفع الملفات المحلي
  utils.ts             — أدوات مساعدة

prisma/
  schema.prisma        — مخطط قاعدة البيانات
  seed.ts              — البيانات التجريبية
```

---

## 🔄 للانتقال من SQLite إلى PostgreSQL

1. في `prisma/schema.prisma` غيّر `provider = "sqlite"` إلى `provider = "postgresql"`.
2. حدّث `DATABASE_URL` في `.env`.
3. شغّل `npx prisma migrate dev`.

---

## 📋 الأوامر الأساسية

```bash
npm run dev              # تشغيل بيئة التطوير
npm run build            # بناء للإنتاج
npx prisma studio        # واجهة مرئية لقاعدة البيانات
npx prisma db seed       # زرع البيانات من جديد
npx prisma migrate dev   # تطبيق تغييرات المخطط
```
