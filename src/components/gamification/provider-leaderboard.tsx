"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  Trophy,
  Zap,
  Users,
  Target,
  Medal,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface Provider {
  id: string
  name: string
  trustScore: number
  completionRate: number
  averageRating: number
  responseTimeHours: number
  totalDistributions: number
  familiesServed: number
  fraudIncidents: number
  yearsActive: number
  specializations: string[]
  division: string
  status: "active" | "watchlist" | "suspended"
}

interface ProviderLeaderboardProps {
  providers: Provider[]
  sortBy?: "trust" | "completion" | "rating" | "response"
}

export function ProviderLeaderboard({
  providers,
  sortBy: defaultSort = "trust",
}: ProviderLeaderboardProps) {
  const [sortBy, setSortBy] = useState(defaultSort)
  const [filterDivision, setFilterDivision] = useState<string | null>(null)

  const sortedProviders = useMemo(() => {
    let filtered = [...providers]

    if (filterDivision) {
      filtered = filtered.filter(p => p.division === filterDivision)
    }

    // Filter out suspended
    filtered = filtered.filter(p => p.status !== "suspended")

    return filtered.sort((a, b) => {
      switch (sortBy) {
        case "completion":
          return b.completionRate - a.completionRate
        case "rating":
          return b.averageRating - a.averageRating
        case "response":
          return a.responseTimeHours - b.responseTimeHours
        case "trust":
        default:
          return b.trustScore - a.trustScore
      }
    })
  }, [providers, sortBy, filterDivision])

  const divisions = useMemo(() => {
    return Array.from(new Set(providers.map(p => p.division)))
  }, [providers])

  const topProviders = sortedProviders.slice(0, 3)
  const avgTrustScore = (providers.reduce((sum, p) => sum + p.trustScore, 0) / providers.length).toFixed(1)
  const totalFamiliesServed = providers.reduce((sum, p) => sum + p.familiesServed, 0)
  const activeProviders = providers.filter(p => p.status === "active").length

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Active Providers</p>
              <p className="text-3xl font-bold text-primary">{activeProviders}</p>
              <p className="text-xs text-muted-foreground">Verified & trusted</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Avg Trust Score</p>
              <p className="text-3xl font-bold text-blue-600">{avgTrustScore}</p>
              <p className="text-xs text-muted-foreground">Out of 100</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Families Served</p>
              <p className="text-3xl font-bold text-green-600">{totalFamiliesServed.toLocaleString()}</p>
              <p className="text-xs text-muted-foreground">Across all providers</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Avg Completion</p>
              <p className="text-3xl font-bold text-orange-600">
                {(providers.reduce((sum, p) => sum + p.completionRate, 0) / providers.length * 100).toFixed(0)}%
              </p>
              <p className="text-xs text-muted-foreground">Success rate</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top 3 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Top Performing Providers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topProviders.map((provider, index) => {
              const medals = ["🥇", "🥈", "🥉"]

              return (
                <div
                  key={provider.id}
                  className={`p-4 rounded-lg border-2 relative ${
                    index === 0
                      ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-950/30"
                      : index === 1
                      ? "border-gray-400 bg-gray-50 dark:bg-gray-900/30"
                      : "border-orange-400 bg-orange-50 dark:bg-orange-950/30"
                  }`}
                >
                  {/* Medal */}
                  <div className="absolute -top-3 -right-3 text-3xl">{medals[index]}</div>

                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <Badge variant="outline">{index + 1}</Badge>
                      <p className="font-bold text-lg mt-2">{provider.name}</p>
                      <p className="text-xs text-muted-foreground">{provider.division}</p>
                    </div>
                    <Badge variant={provider.status === "active" ? "secondary" : "destructive"}>
                      {provider.status}
                    </Badge>
                  </div>

                  {/* Trust Score */}
                  <div className="mb-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold">Trust Score</span>
                      <span className="text-lg font-bold">{provider.trustScore}/100</span>
                    </div>
                    <Progress value={provider.trustScore} className="h-2" />
                  </div>

                  {/* Key Metrics */}
                  <div className="space-y-1 text-sm mb-3">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Completion</span>
                      <span className="font-semibold text-green-600">{(provider.completionRate * 100).toFixed(0)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Rating</span>
                      <span className="font-semibold">{provider.averageRating.toFixed(1)}⭐</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Response</span>
                      <span className="font-semibold">{provider.responseTimeHours}h</span>
                    </div>
                  </div>

                  {/* Impact */}
                  <div className="pt-3 border-t border-border/30 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <p className="text-muted-foreground">Distributions</p>
                      <p className="font-bold">{provider.totalDistributions}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Families</p>
                      <p className="font-bold text-green-600">{provider.familiesServed}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Years</p>
                      <p className="font-bold">{provider.yearsActive}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Providers</CardTitle>
            <div className="flex gap-2 flex-wrap">
              <Button
                size="sm"
                variant={sortBy === "trust" ? "default" : "outline"}
                onClick={() => setSortBy("trust")}
                className="gap-1"
              >
                <Zap className="w-4 h-4" />
                Trust
              </Button>
              <Button
                size="sm"
                variant={sortBy === "completion" ? "default" : "outline"}
                onClick={() => setSortBy("completion")}
                className="gap-1"
              >
                <CheckCircle className="w-4 h-4" />
                Completion
              </Button>
              <Button
                size="sm"
                variant={sortBy === "rating" ? "default" : "outline"}
                onClick={() => setSortBy("rating")}
                className="gap-1"
              >
                ⭐ Rating
              </Button>
              <Button
                size="sm"
                variant={sortBy === "response" ? "default" : "outline"}
                onClick={() => setSortBy("response")}
                className="gap-1"
              >
                <Zap className="w-4 h-4" />
                Speed
              </Button>
            </div>
          </div>

          {/* Division Filter */}
          <div className="mt-4 flex gap-2 flex-wrap">
            <Button
              size="sm"
              variant={filterDivision === null ? "default" : "outline"}
              onClick={() => setFilterDivision(null)}
            >
              All Divisions
            </Button>
            {divisions.map(div => (
              <Button
                key={div}
                size="sm"
                variant={filterDivision === div ? "default" : "outline"}
                onClick={() => setFilterDivision(div)}
              >
                {div}
              </Button>
            ))}
          </div>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            {sortedProviders.map((provider, index) => (
              <div
                key={provider.id}
                className="p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-all cursor-pointer hover:shadow-md"
              >
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="text-center min-w-fit">
                      {index === 0 && <Trophy className="w-5 h-5 text-yellow-500" />}
                      {index === 1 && <Medal className="w-5 h-5 text-gray-400" />}
                      {index === 2 && <Medal className="w-5 h-5 text-orange-600" />}
                      {index >= 3 && <span className="font-bold text-muted-foreground">#{index + 1}</span>}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold">{provider.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {provider.division}
                        </Badge>
                        {provider.status === "watchlist" && (
                          <Badge variant="secondary" className="text-xs flex gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Watchlist
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2 text-xs text-muted-foreground">
                        <span>{provider.yearsActive} years active</span>
                        <span>•</span>
                        <span>{provider.specializations.join(", ")}</span>
                      </div>
                    </div>
                  </div>

                  <Badge variant="default" className="text-lg px-3 py-1 shrink-0">
                    {provider.trustScore}
                  </Badge>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Completion</p>
                    <div className="flex items-baseline gap-1">
                      <span className="font-bold">{(provider.completionRate * 100).toFixed(0)}%</span>
                    </div>
                    <Progress value={provider.completionRate * 100} className="h-1 mt-1" />
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Rating</p>
                    <div className="font-bold">{provider.averageRating.toFixed(1)}⭐</div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Response</p>
                    <div className="font-bold">{provider.responseTimeHours}h</div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Families</p>
                    <div className="font-bold text-green-600">{provider.familiesServed}</div>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">Distributions</p>
                    <div className="font-bold">{provider.totalDistributions}</div>
                  </div>
                </div>

                {/* Fraud Status */}
                {provider.fraudIncidents > 0 && (
                  <div className="pt-2 border-t border-border/30">
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {provider.fraudIncidents} fraud incident{provider.fraudIncidents > 1 ? "s" : ""} on record
                    </p>
                  </div>
                )}
              </div>
            ))}

            {sortedProviders.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No providers found with current filters
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProviderLeaderboard
