import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import { HelpCircle, ChevronDown, Search } from "lucide-react";

const categories = ["الكل", "عامة", "خدمات", "مشاريع"];

const faqs = [
  { q: "ما هي مبادرة حياة كريمة؟", a: "مبادرة رئاسية تهدف لتطوير الريف المصري وتحسين جودة حياة المواطنين في القرى الأكثر احتياجاً عبر مشاريع متكاملة في البنية التحتية والتعليم والصحة والخدمات.", cat: "عامة" },
  { q: "كم عدد القرى المستهدفة في قنا؟", a: "تشمل المرحلة الأولى 86 قرية في محافظة قنا، تخدم أكثر من 1.5 مليون مواطن عبر مشاريع تنموية متكاملة.", cat: "عامة" },
  { q: "ما هي الخدمات التي تقدمها المبادرة؟", a: "تشمل أربعة محاور: التعليم (210 مدرسة)، الصحة (55 وحدة صحية)، الطرق (145 كم)، والصرف الصحي (98 محطة).", cat: "خدمات" },
  { q: "كيف يتم اختيار مواقع المشاريع الجديدة؟", a: "نستخدم تقنيات الذكاء الاصطناعي الجغرافي (GeoAI) لتحليل الفجوات الخدمية وتحديد أفضل المواقع بناءً على الكثافة السكانية والمسافة لأقرب خدمة.", cat: "مشاريع" },
  { q: "ما هو حجم الاستثمار في المبادرة؟", a: "إجمالي الاستثمار يقترب من 8.5 مليار جنيه، منها 42% للبنية التحتية و23% للتعليم و20% للصحة و15% للخدمات.", cat: "مشاريع" },
  { q: "هل يمكن تحميل التقرير كاملاً؟", a: "نعم، يتوفر تقرير شامل من 120 صفحة يمكن تحميله بصيغة PDF من قسم التقرير. التقرير يشمل تحليلات مفصلة ورسوم بيانية.", cat: "عامة" },
  { q: "كيف يعمل الذكاء الاصطناعي الجغرافي؟", a: "يقوم النظام بجمع بيانات OpenStreetMap الحية ثم يحللها عبر Groq AI لتحديد الفجوات الخدمية واقتراح أفضل المواقع لإنشاء مرافق جديدة.", cat: "خدمات" },
  { q: "ما هي خطط المرحلة الثانية؟", a: "تشمل التوسع لقرى حدودية إضافية مع تعزيز برامج التشغيل المحلي وإنشاء منصة بيانات مفتوحة لمتابعة المشاريع لحظياً.", cat: "مشاريع" },
];

export function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const [activeCat, setActiveCat] = useState("الكل");
  const [search, setSearch] = useState("");

  const filtered = faqs.filter((f) => {
    const catMatch = activeCat === "الكل" || f.cat === activeCat;
    const searchMatch = !search || f.q.includes(search) || f.a.includes(search);
    return catMatch && searchMatch;
  });

  return (
    <section id="faq" className="app-section bg-gradient-to-b from-white to-[#f5f5f5] dark:from-zinc-950 dark:to-zinc-900">
      <div className="app-container">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#6FCF97]/20 text-[#1F6F5F] dark:text-[#6FCF97] text-sm" style={{ fontWeight: 700 }}>
            <HelpCircle className="w-4 h-4" /> الأسئلة الشائعة
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>كل ما تريد معرفته</h2>
        </motion.div>

        {/* Search + Categories */}
        <div className="max-w-3xl mx-auto mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ابحث في الأسئلة..."
              className="w-full pr-12 pl-4 py-3.5 rounded-2xl bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 text-sm outline-none focus:border-[#2FA084] transition shadow-sm"
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className={`px-4 py-2 rounded-xl text-sm transition ${activeCat === cat ? "bg-[#1F6F5F] text-white shadow-md" : "bg-black/5 dark:bg-white/5 text-zinc-600 dark:text-zinc-300 hover:bg-black/10 dark:hover:bg-white/10"}`}
                style={{ fontWeight: 700 }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Accordion */}
        <div className="max-w-3xl mx-auto space-y-3">
          {filtered.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <motion.div
                key={faq.q}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className={`w-full text-right p-5 rounded-2xl border transition-all ${isOpen ? "bg-gradient-to-l from-[#1F6F5F] to-[#2FA084] text-white border-transparent shadow-xl" : "bg-white dark:bg-zinc-900 border-black/5 dark:border-white/5 hover:border-[#2FA084]/30 shadow-sm"}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-base" style={{ fontWeight: 800 }}>{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className={`mt-3 text-sm leading-relaxed ${isOpen ? "text-white/85" : "text-zinc-600"}`}>{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
