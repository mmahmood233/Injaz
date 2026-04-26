"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useInView,
} from "framer-motion";
import { BookOpen, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

/* ─── floating Arabic glyphs ─── */
const GLYPHS = ["ق", "ر", "أ", "ك", "ت", "ب", "ن", "ع", "ل", "م", "و", "ف", "ح", "ص"];
const glyphSeeds = Array.from({ length: 16 }, (_, i) => ({
  glyph: GLYPHS[i % GLYPHS.length],
  delay: (i * 1.3) % 9,
  x: (i * 19 + 4) % 93,
  size: 18 + (i * 14) % 56,
  duration: 10 + (i * 3) % 10,
}));

function FloatingGlyph({ glyph, delay, x, size, duration }: {
  glyph: string; delay: number; x: number; size: number; duration: number;
}) {
  return (
    <motion.span
      className="absolute bottom-0 select-none pointer-events-none font-bold"
      style={{ left: `${x}%`, fontSize: size, fontFamily: "Cairo, sans-serif", color: "rgba(255,255,255,0.05)" }}
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: "-115vh", opacity: [0, 1, 1, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "linear" }}
    >
      {glyph}
    </motion.span>
  );
}

/* ─── marquee ─── */
const BOOK_TITLES = [
  "الأيام", "موسم الهجرة إلى الشمال", "مقدمة ابن خلدون",
  "رجال في الشمس", "كليلة ودمنة", "أسرار البلاغة",
  "الأمير الصغير", "في الشعر الجاهلي",
];

function Marquee() {
  const items = [...BOOK_TITLES, ...BOOK_TITLES];
  return (
    <div className="overflow-hidden border-t border-white/10 pt-4 mt-2">
      <motion.div
        className="flex gap-10 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      >
        {items.map((title, i) => (
          <span key={i} className="text-white/20 text-xs tracking-widest">
            {title}
            <span className="text-injaz-gold/30 mx-5">◆</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

/* ─── word spring reveal ─── */
function AnimatedHeadline({ lines }: { lines: { text: string; gold?: boolean }[] }) {
  return (
    <h1
      className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
      style={{ fontFamily: "Cairo, sans-serif" }}
    >
      {lines.map((line, li) => {
        const words = line.text.split(" ");
        return (
          <span key={li} className="block">
            {words.map((word, wi) => (
              <motion.span
                key={wi}
                className={`inline-block ${wi < words.length - 1 ? "ml-3" : ""} ${line.gold ? "text-injaz-gold" : ""}`}
                initial={{ opacity: 0, y: 60, rotate: -4 }}
                animate={{ opacity: 1, y: 0, rotate: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 180,
                  damping: 18,
                  delay: 0.3 + li * 0.25 + wi * 0.07,
                }}
              >
                {word}
              </motion.span>
            ))}
          </span>
        );
      })}
    </h1>
  );
}

/* ─── count-up ─── */
function CountUp({ to }: { to: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let v = 0;
    const step = Math.ceil(to / 40);
    const t = setInterval(() => {
      v += step;
      if (v >= to) { setCount(to); clearInterval(t); }
      else setCount(v);
    }, 35);
    return () => clearInterval(t);
  }, [inView, to]);

  return <span ref={ref}>{count}+</span>;
}

/* ─── main component ─── */
interface Props { memberCount: number; bookCount: number; eventCount: number; }

export function HeroSection({ memberCount, bookCount, eventCount }: Props) {
  /* mouse parallax */
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const smoothX = useSpring(rawX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(rawY, { stiffness: 50, damping: 20 });

  /* per-layer parallax offsets */
  const orb1X = useTransform(smoothX, v => v * 35);
  const orb1Y = useTransform(smoothY, v => v * 35);
  const orb2X = useTransform(smoothX, v => v * -22);
  const orb2Y = useTransform(smoothY, v => v * -22);
  const orb3X = useTransform(smoothX, v => v * 15);
  const orb3Y = useTransform(smoothY, v => v * 15);

  /* glow follows cursor */
  const glowX = useMotionValue(-200);
  const glowY = useMotionValue(-200);
  const smoothGlowX = useSpring(glowX, { stiffness: 120, damping: 25 });
  const smoothGlowY = useSpring(glowY, { stiffness: 120, damping: 25 });

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const { innerWidth, innerHeight } = window;
      rawX.set((e.clientX / innerWidth - 0.5) * 2);
      rawY.set((e.clientY / innerHeight - 0.5) * 2);
      glowX.set(e.clientX - 160);
      glowY.set(e.clientY - 160);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [rawX, rawY, glowX, glowY]);

  return (
    <section className="relative overflow-hidden min-h-[96vh] flex flex-col">
      {/* base gradient */}
      <div className="injaz-gradient absolute inset-0" />

      {/* noise texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* mouse glow */}
      <motion.div
        className="absolute w-80 h-80 rounded-full pointer-events-none"
        style={{
          x: smoothGlowX, y: smoothGlowY,
          background: "radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)",
        }}
      />

      {/* parallax orb 1 — gold, top right */}
      <motion.div
        className="absolute top-[-15%] right-[-8%] w-[550px] h-[550px] rounded-full pointer-events-none"
        style={{
          x: orb1X, y: orb1Y,
          background: "radial-gradient(circle, rgba(201,168,76,0.22) 0%, transparent 65%)",
        }}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* parallax orb 2 — blue, bottom left */}
      <motion.div
        className="absolute bottom-[-10%] left-[-10%] w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          x: orb2X, y: orb2Y,
          background: "radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 3 }}
      />

      {/* parallax orb 3 — center accent */}
      <motion.div
        className="absolute top-[30%] left-[50%] w-[300px] h-[300px] rounded-full pointer-events-none -translate-x-1/2"
        style={{
          x: orb3X, y: orb3Y,
          background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
        }}
        animate={{ scale: [1, 1.25, 1] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      {/* rotating rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-[700px] h-[700px] rounded-full border border-dashed border-white/[0.04]"
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full border border-dashed border-injaz-gold/[0.06]"
          animate={{ rotate: -360 }}
          transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[320px] h-[320px] rounded-full border border-white/[0.05]"
          animate={{ rotate: 360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* floating glyphs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {glyphSeeds.map((g, i) => <FloatingGlyph key={i} {...g} />)}
      </div>

      {/* dot grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* ── main content ── */}
      <div className="relative flex-1 flex flex-col items-center justify-center container mx-auto px-4 pt-24 pb-10">
        <div className="max-w-3xl mx-auto text-center w-full">

          {/* badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.75, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 }}
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2 mb-8 backdrop-blur-sm"
          >
            <motion.span
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: 2 }}
            >
              <BookOpen className="w-4 h-4 text-injaz-gold" />
            </motion.span>
            <span className="text-white/90 text-sm font-medium">نادي إنجاز للقراءة</span>
          </motion.div>

          {/* animated headline */}
          <AnimatedHeadline
            lines={[
              { text: "نقرأ لنفهم،" },
              { text: "نتحاور لننمو،", gold: true },
              { text: "ونصنع أثرًا ثقافيًا مستدامًا." },
            ]}
          />

          {/* subtitle */}
          <motion.p
            className="text-white/75 text-lg md:text-xl leading-relaxed mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.1 }}
          >
            نادي قراءة عربي يجمع المحبين للكتب في بيئة ثقافية تفاعلية، يلتقي فيها الأعضاء كل أربعاء في حوار أدبي وفكري مثري.
          </motion.p>

          {/* CTA buttons — stagger with spring */}
          {[
            { href: "/about", label: "تعرف على النادي", variant: "white", icon: true },
            { href: "/events", label: "استعرض الفعاليات", variant: "outline" },
            { href: "/books", label: "تصفح الكتب", variant: "gold" },
          ].map((btn, i) => (
            <motion.span
              key={btn.href}
              className="inline-block m-2"
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 1.2 + i * 0.12 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.97 }}
            >
              <Button
                asChild
                size="xl"
                className={
                  btn.variant === "white"
                    ? "bg-white text-injaz-blue hover:bg-white/90 font-bold border-0 shadow-xl"
                    : btn.variant === "gold"
                    ? "bg-injaz-gold hover:bg-injaz-gold/90 text-white border-0 shadow-lg"
                    : "bg-transparent border-2 border-white text-white hover:bg-white hover:text-injaz-blue font-bold transition-colors"
                }
              >
                <Link href={btn.href}>
                  {btn.label}
                  {btn.icon && <ArrowLeft className="w-5 h-5 mr-2" />}
                </Link>
              </Button>
            </motion.span>
          ))}

          {/* stats */}
          <motion.div
            className="grid grid-cols-3 gap-6 mt-14 max-w-md mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.6 }}
          >
            {[
              { value: memberCount, label: "عضو نشط" },
              { value: bookCount, label: "كتاب مُضاف" },
              { value: eventCount, label: "فعالية" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 150, damping: 20, delay: 1.7 + i * 0.1 }}
              >
                <p className="text-3xl font-bold text-white" style={{ fontFamily: "Cairo, sans-serif" }}>
                  <CountUp to={stat.value} />
                </p>
                <p className="text-white/50 text-xs mt-1">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* book title marquee */}
          <motion.div
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <Marquee />
          </motion.div>
        </div>
      </div>

      {/* scroll mouse indicator */}
      <motion.div
        className="relative z-10 flex justify-center pb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2 }}
      >
        <motion.div
          className="flex flex-col items-center gap-1.5 text-white/30 cursor-default"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/30" />
          <div className="w-1 h-1 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>

      {/* wave */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none">
        <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 80L1440 80L1440 40C1200 80 960 0 720 40C480 80 240 0 0 40L0 80Z" fill="hsl(40 30% 97%)" />
        </svg>
      </div>
    </section>
  );
}
