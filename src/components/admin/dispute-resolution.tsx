"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertTriangle,
  Shield,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  FileText,
} from "lucide-react"
import { useCurrency } from "@/hooks/use-currency"

interface Dispute {
  id: string
  type: "fraud-allegation" | "fund-misuse" | "verification-issue" | "provider-complaint" | "donor-refund"
  severity: "low" | "medium" | "high" | "critical"
  reportedBy: string
  reportedAgainst: string
  amount?: number
  description: string
  status: "pending" | "investigating" | "resolved" | "escalated"
  createdAt: string
  evidenceCount: number
}

interface AdminDisputeResolutionProps {
  disputes: Dispute[]
}

export function AdminDisputeResolution({ disputes }: AdminDisputeResolutionProps) {
  const currency = useCurrency()

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600 text-white"
      case "high":
        return "bg-orange-600 text-white"
      case "medium":
        return "bg-yellow-600 text-white"
      default:
        return "bg-blue-600 text-white"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300"
      case "investigating":
        return "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300"
      case "escalated":
        return "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-300"
      default:
        return "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 border-yellow-300"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "fraud-allegation":
        return AlertTriangle
      case "fund-misuse":
        return Ban
      case "verification-issue":
        return Shield
      case "provider-complaint":
        return MessageSquare
      case "donor-refund":
        return FileText
      default:
        return AlertTriangle
    }
  }

  const pendingCount = disputes.filter((d) => d.status === "pending").length
  const criticalCount = disputes.filter((d) => d.severity === "critical").length
  const escalatedCount = disputes.filter((d) => d.status === "escalated").length

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Dispute Resolution Center
          </div>
          <div className="flex gap-2">
            {criticalCount > 0 && (
              <Badge className="bg-red-600 text-white">
                {criticalCount} Critical
              </Badge>
            )}
            {escalatedCount > 0 && (
              <Badge className="bg-orange-600 text-white">
                {escalatedCount} Escalated
              </Badge>
            )}
          </div>
        </CardTitle>
        <CardDescription>
          Review and resolve disputes, fraud allegations, and complaints
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Pending Review</p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">{pendingCount}</p>
          </div>
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Critical Issues</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-400">{criticalCount}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Investigating</p>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">
              {disputes.filter((d) => d.status === "investigating").length}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-950 border border-green-200 rounded-lg p-3">
            <p className="text-xs text-muted-foreground mb-1">Resolved (30d)</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-400">
              {disputes.filter((d) => d.status === "resolved").length}
            </p>
          </div>
        </div>

        {/* Disputes List */}
        <div className="space-y-3">
          {disputes.length === 0 ? (
            <div className="text-center py-12 bg-muted/30 rounded-lg">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
              <p className="text-muted-foreground">No active disputes. Great work!</p>
            </div>
          ) : (
            disputes.map((dispute) => {
              const TypeIcon = getTypeIcon(dispute.type)
              return (
                <div
                  key={dispute.id}
                  className="border rounded-lg p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <TypeIcon className="h-5 w-5 text-accent" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-sm">
                              {dispute.type.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}
                            </h4>
                            <Badge className={getSeverityColor(dispute.severity)}>
                              {dispute.severity.toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1">
                            Reported by {dispute.reportedBy} against {dispute.reportedAgainst}
                          </p>
                        </div>
                        <Badge variant="outline" className={`shrink-0 ${getStatusColor(dispute.status)}`}>
                          {dispute.status === "pending" && <Clock className="h-3 w-3 mr-1" />}
                          {dispute.status === "investigating" && <Shield className="h-3 w-3 mr-1" />}
                          {dispute.status === "resolved" && <CheckCircle className="h-3 w-3 mr-1" />}
                          {dispute.status === "escalated" && <AlertTriangle className="h-3 w-3 mr-1" />}
                          {dispute.status.toUpperCase()}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {dispute.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {dispute.evidenceCount} evidence files
                          </span>
                          <span>
                            {new Date(dispute.createdAt).toLocaleDateString()}
                          </span>
                          {dispute.amount && (
                            <span className="font-semibold text-red-600">
                              Amount: {currency.format(dispute.amount)}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {dispute.status === "pending" && (
                            <>
                              <Button size="sm" variant="outline">
                                Review Evidence
                              </Button>
                              <Button size="sm" className="bg-blue-600">
                                Start Investigation
                              </Button>
                            </>
                          )}
                          {dispute.status === "investigating" && (
                            <>
                              <Button size="sm" variant="outline" className="text-red-600">
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                              <Button size="sm" className="bg-green-600">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Resolve
                              </Button>
                            </>
                          )}
                          {dispute.status === "escalated" && (
                            <Button size="sm" className="bg-red-600">
                              <Ban className="h-4 w-4 mr-1" />
                              Take Action
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Quick Actions */}
        {disputes.length > 0 && (
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" size="sm">
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              Filter by Severity
            </Button>
            <Button variant="outline" size="sm">
              View Analytics
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
