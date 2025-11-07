"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Zap,
  Heart,
  Clock,
  Shield,
  Calendar,
  Target,
  ArrowUpRight,
} from "lucide-react"
import { useState } from "react"

interface TrustScoreBreakdownProps {
  providerName: string
  overallScore: number
  completionRate: number
  averageRating: number
  responseSpeedScore: number
  zeroFraudBonus: number
  longevityScore: number
  yearsActive: number
  percentile: number
  trend: "up" | "down" | "stable"
  actionItems?: string[]
}

const TrustScoreBreakdownWeights = {
  completionRate: 0.30,
  averageRating: 0.25,
  responseSpeed: 0.20,
  zeroFraudBonus: 0.15,
  longevity: 0.10,
}

export function TrustScoreBreakdown({
  providerName,
  overallScore,
  completionRate,
  averageRating,
  responseSpeedScore,
  zeroFraudBonus,
  longevityScore,
  yearsActive,
  percentile,
  trend,
  actionItems,
}: TrustScoreBreakdownProps) {
  const [expanded, setExpanded] = useState(false)
  const [hoveredFactor, setHoveredFactor] = useState<string | null>(null)

  const factors = [
    {
      name: "Completion Rate",
      icon: Target,
      value: completionRate,
      weight: TrustScoreBreakdownWeights.completionRate,
      description:
        "Percentage of accepted distributions completed successfully",
      formula: `${completionRate}% × 30% = ${(completionRate * 0.3).toFixed(1)} points`,
      benchmark: "Top performers: >95%",
    },
    {
      name: "Average Rating",
      icon: Heart,
      value: averageRating * 20, // Convert 5-star to 100
      weight: TrustScoreBreakdownWeights.averageRating,
      description: "5-star rating from donors and beneficiaries (converted to 0-100)",
      formula: `${(averageRating * 20).toFixed(1)} × 25% = ${(averageRating * 20 * 0.25).toFixed(1)} points`,
      benchmark: "Top performers: >4.5 stars (90/100)",
    },
    {
      name: "Response Speed",
      icon: Clock,
      value: responseSpeedScore,
      weight: TrustScoreBreakdownWeights.responseSpeed,
      description: "How quickly provider accepts and acts on distribution requests",
      formula: `${responseSpeedScore.toFixed(1)} × 20% = ${(responseSpeedScore * 0.2).toFixed(1)} points`,
      benchmark: "Top performers: Accept within 4 hours (80/100)",
    },
    {
      name: "Zero Fraud Bonus",
      icon: Shield,
      value: zeroFraudBonus,
      weight: TrustScoreBreakdownWeights.zeroFraudBonus,
      description: "Bonus points if provider has zero fraud incidents",
      formula: `${zeroFraudBonus} × 15% = ${(zeroFraudBonus * 0.15).toFixed(1)} points`,
      benchmark: `${zeroFraudBonus === 15 ? "✓ Qualified" : "No fraudulent incidents required"}`,
    },
    {
      name: "Longevity",
      icon: Calendar,
      value: longevityScore,
      weight: TrustScoreBreakdownWeights.longevity,
      description: `Years active on platform (${yearsActive} years)`,
      formula: `${longevityScore.toFixed(1)} × 10% = ${(longevityScore * 0.1).toFixed(1)} points`,
      benchmark: "Capped at 10 points (10 years max)",
    },
  ]

  const trendIcon =
    trend === "up" ? "📈" : trend === "down" ? "📉" : "➡️"

  return (
    <div className="space-y-4">
      <Card className="border-2 border-blue-200 dark:border-blue-900 bg-gradient-to-br from-blue-50/50 to-transparent dark:from-blue-950/20">
        <CardHeader>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  Trust Score
                </CardTitle>
                <CardDescription>
                  How we calculate {providerName}'s reliability score
                </CardDescription>
              </div>
              <div className="text-right space-y-1">
                <Badge variant="default" className="text-2xl px-4 py-2">
                  {overallScore}/100
                </Badge>
                <div className="flex items-center gap-1 justify-end">
                  <span className="text-xs text-muted-foreground">Top {percentile}%</span>
                  <span>{trendIcon}</span>
                </div>
              </div>
            </div>

            {/* Visual score bar */}
            <div className="space-y-2">
              <Progress value={overallScore} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Quick stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg text-center border border-border/50">
              <Target className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <p className="font-bold text-sm">{completionRate}%</p>
              <p className="text-xs text-muted-foreground">Completion</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg text-center border border-border/50">
              <Heart className="w-4 h-4 text-red-600 mx-auto mb-1" />
              <p className="font-bold text-sm">{averageRating.toFixed(1)}/5</p>
              <p className="text-xs text-muted-foreground">Rating</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg text-center border border-border/50">
              <Clock className="w-4 h-4 text-orange-600 mx-auto mb-1" />
              <p className="font-bold text-sm">{responseSpeedScore.toFixed(0)}/100</p>
              <p className="text-xs text-muted-foreground">Speed</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg text-center border border-border/50">
              <Shield className="w-4 h-4 text-green-600 mx-auto mb-1" />
              <p className="font-bold text-sm">{zeroFraudBonus === 15 ? "✓" : "✗"}</p>
              <p className="text-xs text-muted-foreground">No Fraud</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg text-center border border-border/50">
              <Calendar className="w-4 h-4 text-purple-600 mx-auto mb-1" />
              <p className="font-bold text-sm">{yearsActive}y</p>
              <p className="text-xs text-muted-foreground">Active</p>
            </div>
          </div>

          {/* Detailed breakdown toggle */}
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-between"
            onClick={() => setExpanded(!expanded)}
          >
            <span className="font-semibold">
              {expanded ? "Hide" : "Show"} Detailed Calculation
            </span>
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>

          {expanded && (
            <div className="space-y-4 pt-4 border-t border-border/30">
              {/* Formula */}
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg border border-border/50 space-y-2">
                <p className="font-semibold text-sm">Formula</p>
                <code className="text-xs text-muted-foreground break-words">
                  Trust Score = (30% × Completion) + (25% × Rating) + (20% × Response Speed) +
                  (15% × Fraud Bonus) + (10% × Longevity)
                </code>
              </div>

              {/* Factor breakdown */}
              <div className="space-y-3">
                <p className="font-semibold text-sm">Factor Breakdown</p>
                {factors.map((factor, idx) => {
                  const Icon = factor.icon
                  const contribution = (factor.value * factor.weight).toFixed(1)

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border transition-all cursor-pointer ${
                        hoveredFactor === factor.name
                          ? "border-primary bg-primary/5"
                          : "border-border/50 bg-white dark:bg-slate-900"
                      }`}
                      onMouseEnter={() => setHoveredFactor(factor.name)}
                      onMouseLeave={() => setHoveredFactor(null)}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 space-y-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-semibold text-sm">{factor.name}</p>
                            <Badge variant="outline" className="text-xs flex-shrink-0">
                              +{contribution} pts
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{factor.description}</p>

                          {hoveredFactor === factor.name && (
                            <div className="space-y-1 mt-2 pt-2 border-t border-border/30">
                              <p className="text-xs font-mono bg-slate-100 dark:bg-slate-800 p-2 rounded">
                                {factor.formula}
                              </p>
                              <p className="text-xs text-muted-foreground italic">
                                Benchmark: {factor.benchmark}
                              </p>
                            </div>
                          )}

                          {/* Visual bar */}
                          <div className="mt-2 space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Score: {factor.value.toFixed(1)}/100</span>
                              <span className="text-muted-foreground">Weight: {(factor.weight * 100).toFixed(0)}%</span>
                            </div>
                            <div className="h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  factor.value > 80
                                    ? "bg-green-500"
                                    : factor.value > 60
                                    ? "bg-blue-500"
                                    : factor.value > 40
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${factor.value}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Action items */}
              {actionItems && actionItems.length > 0 && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4 text-blue-600" />
                    <p className="font-semibold text-sm text-blue-900 dark:text-blue-300">
                      To Reach 90+ Score
                    </p>
                  </div>
                  <ul className="text-sm text-blue-800 dark:text-blue-400 space-y-1">
                    {actionItems.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-blue-600 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Transparency note */}
              <div className="text-xs text-muted-foreground italic p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-border/50">
                ℹ️ This score updates daily based on new distributions, ratings, and response times. You can view the
                complete audit log at any time.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default TrustScoreBreakdown
