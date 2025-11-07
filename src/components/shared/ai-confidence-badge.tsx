"use client"

import { Badge } from "@/components/ui/badge"
import { Shield, AlertTriangle, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface AIConfidenceBadgeProps {
  score: number // 0-100
  status?: "verifying" | "verified" | "flagged" | "rejected"
  checks?: {
    name: string
    passed: boolean
    confidence?: number
  }[]
  className?: string
  showDetails?: boolean
}

export function AIConfidenceBadge({
  score,
  status = "verified",
  checks,
  className = "",
  showDetails = false,
}: AIConfidenceBadgeProps) {
  const [expanded, setExpanded] = useState(false)

  const getStatusConfig = () => {
    if (status === "verifying") {
      return {
        icon: Loader2,
        label: "AI Verifying...",
        color: "bg-blue-500",
        textColor: "text-white",
        animate: "animate-spin",
      }
    }

    if (status === "rejected" || score < 50) {
      return {
        icon: XCircle,
        label: "AI Rejected",
        color: "bg-red-500",
        textColor: "text-white",
      }
    }

    if (status === "flagged" || score < 75) {
      return {
        icon: AlertTriangle,
        label: "AI Flagged",
        color: "bg-yellow-500",
        textColor: "text-white",
      }
    }

    return {
      icon: CheckCircle,
      label: "AI Verified",
      color: "bg-green-500",
      textColor: "text-white",
    }
  }

  const config = getStatusConfig()
  const Icon = config.icon

  const badge = (
    <Badge
      className={`${config.color} ${config.textColor} gap-1 ${className} ${checks && checks.length > 0 ? "cursor-pointer" : ""}`}
      onClick={() => checks && checks.length > 0 && setExpanded(!expanded)}
    >
      <Icon className={`h-3 w-3 ${config.animate || ""}`} />
      {config.label}
      <span className="text-xs opacity-90">({score}%)</span>
    </Badge>
  )

  if (!showDetails || !checks || checks.length === 0) {
    return badge
  }

  return (
    <div className="relative inline-block">
      {badge}
      {expanded && (
        <Card className="absolute top-full left-0 mt-2 z-50 w-64 shadow-lg">
          <CardContent className="p-3">
            <div className="space-y-2 text-xs">
              <div className="font-semibold flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4" />
                AI Verification Checks
              </div>
              {checks.map((check, idx) => (
                <div key={idx} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {check.passed ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500" />
                    )}
                    <span>{check.name}</span>
                  </div>
                  {check.confidence !== undefined && (
                    <span className="text-muted-foreground">{check.confidence}%</span>
                  )}
                </div>
              ))}
              <div className="pt-2 border-t mt-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Overall:</span>
                  <span className={score >= 75 ? "text-green-500" : score >= 50 ? "text-yellow-500" : "text-red-500"}>
                    {score}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

interface AIFraudAlertProps {
  alerts: {
    type: string
    severity: "critical" | "high" | "medium" | "low"
    description: string
    evidence?: string[]
  }[]
  className?: string
}

export function AIFraudAlert({ alerts, className = "" }: AIFraudAlertProps) {
  if (alerts.length === 0) {
    return (
      <div className={`flex items-center gap-2 text-green-600 dark:text-green-400 text-sm ${className}`}>
        <CheckCircle className="h-4 w-4" />
        <span>No fraud patterns detected</span>
      </div>
    )
  }

  const getSeverityColor = (severity: string) => {
    const colors = {
      critical: "bg-red-100 dark:bg-red-950 border-red-500 text-red-800 dark:text-red-200",
      high: "bg-orange-100 dark:bg-orange-950 border-orange-500 text-orange-800 dark:text-orange-200",
      medium: "bg-yellow-100 dark:bg-yellow-950 border-yellow-500 text-yellow-800 dark:text-yellow-200",
      low: "bg-blue-100 dark:bg-blue-950 border-blue-500 text-blue-800 dark:text-blue-200",
    }
    return colors[severity as keyof typeof colors] || colors.low
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {alerts.map((alert, idx) => (
        <div key={idx} className={`p-3 border-l-4 rounded ${getSeverityColor(alert.severity)}`}>
          <div className="flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm">{alert.type.replace(/_/g, " ").toUpperCase()}</p>
              <p className="text-xs mt-1">{alert.description}</p>
              {alert.evidence && alert.evidence.length > 0 && (
                <ul className="text-xs mt-2 space-y-1 opacity-80">
                  {alert.evidence.map((evidence, eidx) => (
                    <li key={eidx}>• {evidence}</li>
                  ))}
                </ul>
              )}
            </div>
            <Badge variant="outline" className="text-xs shrink-0">
              {alert.severity}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}
