import { BookOpen, Target, Heart, Users, Calendar, Star, Globe, Lightbulb } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  const goals = [
    { icon: BookOpen, title: "تنمية عادة القراءة", desc: "نساعد الأعضاء على بناء عادة قراءة منتظمة ومستدامة من خلال البيئة الداعمة والبرامج المنظمة." },
    { icon: Users, title: "تشجيع الحوار الثقافي", desc: "نوفر مساحة آمنة لتبادل الأفكار والآراء حول الكتب والقضايا الثقافية والفكرية." },
    { icon: Globe, title: "بناء مجتمع قرائي واعٍ", desc: "نبني مجتمعاً من القراء الواعين الذين يؤثرون إيجاباً في محيطهم الأسري والمهني." },
    { icon: Star, title: "تمكين الأعضاء", desc: "نمنح الأعضاء أدوار قيادية ومشاركة فعلية في تنظيم الفعاليات وإدارة النادي." },
    { icon: Lightbulb, title: "دعم الإبداع والمعرفة", desc: "نشجع الكتابة الإبداعية والنقد الأدبي ونقدم منصة لأصوات الشباب العربي." },
    { icon: Heart, title: "أثر مجتمعي مستدام", desc: "نسعى لأن يكون لكل عضو أثر ثقافي ملموس يمتد خارج جلسات النادي إلى المجتمع." },
  ];

  return (
    <div>
      {/* Hero */}
      <section className="injaz-gradient py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-6">
            <BookOpen className="w-4 h-4 text-injaz-gold" />
            <span className="text-white/90 text-sm">عن النادي</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "Cairo, sans-serif" }}>
            نادي إنجاز للقراءة
          </h1>
          <p className="text-white/80 text-xl max-w-2xl mx-auto leading-relaxed">
            مساحة عربية رائدة تنمي عادة القراءة وتبني مجتمعاً قرائياً واعياً
          </p>
        </div>
      </section>

      {/* تعريف */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-injaz-navy mb-4" style={{ fontFamily: "Cairo, sans-serif" }}>
              من نحن؟
            </h2>
          </div>
          <div className="prose prose-lg max-w-none text-muted-foreground leading-relaxed space-y-4 text-center">
            <p className="text-lg">
              نادي إنجاز للقراءة هو مبادرة ثقافية تابعة لإنجاز البحرين، تهدف إلى تعزيز ثقافة القراءة بين الشباب البحريني وتشجيعهم على بناء علاقة راسخة مع الكتاب والمعرفة.
            </p>
            <p>
              يوفر النادي للأعضاء مساحة هادئة وملهمة للقراءة، ويجمع بينهم في بيئة ثقافية تفاعلية تسمح لهم بمناقشة الكتب، وتبادل الآراء، والمشاركة في فعاليات أدبية وفكرية متنوعة.
            </p>
            <p>
              يقوم النادي على الجمع بين القراءة الفردية والأنشطة الجماعية، بحيث يتمكن العضو من الاستفادة من المكان في أي وقت مخصص للنادي، وفي الوقت نفسه يشارك أسبوعيًا في فعالية ثقافية تقام كل يوم أربعاء.
            </p>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-t-4 border-t-injaz-blue shadow-lg">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl injaz-gradient flex items-center justify-center mb-6 shadow-md">
                  <Star className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-injaz-navy mb-4" style={{ fontFamily: "Cairo, sans-serif" }}>
                  رؤيتنا
                </h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  أن يكون النادي مساحة ثقافية عربية رائدة تنمي عادة القراءة، وتبني مجتمعًا قرائيًا واعيًا، يجمع بين المتعة، والمعرفة، والحوار والإبداع.
                </p>
              </CardContent>
            </Card>

            <Card className="border-t-4 border-t-injaz-gold shadow-lg">
              <CardContent className="p-8">
                <div className="w-14 h-14 rounded-2xl bg-injaz-gold flex items-center justify-center mb-6 shadow-md">
                  <Target className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-injaz-navy mb-4" style={{ fontFamily: "Cairo, sans-serif" }}>
                  رسالتنا
                </h3>
                <p className="text-muted-foreground leading-relaxed text-base">
                  نشر ثقافة القراءة باللغة العربية من خلال توفير بيئة جاذبة للقراء، وتنظيم فعاليات أدبية وحوارية مبتكرة، وتمكين الأعضاء من التفاعل، والمشاركة، والقيادة، وصناعة أثر ثقافي مستدام داخل المجتمع.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Goals */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-injaz-navy mb-3" style={{ fontFamily: "Cairo, sans-serif" }}>
              أهدافنا
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              نسعى عبر خطوات عملية وملموسة إلى تحقيق أثر ثقافي حقيقي داخل مجتمعنا
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {goals.map((goal) => (
              <Card key={goal.title} className="card-hover border-border/60">
                <CardContent className="p-6">
                  <div className="w-11 h-11 rounded-xl injaz-gradient flex items-center justify-center mb-4 shadow-sm">
                    <goal.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-bold text-injaz-navy text-base mb-2" style={{ fontFamily: "Cairo, sans-serif" }}>
                    {goal.title}
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{goal.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Wednesday Meeting */}
      <section className="py-16 bg-injaz-navy">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <div className="w-16 h-16 rounded-full bg-injaz-gold flex items-center justify-center mx-auto mb-6 shadow-lg">
            <Calendar className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4" style={{ fontFamily: "Cairo, sans-serif" }}>
            لقاء الأربعاء الثقافي
          </h2>
          <p className="text-white/70 leading-relaxed text-lg mb-6">
            القلب النابض للنادي: كل أسبوع، كل أربعاء، يلتقي أعضاء النادي في جلسة ثقافية تفاعلية — نناقش فيها كتاباً، أو نستضيف فكرة، أو نتأمل معاً في موضوع يثري عقولنا وأرواحنا.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            {[
              { label: "الوقت", value: "٦:٠٠ — ٨:٠٠ مساءً" },
              { label: "الموعد", value: "كل يوم أربعاء" },
              { label: "المكان", value: "مقر إنجاز البحرين" },
            ].map((item) => (
              <div key={item.label} className="bg-white/10 rounded-xl p-4 border border-white/10">
                <p className="text-white/50 text-xs mb-1">{item.label}</p>
                <p className="text-white font-semibold">{item.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
