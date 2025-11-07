"use client"

import { Wallet, TrendingUp, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import Link from "next/link"
import { useCurrency } from "@/contexts/currency-context"

interface FinancialMetrics {
  totalDonated: number
  allocated: number
  available: number
  fees: number
}

interface ImpactSummary {
  beneficiariesHelped: number
  allocationsCompleted: number
  completionRate: number
  totalAllocations: number
}

interface DonorFinancialDashboardProps {
  metrics: FinancialMetrics
  impactSummary: ImpactSummary
}

export default function DonorFinancialDashboard({ metrics, impactSummary }: DonorFinancialDashboardProps) {
  const { formatAbbreviated } = useCurrency()

  return (
    <div className="space-y-6">
      {/* Wallet Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Donated */}
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground/60 uppercase">Total Donated</span>
            <Wallet className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">{formatAbbreviated(metrics.totalDonated)}</div>
          <p className="text-xs text-foreground/60 mt-2">Across all crises</p>
        </div>

        {/* Allocated */}
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground/60 uppercase">Allocated</span>
            <ArrowDownLeft className="w-4 h-4 text-accent" />
          </div>
          <div className="text-3xl font-bold text-foreground">{formatAbbreviated(metrics.allocated)}</div>
          <p className="text-xs text-foreground/60 mt-2">In active distributions</p>
        </div>

        {/* Available */}
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground/60 uppercase">Available</span>
            <ArrowUpRight className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-foreground">{formatAbbreviated(metrics.available)}</div>
          <p className="text-xs text-foreground/60 mt-2">Ready to allocate or withdraw</p>
        </div>

        {/* Platform Fees */}
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground/60 uppercase">Fees Paid</span>
            <TrendingUp className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-foreground">{formatAbbreviated(metrics.fees)}</div>
          <p className="text-xs text-foreground/60 mt-2">2.5% platform fee</p>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="bg-linear-to-br from-primary/10 via-background to-accent/5 border border-primary/30 rounded-lg p-6">
        <h2 className="text-lg font-bold text-foreground mb-4">Impact Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">{impactSummary.beneficiariesHelped}</div>
            <p className="text-sm text-foreground/70 mt-2">Beneficiaries Reached</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-accent">{impactSummary.allocationsCompleted}</div>
            <p className="text-sm text-foreground/70 mt-2">Completed Allocations</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600">{impactSummary.completionRate.toFixed(0)}%</div>
            <p className="text-sm text-foreground/70 mt-2">Completion Rate</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600">{impactSummary.totalAllocations}</div>
            <p className="text-sm text-foreground/70 mt-2">Total Allocations</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-card border border-border/50 rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/donate/new" className="flex-1">
            <button className="w-full px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors">
              Make New Donation
            </button>
          </Link>
          <Link href="/donor/impact-map" className="flex-1">
            <button className="w-full px-4 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg font-medium transition-colors">
              View Impact Map
            </button>
          </Link>
          <Link href="/donor/receipt" className="flex-1">
            <button className="w-full px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg font-medium transition-colors">
              Download Receipts
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
