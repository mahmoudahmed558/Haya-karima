import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import {
  Download,
  FileText,
  Eye,
  BookOpen,
  Quote,
  TrendingUp,
  Users,
  Building2,
  Sparkles,
  ArrowDown,
  Check,
  X,
  Share2,
  Printer,
  Loader2,
  FileCheck2,
} from "lucide-react";

/* ------------------------------- HELPERS ------------------------------- */

function Reveal({ children, delay = 0, x = 0, y = 30, className = "" }: { children: any; delay?: number; x?: number; y?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.2, 0.8, 0.2, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------- PROGRESS ------------------------------- */

function ReportProgress({ targetRef }: { targetRef: React.RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end end"] });
  const width = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  return (
    <motion.div
      className="absolute top-0 inset-x-0 h-1 bg-gradient-to-l from-[#1F6F5F] via-[#2FA084] to-[#6FCF97] origin-right z-20"
      style={{ width }}
    />
  );
}

/* ------------------------------- PREVIEW MODAL ------------------------------- */

function PreviewModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pageNum, setPageNum] = useState(1);
  const totalPages = 6;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const ratio = el.scrollTop / Math.max(el.scrollHeight - el.clientHeight, 1);
    setPageNum(Math.min(totalPages, Math.max(1, Math.round(ratio * (totalPages - 1)) + 1)));
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] grid place-items-center bg-black/75 backdrop-blur-sm p-4 md:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.94, y: 24, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 12, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl h-[88vh] rounded-3xl bg-[#1a1a1a] shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#222] border-b border-white/5">
              <div className="flex items-center gap-2 text-white/80 text-sm">
                <FileText className="w-4 h-4 text-[#6FCF97]" />
                <span style={{ fontWeight: 700 }}>تقرير الأثر التنموي 2026</span>
                <span className="text-white/40">·</span>
                <span className="text-xs text-white/60 tabular-nums">صفحة {pageNum} / {totalPages}</span>
              </div>
              <div className="flex items-center gap-2">
                <button className="hidden md:flex w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-white/80"><Printer className="w-4 h-4" /></button>
                <button className="hidden md:flex w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-white/80"><Share2 className="w-4 h-4" /></button>
                <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 grid place-items-center text-white"><X className="w-4 h-4" /></button>
              </div>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 overflow-hidden bg-[#2a2a2a]">
              <iframe
                src="/report.pdf"
                className="w-full h-full border-0"
                title="معاينة التقرير"
              />
            </div>

            {/* Footer with download */}
            <div className="px-5 py-3 bg-[#222] border-t border-white/5 flex items-center justify-between">
              <div className="text-[11px] text-white/55 flex items-center gap-2">
                <FileCheck2 className="w-3 h-3" />
                التقرير النهائي — حياة كريمة · محافظة قنا
              </div>
              <a
                href="/report.pdf"
                download="Hayah-Karima-Report-2026.pdf"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-l from-[#1F6F5F] to-[#2FA084] text-white text-xs hover:scale-105 transition shadow-lg"
                style={{ fontWeight: 700 }}
              >
                <Download className="w-3 h-3" />
                تحميل PDF
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------- DATA ------------------------------- */

const summary = [
  { icon: Users,      value: "1.5M",  label: "مستفيد",          tone: "from-[#1F6F5F] to-[#2FA084]" },
  { icon: Building2,  value: "+120",  label: "مشروع تنموي",     tone: "from-[#2FA084] to-[#6FCF97]" },
  { icon: TrendingUp, value: "+122%", label: "تحسّن المؤشرات",  tone: "from-[#6FCF97] to-[#2FA084]" },
  { icon: Sparkles,   value: "86",    label: "قرية مطورة",      tone: "from-[#1F6F5F] to-[#6FCF97]" },
];

const sections = [
  {
    chapter: "01",
    title: "الاستثمار في البنية التحتية",
    body:
      "وُجِّه 42% من إجمالي الاستثمارات إلى قطاع البنية التحتية بإجمالي يقترب من 3.6 مليار جنيه — شملت طرقاً، صرفاً صحياً، ومحطات مياه شربٍ في 86 قرية على ضفاف الني،ل لتشكّل العمود الفقري للمبادرة.",
    stat: "3.6",
    statSuffix: " مليار جنيه",
    statLabel: "إنفاق على البنية التحتية",
    chart: "infra",
  },
  {
    chapter: "02",
    title: "أثر التعليم على الأجيال القادمة",
    body:
      "ارتفع معدل الالتحاق بالمدارس بنسبة 41% بعد تطوير 210 مدرسة وإنشاء فصول جديدة بمعايير حديثة، ما يضمن وصول التعليم لأكثر من 380 ألف طالب في المرحلة الأولى.",
    stat: "210",
    statLabel: "مدرسة طُوِّرت أو أُنشئت",
    chart: "edu",
  },
  {
    chapter: "03",
    title: "قطاع صحي يخدم الجميع",
    body:
      "55 وحدة صحية بأحدث التجهيزات وُزِّعت على القرى لتقليل زمن الوصول للخدمة الصحية إلى أقل من 15 دقيقة، مع برامج تدريبية للكوادر الطبية شملت 1,200 ممارس.",
    stat: "15",
    statSuffix: " دقيقة",
    statLabel: "متوسط زمن الوصول للخدمة",
    chart: "health",
  },
];

const insights = [
  "تركيز واضح على البنية التحتية كأساس للنمو المستدام.",
  "الخدمات الصحية ما زالت تحتاج لمضاعفة التمويل.",
  "ارتفع مؤشر التنمية البشرية بنسبة 122% خلال أربع سنوات.",
  "وصول الخدمات لـ 1.5 مليون مواطن في المرحلة الأولى.",
];

const recommendations = [
  "زيادة تخصيص الموارد لقطاع الصحة بنسبة لا تقل عن 10%.",
  "تعزيز برامج التشغيل المحلي لخفض البطالة في القرى.",
  "إنشاء منصة بيانات مفتوحة لمتابعة المشاريع لحظياً.",
  "توسيع المرحلة الثانية لتشمل القرى الحدودية.",
];

/* ------------------------------- MINI CHARTS ------------------------------- */

function MiniInfraChart() {
  return (
    <svg viewBox="0 0 200 120" className="w-full">
      <defs>
        <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1F6F5F" />
          <stop offset="100%" stopColor="#6FCF97" />
        </linearGradient>
      </defs>
      {[42, 23, 20, 15].map((v, i) => (
        <g key={i}>
          <motion.rect
            initial={{ height: 0, y: 100 }}
            whileInView={{ height: v * 1.8, y: 100 - v * 1.8 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
            x={20 + i * 45}
            width="28"
            fill="url(#g1)"
            rx="6"
          />
          <text x={20 + i * 45 + 14} y={115} textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="Tajawal">
            {["بنية", "تعليم", "صحة", "خدمات"][i]}
          </text>
        </g>
      ))}
    </svg>
  );
}

function MiniEduChart() {
  return (
    <svg viewBox="0 0 200 120" className="w-full">
      <defs>
        <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6FCF97" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#1F6F5F" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6 }}
        d="M 10 90 Q 50 70, 80 60 T 150 30 L 190 15"
        stroke="#1F6F5F"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path d="M 10 90 Q 50 70, 80 60 T 150 30 L 190 15 L 190 110 L 10 110 Z" fill="url(#g2)" />
      {[10, 80, 150, 190].map((x, i) => (
        <circle key={i} cx={x} cy={[90, 60, 30, 15][i]} r="3" fill="#1F6F5F" />
      ))}
    </svg>
  );
}

function MiniHealthChart() {
  return (
    <svg viewBox="0 0 200 120" className="w-full">
      <circle cx="100" cy="60" r="46" fill="none" stroke="#e5e7eb" strokeWidth="10" />
      <motion.circle
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 0.78 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        cx="100"
        cy="60"
        r="46"
        fill="none"
        stroke="url(#g3)"
        strokeWidth="10"
        strokeLinecap="round"
        transform="rotate(-90 100 60)"
      />
      <defs>
        <linearGradient id="g3">
          <stop offset="0%" stopColor="#1F6F5F" />
          <stop offset="100%" stopColor="#6FCF97" />
        </linearGradient>
      </defs>
      <text x="100" y="60" textAnchor="middle" fontSize="22" fill="#1F6F5F" fontFamily="Tajawal" fontWeight="900">78%</text>
      <text x="100" y="78" textAnchor="middle" fontSize="9" fill="#6b7280" fontFamily="Tajawal">تغطية صحية</text>
    </svg>
  );
}

function chartFor(id: string) {
  if (id === "infra") return <MiniInfraChart />;
  if (id === "edu") return <MiniEduChart />;
  return <MiniHealthChart />;
}

/* ------------------------------- DOWNLOAD BUTTON ------------------------------- */

type DLState = "idle" | "preparing" | "success";

function DownloadButton({ size = "lg", onPreview }: { size?: "lg" | "md"; onPreview?: () => void }) {
  const [ripple, setRipple] = useState<{ x: number; y: number; id: number } | null>(null);
  const [state, setState] = useState<DLState>("idle");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (state !== "preparing") return;
    setProgress(0);
    const start = performance.now();
    const duration = 1700;
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 2.2);
      setProgress(Math.round(eased * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
      else {
        setState("success");
        setTimeout(() => setState("idle"), 2200);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state]);

  const handle = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (state !== "idle") return;
    const r = e.currentTarget.getBoundingClientRect();
    setRipple({ x: e.clientX - r.left, y: e.clientY - r.top, id: Date.now() });
    setState("preparing");

    // Trigger actual PDF download after animation
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = "/report.pdf";
      link.download = "Hayah-Karima-Report-2026.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 1800);
  };

  const padding = size === "lg" ? "px-8 py-4 text-base" : "px-5 py-3 text-sm";
  const minWidth = size === "lg" ? "min-w-[280px]" : "min-w-[230px]";

  return (
    <div className="inline-flex flex-col items-stretch gap-2">
      <motion.button
        onClick={handle}
        disabled={state !== "idle"}
        whileTap={state === "idle" ? { scale: 0.94 } : undefined}
        className={`group relative overflow-hidden rounded-full text-white ${padding} ${minWidth} flex items-center justify-center gap-3 whitespace-nowrap shadow-2xl shadow-[#1F6F5F]/40 hover:shadow-[#1F6F5F]/70 transition disabled:cursor-default`}
        style={{ fontWeight: 800 }}
      >
        {/* gradient base */}
        <span className="absolute inset-0 bg-gradient-to-l from-[#1F6F5F] to-[#2FA084]" />
        {/* glow */}
        <span className="absolute -inset-2 rounded-full bg-gradient-to-l from-[#6FCF97] to-[#2FA084] opacity-0 group-hover:opacity-40 blur-xl transition pointer-events-none" />
        {/* shimmer sweep on hover */}
        <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1200ms] bg-gradient-to-l from-transparent via-white/25 to-transparent pointer-events-none" />
        {/* progress fill while preparing */}
        {state === "preparing" && (
          <motion.span
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.05 }}
            className="absolute inset-y-0 right-0 bg-white/15 backdrop-blur-sm"
          />
        )}
        {/* success wash */}
        {state === "success" && (
          <motion.span
            initial={{ scale: 0, opacity: 0.7 }}
            animate={{ scale: 4, opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="absolute inset-0 m-auto w-10 h-10 rounded-full bg-[#6FCF97]"
          />
        )}
        {/* ripple */}
        {ripple && (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.55 }}
            animate={{ scale: 9, opacity: 0 }}
            transition={{ duration: 0.9 }}
            className="absolute w-8 h-8 rounded-full bg-white pointer-events-none"
            style={{ left: ripple.x - 16, top: ripple.y - 16 }}
            onAnimationComplete={() => setRipple(null)}
          />
        )}

        <span className="relative flex items-center gap-3">
          <AnimatePresence mode="wait" initial={false}>
            {state === "idle" && (
              <motion.span
                key="i-idle"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <span className="w-9 h-9 rounded-full bg-white/20 grid place-items-center group-hover:bg-white/30">
                  <Download className="w-4 h-4 group-hover:translate-y-0.5 transition" />
                </span>
                تحميل التقرير الكامل (PDF)
              </motion.span>
            )}
            {state === "preparing" && (
              <motion.span
                key="i-prep"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <span className="w-9 h-9 rounded-full bg-white/20 grid place-items-center">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </span>
                <span className="flex items-center gap-2">
                  جاري تجهيز التقرير...
                  <span className="text-white/80 text-sm tabular-nums">{progress}%</span>
                </span>
              </motion.span>
            )}
            {state === "success" && (
              <motion.span
                key="i-ok"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
                className="flex items-center gap-3"
              >
                <motion.span
                  initial={{ scale: 0, rotate: -30 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 350, damping: 18 }}
                  className="w-9 h-9 rounded-full bg-white grid place-items-center text-[#1F6F5F] shadow-md"
                >
                  <Check className="w-5 h-5" strokeWidth={3} />
                </motion.span>
                تم تجهيز التقرير ✔
              </motion.span>
            )}
          </AnimatePresence>
        </span>
      </motion.button>

      {/* progress bar (visible during preparing + brief success hold) */}
      <div className={`h-1 rounded-full overflow-hidden bg-white/15 ${state === "idle" ? "opacity-0" : "opacity-100"} transition-opacity`}>
        <motion.div
          animate={{ width: state === "success" ? "100%" : `${progress}%` }}
          transition={{ ease: "linear", duration: 0.05 }}
          className="h-full bg-gradient-to-l from-[#6FCF97] to-white rounded-full"
        />
      </div>

      {/* meta + preview link */}
      <div className="flex items-center gap-2 flex-wrap text-[11px] text-white/70">
        <span className="flex items-center gap-1"><FileText className="w-3 h-3" /> PDF · ~1.4MB</span>
        {onPreview && (
          <button
            type="button"
            onClick={onPreview}
            className="underline-offset-4 underline hover:text-white transition"
          >
            معاينة قبل التحميل
          </button>
        )}
      </div>

      {/* success toast (offers preview) */}
      <AnimatePresence>
        {state === "success" && onPreview && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={onPreview}
            className="self-start mt-1 flex items-center gap-2 text-xs px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition"
          >
            <Eye className="w-3 h-3" /> فتح المعاينة
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------- MAIN REPORT ------------------------------- */

export function Report() {
  const ref = useRef<HTMLDivElement>(null);
  const [preview, setPreview] = useState(false);
  const [showStickyCta, setShowStickyCta] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      setShowStickyCta(r.top < window.innerHeight && r.bottom > 0);
    };
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section id="report" ref={ref} style={{ position: "relative" }} className="bg-[#EEEEEE] dark:bg-zinc-950 overflow-hidden">
      <ReportProgress targetRef={ref} />

      {/* Editorial paper texture */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #1F6F5F 1px, transparent 0)", backgroundSize: "22px 22px" }}
      />

      {/* ============== COVER ============== */}
      <div className="relative min-h-[80vh] flex items-center bg-gradient-to-br from-[#1F6F5F] via-[#1F6F5F] to-[#0e3d34] text-white overflow-hidden">
        {/* ornaments */}
        <motion.div animate={{ y: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity }} className="absolute -top-20 -right-20 w-[480px] h-[480px] rounded-full bg-[#6FCF97]/15 blur-3xl" />
        <motion.div animate={{ y: [0, -30, 0] }} transition={{ duration: 16, repeat: Infinity }} className="absolute -bottom-20 -left-20 w-[420px] h-[420px] rounded-full bg-[#2FA084]/20 blur-3xl" />
        <div className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative app-container grid lg:grid-cols-12 gap-10 items-center w-full">
          <Reveal className="lg:col-span-7">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-10 bg-[#6FCF97]" />
                <span className="text-[#6FCF97] tracking-[0.3em] text-xs" style={{ fontWeight: 800 }}>تقرير 2026</span>
              </div>
              <h2 className="text-4xl md:text-6xl leading-tight" style={{ fontWeight: 900 }}>
                تقرير تحليل مبادرة
                <br />
                <span className="bg-gradient-to-l from-[#6FCF97] to-white bg-clip-text text-transparent">حياة كريمة</span>
                <br />
                في محافظة قنا
              </h2>
              <p className="mt-6 text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed">
                تحليل البيانات والتأثير التنموي — رحلة بصرية وثائقية تستعرض المشاريع،
                الأرقام، والأثر على حياة 1.5 مليون مواطن.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <DownloadButton onPreview={() => setPreview(true)} />
                <div className="flex items-center gap-2 text-white/70 text-sm">
                  <button onClick={() => setPreview(true)} className="px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur hover:bg-white/15 transition flex items-center gap-2" style={{ fontWeight: 700 }}>
                    <Eye className="w-4 h-4" /> معاينة قبل التحميل
                  </button>
                </div>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-white/60">
                <div><span className="text-white" style={{ fontWeight: 800 }}>120</span> صفحة</div>
                <div><span className="text-white" style={{ fontWeight: 800 }}>4</span> فصول رئيسية</div>
                <div><span className="text-white" style={{ fontWeight: 800 }}>25+</span> رسم بياني</div>
                <div><span className="text-white" style={{ fontWeight: 800 }}>2026</span> الإصدار</div>
              </div>
            </div>
          </Reveal>

          {/* Document mockup */}
          <Reveal x={50} className="lg:col-span-5">
            <div className="relative mx-auto">
              <div className="absolute -inset-8 bg-white/10 blur-3xl rounded-3xl" />
              <motion.div
                whileHover={{ rotate: -2, y: -6 }}
                className="relative w-72 mx-auto h-[420px] bg-white rounded-2xl shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] overflow-hidden"
                style={{ transform: "rotate(3deg)" }}
              >
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-l from-[#1F6F5F] via-[#2FA084] to-[#6FCF97]" />
                <div className="p-7 text-zinc-800">
                  <div className="text-[10px] tracking-widest text-[#2FA084]" style={{ fontWeight: 800 }}>HAYAH KAREEMA · QENA</div>
                  <div className="mt-4 h-px w-12 bg-[#2FA084]" />
                  <h3 className="mt-4 text-xl text-[#1F6F5F]" style={{ fontWeight: 900 }}>تقرير الأثر التنموي 2026</h3>
                  <div className="mt-4 space-y-2">
                    {[95, 78, 88, 65, 92, 70, 84].map((w, i) => (
                      <div key={i} className="h-1.5 rounded-full bg-zinc-100">
                        <div className="h-full rounded-full bg-gradient-to-l from-[#1F6F5F] to-[#6FCF97]" style={{ width: `${w}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[#6FCF97]/40 to-[#2FA084]/30" />
                    <div className="aspect-[4/3] rounded-xl bg-gradient-to-br from-[#1F6F5F]/30 to-[#2FA084]/20" />
                  </div>
                  <div className="absolute bottom-5 left-7 right-7 flex items-center justify-between text-[10px] text-zinc-400">
                    <span>صفحة 1 / 120</span>
                    <span style={{ fontWeight: 700 }}>وزارة التنمية المحلية</span>
                  </div>
                </div>
              </motion.div>
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-3 right-12 w-40 px-4 py-3 rounded-2xl bg-white text-zinc-800 shadow-2xl flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-xl bg-[#1F6F5F] grid place-items-center text-white">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[10px] text-zinc-400">القراءة</div>
                  <div className="text-sm" style={{ fontWeight: 800 }}>~ 18 دقيقة</div>
                </div>
              </motion.div>
            </div>
          </Reveal>
        </div>
      </div>

      {/* ============== EXECUTIVE SUMMARY ============== */}
      <div className="app-container app-section">
        <Reveal>
          <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
            <div>
              <div className="text-[#2FA084] text-sm tracking-[0.3em]" style={{ fontWeight: 800 }}>EXECUTIVE SUMMARY</div>
              <h3 className="mt-2 text-3xl md:text-4xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>الملخص التنفيذي</h3>
            </div>
            <p className="max-w-md text-zinc-600 dark:text-zinc-400 leading-relaxed">
              تجميع لأبرز الأرقام والمؤشرات التي يستعرضها التقرير عبر 120 صفحة من البيانات والتحليلات.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {summary.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="relative p-6 rounded-3xl bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xl shadow-black/5 group hover:-translate-y-1 transition">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${s.tone} grid place-items-center text-white shadow-lg`}>
                  <s.icon className="w-6 h-6" />
                </div>
                <div className="mt-4 text-3xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>{s.value}</div>
                <div className="text-sm text-zinc-500 mt-1">{s.label}</div>
                <div className={`absolute bottom-0 right-0 left-0 h-0.5 bg-gradient-to-l ${s.tone} scale-x-0 group-hover:scale-x-100 transition origin-right`} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* ============== EDITORIAL DIVIDER ============== */}
      <div className="app-container">
        <div className="flex items-center gap-4 text-[#2FA084]">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-[#2FA084]/40" />
          <Quote className="w-6 h-6" />
          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-[#2FA084]/40" />
        </div>
        <Reveal>
          <p className="text-center max-w-3xl mx-auto py-10 text-2xl md:text-3xl text-[#1F6F5F] dark:text-white leading-relaxed" style={{ fontWeight: 800 }}>
            «المبادرة لم تُغيِّر الأرقام فحسب — بل أعادت رسم وجه القرية المصرية في الصعيد.»
          </p>
        </Reveal>
        <div className="h-px bg-gradient-to-l from-transparent via-[#2FA084]/40 to-transparent" />
      </div>

      {/* ============== ALTERNATING SECTIONS ============== */}
      <div className="app-container app-section space-y-16 md:space-y-24">
        {sections.map((s, i) => {
          const reversed = i % 2 === 1;
          return (
            <div key={s.chapter} className={`grid lg:grid-cols-12 gap-10 items-center ${reversed ? "lg:[direction:ltr]" : ""}`}>
              {/* Text */}
              <Reveal x={reversed ? 50 : -50} className="lg:col-span-6">
                <div className="[direction:rtl]">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-7xl text-[#1F6F5F]/10 dark:text-white/10 -mb-4" style={{ fontWeight: 900 }}>
                      {s.chapter}
                    </span>
                    <span className="text-xs tracking-[0.3em] text-[#2FA084]" style={{ fontWeight: 800 }}>الفصل {s.chapter}</span>
                  </div>
                  <h3 className="text-3xl md:text-4xl text-[#1F6F5F] dark:text-white leading-tight" style={{ fontWeight: 900 }}>
                    {s.title}
                  </h3>
                  <p className="mt-5 text-zinc-600 dark:text-zinc-400 leading-loose text-lg">
                    {s.body}
                  </p>
                  <div className="mt-7 inline-flex items-baseline gap-2 px-5 py-3 rounded-2xl bg-gradient-to-l from-[#1F6F5F]/10 to-[#6FCF97]/10 border border-[#2FA084]/20">
                    <span className="text-3xl text-[#1F6F5F] dark:text-[#6FCF97]" style={{ fontWeight: 900 }}>{s.stat}</span>
                    {s.statSuffix && <span className="text-[#1F6F5F] dark:text-[#6FCF97]" style={{ fontWeight: 700 }}>{s.statSuffix}</span>}
                    <span className="text-zinc-500 text-sm mr-2">— {s.statLabel}</span>
                  </div>
                </div>
              </Reveal>

              {/* Visual */}
              <Reveal x={reversed ? -50 : 50} delay={0.1} className="lg:col-span-6">
                <div className="[direction:rtl]">
                  <div className="relative">
                    <div className="absolute -inset-3 bg-gradient-to-br from-[#6FCF97]/20 to-[#2FA084]/10 blur-2xl rounded-3xl" />
                    <div className="relative p-8 rounded-3xl bg-white/80 dark:bg-white/[0.04] backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xl">
                      <div className="text-xs text-zinc-500 tracking-widest mb-4" style={{ fontWeight: 700 }}>FIG. 0{i + 1}</div>
                      {chartFor(s.chart)}
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>
          );
        })}
      </div>

      {/* ============== KEY INSIGHTS ============== */}
      <div className="bg-gradient-to-br from-[#1F6F5F] to-[#0e3d34] text-white app-section relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "100% 30px",
          }}
        />
        <div className="app-container relative">
          <Reveal>
            <div className="text-center mb-14">
              <span className="text-[#6FCF97] tracking-[0.3em] text-xs" style={{ fontWeight: 800 }}>KEY INSIGHTS</span>
              <h3 className="mt-3 text-3xl sm:text-4xl md:text-5xl" style={{ fontWeight: 900 }}>أبرز الرؤى</h3>
            </div>
          </Reveal>
          <div className="space-y-5 max-w-4xl mx-auto">
            {insights.map((it, i) => (
              <Reveal key={i} delay={i * 0.1} x={i % 2 ? 30 : -30}>
                <div className="flex items-start gap-5 group">
                  <div className="shrink-0 text-5xl text-[#6FCF97]/40 leading-none" style={{ fontWeight: 900 }}>
                    0{i + 1}
                  </div>
                  <div className="flex-1 pb-5 border-b border-white/10 group-hover:border-[#6FCF97]/40 transition">
                    <p className="text-2xl md:text-3xl leading-snug" style={{ fontWeight: 800 }}>{it}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* ============== CONCLUSION ============== */}
      <div className="app-container app-section">
        <Reveal>
          <div className="text-center mb-12">
            <span className="text-[#2FA084] tracking-[0.3em] text-xs" style={{ fontWeight: 800 }}>CONCLUSION</span>
            <h3 className="mt-2 text-3xl sm:text-4xl md:text-5xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>الخاتمة والتوصيات</h3>
            <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-loose">
              أحدثت المرحلة الأولى من المبادرة تحولاً جوهرياً في جودة حياة سكان قنا.
              للحفاظ على هذا الزخم، يقدّم التقرير التوصيات التالية:
            </p>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {recommendations.map((r, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <div className="flex items-start gap-3 p-5 rounded-2xl bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-white/60 dark:border-white/10">
                <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[#1F6F5F] to-[#6FCF97] grid place-items-center text-white">
                  <Check className="w-4 h-4" />
                </div>
                <p className="text-zinc-700 dark:text-zinc-200 leading-relaxed pt-0.5">{r}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* FINAL CTA */}
        <Reveal>
          <div className="mt-16 relative rounded-[2rem] overflow-hidden p-10 md:p-14 bg-gradient-to-br from-[#1F6F5F] via-[#2FA084] to-[#6FCF97] text-white text-center shadow-2xl">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 30%, #fff, transparent 50%)" }} />
            <div className="relative">
              <h3 className="text-3xl md:text-4xl" style={{ fontWeight: 900 }}>اقرأ القصة الكاملة</h3>
              <p className="mt-3 text-white/85 max-w-xl mx-auto">120 صفحة من البيانات والتحليلات والقصص الإنسانية.</p>
              <div className="mt-7 flex justify-center">
                <DownloadButton onPreview={() => setPreview(true)} />
              </div>
              <div className="mt-6 flex justify-center gap-2 text-xs text-white/80">
                <button className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 flex items-center gap-1.5"><Share2 className="w-3 h-3" /> مشاركة</button>
                <button className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 flex items-center gap-1.5"><Printer className="w-3 h-3" /> طباعة</button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* ============== STICKY FLOATING DOWNLOAD ============== */}
      {showStickyCta && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-6 left-6 z-40 p-3 rounded-3xl bg-[#0e3d34]/90 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
          <DownloadButton size="md" onPreview={() => setPreview(true)} />
        </motion.div>
      )}

      <PreviewModal open={preview} onClose={() => setPreview(false)} />
    </section>
  );
}

/* ------------------------------- FOOTER ------------------------------- */

export function Footer() {
  return (
    <footer className="relative bg-zinc-950 text-zinc-400 overflow-hidden">
      {/* Wave divider */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" fill="none" className="w-full h-auto -translate-y-[99%]" preserveAspectRatio="none">
          <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,30 1440,40 L1440,80 L0,80 Z" fill="#09090b" />
        </svg>
      </div>

      {/* Background ornament */}
      <div className="absolute top-20 right-0 w-[400px] h-[400px] rounded-full bg-[#1F6F5F]/5 blur-[120px] pointer-events-none" />

      <div className="app-container pt-20 pb-8">
        {/* Newsletter */}
        <div className="mb-16 p-8 md:p-12 rounded-3xl bg-gradient-to-l from-[#1F6F5F] to-[#2FA084] relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #fff 1px, transparent 0)", backgroundSize: "30px 30px" }} />
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl md:text-3xl text-white" style={{ fontWeight: 900 }}>تابع آخر مستجدات المبادرة</h3>
              <p className="mt-2 text-white/70 text-sm">اشترك في النشرة الإخبارية ليصلك كل جديد</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input placeholder="بريدك الإلكتروني" className="flex-1 md:w-64 px-5 py-3 rounded-2xl bg-white/15 border border-white/20 text-white placeholder-white/40 text-sm outline-none focus:border-white/50 transition backdrop-blur-md" />
              <button className="px-6 py-3 rounded-2xl bg-white text-[#1F6F5F] hover:bg-white/90 transition shadow-xl text-sm shrink-0" style={{ fontWeight: 800 }}>اشتراك</button>
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1F6F5F] to-[#6FCF97] grid place-items-center text-white shadow-lg shadow-[#1F6F5F]/30" style={{ fontWeight: 900, fontSize: "1.1rem" }}>ح</div>
              <div>
                <div className="text-white text-lg" style={{ fontWeight: 900 }}>حياة كريمة — قنا</div>
                <div className="text-xs text-zinc-500">منصة GeoAI · تقرير الأثر التنموي 2026</div>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-md text-zinc-400">
              منصة تفاعلية متقدمة تستعرض أثر مبادرة حياة كريمة في 86 قرية بصعيد مصر. نستخدم الذكاء الاصطناعي الجغرافي لرسم خريطة التنمية.
            </p>
            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {["𝕏", "f", "in", "📷"].map((s, i) => (
                <button key={i} className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 grid place-items-center text-zinc-400 hover:text-[#6FCF97] hover:border-[#6FCF97]/30 hover:bg-[#6FCF97]/5 transition text-sm" style={{ fontWeight: 700 }}>{s}</button>
              ))}
            </div>
          </div>

          <div>
            <div className="text-white mb-4" style={{ fontWeight: 800 }}>روابط سريعة</div>
            <ul className="space-y-3 text-sm">
              {[
                { id: "hero", label: "الرئيسية" },
                { id: "map", label: "الخريطة التفاعلية" },
                { id: "dashboard", label: "لوحة البيانات" },
                { id: "timeline", label: "الخط الزمني" },
                { id: "stories", label: "قصص النجاح" },
                { id: "report", label: "التقرير الشامل" },
              ].map((l) => (
                <li key={l.id}><a href={`#${l.id}`} className="hover:text-[#6FCF97] transition">{l.label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-white mb-4" style={{ fontWeight: 800 }}>تواصل معنا</div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">📍 وزارة التنمية المحلية</li>
              <li className="flex items-center gap-2">✉️ info@hayatkareema.gov.eg</li>
              <li className="flex items-center gap-2">📞 +20 100 000 0000</li>
              <li className="flex items-center gap-2">🌐 hayatkareema.gov.eg</li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
          <span>© {new Date().getFullYear()} — مبادرة حياة كريمة. جميع الحقوق محفوظة.</span>
          <div className="flex items-center gap-1 text-zinc-500">
            صُنع بـ <span className="text-red-500">❤</span> لصعيد مصر · مدعوم بـ <span className="text-[#6FCF97]" style={{ fontWeight: 700 }}>GeoAI</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
