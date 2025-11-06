import { useMemo } from "react"
import type { Beneficiary } from "@/types"

export function useBeneficiaryStatus(beneficiary: Beneficiary) {
  return useMemo(() => {
    // Calculate application progress percentage
    const getProgress = () => {
      switch (beneficiary.applicationStatus) {
        case "completed":
          return 100
        case "in-progress":
          return 75
        case "matched":
          return 60
        case "verified":
          return 40
        case "submitted":
        case "pending":
          return 20
        default:
          return 0
      }
    }

    // Get status color
    const getStatusColor = () => {
      switch (beneficiary.applicationStatus) {
        case "completed":
          return "bg-green-500"
        case "in-progress":
          return "bg-blue-500"
        case "matched":
          return "bg-purple-500"
        case "verified":
          return "bg-indigo-500"
        case "submitted":
        case "pending":
          return "bg-yellow-500"
        default:
          return "bg-gray-500"
      }
    }

    // Get status label
    const getStatusLabel = () => {
      switch (beneficiary.applicationStatus) {
        case "completed":
          return "Completed"
        case "in-progress":
          return "Distribution In Progress"
        case "matched":
          return "Provider Matched"
        case "verified":
          return "Verified"
        case "submitted":
        case "pending":
          return "Under Review"
        default:
          return "Unknown"
      }
    }

    // Get urgency color
    const getUrgencyColor = () => {
      switch (beneficiary.urgencyLevel) {
        case "critical":
          return "bg-red-500"
        case "emergency":
          return "bg-orange-500"
        case "high":
          return "bg-yellow-500"
        case "medium":
          return "bg-blue-500"
        default:
          return "bg-gray-500"
      }
    }

    // Build timeline stages
    const getTimelineStages = () => {
      const stages = [
        {
          id: "submitted",
          label: "Application Submitted",
          completed: true,
          date: beneficiary.appliedDate,
          icon: "file",
        },
        {
          id: "verified",
          label: "AI Verification Complete",
          completed: beneficiary.verificationStatus === "verified",
          date: beneficiary.verificationStatus === "verified" ? beneficiary.appliedDate : undefined,
          icon: "check",
        },
        {
          id: "matched",
          label: "Provider Matched",
          completed: !!beneficiary.allocatedProviderId,
          date: beneficiary.allocationDate,
          icon: "users",
        },
        {
          id: "in-progress",
          label: "Distribution In Progress",
          completed: beneficiary.applicationStatus === "in-progress" || beneficiary.applicationStatus === "completed",
          date:
            beneficiary.applicationStatus === "in-progress" || beneficiary.applicationStatus === "completed"
              ? beneficiary.allocationDate
              : undefined,
          icon: "truck",
        },
        {
          id: "completed",
          label: "Aid Received",
          completed: beneficiary.applicationStatus === "completed",
          date: beneficiary.completionDate,
          icon: "package",
        },
      ]

      return stages
    }

    // Get next action
    const getNextAction = () => {
      switch (beneficiary.applicationStatus) {
        case "pending":
        case "submitted":
          return "Wait for AI verification to complete"
        case "verified":
          return "Waiting for provider matching"
        case "matched":
          return "Provider is preparing your aid package"
        case "in-progress":
          return "Distribution in progress - provider will contact you"
        case "completed":
          return beneficiary.providerRating ? "Thank you for your feedback!" : "Please rate your provider"
        default:
          return "Status unknown - contact support"
      }
    }

    // Check if can rate provider
    const canRateProvider = beneficiary.applicationStatus === "completed" && !beneficiary.providerRating

    // Get verification badge
    const getVerificationBadge = () => {
      switch (beneficiary.verificationStatus) {
        case "verified":
          return { text: "AI Verified", color: "bg-green-600" }
        case "under-review":
          return { text: "Under Review", color: "bg-yellow-600" }
        case "rejected":
          return { text: "Rejected", color: "bg-red-600" }
        default:
          return { text: "Pending", color: "bg-gray-600" }
      }
    }

    return {
      progress: getProgress(),
      statusColor: getStatusColor(),
      statusLabel: getStatusLabel(),
      urgencyColor: getUrgencyColor(),
      timelineStages: getTimelineStages(),
      nextAction: getNextAction(),
      canRateProvider,
      verificationBadge: getVerificationBadge(),
    }
  }, [beneficiary])
}
