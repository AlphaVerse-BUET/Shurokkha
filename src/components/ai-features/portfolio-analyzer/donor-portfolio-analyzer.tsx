"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Trophy,
  TrendingUp,
  Heart,
  Target,
  Flame,
  Award,
  BarChart3,
  Calendar,
  Sparkles,
} from "lucide-react"

interface DonationHistory {
  id: string
  amount: number
  crisisType: string
  date: string
  impact: number
}

interface DonorPortfolioAnalyzerProps {
  donorName: string
  donations: DonationHistory[]
  joinDate: string
}

interface DonorPersonality {
  type: string
  icon: string
  description: string
  color: string
}

export function DonorPortfolioAnalyzer({
  donorName,
  donations,
  joinDate,
}: DonorPortfolioAnalyzerProps) {
  // Calculate analytics
  const analytics = useMemo(() => {
    if (!donations.length) {
      return {
        totalDonated: 0,
        totalImpact: 0,
        avgDonation: 0,
        donationCount: 0,
        impactScore: 0,
        impactEfficiency: 0,
        streak: 0,
        topCategory: "N/A",
        categoryBreakdown: {},
        monthlyTrend: [],
        percentile: 0,
        badgesEarned: [],
      }
    }

    const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0)
    const totalImpact = donations.reduce((sum, d) => sum + d.impact, 0)
    const avgDonation = totalDonated / donations.length
    const donationCount = donations.length

    // Calculate impact score (0-1000)
    const impactScore = Math.min(
      1000,
      Math.round((totalImpact / 100) + (donationCount * 10) + (totalDonated / 1000))
    )

    // Impact efficiency (impact per 1000 BDT)
    const impactEfficiency = Math.round((totalImpact / totalDonated) * 1000 * 100)

    // Category breakdown
    const categoryBreakdown: Record<string, number> = {}
    donations.forEach((d) => {
      categoryBreakdown[d.crisisType] = (categoryBreakdown[d.crisisType] || 0) + d.amount
    })

    const topCategory =
      Object.entries(categoryBreakdown).sort(([, a], [, b]) => b - a)[0]?.[0] || "N/A"

    // Calculate donation streak (consecutive months)
    const streak = calculateStreak(donations)

    // Percentile (dummy calculation)
    const percentile = Math.min(100, Math.round(50 + (impactScore / 20)))

    // Badges
    const badgesEarned = calculateBadges(donations, totalDonated, donationCount, streak)

    return {
      totalDonated,
      totalImpact,
      avgDonation,
      donationCount,
      impactScore,
      impactEfficiency,
      streak,
      topCategory,
      categoryBreakdown,
      percentile,
      badgesEarned,
    }
  }, [donations])

  // Determine donor personality
  const personality = useMemo((): DonorPersonality => {
    const { avgDonation, topCategory, donationCount } = analytics

    if (avgDonation > 15000) {
      return {
        type: "Major Donor",
        icon: "👑",
        description: "You make significant contributions that transform lives at scale",
        color: "from-yellow-400 to-orange-500",
      }
    } else if (topCategory === "medical") {
      return {
        type: "Healthcare Champion",
        icon: "🏥",
        description: "You focus on medical emergencies and healthcare support",
        color: "from-red-400 to-pink-500",
      }
    } else if (topCategory === "education") {
      return {
        type: "Education Advocate",
        icon: "📚",
        description: "You believe in empowering through education",
        color: "from-blue-400 to-purple-500",
      }
    } else if (donationCount >= 10) {
      return {
        type: "Consistent Supporter",
        icon: "💪",
        description: "You give regularly and maintain long-term commitment",
        color: "from-green-400 to-teal-500",
      }
    } else {
      return {
        type: "Strategic Giver",
        icon: "🎯",
        description: "You carefully choose high-impact causes",
        color: "from-purple-400 to-indigo-500",
      }
    }
  }, [analytics])

  // Recommendations
  const recommendations = useMemo(() => {
    const recs: string[] = []
    const { topCategory, categoryBreakdown, donationCount } = analytics

    // Diversification
    const categories = Object.keys(categoryBreakdown).length
    if (categories < 2) {
      recs.push("Consider diversifying into other causes like flood relief or livelihood support")
    }

    // Frequency
    if (donationCount < 5) {
      recs.push("Regular monthly donations create more sustainable impact")
    }

    // Amount
    if (analytics.avgDonation < 10000) {
      recs.push("Donations of ৳10K+ can support entire families for a month")
    }

    // Crisis-specific
    if (topCategory === "flood") {
      recs.push("Flood season is approaching - pre-disaster donations are 3x more effective")
    }

    if (!recs.length) {
      recs.push("You're doing great! Consider setting up recurring monthly donations")
    }

    return recs
  }, [analytics])

  return (
    <div className="space-y-6">
      {/* Personality Card */}
      <Card className={`border-2 overflow-hidden relative`}>
        <div className={`absolute inset-0 bg-linear-to-br ${personality.color} opacity-10`} />
        <CardContent className="p-6 relative">
          <div className="flex items-start gap-4">
            <div className="text-6xl">{personality.icon}</div>
            <div className="flex-1">
              <Badge className="mb-2">{personality.type}</Badge>
              <h3 className="text-2xl font-bold mb-2">
                {donorName}'s Giving Profile
              </h3>
              <p className="text-muted-foreground mb-4">{personality.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <p className="text-xs text-muted-foreground">Impact Score</p>
                  <p className="text-2xl font-bold text-primary">{analytics.impactScore}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Top {analytics.percentile}%</p>
                  <p className="text-2xl font-bold">🏆</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Streak</p>
                  <p className="text-2xl font-bold">🔥 {analytics.streak}mo</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Efficiency</p>
                  <p className="text-2xl font-bold">{analytics.impactEfficiency}%</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              Total Donated
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">৳{analytics.totalDonated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across {analytics.donationCount} donations
            </p>
            <p className="text-xs text-green-600 mt-2">
              Avg ৳{Math.round(analytics.avgDonation).toLocaleString()} per donation
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-500" />
              Total Impact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalImpact}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Families helped directly
            </p>
            <p className="text-xs text-green-600 mt-2">
              ≈ {analytics.totalImpact * 5} people impacted
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-500" />
              Donation Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.streak}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Consecutive months
            </p>
            <p className="text-xs text-green-600 mt-2">
              {analytics.streak >= 12 ? "Amazing commitment! 🎉" : `${12 - analytics.streak} more for 1-year badge`}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Donation Categories
          </CardTitle>
          <CardDescription>Where your support makes an impact</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(analytics.categoryBreakdown).map(([category, amount]) => {
            const percentage = (amount / analytics.totalDonated) * 100
            return (
              <div key={category} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium capitalize">{category}</span>
                  <span className="text-muted-foreground">
                    ৳{amount.toLocaleString()} ({percentage.toFixed(0)}%)
                  </span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* Badges */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements Unlocked
          </CardTitle>
          <CardDescription>
            {analytics.badgesEarned.length} of 12 badges earned
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {analytics.badgesEarned.map((badge, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border-2 border-primary/20 bg-primary/5 text-center"
              >
                <div className="text-3xl mb-2">{badge.icon}</div>
                <p className="font-semibold text-sm">{badge.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendations */}
      <Card className="border-2 border-purple-200 dark:border-purple-900 bg-linear-to-br from-purple-50/50 to-transparent dark:from-purple-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI Recommendations
          </CardTitle>
          <CardDescription>Personalized suggestions to maximize your impact</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-slate-900 border"
              >
                <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                  <Target className="w-4 h-4 text-purple-600" />
                </div>
                <p className="text-sm flex-1">{rec}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Member Since */}
      <Card>
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Member Since</p>
              <p className="text-xs text-muted-foreground">
                {new Date(joinDate).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm">
            Share Impact Report
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

// Helper functions
function calculateStreak(donations: DonationHistory[]): number {
  if (!donations.length) return 0

  // Sort by date
  const sorted = [...donations].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  let streak = 1
  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  let checkMonth = currentMonth
  let checkYear = currentYear

  for (const donation of sorted) {
    const donationDate = new Date(donation.date)
    const donationMonth = donationDate.getMonth()
    const donationYear = donationDate.getFullYear()

    if (donationMonth === checkMonth && donationYear === checkYear) {
      // Move to previous month
      checkMonth--
      if (checkMonth < 0) {
        checkMonth = 11
        checkYear--
      }
      streak++
    } else {
      break
    }
  }

  return streak
}

function calculateBadges(
  donations: DonationHistory[],
  totalDonated: number,
  donationCount: number,
  streak: number
) {
  const badges = []

  if (donationCount >= 1) {
    badges.push({ icon: "🌱", name: "First Step", description: "Made your first donation" })
  }

  if (donationCount >= 5) {
    badges.push({ icon: "⭐", name: "Regular Supporter", description: "5+ donations" })
  }

  if (donationCount >= 10) {
    badges.push({ icon: "🏅", name: "Committed Donor", description: "10+ donations" })
  }

  if (totalDonated >= 50000) {
    badges.push({ icon: "💎", name: "Generous Heart", description: "৳50K+ donated" })
  }

  if (totalDonated >= 100000) {
    badges.push({ icon: "👑", name: "Major Donor", description: "৳100K+ donated" })
  }

  if (streak >= 3) {
    badges.push({ icon: "🔥", name: "On Fire", description: "3-month streak" })
  }

  if (streak >= 12) {
    badges.push({ icon: "🚀", name: "Year Strong", description: "12-month streak" })
  }

  return badges
}

export default DonorPortfolioAnalyzer
