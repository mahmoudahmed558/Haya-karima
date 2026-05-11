import { useEffect, useState, lazy, Suspense } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Loader } from "./components/Loader";
import { ScrollProgress } from "./components/ScrollProgress";
import { ScrollToTop } from "./components/ScrollToTop";

const Map3D = lazy(() => import("./components/Map3D").then((m) => ({ default: m.Map3D })));
const Dashboard = lazy(() => import("./components/Dashboard").then((m) => ({ default: m.Dashboard })));
const AnalyticsCTA = lazy(() => import("./components/AnalyticsCTA").then((m) => ({ default: m.AnalyticsCTA })));
const Services = lazy(() => import("./components/Services").then((m) => ({ default: m.Services })));
const BeforeAfter = lazy(() => import("./components/BeforeAfter").then((m) => ({ default: m.BeforeAfter })));
const Insights = lazy(() => import("./components/Insights").then((m) => ({ default: m.Insights })));
const Timeline = lazy(() => import("./components/Timeline").then((m) => ({ default: m.Timeline })));
const SuccessStories = lazy(() => import("./components/SuccessStories").then((m) => ({ default: m.SuccessStories })));
const FAQ = lazy(() => import("./components/FAQ").then((m) => ({ default: m.FAQ })));
const Report = lazy(() => import("./components/Report").then((m) => ({ default: m.Report })));
const Footer = lazy(() => import("./components/Report").then((m) => ({ default: m.Footer })));

function SectionFallback() {
  return (
    <div className="app-section flex justify-center items-center min-h-[200px]">
      <div className="w-8 h-8 rounded-full border-2 border-[#1F6F5F]/20 border-t-[#1F6F5F] animate-spin" />
    </div>
  );
}

export default function App() {
  const [dark, setDark] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.dir = "rtl";
    document.documentElement.lang = "ar";
  }, [dark]);

  return (
    <div dir="rtl" className={dark ? "dark" : ""}>
      <Loader show={loading} />
      <ScrollProgress />
      <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#09090B] text-zinc-900 dark:text-zinc-100 transition-colors duration-500">
        <Navbar dark={dark} toggleDark={() => setDark(!dark)} />
        <Hero />
        <Suspense fallback={<SectionFallback />}><Map3D /></Suspense>
        <Suspense fallback={<SectionFallback />}><Dashboard /></Suspense>
        <Suspense fallback={<SectionFallback />}><AnalyticsCTA /></Suspense>
        <Suspense fallback={<SectionFallback />}><Services /></Suspense>
        <Suspense fallback={<SectionFallback />}><BeforeAfter /></Suspense>
        <Suspense fallback={<SectionFallback />}><Insights /></Suspense>
        <Suspense fallback={<SectionFallback />}><Timeline /></Suspense>
        <Suspense fallback={<SectionFallback />}><SuccessStories /></Suspense>
        <Suspense fallback={<SectionFallback />}><FAQ /></Suspense>
        <Suspense fallback={<SectionFallback />}><Report /></Suspense>
        <Suspense fallback={<SectionFallback />}><Footer /></Suspense>
      </div>
      <ScrollToTop />
    </div>
  );
}
