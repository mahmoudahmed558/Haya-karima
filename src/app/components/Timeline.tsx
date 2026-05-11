import { motion } from "motion/react";
import { Calendar, Building2, GraduationCap, HeartPulse, Droplets, Sparkles, Flag, Rocket } from "lucide-react";

const milestones = [
  { year: "2019", title: "إطلاق المبادرة الرئاسية", desc: "إعلان الرئيس عبد الفتاح السيسي عن مبادرة حياة كريمة لتطوير الريف المصري وتحسين جودة حياة المواطنين.", icon: Flag, color: "from-[#1F6F5F] to-[#2FA084]" },
  { year: "2020", title: "بدء المرحلة الأولى في قنا", desc: "انطلاق أعمال المسح الميداني واختيار 86 قرية في محافظة قنا ضمن المرحلة الأولى من المبادرة.", icon: Building2, color: "from-[#2FA084] to-[#6FCF97]" },
  { year: "2021", title: "تطوير البنية التحتية", desc: "بدء تنفيذ 145 كم من الطرق الجديدة و98 محطة صرف صحي لربط القرى وتحسين البيئة.", icon: Droplets, color: "from-[#6FCF97] to-[#2FA084]" },
  { year: "2022", title: "ثورة التعليم والصحة", desc: "تطوير وإنشاء 210 مدرسة و55 وحدة صحية بأحدث المعايير الدولية.", icon: GraduationCap, color: "from-[#1F6F5F] to-[#6FCF97]" },
  { year: "2023", title: "تحول رقمي ذكي", desc: "دمج تقنيات الذكاء الاصطناعي الجغرافي GeoAI لتحليل الفجوات الخدمية واتخاذ قرارات استراتيجية.", icon: Sparkles, color: "from-[#2FA084] to-[#1F6F5F]" },
  { year: "2024", title: "قفزة المؤشرات التنموية", desc: "ارتفاع مؤشر التنمية البشرية بنسبة 122% وانخفاض البطالة بـ 28% في القرى المستهدفة.", icon: HeartPulse, color: "from-[#6FCF97] to-[#1F6F5F]" },
  { year: "2025-2026", title: "التوسع والاستدامة", desc: "وصول الخدمات لـ 1.5 مليون مواطن والتخطيط لإطلاق المرحلة الثانية لتشمل قرى حدودية إضافية.", icon: Rocket, color: "from-[#1F6F5F] to-[#2FA084]" },
];

export function Timeline() {
  return (
    <section id="timeline" className="app-section bg-white dark:bg-zinc-950 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#6FCF97]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#1F6F5F]/5 blur-[100px] pointer-events-none" />

      <div className="app-container relative">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6FCF97]/20 text-[#1F6F5F] dark:text-[#6FCF97] text-sm" style={{ fontWeight: 700 }}>
            <Calendar className="w-4 h-4" /> الخط الزمني
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>
            رحلة التحول
          </h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
            من الإطلاق حتى الاستدامة — سبع سنوات غيّرت وجه القرية المصرية
          </p>
        </motion.div>

        <div className="relative">
          {/* Central line */}
          <div className="absolute top-0 bottom-0 right-1/2 w-px bg-gradient-to-b from-transparent via-[#2FA084]/30 to-transparent hidden md:block" />
          <div className="absolute top-0 bottom-0 right-4 w-px bg-gradient-to-b from-transparent via-[#2FA084]/30 to-transparent md:hidden" />

          <div className="space-y-8 md:space-y-0">
            {milestones.map((m, i) => {
              const isLeft = i % 2 === 0;
              const Icon = m.icon;
              return (
                <motion.div
                  key={m.year}
                  initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.7, delay: i * 0.08, ease: [0.2, 0.8, 0.2, 1] }}
                  className={`relative md:grid md:grid-cols-2 md:gap-10 items-center ${i > 0 ? "md:mt-[-20px]" : ""}`}
                >
                  {/* Timeline dot */}
                  <div className="hidden md:block absolute right-1/2 -translate-x-1/2 z-10">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${m.color} grid place-items-center text-white shadow-lg shadow-[#1F6F5F]/30`}>
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Mobile dot */}
                  <div className="md:hidden absolute right-2 top-0 z-10">
                    <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${m.color} grid place-items-center text-white shadow-md`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`${isLeft ? "md:text-left md:pl-16" : "md:col-start-2 md:pr-16"} pr-12 md:pr-0`}>
                    <div className={`p-6 rounded-3xl bg-white/70 dark:bg-white/[0.04] backdrop-blur-xl border border-white/60 dark:border-white/10 shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group`}>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-l ${m.color} text-white text-xs mb-3`} style={{ fontWeight: 800 }}>
                        {m.year}
                      </div>
                      <h3 className="text-xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>{m.title}</h3>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">{m.desc}</p>
                      <div className={`h-0.5 mt-4 bg-gradient-to-l ${m.color} scale-x-0 group-hover:scale-x-100 transition-transform origin-right rounded-full`} />
                    </div>
                  </div>

                  {/* Spacer for alternating layout */}
                  {isLeft && <div className="hidden md:block" />}
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
