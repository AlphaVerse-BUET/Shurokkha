"use client"

import { useMemo } from "react"
import { mockDonations, mockBeneficiaries, mockCrises } from "@/store/mock-data"
import type { Provider } from "@/types"
import { Clock, CheckCircle, MapPin, Camera } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

interface ProviderActiveDistributionsProps {
  provider: Provider
}

export default function ProviderActiveDistributions({ provider }: ProviderActiveDistributionsProps) {
  const distributions = useMemo(() => {
    return mockDonations
      .flatMap((d) =>
        d.allocations.map((a) => ({
          ...a,
          donationId: d.id,
          beneficiary: mockBeneficiaries.find((b) => b.id === a.beneficiaryId),
          crisis: mockCrises.find((c) => c.id === d.crisisId),
        })),
      )
      .filter((d) => d.providerId === provider.id)
  }, [provider.id])

  const getStatusBadge = (status: string) => {
    if (status === "completed" || status === "verified") {
      return { bg: "bg-green-500/20", border: "border-green-500/30", text: "text-green-700" }
    }
    if (status === "in-progress") {
      return { bg: "bg-blue-500/20", border: "border-blue-500/30", text: "text-blue-700" }
    }
    return { bg: "bg-yellow-500/20", border: "border-yellow-500/30", text: "text-yellow-700" }
  }

  return (
    <div className="space-y-4">
      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border/50 rounded-lg p-4 text-center">
          <p className="text-foreground/60 text-sm mb-1">Total Distributions</p>
          <p className="text-3xl font-bold text-foreground">{distributions.length}</p>
        </div>
        <div className="bg-card border border-border/50 rounded-lg p-4 text-center">
          <p className="text-foreground/60 text-sm mb-1">In Progress</p>
          <p className="text-3xl font-bold text-blue-600">
            {distributions.filter((d) => d.status === "in-progress").length}
          </p>
        </div>
        <div className="bg-card border border-border/50 rounded-lg p-4 text-center">
          <p className="text-foreground/60 text-sm mb-1">Completed</p>
          <p className="text-3xl font-bold text-green-600">
            {distributions.filter((d) => d.status === "completed" || d.status === "verified").length}
          </p>
        </div>
      </div>

      {/* Distributions list */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Active Distributions</h3>

        {distributions.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="w-12 h-12 text-foreground/20 mx-auto mb-3" />
            <p className="text-foreground/60">No active distributions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {distributions.map((dist) => (
              <div
                key={dist.id}
                className="border border-border/50 rounded-lg p-4 hover:bg-background/50 transition-colors"
              >
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-start">
                  {/* Beneficiary */}
                  <div className="md:col-span-2">
                    <p className="text-xs text-foreground/60 mb-2">Beneficiary</p>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 border-2 border-primary/20">
                        <AvatarImage
                          src={dist.beneficiary?.profileImage || "/placeholder.svg"}
                          alt={dist.beneficiary?.fullName}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {dist.beneficiary?.fullName?.charAt(0) || "B"}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{dist.beneficiary?.fullName}</p>
                        <p className="text-xs text-foreground/60 flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {dist.beneficiary?.location.district}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Need category */}
                  <div>
                    <p className="text-xs text-foreground/60 mb-1">Need Type</p>
                    <p className="font-medium text-foreground capitalize">{dist.beneficiary?.needCategory}</p>
                  </div>

                  {/* Amount */}
                  <div>
                    <p className="text-xs text-foreground/60 mb-1">Amount</p>
                    <p className="text-lg font-bold text-primary">৳{dist.allocatedAmount.toLocaleString()}</p>
                  </div>

                  {/* Status */}
                  <div>
                    <p className="text-xs text-foreground/60 mb-1">Status</p>
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium border inline-flex items-center gap-1 ${getStatusBadge(dist.status).bg} ${getStatusBadge(dist.status).border} ${getStatusBadge(dist.status).text}`}
                    >
                      {dist.status === "completed" || dist.status === "verified" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {dist.status}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="text-right">
                    {dist.status === "in-progress" && (
                      <button className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded text-xs font-medium transition-colors flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        Upload Proof
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
