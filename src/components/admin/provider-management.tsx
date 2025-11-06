"use client"

import { mockProviders } from "@/store/mock-data"
import { AlertCircle } from "lucide-react"

export default function AdminProviderManagement() {
  return (
    <div className="space-y-6">
      {/* Summary stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <p className="text-xs text-foreground/60 mb-1">Total Providers</p>
          <p className="text-3xl font-bold text-foreground">{mockProviders.length}</p>
        </div>
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <p className="text-xs text-foreground/60 mb-1">Active</p>
          <p className="text-3xl font-bold text-green-600">
            {mockProviders.filter((p) => p.status === "active").length}
          </p>
        </div>
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <p className="text-xs text-foreground/60 mb-1">Watchlist</p>
          <p className="text-3xl font-bold text-orange-600">
            {mockProviders.filter((p) => p.status === "watchlist").length}
          </p>
        </div>
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <p className="text-xs text-foreground/60 mb-1">Avg Trust Score</p>
          <p className="text-3xl font-bold text-blue-600">
            {Math.round(mockProviders.reduce((sum, p) => sum + p.trustScore, 0) / mockProviders.length)}
          </p>
        </div>
      </div>

      {/* Provider performance table */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Provider Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-3 font-semibold text-foreground">Organization</th>
                <th className="text-left py-3 px-3 font-semibold text-foreground">Trust Score</th>
                <th className="text-left py-3 px-3 font-semibold text-foreground">Completion Rate</th>
                <th className="text-left py-3 px-3 font-semibold text-foreground">Response Time</th>
                <th className="text-left py-3 px-3 font-semibold text-foreground">Beneficiaries</th>
                <th className="text-left py-3 px-3 font-semibold text-foreground">Status</th>
                <th className="text-left py-3 px-3 font-semibold text-foreground">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockProviders.map((provider) => (
                <tr key={provider.id} className="border-b border-border/30 hover:bg-background/50 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-medium text-foreground">{provider.organizationName}</p>
                    <p className="text-xs text-foreground/60">{provider.registrationType}</p>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-primary">{provider.trustScore}</span>
                      <span className="text-xs text-foreground/60">/100</span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-medium text-foreground">{provider.completionRate}%</span>
                  </td>
                  <td className="py-3 px-3 text-foreground/70">{provider.responseTimeHours}h</td>
                  <td className="py-3 px-3 text-foreground/70">{provider.totalAidedBeneficiaries}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded capitalize ${
                        provider.status === "active"
                          ? "bg-green-500/20 text-green-700"
                          : provider.status === "watchlist"
                            ? "bg-orange-500/20 text-orange-700"
                            : "bg-red-500/20 text-red-700"
                      }`}
                    >
                      {provider.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <button className="text-xs px-2 py-1 bg-primary/10 hover:bg-primary/20 text-primary rounded transition-colors">
                      Review
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Performance alerts */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-orange-600" />
          Performance Alerts
        </h3>
        <div className="space-y-2">
          <div className="border-l-4 border-orange-500/50 bg-orange-500/10 rounded p-3 text-sm">
            <p className="font-medium text-foreground">Sylhet Volunteer Group - Trust Score Declining</p>
            <p className="text-xs text-foreground/70 mt-1">
              Score dropped from 48 to 42. Follow-up training recommended.
            </p>
          </div>
          <div className="border-l-4 border-red-500/50 bg-red-500/10 rounded p-3 text-sm">
            <p className="font-medium text-foreground">Coastal Relief Organization - Slow Response</p>
            <p className="text-xs text-foreground/70 mt-1">Average response time increased to 18h. Monitor closely.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
