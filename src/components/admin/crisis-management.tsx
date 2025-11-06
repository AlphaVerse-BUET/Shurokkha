"use client"

import { mockCrises } from "@/store/mock-data"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const crisisByType = [
  { type: "flood", count: 2, funding: 8200000 },
  { type: "medical", count: 1, funding: 1500000 },
  { type: "education", count: 1, funding: 2000000 },
  { type: "poverty", count: 1, funding: 2500000 },
]

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"]

export default function AdminCrisisManagement() {
  const totalAffected = mockCrises.reduce((sum, c) => sum + c.affectedPopulation, 0)
  const totalFunding = mockCrises.reduce((sum, c) => sum + c.fundingNeeded, 0)
  const totalFunded = mockCrises.reduce((sum, c) => sum + c.fundingReceived, 0)
  const fundingGap = totalFunding - totalFunded

  return (
    <div className="space-y-6">
      {/* Summary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <p className="text-xs text-foreground/60 mb-1">Active Crises</p>
          <p className="text-3xl font-bold text-foreground">{mockCrises.length}</p>
        </div>
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <p className="text-xs text-foreground/60 mb-1">Total Affected</p>
          <p className="text-3xl font-bold text-red-600">{(totalAffected / 1000).toFixed(0)}K</p>
        </div>
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <p className="text-xs text-foreground/60 mb-1">Funding Gap</p>
          <p className="text-3xl font-bold text-orange-600">৳{(fundingGap / 1000000).toFixed(1)}M</p>
        </div>
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <p className="text-xs text-foreground/60 mb-1">Overall Funded</p>
          <p className="text-3xl font-bold text-green-600">{((totalFunded / totalFunding) * 100).toFixed(0)}%</p>
        </div>
      </div>

      {/* Crisis type distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border/50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Crises by Type</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={crisisByType}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="type" stroke="var(--color-foreground-muted)" />
                <YAxis stroke="var(--color-foreground-muted)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-background)", border: "1px solid var(--color-border)" }}
                />
                <Bar dataKey="count" fill="hsl(var(--color-primary))" name="Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Geographic Heatmap</h3>
          <div className="space-y-2">
            {[
              { division: "Sylhet", crises: 2, funding: 8200000 },
              { division: "Dhaka", crises: 1, funding: 1500000 },
              { division: "Rangpur", crises: 1, funding: 2000000 },
              { division: "Mymensingh", crises: 1, funding: 2500000 },
            ].map((div) => (
              <div key={div.division}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-foreground">{div.division}</span>
                  <span className="text-xs text-foreground/60">
                    {div.crises} crisis | ৳{(div.funding / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="w-full bg-border/30 rounded-full h-2">
                  <div
                    className="h-full rounded-full bg-red-600"
                    style={{ width: `${(div.funding / totalFunding) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Crisis details table */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Active Crises Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left py-3 px-3 font-semibold text-foreground">Crisis</th>
                <th className="text-left py-3 px-3 font-semibold text-foreground">Severity</th>
                <th className="text-left py-3 px-3 font-semibold text-foreground">Affected</th>
                <th className="text-left py-3 px-3 font-semibold text-foreground">Funding Progress</th>
                <th className="text-left py-3 px-3 font-semibold text-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockCrises.map((crisis) => (
                <tr key={crisis.id} className="border-b border-border/30 hover:bg-background/50 transition-colors">
                  <td className="py-3 px-3">
                    <p className="font-medium text-foreground">{crisis.title}</p>
                    <p className="text-xs text-foreground/60">{crisis.location.district}</p>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded ${
                        crisis.severity >= 80
                          ? "bg-red-500/20 text-red-700"
                          : crisis.severity >= 60
                            ? "bg-orange-500/20 text-orange-700"
                            : "bg-yellow-500/20 text-yellow-700"
                      }`}
                    >
                      {crisis.severity}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-foreground/70">{(crisis.affectedPopulation / 1000).toFixed(0)}K</td>
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-border/30 rounded-full h-2">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${(crisis.fundingReceived / crisis.fundingNeeded) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground">
                        {((crisis.fundingReceived / crisis.fundingNeeded) * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3">
                    <span className="text-xs font-medium px-2 py-1 bg-green-500/20 text-green-700 rounded capitalize">
                      {crisis.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
