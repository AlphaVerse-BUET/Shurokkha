"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { DollarSign, Percent } from "lucide-react"

interface AdminFinancialCenterProps {
  metrics: {
    totalDonated: number
    totalFees: number
    activeProviders: number
    totalBeneficiaries: number
    platformHealth: number
  }
}

const monthlyData = [
  { month: "Jan", donated: 1200000, distributed: 900000, fees: 30000 },
  { month: "Feb", donated: 1400000, distributed: 1050000, fees: 35000 },
  { month: "Mar", donated: 1800000, distributed: 1350000, fees: 45000 },
  { month: "Apr", donated: 2100000, distributed: 1575000, fees: 52500 },
  { month: "May", donated: 2500000, distributed: 1875000, fees: 62500 },
  { month: "Jun", donated: 3000000, distributed: 2250000, fees: 75000 },
]

const categoryData = [
  { name: "Shelter", value: 2500000, percentage: 35 },
  { name: "Medical", value: 1800000, percentage: 25 },
  { name: "Education", value: 1400000, percentage: 20 },
  { name: "Food", value: 1000000, percentage: 15 },
  { name: "Livelihood", value: 300000, percentage: 5 },
]

export default function AdminFinancialCenter({ metrics }: AdminFinancialCenterProps) {
  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card border border-border/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Fund Flow Status</h3>
            <DollarSign className="w-5 h-5 text-primary" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/70">Unallocated (Donor wallets):</span>
              <span className="font-medium text-foreground">
                ৳{((metrics.totalDonated * 0.1) / 1000000).toFixed(1)}M
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">Locked (In escrow):</span>
              <span className="font-medium text-foreground">
                ৳{((metrics.totalDonated * 0.6) / 1000000).toFixed(1)}M
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">Distributed (Verified):</span>
              <span className="font-medium text-green-600">
                ৳{((metrics.totalDonated * 0.3) / 1000000).toFixed(1)}M
              </span>
            </div>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-foreground">Revenue Metrics</h3>
            <Percent className="w-5 h-5 text-accent" />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-foreground/70">Platform Fees Collected:</span>
              <span className="font-medium text-foreground">৳{(metrics.totalFees / 1000000).toFixed(2)}M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">Fee Rate:</span>
              <span className="font-medium text-foreground">2.5%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-foreground/70">Monthly Average:</span>
              <span className="font-medium text-accent">৳{(metrics.totalFees / 6 / 100000).toFixed(1)}L</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-card border border-border/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Monthly Fund Flow Trends</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis dataKey="month" stroke="var(--color-foreground-muted)" />
              <YAxis stroke="var(--color-foreground-muted)" />
              <Tooltip
                formatter={(value: any) => `৳${(value / 1000000).toFixed(1)}M`}
                contentStyle={{ backgroundColor: "var(--color-background)", border: "1px solid var(--color-border)" }}
              />
              <Legend />
              <Line type="monotone" dataKey="donated" stroke="#10b981" name="Donated" strokeWidth={2} />
              <Line type="monotone" dataKey="distributed" stroke="#3b82f6" name="Distributed" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border/50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Funds by Category</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border/50 rounded-lg p-6">
          <h3 className="text-lg font-bold text-foreground mb-4">Category Breakdown</h3>
          <div className="space-y-2">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }} />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-foreground">{cat.name}</span>
                    <span className="text-xs text-foreground/60">৳{(cat.value / 1000000).toFixed(1)}M</span>
                  </div>
                  <div className="w-full bg-border/30 rounded-full h-2">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${cat.percentage}%`, backgroundColor: COLORS[idx] }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Daily/Weekly stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <p className="text-xs text-foreground/60 mb-2">Average Daily Donation</p>
          <p className="text-2xl font-bold text-primary">৳{(metrics.totalDonated / 180 / 100000).toFixed(1)}L</p>
        </div>
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <p className="text-xs text-foreground/60 mb-2">Distribution Speed</p>
          <p className="text-2xl font-bold text-accent">5-7 days avg</p>
        </div>
        <div className="bg-card border border-border/50 rounded-lg p-4">
          <p className="text-xs text-foreground/60 mb-2">Utilization Rate</p>
          <p className="text-2xl font-bold text-green-600">85%</p>
        </div>
      </div>
    </div>
  )
}
