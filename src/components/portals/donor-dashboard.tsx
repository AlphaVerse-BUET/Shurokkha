"use client"

import { useState, useMemo } from "react"
import { useAppStore } from "@/store/app-store"
import { mockDonations } from "@/store/mock-data"
import DonorFinancialDashboard from "@/components/donor/financial-dashboard"
import DonorAllocationTable from "@/components/donor/allocation-table"
import DonorImpactTracking from "@/components/donor/impact-tracking"
import DonorFundRecovery from "@/components/donor/fund-recovery"
import DonorGamification from "@/components/donor/gamification"
import { Wallet, TrendingUp, History, Settings, Sparkles, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function DonorDashboard() {
  const { currentUser } = useAppStore()
  const [activeTab, setActiveTab] = useState<"overview" | "allocations" | "impact" | "recovery" | "profile">("overview")
  const router = useRouter()

  // Get donor-specific data
  const donorAllocations = useMemo(() => {
    const donor = mockDonations.find((d) => d.donorId === currentUser?.id) || mockDonations[0]
    return donor.allocations || []
  }, [currentUser?.id])

  // Calculate wallet metrics
  const walletMetrics = useMemo(() => {
    const donations = mockDonations.filter((d) => d.donorId === currentUser?.id)
    const totalDonated = donations.reduce((sum, d) => sum + d.amount, 0)
    const totalAllocated = donations.reduce(
      (sum, d) => sum + d.allocations.reduce((aSum, a) => aSum + a.allocatedAmount, 0),
      0,
    )
    const totalFees = donations.reduce((sum, d) => sum + d.transactionFee, 0)
    const available = totalDonated - totalAllocated - totalFees

    return {
      totalDonated,
      allocated: totalAllocated,
      available,
      fees: totalFees,
    }
  }, [currentUser?.id])

  // Calculate impact summary
  const impactSummary = useMemo(() => {
    const beneficiariesHelped = new Set(donorAllocations.map((a) => a.beneficiaryId)).size
    const allocationsCompleted = donorAllocations.filter((a) => a.status === "completed").length
    const completionRate = donorAllocations.length > 0 ? (allocationsCompleted / donorAllocations.length) * 100 : 0

    return {
      beneficiariesHelped,
      allocationsCompleted,
      completionRate,
      totalAllocations: donorAllocations.length,
    }
  }, [donorAllocations])

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-accent/5">
      {/* Header */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                Donor Dashboard
                <Badge variant="secondary" className="text-xs">
                  <Sparkles className="w-3 h-3 mr-1" />
                  AI-Powered
                </Badge>
              </h1>
              <p className="text-sm text-foreground/60 mt-1">Welcome back, {currentUser?.name}</p>
            </div>
            {/* Profile button */}
            <Button onClick={() => router.push("/donor/profile")} variant="outline" className="gap-2">
              <User className="w-4 h-4" />
              My Profile
            </Button>
          </div>

          {/* Tab navigation */}
          <div className="flex gap-2 overflow-x-auto pb-4">
            {[
              { id: "overview", label: "Overview", icon: Wallet },
              { id: "allocations", label: "Allocations", icon: History },
              { id: "impact", label: "Impact", icon: TrendingUp },
              { id: "recovery", label: "Fund Recovery", icon: Settings },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  activeTab === id
                    ? "bg-primary text-primary-foreground"
                    : "bg-card border border-border/50 text-foreground/70 hover:border-primary/50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            <DonorFinancialDashboard metrics={walletMetrics} impactSummary={impactSummary} />
            <DonorGamification donorId={currentUser?.id || ""} />
          </div>
        )}

        {/* Allocations Tab */}
        {activeTab === "allocations" && <DonorAllocationTable allocations={donorAllocations} />}

        {/* Impact Tab */}
        {activeTab === "impact" && <DonorImpactTracking allocations={donorAllocations} />}

        {/* Fund Recovery Tab */}
        {activeTab === "recovery" && <DonorFundRecovery metrics={walletMetrics} />}
      </div>
    </div>
  )
}
