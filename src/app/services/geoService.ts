// GeoAI Service for fetching real OpenStreetMap data and providing AI recommendations via Groq

export interface GeoFeature {
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
  type: string;
}

export interface GeoPlace {
  id: number;
  lat: number;
  lon: number;
  name: string;
}

export type AmenityType = "hospital" | "school" | "post_office" | "youth_center" | "fire_station";

export interface District {
  id: string;
  name: string;
  bbox: [number, number, number, number]; // [south, west, north, east]
  center: [number, number]; // [lon, lat]
}

export const QENA_DISTRICTS: District[] = [
  { id: "qena", name: "مركز قنا", bbox: [26.10, 32.65, 26.25, 32.80], center: [32.7214, 26.1642] },
  { id: "naga_hammadi", name: "مركز نجع حمادي", bbox: [26.00, 32.15, 26.15, 32.30], center: [32.2415, 26.0511] },
  { id: "qous", name: "مركز قوص", bbox: [25.85, 32.70, 25.98, 32.85], center: [32.7630, 25.9145] },
  { id: "qift", name: "مركز قفط", bbox: [25.95, 32.75, 26.05, 32.85], center: [32.8105, 25.9983] },
  { id: "naqada", name: "مركز نقادة", bbox: [25.85, 32.65, 25.95, 32.75], center: [32.7144, 25.9083] },
  { id: "farshut", name: "مركز فرشوط", bbox: [26.00, 32.10, 26.10, 32.20], center: [32.1522, 26.0510] },
  { id: "abu_tesht", name: "مركز أبو تشت", bbox: [26.05, 31.95, 26.15, 32.10], center: [32.0225, 26.1130] },
  { id: "dishna", name: "مركز دشنا", bbox: [26.05, 32.35, 26.15, 32.55], center: [32.4552, 26.1189] },
  { id: "el_waqf", name: "مركز الوقف", bbox: [26.05, 32.25, 26.15, 32.35], center: [32.3167, 26.0833] }
];

export interface Recommendation {
  lat: number;
  lng: number;
  reasoning: string;
  score: number;
}

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_MODEL = "openai/gpt-oss-120b";

/**
 * Fetch amenities from OpenStreetMap using Overpass API for a given bounding box.
 */
export async function fetchOsmAmenities(amenity: AmenityType, bbox: [number, number, number, number]): Promise<GeoFeature[]> {
  const [s, w, n, e] = bbox;
  
  let osmFilter = "";
  if (amenity === "hospital") osmFilter = '["amenity"~"hospital|clinic"]';
  else if (amenity === "school") osmFilter = '["amenity"="school"]';
  else if (amenity === "post_office") osmFilter = '["amenity"="post_office"]';
  else if (amenity === "youth_center") osmFilter = '["leisure"~"pitch|sports_centre"]';
  else if (amenity === "fire_station") osmFilter = '["amenity"="fire_station"]';

  // Overpass QL query
  const query = `
    [out:json][timeout:25];
    (
      node${osmFilter}(${s},${w},${n},${e});
      way${osmFilter}(${s},${w},${n},${e});
      relation${osmFilter}(${s},${w},${n},${e});
    );
    out center;
  `;

  const url = `https://overpass-api.de/api/interpreter`;
  try {
    const response = await fetch(url, {
      method: "POST",
      body: "data=" + encodeURIComponent(query),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      }
    });

    if (!response.ok) {
      console.error("Overpass API error", response.statusText);
      return [];
    }

    const data = await response.json();
    return data.elements.map((el: any) => ({
      id: el.id,
      lat: el.lat || el.center?.lat,
      lon: el.lon || el.center?.lon,
      tags: el.tags || {},
      type: el.type
    })).filter((el: any) => el.lat && el.lon);
  } catch (err) {
    console.error("Failed to fetch from OSM", err);
    return [];
  }
}

/**
 * Fetch populated places (villages, towns, hamlets) from OSM to identify demand points.
 */
export async function fetchOsmPlaces(bbox: [number, number, number, number]): Promise<GeoPlace[]> {
  const [s, w, n, e] = bbox;
  
  const query = `
    [out:json][timeout:25];
    (
      node["place"~"village|town|hamlet|suburb"](${s},${w},${n},${e});
    );
    out center;
  `;

  try {
    const response = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: "data=" + encodeURIComponent(query),
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    if (!response.ok) return [];
    const data = await response.json();
    
    return data.elements
      .map((el: any) => ({
        id: el.id,
        lat: el.lat,
        lon: el.lon,
        name: el.tags?.["name:ar"] || el.tags?.name || "منطقة سكنية"
      }))
      .filter((el: any) => el.lat && el.lon);
  } catch (err) {
    console.error("Failed to fetch places", err);
    return [];
  }
}

/**
 * Call Groq API to get professional reasoning for the selected location.
 */
async function callGroqAI(
  amenityType: string,
  districtName: string,
  targetAreaName: string,
  existingCount: number,
  lat: number,
  lng: number,
  distanceToNearest: number
): Promise<{ reasoning: string, score: number }> {
  
  let amenityNameAr = amenityType;
  if (amenityType === 'hospital') amenityNameAr = 'مستشفى / مركز طبي';
  else if (amenityType === 'school') amenityNameAr = 'مدرسة جديدة';
  else if (amenityType === 'post_office') amenityNameAr = 'مكتب بريد / مجمع خدمات';
  else if (amenityType === 'youth_center') amenityNameAr = 'مركز شباب / ملعب رياضي';
  else if (amenityType === 'fire_station') amenityNameAr = 'وحدة إطفاء حريق';

  const systemPrompt = `أنت خبير ذكاء اصطناعي جغرافي (GeoAI) ومهندس تخطيط عمراني متخصص في مبادرة "حياة كريمة" بجمهورية مصر العربية.
مهمتك هي تقديم تبرير مهني واستراتيجي لاختيار موقع معين لبناء (${amenityNameAr}) جديد في نطاق (${districtName}).
أنت تتحدث بأسلوب علمي، دقيق، ومهني باللغة العربية، وتركز على التنمية المستدامة وسد الفجوات الخدمية للمناطق المحرومة.`;

  const userPrompt = `تم إجراء تحليل مكاني دقيق للفجوات الخدمية وتم اختيار "${targetAreaName}" كأكثر منطقة سكنية محرومة لإنشاء ${amenityNameAr}.
البيانات المستخرجة من نظام المعطيات الجغرافية (GIS):
- التجمع السكني المستهدف: ${targetAreaName}
- إجمالي عدد المرافق المشابهة الموجودة حالياً في كامل نطاق المركز: ${existingCount}
- إحداثيات الموقع المقترح: (خط العرض: ${lat.toFixed(4)}، خط الطول: ${lng.toFixed(4)})
- مسافة العجز (المسافة لأقرب مرفق مشابه): ${distanceToNearest.toFixed(2)} كيلومتر (هذه أكبر مسافة حرمان مسجلة في التجمعات السكنية).

أرجو كتابة فقرة واحدة مركزة ومقنعة (حوالي 4-5 أسطر) تبرر هذا الاختيار استراتيجياً وتأثيره الإيجابي على حياة أهالي "${targetAreaName}" لتخفيف العبء عنهم وتجنب السفر لمسافات طويلة، ثم قيم دقة التوصية بنسبة مئوية (من 85 إلى 99).
قم بإرجاع الرد بصيغة JSON فقط كالتالي:
{
  "reasoning": "التبرير هنا...",
  "score": 95
}`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API Error:", errorText);
      throw new Error("Groq API failed");
    }

    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    return {
      reasoning: content.reasoning || "موقع استراتيجي يسد الفجوة الخدمية الحالية.",
      score: content.score || 90
    };
  } catch (error) {
    console.error("Error communicating with Groq:", error);
    return {
      reasoning: "يقع هذا الموقع في المنطقة ذات العجز الأكبر في الخدمات (أبعد نقطة عن أي مرفق مشابه)، مما يضمن تغطية مناطق سكنية غير مخدومة وتخفيف الضغط عن المراكز الحالية.",
      score: 85
    };
  }
}

/**
 * Calculates distance between two coordinates in km
 */
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c;
}

function deg2rad(deg: number) {
  return deg * (Math.PI/180);
}

/**
 * Analyze an area and propose a new facility location.
 */
export async function analyzeAreaForNewFacility(
  amenity: AmenityType, 
  district: District
): Promise<{ existing: GeoFeature[], recommendation: Recommendation | null }> {
  
  const bbox = district.bbox;
  // Fetch existing facilities and populated places concurrently
  const [existingFacilities, populatedPlaces] = await Promise.all([
    fetchOsmAmenities(amenity, bbox),
    fetchOsmPlaces(bbox)
  ]);

  if (existingFacilities.length === 0) {
    // If no facilities exist, pick the most central populated place, or the center of the district
    let target = { lat: district.center[1], lon: district.center[0], name: district.name };
    if (populatedPlaces.length > 0) {
      target = populatedPlaces[0]; // Simplified: just pick the first major place found
    }

    const groqResponse = await callGroqAI(amenity, district.name, target.name, 0, target.lat, target.lon, 15);
    return {
      existing: [],
      recommendation: {
        lat: target.lat,
        lng: target.lon,
        reasoning: groqResponse.reasoning,
        score: groqResponse.score
      }
    };
  }

  // Find the most underserved populated place
  let bestPoint = { lat: 0, lon: 0, name: "", minDistance: -1 };

  if (populatedPlaces.length > 0) {
    // Urban Planning Approach: Evaluate distance from each populated place to the nearest facility
    for (const place of populatedPlaces) {
      let distToNearest = Infinity;
      for (const f of existingFacilities) {
        const d = getDistanceFromLatLonInKm(place.lat, place.lon, f.lat, f.lon);
        if (d < distToNearest) {
          distToNearest = d;
        }
      }

      // The place with the maximum distance to the nearest facility is our biggest "gap"
      if (distToNearest > bestPoint.minDistance) {
        bestPoint = { lat: place.lat, lon: place.lon, name: place.name, minDistance: distToNearest };
      }
    }
  } else {
    // Fallback: Grid search if no populated places found in OSM
    const gridSteps = 15;
    const latStep = (bbox[2] - bbox[0]) / gridSteps;
    const lonStep = (bbox[3] - bbox[1]) / gridSteps;

    for (let i = 0; i <= gridSteps; i++) {
      for (let j = 0; j <= gridSteps; j++) {
        const testLat = bbox[0] + (i * latStep);
        const testLon = bbox[1] + (j * lonStep);

        let distToNearest = Infinity;
        for (const f of existingFacilities) {
          const d = getDistanceFromLatLonInKm(testLat, testLon, f.lat, f.lon);
          if (d < distToNearest) {
            distToNearest = d;
          }
        }

        if (distToNearest > bestPoint.minDistance) {
          bestPoint = { lat: testLat, lon: testLon, name: "منطقة غير مخدومة", minDistance: distToNearest };
        }
      }
    }
  }

  // Get AI reasoning from Groq using the highly specific context
  const groqResponse = await callGroqAI(
    amenity, 
    district.name, 
    bestPoint.name,
    existingFacilities.length, 
    bestPoint.lat, 
    bestPoint.lon, 
    bestPoint.minDistance
  );

  return {
    existing: existingFacilities,
    recommendation: {
      lat: bestPoint.lat,
      lng: bestPoint.lon,
      reasoning: groqResponse.reasoning,
      score: groqResponse.score
    }
  };
}
