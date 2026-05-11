import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, HeartPulse, Construction, Droplets, ChevronLeft, TrendingUp } from "lucide-react";
import { useState } from "react";

const services = [
  {
    icon: GraduationCap, title: "التعليم", count: "210", unit: "مدرسة",
    desc: "210 مدرسة تم إنشاؤها وتطويرها لخدمة أبناء القرى بأحدث المعايير.",
    color: "from-[#1F6F5F] to-[#2FA084]", progress: 87,
    details: ["فصول ذكية مجهزة بالتكنولوجيا", "معامل علوم وحاسب آلي", "ملاعب ومساحات خضراء", "تدريب 1,200 معلم"],
    impact: "+41% معدل الالتحاق بالمدارس",
  },
  {
    icon: HeartPulse, title: "الصحة", count: "55", unit: "وحدة صحية",
    desc: "55 وحدة صحية مُجهزة بأحدث المعدات الطبية لخدمة المواطنين.",
    color: "from-[#2FA084] to-[#6FCF97]", progress: 78,
    details: ["أجهزة تشخيص متقدمة", "عيادات أسنان وعيون", "صيدليات مجهزة", "خدمات طوارئ 24/7"],
    impact: "15 دقيقة متوسط الوصول للخدمة",
  },
  {
    icon: Construction, title: "الطرق", count: "145", unit: "كم",
    desc: "145 كم من الطرق الجديدة تربط القرى بالمراكز الحضرية.",
    color: "from-[#6FCF97] to-[#2FA084]", progress: 92,
    details: ["طرق رئيسية مزدوجة", "كباري وأنفاق", "إنارة ذكية LED", "لافتات إرشادية"],
    impact: "خفض وقت التنقل 83%",
  },
  {
    icon: Droplets, title: "الصرف الصحي", count: "98", unit: "محطة",
    desc: "98 محطة صرف صحي لخدمة 1.5 مليون مواطن وحماية البيئة.",
    color: "from-[#1F6F5F] to-[#6FCF97]", progress: 71,
    details: ["محطات معالجة ثلاثية", "شبكات صرف متكاملة", "صيانة دورية مستمرة", "حماية المياه الجوفية"],
    impact: "تغطية 86 قرية بالكامل",
  },
];

export function Services() {
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <section id="services" className="app-section bg-gradient-to-b from-white to-[#EEEEEE] dark:from-zinc-950 dark:to-zinc-900 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[400px] h-[400px] rounded-full bg-[#6FCF97]/5 blur-[100px] pointer-events-none" />

      <div className="app-container relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="px-4 py-1 rounded-full bg-[#6FCF97]/20 text-[#1F6F5F] dark:text-[#6FCF97] text-sm" style={{ fontWeight: 700 }}>الخدمات</span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>قطاعات تنموية متكاملة</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400">أربعة محاور رئيسية لتحسين جودة الحياة في كل قرية</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((s, i) => {
            const isExpanded = expanded === i;
            const Icon = s.icon;
            return (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={!isExpanded ? { y: -10 } : undefined}
                layout
                className="group relative rounded-3xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 shadow-lg overflow-hidden cursor-pointer"
                onClick={() => setExpanded(isExpanded ? null : i)}
              >
                <div className={`absolute -top-10 -left-10 w-40 h-40 rounded-full bg-gradient-to-br ${s.color} opacity-10 group-hover:opacity-30 transition group-hover:scale-150`} />

                <div className="relative p-7">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${s.color} grid place-items-center text-white shadow-xl mb-5 group-hover:rotate-12 transition`}>
                    <Icon className="w-8 h-8" />
                  </div>

                  <div className="text-3xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>{s.count}</div>
                  <h3 className="mt-1 text-xl text-[#1F6F5F] dark:text-[#6FCF97]" style={{ fontWeight: 800 }}>{s.title}</h3>
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{s.desc}</p>

                  {/* Progress bar */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
                      <span>نسبة الإنجاز</span>
                      <span style={{ fontWeight: 800 }}>{s.progress}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${s.progress}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.3 + i * 0.1, ease: [0.2, 0.8, 0.2, 1] }}
                        className={`h-full rounded-full bg-gradient-to-l ${s.color}`}
                      />
                    </div>
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 space-y-2">
                          {s.details.map((d) => (
                            <div key={d} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                              <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${s.color}`} />
                              {d}
                            </div>
                          ))}
                          <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-xl bg-[#1F6F5F]/10 dark:bg-[#6FCF97]/10 text-[#1F6F5F] dark:text-[#6FCF97] text-xs" style={{ fontWeight: 800 }}>
                            <TrendingUp className="w-3.5 h-3.5" /> {s.impact}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Expand hint */}
                  <div className="mt-3 flex items-center gap-1 text-xs text-zinc-400">
                    <ChevronLeft className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                    <span>{isExpanded ? "إخفاء التفاصيل" : "عرض التفاصيل"}</span>
                  </div>
                </div>

                <div className={`absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-l ${s.color} scale-x-0 group-hover:scale-x-100 transition-transform origin-right`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
