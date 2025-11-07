"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  CloudRain,
  Flame,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Calendar,
  Zap,
  Target,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface RiskPrediction {
  id: string
  division: string
  district: string
  riskType: "flood" | "fire" | "medical" | "poverty"
  riskScore: number
  confidence: number
  predictedDate: string
  daysAway: number
  affectedPopulation: number
  recommendedActions: string[]
  historicalOccurrences: number
  lastOccurrence: string
  trendDirection: "increasing" | "stable" | "decreasing"
}

export function AICrisisRiskAnalyzer() {
  const [timeframe, setTimeframe] = useState<"30" | "60" | "90">("30")
  const [selectedDivision, setSelectedDivision] = useState<string>("all")
  const [predictions, setPredictions] = useState<RiskPrediction[]>([])

  // Generate dummy predictions
  useEffect(() => {
    const dummyPredictions: RiskPrediction[] = [
      {
        id: "pred-1",
        division: "Chittagong",
        district: "Cox's Bazar",
        riskType: "flood",
        riskScore: 87,
        confidence: 92,
        predictedDate: "2025-06-15",
        daysAway: 220,
        affectedPopulation: 45000,
        recommendedActions: [
          "Pre-stage 200 relief kits in coastal areas",
          "Activate 15 emergency shelters",
          "Coordinate with 8 local NGOs",
          "Deploy mobile medical units",
        ],
        historicalOccurrences: 12,
        lastOccurrence: "2024-07-20",
        trendDirection: "increasing",
      },
      {
        id: "pred-2",
        division: "Dhaka",
        district: "Gazipur",
        riskType: "fire",
        riskScore: 76,
        confidence: 88,
        predictedDate: "2025-04-10",
        daysAway: 154,
        affectedPopulation: 28000,
        recommendedActions: [
          "Inspect 50+ garment factories",
          "Distribute fire safety equipment",
          "Train 200 workers in fire safety",
          "Establish fire response teams",
        ],
        historicalOccurrences: 8,
        lastOccurrence: "2024-03-15",
        trendDirection: "stable",
      },
      {
        id: "pred-3",
        division: "Sylhet",
        district: "Sunamganj",
        riskType: "flood",
        riskScore: 82,
        confidence: 90,
        predictedDate: "2025-07-01",
        daysAway: 236,
        affectedPopulation: 62000,
        recommendedActions: [
          "Build temporary embankments",
          "Pre-position 300 relief kits",
          "Activate early warning system",
          "Coordinate evacuation routes",
        ],
        historicalOccurrences: 15,
        lastOccurrence: "2024-06-28",
        trendDirection: "increasing",
      },
      {
        id: "pred-4",
        division: "Rajshahi",
        district: "Chapainawabganj",
        riskType: "medical",
        riskScore: 68,
        confidence: 82,
        predictedDate: "2025-05-20",
        daysAway: 194,
        affectedPopulation: 18000,
        recommendedActions: [
          "Stock medical supplies",
          "Deploy mobile health camps",
          "Train community health workers",
          "Establish disease surveillance",
        ],
        historicalOccurrences: 5,
        lastOccurrence: "2024-05-10",
        trendDirection: "stable",
      },
      {
        id: "pred-5",
        division: "Khulna",
        district: "Satkhira",
        riskType: "flood",
        riskScore: 79,
        confidence: 86,
        predictedDate: "2025-08-10",
        daysAway: 276,
        affectedPopulation: 38000,
        recommendedActions: [
          "Reinforce coastal defenses",
          "Pre-stage 180 relief kits",
          "Coordinate with cyclone centers",
          "Deploy water purification units",
        ],
        historicalOccurrences: 10,
        lastOccurrence: "2024-08-05",
        trendDirection: "stable",
      },
    ]

    // Filter by timeframe
    const filtered = dummyPredictions.filter((pred) => {
      const days = parseInt(timeframe)
      return pred.daysAway <= days
    })

    setPredictions(filtered.slice(0, parseInt(timeframe) === 30 ? 2 : filtered.length))
  }, [timeframe])

  const getRiskIcon = (type: string) => {
    switch (type) {
      case "flood":
        return CloudRain
      case "fire":
        return Flame
      case "medical":
        return AlertTriangle
      default:
        return AlertTriangle
    }
  }

  const getRiskColor = (score: number) => {
    if (score >= 80) return "text-red-600 bg-red-50 border-red-200"
    if (score >= 60) return "text-orange-600 bg-orange-50 border-orange-200"
    return "text-yellow-600 bg-yellow-50 border-yellow-200"
  }

  const getRiskBadgeColor = (score: number) => {
    if (score >= 80) return "bg-red-600"
    if (score >= 60) return "bg-orange-600"
    return "bg-yellow-600"
  }

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case "increasing":
        return "📈"
      case "decreasing":
        return "📉"
      default:
        return "➡️"
    }
  }

  // Calculate statistics
  const stats = {
    totalPredictions: predictions.length,
    highRisk: predictions.filter((p) => p.riskScore >= 80).length,
    avgConfidence: predictions.length
      ? Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length)
      : 0,
    totalPopulationAtRisk: predictions.reduce((sum, p) => sum + p.affectedPopulation, 0),
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="border-2 border-blue-200 dark:border-blue-900 bg-linear-to-br from-blue-50/50 to-transparent dark:from-blue-950/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Zap className="w-6 h-6 text-blue-500" />
                AI Crisis Risk Analyzer
              </CardTitle>
              <CardDescription>
                Predictive intelligence for proactive crisis management
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              92% Accuracy
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Statistics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border">
              <Target className="w-4 h-4 text-blue-600 mb-1" />
              <p className="text-2xl font-bold">{stats.totalPredictions}</p>
              <p className="text-xs text-muted-foreground">Predictions</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border">
              <AlertTriangle className="w-4 h-4 text-red-600 mb-1" />
              <p className="text-2xl font-bold">{stats.highRisk}</p>
              <p className="text-xs text-muted-foreground">High Risk</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border">
              <TrendingUp className="w-4 h-4 text-green-600 mb-1" />
              <p className="text-2xl font-bold">{stats.avgConfidence}%</p>
              <p className="text-xs text-muted-foreground">Avg Confidence</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border">
              <MapPin className="w-4 h-4 text-purple-600 mb-1" />
              <p className="text-2xl font-bold">
                {(stats.totalPopulationAtRisk / 1000).toFixed(0)}K
              </p>
              <p className="text-xs text-muted-foreground">Population at Risk</p>
            </div>
          </div>

          {/* Timeframe Selector */}
          <div className="flex gap-2">
            <Button
              variant={timeframe === "30" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("30")}
              className="flex-1"
            >
              Next 30 Days
            </Button>
            <Button
              variant={timeframe === "60" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("60")}
              className="flex-1"
            >
              Next 60 Days
            </Button>
            <Button
              variant={timeframe === "90" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeframe("90")}
              className="flex-1"
            >
              Next 90 Days
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Predictions List */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-orange-600" />
          Risk Predictions - Next {timeframe} Days
        </h3>

        {predictions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No significant risks predicted in the next {timeframe} days
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                AI monitoring continues 24/7
              </p>
            </CardContent>
          </Card>
        ) : (
          predictions.map((prediction) => {
            const RiskIcon = getRiskIcon(prediction.riskType)
            return (
              <Card
                key={prediction.id}
                className={`border-2 ${getRiskColor(prediction.riskScore)}`}
              >
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border">
                          <RiskIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg capitalize">
                            {prediction.riskType} Risk
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {prediction.district}, {prediction.division}
                          </p>
                        </div>
                      </div>

                      <div className="text-right space-y-2">
                        <Badge className={getRiskBadgeColor(prediction.riskScore)}>
                          {prediction.riskScore}% Risk
                        </Badge>
                        <div className="text-xs text-muted-foreground">
                          {prediction.confidence}% Confidence
                        </div>
                      </div>
                    </div>

                    {/* Risk Score Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Risk Level</span>
                        <span className="font-medium">{prediction.riskScore}/100</span>
                      </div>
                      <Progress value={prediction.riskScore} className="h-2" />
                    </div>

                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border text-center">
                        <Calendar className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">Predicted Date</p>
                        <p className="text-sm font-bold">
                          {new Date(prediction.predictedDate).toLocaleDateString("en-GB", {
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                        <p className="text-xs text-muted-foreground">{prediction.daysAway} days</p>
                      </div>

                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border text-center">
                        <MapPin className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">At Risk</p>
                        <p className="text-sm font-bold">
                          {(prediction.affectedPopulation / 1000).toFixed(0)}K
                        </p>
                        <p className="text-xs text-muted-foreground">people</p>
                      </div>

                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border text-center">
                        <TrendingUp className="w-4 h-4 text-orange-600 mx-auto mb-1" />
                        <p className="text-xs text-muted-foreground">History</p>
                        <p className="text-sm font-bold">{prediction.historicalOccurrences}x</p>
                        <p className="text-xs text-muted-foreground">occurrences</p>
                      </div>

                      <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border text-center">
                        <span className="text-2xl mb-1 block">
                          {getTrendIcon(prediction.trendDirection)}
                        </span>
                        <p className="text-xs text-muted-foreground">Trend</p>
                        <p className="text-sm font-bold capitalize">{prediction.trendDirection}</p>
                      </div>
                    </div>

                    {/* AI Insights */}
                    <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-start gap-2 mb-2">
                        <Zap className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-semibold text-sm text-blue-900 dark:text-blue-300">
                            AI Analysis
                          </p>
                          <p className="text-xs text-blue-700 dark:text-blue-400 mt-1">
                            Based on satellite data, weather patterns, and {prediction.historicalOccurrences} historical occurrences.
                            Last similar event: {new Date(prediction.lastOccurrence).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Recommended Actions */}
                    <div className="space-y-2">
                      <p className="font-semibold text-sm flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        Recommended Actions
                      </p>
                      <div className="grid gap-2">
                        {prediction.recommendedActions.map((action, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-2 text-sm bg-white dark:bg-slate-900 p-2 rounded border"
                          >
                            <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                              <span className="text-xs font-bold text-green-700 dark:text-green-400">
                                {idx + 1}
                              </span>
                            </div>
                            <span>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 border-t">
                      <Button size="sm" className="flex-1">
                        Create Preparedness Plan
                      </Button>
                      <Button size="sm" variant="outline">
                        Export Report
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Historical Accuracy */}
      <Card className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold mb-1">Historical Accuracy</h4>
              <p className="text-sm text-muted-foreground mb-3">
                Our AI model has predicted 234 crises over the past 2 years with 92% accuracy
              </p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Correct Predictions</span>
                  <span className="font-bold">215/234 (92%)</span>
                </div>
                <Progress value={92} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AICrisisRiskAnalyzer
