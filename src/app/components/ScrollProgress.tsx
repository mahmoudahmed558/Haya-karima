import { motion, useScroll, useSpring } from "motion/react";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] z-[60] origin-right"
      style={{
        scaleX,
        background: "linear-gradient(to left, #1F6F5F, #2FA084, #6FCF97)",
      }}
    />
  );
}
