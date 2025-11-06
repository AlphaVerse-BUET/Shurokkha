"use client"

import { CheckCircle, XCircle, AlertCircle, Loader2, Sparkles, Shield, Eye, FileCheck } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"

interface AIVerificationDisplayProps {
  status: "pending" | "processing" | "verified" | "failed" | "warning"
  checks?: {
    label: string
    status: "pass" | "fail" | "warning" | "processing"
    confidence?: number
    details?: string
  }[]
  overallConfidence?: number
  issues?: string[]
  processingStage?: string
}

export default function AIVerificationDisplay({
  status,
  checks = [],
  overallConfidence,
  issues = [],
  processingStage,
}: AIVerificationDisplayProps) {
  const getStatusColor = (checkStatus: string) => {
    switch (checkStatus) {
      case "pass":
        return "text-green-600 bg-green-500/10 border-green-500/30"
      case "fail":
        return "text-red-600 bg-red-500/10 border-red-500/30"
      case "warning":
        return "text-orange-600 bg-orange-500/10 border-orange-500/30"
      case "processing":
        return "text-blue-600 bg-blue-500/10 border-blue-500/30"
      default:
        return "text-muted-foreground bg-muted/10 border-border"
    }
  }

  const getStatusIcon = (checkStatus: string) => {
    switch (checkStatus) {
      case "pass":
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case "fail":
        return <XCircle className="w-5 h-5 text-red-600" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-orange-600" />
      case "processing":
        return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
      default:
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getOverallStatusConfig = () => {
    switch (status) {
      case "verified":
        return {
          icon: <CheckCircle className="w-8 h-8" />,
          color: "text-green-600",
          bgColor: "bg-green-500/10 border-green-500/30",
          title: "AI Verification Complete",
          message: "All checks passed successfully",
        }
      case "failed":
        return {
          icon: <XCircle className="w-8 h-8" />,
          color: "text-red-600",
          bgColor: "bg-red-500/10 border-red-500/30",
          title: "Verification Failed",
          message: "Issues detected during verification",
        }
      case "warning":
        return {
          icon: <AlertCircle className="w-8 h-8" />,
          color: "text-orange-600",
          bgColor: "bg-orange-500/10 border-orange-500/30",
          title: "Verification Warning",
          message: "Some checks require attention",
        }
      case "processing":
        return {
          icon: <Loader2 className="w-8 h-8 animate-spin" />,
          color: "text-blue-600",
          bgColor: "bg-blue-500/10 border-blue-500/30",
          title: "AI Processing",
          message: processingStage || "Running verification checks...",
        }
      default:
        return {
          icon: <Sparkles className="w-8 h-8" />,
          color: "text-muted-foreground",
          bgColor: "bg-muted/10 border-border",
          title: "Ready for Verification",
          message: "Upload documents to begin AI verification",
        }
    }
  }

  const statusConfig = getOverallStatusConfig()

  return (
    <Card className={`p-6 border-2 ${statusConfig.bgColor}`} data-testid="ai-verification-display">
      {/* Overall Status */}
      <div className="flex items-start gap-4 mb-6">
        <div className={`${statusConfig.color} flex-shrink-0`}>{statusConfig.icon}</div>
        <div className="flex-1">
          <h3 className={`text-lg font-bold ${statusConfig.color} flex items-center gap-2`}>
            <Sparkles className="w-5 h-5" />
            {statusConfig.title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1">{statusConfig.message}</p>

          {/* Overall Confidence Score */}
          {overallConfidence !== undefined && (
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium text-foreground">Confidence Score</span>
                <Badge className={overallConfidence >= 85 ? "bg-green-600" : overallConfidence >= 70 ? "bg-orange-500" : "bg-red-600"}>
                  {overallConfidence}%
                </Badge>
              </div>
              <Progress value={overallConfidence} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">
                {overallConfidence >= 85
                  ? "High confidence - Ready to proceed"
                  : overallConfidence >= 70
                    ? "Moderate confidence - Review recommended"
                    : "Low confidence - Manual review required"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Individual Checks */}
      {checks.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Verification Checks
          </h4>
          <div className="space-y-2">
            {checks.map((check, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border ${getStatusColor(check.status)} transition-all`}
                data-testid={`verification-check-${check.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">{getStatusIcon(check.status)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium">{check.label}</p>
                      {check.confidence !== undefined && (
                        <Badge variant="outline" className="ml-2">
                          {check.confidence}%
                        </Badge>
                      )}
                    </div>
                    {check.details && <p className="text-xs text-muted-foreground mt-1">{check.details}</p>}
                  </div>
                </div>

                {check.confidence !== undefined && check.status !== "processing" && (
                  <Progress value={check.confidence} className="h-1 mt-2" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Issues */}
      {issues.length > 0 && (
        <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
          <h4 className="text-sm font-semibold text-red-700 flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4" />
            Issues Detected
          </h4>
          <ul className="space-y-1">
            {issues.map((issue, index) => (
              <li key={index} className="text-xs text-red-600 flex items-start gap-2">
                <span className="flex-shrink-0 mt-0.5">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* AI Features Badge */}
      <div className="mt-4 pt-4 border-t border-border/30">
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="outline" className="gap-1">
            <Eye className="w-3 h-3" />
            Face Matching
          </Badge>
          <Badge variant="outline" className="gap-1">
            <FileCheck className="w-3 h-3" />
            Document Authenticity
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Shield className="w-3 h-3" />
            Deepfake Detection
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Sparkles className="w-3 h-3" />
            AI-Powered
          </Badge>
        </div>
      </div>
    </Card>
  )
}
