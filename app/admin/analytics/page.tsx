"use client"

import { useRouter } from "next/navigation"
import { useAppStore } from "@/store/app-store"
import { useCurrency } from "@/contexts/currency-context"
import { Card } from "@/components/ui/card"
import { mockDonations, mockCrises, mockProviders, mockBeneficiaries } from "@/store/mock-data"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, Users, DollarSign, Activity } from "lucide-react"

const monthlyGrowth = [
  { month: "Jan", donors: 120, providers: 8, beneficiaries: 450 },
  { month: "Feb", donors: 180, providers: 12, beneficiaries: 680 },
  { month: "Mar", donors: 250, providers: 15, beneficiaries: 920 },
  { month: "Apr", donors: 340, providers: 18, beneficiaries: 1200 },
  { month: "May", donors: 480, providers: 22, beneficiaries: 1650 },
  { month: "Jun", donors: 650, providers: 25, beneficiaries: 2100 },
]

const crisisTypeDistribution = [
  { type: "Flood", count: 2, color: "#3b82f6" },
  { type: "Medical", count: 1, color: "#10b981" },
  { type: "Education", count: 1, color: "#f59e0b" },
  { type: "Poverty", count: 1, color: "#ef4444" },
]

const providerPerformance = [
  { name: "Red Crescent", trustScore: 92, distributions: 45, completionRate: 98 },
  { name: "BRAC", trustScore: 88, distributions: 38, completionRate: 95 },
  { name: "Grameen", trustScore: 85, distributions: 32, completionRate: 92 },
  { name: "ASA", trustScore: 82, distributions: 28, completionRate: 90 },
]

export default function AnalyticsPage() {
  const router = useRouter()
  const { isAuthenticated, currentRole } = useAppStore()
  const { formatAbbreviated } = useCurrency()

  if (!isAuthenticated || currentRole !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">Only admins can view analytics</p>
          <button
            onClick={() => router.push("/auth/login?role=admin")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Login as Admin
          </button>
        </Card>
      </div>
    )
  }

  const totalDonated = mockDonations.reduce((sum, d) => sum + d.amount, 0)
  const totalBeneficiaries = mockBeneficiaries.length
  const activeProviders = mockProviders.filter((p) => p.status === "active").length
  const activeCrises = mockCrises.filter((c) => c.status === "active").length

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-background to-blue-900/5">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Platform Analytics</h1>
          <p className="text-muted-foreground">Comprehensive insights into platform performance and impact</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-l-4 border-l-primary">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <DollarSign className="w-4 h-4" />
              Total Donations
            </div>
            <div className="text-3xl font-bold text-primary">{formatAbbreviated(totalDonated)}</div>
            <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +35% from last month
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-green-500">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Users className="w-4 h-4" />
              Beneficiaries Helped
            </div>
            <div className="text-3xl font-bold text-green-600">{totalBeneficiaries.toLocaleString()}</div>
            <div className="text-xs text-green-600 mt-2 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +28% from last month
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Activity className="w-4 h-4" />
              Active Providers
            </div>
            <div className="text-3xl font-bold text-blue-600">{activeProviders}</div>
            <div className="text-xs text-blue-600 mt-2">All verified</div>
          </Card>

          <Card className="p-6 border-l-4 border-l-orange-500">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Activity className="w-4 h-4" />
              Active Crises
            </div>
            <div className="text-3xl font-bold text-orange-600">{activeCrises}</div>
            <div className="text-xs text-orange-600 mt-2">Needs attention</div>
          </Card>
        </div>

        {/* Growth Trends */}
        <Card className="p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">Platform Growth Trends</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-foreground-muted)" />
                <YAxis stroke="var(--color-foreground-muted)" />
                <Tooltip
                  contentStyle={{ backgroundColor: "var(--color-background)", border: "1px solid var(--color-border)" }}
                />
                <Legend />
                <Line type="monotone" dataKey="donors" stroke="#10b981" name="Donors" strokeWidth={2} />
                <Line type="monotone" dataKey="providers" stroke="#3b82f6" name="Providers" strokeWidth={2} />
                <Line type="monotone" dataKey="beneficiaries" stroke="#f59e0b" name="Beneficiaries" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Crisis Distribution & Provider Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Crisis Type Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={crisisTypeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, count }) => `${type}: ${count}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {crisisTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-6">Top Provider Performance</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={providerPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-foreground-muted)" />
                  <YAxis stroke="var(--color-foreground-muted)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--color-background)",
                      border: "1px solid var(--color-border)",
                    }}
                  />
                  <Legend />
                  <Bar dataKey="trustScore" fill="#10b981" name="Trust Score" />
                  <Bar dataKey="completionRate" fill="#3b82f6" name="Completion Rate" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <h3 className="font-bold mb-4">Donation Velocity</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Average per day:</span>
                <span className="font-medium">{formatAbbreviated(totalDonated / 180)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Peak day:</span>
                <span className="font-medium">{formatAbbreviated(250000)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Growth rate:</span>
                <span className="font-medium text-green-600">+42%</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">Distribution Efficiency</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg time to distribute:</span>
                <span className="font-medium">5.2 days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Success rate:</span>
                <span className="font-medium text-green-600">94%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fraud incidents:</span>
                <span className="font-medium text-red-600">0.3%</span>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-bold mb-4">User Engagement</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active donors:</span>
                <span className="font-medium">650</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Repeat donors:</span>
                <span className="font-medium">68%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg donation:</span>
                <span className="font-medium">{formatAbbreviated(totalDonated / 650)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
