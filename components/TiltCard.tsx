"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function TiltCard({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 30 });
  const glareX = useTransform(x, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(y, [-0.5, 0.5], ["0%", "100%"]);
  const glareOpacity = useSpring(0, { stiffness: 200, damping: 30 });

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
    glareOpacity.set(0.08);
  }

  function onLeave() {
    x.set(0);
    y.set(0);
    glareOpacity.set(0);
  }

  return (
    <motion.div
      ref={ref}
      className={`relative ${className ?? ""}`}
      style={{ perspective: 800, rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      whileHover={{ scale: 1.02 }}
      transition={{ scale: { type: "spring", stiffness: 300, damping: 25 } }}
    >
      {children}
      {/* glare overlay */}
      <motion.div
        className="absolute inset-0 rounded-inherit pointer-events-none rounded-xl"
        style={{
          opacity: glareOpacity,
          background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.6), transparent 60%)`,
        }}
      />
    </motion.div>
  );
}
