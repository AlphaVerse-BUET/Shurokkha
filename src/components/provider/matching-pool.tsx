"use client"

import { useMemo } from "react"
import { mockDonations, mockCrises, mockBeneficiaries } from "@/store/mock-data"
import type { Provider } from "@/types"
import { ChevronRight, CheckCircle, AlertCircle, Sparkles, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface ProviderMatchingPoolProps {
  provider: Provider
  metrics: {
    availableMatchingPool: number
  }
}

export default function ProviderMatchingPool({ provider, metrics }: ProviderMatchingPoolProps) {
  const availableBeneficiaries = useMemo(() => {
    return mockBeneficiaries
      .filter((b) => b.applicationStatus === "pending" || b.applicationStatus === "verified" || b.applicationStatus === "submitted")
      .map((b) => {
        // Calculate match score
        const matchesCrisisType = provider.specialization.some((spec) =>
          b.needCategory.toLowerCase().includes(spec.toLowerCase()),
        )
        const matchesLocation = provider.geographicFocus.divisions.includes(b.location.division)
        const matchScore = (matchesCrisisType ? 50 : 0) + (matchesLocation ? 50 : 0)
        
        return {
          ...b,
          matchScore,
          isCompatible: matchesCrisisType && matchesLocation,
        }
      })
      .sort((a, b) => b.matchScore - a.matchScore)
  }, [provider])

  const availableDonations = useMemo(() => {
    return mockDonations
      .filter((d) => d.status === "pending")
      .map((d) => {
        const crisis = mockCrises.find((c) => c.id === d.crisisId)
        return {
          ...d,
          crisis,
          compatibleWithProvider:
            crisis &&
            provider.specialization.some((spec) => crisis.type.toLowerCase().includes(spec.toLowerCase())) &&
            provider.geographicFocus.divisions.includes(crisis.location.division),
        }
      })
      .sort((a, b) => (b.compatibleWithProvider ? 1 : -1) - (a.compatibleWithProvider ? 1 : -1))
  }, [provider])

  const formatAmount = (amount: number | undefined): string => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return "0"
    }
    return amount.toLocaleString()
  }

  const formatMillions = (amount: number | undefined): string => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return "0.00"
    }
    return (amount / 1000000).toFixed(2)
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-foreground/70 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Total Available Matching Pool
            </p>
            <h2 className="text-4xl font-bold text-primary">৳{formatMillions(metrics?.availableMatchingPool)}M</h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-foreground/70">{availableDonations.length} Donation(s) Available</p>
            <p className="text-2xl font-bold text-secondary">
              {availableDonations.filter((d) => d.compatibleWithProvider).length} Compatible
            </p>
          </div>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
            <User className="w-5 h-5" />
            Available Beneficiaries ({availableBeneficiaries.length})
          </h3>
          <Badge variant="secondary">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Matched
          </Badge>
        </div>

        {availableBeneficiaries.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-foreground/20 mx-auto mb-3" />
            <p className="text-foreground/60">No matching beneficiaries available right now</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {availableBeneficiaries.map((beneficiary) => (
              <Card key={beneficiary.id} className="p-4 hover:shadow-lg transition-all border-2 hover:border-primary">
                <div className="flex gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={beneficiary.profileImage || "/placeholder.svg"}
                      alt={beneficiary.fullName}
                      width={64}
                      height={64}
                      className="rounded-full border-2 border-primary object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-foreground truncate">{beneficiary.fullName}</h4>
                    <p className="text-xs text-muted-foreground">
                      Age {beneficiary.age} • Family of {beneficiary.familySize}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      📍 {beneficiary.location.district}, {beneficiary.location.division}
                    </p>
                    <div className="flex gap-1 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {beneficiary.needCategory}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        ৳{formatAmount(beneficiary.requestedAmount)}
                      </Badge>
                    </div>
                  </div>

                  <Button size="sm" variant="outline" className="self-start bg-transparent">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        beneficiary.urgencyLevel === "critical"
                          ? "bg-red-500"
                          : beneficiary.urgencyLevel === "high"
                            ? "bg-orange-500"
                            : "bg-yellow-500"
                      }`}
                    />
                    {beneficiary.urgencyLevel} urgency
                  </span>
                  <span className="text-green-600 font-medium">✓ {beneficiary.verificationStatus}</span>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Matching opportunities */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Available Donation Matches</h3>

        {availableDonations.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-foreground/20 mx-auto mb-3" />
            <p className="text-foreground/60">No matching opportunities available right now</p>
          </div>
        ) : (
          <div className="space-y-3">
            {availableDonations.map((donation) => (
              <div
                key={donation.id}
                className={`border rounded-lg p-4 transition-all cursor-pointer hover:shadow-md ${
                  donation.compatibleWithProvider
                    ? "border-secondary/50 bg-secondary/5"
                    : "border-border/30 bg-background/50 opacity-60"
                }`}
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                  {/* Crisis info */}
                  <div className="md:col-span-2">
                    <p className="text-xs text-foreground/60 mb-1">Crisis</p>
                    <p className="font-semibold text-foreground">{donation.crisis?.title || "Crisis"}</p>
                    <p className="text-xs text-foreground/60 mt-1">
                      {donation.crisis?.location.district}, {donation.crisis?.location.division}
                    </p>
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="text-xs text-foreground/60 mb-1">Donation Amount</p>
                    <p className="text-lg font-bold text-primary">৳{formatAmount(donation.amount)}</p>
                  </div>

                  {/* Provider match */}
                  <div>
                    <p className="text-xs text-foreground/60 mb-1">Match Status</p>
                    <div className="flex items-center gap-1">
                      {donation.compatibleWithProvider ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-medium text-green-600">Compatible</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-orange-600" />
                          <span className="text-xs font-medium text-orange-600">Not Aligned</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="text-right">
                    <Button className="p-2 hover:bg-background rounded-lg transition-colors">
                      <ChevronRight className="w-5 h-5 text-foreground/60" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Preferences hint */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <strong>💡 AI Tip:</strong> These beneficiaries are automatically matched based on your specialization and
          geographic focus. Update your preferences to see more relevant matches.
        </p>
      </div>
    </div>
  )
}
