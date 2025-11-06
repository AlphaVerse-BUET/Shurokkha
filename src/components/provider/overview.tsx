"use client"

import { Star, TrendingUp, Clock, Users, Award, AlertCircle } from "lucide-react"
import type { Provider } from "@/types"

interface ProviderOverviewProps {
  provider: Provider
  metrics: {
    trustScore: number
    completionRate: number
    averageRating: number
    responseTimeHours: number
    totalAidedBeneficiaries: number
    availableMatchingPool: number
    activeBeneficiaries: number
  }
}

export default function ProviderOverview({ provider, metrics }: ProviderOverviewProps) {
  return (
    <div className="space-y-6">
      {/* Trust Score Card */}
      <div className="bg-gradient-to-br from-secondary/20 via-background to-secondary/5 border border-secondary/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-foreground/70">Trust Score</p>
            <h2 className="text-5xl font-bold text-secondary">{metrics.trustScore}/100</h2>
          </div>
          <Award className="w-20 h-20 text-secondary/30" />
        </div>

        <div className="grid grid-cols-4 gap-4 text-center text-sm">
          <div>
            <div className="text-lg font-bold text-foreground">{metrics.completionRate}%</div>
            <p className="text-foreground/60">Completion Rate</p>
          </div>
          <div>
            <div className="text-lg font-bold text-yellow-500 flex items-center justify-center gap-1">
              {metrics.averageRating}
              <Star className="w-4 h-4 fill-yellow-500" />
            </div>
            <p className="text-foreground/60">Avg Rating</p>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-500">{metrics.responseTimeHours}h</div>
            <p className="text-foreground/60">Response Time</p>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">{metrics.totalAidedBeneficiaries}</div>
            <p className="text-foreground/60">Beneficiaries</p>
          </div>
        </div>
      </div>

      {/* Performance metrics grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground/60 uppercase">Available Matching</span>
            <TrendingUp className="w-4 h-4 text-primary" />
          </div>
          <div className="text-3xl font-bold text-foreground">
            ৳{(metrics.availableMatchingPool / 1000000).toFixed(2)}M
          </div>
          <p className="text-xs text-foreground/60 mt-2">Donor funds ready to allocate</p>
        </div>

        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground/60 uppercase">Active Beneficiaries</span>
            <Users className="w-4 h-4 text-accent" />
          </div>
          <div className="text-3xl font-bold text-foreground">{metrics.activeBeneficiaries}</div>
          <p className="text-xs text-foreground/60 mt-2">In-progress distributions</p>
        </div>

        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground/60 uppercase">Monthly Capacity</span>
            <AlertCircle className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-3xl font-bold text-foreground">৳{(provider.monthlyFundCap / 1000000).toFixed(1)}M</div>
          <p className="text-xs text-foreground/60 mt-2">Current month allocation</p>
        </div>

        <div className="bg-card border border-border/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-foreground/60 uppercase">Years Active</span>
            <Clock className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-3xl font-bold text-foreground">{provider.yearsActive}</div>
          <p className="text-xs text-foreground/60 mt-2">On platform since {provider.createdAt}</p>
        </div>
      </div>

      {/* Badges section */}
      {provider.badges.length > 0 && (
        <div className="bg-card border border-border/50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Organization Badges</h3>
          <div className="flex flex-wrap gap-3">
            {provider.badges.map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2"
              >
                <Award className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary capitalize">{badge.replace("-", " ")}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="bg-card border border-border/50 rounded-lg p-4">
        <h3 className="font-semibold text-foreground mb-3">Quick Actions</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <button className="flex-1 px-4 py-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground rounded-lg font-medium transition-colors">
            View Donor Preferences
          </button>
          <button className="flex-1 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors">
            Browse Matching Opportunities
          </button>
          <button className="flex-1 px-4 py-2 bg-accent hover:bg-accent/90 text-accent-foreground rounded-lg font-medium transition-colors">
            View Performance Report
          </button>
        </div>
      </div>
    </div>
  )
}
