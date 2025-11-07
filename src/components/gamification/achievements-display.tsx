"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Award, Lock, Unlock, Flame, Trophy, Zap } from "lucide-react"

interface Achievement {
  id: string
  name: string
  description: string
  icon: string
  color: string
  progress: number // 0-100
  maxProgress: number
  category: "donation" | "impact" | "consistency" | "social"
  tier?: "bronze" | "silver" | "gold" | "platinum"
  unlockedAt?: string
}

interface AchievementSystemProps {
  achievements: Achievement[]
  userRole: "donor" | "provider" | "beneficiary"
}

const CategoryInfo = {
  donation: { label: "Donation", icon: "💰", color: "from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900" },
  impact: { label: "Impact", icon: "🎯", color: "from-green-50 to-green-100 dark:from-green-950 dark:to-green-900" },
  consistency: { label: "Consistency", icon: "📅", color: "from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900" },
  social: { label: "Social", icon: "👥", color: "from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900" },
}

export function AchievementSystem({
  achievements,
  userRole,
}: AchievementSystemProps) {
  const categories = ["donation", "impact", "consistency", "social"] as const

  const unlockedCount = useMemo(() => achievements.filter(a => a.unlockedAt).length, [achievements])
  const totalCount = achievements.length
  const unlockedPercentage = Math.round((unlockedCount / totalCount) * 100)

  const groupedByCategory = useMemo(() => {
    const grouped: Record<string, Achievement[]> = {
      donation: [],
      impact: [],
      consistency: [],
      social: [],
    }
    achievements.forEach(a => {
      grouped[a.category].push(a)
    })
    return grouped
  }, [achievements])

  const getTierColor = (tier?: string) => {
    switch (tier) {
      case "platinum":
        return "from-purple-400 to-pink-400"
      case "gold":
        return "from-yellow-400 to-orange-400"
      case "silver":
        return "from-gray-300 to-gray-400"
      case "bronze":
        return "from-orange-700 to-orange-600"
      default:
        return "from-slate-300 to-slate-400"
    }
  }

  const getTierEmoji = (tier?: string) => {
    switch (tier) {
      case "platinum":
        return "💎"
      case "gold":
        return "🏆"
      case "silver":
        return "🥈"
      case "bronze":
        return "🥉"
      default:
        return "🎖️"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Achievement Progress
          </CardTitle>
          <CardDescription>
            Unlock achievements by completing milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">{unlockedCount} of {totalCount} Unlocked</span>
                <span className="text-sm text-muted-foreground">{unlockedPercentage}%</span>
              </div>
              <Progress value={unlockedPercentage} className="h-3" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {categories.map(cat => {
                const catAchievements = groupedByCategory[cat]
                const unlockedInCat = catAchievements.filter(a => a.unlockedAt).length
                const total = catAchievements.length

                return (
                  <div
                    key={cat}
                    className={`p-3 rounded-lg bg-linear-to-br ${CategoryInfo[cat].color} border border-border/50`}
                  >
                    <p className="text-lg font-bold mb-1">{CategoryInfo[cat].icon}</p>
                    <p className="font-semibold text-sm">{CategoryInfo[cat].label}</p>
                    <p className="text-xs text-muted-foreground">
                      {unlockedInCat}/{total} unlocked
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements Grid */}
      <Card>
        <CardHeader>
          <CardTitle>All Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="donation" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              {categories.map(cat => (
                <TabsTrigger key={cat} value={cat} className="text-xs">
                  {CategoryInfo[cat].icon}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map(cat => (
              <TabsContent key={cat} value={cat} className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedByCategory[cat].map(achievement => {
                    const isUnlocked = !!achievement.unlockedAt
                    const progressPercent = (achievement.progress / achievement.maxProgress) * 100

                    return (
                      <div
                        key={achievement.id}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isUnlocked
                            ? "border-yellow-300 bg-yellow-50 dark:bg-yellow-950/30 shadow-md"
                            : "border-border/50 bg-slate-50 dark:bg-slate-900/30 opacity-75"
                        }`}
                      >
                        {/* Badge */}
                        <div className="flex items-start justify-between mb-3">
                          <div className={`text-4xl p-2 rounded-lg bg-linear-to-br ${getTierColor(achievement.tier)}`}>
                            {achievement.icon}
                          </div>
                          <div className="text-right">
                            {isUnlocked ? (
                              <Unlock className="w-5 h-5 text-green-600" />
                            ) : (
                              <Lock className="w-5 h-5 text-muted-foreground" />
                            )}
                            {achievement.tier && (
                              <span className="text-2xl ml-1">{getTierEmoji(achievement.tier)}</span>
                            )}
                          </div>
                        </div>

                        {/* Title & Description */}
                        <div className="mb-3">
                          <p className="font-bold text-sm">{achievement.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {achievement.description}
                          </p>
                        </div>

                        {/* Progress */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              {achievement.progress} / {achievement.maxProgress}
                            </span>
                            {isUnlocked && (
                              <Badge variant="secondary" className="text-xs">
                                Unlocked {achievement.unlockedAt}
                              </Badge>
                            )}
                          </div>
                          <Progress value={progressPercent} className="h-2" />
                        </div>

                        {/* Reward Hint */}
                        {!isUnlocked && progressPercent > 0 && (
                          <div className="mt-2 pt-2 border-t border-border/30">
                            <p className="text-xs text-primary font-semibold">
                              Keep going! {Math.round(100 - progressPercent)}% remaining
                            </p>
                          </div>
                        )}

                        {isUnlocked && (
                          <div className="mt-2 pt-2 border-t border-yellow-200 dark:border-yellow-800">
                            <p className="text-xs text-yellow-700 dark:text-yellow-300 font-semibold flex items-center gap-1">
                              <Trophy className="w-3 h-3" />
                              Achievement Unlocked!
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {groupedByCategory[cat].length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No achievements in this category yet
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* How to Unlock */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            How to Unlock Achievements
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <p className="font-semibold text-sm flex items-center gap-2 mb-1">
                <span>💰</span>
                Donation Achievements
              </p>
              <p className="text-sm text-muted-foreground">
                Unlock by reaching donation milestones: ৳10K, ৳100K, ৳1Lakh, ৳10Lakh
              </p>
            </div>

            <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
              <p className="font-semibold text-sm flex items-center gap-2 mb-1">
                <span>🎯</span>
                Impact Achievements
              </p>
              <p className="text-sm text-muted-foreground">
                Unlock by helping families: 10, 50, 100, 500+ families reached
              </p>
            </div>

            <div className="p-3 rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800">
              <p className="font-semibold text-sm flex items-center gap-2 mb-1">
                <span>📅</span>
                Consistency Achievements
              </p>
              <p className="text-sm text-muted-foreground">
                Unlock by maintaining donation streaks: 7 days, 30 days, 90 days, 365 days
              </p>
            </div>

            <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800">
              <p className="font-semibold text-sm flex items-center gap-2 mb-1">
                <span>👥</span>
                Social Achievements
              </p>
              <p className="text-sm text-muted-foreground">
                Unlock by community engagement: Refer friends, join challenges, appear on leaderboard
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default AchievementSystem
