/**
 * Bangladesh Geographic Data
 * Divisions, districts, and coordinates for map visualization
 */

export interface Division {
  id: string
  name: string
  nameBn: string
  coordinates: { lat: number; lng: number }
  districts: string[]
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
    districts: ["Bogra", "Joypurhat", "Naogaon", "Natore", "Chapainawabganj", "Pabna", "Rajshahi", "Sirajganj"],
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
    districts: ["Barguna", "Barisal", "Bhola", "Jhalokati", "Patuakhali", "Pirojpur"],
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
]

export interface HeatmapData {
  division: string
  value: number // donation amount or crisis count
  color: string
}

export function generateMockHeatmapData(): HeatmapData[] {
  return bangladeshDivisions.map((div) => ({
    division: div.name,
    value: Math.floor(Math.random() * 10000000) + 1000000, // Random donation amount
    color: getHeatmapColor(Math.random()),
  }))
}

function getHeatmapColor(intensity: number): string {
  // intensity from 0 to 1
  if (intensity > 0.8) return "#dc2626" // red-600
  if (intensity > 0.6) return "#ea580c" // orange-600
  if (intensity > 0.4) return "#f59e0b" // amber-500
  if (intensity > 0.2) return "#84cc16" // lime-500
  return "#10b981" // emerald-500
}
