"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  AlertCircle,
  Shield,
  Users,
  Clock,
  Zap,
  Frown,
  Meh,
  Smile,
} from "lucide-react"

interface TrustFactors {
  documentVerification: number
  responseTime: number
  completionRate: number
  yearsActive: number
  fraudHistory: number
}

export function TrustScoreSimulator() {
  const [factors, setFactors] = useState<TrustFactors>({
    documentVerification: 95,
    responseTime: 88,
    completionRate: 92,
    yearsActive: 5,
    fraudHistory: 0,
  })

  const [showCalculation, setShowCalculation] = useState(false)

  const trustScore = useMemo(() => {
    // Trust score calculation formula
    const docWeight = 0.35
    const responseWeight = 0.25
    const completionWeight = 0.2
    const longevityWeight = 0.15
    const antifraudWeight = 0.05

    const longevityScore = Math.min((factors.yearsActive / 5) * 100, 100)
    const antifraudBonus = factors.fraudHistory === 0 ? 100 : Math.max(0, 100 - factors.fraudHistory * 20)

    const score =
      factors.documentVerification * docWeight +
      factors.responseTime * responseWeight +
      factors.completionRate * completionWeight +
      longevityScore * longevityWeight +
      antifraudBonus * antifraudWeight

    return Math.round(score)
  }, [factors])

  const getRiskLevel = () => {
    if (trustScore >= 85) return { level: "Safe", color: "text-green-600", bg: "bg-green-50 dark:bg-green-950/30", icon: "✓" }
    if (trustScore >= 70) return { level: "Caution", color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-950/30", icon: "!" }
    return { level: "High Risk", color: "text-red-600", bg: "bg-red-50 dark:bg-red-950/30", icon: "⚠" }
  }

  const getSatisfactionEmoji = () => {
    if (trustScore >= 85) return "😊"
    if (trustScore >= 70) return "😐"
    return "😞"
  }

  const riskLevel = getRiskLevel()

  const handleReset = () => {
    setFactors({
      documentVerification: 95,
      responseTime: 88,
      completionRate: 92,
      yearsActive: 5,
      fraudHistory: 0,
    })
    setShowCalculation(false)
  }

  return (
    <div className="space-y-8">
      {/* Title */}
      <div className="text-center space-y-2">
        <Badge variant="secondary" className="mx-auto">
          Interactive Demo
        </Badge>
        <h2 className="text-3xl font-bold">See How Trust is Calculated</h2>
        <p className="text-muted-foreground">
          Adjust the factors below and watch how Shurokkha calculates a provider's trust score in real-time
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Trust Score Display */}
        <Card className="lg:col-span-1 bg-linear-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border-indigo-200 dark:border-indigo-900">
          <CardContent className="p-6 space-y-6 flex flex-col h-full">
            {/* Score Ring */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 rounded-full bg-white dark:bg-black/30 shadow-lg flex items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: `conic-gradient(rgb(${trustScore >= 85 ? "34, 197, 94" : trustScore >= 70 ? "234, 179, 8" : "239, 68, 68"}) ${trustScore * 3.6}deg, transparent 0deg)`,
                    opacity: 0.2,
                  }}
                />
                <div className="text-center z-10">
                  <div className="text-4xl font-bold text-primary">{trustScore}</div>
                  <div className="text-xs text-muted-foreground">/100</div>
                </div>
              </div>
            </div>

            {/* Risk Level */}
            <div className={`p-4 rounded-lg ${riskLevel.bg}`}>
              <div className="flex items-center justify-between">
                <span className={`font-bold ${riskLevel.color}`}>{riskLevel.level}</span>
                <span className="text-2xl">{getSatisfactionEmoji()}</span>
              </div>
            </div>

            {/* Trust Breakdown */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-muted-foreground">Trust Components:</p>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Document Verification (35%)</span>
                  <span className="font-bold">{factors.documentVerification}%</span>
                </div>
                <Progress value={factors.documentVerification} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Response Time (25%)</span>
                  <span className="font-bold">{factors.responseTime}%</span>
                </div>
                <Progress value={factors.responseTime} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Completion Rate (20%)</span>
                  <span className="font-bold">{factors.completionRate}%</span>
                </div>
                <Progress value={factors.completionRate} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Years Active (15%)</span>
                  <span className="font-bold">{Math.round((factors.yearsActive / 5) * 100)}%</span>
                </div>
                <Progress value={Math.min((factors.yearsActive / 5) * 100, 100)} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>Zero Fraud Bonus (5%)</span>
                  <span className="font-bold">{factors.fraudHistory === 0 ? "100%" : "0%"}</span>
                </div>
                <Progress value={factors.fraudHistory === 0 ? 100 : 0} className="h-2" />
              </div>
            </div>

            <Button variant="outline" size="sm" onClick={handleReset} className="mt-auto">
              Reset to Default
            </Button>
          </CardContent>
        </Card>

        {/* Right: Controls */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6 space-y-6">
            {/* Document Verification */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Document Verification
                </label>
                <Badge variant="outline">{factors.documentVerification}%</Badge>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={factors.documentVerification}
                onChange={(e) =>
                  setFactors({ ...factors, documentVerification: parseInt(e.target.value) })
                }
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                How thoroughly documents were verified (NID, business registration, etc.)
              </p>
              {factors.documentVerification < 70 && (
                <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950/30 rounded text-xs">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <span>Low verification score raises red flags for AI fraud detection</span>
                </div>
              )}
            </div>

            {/* Response Time */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  Response Time Score
                </label>
                <Badge variant="outline">{factors.responseTime}%</Badge>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={factors.responseTime}
                onChange={(e) =>
                  setFactors({ ...factors, responseTime: parseInt(e.target.value) })
                }
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                How quickly provider responds to aid requests (target: &lt;2 hours)
              </p>
            </div>

            {/* Completion Rate */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  Completion Rate
                </label>
                <Badge variant="outline">{factors.completionRate}%</Badge>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={factors.completionRate}
                onChange={(e) =>
                  setFactors({ ...factors, completionRate: parseInt(e.target.value) })
                }
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Percentage of projects successfully completed (target: &gt;90%)
              </p>
            </div>

            {/* Years Active */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  Years Active
                </label>
                <Badge variant="outline">{factors.yearsActive} years</Badge>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={factors.yearsActive}
                onChange={(e) =>
                  setFactors({ ...factors, yearsActive: parseFloat(e.target.value) })
                }
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Platform experience (max boost at 5 years)
              </p>
            </div>

            {/* Fraud History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  Fraud Incidents
                </label>
                <Badge variant={factors.fraudHistory === 0 ? "default" : "destructive"}>
                  {factors.fraudHistory} reported
                </Badge>
              </div>
              <input
                type="range"
                min="0"
                max="5"
                value={factors.fraudHistory}
                onChange={(e) =>
                  setFactors({ ...factors, fraudHistory: parseInt(e.target.value) })
                }
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                Historical fraud incidents (each incident: -20% penalty)
              </p>
              {factors.fraudHistory > 0 && (
                <div className="flex items-start gap-2 p-2 bg-red-50 dark:bg-red-950/30 rounded text-xs">
                  <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                  <span>{factors.fraudHistory} incident{factors.fraudHistory > 1 ? "s" : ""} = {factors.fraudHistory * 20}% deduction</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-4 border-t">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() =>
                  setFactors({
                    documentVerification: 45,
                    responseTime: 35,
                    completionRate: 60,
                    yearsActive: 0.5,
                    fraudHistory: 3,
                  })
                }
              >
                Show Risky Provider
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() =>
                  setFactors({
                    documentVerification: 98,
                    responseTime: 96,
                    completionRate: 98,
                    yearsActive: 8,
                    fraudHistory: 0,
                  })
                }
              >
                Show Trusted Provider
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Formula Explanation */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold">The Trust Score Formula</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCalculation(!showCalculation)}
            >
              {showCalculation ? "Hide" : "Show"} Calculation
            </Button>
          </div>

          {showCalculation && (
            <div className="space-y-3 bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
              <div>
                <span className="text-green-600">Trust Score</span> = (DocVerif × 0.35) + (Response × 0.25) + (Completion × 0.20) + (Longevity × 0.15) + (AntifraudBonus × 0.05)
              </div>
              <div className="border-t pt-3 text-muted-foreground">
                <div>= ({factors.documentVerification} × 0.35) + ({factors.responseTime} × 0.25) + ({factors.completionRate} × 0.20) + ({Math.round((factors.yearsActive / 5) * 100)} × 0.15) + ({factors.fraudHistory === 0 ? "100" : "0"} × 0.05)</div>
                <div className="mt-2">= {(factors.documentVerification * 0.35).toFixed(1)} + {(factors.responseTime * 0.25).toFixed(1)} + {(factors.completionRate * 0.2).toFixed(1)} + {((factors.yearsActive / 5) * 100 * 0.15).toFixed(1)} + {(factors.fraudHistory === 0 ? 5 : 0)}</div>
                <div className="text-primary font-bold mt-2">= {trustScore}/100</div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded border border-green-200 dark:border-green-900">
              <p className="text-xs font-semibold text-green-600">85-100: Safe</p>
              <p className="text-xs text-muted-foreground">Verified & reliable provider</p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950/30 rounded border border-orange-200 dark:border-orange-900">
              <p className="text-xs font-semibold text-orange-600">70-84: Caution</p>
              <p className="text-xs text-muted-foreground">Needs verification improvement</p>
            </div>
            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded border border-red-200 dark:border-red-900">
              <p className="text-xs font-semibold text-red-600">&lt;70: High Risk</p>
              <p className="text-xs text-muted-foreground">Flagged by fraud detection AI</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Insight */}
      <Card className="border-2 border-primary/30 bg-linear-to-r from-primary/5 to-transparent">
        <CardContent className="p-6">
          <h3 className="font-bold mb-3">💡 Key Insight</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Every trust score component is transparent and auditable. You're not trusting a black box—you're
            seeing exactly why Shurokkha made its decision. This is what separates AI-powered platforms from
            traditional charity. Instead of "trust us," it's "here's the proof."
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

export default TrustScoreSimulator
