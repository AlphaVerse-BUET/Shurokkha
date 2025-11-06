"use client"

import { CheckCircle2, AlertCircle, Loader2, XCircle, Shield } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface AIVerificationResult {
  type: "document" | "face-match" | "fraud-detection" | "gps" | "deepfake" | "nid"
  status: "pending" | "processing" | "success" | "warning" | "error"
  confidence?: number
  message: string
  details?: string[]
  timestamp?: string
}

interface AIVerificationStatusProps {
  results: AIVerificationResult[]
  className?: string
}

export function AIVerificationStatus({ results, className }: AIVerificationStatusProps) {
  const getStatusIcon = (status: AIVerificationResult["status"]) => {
    switch (status) {
      case "pending":
        return <Shield className="h-5 w-5 text-gray-400" />
      case "processing":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
    }
  }

  const getStatusColor = (status: AIVerificationResult["status"]) => {
    switch (status) {
      case "pending":
        return "bg-gray-50 border-gray-200"
      case "processing":
        return "bg-blue-50 border-blue-200"
      case "success":
        return "bg-green-50 border-green-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      case "error":
        return "bg-red-50 border-red-200"
    }
  }

  const getTypeLabel = (type: AIVerificationResult["type"]) => {
    switch (type) {
      case "document":
        return "Document Verification"
      case "face-match":
        return "Face Matching"
      case "fraud-detection":
        return "Fraud Detection"
      case "gps":
        return "GPS Validation"
      case "deepfake":
        return "Deepfake Detection"
      case "nid":
        return "NID Verification"
    }
  }

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Shield className="h-4 w-4" />
          AI Verification Results
        </h3>
        <Badge variant="outline">
          {results.filter((r) => r.status === "success").length}/{results.length} Passed
        </Badge>
      </div>

      {results.map((result, index) => (
        <Card key={index} className={cn("p-4 border-2", getStatusColor(result.status))}>
          <div className="flex items-start gap-3">
            {getStatusIcon(result.status)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">{getTypeLabel(result.type)}</p>
                {result.confidence !== undefined && (
                  <span className="text-xs font-medium">{result.confidence}% confidence</span>
                )}
              </div>

              <p className="text-xs text-muted-foreground mb-2">{result.message}</p>

              {result.confidence !== undefined && <Progress value={result.confidence} className="h-1.5 mb-2" />}

              {result.details && result.details.length > 0 && (
                <ul className="text-xs space-y-1 mt-2">
                  {result.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-muted-foreground">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              )}

              {result.timestamp && (
                <p className="text-xs text-muted-foreground mt-2">{new Date(result.timestamp).toLocaleString()}</p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
