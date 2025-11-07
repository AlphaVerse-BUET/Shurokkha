"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  TrendingUp,
  Heart,
  Star,
  Medal,
  Trophy,
  Flame,
  Users,
  Target,
  Eye,
  EyeOff,
  Share2,
} from "lucide-react"

interface Donor {
  id: string
  name: string
  totalDonated: number
  familiesHelped: number
  crisesSolved: number
  streak: number
  avgDonationSize: number
  rating: number
  isAnonymous?: boolean
  badges: string[]
  joinedDate: string
  lastDonationDate: string
}

interface DonorLeaderboardProps {
  donors: Donor[]
  currentUserId?: string
  timeframe?: "all-time" | "month" | "week"
}

const MedalColors = {
  gold: "text-yellow-500",
  silver: "text-gray-400",
  bronze: "text-orange-600",
}

const BadgeIcons: Record<string, React.ReactNode> = {
  "10-families": "👨‍👩‍👧‍👦",
  "100k-donated": "💰",
  "early-responder": "⚡",
  "consistent-supporter": "📅",
  "impact-leader": "🏆",
  "5-star-rating": "⭐",
}

export function DonorLeaderboard({
  donors,
  currentUserId,
  timeframe = "all-time",
}: DonorLeaderboardProps) {
  const [sortBy, setSortBy] = useState<"donated" | "families" | "streak">("donated")
  const [anonymousOnly, setAnonymousOnly] = useState(false)

  const sortedDonors = useMemo(() => {
    let filtered = [...donors]

    if (anonymousOnly) {
      filtered = filtered.filter(d => d.isAnonymous)
    }

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "families":
          return b.familiesHelped - a.familiesHelped
        case "streak":
          return b.streak - a.streak
        case "donated":
        default:
          return b.totalDonated - a.totalDonated
      }
    })
  }, [donors, sortBy, anonymousOnly])

  const currentUserRank = useMemo(() => {
    return sortedDonors.findIndex(d => d.id === currentUserId) + 1
  }, [sortedDonors, currentUserId])

  const topThreeDonors = sortedDonors.slice(0, 3)
  const totalImpact = donors.reduce((sum, d) => sum + d.totalDonated, 0)
  const totalFamilies = donors.reduce((sum, d) => sum + d.familiesHelped, 0)

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Total Community Impact</p>
              <p className="text-3xl font-bold text-primary">৳{(totalImpact / 10000000).toFixed(1)}Cr</p>
              <p className="text-xs text-muted-foreground">From {donors.length} donors</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Families Reached</p>
              <p className="text-3xl font-bold text-green-600">{totalFamilies.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Across all crises</p>
            </div>
          </CardContent>
        </Card>

        {currentUserId && (
          <Card className="border-2 border-primary/50 bg-primary/5">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">Your Rank</p>
                <p className="text-3xl font-bold text-primary">#{currentUserRank}</p>
                <p className="text-xs text-muted-foreground">of {donors.length} donors</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Top 3 Podium */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Top 3 Impact Leaders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topThreeDonors.map((donor, index) => {
              const medals = ["gold", "silver", "bronze"]
              const medal = medals[index] as keyof typeof MedalColors
              const medalIcons = { gold: "🥇", silver: "🥈", bronze: "🥉" }

              return (
                <div
                  key={donor.id}
                  className={`p-4 rounded-lg border-2 relative ${
                    index === 0
                      ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30"
                      : index === 1
                      ? "border-gray-400 bg-gray-50 dark:bg-gray-900/30"
                      : "border-orange-400 bg-orange-50 dark:bg-orange-950/30"
                  }`}
                >
                  {/* Medal */}
                  <div className="absolute -top-3 -right-3 text-3xl">{medalIcons[medal]}</div>

                  {/* Rank */}
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant="outline">{index + 1}</Badge>
                    {donor.isAnonymous && (
                      <Eye className="w-4 h-4 text-muted-foreground" />
                    )}
                  </div>

                  {/* Name */}
                  <p className="font-bold text-lg mb-2">
                    {donor.isAnonymous ? `Donor #${donor.id.slice(0, 5)}` : donor.name}
                  </p>

                  {/* Stats */}
                  <div className="space-y-1 text-sm mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Donated</span>
                      <span className="font-semibold">৳{(donor.totalDonated / 100000).toFixed(1)}L</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Families</span>
                      <span className="font-semibold">{donor.familiesHelped}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Crises</span>
                      <span className="font-semibold">{donor.crisesSolved}</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-1">
                    {donor.badges.slice(0, 3).map(badge => (
                      <span key={badge} title={badge} className="text-lg">
                        {BadgeIcons[badge] || "🎖️"}
                      </span>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Leaderboard Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle>Full Leaderboard</CardTitle>
              <CardDescription>Click to view donor profile</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant={anonymousOnly ? "default" : "outline"}
                onClick={() => setAnonymousOnly(!anonymousOnly)}
                className="gap-2"
              >
                {anonymousOnly ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                {anonymousOnly ? "All" : "Anonymous"}
              </Button>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <Button
              size="sm"
              variant={sortBy === "donated" ? "default" : "outline"}
              onClick={() => setSortBy("donated")}
              className="gap-1"
            >
              <Heart className="w-4 h-4" />
              Amount
            </Button>
            <Button
              size="sm"
              variant={sortBy === "families" ? "default" : "outline"}
              onClick={() => setSortBy("families")}
              className="gap-1"
            >
              <Users className="w-4 h-4" />
              Families
            </Button>
            <Button
              size="sm"
              variant={sortBy === "streak" ? "default" : "outline"}
              onClick={() => setSortBy("streak")}
              className="gap-1"
            >
              <Flame className="w-4 h-4" />
              Streak
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            {sortedDonors.map((donor, index) => {
              const isCurrentUser = donor.id === currentUserId
              const isFeatured = index < 3

              return (
                <div
                  key={donor.id}
                  className={`p-4 rounded-lg border flex items-center justify-between cursor-pointer transition-all hover:shadow-md ${
                    isCurrentUser
                      ? "border-primary bg-primary/5 border-2"
                      : isFeatured
                      ? "border-border/50 bg-slate-50/50 dark:bg-slate-900/30"
                      : "border-border/30"
                  }`}
                >
                  {/* Rank & Name */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-center min-w-fit">
                      {index === 0 && <Trophy className="w-5 h-5 text-yellow-500 mx-auto" />}
                      {index === 1 && <Medal className="w-5 h-5 text-gray-400 mx-auto" />}
                      {index === 2 && <Medal className="w-5 h-5 text-orange-600 mx-auto" />}
                      {index >= 3 && <span className="font-bold text-muted-foreground w-6">#{index + 1}</span>}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold truncate">
                          {donor.isAnonymous ? `Donor #${donor.id.slice(0, 5)}` : donor.name}
                        </p>
                        {donor.isAnonymous && <Eye className="w-3 h-3 text-muted-foreground shrink-0" />}
                        {isCurrentUser && (
                          <Badge variant="secondary" className="text-xs shrink-0">
                            You
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        {donor.rating && (
                          <>
                            <Star className="w-3 h-3 fill-current" />
                            <span>{donor.rating.toFixed(1)}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>Joined {new Date(donor.joinedDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="hidden md:grid grid-cols-4 gap-6 ml-4">
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Donated</p>
                      <p className="font-bold">৳{(donor.totalDonated / 100000).toFixed(1)}L</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Families</p>
                      <p className="font-bold text-green-600">{donor.familiesHelped}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Crises</p>
                      <p className="font-bold">{donor.crisesSolved}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">Streak</p>
                      <p className="font-bold text-orange-600">{donor.streak}d</p>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="hidden lg:flex gap-1 ml-4">
                    {donor.badges.map(badge => (
                      <span key={badge} title={badge} className="text-lg">
                        {BadgeIcons[badge] || "🎖️"}
                      </span>
                    ))}
                  </div>

                  {/* Share Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-2 shrink-0"
                    onClick={() => {
                      const text = `I'm supporting ${donor.name || "a donor"} who donated ৳${donor.totalDonated} to help ${donor.familiesHelped} families. Join us on Shurokkha!`
                      navigator.clipboard.writeText(text)
                    }}
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              )
            })}
          </div>

          {sortedDonors.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No donors found with current filters
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DonorLeaderboard
