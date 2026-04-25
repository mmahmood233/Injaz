import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 بدء زرع البيانات...");

  // Categories
  const categories = [
    { nameAr: "الأدب", slug: "literature" },
    { nameAr: "الروايات", slug: "novels" },
    { nameAr: "الشعر", slug: "poetry" },
    { nameAr: "الفكر", slug: "thought" },
    { nameAr: "التاريخ", slug: "history" },
    { nameAr: "التنمية الذاتية", slug: "self-development" },
    { nameAr: "العلوم", slug: "science" },
    { nameAr: "الفلسفة", slug: "philosophy" },
    { nameAr: "السيرة", slug: "biography" },
    { nameAr: "الثقافة العامة", slug: "general-culture" },
    { nameAr: "كتب الشباب", slug: "youth" },
    { nameAr: "الأعمال والقيادة", slug: "business-leadership" },
  ];

  const createdCategories: Record<string, string> = {};
  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
    createdCategories[cat.slug] = created.id;
  }
  console.log("✅ تم إنشاء التصنيفات");

  // Admin
  const adminPassword = await bcrypt.hash("admin123456", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@injaz-reading.local" },
    update: {},
    create: {
      email: "admin@injaz-reading.local",
      password: adminPassword,
      fullName: "مدير النادي",
      role: "ADMIN",
      bio: "مدير نادي إنجاز للقراءة",
      avatarUrl: null,
    },
  });
  console.log("✅ تم إنشاء حساب المدير");

  // Members
  const memberPassword = await bcrypt.hash("member123456", 12);
  const members = [
    {
      email: "sarah@injaz-reading.local",
      fullName: "سارة أحمد",
      bio: "مهتمة بالأدب العربي الكلاسيكي والرواية المعاصرة. تؤمن أن القراءة هي نافذة على عوالم لا تنتهي.",
      avatarUrl: null,
    },
    {
      email: "mohammed@injaz-reading.local",
      fullName: "محمد علي",
      bio: "شغوف بكتب الفكر والفلسفة والتاريخ الإسلامي. يرى في القراءة سبيلاً للنمو الشخصي والمعرفة.",
      avatarUrl: null,
    },
    {
      email: "fatima@injaz-reading.local",
      fullName: "فاطمة حسن",
      bio: "تعشق الشعر العربي والقصة القصيرة. تشارك بنشاط في جلسات النقاش الأسبوعية.",
      avatarUrl: null,
    },
    {
      email: "abdullah@injaz-reading.local",
      fullName: "عبدالله خالد",
      bio: "باحث في التاريخ والحضارات. مهتم بكتب التنمية الذاتية والقيادة.",
      avatarUrl: null,
    },
  ];

  const createdMembers = [];
  for (const member of members) {
    const created = await prisma.user.upsert({
      where: { email: member.email },
      update: {},
      create: { ...member, password: memberPassword, role: "MEMBER" },
    });
    createdMembers.push(created);
  }
  console.log("✅ تم إنشاء الأعضاء");

  // Books
  const books = [
    {
      titleAr: "الأيام",
      titleOriginal: "Al-Ayyam",
      author: "طه حسين",
      description:
        "سيرة ذاتية رائعة للأديب العربي الكبير طه حسين، يروي فيها حياته منذ طفولته في الصعيد المصري وكفاحه ضد الإعاقة البصرية حتى أصبح عميداً للأدب العربي. عمل أدبي خالد يصف واقع مصر في مطلع القرن العشرين بأسلوب شعري رفيع.",
      categorySlug: "biography",
      isbn: "9789770915042",
      source: "تراث عربي",
      legalReadUrl: null,
      previewUrl: null,
      isPublicDomain: true,
      canReadOnline: false,
    },
    {
      titleAr: "كليلة ودمنة",
      titleOriginal: "Kalila wa Dimna",
      author: "ابن المقفع",
      description:
        "أحد أعظم كتب التراث العربي، ترجمه ابن المقفع من الفارسية عن أصل هندي. يضم حكايات رمزية على ألسنة الحيوانات تحمل حكماً سياسية وأخلاقية عميقة. يُعدّ من أوائل كتب الأدب العربي النثري وأكثرها تأثيراً.",
      categorySlug: "literature",
      isbn: null,
      source: "تراث عربي",
      legalReadUrl: "https://ar.wikisource.org/wiki/كليلة_ودمنة",
      previewUrl: null,
      isPublicDomain: true,
      canReadOnline: true,
    },
    {
      titleAr: "مقدمة ابن خلدون",
      titleOriginal: "Muqaddimah",
      author: "ابن خلدون",
      description:
        "المقدمة التي كتبها المؤرخ والمفكر العربي ابن خلدون تُعدّ من أعظم الأعمال الفكرية في تاريخ الإنسانية. وضع فيها ابن خلدون علم الاجتماع وفلسفة التاريخ، وتناول قوانين قيام الحضارات وسقوطها بمنهج علمي رائد.",
      categorySlug: "history",
      isbn: null,
      source: "تراث عربي",
      legalReadUrl: "https://ar.wikisource.org/wiki/مقدمة_ابن_خلدون",
      previewUrl: null,
      isPublicDomain: true,
      canReadOnline: true,
    },
    {
      titleAr: "موسم الهجرة إلى الشمال",
      titleOriginal: "Season of Migration to the North",
      author: "الطيب صالح",
      description:
        "رواية الطيب صالح التي صنّفها معهد الرواية العربية ضمن أفضل مئة رواية عربية في القرن العشرين. تدور أحداثها حول شاب سوداني يعود من أوروبا إلى قريته ويتساءل عن هويته وانتمائه، وتصف التوتر بين الشرق والغرب بأسلوب روائي مؤثر.",
      categorySlug: "novels",
      isbn: "9789953441207",
      source: "دار العودة",
      legalReadUrl: null,
      previewUrl: null,
      isPublicDomain: false,
      canReadOnline: false,
    },
    {
      titleAr: "رجال في الشمس",
      titleOriginal: "Men in the Sun",
      author: "غسان كنفاني",
      description:
        "رواية قصيرة للأديب الفلسطيني غسان كنفاني تحكي معاناة ثلاثة فلسطينيين يحاولون الوصول إلى الكويت بحثاً عن عمل عبر الصحراء. تُعدّ من أيقونات الأدب الفلسطيني وأكثر أعمال كنفاني تأثيراً ورمزية.",
      categorySlug: "novels",
      isbn: "9789953441603",
      source: "مؤسسة الأبحاث العربية",
      legalReadUrl: null,
      previewUrl: null,
      isPublicDomain: false,
      canReadOnline: false,
    },
    {
      titleAr: "في الشعر الجاهلي",
      titleOriginal: "Fi al-Shi'r al-Jahili",
      author: "طه حسين",
      description:
        "كتاب نقدي جريء لطه حسين يتناول فيه الشعر الجاهلي بمنهج علمي تاريخي، وأثار جدلاً واسعاً حين نشر. يُعدّ من أهم الأعمال النقدية في الأدب العربي الحديث.",
      categorySlug: "literature",
      isbn: null,
      source: "تراث عربي",
      legalReadUrl: null,
      previewUrl: null,
      isPublicDomain: true,
      canReadOnline: false,
    },
    {
      titleAr: "أسرار البلاغة",
      titleOriginal: "Asrar al-Balagha",
      author: "عبدالقاهر الجرجاني",
      description:
        "من أعظم كتب البلاغة العربية، يكشف فيه الجرجاني أسرار الفصاحة والبيان في اللغة العربية، ويُرسي قواعد علم المعاني والبيان بمنهج فلسفي نقدي دقيق.",
      categorySlug: "literature",
      isbn: null,
      source: "تراث عربي",
      legalReadUrl: "https://ar.wikisource.org/wiki/أسرار_البلاغة",
      previewUrl: null,
      isPublicDomain: true,
      canReadOnline: true,
    },
    {
      titleAr: "الأمير الصغير",
      titleOriginal: "Le Petit Prince",
      author: "أنطوان دو سانت إكزوبيري — ترجمة",
      description:
        "قصة فلسفية شاعرية ترجمت إلى عشرات اللغات. تحكي عن أمير صغير يزور الأرض ويكتشف عوالم البشر بعيون طفولية صادقة. كتاب يخاطب الكبار والصغار ويتأمل معنى الصداقة والحب والمسؤولية.",
      categorySlug: "youth",
      isbn: "9789953445199",
      source: "دار الكتب العلمية",
      legalReadUrl: null,
      previewUrl: null,
      isPublicDomain: false,
      canReadOnline: false,
    },
  ];

  const createdBooks: Record<string, string> = {};
  for (const book of books) {
    const { categorySlug, ...bookData } = book;
    const created = await prisma.book.create({
      data: {
        ...bookData,
        isPublished: true,
        categoryId: createdCategories[categorySlug] || null,
      },
    });
    createdBooks[book.titleAr] = created.id;
  }
  console.log("✅ تم إنشاء الكتب");

  // Member-Book relationships
  const memberBooksData = [
    { memberEmail: "sarah@injaz-reading.local", bookTitle: "الأيام", status: "READ" },
    { memberEmail: "sarah@injaz-reading.local", bookTitle: "موسم الهجرة إلى الشمال", status: "READ" },
    { memberEmail: "sarah@injaz-reading.local", bookTitle: "الأمير الصغير", status: "READING" },
    { memberEmail: "mohammed@injaz-reading.local", bookTitle: "مقدمة ابن خلدون", status: "READ" },
    { memberEmail: "mohammed@injaz-reading.local", bookTitle: "كليلة ودمنة", status: "READ" },
    { memberEmail: "mohammed@injaz-reading.local", bookTitle: "رجال في الشمس", status: "WANT_TO_READ" },
    { memberEmail: "fatima@injaz-reading.local", bookTitle: "رجال في الشمس", status: "READ" },
    { memberEmail: "fatima@injaz-reading.local", bookTitle: "أسرار البلاغة", status: "READ" },
    { memberEmail: "fatima@injaz-reading.local", bookTitle: "موسم الهجرة إلى الشمال", status: "WANT_TO_READ" },
    { memberEmail: "abdullah@injaz-reading.local", bookTitle: "مقدمة ابن خلدون", status: "READ" },
    { memberEmail: "abdullah@injaz-reading.local", bookTitle: "الأيام", status: "READ" },
    { memberEmail: "abdullah@injaz-reading.local", bookTitle: "في الشعر الجاهلي", status: "READING" },
  ];

  for (const mb of memberBooksData) {
    const member = createdMembers.find((m) => m.email === mb.memberEmail);
    const bookId = createdBooks[mb.bookTitle];
    if (member && bookId) {
      await prisma.memberBook.upsert({
        where: { memberId_bookId: { memberId: member.id, bookId } },
        update: {},
        create: { memberId: member.id, bookId, status: mb.status },
      });
    }
  }
  console.log("✅ تم ربط الكتب بالأعضاء");

  // Reviews
  const reviewsData = [
    {
      memberEmail: "sarah@injaz-reading.local",
      bookTitle: "الأيام",
      rating: 5,
      reviewText:
        "رواية استثنائية تصف كفاح إنسان أمام ظروف قاسية. أسلوب طه حسين الشعري يأخذك في رحلة تأمل عميقة. قرأتها مرتين ولم أمل منها.",
    },
    {
      memberEmail: "sarah@injaz-reading.local",
      bookTitle: "موسم الهجرة إلى الشمال",
      rating: 5,
      reviewText:
        "رواية عميقة تتناول أزمة الهوية والصراع بين الشرق والغرب. الطيب صالح كاتب استثنائي يجعلك تتوقف عند كل جملة.",
    },
    {
      memberEmail: "mohammed@injaz-reading.local",
      bookTitle: "مقدمة ابن خلدون",
      rating: 5,
      reviewText:
        "كتاب يبهرك بعمق التفكير وسبق ابن خلدون لعصره. وضع أسس علم الاجتماع قبل قرون من ظهوره في الغرب. قراءة لا غنى عنها.",
    },
    {
      memberEmail: "fatima@injaz-reading.local",
      bookTitle: "رجال في الشمس",
      rating: 5,
      reviewText:
        "كنفاني كاتب يحرّك المشاعر ببساطة مؤلمة. الرواية قصيرة لكنها تحمل ثقل القضية الفلسطينية كاملاً. لا تنسى نهايتها.",
    },
    {
      memberEmail: "abdullah@injaz-reading.local",
      bookTitle: "مقدمة ابن خلدون",
      rating: 5,
      reviewText:
        "قرأت هذا الكتاب ثلاث مرات وفي كل مرة أكتشف أفكاراً جديدة. ابن خلدون فيلسوف التاريخ الأول دون منازع.",
    },
  ];

  for (const r of reviewsData) {
    const member = createdMembers.find((m) => m.email === r.memberEmail);
    const bookId = createdBooks[r.bookTitle];
    if (member && bookId) {
      await prisma.bookReview.create({
        data: {
          memberId: member.id,
          bookId,
          rating: r.rating,
          reviewText: r.reviewText,
        },
      });
    }
  }
  console.log("✅ تم إنشاء المراجعات");

  // Comments
  const commentsData = [
    {
      memberEmail: "mohammed@injaz-reading.local",
      bookTitle: "الأيام",
      commentText: "هل قرأ أحد منكم النسخة المشكّلة؟ تضيف للكتاب بُعداً مختلفاً.",
    },
    {
      memberEmail: "fatima@injaz-reading.local",
      bookTitle: "الأيام",
      commentText: "فعلاً من أجمل ما كتب طه حسين. يجعلك تتأمل في الأمل رغم الصعاب.",
    },
    {
      memberEmail: "sarah@injaz-reading.local",
      bookTitle: "مقدمة ابن خلدون",
      commentText: "الجزء الخاص بالعصبية والملك يستحق دراسة منفصلة. فكر خارق لقرنه.",
    },
    {
      memberEmail: "abdullah@injaz-reading.local",
      bookTitle: "رجال في الشمس",
      commentText: "النهاية تدمّر القارئ بشكل جميل. 'لماذا لم تقرعوا جدران الخزان؟' جملة لا تُنسى.",
    },
  ];

  for (const c of commentsData) {
    const member = createdMembers.find((m) => m.email === c.memberEmail);
    const bookId = createdBooks[c.bookTitle];
    if (member && bookId) {
      await prisma.bookComment.create({
        data: { memberId: member.id, bookId, commentText: c.commentText, isApproved: true },
      });
    }
  }
  console.log("✅ تم إنشاء التعليقات");

  // Events
  const now = new Date();
  const events = [
    {
      title: "لقاء الأربعاء الثقافي — نقاش كتاب الأيام",
      description:
        "نقاش موسّع حول رواية 'الأيام' لطه حسين. سنتناول فيه الجوانب الأدبية والتاريخية وقراءة مقاطع مختارة، مع فرصة لكل عضو للتعبير عن رأيه.",
      eventDate: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
      startTime: "06:00 م",
      endTime: "08:00 م",
      location: "مقر نادي إنجاز للقراءة",
      month: "مايو 2025",
      status: "UPCOMING",
    },
    {
      title: "أمسية قرائية — الشعر العربي الكلاسيكي",
      description:
        "أمسية شعرية تحتفي بجماليات الشعر العربي الكلاسيكي. سيقرأ الأعضاء قصائد مختارة ويتبادلون التحليل والتأمل الأدبي.",
      eventDate: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
      startTime: "06:30 م",
      endTime: "08:30 م",
      location: "مقر نادي إنجاز للقراءة",
      month: "مايو 2025",
      status: "UPCOMING",
    },
    {
      title: "ورشة كتابة مراجعة الكتاب",
      description:
        "ورشة تدريبية لتعليم الأعضاء فن كتابة مراجعة الكتاب الاحترافية. سيتعلم المشاركون كيف يكتبون رأيهم بأسلوب نقدي وأدبي متميز.",
      eventDate: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
      startTime: "05:00 م",
      endTime: "07:00 م",
      location: "مقر نادي إنجاز للقراءة",
      month: "مايو 2025",
      status: "UPCOMING",
    },
    {
      title: "لقاء الأربعاء — تغطية موسم الهجرة إلى الشمال",
      description:
        "جلسة نقاش مكثف لرواية 'موسم الهجرة إلى الشمال' للطيب صالح. تناول الهوية والغربة والصراع الحضاري في الرواية.",
      eventDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      startTime: "06:00 م",
      endTime: "08:00 م",
      location: "مقر نادي إنجاز للقراءة",
      month: "أبريل 2025",
      status: "PAST",
    },
    {
      title: "إطلاق نادي إنجاز للقراءة",
      description:
        "الحفل الرسمي لإطلاق نادي إنجاز للقراءة. شارك فيه المؤسسون والأعضاء الأوائل وفريق إنجاز البحرين في احتفال ثقافي رائع.",
      eventDate: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      startTime: "05:00 م",
      endTime: "09:00 م",
      location: "مقر إنجاز البحرين",
      month: "مارس 2025",
      status: "PAST",
    },
  ];

  for (const event of events) {
    await prisma.event.create({ data: event });
  }
  console.log("✅ تم إنشاء الفعاليات");

  // News
  const newsItems = [
    {
      title: "إطلاق نادي إنجاز للقراءة — انطلاقة ثقافية جديدة في البحرين",
      content:
        "بحضور حافل من الشباب البحريني المحبين للقراءة، أطلق نادي إنجاز للقراءة أبوابه رسمياً في مقر إنجاز البحرين. جاء الحفل الافتتاحي احتفاءً بقيمة القراءة وتعزيز الثقافة العربية بين الشباب. قال مدير النادي: 'نحن هنا لنبني مجتمعاً قرائياً واعياً يصنع أثراً ثقافياً مستداماً.'",
      type: "NEWS",
      isPublished: true,
      publishedAt: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
    },
    {
      title: "تغطية لقاء الأربعاء الثقافي — رواية موسم الهجرة إلى الشمال",
      content:
        "في أجواء ثقافية دافئة، التقى أعضاء نادي إنجاز للقراءة في جلسة نقاش موسّعة حول رواية 'موسم الهجرة إلى الشمال' للروائي السوداني الراحل الطيب صالح. تناول الأعضاء ثيمات الهوية والغربة والصراع بين الشرق والغرب في أدب الطيب صالح. كانت الجلسة فرصة لتبادل الأفكار وإثراء الحوار الثقافي.",
      type: "COVERAGE",
      isPublished: true,
      publishedAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
    },
    {
      title: "العضو المتميز لشهر أبريل — سارة أحمد",
      content:
        "تُكرّم إدارة نادي إنجاز للقراءة العضو سارة أحمد بلقب العضو المتميز لشهر أبريل 2025، تقديراً لمشاركتها الفعّالة في جميع جلسات النادي، ومساهماتها القيّمة في النقاشات، وكتابتها لمراجعات متميزة ساهمت في إثراء المحتوى الثقافي للنادي.",
      type: "FEATURED_MEMBER",
      isPublished: true,
      publishedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      title: "إنجاز النادي — بعد شهر واحد: ١٥ كتاباً، ٤ جلسات، وآراء غيّرت النظرة",
      content:
        "بعد مرور الشهر الأول على تأسيس نادي إنجاز للقراءة، يسعدنا أن نشارككم أولى إنجازاتنا. قرأ أعضاء النادي ما يزيد على ١٥ كتاباً، وأقمنا ٤ جلسات نقاش ناجحة، وتبادلنا عشرات الآراء والمراجعات. هذه البداية تعكس شغف أعضائنا وتصميمهم على صنع فارق ثقافي حقيقي.",
      type: "ACHIEVEMENT",
      isPublished: true,
      publishedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const news of newsItems) {
    await prisma.news.create({ data: news });
  }
  console.log("✅ تم إنشاء الأخبار");

  // Borrowings
  const sarah = createdMembers.find((m) => m.email === "sarah@injaz-reading.local");
  const abdullah = createdMembers.find((m) => m.email === "abdullah@injaz-reading.local");

  if (sarah) {
    await prisma.borrowing.create({
      data: {
        memberId: sarah.id,
        bookId: createdBooks["الأيام"],
        borrowedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000),
        status: "BORROWED",
        notes: "الاستعارة الأولى للعضو",
      },
    });
  }

  if (abdullah) {
    await prisma.borrowing.create({
      data: {
        memberId: abdullah.id,
        bookId: createdBooks["مقدمة ابن خلدون"],
        borrowedAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000),
        dueDate: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000),
        returnedAt: new Date(now.getTime() - 8 * 24 * 60 * 60 * 1000),
        status: "RETURNED",
        notes: "تم الإرجاع قبل الموعد",
      },
    });
  }
  console.log("✅ تم إنشاء سجلات الاستعارة");

  // Admin log
  await prisma.adminLog.create({
    data: {
      adminId: admin.id,
      action: "تهيئة قاعدة البيانات وزرع البيانات الأولية",
    },
  });

  console.log("🎉 اكتملت عملية زرع البيانات بنجاح!");
  console.log("\n📋 بيانات الدخول:");
  console.log("  المدير: admin@injaz-reading.local / admin123456");
  console.log("  عضو:    sarah@injaz-reading.local / member123456");
}

main()
  .catch((e) => {
    console.error("❌ خطأ في زرع البيانات:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
