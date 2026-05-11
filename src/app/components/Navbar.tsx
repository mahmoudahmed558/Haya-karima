import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun, Menu, X, Download } from "lucide-react";

const links = [
  { id: "hero", label: "الرئيسية" },
  { id: "map", label: "الخريطة" },
  { id: "dashboard", label: "البيانات" },
  { id: "analytics-cta", label: "التحليلات" },
  { id: "services", label: "الخدمات" },
  { id: "timeline", label: "الرحلة" },
  { id: "compare", label: "قبل وبعد" },
  { id: "stories", label: "قصص نجاح" },
  { id: "report", label: "التقرير" },
];

export function Navbar({ dark, toggleDark }: { dark: boolean; toggleDark: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");
  const isClicking = useRef(false);

  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentY = window.scrollY;
          
          setScrolled(currentY > 30);
          
          if (currentY > 300 && currentY > lastY) {
            setHidden(true);
          } else if (currentY < lastY) {
            setHidden(false);
          }
          
          lastY = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Active section tracking
  useEffect(() => {
    const ids = links.map((l) => l.id);
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !isClicking.current) {
            setActiveSection(e.target.id);
          }
        });
      },
      { rootMargin: "-10% 0px -40% 0px", threshold: 0 }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    setActiveSection(id);
    isClicking.current = true;
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
    setTimeout(() => {
      isClicking.current = false;
    }, 1000);
  };

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: hidden ? -100 : 0, opacity: hidden ? 0 : 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-4 inset-x-0 z-50 flex justify-center"
      >
        <div className={`app-container w-full max-w-7xl flex items-center justify-between px-4 md:px-6 py-2.5 rounded-full transition-all duration-500 ${
          scrolled
            ? "bg-white/80 dark:bg-[#18181b]/70 backdrop-blur-2xl shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.4)] border border-black/5 dark:border-white/10"
            : "bg-transparent"
        }`}>
          {/* Logo */}
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2.5 group">
            <motion.div whileHover={{ rotate: 10 }} className="w-10 h-10 rounded-full bg-gradient-to-br from-[#10b981] to-[#047857] grid place-items-center text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]">
              <span style={{ fontWeight: 800 }}>ح</span>
            </motion.div>
            <div className="leading-tight hidden sm:block">
              <div style={{ fontWeight: 800 }} className="text-zinc-900 dark:text-white text-sm">حياة كريمة</div>
              <div className="text-[10px] text-zinc-500">محافظة قنا · GeoAI</div>
            </div>
          </button>

          {/* Desktop links */}
          <ul className="hidden lg:flex items-center gap-1 xl:gap-2">
            {links.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => scrollTo(l.id)}
                  className={`relative px-2 xl:px-3 py-2 rounded-full text-xs xl:text-sm transition-all ${
                    activeSection === l.id
                      ? "text-[#1F6F5F] dark:text-[#6FCF97]"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                  style={{ fontWeight: activeSection === l.id ? 800 : 500 }}
                >
                  {activeSection === l.id && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-0 rounded-full bg-[#1F6F5F]/10 dark:bg-[#6FCF97]/10"
                      transition={{ type: "spring", stiffness: 300, damping: 28 }}
                    />
                  )}
                  <span className="relative">{l.label}</span>
                </button>
              </li>
            ))}
          </ul>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <a
              href="/report.pdf"
              download="Hayah-Karima-Report-2026.pdf"
              className="hidden md:flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-l from-[#1F6F5F] to-[#2FA084] text-white text-xs shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
              style={{ fontWeight: 700 }}
            >
              <Download className="w-3.5 h-3.5" /> التقرير
            </a>
            <button
              onClick={toggleDark}
              className="w-9 h-9 rounded-full grid place-items-center bg-white/60 dark:bg-white/10 border border-black/5 dark:border-white/10 hover:scale-110 transition"
              aria-label="تبديل الوضع"
            >
              {dark ? <Sun className="w-4 h-4 text-[#6FCF97]" /> : <Moon className="w-4 h-4 text-[#1F6F5F]" />}
            </button>
            <button onClick={() => setOpen(!open)} className="lg:hidden w-9 h-9 rounded-full bg-white/60 dark:bg-white/10 grid place-items-center border border-black/5 dark:border-white/10" aria-label="القائمة">
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-2">
              {links.map((l, i) => (
                <motion.button
                  key={l.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => scrollTo(l.id)}
                  className={`px-6 py-3 rounded-2xl text-xl transition ${
                    activeSection === l.id ? "text-[#1F6F5F] dark:text-[#6FCF97] bg-[#1F6F5F]/10 dark:bg-[#6FCF97]/10" : "text-zinc-700 dark:text-zinc-200"
                  }`}
                  style={{ fontWeight: activeSection === l.id ? 900 : 600 }}
                >
                  {l.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
