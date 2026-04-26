"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[200] origin-left"
      style={{ scaleX, background: "linear-gradient(to left, #C9A84C, #0A4F8F)" }}
    />
  );
}
