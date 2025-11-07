"use client"

import { useAppStore } from "@/store/app-store"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function ImpactMapPage() {
  const router = useRouter()
  const { isAuthenticated, currentRole } = useAppStore()

  useEffect(() => {
    if (!isAuthenticated || currentRole !== "donor") {
      router.push("/auth/login?role=donor")
    }
  }, [isAuthenticated, currentRole, router])

  return (
    <main className="min-h-screen bg-linear-to-b from-background via-background to-accent/5">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Impact Map</h1>
          <p className="text-muted-foreground">Geographic visualization of your donations across Bangladesh</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6 aspect-video bg-linear-to-br from-primary/5 via-secondary/5 to-accent/5 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="text-6xl">🗺️</div>
                <h3 className="text-xl font-bold">Bangladesh Impact Heatmap</h3>
                <p className="text-muted-foreground text-sm">
                  Shows where your donations have made an impact across the country
                </p>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-6">
              <h3 className="font-bold mb-4">Impact Summary</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-primary">৳40,000</div>
                  <div className="text-sm text-muted-foreground">Total Donated</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent">6</div>
                  <div className="text-sm text-muted-foreground">Divisions Helped</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-secondary">42</div>
                  <div className="text-sm text-muted-foreground">Beneficiaries Reached</div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-bold mb-4">Top Crises</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Sylhet Flooding</span>
                  <span className="font-semibold">৳25,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Cyclone Recovery</span>
                  <span className="font-semibold">৳15,000</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
