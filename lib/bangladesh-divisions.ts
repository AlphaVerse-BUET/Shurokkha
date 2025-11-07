/**
 * Bangladesh Geographic Data
 * Divisions, districts, and coordinates for map visualization
 */

export interface Division {
  id: string;
  name: string;
  nameBn: string;
  coordinates: { lat: number; lng: number };
  districts: string[];
}

export const bangladeshDivisions: Division[] = [
  {
    id: "dhaka",
    name: "Dhaka",
    nameBn: "ঢাকা",
    coordinates: { lat: 23.8103, lng: 90.4125 },
    districts: [
      "Dhaka",
      "Faridpur",
      "Gazipur",
      "Gopalganj",
      "Kishoreganj",
      "Madaripur",
      "Manikganj",
      "Munshiganj",
      "Narayanganj",
      "Narsingdi",
      "Rajbari",
      "Shariatpur",
      "Tangail",
    ],
  },
  {
    id: "chittagong",
    name: "Chittagong",
    nameBn: "চট্টগ্রাম",
    coordinates: { lat: 22.3569, lng: 91.7832 },
    districts: [
      "Bandarban",
      "Brahmanbaria",
      "Chandpur",
      "Chittagong",
      "Comilla",
      "Cox's Bazar",
      "Feni",
      "Khagrachari",
      "Lakshmipur",
      "Noakhali",
      "Rangamati",
    ],
  },
  {
    id: "rajshahi",
    name: "Rajshahi",
    nameBn: "রাজশাহী",
    coordinates: { lat: 24.3745, lng: 88.6042 },
    districts: [
      "Bogra",
      "Joypurhat",
      "Naogaon",
      "Natore",
      "Chapainawabganj",
      "Pabna",
      "Rajshahi",
      "Sirajganj",
    ],
  },
  {
    id: "khulna",
    name: "Khulna",
    nameBn: "খুলনা",
    coordinates: { lat: 22.8456, lng: 89.5403 },
    districts: [
      "Bagerhat",
      "Chuadanga",
      "Jessore",
      "Jhenaidah",
      "Khulna",
      "Kushtia",
      "Magura",
      "Meherpur",
      "Narail",
      "Satkhira",
    ],
  },
  {
    id: "barisal",
    name: "Barisal",
    nameBn: "বরিশাল",
    coordinates: { lat: 22.701, lng: 90.3535 },
    districts: [
      "Barguna",
      "Barisal",
      "Bhola",
      "Jhalokati",
      "Patuakhali",
      "Pirojpur",
    ],
  },
  {
    id: "sylhet",
    name: "Sylhet",
    nameBn: "সিলেট",
    coordinates: { lat: 24.8949, lng: 91.8687 },
    districts: ["Habiganj", "Moulvibazar", "Sunamganj", "Sylhet"],
  },
  {
    id: "rangpur",
    name: "Rangpur",
    nameBn: "রংপুর",
    coordinates: { lat: 25.7439, lng: 89.2752 },
    districts: [
      "Dinajpur",
      "Gaibandha",
      "Kurigram",
      "Lalmonirhat",
      "Nilphamari",
      "Panchagarh",
      "Rangpur",
      "Thakurgaon",
    ],
  },
  {
    id: "mymensingh",
    name: "Mymensingh",
    nameBn: "ময়মনসিংহ",
    coordinates: { lat: 24.7471, lng: 90.4203 },
    districts: ["Jamalpur", "Mymensingh", "Netrokona", "Sherpur"],
  },
];

export interface HeatmapData {
  division: string;
  value: number; // donation amount or crisis count
  color: string;
  affectedPopulation: number;
  activeCrises: number;
  severity: number; // 0-100
  needsBreakdown: {
    food: number;
    medical: number;
    shelter: number;
    education: number;
  };
}

export function generateMockHeatmapData(): HeatmapData[] {
  // AI-generated realistic crisis hotspot data for Bangladesh
  const divisionData = {
    Dhaka: { baseValue: 8500000, population: 45000, crises: 12, severity: 75 },
    Chittagong: {
      baseValue: 6200000,
      population: 28000,
      crises: 8,
      severity: 82,
    },
    Rajshahi: {
      baseValue: 3400000,
      population: 15000,
      crises: 5,
      severity: 58,
    },
    Khulna: { baseValue: 5800000, population: 32000, crises: 9, severity: 88 },
    Barisal: { baseValue: 4100000, population: 18000, crises: 7, severity: 71 },
    Sylhet: { baseValue: 7200000, population: 38000, crises: 11, severity: 92 },
    Rangpur: { baseValue: 3900000, population: 19000, crises: 6, severity: 64 },
    Mymensingh: {
      baseValue: 4500000,
      population: 22000,
      crises: 7,
      severity: 69,
    },
  };

  return bangladeshDivisions.map((div) => {
    const data = divisionData[div.name as keyof typeof divisionData];
    const variation = 0.85 + Math.random() * 0.3; // 85-115% variation

    return {
      division: div.name,
      value: Math.floor(data.baseValue * variation),
      color: getHeatmapColor(data.severity / 100),
      affectedPopulation: Math.floor(data.population * variation),
      activeCrises: data.crises,
      severity: data.severity,
      needsBreakdown: {
        food: Math.floor(data.baseValue * 0.35 * variation),
        medical: Math.floor(data.baseValue * 0.25 * variation),
        shelter: Math.floor(data.baseValue * 0.28 * variation),
        education: Math.floor(data.baseValue * 0.12 * variation),
      },
    };
  });
}

function getHeatmapColor(intensity: number): string {
  // intensity from 0 to 1
  if (intensity > 0.8) return "#dc2626"; // red-600 - Critical
  if (intensity > 0.6) return "#ea580c"; // orange-600 - Very High
  if (intensity > 0.4) return "#f59e0b"; // amber-500 - High
  if (intensity > 0.2) return "#84cc16"; // lime-500 - Medium
  return "#10b981"; // emerald-500 - Low
}
