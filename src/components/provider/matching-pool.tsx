"use client"

import { useMemo } from "react"
import { mockDonations, mockCrises } from "@/store/mock-data"
import type { Provider } from "@/types"
import { ChevronRight, CheckCircle, AlertCircle } from "lucide-react"

interface ProviderMatchingPoolProps {
  provider: Provider
  metrics: {
    availableMatchingPool: number
  }
}

export default function ProviderMatchingPool({ provider, metrics }: ProviderMatchingPoolProps) {
  const availableDonations = useMemo(() => {
    return mockDonations
      .filter((d) => d.status === "pending")
      .map((d) => {
        const crisis = mockCrises.find((c) => c.id === d.crisisId)
        return {
          ...d,
          crisis,
          compatibleWithProvider:
            provider.specialization.includes(crisis?.type) &&
            provider.geographicFocus.divisions.includes(crisis?.location.division),
        }
      })
      .sort((a, b) => (b.compatibleWithProvider ? 1 : -1) - (a.compatibleWithProvider ? 1 : -1))
  }, [provider])

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/30 rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-foreground/70">Total Available Matching Pool</p>
            <h2 className="text-4xl font-bold text-primary">
              ৳{(metrics.availableMatchingPool / 1000000).toFixed(2)}M
            </h2>
          </div>
          <div className="text-right">
            <p className="text-sm text-foreground/70">{availableDonations.length} Donation(s) Available</p>
            <p className="text-2xl font-bold text-secondary">
              {availableDonations.filter((d) => d.compatibleWithProvider).length} Compatible
            </p>
          </div>
        </div>
      </div>

      {/* Matching opportunities */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
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
                    <p className="text-lg font-bold text-primary">৳{donation.amount.toLocaleString()}</p>
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
                    <button className="p-2 hover:bg-background rounded-lg transition-colors">
                      <ChevronRight className="w-5 h-5 text-foreground/60" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preferences hint */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <p className="text-sm text-blue-700">
          <strong>Tip:</strong> Set your provider preferences to prioritize compatible donations and improve matching
          success.
        </p>
      </div>
    </div>
  )
}
