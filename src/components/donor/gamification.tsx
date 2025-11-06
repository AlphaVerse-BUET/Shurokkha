"use client"

import { useMemo } from "react"
import { mockDonations } from "@/store/mock-data"
import { Trophy, Star, Zap, Users, Award } from "lucide-react"

interface DonorGamificationProps {
  donorId: string
}

// Calculate impact score based on formula from spec
const calculateImpactScore = (
  donationAmount: number,
  providerTrustScore: number,
  verificationSuccessRate: number,
): number => {
  return (donationAmount * providerTrustScore * verificationSuccessRate) / 100000
}

export default function DonorGamification({ donorId }: DonorGamificationProps) {
  const donorData = useMemo(() => {
    const donations = mockDonations.filter((d) => d.donorId === donorId)
    const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0)
    const allocationsCompleted = donations.flatMap((d) => d.allocations).filter((a) => a.status === "completed").length
    const totalAllocations = donations.flatMap((d) => d.allocations).length

    // Simple trust score average (using provider data)
    const avgProviderTrust = 85 // Placeholder
    const verificationSuccessRate = totalAllocations > 0 ? (allocationsCompleted / totalAllocations) * 100 : 0

    const impactScore = calculateImpactScore(totalDonated, avgProviderTrust, verificationSuccessRate)

    // Determine donor level
    let level = "Bronze"
    let levelColor = "from-amber-500 to-orange-500"
    let nextLevelThreshold = 50000

    if (totalDonated >= 500000) {
      level = "Platinum"
      levelColor = "from-purple-500 to-pink-500"
      nextLevelThreshold = Number.POSITIVE_INFINITY
    } else if (totalDonated >= 100000) {
      level = "Gold"
      levelColor = "from-yellow-500 to-orange-500"
      nextLevelThreshold = 500000
    } else if (totalDonated >= 50000) {
      level = "Silver"
      levelColor = "from-gray-400 to-gray-500"
      nextLevelThreshold = 100000
    }

    return {
      totalDonated,
      allocationsCompleted,
      impactScore: Math.round(impactScore),
      level,
      levelColor,
      nextLevelThreshold,
      progressToNextLevel: ((totalDonated / nextLevelThreshold) * 100).toFixed(0),
    }
  }, [donorId])

  // Determine badges
  const badges = useMemo(() => {
    const allBadges = []

    if (donorData.totalDonated >= 100000) allBadges.push({ id: "100k-donated", name: "৳100K+ Donated", icon: Trophy })
    if (donorData.totalDonated >= 10000) allBadges.push({ id: "10k-donated", name: "৳10K+ Donated", icon: Star })
    if (donorData.allocationsCompleted >= 10)
      allBadges.push({ id: "10-families", name: "10 Families Fed", icon: Users })
    if (donorData.allocationsCompleted >= 1)
      allBadges.push({ id: "early-responder", name: "Early Responder", icon: Zap })
    if (donorData.allocationsCompleted >= 5)
      allBadges.push({ id: "consistent-supporter", name: "Consistent Supporter", icon: Award })

    return allBadges
  }, [donorData])

  return (
    <div className="space-y-6">
      {/* Donor Level */}
      <div className={`bg-gradient-to-r ${donorData.levelColor} rounded-lg p-6 text-white shadow-lg`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-semibold opacity-90">Current Level</p>
            <h2 className="text-4xl font-bold">{donorData.level}</h2>
          </div>
          <Trophy className="w-16 h-16 opacity-80" />
        </div>

        {donorData.level !== "Platinum" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm mb-2">
              <span>
                Progress to{" "}
                {donorData.level === "Bronze" ? "Silver" : donorData.level === "Silver" ? "Gold" : "Platinum"}
              </span>
              <span>{donorData.progressToNextLevel}%</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500"
                style={{ width: `${Math.min(Number(donorData.progressToNextLevel), 100)}%` }}
              />
            </div>
            <p className="text-xs opacity-90 mt-2">
              ৳{(donorData.nextLevelThreshold - donorData.totalDonated).toLocaleString()} more to next level
            </p>
          </div>
        )}
      </div>

      {/* Impact Score & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border/50 rounded-lg p-4 text-center">
          <p className="text-xs text-foreground/60 mb-1">Impact Score</p>
          <p className="text-3xl font-bold text-primary">{donorData.impactScore}</p>
          <p className="text-xs text-foreground/60 mt-2">Based on donations & success</p>
        </div>

        <div className="bg-card border border-border/50 rounded-lg p-4 text-center">
          <p className="text-xs text-foreground/60 mb-1">Total Donated</p>
          <p className="text-3xl font-bold text-accent">৳{(donorData.totalDonated / 1000000).toFixed(2)}M</p>
          <p className="text-xs text-foreground/60 mt-2">Across all crises</p>
        </div>

        <div className="bg-card border border-border/50 rounded-lg p-4 text-center">
          <p className="text-xs text-foreground/60 mb-1">Completed Allocations</p>
          <p className="text-3xl font-bold text-green-600">{donorData.allocationsCompleted}</p>
          <p className="text-xs text-foreground/60 mt-2">Verified distributions</p>
        </div>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="bg-card border border-border/50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Your Badges</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {badges.map(({ id, name, icon: Icon }) => (
              <div
                key={id}
                className="flex flex-col items-center gap-2 text-center p-3 bg-background rounded-lg border border-border/50"
              >
                <Icon className="w-8 h-8 text-primary" />
                <p className="text-xs font-semibold text-foreground">{name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Leaderboard preview */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Top Donors</h3>
          <a href="#" className="text-xs font-medium text-primary hover:underline">
            View Full Leaderboard
          </a>
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((rank) => (
            <div
              key={rank}
              className="flex items-center justify-between p-3 bg-background rounded-lg border border-border/50"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-lg text-primary w-8 text-center">#{rank}</span>
                <div>
                  <p className="text-sm font-medium text-foreground">Donor {rank}</p>
                  <p className="text-xs text-foreground/60">{100 - rank * 10} allocations</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-accent">৳{((100 - rank * 10) * 100000).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
