import { motion } from "motion/react";
import { TrendingUp, Lightbulb, Target, Zap, BarChart3 } from "lucide-react";

const insights = [
  { icon: TrendingUp, title: "نمو 122%", desc: "ارتفاع مؤشر التنمية البشرية في القرى المستهدفة", color: "from-emerald-500 to-emerald-700" },
  { icon: Target, title: "انخفاض 28%", desc: "تراجع معدلات البطالة بعد إنشاء مشاريع التشغيل المحلي", color: "from-sky-500 to-sky-700" },
  { icon: Zap, title: "83% أسرع", desc: "تقليل وقت الوصول للخدمات بعد تطوير شبكة الطرق", color: "from-amber-500 to-amber-700" },
  { icon: BarChart3, title: "8.5 مليار ج.م", desc: "إجمالي الاستثمارات في مشاريع التنمية الشاملة", color: "from-violet-500 to-violet-700" },
];

export function Insights() {
  return (
    <section id="insights" className="app-section bg-white dark:bg-zinc-950 wave-divider relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#6FCF97]/5 blur-[120px] pointer-events-none" />

      <div className="app-container relative">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6FCF97]/20 text-[#1F6F5F] dark:text-[#6FCF97] text-sm" style={{ fontWeight: 700 }}>
            <Lightbulb className="w-4 h-4" /> مؤشرات الأثر
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>أرقام تتحدث عن نفسها</h2>
          <p className="mt-3 text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">مؤشرات الأداء الرئيسية التي تعكس حجم التحول في محافظة قنا</p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {insights.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, type: "spring", bounce: 0.3 }}
                whileHover={{ y: -8, scale: 1.03 }}
                className="group relative rounded-3xl bg-white dark:bg-zinc-900 border border-black/5 dark:border-white/5 p-6 md:p-8 shadow-xl overflow-hidden"
              >
                <div className={`absolute -top-6 -left-6 w-28 h-28 rounded-full bg-gradient-to-br ${item.color} opacity-10 group-hover:opacity-25 group-hover:scale-150 transition-all`} />

                <div className="relative">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${item.color} grid place-items-center text-white shadow-lg mb-5 group-hover:rotate-12 transition`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="text-2xl md:text-3xl text-zinc-900 dark:text-white" style={{ fontWeight: 900 }}>{item.title}</div>
                  <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{item.desc}</p>
                </div>

                <div className={`absolute bottom-0 right-0 left-0 h-1 bg-gradient-to-l ${item.color} scale-x-0 group-hover:scale-x-100 transition-transform origin-right`} />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
