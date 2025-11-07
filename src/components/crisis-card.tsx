"use client"

import type { Crisis } from "@/types"
import { TrendingUp, ThumbsUp } from "lucide-react"
import { useCurrency } from "@/contexts/currency-context"

interface CrisisCardProps {
  crisis: Crisis
  onView: () => void
  onDonate: () => void
}

export default function CrisisCard({ crisis, onView, onDonate }: CrisisCardProps) {
  const fundingPercentage = (crisis.fundingReceived / crisis.fundingNeeded) * 100
  const isTrending = crisis.trending
  const { formatAbbreviated } = useCurrency()

  const getSeverityColor = (severity: number) => {
    if (severity >= 80) return "bg-red-500/20 text-red-700 border-red-500/50"
    if (severity >= 60) return "bg-orange-500/20 text-orange-700 border-orange-500/50"
    if (severity >= 40) return "bg-yellow-500/20 text-yellow-700 border-yellow-500/50"
    return "bg-green-500/20 text-green-700 border-green-500/50"
  }

  const getVerificationBadge = (status: string) => {
    if (status === "ai-verified") return "bg-green-500/20 text-green-700"
    if (status === "community-validated") return "bg-blue-500/20 text-blue-700"
    return "bg-yellow-500/20 text-yellow-700"
  }

  return (
    <div className="group bg-card border border-border/50 hover:border-primary/30 rounded-lg overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/10">
      {/* Image container */}
      <div className="relative h-40 bg-linear-to-br from-background to-background/50 overflow-hidden flex items-center justify-center border-b border-border/50">
        <img
          src={crisis.evidenceImages[0] || "/placeholder.svg?height=160&width=280&query=crisis"}
          alt={crisis.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Badge overlays */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isTrending && (
            <div className="bg-red-500/90 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Trending
            </div>
          )}
          <div className={`px-2 py-1 rounded text-xs font-semibold ${getSeverityColor(crisis.severity)}`}>
            Severity {crisis.severity}
          </div>
        </div>

        {/* Verification badge */}
        <div
          className={`absolute bottom-3 right-3 px-2 py-1 rounded text-xs font-medium ${getVerificationBadge(crisis.verificationStatus)}`}
        >
          {crisis.verificationStatus === "ai-verified" && "✓ AI Verified"}
          {crisis.verificationStatus === "community-validated" && "✓ Community"}
          {crisis.verificationStatus === "under-review" && "⊘ Under Review"}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <div>
          <h3 className="font-bold text-foreground text-sm leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {crisis.title}
          </h3>
          <p className="text-xs text-foreground/60 mt-1">
            {crisis.location.district}, {crisis.location.division}
          </p>
        </div>

        {/* Funding progress */}
        <div className="space-y-1">
          <div className="flex justify-between items-center">
            <span className="text-xs text-foreground/60">Funding Progress</span>
            <span className="text-xs font-semibold text-primary">{fundingPercentage.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-border/30 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-primary to-accent transition-all duration-500"
              style={{ width: `${Math.min(fundingPercentage, 100)}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-foreground/60">{formatAbbreviated(crisis.fundingReceived)} raised</span>
            <span className="text-xs text-foreground/60">of {formatAbbreviated(crisis.fundingNeeded)}</span>
          </div>
        </div>

        {/* Impact metrics */}
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/30">
          <div className="text-center">
            <div className="text-sm font-bold text-foreground">{crisis.affectedPopulation.toLocaleString()}</div>
            <div className="text-xs text-foreground/60">Affected</div>
          </div>
          <div className="text-center">
            <div className="text-sm font-bold text-foreground flex items-center justify-center gap-1">
              <ThumbsUp className="w-3 h-3 text-green-600" />
              {crisis.upvotes}
            </div>
            <div className="text-xs text-foreground/60">Community</div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-3">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onView()
            }}
            className="flex-1 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg text-xs font-semibold transition-colors"
          >
            View Details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDonate()
            }}
            className="flex-1 px-3 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-xs font-semibold transition-colors"
          >
            Donate
          </button>
        </div>
      </div>
    </div>
  )
}
