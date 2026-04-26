"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/* ── clip-path curtain reveal (bottom → top wipe) ── */
export function ScrollReveal({
  children, className, delay = 0, direction = "up",
}: {
  children: React.ReactNode; className?: string; delay?: number;
  direction?: "up" | "left" | "right" | "none";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-70px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{
        opacity: 0,
        y: direction === "up" ? 48 : 0,
        x: direction === "left" ? -48 : direction === "right" ? 48 : 0,
        scale: direction === "none" ? 0.97 : 1,
      }}
      animate={inView ? { opacity: 1, y: 0, x: 0, scale: 1 } : undefined}
      transition={{ duration: 0.75, delay, type: "spring", stiffness: 80, damping: 18 }}
    >
      {children}
    </motion.div>
  );
}

/* ── clip curtain for section headings ── */
export function CurtainReveal({ children, className, delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={inView ? { y: "0%", opacity: 1 } : undefined}
        transition={{ duration: 0.7, delay, type: "spring", stiffness: 100, damping: 20 }}
      >
        {children}
      </motion.div>
    </div>
  );
}

/* ── stagger container ── */
export function StaggerReveal({ children, className, stagger = 0.1 }: {
  children: React.ReactNode; className?: string; stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      variants={{ hidden: {}, visible: { transition: { staggerChildren: stagger } } }}
    >
      {children}
    </motion.div>
  );
}

/* ── spring card item ── */
export function StaggerItem({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: {
          opacity: 1, y: 0, scale: 1,
          transition: { type: "spring", stiffness: 120, damping: 18 },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── section label reveal (gold pill) ── */
export function SectionLabel({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <div ref={ref} className="overflow-hidden">
      <motion.p
        className="text-injaz-gold font-semibold mb-2 tracking-wider text-sm uppercase"
        initial={{ opacity: 0, x: 20 }}
        animate={inView ? { opacity: 1, x: 0 } : undefined}
        transition={{ duration: 0.5, type: "spring", stiffness: 120, damping: 20 }}
      >
        {children}
      </motion.p>
    </div>
  );
}
