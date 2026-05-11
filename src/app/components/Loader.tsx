import { motion, AnimatePresence } from "motion/react";
import { useEffect, useState } from "react";

const stages = ["جاري تحميل البيانات...", "تجهيز الخريطة التفاعلية...", "إطلاق التجربة..."];

export function Loader({ show }: { show: boolean }) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!show) return;
    const start = performance.now();
    const duration = 1400;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setProgress(p);
      setStage(p < 0.35 ? 0 : p < 0.7 ? 1 : 2);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="fixed inset-0 z-[100] grid place-items-center overflow-hidden"
        >
          {/* Animated gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1F6F5F] via-[#2FA084] to-[#0e3d34]" />
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute w-[800px] h-[800px] rounded-full bg-[#6FCF97]/10 blur-[120px]" />
          <motion.div animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} className="absolute w-[600px] h-[600px] rounded-full bg-[#2FA084]/15 blur-[100px]" />

          {/* Dot grid pattern */}
          <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "30px 30px" }} />

          <div className="relative text-center z-10">
            {/* Animated logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotateY: -90 }}
              animate={{ scale: 1, opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.8, type: "spring", stiffness: 150 }}
              className="relative w-24 h-24 mx-auto mb-8"
            >
              <div className="absolute inset-0 rounded-3xl bg-white/20 blur-xl animate-glow-pulse" />
              <div className="relative w-24 h-24 rounded-3xl bg-white/15 backdrop-blur-xl border border-white/30 grid place-items-center shadow-2xl">
                <span className="text-white text-4xl" style={{ fontWeight: 900 }}>ح</span>
              </div>
              {/* Orbiting dots */}
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3 + i, repeat: Infinity, ease: "linear", delay: i * 0.4 }}
                  className="absolute inset-0"
                  style={{ transformOrigin: "center center" }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-[#6FCF97]" style={{ opacity: 0.6 - i * 0.15 }} />
                </motion.div>
              ))}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-white text-3xl mb-2" style={{ fontWeight: 900 }}>
              حياة كريمة
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-white/50 text-sm mb-8">
              منصة GeoAI · محافظة قنا
            </motion.div>

            {/* Progress bar */}
            <div className="w-48 mx-auto">
              <div className="h-1 rounded-full bg-white/15 overflow-hidden">
                <motion.div className="h-full bg-gradient-to-l from-[#6FCF97] to-white rounded-full" style={{ width: `${progress * 100}%` }} transition={{ duration: 0.1 }} />
              </div>
              <motion.div key={stage} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-white/60 text-xs mt-3">
                {stages[stage]}
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
