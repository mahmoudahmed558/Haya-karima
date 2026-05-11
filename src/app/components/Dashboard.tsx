import { motion, AnimatePresence } from "motion/react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  LineChart,
  Line,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  GraduationCap,
  HeartPulse,
  Construction,
  Droplets,
  Activity,
  Play,
  Pause,
  Sparkles,
  Layers,
  ArrowLeftRight,
  Hash,
  Users as UsersIcon,
  ChevronLeft,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import masterData from "../data/master.json";

/* ------------------------------- DATA ------------------------------- */

// Precompute new data aggregations
const newSectorCounts = masterData.reduce((acc: Record<string, number>, curr: any) => {
  acc[curr['القطاع']] = (acc[curr['القطاع']] || 0) + 1;
  return acc;
}, {});

const newCenterCounts = masterData.reduce((acc: Record<string, number>, curr: any) => {
  acc[curr['المركز']] = (acc[curr['المركز']] || 0) + 1;
  return acc;
}, {});

const keywordCounts: Record<string, number> = { "مدرسة": 0, "محطة معالجة": 0, "محطة مياه": 0, "وحدة صحية": 0, "طريق": 0, "كهرباء": 0 };
masterData.forEach((p: any) => {
  const name = p["اسم المشروع"] || "";
  if (name.includes("مدرسة") || name.includes("تعليم")) keywordCounts["مدرسة"]++;
  if (name.includes("صرف") || name.includes("محطة معالجة")) keywordCounts["محطة معالجة"]++;
  if (name.includes("مياه") || name.includes("محطة مياه")) keywordCounts["محطة مياه"]++;
  if (name.includes("وحدة") || name.includes("صحة") || name.includes("مستشفى")) keywordCounts["وحدة صحية"]++;
  if (name.includes("طريق") || name.includes("رصف")) keywordCounts["طريق"]++;
  if (name.includes("كهرباء") || name.includes("محول")) keywordCounts["كهرباء"]++;
});

const keywordsData = Object.entries(keywordCounts)
  .filter(([_, count]) => count > 0)
  .map(([name, count]) => ({ name, count }))
  .sort((a, b) => b.count - a.count);

const topKeyword = keywordsData[0]?.name || "مشاريع متنوعة";
const topCenter = Object.entries(newCenterCounts).sort((a,b) => (b[1] as number) - (a[1] as number))[0]?.[0] || "قنا";
const aiSummaryText = `من خلال تحليل ${masterData.length} مشروع حديث باستخدام خوارزميات GeoAI، تبين أن التدخلات استهدفت بشكل رئيسي سد الفجوة في قطاع التعليم من خلال التركيز على إنشاء (${topKeyword})، وقد استحوذ مركز (${topCenter}) على النصيب الأكبر من هذه المشاريع كونه الأكثر احتياجاً للتطوير في الخريطة التنموية.`;

type Sector = "all" | "education" | "health" | "roads" | "sewage";

const sectorMeta: Record<Exclude<Sector, "all">, { label: string; icon: any; color: string }> = {
  education: { label: "التعليم",      icon: GraduationCap, color: "#1F6F5F" },
  health:    { label: "الصحة",         icon: HeartPulse,    color: "#2FA084" },
  roads:     { label: "الطرق",         icon: Construction,  color: "#6FCF97" },
  sewage:    { label: "الصرف الصحي",   icon: Droplets,      color: "#0e3d34" },
};

const investBySector = {
  all:       [{ name: "البنية التحتية", value: 42 }, { name: "التعليم", value: 23 }, { name: "الصحة", value: 20 }, { name: "الخدمات", value: 15 }],
  education: [{ name: "مدارس",    value: 55 }, { name: "فصول جديدة", value: 25 }, { name: "تجهيزات", value: 12 }, { name: "تدريب", value: 8 }],
  health:    [{ name: "وحدات صحية", value: 50 }, { name: "أجهزة طبية", value: 30 }, { name: "كوادر", value: 12 }, { name: "أدوية", value: 8 }],
  roads:     [{ name: "طرق رئيسية", value: 60 }, { name: "طرق فرعية", value: 25 }, { name: "كباري", value: 10 }, { name: "إنارة", value: 5 }],
  sewage:    [{ name: "محطات", value: 65 }, { name: "شبكات", value: 25 }, { name: "صيانة", value: 10 }],
} as const;

const palette = ["#10b981", "#0ea5e9", "#f59e0b", "#8b5cf6"];

const baseServicesData = [
  { key: "roads",     name: "الطرق",        count: 145, icon: Construction },
  { key: "sewage",    name: "الصرف",        count: 98,  icon: Droplets },
  { key: "water",     name: "المياه",        count: 76,  icon: Droplets },
  { key: "elec",      name: "الكهرباء",      count: 134, icon: Activity },
  { key: "schools",   name: "المدارس",       count: 62,  icon: GraduationCap },
  { key: "clinics",   name: "العيادات",      count: 48,  icon: HeartPulse },
];

const servicesData = baseServicesData.map(s => {
  let extra = 0;
  if (s.name === "المدارس") extra = newSectorCounts["المدارس"] || 0;
  if (s.name === "العيادات") extra = newSectorCounts["الوحدات الصحية"] || 0;
  if (s.name === "الصرف") extra = newSectorCounts["محطات الصرف"] || 0;
  if (s.name === "المياه") extra = newSectorCounts["محطات المياه"] || 0;
  return { ...s, count: s.count + extra };
});

const impactData = [
  { year: "2019", قبل: 32, بعد: 32 },
  { year: "2020", قبل: 34, بعد: 41 },
  { year: "2021", قبل: 36, بعد: 52 },
  { year: "2022", قبل: 37, بعد: 64 },
  { year: "2023", قبل: 38, بعد: 73 },
  { year: "2024", قبل: 39, بعد: 81 },
  { year: "2025", قبل: 40, بعد: 89 },
];

const baseVillages = [
  { id: "qena",    name: "قنا",         pop: 230000, projects: 32 },
  { id: "naghamadi", name: "نجع حمادي", pop: 95000,  projects: 26 },
  { id: "qous",    name: "قوص",         pop: 81000,  projects: 22 },
  { id: "abutsh",  name: "أبو تشت",      pop: 62000,  projects: 18 },
  { id: "farshut", name: "فرشوط",        pop: 56000,  projects: 16 },
  { id: "qift",    name: "قفط",          pop: 53000,  projects: 15 },
  { id: "dishna",  name: "دشنا",         pop: 47000,  projects: 14 },
  { id: "waqf",    name: "الوقف",        pop: 45000,  projects: 12 },
];

const villages = baseVillages.map(v => {
  let extra = 0;
  if (v.name === "أبو تشت") extra = newCenterCounts["ابو تشت"] || 0;
  if (v.name === "الوقف") extra = newCenterCounts["الوقف"] || 0;
  if (v.name === "دشنا") extra = newCenterCounts["دشنا"] || 0;
  if (v.name === "فرشوط") extra = newCenterCounts["فرشوط"] || 0;
  if (v.name === "قوص") extra = newCenterCounts["قوص"] || 0;
  return { ...v, projects: v.projects + extra };
});

const sortedVillagesByProjects = [...villages].sort((a,b) => b.projects - a.projects);
const totalMergedProjects = villages.reduce((acc, v) => acc + v.projects, 0);
const totalNewProjects = Object.values(newCenterCounts).reduce((acc, v) => acc + v, 0);
const topPerformingSectorName = "المدارس";

const insights = [
  { title: "تركيز واضح على البنية التحتية", desc: "42% من إجمالي الاستثمار وُجّه للبنية التحتية كأساس للنمو." },
  { title: "الخدمات الصحية ما زالت تحتاج دعم", desc: "20% فقط من الاستثمار للقطاع الصحي رغم النمو السكاني." },
  { title: "نمو غير مسبوق منذ 2021", desc: "ارتفع مؤشر التنمية بـ 122% خلال 4 سنوات." },
  { title: "وصول 1.5 مليون مستفيد", desc: "أكثر من 86 قرية شملتها المرحلة الأولى من المبادرة." },
];

const steps = [
  { id: "spend",  q: "كم استثمرنا؟",      icon: Wallet },
  { id: "where",  q: "فين راح الاستثمار؟", icon: Layers },
  { id: "what",   q: "إيه اللي اتبنى؟",     icon: Construction },
  { id: "impact", q: "التأثير على الناس؟", icon: Sparkles },
  { id: "analytics", q: "دراسة الأثر الشاملة", icon: UsersIcon },
];

/* ------------------------------- HELPERS ------------------------------- */

function useCounter(target: number, duration = 1.6, deps: any[] = []) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const from = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / (duration * 1000), 1);
      setVal(from + (target - from) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, ...deps]);
  return val;
}

function GlassCard({ children, className = "" }: { children: any; className?: string }) {
  return (
    <div className={`relative rounded-3xl bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-[0_10px_40px_-10px_rgba(31,111,95,0.25)] ${className}`}>
      {children}
    </div>
  );
}

function StepDots({ active, onPick }: { active: string; onPick: (id: string) => void }) {
  return (
    <div className="sticky top-20 md:top-24 z-30 flex justify-center mb-8 md:mb-10 px-4">
      <GlassCard className="px-2 py-2 flex flex-wrap justify-center items-center gap-2 md:gap-4">
        {steps.map((s) => {
          const isActive = active === s.id;
          return (
            <button
              key={s.id}
              onClick={() => onPick(s.id)}
              className={`relative px-4 py-2 rounded-2xl text-sm flex items-center gap-2 whitespace-nowrap transition ${
                isActive ? "text-white" : "text-zinc-600 dark:text-zinc-300 hover:bg-black/5 dark:hover:bg-white/5"
              }`}
              style={{ fontWeight: 700 }}
            >
              {isActive && (
                <motion.div
                  layoutId="step-active"
                  className="absolute inset-0 rounded-2xl bg-gradient-to-l from-[#1F6F5F] to-[#2FA084] shadow-lg shadow-[#1F6F5F]/30"
                  transition={{ type: "spring", stiffness: 300, damping: 28 }}
                />
              )}
              <s.icon className="w-4 h-4 relative" />
              <span className="relative hidden sm:inline">{s.q}</span>
            </button>
          );
        })}
      </GlassCard>
    </div>
  );
}

/* ------------------------------- KPI CARDS ------------------------------- */

const kpis = [
  { id: "invest",  icon: Wallet,      label: "إجمالي الاستثمار", value: 8.5, prefix: "", suffix: " مليار", trend: 12.4, color: "from-[#1F6F5F] to-[#2FA084]" },
  { id: "rate",    icon: TrendingUp,  label: "معدل الإنجاز",     value: 73,  prefix: "%", suffix: "",        trend: 8.1,  color: "from-[#2FA084] to-[#6FCF97]" },
  { id: "schools", icon: GraduationCap, label: "مدارس مطورة",    value: 210, prefix: "", suffix: "",        trend: 5.6,  color: "from-[#6FCF97] to-[#2FA084]" },
  { id: "clinics", icon: HeartPulse,  label: "وحدة صحية",         value: 55,  prefix: "", suffix: "",        trend: -2.3, color: "from-[#1F6F5F] to-[#6FCF97]" },
];

function KpiCard({ k, i }: { k: typeof kpis[number]; i: number }) {
  const v = useCounter(k.value, 1.4);
  const display = Number.isInteger(k.value) ? Math.floor(v).toLocaleString("ar-EG") : v.toFixed(1);
  const up = k.trend >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.08 }}
      animate={{ y: [0, -4, 0] }}
      // floating loop
      style={{ animationDuration: "6s" }}
      className="relative group"
    >
      <div className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${k.color} opacity-0 group-hover:opacity-40 blur-xl transition`} />
      <GlassCard className="relative p-6">
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${k.color} grid place-items-center text-white shadow-lg`}>
            <k.icon className="w-6 h-6" />
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-[11px] ${up ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}
            style={{ fontWeight: 800 }}
          >
            {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(k.trend).toFixed(1)}%
          </div>
        </div>
        <div className="mt-4 text-3xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>
          {k.prefix}{display}{k.suffix}
        </div>
        <div className="text-sm text-zinc-500 mt-1">{k.label}</div>
        {/* sparkline */}
        <svg viewBox="0 0 100 24" className="w-full h-6 mt-3" preserveAspectRatio="none">
          <defs>
            <linearGradient id={`spark-${k.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2FA084" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#2FA084" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d={`M0 ${18 - i * 2} Q 20 ${10 + i},40 ${14 - i} T 100 ${4 + i}`}
            stroke="#2FA084"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            d={`M0 ${18 - i * 2} Q 20 ${10 + i},40 ${14 - i} T 100 ${4 + i} L 100 24 L 0 24 Z`}
            fill={`url(#spark-${k.id})`}
          />
        </svg>
      </GlassCard>
    </motion.div>
  );
}

/* ------------------------------- DONUT ------------------------------- */

function Donut({ data, activeIdx, setActiveIdx }: { data: { name: string; value: number }[]; activeIdx: number | null; setActiveIdx: (i: number | null) => void }) {
  const totals = data.reduce((s, d) => s + d.value, 0);
  const hovered = activeIdx != null ? data[activeIdx] : null;
  const centerVal = useCounter(hovered ? hovered.value : totals, 0.6, [activeIdx]);
  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            innerRadius={75}
            outerRadius={activeIdx != null ? 115 : 110}
            paddingAngle={3}
            stroke="none"
            isAnimationActive
            animationDuration={900}
            onMouseEnter={(_, idx) => setActiveIdx(idx)}
            onMouseLeave={() => setActiveIdx(null)}
          >
            {data.map((d, i) => (
              <Cell
                key={`donut-${d.name}`}
                fill={palette[i % palette.length]}
                opacity={activeIdx == null || activeIdx === i ? 1 : 0.35}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 grid place-items-center pointer-events-none text-center">
        <div>
          <div className="text-xs text-white/60" style={{ fontWeight: 700 }}>
            {hovered ? hovered.name : "الإجمالي"}
          </div>
          <div className="text-3xl text-white" style={{ fontWeight: 900 }}>
            {Math.round(centerVal)}%
          </div>
          {hovered && (
            <div className="text-[11px] text-white/60 mt-0.5">من إجمالي الاستثمار</div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- DASHBOARD ------------------------------- */

export function Dashboard() {
  const [sector, setSector] = useState<Sector>("all");
  const [village, setVillage] = useState<string>("all");
  const [mode, setMode] = useState<"numbers" | "impact">("numbers");
  const [activeStep, setActiveStep] = useState("spend");
  const [donutHover, setDonutHover] = useState<number | null>(null);
  const [hoverBar, setHoverBar] = useState<string | null>(null);
  const [playing, setPlaying] = useState(true);
  const [insightIdx, setInsightIdx] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAIResults, setShowAIResults] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  const runAnalysis = () => {
    if (showAIResults) {
      setShowAIResults(false);
      return;
    }
    setIsAnalyzing(true);
    document.getElementById("step-analytics")?.scrollIntoView({ behavior: "smooth" });
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowAIResults(true);
      setTimeout(() => {
        document.getElementById("ai-results")?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }, 2500);
  };
  const [compareA, setCompareA] = useState("qena");
  const [compareB, setCompareB] = useState("naghamadi");
  const [chartType, setChartType] = useState<"area" | "bar" | "line">("area");

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Track active step on scroll
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveStep(e.target.id.replace("step-", ""));
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    Object.values(sectionRefs.current).forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Auto-play insights walkthrough
  useEffect(() => {
    if (!playing) return;
    const id = setInterval(() => setInsightIdx((p) => (p + 1) % insights.length), 2500);
    return () => clearInterval(id);
  }, [playing]);

  const investData = useMemo(() => investBySector[sector] as unknown as { name: string; value: number }[], [sector]);

  const filteredServices = useMemo(() => {
    if (sector === "all") return servicesData;
    const map: Record<Exclude<Sector, "all">, string[]> = {
      education: ["schools"],
      health:    ["clinics"],
      roads:     ["roads"],
      sewage:    ["sewage", "water"],
    };
    return servicesData.filter((s) => map[sector].includes(s.key));
  }, [sector]);

  const goToStep = (id: string) => {
    sectionRefs.current[id]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const A = villages.find((v) => v.id === compareA)!;
  const B = villages.find((v) => v.id === compareB)!;

  return (
    <section
      id="dashboard"
      className="app-section bg-[radial-gradient(circle_at_50%_0%,rgba(111,207,151,0.15),transparent_60%)] dark:bg-zinc-950 relative overflow-hidden"
    >
      {/* GEOAI FULLSCREEN OVERLAY */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-zinc-950/90 backdrop-blur-xl flex flex-col items-center justify-center text-[#6FCF97]"
            style={{ fontFamily: 'monospace' }}
          >
            <Sparkles className="w-16 h-16 mb-6 animate-pulse" />
            <div className="text-xl md:text-3xl mb-4 font-bold tracking-widest text-[#2FA084]">
              GEO-AI ANALYSIS IN PROGRESS...
            </div>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "20rem" }}
              transition={{ duration: 2.2 }}
              className="h-1 bg-[#6FCF97] rounded-full"
            />
            <div className="mt-6 text-sm opacity-80 flex flex-col items-center gap-2">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>&gt; Reading {masterData.length} project records...</motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>&gt; Extracting semantic keywords...</motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>&gt; Correlating spatial coordinates...</motion.div>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>&gt; Generating non-specialist insights...</motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #1F6F5F 1px, transparent 0)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="app-container relative">
        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
          <span className="px-4 py-1 rounded-full bg-[#6FCF97]/20 text-[#1F6F5F] dark:text-[#6FCF97] text-sm" style={{ fontWeight: 700 }}>
            تحليل البيانات التفاعلي
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>
            رحلة الأرقام: من الاستثمار إلى الأثر
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">
            استكشف القصة وراء البيانات في أربع خطوات تفاعلية
          </p>
        </motion.div>

        {/* CONTROLS BAR */}
        <GlassCard className="p-3 flex flex-wrap gap-3 items-center mb-8">
          {/* Sector chips */}
          <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 rounded-2xl p-1">
            {(["all", "education", "health", "roads", "sewage"] as Sector[]).map((s) => {
              const meta = s === "all" ? { label: "الكل", icon: Layers, color: "#1F6F5F" } : sectorMeta[s];
              const active = sector === s;
              return (
                <button
                  key={s}
                  onClick={() => setSector(s)}
                  className={`relative px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition ${
                    active ? "text-white" : "text-zinc-600 dark:text-zinc-300 hover:bg-white/40 dark:hover:bg-white/5"
                  }`}
                  style={{ fontWeight: 700 }}
                >
                  {active && (
                    <motion.span
                      layoutId="sector-pill"
                      className="absolute inset-0 rounded-xl"
                      style={{ background: meta.color }}
                      transition={{ type: "spring", stiffness: 300, damping: 26 }}
                    />
                  )}
                  <meta.icon className="w-3.5 h-3.5 relative" />
                  <span className="relative">{meta.label}</span>
                </button>
              );
            })}
          </div>

          {/* Village select */}
          <select
            value={village}
            onChange={(e) => setVillage(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-black/5 dark:bg-white/5 border border-transparent focus:border-[#2FA084] outline-none"
            style={{ fontWeight: 700 }}
          >
            <option value="all">كل القرى</option>
            {villages.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>

          {/* Mode toggle */}
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/5 rounded-2xl p-1">
            <button
              onClick={() => setMode("numbers")}
              className={`relative px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 ${
                mode === "numbers" ? "bg-white dark:bg-zinc-700 shadow text-[#1F6F5F] dark:text-white" : "text-zinc-500"
              }`}
              style={{ fontWeight: 700 }}
            >
              <Hash className="w-3.5 h-3.5" /> عرض الأرقام
            </button>
            <button
              onClick={() => setMode("impact")}
              className={`relative px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 ${
                mode === "impact" ? "bg-white dark:bg-zinc-700 shadow text-[#1F6F5F] dark:text-white" : "text-zinc-500"
              }`}
              style={{ fontWeight: 700 }}
            >
              <UsersIcon className="w-3.5 h-3.5" /> عرض التأثير
            </button>
          </div>

          <div className="mr-auto flex items-center gap-2">
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition ${
                compareMode ? "bg-[#1F6F5F] text-white" : "bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-300"
              }`}
              style={{ fontWeight: 700 }}
            >
              <ArrowLeftRight className="w-3.5 h-3.5" /> وضع المقارنة
            </button>
            <button
              onClick={runAnalysis}
              disabled={isAnalyzing}
              className={`px-3 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all shadow-lg ${
                showAIResults ? "bg-rose-500 text-white hover:bg-rose-600" : "bg-gradient-to-l from-[#1F6F5F] to-[#2FA084] text-white hover:scale-105"
              }`}
              style={{ fontWeight: 800 }}
            >
              {isAnalyzing ? <Activity className="w-3.5 h-3.5 animate-spin" /> : showAIResults ? <X className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              {isAnalyzing ? "جاري التحليل..." : showAIResults ? "إغلاق التحليل" : "تشغيل التحليل الذكي"}
            </button>
          </div>
        </GlassCard>

        {/* STICKY MINI NAV */}
        <StepDots active={activeStep} onPick={goToStep} />

        {/* STEP 1 — كم استثمرنا؟ */}
        <div
          id="step-spend"
          ref={(el) => { sectionRefs.current.spend = el; }}
          className="mb-14"
        >
          <StepHeader index={1} q={steps[0].q} subtitle="نظرة عامة على ضخ الاستثمارات والإنجاز." />
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {kpis.map((k, i) => <KpiCard key={k.id} k={k} i={i} />)}
          </div>
        </div>

        <Divider />

        {/* STEP 2 — فين راح الاستثمار؟ */}
        <div
          id="step-where"
          ref={(el) => { sectionRefs.current.where = el; }}
          className="mb-14"
        >
          <StepHeader index={2} q={steps[1].q} subtitle="توزيع الاستثمارات بحسب القطاع والمحور." />
          <div className="grid lg:grid-cols-5 gap-6 mt-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 relative p-6 rounded-3xl bg-gradient-to-br from-[#1F6F5F] via-[#2a8973] to-[#2FA084] text-white shadow-2xl shadow-[#1F6F5F]/30 overflow-hidden"
            >
              <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
              <h3 className="text-xl mb-1" style={{ fontWeight: 800 }}>توزيع الاستثمار</h3>
              <p className="text-white/70 text-xs">{sector === "all" ? "حسب القطاعات الرئيسية" : `داخل قطاع ${sectorMeta[sector].label}`}</p>

              <Donut data={investData} activeIdx={donutHover} setActiveIdx={setDonutHover} />

              <div className="grid grid-cols-2 gap-2 mt-2">
                {investData.map((d, i) => (
                  <button
                    key={d.name}
                    onMouseEnter={() => setDonutHover(i)}
                    onMouseLeave={() => setDonutHover(null)}
                    className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded-xl transition ${
                      donutHover === i ? "bg-white/20" : "hover:bg-white/10"
                    }`}
                  >
                    <span className="w-3 h-3 rounded" style={{ background: palette[i % palette.length] }} />
                    <span className="truncate">{d.name}</span>
                    <span className="mr-auto opacity-70" style={{ fontWeight: 800 }}>{d.value}%</span>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3"
            >
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="text-xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 800 }}>الخدمات المنفّذة</h3>
                  <div className="text-xs text-zinc-500">{mode === "numbers" ? "عدد المشاريع" : "مستفيدون (ألف)"}</div>
                </div>
                <p className="text-zinc-500 text-xs mb-3">مرّر فوق العمود لرؤية التفاصيل</p>

                <div className="grid grid-cols-6 gap-3 items-end h-[260px] pt-4">
                  {filteredServices.map((s, i) => {
                    const max = Math.max(...filteredServices.map((x) => x.count));
                    const v = mode === "numbers" ? s.count : Math.round(s.count * 11.4);
                    const max2 = mode === "numbers" ? max : Math.round(max * 11.4);
                    const heightPct = (v / max2) * 100;
                    const Icon = s.icon;
                    const active = hoverBar === s.key;
                    return (
                      <div
                        key={s.key}
                        className="relative flex flex-col items-center justify-end h-full"
                        onMouseEnter={() => setHoverBar(s.key)}
                        onMouseLeave={() => setHoverBar(null)}
                      >
                        <AnimatePresence>
                          {active && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="absolute -top-2 px-2.5 py-1.5 rounded-xl bg-[#1F6F5F] text-white text-xs shadow-lg z-10"
                              style={{ fontWeight: 800 }}
                            >
                              {v.toLocaleString("ar-EG")}
                              <div className="text-[10px] opacity-70" style={{ fontWeight: 600 }}>{s.name}</div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <motion.div
                          initial={{ height: 0 }}
                          whileInView={{ height: `${heightPct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
                          className="w-full max-w-[44px] rounded-t-2xl relative overflow-hidden"
                          style={{
                            background: `linear-gradient(to top, #1F6F5F, #6FCF97)`,
                            boxShadow: active ? "0 10px 30px -8px rgba(31,111,95,0.6)" : "0 4px 14px -6px rgba(31,111,95,0.4)",
                            transform: active ? "scaleY(1.04)" : "scaleY(1)",
                            transformOrigin: "bottom",
                            transition: "transform 0.25s, box-shadow 0.25s",
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-white/0 via-white/0 to-white/30" />
                        </motion.div>
                        <div className={`mt-2 w-9 h-9 rounded-xl grid place-items-center transition ${
                          active ? "bg-[#1F6F5F] text-white scale-110" : "bg-zinc-100 dark:bg-zinc-800 text-[#1F6F5F] dark:text-[#6FCF97]"
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="mt-1 text-[11px] text-zinc-500">{s.name}</div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>

        <Divider />

        {/* STEP 3 — إيه اللي اتبنى؟ */}
        <div
          id="step-what"
          ref={(el) => { sectionRefs.current.what = el; }}
          className="mb-14"
        >
          <StepHeader index={3} q={steps[2].q} subtitle="مخرجات ملموسة على أرض الواقع." />
          <div className="grid md:grid-cols-4 gap-4 mt-6">
            {[
              { icon: GraduationCap, label: "مدرسة", value: 210, color: "from-[#1F6F5F] to-[#2FA084]" },
              { icon: HeartPulse,    label: "وحدة صحية", value: 55, color: "from-[#2FA084] to-[#6FCF97]" },
              { icon: Construction,  label: "كم طرق", value: 145, color: "from-[#6FCF97] to-[#2FA084]" },
              { icon: Droplets,      label: "محطة صرف", value: 98, color: "from-[#1F6F5F] to-[#6FCF97]" },
            ].map((c, i) => (
              <Built key={c.label} c={c} i={i} />
            ))}
          </div>
        </div>

        <Divider />

        {/* STEP 4 — التأثير على الناس؟ */}
        <div
          id="step-impact"
          ref={(el) => { sectionRefs.current.impact = el; }}
          className="mb-14"
        >
          <StepHeader index={4} q={steps[3].q} subtitle="تطور مؤشرات التنمية البشرية قبل المبادرة وبعدها." />
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-6"
          >
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 800 }}>مؤشر التنمية البشرية</h3>
                  <p className="text-zinc-500 text-xs">قبل وبعد التدخل التنموي (2019 → 2025)</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-3 text-xs ml-4">
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-zinc-400" /> قبل</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-[#2FA084]" /> بعد</div>
                  </div>
                  <div className="flex bg-black/5 dark:bg-white/5 rounded-xl p-0.5">
                    {(["area", "bar", "line"] as const).map(ct => (
                      <button key={ct} onClick={() => setChartType(ct)} className={`px-2.5 py-1.5 rounded-lg text-[11px] transition ${chartType === ct ? "bg-white dark:bg-zinc-700 shadow text-[#1F6F5F] dark:text-white" : "text-zinc-500"}`} style={{ fontWeight: 700 }}>
                        {ct === "area" ? "مساحة" : ct === "bar" ? "أعمدة" : "خطي"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <ResponsiveContainer width="99%" height={300}>
                {chartType === "bar" ? (
                  <BarChart data={impactData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                    <XAxis dataKey="year" tick={{ fill: "#6b7280", fontFamily: "Tajawal" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "rgba(31,111,95,0.95)", border: "none", borderRadius: 14, color: "#fff", fontFamily: "Tajawal" }} />
                    <Bar dataKey="قبل" fill="#52525b" radius={[8, 8, 0, 0]} barSize={24} />
                    <Bar dataKey="بعد" fill="#10b981" radius={[8, 8, 0, 0]} barSize={24} />
                  </BarChart>
                ) : chartType === "line" ? (
                  <LineChart data={impactData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                    <XAxis dataKey="year" tick={{ fill: "#6b7280", fontFamily: "Tajawal" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: "rgba(31,111,95,0.95)", border: "none", borderRadius: 14, color: "#fff", fontFamily: "Tajawal" }} />
                    <Line type="monotone" dataKey="قبل" stroke="#52525b" strokeWidth={2.5} dot={{ r: 4, fill: "#52525b", strokeWidth: 2, stroke: "#fff" }} />
                    <Line type="monotone" dataKey="بعد" stroke="#10b981" strokeWidth={3} dot={{ r: 5, fill: "#10b981", strokeWidth: 2, stroke: "#fff" }} />
                  </LineChart>
                ) : (
                  <AreaChart data={impactData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
                    <XAxis dataKey="year" tick={{ fill: "#6b7280", fontFamily: "Tajawal" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "rgba(31,111,95,0.95)", border: "none", borderRadius: 14, color: "#fff", fontFamily: "Tajawal" }}
                      cursor={{ stroke: "#2FA084", strokeWidth: 1, strokeDasharray: "3 3" }}
                    />
                    <Area type="monotone" dataKey="قبل" stroke="#52525b" strokeWidth={2} fill="#52525b" fillOpacity={0.15} isAnimationActive={false} />
                    <Area type="monotone" dataKey="بعد" stroke="#10b981" strokeWidth={3} fill="#10b981" fillOpacity={0.25} isAnimationActive={false} />
                  </AreaChart>
                )}
              </ResponsiveContainer>

              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { label: "تحسّن المؤشر", value: "+122%" },
                  { label: "نقاط الفرق", value: "49 نقطة" },
                  { label: "أعلى نمو سنوي", value: "2022 → 2023" },
                ].map((s) => (
                  <div key={s.label} className="p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                    <div className="text-xs text-zinc-500">{s.label}</div>
                    <div className="text-xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </GlassCard>
          </motion.div>
        </div>

        <Divider />

        {/* STEP 5 — دراسة الأثر الشاملة */}
        <div
          id="step-analytics"
          ref={(el) => { sectionRefs.current.analytics = el; }}
          className="mb-14"
        >
          <StepHeader index={5} q={steps[4].q} subtitle="تحليلات متقدمة لدمج البيانات الحديثة للمشاريع." />
          
          {/* KPI CARDS */}
          <div className="grid md:grid-cols-3 gap-4 mt-6 mb-6">
            <GlassCard className="p-6 relative overflow-hidden group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-[#1F6F5F] to-[#2FA084] opacity-0 group-hover:opacity-10 blur-xl transition" />
              <div className="text-sm text-zinc-500 mb-1">إجمالي المشاريع المدمجة</div>
              <div className="text-4xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>{totalMergedProjects}</div>
              <div className="mt-4 text-xs text-[#2FA084] font-bold">بزيادة {totalNewProjects} مشروع حديث</div>
            </GlassCard>
            <GlassCard className="p-6 relative overflow-hidden group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-[#2FA084] to-[#6FCF97] opacity-0 group-hover:opacity-10 blur-xl transition" />
              <div className="text-sm text-zinc-500 mb-1">المراكز المستفيدة</div>
              <div className="text-4xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>{villages.length}</div>
              <div className="mt-4 text-xs text-[#2FA084] font-bold">تمتد الخدمة عبر كافة أرجاء قنا</div>
            </GlassCard>
            <GlassCard className="p-6 relative overflow-hidden group">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-br from-[#6FCF97] to-[#1F6F5F] opacity-0 group-hover:opacity-10 blur-xl transition" />
              <div className="text-sm text-zinc-500 mb-1">القطاع الأسرع نمواً</div>
              <div className="text-4xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>{topPerformingSectorName}</div>
              <div className="mt-4 text-xs text-[#2FA084] font-bold">استحوذ على أعلى كثافة مشاريع</div>
            </GlassCard>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            <GlassCard className="p-6">
              <h3 className="text-xl text-[#1F6F5F] dark:text-white mb-6" style={{ fontWeight: 800 }}>توزيع المشاريع على المراكز</h3>
              <ResponsiveContainer width="99%" height={300}>
                <BarChart data={sortedVillagesByProjects} layout="vertical" margin={{ left: 20, right: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontFamily: "Tajawal", fontWeight: 700, fontSize: 12 }} />
                  <Tooltip cursor={{ fill: "rgba(31,111,95,0.05)" }} contentStyle={{ background: "rgba(31,111,95,0.95)", border: "none", borderRadius: 14, color: "#fff", fontFamily: "Tajawal" }} />
                  <Bar dataKey="projects" radius={[0, 8, 8, 0]} barSize={20}>
                    {sortedVillagesByProjects.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 0 ? "#1F6F5F" : index === 1 ? "#2FA084" : "#6FCF97"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-4 p-4 rounded-xl bg-[#1F6F5F]/5 border border-[#1F6F5F]/10 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                <strong className="text-[#1F6F5F] dark:text-[#2FA084]">تحليل الكثافة: </strong>
                مركز {sortedVillagesByProjects[0].name} يستحوذ على أعلى كثافة للمشاريع التنموية بواقع {sortedVillagesByProjects[0].projects} مشروعاً، يليه {sortedVillagesByProjects[1].name}، مما يعكس توجيه الموارد نحو الكثافات السكانية الأكثر احتياجاً.
              </div>
            </GlassCard>

            <GlassCard className="p-6">
              <h3 className="text-xl text-[#1F6F5F] dark:text-white mb-6" style={{ fontWeight: 800 }}>المشاريع بحسب القطاع</h3>
              <ResponsiveContainer width="99%" height={300}>
                <PieChart>
                  <Pie
                    data={servicesData}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {servicesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "rgba(31,111,95,0.95)", border: "none", borderRadius: 14, color: "#fff", fontFamily: "Tajawal" }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {servicesData.map((s, idx) => (
                  <div key={s.name} className="flex items-center gap-2 text-xs">
                    <span className="w-3 h-3 rounded-full" style={{ background: palette[idx % palette.length] }} />
                    <span className="text-zinc-600 dark:text-zinc-300">{s.name} ({s.count})</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>

        {/* AI RESULTS SECTION */}
        <AnimatePresence>
          {showAIResults && (
            <motion.div
              id="ai-results"
              initial={{ opacity: 0, height: 0, y: 50 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: 50 }}
              className="overflow-hidden mb-14"
            >
              <GlassCard className="p-8 border-2 border-[#2FA084]/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#2FA084]/10 rounded-full blur-3xl pointer-events-none" />
                <div className="flex items-center gap-3 mb-8 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1F6F5F] to-[#2FA084] grid place-items-center text-white shadow-lg">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>نتائج التحليل الذكي (GeoAI)</h3>
                    <p className="text-sm text-zinc-500">تم تبسيط البيانات المدمجة لغير المتخصصين</p>
                  </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 relative z-10">
                  {/* Summary text */}
                  <div className="lg:col-span-3 p-6 rounded-2xl bg-[#1F6F5F]/5 border border-[#1F6F5F]/10 text-[#1F6F5F] dark:text-white/90 text-lg md:text-xl leading-relaxed shadow-inner" style={{ fontWeight: 700 }}>
                    {aiSummaryText}
                  </div>

                  {/* Interventions keywords */}
                  <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-sm">
                    <h4 className="text-lg text-[#1F6F5F] dark:text-white mb-6" style={{ fontWeight: 800 }}>أكثر أنواع التدخلات تكراراً (تحليل النصوص)</h4>
                    <ResponsiveContainer width="99%" height={250}>
                      <BarChart data={keywordsData} layout="vertical" margin={{ left: 20, right: 80 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis dataKey="name" type="category" width={80} axisLine={false} tickLine={false} tick={{ fill: "#6b7280", fontFamily: "Tajawal", fontWeight: 700, fontSize: 12 }} />
                        <Tooltip cursor={{ fill: "rgba(31,111,95,0.05)" }} contentStyle={{ background: "rgba(31,111,95,0.95)", border: "none", borderRadius: 14, color: "#fff", fontFamily: "Tajawal" }} />
                        <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={20}>
                          {keywordsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={palette[index % palette.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Quick stats grid */}
                  <div className="grid grid-rows-2 gap-6">
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#34d399] text-white shadow-lg flex flex-col justify-center items-center text-center">
                      <div className="text-5xl mb-2" style={{ fontWeight: 900 }}>{keywordsData[0]?.count || 0}</div>
                      <div className="text-base opacity-90" style={{ fontWeight: 700 }}>مشروع ({keywordsData[0]?.name}) جديد</div>
                    </div>
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-[#f59e0b] to-[#fbbf24] text-white shadow-lg flex flex-col justify-center items-center text-center">
                      <div className="text-5xl mb-2" style={{ fontWeight: 900 }}>{Object.keys(newCenterCounts).length}</div>
                      <div className="text-base opacity-90" style={{ fontWeight: 700 }}>مراكز شملتها التوسعة</div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* COMPARE MODE */}
        <AnimatePresence>
          {compareMode && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <GlassCard className="p-6 mb-12">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 800 }}>مقارنة بين قريتين</h3>
                  <ArrowLeftRight className="w-5 h-5 text-[#2FA084]" />
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  {[A, B].map((v, idx) => {
                    const setter = idx === 0 ? setCompareA : setCompareB;
                    return (
                      <div key={idx} className="p-5 rounded-2xl bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-800 border border-black/5 dark:border-white/5">
                        <select
                          value={v.id}
                          onChange={(e) => setter(e.target.value)}
                          className="w-full mb-3 px-3 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm"
                          style={{ fontWeight: 700 }}
                        >
                          {villages.map((vv) => <option key={vv.id} value={vv.id}>{vv.name}</option>)}
                        </select>
                        <div className="grid grid-cols-2 gap-3">
                          <Stat label="السكان" value={v.pop.toLocaleString("ar-EG")} />
                          <Stat label="المشاريع" value={v.projects.toString()} />
                          <Stat label="مدارس" value={Math.round(v.projects * 0.4).toString()} />
                          <Stat label="وحدات صحية" value={Math.round(v.projects * 0.18).toString()} />
                        </div>
                        {/* radial bar */}
                        <div className="mt-4 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                          <motion.div
                            key={v.id}
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min(100, v.projects * 3)}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full bg-gradient-to-l from-[#1F6F5F] to-[#6FCF97]"
                          />
                        </div>
                        <div className="text-[11px] text-zinc-500 mt-1">معدل التغطية</div>
                      </div>
                    );
                  })}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* INSIGHTS WALKTHROUGH */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>أهم الرؤى</h3>
            <div className="text-xs text-zinc-500">{insightIdx + 1} / {insights.length}</div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {insights.map((it, i) => {
              const isActive = playing && i === insightIdx;
              return (
                <motion.div
                  key={it.title}
                  initial={{ opacity: 0, x: i % 2 ? 60 : -60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  animate={isActive ? { scale: 1.02 } : { scale: 1 }}
                  className={`relative p-6 md:p-8 rounded-3xl border transition ${
                    isActive
                      ? "bg-gradient-to-br from-[#1F6F5F] to-[#2FA084] text-white border-transparent shadow-2xl shadow-[#1F6F5F]/40"
                      : "bg-white dark:bg-zinc-900 border-black/5 dark:border-white/5"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className={`w-4 h-4 ${isActive ? "text-white" : "text-[#2FA084]"}`} />
                    <span className={`text-xs ${isActive ? "text-white/80" : "text-zinc-500"}`} style={{ fontWeight: 800 }}>
                      رؤية رقم {i + 1}
                    </span>
                  </div>
                  <h4 className={`${isActive ? "text-white" : "text-[#1F6F5F] dark:text-white"} text-lg`} style={{ fontWeight: 900 }}>
                    {it.title}
                  </h4>
                  <p className={`mt-2 text-sm ${isActive ? "text-white/85" : "text-zinc-600 dark:text-zinc-400"} leading-relaxed`}>
                    {it.desc}
                  </p>
                  {isActive && (
                    <motion.div
                      key={`bar-${i}`}
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2.5 }}
                      className="absolute bottom-0 left-0 h-1 bg-white/70 rounded-full"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------- SUB-COMPONENTS ------------------------------- */

function StepHeader({ index, q, subtitle }: { index: number; q: string; subtitle: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#10b981] to-[#34d399] grid place-items-center text-white shadow-[0_0_15px_rgba(16,185,129,0.4)]" style={{ fontWeight: 900 }}>
        0{index}
      </div>
      <div>
        <h3 className="text-2xl text-zinc-900 dark:text-white" style={{ fontWeight: 900 }}>{q}</h3>
        <p className="text-sm text-zinc-500">{subtitle}</p>
      </div>
    </motion.div>
  );
}

function Divider() {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2 }}
      className="h-px my-12 bg-gradient-to-l from-transparent via-[#2FA084]/40 to-transparent origin-right"
    />
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5">
      <div className="text-[11px] text-zinc-500">{label}</div>
      <div className="text-lg text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>{value}</div>
    </div>
  );
}

function Built({ c, i }: { c: { icon: any; label: string; value: number; color: string }; i: number }) {
  const v = useCounter(c.value, 1.6);
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1 }}
      whileHover={{ y: -6 }}
      className="relative group"
    >
      <div className={`absolute -inset-1 rounded-3xl bg-gradient-to-br ${c.color} opacity-0 group-hover:opacity-30 blur-xl transition`} />
      <div className="relative p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-lg overflow-hidden">
        <div className={`absolute -top-8 -left-8 w-32 h-32 rounded-full bg-gradient-to-br ${c.color} opacity-15 group-hover:opacity-30 transition group-hover:scale-150`} />
        <div className={`relative w-12 h-12 rounded-2xl bg-gradient-to-br ${c.color} grid place-items-center text-white shadow-lg`}>
          <c.icon className="w-6 h-6" />
        </div>
        <div className="relative mt-4 text-3xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>
          {Math.floor(v).toLocaleString("ar-EG")}
        </div>
        <div className="relative text-sm text-zinc-500 mt-1 flex items-center gap-1">
          {c.label}
          <ChevronLeft className="w-3 h-3 opacity-40" />
        </div>
      </div>
    </motion.div>
  );
}
