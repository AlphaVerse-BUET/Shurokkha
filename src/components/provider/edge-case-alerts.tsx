"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  Clock,
  TrendingDown,
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import type { Provider } from "@/types"

interface ProviderEdgeCaseAlertsProps {
  provider: Provider
  activeBeneficiaries: number
  pendingApplications: number
  monthlyBudget: number
  monthlySpent: number
}

export function ProviderEdgeCaseAlerts({
  provider,
  activeBeneficiaries,
  pendingApplications,
  monthlyBudget,
  monthlySpent,
}: ProviderEdgeCaseAlertsProps) {
  // Calculate edge case conditions
  const capacityUtilization = (activeBeneficiaries / provider.maxActiveBeneficiaries) * 100
  const budgetUtilization = (monthlySpent / monthlyBudget) * 100
  const responseTime = 48 // hours - mock data
  const avgResponseTime = 24 // hours - mock data

  // Edge case flags
  const isNearCapacity = capacityUtilization >= 80
  const isOverCapacity = capacityUtilization >= 100
  const isBudgetCritical = budgetUtilization >= 90
  const hasSlowResponse = responseTime > avgResponseTime * 2
  const hasPendingBacklog = pendingApplications > 10

  const alerts = []

  if (isOverCapacity) {
    alerts.push({
      severity: "critical",
      icon: XCircle,
      title: "Capacity Exceeded",
      description: `You're at ${capacityUtilization.toFixed(0)}% capacity (${activeBeneficiaries}/${provider.maxActiveBeneficiaries}). Consider increasing capacity or completing existing cases.`,
      action: "Manage Capacity",
      actionType: "settings",
    })
  } else if (isNearCapacity) {
    alerts.push({
      severity: "warning",
      icon: AlertTriangle,
      title: "Approaching Capacity",
      description: `You're at ${capacityUtilization.toFixed(0)}% capacity (${activeBeneficiaries}/${provider.maxActiveBeneficiaries}). Plan ahead to avoid bottlenecks.`,
      action: "View Active Cases",
      actionType: "beneficiaries",
    })
  }

  if (isBudgetCritical) {
    alerts.push({
      severity: "critical",
      icon: DollarSign,
      title: "Budget Critical",
      description: `${budgetUtilization.toFixed(0)}% of monthly budget used. Only ৳${(monthlyBudget - monthlySpent).toLocaleString()} remaining this month.`,
      action: "View Analytics",
      actionType: "analytics",
    })
  }

  if (hasSlowResponse) {
    alerts.push({
      severity: "warning",
      icon: Clock,
      title: "Slow Response Time",
      description: `Average response time is ${responseTime}hrs, above your ${avgResponseTime}hr average. This may affect your trust score.`,
      action: "Review Applications",
      actionType: "beneficiaries",
    })
  }

  if (hasPendingBacklog) {
    alerts.push({
      severity: "info",
      icon: Users,
      title: "Pending Application Backlog",
      description: `You have ${pendingApplications} pending applications. Review them to maintain good response metrics.`,
      action: "Review Pending",
      actionType: "beneficiaries",
    })
  }

  // Performance degradation warning
  if (provider.trustScore < 70) {
    alerts.push({
      severity: "critical",
      icon: TrendingDown,
      title: "Low Trust Score",
      description: `Your trust score is ${provider.trustScore}/100. This may reduce donor confidence and allocation priority.`,
      action: "Improve Performance",
      actionType: "performance",
    })
  }

  // Success indicators
  if (provider.trustScore >= 90 && !isNearCapacity && !isBudgetCritical) {
    alerts.push({
      severity: "success",
      icon: CheckCircle,
      title: "Excellent Performance",
      description: `Trust score: ${provider.trustScore}/100. Capacity: ${capacityUtilization.toFixed(0)}%. Budget: ${budgetUtilization.toFixed(0)}%. Keep up the great work!`,
      action: "View Impact",
      actionType: "analytics",
    })
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
      case "warning":
        return "bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800"
      case "success":
        return "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
      default:
        return "bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
    }
  }

  const getSeverityIconColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "text-red-600 dark:text-red-400"
      case "warning":
        return "text-yellow-600 dark:text-yellow-400"
      case "success":
        return "text-green-600 dark:text-green-400"
      default:
        return "text-blue-600 dark:text-blue-400"
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600 text-white"
      case "warning":
        return "bg-yellow-600 text-white"
      case "success":
        return "bg-green-600 text-white"
      default:
        return "bg-blue-600 text-white"
    }
  }

  if (alerts.length === 0) return null

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          System Alerts & Notifications
        </CardTitle>
        <CardDescription>
          Important updates about your organization's operations
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {alerts.map((alert, index) => {
          const Icon = alert.icon
          return (
            <div
              key={index}
              className={`border rounded-lg p-4 ${getSeverityColor(alert.severity)}`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-6 w-6 shrink-0 mt-0.5 ${getSeverityIconColor(alert.severity)}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-base">{alert.title}</h4>
                    <Badge className={`${getSeverityBadge(alert.severity)} text-xs`}>
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
                  <Button size="sm" variant="outline">
                    {alert.action}
                  </Button>
                </div>
              </div>
            </div>
          )
        })}

        {/* Quick Stats Summary */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Capacity</p>
              <p className={`text-lg font-bold ${isOverCapacity ? 'text-red-600' : isNearCapacity ? 'text-yellow-600' : 'text-green-600'}`}>
                {capacityUtilization.toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Budget Used</p>
              <p className={`text-lg font-bold ${isBudgetCritical ? 'text-red-600' : budgetUtilization > 75 ? 'text-yellow-600' : 'text-green-600'}`}>
                {budgetUtilization.toFixed(0)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Pending</p>
              <p className={`text-lg font-bold ${hasPendingBacklog ? 'text-yellow-600' : 'text-green-600'}`}>
                {pendingApplications}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Trust Score</p>
              <p className={`text-lg font-bold ${provider.trustScore < 70 ? 'text-red-600' : provider.trustScore < 85 ? 'text-yellow-600' : 'text-green-600'}`}>
                {provider.trustScore}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
