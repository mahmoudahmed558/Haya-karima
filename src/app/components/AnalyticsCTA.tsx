import { motion } from "motion/react";
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Database,
  Brain,
  ExternalLink,
  Sparkles,
  Activity,
  Target,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

/* ─────────────────────── FLOATING PARTICLES ─────────────────────── */

function FloatingParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; r: number; dx: number; dy: number; alpha: number }[] = [];

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();
    window.addEventListener("resize", resize);

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(111, 207, 151, ${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.offsetWidth) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.offsetHeight) p.dy *= -1;
      });

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(47, 160, 132, ${0.08 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

/* ─────────────────────── METRIC CARD ─────────────────────── */

function MetricCard({
  icon: Icon,
  label,
  value,
  delay,
  color,
}: {
  icon: any;
  label: string;
  value: string;
  delay: number;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring", stiffness: 200, damping: 20 }}
      whileHover={{ y: -8, scale: 1.03 }}
      className="relative group"
    >
      <div
        className={`absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-40 blur-xl transition-all duration-500`}
        style={{ background: `linear-gradient(135deg, ${color}, transparent)` }}
      />
      <div className="relative p-5 rounded-2xl bg-white/80 dark:bg-white/[0.06] backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500">
        <div
          className="w-11 h-11 rounded-xl grid place-items-center text-white shadow-lg mb-3"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }}
        >
          <Icon className="w-5 h-5" />
        </div>
        <div className="text-2xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>
          {value}
        </div>
        <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">{label}</div>
      </div>
    </motion.div>
  );
}

/* ─────────────────────── FEATURE PILL ─────────────────────── */

function FeaturePill({ icon: Icon, text, delay }: { icon: any; text: string; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/60 dark:bg-white/[0.06] backdrop-blur-lg border border-white/50 dark:border-white/10 text-sm text-zinc-700 dark:text-zinc-300 shadow-sm hover:shadow-md transition-all hover:scale-105"
      style={{ fontWeight: 600 }}
    >
      <Icon className="w-4 h-4 text-[#2FA084]" />
      {text}
    </motion.div>
  );
}

/* ─────────────────────── PULSE RING ─────────────────────── */

function PulseRing() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full border border-[#2FA084]/20"
          animate={{
            scale: [1, 1.5, 2],
            opacity: [0.3, 0.1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: i * 1.3,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────────────────── MAIN COMPONENT ─────────────────────── */

export function AnalyticsCTA() {
  const [hovered, setHovered] = useState(false);

  return (
    <section
      id="analytics-cta"
      className="app-section relative overflow-hidden py-20 md:py-28"
    >
      {/* Background gradient layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a2a22] via-[#0d3d2e] to-[#0a2a22] dark:from-[#050f0c] dark:via-[#0a1f18] dark:to-[#050f0c]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(47,160,132,0.15),transparent_70%)]" />
      
      {/* Animated grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(111,207,151,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(111,207,151,0.3) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />

      {/* Floating particles canvas */}
      <FloatingParticles />

      {/* Pulse rings */}
      <PulseRing />

      <div className="app-container relative z-10">
        {/* Top badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-8"
        >
          <div className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#2FA084]/20 border border-[#2FA084]/30 backdrop-blur-lg">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="w-4 h-4 text-[#6FCF97]" />
            </motion.div>
            <span className="text-sm text-[#6FCF97]" style={{ fontWeight: 700 }}>
              تحليلات متقدمة · Advanced Analytics
            </span>
          </div>
        </motion.div>

        {/* Main heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6"
        >
          <h2
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white leading-tight"
            style={{ fontWeight: 900 }}
          >
            <span className="block">لوحة التحليلات</span>
            <span className="block mt-2 bg-gradient-to-l from-[#6FCF97] via-[#2FA084] to-[#10b981] bg-clip-text text-transparent">
              الشاملة للبيانات
            </span>
          </h2>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="text-center text-zinc-400 text-base md:text-lg max-w-2xl mx-auto mb-12 leading-relaxed"
        >
          استكشف تحليلات بيانات حياة كريمة بشكل تفاعلي وشامل — رسومات بيانية،
          خرائط حرارية، ومؤشرات أداء تفصيلية لكل قطاع ومركز في محافظة قنا
        </motion.p>

        {/* Feature pills */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          <FeaturePill icon={BarChart3} text="رسومات تفاعلية" delay={0.2} />
          <FeaturePill icon={PieChart} text="توزيعات القطاعات" delay={0.3} />
          <FeaturePill icon={Target} text="مؤشرات الأداء" delay={0.4} />
          <FeaturePill icon={Brain} text="تحليل ذكي" delay={0.5} />
          <FeaturePill icon={Database} text="بيانات شاملة" delay={0.6} />
        </motion.div>

        {/* Metric cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-14 max-w-4xl mx-auto">
          <MetricCard icon={BarChart3} label="رسم بياني" value="+15" delay={0.1} color="#1F6F5F" />
          <MetricCard icon={Database} label="نقطة بيانات" value="+2.4K" delay={0.2} color="#2FA084" />
          <MetricCard icon={TrendingUp} label="مؤشر أداء" value="+28" delay={0.3} color="#10b981" />
          <MetricCard icon={Activity} label="تحليل قطاعي" value="6" delay={0.4} color="#6FCF97" />
        </div>

        {/* CTA Button — The Star */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-10"
        >
          <motion.a
            href="https://garden-3b6f2.web.app/"
            target="_blank"
            rel="noopener noreferrer"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="relative group inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-white text-lg md:text-xl overflow-hidden shadow-2xl shadow-[#1F6F5F]/40"
            style={{ fontWeight: 800 }}
          >
            {/* Animated gradient background */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-l from-[#1F6F5F] via-[#2FA084] to-[#10b981]"
              animate={{
                backgroundPosition: hovered ? ["0% 50%", "100% 50%"] : "0% 50%",
              }}
              transition={{ duration: 2, repeat: hovered ? Infinity : 0, repeatType: "reverse" }}
              style={{ backgroundSize: "200% 200%" }}
            />

            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent"
              animate={{ x: hovered ? ["-200%", "200%"] : "-200%" }}
              transition={{ duration: 1.5, repeat: hovered ? Infinity : 0, repeatDelay: 0.5 }}
            />

            {/* Glow ring */}
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-l from-[#6FCF97] to-[#2FA084] opacity-0 group-hover:opacity-60 blur-lg transition-opacity duration-500" />

            <span className="relative flex items-center gap-3">
              <Zap className="w-6 h-6" />
              <span>افتح لوحة التحليلات الكاملة</span>
              <motion.span
                animate={{ x: hovered ? [0, 5, 0] : 0 }}
                transition={{ duration: 0.8, repeat: hovered ? Infinity : 0 }}
              >
                <ExternalLink className="w-5 h-5" />
              </motion.span>
            </span>
          </motion.a>
        </motion.div>

        {/* Bottom hint */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center text-zinc-500 text-sm"
        >
          سيتم فتح لوحة التحليلات في نافذة جديدة · يُفتح في تبويب جديد
        </motion.p>
      </div>
    </section>
  );
}
