import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 400);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const circumference = 2 * Math.PI * 18;

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={scrollUp}
          className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl grid place-items-center group hover:scale-110 active:scale-95 transition-transform"
          aria-label="العودة لأعلى"
        >
          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 44 44">
            <circle cx="22" cy="22" r="18" fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-200 dark:text-zinc-700" />
            <circle
              cx="22" cy="22" r="18" fill="none"
              stroke="url(#scroll-grad)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              className="transition-all duration-150"
            />
            <defs>
              <linearGradient id="scroll-grad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#1F6F5F" />
                <stop offset="100%" stopColor="#6FCF97" />
              </linearGradient>
            </defs>
          </svg>
          <ArrowUp className="w-5 h-5 text-[#1F6F5F] dark:text-[#6FCF97] relative group-hover:-translate-y-0.5 transition-transform" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
