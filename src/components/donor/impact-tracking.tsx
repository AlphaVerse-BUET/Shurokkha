"use client"

import { useMemo } from "react"
import { mockBeneficiaries } from "@/store/mock-data"
import type { BeneficiaryAllocation } from "@/types"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface DonorImpactTrackingProps {
  allocations: BeneficiaryAllocation[]
}

export default function DonorImpactTracking({ allocations }: DonorImpactTrackingProps) {
  // Category breakdown
  const categoryBreakdown = useMemo(() => {
    const breakdown: Record<string, number> = {
      Shelter: 0,
      Food: 0,
      Medical: 0,
      Education: 0,
      Livelihood: 0,
    }

    allocations.forEach((alloc) => {
      const beneficiary = mockBeneficiaries.find((b) => b.id === alloc.beneficiaryId)
      if (beneficiary) {
        const category = beneficiary.needCategory.charAt(0).toUpperCase() + beneficiary.needCategory.slice(1)
        breakdown[category] = (breakdown[category] || 0) + alloc.allocatedAmount
      }
    })

    return Object.entries(breakdown)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }))
  }, [allocations])

  // Geographic distribution
  const geographicDistribution = useMemo(() => {
    const distribution: Record<string, number> = {}

    allocations.forEach((alloc) => {
      const beneficiary = mockBeneficiaries.find((b) => b.id === alloc.beneficiaryId)
      if (beneficiary) {
        const division = beneficiary.location.division
        distribution[division] = (distribution[division] || 0) + alloc.allocatedAmount
      }
    })

    return Object.entries(distribution)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8)
      .map(([name, value]) => ({ name, value }))
  }, [allocations])

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#06b6d4", "#f97316"]

  const totalImpact = useMemo(() => {
    return allocations.reduce((sum, a) => sum + a.allocatedAmount, 0)
  }, [allocations])

  return (
    <div className="space-y-6">
      {/* Total impact card */}
      <div className="bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/30 rounded-lg p-6 text-center">
        <p className="text-foreground/70 text-sm mb-2">Total Impact Created</p>
        <h2 className="text-4xl font-bold text-primary">৳{(totalImpact / 1000000).toFixed(2)}M</h2>
        <p className="text-foreground/60 text-sm mt-2">Distributed across {allocations.length} allocations</p>
      </div>

      {/* Category breakdown */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-card border border-border/50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Category Breakdown</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ৳${(value / 1000000).toFixed(1)}M`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryBreakdown.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: any) => `৳${(value / 1000000).toFixed(2)}M`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Geographic distribution */}
      {geographicDistribution.length > 0 && (
        <div className="bg-card border border-border/50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Geographic Distribution</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={geographicDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="name" stroke="var(--color-foreground-muted)" />
                <YAxis stroke="var(--color-foreground-muted)" />
                <Tooltip formatter={(value: any) => `৳${(value / 1000000).toFixed(2)}M`} />
                <Bar dataKey="value" fill="hsl(var(--color-primary))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Donation Timeline</h3>
        <div className="space-y-3">
          {allocations
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map((alloc) => {
              const beneficiary = mockBeneficiaries.find((b) => b.id === alloc.beneficiaryId)
              return (
                <div key={alloc.id} className="flex items-start gap-3 pb-3 border-b border-border/30 last:border-0">
                  <Avatar className="h-8 w-8 border-2 border-primary/20 flex-shrink-0">
                    <AvatarImage src={beneficiary?.profileImage || "/placeholder.svg"} alt={beneficiary?.fullName} />
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                      {beneficiary?.fullName?.charAt(0) || "B"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      ৳{alloc.allocatedAmount.toLocaleString()} allocated to {beneficiary?.fullName || "Beneficiary"}
                    </p>
                    <p className="text-xs text-foreground/60 mt-1">
                      {new Date(alloc.createdAt).toLocaleDateString()} - Status: {alloc.status}
                    </p>
                  </div>
                </div>
              )
            })}
        </div>
      </div>
    </div>
  )
}
