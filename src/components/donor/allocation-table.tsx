"use client"

import { mockCrises, mockBeneficiaries, mockProviders } from "@/store/mock-data"
import type { BeneficiaryAllocation } from "@/types"
import { ChevronRight, CheckCircle, Clock, AlertCircle } from "lucide-react"

interface DonorAllocationTableProps {
  allocations: BeneficiaryAllocation[]
}

export default function DonorAllocationTable({ allocations }: DonorAllocationTableProps) {
  const getStatusColor = (status: string) => {
    if (status === "completed") return "bg-green-500/20 text-green-700 border-green-500/30"
    if (status === "verified") return "bg-green-500/20 text-green-700 border-green-500/30"
    if (status === "in-progress") return "bg-blue-500/20 text-blue-700 border-blue-500/30"
    if (status === "provider-accepted") return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30"
    return "bg-gray-500/20 text-gray-700 border-gray-500/30"
  }

  const getStatusIcon = (status: string) => {
    if (status === "completed" || status === "verified") return <CheckCircle className="w-4 h-4" />
    if (status === "in-progress") return <Clock className="w-4 h-4" />
    return <AlertCircle className="w-4 h-4" />
  }

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border/50 rounded-lg p-4">
        <h2 className="text-lg font-bold text-foreground mb-4">Active Allocations</h2>

        {allocations.length === 0 ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-foreground/20 mx-auto mb-3" />
            <p className="text-foreground/60">No allocations yet. Start donating to see them here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {allocations.map((allocation) => {
              const beneficiary = mockBeneficiaries.find((b) => b.id === allocation.beneficiaryId)
              const provider = mockProviders.find((p) => p.id === allocation.providerId)
              const crisis = mockCrises.find((c) => c.id === beneficiary?.location.division)

              return (
                <div
                  key={allocation.id}
                  className="border border-border/50 rounded-lg p-4 hover:bg-card/50 transition-colors cursor-pointer"
                >
                  <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
                    {/* Beneficiary info */}
                    <div className="md:col-span-2">
                      <p className="text-xs text-foreground/60 mb-1">Beneficiary</p>
                      <p className="font-medium text-foreground">{beneficiary?.fullName || "Beneficiary"}</p>
                      <p className="text-xs text-foreground/60">
                        {beneficiary?.location.district}, {beneficiary?.location.division}
                      </p>
                    </div>

                    {/* Provider info */}
                    <div>
                      <p className="text-xs text-foreground/60 mb-1">Provider</p>
                      <p className="font-medium text-foreground text-sm">{provider?.organizationName}</p>
                      <p className="text-xs text-accent">Score: {provider?.trustScore}/100</p>
                    </div>

                    {/* Amount */}
                    <div>
                      <p className="text-xs text-foreground/60 mb-1">Amount</p>
                      <p className="font-bold text-primary">৳{allocation.allocatedAmount.toLocaleString()}</p>
                    </div>

                    {/* Status */}
                    <div>
                      <p className="text-xs text-foreground/60 mb-1">Status</p>
                      <div
                        className={`px-2 py-1 rounded text-xs font-semibold border flex items-center gap-1 w-fit ${getStatusColor(allocation.status)}`}
                      >
                        {getStatusIcon(allocation.status)}
                        <span className="capitalize">{allocation.status.replace("-", " ")}</span>
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
              )
            })}
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-yellow-500/30 border border-yellow-500/50 rounded" />
          <span className="text-foreground/60">Provider Accepted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500/30 border border-blue-500/50 rounded" />
          <span className="text-foreground/60">In Progress</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-green-500/30 border border-green-500/50 rounded" />
          <span className="text-foreground/60">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-purple-500/30 border border-purple-500/50 rounded" />
          <span className="text-foreground/60">Verified</span>
        </div>
      </div>
    </div>
  )
}
