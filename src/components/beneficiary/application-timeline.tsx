"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  Clock,
  Users,
  Package,
  AlertCircle,
  FileText,
  Shield,
  Image as ImageIcon,
} from "lucide-react"
import type { Beneficiary, Provider } from "@/types"

interface ApplicationTimelineProps {
  beneficiary: Beneficiary
  provider?: Provider | null
  showProofStatus?: boolean
}

export function ApplicationTimeline({ beneficiary, provider, showProofStatus = true }: ApplicationTimelineProps) {
  const getStatusProgress = () => {
    const statusMap: Record<string, number> = {
      pending: 20,
      submitted: 20,
      verified: 40,
      matched: 60,
      "in-progress": 80,
      completed: 100,
      rejected: 0,
    }
    return statusMap[beneficiary.applicationStatus] || 0
  }

  const progress = getStatusProgress()

  const timelineSteps = [
    {
      id: "submitted",
      title: "Application Submitted",
      description: new Date(beneficiary.appliedDate).toLocaleDateString(),
      detail: "Your application has been received and is under review",
      icon: FileText,
      completed: true,
      active: false,
    },
    {
      id: "verified",
      title: "Verification Complete",
      description:
        beneficiary.verificationStatus === "verified"
          ? "Verified"
          : beneficiary.verificationStatus === "pending"
            ? "Pending verification"
            : "Verification in progress",
      detail: "Documents and eligibility verified by AI",
      icon: Shield,
      completed: beneficiary.verificationStatus === "verified",
      active: beneficiary.applicationStatus === "pending" || beneficiary.applicationStatus === "submitted",
    },
    {
      id: "proof",
      title: "Crisis Proof Uploaded",
      description: `${beneficiary.crisisProofImages.length} documents`,
      detail: "Photos/videos of crisis situation verified",
      icon: ImageIcon,
      completed: beneficiary.crisisProofImages.length > 0,
      active: false,
      show: showProofStatus,
    },
    {
      id: "matched",
      title: "Matched with Provider",
      description: beneficiary.allocationDate
        ? new Date(beneficiary.allocationDate).toLocaleDateString()
        : "Waiting for match",
      detail: provider ? `Assigned to ${provider.organizationName}` : "Finding suitable provider",
      icon: Users,
      completed: !!beneficiary.allocatedProviderId,
      active: beneficiary.applicationStatus === "verified",
    },
    {
      id: "in-progress",
      title: "Distribution in Progress",
      description: beneficiary.applicationStatus === "in-progress" ? "Currently processing" : "Not started",
      detail: "Provider is preparing your aid package",
      icon: Clock,
      completed: beneficiary.applicationStatus === "in-progress" || beneficiary.applicationStatus === "completed",
      active: beneficiary.applicationStatus === "in-progress",
    },
    {
      id: "completed",
      title: "Aid Distributed",
      description: beneficiary.completionDate
        ? new Date(beneficiary.completionDate).toLocaleDateString()
        : "Pending distribution",
      detail: "Successfully received assistance",
      icon: Package,
      completed: beneficiary.applicationStatus === "completed",
      active: false,
    },
  ]

  const visibleSteps = timelineSteps.filter((step) => step.show !== false)

  return (
    <Card>
      <CardHeader>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <CardTitle>Application Timeline</CardTitle>
            <Badge
              className={
                beneficiary.applicationStatus === "completed"
                  ? "bg-green-500"
                  : beneficiary.applicationStatus === "in-progress"
                    ? "bg-blue-500"
                    : beneficiary.applicationStatus === "verified"
                      ? "bg-purple-500"
                      : beneficiary.applicationStatus === "rejected"
                        ? "bg-red-500"
                        : "bg-yellow-500"
              }
            >
              {beneficiary.applicationStatus.toUpperCase().replace("-", " ")}
            </Badge>
          </div>
          <CardDescription>Track your application progress</CardDescription>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  beneficiary.applicationStatus === "completed"
                    ? "bg-green-500"
                    : beneficiary.applicationStatus === "rejected"
                      ? "bg-red-500"
                      : "bg-blue-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {visibleSteps.map((step, index) => {
            const Icon = step.icon
            const isLast = index === visibleSteps.length - 1

            return (
              <div key={step.id} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center transition-colors ${
                      step.completed
                        ? "bg-green-500"
                        : step.active
                          ? "bg-blue-500 animate-pulse"
                          : "bg-muted"
                    }`}
                  >
                    {step.completed ? (
                      <CheckCircle className="h-5 w-5 text-white" />
                    ) : (
                      <Icon
                        className={`h-5 w-5 ${step.active ? "text-white" : "text-muted-foreground"}`}
                      />
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={`w-0.5 h-full min-h-[40px] mt-2 transition-colors ${
                        step.completed ? "bg-green-500" : step.active ? "bg-blue-500" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className={`font-semibold ${step.active ? "text-blue-600 dark:text-blue-400" : ""}`}>
                      {step.title}
                    </p>
                    {step.completed && (
                      <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-950 border-green-200">
                        Done
                      </Badge>
                    )}
                    {step.active && (
                      <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-950 border-blue-200">
                        Active
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                  <p className="text-xs text-muted-foreground mt-1">{step.detail}</p>

                  {/* Special badges */}
                  {step.id === "verified" && beneficiary.verificationStatus === "verified" && (
                    <Badge className="mt-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border-green-300 text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      AI Verified
                    </Badge>
                  )}

                  {step.id === "proof" && beneficiary.crisisProofImages.length > 0 && (
                    <Badge className="mt-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 border-blue-300 text-xs">
                      <ImageIcon className="h-3 w-3 mr-1" />
                      {beneficiary.crisisProofImages.length} Verified Documents
                    </Badge>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Rejection Info */}
        {beneficiary.applicationStatus === "rejected" && (
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900 dark:text-red-100">Application Rejected</p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {beneficiary.rejectionReason || "Your application did not meet the eligibility criteria."}
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  Submit New Application
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Next Steps */}
        {beneficiary.applicationStatus === "pending" && (
          <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-yellow-900 dark:text-yellow-100">Verification in Progress</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                  Your documents are being verified. This usually takes 24-48 hours.
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
