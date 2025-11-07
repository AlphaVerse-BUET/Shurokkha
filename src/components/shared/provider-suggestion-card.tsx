"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Sparkles, CheckCircle, AlertCircle, TrendingUp, MapPin, Shield, Zap } from "lucide-react"
import type { ProviderSuggestion } from "@/lib/provider-matching"

interface ProviderSuggestionCardProps {
  suggestion: ProviderSuggestion
  onSelect?: (providerId: string) => void
  isSelected?: boolean
  showDetails?: boolean
}

export default function ProviderSuggestionCard({
  suggestion,
  onSelect,
  isSelected = false,
  showDetails = true,
}: ProviderSuggestionCardProps) {
  const { provider, matchScore, matchReasons, factors } = suggestion

  // Determine quality level
  let qualityBadge = { label: "Good Match", color: "bg-green-100 text-green-700" }
  if (matchScore >= 80) {
    qualityBadge = { label: "Excellent Match", color: "bg-blue-100 text-blue-700" }
  } else if (matchScore >= 70) {
    qualityBadge = { label: "Very Good Match", color: "bg-green-100 text-green-700" }
  } else if (matchScore >= 60) {
    qualityBadge = { label: "Good Match", color: "bg-yellow-100 text-yellow-700" }
  } else {
    qualityBadge = { label: "Fair Match", color: "bg-orange-100 text-orange-700" }
  }

  return (
    <Card
      className={`p-6 transition-all cursor-pointer ${
        isSelected
          ? "ring-2 ring-accent bg-accent/5"
          : "hover:shadow-md border-border/50 hover:border-accent/50"
      }`}
      onClick={() => onSelect?.(provider.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-bold">{provider.organizationName}</h3>
            {isSelected && <CheckCircle className="w-5 h-5 text-accent" />}
          </div>
          <p className="text-sm text-foreground/60">{provider.description}</p>
        </div>
        <Badge className={`${qualityBadge.color} text-base px-3 py-1`}>
          <Sparkles className="w-4 h-4 mr-1 inline" />
          {matchScore}%
        </Badge>
      </div>

      {/* Match Quality */}
      <div className="mb-4">
        <Badge variant={qualityBadge.label.includes("Excellent") ? "default" : "secondary"}>
          {qualityBadge.label}
        </Badge>
      </div>

      {/* Match Reasons */}
      {matchReasons.length > 0 && (
        <div className="mb-4 space-y-2">
          <p className="text-sm font-medium text-foreground">Why matched:</p>
          <div className="flex flex-wrap gap-2">
            {matchReasons.map((reason, idx) => (
              <Badge key={idx} variant="secondary" className="text-xs">
                ✓ {reason}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Factors */}
      {showDetails && (
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-background rounded-lg">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-blue-500" />
            <div className="text-xs">
              <p className="text-foreground/60">Specialization</p>
              <p className="font-bold">{factors.specializationMatch}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-green-500" />
            <div className="text-xs">
              <p className="text-foreground/60">Location</p>
              <p className="font-bold">{factors.geographicProximity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-purple-500" />
            <div className="text-xs">
              <p className="text-foreground/60">Trust Score</p>
              <p className="font-bold">{factors.trustScore}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-orange-500" />
            <div className="text-xs">
              <p className="text-foreground/60">Capacity</p>
              <p className="font-bold">{factors.capacityAvailable}%</p>
            </div>
          </div>
        </div>
      )}

      {/* Provider Info */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <p className="text-foreground/60">Type</p>
          <Badge variant="outline" className="capitalize text-xs">
            {provider.registrationType}
          </Badge>
        </div>
        <div>
          <p className="text-foreground/60">Years Active</p>
          <p className="font-medium">{provider.yearsActive} years</p>
        </div>
        <div>
          <p className="text-foreground/60">Beneficiaries Served</p>
          <p className="font-medium">{provider.totalAidedBeneficiaries.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-foreground/60">Response Time</p>
          <p className="font-medium">{provider.responseTimeHours}h</p>
        </div>
      </div>

      {/* Badges */}
      {provider.badges.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <p className="text-xs text-foreground/60 mb-2">Verified With:</p>
          <div className="flex flex-wrap gap-2">
            {provider.badges.map((badge) => (
              <Badge key={badge} variant="secondary" className="text-xs capitalize">
                ✓ {badge}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      {onSelect && (
        <Button
          onClick={(e) => {
            e.stopPropagation()
            onSelect(provider.id)
          }}
          className="w-full mt-4"
          variant={isSelected ? "default" : "outline"}
        >
          {isSelected ? "✓ Selected" : "Select This Provider"}
        </Button>
      )}
    </Card>
  )
}
