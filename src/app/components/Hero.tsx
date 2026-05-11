import { motion } from "motion/react";
import { Users, MapPin, Briefcase, ArrowDown, ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { ParticleCanvas } from "./ParticleCanvas";

function Counter({ to, suffix = "", duration = 2.5 }: { to: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    const startTime = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - startTime) / (duration * 1000), 1);
      setVal(Math.floor((to) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);
  return <span>{val.toLocaleString("ar-EG")}{suffix}</span>;
}

const kpis = [
  { icon: Users, label: "إجمالي المستفيدين", value: 1500000, suffix: "", color: "from-[#10b981] to-[#047857]", display: "1.5M", delay: 0.1 },
  { icon: MapPin, label: "قرية مستهدفة للتطوير", value: 86, color: "from-[#0ea5e9] to-[#0369a1]", delay: 0.2 },
  { icon: Briefcase, label: "مشروع استراتيجي", value: 100, suffix: "+", color: "from-[#f59e0b] to-[#b45309]", delay: 0.3 },
];

export function Hero() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const onMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height });
  };

  return (
    <section id="hero" className="relative min-h-[92vh] pt-32 pb-20 overflow-hidden flex flex-col justify-center" onMouseMove={onMouseMove}>
      {/* Interactive Particle Canvas */}
      <ParticleCanvas className="opacity-60 dark:opacity-40" />

      {/* Mouse-follow glow */}
      <div
        className="absolute w-[500px] h-[500px] rounded-full bg-[#10b981]/10 dark:bg-[#10b981]/5 blur-[100px] pointer-events-none transition-all duration-700 ease-out"
        style={{ left: `calc(${mousePos.x * 100}% - 250px)`, top: `calc(${mousePos.y * 100}% - 250px)` }}
      />

      {/* Animated gradient blobs */}
      <motion.div
        animate={{ y: [0, -40, 0], x: [0, 20, 0], rotate: [0, 15, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-[10%] w-96 h-96 rounded-full bg-gradient-to-br from-[#10b981]/20 to-transparent blur-[100px] pointer-events-none"
      />
      <motion.div
        animate={{ y: [0, 50, 0], x: [0, -30, 0], rotate: [0, -10, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-10 right-[10%] w-[30rem] h-[30rem] rounded-full bg-gradient-to-br from-[#0ea5e9]/15 to-transparent blur-[120px] pointer-events-none"
      />

      <div className="app-container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/60 dark:bg-zinc-900/60 backdrop-blur-md border border-black/5 dark:border-white/10 shadow-sm mb-8"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]"></span>
            </span>
            <span className="text-xs text-zinc-700 dark:text-zinc-300 tracking-wide" style={{ fontWeight: 700 }}>النسخة المتقدمة 2026 · مدعوم بالذكاء الاصطناعي</span>
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.15] text-zinc-900 dark:text-white" style={{ fontWeight: 900 }}>
            إعادة بناء{" "}
            <span className="bg-gradient-to-l from-[#10b981] via-[#34d399] to-[#0ea5e9] bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
              حياة كريمة
            </span>
            <br />
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-block mt-3 text-4xl sm:text-5xl md:text-6xl text-zinc-500 dark:text-zinc-400 font-extrabold"
            >
              برؤية الذكاء الاصطناعي
            </motion.span>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-8 text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed"
            style={{ fontWeight: 500 }}
          >
            منصة الجيل القادم لتحليل وتخطيط المشاريع التنموية في صعيد مصر.
            ندمج البيانات الحية مع محركات الذكاء الجغرافي لرسم مستقبل أفضل.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-10 flex flex-wrap justify-center gap-5"
          >
            <button
              onClick={() => document.getElementById("map")?.scrollIntoView({ behavior: "smooth" })}
              className="group flex items-center gap-2 px-8 py-4 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 shadow-xl shadow-black/10 dark:shadow-white/10 hover:scale-105 active:scale-95 transition-all relative overflow-hidden"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] bg-gradient-to-l from-transparent via-white/20 to-transparent pointer-events-none" />
              <span style={{ fontWeight: 700 }} className="relative">استكشف خريطة GeoAI</span>
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform relative" />
            </button>
            <a
              href="/report.pdf"
              download="Hayah-Karima-Report-2026.pdf"
              className="px-8 py-4 rounded-full bg-white/50 dark:bg-white/5 backdrop-blur-md border border-black/10 dark:border-white/10 text-zinc-800 dark:text-white hover:bg-white dark:hover:bg-white/10 transition-all"
              style={{ fontWeight: 700 }}
            >
              تحميل التقرير الشامل
            </a>
          </motion.div>
        </motion.div>

        {/* Premium KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mt-20 max-w-5xl mx-auto relative z-20">
          {kpis.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + k.delay, duration: 0.7, type: "spring", bounce: 0.3 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative overflow-hidden rounded-[2rem] bg-white/60 dark:bg-[#18181b]/60 backdrop-blur-2xl border border-black/5 dark:border-white/5 shadow-2xl shadow-black/5 dark:shadow-black/40 p-8"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${k.color} rounded-full blur-[50px] opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
              {/* Shimmer on hover */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1500ms] bg-gradient-to-l from-transparent via-white/15 to-transparent pointer-events-none" />

              <div className="relative z-10">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${k.color} flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  <k.icon className="w-6 h-6" />
                </div>

                <div className="text-4xl md:text-5xl text-zinc-900 dark:text-white tracking-tight" style={{ fontWeight: 900 }}>
                  {k.display ? k.display : <Counter to={k.value} suffix={k.suffix} />}
                  {!k.display && k.suffix}
                </div>
                <div className="mt-2 text-sm text-zinc-500 dark:text-zinc-400" style={{ fontWeight: 700 }}>{k.label}</div>

                {/* Mini sparkline */}
                <svg viewBox="0 0 100 24" className="w-full h-6 mt-4 opacity-50 group-hover:opacity-80 transition" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`hero-spark-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={["#10b981","#0ea5e9","#f59e0b"][i]} stopOpacity="0.5" />
                      <stop offset="100%" stopColor={["#10b981","#0ea5e9","#f59e0b"][i]} stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={`M0 ${18 - i * 2} Q 20 ${10 + i},40 ${14 - i} T 100 ${4 + i}`} stroke={["#10b981","#0ea5e9","#f59e0b"][i]} strokeWidth="1.5" fill="none" />
                  <path d={`M0 ${18 - i * 2} Q 20 ${10 + i},40 ${14 - i} T 100 ${4 + i} L 100 24 L 0 24 Z`} fill={`url(#hero-spark-${i})`} />
                </svg>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="flex justify-center mt-16 opacity-50"
        >
          <ArrowDown className="w-6 h-6 text-zinc-400" />
        </motion.div>
      </div>
    </section>
  );
}
