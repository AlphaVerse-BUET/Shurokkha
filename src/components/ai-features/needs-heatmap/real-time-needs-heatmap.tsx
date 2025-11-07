"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Division {
  id: string
  name: string
  nameBn: string
  coordinates: { lat: number; lng: number }
  districts: string[]
}
import {
  MapPin,
  TrendingUp,
  Users,
  AlertTriangle,
  Filter,
  Zap,
  Clock,
  Activity,
} from "lucide-react"

interface NeedData {
  division: string
  district: string
  needType: "food" | "medical" | "shelter" | "education" | "livelihood"
  severity: number // 0-100
  affectedPopulation: number
  fundingGap: number
  activeCrises: number
  lastUpdated: Date
  trend: "increasing" | "stable" | "decreasing"
}

export function RealTimeNeedsHeatmap() {
  const [needsData, setNeedsData] = useState<NeedData[]>([])
  const [selectedFilter, setSelectedFilter] = useState<string>("all")
  const [isLive, setIsLive] = useState(true)

  // Generate dummy needs data
  useEffect(() => {
    const generateNeedsData = (): NeedData[] => {
      const bangladeshDivisions: Division[] = [
        { id: "dhaka", name: "Dhaka", nameBn: "ঢাকা", coordinates: { lat: 23.8103, lng: 90.4125 }, districts: ["Dhaka", "Faridpur"] },
        { id: "chittagong", name: "Chittagong", nameBn: "চট্টগ্রাম", coordinates: { lat: 22.3569, lng: 91.7832 }, districts: ["Chittagong", "Cox's Bazar"] },
        { id: "rajshahi", name: "Rajshahi", nameBn: "রাজশাহী", coordinates: { lat: 24.3745, lng: 88.6042 }, districts: ["Rajshahi", "Bogra"] },
        { id: "khulna", name: "Khulna", nameBn: "খুলনা", coordinates: { lat: 22.8456, lng: 89.5403 }, districts: ["Khulna", "Bagerhat"] },
        { id: "barisal", name: "Barisal", nameBn: "বরিশাল", coordinates: { lat: 22.701, lng: 90.3535 }, districts: ["Barisal", "Bhola"] },
        { id: "sylhet", name: "Sylhet", nameBn: "সিলেট", coordinates: { lat: 24.8949, lng: 91.8687 }, districts: ["Sylhet", "Moulvibazar"] },
        { id: "rangpur", name: "Rangpur", nameBn: "রংপুর", coordinates: { lat: 25.7439, lng: 89.2752 }, districts: ["Rangpur", "Dinajpur"] },
        { id: "mymensingh", name: "Mymensingh", nameBn: "ময়মনসিংহ", coordinates: { lat: 24.7471, lng: 90.4203 }, districts: ["Mymensingh", "Jamalpur"] },
      ]
      
      const types: Array<"food" | "medical" | "shelter" | "education" | "livelihood"> = [
        "food",
        "medical",
        "shelter",
        "education",
        "livelihood",
      ]

      return bangladeshDivisions.flatMap((div: Division) => {
        const needType = types[Math.floor(Math.random() * types.length)]
        const severity = Math.floor(Math.random() * 60) + 40
        const trend: "increasing" | "stable" | "decreasing" =
          ["increasing", "stable", "decreasing"][Math.floor(Math.random() * 3)] as any

        return [
          {
            division: div.name,
            district: div.districts[0],
            needType,
            severity,
            affectedPopulation: Math.floor(Math.random() * 50000) + 10000,
            fundingGap: Math.floor(Math.random() * 5000000) + 1000000,
            activeCrises: Math.floor(Math.random() * 8) + 1,
            lastUpdated: new Date(),
            trend,
          },
        ]
      })
    }

    setNeedsData(generateNeedsData())

    // Auto-update if live
    if (isLive) {
      const interval = setInterval(() => {
        setNeedsData(generateNeedsData())
      }, 5000) // Update every 5 seconds
      return () => clearInterval(interval)
    }
  }, [isLive])

  // Filter data
  const filteredData =
    selectedFilter === "all"
      ? needsData
      : needsData.filter((d) => d.needType === selectedFilter)

  // Calculate stats
  const stats = {
    totalPopulationAtRisk: needsData.reduce((sum, d) => sum + d.affectedPopulation, 0),
    totalFundingGap: needsData.reduce((sum, d) => sum + d.fundingGap, 0),
    activeCrises: needsData.reduce((sum, d) => sum + d.activeCrises, 0),
    highSeverityAreas: needsData.filter((d) => d.severity >= 70).length,
  }

  const getSeverityColor = (severity: number) => {
    if (severity >= 80) return "bg-red-500"
    if (severity >= 60) return "bg-orange-500"
    if (severity >= 40) return "bg-yellow-500"
    return "bg-green-500"
  }

  const getSeverityBg = (severity: number) => {
    if (severity >= 80) return "from-red-500/20 to-red-600/20 border-red-300"
    if (severity >= 60) return "from-orange-500/20 to-orange-600/20 border-orange-300"
    if (severity >= 40) return "from-yellow-500/20 to-yellow-600/20 border-yellow-300"
    return "from-green-500/20 to-green-600/20 border-green-300"
  }

  const getNeedIcon = (type: string) => {
    const icons: Record<string, string> = {
      food: "🍚",
      medical: "🏥",
      shelter: "🏠",
      education: "📚",
      livelihood: "💼",
    }
    return icons[type] || "❓"
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return "📈"
      case "decreasing":
        return "📉"
      default:
        return "➡️"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-2 border-green-200 dark:border-green-900 bg-linear-to-br from-green-50/50 to-transparent dark:from-green-950/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Activity className="w-6 h-6 text-green-500" />
                Real-Time Needs Heatmap
              </CardTitle>
              <CardDescription>
                Live monitoring of humanitarian needs across Bangladesh
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${isLive ? "bg-green-500 animate-pulse" : "bg-gray-400"}`} />
              <Badge variant={isLive ? "default" : "secondary"}>
                {isLive ? "Live" : "Paused"}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border">
              <Users className="w-4 h-4 text-purple-600 mb-1" />
              <p className="text-2xl font-bold">
                {(stats.totalPopulationAtRisk / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-muted-foreground">Population at Risk</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border">
              <TrendingUp className="w-4 h-4 text-blue-600 mb-1" />
              <p className="text-2xl font-bold">৳{(stats.totalFundingGap / 1000000).toFixed(1)}M</p>
              <p className="text-xs text-muted-foreground">Funding Gap</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border">
              <AlertTriangle className="w-4 h-4 text-orange-600 mb-1" />
              <p className="text-2xl font-bold">{stats.activeCrises}</p>
              <p className="text-xs text-muted-foreground">Active Crises</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border">
              <MapPin className="w-4 h-4 text-red-600 mb-1" />
              <p className="text-2xl font-bold">{stats.highSeverityAreas}</p>
              <p className="text-xs text-muted-foreground">High Severity</p>
            </div>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Button
              variant={selectedFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("all")}
            >
              All Needs
            </Button>
            <Button
              variant={selectedFilter === "food" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("food")}
            >
              🍚 Food
            </Button>
            <Button
              variant={selectedFilter === "medical" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("medical")}
            >
              🏥 Medical
            </Button>
            <Button
              variant={selectedFilter === "shelter" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("shelter")}
            >
              🏠 Shelter
            </Button>
            <Button
              variant={selectedFilter === "education" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("education")}
            >
              📚 Education
            </Button>
            <Button
              variant={selectedFilter === "livelihood" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter("livelihood")}
            >
              💼 Livelihood
            </Button>
          </div>

          {/* Live Controls */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>Auto-updates every 5 seconds</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLive(!isLive)}
            >
              {isLive ? "⏸️ Pause" : "▶️ Resume"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Heatmap Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredData.map((data, idx) => (
          <Card
            key={`${data.division}-${idx}`}
            className={`border-2 bg-linear-to-br ${getSeverityBg(data.severity)} hover:shadow-lg transition-all cursor-pointer`}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-3xl">{getNeedIcon(data.needType)}</span>
                    <div>
                      <h4 className="font-bold">{data.division}</h4>
                      <p className="text-xs text-muted-foreground">{data.district}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-lg">{getTrendIcon(data.trend)}</span>
                    <Badge className={getSeverityColor(data.severity)}>
                      {data.severity}
                    </Badge>
                  </div>
                </div>

                {/* Need Type */}
                <div className="bg-white/80 dark:bg-slate-900/80 p-2 rounded border">
                  <p className="text-xs text-muted-foreground">Primary Need</p>
                  <p className="font-semibold capitalize">{data.needType}</p>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white/60 dark:bg-slate-900/60 p-2 rounded border">
                    <p className="text-xs text-muted-foreground">Affected</p>
                    <p className="font-bold text-sm">
                      {(data.affectedPopulation / 1000).toFixed(0)}K
                    </p>
                  </div>
                  <div className="bg-white/60 dark:bg-slate-900/60 p-2 rounded border">
                    <p className="text-xs text-muted-foreground">Gap</p>
                    <p className="font-bold text-sm">
                      ৳{(data.fundingGap / 100000).toFixed(0)}L
                    </p>
                  </div>
                </div>

                {/* Active Crises */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Active Crises</span>
                  <Badge variant="outline">{data.activeCrises}</Badge>
                </div>

                {/* Last Updated */}
                <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-2">
                  <span>Updated</span>
                  <span>
                    {data.lastUpdated.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legend */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="space-y-1">
              <p className="text-sm font-semibold">Severity Scale</p>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-xs">Low (0-40)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <span className="text-xs">Medium (40-60)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-xs">High (60-80)</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <span className="text-xs">Critical (80-100)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-green-600" />
              <span className="text-xs text-muted-foreground">
                Data powered by AI analysis of satellite imagery, reports, and on-ground sensors
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Alert */}
      {stats.highSeverityAreas >= 3 && (
        <Card className="border-2 border-red-200 bg-linear-to-br from-red-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-red-900 dark:text-red-300 mb-2">
                  High Alert: Multiple Critical Areas
                </h4>
                <p className="text-sm text-red-700 dark:text-red-400 mb-3">
                  {stats.highSeverityAreas} regions currently at critical severity level. Immediate
                  intervention recommended.
                </p>
                <Button size="sm" variant="destructive">
                  Activate Emergency Response
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default RealTimeNeedsHeatmap
