import { motion } from "motion/react";
import { useRef, useState } from "react";
import { GripVertical, ChevronLeft, ChevronRight, GraduationCap, HeartPulse, Construction } from "lucide-react";

const slides = [
  {
    title: "البنية التحتية والطرق",
    icon: Construction,
    beforeLabel: "طرق ترابية معزولة",
    afterLabel: "طرق حديثة ممهدة",
    stat: "145 كم",
    beforeImg: "/images/before-roads.png",
    afterImg: "/images/after-roads.png",
  },
  {
    title: "المنشآت التعليمية",
    icon: GraduationCap,
    beforeLabel: "مدارس متهالكة",
    afterLabel: "مدارس ذكية حديثة",
    stat: "210 مدرسة",
    beforeImg: "/images/before-school.png",
    afterImg: "/images/after-school.png",
  },
  {
    title: "الرعاية الصحية",
    icon: HeartPulse,
    beforeLabel: "وحدات مهملة",
    afterLabel: "مراكز طبية مجهزة",
    stat: "55 وحدة",
    beforeImg: "/images/before-health.png",
    afterImg: "/images/after-health.png",
  },
];

export function BeforeAfter() {
  const [pos, setPos] = useState(50);
  const [slideIdx, setSlideIdx] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const slide = slides[slideIdx];
  const Icon = slide.icon;

  const onMove = (clientX: number) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const p = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(2, Math.min(98, p)));
  };

  return (
    <section id="compare" className="app-section bg-[#EEEEEE] dark:bg-zinc-900 relative overflow-hidden">
      <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] rounded-full bg-[#6FCF97]/5 blur-[100px] pointer-events-none" />

      <div className="app-container relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6FCF97]/20 text-[#1F6F5F] dark:text-[#6FCF97] text-sm" style={{ fontWeight: 700 }}>
            <Icon className="w-4 h-4" /> قبل وبعد
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>التحول البصري للقرى</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">اسحب الشريط لمشاهدة الفرق — <strong>{slide.title}</strong></p>
        </motion.div>

        {/* Slide selector */}
        <div className="flex items-center justify-center gap-3 mb-8 flex-wrap">
          {slides.map((s, i) => {
            const SIcon = s.icon;
            return (
              <button
                key={i}
                onClick={() => { setSlideIdx(i); setPos(50); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm transition-all ${slideIdx === i
                  ? "bg-[#1F6F5F] text-white shadow-lg shadow-[#1F6F5F]/30"
                  : "bg-white/70 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 border border-black/5 dark:border-white/5"
                }`}
                style={{ fontWeight: slideIdx === i ? 800 : 600 }}
              >
                <SIcon className="w-4 h-4" /> {s.title}
              </button>
            );
          })}
        </div>

        <motion.div key={slideIdx} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
          <div
            ref={ref}
            className="relative w-full h-[360px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl select-none cursor-ew-resize touch-none"
            onMouseMove={(e) => dragging.current && onMove(e.clientX)}
            onMouseDown={(e) => { dragging.current = true; onMove(e.clientX); }}
            onMouseUp={() => (dragging.current = false)}
            onMouseLeave={() => (dragging.current = false)}
            onTouchMove={(e) => onMove(e.touches[0].clientX)}
            onTouchStart={(e) => { dragging.current = true; onMove(e.touches[0].clientX); }}
          >
            {/* AFTER (background — full image) */}
            <div className="absolute inset-0">
              <img src={slide.afterImg} alt={slide.afterLabel} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute top-6 left-6 px-4 py-2 rounded-full bg-white/90 text-[#1F6F5F] shadow-lg" style={{ fontWeight: 800 }}>{slide.afterLabel} ✨</div>
              <div className="absolute bottom-6 left-6 px-4 py-2 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 text-white text-sm" style={{ fontWeight: 800 }}>{slide.stat}</div>
            </div>

            {/* BEFORE (clipped image) */}
            <div className="absolute inset-0" style={{ clipPath: `polygon(0 0, ${pos}% 0, ${pos}% 100%, 0 100%)` }}>
              <img src={slide.beforeImg} alt={slide.beforeLabel} className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute top-6 right-6 px-4 py-2 rounded-full bg-black/70 text-white shadow-lg" style={{ fontWeight: 800 }}>{slide.beforeLabel}</div>
            </div>

            {/* Slider handle */}
            <div className="absolute top-0 bottom-0 w-1 bg-white shadow-2xl pointer-events-none" style={{ left: `${pos}%` }}>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white grid place-items-center shadow-2xl pointer-events-auto cursor-ew-resize border-4 border-[#2FA084] hover:scale-110 active:scale-95 transition-transform"
                onMouseDown={(e) => { e.stopPropagation(); dragging.current = true; }}
                onTouchStart={(e) => { e.stopPropagation(); dragging.current = true; }}
              >
                <GripVertical className="w-5 h-5 text-[#1F6F5F]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Carousel arrows */}
        <div className="flex justify-center gap-4 mt-6">
          <button onClick={() => { setSlideIdx((slideIdx - 1 + slides.length) % slides.length); setPos(50); }} className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 grid place-items-center text-zinc-600 dark:text-zinc-300 hover:scale-110 transition shadow-md">
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <div key={i} className={`h-2 rounded-full transition-all ${i === slideIdx ? "w-6 bg-[#1F6F5F] dark:bg-[#6FCF97]" : "w-2 bg-zinc-300 dark:bg-zinc-600"}`} />
            ))}
          </div>
          <button onClick={() => { setSlideIdx((slideIdx + 1) % slides.length); setPos(50); }} className="w-10 h-10 rounded-full bg-white dark:bg-zinc-800 border border-black/5 dark:border-white/10 grid place-items-center text-zinc-600 dark:text-zinc-300 hover:scale-110 transition shadow-md">
            <ChevronLeft className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
