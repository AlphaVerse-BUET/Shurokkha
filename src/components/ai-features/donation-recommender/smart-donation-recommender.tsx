"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Sparkles, TrendingUp, Clock, Heart, ArrowRight, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Crisis } from "@/types"

interface DonationRecommendation {
  crisis: Crisis
  matchScore: number
  reason: string
  suggestedAmount: number
  impactPreview: string
  urgency: "high" | "medium" | "low"
  timing: string
}

interface SmartDonationRecommenderProps {
  donorHistory?: {
    totalDonated: number
    averageDonation: number
    preferredCrisisTypes: string[]
    lastDonationDate: string
    donationCount: number
  }
  availableCrises: Crisis[]
}

export function SmartDonationRecommender({
  donorHistory,
  availableCrises,
}: SmartDonationRecommenderProps) {
  const router = useRouter()
  const [selectedAmount, setSelectedAmount] = useState(10000)

  // Generate AI recommendations
  const recommendations = useMemo(() => {
    if (!donorHistory) return []

    const recs: DonationRecommendation[] = availableCrises
      .slice(0, 5)
      .map((crisis) => {
        let matchScore = 50

        // Match based on past preferences
        if (donorHistory.preferredCrisisTypes.includes(crisis.type)) {
          matchScore += 25
        }

        // Match based on urgency
        if (crisis.severity > 80) {
          matchScore += 15
        }

        // Match based on funding gap
        const fundingProgress = (crisis.fundingReceived / crisis.fundingNeeded) * 100
        if (fundingProgress < 30) {
          matchScore += 10
        }

        // Calculate suggested amount based on donor history
        const suggestedAmount = Math.round(
          donorHistory.averageDonation * (1 + Math.random() * 0.3)
        )

        // Impact preview
        const familiesHelped = Math.floor(suggestedAmount / 8000)
        const impactPreview = `Help ${familiesHelped}-${familiesHelped + 1} families`

        // Urgency
        let urgency: "high" | "medium" | "low" = "medium"
        if (crisis.severity > 80) urgency = "high"
        else if (crisis.severity < 50) urgency = "low"

        // Timing recommendations
        const timing = getTimingRecommendation(crisis.type)

        const reasons = []
        if (donorHistory.preferredCrisisTypes.includes(crisis.type)) {
          reasons.push(`Matches your interest in ${crisis.type} relief`)
        }
        if (crisis.severity > 80) {
          reasons.push("High urgency - immediate help needed")
        }
        if (fundingProgress < 30) {
          reasons.push("Critically underfunded")
        }
        if (!reasons.length) {
          reasons.push("Similar to your previous donations")
        }

        return {
          crisis,
          matchScore: Math.min(100, matchScore),
          reason: reasons[0],
          suggestedAmount,
          impactPreview,
          urgency,
          timing,
        }
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3)

    return recs
  }, [availableCrises, donorHistory])

  // Calculate impact at different donation levels
  const impactLevels = useMemo(() => {
    return [5000, 10000, 15000, 20000].map((amount) => ({
      amount,
      families: Math.floor(amount / 8000),
      impact: Math.floor(amount / 8000) * 5, // 5 people per family
    }))
  }, [])

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-orange-500"
      default:
        return "bg-green-500"
    }
  }

  if (!donorHistory) {
    return (
      <Card className="border-2 border-purple-200 dark:border-purple-900">
        <CardContent className="p-6 text-center">
          <Sparkles className="w-12 h-12 text-purple-500 mx-auto mb-4" />
          <p className="text-muted-foreground">
            Make your first donation to receive personalized recommendations!
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* AI Recommendations Card */}
      <Card className="border-2 border-purple-200 dark:border-purple-900 bg-gradient-to-br from-purple-50/50 to-transparent dark:from-purple-950/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-500" />
                AI Picked For You
              </CardTitle>
              <CardDescription>
                Based on your donation history and preferences
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              {recommendations.length} Recommendations
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Donor Insights */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Your Average</p>
              <p className="text-lg font-bold">৳{donorHistory.averageDonation.toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Total Donated</p>
              <p className="text-lg font-bold">৳{donorHistory.totalDonated.toLocaleString()}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Donations</p>
              <p className="text-lg font-bold">{donorHistory.donationCount}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-1">Focus Area</p>
              <p className="text-sm font-bold capitalize">
                {donorHistory.preferredCrisisTypes[0] || "Various"}
              </p>
            </div>
          </div>

          {/* Recommended Crises */}
          <div className="space-y-3">
            <h4 className="font-semibold text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              Top Matches for You
            </h4>

            {recommendations.map((rec, idx) => (
              <Card
                key={rec.crisis.id}
                className="border-2 hover:border-purple-300 transition-all cursor-pointer"
                onClick={() => router.push(`/crises/${rec.crisis.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <Badge
                        variant="outline"
                        className="bg-purple-50 text-purple-700 border-purple-200"
                      >
                        #{idx + 1}
                      </Badge>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <h5 className="font-semibold line-clamp-1">{rec.crisis.title}</h5>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {rec.crisis.location.district}, {rec.crisis.location.division}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getUrgencyColor(rec.urgency)} animate-pulse`} />
                          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
                            {rec.matchScore}% Match
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          {rec.reason}
                        </p>

                        {rec.timing && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {rec.timing}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-2 border-t">
                          <div>
                            <p className="text-xs text-muted-foreground">Suggested Donation</p>
                            <p className="text-lg font-bold text-purple-700">
                              ৳{rec.suggestedAmount.toLocaleString()}
                            </p>
                            <p className="text-xs text-green-600">{rec.impactPreview}</p>
                          </div>

                          <Button size="sm" className="gap-1">
                            Donate Now
                            <ArrowRight className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Funding Progress */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Funding Progress</span>
                            <span className="font-medium">
                              {((rec.crisis.fundingReceived / rec.crisis.fundingNeeded) * 100).toFixed(
                                0
                              )}
                              %
                            </span>
                          </div>
                          <Progress
                            value={(rec.crisis.fundingReceived / rec.crisis.fundingNeeded) * 100}
                            className="h-1.5"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Impact Optimizer */}
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200">
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold text-sm">Impact Optimizer</h4>
              </div>

              <p className="text-sm text-muted-foreground">
                See how your donation amount affects impact:
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {impactLevels.map((level) => (
                  <button
                    key={level.amount}
                    onClick={() => setSelectedAmount(level.amount)}
                    className={`p-3 rounded-lg border-2 transition-all text-left ${
                      selectedAmount === level.amount
                        ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                        : "border-border hover:border-green-300"
                    }`}
                  >
                    <p className="text-xs text-muted-foreground">Donate</p>
                    <p className="font-bold text-sm">৳{level.amount.toLocaleString()}</p>
                    <p className="text-xs text-green-600 mt-1">
                      {level.families} families
                    </p>
                    <p className="text-xs text-muted-foreground">{level.impact}+ people</p>
                  </button>
                ))}
              </div>

              <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border">
                <p className="text-xs text-muted-foreground mb-1">
                  Donors like you typically donate
                </p>
                <p className="text-sm font-semibold">
                  ৳{(donorHistory.averageDonation * 0.8).toLocaleString()} - ৳
                  {(donorHistory.averageDonation * 1.2).toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* View All Button */}
          <Button variant="outline" className="w-full" onClick={() => router.push("/crises")}>
            View All Crises
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

function getTimingRecommendation(crisisType: string): string {
  const recommendations: Record<string, string> = {
    flood: "Monsoon season approaching - donate now for preparedness",
    fire: "Dry season increases risk - early support recommended",
    medical: "Ongoing need - immediate support helps",
    poverty: "Year-round need - consistent support appreciated",
    education: "Academic year starting - donate before semester begins",
    livelihood: "Best time to support skill-building programs",
  }

  return recommendations[crisisType] || "Support needed now"
}

export default SmartDonationRecommender
