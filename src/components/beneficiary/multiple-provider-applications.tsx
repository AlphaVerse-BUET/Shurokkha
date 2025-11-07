"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  Star,
  Building2,
  Calendar,
  TrendingUp,
} from "lucide-react"
import type { Beneficiary, Provider } from "@/types"
import { formatCurrency } from "@/lib/currency-formatter"
import { useAppStore } from "@/store/app-store"

interface MultipleProviderApplicationsProps {
  beneficiary: Beneficiary
  providers: Provider[]
}

export function MultipleProviderApplications({
  beneficiary,
  providers,
}: MultipleProviderApplicationsProps) {
  const { currencyUnit } = useAppStore()

  if (!beneficiary.providerApplications || beneficiary.providerApplications.length === 0) {
    return null
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      completed: {
        icon: CheckCircle,
        label: "Completed",
        color: "bg-green-500 text-white",
        bgColor: "bg-green-50 dark:bg-green-950 border-green-200",
      },
      "in-progress": {
        icon: Clock,
        label: "In Progress",
        color: "bg-blue-500 text-white",
        bgColor: "bg-blue-50 dark:bg-blue-950 border-blue-200",
      },
      accepted: {
        icon: TrendingUp,
        label: "Accepted",
        color: "bg-purple-500 text-white",
        bgColor: "bg-purple-50 dark:bg-purple-950 border-purple-200",
      },
      rejected: {
        icon: XCircle,
        label: "Rejected",
        color: "bg-red-500 text-white",
        bgColor: "bg-red-50 dark:bg-red-950 border-red-200",
      },
      applied: {
        icon: AlertCircle,
        label: "Applied",
        color: "bg-yellow-500 text-white",
        bgColor: "bg-yellow-50 dark:bg-yellow-950 border-yellow-200",
      },
    }
    return configs[status as keyof typeof configs] || configs.applied
  }

  const sortedApplications = [...beneficiary.providerApplications].sort((a, b) => {
    const priority = { "in-progress": 0, accepted: 1, applied: 2, completed: 3, rejected: 4 }
    return (
      (priority[a.status as keyof typeof priority] || 5) -
      (priority[b.status as keyof typeof priority] || 5)
    )
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Provider Applications ({beneficiary.providerApplications.length})
        </CardTitle>
        <CardDescription>
          Track your applications to different providers
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedApplications.map((app, index) => {
          const provider = providers.find((p) => p.id === app.providerId)
          const statusConfig = getStatusConfig(app.status)
          const Icon = statusConfig.icon

          return (
            <div
              key={`${app.providerId}-${index}`}
              className={`border rounded-lg p-4 ${statusConfig.bgColor}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="h-12 w-12 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                    <Building2 className="h-6 w-6 text-accent" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-base line-clamp-1">
                      {provider?.organizationName || "Unknown Provider"}
                    </h4>
                    {provider && (
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          Trust: {provider.trustScore}/100
                        </Badge>
                        {provider.badges.includes("zero-fraud") && (
                          <Badge className="bg-green-600 text-xs">Zero Fraud</Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <Badge className={`${statusConfig.color} shrink-0`}>
                  <Icon className="h-3 w-3 mr-1" />
                  {statusConfig.label}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs mb-1">Applied Date</p>
                  <p className="font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(app.appliedDate).toLocaleDateString()}
                  </p>
                </div>
                {app.responseDate && (
                  <div>
                    <p className="text-muted-foreground text-xs mb-1">Response Date</p>
                    <p className="font-medium flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(app.responseDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              {app.status === "completed" && app.amountReceived && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Amount Received:</span>
                    <span className="text-lg font-bold text-green-600">
                      {formatCurrency(app.amountReceived, { unit: currencyUnit })}
                    </span>
                  </div>
                  {app.rating && (
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm text-muted-foreground">Your Rating:</span>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < app.rating!
                                ? "fill-yellow-400 text-yellow-400"
                                : "fill-gray-300 text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {app.feedback && (
                    <p className="text-xs text-muted-foreground mt-2 italic">"{app.feedback}"</p>
                  )}
                </div>
              )}

              {app.status === "rejected" && app.rejectionReason && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-sm text-muted-foreground mb-1">Rejection Reason:</p>
                  <p className="text-sm text-red-700 dark:text-red-300">{app.rejectionReason}</p>
                </div>
              )}

              {app.status === "in-progress" && (
                <div className="mt-3 pt-3 border-t">
                  <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm">
                    <Clock className="h-4 w-4 animate-pulse" />
                    <span>Distribution is currently being processed...</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}

        {/* Summary */}
        <div className="mt-4 p-3 bg-muted/50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Applied</p>
              <p className="text-lg font-bold">{beneficiary.providerApplications.length}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Completed</p>
              <p className="text-lg font-bold text-green-600">
                {beneficiary.providerApplications.filter((a) => a.status === "completed").length}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">In Progress</p>
              <p className="text-lg font-bold text-blue-600">
                {beneficiary.providerApplications.filter((a) => a.status === "in-progress").length}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Total Received</p>
              <p className="text-lg font-bold text-green-600">
                {formatCurrency(
                  beneficiary.providerApplications.reduce((sum, a) => sum + (a.amountReceived || 0), 0),
                  { unit: currencyUnit }
                )}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
