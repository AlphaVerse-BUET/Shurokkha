"use client"

import { useAppStore } from "@/store/app-store"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { BarChart3, Eye, Users, TrendingUp } from "lucide-react"

export default function AnalyticsPage() {
  const router = useRouter()
  const { isAuthenticated, currentRole } = useAppStore()

  useEffect(() => {
    if (!isAuthenticated || currentRole !== "provider") {
      router.push("/auth/login?role=provider")
    }
  }, [isAuthenticated, currentRole, router])

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-background to-accent/5">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">View matching pool performance and donor browsing data</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 border-l-4 border-l-blue-500">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Eye className="w-4 h-4" />
              Profile Views
            </div>
            <div className="text-4xl font-bold text-blue-600">1,245</div>
            <div className="text-xs text-muted-foreground mt-2">+12% this week</div>
          </Card>

          <Card className="p-6 border-l-4 border-l-green-500">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Users className="w-4 h-4" />
              Matching Requests
            </div>
            <div className="text-4xl font-bold text-green-600">42</div>
            <div className="text-xs text-muted-foreground mt-2">Pending acceptance</div>
          </Card>

          <Card className="p-6 border-l-4 border-l-purple-500">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <TrendingUp className="w-4 h-4" />
              Acceptance Rate
            </div>
            <div className="text-4xl font-bold text-purple-600">87%</div>
            <div className="text-xs text-muted-foreground mt-2">Above average</div>
          </Card>

          <Card className="p-6 border-l-4 border-l-orange-500">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <BarChart3 className="w-4 h-4" />
              Browsing Time
            </div>
            <div className="text-4xl font-bold text-orange-600">4m 32s</div>
            <div className="text-xs text-muted-foreground mt-2">Avg per visit</div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">Top Crisis Categories</h2>
          <div className="space-y-3">
            {[
              { name: "Flood Relief", count: 485, percentage: 38 },
              { name: "Medical Aid", count: 320, percentage: 25 },
              { name: "Education", count: 240, percentage: 19 },
              { name: "Livelihood", count: 195, percentage: 15 },
              { name: "Food Security", count: 67, percentage: 5 },
            ].map((item) => (
              <div key={item.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground">{item.count} views</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full" style={{ width: `${item.percentage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </main>
  )
}
