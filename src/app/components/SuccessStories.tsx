import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { Quote, ChevronLeft, ChevronRight, MapPin, Star } from "lucide-react";

const stories = [
  {
    name: "محمد عبد الرحمن", village: "قرية الحجيرات — مركز قنا", role: "مزارع ورب أسرة",
    quote: "قبل المبادرة كان أولادي يمشون 8 كيلومتر للمدرسة. دلوقتي المدرسة الجديدة على بُعد خطوات من البيت. حياة كريمة غيّرت مستقبل أولادي.",
    stat: "8 كم → 200 متر", statLabel: "المسافة للمدرسة", gradient: "from-[#1F6F5F] to-[#2FA084]",
  },
  {
    name: "فاطمة أحمد حسن", village: "قرية الكلاحين — مركز قوص", role: "ممرضة بالوحدة الصحية",
    quote: "الوحدة الصحية الجديدة فيها أجهزة ما كنتش أحلم بيها. بنقدر نكشف على 200 مريض في اليوم بدل 30.",
    stat: "200 مريض/يوم", statLabel: "القدرة الاستيعابية", gradient: "from-[#2FA084] to-[#6FCF97]",
  },
  {
    name: "أحمد سيد محمود", village: "نجع العرب — مركز دشنا", role: "سائق ومقاول طرق",
    quote: "الطريق الجديد قلّل وقت السفر من ساعة ونص لربع ساعة. الخضار بيوصل السوق طازة والفلاحين بيكسبوا أكتر.",
    stat: "90 → 15 دقيقة", statLabel: "وقت الوصول للسوق", gradient: "from-[#6FCF97] to-[#1F6F5F]",
  },
  {
    name: "سعاد عبد الله", village: "قرية المعنا — مركز نجع حمادي", role: "معلمة بالمدرسة الجديدة",
    quote: "الفصل الجديد فيه تكييف وسبورة ذكية. الأطفال بقوا يحبوا المدرسة. نسبة الحضور ارتفعت من 60% لـ 95%.",
    stat: "60% → 95%", statLabel: "نسبة الحضور", gradient: "from-[#1F6F5F] to-[#6FCF97]",
  },
];

export function SuccessStories() {
  const [active, setActive] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;
    const id = setInterval(() => setActive((p) => (p + 1) % stories.length), 5000);
    return () => clearInterval(id);
  }, [autoPlay]);

  const story = stories[active];
  const next = () => { setActive((p) => (p + 1) % stories.length); setAutoPlay(false); };
  const prev = () => { setActive((p) => (p - 1 + stories.length) % stories.length); setAutoPlay(false); };

  return (
    <section id="stories" className="app-section relative overflow-hidden bg-gradient-to-br from-[#1F6F5F] via-[#1a5f51] to-[#0e3d34]">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)", backgroundSize: "40px 40px" }} />
      <motion.div animate={{ y: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity }} className="absolute -top-20 -right-20 w-[400px] h-[400px] rounded-full bg-[#6FCF97]/10 blur-[80px]" />

      <div className="app-container relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 text-[#6FCF97] text-sm border border-white/10" style={{ fontWeight: 700 }}>
            <Star className="w-4 h-4" /> قصص النجاح
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl text-white" style={{ fontWeight: 900 }}>أصوات من أرض الواقع</h2>
          <p className="mt-3 text-white/60 max-w-xl mx-auto">شهادات حقيقية من مواطنين تغيرت حياتهم</p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <motion.div key={active} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative">
            <div className="rounded-[2rem] bg-white/[0.08] backdrop-blur-xl border border-white/10 p-8 md:p-12 relative overflow-hidden">
              <div className="absolute top-6 left-6 w-14 h-14 rounded-2xl bg-white/10 grid place-items-center">
                <Quote className="w-7 h-7 text-[#6FCF97]" />
              </div>
              <div className="relative mt-8 md:mt-4">
                <p className="text-xl md:text-2xl text-white leading-relaxed" style={{ fontWeight: 600 }}>«{story.quote}»</p>
                <div className="mt-8 flex flex-wrap items-center gap-6 justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${story.gradient} grid place-items-center text-white shadow-lg`} style={{ fontWeight: 900, fontSize: "1.2rem" }}>{story.name.charAt(0)}</div>
                    <div>
                      <div className="text-white text-lg" style={{ fontWeight: 800 }}>{story.name}</div>
                      <div className="text-white/60 text-sm flex items-center gap-1"><MapPin className="w-3 h-3" /> {story.village}</div>
                      <div className="text-[#6FCF97] text-xs" style={{ fontWeight: 700 }}>{story.role}</div>
                    </div>
                  </div>
                  <div className="px-5 py-3 rounded-2xl bg-white/10 border border-white/10">
                    <div className="text-2xl text-[#6FCF97]" style={{ fontWeight: 900 }}>{story.stat}</div>
                    <div className="text-xs text-white/60" style={{ fontWeight: 600 }}>{story.statLabel}</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="w-11 h-11 rounded-full bg-white/10 border border-white/10 grid place-items-center text-white hover:bg-white/20 transition" aria-label="السابق"><ChevronRight className="w-5 h-5" /></button>
            <div className="flex items-center gap-2">
              {stories.map((_, i) => (
                <button key={i} onClick={() => { setActive(i); setAutoPlay(false); }} className={`h-2 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-[#6FCF97]" : "w-2 bg-white/30 hover:bg-white/50"}`} aria-label={`قصة ${i + 1}`} />
              ))}
            </div>
            <button onClick={next} className="w-11 h-11 rounded-full bg-white/10 border border-white/10 grid place-items-center text-white hover:bg-white/20 transition" aria-label="التالي"><ChevronLeft className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </section>
  );
}
