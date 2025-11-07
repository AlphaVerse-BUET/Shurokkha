"use client"

import { useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Zap,
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
  AlertTriangle,
  Trophy,
  Lightbulb,
  BarChart3,
  ArrowUp,
} from "lucide-react"

interface ProviderMetrics {
  trustScore: number
  completionRate: number
  averageResponseTime: number // in hours
  averageRating: number
  activeBeneficiaries: number
  maxCapacity: number
  fraudIncidents: number
  totalAided: number
  yearsActive: number
}

interface ImprovementTip {
  id: string
  category: "speed" | "quality" | "capacity" | "efficiency"
  title: string
  description: string
  impact: string
  potentialScoreIncrease: number
  actionable: boolean
  priority: "high" | "medium" | "low"
}

interface ProviderPerformanceOptimizerProps {
  providerName: string
  metrics: ProviderMetrics
}

export function ProviderPerformanceOptimizer({
  providerName,
  metrics,
}: ProviderPerformanceOptimizerProps) {
  // Generate AI insights and tips
  const insights = useMemo(() => {
    const tips: ImprovementTip[] = []

    // Response time insights
    if (metrics.averageResponseTime > 6) {
      tips.push({
        id: "tip-1",
        category: "speed",
        title: "Reduce Response Time",
        description: `Your average response time is ${metrics.averageResponseTime.toFixed(1)} hours. Top performers respond within 4 hours.`,
        impact: "Improve trust score by 5-8 points",
        potentialScoreIncrease: 6,
        actionable: true,
        priority: "high",
      })
    }

    // Completion rate insights
    if (metrics.completionRate < 95) {
      tips.push({
        id: "tip-2",
        category: "quality",
        title: "Increase Completion Rate",
        description: `Current completion rate is ${metrics.completionRate}%. Aim for 95%+ to join top performers.`,
        impact: "Improve trust score by 3-5 points",
        potentialScoreIncrease: 4,
        actionable: true,
        priority: "high",
      })
    }

    // Capacity utilization
    const utilizationRate = (metrics.activeBeneficiaries / metrics.maxCapacity) * 100
    if (utilizationRate < 70) {
      tips.push({
        id: "tip-3",
        category: "capacity",
        title: "Optimize Capacity Utilization",
        description: `You're serving ${metrics.activeBeneficiaries} of ${metrics.maxCapacity} capacity (${utilizationRate.toFixed(0)}%). You can handle ${metrics.maxCapacity - metrics.activeBeneficiaries} more beneficiaries.`,
        impact: "Increase impact and visibility",
        potentialScoreIncrease: 0,
        actionable: true,
        priority: "medium",
      })
    }

    // Rating insights
    if (metrics.averageRating < 4.5) {
      tips.push({
        id: "tip-4",
        category: "quality",
        title: "Improve Beneficiary Satisfaction",
        description: `Current rating is ${metrics.averageRating.toFixed(1)}/5. Focus on communication and follow-up to reach 4.5+.`,
        impact: "Improve trust score by 4-6 points",
        potentialScoreIncrease: 5,
        actionable: true,
        priority: "high",
      })
    }

    // Efficiency insights
    if (metrics.averageResponseTime < 8 && metrics.completionRate > 90) {
      tips.push({
        id: "tip-5",
        category: "efficiency",
        title: "You're Performing Excellently!",
        description: "Maintain your current practices. Consider mentoring newer providers.",
        impact: "Build reputation as top-tier provider",
        potentialScoreIncrease: 2,
        actionable: false,
        priority: "low",
      })
    }

    // Fraud prevention
    if (metrics.fraudIncidents === 0 && metrics.totalAided > 50) {
      tips.push({
        id: "tip-6",
        category: "quality",
        title: "Maintain Zero-Fraud Record",
        description: "Your zero-fraud record is excellent. Continue thorough verification processes.",
        impact: "Maintain fraud bonus of 15 points",
        potentialScoreIncrease: 0,
        actionable: false,
        priority: "medium",
      })
    }

    return tips.sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }, [metrics])

  // Calculate potential score
  const potentialScore = useMemo(() => {
    const actionableTips = insights.filter((t) => t.actionable)
    const totalIncrease = actionableTips.reduce((sum, t) => sum + t.potentialScoreIncrease, 0)
    return Math.min(100, metrics.trustScore + totalIncrease)
  }, [insights, metrics.trustScore])

  // Benchmark comparison
  const benchmarks = {
    responseTime: { target: 4, top10: 2, average: 8 },
    completionRate: { target: 95, top10: 98, average: 85 },
    rating: { target: 4.5, top10: 4.8, average: 4.0 },
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "speed":
        return Clock
      case "quality":
        return CheckCircle
      case "capacity":
        return Target
      case "efficiency":
        return Zap
      default:
        return Lightbulb
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "speed":
        return "text-blue-600 bg-blue-50 border-blue-200"
      case "quality":
        return "text-green-600 bg-green-50 border-green-200"
      case "capacity":
        return "text-purple-600 bg-purple-50 border-purple-200"
      case "efficiency":
        return "text-orange-600 bg-orange-50 border-orange-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-600"
      case "medium":
        return "bg-orange-600"
      default:
        return "bg-green-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* AI Coach Header */}
      <Card className="border-2 border-blue-200 dark:border-blue-900 bg-linear-to-br from-blue-50/50 to-transparent dark:from-blue-950/20">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Zap className="w-6 h-6 text-blue-500" />
                AI Performance Coach
              </CardTitle>
              <CardDescription>
                Personalized insights to improve {providerName}'s performance
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {insights.filter((i) => i.actionable).length} Action Items
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Current vs Potential Score */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border-2">
              <p className="text-sm text-muted-foreground mb-1">Current Trust Score</p>
              <div className="flex items-end gap-2">
                <p className="text-4xl font-bold">{metrics.trustScore}</p>
                <p className="text-muted-foreground mb-1">/100</p>
              </div>
              <Progress value={metrics.trustScore} className="h-2 mt-2" />
            </div>

            <div className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-4 rounded-lg border-2 border-green-200">
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                Potential Trust Score
              </p>
              <div className="flex items-end gap-2">
                <p className="text-4xl font-bold text-green-700">{potentialScore}</p>
                <p className="text-muted-foreground mb-1">/100</p>
                <Badge className="bg-green-600 mb-1">+{potentialScore - metrics.trustScore}</Badge>
              </div>
              <Progress value={potentialScore} className="h-2 mt-2" />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border text-center">
              <Clock className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <p className="text-lg font-bold">{metrics.averageResponseTime.toFixed(1)}h</p>
              <p className="text-xs text-muted-foreground">Avg Response</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border text-center">
              <CheckCircle className="w-4 h-4 text-green-600 mx-auto mb-1" />
              <p className="text-lg font-bold">{metrics.completionRate}%</p>
              <p className="text-xs text-muted-foreground">Completion</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border text-center">
              <Trophy className="w-4 h-4 text-yellow-600 mx-auto mb-1" />
              <p className="text-lg font-bold">{metrics.averageRating.toFixed(1)}</p>
              <p className="text-xs text-muted-foreground">Avg Rating</p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border text-center">
              <Target className="w-4 h-4 text-purple-600 mx-auto mb-1" />
              <p className="text-lg font-bold">{metrics.activeBeneficiaries}/{metrics.maxCapacity}</p>
              <p className="text-xs text-muted-foreground">Capacity</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <div className="space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-600" />
          Personalized Improvement Tips
        </h3>

        {insights.map((tip) => {
          const Icon = getCategoryIcon(tip.category)
          return (
            <Card key={tip.id} className={`border-2 ${getCategoryColor(tip.category)}`}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold">{tip.title}</h4>
                          <Badge className={getPriorityBadge(tip.priority)}>
                            {tip.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{tip.description}</p>
                      </div>
                    </div>

                    {tip.potentialScoreIncrease > 0 && (
                      <div className="text-right">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          <ArrowUp className="w-3 h-3 mr-1" />
                          +{tip.potentialScoreIncrease} pts
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Impact */}
                  <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border">
                    <p className="text-sm font-medium text-green-700 dark:text-green-400">
                      💡 Impact: {tip.impact}
                    </p>
                  </div>

                  {/* Action Button */}
                  {tip.actionable && (
                    <Button size="sm" className="w-full">
                      Create Action Plan
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Benchmark Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Benchmark Comparison
          </CardTitle>
          <CardDescription>See how you compare to other providers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Response Time */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm">Response Time</p>
              <p className="text-sm text-muted-foreground">
                {metrics.averageResponseTime.toFixed(1)} hours
              </p>
            </div>
            <div className="relative">
              <div className="h-8 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded-full opacity-20" />
              <div
                className="absolute top-1 h-6 w-2 bg-blue-600 rounded-full"
                style={{
                  left: `${Math.min(100, (metrics.averageResponseTime / 12) * 100)}%`,
                }}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Top 10%: {benchmarks.responseTime.top10}h</span>
                <span>Target: {benchmarks.responseTime.target}h</span>
                <span>Average: {benchmarks.responseTime.average}h</span>
              </div>
            </div>
          </div>

          {/* Completion Rate */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm">Completion Rate</p>
              <p className="text-sm text-muted-foreground">{metrics.completionRate}%</p>
            </div>
            <div className="relative">
              <div className="h-8 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full opacity-20" />
              <div
                className="absolute top-1 h-6 w-2 bg-blue-600 rounded-full"
                style={{ left: `${metrics.completionRate}%` }}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Average: {benchmarks.completionRate.average}%</span>
                <span>Target: {benchmarks.completionRate.target}%</span>
                <span>Top 10%: {benchmarks.completionRate.top10}%</span>
              </div>
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <p className="font-medium text-sm">Average Rating</p>
              <p className="text-sm text-muted-foreground">
                {metrics.averageRating.toFixed(1)}/5.0
              </p>
            </div>
            <div className="relative">
              <div className="h-8 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full opacity-20" />
              <div
                className="absolute top-1 h-6 w-2 bg-blue-600 rounded-full"
                style={{ left: `${(metrics.averageRating / 5) * 100}%` }}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Average: {benchmarks.rating.average}</span>
                <span>Target: {benchmarks.rating.target}</span>
                <span>Top 10%: {benchmarks.rating.top10}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Summary */}
      <Card className="bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold mb-2">Next Steps to Reach {potentialScore} Score</h4>
              <ul className="space-y-2 text-sm">
                {insights
                  .filter((i) => i.actionable && i.priority === "high")
                  .map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-purple-600 shrink-0">•</span>
                      <span>{tip.title}</span>
                    </li>
                  ))}
              </ul>
              <Button className="mt-4" size="sm">
                Generate Performance Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProviderPerformanceOptimizer
