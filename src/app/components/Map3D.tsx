import { motion, AnimatePresence } from "motion/react";
import { useEffect, useRef, useState, useMemo } from "react";
import Map, { NavigationControl, FullscreenControl, Marker, Source, Layer, useMap } from "react-map-gl/mapbox";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  MapPin,
  Locate,
  Sparkles,
  Activity,
  HeartPulse,
  GraduationCap,
  ChevronDown,
  ChevronUp,
  Maximize,
  Minimize
} from "lucide-react";
import { analyzeAreaForNewFacility, AmenityType, GeoFeature, Recommendation, QENA_DISTRICTS, District } from "../services/geoService";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function AIControlPanel({ 
  onRecommend, 
  districts, 
  selectedDistrict, 
  setSelectedDistrict 
}: { 
  onRecommend: (type: AmenityType) => void;
  districts: District[];
  selectedDistrict: District;
  setSelectedDistrict: (d: District) => void;
}) {
  const [loadingType, setLoadingType] = useState<AmenityType | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  const handleRecommend = async (type: AmenityType) => {
    setLoadingType(type);
    await onRecommend(type);
    setLoadingType(null);
    setMobileExpanded(false);
  };

  return (
    <>
    {/* Desktop panel */}
    <div className="absolute top-6 right-6 w-[340px] z-10 flex-col gap-4 hidden md:flex">
      <div className="rounded-3xl bg-white/95 dark:bg-zinc-950/90 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] p-6 relative overflow-visible">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#2FA084]/20 rounded-full blur-3xl -z-10" />
        
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1F6F5F] to-[#6FCF97] grid place-items-center text-white shadow-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>الذكاء الاصطناعي الجغرافي</h3>
            <p className="text-[10px] text-zinc-500" style={{ fontWeight: 700 }}>Groq AI Powered</p>
          </div>
        </div>
        
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-5 leading-relaxed">
          أقوم بتحليل البيانات المكانية لمراكز محافظة قنا وتقديم توصيات استراتيجية باستخدام نماذج Groq الفائقة.
        </p>

        <div className="space-y-4">
          {/* District Selector */}
          <div className="relative">
            <div className="text-xs text-zinc-500 mb-2" style={{ fontWeight: 700 }}>اختر المركز المستهدف للتحليل:</div>
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full px-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-between text-sm text-[#1F6F5F] dark:text-white"
              style={{ fontWeight: 800 }}
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2FA084]" />
                {selectedDistrict.name}
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden z-20 max-h-48 overflow-y-auto"
                >
                  {districts.map(d => (
                    <button
                      key={d.id}
                      onClick={() => {
                        setSelectedDistrict(d);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full text-right px-4 py-3 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition border-b border-black/5 dark:border-white/5 last:border-0 dark:text-white"
                      style={{ fontWeight: d.id === selectedDistrict.id ? 800 : 500 }}
                    >
                      {d.name}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-px bg-black/5 dark:bg-white/5 w-full my-2" />

          <div className="text-xs text-zinc-500 mb-2" style={{ fontWeight: 700 }}>ماذا تريد أن تبني في {selectedDistrict.name}؟</div>
          
          <button
            onClick={() => handleRecommend("hospital")}
            disabled={loadingType !== null}
            className="w-full relative px-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-transparent hover:border-[#2FA084] transition flex items-center justify-between text-right"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#2FA084]/20 text-[#2FA084] grid place-items-center">
                <HeartPulse className="w-4 h-4" />
              </div>
              <span className="text-sm text-[#1F6F5F] dark:text-white" style={{ fontWeight: 800 }}>مستشفى / مركز صحي</span>
            </div>
            {loadingType === "hospital" && <span className="w-4 h-4 border-2 border-[#2FA084] border-t-transparent rounded-full animate-spin" />}
          </button>

          <button
            onClick={() => handleRecommend("school")}
            disabled={loadingType !== null}
            className="w-full relative px-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-transparent hover:border-[#1F6F5F] transition flex items-center justify-between text-right"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#1F6F5F]/20 text-[#1F6F5F] dark:text-[#6FCF97] grid place-items-center">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="text-sm text-[#1F6F5F] dark:text-white" style={{ fontWeight: 800 }}>مدرسة جديدة</span>
            </div>
            {loadingType === "school" && <span className="w-4 h-4 border-2 border-[#1F6F5F] border-t-transparent rounded-full animate-spin" />}
          </button>

          <button
            onClick={() => handleRecommend("post_office")}
            disabled={loadingType !== null}
            className="w-full relative px-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-transparent hover:border-[#F2994A] transition flex items-center justify-between text-right"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#F2994A]/20 text-[#F2994A] grid place-items-center">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-sm text-[#1F6F5F] dark:text-white" style={{ fontWeight: 800 }}>مكتب بريد / مجمع خدمات</span>
            </div>
            {loadingType === "post_office" && <span className="w-4 h-4 border-2 border-[#F2994A] border-t-transparent rounded-full animate-spin" />}
          </button>

          <button
            onClick={() => handleRecommend("youth_center")}
            disabled={loadingType !== null}
            className="w-full relative px-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-transparent hover:border-[#2D9CDB] transition flex items-center justify-between text-right"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#2D9CDB]/20 text-[#2D9CDB] grid place-items-center">
                <Locate className="w-4 h-4" />
              </div>
              <span className="text-sm text-[#1F6F5F] dark:text-white" style={{ fontWeight: 800 }}>مركز شباب / ملعب</span>
            </div>
            {loadingType === "youth_center" && <span className="w-4 h-4 border-2 border-[#2D9CDB] border-t-transparent rounded-full animate-spin" />}
          </button>

          <button
            onClick={() => handleRecommend("fire_station")}
            disabled={loadingType !== null}
            className="w-full relative px-4 py-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-transparent hover:border-[#EB5757] transition flex items-center justify-between text-right"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#EB5757]/20 text-[#EB5757] grid place-items-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-sm text-[#1F6F5F] dark:text-white" style={{ fontWeight: 800 }}>وحدة إطفاء حريق</span>
            </div>
            {loadingType === "fire_station" && <span className="w-4 h-4 border-2 border-[#EB5757] border-t-transparent rounded-full animate-spin" />}
          </button>
        </div>
      </div>
    </div>

    {/* Mobile bottom sheet */}
    <div className="md:hidden absolute bottom-0 left-0 right-0 z-10">
      <div className="rounded-t-3xl bg-white/95 dark:bg-zinc-950/90 backdrop-blur-xl border-t border-x border-white/20 dark:border-white/10 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.3)] overflow-hidden">
        {/* Drag handle + toggle */}
        <button onClick={() => setMobileExpanded(!mobileExpanded)} className="w-full px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1F6F5F] to-[#6FCF97] grid place-items-center text-white shadow-md">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="text-right">
              <div className="text-[#1F6F5F] dark:text-white text-sm" style={{ fontWeight: 800 }}>محرك GeoAI</div>
              <div className="text-[10px] text-zinc-500">{selectedDistrict.name}</div>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-black/5 dark:bg-white/5 grid place-items-center">
            {mobileExpanded ? <ChevronDown className="w-4 h-4"/> : <ChevronUp className="w-4 h-4"/>}
          </div>
        </button>

        <AnimatePresence>
          {mobileExpanded && (
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: "auto" }}
              exit={{ height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="px-5 pb-5 space-y-3 max-h-[50vh] overflow-y-auto">
                {/* District selector */}
                <div className="relative">
                  <div className="text-xs text-zinc-500 mb-1" style={{ fontWeight: 700 }}>المركز:</div>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-full px-3 py-2.5 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-between text-sm text-[#1F6F5F] dark:text-white"
                    style={{ fontWeight: 800 }}
                  >
                    <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-[#2FA084]" />{selectedDistrict.name}</div>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isDropdownOpen && (
                      <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} className="absolute bottom-full left-0 right-0 mb-2 bg-white dark:bg-zinc-900 border border-black/10 dark:border-white/10 rounded-xl shadow-xl overflow-hidden z-20 max-h-40 overflow-y-auto">
                        {districts.map(d => (
                          <button key={d.id} onClick={() => { setSelectedDistrict(d); setIsDropdownOpen(false); }} className="w-full text-right px-3 py-2.5 text-sm hover:bg-black/5 dark:hover:bg-white/5 transition border-b border-black/5 dark:border-white/5 last:border-0 dark:text-white" style={{ fontWeight: d.id === selectedDistrict.id ? 800 : 500 }}>{d.name}</button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="text-xs text-zinc-500" style={{ fontWeight: 700 }}>ماذا تريد أن تبني؟</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { type: "hospital" as AmenityType, label: "مستشفى", icon: HeartPulse, clr: "#2FA084" },
                    { type: "school" as AmenityType, label: "مدرسة", icon: GraduationCap, clr: "#1F6F5F" },
                    { type: "post_office" as AmenityType, label: "مكتب بريد", icon: Activity, clr: "#F2994A" },
                    { type: "youth_center" as AmenityType, label: "مركز شباب", icon: Locate, clr: "#2D9CDB" },
                    { type: "fire_station" as AmenityType, label: "إطفاء", icon: Sparkles, clr: "#EB5757" },
                  ].map(b => (
                    <button key={b.type} onClick={() => handleRecommend(b.type)} disabled={loadingType !== null} className="px-3 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-transparent hover:border-[#2FA084]/40 flex items-center gap-2 text-xs transition" style={{ fontWeight: 700 }}>
                      <b.icon className="w-4 h-4" style={{ color: b.clr }}/>
                      <span className="text-[#1F6F5F] dark:text-white">{b.label}</span>
                      {loadingType === b.type && <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
    </>
  );
}

export function Map3D() {
  const mapRef = useRef<any>(null);
  const [existingFacilities, setExistingFacilities] = useState<GeoFeature[]>([]);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  
  const [selectedDistrict, setSelectedDistrict] = useState<District>(QENA_DISTRICTS[0]);

  // View state managed internally
  const [viewState, setViewState] = useState({
    longitude: QENA_DISTRICTS[0].center[0],
    latitude: QENA_DISTRICTS[0].center[1],
    zoom: 12.5,
    pitch: 65,
    bearing: -10
  });

  // Fly to district when changed
  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current.getMap();
      map.flyTo({
        center: selectedDistrict.center,
        zoom: 12.5,
        pitch: 65,
        bearing: 0,
        duration: 2000,
        essential: true
      });
      // Reset recommendations when changing district
      setRecommendation(null);
      setExistingFacilities([]);
    }
  }, [selectedDistrict]);

  const handleRecommend = async (type: AmenityType) => {
    if (!mapRef.current) return;
    const map = mapRef.current.getMap();
    
    // Call our geoService to analyze using Groq
    const result = await analyzeAreaForNewFacility(type, selectedDistrict);
    
    setExistingFacilities(result.existing);
    setRecommendation(result.recommendation);

    if (result.recommendation) {
      // Fly to the recommendation
      map.flyTo({
        center: [result.recommendation.lng, result.recommendation.lat],
        zoom: 16.5,
        pitch: 70,
        bearing: Math.random() * 40 - 20, 
        duration: 4000,
        essential: true
      });
    }
  };

  return (
    <section id="map" className="relative app-section overflow-hidden bg-[#EEEEEE] dark:bg-zinc-950 pt-20">
      <div className="app-container mb-8 relative z-20 pointer-events-none">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-gradient-to-r from-[#1F6F5F] to-[#2FA084] text-white text-xs shadow-lg mb-4" style={{ fontWeight: 800 }}>
            GeoAI Engine Powered by Groq
          </span>
          <h2 className="text-4xl md:text-5xl text-[#1F6F5F] dark:text-white" style={{ fontWeight: 900 }}>
            اكتشف أين نبني غداً
          </h2>
        </motion.div>
      </div>

      <div className="app-container relative">
        <div className="relative h-[650px] md:h-[750px] rounded-[2.5rem] overflow-hidden shadow-[0_30px_60px_-15px_rgba(0,0,0,0.4)] border border-white/10">
          <Map
            ref={mapRef}
            {...viewState}
            onMove={evt => setViewState(evt.viewState)}
            mapboxAccessToken={MAPBOX_TOKEN}
            mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
            terrain={{ source: 'mapbox-dem', exaggeration: 1.5 }}
            attributionControl={false}
          >
            <Source
              id="mapbox-dem"
              type="raster-dem"
              url="mapbox://mapbox.mapbox-terrain-dem-v1"
              tileSize={512}
              maxzoom={14}
            />

            <Layer
              id="sky"
              type="sky"
              paint={{
                'sky-type': 'atmosphere',
                'sky-atmosphere-sun': [0.0, 90.0],
                'sky-atmosphere-sun-intensity': 15
              }}
            />

            <FullscreenControl position="bottom-right" />
            <NavigationControl position="bottom-right" />

            {/* Render existing facilities */}
            {existingFacilities.map(f => (
              <Marker key={f.id} longitude={f.lon} latitude={f.lat}>
                <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white shadow-[0_0_10px_rgba(239,68,68,0.8)]" title={f.tags.name || f.type} />
              </Marker>
            ))}

            {/* AI Recommendation Marker */}
            {recommendation && (
              <Marker longitude={recommendation.lng} latitude={recommendation.lat} anchor="bottom">
                <motion.div
                  initial={{ scale: 0, opacity: 0, y: -20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20, delay: 2.5 }}
                  className="relative group cursor-pointer"
                >
                  <div className="absolute inset-0 bg-[#6FCF97] rounded-full blur-xl opacity-70 animate-pulse" />
                  <div className="relative w-12 h-12 bg-gradient-to-br from-[#1F6F5F] to-[#6FCF97] rounded-full flex items-center justify-center border-4 border-white shadow-2xl">
                    <Locate className="w-6 h-6 text-white animate-[spin_4s_linear_infinite]" />
                  </div>
                  <div className="w-1 h-12 bg-gradient-to-b from-white to-transparent mx-auto mt-2 opacity-50" />
                </motion.div>
              </Marker>
            )}
          </Map>

          <AIControlPanel 
            onRecommend={handleRecommend} 
            districts={QENA_DISTRICTS}
            selectedDistrict={selectedDistrict}
            setSelectedDistrict={setSelectedDistrict}
          />

          <AnimatePresence>
            {recommendation && (
              <motion.div
                initial={{ opacity: 0, x: -50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.95 }}
                transition={{ duration: 0.6, delay: 3.5 }}
                className="absolute bottom-20 md:bottom-8 left-4 md:left-8 right-4 md:right-auto w-auto md:w-[400px] z-10"
              >
                <div className="rounded-3xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur-2xl border border-[#6FCF97]/30 shadow-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex gap-1.5 px-3 py-1 rounded-full bg-[#6FCF97]/20 text-[#1F6F5F] dark:text-[#6FCF97] text-xs" style={{ fontWeight: 800 }}>
                      <Activity className="w-4 h-4" />
                      درجة التوصية: {recommendation.score}%
                    </div>
                  </div>
                  <h4 className="text-xl text-[#1F6F5F] dark:text-white mb-2" style={{ fontWeight: 900 }}>
                    استراتيجية Groq لاختيار الموقع
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">
                    {recommendation.reasoning}
                  </p>
                  <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
                    <div className="text-[11px] text-zinc-500 font-mono bg-black/5 dark:bg-white/5 px-2 py-1 rounded">
                      LAT: {recommendation.lat.toFixed(4)}, LNG: {recommendation.lng.toFixed(4)}
                    </div>
                    <button onClick={() => setRecommendation(null)} className="text-xs text-[#2FA084] hover:underline" style={{ fontWeight: 800 }}>
                      إغلاق والتجول بحرية
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <div className="absolute top-6 left-6 px-4 py-3 rounded-2xl bg-black/55 backdrop-blur-xl border border-white/15 text-white text-xs">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-3 h-3 rounded-full bg-red-500 shadow-[0_0_8px_red]" />
              <span>مرافق موجودة (من OSM)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#6FCF97] shadow-[0_0_8px_#6FCF97]" />
              <span style={{ fontWeight: 700 }}>الموقع المقترح للذكاء الاصطناعي</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
